import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import OnboardingStack from './OnboardingStack';
import MainTabs from './MainTabs';
import {useOnboardingStore} from '../store/onboardingStore';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const isOnboardingComplete = useOnboardingStore(
    state => state.isComplete,
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {backgroundColor: '#0A0A0A'},
        }}>
        {!isOnboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : (
          <Stack.Screen name="MainApp" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
