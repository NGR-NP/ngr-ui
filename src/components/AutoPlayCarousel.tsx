"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Autoplay from "embla-carousel-autoplay";

import { useIsMobile } from "@/src/hooks/use-mobile";

import { Button } from "@/src/components/ui/button";
import type { CarouselApi } from "@/src/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselProps, // just find CarouselProps inside carousel and export it
} from "@/src/components/ui/carousel";

type SlideStyle = { scale: number; opacity: number; translateX: number };

function getSlideStyles(api: CarouselApi, isMobile: boolean): SlideStyle[] {
  if (!api) return [];
  const slides = api.slideNodes();
  const scrollProgress = api.scrollProgress();
  const scrollSnaps = api.scrollSnapList();

  return slides.map((_, index) => {
    const slideSnapPosition = scrollSnaps[index];
    let diff = slideSnapPosition - scrollProgress;
    if (diff > 0.5) diff -= 1;
    else if (diff < -0.5) diff += 1;
    const centerDistance = Math.abs(diff);
    const clampedDistance = Math.min(centerDistance, 0.5);
    const scale = 1 - clampedDistance * (isMobile ? 0.7 : 0.8);
    const opacity = 1 - clampedDistance * 0.8;
    const translateX = -diff * (isMobile ? 70 : 350);
    return { scale, opacity, translateX };
  });
}

export interface AutoPlayCarouselProps<T>
  extends CarouselProps,
    React.ComponentProps<"div"> {
  slides: T[];
  renderSlide: ({ slide }: { slide: T }) => React.ReactNode;
  showIndicator?: boolean;
  showController?: boolean;
  opts?: CarouselProps["opts"];
  autoplayDelay?: number;
}

export default function AutoPlayCarousel<T>({
  slides,
  renderSlide,
  showIndicator = false,
  showController = false,
  opts = {},
  autoplayDelay = 4000,
  className,
  ...props
}: AutoPlayCarouselProps<T>) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [slideStyles, setSlideStyles] = useState<SlideStyle[]>([]);
  const isMobile = useIsMobile();

  const updateSlideStyles = useCallback(() => {
    if (api) setSlideStyles(getSlideStyles(api, isMobile));
  }, [api, isMobile]);

  useEffect(() => {
    if (!api) return;
    updateSlideStyles();
    setCurrent(api.selectedScrollSnap());
    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
      updateSlideStyles();
    };
    api.on("select", handleSelect);
    api.on("scroll", updateSlideStyles);
    return () => {
      api.off("select", handleSelect);
      api.off("scroll", updateSlideStyles);
    };
  }, [api, updateSlideStyles]);

  const handleDotClick = useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  );

  const plugin = useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: true })
  );

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      className={className}
      opts={{ align: "center", loop: true, ...opts }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      {...props}
    >
      <CarouselContent>
        {slides.map((slide, index) => {
          const style = slideStyles[index] || {
            scale: 0.9,
            opacity: 0.6,
            translateX: 0,
          };
          return (
            <CarouselItem
              key={index}
              className="basis-5/6 max-md:pl-8 max-sm:pl-6 max-[35rem]:pl-2 max-h-4/5"
            >
              <div
                className="group relative size-full aspect-square  overflow-hidden rounded-lg duration-200 md:aspect-video"
                style={{
                  transform: `scale(${style.scale}) translateX(${style.translateX}px)`,
                }}
              >
                {renderSlide({ slide })}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      {showController && (
        <>
          <CarouselPrevious className="top-[95%] hover:scale-110 active:scale-95 left-6" />
          <CarouselNext className="top-[95%] right-6 hover:scale-110 active:scale-95" />
        </>
      )}
      {showIndicator && (
        <div className="mt-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`size-3 rounded-full p-0 ${
                index === current
                  ? "bg-primary ring-ring ring-offset-background hover:bg-primary/80 ring-1 ring-offset-2 transition-all duration-300 hover:scale-105"
                  : "bg-primary/10 hover:bg-primary/15"
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </Carousel>
  );
}
