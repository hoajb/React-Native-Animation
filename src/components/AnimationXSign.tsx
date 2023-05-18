import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { View as ViewA, useAnimationState } from 'moti'

interface AnimationXSignProps {
    size: number,
    durationAnim: number,
    startAnim: boolean
}

const ratio = 5

const useAnimeCrossUpState = (short: number, long: number) => {
    return useAnimationState({
        from: {
            width: short, height: 0, left: long
        },
        to: {
            width: short, height: long, left: 2 * short
        },
    });
};

const useAnimeCrossFlatState = (short: number, long: number) => {
    return useAnimationState({
        from: {
            width: 0, height: short
        },
        to: {
            width: long, height: short
        },
    });
};

const AnimationXSign = ({ size, durationAnim, startAnim = false }: AnimationXSignProps) => {
    const long = size
    const short = size / ratio

    const crossUp = useAnimeCrossUpState(short, long)
    const crossFlat = useAnimeCrossFlatState(short, long)

    React.useCallback(() => {
        if (startAnim) {
            crossUp.transitionTo('to')
            crossFlat.transitionTo('to')
        } else {
            crossUp.transitionTo('from')
            crossFlat.transitionTo('from')
        }
    }, [startAnim]);

    console.log(`AnimationXSign - ${startAnim}`)

    return (
        <View style={styles.container}>
            <View style={[styles.cross, { width: size, height: size }]}>
                <ViewA
                    style={[styles.crossUp, {
                        left: 2 * short,
                        height: long,
                        width: short,
                    }]}
                    state={crossUp}
                    transition={{
                        type: 'timing',
                        duration: durationAnim,
                        delay: durationAnim
                    }}
                />

                <ViewA style={[styles.crossFlat, {
                    top: 2 * short,
                    height: short,
                    width: long,
                }]}
                    state={crossFlat}
                    transition={{
                        type: 'timing',
                        duration: durationAnim,
                        delay: durationAnim + durationAnim / 2
                    }}
                />
            </View>
        </View>
    );
};

export default AnimationXSign;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cross: {
        backgroundColor: 'transparent',
    },
    crossUp: {
        position: 'absolute',
        backgroundColor: "white",
        transform: [{ rotate: "45deg" }],
    },
    crossFlat: {
        left: 0,
        backgroundColor: "white",
        position: 'absolute',
        transform: [{ rotate: "45deg" }],
    },
});
