import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {OnboardingStackParamList} from './types';
import {Easing} from 'react-native';

// Placeholder screens - will be implemented in Phase 2
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import PermissionsScreen from '../screens/onboarding/PermissionsScreen';
import WiFiSetupScreen from '../screens/onboarding/WiFiSetupScreen';
import CitySetupScreen from '../screens/onboarding/CitySetupScreen';
import SetupCompleteScreen from '../screens/onboarding/SetupCompleteScreen';

const Stack = createStackNavigator<OnboardingStackParamList>();

// Custom slide-up transition (240ms, feels native but darker)
const slideUpTransition = {
  gestureDirection: 'vertical' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      },
    },
  },
  cardStyleInterpolator: ({current, layouts}: any) => ({
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
  }),
};

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#0A0A0A'},
        ...slideUpTransition,
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
      <Stack.Screen name="WiFiSetup" component={WiFiSetupScreen} />
      <Stack.Screen name="CitySetup" component={CitySetupScreen} />
      <Stack.Screen name="SetupComplete" component={SetupCompleteScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
