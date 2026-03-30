import {create} from 'zustand';

interface OnboardingState {
  isComplete: boolean;
  setComplete: (complete: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>(set => ({
  isComplete: false,
  setComplete: (complete: boolean) => set({isComplete: complete}),
}));
