"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  category?: string;
  color?: "indigo" | "violet" | "emerald" | "cyan" | "pink" | "sky";
  link?: {
    url: string;
    text: string;
  };
}

interface Timeline3DProps {
  events: TimelineEvent[];
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  accentColor?: string;
  accentTextColor?: string;
  showImages?: boolean;
  className?: string;
}

const defaultColors = {
  background: "bg-black",
  primary: "bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400",
  secondary: "bg-gradient-to-b from-neutral-200 to-neutral-500",
  text: "text-white",
  accent: "bg-white/10",
  accentText: "text-white/80",
};

const colorMap: Record<NonNullable<TimelineEvent["color"]>, string> = {
  indigo: "bg-gradient-to-br from-neutral-50 via-neutral-200 to-neutral-400",
  violet: "bg-gradient-to-br from-neutral-50 via-neutral-200 to-neutral-400",
  emerald: "bg-gradient-to-br from-neutral-100 via-neutral-300 to-neutral-500",
  cyan: "bg-gradient-to-br from-neutral-100 via-neutral-300 to-neutral-500",
  pink: "bg-gradient-to-br from-neutral-50 via-neutral-200 to-neutral-400",
  sky: "bg-gradient-to-br from-neutral-100 via-neutral-300 to-neutral-500",
};

export const Timeline3D: React.FC<Timeline3DProps> = ({
  events,
  backgroundColor = defaultColors.background,
  primaryColor = defaultColors.primary,
  textColor = defaultColors.text,
  accentColor = defaultColors.accent,
  accentTextColor = defaultColors.accentText,
  showImages = true,
  className = "",
}) => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      className={`w-full ${backgroundColor} py-12 px-4 sm:px-6 lg:px-8 overflow-hidden ${textColor} ${className}`}
      ref={containerRef}
    >
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center tracking-tight">
            <span className="inline-block">
              <span className="relative inline-block">
                <span className="relative">Interactive Timeline</span>
              </span>
            </span>
          </h2>

          <div className="relative">
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 h-full w-1 ${primaryColor} rounded-full`}
            ></div>

            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              const eventColor = event.color ? colorMap[event.color] : primaryColor;

              return (
                <motion.div
                  key={event.id}
                  className={`relative mb-12 md:mb-16 ${
                    isEven ? "md:ml-auto" : "md:mr-auto"
                  } md:w-1/2 flex ${isEven ? "md:justify-start" : "md:justify-end"}`}
                  initial={{ opacity: 0, x: isEven ? 50 : -50, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div
                    className={`absolute left-1/2 md:left-auto ${
                      isEven ? "md:left-0" : "md:right-0"
                    } top-0 transform -translate-x-1/2 ${
                      isEven ? "md:translate-x-0" : "md:translate-x-0"
                    } z-20`}
                  >
                    <motion.div
                      className={`w-9 h-9 rounded-full ${eventColor} flex items-center justify-center border-4 border-black/40 cursor-pointer`}
                      whileHover={{ scale: 1.2 }}
                      onClick={() =>
                        setActiveEvent(activeEvent === event.id ? null : event.id)
                      }
                    >
                      {event.icon || (
                        <span className="text-black/70 font-bold text-xs">
                          {index + 1}
                        </span>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    className={`relative z-10 bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl w-full md:w-[calc(100%-1.5rem)] ${
                      isEven ? "md:ml-10" : "md:mr-10"
                    } border border-white/15`}
                    whileHover={{
                      y: -5,
                      x: isEven ? 5 : -5,
                      transition: { duration: 0.3 },
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `perspective(1000px) rotateY(${
                        mousePosition.x * (isEven ? -3 : 3)
                      }deg) rotateX(${mousePosition.y * -3}deg)`,
                    }}
                    onMouseEnter={() => setActiveEvent(event.id)}
                    onMouseLeave={() => setActiveEvent(null)}
                  >
                    {showImages && event.image ? (
                      <div className="relative h-40 overflow-hidden">
                        <motion.img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1.2 }}
                          animate={{
                            scale: activeEvent === event.id ? 1.05 : 1,
                            y: activeEvent === event.id ? -10 : 0,
                          }}
                          transition={{ duration: 0.8 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                        {event.category ? (
                          <div className="absolute top-3 right-3">
                            <span
                              className={`${accentColor} px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase`}
                            >
                              {event.category}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-mono ${accentTextColor} tracking-wider`}>
                          {event.date}
                        </span>

                        <motion.div
                          className={`w-2.5 h-2.5 rounded-full ${eventColor}`}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                        />
                      </div>

                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>

                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: activeEvent === event.id ? "auto" : 0,
                          opacity: activeEvent === event.id ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-300/90 mt-2 leading-relaxed text-sm whitespace-pre-line">
                          {event.description}
                        </p>

                        {event.link ? (
                          <a
                            href={event.link.url}
                            className={`inline-block mt-3 px-3 py-1.5 ${primaryColor} hover:bg-opacity-80 rounded-lg text-sm font-medium transition-all duration-200 transform hover:-translate-y-1`}
                          >
                            {event.link.text}
                          </a>
                        ) : null}
                      </motion.div>
                    </div>

                    <motion.div
                      className={`absolute bottom-0 left-0 h-1 ${eventColor}`}
                      initial={{ width: "0%" }}
                      animate={{ width: activeEvent === event.id ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Timeline3D;
