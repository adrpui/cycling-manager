/* ============================================================
   DESTINY GRAND CHELEM — Événements, micro-événements, moments décisifs
   Contenu pur. L'ORDRE COMPTE : le tirage du Défi du jour est seedé,
   déplacer un événement change les carrières déjà partagées.
   N'ajouter qu'à la fin d'un bloc.

   Vocabulaire d'effets (fx) :
     ser ret fdc dep phy men cha   attributs
     rep form mor dis coach fatigue jauges
     money (M€)  ·  inj (semaines)  ·  trait  ·  flag
     aff:{hard|clay|grass}          déplace une affinité (somme maintenue à 0)
     wildcard (+n)  ·  team:{coach|fitness|physio|agent: ±1}

   Conditions (cond) :
     aMin aMax · rankMax (rang ≤) · rankMin (rang ≥) · nivMin nivMax
     repMin repMax · moneyMin moneyMax · formMin formMax · morMin morMax
     disMin disMax · coachMin coachMax · trait notTrait · flag notFlag
     profile · origin · lifestyle · entourage · circuit · homeSlam
     slamWinner · chance
   ============================================================ */

const EVENTS = [

  /* ══════════════ JUNIORS ET DÉBUTS (15-18) ══════════════ */
  {
    id: "ev_first_racquet", cat: "Juniors", icon: "🎒", w: 18, cond: { aMin: 15, aMax: 16 },
    text: "Quinze ans, et la première vraie décision : le lycée sport-études à trois cents kilomètres, ou rester au club, avec vos amis et votre entraîneur de toujours.",
    options: [
      { label: "Partir en sport-études", hint: "Arrachement", outcomes: [
        { weight: 46, text: "Internat, six heures de court par jour, et un niveau de sparring que vous n'aviez jamais connu.", fx: { fdc: 4, phy: 3, dis: 6, mor: -6 } },
        { weight: 28, text: "Le cadre vous révèle. En un an, vous passez d'espoir régional à espoir national.", fx: { fdc: 5, ret: 4, rep: 6, dis: 5 } },
        { weight: 26, text: "Trop tôt, trop loin. Vous rentrez tous les week-ends et vous n'y êtes jamais vraiment.", fx: { mor: -12, dis: -3, fdc: 2 } },
      ] },
      { label: "Rester au club", hint: "Sécurité", outcomes: [
        { weight: 50, text: "Vous progressez plus lentement, mais dans un environnement où vous êtes heureux.", fx: { mor: 10, men: 4, fdc: 2 } },
        { weight: 50, text: "Votre entraîneur se démène, mais il n'a ni le temps ni les partenaires d'entraînement.", fx: { mor: 6, coach: 8, fdc: 1, phy: -1 } },
      ] },
    ],
  },
  {
    id: "ev_junior_ranking", cat: "Juniors", icon: "📋", w: 15, cond: { aMin: 15, aMax: 17 },
    text: "Le classement junior national vient de tomber. Vous êtes quatrième — et le troisième est un garçon que vous battez à l'entraînement une fois sur deux.",
    options: [
      { label: "Enchaîner les tournois pour le doubler", outcomes: [
        { weight: 48, text: "Cinq tournois en six semaines, et la deuxième place à l'arrivée. Le corps a tenu.", fx: { rep: 5, mor: 8, fatigue: 9, fdc: 2 } },
        { weight: 52, text: "Cinq tournois en six semaines, et une tendinite au poignet. Le classement, lui, n'a pas bougé.", fx: { inj: 5, fatigue: 12, mor: -6 } },
      ] },
      { label: "Ignorer le classement et travailler", outcomes: [
        { weight: 58, text: "Trois mois de fond, sans compétition. Au retour, vous jouez un tennis que personne n'attendait.", fx: { fdc: 5, ser: 3, men: 4 } },
        { weight: 42, text: "Le travail est bon, mais sans matchs vous perdez le goût du combat.", fx: { fdc: 3, men: -2, mor: -5 } },
      ] },
    ],
  },
  {
    id: "ev_parents_pressure", cat: "Juniors", icon: "🚗", w: 13, cond: { aMin: 15, aMax: 18 },
    text: "Votre père conduit trois heures chaque samedi, paie les cordages, note les statistiques de chaque match. Ce matin, après une défaite, il n'a pas dit un mot du trajet.",
    options: [
      { label: "Lui dire que ça vous étouffe", hint: "Franc", outcomes: [
        { weight: 55, text: "La discussion est difficile, puis libératrice. Il prend du recul, vous respirez.", fx: { mor: 14, men: 5 } },
        { weight: 45, text: "Il le prend très mal. Le silence dure trois mois, et vous jouez avec ce poids-là.", fx: { mor: -10, men: 4, dis: 4 } },
      ] },
      { label: "Ne rien dire et gagner", outcomes: [
        { weight: 50, text: "Vous transformez la pression en carburant. Ce n'est pas sain, mais ça marche.", fx: { men: 7, dis: 6, mor: -4 } },
        { weight: 50, text: "Ça s'accumule. Un jour, en tournoi, vous fondez en larmes après un tie-break perdu.", fx: { mor: -12, men: 3 } },
      ] },
    ],
  },
  {
    id: "ev_pro_or_school", cat: "Juniors", icon: "🎓", w: 16, cond: { aMin: 16, aMax: 17 },
    text: "Le circuit junior vous a donné tout ce qu'il pouvait. Un recruteur universitaire américain propose quatre années payées, un diplôme et des courts en salle. Votre agent, lui, veut vous voir en Futures dès le mois prochain.",
    options: [
      { label: "Passer professionnel maintenant", hint: "Tout de suite", outcomes: [
        { weight: 42, text: "Vous plongez. Les premiers mois sont rudes, les gymnases sentent le chlore, mais vous progressez vite.", fx: { fdc: 4, men: 3, flag: "no_diploma" } },
        { weight: 26, text: "Le rythme professionnel vous transcende. Trois finales de Futures en six mois : le circuit apprend votre nom.", fx: { fdc: 6, ser: 3, rep: 6, flag: "no_diploma" } },
        { weight: 32, text: "Seize ans, des hôtels à 30 €, personne à qui parler. Vous ne dormez plus.", fx: { mor: -13, men: -3, flag: "no_diploma" } },
      ] },
      { label: "Prendre l'université", hint: "Un filet", outcomes: [
        { weight: 46, text: "Deux ans de structure, de musculation encadrée et de matchs par équipes. Vous arrivez plus tard, mais plus solide.", fx: { phy: 6, men: 5, flag: "diploma" } },
        { weight: 28, text: "L'entraîneur universitaire refait votre revers de fond en comble. Vous ne jouez plus pareil.", fx: { fdc: 5, ret: 4, men: 3, flag: "diploma" } },
        { weight: 26, text: "Pendant que vous étudiez, trois garçons de votre âge entrent dans le top 200. Le doute s'installe.", fx: { mor: -7, rep: -2, flag: "diploma" } },
      ] },
    ],
  },
  {
    id: "ev_junior_slam", cat: "Juniors", icon: "🏅", w: 14, cond: { aMin: 16, aMax: 18, nivMin: 56 },
    text: "Vous voilà en demi-finale du Majeur junior. En face, un garçon plus grand, plus fort, et déjà signé chez un équipementier. Le stade annexe est plein.",
    options: [
      { label: "Jouer votre jeu, sans reculer", outcomes: [
        { weight: 44, text: "Vous le sortez en trois sets. La finale se perd, mais tout le monde a vu votre nom sur l'écran.", fx: { rep: 7, mor: 8, men: 3, flag: "junior_title" } },
        { weight: 30, text: "Titre junior. Une photo, une coupe, et un agent qui vous attend à la sortie du court.", fx: { rep: 12, mor: 10, cha: 3, flag: "junior_title" } },
        { weight: 26, text: "Vous êtes balayé en deux sets. Sur le circuit, on retient les vainqueurs.", fx: { mor: -8, men: 2 } },
      ] },
      { label: "Assurer, renvoyer, attendre la faute", hint: "Prudent", outcomes: [
        { weight: 52, text: "Deux heures quarante d'échanges. Vous gagnez à l'usure, et vos jambes s'en souviendront.", fx: { dep: 4, phy: 3, mor: 6, fatigue: 6, flag: "junior_title" } },
        { weight: 48, text: "Il finit par trouver la solution. Vous rentrez avec une leçon : à ce niveau, subir ne suffit plus.", fx: { men: 4, mor: -5 } },
      ] },
    ],
  },
  {
    id: "ev_first_agent", cat: "Argent", icon: "💼", w: 13, cond: { aMin: 16, aMax: 19, notFlag: "agent_signed" },
    text: "Un agent vous aborde après un match de Futures. Contrat de cinq ans, 20 % sur tout, mais il avance les frais de déplacement de la saison.",
    options: [
      { label: "Signer : l'argent tout de suite", outcomes: [
        { weight: 50, text: "Les frais sont couverts. Vous jouez enfin sans compter les billets d'avion.", fx: { money: 0.06, rep: 4, flag: "agent_signed" }, team: { agent: 1 } },
        { weight: 50, text: "Les frais sont couverts, mais le contrat est verrouillé : vous êtes lié pour cinq ans à un homme que vous connaissez à peine.", fx: { money: 0.06, mor: -5, flag: "agent_locked" }, team: { agent: 1 } },
      ] },
      { label: "Refuser, rester libre", hint: "Coûteux", outcomes: [
        { weight: 55, text: "Vous continuez à tout gérer vous-même : réservations, cordage, kiné improvisé. C'est épuisant, mais c'est à vous.", fx: { men: 4, dis: 5, fatigue: 5 } },
        { weight: 45, text: "Deux mois plus tard, la trésorerie est à sec. Vous sautez trois tournois faute de billets.", fx: { money: -0.02, mor: -7, rep: -2 } },
      ] },
    ],
  },
  {
    id: "ev_first_futures", cat: "Circuit secondaire", icon: "▫️", w: 14, cond: { aMin: 16, aMax: 20, rankMin: 400 },
    text: "Un Futures en Tunisie, 2 000 € de dotation totale, quarante degrés à l'ombre et des courts sans juge de ligne. Le vol coûte plus cher que ce que vous gagnerez.",
    options: [
      { label: "Y aller quand même", outcomes: [
        { weight: 45, text: "Vous perdez de l'argent et gagnez trois points. Sur ce circuit, c'est comme ça qu'on commence.", fx: { money: -0.004, men: 4, dis: 3 } },
        { weight: 30, text: "Titre. Vingt points, quatre mille euros, et la sensation, pour la première fois, d'être un joueur professionnel.", fx: { money: 0.002, mor: 10, rep: 4, fdc: 3 } },
        { weight: 25, text: "Défaite au premier tour contre un local invité. Le retour dure vingt-deux heures.", fx: { money: -0.005, mor: -9 } },
      ] },
      { label: "Rester s'entraîner à la maison", hint: "Économe", outcomes: [
        { weight: 55, text: "Trois semaines de travail au calme. Le corps et la technique en profitent.", fx: { fdc: 4, phy: 3, fatigue: -6 } },
        { weight: 45, text: "Le classement, lui, ne s'entraîne pas. Vous reculez de soixante places sans avoir joué.", fx: { mor: -6, rep: -2 } },
      ] },
    ],
  },
  {
    id: "ev_body_change", cat: "Corps", icon: "📏", w: 10, cond: { aMin: 16, aMax: 18 },
    text: "Onze centimètres en un an. Votre service part enfin de haut, mais vos appuis ne suivent plus rien : vous tombez sur des balles que vous prenez d'habitude sans y penser.",
    options: [
      { label: "Suivre le protocole médical, quitte à jouer moins", outcomes: [
        { weight: 63, text: "Six mois de gainage et de proprioception. Vous ressortez avec un châssis de professionnel.", fx: { phy: 7, ser: 3, men: 2 } },
        { weight: 37, text: "Le protocole traîne, la saison passe. Vous êtes plus solide, et cent places plus bas.", fx: { phy: 4, inj: 8, mor: -5 } },
      ] },
      { label: "Continuer à jouer, le corps s'adaptera", outcomes: [
        { weight: 44, text: "Vous serrez les dents et gardez le rythme. Le corps suit — pour cette fois.", fx: { men: 5, ser: 3, trait: "ironman" } },
        { weight: 56, text: "Fracture de fatigue au dos. L'addition du forcing arrive vite.", fx: { inj: 15, phy: -3, mor: -7, trait: "glass" } },
      ] },
    ],
  },
  {
    id: "ev_academy_offer", cat: "Box & équipe", icon: "🏫", w: 11, cond: { aMin: 16, aMax: 19, notFlag: "academy_joined" },
    text: "Une grande académie européenne vous propose une place. Sparring de haut niveau, kiné sur place, et une facture de 45 000 € par an.",
    options: [
      { label: "Signer, et trouver l'argent ensuite", outcomes: [
        { weight: 55, text: "Le niveau d'entraînement n'a rien à voir. Vous progressez comme jamais — et votre compte se vide.", fx: { fdc: 5, ret: 4, phy: 3, money: -0.045, flag: "academy_joined" } },
        { weight: 45, text: "Vous êtes le plus faible du groupe et on vous le fait sentir. Techniquement, vous montez ; moralement, vous coulez.", fx: { fdc: 4, mor: -10, money: -0.045, flag: "academy_joined" } },
      ] },
      { label: "Décliner et rester avec votre entraîneur", outcomes: [
        { weight: 50, text: "La fidélité paie : il vous connaît par cœur et ajuste tout à votre jeu.", fx: { coach: 12, men: 4, mor: 5 } },
        { weight: 50, text: "Il fait ce qu'il peut, mais il a atteint sa limite, et vous le savez tous les deux.", fx: { coach: -6, fdc: -1, mor: -4 } },
      ] },
    ],
  },

  /* ══════════════ PERCÉE (18-23) ══════════════ */
  {
    id: "ev_first_slam_quali", cat: "Court", icon: "🎾", w: 14, cond: { aMin: 18, aMax: 23, rankMax: 260, rankMin: 90 },
    text: "Premier tableau final d'un Majeur, arraché en qualifications. Au premier tour, une tête de série. Les tribunes sont pleines, la caméra est là, et vous n'avez jamais joué devant plus de deux cents personnes.",
    options: [
      { label: "Jouer sans calcul, à fond", outcomes: [
        { weight: 38, text: "Vous perdez en quatre sets, mais le public se lève à la fin. On vous a vu.", fx: { rep: 8, mor: 7, men: 3 } },
        { weight: 24, text: "Il craque. Vous gagnez, et le lendemain votre nom est dans tous les journaux du pays.", fx: { rep: 14, mor: 12, cha: 4, men: 4 } },
        { weight: 38, text: "Les jambes ne répondent pas, le bras tremble, le match dure une heure et onze minutes.", fx: { mor: -9, rep: -1, men: 3 } },
      ] },
      { label: "Serrer le jeu, faire durer", hint: "Prudent", outcomes: [
        { weight: 55, text: "Trois sets accrochés, une défaite honorable. Vous avez appris ce que c'était.", fx: { men: 6, dep: 3, mor: 2 } },
        { weight: 45, text: "Trop passif : il vous promène pendant deux heures et vous vous en voulez toute la nuit.", fx: { mor: -7, men: 4 } },
      ] },
    ],
  },
  {
    id: "ev_serve_yips", cat: "Mental", icon: "😰", w: 11, cond: { aMin: 18, aMax: 30, morMax: 55 },
    text: "Ça a commencé sur une double faute à 5-4. Depuis trois semaines, votre bras se bloque au moment de lancer la balle. Vous en êtes à quinze doubles fautes par match.",
    options: [
      { label: "Consulter un préparateur mental", outcomes: [
        { weight: 60, text: "Six séances, un rituel de service reconstruit de zéro, et le bras qui se relâche enfin.", fx: { men: 7, mor: 10, money: -0.012 } },
        { weight: 40, text: "Ça va mieux, sans revenir tout à fait. Vous servez désormais avec une petite voix dans la tête.", fx: { men: 3, ser: -2, mor: 3, money: -0.012 } },
      ] },
      { label: "Changer complètement de geste au service", hint: "Radical", outcomes: [
        { weight: 42, text: "Trois mois de reconstruction. Le nouveau mouvement est plus simple, plus fiable, et un peu plus rapide.", fx: { ser: 5, men: 4, mor: 6 } },
        { weight: 58, text: "Le geste ne prend pas. Vous vous retrouvez entre deux services, sans en maîtriser aucun.", fx: { ser: -5, mor: -8, form: -8 } },
      ] },
      { label: "Serrer les dents et jouer", outcomes: [
        { weight: 35, text: "Ça passe tout seul, un matin, sans explication. Le tennis est comme ça.", fx: { men: 5, mor: 6 } },
        { weight: 65, text: "Ça empire. Vous perdez quatre matchs de suite sur votre propre service.", fx: { ser: -3, mor: -12, form: -6 } },
      ] },
    ],
  },
  {
    id: "ev_coach_upgrade", cat: "Box & équipe", icon: "🎯", w: 12, cond: { aMin: 19, aMax: 32, rankMax: 120, moneyMin: 0.10 },
    text: "Un technicien réputé du circuit vous fait savoir qu'il serait disponible. Il coûte cinq fois votre entraîneur actuel, celui qui vous suit depuis les juniors.",
    options: [
      { label: "Prendre le technicien", hint: "Ambitieux", outcomes: [
        { weight: 55, text: "Rupture douloureuse, mais le nouveau regard change tout : votre schéma de jeu se clarifie en trois mois.", fx: { coach: -8, rep: 3 }, team: { coach: 1 } },
        { weight: 45, text: "Le courant ne passe pas. Vous avez perdu un ami et gagné un consultant.", fx: { coach: -22, mor: -8 }, team: { coach: 1 } },
      ] },
      { label: "Garder l'homme des débuts", hint: "Fidèle", outcomes: [
        { weight: 55, text: "Il pleure presque quand vous lui dites. Il travaillera deux fois plus.", fx: { coach: 18, mor: 8, flag: "loyal_coach" } },
        { weight: 45, text: "Il est touché, mais lucide : « tu vas finir par avoir besoin de mieux que moi ».", fx: { coach: 10, mor: 4 } },
      ] },
    ],
  },
  {
    id: "ev_surface_switch", cat: "Technique", icon: "🔧", w: 12, cond: { aMin: 19, aMax: 29 },
    text: "Votre entraîneur pose le constat : « Sur une surface, tu es dans les trente meilleurs du monde. Sur les deux autres, tu es un joueur de Challenger. On corrige, ou on assume ? »",
    options: [
      { label: "Combler le point faible", hint: "Équilibrer", outcomes: [
        { weight: 55, text: "Un hiver entier à réapprendre les appuis et la hauteur de balle. Votre pire surface devient jouable.", fx: { affFixWeak: 2, fdc: 2, fatigue: 5 } },
        { weight: 45, text: "Le travail dilue votre atout sans vraiment corriger le défaut. Vous êtes devenu moyen partout.", fx: { affFixWeak: 1, affCutBest: 1, mor: -5 } },
      ] },
      { label: "Pousser encore votre meilleure surface", hint: "Assumer", outcomes: [
        { weight: 60, text: "Vous devenez, sur ce terrain-là, un problème que personne ne veut affronter.", fx: { affBoostBest: 2, rep: 4, mor: 6 } },
        { weight: 40, text: "Le gain est réel, mais le reste de la saison ressemble à une longue traversée du désert.", fx: { affBoostBest: 2, mor: -6, form: -5 } },
      ] },
    ],
  },
  {
    id: "ev_racquet_deal", cat: "Argent", icon: "🎁", w: 11, cond: { aMin: 18, aMax: 30, rankMax: 200 },
    text: "Un équipementier propose un contrat correct. Condition : jouer avec leur raquette, un cadre plus rigide que le vôtre.",
    options: [
      { label: "Signer et s'adapter", outcomes: [
        { weight: 50, text: "Deux mois d'ajustement, puis plus rien : le cadre passe, et le virement tombe chaque trimestre.", fx: { money: 0.05, rep: 3, cha: 3 } },
        { weight: 50, text: "Le cadre ne vous ira jamais. Vous jouez une saison entière avec une raquette qui n'est pas la vôtre.", fx: { money: 0.05, fdc: -3, mor: -6 } },
      ] },
      { label: "Refuser : le matériel ne se négocie pas", outcomes: [
        { weight: 55, text: "Vous restez sur votre cadre. Le jeu est intact, la trésorerie moins.", fx: { fdc: 2, men: 3 } },
        { weight: 45, text: "Aucun autre équipementier ne se manifeste. Vous jouez avec des raquettes achetées au détail.", fx: { money: -0.008, mor: -4, rep: -2 } },
      ] },
    ],
  },
  {
    id: "ev_first_rival", cat: "Rivalité", icon: "⚔️", w: 13, cond: { aMin: 18, aMax: 26, rankMax: 150, notFlag: "rival_met" },
    text: "Vous croisez pour la première fois celui dont on vous parle depuis les juniors. Deux heures de tennis, et une conférence de presse où on lui demande ce qu'il pense de vous. Il hausse les épaules.",
    options: [
      { label: "Répondre publiquement", hint: "Allumer la mèche", outcomes: [
        { weight: 45, text: "Votre phrase fait le tour du circuit. La rivalité est née, et elle vous tire vers le haut.", fx: { rep: 8, men: 4, mor: 5, flag: "rival_met", rivalEdge: 1 } },
        { weight: 55, text: "Vous passez pour arrogant, et il vous le fait payer sur le court les trois fois suivantes.", fx: { rep: 4, mor: -6, flag: "rival_met", rivalEdge: -1 } },
      ] },
      { label: "Ne rien dire et travailler", outcomes: [
        { weight: 55, text: "Six mois plus tard, vous le battez sans un mot avant ni après. C'est plus efficace.", fx: { men: 6, fdc: 3, flag: "rival_met", rivalEdge: 1 } },
        { weight: 45, text: "Le silence passe pour de la peur. Il continue de vous ignorer, et de vous battre.", fx: { mor: -5, men: 3, flag: "rival_met" } },
      ] },
    ],
  },
  {
    id: "ev_home_wildcard", cat: "Fédération", icon: "🎟️", w: 12, cond: { aMin: 18, aMax: 34, homeSlam: true, rankMin: 90 },
    text: "Votre fédération vous offre la wildcard du Majeur national. Tout le pays regardera, et vous n'avez jamais passé un tour dans un tableau de cette taille.",
    options: [
      { label: "Accepter la wildcard", outcomes: [
        { weight: 45, text: "Vous perdez au deuxième tour dans un court plein à craquer. Le public vous adopte.", fx: { rep: 9, mor: 8, cha: 4, wildcard: 1 } },
        { weight: 25, text: "Trois tours gagnés à domicile. Le pays entier connaît votre nom en une semaine.", fx: { rep: 16, mor: 14, cha: 6, wildcard: 1 } },
        { weight: 30, text: "Balayé en trois sets sur le court central. Les journaux sont cruels.", fx: { rep: -2, mor: -12, wildcard: 1 } },
      ] },
      { label: "Refuser et jouer un Challenger la même semaine", hint: "Le classement d'abord", outcomes: [
        { weight: 60, text: "Titre en Challenger, cinquante places gagnées, et personne pour le remarquer.", fx: { mor: 5, men: 4, rep: -3 } },
        { weight: 40, text: "Éliminé en demi-finale. Vous avez décliné un Majeur pour trois cents euros.", fx: { mor: -8, rep: -4 } },
      ] },
    ],
  },
  {
    id: "ev_debt_wall", cat: "Argent", icon: "🧾", w: 15, cond: { aMin: 17, aMax: 27, moneyMax: -0.02 },
    text: "Le compte est dans le rouge. Votre kiné n'a pas été payé depuis deux mois, et il vient de vous appeler. Il ne réclame rien, il demande simplement comment ça va.",
    options: [
      { label: "Réduire l'équipe au strict minimum", outcomes: [
        { weight: 100, text: "Vous voyagez seul, vous vous étirez seul, vous vous cordez vos raquettes. Le compte respire.", fx: { mor: -7, fatigue: 8 }, team: { physio: -1, fitness: -1 } },
      ] },
      { label: "Emprunter à la famille pour tenir la saison", outcomes: [
        { weight: 55, text: "Vos parents hypothèquent une partie de leur retraite. Vous n'avez plus le droit d'échouer.", fx: { money: 0.06, mor: -4, men: 6, flag: "family_debt" } },
        { weight: 45, text: "Ils disent oui sans hésiter. Ce oui-là pèse plus lourd que la dette.", fx: { money: 0.06, mor: -9, men: 4, flag: "family_debt" } },
      ] },
      { label: "Ajouter dix tournois au calendrier", hint: "Fuite en avant", outcomes: [
        { weight: 48, text: "Vous encaissez de quoi tenir. Le corps, lui, n'a pas voté.", fx: { money: 0.03, fatigue: 18, form: -6 } },
        { weight: 52, text: "Trop de kilomètres, trop de matchs. Vous vous blessez à la fin du troisième mois.", fx: { money: 0.012, inj: 7, fatigue: 20, mor: -6 } },
      ] },
    ],
  },
  {
    id: "ev_doubles_money", cat: "Double", icon: "👥", w: 10, cond: { aMin: 18, aMax: 26, rankMin: 120 },
    text: "Un ancien du circuit, spécialiste du double, vous propose de faire équipe toute la saison. Les gains sont modestes mais réguliers, et il connaît tout le monde.",
    options: [
      { label: "Jouer le double toute la saison", outcomes: [
        { weight: 55, text: "Vous encaissez de quoi payer vos vols, et votre jeu au filet devient une vraie arme.", fx: { money: 0.022, ser: 2, ret: 2, fatigue: 8, flag: "doubles" } },
        { weight: 45, text: "Les journées font douze heures. Le simple en pâtit, la trésorerie remonte.", fx: { money: 0.025, fatigue: 14, form: -5, flag: "doubles" } },
      ] },
      { label: "Rester concentré sur le simple", outcomes: [
        { weight: 100, text: "Une seule ambition, un seul calendrier. C'est plus pur, et plus cher.", fx: { men: 3, fatigue: -4 } },
      ] },
    ],
  },
  {
    id: "ev_net_game", cat: "Technique", icon: "🕸️", w: 10, cond: { aMin: 19, aMax: 28, nivMin: 68 },
    text: "« Tu joues à trois mètres derrière la ligne et tu attends. À ce rythme, tu useras tes genoux avant tes cordes. » Votre entraîneur veut vous apprendre à finir les points au filet.",
    options: [
      { label: "Apprendre à monter", outcomes: [
        { weight: 52, text: "Les points raccourcissent, le corps encaisse mieux, et le gazon devient soudain un terrain d'expression.", fx: { ser: 3, aff: { grass: 2, clay: -1, hard: -1 }, fatigue: -5 } },
        { weight: 48, text: "Vous montez, on vous passe. Trois mois de doute pour un gain marginal.", fx: { ser: 1, mor: -5 } },
      ] },
      { label: "Assumer le fond de court", outcomes: [
        { weight: 55, text: "Vous poussez la logique jusqu'au bout : plus profond, plus lourd, plus long. Personne ne tient l'échange.", fx: { fdc: 4, dep: 3, aff: { clay: 2, grass: -1, hard: -1 } } },
        { weight: 45, text: "Le style paie, mais les matchs durent une éternité et le corps facture.", fx: { fdc: 3, dep: 2, fatigue: 10 } },
      ] },
    ],
  },

  /* ══════════════ INSTALLATION (22-27) ══════════════ */
  {
    id: "ev_top50_pressure", cat: "Médias", icon: "🎤", w: 12, cond: { aMin: 21, aMax: 30, rankMax: 60, rankMin: 12 },
    text: "Un journaliste vous demande, micro tendu : « Vous êtes 34e mondial. À votre âge, les meilleurs sont déjà dans le top 10. Vous pensez avoir un plafond ? »",
    options: [
      { label: "Répondre sèchement", outcomes: [
        { weight: 45, text: "Votre réponse fait le tour des réseaux. Le circuit vous trouve du caractère.", fx: { rep: 6, cha: 4, men: 3 } },
        { weight: 55, text: "Le lendemain, la presse titre sur votre « arrogance ». Vous jouez le tournoi suivant sous les sifflets.", fx: { rep: -3, mor: -8 } },
      ] },
      { label: "Concéder qu'il a raison", outcomes: [
        { weight: 55, text: "Votre franchise touche. Et la question, elle, vous travaille tout l'hiver.", fx: { men: 5, mor: -3, dis: 6 } },
        { weight: 45, text: "L'aveu devient un titre : « je ne suis peut-être pas fait pour le top 10 ». Vous le lisez trois cents fois.", fx: { mor: -10, men: 3 } },
      ] },
    ],
  },
  {
    id: "ev_exhibition", cat: "Calendrier", icon: "💸", w: 12, cond: { aMin: 21, aMax: 36, rankMax: 40 },
    text: "Une exhibition dans le Golfe : trois jours, deux matchs sans enjeu, 300 000 € garantis. C'est la semaine où vous deviez préparer le Majeur.",
    options: [
      { label: "Prendre l'argent", outcomes: [
        { weight: 50, text: "Deux matchs tranquilles, un chèque énorme, et une semaine de préparation en moins.", fx: { money: 0.30, fatigue: 6, form: -6 } },
        { weight: 50, text: "Le chèque tombe, et vous arrivez au Majeur avec un rythme approximatif et la tête ailleurs.", fx: { money: 0.30, form: -12, mor: -4, trait: "merc" } },
      ] },
      { label: "Décliner et préparer le Majeur", outcomes: [
        { weight: 60, text: "Dix jours de travail spécifique. Vous arrivez affûté comme rarement.", fx: { form: 12, men: 4 } },
        { weight: 40, text: "La préparation est parfaite, et vous tombez au deuxième tour sur un joueur inspiré. Le tennis, parfois.", fx: { form: 8, mor: -6 } },
      ] },
    ],
  },
  {
    id: "ev_love_tour", cat: "Vie privée", icon: "💞", w: 12, cond: { aMin: 21, aMax: 33, notFlag: "settled" },
    text: "La relation dure depuis deux ans, à distance, entre deux fuseaux horaires. Ce soir, la question tombe : « Tu comptes vivre comme ça encore combien de temps ? »",
    options: [
      { label: "Ralentir le calendrier pour construire", outcomes: [
        { weight: 55, text: "Vous jouez huit tournois de moins et vous dormez chez vous. Le classement recule, le reste va mieux.", fx: { mor: 16, form: 6, rep: -3, flag: "settled" } },
        { weight: 45, text: "L'équilibre trouvé vous rend meilleur : moins de matchs, mais plus de lucidité dans les grands.", fx: { mor: 14, men: 6, flag: "settled" } },
      ] },
      { label: "L'emmener sur le circuit", outcomes: [
        { weight: 50, text: "Elle rejoint le box. Les semaines sont moins longues, l'équipe plus soudée.", fx: { mor: 12, coach: 4, flag: "settled" } },
        { weight: 50, text: "Six mois de vie d'hôtel, et la rupture au retour d'Australie.", fx: { mor: -14, form: -6 } },
      ] },
      { label: "Choisir le tennis, franchement", hint: "Dur", outcomes: [
        { weight: 100, text: "Vous le dites sans détour. Elle part le lendemain. Vous vous entraînez le surlendemain.", fx: { mor: -12, dis: 8, men: 5, fatigue: -4 } },
      ] },
    ],
  },
  {
    id: "ev_nations_cup", cat: "Fédération", icon: "🛡️", w: 12, cond: { aMin: 20, aMax: 35, rankMax: 80 },
    text: "La Coupe des Nations tombe une semaine après le Majeur. Le capitaine compte sur vous, votre kiné vous conseille dix jours de repos complet.",
    options: [
      { label: "Répondre présent", hint: "Le maillot", outcomes: [
        { weight: 48, text: "Deux victoires en simple, une qualification arrachée, et un vestiaire qui chante votre nom.", fx: { rep: 7, mor: 14, fatigue: 12, flag: "nations_hero" } },
        { weight: 30, text: "Une victoire, une défaite, et une équipe éliminée. Vous rentrez vidé.", fx: { fatigue: 14, mor: -4 } },
        { weight: 22, text: "Vous vous blessez au deuxième match, sur un terrain trop lent, pour une compétition qui ne rapporte aucun point.", fx: { inj: 6, fatigue: 10, mor: -9 } },
      ] },
      { label: "Décliner et récupérer", outcomes: [
        { weight: 55, text: "Dix jours au calme. Le corps dit merci, la fédération beaucoup moins.", fx: { fatigue: -14, form: 8, rep: -4 } },
        { weight: 45, text: "Le capitaine le prend mal et le dit publiquement. Votre wildcard nationale s'éloigne.", fx: { fatigue: -12, rep: -7, flag: "fed_conflict" } },
      ] },
    ],
  },
  {
    id: "ev_burnout_early", cat: "Mental", icon: "🌫️", w: 11, cond: { aMin: 21, aMax: 32, morMax: 42 },
    text: "Vous êtes assis dans le vestiaire, chaussures aux pieds, et vous n'arrivez pas à vous lever. Ça fait trois tournois que ça dure. Personne ne le sait.",
    options: [
      { label: "Annoncer une pause de trois mois", hint: "Courageux", outcomes: [
        { weight: 62, text: "Le communiqué est sobre. Le circuit, pour une fois, applaudit. Vous revenez avec une tête neuve.", fx: { mor: 28, men: 6, rep: 2, form: -8, flag: "mental_break" } },
        { weight: 38, text: "Trois mois sans tennis, et la peur de ne plus savoir jouer. Le retour est laborieux.", fx: { mor: 18, form: -14, flag: "mental_break" } },
      ] },
      { label: "Continuer, personne ne doit savoir", outcomes: [
        { weight: 42, text: "Vous tenez. Six mois plus tard, ça passe, sans que vous sachiez pourquoi.", fx: { mor: 8, men: 4 } },
        { weight: 58, text: "Vous tenez, et vous cassez. Deux mois d'arrêt forcé et un début de dépression.", fx: { mor: -16, inj: 5, men: -3 } },
      ] },
    ],
  },
  {
    id: "ev_bad_call", cat: "Insolite", icon: "🚨", w: 10, cond: { aMin: 19, aMax: 36 },
    text: "Balle de set. L'arbitre annonce faute sur une balle que tout le stade a vue bonne. L'écran de contrôle est en panne depuis le matin.",
    options: [
      { label: "Exploser", outcomes: [
        { weight: 45, text: "Vous videz votre sac pendant trois minutes. La colère vous transcende : vous gagnez les six jeux suivants.", fx: { men: 4, mor: 6, rep: 3, trait: "hothead" } },
        { weight: 55, text: "Avertissement, puis point de pénalité, puis un match perdu et 12 000 € d'amende.", fx: { money: -0.012, mor: -10, rep: -4, trait: "hothead" } },
      ] },
      { label: "Ne rien montrer", outcomes: [
        { weight: 58, text: "Vous rejouez le point suivant comme si de rien n'était. L'adversaire, lui, y pense encore trois jeux plus tard.", fx: { men: 6, mor: 4, trait: "zen" } },
        { weight: 42, text: "Vous encaissez sans rien dire, et vous ruminez jusqu'au bout du match. Il n'y a pas de médaille pour ça.", fx: { mor: -6, men: 3 } },
      ] },
    ],
  },
  {
    id: "ev_second_coach", cat: "Box & équipe", icon: "💥", w: 11, cond: { aMin: 22, aMax: 34, coachMax: 38 },
    text: "La séance s'est terminée en cri. Il vous reproche de ne plus écouter, vous lui reprochez de ne plus rien apporter. Le silence dure depuis deux jours.",
    options: [
      { label: "Le remercier", outcomes: [
        { weight: 55, text: "Séparation nette. Trois semaines plus tard, vous respirez mieux sur le court.", fx: { coach: 20, mor: 4, form: -5 } },
        { weight: 45, text: "Vous vous retrouvez seul en pleine saison, à chercher un remplaçant entre deux avions.", fx: { coach: 15, mor: -8, form: -10 }, team: { coach: -1 } },
      ] },
      { label: "Crever l'abcès et repartir ensemble", outcomes: [
        { weight: 52, text: "Quatre heures de discussion, beaucoup de choses dites. Vous ne travaillerez plus jamais pareil, en mieux.", fx: { coach: 30, men: 5, mor: 8 } },
        { weight: 48, text: "Vous vous serrez la main sans y croire. Ça tiendra six mois de plus.", fx: { coach: 12, mor: -3 } },
      ] },
    ],
  },
  {
    id: "ev_sponsor_shady", cat: "Argent", icon: "🕶️", w: 10, cond: { aMin: 21, aMax: 36, rankMax: 60 },
    text: "Une société de paris sportifs veut son logo sur votre manche. Le montant est le triple de ce que vous touchez aujourd'hui. Votre agent vous laisse décider.",
    options: [
      { label: "Signer", outcomes: [
        { weight: 55, text: "Le virement arrive. Personne ne dit rien, et vous ne pensez plus à l'argent pendant deux ans.", fx: { money: 0.4, mor: 4, trait: "merc" } },
        { weight: 45, text: "Un journaliste sort l'affaire. La fédération vous convoque, et votre image en prend un coup.", fx: { money: 0.4, rep: -8, mor: -6, trait: "merc" } },
      ] },
      { label: "Refuser", outcomes: [
        { weight: 60, text: "Votre agent grimace. Six mois plus tard, une marque bien plus propre vous approche justement pour ça.", fx: { money: 0.12, rep: 5, cha: 3 } },
        { weight: 40, text: "Aucune autre offre ne vient. Vous avez refusé beaucoup d'argent pour un principe.", fx: { men: 5, mor: 3 } },
      ] },
    ],
  },

  /* ══════════════ SOMMET (25-32) ══════════════ */
  {
    id: "ev_slam_favourite", cat: "Court", icon: "🎯", w: 13, cond: { aMin: 23, aMax: 34, rankMax: 8 },
    text: "Pour la première fois, vous arrivez au Majeur en tant que favori. Les questions ne portent plus sur votre progression, mais sur ce qui se passerait si vous perdiez.",
    options: [
      { label: "Assumer publiquement l'objectif", outcomes: [
        { weight: 42, text: "« Je viens pour gagner. » Le poids annoncé devient un moteur : vous jouez libéré.", fx: { men: 6, mor: 8, rep: 5 } },
        { weight: 58, text: "La phrase vous suit pendant quinze jours. Vous jouez crispé du premier au dernier point.", fx: { form: -8, men: 3, mor: -6 } },
      ] },
      { label: "Botter en touche", outcomes: [
        { weight: 55, text: "Vous parlez du premier tour, uniquement. Personne n'a rien à écrire, et vous êtes tranquille.", fx: { men: 5, form: 4 } },
        { weight: 45, text: "La presse y voit de la peur, et le répète tous les matins pendant deux semaines.", fx: { rep: -2, mor: -5, men: 3 } },
      ] },
    ],
  },
  {
    id: "ev_rival_respect", cat: "Rivalité", icon: "🤝", w: 12, cond: { aMin: 25, aMax: 36, flag: "rival_met" },
    text: "Après six ans de duels, il vous propose de vous entraîner ensemble pendant l'intersaison. Chez lui, sur ses terrains, avec son équipe.",
    options: [
      { label: "Accepter", outcomes: [
        { weight: 55, text: "Trois semaines à travailler avec l'homme qui vous connaît le mieux au monde. Vous en ressortez tous les deux meilleurs.", fx: { fdc: 3, men: 6, mor: 8, rivalEdge: 1 } },
        { weight: 45, text: "Il apprend vos schémas mieux que vous n'apprenez les siens. Les trois confrontations suivantes tournent mal.", fx: { fdc: 2, rivalEdge: -1, mor: -5 } },
      ] },
      { label: "Refuser poliment", outcomes: [
        { weight: 100, text: "Certains secrets ne se partagent pas. Vous préparez la saison de votre côté, comme toujours.", fx: { men: 4, dis: 4 } },
      ] },
    ],
  },
  {
    id: "ev_play_hurt_slam", cat: "Corps", icon: "💉", w: 13, cond: { aMin: 22, aMax: 36, rankMax: 30 },
    text: "Veille de huitième de finale en Majeur. L'échographie est claire : une déchirure débutante à l'abdominal. Le médecin propose une infiltration, et vous regarde en attendant votre réponse.",
    options: [
      { label: "S'infiltrer et jouer", hint: "Risqué", outcomes: [
        { weight: 40, text: "Vous jouez, vous gagnez, et vous entrez dans la légende du tournoi.", fx: { rep: 10, mor: 10, inj: 8, men: 5 } },
        { weight: 60, text: "L'abdominal lâche complètement au troisième set. Vous quittez le court sous les applaudissements et vous ne rejouerez pas avant trois mois.", fx: { inj: 16, mor: -10, rep: 4 } },
      ] },
      { label: "Déclarer forfait", outcomes: [
        { weight: 60, text: "Décision de professionnel. Trois semaines d'arrêt au lieu de trois mois.", fx: { inj: 3, men: 4, mor: -6 } },
        { weight: 40, text: "Le forfait fait jaser : on vous trouve fragile. Ça vous poursuit toute la saison.", fx: { inj: 3, rep: -5, mor: -8 } },
      ] },
    ],
  },
  {
    id: "ev_no1_chase", cat: "Court", icon: "👑", w: 13, cond: { aMin: 22, aMax: 34, rankMax: 3, rankMin: 2 },
    text: "Il vous manque 400 points pour la première place mondiale. Deux chemins : un Masters 1000 relevé, ou trois petits tournois enchaînés que vous êtes censé gagner.",
    options: [
      { label: "Le grand tournoi", hint: "Tout ou rien", outcomes: [
        { weight: 38, text: "Titre. Vous prenez la place de numéro un mondial en battant tout le monde sur la route.", fx: { rep: 14, mor: 16, men: 6, flag: "no1_earned" } },
        { weight: 62, text: "Éliminé en quarts. Vous regardez le classement du lundi sans y croire.", fx: { mor: -12, men: 4 } },
      ] },
      { label: "Les trois petits", hint: "Comptable", outcomes: [
        { weight: 52, text: "Trois semaines, trois titres, huit heures d'avion et la première place au bout. Personne ne dira que c'était beau.", fx: { rep: 8, mor: 12, fatigue: 18, flag: "no1_earned" } },
        { weight: 48, text: "Deux titres et une défaite en finale au troisième. Il vous manque quarante points, et vous êtes épuisé.", fx: { fatigue: 20, mor: -10, form: -8 } },
      ] },
    ],
  },
  {
    id: "ev_documentary", cat: "Médias", icon: "🎬", w: 10, cond: { aMin: 24, aMax: 37, repMin: 62 },
    text: "Une plateforme veut vous suivre pendant une saison entière : les vestiaires, les avions, la maison, la famille. Rien ne serait coupé.",
    options: [
      { label: "Ouvrir toutes les portes", outcomes: [
        { weight: 50, text: "Le documentaire est un succès mondial. Vous n'êtes plus seulement un joueur.", fx: { rep: 12, cha: 8, money: 0.25, trait: "showman" } },
        { weight: 50, text: "Les caméras filment aussi les mauvais jours. Le grand public découvre un homme moins lisse que prévu.", fx: { rep: 5, cha: 4, mor: -8, money: 0.25 } },
      ] },
      { label: "Refuser : le vestiaire est sacré", outcomes: [
        { weight: 100, text: "Vous déclinez sans hésiter. Votre équipe vous en remercie, la plateforme trouvera quelqu'un d'autre.", fx: { coach: 6, mor: 5 } },
      ] },
    ],
  },
  {
    id: "ev_all_surfaces", cat: "Calendrier", icon: "🌈", w: 11, cond: { aMin: 23, aMax: 33, rankMax: 15 },
    text: "Votre entraîneur pose deux calendriers sur la table. L'un vous fait jouer les quatre Majeurs et vous disperse. L'autre concentre tout sur les deux surfaces où vous êtes redoutable.",
    options: [
      { label: "Les quatre Majeurs, quoi qu'il en coûte", hint: "L'Histoire", outcomes: [
        { weight: 50, text: "Vous voyagez plus, vous vous adaptez sans cesse, et vous devenez un joueur complet.", fx: { affFixWeak: 2, fatigue: 10, men: 5 } },
        { weight: 50, text: "À force de courir partout, vous n'êtes redoutable nulle part cette saison.", fx: { affCutBest: 1, affFixWeak: 1, mor: -6, form: -6 } },
      ] },
      { label: "Concentrer sur vos surfaces", hint: "Les titres", outcomes: [
        { weight: 55, text: "Saison réduite, mais chaque tournoi joué est un tournoi que vous pouvez gagner.", fx: { affBoostBest: 1, form: 8, fatigue: -8 } },
        { weight: 45, text: "Vous accumulez les titres et les commentaires : « il ne gagnera jamais rien ailleurs ».", fx: { affBoostBest: 2, rep: 3, mor: -5 } },
      ] },
    ],
  },
  {
    id: "ev_academy_own", cat: "Héritage", icon: "🏛️", w: 9, cond: { aMin: 27, aMax: 38, moneyMin: 3 },
    text: "Un projet vous est soumis : votre nom sur une académie, dans votre région, avec vos méthodes. Quatre millions d'investissement et beaucoup de votre temps.",
    options: [
      { label: "Investir", outcomes: [
        { weight: 55, text: "L'académie ouvre. Vous y passez chaque intersaison, et le projet vous survivra.", fx: { money: -3.0, rep: 8, mor: 10, flag: "academy_owner" } },
        { weight: 45, text: "Le chantier prend du retard et vous coûte deux fois le budget prévu. Vous y pensez pendant les matchs.", fx: { money: -4.2, mor: -6, form: -5, flag: "academy_owner" } },
      ] },
      { label: "Plus tard, après la carrière", outcomes: [
        { weight: 100, text: "Vous rangez le dossier dans un tiroir. Il y sera encore dans dix ans.", fx: { men: 3 } },
      ] },
    ],
  },
  {
    id: "ev_gulf_season", cat: "Argent", icon: "🏜️", w: 9, cond: { aMin: 28, aMax: 38, rankMax: 60, rankMin: 12 },
    text: "Un nouveau circuit richement doté vous propose un contrat d'ambassadeur : huit tournois par an, aucune pression, aucun classement, et un montant à sept chiffres.",
    options: [
      { label: "Signer pour deux ans", outcomes: [
        { weight: 55, text: "Vous n'aurez plus jamais de souci d'argent. Le circuit principal, lui, vous oublie très vite.", fx: { money: 2.2, rep: -8, form: -6, trait: "merc" } },
        { weight: 45, text: "Le contrat est confortable et vous laisse même du temps pour bien préparer les Majeurs.", fx: { money: 2.0, fatigue: -8, rep: -3 } },
      ] },
      { label: "Rester sur le circuit", outcomes: [
        { weight: 100, text: "Vous voulez encore jouer devant du monde, pour quelque chose. C'est peut-être idiot.", fx: { mor: 6, men: 5 } },
      ] },
    ],
  },

  /* ══════════════ CRÉPUSCULE (30-40) ══════════════ */
  {
    id: "ev_body_talks", cat: "Corps", icon: "🦴", w: 13, cond: { aMin: 30, aMax: 40 },
    text: "Le bilan annuel est sans appel : deux disques usés, un genou qui ne récupère plus, et une question du médecin — « vous voulez continuer combien de temps ? »",
    options: [
      { label: "Alléger radicalement le calendrier", outcomes: [
        { weight: 60, text: "Douze tournois par an, deux objectifs, et un corps qui répond de nouveau sur les grands rendez-vous.", fx: { fatigue: -18, form: 8, phy: 2, flag: "light_schedule" } },
        { weight: 40, text: "Moins de matchs, moins de rythme. Vous êtes frais et vous jouez mal.", fx: { fatigue: -14, form: -6, mor: -5, flag: "light_schedule" } },
      ] },
      { label: "Tout donner tant que ça tient", outcomes: [
        { weight: 45, text: "Deux saisons supplémentaires de haut niveau, arrachées au forceps. Ça valait le coup.", fx: { phy: 2, men: 6, mor: 8, fatigue: 12 } },
        { weight: 55, text: "Le genou lâche en plein tournoi. Cette fois, il n'y a pas de retour prévu.", fx: { inj: 24, mor: -12 } },
      ] },
    ],
  },
  {
    id: "ev_young_gun", cat: "Rivalité", icon: "🐺", w: 12, cond: { aMin: 30, aMax: 39, rankMax: 40 },
    text: "Un gamin de dix-neuf ans vous a battu en trois sets, et il a dit après le match qu'il vous regardait à la télé quand il était petit. Il le pensait comme un compliment.",
    options: [
      { label: "En rire publiquement", outcomes: [
        { weight: 60, text: "Votre réponse fait le tour du circuit. Le public adore les vieux qui ont de l'humour.", fx: { rep: 5, cha: 4, mor: 6 } },
        { weight: 40, text: "Vous riez devant les caméras et vous ne dormez pas de la nuit.", fx: { rep: 3, mor: -7, men: 3 } },
      ] },
      { label: "Le prendre comme un défi", outcomes: [
        { weight: 48, text: "Trois mois de travail rageur. Vous le battez au tournoi suivant, et vous ne dites rien.", fx: { fdc: 3, men: 6, mor: 10, form: 6 } },
        { weight: 52, text: "Vous forcez, le corps ne suit plus, et il vous rebat deux fois dans la foulée.", fx: { fatigue: 12, mor: -8, inj: 4 } },
      ] },
    ],
  },
  {
    id: "ev_farewell_tour", cat: "Retraite", icon: "🌇", w: 11, cond: { aMin: 32, aMax: 41, rankMin: 40 },
    text: "Votre agent propose une tournée d'adieux : une année annoncée comme la dernière, des hommages dans chaque tournoi, et des invitations partout.",
    options: [
      { label: "Annoncer la dernière saison", outcomes: [
        { weight: 55, text: "Chaque tournoi devient une fête. Vous jouez léger, et vous gagnez quelques matchs que vous n'auriez pas dû gagner.", fx: { rep: 8, mor: 16, form: 6, wildcard: 2, flag: "farewell" } },
        { weight: 45, text: "Les hommages sont beaux, les défaites aussi. Vous découvrez qu'on peut être ému et humilié le même soir.", fx: { rep: 6, mor: 4, flag: "farewell" } },
      ] },
      { label: "Ne rien annoncer et voir venir", outcomes: [
        { weight: 100, text: "Vous préférez partir sans prévenir, le jour où ça n'ira plus. C'est plus digne, et plus solitaire.", fx: { men: 5, mor: -3 } },
      ] },
    ],
  },
  {
    id: "ev_last_slam", cat: "Héritage", icon: "🕯️", w: 11, cond: { aMin: 33, aMax: 41, rankMax: 120 },
    text: "C'est probablement votre dernier Majeur. Le tableau vous a placé face à une tête de série au premier tour, sur le court central, en session de nuit.",
    options: [
      { label: "Tout lâcher, une dernière fois", outcomes: [
        { weight: 40, text: "Quatre heures de tennis, un cinquième set gagné, et un stade debout à une heure du matin. Le match dont on parlera dix ans.", fx: { rep: 12, mor: 20, fatigue: 14, men: 5, flag: "night_legend" } },
        { weight: 60, text: "Le corps ne suit plus après deux sets. La sortie est digne, et sans miracle.", fx: { rep: 4, mor: 6, fatigue: 12 } },
      ] },
      { label: "Jouer sobrement et savourer", outcomes: [
        { weight: 100, text: "Vous prenez le temps de regarder les tribunes entre les points. Vous perdez, et ce n'est pas grave.", fx: { mor: 12, rep: 3 } },
      ] },
    ],
  },
  {
    id: "ev_coaching_offer", cat: "Retraite", icon: "📋", w: 10, cond: { aMin: 32, aMax: 41 },
    text: "Une fédération vous propose de prendre en main ses jeunes dès l'année prochaine. Le poste est fait pour vous. Il faudrait arrêter maintenant.",
    options: [
      { label: "Accepter et raccrocher à la fin de la saison", outcomes: [
        { weight: 100, text: "Une porte s'ouvre pendant qu'une autre se ferme. Vous savez déjà ce que vous ferez lundi.", fx: { mor: 10, men: 5, flag: "retire_pending" } },
      ] },
      { label: "Refuser : il reste du tennis", outcomes: [
        { weight: 100, text: "Vous remerciez, vous déclinez, et vous reprenez l'entraînement le lendemain matin.", fx: { men: 6, dis: 6, mor: 4 } },
      ] },
    ],
  },
  {
    id: "ev_retire_decision", cat: "Retraite", icon: "🚪", w: 0, cond: { flag: "retire_pending" }, scheduledOnly: true,
    text: "Le corps parle plus fort chaque matin, le classement recule, et la question ne se pose plus en secret : est-ce que vous rempilez pour une saison de plus ?",
    options: [
      { label: "Raccrocher maintenant", outcomes: [
        { weight: 100, text: "C'est décidé. Vous jouerez votre dernier match cette saison, et vous le saurez en entrant sur le court.", fx: { flag: "retire_now", clearFlag: "retire_pending" } },
      ] },
      { label: "Une saison de plus", hint: "Encore un peu", outcomes: [
        { weight: 100, text: "Encore un hiver de préparation, encore des avions, encore des vestiaires. Encore une année.", fx: { mor: 8, dis: 5, clearFlag: "retire_pending" } },
      ] },
    ],
  },

  /* ══════════════ TRANSVERSAUX ══════════════ */
  {
    id: "ev_string_change", cat: "Technique", icon: "🧵", w: 9, cond: { aMin: 19, aMax: 36 },
    text: "Votre cordeur suggère de monter la tension de trois kilos : plus de contrôle sur les grands points, moins de puissance gratuite.",
    options: [
      { label: "Monter la tension", outcomes: [
        { weight: 55, text: "Les balles rentrent. Vous jouez plus près des lignes sans avoir peur.", fx: { fdc: 3, men: 3 } },
        { weight: 45, text: "Vous perdez le peu de gratuit que vous aviez, et le coude proteste.", fx: { fdc: -1, ser: -1, inj: 3 } },
      ] },
      { label: "Descendre au contraire", outcomes: [
        { weight: 55, text: "Plus de longueur, moins d'effort. Les échanges deviennent plus faciles.", fx: { ser: 2, phy: 2, fatigue: -4 } },
        { weight: 45, text: "Trop de fautes directes dans les moments importants. Vous revenez en arrière au bout d'un mois.", fx: { men: -2, mor: -4 } },
      ] },
    ],
  },
  {
    id: "ev_fitness_overhaul", cat: "Corps", icon: "💪", w: 11, cond: { aMin: 20, aMax: 33, moneyMin: 0.15 },
    text: "Un préparateur physique réputé accepte de vous prendre, à condition de tout reprendre : alimentation, sommeil, charge, et six semaines sans compétition.",
    options: [
      { label: "Accepter le protocole complet", outcomes: [
        { weight: 60, text: "Six semaines de fonte, puis un corps qui ne dit plus non au troisième set.", fx: { phy: 6, fatigue: -12, form: -6, money: -0.06 }, team: { fitness: 1 } },
        { weight: 40, text: "Vous ressortez plus fort, mais le rythme de match a disparu et il faudra deux mois pour le retrouver.", fx: { phy: 5, form: -14, money: -0.06 }, team: { fitness: 1 } },
      ] },
      { label: "Refuser : pas de coupure en pleine saison", outcomes: [
        { weight: 100, text: "Vous continuez à jouer. Le classement le préfère, le corps moins.", fx: { fatigue: 6, form: 4 } },
      ] },
    ],
  },
  {
    id: "ev_hostile_crowd", cat: "Insolite", icon: "📣", w: 9, cond: { aMin: 19, aMax: 38, rankMax: 100 },
    text: "Vous jouez le héros local, en pleine nuit, dans un stade qui vous siffle entre les premières et deuxièmes balles.",
    options: [
      { label: "Provoquer le public", outcomes: [
        { weight: 45, text: "Vous mettez la main derrière l'oreille après le break. Le stade explose, et vous jouez le meilleur match de votre vie.", fx: { rep: 7, mor: 10, cha: 5, men: 4, trait: "showman" } },
        { weight: 55, text: "Le public double d'intensité et vous sort du match en trois jeux.", fx: { mor: -10, rep: -2 } },
      ] },
      { label: "Se couper du monde", outcomes: [
        { weight: 60, text: "Serviette, casquette, regard au sol entre chaque point. Rien ne vous atteint.", fx: { men: 6, mor: 4, trait: "zen" } },
        { weight: 40, text: "Impossible de faire abstraction. Vous entendez chaque sifflet jusqu'au dernier point.", fx: { mor: -8, men: 3 } },
      ] },
    ],
  },
  {
    id: "ev_fed_conflict", cat: "Fédération", icon: "🏛️", w: 9, cond: { aMin: 21, aMax: 36, flag: "fed_conflict" },
    text: "La fédération conditionne votre wildcard et votre bourse à votre présence en Coupe des Nations. Le message est à peine voilé.",
    options: [
      { label: "Céder et rentrer dans le rang", outcomes: [
        { weight: 100, text: "Vous signez ce qu'on vous demande. La bourse reprend, la wildcard aussi, et vous jouerez deux semaines de plus par an.", fx: { money: 0.03, wildcard: 1, fatigue: 8, mor: -5, clearFlag: "fed_conflict" } },
      ] },
      { label: "Rompre publiquement", hint: "Coûteux", outcomes: [
        { weight: 55, text: "Communiqué sec, indépendance totale. Une partie du circuit vous soutient.", fx: { rep: 4, men: 6, money: -0.03, flag: "fed_broken" } },
        { weight: 45, text: "Vous perdez la bourse, la wildcard, et le soutien du pays d'un seul coup.", fx: { money: -0.03, rep: -6, mor: -8, flag: "fed_broken" } },
      ] },
    ],
  },
  {
    id: "ev_altitude_camp", cat: "Calendrier", icon: "🏔️", w: 9, cond: { aMin: 20, aMax: 34 },
    text: "Trois semaines en altitude pendant l'intersaison, à 2 200 mètres. Dur, isolé, et scientifiquement discutable.",
    options: [
      { label: "Y aller", outcomes: [
        { weight: 58, text: "Vous redescendez avec une capacité de récupération que vous ne vous connaissiez pas.", fx: { phy: 5, fatigue: -10, money: -0.02 } },
        { weight: 42, text: "Trois semaines de fatigue accumulée sans bénéfice mesurable. Le début de saison est raté.", fx: { form: -10, fatigue: 6, money: -0.02 } },
      ] },
      { label: "Préparer normalement, au chaud", outcomes: [
        { weight: 100, text: "Deux semaines de terre battue et de matchs d'entraînement. Classique, efficace.", fx: { form: 6, fdc: 2 } },
      ] },
    ],
  },
  {
    id: "ev_charity", cat: "Héritage", icon: "🎗️", w: 8, cond: { aMin: 24, aMax: 40, moneyMin: 1.5, repMin: 55 },
    text: "Une association vous propose de parrainer un programme de tennis dans les quartiers. Du temps, de l'argent, et aucune retombée sportive.",
    options: [
      { label: "S'engager vraiment", outcomes: [
        { weight: 100, text: "Vous y allez trois fois par an, sans caméra. C'est ce dont vous parlerez le plus, plus tard.", fx: { money: -0.35, rep: 6, mor: 12, flag: "philanthrope" } },
      ] },
      { label: "Prêter votre nom, sans plus", outcomes: [
        { weight: 100, text: "Une photo, un communiqué, un chèque. Tout le monde y trouve son compte.", fx: { money: -0.08, rep: 3, cha: 2 } },
      ] },
    ],
  },
  {
    id: "ev_new_shot", cat: "Technique", icon: "🪄", w: 10, cond: { aMin: 20, aMax: 32, nivMin: 70 },
    text: "Votre entraîneur veut ajouter une arme à votre jeu : un slice long et bas qui casserait le rythme de tous les frappeurs du circuit. Six mois de travail pour un coup que vous jouerez trois fois par match.",
    options: [
      { label: "Travailler le slice", outcomes: [
        { weight: 55, text: "Le coup entre dans le jeu. Sur les surfaces basses, vous devenez insupportable à jouer.", fx: { ret: 3, aff: { grass: 2, hard: -1, clay: -1 }, men: 3 } },
        { weight: 45, text: "Le coup ne sort jamais en match. Six mois pour rien, et un doute technique de plus.", fx: { mor: -6, men: 2 } },
      ] },
      { label: "Durcir plutôt le coup droit", outcomes: [
        { weight: 60, text: "Plus de vitesse, plus de lourdeur. Les adversaires reculent d'un mètre.", fx: { fdc: 4, ser: 1 } },
        { weight: 40, text: "Vous frappez plus fort et vous ratez plus. Le bilan est neutre, l'épaule non.", fx: { fdc: 2, inj: 4 } },
      ] },
    ],
  },
  {
    id: "ev_parenthood", cat: "Vie privée", icon: "👶", w: 10, cond: { aMin: 26, aMax: 38, flag: "settled" },
    text: "Vous allez être parent. La saison prochaine se jouera avec un couffin dans les chambres d'hôtel, ou sans vous.",
    options: [
      { label: "Emmener la famille sur le circuit", outcomes: [
        { weight: 55, text: "Les tournois deviennent des voyages de famille. Vous n'avez jamais été aussi serein sur un court.", fx: { mor: 18, men: 5, money: -0.08, flag: "parent" } },
        { weight: 45, text: "Personne ne dort. Les six premiers mois de la saison sont une brume.", fx: { mor: 6, form: -10, fatigue: 10, flag: "parent" } },
      ] },
      { label: "Réduire la saison de moitié", outcomes: [
        { weight: 100, text: "Vous ne jouerez que les grands rendez-vous cette année. Le classement chutera, et vous serez là.", fx: { mor: 20, rep: -4, flag: "parent", flag2: "light_schedule" } },
      ] },
    ],
  },
  {
    id: "ev_tank_accusation", cat: "Médias", icon: "🗞️", w: 9, cond: { aMin: 21, aMax: 38, morMax: 50 },
    text: "Une défaite en cinquante-huit minutes, et un consultant qui parle à l'antenne de « match abandonné en cours de route ». La phrase tourne en boucle.",
    options: [
      { label: "Répondre point par point", outcomes: [
        { weight: 50, text: "Vous expliquez le contexte, la blessure, la fatigue. La plupart des gens comprennent.", fx: { rep: 2, mor: 5, men: 3 } },
        { weight: 50, text: "Vous vous justifiez trop longtemps, et vous donnez raison à ceux qui doutaient.", fx: { rep: -5, mor: -6 } },
      ] },
      { label: "Répondre sur le court", outcomes: [
        { weight: 55, text: "Trois semaines plus tard, un titre. Vous ne dites toujours rien, et tout le monde a compris.", fx: { rep: 6, form: 8, men: 6, mor: 8 } },
        { weight: 45, text: "Les résultats ne viennent pas, et l'étiquette reste collée pendant deux saisons.", fx: { rep: -6, mor: -8 } },
      ] },
    ],
  },
  {
    id: "ev_lucky_loser", cat: "Circuit secondaire", icon: "🍀", w: 9, cond: { aMin: 18, aMax: 28, rankMin: 120, rankMax: 400 },
    text: "Battu en qualifications, vous êtes déjà à l'aéroport quand le téléphone sonne : un forfait de dernière minute vous ouvre le tableau principal. Le vol part dans quarante minutes.",
    options: [
      { label: "Faire demi-tour", outcomes: [
        { weight: 45, text: "Vous arrivez sur le court une heure après, sans échauffement, et vous gagnez deux tours.", fx: { rep: 6, mor: 12, men: 5, fatigue: 6 } },
        { weight: 55, text: "Vous jouez à plat, vous perdez, mais les points du premier tour comptent quand même.", fx: { mor: 3, fatigue: 5 } },
      ] },
      { label: "Prendre l'avion, la saison est longue", outcomes: [
        { weight: 100, text: "Vous rentrez chez vous. Le lundi, en regardant le tableau, vous vous en voulez.", fx: { mor: -7, fatigue: -5 } },
      ] },
    ],
  },
  {
    id: "ev_teammate_doping", cat: "Insolite", icon: "⚗️", w: 7, cond: { aMin: 21, aMax: 36 },
    text: "Un joueur avec qui vous vous entraînez depuis des années est contrôlé positif. La presse cherche à savoir qui savait quoi.",
    options: [
      { label: "Le soutenir publiquement", outcomes: [
        { weight: 45, text: "Il est blanchi six mois plus tard. Votre soutien vous vaut le respect du vestiaire.", fx: { rep: 4, mor: 6, men: 3 } },
        { weight: 55, text: "Il est suspendu quatre ans. Votre nom apparaît dans tous les articles à côté du sien.", fx: { rep: -7, mor: -8 } },
      ] },
      { label: "Prendre ses distances", outcomes: [
        { weight: 100, text: "Vous coupez immédiatement. Le circuit comprend, lui ne vous pardonnera jamais.", fx: { rep: 2, mor: -6, men: 4 } },
      ] },
    ],
  },
  {
    id: "ev_indoor_specialist", cat: "Court", icon: "🏟️", w: 9, cond: { aMin: 21, aMax: 34 },
    text: "Vos meilleurs résultats de la saison sont tous tombés en salle, sur des courts rapides et sans vent. Votre entraîneur veut construire la fin de saison autour de ça.",
    options: [
      { label: "Bâtir une fin de saison en salle", outcomes: [
        { weight: 60, text: "Cinq tournois en salle, deux finales, un titre. La conclusion de saison la plus rentable de votre carrière.", fx: { aff: { hard: 2, clay: -1, grass: -1 }, form: 6, mor: 8 } },
        { weight: 40, text: "Le corps ne tient pas les surfaces dures enchaînées. Vous finissez la saison à l'arrêt.", fx: { inj: 8, fatigue: 12, mor: -5 } },
      ] },
      { label: "Garder un calendrier varié", outcomes: [
        { weight: 100, text: "Vous refusez de vous enfermer dans une case. C'est plus dur, et plus fidèle à ce que vous voulez être.", fx: { men: 4, affFixWeak: 1 } },
      ] },
    ],
  },
  {
    id: "ev_first_top10_win", cat: "Court", icon: "⚡", w: 12, cond: { aMin: 18, aMax: 28, rankMax: 200, rankMin: 25, notFlag: "beat_top10" },
    text: "Deux sets partout contre un membre du top 10, et vous servez pour le match. Vous n'avez jamais battu quelqu'un d'aussi bien classé.",
    options: [
      { label: "Servir gros, quitte à faire la double", outcomes: [
        { weight: 46, text: "Ace. Ace. Service gagnant. Le premier grand scalp de votre carrière.", fx: { rep: 10, mor: 16, men: 6, ser: 2, flag: "beat_top10" } },
        { weight: 54, text: "Deux doubles fautes, un break, et un cinquième set perdu 8-6. Vous y penserez longtemps.", fx: { mor: -12, men: 5 } },
      ] },
      { label: "Assurer la première balle et jouer le point", outcomes: [
        { weight: 52, text: "Trois échanges longs, trois points gagnés. Ce n'était pas beau, et vous vous en fichez.", fx: { rep: 9, mor: 14, dep: 2, men: 4, flag: "beat_top10" } },
        { weight: 48, text: "Il monte le niveau au moment exact où vous le baissez. Leçon reçue.", fx: { mor: -9, men: 6 } },
      ] },
    ],
  },
  {
    id: "ev_schedule_fight", cat: "Box & équipe", icon: "🗓️", w: 10, cond: { aMin: 22, aMax: 35, rankMax: 50 },
    text: "Votre entraîneur veut couper trois tournois, votre agent veut en ajouter deux pour honorer des contrats. Ils s'engueulent devant vous.",
    options: [
      { label: "Suivre l'entraîneur", outcomes: [
        { weight: 60, text: "Moins de tournois, plus de préparation. Le corps et le jeu remercient.", fx: { fatigue: -10, form: 7, coach: 8, money: -0.05 } },
        { weight: 40, text: "Vous coupez trop et vous perdez le rythme de match au pire moment de la saison.", fx: { form: -6, coach: 8, money: -0.05 } },
      ] },
      { label: "Suivre l'agent", outcomes: [
        { weight: 55, text: "Les contrats sont honorés, la trésorerie gonfle, et vous tenez le choc.", fx: { money: 0.14, fatigue: 10, coach: -6 } },
        { weight: 45, text: "Deux tournois de trop. Vous vous blessez sur le second, pour un cachet d'apparition.", fx: { money: 0.12, inj: 6, coach: -10, mor: -6 } },
      ] },
    ],
  },
  {
    id: "ev_travel_alone", cat: "Circuit secondaire", icon: "🧳", w: 9, cond: { aMin: 18, aMax: 30, rankMin: 150 },
    text: "Sixième semaine consécutive sur la route, seul. Vous avez déjeuné trois fois de suite dans la même station-service, et vous ne savez plus dans quelle ville vous êtes.",
    options: [
      { label: "Rentrer une semaine, tant pis pour les points", outcomes: [
        { weight: 100, text: "Sept jours chez vous, à ne rien faire. Vous repartez avec une tête neuve et cent places de moins.", fx: { mor: 15, fatigue: -12, rep: -2 } },
      ] },
      { label: "Continuer, coûte que coûte", outcomes: [
        { weight: 48, text: "Vous encaissez, et vous gagnez un tournoi la semaine suivante. Le circuit récompense parfois l'entêtement.", fx: { mor: 6, men: 6, fatigue: 8 } },
        { weight: 52, text: "Vous continuez et vous jouez de plus en plus mal. Sept défaites d'affilée.", fx: { mor: -14, form: -10, fatigue: 12 } },
      ] },
    ],
  },
  {
    id: "ev_old_friend", cat: "Vie privée", icon: "🍺", w: 8, cond: { aMin: 20, aMax: 34, entourage: "club" },
    text: "Vos amis d'enfance débarquent au tournoi, sans prévenir, avec des places qu'ils n'ont pas payées et beaucoup d'enthousiasme.",
    options: [
      { label: "Passer la soirée avec eux", outcomes: [
        { weight: 55, text: "Trois heures à rire de choses qui n'ont rien à voir avec le tennis. Vous en aviez besoin.", fx: { mor: 14, form: -3 } },
        { weight: 45, text: "La soirée s'étire jusqu'à deux heures du matin. Le match du lendemain est à onze heures.", fx: { mor: 10, form: -10, dis: -6 } },
      ] },
      { label: "Les envoyer à l'hôtel et se coucher", outcomes: [
        { weight: 100, text: "Ils comprennent, à moitié. Vous gagnez votre match et vous les voyez après.", fx: { dis: 6, form: 4, mor: -3 } },
      ] },
    ],
  },
  {
    id: "ev_masters_debut", cat: "Court", icon: "🎖️", w: 11, cond: { aMin: 21, aMax: 34, rankMax: 10, notFlag: "finals_played" },
    text: "Vous êtes qualifié pour la Finale de circuit. Huit joueurs, une salle immense, et sept des dix meilleurs du monde qui vous attendent.",
    options: [
      { label: "Jouer chaque match comme une finale", outcomes: [
        { weight: 45, text: "Deux victoires en poule et une demi-finale accrochée. Vous appartenez à ce monde-là.", fx: { rep: 10, mor: 14, men: 6, flag: "finals_played" } },
        { weight: 55, text: "Trois défaites en poule, dont deux sévères. Vous repartez avec beaucoup à digérer.", fx: { mor: -10, men: 6, flag: "finals_played" } },
      ] },
      { label: "Profiter de l'expérience sans pression", outcomes: [
        { weight: 55, text: "Libéré, vous sortez le meilleur tennis de votre saison au pire moment de l'année.", fx: { rep: 8, mor: 12, form: 6, flag: "finals_played" } },
        { weight: 45, text: "Sans intensité, on ne gagne rien à ce niveau. Trois défaites polies.", fx: { mor: -4, men: 4, flag: "finals_played" } },
      ] },
    ],
  },
  {
    id: "ev_slam_champion_after", cat: "Médias", icon: "🌟", w: 12, cond: { slamWinner: true, aMin: 20, aMax: 38, notFlag: "post_slam" },
    text: "Un Majeur au palmarès, et le monde entier veut sa part : plateaux télé, tournées promotionnelles, invitations partout. L'intersaison a disparu.",
    options: [
      { label: "Tout accepter pendant deux mois", outcomes: [
        { weight: 55, text: "Votre notoriété explose, et vos contrats aussi. Vous n'avez pas touché une raquette depuis six semaines.", fx: { rep: 12, cha: 6, money: 0.8, form: -12, flag: "post_slam" } },
        { weight: 45, text: "La tournée est éreintante et vous arrivez à la saison suivante déjà usé.", fx: { rep: 8, money: 0.5, fatigue: 14, form: -8, flag: "post_slam" } },
      ] },
      { label: "Disparaître trois semaines", outcomes: [
        { weight: 100, text: "Téléphone éteint, montagne, personne. Vous revenez le 2 janvier, prêt à recommencer.", fx: { mor: 12, form: 8, fatigue: -12, flag: "post_slam" } },
      ] },
    ],
  },
];

/* ============================================================
   MICRO-ÉVÉNEMENTS — une ligne d'ambiance, un petit effet.
   ============================================================ */
const MICRO_EVENTS = [
  { w: 10, aMin: 15, aMax: 41, text: "🎾 Un cordage neuf, une balle qui claque autrement : la semaine commence bien.", fx: { form: 3 } },
  { w: 10, aMin: 15, aMax: 41, text: "✈️ Vol annulé, nuit dans un aéroport, match le lendemain à midi.", fx: { form: -4, fatigue: 3 } },
  { w: 9,  aMin: 18, aMax: 41, text: "📸 Une photo de vous à l'entraînement fait le tour des réseaux, sans raison particulière.", fx: { rep: 2, cha: 1 } },
  { w: 9,  aMin: 15, aMax: 26, text: "🧒 Un gamin vous demande un autographe pour la première fois. Vous mettez trois secondes à comprendre.", fx: { mor: 6 } },
  { w: 8,  aMin: 18, aMax: 41, text: "🌧️ Trois jours de pluie, un tournoi décalé, et un match à jouer à 22 h après cinq heures d'attente.", fx: { form: -3, fatigue: 4 } },
  { w: 8,  aMin: 20, aMax: 41, text: "🏨 Une chambre au-dessus d'une boîte de nuit. Vous ne fermez pas l'œil.", fx: { form: -5, mor: -3 } },
  { w: 8,  aMin: 15, aMax: 41, text: "💤 Trois semaines sans avion, à dormir chez vous. Le corps s'en souvient.", fx: { fatigue: -6, mor: 4 } },
  { w: 7,  aMin: 19, aMax: 41, text: "🍽️ Une intoxication alimentaire la veille du tableau final.", fx: { form: -8, phy: -1 } },
  { w: 7,  aMin: 22, aMax: 41, text: "🤝 Un ancien champion vous glisse deux conseils dans le couloir des vestiaires. Vous y penserez souvent.", fx: { men: 3, mor: 4 } },
  { w: 7,  aMin: 18, aMax: 41, text: "🔥 Une série de quatre victoires en deux semaines : la confiance revient d'un coup.", fx: { form: 7, mor: 6 } },
  { w: 7,  aMin: 18, aMax: 41, text: "🥶 Quatre défaites au premier tour d'affilée. Vous ne comprenez plus rien à votre jeu.", fx: { form: -8, mor: -7 } },
  { w: 6,  aMin: 24, aMax: 41, text: "📺 Une chaîne vous propose de commenter un tournoi. Vous y prenez goût.", fx: { cha: 3, money: 0.01 } },
  { w: 6,  aMin: 15, aMax: 30, text: "🏋️ Un hiver de musculation qui paie enfin : les jambes tiennent la troisième heure.", fx: { phy: 2 } },
  { w: 6,  aMin: 20, aMax: 41, text: "🧘 Vous vous mettez à la méditation. Vos coéquipiers d'entraînement se moquent, puis s'y mettent aussi.", fx: { men: 2, mor: 4 } },
  { w: 6,  aMin: 19, aMax: 41, text: "🩹 Une ampoule mal placée pendant tout un tournoi. Rien de grave, très pénible.", fx: { form: -4 } },
  { w: 6,  aMin: 21, aMax: 41, text: "💬 Une phrase mal traduite en conférence de presse fait polémique pendant trois jours.", fx: { rep: -3, mor: -3 } },
  { w: 5,  aMin: 18, aMax: 41, text: "🎁 Un équipementier vous envoie dix paires de chaussures sur mesure. Petit plaisir de professionnel.", fx: { mor: 4 } },
  { w: 5,  aMin: 26, aMax: 41, text: "📖 Vous commencez à écrire vos mémoires, un carnet à la fois.", fx: { mor: 3, men: 2 } },
  { w: 5,  aMin: 18, aMax: 41, text: "🕐 Un match commencé à 23 h 40, terminé à 3 h 15. Le circuit adore ces histoires, votre corps non.", fx: { fatigue: 8, rep: 3 } },
  { w: 5,  aMin: 20, aMax: 41, text: "🧊 Bain glacé après chaque match, sans exception. La routine devient religion.", fx: { fatigue: -5, dis: 3 } },
  { w: 5,  aMin: 17, aMax: 30, text: "📈 Votre meilleur classement en carrière tombe un lundi matin. Vous prenez la capture d'écran.", fx: { mor: 7 } },
  { w: 5,  aMin: 22, aMax: 41, text: "😤 Une raquette explosée sur le banc, 4 000 € d'amende et une conférence de presse gênante.", fx: { money: -0.004, rep: -2, mor: -3 } },
  { w: 4,  aMin: 15, aMax: 41, text: "🧳 Bagage perdu, raquettes comprises. Vous jouez avec des cadres empruntés.", fx: { form: -6 } },
  { w: 4,  aMin: 24, aMax: 41, text: "🏆 Un tournoi donne votre nom à l'un de ses courts annexes.", fx: { rep: 4, mor: 8 } },
  { w: 4,  aMin: 19, aMax: 41, text: "🎧 Vous découvrez un rituel d'avant-match qui vous calme. Vous ne le changerez plus jamais.", fx: { men: 3 } },
  { w: 4,  aMin: 28, aMax: 41, text: "🩺 Le bilan de fin de saison est meilleur que prévu. Le corps tient encore.", fx: { phy: 1, mor: 5 } },
  { w: 4,  aMin: 18, aMax: 41, text: "🎯 Un sparring de très haut niveau accepte de travailler avec vous tout l'hiver.", fx: { fdc: 2, ret: 1 } },
  { w: 4,  aMin: 20, aMax: 41, text: "🌍 Un tournoi dans un pays où personne ne vous connaît, devant deux cents personnes. Vous adorez.", fx: { mor: 5 } },
  { w: 3,  aMin: 25, aMax: 41, text: "💍 Vous vous mariez pendant l'intersaison. Trois jours sans penser au classement.", fx: { mor: 12 } },
  { w: 3,  aMin: 18, aMax: 41, text: "🚗 Deux mille kilomètres en voiture pour un tournoi, avec votre kiné qui conduit et vous qui dormez.", fx: { fatigue: 5, coach: 3 } },
];

/* ============================================================
   MOMENTS DÉCISIFS — cartes interactives.
   base : probabilité de réussite avant modificateurs.
   ============================================================ */
const KEY_MOMENTS = {
  slamFinal: [
    {
      title: "FINALE DE MAJEUR",
      text: "Deux sets partout. Le stade est debout depuis vingt minutes, l'ombre a envahi la moitié du court, et vous servez à 5-5 dans le set décisif. Toute votre carrière tient dans les huit prochains points.",
      options: [
        { id: "own", label: "Jouer votre jeu, sans rien changer", hint: "Fidèle", base: 0.52, repWin: 6, repFail: 0 },
        { id: "grind", label: "Durcir le combat, allonger chaque point", hint: "Physique", base: 0.48, repWin: 5, phyBias: true, traitWin: "ironman" },
        { id: "bold", label: "Tenter l'audace : monter, servir-volleyer, prendre tous les risques", hint: "Risqué", base: 0.38, repWin: 11, repFail: -3, traitWin: "showman" },
      ],
      winText: "Le dernier revers passe à trois centimètres de la ligne. Vous tombez à genoux. Le stade explose, et plus rien ne sera jamais pareil.",
      failText: "Le dernier point vous échappe sur une faute que vous ne comprendrez jamais. Vous serrez la main, vous souriez, et vous pleurez dans les vestiaires.",
    },
    {
      title: "FINALE DE MAJEUR",
      text: "Vous menez deux sets à un, et il vient de sauver trois balles de match d'affilée. Le public a basculé de son côté. Vos jambes commencent à parler.",
      options: [
        { id: "close", label: "Refermer immédiatement, avant qu'il n'y croie", hint: "Tueur", base: 0.50, repWin: 7 },
        { id: "reset", label: "Prendre le temps, respirer, repartir de zéro", hint: "Lucide", base: 0.55, repWin: 5, traitWin: "zen" },
        { id: "attack", label: "Attaquer sa deuxième balle sur chaque point", hint: "Agressif", base: 0.42, repWin: 10, repFail: -3 },
      ],
      winText: "Vous refermez le match sur un passing le long de la ligne. Le titre est à vous, et il ne vous a pas été donné.",
      failText: "Il gagne les deux sets suivants sans jamais trembler. Vous avez tenu une balle de match dans la main, et elle a glissé.",
    },
  ],
  breakPoint: [
    {
      title: "BALLE DE BREAK, SET DÉCISIF",
      text: "4-5, il sert pour rester dans le match, et vous voilà avec une balle de break. Le premier qui craque perd le tournoi.",
      options: [
        { id: "return", label: "Retour agressif dans les pieds", hint: "Prendre l'initiative", base: 0.50, repWin: 4 },
        { id: "block", label: "Remettre haut et long, provoquer la faute", hint: "Patient", base: 0.55, repWin: 3 },
        { id: "chip", label: "Slicer court et monter au filet", hint: "Surprise", base: 0.42, repWin: 7, repFail: -2 },
      ],
      winText: "Break. Vous servez ensuite pour le match et vous ne lâchez plus un point.",
      failText: "Il sert une première balle à 210 km/h sur la ligne. Il n'y avait rien à faire, et pourtant vous y repenserez.",
    },
  ],
  tiebreak: [
    {
      title: "JEU DÉCISIF",
      text: "Six points partout dans le jeu décisif du dernier set. Deux heures quarante de jeu, et tout se joue maintenant, à deux points près.",
      options: [
        { id: "first", label: "Tout miser sur la première balle", hint: "Puissance", base: 0.50, repWin: 4, serBias: true },
        { id: "rally", label: "Construire chaque point, sans précipitation", hint: "Solide", base: 0.53, repWin: 4 },
        { id: "spin", label: "Varier les effets, casser tous les rythmes", hint: "Malin", base: 0.47, repWin: 6, traitWin: "tactic" },
      ],
      winText: "Deux points d'affilée, et le match bascule. Vous levez le poing vers votre box sans crier.",
      failText: "Deux fautes directes au pire moment. Le jeu décisif, c'est une loterie qu'on perd toujours pour la même raison.",
    },
  ],
  matchPoint: [
    {
      title: "BALLE DE MATCH À SAUVER",
      text: "Il sert pour le match, à 6-5, 40-30. Vous êtes à un point de sortir du tournoi, et vous n'avez plus rien à perdre.",
      options: [
        { id: "safe", label: "Remettre la balle, encore et encore", hint: "Sûr", base: 0.62, repWin: 3 },
        { id: "gamble", label: "Prendre le retour très tôt, quitte à finir en deux coups", hint: "Va-tout", base: 0.42, repWin: 9, repFail: -2, flagWin: "saved_mp" },
        { id: "net", label: "Retourner et monter immédiatement", hint: "Culotté", base: 0.38, repWin: 11, repFail: -3, flagWin: "saved_mp", traitWin: "clutch" },
      ],
      winText: "Sauvée. Et la suivante aussi. Vous renversez le match, et ce genre de match-là change une saison.",
      failText: "La balle finit dans le filet. Vous ramassez vos affaires en essayant de ne pas regarder les tribunes.",
    },
  ],
  medical: [
    {
      title: "TEMPS MORT MÉDICAL",
      text: "Une douleur aiguë à la cuisse au milieu du deuxième set. Le kiné du tournoi vous regarde et attend. Vous menez d'un set.",
      options: [
        { id: "retire", label: "Abandonner immédiatement", hint: "Raisonnable", base: 0.90, safe: true, injLess: 6 },
        { id: "strap", label: "Se faire strapper et continuer", hint: "Compromis", base: 0.55, injMore: 4 },
        { id: "push", label: "Refuser le soin et jouer jusqu'au bout", hint: "Inconscient", base: 0.34, repWin: 6, repFail: -1, injMore: 10, traitWin: "ironman" },
      ],
      winText: "Vous terminez le match, et le lendemain les examens sont rassurants. Vous l'avez échappé belle.",
      failText: "La cuisse lâche complètement trois jeux plus tard. Vous quittez le court en boitant, sous les applaudissements.",
    },
  ],
  rivalFirst: [
    {
      title: "LE DUEL",
      text: "Lui en face, pour la première fois sur un grand court. Tout le monde attend ce match depuis deux ans. Ce qui va se passer aujourd'hui décidera de qui, entre vous deux, aura peur de l'autre pendant dix ans.",
      options: [
        { id: "impose", label: "Imposer votre jeu d'entrée, sans le regarder", hint: "Affirmer", base: 0.48, repWin: 8, rivalWin: 2 },
        { id: "read", label: "Le lire pendant un set, puis frapper", hint: "Tacticien", base: 0.52, repWin: 6, rivalWin: 1, traitWin: "tactic" },
        { id: "war", label: "En faire une guerre d'usure de quatre heures", hint: "Épuisant", base: 0.50, repWin: 7, rivalWin: 1, phyBias: true, fatigue: 10 },
      ],
      winText: "Vous gagnez, et vous le savez tous les deux : dans ce duel-là, c'est vous qui avez posé le premier jalon.",
      failText: "Il gagne, sans forcer, et vous serre la main en vous regardant à peine. Ce regard-là, vous vous en souviendrez.",
    },
  ],
  comeback: [
    {
      title: "LE CHEMIN DU RETOUR",
      text: "L'opération est passée. Sur la table de rééducation, chaque matin ressemble au précédent, et le circuit continue sans vous. Comment revenez-vous ?",
      options: [
        { id: "cautious", label: "Rééducation prudente, respecter chaque étape", hint: "Sûr", base: 0.86, recover: 14, setback: 4 },
        { id: "protocol", label: "Protocole médical de pointe, hors de prix", hint: "Coûteux", base: 0.72, recover: 11, setback: 8, repWin: 2, cost: 0.09 },
        { id: "rush", label: "Revenir au plus vite, coûte que coûte", hint: "Risqué", base: 0.48, recover: 6, setback: 16, repWin: 5, repFail: -3 },
      ],
      winText: "Le retour est réussi. Les appuis répondent, la tête aussi, et le circuit vous retrouve intact.",
      failText: "Rechute. Le corps lâche encore au premier vrai test, et le chemin s'allonge de plusieurs mois.",
    },
  ],
  homeSlam: [
    {
      title: "LA WILDCARD À DOMICILE",
      text: "Le court central de votre pays, plein, un dimanche après-midi. Vous êtes là par invitation, et tout le monde le sait. Le tirage vous a offert une tête de série.",
      options: [
        { id: "crowd", label: "Jouer avec le public, le faire lever à chaque point", hint: "Spectacle", base: 0.44, repWin: 10, repFail: -1, traitWin: "showman" },
        { id: "focus", label: "Oublier les tribunes et jouer un match de tennis", hint: "Concentré", base: 0.52, repWin: 5 },
        { id: "long", label: "Faire durer, user, transformer le court en fournaise", hint: "Endurance", base: 0.47, repWin: 6, phyBias: true, fatigue: 8 },
      ],
      winText: "Le stade entier scande votre nom au moment de la balle de match. Il n'y aura pas beaucoup de journées comme celle-là.",
      failText: "Trois sets, une sortie sous les applaudissements polis, et l'impression tenace d'avoir gâché quelque chose d'unique.",
    },
  ],
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { EVENTS, MICRO_EVENTS, KEY_MOMENTS };
}
