import * as React from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  authors: string;
  conference: string;
  publicationDate: string;
  abstract: string;
  badgeText: string;
  links: { label: string; href: string; icon: LucideIcon; delay: string }[];
  collapsedHeight?: string;
  expandedHeight?: string;
  expandable?: boolean;
  accentFrom?: string;
  accentTo?: string;
}

const GlassCard = React.forwardRef(function GlassCard(
  {
    title,
    authors,
    conference,
    publicationDate,
    abstract,
    badgeText,
    links,
    collapsedHeight = "h-[360px]",
    expandedHeight = "h-[560px]",
    expandable = true,
    accentFrom = "#8b5cf6",
    accentTo = "#22d3ee",
    className,
    ...props
  }: GlassCardProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [expanded, setExpanded] = React.useState(false);
  const showExpandedContent = expandable && expanded;

  return (
    <div
      ref={ref}
      className={`group ${showExpandedContent ? expandedHeight : collapsedHeight} w-full max-w-[320px] [perspective:1000px] transition-[height] duration-300 ease-out ${className ?? ""}`}
      {...props}
    >
      <div
        className={`relative h-full overflow-hidden rounded-[50px] shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] ${
          showExpandedContent
            ? "bg-black/95 backdrop-blur-xl ring-1 ring-white/20"
            : "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"
        } md:group-hover:[box-shadow:rgba(0,0,0,0.3)_30px_50px_25px_-40px,rgba(0,0,0,0.1)_0px_25px_30px_0px] md:group-hover:[transform:rotate3d(1,1,0,30deg)]`}
      >
        <div
          className="absolute -bottom-10 left-8 h-64 w-40 rounded-[32px] blur-[18px] opacity-80"
          style={{
            background: `linear-gradient(180deg, ${accentFrom}, ${accentTo})`,
            transform: "skewX(-12deg)",
          }}
        />
        <div
          className="absolute -bottom-6 right-12 h-52 w-36 rounded-[28px] blur-[22px] opacity-70"
          style={{
            background: `linear-gradient(180deg, ${accentTo}, ${accentFrom})`,
            transform: "skewX(12deg)",
          }}
        />
        <div className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-60" />
        <div className="absolute inset-2 rounded-[55px] border-b border-l border-white/10 bg-gradient-to-b from-white/12 to-white/3 backdrop-blur-sm [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"></div>
        <div className="absolute inset-0 [transform:translate3d(0,0,26px)]">
          <div className="px-7 pt-[70px] pb-0">
            <span className="block text-xs uppercase tracking-[0.3em] text-white/60">
              {publicationDate}
            </span>
            <span className="mt-2 block text-xl font-black text-white">
              {title}
            </span>
            <span className="mt-3 block text-[13px] text-zinc-300">
              {authors}
            </span>
            <span className="mt-2 block text-[12px] text-zinc-400">
              {conference}
            </span>
            {showExpandedContent && (
              <div className="mt-4 max-h-40 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Abstract
                </div>
                <p className="mt-2 line-clamp-6 text-[12px] leading-relaxed text-zinc-300">
                  {abstract}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between [transform-style:preserve-3d] [transform:translate3d(0,0,26px)]">
          <div className="flex gap-2.5 [transform-style:preserve-3d]">
            {links.map(({ icon: Icon, delay, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group/social grid h-[30px] w-[30px] place-content-center rounded-full border-none bg-white shadow-[rgba(0,0,0,0.5)_0px_7px_5px_-5px] transition-all duration-200 ease-in-out group-hover:[box-shadow:rgba(0,0,0,0.2)_-5px_20px_10px_0px] group-hover:[transform:translate3d(0,0,50px)] hover:bg-black"
                style={{ transitionDelay: delay }}
                aria-label={label}
              >
                <Icon className="h-4 w-4 stroke-black transition-colors" />
              </a>
            ))}
          </div>
          {expandable ? (
            <div className="flex w-2/5 cursor-pointer items-center justify-end transition-all duration-200 ease-in-out hover:[transform:translate3d(0,0,10px)]">
              <button
                className="border-none bg-none text-xs font-bold text-white"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Hide" : "View more"}
              </button>
              <ChevronDown
                className={`h-4 w-4 stroke-white transition-transform ${expanded ? "rotate-180" : ""
                  }`}
                strokeWidth={3}
              />
            </div>
          ) : null}
        </div>
        <div className="absolute top-0 right-0 [transform-style:preserve-3d]">
          {[
            { size: "170px", pos: "8px", z: "20px", delay: "0s" },
            { size: "140px", pos: "10px", z: "40px", delay: "0.4s" },
            { size: "110px", pos: "17px", z: "60px", delay: "0.8s" },
            { size: "80px", pos: "23px", z: "80px", delay: "1.2s" },
          ].map((circle, index) => (
            <div
              key={index}
              className="absolute aspect-square rounded-full bg-white/10 shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out"
              style={{
                width: circle.size,
                top: circle.pos,
                right: circle.pos,
                transform: `translate3d(0, 0, ${circle.z})`,
                transitionDelay: circle.delay,
              }}
            ></div>
          ))}
          <div
            className="absolute grid aspect-square w-[50px] place-content-center rounded-full bg-white shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out [transform:translate3d(0,0,100px)] [transition-delay:1.6s] group-hover:[transform:translate3d(0,0,120px)]"
            style={{ top: "30px", right: "30px" }}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
              {badgeText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

GlassCard.displayName = "GlassCard";

export default GlassCard;
