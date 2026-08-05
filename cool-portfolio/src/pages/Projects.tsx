import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { CardStack, type CardStackItem } from "@/components/ui/card-stack";
import cryptolabImage from "@/assets/cryptolab.png";
import gtaviImage from "@/assets/gtavi.png";
import koenigseggImage from "@/assets/koenigsegg.jpg";

const mainProjects = [
  {
    title: "BenchLab",
    desc: "Benchmarking lab for reproducible robotics and RL evaluations at scale.",
    gradientFrom: "#f59e0b",
    gradientTo: "#ef4444",
  },
  {
    title: "Super-Cupheads",
    desc: "High-intensity, co-op gameplay experiments with agent-driven difficulty.",
    gradientFrom: "#10b981",
    gradientTo: "#38bdf8",
  },
  {
    title: "AZEROTH - Action-Zoned Environment Representation & Online Training Hub",
    desc: "Unified environment encoding with live training orchestration for agents.",
    gradientFrom: "#6366f1",
    gradientTo: "#f43f5e",
  },
  {
    title: "GUILD - Generalized Unified Inference for Liquidity & Decisions",
    desc: "Decision intelligence stack for liquidity-aware inference and planning.",
    gradientFrom: "#ec4899",
    gradientTo: "#8b5cf6",
  },
];

const sideQuests = [
  {
    id: 1,
    title: "CryptoLab",
    description: "Crypto currency trading dashboard",
    imageSrc: cryptolabImage,
    href: "#",
  },
  {
    id: 2,
    title: "GTA-VI Countdown",
    description: "Release countdown experience with trailers and socials",
    imageSrc: gtaviImage,
    href: "/sidequests/gtavi/",
  },
  {
    id: 3,
    title: "Koenigsegg Landing Page",
    description: "High-end automotive landing page concept",
    imageSrc: koenigseggImage,
    href: "https://64351f46db97f72605148337--illustrious-entremet-ff6cbd.netlify.app/",
  },
];

function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    const waveData = Array.from({ length: 8 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
    }));

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const updateWaveData = () => {
      waveData.forEach((data) => {
        if (Math.random() < 0.01) data.targetValue = Math.random() * 0.7 + 0.1;
        const diff = data.targetValue - data.value;
        data.value += diff * data.speed;
      });
    };

    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.04 + freq * 0.03;
          const py =
            Math.sin(px * 10 + time) *
            Math.cos(px * 2) *
            freq *
            0.1 *
            ((i + 1) / 8);
          const y = (py + 1) * canvas.height * 0.5;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const intensity = Math.min(1, freq * 0.3);
        const r = 79 + intensity * 80;
        const g = 70 + intensity * 80;
        const b = 229;
        ctx.lineWidth = 1 + i * 0.3;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    };

    let raf = 0;
    const animate = () => {
      time += 0.02;
      updateWaveData();
      draw();
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 h-full w-full" />;
}

function SkewCard({
  title,
  desc,
  gradientFrom,
  gradientTo,
  imageSrc,
}: {
  title: string;
  desc: string;
  gradientFrom: string;
  gradientTo: string;
  imageSrc?: string;
}) {
  return (
    <div className="group relative w-[320px] h-[460px] m-[40px_30px] transition-all duration-500">
      <span
        className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
        style={{ background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})` }}
      />
      <span
        className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
        style={{ background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})` }}
      />
      <span className="pointer-events-none absolute inset-0 z-10">
        <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.08)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.2)] transition-all duration-100 animate-blob group-hover:top-[-50px] group-hover:left-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
        <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-[rgba(255,255,255,0.08)] backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.2)] transition-all duration-500 animate-blob animation-delay-1000 group-hover:bottom-[-50px] group-hover:right-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
      </span>
      <div className="relative z-20 left-0 p-[24px_40px] bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] shadow-lg rounded-lg text-white transition-all duration-500 group-hover:left-[-25px] group-hover:p-[60px_40px]">
        <div className="mb-4 h-28 w-full rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`${title} diagram`}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>
        <h3 className="text-2xl mb-2 font-semibold">{title}</h3>
        <p className="text-base leading-relaxed text-white/80 mb-4">{desc}</p>
        <button className="inline-block text-sm font-bold text-black bg-white px-3 py-2 rounded hover:bg-white/90 transition">
          Read More
        </button>
      </div>
    </div>
  );
}

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <WaveBackground />
      <div className="relative z-10 pt-28 px-6">
        <div className="mx-auto max-w-6xl">
          <Card className="w-full bg-black/[0.96] relative overflow-hidden mb-16">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            <div className="p-10">
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  Flagship Builds
                </h1>
                <p className="mt-3 text-neutral-300 max-w-2xl">
                  Selected deep dives that anchor the portfolio, spanning robotics, games, and decision systems.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center">
                {mainProjects.map((project) => (
                  <SkewCard key={project.title} {...project} />
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-16 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Side Quests
            </h2>
            <p className="mt-3 text-neutral-300 max-w-2xl">
              Smaller experiments and tools that sharpen the craft.
            </p>
          </div>

          <div className="mt-4">
            <CardStack
              items={sideQuests as CardStackItem[]}
              initialIndex={0}
              autoAdvance
              intervalMs={2200}
              pauseOnHover
              showDots
              cardWidth={520}
              cardHeight={320}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
