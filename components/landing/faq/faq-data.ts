export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: 1,
    question: "Does it really sound human?",
    answer:
      "Absolutely! Our AI uses advanced natural language processing to have conversations that feel completely natural. The best way to experience it is to try our demo call yourself. You'll be amazed at how human-like the interactions are. Give it a try and see for yourself!",
  },
  {
    id: 2,
    question: "What if my business has specific needs?",
    answer:
      "We understand every business is unique. That's why we offer extensive customization options and a knowledge base feature. You can train the AI with your specific business information, customize responses, set up custom workflows, and configure it to handle your unique requirements. Our team is here to help you set it up perfectly for your business.",
  },
  {
    id: 3,
    question: "How long does setup take?",
    answer:
      "Just 5 minutes! No technical skills needed. Simply sign up, connect your calendar, and configure your basic preferences. Our intuitive setup process guides you through everything step by step. You can be up and running in minutes, not hours or days.",
  },
  {
    id: 4,
    question: "What happens if the AI can't handle a call?",
    answer:
      "Our AI is designed with a seamless human handoff capability. If the AI encounters a situation it can't handle, it automatically transfers the call to you or your team. You can set up custom rules for when handoffs should occur, ensuring your customers always get the help they need, whether from the AI or a human.",
  },
  {
    id: 5,
    question: "Do I keep my existing phone number?",
    answer:
      "Yes! You keep your existing phone number. Simply forward your calls to our system, and everything else works seamlessly. There's no need to change your number or inform your customers. The transition is completely transparent to them.",
  },
  {
    id: 6,
    question: "Is there a contract?",
    answer:
      "No contracts. Cancel anytime. We believe in earning your business every month, not locking you into long-term commitments. You have complete flexibility to pause, modify, or cancel your subscription whenever you need to, with no penalties or fees.",
  },
  {
    id: 7,
    question: "What languages are supported?",
    answer:
      "Our AI currently supports multiple languages including English, Spanish, French, German, Italian, Portuguese, and more. We're continuously adding support for additional languages based on customer demand. If you need a specific language, let us know and we'll prioritize it.",
  },
  {
    id: 8,
    question: "Is my customer data secure?",
    answer:
      "Absolutely. We take security and compliance seriously. All customer data is encrypted in transit and at rest. We comply with GDPR, CCPA, and other major data protection regulations. Your data is stored securely and never shared with third parties. We undergo regular security audits and maintain industry-standard compliance certifications to ensure your information is always protected.",
  },
];
