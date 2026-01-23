export interface BenefitCard {
  id: number;
  title: string;
  description: string;
  image: string;
}

export const benefitsData: BenefitCard[] = [
  {
    id: 1,
    title: "Conversations That Feel Human",
    description:
      "No robotic voices. No awkward pauses. Your AI receptionist speaks naturally, understands context, and handles complex requests with ease.",
    image: "/landing/benefits/benefits1.png",
  },
  {
    id: 2,
    title: "Smart Scheduling",
    description:
      "Real-time availability checks. No double bookings. Automatic confirmations.",
    image: "/landing/benefits/benefits2.png",
  },
  {
    id: 3,
    title: "Instant Rescheduling",
    description:
      "Customers call back to change appointments. AI handles it instantly.",
    image: "/landing/benefits/benefits3.png",
  },
  {
    id: 4,
    title: "Instant Notifications",
    description:
      "WhatsApp & SMS booking confirmations sent automatically.",
    image: "/landing/benefits/benefits1.png",
  },
  {
    id: 5,
    title: "FAQ Auto-Answers",
    description:
      "Train it once on your business. It answers questions forever.",
    image: "/landing/benefits/benefits1.png",
  },
];

export const benefitsSectionContent = {
  heading: "Why Businesses Choose Booking Agent",
  description:
    "From startups to enterprises, teams trust Booking Agent to handle their customer calls with intelligence and care.",
};

// Controls how much scroll distance (in vh) each card transition consumes in the
// pinned Benefits section. Increase to make the scroll interaction last longer.
export const benefitsScrollVhPerCard = 150;
