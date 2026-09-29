#!/usr/bin/env node
/**
 * Build script: generates dist/ from content/*.json + template files.
 *
 * - Injects generated HTML (incl. the optional event banner + section) into index.html between <!-- BUILD:name --> markers
 * - Regenerates the Schedule / Membership / Programs / Upcoming Events sections of llms.txt
 * - Writes sitemap.xml; copies robots.txt
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
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const HANDLE_RE = /^[A-Za-z0-9._]{1,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
const event = loadJson("event.json");

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

if (event && event.show === true) {
  for (const k of ["title", "date", "button_text", "heading", "venue", "intro"]) {
    if (!nonEmpty(event[k])) fail("event.json", `${k} is empty (turn off "Show event" to hide it)`);
  }
  if (nonEmpty(event.date) && (!DATE_RE.test(event.date) || Number.isNaN(Date.parse(event.date)))) {
    fail("event.json", `date: "${event.date}" must be a date like 2026-11-15`);
  }
  (event.facts || []).forEach((f, i) => {
    if (!nonEmpty(f.label) || !nonEmpty(f.text)) fail("event.json", `facts[${i}] needs both a label and text`);
  });
  (event.rules || []).forEach((r, i) => {
    if (!nonEmpty(r)) fail("event.json", `rules[${i}] is empty`);
  });
  (event.fees || []).forEach((f, i) => {
    if (!nonEmpty(f.name)) fail("event.json", `fees[${i}].name is empty`);
    if (!DATE_RE.test(f.ends || "")) fail("event.json", `fees[${i}].ends: "${f.ends}" must be a date like 2026-10-02`);
    for (const k of ["kids", "adults"]) {
      if (!PRICE_RE.test(f[k] || "")) fail("event.json", `fees[${i}].${k}: "${f[k]}" must be a number like 55 (no $)`);
    }
    if (i > 0 && DATE_RE.test(f.ends || "") && f.ends <= event.fees[i - 1].ends) {
      fail("event.json", `fees[${i}].ends must be after the previous tier's end date`);
    }
  });
  (event.instagram || []).forEach((h, i) => {
    if (!HANDLE_RE.test(String(h).replace(/^@/, ""))) fail("event.json", `instagram[${i}]: "${h}" is not a valid Instagram handle`);
  });
  if (!EMAIL_RE.test(event.register_email || "")) fail("event.json", `register_email: "${event.register_email}" is not a valid email`);
  checkStringList("event.json", "register_fields", event.register_fields, 1);
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
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

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

// Today's date (YYYY-MM-DD) at the gym, for hiding past events
const gymToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/St_Johns" }).format(new Date());

const longDate = (ymd, opts) => new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-CA", { timeZone: "UTC", ...opts });

// Event is shown only when switched on and its date hasn't passed
function eventActive() {
  if (!event || event.show !== true) return false;
  if (event.date < gymToday()) {
    console.warn(`note: event date ${event.date} has passed — banner and section not shown`);
    return false;
  }
  return true;
}

function genEventBanner(active) {
  if (!active) return "";
  const when = longDate(event.date, { weekday: "long", month: "long", day: "numeric" });
  const details = [when, nonEmpty(event.details) ? event.details.trim() : ""].filter(Boolean).join(" · ");
  const label = nonEmpty(event.label) ? `\n        <p class="event-banner__label">${esc(event.label.trim())}</p>` : "";
  return `    <aside class="event-banner" aria-label="Upcoming event" data-event-date="${event.date}">
      <div class="container event-banner__inner">${label}
        <p class="event-banner__text"><strong>${esc(event.title.trim())}</strong> <span>${esc(details)}</span></p>
        <a class="event-banner__cta" href="#event">${esc(event.button_text.trim())}</a>
      </div>
    </aside>`;
}

function genEventSection(active) {
  if (!active) return "";
  const when = longDate(event.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const fees = event.fees || [];
  const closes = fees.length > 0 ? fees[fees.length - 1].ends : "";

  const facts = (event.facts || [])
    .map((f) => `                <div>
                  <dt>${esc(f.label)}</dt>
                  <dd>${esc(f.text)}</dd>
                </div>`)
    .join("\n");
  const rules = (event.rules || []).length
    ? `
              <h3>Match rules</h3>
              <ul class="event__rules">
${event.rules.map((r) => `                <li>${esc(r)}</li>`).join("\n")}
              </ul>`
    : "";

  const feeRows = fees
    .map((f) => `                  <tr data-ends="${f.ends}">
                    <th scope="row">${esc(f.name)} <span>until ${longDate(f.ends, { month: "short", day: "numeric" })}</span></th>
                    <td>$${f.kids}</td>
                    <td>$${f.adults}</td>
                  </tr>`)
    .join("\n");
  const feesNote = nonEmpty(event.fees_note) ? `\n                <p class="event__note">${esc(event.fees_note.trim())}</p>` : "";
  const feesBlock = fees.length
    ? `
              <div class="event__fees-block">
              <h3>Registration fees</h3>
              <table class="event__fees">
                <thead>
                  <tr>
                    <th scope="col">Register by</th>
                    <th scope="col">Kids <span>15 &amp; under</span></th>
                    <th scope="col">16 &amp; up</th>
                  </tr>
                </thead>
                <tbody>
${feeRows}
                </tbody>
              </table>${feesNote}
              </div>`
    : "";

  const email = event.register_email.trim();
  const reminder = nonEmpty(event.email_reminder) ? `\r\n\r\n${event.email_reminder.trim()}` : "";
  const body = event.register_fields.map((f) => `${f.trim()}: `).join("\r\n") + reminder;
  const subject = nonEmpty(event.register_subject) ? event.register_subject.trim() : `${event.title.trim()} registration`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const payment = nonEmpty(event.payment_note) ? `\n                <p class="event__note">${esc(event.payment_note.trim())}</p>` : "";
  const feesPanel = fees.length ? `\n            <div class="event-panel event-panel--fees">${feesBlock}\n            </div>` : "";
  const logo = nonEmpty(event.logo)
    ? `\n            <img class="event__logo" src="${escAttr(event.logo.trim())}" alt="High Tide Submission Series logo" width="480" height="403" />`
    : "";
  const handles = (event.instagram || []).map((h) => String(h).trim().replace(/^@/, "")).filter(Boolean);
  const social = handles.length
    ? `
            <div class="event__social">
              <p>Follow for updates</p>
              <ul>
${handles
  .map((h) => `                <li><a href="https://www.instagram.com/${h}/" target="_blank" rel="noopener"><svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>@${h}<span class="sr-only"> on Instagram (opens in a new tab)</span></a></li>`)
  .join("\n")}
              </ul>
            </div>`
    : "";
  const closesText = closes
    ? `Registration closes ${longDate(closes, { weekday: "long", month: "long", day: "numeric" })} at 11:59 PM.`
    : "";

  return `      <section id="event" class="section event" aria-labelledby="event-title"${closes ? ` data-registration-closes="${closes}"` : ""} data-event-date="${event.date}">
        <div class="container">
          <header class="section-header">${logo}
            <p class="event__eyebrow">${esc(when)} · ${esc(event.venue)}</p>
            <h2 id="event-title">${esc(event.heading)}</h2>
            <p>${esc(event.intro)}</p>${social}
          </header>
          <div class="event__grid">
            <div class="event-panel">
              <dl class="event__facts">
${facts}
              </dl>${rules}
            </div>
${feesPanel}
            <div class="event-panel event-panel--register">
              <h3>How to register</h3>
              <p class="event__closed">Registration is closed. See you on the mats!</p>
              <div class="event__open">
                <p>Tap the button to open a pre-filled email to ${esc(email)}, add your details, and send.</p>${payment}
                <p class="event__deadline">${esc(closesText)}</p>
                <a class="button primary" href="${escAttr(mailto)}">Email your registration</a>
              </div>
            </div>
          </div>
        </div>
      </section>`;
}

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

const SITE_URL = "https://evolutionmartialartsnl.com";

// Merge back-to-back classes (gap of 15 min or less) into opening-hours blocks per day
function openingHours() {
  const specs = [];
  for (const day of DAYS) {
    const classes = [...schedule[day]].sort((x, y) => x.start.localeCompare(y.start));
    let block = null;
    const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
    for (const c of classes) {
      if (block && toMin(c.start) - toMin(block.closes) <= 15) {
        if (c.end > block.closes) block.closes = c.end;
      } else {
        if (block) specs.push(block);
        block = { opens: c.start, closes: c.end };
      }
    }
    if (block) specs.push(block);
    specs.forEach((sp) => {
      if (!sp.dayOfWeek) sp.dayOfWeek = `https://schema.org/${day.charAt(0).toUpperCase() + day.slice(1)}`;
    });
  }
  return specs.map((sp) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: sp.dayOfWeek, opens: sp.opens, closes: sp.closes }));
}

function genSchoolLd() {
  const byPrice = [...memberships.plans].sort((x, y) => Number(x.price) - Number(y.price));
  return {
    "@context": "https://schema.org",
    "@type": "MartialArtsSchool",
    "@id": `${SITE_URL}/#school`,
    name: "Evolution Martial Arts NL",
    url: SITE_URL,
    image: `${SITE_URL}/assets/og-image.jpg`,
    logo: `${SITE_URL}/assets/logo-512.jpg`,
    telephone: "+17093306894",
    email: "evolutionmartialartsnl@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "210 Kenmount Rd",
      addressLocality: "St. John's",
      addressRegion: "NL",
      postalCode: "A1B 3R2",
      addressCountry: "CA",
    },
    geo: { "@type": "GeoCoordinates", latitude: 47.5610323, longitude: -52.7481653 },
    areaServed: "St. John's, Newfoundland and Labrador",
    foundingDate: "2022",
    founder: { "@type": "Person", name: team.lead_instructor.name, jobTitle: "Lead Instructor" },
    description:
      "Evolution Martial Arts NL offers Brazilian Jiu-Jitsu (Gi and No-Gi), Kickboxing, Kids Jiu-Jitsu, Kids Wrestling, and Women's classes in St. John's, Newfoundland for all levels. First class is free.",
    priceRange: `$${byPrice[0].price}–$${byPrice[byPrice.length - 1].price} CAD`,
    currenciesAccepted: "CAD",
    sameAs: ["https://www.instagram.com/evolutionmartialartsnl/"],
    openingHoursSpecification: openingHours(),
    hasOfferCatalog: [
      {
        "@type": "OfferCatalog",
        name: "Programs",
        itemListElement: site.seo_offers.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
      },
      {
        "@type": "OfferCatalog",
        name: "Memberships (tax included)",
        itemListElement: memberships.plans.map((p) => ({
          "@type": "Offer",
          name: p.name,
          description: p.description,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: p.price,
            priceCurrency: "CAD",
            unitText: p.period.replace(/^\//, ""),
            valueAddedTaxIncluded: true,
          },
        })),
      },
    ],
  };
}

function genEventLd() {
  const handles = (event.instagram || []).map((h) => String(h).trim().replace(/^@/, ""));
  const ld = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.heading.trim(),
    description: event.intro.trim(),
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${SITE_URL}/#event`,
    location: {
      "@type": "Place",
      name: event.venue.trim(),
      ...(nonEmpty(event.venue_address) ? { address: event.venue_address.trim() } : {}),
    },
  };
  if (nonEmpty(event.logo)) ld.image = `${SITE_URL}/${event.logo.trim().replace(/^\//, "")}`;
  if (nonEmpty(event.organizer)) {
    ld.organizer = { "@type": "Organization", name: event.organizer.trim() };
    if (handles[0]) ld.organizer.url = `https://www.instagram.com/${handles[0]}/`;
  }
  const fees = event.fees || [];
  if (fees.length) {
    ld.offers = fees.flatMap((f, i) => {
      // each tier starts the day after the previous tier's deadline
      const validFrom = i > 0 ? new Date(Date.parse(`${fees[i - 1].ends}T00:00:00Z`) + 864e5).toISOString().slice(0, 10) : undefined;
      return [
        ["Kids (15 & under)", f.kids],
        ["High school & adult (16+)", f.adults],
      ].map(([who, price]) => ({
        "@type": "Offer",
        name: `${f.name} registration, ${who}, per division`,
        price,
        priceCurrency: "CAD",
        ...(validFrom ? { validFrom } : {}),
        validThrough: f.ends,
        url: `${SITE_URL}/#event`,
        availability: "https://schema.org/InStock",
      }));
    });
  }
  return ld;
}

function genJsonLd(active) {
  const docs = [genSchoolLd(), ...(active ? [genEventLd()] : [])];
  return docs
    .map((d) => {
      // "</" inside a script block would end it early
      const json = JSON.stringify(d, null, 2).replace(/<\//g, "<\\/");
      return `    <script type="application/ld+json">\n${json.replace(/^/gm, "    ")}\n    </script>`;
    })
    .join("\n");
}

// ---------- llms.txt generators ----------

function replaceLlmsSection(text, heading, body) {
  const re = new RegExp(`(## ${heading}\\n)[\\s\\S]*?(?=\\n## )`);
  if (!re.test(text)) throw new Error(`llms.txt: section "## ${heading}" not found`);
  // replacer function so "$" in content (prices) is never treated as a backreference
  return text.replace(re, (m, head) => `${head}\n${body}\n`);
}

function genLlmsEvents() {
  if (!showEvent) return "No upcoming events are currently listed.";
  const when = longDate(event.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const where = [event.venue, event.venue_address].filter(nonEmpty).map((v) => v.trim()).join(", ");
  const lines = [`### ${event.heading.trim()}`, "", `- Date: ${when}`, `- Location: ${where}`];
  if (nonEmpty(event.organizer)) lines.push(`- Organizer: ${event.organizer.trim()}`);
  (event.facts || []).forEach((f) => lines.push(`- ${f.label}: ${f.text}`));
  if ((event.rules || []).length) lines.push(`- Match rules: ${event.rules.map((r) => r.trim().replace(/\.$/, "")).join("; ")}`);
  const fees = event.fees || [];
  if (fees.length) {
    lines.push("- Registration fees (per division, CAD; kids 15 & under / ages 16+):");
    fees.forEach((f) => lines.push(`  - ${f.name}, until ${longDate(f.ends, { month: "long", day: "numeric" })}: $${f.kids} / $${f.adults}`));
    lines.push(`- Registration closes ${longDate(fees[fees.length - 1].ends, { month: "long", day: "numeric" })} at 11:59 PM`);
  }
  lines.push(`- How to register: email ${event.register_email.trim()} with: ${event.register_fields.join("; ")}`);
  if (nonEmpty(event.payment_note)) lines.push(`- Payment: ${event.payment_note.trim()}`);
  const handles = (event.instagram || []).map((h) => `@${String(h).trim().replace(/^@/, "")}`);
  if (handles.length) lines.push(`- Instagram: ${handles.join(", ")}`);
  lines.push(`- Details: ${SITE_URL}/#event`);
  return lines.join("\n");
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
  text = replaceLlmsSection(text, "Upcoming Events", genLlmsEvents());
  return text;
}

// ---------- build ----------

let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const showEvent = eventActive();
html = replaceBetween(html, "jsonld", genJsonLd(showEvent), "index.html");
html = replaceBetween(html, "event", genEventBanner(showEvent), "index.html");
html = replaceBetween(html, "event-section", genEventSection(showEvent), "index.html");
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
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${gymToday()}</lastmod>
  </url>
</urlset>
`
);
for (const f of ["404.html", "favicon.svg", "CNAME", "robots.txt"]) {
  fs.copyFileSync(path.join(ROOT, f), path.join(DIST, f));
}
fs.cpSync(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true });

console.log("Build OK → dist/");
