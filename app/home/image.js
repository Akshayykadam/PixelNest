import { View, Text, StyleSheet, Platform, ActivityIndicator, Pressable, Alert } from 'react-native'
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { hp, wp } from '../../helpers/common'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image } from 'expo-image'
import { theme } from '../../constants/theme'
import { Entypo, Octicons, Feather } from '@expo/vector-icons'
import Animated, { FadeInDown } from 'react-native-reanimated'
import * as FileSystem from 'expo-file-system';

import { BlurView } from 'expo-blur';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { storeLikedImage, removeLikedImage, isImageLiked } from '../../helpers/storage';

const ImageScreen = () => {
    const [status, setStatus] = useState('loading');
    const [isLiked, setIsLiked] = useState(false);
    const router = useRouter();
    const item = useLocalSearchParams();

    // Bottom Sheet Refs
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    useEffect(() => {
        // Check if image is liked
        const checkLikeStatus = async () => {
            let liked = await isImageLiked(item?.id);
            setIsLiked(liked);
        }
        checkLikeStatus();
    }, [item]);

    const toggleLike = async () => {
        // Toggle state optimistically
        const newState = !isLiked;
        setIsLiked(newState);

        if (newState) {
            // Ensure we store correct types
            const likedItem = {
                ...item,
                imageWidth: parseFloat(item?.imageWidth),
                imageHeight: parseFloat(item?.imageHeight),
                downloads: parseFloat(item?.downloads),
                imageSize: parseFloat(item?.imageSize),
                webformatURL: item?.webformatURL, // Ensure URL is preserved
            };
            await storeLikedImage(likedItem);
        } else {
            await removeLikedImage(item?.id);
        }
    }


    // Image Logic
    let uri = item?.webformatURL;
    let downloadUri = item?.imageURL || item?.fullHDURL || item?.largeImageURL || item?.webformatURL;
    const fileName = item?.previewURL?.split('/').pop();
    const imageUrl = downloadUri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`

    const onLoad = () => setStatus('');

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);


    const getSize = () => {
        const aspectRatio = item?.imageWidth / item?.imageHeight;
        const maxWidth = wp(92); // Slightly wider, but with padding
        let calculatedHeight = maxWidth / aspectRatio;
        let calculatedWidth = maxWidth;

        if (aspectRatio < 1) calculatedWidth = calculatedHeight * aspectRatio;

        if (calculatedHeight > hp(80)) {
            calculatedHeight = hp(80);
            calculatedWidth = calculatedHeight * aspectRatio;
        }
        return { width: calculatedWidth, height: calculatedHeight };
    }

    const handleDownloadImage = async () => {
        if (Platform.OS === 'web') {
            const anchor = document.createElement('a');
            anchor.href = imageUrl;
            anchor.target = '_blank';
            anchor.download = fileName || 'download';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        } else {
            setStatus('downloading');
            let uri = await downloadFile();
        }
    };

    const downloadFile = async () => {
        try {
            const { uri } = await FileSystem.downloadAsync(imageUrl, filePath)
            setStatus('');
            return (uri);
        } catch (error) {
            setStatus('');
            Alert.alert('image', error.message);
            return null;
        }
    }



    // Render Backdrop for Bottom Sheet
    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );


    return (
        <BlurView style={styles.container} tint='dark' intensity={60}>

            {/* Top Bar */}
            <View style={styles.topBar}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Octicons name="chevron-left" size={24} color={theme.colors.placeholder} />
                </Pressable>
            </View>

            {/* Main Image Area */}
            <View style={[styles.imageWrapper, getSize()]}>
                <View style={styles.loading}>
                    {status == 'loading' && <ActivityIndicator size="large" color="white" />}
                </View>
                <Image
                    transition={100}
                    style={[styles.image, getSize()]}
                    source={uri}
                    onLoad={onLoad}
                />
            </View>

            {/* Floating Action Buttons */}
            <View style={styles.actionButtons}>
                <Animated.View entering={FadeInDown.delay(100).springify()} style={{ flex: 1, marginRight: 15 }}>
                    <Pressable style={styles.downloadPill} onPress={handleDownloadImage}>
                        {status === 'downloading' ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.downloadText}>DOWNLOAD</Text>
                        )}
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <Pressable style={styles.heartButton} onPress={toggleLike}>
                        <Octicons name="heart" size={22} color={isLiked ? theme.colors.rose : theme.colors.placeholder} />
                    </Pressable>
                </Animated.View>
            </View>




            {/* Bottom Sheet Details */}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: theme.colors.card }}
                handleIndicatorStyle={{ backgroundColor: 'white' }}
            >
                <BottomSheetView style={styles.sheetContent}>
                    <Text style={styles.sheetTitle}>Details</Text>
                    <View style={styles.detailRow}>
                        <View>
                            <Text style={styles.detailLabel}>Size</Text>
                            <Text style={styles.detailValue}>{item?.imageSize ? (item.imageSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}</Text>
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Downloads</Text>
                            <Text style={styles.detailValue}>{item?.downloads}</Text>
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>User</Text>
                            <Text style={styles.detailValue}>{item?.user}</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.detailLabel}>Tags</Text>
                        <Text style={styles.detailValue}>{item?.tags}</Text>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>

        </BlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: wp(4)
    },
    topBar: {
        position: 'absolute',
        top: hp(6),
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(5),
        zIndex: 10
    },
    backButton: {
        padding: 5,
        backgroundColor: theme.colors.neutral(0.1),
        borderRadius: theme.radius.sm,
    },
    imageWrapper: {
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginTop: hp(15) // Adjust to sit below header
    },
    image: {
        borderRadius: theme.radius.xl,
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButtons: {
        position: 'absolute',
        bottom: hp(5),
        left: wp(6),
        right: wp(6),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    downloadPill: {
        backgroundColor: theme.colors.neutral(0.1),
        borderRadius: theme.radius.xl,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    downloadText: {
        color: theme.colors.placeholder,
        fontWeight: theme.fontWeights.medium,
        fontSize: hp(1.6),
    },
    heartButton: {
        width: hp(4.5),
        height: hp(4.5),
        backgroundColor: theme.colors.neutral(0.1),
        borderRadius: theme.radius.xs * 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    sheetContent: {
        flex: 1,
        padding: 24,
    },
    sheetTitle: {
        fontSize: hp(3),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20
    },
    detailLabel: {
        color: theme.colors.neutral(0.5),
        fontSize: hp(1.8),
        marginBottom: 5
    },
    detailValue: {
        color: 'white',
        fontSize: hp(2),
        fontWeight: 'bold',
        textTransform: 'capitalize'
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'flex-start',
        marginLeft: wp(2)
    },
    avatar: {
        height: hp(4),
        width: hp(4),
        borderRadius: theme.radius.xl,
        borderWidth: 1,
        borderColor: theme.colors.neutral(0.1),
        marginRight: 10,
        backgroundColor: theme.colors.neutral(0.1)
    },
    authorName: {
        color: theme.colors.white,
        fontSize: hp(2),
        fontWeight: theme.fontWeights.medium,
    }

})

export default ImageScreen