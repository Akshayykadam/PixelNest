import { View, StyleSheet, Text, Pressable } from 'react-native'
import React, { useMemo } from 'react'
import { BlurView } from 'expo-blur';
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { capitalize, hp } from '../helpers/common';
import { theme } from '../constants/theme';
import { ColourFilterView, CommonView, OrderView, SectionView } from './filterView';
import { data } from '../constants/data';


const FiltersModel = ({
    modelRef,
    onClose,
    onApply,
    onReset,
    setFilters,
    filters }) => {
    const snapPoints = useMemo(() => ['85%'], []);

    return (
        <BottomSheetModal
            ref={modelRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={CustomBackdop}
        //onChange={handleSheetChanges}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.filterText}>Filters</Text>
                    {
                        Object.keys(sections).map((sectionName, index) => {
                            let sectionView = sections[sectionName];
                            let sectionData = data.filters[sectionName]
                            let title = capitalize(sectionName);
                            return (
                                <Animated.View
                                    entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
                                    key={sectionName}>
                                    <SectionView
                                        title={title}
                                        content={sectionView({
                                            data: sectionData,
                                            filters,
                                            setFilters,
                                            filterName: sectionName

                                        })}
                                    />
                                </Animated.View>
                            )
                        })
                    }

                    { /* actions */}
                    <Animated.View
                        entering={FadeInDown.delay(500).springify().damping(11)}
                        style={styles.buttons}>
                        <Pressable style={styles.resetButton} onPress={onReset}>
                            <Text style={[styles.buttonText, { color: theme.colors.black }]}>Reset</Text>
                        </Pressable>
                        <Pressable style={styles.applyButton} onPress={onApply}>
                            <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
                        </Pressable>
                    </Animated.View >

                </View>
            </BottomSheetView>
        </BottomSheetModal>
    )
}

const sections = {
    "order": (props) => <CommonView {...props} />,
    "orientation": (props) => <CommonView {...props} />,
    "type": (props) => <CommonView {...props} />,
    "colors": (props) => <ColourFilterView {...props} />,
}

const CustomBackdop = ({ animatedIndex, style }) => {

    const containerAnimatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 1],
            Extrapolation.CLAMP
        );
        return {
            opacity
        };
    });


    const containerstyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
        containerAnimatedStyle
    ]
    return (
        <Animated.View style={containerstyle}>
            <BlurView
                style={StyleSheet.absoluteFill}
                tint="dark"
                intensity={50}
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.card, // Dark card background for sheet
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.7)' // Darker overlay
    },
    content: {
        flex: 1,
        gap: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    filterText: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.black, // White text
        marginBottom: 5
    },
    buttons: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },

    buttonText: {
        fontSize: hp(2.2)
    },
    resetButton: {
        flex: 1,
        backgroundColor: theme.colors.search, // Dark search bg
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.neutral(0.2),
    },
    applyButton: {
        flex: 1,
        backgroundColor: '#1877F2',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        borderCurve: 'continuous',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }

});

export default FiltersModel