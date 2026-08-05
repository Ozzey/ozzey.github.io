import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { WavyBackground } from "@/components/ui/wavy-background";
import { NowStatusCard } from "@/components/ui/now-card";
import { Timeline3D } from "@/components/ui/timeline";
import OrbitingSkills from "@/components/ui/orbiting-skills";

export function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <WavyBackground className="w-full">
        <div className="pt-28 px-6">
          <div className="mx-auto max-w-6xl">
            <Card className="w-full bg-black/[0.96] border border-white/10 relative overflow-hidden">
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
              <div className="relative h-[360px] md:h-[460px] lg:h-[560px]">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                <div className="pointer-events-none absolute inset-0 p-8 md:p-12 flex items-center">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      MBZUAI - AIRoCS Lab
                    </div>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                      Hi, I am Aditya.
                    </h1>
                    <div className="mt-2 text-xl md:text-2xl font-semibold text-white/85">
                      I make Robots smarter and safer.
                    </div>
                    <p className="mt-4 text-lg text-neutral-300 max-w-xl">
                      I am a robotics and reinforcement learning researcher working on
                      manipulation problems, in particular making the control smarter,
                      safer and more precise.
                    </p>
                    <p className="mt-3 text-sm text-neutral-400 max-w-xl">
                      I started at MBZUAI as a Research Engineer and am now a master's
                      student in the Robotics Department and AIRoCS Lab.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {["Robotic manipulation", "Planning + RL"].map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="pointer-events-auto mt-6 flex flex-wrap items-center gap-3">
                      <a
                        href="/cv/Aditya-Narendra.pdf"
                        download
                        aria-label="Download Aditya Narendra CV as a PDF"
                        className="group relative inline-flex overflow-hidden rounded-xl p-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        <span className="absolute inset-[-120%] bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0deg,#93c5fd_120deg,#c4b5fd_240deg,#ffffff_360deg)] opacity-60 blur-md transition duration-700 group-hover:rotate-180 group-hover:opacity-100" />
                        <span className="relative inline-flex items-center gap-3 rounded-xl border border-white/10 bg-black/85 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(255,255,255,0.12)] backdrop-blur-xl transition duration-300 group-hover:-translate-y-0.5 group-hover:border-white/25 group-hover:bg-black/70 group-hover:shadow-[0_0_44px_rgba(147,197,253,0.28)]">
                          <span className="flex flex-col items-start leading-tight">
                            <span>Download CV</span>
                            <span className="text-[11px] font-medium text-white/55">
                              PDF resume
                            </span>
                          </span>
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </WavyBackground>

      <div className="px-6 pt-10 pb-20">
        <div className="mx-auto max-w-6xl space-y-16">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <NowStatusCard />
            </div>
            <div>
              <Card className="w-full bg-black/[0.96] border border-white/10 relative overflow-hidden p-10">
                <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
                <div className="mb-4">
                  <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    Research interests
                  </h2>
                </div>
                <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 min-h-[320px]">
                  {[
                    {
                      title: "Reinforcement Learning",
                      description: "Generalization across mobile and bimanual tasks with RL.",
                      className:
                        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/20 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                    },
                    {
                      title: "Symbolic planning & control",
                      description: "Task-level planning + control synthesis for robust manipulation.",
                      className:
                        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-white/20 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-black/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                    },
                    {
                      title: "Robotic Manipulation",
                      description: "Evaluation pipelines that close the sim-to-real loop.",
                      className:
                        "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                    },
                    {
                      title: "Model Based Learning",
                      description: "World models and planning-aware representations for control.",
                      className:
                        "[grid-area:stack] translate-x-48 translate-y-28 hover:translate-y-16",
                    },
                  ].map((card, index) => (
                    <div
                      key={index}
                      className={`relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-white/5 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-black after:to-transparent after:content-[''] hover:border-white/20 hover:bg-white/10 ${card.className}`}
                    >
                      <div>
                        <p className="text-lg font-medium text-white">{card.title}</p>
                      </div>
                      <p className="whitespace-nowrap text-sm text-white/80">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section>
            <Timeline3D
              events={[
                {
                  id: "t-2021",
                  date: "2021",
                  title: "Started undergrad - MIPT (Applied Math & CS)",
                  description: "BSc in Applied Mathematics and Computer Science",
                  image:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDUrzEKgGR_IjaGYF0dWeK0puzzzgycDJeNA&s",
                  category: "Education",
                },
                {
                  id: "t-2023",
                  date: "2023",
                  title: "Research Intern - Center for Cognitive Modeling (MIPT)",
                  description:
                    "Deputy president of International Student Council\nFirst paper: \"Dynamic NPField\"\nPresented at ROSMeetup 2023 (Moscow)",
                  image:
                    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=60",
                  category: "Research",
                },
                {
                  id: "t-2024",
                  date: "2024",
                  title: "Promoted to Research Engineer",
                  description:
                    "Published first paper\nTravelled to Shanghai as member of foreign expert delegate",
                  image:
                    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60",
                  category: "Research",
                },
                {
                  id: "t-2025",
                  date: "2025",
                  title: "Graduated from MIPT",
                  description: "Published paper in IROS'25\nDefended thesis with perfect grade",
                  image:
                    "https://mf.b37mrtl.ru/rbthmedia/images/2020.03/original/5e6237d215e9f952d13c6287.jpg",
                  category: "Milestone",
                },
                {
                  id: "t-2026",
                  date: "2026",
                  title: "Started at MBZUAI as Research Engineer; now MSc student",
                  description:
                    "KG-M3PO accepted for ICRA'26\nJoined MBZUAI Robotics Department as MSc student in August",
                  image:
                    "https://mbzuai.ac.ae/wp-content/themes/mbzuai/fifth-assets/images/pages/fast-facts/facts-banner-right.webp",
                  category: "Research",
                },
              ]}
            />
          </section>

          <section>
            <Card className="w-full bg-black/[0.96] border border-white/10 relative overflow-hidden p-10">
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  Toolbox
                </h2>
                <div className="mt-3 grid gap-2 text-sm text-white/70 md:grid-cols-4">
                  <div>
                    <span className="text-white/90">Robotics:</span> ROS, IsaacSim
                  </div>
                  <div>
                    <span className="text-white/90">RL:</span> Gym, IsaacLab
                  </div>
                  <div>
                    <span className="text-white/90">ML:</span> JAX, Torch
                  </div>
                  <div>
                    <span className="text-white/90">Languages:</span> Python, C/C++
                  </div>
                </div>
              </div>
              <div className="relative">
                <OrbitingSkills />
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
