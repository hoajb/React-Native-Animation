import { MotiView, UseAnimationState, useAnimationState } from 'moti';
import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import AnimationXSign from './AnimationXSign';

enum State {
    Init = 0,
    Loading = 1,
    Error = 2,
    ErrorText = 22,
    Success = 3
}

const DURATION = 500
const DURATION_WAVE = 400
const BUTTON_WIDTH = 300
const BUTTON_HEIGHT = 50
const SIZE_DOT = 1 / 10
const DOT_WAVE_RANGE = 5

const COLOR_INIT = '#019de6'
const COLOR_LOADING = '#0079b2'
const COLOR_ERROR_X = '#ff5067'
const COLOR_ERROR = '#fea1ad'

const useParentState = () => {
    return useAnimationState({
        init: {
            width: BUTTON_WIDTH,
            backgroundColor: COLOR_INIT,
        },
        loading: {
            width: BUTTON_HEIGHT,
            backgroundColor: COLOR_LOADING,
        },
        error_x: {
            width: BUTTON_HEIGHT,
            backgroundColor: COLOR_ERROR_X,
        },

        error_text: {
            width: BUTTON_WIDTH,
            backgroundColor: COLOR_ERROR,
        },
    }, { from: 'init' });
};

const useShowHideState = (baseShow: boolean) => {
    return useAnimationState({
        gone: {
            opacity: 0
        },
        visible: {
            opacity: 1
        },
    }, {
        from: baseShow ? 'visible' : 'gone'
    });
};

const useMoveRightState = () => {
    return useAnimationState({
        from: {
            translateX: 0,
            scale: 1,
            opacity: 0
        },

        show: {
            translateX: 0,
            scale: 1,
            opacity: 1
        },

        end: {
            translateX: BUTTON_WIDTH - BUTTON_WIDTH / 2 - BUTTON_HEIGHT / 2,
            scale: 0.85,
            opacity: 1
        },
    });
};

const useJumpingState = () => {
    return useAnimationState({
        low: {
            translateY: -DOT_WAVE_RANGE
        },
        high: {
            translateY: DOT_WAVE_RANGE
        },
    }, { from: 'low' });
};

const useShrinkState = () => useAnimationState({
    start: {
        translateX: 0,
        scale: 1,
    },
    shrinkLeft: {
        translateX: -10,
        scale: 0.9,
    },
    shrinkRight: {
        translateX: 10,
        scale: 0.9,
    },
}, { from: 'start' });

function delay(ms: number, resolve: () => void) {
    return new Promise(() => setTimeout(resolve, ms));
}

const AnimationButtonLoading2 = () => {
    const [mainState, setMainState] = useState(State.Init)
    const [startXSignAnim, setStartXSignAnim] = useState(false)
    const animationState = useParentState()
    const textState = useShowHideState(true)
    const threeDotsState = useShowHideState(false)

    const errorXVisibleState = useShowHideState(true)

    const dotState = useJumpingState()
    const dotState2 = useJumpingState()
    const dotState3 = useJumpingState()

    const errorMove = useMoveRightState()

    // const shrinkState = useShrinkState()

    const [text, setText] = useState('Submit')

    React.useEffect(() => {
        const animateChild = async () => {
            console.log(animationState.current)

            if (animationState.current === 'loading') {
                await textState.transitionTo('gone');
                await threeDotsState.transitionTo('visible');
                dotState.transitionTo('high');
                dotState2.transitionTo('high');
                dotState3.transitionTo('high');
            } else if (animationState.current === 'error_x') {
                await textState.transitionTo('gone');
                await threeDotsState.transitionTo('gone');
                await errorMove.transitionTo('show')
                // await errorXVisibleState.transitionTo('visible')

                dotState.transitionTo('low');
                dotState2.transitionTo('low');
                dotState3.transitionTo('low');
            } else if (animationState.current === 'error_text') {
                await textState.transitionTo('visible')
                await threeDotsState.transitionTo('gone')
                // await errorXVisibleState.transitionTo('visible')
                await errorMove.transitionTo('end')
            } else { //init
                await threeDotsState.transitionTo('gone')
                // await errorXVisibleState.transitionTo('gone')

                await textState.transitionTo('visible');
                errorMove.transitionTo('from')
                dotState.transitionTo('low');
                dotState2.transitionTo('low');
                dotState3.transitionTo('low');
            }
        };

        animateChild();
    }, [mainState]);

    const toggleAnimation = () => {
        animationState.transitionTo((state) => {
            if (state === 'init') {
                setMainState(State.Loading)
                return 'loading';
            } else if (state === 'loading') {
                setMainState(State.Error)

                //delay then move to error_text
                delay(1000, () => {
                    animationState.transitionTo('error_text')
                    setMainState(State.ErrorText)
                    setText('Oops! Try Again')
                })
                return 'error_x';
            } else if (state === 'error_x') {
                setMainState(State.ErrorText)
                setText('Oops! Try Again')
                return 'error_text';
            } else {
                setMainState(State.Init)
                setText('Submit')
                setStartXSignAnim(false)
                return 'init';
            }
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleAnimation}>
                <Text>Press to change state for button animation</Text>
            </TouchableOpacity>
            <MotiView // change state and size
                style={styles.button_init}
                state={animationState}
                transition={{ type: 'timing', duration: DURATION }}>
                <MotiView
                    state={textState}
                    transition={{ type: 'timing', duration: DURATION }}>
                    <Text style={styles.text}>{text}</Text>
                </MotiView>

                <MotiView  // three dots
                    style={[styles.square_box]}
                    state={threeDotsState}
                    transition={{
                        type: 'timing',
                        duration: DURATION_WAVE,
                    }}>
                    <MotiView  // wave
                        style={styles.dot}
                        state={dotState}
                        transition={{
                            type: 'timing',
                            duration: DURATION_WAVE,
                            loop: true,
                            repeat: Infinity,
                            repeatReverse: true
                        }}
                    />
                    <MotiView  // wave1
                        style={styles.dot}
                        state={dotState2}
                        transition={{
                            type: 'timing',
                            duration: DURATION_WAVE,
                            delay: 100,
                            loop: false,
                            repeat: Infinity,
                            repeatReverse: true
                        }}
                    />

                    <MotiView  // wave2
                        style={styles.dot}
                        state={dotState3}
                        transition={{
                            type: 'timing',
                            duration: DURATION_WAVE,
                            delay: 150,
                            loop: false,
                            repeat: Infinity,
                            repeatReverse: true
                        }}
                    />

                </MotiView>

                <MotiView style={styles.square_box_error}
                    state={errorXVisibleState}
                    transition={{
                        type: 'timing',
                        duration: DURATION_WAVE,
                    }}>
                    <MotiView style={{
                        backgroundColor: COLOR_ERROR_X,
                        width: BUTTON_HEIGHT,
                        height: BUTTON_HEIGHT,
                        borderRadius: 8,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                        state={errorMove}
                        transition={{
                            type: 'timing',
                            duration: DURATION_WAVE,
                        }}>
                        <AnimationXSign size={20} durationAnim={2000} startAnim={startXSignAnim} />
                    </MotiView>
                </MotiView>
            </MotiView>
        </View>
    );
};

export default AnimationButtonLoading2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },

    text: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center'
    },

    button_init: {
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        margin: 20,
        borderRadius: 8,
        backgroundColor: COLOR_INIT,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button_loading: {
        width: BUTTON_HEIGHT,
        height: BUTTON_HEIGHT,
    },

    square_box: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: BUTTON_HEIGHT,
        height: BUTTON_HEIGHT,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    square_box_error: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: BUTTON_HEIGHT,
        height: BUTTON_HEIGHT,
        borderRadius: 8,
        justifyContent: 'center',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
    },

    dot: {
        alignItems: 'center',
        justifyContent: 'center',
        width: BUTTON_HEIGHT * SIZE_DOT,
        height: BUTTON_HEIGHT * SIZE_DOT,
        backgroundColor: 'white',
        margin: 3,
        borderRadius: BUTTON_HEIGHT * SIZE_DOT / 2,
    }
});
