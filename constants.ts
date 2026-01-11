import { TrendingUp, User, Lock } from 'lucide-react';
import { FAQItem, GuideStep } from './types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I activate Scroll & Earn?",
    answer: "Enter your TikTok username in the field above and click 'Connect Account'. Our system will verify your eligibility and activate the monetization features on your profile."
  },
  {
    question: "Do I need to give my password?",
    answer: "No! We never ask for your password. We only need your username to whitelist your account for the Scroll & Earn beta program."
  },
  {
    question: "When can I cash out my earnings?",
    answer: "You can cash out your earnings as soon as you reach the minimum withdrawal threshold. Payouts are processed instantly to your connected payment method."
  },
  {
    question: "Does this affect my viewing experience?",
    answer: "No, Scroll & Earn is designed to be completely non-intrusive. You can continue to enjoy your favorite content exactly as you always have, while earning rewards in the background."
  }
];

export const GUIDE_STEPS: GuideStep[] = [
  {
    title: "Enter Username",
    description: "Type your TikTok handle to check eligibility.",
    icon: User,
    iconColor: "text-white",
    iconBg: "bg-[#FE2C55]"
  },
  {
    title: "Verify Session",
    description: "Complete the quick security check to prevent bots.",
    icon: Lock,
    iconColor: "text-white",
    iconBg: "bg-[#FE2C55]"
  },
  {
    title: "Start Earning",
    description: "Your feed is now monetized instantly.",
    icon: TrendingUp,
    iconColor: "text-white",
    iconBg: "bg-[#FE2C55]"
  }
];