import { faqs } from "../faq/faq-data";
import { testimonials } from "../testimonials/testimonials-data";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Booking Agent",
    description:
      "An AI-powered voice agent that answers calls, books appointments, and handles customer questions—just like your best employee, but available around the clock.",
    url: "https://yourdomain.com", // Update with actual domain
    logo: "https://yourdomain.com/logo.png", // Update with actual logo URL
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "AI Receptionist Service",
    provider: {
      "@type": "Organization",
      name: "AI Booking Agent",
    },
    description:
      "AI-powered voice agent for appointment booking and customer service",
    areaServed: "Worldwide",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "AI Booking Agent",
    description:
      "An AI-powered voice agent that answers calls, books appointments, and handles customer questions",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating.toFixed(1),
      reviewCount: testimonials.length,
    },
    review: testimonials.map((testimonial) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: testimonial.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: testimonial.rating.toString(),
      },
      reviewBody: testimonial.content,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
