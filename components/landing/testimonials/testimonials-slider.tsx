"use client";

import "./testimonials-section.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { TestimonialCard } from "./testimonial-card";
import type { Testimonial } from "./testimonials-data";

export function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="relative w-full" aria-live="polite" aria-atomic="false">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        centeredSlides={false}
        loop={true}
        speed={800}
        grabCursor={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 16,
            centeredSlides: false,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 18,
            centeredSlides: false,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
            centeredSlides: true,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
            centeredSlides: true,
          },
          1280: {
            slidesPerView: 4.2,
            spaceBetween: 32,
            centeredSlides: true,
          },
          1536: {
            slidesPerView: 4.2,
            spaceBetween: 32,
            centeredSlides: true,
          },
        }}
        className="!pb-12 !px-[20px] testimonials-swiper"
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/30 !w-2 !h-2",
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-primary !w-8",
        }}
        navigation={false}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <TestimonialCard testimonial={testimonial} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
