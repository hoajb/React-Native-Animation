import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, useDerivedValue, withSpring } from 'react-native-reanimated';

const SIZE = 80
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface AnimatedFollowPositionProps {
    x: Animated.SharedValue<number>
    y: Animated.SharedValue<number>
}
const useAnimatedFollowPosition = ({ x, y }: AnimatedFollowPositionProps) => {
    const followX = useDerivedValue(() => {
        return withSpring(x.value)
    })
    const followY = useDerivedValue(() => {
        return withSpring(y.value)
    })
    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: followX.value }, { translateY: followY.value },]
        };
    });

    return { followX, followY, rStyle }
}

const GestureAnimationWidget = () => {
    const translationX = useSharedValue(-SIZE / 2)
    const translationY = useSharedValue(-SIZE / 2)
    const context = useSharedValue({ x: 0, y: 0 })

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { x: translationX.value, y: translationY.value }
        })
        .onUpdate((event) => {
            console.log(event.absoluteX)
            translationX.value = context.value.x + event.translationX
            translationY.value = context.value.y + event.translationY
        })
        .onEnd(() => {
            translationX.value = -SIZE / 2
            translationY.value = -SIZE / 2
        })

    const { followX: followXBlue, followY: followYBlue, rStyle: rStyleBlue } = useAnimatedFollowPosition({ x: translationX, y: translationY })
    const { followX: followXRed, followY: followYRed, rStyle: rStyleRed } = useAnimatedFollowPosition({ x: followXBlue, y: followYBlue })
    const { rStyle: rStyleYellow } = useAnimatedFollowPosition({ x: followXRed, y: followYRed })

    return (
        <View style={styles.container}>
            <GestureHandlerRootView>
                <Animated.View style={[styles.circle, { backgroundColor: 'yellow' }, rStyleYellow,]} />
                <Animated.View style={[styles.circle, { backgroundColor: 'red' }, rStyleRed,]} />
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.circle, rStyleBlue]} />
                </GestureDetector>
            </GestureHandlerRootView>
        </View>
    );
};

export default GestureAnimationWidget;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    circle: {
        width: SIZE,
        height: SIZE,
        position: 'absolute',
        borderRadius: SIZE / 2,
        backgroundColor: 'blue'
    }
});
