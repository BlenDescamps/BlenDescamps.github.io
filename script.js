document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initLanguageSwitcher();
  initScrollAnimations();
  initProgressBar();
  initCounters();
  initNavbarScroll();
  initStarfield();
  initSkillBars();
  initMobileMenu();
  initJarvisCore();
  init3DShowcase();
});

function initJarvisCore() {
  const canvas = document.getElementById("jarvisCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;

  const points = [];
  const numPoints = 85;
  const radius = 68;

  for (let i = 0; i < numPoints; i++) {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = 2 * Math.PI * Math.random();
    points.push({
      x: radius * Math.sin(theta) * Math.cos(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(theta)
    });
  }

  let angleX = 0;
  let angleY = 0;
  let pulseTimer = 0;

  function renderJarvis() {
    ctx.clearRect(0, 0, width, height);

    pulseTimer += 0.04;
    const pulseFactor = 1 + Math.sin(pulseTimer) * 0.12;

    angleX += 0.012;
    angleY += 0.016;

    const cosX = Math.cos(angleX);
    const sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY);
    const sinY = Math.sin(angleY);

    const projected = [];

    points.forEach((p) => {
      let y1 = p.y * cosX - p.z * sinX;
      let z1 = p.y * sinX + p.z * cosX;

      let x2 = p.x * cosY + z1 * sinY;
      let z2 = -p.x * sinY + z1 * cosY;

      x2 *= pulseFactor;
      y1 *= pulseFactor;
      z2 *= pulseFactor;

      const fov = 220;
      const scale = fov / (fov + z2 + 80);
      const projX = cx + x2 * scale;
      const projY = cy + y1 * scale;
      const alpha = Math.max(0.15, (z2 + radius) / (2 * radius));

      projected.push({ x: projX, y: projY, z: z2, alpha, scale });
    });

    ctx.strokeStyle = "rgba(247, 184, 1, 0.15)";
    ctx.lineWidth = 0.75;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 28) {
          ctx.beginPath();
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
          ctx.stroke();
        }
      }
    }

    projected.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, 2.2 * p.scale), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247, 184, 1, ${p.alpha * 0.9})`;
      ctx.shadowColor = "#F7B801";
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    requestAnimationFrame(renderJarvis);
  }

  renderJarvis();
}

function initProgressBar() {
  const progressBar = document.getElementById("progressBar");
  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-item");

  const observerOptions = {
    threshold: 0.08,
    rootMargin: "0px 0px 50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute("data-delay") || "0", 10);
        setTimeout(() => {
          entry.target.classList.add("revealed");
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add("revealed");
    } else {
      observer.observe(el);
    }
  });
}

function initCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  let started = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        started = true;
        statNumbers.forEach((stat) => {
          const target = +stat.getAttribute("data-target");
          let count = 0;
          const speed = target / 25;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              stat.innerText = Math.ceil(count);
              requestAnimationFrame(updateCount);
            } else {
              stat.innerText = target;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.4 });

  const aboutSection = document.querySelector(".about-section");
  if (aboutSection) countObserver.observe(aboutSection);
}

function initSkillBars() {
  const skillBars = document.querySelectorAll(".bar-fill");
  const skillSection = document.querySelector(".skills-section");

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skillBars.forEach((bar) => {
          const width = bar.getAttribute("data-width");
          bar.style.width = width;
        });
      }
    });
  }, { threshold: 0.2 });

  if (skillSection) skillObserver.observe(skillSection);
}

function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;
  const colors = ["rgba(247, 184, 1, ", "rgba(165, 230, 186, ", "rgba(255, 231, 194, "];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.6,
      alpha: Math.random() * 0.45 + 0.2,
      colorBase: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.25
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.colorBase}${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    const isVisible = navLinks.style.display === "flex";
    navLinks.style.display = isVisible ? "none" : "flex";
    if (!isVisible) {
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "100%";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "rgba(36, 4, 70, 0.95)";
      navLinks.style.padding = "1.5rem 2rem";
      navLinks.style.borderBottom = "1px solid rgba(247, 184, 1, 0.2)";
    }
  });
}

function init3DShowcase() {
  const container = document.getElementById("showcase3dSticky");
  const canvas = document.getElementById("showcase3dCanvas");
  if (!container || !canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020b08, 0.035);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const gridHelper = new THREE.GridHelper(30, 30, 0xf7b801, 0x360568);
  gridHelper.position.y = -4;
  scene.add(gridHelper);

  const gridTop = new THREE.GridHelper(30, 30, 0xf7b801, 0x360568);
  gridTop.position.y = 4;
  scene.add(gridTop);

  const nucleusGroup = new THREE.Group();
  scene.add(nucleusGroup);

  const numSpherePoints = 120;
  const sphereRadius = 1.1;
  const spherePointsCoords = [];
  const pointPositions = new Float32Array(numSpherePoints * 3);

  for (let i = 0; i < numSpherePoints; i++) {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = 2 * Math.PI * Math.random();
    const x = sphereRadius * Math.sin(theta) * Math.cos(phi);
    const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
    const z = sphereRadius * Math.cos(theta);

    spherePointsCoords.push(new THREE.Vector3(x, y, z));
    pointPositions[i * 3] = x;
    pointPositions[i * 3 + 1] = y;
    pointPositions[i * 3 + 2] = z;
  }

  const pointGeom = new THREE.BufferGeometry();
  pointGeom.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
  const pointMat = new THREE.PointsMaterial({
    color: 0xf7b801,
    size: 0.08,
    transparent: true,
    opacity: 0.95
  });
  const jarvisPointsMesh = new THREE.Points(pointGeom, pointMat);
  nucleusGroup.add(jarvisPointsMesh);

  const linePositions = [];
  for (let i = 0; i < numSpherePoints; i++) {
    for (let j = i + 1; j < numSpherePoints; j++) {
      if (spherePointsCoords[i].distanceTo(spherePointsCoords[j]) < 0.52) {
        linePositions.push(spherePointsCoords[i].x, spherePointsCoords[i].y, spherePointsCoords[i].z);
        linePositions.push(spherePointsCoords[j].x, spherePointsCoords[j].y, spherePointsCoords[j].z);
      }
    }
  }
  const lineGeom = new THREE.BufferGeometry();
  lineGeom.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xf7b801,
    transparent: true,
    opacity: 0.28
  });
  const jarvisLinesMesh = new THREE.LineSegments(lineGeom, lineMat);
  nucleusGroup.add(jarvisLinesMesh);

  const innerCoreGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffe7c2, transparent: true, opacity: 0.85 })
  );
  nucleusGroup.add(innerCoreGlow);

  const outerRing1 = new THREE.Mesh(
    new THREE.RingGeometry(1.5, 1.54, 64),
    new THREE.MeshBasicMaterial({ color: 0xf7b801, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
  );
  outerRing1.rotation.x = Math.PI / 3;
  nucleusGroup.add(outerRing1);

  const outerRing2 = new THREE.Mesh(
    new THREE.RingGeometry(1.75, 1.79, 64),
    new THREE.MeshBasicMaterial({ color: 0xa5e6ba, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
  );
  outerRing2.rotation.y = Math.PI / 3.5;
  nucleusGroup.add(outerRing2);

  const outerRing3 = new THREE.Mesh(
    new THREE.RingGeometry(2.0, 2.03, 64),
    new THREE.MeshBasicMaterial({ color: 0x9ac6c5, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
  );
  outerRing3.rotation.x = -Math.PI / 4;
  nucleusGroup.add(outerRing3);

  const innerLight = new THREE.PointLight(0xf7b801, 3.5, 16);
  scene.add(innerLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const cylinderGroup = new THREE.Group();
  scene.add(cylinderGroup);

  const panelData = {
    en: [
      {
        num: "1",
        badge: "2D RETRO ARCADE // DELIVERED",
        title: "THEY COME IN PEACE",
        genre: "FAST-PACED 2D ARCADE SHOOTER",
        desc1: "Classic arcade-inspired top-down shooter featuring dynamic enemy waves,",
        desc2: "responsive ship maneuvering, bullet-dodging mechanics, and score attack.",
        tags: ["Unity", "C#", "2D Arcade", "Retro Gameplay"],
        status: "STATUS: DELIVERED // AWAITING REVAMP"
      },
      {
        num: "2",
        badge: "2D SIDE-SCROLLER // DELIVERED",
        title: "REBEKKA NO FUKUSHUU",
        genre: "2D SIDE-SCROLLING SHOOTER",
        desc1: "Narrative-driven side-scrolling shoot 'em up with intense enemy formations,",
        desc2: "modular weapon mechanics, cinematic boss encounters, and parallax scrolling.",
        tags: ["Unity", "C#", "Side-Scroller", "Shmup"],
        status: "STATUS: DELIVERED // AWAITING REVAMP"
      },
      {
        num: "3",
        badge: "3D ARCADE // DELIVERED",
        title: "WHAT CAN I GET YA?",
        genre: "FAST-PACED 3D DRINK SERVING SIM",
        desc1: "Chaotic 3D drink-crafting and bar service arcade game under rush-hour pressure.",
        desc2: "Mix recipes, slide drinks to thirsty patrons, and master serving combos.",
        tags: ["Unity 3D", "C#", "Arcade 3D", "Physics Sim"],
        status: "STATUS: DELIVERED // AWAITING REVAMP"
      },
      {
        num: "4",
        badge: "VISUAL NOVEL // IN PROGRESS",
        title: "COFFEE-LAB",
        genre: "BRANCHING VISUAL NOVEL & BREWING SIM",
        desc1: "Cozy narrative experience where brewing recipes and serving custom coffee",
        desc2: "alters customer dialogues, unlocks confessions, and shapes the branching story.",
        tags: ["Unity", "C#", "Visual Novel", "Narrative Design"],
        status: "STATUS: WORK IN PROGRESS // PRE-PRODUCTION"
      },
      {
        num: "5",
        badge: "ENTERPRISE SYSTEMS // DELIVERED",
        title: "MICROBREWERY CUSTOM ERP",
        genre: "INTEGRATED BREWERY MANAGEMENT & INVENTORY",
        desc1: "Bespoke enterprise management platform tailored for microbrewery operations:",
        desc2: "batch recipe tracking, fermentation lifecycle, raw materials, and invoicing.",
        tags: ["Custom ERP", "BPMN Modeling", "Supply Chain", "Database"],
        status: "STATUS: DELIVERED // PRODUCTION SYSTEM"
      },
      {
        num: "6",
        badge: "STUDIO // SOFTWARES & GAMES",
        title: "MAGIBLE SOFTWARES",
        genre: "PURPOSE-BUILT TOOLS & INTERACTIVE GAMES",
        desc1: "Creative studio initiative building custom software tools and engaging games,",
        desc2: "bridging technology and imagination to make the magic of your ideas tangible.",
        tags: ["Magible Studio", "Software Tools", "Game Development", "C# / .NET"],
        status: "STATUS: IN ACTIVE DEVELOPMENT // MAGIBLE STUDIO"
      }
    ],
    fr: [
      {
        num: "1",
        badge: "ARCADE RÉTRO 2D // LIVRÉ",
        title: "THEY COME IN PEACE",
        genre: "SHOOTER ARCADE 2D NERVÉ",
        desc1: "Shooter spatial en vue du dessus inspiré des grands classiques de l'arcade,",
        desc2: "vagues d'ennemis dynamiques, esquive au millimètre et course au high-score.",
        tags: ["Unity", "C#", "Arcade 2D", "Gameplay Rétro"],
        status: "STATUT : LIVRÉ // EN ATTENTE DE REFONTE"
      },
      {
        num: "2",
        badge: "SIDE-SCROLLER 2D // LIVRÉ",
        title: "REBEKKA NO FUKUSHUU",
        genre: "SHOOTER 2D À DÉFILEMENT HORIZONTAL",
        desc1: "Shoot 'em up narratif à défilement horizontal aux vagues d'ennemis intenses,",
        desc2: "système d'armes modulables, combats de boss épiques et décors en parallaxe.",
        tags: ["Unity", "C#", "Side-Scroller", "Shmup"],
        status: "STATUT : LIVRÉ // EN ATTENTE DE REFONTE"
      },
      {
        num: "3",
        badge: "ARCADE 3D // LIVRÉ",
        title: "WHAT CAN I GET YA?",
        genre: "JEU D'ARCADE 3D DE SERVICE DE BOISSONS",
        desc1: "Jeu d'arcade 3D frénétique de service au comptoir en plein coup de feu.",
        desc2: "Dosez, préparez et glissez les verres aux clients avant la fin du temps imparti.",
        tags: ["Unity 3D", "C#", "Arcade 3D", "Physique Temps Réel"],
        status: "STATUT : LIVRÉ // EN ATTENTE DE REFONTE"
      },
      {
        num: "4",
        badge: "VISUAL NOVEL // EN COURS",
        title: "COFFEE-LAB",
        genre: "VISUAL NOVEL & SIMULATION DE BRASSAGE CAFÉ",
        desc1: "Expérience narrative intimiste où vos recettes de café et vos infusions",
        desc2: "influencent directement les confessions des clients et l'évolution du récit.",
        tags: ["Unity", "C#", "Visual Novel", "Design Narratif"],
        status: "STATUT : EN COURS // PRÉ-PRODUCTION"
      },
      {
        num: "5",
        badge: "SYSTÈMES ENTREPRISE // RÉALISÉ",
        title: "ERP SUR MESURE MICROBRASSERIE",
        genre: "GESTION DE PRODUCTION & LOGISTIQUE BRASSERIE",
        desc1: "Plateforme ERP sur mesure développée pour les opérations d'une microbrasserie :",
        desc2: "traçabilité des brassins, fermentation, stocks matières premières et facturation.",
        tags: ["ERP sur mesure", "Modélisation BPMN", "Logistique", "Base de Données"],
        status: "STATUT : RÉALISÉ // SYSTÈME EN PRODUCTION"
      },
      {
        num: "6",
        badge: "STUDIO // LOGICIELS & JEUX",
        title: "MAGIBLE SOFTWARES",
        genre: "OUTILS SUR MESURE & JEUX VIDÉO INTERACTIFS",
        desc1: "Initiative studio dédiée au développement d'outils logiciels et de jeux vidéo,",
        desc2: "alliant technique et créativité pour donner vie à la magie de vos idées.",
        tags: ["Magible Studio", "Outils Logiciels", "Développement Jeux", "C# / .NET"],
        status: "STATUT : EN DÉVELOPPEMENT ACTIF // MAGIBLE STUDIO"
      }
    ]
  };

  function createHoloTexture(data, lang) {
    const texCanvas = document.createElement("canvas");
    texCanvas.width = 640;
    texCanvas.height = 420;
    const ctx = texCanvas.getContext("2d");

    // Dark backdrop
    ctx.fillStyle = "#140326";
    ctx.fillRect(0, 0, 640, 420);

    const grad = ctx.createLinearGradient(0, 0, 0, 420);
    grad.addColorStop(0, "rgba(91, 42, 134, 0.55)");
    grad.addColorStop(1, "rgba(20, 3, 38, 0.92)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 420);

    // Glowing border frame
    ctx.strokeStyle = "#f7b801";
    ctx.lineWidth = 3.5;
    ctx.strokeRect(12, 12, 616, 396);

    // Sci-fi corner brackets
    ctx.fillStyle = "#f7b801";
    const bracketSize = 32;
    const pad = 16;
    ctx.fillRect(pad, pad, bracketSize, 4);
    ctx.fillRect(pad, pad, 4, bracketSize);
    ctx.fillRect(640 - pad - bracketSize, pad, bracketSize, 4);
    ctx.fillRect(640 - pad - 4, pad, 4, bracketSize);
    ctx.fillRect(pad, 420 - pad - 4, bracketSize, 4);
    ctx.fillRect(pad, 420 - pad - bracketSize, 4, bracketSize);
    ctx.fillRect(640 - pad - bracketSize, 420 - pad - 4, bracketSize, 4);
    ctx.fillRect(640 - pad - 4, 420 - pad - bracketSize, 4, bracketSize);

    // Subtle scanlines
    ctx.fillStyle = "rgba(247, 184, 1, 0.035)";
    for (let y = 0; y < 420; y += 4) {
      ctx.fillRect(12, y, 616, 2);
    }

    // Top Header: Project Number + Badge
    ctx.fillStyle = "#f7b801";
    ctx.font = "bold 16px 'JetBrains Mono', monospace";
    ctx.fillText(`PROJECT 0${data.num} // ${data.badge}`, 36, 56);

    // Title: Big bold display font (auto-scaling for long titles)
    ctx.fillStyle = "#ffe7c2";
    ctx.font = data.title.length > 22 ? "bold 26px 'Cabinet Grotesk', sans-serif" : "bold 32px 'Cabinet Grotesk', sans-serif";
    ctx.fillText(data.title, 36, 102);

    // Genre / Category
    ctx.fillStyle = "#a5e6ba";
    ctx.font = "600 15px 'JetBrains Mono', monospace";
    ctx.fillText(data.genre, 36, 134);

    // Divider line
    ctx.strokeStyle = "rgba(255, 231, 194, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 150);
    ctx.lineTo(604, 150);
    ctx.stroke();

    // Description lines
    ctx.fillStyle = "#ffffff";
    ctx.font = "500 17px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(data.desc1, 36, 184);
    if (data.desc2) {
      ctx.fillText(data.desc2, 36, 210);
    }

    // Tech stack tag chips
    if (data.tags && data.tags.length) {
      let curX = 36;
      const chipY = 250;
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      data.tags.forEach((tag) => {
        const textWidth = ctx.measureText(tag).width;
        const chipW = textWidth + 18;
        const chipH = 26;
        if (curX + chipW > 604) return;

        ctx.fillStyle = "rgba(91, 42, 134, 0.65)";
        ctx.strokeStyle = "rgba(247, 184, 1, 0.45)";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(curX, chipY, chipW, chipH, 6);
        } else {
          ctx.rect(curX, chipY, chipW, chipH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffe7c2";
        ctx.fillText(tag, curX + 9, chipY + 18);
        curX += chipW + 8;
      });
    }

    // Divider line above status
    ctx.strokeStyle = "rgba(255, 231, 194, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 310);
    ctx.lineTo(604, 310);
    ctx.stroke();

    // Status label (soft teal for delivered awaiting revamp, mint for delivered in prod, gold for in progress)
    if (data.status.includes("AWAITING REVAMP") || data.status.includes("ATTENTE DE REFONTE")) {
      ctx.fillStyle = "#9ac6c5";
    } else if (data.status.includes("DELIVERED") || data.status.includes("RÉALISÉ") || data.status.includes("LIVRÉ")) {
      ctx.fillStyle = "#a5e6ba";
    } else {
      ctx.fillStyle = "#f7b801";
    }
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillText(data.status, 36, 350);

    // Visual equalizer bars on the right
    ctx.fillStyle = "rgba(247, 184, 1, 0.8)";
    for (let c = 0; c < 10; c++) {
      const barH = 10 + Math.abs(Math.sin(c * 0.8 + (parseInt(data.num) || 1))) * 22;
      ctx.fillRect(470 + c * 13, 354 - barH, 8, barH);
    }

    const texture = new THREE.CanvasTexture(texCanvas);
    texture.needsUpdate = true;
    return texture;
  }

  const numPanels = 6;
  const cylinderRadius = 3.6;
  const heightStep = 0.55;
  const panelGeom = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, 2.1, 24, 1, true, -0.32, 0.64);

  const panels = [];

  for (let i = 0; i < numPanels; i++) {
    const angle = (i / numPanels) * Math.PI * 2;
    const yPos = ((numPanels - 1) / 2 - i) * heightStep;

    const lang = currentLanguage || "en";
    const texture = createHoloTexture(panelData[lang][i], lang);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.98
    });

    const mesh = new THREE.Mesh(panelGeom, mat);
    mesh.rotation.y = -angle;
    mesh.position.y = yPos;
    cylinderGroup.add(mesh);
    panels.push(mesh);
  }

  window.updateShowcaseLanguage = function(newLang) {
    const activeData = panelData[newLang] || panelData.en;
    panels.forEach((mesh, idx) => {
      const newTex = createHoloTexture(activeData[idx], newLang);
      mesh.material.map.dispose();
      mesh.material.map = newTex;
      mesh.material.needsUpdate = true;
    });
    const hud = document.getElementById("hudIndicator");
    if (hud) {
      const activeIdx = Math.min(Math.floor(scrollProgress * numPanels), numPanels - 1);
      const title = activeData[activeIdx].title;
      hud.textContent = `${newLang === 'fr' ? 'PROJET ACTIF' : 'ACTIVE PROJECT'}: 0${activeIdx + 1} / 0${numPanels} // ${title}`;
    }
  };

  let scrollProgress = 0;
  function onScroll() {
    const rect = container.getBoundingClientRect();
    const scrollDist = -rect.top;
    const maxScroll = container.offsetHeight - window.innerHeight;
    scrollProgress = Math.min(Math.max(scrollDist / maxScroll, 0), 1);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const hudIndicator = document.getElementById("hudIndicator");
  let clock = 0;

  function animate() {
    requestAnimationFrame(animate);
    clock += 0.02;

    jarvisPointsMesh.rotation.y += 0.008;
    jarvisPointsMesh.rotation.x += 0.006;
    jarvisLinesMesh.rotation.y += 0.008;
    jarvisLinesMesh.rotation.x += 0.006;

    innerCoreGlow.rotation.y -= 0.012;
    outerRing1.rotation.z += 0.014;
    outerRing2.rotation.z -= 0.011;
    outerRing3.rotation.y += 0.009;

    const pulse = 1 + Math.sin(clock * 2.2) * 0.08;
    nucleusGroup.scale.set(pulse, pulse, pulse);

    const targetRotation = scrollProgress * (Math.PI * 2);
    const targetElevation = (0.5 - scrollProgress) * ((numPanels - 1) * heightStep);

    cylinderGroup.rotation.y += (targetRotation - cylinderGroup.rotation.y) * 0.09;
    cylinderGroup.position.y += (-targetElevation - cylinderGroup.position.y) * 0.09;

    const activeIndex = Math.min(
      Math.floor(scrollProgress * numPanels),
      numPanels - 1
    );
    if (hudIndicator) {
      const lang = currentLanguage || "en";
      const title = panelData[lang][activeIndex].title;
      hudIndicator.textContent = `${lang === 'fr' ? 'PROJET ACTIF' : 'ACTIVE PROJECT'}: 0${activeIndex + 1} / 0${numPanels} // ${title}`;
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

const translations = {
  en: {
    nav_about: "About",
    nav_skills: "Skills & Education",
    nav_experience: "Experience",
    nav_projects: "Projects & Games",
    nav_contact: "Contact",
    hero_status: "Versatile IT Professional • Ath, Belgium",
    hero_title: "Systems integration, ERP & development:<br /><span class=\"gold-gradient-text\">Business & Functional Analysis</span>.",
    hero_subtitle: "Versatile IT Professional experienced in systems integration, user support, ERP, business analysis, and development, currently upskilling in advanced technical engineering.",
    hero_cta_work: "Explore My Work",
    hero_cta_contact: "Get In Touch",
    hero_cta_story: "My Story",
    badge_1: "Sincere",
    badge_2: "Adaptable",
    badge_3: "Time Savvy",
    scroll_cue: "Scroll to explore",
    about_tag: "01 / Profile",
    about_heading: "“<em>Bridging humans and systems through technology</em>”",
    about_story_title: "My Diagon Alley",
    story_step1_tag: "1998 // The Spark & Hardware",
    story_step2_tag: "Detours // Kitchen Rush & Collective Sense",
    story_step3_tag: "Enterprise IT // Bridging Humans & Systems",
    story_step4_tag: "2026 // Alignment & Technocité",
    story_step5_tag: "North Star // For Her",
    about_p1: "My journey with technology didn't start in a computer science lecture hall. It began in 1998, NES controller in hand at 6 years old, with the deep-seated certainty that video games would always be part of my life. It grew through an old radio kit restored with my father after finding it at a flea market, and around age 12, hands deep in the chassis building my first friend's custom PC.",
    about_polaroid_nes: "1st time with Mario",
    about_polaroid_radio: "Restored radio kit",
    about_p2: "The spark was undeniable, but life sometimes takes necessary detours. I studied languages and translation, assembled rigs late into the night while devouring everything code- and design-related, before putting on a chef's apron to support my family. In the kitchen, I learned the intensity of the rush, the precision of each movement, and the true meaning of teamwork. Yet deep down, I always knew I was away from my real workshop.",
    about_polaroid_chef: "The kitchen rush",
    about_polaroid_brigade: "Team spirit & brigade",
    about_p3: "Back in office environments, I seized every tech opportunity and IT initiative that came along—learning on the ground, gathering battle-tested experience, and bridging the gap between humans and complex systems.",
    about_polaroid_it: "DreamVision • IT Projects",
    about_p4: "In 2026, following a layoff, I chose to turn disruption into alignment. At 33, I decided to finally follow my instinct: joining Technocité to train rigorously in software development and game design, fully embracing what I am passionately driven by and thriving in this craft.",
    about_polaroid_technocite: "2026 • Technocité",
    about_p5: "“To be true to who I am, ready to tackle challenges larger than myself… and so my daughter can grow up proud of her father.”",
    about_polaroid_daughter: "For her",
    skills_tag: "02 / Capabilities",
    skills_heading: "Tools & Technical Stack",
    skills_sub: "Technologies and technical workflows used across development.",
    panel_tools_title: "Tools",
    tool_1: "Unity &bull; Unreal Engine",
    tool_2: "Visual Studio &bull; Rider",
    tool_3: "Git &bull; GitHub &bull; CI/CD",
    tool_4: "Jira &bull; HacknPlan",
    tool_5: "ERP Systems (SAP SD &bull; Odoo)",
    tool_6: "Microsoft Suite (Office 365)",
    panel_skills_title: "Skills",
    skill_1: "Gameplay Programming &bull; C# Architecture",
    skill_2: "Game Design &bull; Mechanics Design",
    skill_3: "BPML / BPMN Process Modeling",
    skill_4: "Business Analysis &bull; User Stories Gathering",
    skill_5: "Sprint Management &bull; Agile Methodology",
    skill_6: "Responsible Use of AI",
    skill_7: "Internal Audit",
    skill_8: "IT Systems Integration &bull; Problem Solving",
    skill_9: "Effective Communication &bull; Didactics",
    skill_10: "Pedagogy &bull; Teamwork &bull; Leadership",
    panel_lang_title: "Languages",
    lang_1: "French",
    lang_2: "English",
    lang_3: "Dutch",
    lang_4: "C#",
    lang_5: "JavaScript",
    lang_6: "HTML5 &bull; CSS3",
    exp_tag: "03 / Trajectory",
    exp_heading: "Professional Journey & Career Milestones",
    exp_sub: "From enterprise ERP integration and user support to systems analysis, software engineering, and technical problem-solving.",
    projects_tag: "04 / Creations",
    projects_heading: "Projects & Games Helix",
    projects_sub: "Interactive 3D helix showcase of games, systems, and creative prototypes [Under Construction].",
    showcase_hud_tag: "04 / CREATIONS &bull; MAGIBLE STUDIO",
    showcase_hud_wip: "SECTION UNDER CONSTRUCTION",
    showcase_hud_title: "PROJECTS &amp; GAMES HELIX",
    showcase_hud_sub: "SCROLL TO ORBIT &bull; WORKS IN PROGRESS &amp; ARCHIVE &bull; MAGIBLE STUDIO",
    exp1_period: "March 2024 — November 2025",
    exp1_role: "Customer Relationship Manager / Business Analyst",
    exp1_company: "Rosier S.A.",
    exp1_desc: '<ul class="timeline-bullet-list"><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Key User — Integration of SAP SD and FI/CO modules.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Bridged business users and the SAP team, gathering and translating operational requirements into functional specifications and test cases.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Drafting user stories.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Designed and executed functional test scenarios for the QAS environment.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Supported and trained users in adopting new digital solutions, fostering skill development and cross-functional team satisfaction.</span></li></ul>',
    exp2_period: "December 2022 — December 2023",
    exp2_role: "Transport Planning Specialist",
    exp2_desc: '<ul class="timeline-bullet-list"><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Supported the integration of a new Warehouse Management System (WMS) by coordinating logistics, IT teams, and external service providers.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Modeled and documented logistics workflows using BPMN, enhancing visibility into bottlenecks and driving process automation.</span></li></ul>',
    exp3_period: "July 2021 — December 2022",
    exp3_role: "Coordinator in Sales & Logistics / Odoo ERP Integration",
    exp3_desc: '<ul class="timeline-bullet-list"><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Contributed to the rollout of Odoo ERP (CRM, Inventory, and Manufacturing).</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Gathered user stories to prepare for phased system implementation.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Participated in database migration and functional quality assurance testing.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Supported change management, migrated customer and item master data (products, labels, bills of materials).</span></li></ul>',
    exp4_period: "July 2017 — March 2020",
    exp4_role: "Restaurant Manager & Operations Lead",
    exp4_desc: '<ul class="timeline-bullet-list"><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Full operational management and team leadership.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Supplier and vendor negotiations.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Inventory and stock control.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>High-tempo customer satisfaction and service delivery.</span></li></ul>',
    edu_tag: "Education & Certifications",
    edu_heading: "Academic Background",
    edu1_period: "Nov 2025 — Nov 2026",
    edu1_degree: "Game Development Specialization",
    edu1_desc: "Intensive curriculum in C#, Unity engine architecture, 3D math, and real-time physics. Mastered the end-to-end application development lifecycle through agile methodologies (Scrum, sprint management) down to playable prototype delivery.",
    edu2_period: "June 2025 — Dec 2025",
    edu2_degree: "Introduction to IBM Business Analysis",
    edu2_desc: "Systems modeling, data flow diagrams, stakeholder translation, and technical requirements documentation.",
    edu3_degree: "Teaching Degree / Germanic Languages & Linguistics",
    edu3_desc: "Pedagogy, German & English linguistics, cross-cultural communication and didactic methodology.",
    contact_tag: "05 / Connect",
    contact_heading: "Let's build something engaging",
    contact_sub: "Have a project in systems integration, ERP, custom software tools, or want to collaborate? Feel free to reach out."
  },
  fr: {
    nav_about: "À Propos",
    nav_skills: "Compétences & Formation",
    nav_experience: "Expérience",
    nav_projects: "Projets & Jeux",
    nav_contact: "Contact",
    hero_status: "Professionnel IT Polyvalent • Ath, Belgique",
    hero_title: "Intégration, ERP & développement :<br /><span class=\"gold-gradient-text\">Analyse Business et Fonctionnelle</span>.",
    hero_subtitle: "Professionnel IT polyvalent avec expérience en intégration de systèmes, support utilisateurs, ERP, analyse et développement, aujourd'hui en montée en compétence technique.",
    hero_cta_work: "Découvrir mes projets",
    hero_cta_contact: "Me contacter",
    hero_cta_story: "Mon parcours",
    badge_1: "Sincère",
    badge_2: "Flexible",
    badge_3: "Time Savvy",
    scroll_cue: "Défiler pour explorer",
    about_tag: "01 / Profil",
    about_heading: "« <em>Lier Humains et Systèmes à travers la technologie</em> »",
    about_story_title: "Mon Chemin de Traverse",
    story_step1_tag: "1998 // L'Étincelle & Le Hardware",
    story_step2_tag: "Les Détours // Le Coup de Feu & Le Collectif",
    story_step3_tag: "En Entreprise // Le Pont Humains & Systèmes",
    story_step4_tag: "2026 // L'Alignement & Technocité",
    story_step5_tag: "Le Cap // Pour Elle",
    about_p1: "Mon histoire avec la tech n'a pas commencé dans un amphithéâtre d'informatique. Elle a commencé en 1998, manette de NES en main à 6 ans, avec la certitude intime que le jeu vidéo ferait toujours partie de ma vie. Elle a continué avec un vieux kit radio retapé avec mon père déniché en brocante, puis vers 12 ans, les mains dans le boîtier à monter le premier PC d'un ami.",
    about_polaroid_nes: "1st time with Mario",
    about_polaroid_radio: "Kit radio retapé",
    about_p2: "L'étincelle était là, mais la vie prend parfois des détours nécessaires. J'ai étudié les langues et la traduction, monté des machines la nuit en dévorant tout ce qui touchait au code et au design, avant d'enfiler un tablier de cuisinier pour soutenir ma famille. En cuisine, j'ai appris le coup de feu, la rigueur du geste et le sens du collectif. Mais au fond de moi, je savais que je passais à côté de mon véritable atelier.",
    about_polaroid_chef: "Le coup de feu",
    about_polaroid_brigade: "Le sens du collectif",
    about_p3: "De retour dans les bureaux, je me suis agrippé à chaque opportunité tech et chaque projet IT qui passait pour apprendre sur le tas, accumuler de l'expérience et faire le pont entre l'humain et les systèmes.",
    about_polaroid_it: "DreamVision • Projets IT",
    about_p4: "En 2026, suite à un licenciement, j'ai choisi de transformer cette rupture en alignement. À 33 ans, j'ai décidé d'écouter enfin mon instinct : rejoindre Technocité pour me former solidement au développement et au game design, embrasser ce qui me passionne viscéralement et m'épanouir pleinement dans ce métier.",
    about_polaroid_technocite: "2026 • Technocité",
    about_p5: "« Pour être aligné avec moi-même, prêt à relever des défis plus grands que moi… et pour que ma fille puisse grandir en étant fière de son père. »",
    about_polaroid_daughter: "Pour elle",
    skills_tag: "02 / Compétences",
    skills_heading: "Outils & Stack Technique",
    skills_sub: "Technologies et environnements utilisés en développement.",
    panel_tools_title: "Outils",
    tool_1: "Unity &bull; Unreal Engine",
    tool_2: "Visual Studio &bull; Rider",
    tool_3: "Git &bull; GitHub &bull; CI/CD",
    tool_4: "Jira &bull; HacknPlan",
    tool_5: "Progiciels ERP (SAP SD &bull; Odoo)",
    tool_6: "Suite Microsoft (Office 365)",
    panel_skills_title: "Compétences",
    skill_1: "Programmation Gameplay &bull; Architecture C#",
    skill_2: "Game Design &bull; Mécaniques de jeu",
    skill_3: "Représentation BPML / BPMN",
    skill_4: "Analyse Business &bull; Recueil de User Stories",
    skill_5: "Gestion de Sprints &bull; Méthodologie Agile",
    skill_6: "Utilisation responsable de l'IA",
    skill_7: "Audit interne",
    skill_8: "Intégration Systèmes IT &bull; Résolution de problèmes",
    skill_9: "Communication efficace &bull; Didactique",
    skill_10: "Pédagogie &bull; Travail d'équipe &bull; Leadership",
    panel_lang_title: "Langues",
    lang_1: "Français",
    lang_2: "Anglais",
    lang_3: "Néerlandais",
    lang_4: "C#",
    lang_5: "JavaScript",
    lang_6: "HTML5 &bull; CSS3",
    exp_tag: "03 / Trajectoire",
    exp_heading: "Parcours Professionnel & Jalons",
    exp_sub: "De l'intégration de systèmes ERP et du support vers l'analyse fonctionnelle, le développement logiciel et les technologies avancées.",
    projects_tag: "04 / Créations",
    projects_heading: "Helix des Projets & Jeux",
    projects_sub: "Showcase 3D interactif des projets en cours et réalisés [En construction].",
    showcase_hud_tag: "04 / CRÉATIONS &bull; MAGIBLE STUDIO",
    showcase_hud_wip: "SECTION EN COURS DE CONSTRUCTION",
    showcase_hud_title: "HELIX DES PROJETS &amp; JEUX",
    showcase_hud_sub: "DÉFILER POUR PIVOTER &bull; PROJETS EN COURS ET RÉALISÉS &bull; MAGIBLE STUDIO",
    exp1_period: "Mars 2024 — Novembre 2025",
    exp1_role: "Customer Relationship Manager / Business Analyst",
    exp1_company: "Rosier S.A.",
    exp1_desc: '<ul class="timeline-bullet-list"><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Key User — Intégration des modules SD et FI/CO de SAP.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Fait le lien entre les utilisateurs et l’équipe SAP, recueillant et traduisant les besoins opérationnels en spécifications fonctionnelles et cas de test.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Rédaction de user stories.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Conçu et exécuté des scénarios de tests fonctionnels pour l’environnement QAS.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Accompagne et forme les utilisateurs à l’adoption des nouvelles solutions digitales, favorisant la montée en compétence et la satisfaction des équipes.</span></li></ul>',
    exp2_period: "Décembre 2022 — Décembre 2023",
    exp2_role: "Spécialiste de planification de transport",
    exp2_desc: '<ul class="timeline-bullet-list"><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Soutenu l’intégration d’un nouveau système de gestion d’entrepôt (WMS) en assurant la coordination entre les équipes logistiques, IT et prestataires externes.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Modélisé et documenté les flux logistiques avec BPMN, apportant une meilleure visibilité sur les points de friction et favorisant l’automatisation des processus.</span></li></ul>',
    exp3_period: "Juillet 2021 — Décembre 2022",
    exp3_role: "Coordinateur Ventes et Logistique / Intégration ERP Odoo",
    exp3_desc: '<ul class="timeline-bullet-list"><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Contribué au déploiement de l’ERP Odoo (CRM, Inventaire et production).</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Recueil d’user stories pour préparer à l’implémentation.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Participé à la migration de la base de données et aux tests fonctionnels.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Accompagné le changement, migré la base de données clients et articles (produits, étiquettes, nomenclatures).</span></li></ul>',
    exp4_period: "Juillet 2017 — Mars 2020",
    exp4_role: "Gérant de restaurant & Responsable Opérationnel",
    exp4_desc: '<ul class="timeline-bullet-list"><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Direction opérationnelle complète, gestion d\'équipe.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Négociation fournisseurs.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Gestion des stocks.</span></li><li class="timeline-bullet-item"><span class="timeline-bullet-dot"></span><span>Satisfaction client sous forte cadence.</span></li></ul>',
    edu_tag: "Formation & Certifications",
    edu_heading: "Parcours Académique",
    edu1_period: "Nov 2025 — Nov 2026",
    edu1_degree: "Spécialisation Game Development",
    edu1_desc: "Programme intensif en C#, architecture moteur Unity, mathématiques 3D et physique temps réel. Maîtrise du cycle complet de développement applicatif via les méthodologies agiles (Scrum, gestion de sprints) jusqu'à la livraison de prototypes jouables.",
    edu2_period: "Juin 2025 — Déc 2025",
    edu2_degree: "Introduction IBM Business Analysis",
    edu2_desc: "Modélisation des systèmes, diagrammes de flux de données, analyse des exigences métiers et spécifications techniques.",
    edu3_degree: "Agrégation de l'Enseignement / Langues & Linguistique Germaniques",
    edu3_desc: "Pédagogie, linguistique anglaise et allemande, communication interculturelle et méthodologie didactique.",
    contact_tag: "05 / Contact",
    contact_heading: "Construisons un projet marquant",
    contact_sub: "Un besoin en intégration de systèmes, ERP, développement d'outils ou envie d'échanger ? N'hésitez pas à me contacter."
  }
};

let currentLanguage = localStorage.getItem("blen_preferred_lang") || "en";

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("blen_preferred_lang", lang);

  const dict = translations[lang] || translations.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });

  document.documentElement.lang = lang;

  if (typeof window.updateShowcaseLanguage === "function") {
    window.updateShowcaseLanguage(lang);
  }
}

function initLanguageSwitcher() {
  const switchBox = document.getElementById("langSwitch");
  if (!switchBox) return;

  switchBox.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetLang = btn.getAttribute("data-lang");
      setLanguage(targetLang);
    });
  });

  setLanguage(currentLanguage);
}

