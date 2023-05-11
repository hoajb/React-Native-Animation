import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';

function AnimationWidget() {
    const opacity = useRef(new Animated.Value(0.3)).current
    const progress = useRef(new Animated.Value(0.5)).current
    const scale = useRef(new Animated.Value(1)).current

    useEffect(() => {
        Animated.sequence(
            [
                Animated.spring(progress, { toValue: 1, useNativeDriver: true }),
                Animated.spring(progress, { toValue: 0.5, useNativeDriver: true })
            ]
        ).start()

        Animated.sequence(
            [
                Animated.spring(scale, { toValue: 2, useNativeDriver: true }),
                Animated.spring(scale, { toValue: 1, useNativeDriver: true })
            ]
        ).start()

        Animated.spring(opacity, { toValue: 1, useNativeDriver: true }).start()
    }, [])
    return (
        <View style={styles.container}>
            <Text>Hello From RN 2</Text>
            <Animated.View style={[styles.box, {
                borderRadius: progress.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [0.5 * SIZE / 2, 1 * SIZE / 2]
                }),
                opacity: opacity,
                transform: [
                    { scale },
                    {
                        rotate: progress.interpolate({
                            inputRange: [0.5, 1],
                            outputRange: [`${0.5 * 2 * Math.PI}rad`, `${1 * 2 * Math.PI}rad`]
                        })
                    }
                ]
            }]} />
        </View>
    )
}

const SIZE = 100

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    box: {
        width: SIZE,
        height: SIZE,
        margin: 100,
        backgroundColor: 'blue',
    },
});

export default AnimationWidget;