export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "OP Manager",
    company: "TechFlow Solutions",
    content:
      "Booking Agent has transformed how we handle customer inquiries. The AI understands context perfectly and never misses a booking. Our team can focus on what matters most.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Founder",
    company: "Wellness Studio",
    content:
      "The natural conversation flow is incredible. Our customers can't tell they're talking to an AI. Bookings increased by 40% since we started using it.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Customer Success Lead",
    company: "Design Co",
    content:
      "Integration was seamless, and the scheduling accuracy is unmatched. We've eliminated double bookings completely. Highly recommend!",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "CEO",
    company: "Growth Labs",
    content:
      "The best investment we've made this year. Our receptionist handles 10x more calls, and customer satisfaction scores are through the roof.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Director of Operations",
    company: "HealthFirst Clinic",
    content:
      "The instant notifications via WhatsApp are a game-changer. Our patients love the convenience, and we love the efficiency.",
    rating: 5,
  },
  {
    id: 6,
    name: "James Thompson",
    role: "VP of Sales",
    company: "InnovateNow",
    content:
      "We've scaled our booking operations without hiring additional staff. The ROI is clear, and the AI keeps getting smarter.",
    rating: 5,
  },
  {
    id: 7,
    name: "Maria Garcia",
    role: "Founder",
    company: "Beauty Bar",
    content:
      "Our customers are amazed by how natural the conversations feel. The AI handles complex requests with ease. It's like having a superhuman receptionist.",
    rating: 5,
  },
  {
    id: 8,
    name: "Robert Lee",
    role: "Operations Director",
    company: "Fitness Hub",
    content:
      "The FAQ auto-answers feature saved us countless hours. The AI knows our business inside and out, and customers get instant answers.",
    rating: 5,
  },
];
