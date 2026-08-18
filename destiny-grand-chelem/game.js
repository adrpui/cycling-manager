/* ============================================================
   DESTINY GRAND CHELEM — Interface et boucle de jeu
   ============================================================ */

(function () {
  "use strict";

  const app = document.getElementById("app");
  const E = Engine;
  const STORE = "dgc_progress_v1";

  let S = null;              // carrière en cours
  let MODE = "career";       // "career" | "daily"
  let REPORT = null;         // rapport de la saison en cours
  let PROGRAM = { volume: VOLUMES[1], surface: "none" };
  let PENDING_EV = null;

  /* ---------- Progression persistante ---------------------------------- */
  function loadProgress() {
    let p = {};
    try { p = JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { p = {}; }
    return {
      xp: p.xp || 0,
      questPoints: p.questPoints || 0,
      jetonsFromCareers: p.jetonsFromCareers || 0,
      jetonsSpent: p.jetonsSpent || 0,
      ownedPerks: p.ownedPerks || [],
      equippedPerks: p.equippedPerks || [],
      badges: p.badges || [],
      pantheon: p.pantheon || [],
      streak: p.streak || 0,
      lastDay: p.lastDay || null,
      questsDone: p.questsDone || 0,
      dailyDone: p.dailyDone || null,
      careers: p.careers || 0,
    };
  }
  function saveProgress(p) { try { localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) {} }
  function jetons(p) { return Math.max(0, p.questPoints + p.jetonsFromCareers - p.jetonsSpent); }
  function xpForLevel(l) { return 150 + (l - 1) * 70; }
  function levelInfo(xp) {
    let lvl = 1, into = Math.max(0, xp || 0), need = xpForLevel(1);
    while (into >= need) { into -= need; lvl++; need = xpForLevel(lvl); }
    return { level: lvl, into, need };
  }
  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function hashInt(n) {
    let h = n >>> 0;
    h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b);
    h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b);
    h ^= h >>> 16; return h >>> 0;
  }

  /* ---------- Utilitaires de rendu -------------------------------------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function render(html) { app.innerHTML = html; window.scrollTo(0, 0); }
  function on(sel, fn) {
    app.querySelectorAll(sel).forEach((el) => el.addEventListener("click", (ev) => fn(el, ev)));
  }
  const surfCls = { hard: "hard", clay: "clay", grass: "grass" };
  const surfName = { hard: "Dur", clay: "Terre", grass: "Gazon" };

  function topBar() {
    const p = loadProgress();
    const li = levelInfo(p.xp);
    return '<div class="top">' +
      '<div class="logo">DESTINY<b>GRANDCHELEM</b></div>' +
      '<div class="top-meta">NIVEAU <b>' + li.level + '</b> · <b>' + jetons(p) + '</b> jetons · <b>' +
      p.badges.length + '</b>/' + BADGES.length + ' badges</div></div>';
  }

  function gaugeRow(label, v, invert) {
    const cls = invert ? (v > 70 ? "warn" : v > 45 ? "" : "ok") : (v < 40 ? "warn" : v > 70 ? "ok" : "");
    return '<div class="gauge"><span class="lb">' + label + '</span>' +
      '<span class="bar"><span class="fill ' + cls + '" style="width:' + Math.max(2, v) + '%"></span></span>' +
      '<span class="n">' + Math.round(v) + '</span></div>';
  }

  function statusBar() {
    const rank = S.rank;
    const eff = E.effectiveRank(S);
    return '<div class="status">' +
      '<div class="stat"><div class="k">Âge</div><div class="v">' + S.age + ' <small>ans</small></div></div>' +
      '<div class="stat"><div class="k">Classement</div><div class="v">' + rank + '<small>e</small>' +
        (eff < rank ? ' <small>(protégé ' + eff + 'e)</small>' : '') + '</div></div>' +
      '<div class="stat"><div class="k">Points</div><div class="v">' + S.points + '</div></div>' +
      '<div class="stat"><div class="k">Niveau</div><div class="v">' + E.niv(S) + '</div></div>' +
      '</div>' +
      '<div class="gauges">' +
      gaugeRow("Forme", S.form) + gaugeRow("Fatigue", S.fatigue, true) +
      gaugeRow("Moral", S.moral) + gaugeRow("Réputation", S.rep) +
      '</div>';
  }

  function affLine() {
    return ["hard", "clay", "grass"].map((k) =>
      '<span class="tag ' + surfCls[k] + '">' + surfName[k] + ' ' + (S.aff[k] > 0 ? "+" : "") + S.aff[k] + '</span>'
    ).join(" ");
  }

  /* ---------- Accueil ---------------------------------------------------- */
  function screenHome() {
    const p = loadProgress();
    const li = levelInfo(p.xp);
    const dailyDone = p.dailyDone === todayKey();
    render(topBar() +
      '<div class="hero"><h1>DESTINY<span>GRAND CHELEM</span></h1>' +
      '<p>De la première invitation en Futures au dernier tour d\'honneur. Chaque choix compte, et personne ne connaît son destin à l\'avance.</p>' +
      '<div class="surf-row"><span class="sf-hard">Dur</span><span class="sf-clay">Terre battue</span><span class="sf-grass">Gazon</span></div></div>' +
      '<div class="menu">' +
      btn("go-career", "🎾", "Nouvelle carrière", "Profil libre, avantages de boutique équipés.", true) +
      btn("go-daily", "🗓️", "Défi du jour" + (dailyDone ? " — déjà joué" : ""),
          "Le même profil imposé pour tout le monde, sans avantages. Le meilleur score l'emporte.") +
      btn("go-pantheon", "🏛️", "Panthéon", p.pantheon.length + " carrière" + (p.pantheon.length > 1 ? "s" : "") + " archivée" + (p.pantheon.length > 1 ? "s" : "")) +
      btn("go-shop", "🛒", "Boutique", jetons(p) + " jetons disponibles · " + p.equippedPerks.length + "/" + PERK_SLOTS + " avantages équipés") +
      btn("go-badges", "🏅", "Badges", p.badges.length + " sur " + BADGES.length + " débloqués") +
      btn("go-quests", "🎯", "Quêtes du jour", "Série en cours : " + p.streak + " jour" + (p.streak > 1 ? "s" : "")) +
      '</div>' +
      '<div class="card tight note">Niveau ' + li.level + ' — ' + li.into + ' / ' + li.need + ' points d\'expérience. ' +
      p.careers + ' carrière' + (p.careers > 1 ? "s" : "") + ' jouée' + (p.careers > 1 ? "s" : "") + '.</div>');

    on("#go-career", () => startCreation("career"));
    on("#go-daily", () => startCreation("daily"));
    on("#go-pantheon", screenPantheon);
    on("#go-shop", screenShop);
    on("#go-badges", screenBadges);
    on("#go-quests", screenQuests);
  }

  function btn(id, ic, lb, sb, primary) {
    return '<button id="' + id + '"' + (primary ? ' class="primary"' : '') + '><span class="ic">' + ic +
      '</span><span><span class="lb">' + esc(lb) + '</span><span class="sb">' + esc(sb) + '</span></span></button>';
  }

  /* ---------- Création --------------------------------------------------- */
  let DRAFT = null, STEP = 0;

  function startCreation(mode) {
    MODE = mode;
    DRAFT = { perks: [] };
    STEP = 0;
    if (mode === "daily") {
      const key = todayKey();
      const seed = Number(key.replace(/-/g, ""));
      E.setSeed(hashInt(seed + 777));
      DRAFT.circuit = CIRCUITS[hashInt(seed * 5 + 1) % CIRCUITS.length];
      DRAFT.nat = NATIONS[hashInt(seed * 5 + 2) % NATIONS.length];
      DRAFT.origin = ORIGINS[hashInt(seed * 5 + 3) % ORIGINS.length];
      DRAFT.hand = HANDS[hashInt(seed * 5 + 4) % HANDS.length];
      DRAFT.backhand = BACKHANDS[hashInt(seed * 5 + 5) % BACKHANDS.length];
      DRAFT.build = BUILDS[hashInt(seed * 5 + 6) % BUILDS.length];
      STEP = 3; // hygiène de vie et entourage restent au choix
    } else {
      E.setSeed(null);
      const p = loadProgress();
      DRAFT.perks = PERKS.filter((k) => p.equippedPerks.indexOf(k.id) >= 0);
    }
    screenCreate();
  }

  const STEPS = ["circuit", "nat", "origin", "lifestyle", "entourage", "style", "confirm"];

  function screenCreate() {
    const step = STEPS[STEP];
    let body = "";
    const head = (n, t, d) => '<div class="card"><div class="kicker">Étape ' + n + ' sur 7 · ' +
      (MODE === "daily" ? "Défi du jour" : "Nouvelle carrière") + '</div><h2>' + t + '</h2><p class="note">' + d + '</p>';

    if (step === "circuit") {
      body = head(1, "Quel circuit ?", "Le choix change les pondérations du niveau, le format des Majeurs et la courbe d'âge.") +
        '<div class="opts">' + CIRCUITS.map((c, i) =>
          '<button class="opt" data-i="' + i + '"><span class="lb">' + c.icon + " " + esc(c.name) +
          '</span><span class="pr">' + esc(c.desc) + '</span></button>').join("") + '</div></div>';
    } else if (step === "nat") {
      body = head(2, "Quelle nationalité ?", "Elle décide de votre bourse fédérale, de vos invitations, et surtout de la wildcard du Majeur national.") +
        '<div class="opts">' + NATIONS.map((n, i) =>
          '<button class="opt" data-i="' + i + '"><span class="lb">' + n.flag + " " + esc(n.name) +
          '</span><span class="pr">Fédération ' + (n.w >= 0.75 ? "puissante" : n.w >= 0.45 ? "solide" : "modeste") +
          ' · bourse ' + Math.round(n.grant * 1000) + ' k€' +
          (n.homeSlam ? ' · wildcard annuelle pour le Majeur national' : '') + '</span></button>').join("") + '</div></div>';
    } else if (step === "origin") {
      body = head(3, "D'où venez-vous ?", "Le seul choix dont les attributs de départ sont affichés. Le potentiel, lui, reste caché.") +
        '<div class="opts">' + ORIGINS.map((o, i) =>
          '<button class="opt" data-i="' + i + '"><span class="lb">' + o.icon + " " + esc(o.name) + '</span>' +
          '<span class="pr">' + esc(o.desc) + '</span>' +
          '<span class="pr">SER ' + o.st.ser + ' · RET ' + o.st.ret + ' · FDC ' + o.st.fdc +
          ' · DEP ' + o.st.dep + ' · PHY ' + o.st.phy + ' · MEN ' + o.st.men + '</span></button>').join("") + '</div></div>';
    } else if (step === "lifestyle") {
      body = head(4, "Votre hygiène de vie", "Aucune option n'est gratuite : chaque bonus se paie ailleurs.") +
        '<div class="opts">' + LIFESTYLES.map((l, i) =>
          '<button class="opt" data-i="' + i + '"><span class="lb">' + l.icon + " " + esc(l.name) + '</span>' +
          '<span class="pr">' + esc(l.desc) + '</span><span class="pr">' + fxLabel(l.fx) + '</span></button>').join("") + '</div></div>';
    } else if (step === "entourage") {
      body = head(5, "Qui vous entoure ?", "Votre entourage de départ oriente aussi la structure qui vous repère.") +
        '<div class="opts">' + ENTOURAGES.map((e, i) =>
          '<button class="opt" data-i="' + i + '"><span class="lb">' + e.icon + " " + esc(e.name) + '</span>' +
          '<span class="pr">' + esc(e.desc) + '</span><span class="pr">' + fxLabel(e.fx) + '</span></button>').join("") + '</div></div>';
    } else if (step === "style") {
      body = head(6, "Votre style", "Trois détails qui n'en sont pas.") +
        '<h3>Main</h3><div class="seg c2">' + HANDS.map((h, i) =>
          '<button data-g="hand" data-i="' + i + '"' + (DRAFT.hand === h ? ' class="on"' : '') +
          '><span class="t">' + h.icon + " " + esc(h.name) + '</span><span class="d">' + esc(h.desc) + '</span></button>').join("") + '</div>' +
        '<h3>Revers</h3><div class="seg c2">' + BACKHANDS.map((b, i) =>
          '<button data-g="backhand" data-i="' + i + '"' + (DRAFT.backhand === b ? ' class="on"' : '') +
          '><span class="t">' + b.icon + " " + esc(b.name) + '</span><span class="d">' + esc(b.desc) + '</span></button>').join("") + '</div>' +
        '<h3>Gabarit</h3><div class="seg c3">' + BUILDS.map((b, i) =>
          '<button data-g="build" data-i="' + i + '"' + (DRAFT.build === b ? ' class="on"' : '') +
          '><span class="t">' + b.icon + " " + esc(b.name) + '</span><span class="d">' + esc(b.desc) + '</span></button>').join("") + '</div>' +
        '<div class="actions"><button class="btn" id="next">Continuer</button></div></div>';
    } else {
      const name = DRAFT.name || E.generateName(DRAFT.circuit.id, DRAFT.nat.id);
      DRAFT.name = name;
      body = head(7, "Prêt à entrer sur le circuit", "Tout est joué à partir d'ici. Le potentiel et la trajectoire restent secrets jusqu'à la retraite.") +
        '<table><tbody>' +
        row("Nom", name) + row("Circuit", DRAFT.circuit.name) +
        row("Nationalité", DRAFT.nat.flag + " " + DRAFT.nat.name) +
        row("Origine", DRAFT.origin.name) + row("Hygiène de vie", DRAFT.lifestyle.name) +
        row("Entourage", DRAFT.entourage.name) +
        row("Style", DRAFT.hand.name + " · " + DRAFT.backhand.name + " · " + DRAFT.build.name) +
        (DRAFT.perks.length ? row("Avantages", DRAFT.perks.map((p) => p.name).join(", ")) : "") +
        '</tbody></table>' +
        '<div class="actions"><button class="btn" id="go">Entrer sur le circuit</button>' +
        '<button class="btn ghost" id="reroll">Autre nom</button></div></div>';
    }

    render(topBar() + body +
      '<div class="actions"><button class="btn ghost" id="back">' + (STEP === 0 ? "Retour au menu" : "Étape précédente") + '</button></div>');

    on(".opt", (el) => {
      const i = +el.dataset.i;
      if (step === "circuit") DRAFT.circuit = CIRCUITS[i];
      if (step === "nat") DRAFT.nat = NATIONS[i];
      if (step === "origin") DRAFT.origin = ORIGINS[i];
      if (step === "lifestyle") DRAFT.lifestyle = LIFESTYLES[i];
      if (step === "entourage") DRAFT.entourage = ENTOURAGES[i];
      advanceStep();
    });
    on(".seg button", (el) => {
      const g = el.dataset.g, i = +el.dataset.i;
      if (g === "hand") DRAFT.hand = HANDS[i];
      if (g === "backhand") DRAFT.backhand = BACKHANDS[i];
      if (g === "build") DRAFT.build = BUILDS[i];
      screenCreate();
    });
    on("#next", () => {
      if (!DRAFT.hand) DRAFT.hand = HANDS[0];
      if (!DRAFT.backhand) DRAFT.backhand = BACKHANDS[0];
      if (!DRAFT.build) DRAFT.build = BUILDS[1];
      advanceStep();
    });
    on("#reroll", () => { DRAFT.name = E.generateName(DRAFT.circuit.id, DRAFT.nat.id); screenCreate(); });
    on("#go", beginCareer);
    on("#back", () => {
      if (STEP === 0) return screenHome();
      STEP--;
      if (MODE === "daily" && STEP < 3) return screenHome();
      screenCreate();
    });
  }

  function advanceStep() {
    STEP++;
    if (MODE === "daily") {
      while (STEP < STEPS.length && ["circuit", "nat", "origin", "style"].indexOf(STEPS[STEP]) >= 0) STEP++;
    }
    if (STEP >= STEPS.length) STEP = STEPS.length - 1;
    screenCreate();
  }

  function row(k, v) { return '<tr><td>' + esc(k) + '</td><td class="n">' + v + '</td></tr>'; }

  function fxLabel(fx) {
    const names = { ser: "Service", ret: "Retour", fdc: "Fond de court", dep: "Déplacement", phy: "Physique", men: "Mental", cha: "Charisme", rep: "Réputation", dis: "Discipline", mor: "Moral", form: "Forme" };
    return Object.keys(fx).map((k) => (fx[k] > 0 ? "+" : "") + fx[k] + " " + (names[k] || k)).join(" · ");
  }

  /* ---------- Boucle de saison -------------------------------------------- */
  function beginCareer() {
    S = E.newCareer(DRAFT);
    REPORT = null;
    PROGRAM = { volume: VOLUMES[1], surface: "none" };
    seasonStart();
  }

  function seasonStart() {
    if (S.careerEnded || S.flags.retire_now) return screenFinal();
    PENDING_EV = E.pickEvent(S);
    if (!PENDING_EV) return screenProgram();
    screenEvent();
  }

  function defendBox() {
    if (!S.prevPoints) return "";
    const top = (S.seasons.length ? S.seasons[S.seasons.length - 1] : null);
    return '<div class="press">Points à défendre cette saison : <b>' + S.prevPoints +
      '</b>. Tout ce que vous ne reproduisez pas est perdu.' +
      (top && top.titles ? ' L\'an dernier : ' + top.titles + ' titre' + (top.titles > 1 ? 's' : '') + '.' : '') + '</div>';
  }

  function screenEvent() {
    const ev = PENDING_EV;
    render(topBar() + seasonHead() + statusBar() + defendBox() +
      '<div class="card"><div class="kicker">' + ev.icon + ' ' + esc(ev.cat) + '</div>' +
      '<p class="evtext">' + esc(ev.text) + '</p>' +
      '<div class="opts">' + ev.options.map((o, i) =>
        '<button class="opt" data-i="' + i + '"><span class="lb">' + esc(o.label) +
        (o.hint ? '<span class="hint">' + esc(o.hint) + '</span>' : '') + '</span></button>').join("") +
      '</div></div>');
    on(".opt", (el) => {
      const r = E.resolveOption(S, ev, +el.dataset.i);
      screenOutcome(r);
    });
  }

  function seasonHead() {
    return '<div class="card tight"><div class="kicker">Saison ' + S.year + ' · ' + esc(S.name) + ' ' + S.nat.flag +
      '</div><div class="note">' + affLine() + (S.traits.length ? ' &nbsp; ' +
      S.traits.map((t) => '<span class="tag">' + TRAITS[t].icon + ' ' + esc(TRAITS[t].name) + '</span>').join(" ") : "") + '</div></div>';
  }

  function screenOutcome(r) {
    render(topBar() + seasonHead() +
      '<div class="card"><div class="kicker">Conséquence</div><p class="evtext">' + esc(r.outcome.text) + '</p>' +
      chipsHtml(r.chips) +
      '<div class="actions"><button class="btn" id="next">Programme de la saison</button></div></div>');
    on("#next", () => { if (S.flags.retire_now) screenFinal(); else screenProgram(); });
  }

  function chipsHtml(chips) {
    if (!chips || !chips.length) return "";
    return '<div class="chips">' + chips.map((c) => '<span class="chip ' + c.k + '">' + esc(c.t) + '</span>').join("") + '</div>';
  }

  function screenProgram() {
    const wcTotal = S.wildcards + (S.nat.homeSlam ? 1 : 0) + TEAM_ROLES[3].levels[S.team.agent].wc;
    const cost = E.teamCost(S);
    const spon = E.sponsorIncome(S);
    render(topBar() + seasonHead() + statusBar() +
      '<div class="card"><div class="kicker">Programme</div><h2>Combien allez-vous jouer ?</h2>' +
      '<p class="note">Jouer plus rapporte des points et de l\'argent, use le corps et freine la progression.</p>' +
      '<div class="seg c4">' + VOLUMES.map((v, i) =>
        '<button data-g="vol" data-i="' + i + '"' + (PROGRAM.volume === v ? ' class="on"' : '') +
        '><span class="t">' + esc(v.name) + '</span><span class="d">' + v.n + ' tournois</span></button>').join("") + '</div>' +
      '<p class="note" style="margin-top:.6rem">' + esc(PROGRAM.volume.desc) + ' · fatigue ' +
      (PROGRAM.volume.fatigue > 0 ? "+" : "") + PROGRAM.volume.fatigue + ' · progression ×' + PROGRAM.volume.growth + '</p>' +
      '<h3>Surface prioritaire</h3>' +
      '<p class="note">Concentrer le calendrier renforce votre tirage sur une surface et l\'affaiblit sur les deux autres.</p>' +
      '<div class="seg c4">' + [{ id: "none", name: "Aucune" }].concat(SURFACES).map((s) =>
        '<button data-g="surf" data-i="' + s.id + '"' + (PROGRAM.surface === s.id ? ' class="on"' : '') +
        '><span class="t">' + esc(s.name) + '</span><span class="d">' +
        (s.id === "none" ? "calendrier équilibré" : (S.aff[s.id] > 0 ? "+" : "") + S.aff[s.id] + " d\'affinité") + '</span></button>').join("") + '</div>' +
      '<h3>Votre équipe</h3>' +
      '<div class="scroll"><table><thead><tr><th>Rôle</th><th>Niveau</th><th class="n">Coût annuel</th><th class="n"></th></tr></thead><tbody>' +
      TEAM_ROLES.map((r, ri) => {
        const lv = S.team[r.id], L = r.levels[lv];
        const nextL = r.levels[lv + 1];
        const afford = nextL && (nextL.cost === undefined || S.money >= nextL.cost * 1.2);
        return '<tr><td>' + r.icon + " " + esc(r.name) + '<br><span class="note">' + esc(L.desc) + '</span></td>' +
          '<td>' + esc(L.name) + '</td>' +
          '<td class="n">' + (r.id === "agent" ? Math.round(L.pct * 100) + " %" : E.fmtMoney(L.cost)) + '</td>' +
          '<td class="n">' +
          (lv > 0 ? '<button class="btn ghost" data-team="' + r.id + '" data-d="-1">−</button> ' : "") +
          (nextL ? '<button class="btn ghost" data-team="' + r.id + '" data-d="1"' + (afford ? "" : " disabled") + '>+</button>' : "") +
          '</td></tr>';
      }).join("") + '</tbody></table></div>' +
      '<p class="note">Trésorerie : <b>' + E.fmtMoney(S.money) + '</b> · coût de l\'équipe : ' + E.fmtMoney(cost) +
      ' · sponsors estimés : ' + E.fmtMoney(spon) + ' · wildcards disponibles : ' + wcTotal + '</p>' +
      '<div class="actions"><button class="btn wide" id="play">Jouer la saison ' + S.year + '</button></div></div>');

    on(".seg button", (el) => {
      if (el.dataset.g === "vol") PROGRAM.volume = VOLUMES[+el.dataset.i];
      if (el.dataset.g === "surf") PROGRAM.surface = el.dataset.i;
      screenProgram();
    });
    on("[data-team]", (el) => {
      E.applyTeamDelta(S, { [el.dataset.team]: +el.dataset.d });
      screenProgram();
    });
    on("#play", () => {
      REPORT = E.playSeason(S, PROGRAM);
      if (REPORT.pendingMoment) screenMoment();
      else finishSeason();
    });
  }

  /* ---------- Moment décisif ---------------------------------------------- */
  function screenMoment() {
    const pm = REPORT.pendingMoment, m = pm.moment;
    const ctx = pm.res ? ('<p class="note">' + esc(pm.res.t.name.replace(/^le |^la /, "").replace(/^./, (c) => c.toUpperCase())) +
      ' · <span class="tag ' + surfCls[pm.res.t.surface] + '">' + surfName[pm.res.t.surface] + '</span></p>') : "";
    render(topBar() +
      '<div class="card"><div class="kicker">Moment décisif</div><h2>' + esc(m.title) + '</h2>' + ctx +
      '<p class="evtext">' + esc(m.text) + '</p>' +
      '<div class="opts">' + m.options.map((o, i) => {
        const p = Math.round(E.momentProbability(S, pm, o) * 100);
        return '<button class="opt" data-i="' + i + '"><span class="lb">' + esc(o.label) +
          (o.hint ? '<span class="hint">' + esc(o.hint) + '</span>' : '') + '</span>' +
          '<span class="pr">Chances estimées : ' + (o.safe ? "issue certaine" : p + " %") + '</span></button>';
      }).join("") + '</div></div>');
    on(".opt", (el) => {
      const r = E.resolveMoment(S, REPORT, REPORT.pendingMoment, +el.dataset.i);
      render(topBar() + '<div class="card"><div class="kicker">' + (r.success ? "Réussi" : "Manqué") + '</div>' +
        '<p class="evtext">' + esc(r.text) + '</p>' + chipsHtml(r.chips) +
        '<div class="actions"><button class="btn" id="next">Bilan de la saison</button></div></div>');
      on("#next", finishSeason);
    });
  }

  /* ---------- Récapitulatif ------------------------------------------------ */
  function finishSeason() {
    E.seasonAwards(S, REPORT);
    E.seasonEconomy(S, REPORT);
    E.trackMilestones(S, REPORT);
    screenRecap();
  }

  function screenRecap() {
    const r = REPORT;
    const ec = r.economy;
    const delta = r.rank - r.prevRank;
    const best = r.results.slice().sort((a, b) => b.points - a.points).slice(0, 10);
    const headline = pressHeadline(r);

    render(topBar() +
      '<div class="card"><div class="kicker">Saison ' + r.year + ' · ' + r.age + ' ans</div>' +
      '<h2>' + esc(headline) + '</h2>' +
      '<div class="status" style="margin-top:.9rem">' +
      '<div class="stat"><div class="k">Classement</div><div class="v">' + r.rank + '<small>e</small> ' +
        '<small>' + (delta < 0 ? "▲ " + (-delta) : delta > 0 ? "▼ " + delta : "=") + '</small></div></div>' +
      '<div class="stat"><div class="k">Points</div><div class="v">' + r.pointsTotal +
        ' <small>' + (r.delta >= 0 ? "+" : "") + r.delta + '</small></div></div>' +
      '<div class="stat"><div class="k">Bilan</div><div class="v">' + r.wins + '<small>V</small> ' + r.losses + '<small>D</small></div></div>' +
      '<div class="stat"><div class="k">Titres</div><div class="v">' + r.titles.length + '</div></div>' +
      '</div>' +
      (r.injury ? '<div class="press">' + esc(r.injury.label) + ' — ' + r.injury.weeks + ' semaines d\'arrêt' +
        (S.chronicZones.length ? ' (zone fragile : ' + esc(S.chronicZones[S.chronicZones.length - 1]) + ')' : '') + '.</div>' : "") +
      (r.lines.length ? '<div class="lines">' + r.lines.map((l) =>
        '<div class="line ' + (l.tone === "good" ? "good" : l.tone === "bad" ? "bad" : "") + '">' + esc(l.txt) + '</div>').join("") + '</div>' : "") +
      (r.h2h.length ? '<p class="note">Face à vos rivaux : ' + r.h2h.map((h) =>
        '<span class="' + (h.win ? "win" : "lose") + '">' + esc(h.name) + (h.win ? " ✓" : " ✗") + '</span>').join(" · ") + '</p>' : "") +
      (r.awardIds && r.awardIds.length ? '<div class="chips">' + r.awardIds.map((a) =>
        '<span class="chip t">' + AWARDS[a].icon + ' ' + esc(AWARDS[a].name) + '</span>').join("") + '</div>' : "") +
      '<h3>Résultats marquants</h3><div class="scroll"><table><thead><tr><th>Tournoi</th><th>Surface</th><th>Entrée</th><th>Résultat</th><th class="n">Pts</th></tr></thead><tbody>' +
      best.map((x) => '<tr><td>' + esc(x.t.name.replace(/^le |^la /, "")) + '</td>' +
        '<td><span class="tag ' + surfCls[x.t.surface] + '">' + surfName[x.t.surface] + '</span></td>' +
        '<td class="note">' + esc(x.entry.label) + '</td>' +
        '<td' + (x.title ? ' class="win"' : "") + '>' + esc(x.qualiOut ? "Sorti en qualifications" : E.stageLabel(x.t.tier, x.stage)) + '</td>' +
        '<td class="n">' + x.points + '</td></tr>').join("") +
      '</tbody></table></div>' +
      '<h3>Comptes de la saison</h3><div class="scroll"><table><tbody>' +
      row("Gains en tournoi", E.fmtMoney(ec.gross)) + row("Sponsors", E.fmtMoney(ec.spon)) +
      (ec.grant ? row("Bourse fédérale", E.fmtMoney(ec.grant)) : "") +
      row("Déplacements", "−" + E.fmtMoney(ec.travel)) + row("Équipe", "−" + E.fmtMoney(ec.team)) +
      (ec.commission ? row("Commission d'agent", "−" + E.fmtMoney(ec.commission)) : "") +
      row("Impôts", "−" + E.fmtMoney(ec.tax)) +
      '<tr><td><b>Solde de l\'année</b></td><td class="n"><b class="' + (ec.net >= 0 ? "win" : "lose") + '">' + E.fmtMoney(ec.net) + '</b></td></tr>' +
      '<tr><td><b>Trésorerie</b></td><td class="n"><b class="' + (ec.balance >= 0 ? "win" : "lose") + '">' + E.fmtMoney(ec.balance) + '</b></td></tr>' +
      '</tbody></table></div>' +
      '<div class="actions"><button class="btn wide" id="next">Saison suivante</button></div></div>');

    on("#next", () => {
      E.advanceYear(S, PROGRAM, REPORT);
      seasonStart();
    });
  }

  function pressHeadline(r) {
    const slams = r.titles.filter((t) => t.t.tier === "slam");
    if (slams.length > 1) return "Une saison de légende : " + slams.length + " Majeurs";
    if (slams.length === 1) return "Le Majeur ! " + slams[0].t.name.replace(/^le |^la /, "") + " est à vous";
    if (r.rank === 1) return "Numéro un mondial";
    if (r.titles.filter((t) => t.t.tier === "m1000").length) return "Un grand titre au palmarès";
    if (r.results.some((x) => x.final)) return "Si près : une finale majeure perdue";
    if (r.rank <= 10 && r.prevRank > 10) return "Entrée dans le top 10 mondial";
    if (r.rank <= 100 && r.prevRank > 100) return "Enfin dans les cent premiers";
    if (r.injury && r.injury.weeks >= 20) return "Saison brisée par la blessure";
    if (r.rank > r.prevRank * 1.6) return "Une saison à oublier";
    if (r.titles.length) return "Un titre pour rentrer content";
    return "Une saison de circuit, sans éclat";
  }

  /* ---------- Fin de carrière ---------------------------------------------- */
  function screenFinal() {
    const tier = E.careerTier(S);
    const score = E.careerScore(S);
    const rating = E.careerRating(S);
    const p = loadProgress();
    const gen = E.generationEffect(S);

    // Badges nouvellement débloqués
    const meta = { streak: p.streak, questsDone: p.questsDone };
    const earned = MODE === "career" ? E.evaluateBadges(S, meta) : [];
    const fresh = earned.filter((b) => p.badges.indexOf(b) < 0);
    if (fresh.length) p.badges = p.badges.concat(fresh);
    if (p.badges.length >= BADGES.length - 1 && p.badges.indexOf("platine") < 0) p.badges.push("platine");

    const xpGain = Math.max(8, Math.round(score * 0.6));
    const jGain = Math.min(120, Math.round(score * 0.25));
    p.xp += xpGain;
    p.jetonsFromCareers += jGain;
    p.careers++;
    p.pantheon.push({
      name: S.name, nat: S.nat.flag, circuit: S.circuit.id, year: S.year, age: S.age,
      score: score, rating: rating, title: tier.title, slams: S.titles.slam,
      bestRank: S.bestRank, weeksNo1: S.weeksNo1, money: Math.round(S.money * 100) / 100,
      titles: S.titles.slam + S.titles.finals + S.titles.m1000 + S.titles.t500 + S.titles.t250,
      mode: MODE,
    });
    p.pantheon.sort((a, b) => b.score - a.score);
    p.pantheon = p.pantheon.slice(0, 50);
    if (MODE === "daily") p.dailyDone = todayKey();
    const day = todayKey();
    if (p.lastDay !== day) {
      const y = new Date(Date.now() - 86400000);
      const ykey = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
      p.streak = p.lastDay === ykey ? p.streak + 1 : 1;
      p.lastDay = day;
      for (const ms of STREAK_MILESTONES) if (p.streak === ms.days) p.questPoints += ms.jetons;
    }
    saveProgress(p);

    const h2h = S.rivals.map((r) => esc(r.name) + " " + r.h2hWin + "–" + r.h2hLoss).join(" · ");
    const highlights = S.history.slice().sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)).slice(0, 3);

    render(topBar() +
      '<div class="final-head"><div class="kicker">' + S.year + ' · retraite à ' + S.age + ' ans</div>' +
      '<div class="rank-title">' + esc(tier.title) + '</div>' +
      '<div class="score">' + esc(S.name) + ' ' + S.nat.flag + ' · score ' + score + ' · note de carrière ' + rating + '/97</div></div>' +
      '<div class="card"><p class="evtext">' + esc(tier.story) + '</p>' +
      (highlights.length ? '<div class="lines">' + highlights.map((h) =>
        '<div class="line">' + h.age + ' ans — ' + esc(h.text) + '</div>').join("") + '</div>' : "") + '</div>' +

      '<div class="card"><div class="kicker">Palmarès</div>' +
      '<div class="status">' +
      '<div class="stat"><div class="k">Majeurs</div><div class="v">' + S.titles.slam + '</div></div>' +
      '<div class="stat"><div class="k">Meilleur rang</div><div class="v">' + S.bestRank + '<small>e</small></div></div>' +
      '<div class="stat"><div class="k">Semaines n°1</div><div class="v">' + S.weeksNo1 + '</div></div>' +
      '<div class="stat"><div class="k">Fortune</div><div class="v" style="font-size:1rem">' + E.fmtMoney(S.money) + '</div></div>' +
      '</div>' +
      '<div class="scroll"><table><tbody>' +
      row("Finale de circuit", S.titles.finals) + row("Masters 1000", S.titles.m1000) +
      row("Tournois 500 / 250", S.titles.t500 + " / " + S.titles.t250) +
      row("Challenger / Futures", S.titles.challenger + " / " + S.titles.futures) +
      row("Finales de Majeur perdues", S.slamFinals) +
      row("Coupe des Nations / or olympique", S.trophies.nations + " / " + S.trophies.olympic) +
      row("Saisons terminées n°1", S.trophies.yearEndNo1) +
      row("Bilan en matchs", S.totals.wins + " victoires, " + S.totals.losses + " défaites") +
      row("Tournois disputés", S.totals.tournaments) +
      row("Gains sur la carrière", E.fmtMoney(S.lifetimeEarnings)) +
      '</tbody></table></div></div>' +

      '<div class="card"><div class="kicker">Ce que vous ne saviez pas</div>' +
      '<div class="scroll"><table><tbody>' +
      row("Potentiel réel", S.potCap + " (" + "★".repeat(E.potStars(S.potCap)) + ")") +
      row("Trajectoire secrète", S.trajectory.label) +
      (S.prodigy ? row("Tirage caché", "Talent générationnel") : "") +
      row("Profil de surface", S.profile.name) +
      row("Niveau maximum atteint", S.peakNiv) +
      row("Génération", S.generation.name) +
      (h2h ? row("Face-à-face", h2h) : "") +
      '</tbody></table></div>' +
      '<p class="note">' + esc(S.generation.desc) + '</p>' +
      (gen ? '<div class="press">Vous êtes né dans une génération ' + esc(S.generation.name.toLowerCase()) +
        '. À une autre époque, vous auriez probablement gagné <b>' + gen.alt + '</b> Majeur' + (gen.alt > 1 ? "s" : "") +
        ' au lieu de ' + S.titles.slam + '.</div>' : "") + '</div>' +

      (fresh.length ? '<div class="card"><div class="kicker">Badges débloqués</div><div class="badge-grid">' +
        fresh.map((b) => { const bd = BADGES.filter((x) => x.id === b)[0]; return bd ?
          '<div class="badge on"><span class="bn">' + bd.icon + ' ' + esc(bd.name) + '</span><span class="bd">' + esc(bd.desc) + '</span></div>' : ""; }).join("") +
        '</div></div>' : "") +

      '<div class="card tight center"><b>+' + xpGain + '</b> points d\'expérience · <b>+' + jGain + '</b> jetons</div>' +
      '<div class="actions"><button class="btn" id="again">Nouvelle carrière</button>' +
      '<button class="btn ghost" id="home">Menu</button></div>');

    on("#again", () => startCreation("career"));
    on("#home", screenHome);
  }

  /* ---------- Écrans méta --------------------------------------------------- */
  function screenBadges() {
    const p = loadProgress();
    let html = topBar() + '<div class="card"><div class="kicker">Collection</div><h2>Badges</h2>' +
      '<p class="note">' + p.badges.length + ' sur ' + BADGES.length + ' débloqués. Aucun badge ne compte si la carrière est brisée : il faut aller au bout.</p></div>';
    for (const cat of BADGE_CATS) {
      const list = BADGES.filter((b) => b.cat === cat.id);
      html += '<div class="card"><div class="kicker">' + cat.icon + ' ' + esc(cat.name) + '</div><div class="badge-grid">' +
        list.map((b) => {
          const has = p.badges.indexOf(b.id) >= 0;
          const hide = b.secret && !has;
          return '<div class="badge ' + (has ? "on" : "locked") + '"><span class="bn">' + (has ? b.icon : "🔒") + ' ' +
            esc(hide ? "Badge secret" : b.name) + '</span><span class="bd">' + esc(hide ? "Conditions inconnues." : b.desc) + '</span></div>';
        }).join("") + '</div></div>';
    }
    render(html + '<div class="actions"><button class="btn ghost" id="home">Menu</button></div>');
    on("#home", screenHome);
  }

  function screenShop() {
    const p = loadProgress();
    render(topBar() + '<div class="card"><div class="kicker">Boutique</div><h2>Avantages de départ</h2>' +
      '<p class="note">Achetés une fois avec des jetons, puis équipés — au maximum ' + PERK_SLOTS +
      ' à la fois, et uniquement en carrière libre. Le Défi du jour les ignore.</p>' +
      '<p class="note">Solde : <b>' + jetons(p) + '</b> jetons.</p>' +
      '<div class="opts">' + PERKS.map((k) => {
        const owned = p.ownedPerks.indexOf(k.id) >= 0;
        const eq = p.equippedPerks.indexOf(k.id) >= 0;
        const canBuy = !owned && jetons(p) >= k.cost;
        return '<button class="opt" data-id="' + k.id + '"' + (!owned && !canBuy ? " disabled" : "") + '>' +
          '<span class="lb">' + k.icon + ' ' + esc(k.name) +
          (eq ? '<span class="hint">équipé</span>' : owned ? '<span class="hint">acquis</span>' : '') + '</span>' +
          '<span class="pr">' + esc(k.desc) + '</span>' +
          '<span class="pr">' + (owned ? (eq ? "Cliquer pour retirer" : "Cliquer pour équiper") : k.cost + " jetons") + '</span></button>';
      }).join("") + '</div></div>' +
      '<div class="actions"><button class="btn ghost" id="home">Menu</button></div>');
    on(".opt", (el) => {
      const id = el.dataset.id, k = PERKS.filter((x) => x.id === id)[0];
      const pp = loadProgress();
      if (pp.ownedPerks.indexOf(id) < 0) {
        if (jetons(pp) < k.cost) return;
        pp.ownedPerks.push(id); pp.jetonsSpent += k.cost;
      } else if (pp.equippedPerks.indexOf(id) >= 0) {
        pp.equippedPerks = pp.equippedPerks.filter((x) => x !== id);
      } else if (pp.equippedPerks.length < PERK_SLOTS) {
        pp.equippedPerks.push(id);
      }
      saveProgress(pp); screenShop();
    });
    on("#home", screenHome);
  }

  function screenPantheon() {
    const p = loadProgress();
    const rows = p.pantheon.map((c, i) =>
      '<tr><td class="n">' + (i + 1) + '</td><td>' + esc(c.name) + ' ' + c.nat +
      '<br><span class="note">' + esc(c.title) + (c.mode === "daily" ? " · défi du jour" : "") + '</span></td>' +
      '<td class="n">' + c.slams + '</td><td class="n">' + c.bestRank + 'e</td>' +
      '<td class="n">' + c.rating + '</td><td class="n">' + c.score + '</td></tr>').join("");
    render(topBar() + '<div class="card"><div class="kicker">Archives</div><h2>Panthéon</h2>' +
      (rows ? '<div class="scroll"><table><thead><tr><th class="n">#</th><th>Joueur</th><th class="n">Maj.</th><th class="n">Rang</th><th class="n">Note</th><th class="n">Score</th></tr></thead><tbody>' +
        rows + '</tbody></table></div>' : '<p class="note">Aucune carrière archivée. Jouez-en une.</p>') + '</div>' +
      '<div class="actions"><button class="btn ghost" id="home">Menu</button></div>');
    on("#home", screenHome);
  }

  function screenQuests() {
    const key = todayKey();
    const seed = Number(key.replace(/-/g, ""));
    const daily = [1, 2, 3].map((t) => {
      const pool = DAILY_QUESTS.filter((q) => q.tier === t);
      return pool[hashInt(seed * 7 + t) % pool.length];
    });
    const weekly = WEEKLY_CHALLENGES[hashInt(Math.floor(seed / 7)) % WEEKLY_CHALLENGES.length];
    const p = loadProgress();
    render(topBar() + '<div class="card"><div class="kicker">' + key + '</div><h2>Quêtes du jour</h2>' +
      '<p class="note">Les mêmes pour tout le monde, tirées à partir de la date. Elles s\'évaluent à la fin d\'une carrière.</p>' +
      '<div class="opts">' + daily.map((q) =>
        '<div class="opt"><span class="lb">' + q.icon + ' ' + esc(q.name) + '<span class="hint">' + q.pts + ' pts</span></span>' +
        '<span class="pr">' + esc(q.desc) + '</span></div>').join("") + '</div>' +
      '<h3>Défi de la semaine</h3><div class="opts"><div class="opt">' +
      '<span class="lb">' + weekly.icon + ' ' + esc(weekly.name) + '<span class="hint">' + weekly.pts + ' pts</span></span>' +
      '<span class="pr">' + esc(weekly.desc) + '</span></div></div>' +
      '<p class="note" style="margin-top:1rem">Série en cours : <b>' + p.streak + '</b> jour' + (p.streak > 1 ? "s" : "") +
      '. Prochain palier : ' + (STREAK_MILESTONES.filter((m) => m.days > p.streak)[0] || { days: "—", jetons: 0 }).days + ' jours.</p></div>' +
      '<div class="actions"><button class="btn ghost" id="home">Menu</button></div>');
    on("#home", screenHome);
  }

  /* ---------- Démarrage ------------------------------------------------------ */
  screenHome();
})();
