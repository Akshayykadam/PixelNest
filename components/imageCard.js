import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { getImageSize, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router';

const ImageCard = ({ item, index, columns, router }) => {

    const isLastInRow = () => {
        return (index + 1) % columns === 0;
    }

    const getImageHeight = () => {
        let { imageWidth: width, imageHeight: height } = item;
        return { height: getImageSize(height, width) }
    }
    const Router = useRouter(); //TODO: Fix router issue 

    return (
        <Pressable onPress={() => Router.push({ pathname: 'home/image', params: { ...item } })} style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
            <Image
                style={[styles.image, getImageHeight()]}
                source={{ uri: item?.webformatURL }}
                transition={100}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: '100%',
    },
    imageWrapper: {
        backgroundColor: theme.colors.card, // Dark card background for loading state
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        overflow: 'hidden',
        marginBottom: wp(3)
    },
    spacing: {
        marginRight: wp(3)
    }
});

export default ImageCard