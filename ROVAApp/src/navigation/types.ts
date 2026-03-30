// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  MainApp: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: undefined;
  WiFiSetup: undefined;
  CitySetup: undefined;
  SetupComplete: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Widgets: undefined;
  Alerts: undefined;
  Settings: undefined;
};

export type ModalStackParamList = {
  BrightnessSheet: undefined;
  OTAUpdateSheet: undefined;
  CricketDetailSheet: undefined;
  CitySearchSheet: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
