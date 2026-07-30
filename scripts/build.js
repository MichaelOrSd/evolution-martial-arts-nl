#!/usr/bin/env node
/**
 * Build script: generates dist/ from content/*.json + template files.
 *
 * - Injects generated HTML into index.html between <!-- BUILD:name --> markers
 * - Regenerates the Schedule / Membership / Programs sections of llms.txt
 * - Regenerates the JSON-LD structured data block
 * - Validates all content first; exits non-zero (no deploy) on any error
 *
 * Zero dependencies. Node 18+. Run: node scripts/build.js
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const PRICE_RE = /^\d+(\.\d{2})?$/;

const errors = [];
const fail = (file, msg) => errors.push(`content/${file} → ${msg}`);

// ---------- load ----------

function loadJson(name) {
  const file = path.join(ROOT, "content", name);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`content/${name} → ${e.message}`);
    return null;
  }
}

const programs = loadJson("programs.json");
const schedule = loadJson("schedule.json");
const memberships = loadJson("memberships.json");
const team = loadJson("team.json");
const site = loadJson("site.json");

// ---------- validate ----------

const nonEmpty = (v) => typeof v === "string" && v.trim().length > 0;

function checkStringList(file, label, list, min) {
  if (!Array.isArray(list) || list.length < min) {
    fail(file, `${label} must be a list with at least ${min} item(s)`);
    return;
  }
  list.forEach((s, i) => {
    if (!nonEmpty(s)) fail(file, `${label}[${i}] is empty`);
  });
}

if (programs) {
  if (!Array.isArray(programs.programs) || programs.programs.length === 0) {
    fail("programs.json", "programs must be a non-empty list");
  } else {
    programs.programs.forEach((p, i) => {
      for (const k of ["eyebrow", "title", "description"]) {
        if (!nonEmpty(p[k])) fail("programs.json", `programs[${i}].${k} is empty`);
      }
      checkStringList("programs.json", `programs[${i}].highlights`, p.highlights, 1);
    });
  }
}

if (schedule) {
  for (const day of DAYS) {
    if (!Array.isArray(schedule[day])) {
      fail("schedule.json", `missing day "${day}" (must be a list, may be empty)`);
      continue;
    }
    schedule[day].forEach((c, i) => {
      if (!nonEmpty(c.name)) fail("schedule.json", `${day}[${i}].name is empty`);
      for (const k of ["start", "end"]) {
        if (!TIME_RE.test(c[k] || "")) fail("schedule.json", `${day}[${i}].${k}: "${c[k]}" is not a valid HH:MM time`);
      }
      if (TIME_RE.test(c.start || "") && TIME_RE.test(c.end || "") && c.end <= c.start) {
        fail("schedule.json", `${day}[${i}]: end time ${c.end} must be after start time ${c.start}`);
      }
    });
  }
  for (const key of Object.keys(schedule)) {
    if (!DAYS.includes(key)) fail("schedule.json", `unexpected key "${key}"`);
  }
}

if (memberships) {
  if (!Array.isArray(memberships.plans) || memberships.plans.length === 0) {
    fail("memberships.json", "plans must be a non-empty list");
  } else {
    memberships.plans.forEach((p, i) => {
      for (const k of ["name", "period", "description"]) {
        if (!nonEmpty(p[k])) fail("memberships.json", `plans[${i}].${k} is empty`);
      }
      if (!PRICE_RE.test(p.price || "")) {
        fail("memberships.json", `plans[${i}].price: "${p.price}" must be a number like 138 or 172.50 (no $)`);
      }
      checkStringList("memberships.json", `plans[${i}].features`, p.features, 1);
    });
    const highlighted = memberships.plans.filter((p) => p.highlight === true).length;
    if (highlighted !== 1) {
      console.warn(`warning: ${highlighted} plans are highlighted (expected 1)`);
    }
  }
}

if (team) {
  const li = team.lead_instructor || {};
  for (const k of ["heading", "name", "photo", "bio"]) {
    if (!nonEmpty(li[k])) fail("team.json", `lead_instructor.${k} is empty`);
  }
  if (!Array.isArray(team.belts)) {
    fail("team.json", "belts must be a list");
  } else {
    team.belts.forEach((b, i) => {
      if (!nonEmpty(b.belt)) fail("team.json", `belts[${i}].belt is empty`);
      if (!Array.isArray(b.members)) {
        fail("team.json", `belts[${i}].members must be a list (may be empty)`);
      } else {
        b.members.forEach((m, j) => {
          if (!nonEmpty(m)) fail("team.json", `belts[${i}].members[${j}] is empty`);
        });
      }
    });
  }
}

if (site) {
  checkStringList("site.json", "seo_offers", site.seo_offers, 1);
  checkStringList("site.json", "llms_program_lines", site.llms_program_lines, 1);
}

if (errors.length > 0) {
  console.error("Build failed — fix the following content problems:\n");
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

// ---------- helpers ----------

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function timeParts(hm) {
  const [H, M] = hm.split(":").map(Number);
  return { h12: ((H + 11) % 12) + 1, M, mer: H < 12 ? "AM" : "PM" };
}

const clock = (t) => (t.M === 0 ? String(t.h12) : `${t.h12}:${String(t.M).padStart(2, "0")}`);

// "7 – 8 PM", "5:30 – 6:15 PM", "11 AM – 12 PM", "12 PM – 1 PM"
function timeRange(start, end, sep) {
  const s = timeParts(start);
  const e = timeParts(end);
  const showStartMer = s.mer !== e.mer || s.h12 === 12;
  return `${clock(s)}${showStartMer ? ` ${s.mer}` : ""}${sep}${clock(e)} ${e.mer}`;
}

function replaceBetween(html, name, block, file) {
  const open = `<!-- BUILD:${name} -->`;
  const close = `<!-- /BUILD:${name} -->`;
  for (const marker of [open, close]) {
    const first = html.indexOf(marker);
    if (first === -1) throw new Error(`${file}: marker ${marker} not found`);
    if (html.indexOf(marker, first + 1) !== -1) throw new Error(`${file}: marker ${marker} appears more than once`);
  }
  const start = html.indexOf(open) + open.length;
  const end = html.lastIndexOf("\n", html.indexOf(close));
  return html.slice(0, start) + "\n" + block + html.slice(end);
}

// ---------- HTML generators ----------

function genPrograms() {
  return programs.programs
    .map((p) => {
      const highlights = p.highlights.map((h) => `                    <li>${esc(h)}</li>`).join("\n");
      return `                <article class="card program-card carousel-slide">
                  <header class="card__header">
                    <p class="card__eyebrow">${esc(p.eyebrow)}</p>
                    <h3>${esc(p.title)}</h3>
                  </header>
                  <p class="card__description">${esc(p.description)}</p>
                  <ul class="card__highlights">
${highlights}
                  </ul>
                </article>`;
    })
    .join("\n");
}

function genSchedule() {
  return DAYS.map((day) => {
    const label = day.charAt(0).toUpperCase() + day.slice(1);
    const classes = schedule[day]
      .map((c) => {
        const note = nonEmpty(c.note) ? ` (${esc(c.note.trim())})` : "";
        return `                <li class="schedule-class">
                  <time datetime="${c.start}">${timeRange(c.start, c.end, " – ")}</time>
                  <span>${esc(c.name)}${note}</span>
                </li>`;
      })
      .join("\n");
    return `            <article class="schedule-day" role="listitem">
              <h3>${label}</h3>
              <ul>
${classes}
              </ul>
            </article>`;
  }).join("\n");
}

function genLead() {
  const li = team.lead_instructor;
  return `              <h3>${esc(li.heading)}</h3>
              <p>${esc(li.name)} – ${esc(li.bio)}</p>`;
}

function genTeam() {
  return team.belts
    .filter((b) => b.members.length > 0)
    .map((b) => `            <p><strong>${esc(b.belt)}:</strong> ${b.members.map(esc).join(", ")}</p>`)
    .join("\n");
}

function genMemberships() {
  return memberships.plans
    .map((p) => {
      const cls = p.highlight === true ? "pricing-card pricing-card--highlight carousel-slide" : "pricing-card carousel-slide";
      const features = p.features.map((f) => `                    <li>${esc(f)}</li>`).join("\n");
      return `                <article class="${cls}">
                  <header class="pricing-card__header">
                    <h3>${esc(p.name)}</h3>
                    <p class="price">$${p.price}<span>${esc(p.period)}</span></p>
                  </header>
                  <p class="pricing-card__description">${esc(p.description)}</p>
                  <ul class="pricing-card__features">
${features}
                  </ul>
                </article>`;
    })
    .join("\n");
}

function genJsonLd() {
  const offers = site.seo_offers
    .map((name) => `          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": ${JSON.stringify(name)} } }`)
    .join(",\n");
  const block = `    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MartialArtsSchool",
      "name": "Evolution Martial Arts NL",
      "url": "https://evolutionmartialartsnl.com",
      "telephone": "+17093306894",
      "email": "evolutionmartialartsnl@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "210 Kenmount Rd",
        "addressLocality": "St. John's",
        "addressRegion": "NL",
        "postalCode": "A1B 3R2",
        "addressCountry": "CA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.5610323,
        "longitude": -52.7481653
      },
      "foundingDate": "2022",
      "description": "Evolution Martial Arts NL offers Brazilian Jiu-Jitsu, Kickboxing, and functional training in St. John's, Newfoundland for all levels.",
      "sameAs": [
        "https://www.instagram.com/evolutionmartialartsnl/"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Programs",
        "itemListElement": [
${offers}
        ]
      }
    }
    </script>`;
  // self-check: the emitted JSON must parse
  const inner = block.replace(/^\s*<script[^>]*>/, "").replace(/<\/script>\s*$/, "");
  JSON.parse(inner);
  return block;
}

// ---------- llms.txt generators ----------

function replaceLlmsSection(text, heading, body) {
  const re = new RegExp(`(## ${heading}\\n)[\\s\\S]*?(?=\\n## )`);
  if (!re.test(text)) throw new Error(`llms.txt: section "## ${heading}" not found`);
  // replacer function so "$" in content (prices) is never treated as a backreference
  return text.replace(re, (m, head) => `${head}\n${body}\n`);
}

function genLlms(text) {
  const programsBody = site.llms_program_lines.map((l) => `- ${l}`).join("\n");

  const scheduleBody = DAYS.map((day) => {
    const label = day.charAt(0).toUpperCase() + day.slice(1);
    const entries = schedule[day].map((c) => {
      const note = nonEmpty(c.note) ? `, ${c.note.trim()}` : "";
      return `${c.name} (${timeRange(c.start, c.end, "-")}${note})`;
    });
    return `- ${label}: ${entries.length > 0 ? entries.join(", ") : "No classes"}`;
  }).join("\n");

  const plansBody =
    memberships.plans.map((p) => `- ${p.name}: $${p.price}${p.period}`).join("\n") +
    "\n\nAll prices are tax-in. All memberships include open mat access.";

  text = replaceLlmsSection(text, "Programs", programsBody);
  text = replaceLlmsSection(text, "Schedule", scheduleBody);
  text = replaceLlmsSection(text, "Membership Plans", plansBody);
  return text;
}

// ---------- build ----------

let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
html = replaceBetween(html, "jsonld", genJsonLd(), "index.html");
html = replaceBetween(html, "programs", genPrograms(), "index.html");
html = replaceBetween(html, "schedule", genSchedule(), "index.html");
html = replaceBetween(html, "lead", genLead(), "index.html");
html = replaceBetween(html, "team", genTeam(), "index.html");
html = replaceBetween(html, "memberships", genMemberships(), "index.html");

const llms = genLlms(fs.readFileSync(path.join(ROOT, "llms.txt"), "utf8"));

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, "index.html"), html);
fs.writeFileSync(path.join(DIST, "llms.txt"), llms);
for (const f of ["404.html", "favicon.svg", "CNAME"]) {
  fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f));
}
fs.cpSync(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true });

console.log("Build OK → dist/");
