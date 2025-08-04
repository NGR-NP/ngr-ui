import ShadcnCarouselWrapper from "@/components/AutoPlayCarouselWrapper";
import ComponentDetails from "@/components/other/ComponentDetails";
import { Badge } from "@/components/ui/badge";
import { SparklesIcon } from "lucide-react";

export default function Home() {
  return (
    <section className="space-y-4 bg-secondary py-4">
      <Badge
        variant="outline"
        className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
      >
        <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
        Carousel
      </Badge>
      <div className="flex relative flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
        <div className="flex gap-2">
          <div>
            <h3 className="text-4xl opacity-85 font-bold tracking-tight">
              Animated Carousel
            </h3>
            <p>smooth and auto play animated carousel.</p>
          </div>
        </div>
      <ComponentDetails component={{ name: "AutoPlayCarousel" }} />
      </div>
      <ShadcnCarouselWrapper />

    </section>
  );
}
