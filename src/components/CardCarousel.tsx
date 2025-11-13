import { useState, useEffect } from "react";
import { IdentityCard } from "./IdentityCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const mockIdentities = [
  {
    name: "Professional ID",
    attributes: [
      { label: "Age Verified", value: "Over 18", encrypted: true },
      { label: "Credential", value: "Software Engineer", encrypted: false },
      { label: "Experience", value: "5+ Years", encrypted: false },
      { label: "Location", value: "United States", encrypted: true },
    ],
  },
  {
    name: "Academic ID",
    attributes: [
      { label: "Degree", value: "Master's in CS", encrypted: false },
      { label: "Institution", value: "████████", encrypted: true },
      { label: "Year", value: "2020", encrypted: false },
      { label: "GPA", value: "3.8/4.0", encrypted: true },
    ],
  },
  {
    name: "Financial ID",
    attributes: [
      { label: "Credit Score", value: "████", encrypted: true },
      { label: "Income Bracket", value: "Verified", encrypted: true },
      { label: "Account Age", value: "5+ Years", encrypted: false },
      { label: "Status", value: "Good Standing", encrypted: false },
    ],
  },
];

export const CardCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % mockIdentities.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + mockIdentities.length) % mockIdentities.length);
  };

  useEffect(() => {
    const interval = setInterval(nextCard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-center gap-8">
        {/* Left control */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevCard}
          className="shrink-0 border border-primary/50 hover:bg-primary/20 hover:border-primary"
        >
          <ChevronLeft className="w-6 h-6 text-primary" />
        </Button>

        {/* Cards container */}
        <div className="relative h-[450px] flex items-center justify-center flex-1">
          <div className="relative w-full h-full flex items-center justify-center">
            {mockIdentities.map((identity, index) => {
              const offset = index - activeIndex;
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={index}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    transform: `
                      translateX(${offset * 100}%) 
                      translateZ(${isActive ? 0 : -200}px)
                      rotateY(${offset * 15}deg)
                      scale(${isActive ? 1 : 0.8})
                    `,
                    opacity: Math.abs(offset) > 1 ? 0 : 1,
                    zIndex: isActive ? 10 : 5 - Math.abs(offset),
                  }}
                >
                  <IdentityCard
                    name={identity.name}
                    attributes={identity.attributes}
                    isActive={isActive}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right control */}
        <Button
          variant="ghost"
          size="icon"
          onClick={nextCard}
          className="shrink-0 border border-primary/50 hover:bg-primary/20 hover:border-primary"
        >
          <ChevronRight className="w-6 h-6 text-primary" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {mockIdentities.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === activeIndex 
                ? 'bg-primary w-8 shadow-[0_0_10px_hsl(var(--cyber-cyan)/0.8)]' 
                : 'bg-border hover:bg-primary/50'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};
