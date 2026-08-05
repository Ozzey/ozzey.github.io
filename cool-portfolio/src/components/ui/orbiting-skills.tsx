"use client";

import React, { useEffect, useState, memo } from "react";
import { Bot, Orbit, Zap, Network, Code2, Braces } from "lucide-react";

type IconType = "ros" | "mujoco" | "jax" | "rllib" | "python" | "cpp";
type GlowColor = "cyan" | "purple";

interface SkillIconProps {
  type: IconType;
}

interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  iconType: IconType;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
}

interface OrbitingSkillProps {
  config: SkillConfig;
  angle: number;
}

interface GlowingOrbitPathProps {
  radius: number;
  glowColor?: GlowColor;
  animationDelay?: number;
}

const iconComponents: Record<
  IconType,
  { component: () => React.JSX.Element; color: string }
> = {
  ros: {
    component: () => <Bot className="w-full h-full text-white" />,
    color: "#E5E7EB",
  },
  mujoco: {
    component: () => <Orbit className="w-full h-full text-white" />,
    color: "#E5E7EB",
  },
  jax: {
    component: () => <Zap className="w-full h-full text-white" />,
    color: "#E5E7EB",
  },
  rllib: {
    component: () => <Network className="w-full h-full text-white" />,
    color: "#E5E7EB",
  },
  python: {
    component: () => <Code2 className="w-full h-full text-white" />,
    color: "#E5E7EB",
  },
  cpp: {
    component: () => <Braces className="w-full h-full text-white" />,
    color: "#E5E7EB",
  },
};

const SkillIcon = memo(({ type }: SkillIconProps) => {
  const IconComponent = iconComponents[type]?.component;
  return IconComponent ? <IconComponent /> : null;
});
SkillIcon.displayName = "SkillIcon";

const skillsConfig: SkillConfig[] = [
  {
    id: "ros",
    orbitRadius: 85,
    size: 34,
    speed: 1,
    iconType: "ros",
    phaseShift: 0,
    glowColor: "cyan",
    label: "ROS",
  },
  {
    id: "mujoco",
    orbitRadius: 85,
    size: 36,
    speed: 1,
    iconType: "mujoco",
    phaseShift: (2 * Math.PI) / 3,
    glowColor: "cyan",
    label: "MuJoCo",
  },
  {
    id: "jax",
    orbitRadius: 85,
    size: 34,
    speed: 1,
    iconType: "jax",
    phaseShift: (4 * Math.PI) / 3,
    glowColor: "cyan",
    label: "JAX",
  },
  {
    id: "isaac",
    orbitRadius: 85,
    size: 34,
    speed: 1,
    iconType: "rllib",
    phaseShift: (6 * Math.PI) / 3,
    glowColor: "cyan",
    label: "Isaac Sim",
  },
  {
    id: "rllib",
    orbitRadius: 150,
    size: 42,
    speed: -0.6,
    iconType: "rllib",
    phaseShift: 0,
    glowColor: "purple",
    label: "Ray RLlib",
  },
  {
    id: "python",
    orbitRadius: 150,
    size: 40,
    speed: -0.6,
    iconType: "python",
    phaseShift: (2 * Math.PI) / 3,
    glowColor: "purple",
    label: "Python",
  },
  {
    id: "cpp",
    orbitRadius: 150,
    size: 36,
    speed: -0.6,
    iconType: "cpp",
    phaseShift: (4 * Math.PI) / 3,
    glowColor: "purple",
    label: "C/C++",
  },
  {
    id: "gym",
    orbitRadius: 150,
    size: 36,
    speed: -0.6,
    iconType: "jax",
    phaseShift: (6 * Math.PI) / 3,
    glowColor: "purple",
    label: "Gym",
  },
];

const OrbitingSkill = memo(({ config, angle }: OrbitingSkillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, iconType, label } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative w-full h-full p-2 bg-white/5 backdrop-blur-sm
          rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer
          ${isHovered ? "scale-125 shadow-2xl" : "shadow-lg hover:shadow-xl"}
        `}
        style={{
          boxShadow: isHovered
            ? `0 0 30px ${iconComponents[iconType]?.color}40, 0 0 60px ${iconComponents[iconType]?.color}20`
            : undefined,
        }}
      >
        <SkillIcon type={iconType} />
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 backdrop-blur-sm rounded text-xs text-white whitespace-nowrap pointer-events-none border border-white/10">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = "OrbitingSkill";

const GlowingOrbitPath = memo(
  ({ radius, glowColor = "cyan", animationDelay = 0 }: GlowingOrbitPathProps) => {
    const glowColors = {
      cyan: {
        primary: "rgba(148, 163, 184, 0.35)",
        secondary: "rgba(148, 163, 184, 0.18)",
        border: "rgba(148, 163, 184, 0.25)",
      },
      purple: {
        primary: "rgba(148, 163, 184, 0.3)",
        secondary: "rgba(148, 163, 184, 0.16)",
        border: "rgba(148, 163, 184, 0.22)",
      },
    };

    const colors = glowColors[glowColor] || glowColors.cyan;

    return (
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          animationDelay: `${animationDelay}s`,
        }}
      >
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`,
            boxShadow: `0 0 50px ${colors.primary}, inset 0 0 40px ${colors.secondary}`,
            animation: "pulse 4s ease-in-out infinite",
            animationDelay: `${animationDelay}s`,
          }}
        />

        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid ${colors.border}`,
            boxShadow: `inset 0 0 14px ${colors.secondary}`,
          }}
        />
      </div>
    );
  },
);
GlowingOrbitPath.displayName = "GlowingOrbitPath";

export default function OrbitingSkills() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime((prevTime) => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }> = [
    { radius: 85, glowColor: "cyan", delay: 0 },
    { radius: 150, glowColor: "purple", delay: 1.5 },
  ];

  return (
    <main className="w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #374151 0%, transparent 50%), radial-gradient(circle at 75% 75%, #4B5563 0%, transparent 50%)",
          }}
        />
      </div>

      <div
        className="relative w-[calc(100vw-60px)] h-[calc(100vw-60px)] md:w-[360px] md:h-[360px] flex items-center justify-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center z-10 relative shadow-2xl">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse"></div>
          <div
            className="absolute inset-0 rounded-full bg-white/5 blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="relative z-10 text-white/90 text-xs font-semibold tracking-widest">
            TOOLS
          </div>
        </div>

        {orbitConfigs.map((config) => (
          <GlowingOrbitPath
            key={`path-${config.radius}`}
            radius={config.radius}
            glowColor={config.glowColor}
            animationDelay={config.delay}
          />
        ))}

        {skillsConfig.map((config) => {
          const angle = time * config.speed + (config.phaseShift || 0);
          return <OrbitingSkill key={config.id} config={config} angle={angle} />;
        })}
      </div>
    </main>
  );
}
