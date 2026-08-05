import GlassCard from "@/components/ui/glass-card";
import { BookOpen, ExternalLink, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useEffect, useMemo, useState } from "react";
import scholarData from "../../../data/scholar-publications.json";

interface ScholarPublication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url: string;
  order?: number;
}

interface ScholarData {
  publications: ScholarPublication[];
}

const accentPairs = [
  ["#60a5fa", "#a855f7"],
  ["#22d3ee", "#38bdf8"],
  ["#f97316", "#facc15"],
  ["#34d399", "#22c55e"],
  ["#a78bfa", "#f472b6"],
  ["#ec4899", "#8b5cf6"],
] as const;

const publications = (scholarData as ScholarData).publications;

const featuredPaperPages: Record<string, string> = {
  "Knowledge-Guided Manipulation Using Multi-Task Reinforcement Learning":
    "/papers/kg-m3po/",
  "M3PO: Massively Multi-Task Model-Based Policy Optimization": "/papers/m3po/",
};

function getBadgeText(venue: string) {
  const upper = venue.toUpperCase();
  if (upper.includes("ICRA")) return "A*";
  if (upper.includes("RSS")) return "A*";
  if (upper.includes("IROS")) return "A";
  if (upper.includes("ARXIV")) return "PRE";
  if (upper.includes("WORKSHOP")) return "WS";
  return "PUB";
}

function getArxivId(venue: string) {
  return venue.match(/arXiv:([0-9.]+)/i)?.[1];
}

function buildScholarSearchUrl(title: string) {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
}

function buildLinks(publication: ScholarPublication, pageHref?: string) {
  const links = [
    {
      label: "Scholar",
      href: publication.url || buildScholarSearchUrl(publication.title),
      icon: BookOpen,
      delay: "400ms",
    },
  ];

  const arxivId = getArxivId(publication.venue);
  if (arxivId) {
    links.push({
      label: "PDF",
      href: `https://arxiv.org/pdf/${arxivId}`,
      icon: FileText,
      delay: "600ms",
    });
  }

  if (pageHref) {
    links.push({
      label: "Page",
      href: pageHref,
      icon: ExternalLink,
      delay: "800ms",
    });
  }

  return links;
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function extractAbstractFromPage(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const heading = Array.from(doc.querySelectorAll("h2")).find(
    (node) => normalizeText(node.textContent ?? "").toLowerCase() === "abstract",
  );
  const container = heading?.closest(".column") ?? heading?.parentElement;
  const paragraphs = Array.from(container?.querySelectorAll("p") ?? [])
    .map((paragraph) => normalizeText(paragraph.textContent ?? ""))
    .filter(Boolean);

  return paragraphs.join(" ");
}

export function PublicationsPage() {
  const [featuredAbstracts, setFeaturedAbstracts] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedAbstracts() {
      const entries = await Promise.all(
        Object.entries(featuredPaperPages).map(async ([title, pageHref]) => {
          try {
            const response = await fetch(pageHref);
            if (!response.ok) return [title, ""] as const;

            const html = await response.text();
            return [title, extractAbstractFromPage(html)] as const;
          } catch {
            return [title, ""] as const;
          }
        }),
      );

      if (!cancelled) {
        setFeaturedAbstracts(Object.fromEntries(entries));
      }
    }

    loadFeaturedAbstracts().catch(() => {
      if (!cancelled) setFeaturedAbstracts({});
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedPapers = useMemo(
    () =>
      publications
        .map((publication, index) => {
          const accent = accentPairs[index % accentPairs.length];
          const pageHref = featuredPaperPages[publication.title];

          return {
            title: publication.title,
            authors: publication.authors,
            conference: publication.venue,
            publicationDate: publication.year,
            abstract: pageHref ? featuredAbstracts[publication.title] ?? "Loading abstract..." : "",
            links: buildLinks(publication, pageHref),
            featured: Boolean(pageHref),
            accentFrom: accent[0],
            accentTo: accent[1],
          };
        })
        .sort((a, b) => {
          const aYear = Number.parseInt(a.publicationDate, 10);
          const bYear = Number.parseInt(b.publicationDate, 10);
          return bYear - aYear || a.title.localeCompare(b.title);
        }),
    [featuredAbstracts],
  );

  const featuredPapers = sortedPapers.filter((paper) => paper.featured);
  const otherPapers = sortedPapers.filter((paper) => !paper.featured);

  const renderPaperCards = (papers: typeof sortedPapers) => (
    <div className="flex flex-wrap justify-center gap-10">
      {papers.map((paper, index) => {
        const titleLength = paper.title.length;
        const collapsedHeight =
          titleLength > 90 ? "h-[430px]" : titleLength > 70 ? "h-[400px]" : "h-[360px]";
        const expandedHeight =
          titleLength > 90 ? "h-[630px]" : titleLength > 70 ? "h-[600px]" : "h-[560px]";
        const offsetClass =
          index % 2 === 0 ? "md:-translate-y-6" : "md:translate-y-4";

        return (
          <div key={paper.title} className={`transition-transform ${offsetClass}`}>
            <GlassCard
              {...paper}
              badgeText={getBadgeText(paper.conference)}
              collapsedHeight={collapsedHeight}
              expandedHeight={expandedHeight}
              expandable={paper.featured}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <WavyBackground className="w-full">
        <div className="pt-28 px-6">
          <div className="mx-auto max-w-6xl">
            <Card className="w-full bg-black/[0.96] relative overflow-hidden p-10">
              <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
              <div className="relative space-y-16">
                <section>
                  <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                      Featured Publications
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-neutral-300">
                      Papers with dedicated project pages.
                    </p>
                  </div>
                  {renderPaperCards(featuredPapers)}
                </section>

                <section>
                  <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                      Other Publications
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm text-neutral-300">
                      Additional entries from the scraped Google Scholar profile data.
                    </p>
                  </div>
                  {renderPaperCards(otherPapers)}
                </section>
              </div>
            </Card>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
}
