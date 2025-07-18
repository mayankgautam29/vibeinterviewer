"use client";

export default function ParallaxStyle() {
  return (
    <style jsx global>{`
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.8s ease-out both;
      }

      .animate-marquee {
        display: inline-block;
        animation: marquee 20s linear infinite;
      }

      @keyframes marquee {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `}</style>
  );
}
