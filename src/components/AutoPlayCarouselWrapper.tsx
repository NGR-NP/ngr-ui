"use client";

import { AutoPlayCarouselProps } from "@/src/components/AutoPlayCarousel";
import dynamic from "next/dynamic";

const sliders = [
  {
    src: "https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg",
    alt: "lorem",
  },
  {
    src: "https://images.pexels.com/photos/9334965/pexels-photo-9334965.jpeg",
    alt: "lorem",
  },
  {
    src: "https://images.pexels.com/photos/18003063/pexels-photo-18003063.jpeg",
    alt: "lorem",
  },
  {
    src: "https://images.pexels.com/photos/29067154/pexels-photo-29067154.jpeg",
    alt: "lorem",
  },
  {
    src: "https://images.pexels.com/photos/13971738/pexels-photo-13971738.jpeg",
    alt: "lorem",
  },
  {
    src: "https://images.pexels.com/photos/8664310/pexels-photo-8664310.jpeg",
    alt: "lorem",
  },
];

const AutoPlayCarousel = dynamic<AutoPlayCarouselProps<(typeof sliders)[number]>>(() => import("@/src/components/AutoPlayCarousel"), {
  ssr: false,
});

export default function AutoPlayCarouselWrapper() {
  return (
    <AutoPlayCarousel
      slides={sliders}
      showIndicator
      renderSlide={({ slide }) => (
        <img
          src={slide.src}
          alt={slide.alt}
          className="rounded-lg size-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
        />
      )}
    />
  );
}
