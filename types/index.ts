export type User = {
  id: string;
  name: string;
  email: string;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type ChecklistItem = {
  id: string;
  userId: string;
  text: string;
  position: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TradingProfile = {
  primaryGoal: string;
  marketFocus: string;
  experienceLevel: string;
  tradingStyle: string;
  biggestChallenge: string;
  tradingContext: string;
  additionalContext?: string;
};
