import type { TradingProfile } from '@/types';

export type OnboardingField = keyof TradingProfile;

export type OnboardingStep = {
  field: OnboardingField;
  label: string;
  description: string;
  placeholder: string;
  chips: string[];
};

export const onboardingSteps: OnboardingStep[] = [
  {
    field: 'primaryGoal',
    label: 'What is your main trading goal?',
    description: 'Pick the outcome you want your plan to protect first.',
    placeholder: 'Choose your primary goal',
    chips: [
      'Become consistently profitable',
      'Reduce losses / drawdown',
      'Build a repeatable strategy',
      'Improve risk management',
      'Control emotions and discipline',
    ],
  },
  {
    field: 'marketFocus',
    label: 'Which market do you trade most?',
    description: 'This helps the checklist match your pace and review style.',
    placeholder: 'Choose a market',
    chips: ['Stocks', 'Crypto', 'Forex', 'Futures', 'Options', 'Mixed / still exploring'],
  },
  {
    field: 'experienceLevel',
    label: 'Where are you in your trading journey?',
    description: 'Be honest here. The plan gets better when the ego takes a short walk.',
    placeholder: 'Choose your experience level',
    chips: [
      'Beginner',
      'Intermediate',
      'Advanced',
      'Prop-firm / funded challenge',
      'Returning after a break',
    ],
  },
  {
    field: 'tradingStyle',
    label: 'What is your current trading style?',
    description: 'No judgment if the answer is still a little experimental.',
    placeholder: 'Choose your trading style',
    chips: ['Scalping', 'Day trading', 'Swing trading', 'Position trading', 'Still finding my style'],
  },
  {
    field: 'biggestChallenge',
    label: 'What blocks your performance most?',
    description: 'This is where the AI plan gets practical instead of inspirational.',
    placeholder: 'Choose your biggest blocker',
    chips: [
      'Revenge trading',
      'Overtrading',
      'Oversizing positions',
      'Poor exits',
      'Breaking my own rules',
      'No clear journal or review process',
    ],
  },
  {
    field: 'tradingContext',
    label: 'What context should your plan respect?',
    description: 'Add a short note if there is anything else the plan should know.',
    placeholder: 'Choose your current context',
    chips: [
      'Small account',
      'Full-time job, limited screen time',
      'Recovering from a losing streak',
      'Preparing for a funded challenge',
      'Testing a new strategy',
      'I need structure and consistency',
    ],
  },
];

export const emptyTradingProfile: TradingProfile = {
  primaryGoal: '',
  marketFocus: '',
  experienceLevel: '',
  tradingStyle: '',
  biggestChallenge: '',
  tradingContext: '',
  additionalContext: '',
};
