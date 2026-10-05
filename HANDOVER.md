# Project Handover & Architecture Scan

**Repository:** [BlenDescamps/BlenDescamps.github.io](https://github.com/BlenDescamps/BlenDescamps.github.io.git)  
**Local Path:** `C:\Users\bleno\.gemini\antigravity\scratch\BlenDescamps.github.io`  
**Current Branch:** `main`  
**Profile:** Blen Descamps — Professionnel IT Polyvalent (Ath, Belgium) &bull; Magible Studio

---

## 1. Executive Summary

This repository hosts Blen Descamps' personal interactive portfolio website, designed for deployment on GitHub Pages (`https://blendescamps.github.io`). 

The site is built with a zero-dependency build setup (vanilla HTML5, modern CSS3, and modular vanilla JavaScript ES6+), enhanced with **Three.js (r128)** for high-impact 3D interactions and **Lucide Icons** for UI iconography. It features an integrated bilingual translation engine (FR/EN). The 3D helix showcase features real projects (delivered titles awaiting revamp, active development, and enterprise ERP systems) with clear "Under Construction" / "En cours de construction" status notices under the **Magible Studio** banner.

---

## 2. Tech Stack & Architecture

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic | Structured sections (`#hero`, `#about`, `#skills`, `#experience`, `#projects`, `#contact`) |
| **Styling** | Vanilla CSS3 | Custom CSS Variables, Glassmorphism backdrop-filters, custom scroll cues, responsive grid & flexbox |
| **Color Palette** | Warm Velvet & Gold | Deep royal plum (`#220a2c`, `#481958`), vibrant gold (`#F7B801`), mint green (`#A5E6BA`), vanilla cream (`#FFF3E1`) |
| **Typography** | Fontshare & Google Fonts | Cabinet Grotesk (headers), Plus Jakarta Sans (body), Outfit (accents), JetBrains Mono (code/HUD) |
| **3D Engine** | Three.js (r128 CDN) | Helical 3D carousel for project showcase with camera orbit controls & custom lighting |
| **Canvas 2D** | Native Canvas API | Dynamic floating starfield background & animated rotating Jarvis gyroscope core |
| **Icons** | Lucide Icons & Custom SVG | Modern vector icons & authentic brand assets (`linkedin.svg`) |
| **Localization** | Custom i18n Dictionary | Client-side FR/EN toggle with `localStorage` memory and bidirectional updates |

---

## 3. Detailed Component Breakdown

### 3.1. Navigation & UI Overlays
- **Scroll Progress Bar**: Real-time gradient indicator across top edge based on window scroll depth.
- **Starfield Canvas (`#starfield`)**: Ambient background canvas generating floating colored particles with smooth wrap-around boundaries.
- **Language Switcher (`#langSwitch`)**: Instant toggle between French (FR) and English (EN) with `data-i18n` attribute scanning.

### 3.2. Hero Section (`#hero`)
- Status pill indicating current location & role (*Ath, Belgique*).
- Catchphrase highlighting software resilience, gameplay programming, and **Magible Studio (Software Tools & Games)**.
- Profile portrait frame with glowing gradient edges and floating attribute tags (*Sincere*, *Adaptable*, *Time Savvy*).

### 3.3. Profile & Narrative Section (`#about`)
- Title: *« Lier Humains et Systèmes à travers la technologie »* / *“Bridging humans and systems through technology”*.
- Structured vertical timeline with Polaroid-style image frames:
  1. **1998 // The Spark & Hardware**: NES nostalgia, flea-market radio kit restoration, first PC builds.
  2. **The Detours // Kitchen Rush & Collective Sense**: Translation studies, professional cooking brigade experience.
  3. **Enterprise IT // Bridging Humans & Systems**: Systems integration, enterprise IT initiatives (DreamVision).
  4. **2026 // Alignment & Technocité**: Professional transition at age 33 into game design & development.
  5. **North Star // For Her**: Dedication to his daughter.

### 3.4. Capabilities & Education (`#skills`)
- **Tools**: Unity, Unreal Engine, Visual Studio, Rider, Git / GitHub / CI/CD, Jira / HacknPlan, ERP (SAP SD, Odoo), Microsoft 365.
- **Skills**: Gameplay Programming & C# Architecture, Game Design & Mechanics, BPML / BPMN modeling, Business Analysis & User Stories, Agile/Sprint management, Responsible AI, Internal Audit, IT Systems Integration.
- **Languages**: French (Native), English, Dutch, C#, JavaScript, HTML5/CSS3.
- **Education**:
  - Technocité (2025–2026): Game Development Specialization.
  - IBM / Coursera (2025): Introduction to IBM Business Analysis.
  - HELHa (2016–2018): Teaching Degree / Germanic Languages & Linguistics.

### 3.5. Professional Trajectory (`#experience`)
- **Rosier S.A.** (2024–2025): Customer Relationship Manager / Business Analyst (Key User SAP SD & FI/CO).
- **Lutosa** (2022–2023): Transport Planning Specialist / WMS integration & BPMN modeling.
- **SOTECNA S.A.** (2021–2022): Coordinator in Sales & Logistics / Odoo ERP Integration.
- **Nationale 7** (2017–2020): Restaurant Manager & Operations Lead.

### 3.6. Creations & Projects Helix (`#projects`) [Under Construction]
- **Three.js 3D Helical Engine** with animated glowing HUD WIP badge under **Magible Studio**:
  1. **They come in Peace**: 2D retro arcade shooter (Status: Delivered // Awaiting Revamp &bull; Livré // En attente de refonte).
  2. **Rebekka no Fukushuu**: 2D side-scrolling action shooter (Status: Delivered // Awaiting Revamp &bull; Livré // En attente de refonte).
  3. **What can I get ya?**: 3D fast-paced drink serving arcade game (Status: Delivered // Awaiting Revamp &bull; Livré // En attente de refonte).
  4. **Coffee-Lab**: Branching narrative visual novel where brews influence the story (Status: Work in Progress // Pre-Production).
  5. **Microbrewery Custom ERP**: Bespoke integrated production, fermentation & inventory management platform (Status: Delivered // Production System).
  6. **MAGIBLE Softwares**: Studio initiative dedicated to crafting both software tools and interactive games (Status: In Active Development // Magible Studio).

### 3.7. Contact & Jarvis Core (`#contact`)
- Interactive Canvas 2D rotating 3D wireframe sphere with pulsing node network.
- Direct email link (`blendescamps@gmail.com`) and branded LinkedIn icon button.
