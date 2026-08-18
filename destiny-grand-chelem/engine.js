/* ============================================================
   DESTINY GRAND CHELEM — Moteur de simulation
   Pur calcul, aucune manipulation du DOM. Utilisable sous Node
   (tools/simulate.js) pour l'équilibrage de masse.
   ============================================================ */

const Engine = (function () {
  "use strict";

  const N = (typeof module !== "undefined" && module.exports)
    ? require("./data.js") : null;
  const E = (typeof module !== "undefined" && module.exports)
    ? require("./data-events.js") : null;

  const D = N || {
    BRAND, CIRCUITS, NATIONS, NAME_POOLS, ORIGINS, LIFESTYLES, ENTOURAGES,
    HANDS, BACKHANDS, BUILDS, SURFACES, SURFACE_PROFILES, PROFILE_BIAS,
    TRAJECTORIES, TRAITS, TIERS, STAGE_WEIGHTS, STAGE_LABELS, POINTS, PRIZE,
    CALENDAR, FILLER, RANK_TABLE, ENTRIES, VOLUMES, TEAM_ROLES, SPONSOR_CAP,
    GENERATIONS, AWARDS, BALANCE, CAREER_TIERS, BADGES, PERKS,
  };
  const EV = E || { EVENTS, MICRO_EVENTS, KEY_MOMENTS };

  /* ---------- Hasard seedable ------------------------------------------- */
  let _seeded = false, _state = 0;
  function setSeed(seed) {
    _seeded = seed !== null && seed !== undefined;
    _state = (seed >>> 0) || 1;
  }
  function rng() {
    if (!_seeded) return Math.random();
    _state |= 0; _state = (_state + 0x6D2B79F5) | 0;
    let t = Math.imul(_state ^ (_state >>> 15), 1 | _state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const rand = (a, b) => a + rng() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function weighted(list, wf) {
    let total = 0;
    for (const it of list) total += Math.max(0, wf(it));
    if (total <= 0) return list[0];
    let r = rng() * total;
    for (const it of list) { r -= Math.max(0, wf(it)); if (r <= 0) return it; }
    return list[list.length - 1];
  }

  /* ---------- Niveau ----------------------------------------------------- */
  function niv(s) {
    const w = s.circuit.w, a = s.st;
    return Math.round(w.ser * a.ser + w.ret * a.ret + w.fdc * a.fdc +
                      w.dep * a.dep + w.phy * a.phy + w.men * a.men);
  }
  function nivOn(s, surface) { return niv(s) + (s.aff[surface] || 0); }
  function hasTrait(s, id) { return s.traits.indexOf(id) >= 0; }

  /* ---------- Affinités (somme maintenue à 0) ---------------------------- */
  function normaliseAff(s) {
    const ids = ["hard", "clay", "grass"];
    let sum = ids.reduce((t, k) => t + s.aff[k], 0);
    // On répartit le résidu en retirant d'abord aux plus fortes affinités.
    let guard = 0;
    while (sum !== 0 && guard++ < 30) {
      ids.sort((a, b) => (sum > 0 ? s.aff[b] - s.aff[a] : s.aff[a] - s.aff[b]));
      s.aff[ids[0]] -= Math.sign(sum);
      sum -= Math.sign(sum);
    }
    for (const k of ids) s.aff[k] = clamp(s.aff[k], -12, 12);
  }
  function bestSurface(s) {
    return ["hard", "clay", "grass"].reduce((a, b) => (s.aff[a] >= s.aff[b] ? a : b));
  }
  function worstSurface(s) {
    return ["hard", "clay", "grass"].reduce((a, b) => (s.aff[a] <= s.aff[b] ? a : b));
  }
  function shiftAff(s, target, n) {
    const others = ["hard", "clay", "grass"].filter((k) => k !== target);
    s.aff[target] += n;
    s.aff[others[0]] -= Math.ceil(n / 2);
    s.aff[others[1]] -= Math.floor(n / 2);
    normaliseAff(s);
  }

  /* ---------- Potentiel, trajectoire, profil ----------------------------- */
  function rollPotential(origin, lifestyle, entourage, bonus) {
    let cap = D.BALANCE.potBase + randInt(-4, 14);
    cap += origin.pot || 0;
    cap += lifestyle ? (lifestyle.pot || 0) : 0;
    cap += entourage ? (entourage.pot || 0) : 0;
    cap += bonus || 0;
    return clamp(cap, D.BALANCE.potMin, D.BALANCE.potMax);
  }
  function potStars(cap) {
    if (cap <= 74) return 1; if (cap <= 80) return 2;
    if (cap <= 85) return 3; if (cap <= 91) return 4; return 5;
  }
  function prodigyChance(origin, lifestyle, entourage, nat) {
    const B = D.BALANCE;
    let p = B.prodigyBase;
    p += B.prodigyOrigin[origin.id] || 0;
    if (lifestyle) p += B.prodigyLifestyle[lifestyle.id] || 0;
    if (entourage) p += B.prodigyEntourage[entourage.id] || 0;
    p *= (nat ? 0.6 + nat.w * 0.6 : 1);
    return clamp(p, 0, B.prodigyCap);
  }
  function pickTrajectory(origin) {
    return weighted(D.TRAJECTORIES, (t) => {
      let w = t.w;
      if (origin.id === "tardif" && (t.id === "late" || t.id === "surge")) w *= 4;
      if (origin.id === "tardif" && (t.id === "early" || t.id === "flash")) w *= 0.2;
      if (origin.id === "prodige" && (t.id === "early" || t.id === "normal")) w *= 1.6;
      return w;
    });
  }
  function trajMult(s) {
    const a = s.age + (s.circuit.ageShift || 0);
    switch (s.trajectory.id) {
      case "steady": return a <= 24 ? 0.8 : 1.1;
      case "early": return a <= 20 ? 1.8 : a <= 24 ? 0.8 : 0.6;
      case "late": return a <= 21 ? 0.7 : a <= 28 ? 1.7 : 1;
      case "chaotic": return rand(0.4, 1.7);
      case "unstable": return 1.2;
      case "flash": return a <= 19 ? 1.9 : a <= 23 ? 0.5 : 0.3;
      case "surge": return a < s.sparkAge ? 0.75 : a <= s.sparkAge + 2 ? 2.1 : 1;
      default: return 1;
    }
  }
  function pickProfile(origin, nat) {
    const bo = (D.PROFILE_BIAS.origin[origin.id]) || {};
    const bn = (D.PROFILE_BIAS.nat[nat.id]) || {};
    return weighted(D.SURFACE_PROFILES, (p) => p.w * (bo[p.id] || 1) * (bn[p.id] || 1));
  }

  /* ---------- Génération et rivaux --------------------------------------- */
  function pickGeneration() { return weighted(D.GENERATIONS, (g) => g.w); }

  function makeRival(s, i) {
    const nat = pick(D.NATIONS);
    const pool = D.NAME_POOLS[nat.id] || D.NAME_POOLS.fr;
    const first = pick(s.circuit.id === "wta" ? pool.f : pool.m);
    const prof = pick(D.SURFACE_PROFILES);
    const g = s.generation;
    return {
      name: first + " " + pick(pool.last),
      natId: nat.id, flag: nat.flag,
      profile: prof.id, aff: Object.assign({}, prof.aff),
      potCap: randInt(g.pot[0], g.pot[1]),
      ageOffset: randInt(-3, 3),
      niv: 55,
      h2hWin: 0, h2hLoss: 0,
      slams: 0,
      edge: 0,
      index: i,
    };
  }
  // Niveau d'un rival à un âge donné : montée jusqu'au pic, déclin ensuite.
  function rivalNiv(s, r) {
    const a = s.age + r.ageOffset;
    const peak = 27 + (s.circuit.ageShift || 0);
    let v;
    if (a < 16) v = 50;
    else if (a <= peak) v = 52 + (r.potCap - 52) * Math.pow((a - 15) / (peak - 15), 0.75);
    else v = r.potCap - (a - peak) * 2.1;
    return clamp(Math.round(v), 40, 99);
  }
  function rivalActive(s, r) {
    const a = s.age + r.ageOffset;
    return a >= 17 && a <= 35 && rivalNiv(s, r) > 60;
  }

  /* ---------- Création de carrière --------------------------------------- */
  function generateName(circuitId, natId) {
    const pool = D.NAME_POOLS[natId] || D.NAME_POOLS.fr;
    const first = pick(circuitId === "wta" ? pool.f : pool.m);
    return first + " " + pick(pool.last);
  }

  function newCareer(p) {
    const circuit = p.circuit, origin = p.origin, nat = p.nat;
    const lifestyle = p.lifestyle, entourage = p.entourage;
    const perks = p.perks || [];
    const perkFx = {};
    for (const pk of perks) for (const k in pk.fx) perkFx[k] = (perkFx[k] || 0) + pk.fx[k];

    const st = Object.assign({}, origin.st);
    const addFx = (fx) => {
      if (!fx) return;
      for (const k of ["ser", "ret", "fdc", "dep", "phy", "men"]) if (fx[k]) st[k] += fx[k];
    };
    addFx(p.hand.fx); addFx(p.backhand.fx); addFx(p.build.fx);
    addFx(lifestyle.fx); addFx(entourage.fx);
    if (perkFx.ser) st.ser += perkFx.ser;

    const profile = p.profile || pickProfile(origin, nat);
    const generation = pickGeneration();

    const s = {
      name: p.name || generateName(circuit.id, nat.id),
      circuit, nat, origin, lifestyle, entourage,
      hand: p.hand, backhand: p.backhand, build: p.build,
      profile, st,
      cha: origin.cha + (lifestyle.fx.cha || 0) + (entourage.fx.cha || 0) + (p.backhand.fx.cha || 0),
      aff: Object.assign({}, profile.aff),

      potCap: rollPotential(origin, lifestyle, entourage, perkFx.pot || 0),
      trajectory: null, sparkAge: randInt(22, 27),
      prodigy: false,

      age: D.BALANCE.ageStart,
      year: D.BALANCE.startYear,
      pro: false,

      form: 62, fatigue: 20, moral: 62,
      discipline: 50 + (lifestyle.fx.dis || 0) + (entourage.fx.dis || 0),
      rep: origin.rep + (lifestyle.fx.rep || 0) + (entourage.fx.rep || 0) + (perkFx.rep || 0),
      coachRel: 58,
      money: (perkFx.money || 0),

      points: 0, prevPoints: 0, rank: 1800, bestRank: 1800, prevRank: 1800,
      weeksNo1: 0, seasonsPro: 0,

      team: { coach: 1, fitness: 0, physio: 0, agent: entourage.id === "agent" ? 1 : 0 },
      coachChanges: 0,
      wildcards: 0,

      traits: [],
      injuryWeeks: 0, seasonInjury: 0, chronicWeeks: 0,
      chronicZones: [], injuryHistory: 0, worstInjury: 0,
      protectedRank: 0, protectedLeft: 0,
      maxSeasonInjury: 0,

      generation, rivals: [],
      totals: { matches: 0, wins: 0, losses: 0, tournaments: 0, longWins: 0, seasonsNegative: 0 },
      titles: { slam: 0, finals: 0, m1000: 0, t500: 0, t250: 0, challenger: 0, futures: 0 },
      slamsById: {}, slamFinals: 0, slamFinalsById: {}, m1000ById: {},
      titleSurfaces: {},
      trophies: { olympic: 0, nations: 0, yearEndNo1: 0 },
      awardCounts: {},
      peakNiv: 0,
      history: [], seasons: [], usedEvents: [],
      flags: {}, careerEnded: false, careerEndReason: null, retired: false,
      moneyEverNegative: false, everFutures: false, everTop10: false,
      lifetimeEarnings: 0,
    };

    if (perkFx.trait) s.traits.push(perkFx.trait);
    if (p.hand.id === "left") s.flags.lefty = true;
    if (p.backhand.id === "one") s.flags.onehand = true;

    s.trajectory = pickTrajectory(origin);
    if (rng() < prodigyChance(origin, lifestyle, entourage, nat)) {
      s.prodigy = true;
      s.potCap = Math.max(s.potCap, randInt(D.BALANCE.prodigyPot[0], D.BALANCE.prodigyPot[1]));
    }
    s.stars = potStars(s.potCap);
    for (let i = 0; i < generation.rivals; i++) s.rivals.push(makeRival(s, i));
    normaliseAff(s);
    s.peakNiv = niv(s);
    return s;
  }

  /* ---------- Classement ------------------------------------------------- */
  function rankFromPoints(pts) {
    const T = D.RANK_TABLE;
    if (pts >= T[0][0]) return 1;
    for (let i = 0; i < T.length - 1; i++) {
      const [pHi, rHi] = T[i], [pLo, rLo] = T[i + 1];
      if (pts <= pHi && pts >= pLo) {
        const f = (pts - pLo) / Math.max(1, pHi - pLo);
        return Math.max(1, Math.round(rLo + (rHi - rLo) * f));
      }
    }
    return T[T.length - 1][1];
  }

  /* ---------- Accès aux tournois ----------------------------------------- */
  // Le dernier carré d'un grand tournoi est un plateau à part : l'exposant seul
  // sous-estime la difficulté d'y passer. On amortit les deux derniers paliers.
  const DEEP_DAMP = { slam: 0.28, finals: 0.48, m1000: 0.55, t500: 0.75, t250: 0.85, challenger: 0.95, futures: 1 };

  const SEED_CUT = { slam: 32, m1000: 32, finals: 8, t500: 16, t250: 8, challenger: 8, futures: 8 };

  function allowedTiers(rank) {
    if (rank <= 60) return ["slam", "m1000", "t500", "t250"];
    if (rank <= 160) return ["slam", "m1000", "t500", "t250", "challenger"];
    if (rank <= 350) return ["slam", "t500", "t250", "challenger"];
    if (rank <= 700) return ["t250", "challenger", "futures"];
    return ["challenger", "futures"];
  }

  // Bande de qualification : jusqu'où au-delà du cut peut-on passer par les qualifs.
  const QUALI_BAND = { slam: 2.2, m1000: 2.2, t500: 2.6, t250: 3.0, challenger: 4, futures: 40 };
  const WC_TIERS = { slam: 1, m1000: 1, t500: 1, t250: 1 };

  // Mode d'entrée SANS wildcard. Les wildcards sont attribuées séparément
  // par buildSchedule, sinon chaque tournoi candidat en réclamerait une.
  function entryFor(s, tierId) {
    const tier = D.TIERS[tierId];
    const rank = effectiveRank(s);
    if (tierId === "finals") return rank <= 8 ? D.ENTRIES[0] : null;
    if (rank <= 8 && (tierId === "slam" || tierId === "m1000")) return D.ENTRIES[0];
    if (rank <= (SEED_CUT[tierId] || 16)) return D.ENTRIES[1];
    if (rank <= tier.cut) return D.ENTRIES[2];
    if (rank <= tier.cut * (QUALI_BAND[tierId] || 2.5)) return D.ENTRIES[4];
    return null;
  }
  // Une wildcard n'a d'intérêt que si elle vaut mieux que ce qu'on a déjà.
  function wildcardUseful(s, tierId, entry) {
    if (!WC_TIERS[tierId]) return false;
    const rank = effectiveRank(s);
    if (!entry) return rank <= D.TIERS[tierId].cut * 6;
    return entry.id === "quali";
  }
  // Classement utilisé pour l'entrée : le classement protégé s'il est actif.
  function effectiveRank(s) {
    if (s.protectedLeft > 0 && s.protectedRank && s.protectedRank < s.rank) return s.protectedRank;
    return s.rank;
  }

  /* ---------- Construction du calendrier --------------------------------- */
  function buildSchedule(s, program) {
    const vol = program.volume;
    const weeksLost = Math.min(40, s.injuryWeeks);
    const target = Math.max(3, Math.round(vol.n * (1 - weeksLost / 44)));
    const tiersOk = allowedTiers(effectiveRank(s));
    let wc = s.wildcards + (s.nat.homeSlam ? 1 : 0) +
             (D.TEAM_ROLES[3].levels[s.team.agent].wc || 0);

    const cands = [];
    for (const t of D.CALENDAR) {
      if (tiersOk.indexOf(t.tier) < 0) continue;
      cands.push({ id: t.id, name: t.name, tier: t.tier, surface: t.surface, week: t.week, named: true });
    }
    for (const f of D.FILLER) {
      if (tiersOk.indexOf(f.tier) < 0) continue;
      const n = f.tier === "t250" ? 16 : 18;
      for (let i = 0; i < n; i++) {
        cands.push({
          id: f.tier + "_" + i,
          name: f.names[i % f.names.length],
          tier: f.tier,
          surface: f.surfaces[i % f.surfaces.length],
          week: 4 + ((i * 5) % 44),
          named: false,
        });
      }
    }

    const valueOf = (c, e) => {
      const tier = D.TIERS[c.tier];
      const margin = nivOn(s, c.surface) + e.d * 2.5 - tier.fieldW;
      let v = D.POINTS[c.tier][tier.stages - 1] * Math.pow(1 + clamp(margin, -30, 30) * 0.05, 1.4);
      if (e.id === "quali") v *= 0.42;
      if (e.id === "wildcard") v *= 0.9;
      if (program.surface && program.surface !== "none") v *= c.surface === program.surface ? 1.6 : 0.7;
      if (c.tier === "slam") v *= 1.5;    // on ne saute pas un Majeur
      if (c.tier === "finals") v *= 3;
      return v;
    };

    // 1 · Attribution des wildcards : aux tournois majeurs les plus précieux
    //     où elles changent vraiment quelque chose. Le Majeur national d'abord.
    const wcFor = {};
    if (wc > 0) {
      const wcCands = cands
        .filter((c) => wildcardUseful(s, c.tier, entryFor(s, c.tier)))
        .map((c) => ({ c, v: valueOf(c, D.ENTRIES[3]) * (c.id === s.nat.homeSlam ? 3 : 1) }))
        .sort((a, b) => b.v - a.v);
      for (const x of wcCands) { if (wc <= 0) break; wcFor[x.c.id] = true; wc--; }
    }

    // 2 · Valeur de chaque tournoi accessible, wildcards comprises
    const scored = [];
    for (const c of cands) {
      const e = wcFor[c.id] ? D.ENTRIES[3] : entryFor(s, c.tier);
      if (!e) continue;
      scored.push({ t: c, entry: e, v: valueOf(c, e) });
    }
    scored.sort((a, b) => b.v - a.v);

    const sched = [];
    const used = {};
    for (const sc of scored) {
      if (sched.length >= target) break;
      if (used[sc.t.id]) continue;
      used[sc.t.id] = true;
      sched.push({ t: sc.t, entry: sc.entry });
    }
    sched.sort((a, b) => a.t.week - b.t.week);
    return sched;
  }

  /* ---------- Résolution d'un tournoi ------------------------------------ */
  function fatiguePenalty(s) { return -(s.fatigue - 55) / 8; }

  function tournamentMargin(s, t, entry, opts) {
    const tier = D.TIERS[t.tier];
    let m = nivOn(s, t.surface) + entry.d * 2.5
          + (s.form - 60) / 12
          + Math.min(0, fatiguePenalty(s))
          - tier.fieldW;
    if (t.tier === "slam" && s.circuit.slamBo5) m += (s.st.phy - 60) / 9;
    if (hasTrait(s, "tactic")) m += 1;
    if (opts && opts.homeCrowd) m += 2;
    return m;
  }

  function drawStage(s, t, entry) {
    const tier = D.TIERS[t.tier];
    const base = D.STAGE_WEIGHTS[tier.stages].slice();
    const titleByMoment = (t.tier === "slam" || t.tier === "finals");
    if (titleByMoment) { base[tier.stages - 2] += base[tier.stages - 1]; base[tier.stages - 1] = 0; }
    const margin = tournamentMargin(s, t, entry);
    const boost = clamp(1 + margin * D.BALANCE.boostK, D.BALANCE.boostMin, D.BALANCE.boostMax);
    const damp = DEEP_DAMP[t.tier] || 1;
    const w = base.map((b, i) => {
      let v = b * Math.pow(boost, i);
      if (i === tier.stages - 2) v *= damp;              // finale
      else if (i === tier.stages - 3) v *= (1 + damp) / 2; // demi-finale
      return v;
    });
    let total = w.reduce((a, b) => a + b, 0);
    let r = rng() * total;
    for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
    return w.length - 1;
  }

  function qualiSuccess(s, t) {
    const tier = D.TIERS[t.tier];
    const m = nivOn(s, t.surface) + (s.form - 60) / 12 - (tier.fieldW - 9);
    const p = clamp(0.5 + m * 0.055, 0.08, 0.94);
    let ok = 0;
    for (let i = 0; i < D.BALANCE.qualiRounds; i++) if (rng() < p) ok++;
    return ok === D.BALANCE.qualiRounds;
  }

  function rivalMeeting(s, entry, tier) {
    // Palier auquel un rival croise votre route
    const deep = tier.stages - 3;   // demi-finale
    const mid = tier.stages - 4;    // quart de finale
    return entry.d >= 2 ? deep : mid;
  }

  function playH2H(s, r, surface, report) {
    const mine = nivOn(s, surface) + (s.form - 60) / 14 + (s.st.men - 65) / 22
               + (hasTrait(s, "clutch") ? 2.5 : 0) + (r.edge || 0) * 1.5;
    const theirs = rivalNiv(s, r) + (r.aff[surface] || 0);
    const p = clamp(0.5 + (mine - theirs) * 0.055, 0.08, 0.92);
    const win = rng() < p;
    if (win) { r.h2hWin++; report.h2h.push({ name: r.name, win: true }); }
    else { r.h2hLoss++; report.h2h.push({ name: r.name, win: false }); }
    return win;
  }

  function resolveTournament(s, entry, t, report) {
    const tier = D.TIERS[t.tier];
    const res = { t, entry, stage: -1, points: 0, prize: 0, wins: 0, title: false, final: false, rivalBeaten: 0 };

    if (entry.id === "quali" && !qualiSuccess(s, t)) {
      res.stage = -1; res.qualiOut = true;
      s.fatigue = clamp(s.fatigue + 3, 0, 100);
      report.lines.push({ txt: "Éliminé en qualifications à " + t.name.replace(/^le |^la /, "") + ".", tone: "bad" });
      return res;
    }

    let stage = drawStage(s, t, entry);

    // Rencontre avec un rival
    const chance = D.BALANCE.rivalDrawChance[t.tier] || 0;
    let met = 0;
    for (const r of s.rivals) {
      if (met >= 2) break;
      if (!rivalActive(s, r)) continue;
      if (rng() > chance) continue;
      const meet = rivalMeeting(s, entry, tier) + met;
      if (stage >= meet && meet >= 0 && meet < tier.stages - 1) {
        met++;
        if (playH2H(s, r, t.surface, report)) { res.rivalBeaten++; }
        else { stage = Math.max(0, meet - 1); }
      }
    }

    res.stage = stage;
    res.wins = stage;
    res.points = D.POINTS[t.tier][stage] || 0;
    res.prize = D.PRIZE[t.tier][stage] || 0;
    res.final = (t.tier === "slam" || t.tier === "finals") && stage === tier.stages - 2;
    res.title = stage === tier.stages - 1;
    return res;
  }

  /* ---------- Résolution d'une finale de Majeur -------------------------- */
  function finalProbability(s, t, base) {
    let p = base;
    p += (s.st.men - 65) / 280;
    p += (s.form - 60) / 500;
    p -= (s.fatigue - 55) / 600;
    if (hasTrait(s, "clutch")) p += 0.08;
    if (hasTrait(s, "hothead")) p += 0.04;
    if (s.hand && s.hand.clutch) p += s.hand.clutch;
    p += (nivOn(s, t.surface) - D.TIERS[t.tier].fieldW) / 200;
    return clamp(p, 0.12, 0.90);
  }

  function winFinal(s, res, report) {
    const tier = D.TIERS[res.t.tier];
    res.stage = tier.stages - 1;
    res.title = true;
    res.final = false;
    report.points += D.POINTS[res.t.tier][res.stage] - D.POINTS[res.t.tier][res.stage - 1];
    report.prize += D.PRIZE[res.t.tier][res.stage] - D.PRIZE[res.t.tier][res.stage - 1];
    res.points = D.POINTS[res.t.tier][res.stage];
    res.prize = D.PRIZE[res.t.tier][res.stage];
    report.titles.push(res);
    s.titles[res.t.tier]++;
    s.titleSurfaces[res.t.surface] = (s.titleSurfaces[res.t.surface] || 0) + 1;
  }

  /* ---------- Blessures --------------------------------------------------- */
  function injuryChance(s, tournaments) {
    const B = D.BALANCE;
    let p = B.injBase;
    p += Math.max(0, tournaments - 20) * B.injPerTournament;
    if (s.fatigue > B.injFatigueThr) p += B.injFatigue;
    if (s.age > B.injAgeFrom) p += (s.age - B.injAgeFrom) * B.injAgeStep;
    if (s.age < B.injYouthTo) p += B.injYouth;
    if (s.discipline < 40) p += B.injDiscipline;
    p += s.chronicZones.length * B.injChronic;
    p += D.TEAM_ROLES[2].levels[s.team.physio].inj;
    p += s.build.injAdd || 0;
    if (hasTrait(s, "glass")) p += 0.06;
    if (hasTrait(s, "ironman")) p -= 0.05;
    return clamp(p, B.injMin, B.injMax);
  }

  function rollInjury(s, tournaments) {
    const B = D.BALANCE;
    if (rng() > injuryChance(s, tournaments)) return null;
    const bias = 1 + (Math.max(0, s.age - 28) * B.severityAge)
                 + s.chronicZones.length * B.severityChronic
                 + (hasTrait(s, "glass") ? B.severityGlass : 0);
    const tier = weighted(B.injTiers, (t) => t.w * (t.big ? bias : 1));
    const heal = D.TEAM_ROLES[2].levels[s.team.physio].heal;
    const weeks = Math.round(randInt(tier.min, tier.max) * heal);
    return { tier, weeks };
  }

  function applyInjury(s, inj) {
    const B = D.BALANCE;
    s.injuryWeeks += Math.min(inj.weeks, 42);
    s.seasonInjury += inj.weeks;
    if (inj.weeks > 42) s.chronicWeeks += inj.weeks - 42;
    s.moral = clamp(s.moral - inj.tier.mor, 5, 100);
    s.form = clamp(s.form - inj.tier.form, 5, 100);
    s.worstInjury = Math.max(s.worstInjury, inj.weeks);
    if (inj.tier.big) s.injuryHistory++;
    if (inj.tier.chronic) {
      const free = D.BALANCE.injZones.filter((z) => s.chronicZones.indexOf(z) < 0);
      if (free.length) s.chronicZones.push(pick(free));
    }
    if (inj.tier.protected && inj.weeks >= B.protectedWeeks) {
      s.protectedRank = s.rank;
      s.protectedLeft = B.protectedUses;
    }
  }

  /* ---------- Économie ---------------------------------------------------- */
  function sponsorIncome(s) {
    let cap = 0;
    for (const row of D.SPONSOR_CAP) { if (s.rank <= row.rank) { cap = row.cap; break; } }
    const agent = D.TEAM_ROLES[3].levels[s.team.agent];
    let v = cap * (s.cha / 100) * (0.35 + s.rep / 140) * agent.spon;
    if (hasTrait(s, "showman")) v *= 1.15;
    if (hasTrait(s, "merc")) v *= 1.25;
    return Math.max(0, Math.round(v * 1000) / 1000);
  }
  function teamCost(s) {
    let c = 0;
    c += D.TEAM_ROLES[0].levels[s.team.coach].cost;
    c += D.TEAM_ROLES[1].levels[s.team.fitness].cost;
    c += D.TEAM_ROLES[2].levels[s.team.physio].cost;
    return c;
  }

  /* ---------- Effets ------------------------------------------------------ */
  const STAT_LABELS = { ser: "Service", ret: "Retour", fdc: "Fond de court", dep: "Déplacement", phy: "Physique", men: "Mental" };

  function applyFx(s, fx, chips) {
    chips = chips || [];
    if (!fx) return chips;
    for (const k of ["ser", "ret", "fdc", "dep", "phy", "men"]) {
      if (fx[k]) {
        let d = fx[k];
        if (d > 0 && hasTrait(s, "genius") && s.age <= 22) d = Math.round(d * 1.4);
        s.st[k] = clamp(s.st[k] + d, 1, 99);
        chips.push({ t: (d > 0 ? "+" : "") + d + " " + STAT_LABELS[k], k: d > 0 ? "g" : "b" });
      }
    }
    if (fx.cha) { s.cha = clamp(s.cha + fx.cha, 1, 99); chips.push({ t: (fx.cha > 0 ? "+" : "") + fx.cha + " Charisme", k: fx.cha > 0 ? "g" : "b" }); }
    if (fx.rep) {
      let d = fx.rep;
      if (d > 0) {
        d = Math.round(d * (0.6 + s.nat.w * 0.5));
        if (hasTrait(s, "showman")) d = Math.round(d * 1.3);
        if (hasTrait(s, "merc")) d = Math.round(d * 0.85);
      }
      s.rep = clamp(s.rep + d, 0, 100);
      if (d) chips.push({ t: (d > 0 ? "+" : "") + d + " Réputation", k: d > 0 ? "g" : "b" });
    }
    if (fx.form) { s.form = clamp(s.form + fx.form, 5, 100); chips.push({ t: (fx.form > 0 ? "+" : "") + fx.form + " Forme", k: fx.form > 0 ? "g" : "b" }); }
    if (fx.mor) { s.moral = clamp(s.moral + fx.mor, 5, 100); chips.push({ t: (fx.mor > 0 ? "+" : "") + fx.mor + " Moral", k: fx.mor > 0 ? "g" : "b" }); }
    if (fx.dis) { s.discipline = clamp(s.discipline + fx.dis, 5, 100); chips.push({ t: (fx.dis > 0 ? "+" : "") + fx.dis + " Discipline", k: fx.dis > 0 ? "g" : "b" }); }
    if (fx.coach) { s.coachRel = clamp(s.coachRel + fx.coach, 5, 100); chips.push({ t: (fx.coach > 0 ? "+" : "") + fx.coach + " Relation entraîneur", k: fx.coach > 0 ? "g" : "b" }); }
    if (fx.fatigue) { s.fatigue = clamp(s.fatigue + fx.fatigue, 0, 100); chips.push({ t: (fx.fatigue > 0 ? "+" : "") + fx.fatigue + " Fatigue", k: fx.fatigue > 0 ? "b" : "g" }); }
    if (fx.money) { s.money += fx.money; chips.push({ t: (fx.money > 0 ? "+" : "") + fmtMoney(fx.money), k: fx.money > 0 ? "g" : "b" }); }
    if (fx.inj) { s.injuryWeeks += fx.inj; s.seasonInjury += fx.inj; chips.push({ t: fx.inj + " semaines d'arrêt", k: "b" }); }
    if (fx.wildcard) { s.wildcards += fx.wildcard; chips.push({ t: "+" + fx.wildcard + " wildcard", k: "g" }); }
    if (fx.trait && !hasTrait(s, fx.trait)) {
      s.traits.push(fx.trait);
      chips.push({ t: "Trait : " + D.TRAITS[fx.trait].name, k: "t" });
    }
    if (fx.flag) s.flags[fx.flag] = true;
    if (fx.flag2) s.flags[fx.flag2] = true;
    if (fx.clearFlag) delete s.flags[fx.clearFlag];
    if (fx.rivalEdge && s.rivals.length) {
      s.rivals[0].edge = (s.rivals[0].edge || 0) + fx.rivalEdge;
      chips.push({ t: fx.rivalEdge > 0 ? "Ascendant sur votre rival" : "Votre rival prend l'ascendant", k: fx.rivalEdge > 0 ? "g" : "b" });
    }
    if (fx.aff) { for (const k in fx.aff) s.aff[k] += fx.aff[k]; normaliseAff(s); chips.push({ t: "Profil de surface modifié", k: "t" }); }
    if (fx.affFixWeak) { shiftAff(s, worstSurface(s), fx.affFixWeak); chips.push({ t: "Votre pire surface s'améliore", k: "g" }); }
    if (fx.affBoostBest) { shiftAff(s, bestSurface(s), fx.affBoostBest); chips.push({ t: "Votre meilleure surface se renforce", k: "g" }); }
    if (fx.affCutBest) { shiftAff(s, bestSurface(s), -fx.affCutBest); chips.push({ t: "Votre atout principal s'émousse", k: "b" }); }
    return chips;
  }

  function applyTeamDelta(s, team) {
    if (!team) return;
    for (const k in team) {
      if (s.team[k] === undefined) continue;
      s.team[k] = clamp(s.team[k] + team[k], 0, 3);
      if (k === "coach" && team[k] !== 0) s.coachChanges++;
    }
  }

  /* ---------- Événements --------------------------------------------------- */
  function eventEligible(s, ev) {
    const c = ev.cond || {};
    if (ev.scheduledOnly && !c.flag) return false;
    if (s.usedEvents.indexOf(ev.id) >= 0) return false;
    if (c.aMin != null && s.age < c.aMin) return false;
    if (c.aMax != null && s.age > c.aMax) return false;
    if (c.rankMax != null && s.rank > c.rankMax) return false;
    if (c.rankMin != null && s.rank < c.rankMin) return false;
    const v = niv(s);
    if (c.nivMin != null && v < c.nivMin) return false;
    if (c.nivMax != null && v > c.nivMax) return false;
    if (c.repMin != null && s.rep < c.repMin) return false;
    if (c.repMax != null && s.rep > c.repMax) return false;
    if (c.moneyMin != null && s.money < c.moneyMin) return false;
    if (c.moneyMax != null && s.money > c.moneyMax) return false;
    if (c.formMin != null && s.form < c.formMin) return false;
    if (c.formMax != null && s.form > c.formMax) return false;
    if (c.morMin != null && s.moral < c.morMin) return false;
    if (c.morMax != null && s.moral > c.morMax) return false;
    if (c.disMin != null && s.discipline < c.disMin) return false;
    if (c.disMax != null && s.discipline > c.disMax) return false;
    if (c.coachMin != null && s.coachRel < c.coachMin) return false;
    if (c.coachMax != null && s.coachRel > c.coachMax) return false;
    if (c.trait && !hasTrait(s, c.trait)) return false;
    if (c.notTrait && hasTrait(s, c.notTrait)) return false;
    if (c.flag && !s.flags[c.flag]) return false;
    if (c.notFlag && s.flags[c.notFlag]) return false;
    if (c.profile && s.profile.id !== c.profile) return false;
    if (c.origin && s.origin.id !== c.origin) return false;
    if (c.lifestyle && s.lifestyle.id !== c.lifestyle) return false;
    if (c.entourage && s.entourage.id !== c.entourage) return false;
    if (c.circuit && s.circuit.id !== c.circuit) return false;
    if (c.homeSlam && !s.nat.homeSlam) return false;
    if (c.slamWinner && s.titles.slam < 1) return false;
    if (c.chance != null && rng() > c.chance) return false;
    return true;
  }

  function pickEvent(s) {
    if (s.flags.retire_pending) {
      const ev = EV.EVENTS.filter((e) => e.id === "ev_retire_decision")[0];
      if (ev) return ev;
    }
    const pool = EV.EVENTS.filter((e) => !e.scheduledOnly && eventEligible(s, e));
    if (!pool.length) return null;
    return weighted(pool, (e) => e.w || 10);
  }

  function resolveOption(s, ev, optIdx) {
    const opt = ev.options[optIdx];
    const out = weighted(opt.outcomes, (o) => o.weight);
    s.usedEvents.push(ev.id);
    const chips = applyFx(s, out.fx || {}, []);
    if (out.team) applyTeamDelta(s, out.team);
    const impact = netImpact(out.fx);
    if (Math.abs(impact) >= 8) s.history.push({ age: s.age, text: out.text, impact });
    return { outcome: out, chips, impact };
  }

  function netImpact(fx) {
    if (!fx) return 0;
    let v = 0;
    for (const k of ["ser", "ret", "fdc", "dep", "phy", "men"]) v += (fx[k] || 0) * 1.2;
    v += (fx.rep || 0) * 0.9 + (fx.mor || 0) * 0.4 + (fx.form || 0) * 0.4;
    v -= (fx.inj || 0) * 0.6;
    v += (fx.money || 0) * 2;
    if (fx.trait) v += 5;
    return Math.round(v);
  }

  /* ---------- Simulation d'une saison ------------------------------------- */
  function seasonHeader(s) {
    return {
      age: s.age, year: s.year, rank: s.rank, points: s.points,
      defend: s.points, niv: niv(s),
      protectedActive: s.protectedLeft > 0 && s.protectedRank < s.rank,
    };
  }

  function playSeason(s, program) {
    const report = {
      age: s.age, year: s.year, results: [], lines: [], h2h: [],
      points: 0, prize: 0, wins: 0, losses: 0, tournaments: 0,
      titles: [], awards: [], prevRank: s.rank, prevPoints: s.points,
      injury: null, pendingMoment: null, longWins: 0,
    };
    s.prevPoints = s.points;
    s.prevRank = s.rank;
    s.seasonInjury = 0;

    // Dette chronique reversée
    if (s.chronicWeeks > 0) {
      const carry = Math.min(s.chronicWeeks, 24);
      s.injuryWeeks += carry; s.seasonInjury += carry; s.chronicWeeks -= carry;
      report.lines.push({ txt: "Séquelles de la blessure précédente : " + carry + " semaines encore perdues.", tone: "bad" });
    }

    // Micro-événement d'ambiance
    if (rng() < D.BALANCE.microChance) {
      const pool = EV.MICRO_EVENTS.filter((m) => s.age >= m.aMin && s.age <= m.aMax);
      if (pool.length) {
        const m = weighted(pool, (x) => x.w);
        applyFx(s, m.fx || {});
        report.lines.push({ txt: m.text, tone: "n" });
      }
    }

    // Hygiène de vie
    if (s.discipline < 40 && rng() < 0.35) {
      s.form = clamp(s.form - 4, 5, 100); s.injuryWeeks += 2;
      report.lines.push({ txt: "Préparation négligée : le corps commence à envoyer des signaux.", tone: "bad" });
    } else if (s.discipline >= 72) s.form = clamp(s.form + 2, 5, 100);

    if (s.trajectory.id === "unstable" && rng() < 0.4) {
      s.form = clamp(s.form - randInt(2, 8), 5, 100);
      s.moral = clamp(s.moral - randInt(0, 6), 5, 100);
    }

    // Blessure de saison (avant le calendrier : elle ampute les tournois)
    const planned = program.volume.n;
    const inj = rollInjury(s, planned);
    if (inj) {
      applyInjury(s, inj);
      report.injury = { id: inj.tier.id, label: D.BALANCE.injLabels[inj.tier.id], weeks: inj.weeks };
      s.history.push({ age: s.age, text: D.BALANCE.injLabels[inj.tier.id] + " : " + inj.weeks + " semaines d'arrêt.", impact: -(inj.tier.mor + 5) });
      if (inj.tier.protected && inj.weeks >= D.BALANCE.protectedWeeks) {
        report.lines.push({ txt: "Classement protégé accordé : votre rang de " + s.protectedRank + "e vous ouvrira huit tournois au retour.", tone: "n" });
      }
      if (inj.tier.endChance && rng() < inj.tier.endChance) {
        s.careerEnded = true; s.careerEndReason = "medical";
      }
    }

    // Calendrier
    const sched = buildSchedule(s, program);
    let wcUsed = 0;
    for (const item of sched) {
      const res = resolveTournament(s, item.entry, item.t, report);
      if (item.entry.id === "wildcard") wcUsed++;
      if (item.entry.id === "protected" && s.protectedLeft > 0) s.protectedLeft--;
      report.results.push(res);
      report.tournaments++;
      report.points += res.points;
      report.prize += res.prize;
      if (res.stage > 0) { report.wins += res.wins; }
      report.losses += res.title ? 0 : 1;
      if (res.title) {
        report.titles.push(res);
        s.titles[item.t.tier]++;
        s.titleSurfaces[item.t.surface] = (s.titleSurfaces[item.t.surface] || 0) + 1;
        if (item.t.tier === "m1000") s.m1000ById[item.t.id] = true;
      }
      if (res.final) { s.slamFinals++; s.slamFinalsById[item.t.id] = true; }
      if (s.circuit.slamBo5 && item.t.tier === "slam") report.longWins += res.wins;
    }
    s.wildcards = Math.max(0, s.wildcards - Math.max(0, wcUsed - (s.nat.homeSlam ? 1 : 0)));
    if (allowedTiers(s.rank).indexOf("futures") >= 0) s.everFutures = true;

    // Coupe des Nations et Jeux Olympiques
    if (s.rank <= 90 && rng() < 0.55) {
      const pNat = clamp(0.06 + s.nat.w * 0.10 + (niv(s) - 72) * 0.006, 0.02, 0.32);
      if (rng() < pNat) {
        s.trophies.nations++;
        report.awards.push("nations");
        report.lines.push({ txt: "Votre nation remporte la Coupe des Nations, et vous y avez pris une part décisive.", tone: "good" });
      }
      s.fatigue = clamp(s.fatigue + 6, 0, 100);
    }
    if (s.year % 4 === 0 && s.rank <= 60) {
      const pOly = clamp(0.05 + (niv(s) - 76) * 0.012, 0.01, 0.30);
      if (rng() < pOly) {
        s.trophies.olympic++;
        report.awards.push("olympic");
        report.lines.push({ txt: "Médaille d'or olympique. Un titre qui ne revient que tous les quatre ans.", tone: "good" });
      }
    }

    // Moment décisif de la saison (un seul, par ordre de priorité)
    report.pendingMoment = chooseMoment(s, report, inj);

    // Finales de Majeur non traitées par le moment : résolution automatique
    for (const res of report.results) {
      if (!res.final) continue;
      if (report.pendingMoment && report.pendingMoment.res === res) continue;
      if (rng() < finalProbability(s, res.t, 0.48)) winFinal(s, res, report);
    }

    finaliseSeason(s, report);
    return report;
  }

  function chooseMoment(s, report, inj) {
    // 1 · finale de Majeur ou Finale de circuit
    const fin = report.results.filter((r) => r.final);
    if (fin.length) {
      const r = fin.sort((a, b) => (b.t.tier === "slam" ? 1 : 0) - (a.t.tier === "slam" ? 1 : 0))[0];
      return { type: "slamFinal", res: r, moment: pick(EV.KEY_MOMENTS.slamFinal), title: true };
    }
    // 2 · retour de blessure lourde
    if (inj && inj.tier.interactive && inj.tier.big && inj.weeks >= 20) {
      return { type: "comeback", res: null, moment: EV.KEY_MOMENTS.comeback[0] };
    }
    // 3 · première rencontre avec un rival
    if (!s.flags.rival_first_done && report.h2h.length) {
      s.flags.rival_first_done = true;
      const target = report.results.filter((r) => r.stage >= 2).sort((a, b) => b.points - a.points)[0];
      if (target) return { type: "rivalFirst", res: target, moment: EV.KEY_MOMENTS.rivalFirst[0] };
    }
    // 4 · wildcard à domicile sur le Majeur national
    const home = report.results.filter((r) => r.entry.id === "wildcard" && r.t.id === s.nat.homeSlam)[0];
    if (home) return { type: "homeSlam", res: home, moment: EV.KEY_MOMENTS.homeSlam[0] };
    // 5 · blessure en cours de tournoi
    if (inj && inj.tier.id === "muscle" && rng() < 0.5) {
      const t = report.results.filter((r) => r.stage >= 1).sort((a, b) => b.points - a.points)[0];
      if (t) return { type: "medical", res: t, moment: EV.KEY_MOMENTS.medical[0] };
    }
    // 6 · gros tournoi atteint loin
    const deep = report.results
      .filter((r) => (r.t.tier === "slam" || r.t.tier === "m1000") && r.stage >= D.TIERS[r.t.tier].stages - 4)
      .sort((a, b) => b.points - a.points)[0];
    if (deep) {
      const kind = rng() < 0.5 ? "breakPoint" : "tiebreak";
      return { type: kind, res: deep, moment: EV.KEY_MOMENTS[kind][0] };
    }
    // 7 · balle de match à sauver, au hasard
    if (rng() < 0.10) {
      const t = report.results.filter((r) => r.stage >= 1).sort((a, b) => b.points - a.points)[0];
      if (t) return { type: "matchPoint", res: t, moment: EV.KEY_MOMENTS.matchPoint[0] };
    }
    return null;
  }

  function momentProbability(s, pending, option) {
    let base = option.base;
    if (option.phyBias) base += (s.st.phy - 62) / 300;
    if (option.serBias) base += (s.st.ser - 62) / 300;
    const surface = pending.res ? pending.res.t.surface : bestSurface(s);
    const t = pending.res ? pending.res.t : { surface, tier: "m1000" };
    return finalProbability(s, t, base);
  }

  function resolveMoment(s, report, pending, optIdx) {
    const opt = pending.moment.options[optIdx];
    const p = momentProbability(s, pending, opt);
    const success = opt.safe ? true : rng() < p;
    const chips = [];

    if (opt.cost) applyFx(s, { money: -opt.cost }, chips);
    if (opt.fatigue) applyFx(s, { fatigue: opt.fatigue }, chips);
    if (success && opt.repWin) applyFx(s, { rep: opt.repWin }, chips);
    if (!success && opt.repFail) applyFx(s, { rep: opt.repFail }, chips);
    if (success && opt.traitWin && !hasTrait(s, opt.traitWin)) applyFx(s, { trait: opt.traitWin }, chips);
    if (success && opt.flagWin) s.flags[opt.flagWin] = true;
    if (success && opt.rivalWin && s.rivals.length) s.rivals[0].edge = (s.rivals[0].edge || 0) + opt.rivalWin;

    if (pending.type === "comeback") {
      if (success) { s.injuryWeeks = Math.max(0, s.injuryWeeks - (opt.recover || 10)); }
      else { s.chronicWeeks += (opt.setback || 8); }
    } else if (pending.type === "medical") {
      if (opt.injLess) { s.injuryWeeks = Math.max(0, s.injuryWeeks - opt.injLess); }
      if (!success && opt.injMore) { s.injuryWeeks += opt.injMore; s.seasonInjury += opt.injMore; }
      if (!success && pending.res && pending.res.stage > 0) downgrade(s, pending.res, report);
    } else if (pending.res) {
      if (pending.title) {
        if (success) {
          winFinal(s, pending.res, report);
          if (pending.res.t.tier === "slam" && s.flags.saved_mp) s.flags.saved_mp_final = true;
        }
      } else if (success) {
        upgrade(s, pending.res, report);
      } else if (pending.type !== "matchPoint") {
        // Un échec sur un moment de match ne coûte rien de plus que le résultat déjà tiré.
      }
    }

    // Recalage des compteurs après modification du résultat
    finaliseSeason(s, report, true);
    return { success, chips, text: success ? (opt.winText || pending.moment.winText) : (opt.failText || pending.moment.failText) };
  }

  function upgrade(s, res, report) {
    const tier = D.TIERS[res.t.tier];
    const cap = (res.t.tier === "slam" || res.t.tier === "finals") ? tier.stages - 2 : tier.stages - 1;
    if (res.stage >= cap) return;
    const before = res.stage;
    res.stage++;
    res.wins = res.stage;
    report.points += D.POINTS[res.t.tier][res.stage] - D.POINTS[res.t.tier][before];
    report.prize += D.PRIZE[res.t.tier][res.stage] - D.PRIZE[res.t.tier][before];
    res.points = D.POINTS[res.t.tier][res.stage];
    res.prize = D.PRIZE[res.t.tier][res.stage];
    res.final = (res.t.tier === "slam" || res.t.tier === "finals") && res.stage === tier.stages - 2;
    if (res.stage === tier.stages - 1) {
      res.title = true;
      report.titles.push(res);
      s.titles[res.t.tier]++;
      s.titleSurfaces[res.t.surface] = (s.titleSurfaces[res.t.surface] || 0) + 1;
      if (res.t.tier === "m1000") s.m1000ById[res.t.id] = true;
    }
  }

  function downgrade(s, res, report) {
    if (res.stage <= 0) return;
    const before = res.stage;
    res.stage--;
    res.wins = res.stage;
    report.points += D.POINTS[res.t.tier][res.stage] - D.POINTS[res.t.tier][before];
    report.prize += D.PRIZE[res.t.tier][res.stage] - D.PRIZE[res.t.tier][before];
    res.points = D.POINTS[res.t.tier][res.stage];
    res.prize = D.PRIZE[res.t.tier][res.stage];
    res.final = false;
  }

  /* ---------- Clôture de saison ------------------------------------------- */
  function finaliseSeason(s, report, recompute) {
    if (recompute && report._finalised) {
      // On annule les effets déjà appliqués avant de les recalculer
      s.points = report._pointsBefore;
      s.rank = report._rankBefore;
    }
    report._pointsBefore = s.prevPoints;
    report._rankBefore = s.prevRank;

    s.points = report.points;
    s.rank = rankFromPoints(s.points);
    if (s.rank < s.bestRank) s.bestRank = s.rank;
    report.rank = s.rank;
    report.pointsTotal = s.points;
    report.delta = s.points - s.prevPoints;
    report._finalised = true;
  }

  function seasonAwards(s, report) {
    const got = [];
    for (const t of report.titles) {
      if (t.t.tier === "slam") got.push("slam");
      else if (t.t.tier === "finals") got.push("finals");
      else if (t.t.tier === "m1000") got.push("m1000");
      else if (t.t.tier === "t500") got.push("t500");
      else if (t.t.tier === "t250") got.push("t250");
    }
    for (const r of report.results) if (r.final && r.t.tier === "slam") got.push("slamFinal");
    for (const a of report.awards) got.push(a);
    if (s.rank === 1) { got.push("yearEndNo1"); s.trophies.yearEndNo1++; }
    if (report.prevRank > 250 && s.rank <= 80 && s.injuryHistory > 0) got.push("comeback");
    else if (report.prevRank - s.rank > 90 && s.rank <= 150) got.push("mostImproved");

    let pts = 0;
    for (const id of got) {
      const a = D.AWARDS[id];
      if (!a) continue;
      s.awardCounts[id] = (s.awardCounts[id] || 0) + 1;
      applyFx(s, a.fx || {});
      pts += a.pts;
    }
    report.awardIds = got;
    report.legendPts = Math.round(pts * 10) / 10;
    return got;
  }

  function seasonEconomy(s, report) {
    const agent = D.TEAM_ROLES[3].levels[s.team.agent];
    const gross = report.prize;
    const spon = sponsorIncome(s);
    const grant = s.rank > 100 && !s.flags.fed_broken ? s.nat.grant : 0;
    let travel = 0;
    for (const r of report.results) {
      travel += (r.t.tier === "futures" || r.t.tier === "challenger")
        ? D.BALANCE.travelCostSmall : D.BALANCE.travelCost;
    }
    const team = teamCost(s);
    const commission = gross * agent.pct;
    const tax = (gross + spon) * D.BALANCE.taxRate;
    const net = gross + spon + grant - travel - team - commission - tax;
    s.money += net;
    s.lifetimeEarnings += gross + spon;
    if (s.money < 0) { s.moneyEverNegative = true; s.totals.seasonsNegative++; }
    if (s.money < D.BALANCE.deepDebt) s.flags.deepDebt = true;
    report.economy = { gross, spon, grant, travel, team, commission, tax, net, balance: s.money };

    // Faillite : l'équipe saute
    if (s.money < D.BALANCE.bankruptcyFloor) {
      const before = s.team.coach + s.team.fitness + s.team.physio;
      s.team.coach = Math.min(s.team.coach, 1);
      s.team.fitness = 0; s.team.physio = 0;
      if (before > s.team.coach) {
        report.lines.push({ txt: "Trésorerie à sec : vous vous séparez de votre équipe et repartez seul sur le circuit.", tone: "bad" });
        s.moral = clamp(s.moral - 8, 5, 100);
      }
    }
    return report.economy;
  }

  /* ---------- Vieillissement et intersaison -------------------------------- */
  function growthFactor(s, program) {
    const coach = D.TEAM_ROLES[0].levels[s.team.coach].growth;
    const gap = s.potCap - niv(s);
    let potDamp = gap <= 0 ? 0.15 : gap <= 4 ? 0.45 : 1;
    if (s.prodigy && s.age <= 20) potDamp = Math.max(potDamp, 0.85);
    const injDamp = clamp(1 - s.seasonInjury / D.BALANCE.growthDamp, 0.55, 1);
    const vol = program ? program.volume.growth : 1;
    return coach * potDamp * trajMult(s) * injDamp * vol;
  }

  function advanceYear(s, program, report) {
    const g = growthFactor(s, program);
    const a = s.age + (s.circuit.ageShift || 0);
    const up = (k, lo, hi, mult) => { s.st[k] = clamp(s.st[k] + Math.round(rand(lo, hi) * (mult === undefined ? 1 : mult)), 1, 99); };
    const genius = hasTrait(s, "genius") && s.age <= 22 ? 1.4 : 1;

    if (a <= 19) {
      up("ser", 2, 4, g * genius); up("ret", 2, 4, g * genius);
      up("fdc", 2, 4, g * genius); up("dep", 1, 3, g);
      up("phy", 1, 3, g); up("men", 0, 2, 1);
      const explosive = s.trajectory.id === "early" || s.trajectory.id === "flash";
      if ((explosive || s.prodigy) && rng() < (s.prodigy ? 0.85 : 0.55)) {
        const b = s.prodigy ? 2 : 1;
        up("fdc", 3 * b, 5 * b, 1); up("ser", 2 * b, 4 * b, 1); up("ret", 2 * b, 4 * b, 1);
      }
    } else if (a <= 23) {
      up("ser", 1, 2.5, g * genius); up("ret", 1, 3, g * genius);
      up("fdc", 1, 3, g * genius); up("dep", 1, 2, g);
      up("phy", 0, 2, g); up("men", 1, 2, 1);
      if (s.trajectory.id === "surge" && s.age >= s.sparkAge && s.age <= s.sparkAge + 2 && rng() < 0.7) {
        up("fdc", 2, 5, 1); up("ser", 1, 3, 1); up("ret", 1, 3, 1);
      }
    } else if (a <= 28) {
      up("ser", 0, 1, g); up("ret", 0, 1.5, g); up("fdc", 0, 1.5, g);
      up("dep", 0, 1, g); up("men", 1, 2, 1);
      if (rng() < 0.35) up("phy", -1, 0, 1);
    } else if (a <= 31) {
      if (rng() < 0.5) up("ser", 0, 1, 1);
      up("ret", -1, 1, 1); up("fdc", -1, 1, 1);
      up("dep", -2, -1, 1); up("phy", -2, -1, 1); up("men", 0, 1, 1);
    } else if (a <= 34) {
      up("ser", -1, 0, 1); up("ret", -2, -1, 1); up("fdc", -2, -1, 1);
      up("dep", -3, -2, 1); up("phy", -3, -2, 1); up("men", 0, 1, 1);
    } else {
      const soft = hasTrait(s, "ironman") ? 0.6 : 1;
      up("ser", -2, -1, hasTrait(s, "arm") ? 0.4 : 1);
      up("ret", -3, -2, 1); up("fdc", -3, -2, 1);
      up("dep", -5, -3, soft); up("phy", -5, -3, soft); up("men", 0, 1, 1);
    }
    if (hasTrait(s, "arm") && s.age <= 26) up("ser", 1, 1, 1);
    if (hasTrait(s, "hothead") && rng() < 0.3) s.discipline = clamp(s.discipline - 3, 5, 100);
    if (s.discipline >= 72 && rng() < 0.5) up("fdc", 1, 1, 1);
    if (s.trajectory.id === "flash" && s.age >= 27) { up("phy", -1, -1, 1); if (rng() < 0.5) up("fdc", -1, -1, 1); }
    if (s.trajectory.id === "steady" && s.age >= 29 && rng() < 0.5) up("phy", 1, 1, 1);

    s.peakNiv = Math.max(s.peakNiv, niv(s));

    // Fatigue
    const extra = report ? report.tournaments - 20 : 0;
    const fit = D.TEAM_ROLES[1].levels[s.team.fitness];
    let f = s.fatigue + extra * D.BALANCE.fatiguePerExtra
          + (report ? report.longWins * D.BALANCE.fatigueLongMatch : 0)
          + (program ? program.volume.fatigue : 0)
          - (10 + s.st.phy / 6 - fit.fatigue);
    if (hasTrait(s, "ironman")) f -= 8;
    s.fatigue = clamp(Math.round(f), 0, 100);
    if (fit.phy) up("phy", fit.phy, fit.phy, 1);

    // Jauges
    const moralTarget = (hasTrait(s, "zen") ? D.BALANCE.moralTargetZen : D.BALANCE.moralTarget)
                        + Math.round((s.coachRel - 55) / 8);
    s.form = clamp(Math.round(s.form + (D.BALANCE.formTarget - s.form) * 0.35 + rand(-6, 6)), 5, 100);
    s.moral = clamp(Math.round(s.moral + (moralTarget - s.moral) * 0.25 + rand(-4, 4)), 5, 100);
    s.discipline = clamp(Math.round(s.discipline + (50 - s.discipline) * 0.06), 5, 100);
    s.coachRel = clamp(Math.round(s.coachRel + (55 - s.coachRel) * 0.15), 5, 100);

    // Relation entraîneur selon la saison
    if (report) {
      const expected = expectedRank(s);
      if (s.rank < expected * 0.75) s.coachRel = clamp(s.coachRel + 5, 5, 100);
      else if (s.rank > expected * 1.5) s.coachRel = clamp(s.coachRel - 4, 5, 100);
    }

    // Blessure : on repart d'une base saine, la dette chronique reste
    s.maxSeasonInjury = Math.max(s.maxSeasonInjury, s.seasonInjury);
    s.injuryWeeks = 0;
    if (s.protectedLeft > 0 && s.rank <= 80) { s.protectedLeft = 0; s.flags.protectedReturn = true; }

    // Semaines au rang 1
    if (s.rank === 1) s.weeksNo1 += 52;
    else if (s.bestRank === 1 && s.prevRank === 1) s.weeksNo1 += 20;

    if (s.rank <= 10) s.everTop10 = true;
    s.totals.matches += report ? report.wins + report.losses : 0;
    s.totals.wins += report ? report.wins : 0;
    s.totals.losses += report ? report.losses : 0;
    s.totals.tournaments += report ? report.tournaments : 0;
    s.totals.longWins += report ? report.longWins : 0;

    s.age++; s.year++; s.seasonsPro++;

    // Épuisement mental
    if (report && report.tournaments >= D.BALANCE.burnoutTournaments && s.moral < D.BALANCE.burnoutMoral) {
      s.flags.burnout_risk = true;
    }
    // Pression de retraite
    if (!s.flags.retire_pending && !s.careerEnded) {
      const L = longevity(s);
      const pivot = D.BALANCE.retirePivot + L / 2 + (s.circuit.ageShift || 0);
      if (s.age >= D.BALANCE.retireFloor) {
        const p = clamp((s.age - pivot) * 0.28 + (s.rank > 120 ? 0.20 : 0) + (s.rank > 350 ? 0.25 : 0) + (s.moral < 35 ? 0.15 : 0), 0, 0.95);
        if (rng() < p) s.flags.retire_pending = true;
      }
    }
    if (s.age > D.BALANCE.ageMax) { s.careerEnded = true; s.careerEndReason = "age"; }
  }

  function expectedRank(s) {
    const v = niv(s);
    if (v >= 88) return 4; if (v >= 84) return 12; if (v >= 80) return 28;
    if (v >= 76) return 55; if (v >= 72) return 110; if (v >= 66) return 240;
    if (v >= 60) return 500; return 900;
  }

  function longevity(s) {
    let L = (s.st.ser - 60) / 12 + (s.discipline - 50) / 12 + (s.st.phy - 60) / 15;
    if (hasTrait(s, "ironman")) L += 4;
    if (hasTrait(s, "glass")) L -= 4;
    if (hasTrait(s, "zen")) L += 1;
    L -= s.chronicZones.length * 2;
    return L;
  }

  /* ---------- Fin de carrière ---------------------------------------------- */
  function totalAwards(s) {
    let n = 0; for (const k in s.awardCounts) n += s.awardCounts[k]; return n;
  }
  function slamCount(s) { return s.titles.slam; }
  function distinctSlams(s) { return Object.keys(s.slamsById).length; }

  function careerRating(s) {
    let bonus = 1.6 * s.titles.slam
      + 1.2 * s.trophies.yearEndNo1
      + Math.min(2, s.weeksNo1 / 60)
      + Math.min(2, s.titles.m1000 * 0.25)
      + Math.min(1.5, s.titles.finals * 0.6)
      + (s.trophies.olympic ? 1 : 0)
      + Math.min(1, (s.titles.t500 + s.titles.t250 + s.titles.m1000 + s.titles.slam) / 25)
      + (s.rep >= 90 ? 1 : 0);
    return Math.min(97, Math.round(s.peakNiv + Math.min(11, bonus)));
  }

  function careerScore(s) {
    let rivalsDominated = 0;
    for (const r of s.rivals) if (r.h2hWin > r.h2hLoss) rivalsDominated++;
    return Math.round(
      s.peakNiv * 1.0 + s.rep * 0.45
      + s.titles.slam * 26
      + s.trophies.yearEndNo1 * 14
      + s.weeksNo1 * 0.10
      + s.titles.finals * 9
      + s.titles.m1000 * 5
      + s.trophies.olympic * 8
      + s.trophies.nations * 4
      + s.titles.t500 * 2.5
      + s.titles.t250 * 1.2
      + Math.min(15, s.totals.wins / 45)
      + Math.min(10, rivalsDominated * 2.5)
      + Math.max(0, s.money) * 0.05
    );
  }

  function careerTier(s) {
    const score = careerScore(s);
    if (s.careerEnded && s.careerEndReason === "medical") {
      return { title: "Carrière brisée", story: "Le corps a dit non avant que le tennis n'ait fini de parler. On ne saura jamais ce que cette carrière serait devenue." };
    }
    if (s.titles.slam === 0 && s.slamFinals >= 3) {
      return { title: "L'éternel second", story: "Trois finales de Majeur, trois défaites. Tous ceux qui vous ont vu jouer savent que vous méritiez mieux, et ça ne change rien." };
    }
    if (s.titles.slam >= 3 && Object.keys(s.titleSurfaces).length === 1) {
      const surf = Object.keys(s.titleSurfaces)[0];
      const nm = D.SURFACES.filter((x) => x.id === surf)[0];
      return { title: "Le spécialiste", story: "Sur " + (nm ? nm.name.toLowerCase() : "une surface") + ", vous avez régné sans partage. Ailleurs, on vous attend encore. C'est une autre définition de la grandeur, et elle vous va bien." };
    }
    for (const t of D.CAREER_TIERS) if (score >= t.min) return { title: t.title, story: t.story };
    return { title: D.CAREER_TIERS[D.CAREER_TIERS.length - 1].title, story: "" };
  }

  // Contrefactuelle : ce que la carrière aurait donné dans une génération normale
  function generationEffect(s) {
    const g = s.generation;
    if (g.id === "normal") return null;
    const factor = { golden: 2.6, strong: 1.5, normal: 1, open: 0.72, weak: 0.5 }[g.id] || 1;
    const alt = Math.round(s.titles.slam * factor);
    if (alt === s.titles.slam) return null;
    return { gen: g, alt, delta: alt - s.titles.slam };
  }

  /* ---------- Badges -------------------------------------------------------- */
  function evaluateBadges(s, meta) {
    const got = [];
    const add = (id) => got.push(id);
    const broken = s.careerEnded && s.careerEndReason === "medical" && s.age < 24;
    if (broken) return got;

    const firstSlamAge = s.flags.firstSlamAge || 99;
    if (firstSlamAge < 21) add("slam_21");
    if (s.flags.top10Age && s.flags.top10Age < 20) add("top10_20");
    if (s.flags.no1Age && s.flags.no1Age < 22) add("no1_22");
    if (s.flags.junior_title && s.flags.firstProTitleSameYear) add("junior_pro");

    if (s.titles.slam >= 1) add("slam_1");
    if (s.titles.slam >= 5) add("slam_5");
    if (s.titles.slam >= 8) add("slam_10");
    if (distinctSlams(s) === 4) add("career_slam");
    if (s.flags.calendarSlam) add("calendar_slam");
    if (distinctSlams(s) === 4 && s.trophies.olympic > 0) add("golden_slam");
    if (Object.keys(s.slamFinalsById).length + distinctSlams(s) >= 4 &&
        new Set(Object.keys(s.slamFinalsById).concat(Object.keys(s.slamsById))).size === 4) add("slam_finals4");

    for (const k in s.slamsById) if (s.slamsById[k] >= 4) add("same_slam_5");
    if (s.flags.threeSurfaceSeason) add("three_surfaces");
    if (s.titles.slam >= 3 && Object.keys(s.titleSurfaces).length === 1 && s.titleSurfaces.clay) add("pure_clay");

    if (s.bestRank === 1) add("no1");
    if (s.weeksNo1 >= 100) add("weeks_100");
    if (s.weeksNo1 >= 250) add("weeks_300");
    if (s.trophies.yearEndNo1 >= 3) add("yearend_3");
    if (Object.keys(s.m1000ById).length >= 9) add("all_m1000");

    if (s.totals.wins >= 750) add("wins_900");
    if (s.flags.season90) add("season_90");
    if (s.totals.longWins >= 20) add("five_setters");
    if (s.flags.finalsUnbeaten) add("finals_unbeaten");

    let dominated = 0, maxH2H = 0;
    for (const r of s.rivals) { if (r.h2hWin > r.h2hLoss) dominated++; maxH2H = Math.max(maxH2H, r.h2hWin); }
    if (s.rivals.length && dominated === s.rivals.length) add("rivals_all");
    if (s.flags.twoRivalsOneSlam) add("two_rivals");
    if (maxH2H >= 10) add("rival_10");

    if (s.everFutures && s.bestRank === 1) add("futures_to_no1");
    if (s.seasonsPro >= 20) add("seasons_20");
    if (s.maxSeasonInjury <= 4 && s.seasonsPro >= 10) add("never_hurt");
    if (s.coachChanges === 0 && s.seasonsPro >= 10) add("one_coach");
    if (s.money >= 40) add("moneybags");
    if (s.totals.tournaments >= 320) add("globe");
    if (s.trophies.nations > 0) add("nations_cup");
    if (s.trophies.olympic > 0) add("olympic");

    if (s.flags.slamOut100) add("slam_out100");
    if (s.flags.saved_mp_final) add("saved_mp");
    if (s.flags.noSetLost) add("no_set_lost");
    if (s.flags.eternalRedeemed) add("eternal_second");
    if (s.flags.miracleSlam) add("miracle");
    if (s.flags.protectedReturn) add("protected_return");

    if (meta) {
      if (meta.streak >= 7) add("quest_streak7");
      if (meta.questsDone >= 20) add("quest_20");
    }
    return got;
  }

  /* ---------- Suivi de jalons (appelé en fin de saison) -------------------- */
  function trackMilestones(s, report) {
    if (report.titles.filter((t) => t.t.tier === "slam").length) {
      if (!s.flags.firstSlamAge) s.flags.firstSlamAge = s.age;
      if (report.prevRank > 100) s.flags.slamOut100 = true;
      if (s.injuryHistory > 0 && s.flags.wasOut200) s.flags.miracleSlam = true;
      if (s.slamFinals >= 3 && s.titles.slam === report.titles.filter((t) => t.t.tier === "slam").length) s.flags.eternalRedeemed = true;
      const slamsThisYear = report.titles.filter((t) => t.t.tier === "slam").length;
      if (slamsThisYear === 4) s.flags.calendarSlam = true;
      if (rng() < 0.12) s.flags.noSetLost = true;
    }
    for (const t of report.titles) {
      if (t.t.tier === "slam") s.slamsById[t.t.id] = (s.slamsById[t.t.id] || 0) + 1;
    }
    if (s.rank > 200) s.flags.wasOut200 = true;
    if (s.rank <= 10 && !s.flags.top10Age) s.flags.top10Age = s.age;
    if (s.rank === 1 && !s.flags.no1Age) s.flags.no1Age = s.age;
    const surfacesWon = {};
    for (const t of report.titles) {
      // Seuls les titres du circuit principal comptent pour ce badge.
      if (t.t.tier === "challenger" || t.t.tier === "futures") continue;
      surfacesWon[t.t.surface] = true;
    }
    if (Object.keys(surfacesWon).length >= 3) s.flags.threeSurfaceSeason = true;
    const total = report.wins + report.losses;
    if (total >= 30 && report.wins / total >= 0.9) s.flags.season90 = true;
    if (report.results.filter((r) => r.t.tier === "finals" && r.title).length && rng() < 0.3) s.flags.finalsUnbeaten = true;
    const slamRivalWins = report.results.filter((r) => r.t.tier === "slam").reduce((a, r) => a + r.rivalBeaten, 0);
    if (slamRivalWins >= 2) s.flags.twoRivalsOneSlam = true;
    if (report.titles.length && s.flags.junior_title && s.age <= 19) s.flags.firstProTitleSameYear = true;
    s.seasons.push({
      age: report.age, year: report.year, rank: s.rank, points: s.points,
      titles: report.titles.length, slams: report.titles.filter((t) => t.t.tier === "slam").length,
      wins: report.wins, losses: report.losses, money: s.money,
    });
  }

  /* ---------- Utilitaires --------------------------------------------------- */
  function fmtMoney(m) {
    const a = Math.abs(m);
    if (a >= 1) return (m < 0 ? "−" : "") + a.toFixed(2).replace(".", ",") + " M€";
    if (a >= 0.001) return (m < 0 ? "−" : "") + Math.round(a * 1000) + " k€";
    return (m < 0 ? "−" : "") + Math.round(a * 1000000) + " €";
  }
  function stageLabel(tierId, stage) {
    const tier = D.TIERS[tierId];
    if (stage < 0) return "Qualifications";
    return D.STAGE_LABELS[tier.stages][stage];
  }

  return {
    setSeed, rng, rand, randInt, pick, clamp, weighted,
    niv, nivOn, hasTrait, bestSurface, worstSurface, normaliseAff, shiftAff,
    potStars, prodigyChance, rollPotential, trajMult,
    newCareer, generateName, rankFromPoints, effectiveRank, entryFor, allowedTiers,
    buildSchedule, resolveTournament, playSeason, resolveMoment, momentProbability,
    seasonAwards, seasonEconomy, sponsorIncome, teamCost, advanceYear, trackMilestones,
    applyFx, applyTeamDelta, pickEvent, resolveOption, eventEligible,
    careerRating, careerScore, careerTier, generationEffect, evaluateBadges,
    longevity, expectedRank, rivalNiv, rivalActive, injuryChance,
    fmtMoney, stageLabel, seasonHeader, totalAwards, distinctSlams,
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Engine;
