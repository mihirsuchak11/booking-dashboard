export interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

// Sample partner data - replace with actual partner logos
export const partners: Partner[] = [
  {
    id: "google",
    name: "Google",
    logo: "/landing/partners/google.svg",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logo: "/landing/partners/microsoft.svg",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "/landing/partners/amazon.svg",
  },
  {
    id: "meta",
    name: "Meta",
    logo: "/landing/partners/meta.svg",
  },
  {
    id: "apple",
    name: "Apple",
    logo: "/landing/partners/apple.svg",
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: "/landing/partners/netflix.svg",
  },
  {
    id: "spotify",
    name: "Spotify",
    logo: "/landing/partners/spotify.svg",
  },
  {
    id: "slack",
    name: "Slack",
    logo: "/landing/partners/slack.svg",
  },
];
