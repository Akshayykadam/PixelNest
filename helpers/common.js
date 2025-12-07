import { Dimensions } from "react-native"

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = percentage => {
    const width = deviceWidth;
    return (percentage * width) / 100;
}

export const hp = percentage => {
    const height = deviceHeight;
    return (percentage * height) / 100;
}

export const getColumnsCount = () => {
    if (deviceWidth >= 1024) {
        // mac
        return 4;
    } else if (deviceWidth >= 768) {
        // ipad
        return 3;
    } else {
        // iphone
        return 2;
    }

}

export const getImageSize = (height, width) => {
    if (parseFloat(width) > parseFloat(height)) {
        //landscape
        return 250;
    } else if (parseFloat(width) < parseFloat(height)) {
        //portrait
        return 300;
    } else {
        //square
        return 200;
    }
}

export const capitalize = str => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

