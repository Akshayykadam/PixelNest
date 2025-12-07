import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated';
import React from 'react'
import { data } from '../constants/data'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'

const Categories = ({ activeCategory, handleChangeCategory }) => {
    return (
        <FlatList
            horizontal
            contentContainerStyle={styles.flatListContainer}
            showsHorizontalScrollIndicator={false}
            data={data.categories}
            keyExtractor={item => item}
            renderItem={({ item, index }) => (
                <CategoriesItem
                    isActive={activeCategory == item}
                    handleChangeCategory={handleChangeCategory}
                    title={item}
                    index={index}
                />
            )}
        />
    )
}

const CategoriesItem = ({ title, index, isActive, handleChangeCategory }) => {
    let color = isActive ? theme.colors.black : theme.colors.neutral(0.7)
    let backgroundColor = isActive ? '#555555' : theme.colors.card
    return (
        <Animated.View entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}>
            <Pressable
                onPress={() => handleChangeCategory(isActive ? null : title)}
                style={[styles.category, { backgroundColor }]}>
                <Text style={[styles.title, { color }]}>{title}</Text>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    flatListContainer: {
        paddingVertical: 20,
        paddingHorizontal: wp(4),
        gap: 8
    },
    category: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)', // Subtle border
        // Removed shadows for cleaner dark mode look
    },
    title: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.medium,
    },

});

export default Categories