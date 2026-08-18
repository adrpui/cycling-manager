#!/usr/bin/env node
/* ============================================================
   Simulateur de masse — l'outil d'équilibrage.
   Usage : node tools/simulate.js [nbCarrières]
   Joue des carrières complètes avec une politique de choix
   automatique et mesure les distributions qui comptent.
   ============================================================ */

const path = require("path");
const D = require(path.join(__dirname, "..", "data.js"));
const Engine = require(path.join(__dirname, "..", "engine.js"));

const N = parseInt(process.argv[2] || "3000", 10);
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

function randomProfile() {
  const circuit = rnd(D.CIRCUITS);
  const nat = rnd(D.NATIONS);
  return {
    circuit, nat,
    origin: rnd(D.ORIGINS),
    lifestyle: rnd(D.LIFESTYLES),
    entourage: rnd(D.ENTOURAGES),
    hand: Engine.weighted(D.HANDS, (h) => h.w),
    backhand: Engine.weighted(D.BACKHANDS, (b) => b.w),
    build: Engine.weighted(D.BUILDS, (b) => b.w),
    perks: [],
  };
}

// Politique de programme : volume selon la trésorerie et l'âge,
// surface prioritaire si le profil est nettement spécialisé.
function choseProgram(s) {
  let vol = D.VOLUMES[1];
  if (s.money < 0.02 && s.rank > 120) vol = D.VOLUMES[2];
  if (s.money < -0.05) vol = D.VOLUMES[3];
  if (s.age >= 32 || s.fatigue > 72) vol = D.VOLUMES[0];
  const best = Engine.bestSurface(s);
  const spread = s.aff[best] - s.aff[Engine.worstSurface(s)];
  return { volume: vol, surface: spread >= 8 ? best : "none" };
}

function playCareer() {
  const s = Engine.newCareer(randomProfile());
  let guard = 0;
  while (!s.careerEnded && !s.flags.retire_now && guard++ < 30) {
    // Événement de saison
    const ev = Engine.pickEvent(s);
    if (ev) Engine.resolveOption(s, ev, Math.floor(Math.random() * ev.options.length));
    if (s.flags.retire_now) break;

    const program = choseProgram(s);
    const report = Engine.playSeason(s, program);

    if (report.pendingMoment) {
      const opts = report.pendingMoment.moment.options;
      Engine.resolveMoment(s, report, report.pendingMoment, Math.floor(Math.random() * opts.length));
    }
    Engine.seasonAwards(s, report);
    Engine.seasonEconomy(s, report);
    Engine.trackMilestones(s, report);
    Engine.advanceYear(s, program, report);
  }
  s.finalScore = Engine.careerScore(s);
  s.finalRating = Engine.careerRating(s);
  s.finalTier = Engine.careerTier(s);
  return s;
}

/* ---------- Mesure ------------------------------------------------------- */
const out = [];
for (let i = 0; i < N; i++) out.push(playCareer());

const pct = (f) => (100 * out.filter(f).length / N).toFixed(1) + " %";
const avg = (f) => (out.reduce((a, s) => a + f(s), 0) / N).toFixed(2);
const quantile = (f, q) => {
  const v = out.map(f).sort((a, b) => a - b);
  return v[Math.min(v.length - 1, Math.floor(q * v.length))];
};

console.log("═".repeat(64));
console.log("DESTINY GRAND CHELEM — " + N + " carrières simulées");
console.log("═".repeat(64));

console.log("\n▸ NIVEAU");
console.log("  Niveau pic moyen        : " + avg((s) => s.peakNiv));
console.log("  Niveau pic p50 / p90 / p99 : " + quantile((s) => s.peakNiv, 0.5) +
            " / " + quantile((s) => s.peakNiv, 0.9) + " / " + quantile((s) => s.peakNiv, 0.99));
console.log("  Pépites (tirage caché)  : " + pct((s) => s.prodigy));

console.log("\n▸ CLASSEMENT   (cibles : top 10 ≈ 14 %, n°1 ≈ 0,8 %)");
console.log("  Meilleur rang médian    : " + quantile((s) => s.bestRank, 0.5));
console.log("  A vu le top 100         : " + pct((s) => s.bestRank <= 100));
console.log("  A vu le top 10          : " + pct((s) => s.bestRank <= 10));
console.log("  A été n°1 mondial       : " + pct((s) => s.bestRank === 1));
console.log("  Semaines n°1 (moyenne)  : " + avg((s) => s.weeksNo1));

const bestPts = out.map((s) => Math.max.apply(null, s.seasons.map((x) => x.points).concat([0])));
bestPts.sort((a, b) => a - b);
const q = (f) => bestPts[Math.min(bestPts.length - 1, Math.floor(f * bestPts.length))];
console.log("  Meilleure saison en points — p50/p75/p90/p97/p99/p999 : " +
  [q(.5), q(.75), q(.90), q(.97), q(.99), q(.999)].map(Math.round).join(" / "));

console.log("\n▸ TITRES   (cible : un Majeur ≈ 3 %)");
console.log("  A gagné un Majeur       : " + pct((s) => s.titles.slam > 0));
console.log("  Majeurs (moyenne)       : " + avg((s) => s.titles.slam));
console.log("  Majeurs max observé     : " + Math.max.apply(null, out.map((s) => s.titles.slam)));
console.log("  Chelem en carrière      : " + pct((s) => Engine.distinctSlams(s) === 4));
console.log("  Masters 1000 (moyenne)  : " + avg((s) => s.titles.m1000));
console.log("  Titres toutes catég.    : " + avg((s) => s.titles.slam + s.titles.finals + s.titles.m1000 + s.titles.t500 + s.titles.t250 + s.titles.challenger + s.titles.futures));

console.log("\n▸ ARGENT   (cible : ≈ 55 % passent par une saison déficitaire)");
console.log("  Saison en négatif       : " + pct((s) => s.moneyEverNegative));
console.log("  Découvert > 50 k\u20ac      : " + pct((s) => s.flags.deepDebt));
console.log("  Fortune finale médiane  : " + quantile((s) => Math.round(s.money * 100) / 100, 0.5) + " M€");
console.log("  Fortune finale p90      : " + quantile((s) => Math.round(s.money * 100) / 100, 0.9) + " M€");
console.log("  Gains carrière moyens   : " + avg((s) => s.lifetimeEarnings) + " M€");

console.log("\n▸ CORPS ET DURÉE");
console.log("  Âge de retraite moyen   : " + avg((s) => s.age));
console.log("  Saisons professionnelles: " + avg((s) => s.seasonsPro));
console.log("  Carrière brisée (méd.)  : " + pct((s) => s.careerEndReason === "medical"));
console.log("  Au moins une opération  : " + pct((s) => s.worstInjury >= 26));
console.log("  Zones chroniques (moy.) : " + avg((s) => s.chronicZones.length));

console.log("\n▸ SCORE FINAL");
console.log("  Score médian / p90 / p99: " + quantile((s) => s.finalScore, 0.5) +
            " / " + quantile((s) => s.finalScore, 0.9) + " / " + quantile((s) => s.finalScore, 0.99));
console.log("  Note de carrière médiane: " + quantile((s) => s.finalRating, 0.5));
const tiers = {};
for (const s of out) tiers[s.finalTier.title] = (tiers[s.finalTier.title] || 0) + 1;
for (const k of Object.keys(tiers).sort((a, b) => tiers[b] - tiers[a])) {
  console.log("  " + k.padEnd(38) + (100 * tiers[k] / N).toFixed(1) + " %");
}

console.log("\n▸ POINT DE VÉRIFICATION N°1 — Polyvalent contre Terrien");
const byProfile = {};
for (const s of out) {
  const k = s.profile.id;
  byProfile[k] = byProfile[k] || { n: 0, slams: 0, titles: 0, peak: 0, top10: 0 };
  byProfile[k].n++;
  byProfile[k].slams += s.titles.slam;
  byProfile[k].titles += s.titles.slam + s.titles.m1000 + s.titles.t500 + s.titles.t250;
  byProfile[k].peak += s.peakNiv;
  if (s.bestRank <= 10) byProfile[k].top10++;
}
console.log("  profil          n     Majeurs/carr.  titres/carr.  niv. pic  top10");
for (const k of Object.keys(byProfile)) {
  const b = byProfile[k];
  console.log("  " + k.padEnd(14) + String(b.n).padEnd(6) +
    (b.slams / b.n).toFixed(3).padEnd(15) +
    (b.titles / b.n).toFixed(2).padEnd(14) +
    (b.peak / b.n).toFixed(1).padEnd(10) +
    (100 * b.top10 / b.n).toFixed(1) + " %");
}

console.log("\n▸ EFFET DE GÉNÉRATION");
const byGen = {};
for (const s of out) {
  const k = s.generation.id;
  byGen[k] = byGen[k] || { n: 0, slams: 0 };
  byGen[k].n++; byGen[k].slams += s.titles.slam;
}
for (const k of Object.keys(byGen)) {
  console.log("  " + k.padEnd(10) + String(byGen[k].n).padEnd(6) + "Majeurs/carrière : " + (byGen[k].slams / byGen[k].n).toFixed(3));
}

console.log("\n▸ BADGES");
const badgeCount = {};
for (const s of out) for (const b of Engine.evaluateBadges(s, null)) badgeCount[b] = (badgeCount[b] || 0) + 1;
const never = D.BADGES.filter((b) => b.id !== "platine" && !badgeCount[b.id]).map((b) => b.name);
console.log("  Badges jamais obtenus   : " + (never.length ? never.join(", ") : "aucun"));
console.log("");
