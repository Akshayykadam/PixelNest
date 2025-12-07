import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "react-native";
import { hp, wp } from '../helpers/common'
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router'

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('home')} style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../assets/images/welcome.png')}
        style={styles.bgImage}
        resizeMode='cover'
      />
      {/*linear gardient background */}
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={['rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 0.5)', '#121212', '#121212']}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />

        {/*content */}
        <View style={styles.contentContainer}>

          <Animated.Text
            entering={FadeInDown.delay(400).springify()}
            style={styles.title}>
            PixelNest
          </Animated.Text>

          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <View style={styles.startButton}>
              <Text style={styles.startText}>Start Explore</Text>
            </View>
          </Animated.View>

        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white, // Ensure dark background
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: 'absolute',
    opacity: 0.8, // Slightly dim the background image
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: 'absolute'
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 14,
  },
  title: {
    fontSize: hp(7),
    letterSpacing: 1,
    color: theme.colors.white, // Pure white for title
    fontWeight: theme.fontWeights.bold,
  },

  startButton: {
    marginBottom: 50,
    backgroundColor: theme.colors.white, // White button for contrast
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous'
  },
  startText: {
    color: theme.colors.black, // Dark text on white button
    fontSize: hp(2),
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 1,
  },
});

export default WelcomeScreen
