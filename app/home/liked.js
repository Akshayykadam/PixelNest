import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/common'
import { Octicons } from '@expo/vector-icons'
import ImageGrid from '../../components/imageGrid'
import { getLikedImages } from '../../helpers/storage'
import { BlurView } from 'expo-blur'
import { SafeAreaView } from 'react-native-safe-area-context'

const LikedScreen = () => {
    const router = useRouter();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLikedImages = async () => {
        setLoading(true);
        let res = await getLikedImages();
        // Reverse to show latest likes first
        setImages([...res].reverse());
        setLoading(false);
    }

    useFocusEffect(
        useCallback(() => {
            fetchLikedImages();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Octicons name="chevron-left" size={24} color={theme.colors.placeholder} />
                </Pressable>
                <Text style={styles.title}>Liked Pictures</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                {
                    loading ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="large" color={theme.colors.white} />
                        </View>
                    ) : images.length > 0 ? (
                        <ImageGrid images={images} router={router} />
                    ) : (
                        <View style={styles.center}>
                            <Text style={styles.noDataText}>No liked pictures yet!</Text>
                        </View>
                    )
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.grayBG,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        paddingVertical: 15,
    },
    backButton: {
        padding: 5,
        backgroundColor: theme.colors.neutral(0.1),
        borderRadius: theme.radius.sm,
    },
    title: {
        fontSize: hp(2.2),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.placeholder
    },
    placeholder: {
        width: 40
    },
    content: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noDataText: {
        fontSize: hp(2),
        color: theme.colors.neutral(0.6),
        fontWeight: theme.fontWeights.medium
    }
})

export default LikedScreen
