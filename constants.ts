import { Hand, CheckCircle, TrendingUp } from 'lucide-react';
import { FAQItem, GuideStep } from './types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I activate Scroll & Earn?",
    answer: "Simply click the 'Activate Now' button, and monetization will be enabled on your account instantly. You'll start earning from your very next scroll session."
  },
  {
    question: "When can I cash out my earnings?",
    answer: "You can cash out your earnings as soon as you reach the minimum withdrawal threshold. Payouts are processed instantly to your connected payment method."
  },
  {
    question: "Does this affect my viewing experience?",
    answer: "No, Scroll & Earn is designed to be completely non-intrusive. You can continue to enjoy your favorite content exactly as you always have, while earning rewards in the background."
  },
  {
    question: "Why does TikTok pay people to scroll?",
    answer: "TikTok realized users fuel the platform with their watch activity. Scroll & Earn was created to reward people for the engagement they already give—turning normal scrolling into rewards."
  }
];

export const GUIDE_STEPS: GuideStep[] = [
  {
    title: "Tap Apply Now",
    description: "Unlock access to Scroll & Earn.",
    icon: Hand,
    iconColor: "text-white",
    iconBg: "bg-[#FE2C55]"
  },
  {
    title: "Pass the Human Check",
    description: "Just a quick verification—takes seconds.",
    icon: CheckCircle,
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