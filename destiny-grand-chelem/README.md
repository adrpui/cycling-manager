# 🎾 Destiny Grand Chelem

**Écrivez votre légende du tennis.**

Un jeu de carrière de joueur de tennis, gratuit, sans compte, entièrement dans le navigateur.
De la première invitation en Futures au dernier tour d'honneur, chaque choix compte — et personne
ne connaît son destin à l'avance.

Adaptation au tennis des mécaniques de *Destiny Eleven*, d'après les arbitrages D1 à D10 du
cahier de décisions.

---

## ▶️ Comment y jouer

Ouvrez `index.html` dans un navigateur. Rien à installer, aucun serveur, aucune dépendance.
Le jeu fonctionne hors ligne (seules les polices Google restent chargées en ligne, avec repli).

---

## 🎮 Ce qui vous attend

Une carrière tient en **dix-huit à vingt tours**, un par saison, soit douze à quinze minutes.
Chaque tour se joue en trois écrans : un **événement à choix**, le **programme de la saison**,
puis le **bilan**.

- **Six attributs** — Service · Retour · Fond de court · Déplacement · Physique · Mental.
  Leur pondération dépend du circuit choisi.
- **Trois affinités de surface** dont la somme vaut toujours zéro : personne n'est bon partout.
  Un Terrien joue neuf points au-dessus de son niveau sur ocre et six en dessous sur gazon.
- **Un potentiel caché** (68 à 97), jamais montré, révélé seulement à la retraite — avec un
  tirage secret de « talent générationnel » plafonné à 5 %.
- **Huit trajectoires de carrière** tirées à l'aveugle : explosion précoce, révélation tardive,
  météore, montagnes russes…
- **Le classement mondial** avec **défense de points** : ce que vous ne reproduisez pas est perdu.
- **Le calendrier est un choix** : volume, surface prioritaire, placement des wildcards.
- **Une équipe à payer** — entraîneur, préparateur, kiné, agent — et une trésorerie qui peut
  passer dans le rouge pendant les cinq premières saisons.
- **Deux à quatre rivaux nommés**, présents dans les tableaux, avec un face-à-face suivi, et une
  **force de génération** tirée en secret : naître dans un âge d'or coûte des Majeurs.
- **Des blessures** graduées jusqu'à l'opération, avec zones chroniques et **classement protégé**.
- **Des moments décisifs** interactifs : finale de Majeur, balle de break dans le set décisif,
  balle de match à sauver, temps mort médical, chemin du retour.

## 🏆 Trophées

Quatre **Majeurs** (Australie · Paris · Londres · New York), la **Finale de circuit**,
neuf **Masters 1000**, les Tournois 500 et 250, les Challengers et les Futures, plus la
**Coupe des Nations** et le **tournoi olympique**. Le titre suprême annuel est la première
place mondiale en fin d'année ; la statistique de légende est le nombre de semaines au rang 1.

Tous les noms sont libres de droits.

## 🕹️ Modes

| Mode | En bref |
|------|---------|
| 👤 **Carrière** | Le mode principal, profil libre, avantages de boutique équipés. |
| 🗓️ **Défi du jour** | Profil imposé identique pour tous, graine déterministe tirée de la date, avantages désactivés. |

Le **Duel** (rejeu vérifié par serveur) et le **Mode Histoire** (carrières de légendes) sont
prévus mais non implémentés dans cette version.

## ✨ Et de quoi revenir

Une **boutique** de cinq avantages de départ (deux équipables), **43 badges** en neuf catégories
dont des secrets, des **quêtes** du jour et de la semaine tirées de la date, des **séries**
à entretenir, un **système de niveau et d'expérience**, et un **Panthéon** qui archive vos
cinquante meilleures carrières. Toute la progression vit dans le `localStorage` du navigateur.

---

## 🗂️ Architecture

| Fichier | Rôle |
|---------|------|
| `index.html` | Coquille. Charge les scripts dans l'ordre. |
| `style.css` | Feuille de style. Palette tirée des trois surfaces, thèmes clair et sombre. |
| `data.js` | Toutes les tables de constantes. Zéro logique. |
| `data-events.js` | 59 événements à choix, 30 micro-événements, 8 moments décisifs. |
| `engine.js` | Le moteur. Calcul pur, sans DOM, utilisable sous Node. |
| `game.js` | Interface, boucle de jeu, méta-progression. |
| `tools/simulate.js` | Simulateur de masse — l'outil d'équilibrage. |

Vanilla JavaScript, aucune dépendance, aucune étape de build.

### Le simulateur de masse

```sh
node tools/simulate.js 5000
```

Joue N carrières complètes avec une politique de choix automatique et mesure les distributions
qui comptent. C'est l'outil qui a servi à tout l'équilibrage : les valeurs de `data.js` ont été
corrigées cinq fois sur la base de ses mesures, jamais sur l'intuition.

---

## 📊 Équilibrage mesuré

Sur 5 000 carrières simulées avec des choix aléatoires (un joueur qui choisit bien fait mieux) :

| Indicateur | Mesuré |
|------------|--------|
| Niveau pic — médiane / p90 / p99 | 79 / 87 / 92 |
| Talent générationnel (tirage caché) | 2,8 % |
| A vu le top 100 | 25,9 % |
| A vu le top 10 | 13,1 % |
| A été numéro 1 mondial | 0,9 % |
| A gagné un Majeur | 7,2 % |
| Majeurs par carrière (moyenne / max observé) | 0,11 / 5 |
| Découvert supérieur à 50 k€ | 78,3 % |
| Âge de retraite moyen | 33,5 ans |
| Au moins une opération | 20,9 % |
| Carrière brisée médicalement | 1,6 % |

### Le point de vérification n°1

La question à laquelle tout le dilemme des surfaces devait répondre : *un Polyvalent
finit-il avec plus ou moins de Majeurs qu'un Terrien de même potentiel ?*

| Profil | Majeurs / carrière | Titres / carrière | Top 10 |
|--------|-------------------|-------------------|--------|
| Polyvalent | 0,125 | 2,5 | 14,7 % |
| Terrien | 0,129 | 3,3 | 12,9 % |

**Écart de 0,004 Majeur** — très en deçà du seuil de tolérance d'un titre. Le Terrien accumule
nettement plus de titres, le Polyvalent est légèrement plus régulier au sommet. Les deux
définitions de la grandeur coexistent sans qu'aucune ne domine.

### L'effet de génération

Naître dans un âge d'or coûte environ **40 % des Majeurs** par rapport à une génération creuse,
à niveau égal. C'est révélé à la retraite, avec la contrefactuelle.

---

## 🔭 Ce qui reste à faire

- Porter le catalogue d'événements de 59 à la cible de 267.
- Mode Histoire (carrières inspirées de légendes, jamais nommées).
- Duel entre joueurs, avec rejeu du journal de choix vérifié côté serveur.
- Épuisement mental : le drapeau est posé par le moteur mais l'événement de pause reste à écrire.
- Circuit junior distinct (les saisons 15-17 s'y apparentent déjà par les événements).
