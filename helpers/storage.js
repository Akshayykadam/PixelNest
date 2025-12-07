import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeLikedImage = async (image) => {
    try {
        let likedImages = await AsyncStorage.getItem('likedImages');
        likedImages = likedImages ? JSON.parse(likedImages) : [];

        // Check if already liked to prevent duplicates
        const isAlreadyLiked = likedImages.some(img => img.id === image.id);
        if (!isAlreadyLiked) {
            likedImages.push(image);
            await AsyncStorage.setItem('likedImages', JSON.stringify(likedImages));
        }
    } catch (error) {
        console.log('Error storing liked image', error);
    }
}

export const removeLikedImage = async (imageId) => {
    try {
        let likedImages = await AsyncStorage.getItem('likedImages');
        likedImages = likedImages ? JSON.parse(likedImages) : [];

        const newLikedImages = likedImages.filter(img => img.id !== imageId);
        await AsyncStorage.setItem('likedImages', JSON.stringify(newLikedImages));
    } catch (error) {
        console.log('Error removing liked image', error);
    }
}

export const getLikedImages = async () => {
    try {
        const likedImages = await AsyncStorage.getItem('likedImages');
        return likedImages ? JSON.parse(likedImages) : [];
    } catch (error) {
        console.log('Error getting liked images', error);
        return [];
    }
}

export const isImageLiked = async (imageId) => {
    try {
        let likedImages = await AsyncStorage.getItem('likedImages');
        likedImages = likedImages ? JSON.parse(likedImages) : [];
        return likedImages.some(img => img.id === imageId);
    } catch (error) {
        console.log('Error checking if image is liked', error);
        return false;
    }
}
