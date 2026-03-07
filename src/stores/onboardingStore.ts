"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  dismissed: boolean;
  completedSteps: string[];
  setDismissed: () => void;
  completeStep: (step: string) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      dismissed: false,
      completedSteps: [],

      setDismissed: () => set({ dismissed: true }),

      completeStep: (step) =>
        set((state) => {
          if (state.completedSteps.includes(step)) return state;
          return { completedSteps: [...state.completedSteps, step] };
        }),
    }),
    {
      name: "eulerx-onboarding",
    }
  )
);
