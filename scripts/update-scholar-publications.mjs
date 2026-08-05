#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const scholarOrigin = "https://scholar.google.com";
const scholarUserId = process.env.SCHOLAR_USER_ID || "Oh6dzkoAAAAJ";
const scholarLanguage = process.env.SCHOLAR_HL || "en";
const pageSize = Number.parseInt(process.env.SCHOLAR_PAGE_SIZE || "100", 10);
const indexPath = path.join(rootDir, "index.html");
const dataPath = path.join(rootDir, "data", "scholar-publications.json");

const startMarker = "<!-- SCHOLAR_PUBLICATIONS_START -->";
const endMarker = "<!-- SCHOLAR_PUBLICATIONS_END -->";

const featuredTitlePatterns = [
  /^m3po:/i,
  /^knowledge-guided manipulation using multi-task reinforcement learning$/i,
];

const args = new Set(process.argv.slice(2));
const includeFeatured = args.has("--include-featured");
const dryRun = args.has("--dry-run");

async function main() {
  const publications = await fetchAllPublications();
  if (publications.length === 0) {
    throw new Error("No publications were parsed from the Google Scholar profile.");
  }

  const visiblePublications = includeFeatured
    ? publications
    : publications.filter((publication) => !isFeaturedPublication(publication.title));

  if (visiblePublications.length === 0) {
    throw new Error("All parsed publications were filtered out.");
  }

  if (dryRun) {
    console.log(JSON.stringify({ source: scholarProfileUrl(0), publications: visiblePublications }, null, 2));
    return;
  }

  await mkdir(path.dirname(dataPath), { recursive: true });
  await writeFile(
    dataPath,
    `${JSON.stringify(
      {
        source: scholarProfileUrl(0),
        fetchedAt: new Date().toISOString(),
        publications,
        renderedPublications: visiblePublications,
      },
      null,
      2
    )}\n`
  );

  const indexHtml = await readFile(indexPath, "utf8");
  const updatedIndexHtml = replaceGeneratedBlock(indexHtml, visiblePublications);
  await writeFile(indexPath, updatedIndexHtml);

  console.log(`Updated ${path.relative(rootDir, dataPath)} with ${publications.length} Scholar publications.`);
  console.log(`Updated ${path.relative(rootDir, indexPath)} with ${visiblePublications.length} rendered publications.`);
}

async function fetchAllPublications() {
  const publications = [];
  let cstart = 0;

  while (cstart < 1000) {
    const html = await fetchScholarPage(cstart);
    const pagePublications = parseScholarPublications(html);

    publications.push(...pagePublications);

    if (pagePublications.length < pageSize) {
      break;
    }

    cstart += pageSize;
    await delay(900);
  }

  return dedupePublications(publications).sort((a, b) => {
    const yearDifference = Number.parseInt(b.year || "0", 10) - Number.parseInt(a.year || "0", 10);
    return yearDifference || a.order - b.order;
  });
}

async function fetchScholarPage(cstart) {
  const response = await fetch(scholarProfileUrl(cstart), {
    headers: {
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
  });

  const html = await response.text();

  if (!response.ok) {
    throw new Error(`Google Scholar returned HTTP ${response.status}.`);
  }

  if (isScholarBlockPage(html)) {
    throw new Error("Google Scholar returned a block/captcha page instead of the profile.");
  }

  return html;
}

function scholarProfileUrl(cstart) {
  const params = new URLSearchParams({
    user: scholarUserId,
    hl: scholarLanguage,
    cstart: String(cstart),
    pagesize: String(pageSize),
    sortby: "pubdate",
  });

  return `${scholarOrigin}/citations?${params.toString()}`;
}

function parseScholarPublications(html) {
  const rows = [...html.matchAll(/<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g)];

  return rows
    .map(([, row], index) => parseScholarRow(row, index))
    .filter((publication) => publication && publication.title);
}

function parseScholarRow(row, order) {
  const titleAnchor = row.match(/<a\b(?=[^>]*class="[^"]*\bgsc_a_at\b)[^>]*>[\s\S]*?<\/a>/);
  if (!titleAnchor) {
    return null;
  }

  const rawUrl = titleAnchor[0].match(/href="([^"]+)"/)?.[1] || "";
  const rawTitle = titleAnchor[0].replace(/^<a\b[^>]*>/, "").replace(/<\/a>$/, "");
  const grayFields = [...row.matchAll(/<div class="gs_gray">([\s\S]*?)<\/div>/g)].map(([, value]) =>
    cleanText(value)
  );
  const yearMatch = row.match(/<span class="gsc_a_h[^"]*"[^>]*>([\s\S]*?)<\/span>/);
  const venue = cleanVenue(grayFields[1] || "");

  return {
    title: cleanText(rawTitle),
    authors: grayFields[0] || "",
    venue,
    year: resolveYear(yearMatch ? cleanText(yearMatch[1]) : "", venue),
    url: absoluteScholarUrl(rawUrl),
    order,
  };
}

function replaceGeneratedBlock(html, publications) {
  const block = renderGeneratedBlock(publications);
  const markerPattern = new RegExp(`[ \\t]*${escapeRegExp(startMarker)}[\\s\\S]*?[ \\t]*${escapeRegExp(endMarker)}`);

  if (markerPattern.test(html)) {
    return `${html.replace(markerPattern, block).trimEnd()}\n`;
  }

  throw new Error(`Could not find the ${startMarker} generated publication block.`);
}

function renderGeneratedBlock(publications) {
  return [
    `                ${startMarker}`,
    "                <!-- Generated by scripts/update-scholar-publications.mjs. Do not edit by hand. -->",
    "                <ul>",
    publications.map(renderPublication).join("\n"),
    "                </ul>",
    `                ${endMarker}`,
  ].join("\n");
}

function renderPublication(publication) {
  const title = publication.url
    ? `<a href="${escapeAttribute(publication.url)}">${escapeHtml(publication.title)}</a>`
    : escapeHtml(publication.title);
  const authors = publication.authors
    ? `                            <small>${escapeHtml(publication.authors)}</small>`
    : "";
  const venue = publication.venue ? `                            <em>${escapeHtml(publication.venue)}</em>` : "";

  return [
    "                    <li>",
    `                        <span>${escapeHtml(publication.year || "n.d.")}</span>`,
    "                        <div>",
    `                            <strong>${title}</strong>`,
    authors,
    venue,
    "                        </div>",
    "                    </li>",
  ]
    .filter(Boolean)
    .join("\n");
}

function dedupePublications(publications) {
  const seen = new Set();

  return publications.filter((publication) => {
    const key = normalizeComparableTitle(publication.title);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isFeaturedPublication(title) {
  const comparableTitle = normalizeComparableTitle(title);
  return featuredTitlePatterns.some((pattern) => pattern.test(comparableTitle));
}

function normalizeComparableTitle(value) {
  return cleanText(value).toLowerCase();
}

function absoluteScholarUrl(rawUrl) {
  const decodedUrl = decodeHtml(rawUrl);
  if (decodedUrl.startsWith("http")) {
    return decodedUrl;
  }

  return `${scholarOrigin}${decodedUrl}`;
}

function isScholarBlockPage(html) {
  return (
    !html.includes("gsc_a_tr") &&
    /captcha|unusual traffic|not a robot|sorry/i.test(cleanText(html))
  );
}

function cleanText(value) {
  return toAsciiPunctuation(decodeHtml(stripTags(value))).replace(/\s+/g, " ").trim();
}

function cleanVenue(value) {
  return cleanText(value).replace(/,\s*0$/, "");
}

function resolveYear(rawYear, venue) {
  if (/^(19|20)\d{2}$/.test(rawYear)) {
    return rawYear;
  }

  return venue.match(/\b((?:19|20)\d{2})\b/)?.[1] || "";
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, "");
}

function decodeHtml(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "...",
    lt: "<",
    nbsp: " ",
    quot: '"',
    rsquo: "'",
    lsquo: "'",
    rdquo: '"',
    ldquo: '"',
  };

  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&([a-zA-Z]+);/g, (entity, name) => namedEntities[name] ?? entity);
}

function toAsciiPunctuation(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[\u00b9\u00b2\u00b3\u2070-\u2079]/g, "")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return replacements[character];
  });
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
