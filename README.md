# Le Verger du Coin — POC Urbanisation SI

## Contexte

Ce Proof of Concept (POC) a été conçu dans le cadre d'un projet académique
d'urbanisation et de gouvernance des systèmes d'information (3e année, cycle ingénieur).

L'étude de cas porte sur **Le Verger du Coin**, un commerce de fruits et jus locaux
souhaitant mettre en place un parcours **Click & Collect**.

Le POC illustre, sur un périmètre volontairement réduit, les principes fondamentaux
de l'urbanisation SI appliqués à un processus métier concret.

## Objectifs pédagogiques

| Principe | Ce que démontre le POC |
|---|---|
| **Unicité de la donnée** | Un référentiel produit unique, partagé par toutes les interfaces |
| **Fin des ressaisies** | La commande client met à jour le stock sans intervention manuelle |
| **Donnée de pilotage** | La donnée opérationnelle est transformée en indicateurs de décision en temps réel |
| **Urbanisation agile** | Architecture en briques indépendantes mais communicantes via un état partagé |

## Architecture du POC

L'application est structurée en **3 interfaces** correspondant aux couches classiques
d'un SI urbanisé :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RÉFÉRENTIEL UNIQUE                                │
│                    (État centralisé — Source de vérité)                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  INTERFACE CLIENT   │   │     BACK-OFFICE     │   │  TABLEAU DE BORD    │
│   (Front-Office)    │   │   (Administration)  │   │     (Pilotage)      │
│                     │   │                     │   │                     │
│  • Catalogue        │   │  • Gestion stocks   │   │  • KPIs temps réel  │
│  • Panier           │   │  • Suivi commandes  │   │  • Alertes stocks   │
│  • Commande         │   │  • Statuts C&C      │   │  • Analyse ventes   │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

## Les 3 interfaces de démonstration

### Interface 1 — Site Client (Click & Collect)
L'interface que voit le client final pour passer sa commande.
- Catalogue produits avec disponibilités temps réel
- Système de panier
- Confirmation de commande pour retrait au kiosque

### Interface 2 — Back-Office Administration
L'interface de gestion pour l'exploitant.
- Vue et modification des stocks
- Suivi des commandes avec gestion des statuts (En attente → Prêt → Retiré)
- Réapprovisionnement rapide

### Interface 3 — Tableau de Bord Pilotage
La donnée opérationnelle transformée en indicateurs de décision.
- KPIs : commandes, CA, panier moyen, quantités vendues
- Produit phare et répartition des ventes
- Alertes automatiques sur les niveaux de stock

## Lancement en local

**Prérequis :** Node.js (v20+)

```bash
npm install
npm run dev
```

L'application est accessible sur **http://localhost:3000**.

## Auteurs

**Alexandre ARNIAUD** & **Arthur DESAUBLIAUX**

POC Urbanisation et Gouvernance des SI — 2025/2026
