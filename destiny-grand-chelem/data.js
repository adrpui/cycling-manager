/* ============================================================
   DESTINY GRAND CHELEM — Tables de constantes
   Contenu pur, zéro logique. Chargé avant engine.js.
   Toutes les valeurs sont des points de départ d'équilibrage,
   à valider par simulation de masse (tools/simulate.js).
   ============================================================ */

const BRAND = {
  game: "DESTINY GRAND CHELEM",
  tagline: "Écrivez votre légende du tennis",
};

/* ---------- Circuits (D2) ------------------------------------------------ */
const CIRCUITS = [
  {
    id: "atp", name: "Circuit masculin", icon: "♂",
    desc: "Le service domine, et les Majeurs se jouent en trois sets gagnants : le physique y pèse double.",
    w: { ser: 0.24, fdc: 0.22, ret: 0.20, dep: 0.14, phy: 0.10, men: 0.10 },
    slamBo5: true, ageShift: 0,
  },
  {
    id: "wta", name: "Circuit féminin", icon: "♀",
    desc: "Le fond de court et le retour priment, tous les matchs en deux sets gagnants, une carrière un an plus précoce.",
    w: { ser: 0.19, fdc: 0.25, ret: 0.22, dep: 0.14, phy: 0.10, men: 0.10 },
    slamBo5: false, ageShift: -1,
  },
];

/* ---------- Nations ------------------------------------------------------
   w        : force de la fédération (bourse, wildcards, visibilité)
   homeSlam : id du Majeur national → une wildcard offerte chaque année
   grant    : bourse fédérale annuelle en M€ (versée si rang > 100)          */
const NATIONS = [
  { id: "fr",  name: "France",          flag: "🇫🇷", w: 0.80, homeSlam: "paris",     grant: 0.032 },
  { id: "us",  name: "États-Unis",      flag: "🇺🇸", w: 0.90, homeSlam: "newyork",   grant: 0.030 },
  { id: "au",  name: "Australie",       flag: "🇦🇺", w: 0.70, homeSlam: "australie", grant: 0.028 },
  { id: "gb",  name: "Grande-Bretagne", flag: "🇬🇧", w: 0.75, homeSlam: "londres",   grant: 0.035 },
  { id: "es",  name: "Espagne",         flag: "🇪🇸", w: 0.88, homeSlam: null,        grant: 0.022 },
  { id: "it",  name: "Italie",          flag: "🇮🇹", w: 0.85, homeSlam: null,        grant: 0.026 },
  { id: "de",  name: "Allemagne",       flag: "🇩🇪", w: 0.78, homeSlam: null,        grant: 0.024 },
  { id: "rs",  name: "Serbie",          flag: "🇷🇸", w: 0.55, homeSlam: null,        grant: 0.008 },
  { id: "ru",  name: "Russie",          flag: "🇷🇺", w: 0.72, homeSlam: null,        grant: 0.014 },
  { id: "ar",  name: "Argentine",       flag: "🇦🇷", w: 0.62, homeSlam: null,        grant: 0.009 },
  { id: "br",  name: "Brésil",          flag: "🇧🇷", w: 0.48, homeSlam: null,        grant: 0.008 },
  { id: "ch",  name: "Suisse",          flag: "🇨🇭", w: 0.52, homeSlam: null,        grant: 0.020 },
  { id: "at",  name: "Autriche",        flag: "🇦🇹", w: 0.45, homeSlam: null,        grant: 0.016 },
  { id: "cz",  name: "Tchéquie",        flag: "🇨🇿", w: 0.58, homeSlam: null,        grant: 0.012 },
  { id: "pl",  name: "Pologne",         flag: "🇵🇱", w: 0.50, homeSlam: null,        grant: 0.012 },
  { id: "hr",  name: "Croatie",         flag: "🇭🇷", w: 0.48, homeSlam: null,        grant: 0.007 },
  { id: "gr",  name: "Grèce",           flag: "🇬🇷", w: 0.38, homeSlam: null,        grant: 0.006 },
  { id: "ca",  name: "Canada",          flag: "🇨🇦", w: 0.60, homeSlam: null,        grant: 0.022 },
  { id: "jp",  name: "Japon",           flag: "🇯🇵", w: 0.52, homeSlam: null,        grant: 0.026 },
  { id: "cn",  name: "Chine",           flag: "🇨🇳", w: 0.55, homeSlam: null,        grant: 0.030 },
  { id: "kr",  name: "Corée du Sud",    flag: "🇰🇷", w: 0.32, homeSlam: null,        grant: 0.014 },
  { id: "in",  name: "Inde",            flag: "🇮🇳", w: 0.24, homeSlam: null,        grant: 0.006 },
  { id: "za",  name: "Afrique du Sud",  flag: "🇿🇦", w: 0.26, homeSlam: null,        grant: 0.005 },
  { id: "tn",  name: "Tunisie",         flag: "🇹🇳", w: 0.22, homeSlam: null,        grant: 0.004 },
  { id: "ma",  name: "Maroc",           flag: "🇲🇦", w: 0.22, homeSlam: null,        grant: 0.004 },
  { id: "nl",  name: "Pays-Bas",        flag: "🇳🇱", w: 0.46, homeSlam: null,        grant: 0.018 },
  { id: "be",  name: "Belgique",        flag: "🇧🇪", w: 0.44, homeSlam: null,        grant: 0.014 },
  { id: "no",  name: "Norvège",         flag: "🇳🇴", w: 0.30, homeSlam: null,        grant: 0.016 },
  { id: "dk",  name: "Danemark",        flag: "🇩🇰", w: 0.34, homeSlam: null,        grant: 0.015 },
  { id: "kz",  name: "Kazakhstan",      flag: "🇰🇿", w: 0.34, homeSlam: null,        grant: 0.018 },
  { id: "uy",  name: "Uruguay",         flag: "🇺🇾", w: 0.18, homeSlam: null,        grant: 0.002 },
  { id: "eg",  name: "Égypte",          flag: "🇪🇬", w: 0.16, homeSlam: null,        grant: 0.002 },
];

const NAME_POOLS = {
  fr: { m: ["Lucas","Hugo","Adrien","Théo","Mathis","Enzo","Corentin","Baptiste"], f: ["Chloé","Manon","Léa","Camille","Océane","Clara","Élise","Jade"], last: ["Moreau","Baptiste","Rinderknech","Fils","Cazaux","Halys","Barrère","Muller"] },
  us: { m: ["Tyler","Brandon","Sebastian","Jared","Cole","Marcus","Reilly","Ethan"], f: ["Madison","Peyton","Sloane","Ashley","Taylor","Hailey","Danielle","Brooke"], last: ["Kramer","Whitaker","Doyle","Sanders","Harrow","Blake","Nolan","Reeves"] },
  au: { m: ["Jordan","Blake","Kyle","Rhys","Declan","Lachlan","Cody","Ashton"], f: ["Ellie","Tahlia","Maddison","Georgia","Sienna","Harper","Zoe","Indie"], last: ["Whitlock","Doherty","Marsden","Kirby","Hollis","Brennan","Vaughn","Ashby"] },
  gb: { m: ["Oliver","Harry","Callum","Fraser","Jamie","Toby","Alfie","Rory"], f: ["Emily","Freya","Isla","Sophie","Amelia","Poppy","Niamh","Beatrice"], last: ["Ashworth","Pennington","Hartley","Clive","Wexford","Sinclair","Radcliffe","Ormond"] },
  es: { m: ["Álvaro","Pablo","Jaume","Nicolás","Iker","Diego","Bernabé","Roberto"], f: ["Paula","Nuria","Aliona","Marina","Cristina","Sara","Lucía","Irene"], last: ["Bautista","Carreño","Munar","Davidovich","Zapata","Andújar","Ramos","Taberner"] },
  it: { m: ["Lorenzo","Matteo","Flavio","Luca","Giulio","Stefano","Andrea","Federico"], f: ["Martina","Elisabetta","Sara","Camilla","Giorgia","Lucia","Jasmine","Chiara"], last: ["Sonego","Cobolli","Musetti","Arnaldi","Vavassori","Bellucci","Nardi","Passaro"] },
  de: { m: ["Jan","Maximilian","Yannick","Daniel","Lukas","Tobias","Henri","Marius"], f: ["Laura","Tamara","Anna","Jule","Mona","Katharina","Nele","Lena"], last: ["Struff","Hanfmann","Altmaier","Koepfer","Marterer","Gojowczyk","Otte","Rehberg"] },
  rs: { m: ["Miomir","Laslo","Dušan","Hamad","Nikola","Filip","Stefan","Marko"], f: ["Olga","Nina","Ivana","Aleksandra","Milica","Katarina","Teodora","Anja"], last: ["Kecmanović","Djere","Lajović","Krajinović","Milojević","Sabanov","Vukić","Pavlović"] },
  ru: { m: ["Roman","Pavel","Aslan","Karen","Ilya","Alexander","Timofey","Egor"], f: ["Anastasia","Veronika","Ekaterina","Daria","Polina","Liudmila","Anna","Kamilla"], last: ["Safiullin","Kotov","Karatsev","Rublev","Ivashka","Zhukayev","Skatov","Volkov"] },
  ar: { m: ["Federico","Sebastián","Tomás","Facundo","Francisco","Camilo","Mariano","Juan"], f: ["Nadia","Julia","Lourdes","Solana","Victoria","Paula","Martina","Guillermina"], last: ["Coria","Báez","Etcheverry","Díaz Acosta","Cerúndolo","Ugo Carabelli","Zeballos","Molteni"] },
  br: { m: ["Thiago","João","Gustavo","Felipe","Matheus","Orlando","Rafael","Gilbert"], f: ["Beatriz","Laura","Carolina","Luisa","Ingrid","Gabriela","Thaísa","Rafaela"], last: ["Monteiro","Seyboth","Fonseca","Meligeni","Wild","Luz","Matos","Soares"] },
  ch: { m: ["Dominic","Marc","Alexander","Leandro","Jérôme","Kilian","Rémy","Henry"], f: ["Belinda","Viktorija","Jil","Simona","Céline","Ylena","Lulu","Naïma"], last: ["Stricker","Riedi","Hüsler","Kym","Bellier","Ritschard","Wawrinka","Laaksonen"] },
  at: { m: ["Sebastian","Jurij","Dennis","Lukas","Filip","Alexander","Joel","Neil"], f: ["Julia","Sinja","Melanie","Barbara","Lisa","Tamira","Arabella","Nina"], last: ["Ofner","Rodionov","Novak","Neumayer","Misolic","Erler","Miedler","Weissborn"] },
  cz: { m: ["Jiří","Tomáš","Dalibor","Vít","Zdeněk","Jakub","Michael","Petr"], f: ["Karolína","Markéta","Barbora","Linda","Kateřina","Marie","Tereza","Nikola"], last: ["Lehečka","Macháč","Svrčina","Kopřiva","Kolář","Menšík","Forejtek","Rikl"] },
  pl: { m: ["Hubert","Kamil","Maks","Daniel","Michał","Piotr","Jan","Filip"], f: ["Iga","Magda","Magdalena","Maja","Katarzyna","Weronika","Martyna","Zuzanna"], last: ["Majchrzak","Walkow","Zieliński","Kasprzyk","Matuszewski","Szymanowski","Rosłon","Dembek"] },
  hr: { m: ["Borna","Duje","Nino","Dino","Ivan","Mate","Luka","Antun"], f: ["Donna","Petra","Jana","Antonia","Tara","Iva","Lea","Mia"], last: ["Ćorić","Ajduković","Serdarušić","Prižmić","Poljičak","Dodig","Mektić","Pavić"] },
  gr: { m: ["Stefanos","Petros","Michail","Aristotelis","Dimitris","Ioannis","Nikolaos","Alexandros"], f: ["Maria","Despina","Valentini","Eleni","Sofia","Anastasia","Michaela","Dionysia"], last: ["Pervolarakis","Sakellaridis","Grammatikopoulos","Tsitsipas","Kalovelonis","Bilios","Papamalamis","Stalder"] },
  ca: { m: ["Félix","Gabriel","Alexis","Liam","Benjamin","Justin","Cleeve","Kelsey"], f: ["Leylah","Bianca","Rebecca","Katherine","Carol","Stacey","Marina","Ariana"], last: ["Diallo","Galarneau","Pospisil","Draxl","Bouchard","Sebov","Marino","Fernandez"] },
  jp: { m: ["Yoshihito","Taro","Shintaro","Rio","Kaito","Sho","Yosuke","Takeru"], f: ["Nao","Moyuka","Mai","Himeno","Ena","Kyoka","Sara","Aoi"], last: ["Nishioka","Daniel","Mochizuki","Uchiyama","Shimizu","Watanuki","Sonobe","Kubo"] },
  cn: { m: ["Zhizhen","Yibing","Rigele","Chun","Bu","Fajing","Zhe","Hanyu"], f: ["Qinwen","Xinyu","Lin","Yafan","Xiyu","Shuai","Yue","Meng"], last: ["Zhang","Wu","Shang","Bai","Cui","Sun","Zhou","Han"] },
  kr: { m: ["Soonwoo","Seongchan","Chan","Jeong","Minkyu","Dongju","Hong","Jaehwan"], f: ["Sujeong","Nayoung","Dabin","Hanna","Eunhye","Jiwon","Yeonwoo","Sohee"], last: ["Kwon","Hong","Chung","Park","Lee","Kim","Nam","Jang"] },
  in: { m: ["Sumit","Ramkumar","Yuki","Sasikumar","Digvijay","Arjun","Manas","Karan"], f: ["Ankita","Karman","Rutuja","Sahaja","Prarthana","Riya","Shrivalli","Vaidehi"], last: ["Nagal","Bhambri","Ramanathan","Mukund","Balaji","Kadhe","Gunjan","Sharma"] },
  za: { m: ["Lloyd","Kris","Philip","Ruan","Dean","Alec","Warren","Tiaan"], f: ["Chanel","Lara","Zoë","Madrie","Isabella","Nicole","Delien","Ruan"], last: ["Harris","Anderson","Klaasen","Roelofse","Van der Merwe","Botha","Le Roux","Coetzee"] },
  tn: { m: ["Malek","Aziz","Skander","Moez","Youssef","Anis","Rami","Hamza"], f: ["Ons","Nour","Yasmine","Chiraz","Meriem","Sarra","Dorra","Aya"], last: ["Jaziri","Dougaz","Mansouri","Echargui","Ben Ali","Trabelsi","Ayari","Khalfi"] },
  ma: { m: ["Reda","Yassine","Elliot","Adam","Walid","Amine","Hamza","Ilyas"], f: ["Aya","Lina","Salma","Nada","Ghita","Imane","Rim","Sofia"], last: ["Bennani","Idrissi","El Aynaoui","Bouhouch","Tahiri","Mokhtar","Berrada","Chaouki"] },
  nl: { m: ["Tallon","Botic","Jesper","Gijs","Guy","Sander","Max","Tim"], f: ["Arantxa","Suzan","Indy","Lesley","Eva","Anna","Isabelle","Merel"], last: ["Griekspoor","De Jong","Brouwer","Haarhuis","Koolhof","Middelkoop","Van Rijthoven","Bemelmans"] },
  be: { m: ["Zizou","Raphaël","Joris","Kimmer","Michael","Gauthier","Alexander","Yanaki"], f: ["Elise","Greet","Ysaline","Maryna","Sofia","Lara","Hanne","Magali"], last: ["Bergs","Collignon","De Loore","Coppejans","Geerts","Onclin","Vliegen","Gille"] },
  no: { m: ["Casper","Viktor","Herman","Lukas","Nikolai","Emil","Andreas","Sander"], f: ["Ulrikke","Malene","Astrid","Ida","Sunniva","Emilie","Thea","Nora"], last: ["Durasovic","Hjelmeland","Bjornstad","Ruud","Solberg","Lie","Holm","Aasen"] },
  dk: { m: ["Holger","Elmer","August","Johannes","Christian","Mikkel","Frederik","Aksel"], f: ["Clara","Emma","Johanne","Sofie","Karoline","Maja","Ida","Laura"], last: ["Moller","Holmgren","Rune","Kristensen","Bagger","Lund","Andersen","Ravn"] },
  kz: { m: ["Alexander","Timofey","Beibit","Dmitry","Denis","Amir","Grigoriy","Roman"], f: ["Yulia","Elena","Zhibek","Anna","Gozal","Aruzhan","Zarina","Kamila"], last: ["Bublik","Skatov","Popko","Nedovyesov","Yevseyev","Zhukayev","Khabibulin","Kukushkin"] },
  uy: { m: ["Franco","Martín","Ignacio","Pablo","Rodrigo","Santiago","Diego","Joaquín"], f: ["Camila","Valentina","Lucía","Sofía","Florencia","Guadalupe","Renata","Micaela"], last: ["Roncadelli","Cuevas","Estévez","Ferrari","Rodríguez","Olivera","Bentancur","Vidal"] },
  eg: { m: ["Mohamed","Youssef","Karim","Amr","Seif","Adam","Omar","Mazen"], f: ["Mayar","Sandra","Nour","Farida","Yasmin","Dina","Habiba","Lara"], last: ["Safwat","Shoukry","Abdel","Hossam","Ismail","Farouk","Nassar","Ezz"] },
};

/* ---------- Création (M4) ------------------------------------------------ */
const ORIGINS = [
  { id: "academie", name: "Académie privée", icon: "🏫",
    desc: "Des années de structure, de vidéo et de sparring payant. Tout est en place — sauf la faim.",
    st: { ser: 54, ret: 52, fdc: 56, dep: 52, phy: 54, men: 48 }, cha: 44, rep: 18, pot: 1 },
  { id: "federation", name: "Fédération nationale", icon: "🎽",
    desc: "Repéré à onze ans, formé aux frais du pays. On vous doit des résultats.",
    st: { ser: 52, ret: 55, fdc: 53, dep: 55, phy: 52, men: 50 }, cha: 42, rep: 22, pot: 1 },
  { id: "parents", name: "Parents entraîneurs", icon: "👨‍👩‍👧",
    desc: "Le court d'à côté, tous les soirs, depuis l'âge de cinq ans. Et jamais un dimanche libre.",
    st: { ser: 50, ret: 54, fdc: 55, dep: 54, phy: 48, men: 58 }, cha: 40, rep: 12, pot: 2 },
  { id: "tardif", name: "Autodidacte tardif", icon: "🌾",
    desc: "Un club municipal, un mur, et une gestuelle que tous les puristes détestent.",
    st: { ser: 57, ret: 46, fdc: 51, dep: 46, phy: 60, men: 56 }, cha: 38, rep: 4, pot: -2 },
  { id: "prodige", name: "Prodige repéré à 12 ans", icon: "✨",
    desc: "Une couverture de magazine avant le brevet. Tout le monde attend, déjà.",
    st: { ser: 55, ret: 57, fdc: 58, dep: 57, phy: 50, men: 50 }, cha: 52, rep: 30, pot: 3 },
  { id: "transfuge", name: "Transfuge d'un autre sport", icon: "🔁",
    desc: "Basket, athlétisme, natation — un moteur exceptionnel, une raquette à apprivoiser.",
    st: { ser: 59, ret: 44, fdc: 50, dep: 49, phy: 63, men: 52 }, cha: 48, rep: 8, pot: -1 },
];

const LIFESTYLES = [
  { id: "pro", name: "Hygiène de pro", icon: "🥗",
    desc: "Couché à 22 h, tout pesé, zéro écart. Les autres se moquent, les préparateurs adorent.",
    fx: { dis: 18, form: 6, cha: -4 }, pot: 2 },
  { id: "balance", name: "Équilibré", icon: "⚖️",
    desc: "Sérieux à l'entraînement, normal en dehors. Ni moine, ni fêtard.",
    fx: { dis: 6, mor: 4 }, pot: 0 },
  { id: "street", name: "La belle vie", icon: "🎉",
    desc: "Les amis, les sorties, les réseaux. Le talent fera le reste… non ?",
    fx: { dis: -12, cha: 8, mor: 6, form: -4 }, pot: -1 },
];

const ENTOURAGES = [
  { id: "famille", name: "Famille investie", icon: "👪",
    desc: "Des parents qui gèrent tout : planning, école, budget. Et qui ont un avis sur tout.",
    fx: { dis: 8, men: 4 }, pot: 1, structure: { federation: 6, academie: 2 } },
  { id: "agent", name: "Agent ambitieux", icon: "🦈",
    desc: "Un jeune agent aux dents longues vous a signé à quinze ans. Il promet les sommets — et prend sa part.",
    fx: { rep: 6, dis: -4 }, structure: { academie: 10, federation: 2 }, flag: "agent_requin" },
  { id: "club", name: "Le club local", icon: "🤙",
    desc: "Le président du club, le vieux prof, les copains du tournoi d'été. Fidèles, bruyants, dépassés.",
    fx: { cha: 6, mor: 8, dis: -8 }, structure: { local: 10, academie: -6 } },
];

const HANDS = [
  { id: "right", name: "Droitier", icon: "🤚", w: 88, desc: "Le cas général.", fx: {} },
  { id: "left", name: "Gaucher", icon: "🫲", w: 12, desc: "Une gêne permanente pour l'adversaire : +3 % dans les moments décisifs, et un service naturellement plus vicieux.", fx: { ser: 2 }, clutch: 0.03 },
];

const BACKHANDS = [
  { id: "two", name: "Revers à deux mains", icon: "✌️", w: 74, desc: "Solide, moderne, sans défaut. +3 en retour.", fx: { ret: 3 }, aff: {} },
  { id: "one", name: "Revers à une main", icon: "☝️", w: 26, desc: "Le geste que le public vient voir. Rayonne sur gazon et sur terre, souffre sur dur, et se vend cher.", fx: { cha: 4 }, aff: { grass: 1, clay: 1, hard: -2 } },
];

const BUILDS = [
  { id: "tall", name: "Grand gabarit", icon: "🗼", w: 30, desc: "Un service qui tombe du ciel, des jambes qui suivent mal.", fx: { ser: 4, dep: -4 }, injAdd: 0.02 },
  { id: "mid", name: "Gabarit moyen", icon: "🧍", w: 44, desc: "Aucun extrême, aucune faiblesse.", fx: {}, injAdd: 0 },
  { id: "small", name: "Petit gabarit", icon: "🐜", w: 26, desc: "Partout sur le court, mais il faut construire chaque point.", fx: { dep: 4, ser: -4, phy: 2 }, injAdd: 0 },
];

/* ---------- Surfaces (M2) ------------------------------------------------ */
const SURFACES = [
  { id: "hard",  name: "Dur",          short: "Dur",   icon: "🟦" },
  { id: "clay",  name: "Terre battue", short: "Terre", icon: "🟧" },
  { id: "grass", name: "Gazon",        short: "Gazon", icon: "🟩" },
];

const SURFACE_PROFILES = [
  { id: "terrien",   name: "Terrien",           w: 16, aff: { hard: -1, clay:  7, grass: -6 },
    desc: "Huit fois le même Majeur, et jamais le Chelem." },
  { id: "rapide",    name: "Surfaces rapides",  w: 14, aff: { hard:  2, clay: -8, grass:  6 },
    desc: "Deux Majeurs accessibles, une saison courte et intense." },
  { id: "durpur",    name: "Dur pur",           w: 20, aff: { hard:  5, clay: -2, grass: -3 },
    desc: "Deux Majeurs sur dur, et tous les grands tournois d'Amérique et d'Asie." },
  { id: "terredur",  name: "Terre-Dur",         w: 18, aff: { hard:  1, clay:  4, grass: -5 },
    desc: "Le profil européen classique, régulier sur trois Majeurs." },
  { id: "polyvalent",name: "Polyvalent",        w: 26, aff: { hard:  3, clay: -1, grass: -2 },
    desc: "Jamais favori, toujours dangereux. Le seul profil qui rend le Chelem en carrière atteignable." },
  { id: "atypique",  name: "Atypique",          w:  6, aff: { hard: -6, clay:  2, grass:  4 },
    desc: "Brille deux mois par an, invisible le reste du temps." },
];

// Biais de tirage du profil selon l'origine et la nationalité
const PROFILE_BIAS = {
  origin: {
    tardif:    { terrien: 1.3, durpur: 1.1, polyvalent: 0.7 },
    transfuge: { rapide: 1.6, durpur: 1.3, terrien: 0.5 },
    prodige:   { polyvalent: 1.5 },
    parents:   { terredur: 1.3, terrien: 1.2 },
  },
  nat: {
    es: { terrien: 2.2, terredur: 1.5, rapide: 0.4 },
    ar: { terrien: 2.4, terredur: 1.4, rapide: 0.3 },
    br: { terrien: 2.0, terredur: 1.3, rapide: 0.4 },
    it: { terrien: 1.5, terredur: 1.4 },
    us: { durpur: 1.8, rapide: 1.4, terrien: 0.5 },
    au: { rapide: 1.7, durpur: 1.5, terrien: 0.5 },
    gb: { rapide: 1.8, durpur: 1.2, terrien: 0.6 },
    cz: { rapide: 1.3, durpur: 1.2 },
    hr: { rapide: 1.6, durpur: 1.2 },
    fr: { polyvalent: 1.3, terredur: 1.2 },
    kz: { rapide: 1.4 },
  },
};

/* ---------- Trajectoires (M3) -------------------------------------------- */
const TRAJECTORIES = [
  { id: "normal",   w: 26, label: "Progression classique", desc: "Une montée en puissance régulière, sans à-coups." },
  { id: "steady",   w: 13, label: "Lente mais sûre",       desc: "Moins de fulgurances, une deuxième partie de carrière plus longue." },
  { id: "chaotic",  w: 12, label: "Montagnes russes",      desc: "Des saisons stratosphériques, d'autres à oublier." },
  { id: "late",     w: 12, label: "Révélation tardive",    desc: "Le top 10 arrive quand plus personne n'y croyait." },
  { id: "early",    w: 11, label: "Explosion précoce",     desc: "Une finale de Majeur à dix-neuf ans, et la suite à écrire." },
  { id: "unstable", w:  9, label: "Diamant instable",      desc: "Un potentiel immense, un équilibre fragile." },
  { id: "surge",    w:  9, label: "Déclic fulgurant",      desc: "Banal des années, puis une explosion soudaine." },
  { id: "flash",    w:  8, label: "Météore",               desc: "Numéro quatre mondial à vingt ans… puis le plafond, d'un coup." },
];

/* ---------- Traits (M18) ------------------------------------------------- */
const TRAITS = {
  clutch:  { name: "Sang-froid",     icon: "🧊", desc: "Les grands points ne vous font pas trembler." },
  tactic:  { name: "Tacticien",      icon: "🧠", desc: "Vous lisez un adversaire en deux jeux, et une surface en un set." },
  arm:     { name: "Bras en or",     icon: "🎾", desc: "Un service qui ne vieillit pas." },
  ironman: { name: "Increvable",     icon: "🦾", desc: "Un corps qui encaisse tout." },
  glass:   { name: "Corps de verre", icon: "🩼", desc: "Votre corps vous lâche trop souvent." },
  showman: { name: "Showman",        icon: "🎭", desc: "Le public vient pour vous, les marques aussi." },
  merc:    { name: "Mercenaire",     icon: "🪙", desc: "L'argent d'abord, la légende ensuite." },
  hothead: { name: "Tête brûlée",    icon: "🔥", desc: "Génial et ingérable, parfois dans le même jeu." },
  genius:  { name: "Génie précoce",  icon: "✨", desc: "Un talent qui saute aux yeux, et qui apprend deux fois plus vite." },
  zen:     { name: "Zen",            icon: "🧘", desc: "Imperturbable, quoi qu'il arrive." },
};

/* ---------- Tournois (M6) ------------------------------------------------
   fieldW    : force du plateau
   cut       : rang maximum pour entrer au tableau principal
   stages    : nombre de paliers (index 0 = éliminé au 1er tour)             */
const TIERS = {
  slam:      { id: "slam",      name: "Majeur",           short: "MAJ", fieldW: 86, cut: 104, stages: 8, icon: "🏆" },
  finals:    { id: "finals",    name: "Finale de circuit",short: "FIN", fieldW: 90, cut: 8,   stages: 5, icon: "👑" },
  m1000:     { id: "m1000",     name: "Masters 1000",     short: "M1000",fieldW: 84, cut: 56,  stages: 8, icon: "🥇" },
  t500:      { id: "t500",      name: "Tournoi 500",      short: "500", fieldW: 80, cut: 32,  stages: 6, icon: "🥈" },
  t250:      { id: "t250",      name: "Tournoi 250",      short: "250", fieldW: 76, cut: 24,  stages: 6, icon: "🥉" },
  challenger:{ id: "challenger",name: "Challenger",       short: "CH",  fieldW: 69, cut: 300, stages: 6, icon: "◻️" },
  futures:   { id: "futures",   name: "Futures",          short: "FU",  fieldW: 59, cut: 800, stages: 6, icon: "▫️" },
};

// Poids de base par palier, pour un joueur exactement au niveau du plateau
const STAGE_WEIGHTS = {
  8: [32, 25, 18, 12, 7, 4, 1.6, 0.4],
  6: [42, 27, 16, 9, 4, 2],
  5: [40, 28, 18, 9, 5], // Finale de circuit : poules → demie → finale → titre
};

const STAGE_LABELS = {
  8: ["1er tour", "2e tour", "3e tour", "8e de finale", "Quart de finale", "Demi-finale", "Finaliste", "VAINQUEUR"],
  6: ["1er tour", "2e tour", "Quart de finale", "Demi-finale", "Finaliste", "VAINQUEUR"],
  5: ["Phase de poules", "Poules (2 victoires)", "Demi-finale", "Finaliste", "VAINQUEUR"],
};

const POINTS = {
  slam:       [10, 50, 100, 200, 400, 800, 1300, 2000],
  m1000:      [10, 35, 65, 110, 200, 400, 650, 1000],
  finals:     [200, 400, 600, 1000, 1500],
  t500:       [0, 25, 50, 100, 300, 500],
  t250:       [0, 13, 25, 50, 150, 250],
  challenger: [0, 6, 12, 25, 50, 100],
  futures:    [0, 1, 2, 4, 10, 20],
};

// Gains en M€ par palier atteint
const PRIZE = {
  slam:       [0.060, 0.090, 0.130, 0.220, 0.400, 0.700, 1.400, 2.800],
  m1000:      [0.020, 0.030, 0.050, 0.090, 0.160, 0.300, 0.550, 1.000],
  finals:     [0.300, 0.700, 1.200, 2.200, 4.500],
  t500:       [0.011, 0.018, 0.065, 0.120, 0.220, 0.420],
  t250:       [0.004, 0.006, 0.018, 0.032, 0.060, 0.110],
  challenger: [0.001, 0.002, 0.005, 0.008, 0.013, 0.022],
  futures:    [0.0002, 0.0004, 0.0008, 0.0014, 0.0024, 0.0040],
};

/* Calendrier fixe : les tournois nommés du circuit.
   week sert uniquement à l'ordre d'affichage et au bloc de saison.          */
const CALENDAR = [
  { id: "australie", name: "le Majeur d'Australie", tier: "slam",  surface: "hard",  week: 3,  block: "au" },
  { id: "dubai",     name: "Dubaï",                 tier: "t500",  surface: "hard",  week: 8,  block: "au" },
  { id: "indian",    name: "Indian Wells",          tier: "m1000", surface: "hard",  week: 11, block: "us1" },
  { id: "miami",     name: "Miami",                 tier: "m1000", surface: "hard",  week: 13, block: "us1" },
  { id: "monaco",    name: "Monte-Carlo",           tier: "m1000", surface: "clay",  week: 16, block: "clay" },
  { id: "barcelone", name: "Barcelone",             tier: "t500",  surface: "clay",  week: 17, block: "clay" },
  { id: "madrid",    name: "Madrid",                tier: "m1000", surface: "clay",  week: 19, block: "clay" },
  { id: "rome",      name: "Rome",                  tier: "m1000", surface: "clay",  week: 20, block: "clay" },
  { id: "paris",     name: "le Majeur de Paris",    tier: "slam",  surface: "clay",  week: 22, block: "clay" },
  { id: "halle",     name: "Halle",                 tier: "t500",  surface: "grass", week: 25, block: "grass" },
  { id: "queens",    name: "le Queen's",            tier: "t500",  surface: "grass", week: 25, block: "grass" },
  { id: "londres",   name: "le Majeur de Londres",  tier: "slam",  surface: "grass", week: 27, block: "grass" },
  { id: "hambourg",  name: "Hambourg",              tier: "t500",  surface: "clay",  week: 30, block: "sum" },
  { id: "toronto",   name: "Toronto",               tier: "m1000", surface: "hard",  week: 32, block: "us2" },
  { id: "cincy",     name: "Cincinnati",            tier: "m1000", surface: "hard",  week: 33, block: "us2" },
  { id: "newyork",   name: "le Majeur de New York", tier: "slam",  surface: "hard",  week: 35, block: "us2" },
  { id: "pekin",     name: "Pékin",                 tier: "t500",  surface: "hard",  week: 40, block: "asia" },
  { id: "shanghai",  name: "Shanghai",              tier: "m1000", surface: "hard",  week: 41, block: "asia" },
  { id: "vienne",    name: "Vienne",                tier: "t500",  surface: "hard",  week: 43, block: "indoor" },
  { id: "bercy",     name: "Paris-Bercy",           tier: "m1000", surface: "hard",  week: 44, block: "indoor" },
  { id: "finals",    name: "la Finale de circuit",  tier: "finals",surface: "hard",  week: 46, block: "indoor" },
];

// Tournois génériques utilisés pour compléter un calendrier
const FILLER = [
  { tier: "t250",       surfaces: ["hard", "clay", "grass"], names: ["Doha","Marseille","Buenos Aires","Santiago","Munich","Estoril","Genève","Stuttgart","Newport","Gstaad","Kitzbühel","Winston-Salem","Chengdu","Tokyo","Stockholm","Metz","Anvers","Bâle","Adélaïde","Auckland","Montpellier","Rio","Acapulco","Delray Beach"] },
  { tier: "challenger", surfaces: ["hard", "clay", "grass"], names: ["Bratislava","Perugia","Séville","Charleston","Braunschweig","Cordenons","Todi","Segovia","Trnava","Cassis","Roanne","Ismaning","Poznań","Iași","Villena","Manama","Nonthaburi","Guangzhou","Cary","Tiburon","Playford","Bendigo","Oeiras","Girona"] },
  { tier: "futures",    surfaces: ["hard", "clay"],          names: ["Antalya","Monastir","Sharm el-Sheikh","Heraklion","Villa María","Tabarka","Pazardzhik","Bakio","Vale do Lobo","Nakhon Pathom","Naiharn","Pirot","Kigali","Tucumán"] },
];

/* ---------- Classement (M7) ---------------------------------------------- */
const RANK_TABLE = [
  [8500, 1], [6800, 2], [5700, 3], [4900, 5], [3900, 8], [3200, 12],
  [2500, 20], [1900, 32], [1450, 50], [1200, 75], [1050, 100], [700, 150],
  [460, 220], [300, 320], [165, 480], [85, 700], [35, 1000], [12, 1400], [0, 1800],
];

/* ---------- Mode d'entrée (M8) ------------------------------------------- */
const ENTRIES = [
  { id: "protected", label: "Tête de série protégée", icon: "👑", d: 2,  desc: "Aucun top 10 avant les quarts." },
  { id: "seed",      label: "Tête de série",          icon: "⭐", d: 1,  desc: "Aucune autre tête de série avant le 3e tour." },
  { id: "main",      label: "Tableau principal",      icon: "🔄", d: 0,  desc: "Tirage neutre." },
  { id: "wildcard",  label: "Wildcard",               icon: "🎟️", d: -1, desc: "Entrée offerte, mais têtes de série dès le premier tour." },
  { id: "quali",     label: "Qualifications",         icon: "🪜", d: -1, desc: "Trois matchs à gagner avant le tableau." },
];

/* ---------- Programme (M9) ----------------------------------------------- */
const VOLUMES = [
  { id: "light",   name: "Léger",   n: 16, fatigue: -9, inj: -0.02, growth: 1.10, desc: "On protège un corps et on cible les Majeurs." },
  { id: "normal",  name: "Normal",  n: 22, fatigue: 0,  inj: 0,     growth: 1.00, desc: "Le rythme de référence du circuit." },
  { id: "heavy",   name: "Chargé",  n: 28, fatigue: 13, inj: 0.03,  growth: 0.92, desc: "On construit un classement, ou on renfloue la trésorerie." },
  { id: "extreme", name: "Extrême", n: 32, fatigue: 22, inj: 0.06,  growth: 0.85, desc: "Survie financière, ou course désespérée au top 100." },
];

/* ---------- L'équipe (M16) ----------------------------------------------- */
const TEAM_ROLES = [
  { id: "coach",   name: "Entraîneur",   icon: "🎯",
    levels: [
      { name: "Aucun",       cost: 0,     growth: 0.86, desc: "Vous vous entraînez seul, avec des vidéos." },
      { name: "Débutant",    cost: 0.020, growth: 0.95, desc: "Un ancien joueur de Challenger, motivé." },
      { name: "Confirmé",    cost: 0.120, growth: 1.05, desc: "Un technicien reconnu du circuit." },
      { name: "Réputé",      cost: 0.450, growth: 1.18, desc: "Un ancien vainqueur de Majeur. Il ne travaille pas avec n'importe qui." },
    ] },
  { id: "fitness", name: "Préparateur",  icon: "💪",
    levels: [
      { name: "Aucun",       cost: 0,     phy: 0, fatigue: 0,   desc: "Vous courez le matin, quand vous y pensez." },
      { name: "Débutant",    cost: 0.015, phy: 0, fatigue: -4,  desc: "Un préparateur partagé avec trois autres joueurs." },
      { name: "Confirmé",    cost: 0.080, phy: 1, fatigue: -8,  desc: "Un vrai suivi, un vrai calendrier de charge." },
      { name: "Réputé",      cost: 0.250, phy: 2, fatigue: -12, desc: "Le meilleur du circuit, exclusif, hors de prix." },
    ] },
  { id: "physio",  name: "Kinésithérapeute", icon: "🩺",
    levels: [
      { name: "Aucun",       cost: 0,     inj: 0.02,  heal: 1.15, desc: "Vous vous soignez sur le tas." },
      { name: "Débutant",    cost: 0.010, inj: 0,     heal: 1.00, desc: "Un kiné disponible sur les gros tournois." },
      { name: "Confirmé",    cost: 0.060, inj: -0.02, heal: 0.85, desc: "Présent partout, avec vous dans l'avion." },
      { name: "Réputé",      cost: 0.200, inj: -0.045,heal: 0.70, desc: "Une équipe médicale complète autour de votre corps." },
    ] },
  { id: "agent",   name: "Agent",        icon: "💼",
    levels: [
      { name: "Aucun",       pct: 0,    spon: 0.45, wc: 0, desc: "Vous négociez vous-même. Mal." },
      { name: "Débutant",    pct: 0.08, spon: 0.80, wc: 0, desc: "Un agent qui débute, comme vous." },
      { name: "Confirmé",    pct: 0.12, spon: 1.00, wc: 1, desc: "Une agence sérieuse, un carnet d'adresses." },
      { name: "Réputé",      pct: 0.18, spon: 1.35, wc: 1, desc: "La plus grosse agence du circuit. Elle prend cher, elle ouvre tout." },
    ] },
];

const SPONSOR_CAP = [
  { rank: 10, cap: 3.50 }, { rank: 30, cap: 1.20 }, { rank: 60, cap: 0.35 },
  { rank: 100, cap: 0.12 }, { rank: 250, cap: 0.02 }, { rank: 9999, cap: 0 },
];

/* ---------- Génération et rivaux (M12) ----------------------------------- */
const GENERATIONS = [
  { id: "golden", w: 12, name: "Âge d'or",  rivals: 3, pot: [88, 94],
    desc: "Trois monstres se partagent tout. Gagner un Majeur relève de l'exploit." },
  { id: "strong", w: 22, name: "Forte",     rivals: 2, pot: [84, 88],
    desc: "Il faut être excellent pour soulever un trophée." },
  { id: "normal", w: 34, name: "Normale",   rivals: 2, pot: [80, 85],
    desc: "La référence : un ou deux patrons, et de la place derrière." },
  { id: "open",   w: 22, name: "Ouverte",   rivals: 2, pot: [77, 82],
    desc: "Les titres circulent, sept vainqueurs différents en huit Majeurs." },
  { id: "weak",   w: 10, name: "Creuse",    rivals: 1, pot: [74, 79],
    desc: "Un joueur simplement très bon peut accumuler un palmarès démesuré." },
];

/* ---------- Distinctions (M17) ------------------------------------------- */
const AWARDS = {
  yearEndNo1:  { name: "Numéro 1 mondial en fin d'année", icon: "👑", pts: 0,   fx: { rep: 10, mor: 6 } },
  slam:        { name: "Titre en Majeur",                 icon: "🏆", pts: 3.0, fx: { rep: 9, mor: 5, money: 0.5 } },
  finals:      { name: "Finale de circuit",               icon: "🎖️", pts: 2.0, fx: { rep: 7, mor: 4 } },
  olympic:     { name: "Médaille d'or olympique",         icon: "🥇", pts: 1.5, fx: { rep: 7, mor: 6 } },
  m1000:       { name: "Titre en Masters 1000",           icon: "🥇", pts: 1.2, fx: { rep: 5, mor: 3 } },
  slamFinal:   { name: "Finale de Majeur",                icon: "🥈", pts: 1.0, fx: { rep: 5, mor: 2 } },
  nations:     { name: "Coupe des Nations",               icon: "🛡️", pts: 0.8, fx: { rep: 4, mor: 5 } },
  t500:        { name: "Titre en Tournoi 500",            icon: "🏵️", pts: 0.5, fx: { rep: 3 } },
  comeback:    { name: "Retour de l'année",               icon: "🔄", pts: 0.4, fx: { rep: 5, mor: 6 } },
  mostImproved:{ name: "Progression de l'année",          icon: "📈", pts: 0.4, fx: { rep: 4, mor: 4 } },
  t250:        { name: "Titre en Tournoi 250",            icon: "🎗️", pts: 0.25,fx: { rep: 2 } },
};

/* ---------- Équilibrage global ------------------------------------------- */
const BALANCE = {
  startYear: 2026,
  ageStart: 15,
  ageMax: 41,
  proAgeMin: 16,

  potBase: 72, potMin: 68, potMax: 97,
  prodigyBase: 0.012,
  prodigyOrigin: { prodige: 0.020, academie: 0.006, federation: 0.008, parents: 0.011, tardif: 0, transfuge: 0.004 },
  prodigyLifestyle: { pro: 0.011, balance: 0.003, street: -0.004 },
  prodigyEntourage: { agent: 0.011, famille: 0.007, club: -0.002 },
  prodigyCap: 0.05,
  prodigyPot: [90, 97],

  boostK: 0.070,
  boostMin: 0.30,
  boostMax: 3.2,
  qualiRounds: 3,

  formTarget: 65, moralTarget: 60, moralTargetZen: 70,
  fatiguePerExtra: 2.2, fatigueLongMatch: 1.5,

  injBase: 0.11, injPerTournament: 0.004, injFatigue: 0.05, injFatigueThr: 75,
  injAgeStep: 0.007, injAgeFrom: 28, injYouth: -0.03, injYouthTo: 20,
  injDiscipline: 0.05, injChronic: 0.03,
  injMin: 0.03, injMax: 0.50,
  injTiers: [
    { id: "gene",    w: 50,  min: 1,  max: 3,  mor: 2,  form: 3,  big: false },
    { id: "muscle",  w: 28,  min: 4,  max: 9,  mor: 4,  form: 6,  big: false },
    { id: "serious", w: 15,  min: 10, max: 22, mor: 8,  form: 10, big: true, chronic: true, interactive: true },
    { id: "surgery", w: 6,   min: 26, max: 44, mor: 13, form: 14, big: true, chronic: true, interactive: true, protected: true, endChance: 0.05 },
    { id: "career",  w: 1,   min: 48, max: 70, mor: 17, form: 18, big: true, chronic: true, interactive: true, protected: true, endChance: 0.15 },
  ],
  injLabels: { gene: "Gêne", muscle: "Blessure musculaire", serious: "Blessure sérieuse", surgery: "Opération", career: "Blessure très grave" },
  injZones: ["poignet", "dos", "épaule", "genou", "hanche"],
  severityAge: 0.05, severityChronic: 0.09, severityGlass: 0.20,
  protectedWeeks: 26, protectedUses: 8,
  growthDamp: 46,

  travelCost: 0.0028,
  travelCostSmall: 0.0012,   // Futures et Challenger : circuit de proximité
  deepDebt: -0.05,           // seuil de découvert réellement douloureux
  taxRate: 0.30,
  bankruptcyFloor: -0.20,

  retireFloor: 30, retirePivot: 31,
  earlyEndChance: 0.008,
  burnoutTournaments: 26, burnoutMoral: 40,

  microChance: 0.62,
  rivalDrawChance: { slam: 0.68, m1000: 0.52, finals: 0.90, t500: 0.26, t250: 0.14, challenger: 0.05, futures: 0 },
};

/* ---------- Rangs de fin de carrière (M19) ------------------------------- */
const CAREER_TIERS = [
  { min: 400, title: "Légende absolue du tennis",
    story: "Votre nom ne se discute pas : il ouvre les listes. On ne compare plus, on cite." },
  { min: 280, title: "Grand champion",
    story: "Une décennie au sommet, des trophées qui ne tiennent plus dans une vitrine, et une génération entière qui a grandi en vous regardant." },
  { min: 215, title: "Membre du gratin mondial",
    story: "Des années dans les tout meilleurs, des rendez-vous manqués de peu, et le respect entier du circuit." },
  { min: 140, title: "Joueur de top 20 accompli",
    story: "Une belle carrière, solide et régulière, avec quelques semaines où le monde entier a retenu votre nom." },
  { min: 100, title: "Carrière honnête sur le circuit principal",
    story: "Des années entières sur le grand circuit, quelques exploits, et une vie de tennis qui valait la peine." },
  { min: 70, title: "Une vie de circuit secondaire",
    story: "Des milliers de kilomètres, des salles vides, des victoires que personne n'a vues. Et le plaisir intact." },
  { min: -999, title: "N'a jamais percé",
    story: "Le talent était peut-être là. Le corps, l'argent, la chance ou le moment ne l'étaient pas." },
];

/* ---------- Badges (M21) ------------------------------------------------- */
const BADGE_CATS = [
  { id: "precocite", name: "Précocité", icon: "🐣" },
  { id: "majeurs", name: "Majeurs", icon: "🏆" },
  { id: "surface", name: "Surfaces", icon: "🟧" },
  { id: "classement", name: "Classement", icon: "📊" },
  { id: "perf", name: "Performances", icon: "⚡" },
  { id: "rivalite", name: "Rivalité", icon: "⚔️" },
  { id: "parcours", name: "Parcours", icon: "🧭" },
  { id: "secret", name: "Secrets", icon: "❓" },
  { id: "graal", name: "Le Graal", icon: "💎" },
];

const BADGES = [
  { id: "slam_21", cat: "precocite", icon: "🚀", name: "Prodige", desc: "Gagner un Majeur avant 21 ans." },
  { id: "top10_20", cat: "precocite", icon: "🐤", name: "Précoce", desc: "Entrer dans le top 10 avant 20 ans." },
  { id: "no1_22", cat: "precocite", icon: "✨", name: "Élu", desc: "Devenir numéro 1 mondial avant 22 ans." },
  { id: "junior_pro", cat: "precocite", icon: "🌱", name: "Graine de crack", desc: "Gagner un titre junior puis un titre pro dans la même saison." },

  { id: "slam_1", cat: "majeurs", icon: "🏆", name: "Le premier", desc: "Remporter un Majeur." },
  { id: "slam_5", cat: "majeurs", icon: "🏅", name: "Cinq fois", desc: "Remporter 5 Majeurs." },
  { id: "slam_10", cat: "majeurs", icon: "👑", name: "Octuple", desc: "Remporter 8 Majeurs." },
  { id: "career_slam", cat: "majeurs", icon: "🌍", name: "Chelem en carrière", desc: "Remporter les quatre Majeurs au cours de votre carrière." },
  { id: "calendar_slam", cat: "majeurs", icon: "📅", name: "Chelem calendaire", secret: true, desc: "Remporter les quatre Majeurs la même saison." },
  { id: "golden_slam", cat: "majeurs", icon: "🥇", name: "Chelem d'Or", secret: true, desc: "Chelem en carrière plus la médaille d'or olympique." },
  { id: "slam_finals4", cat: "majeurs", icon: "🎯", name: "Partout finaliste", desc: "Atteindre au moins la finale des quatre Majeurs." },

  { id: "same_slam_5", cat: "surface", icon: "🔁", name: "Le roi d'un royaume", desc: "Remporter 4 fois le même Majeur." },
  { id: "three_surfaces", cat: "surface", icon: "🌈", name: "Toutes surfaces", desc: "Gagner un titre sur les trois surfaces la même saison." },
  { id: "pure_clay", cat: "surface", icon: "🟧", name: "Le terrien absolu", desc: "Gagner au moins 3 Majeurs sans jamais gagner un titre hors terre battue." },

  { id: "no1", cat: "classement", icon: "🥇", name: "Numéro 1 mondial", desc: "Atteindre la première place mondiale." },
  { id: "weeks_100", cat: "classement", icon: "📆", name: "Cent semaines", desc: "Cumuler 100 semaines au rang 1." },
  { id: "weeks_300", cat: "classement", icon: "🗓️", name: "Deux cent cinquante semaines", desc: "Cumuler 250 semaines au rang 1." },
  { id: "yearend_3", cat: "classement", icon: "🎆", name: "Trois fois patron", desc: "Finir trois saisons au rang 1 mondial." },
  { id: "all_m1000", cat: "classement", icon: "🧩", name: "Collection complète", desc: "Remporter les neuf Masters 1000 au moins une fois." },

  { id: "wins_900", cat: "perf", icon: "💪", name: "Sept cent cinquante", desc: "Gagner 750 matchs professionnels." },
  { id: "season_90", cat: "perf", icon: "🔥", name: "Saison de feu", desc: "Terminer une saison à 90 % de victoires (30 matchs minimum)." },
  { id: "five_setters", cat: "perf", icon: "🕰️", name: "Homme des longs matchs", desc: "Gagner 20 matchs au format long." },
  { id: "finals_unbeaten", cat: "perf", icon: "🛡️", name: "Invaincu au sommet", desc: "Remporter la Finale de circuit sans perdre un match." },

  { id: "rivals_all", cat: "rivalite", icon: "⚔️", name: "Némésis", desc: "Terminer avec un bilan positif contre tous vos rivaux." },
  { id: "two_rivals", cat: "rivalite", icon: "🎬", name: "Le grand soir", desc: "Battre deux rivaux dans le même Majeur." },
  { id: "rival_10", cat: "rivalite", icon: "🪓", name: "Bête noire", desc: "Battre le même rival 10 fois." },

  { id: "futures_to_no1", cat: "parcours", icon: "🧗", name: "Parti de rien", desc: "Passer par les Futures et finir numéro 1 mondial." },
  { id: "seasons_20", cat: "parcours", icon: "⏳", name: "Vingt saisons", desc: "Disputer 20 saisons professionnelles." },
  { id: "never_hurt", cat: "parcours", icon: "🦾", name: "Jamais cassé", desc: "Terminer une carrière sans jamais dépasser 4 semaines de blessure sur une saison." },
  { id: "one_coach", cat: "parcours", icon: "🤝", name: "Un seul homme", desc: "Faire toute sa carrière avec le même entraîneur." },
  { id: "moneybags", cat: "parcours", icon: "💰", name: "Nabab", desc: "Amasser 40 M€ de fortune personnelle." },
  { id: "globe", cat: "parcours", icon: "✈️", name: "Le circuit entier", desc: "Disputer au moins 320 tournois." },
  { id: "quest_streak7", cat: "parcours", icon: "🔥", name: "L'habitué", desc: "Accomplir au moins une quête du jour 7 jours d'affilée." },
  { id: "quest_20", cat: "parcours", icon: "🎯", name: "Chasseur de quêtes", desc: "Accomplir 20 quêtes ou défis au total." },
  { id: "nations_cup", cat: "parcours", icon: "🛡️", name: "Pour le pays", desc: "Remporter la Coupe des Nations." },
  { id: "olympic", cat: "parcours", icon: "🏛️", name: "Olympien", desc: "Remporter la médaille d'or olympique." },
  { id: "protected_return", cat: "parcours", icon: "🛟", name: "Le retour", desc: "Revenir dans le top 80 grâce au classement protégé après une opération." },

  { id: "slam_out100", cat: "secret", icon: "🎩", name: "L'inconnu", secret: true, desc: "Remporter un Majeur en étant classé hors du top 100." },
  { id: "saved_mp", cat: "secret", icon: "😰", name: "Au bord du gouffre", secret: true, desc: "Sauver une balle de match en finale de Majeur, et gagner." },
  { id: "no_set_lost", cat: "secret", icon: "🧊", name: "Sans trembler", secret: true, desc: "Remporter un Majeur sans perdre un set." },
  { id: "eternal_second", cat: "secret", icon: "🥀", name: "Enfin", secret: true, desc: "Perdre au moins trois finales de Majeur, puis en gagner une." },
  { id: "miracle", cat: "secret", icon: "🩹", name: "Le miraculé", secret: true, desc: "Remporter un Majeur après une opération et un passage hors du top 200." },

  { id: "platine", cat: "graal", icon: "💎", name: "Palmarès absolu", desc: "Débloquer tous les autres badges." },
];

/* ---------- Boutique (M21) ----------------------------------------------- */
const PERKS = [
  { id: "scout",   icon: "📣", name: "Déjà repéré",         cost: 200, desc: "Réputation de départ +15 : les académies vous connaissent déjà.", fx: { rep: 15 } },
  { id: "junior",  icon: "💰", name: "Le circuit junior payé", cost: 250, desc: "+0,15 M€ de trésorerie au départ — de quoi tenir deux saisons en Futures.", fx: { money: 0.15 } },
  { id: "arm",     icon: "🎾", name: "Le bras",             cost: 400, desc: "+4 en Service dès le passage professionnel.", fx: { ser: 4 } },
  { id: "gem",     icon: "🌟", name: "Pépite",              cost: 600, desc: "+6 de potentiel caché : souvent une étoile de plus.", fx: { pot: 6 } },
  { id: "nerves",  icon: "🧊", name: "Nerfs d'acier",       cost: 800, desc: "Vous démarrez avec le trait Sang-froid.", fx: { trait: "clutch" } },
];
const PERK_SLOTS = 2;

/* ---------- Quêtes (M21) ------------------------------------------------- */
const DAILY_QUESTS = [
  { id: "q_ch_title", tier: 1, pts: 10, icon: "◻️", name: "Premiers lauriers", desc: "Remporter au moins un titre Challenger." },
  { id: "q_top100", tier: 1, pts: 10, icon: "💯", name: "Dans les cent", desc: "Atteindre le top 100 mondial." },
  { id: "q_lefty", tier: 1, pts: 10, icon: "🫲", name: "Contre-pied", desc: "Terminer une carrière avec un gaucher." },
  { id: "q_onehand", tier: 1, pts: 10, icon: "☝️", name: "Le beau geste", desc: "Terminer une carrière avec un revers à une main." },
  { id: "q_slam_qf", tier: 1, pts: 10, icon: "🎾", name: "Dans le dernier carré des huit", desc: "Atteindre un quart de finale de Majeur." },
  { id: "q_15titles", tier: 1, pts: 10, icon: "🏵️", name: "Collectionneur", desc: "Remporter 15 titres, toutes catégories confondues." },

  { id: "q_top10", tier: 2, pts: 25, icon: "🔟", name: "L'élite", desc: "Entrer dans le top 10 mondial." },
  { id: "q_m1000", tier: 2, pts: 25, icon: "🥇", name: "Un grand jour", desc: "Remporter un Masters 1000." },
  { id: "q_slam_final", tier: 2, pts: 25, icon: "🥈", name: "Si près", desc: "Atteindre une finale de Majeur." },
  { id: "q_clay_only", tier: 2, pts: 25, icon: "🟧", name: "L'ocre et rien d'autre", desc: "Terminer avec un profil Terrien et au moins 5 titres sur terre." },
  { id: "q_no_debt", tier: 2, pts: 25, icon: "🧾", name: "Toujours dans le vert", desc: "Terminer une carrière sans jamais passer en trésorerie négative." },
  { id: "q_comeback", tier: 2, pts: 25, icon: "🩹", name: "Revenu de loin", desc: "Revenir dans le top 50 après une opération." },
  { id: "q_nations", tier: 2, pts: 25, icon: "🛡️", name: "Pour le maillot", desc: "Remporter la Coupe des Nations." },
  { id: "q_500x3", tier: 2, pts: 25, icon: "🥈", name: "Régularité", desc: "Remporter trois Tournois 500 dans une même carrière." },

  { id: "q_slam", tier: 3, pts: 50, icon: "🏆", name: "Le Majeur", desc: "Remporter un Majeur." },
  { id: "q_no1", tier: 3, pts: 50, icon: "👑", name: "Le sommet", desc: "Devenir numéro 1 mondial." },
  { id: "q_yearend", tier: 3, pts: 50, icon: "🎆", name: "Le patron de l'année", desc: "Finir une saison au rang 1 mondial." },
  { id: "q_career_slam", tier: 3, pts: 50, icon: "🌍", name: "Les quatre coins du monde", desc: "Remporter les quatre Majeurs en carrière." },
  { id: "q_600wins", tier: 3, pts: 50, icon: "💪", name: "Six cents", desc: "Gagner 600 matchs professionnels." },
  { id: "q_rating90", tier: 3, pts: 50, icon: "💯", name: "Machine", desc: "Terminer avec une note de carrière de 90 ou plus." },
];

const WEEKLY_CHALLENGES = [
  { id: "w_prodige", pts: 60, icon: "🚀", name: "Le prodige", desc: "Atteindre 85 de niveau avant 23 ans." },
  { id: "w_double_slam", pts: 60, icon: "🏆", name: "Doublé", desc: "Remporter deux Majeurs dans une même saison." },
  { id: "w_from_futures", pts: 60, icon: "🧗", name: "L'ascension", desc: "Passer par les Futures et atteindre le top 5." },
  { id: "w_ironman", pts: 60, icon: "🦾", name: "Le corps de fer", desc: "Disputer 18 saisons professionnelles." },
  { id: "w_fortune", pts: 60, icon: "💰", name: "La fortune", desc: "Amasser 25 M€ de fortune personnelle." },
  { id: "w_all_surface", pts: 60, icon: "🌈", name: "Universel", desc: "Gagner un titre sur les trois surfaces la même saison." },
  { id: "w_rival", pts: 60, icon: "⚔️", name: "Le duel d'une vie", desc: "Terminer avec un bilan positif contre tous vos rivaux." },
];

const STREAK_MILESTONES = [
  { days: 3, jetons: 10 }, { days: 7, jetons: 25 }, { days: 14, jetons: 50 },
  { days: 30, jetons: 120 }, { days: 60, jetons: 250 }, { days: 100, jetons: 400 },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BRAND, CIRCUITS, NATIONS, NAME_POOLS, ORIGINS, LIFESTYLES, ENTOURAGES,
    HANDS, BACKHANDS, BUILDS, SURFACES, SURFACE_PROFILES, PROFILE_BIAS,
    TRAJECTORIES, TRAITS, TIERS, STAGE_WEIGHTS, STAGE_LABELS, POINTS, PRIZE,
    CALENDAR, FILLER, RANK_TABLE, ENTRIES, VOLUMES, TEAM_ROLES, SPONSOR_CAP,
    GENERATIONS, AWARDS, BALANCE, CAREER_TIERS, BADGE_CATS, BADGES, PERKS,
    PERK_SLOTS, DAILY_QUESTS, WEEKLY_CHALLENGES, STREAK_MILESTONES,
  };
}
