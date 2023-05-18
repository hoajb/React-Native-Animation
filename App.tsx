/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import AnimationWidget from './src/components/AnimationWidget';
import GestureAnimationWidget from './src/components/GestureAnimationWidget';
import AnimationButtonLoading2 from './src/components/AnimationButtonLoading2';
import AnimationXSign from './src/components/AnimationXSign';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {/* <AnimationWidget /> */}
      <GestureAnimationWidget />
      {/* <AnimationButtonLoading2 /> */}
      {/* <AnimationXSign size={50} durationAnim={500} /> */}
    </SafeAreaView>
  );
}
export default App;
