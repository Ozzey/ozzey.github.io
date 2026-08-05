import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

const talks = [
  {
    id: "bWT1mbKHU4M",
    title:
      "Using Multi-Task Reinforcement Learning for Multi-Functional Robots — DataFest 2024",
    gradientFrom: "#60a5fa",
    gradientTo: "#a855f7",
  },
  {
    id: "ULrNaeC2dIk",
    title:
      "Reviews of planning methods for solving modern robotics problems — seminar 22 (Center for Cognitive Modeling MIPT)",
    gradientFrom: "#f97316",
    gradientTo: "#facc15",
  },
  {
    id: "7qlOURjFRMQ",
    title: "Using Multi-Task Reinforcement Learning for Manipulation Tasks",
    gradientFrom: "#22d3ee",
    gradientTo: "#38bdf8",
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

function TalkCard({
  id,
  title,
  gradientFrom,
  gradientTo,
}: {
  id: string;
  title: string;
  gradientFrom: string;
  gradientTo: string;
}) {
  return (
    <div className="group relative mx-auto my-8 h-[500px] w-full max-w-[360px] transition-all duration-500 sm:m-[40px_30px] sm:h-[520px]">
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
      <div className="relative z-20 left-0 p-6 bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] shadow-lg rounded-lg text-white transition-all duration-500 sm:p-[24px_40px] sm:group-hover:left-[-25px] sm:group-hover:p-[60px_40px]">
        <h3 className="text-xl mb-4 font-semibold">{title}</h3>
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${id}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function DisplayCard({
  className,
  icon,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
}: {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={`relative flex min-h-36 w-full max-w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-white/5 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:hidden after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-black after:to-transparent after:content-[''] hover:border-white/20 hover:bg-white/10 sm:after:block [&>*]:flex [&>*]:items-center [&>*]:gap-2 ${className ?? ""}`}
    >
      <div>
        <span className="relative inline-block rounded-full bg-blue-800 p-1">
          <span className={iconClassName}>{icon}</span>
        </span>
        <p className={`text-lg font-medium ${titleClassName}`}>{title}</p>
      </div>
      <p className="text-base leading-relaxed text-white/90 sm:text-lg">{description}</p>
      <p className="text-white/50 text-sm">{date}</p>
    </div>
  );
}

function DisplayCards() {
  const defaultCards = [
    {
      className:
        "sm:[grid-area:stack] hover:-translate-y-2 sm:hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/20 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
      title: "Research Notes",
      description: "Deep dives and quick experiments",
      date: "Monthly",
    },
    {
      className:
        "sm:[grid-area:stack] sm:translate-x-16 sm:translate-y-10 hover:-translate-y-2 sm:hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/20 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
      title: "Lab Updates",
      description: "Milestones, demos, and releases",
      date: "Quarterly",
      titleClassName: "text-emerald-300",
      iconClassName: "text-emerald-300",
    },
    {
      className: "sm:[grid-area:stack] sm:translate-x-32 sm:translate-y-20 sm:hover:translate-y-10",
      title: "Weekly Sparks",
      description: "Short insights and links",
      date: "Weekly",
      titleClassName: "text-purple-300",
      iconClassName: "text-purple-300",
    },
  ];

  return (
    <div className="flex flex-col gap-4 opacity-100 animate-in fade-in-0 duration-700 sm:grid sm:min-h-[280px] sm:[grid-template-areas:'stack'] sm:place-items-center">
      {defaultCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}

export function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <WaveBackground />
      <div className="relative z-10 px-4 pt-24 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <Card className="w-full bg-black/[0.96] relative overflow-hidden mb-16">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            <div className="p-6 sm:p-10">
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  Talks
                </h1>
                <p className="mt-3 text-neutral-300 max-w-2xl">
                  Recordings and seminars on reinforcement learning, planning, and robotics.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-center">
                {talks.map((talk) => (
                  <TalkCard key={talk.id} {...talk} />
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-16 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Newsletters
            </h2>
            <p className="mt-3 text-neutral-300 max-w-2xl">
              Short-form insights, experiments, and updates.
            </p>
          </div>

          <DisplayCards />
        </div>
      </div>
    </div>
  );
}
