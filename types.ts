import { LucideIcon } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface GuideStep {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}
