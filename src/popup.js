"use strict";

const dict = {
  ru: {
    headline: "Настройки",
    title: "Настройка<br>редиректов",
    subtitle: "Укажите сайты для показа контента и ссылку для перехода",
    site1Title: "Сайт 1", site1Sub: "Чей контент показываем", site1Label: "URL источника",
    site2Title: "Сайт 2", site2Sub: "Какую ссылку показываем", site2Label: "URL перенаправления",
    toggleTitle: "Включить подмену", toggleSub: "Все переходы будут перенаправляться",
    sectionTitle: "Целевые URL",
    btnText: "Сохранить изменения", saved: "Сохранено",
    customTitle: "Свой Title страницы", customTitlePlaceholder: "Будет браться из 1 ссылки",
    effectsHeader: "Эффекты", appearanceHeader: "Оформление",
    snowLabel: "Snow mode", snowSub: "Снегопад с глубиной",
    rainLabel: "Rain mode", rainSub: "Косые капли со всплесками",
    starsLabel: "Stars mode", starsSub: "Звёзды и падающие метеоры",
    auroraLabel: "Aurora mode", auroraSub: "Северное сияние",
    bubblesLabel: "Bubbles mode", bubblesSub: "Всплывающие пузыри",
    firefliesLabel: "Fireflies mode", firefliesSub: "Светлячки в темноте",
    liquidLabel: "Liquid mode", liquidSub: "Анимированный градиент",
    constellationLabel: "Constellation", constellationSub: "Созвездия, тянутся к курсору",
    sakuraLabel: "Sakura", sakuraSub: "Кружащиеся лепестки",
    matrixLabel: "Matrix", matrixSub: "Цифровой дождь",
    wavesLabel: "Waves", wavesSub: "Волны внизу экрана",
    confettiLabel: "Confetti on save", confettiSub: "Салют при сохранении",
    accentLabel: "Цвет темы", accentSub: "Material You",
    glassLabel: "Glass mode", glassSub: "Размытие фона",
    actionClose: "Закрыть", actionUndo: "Отменить",
    statusOn: "Активно", statusOff: "Выкл",
    flowContent: "Контент сайта", flowAddress: "Показываемый адрес",
    draftHint: "Черновик сохранён — не забудьте применить",
    invalidUrl: "Некорректный URL",
    pasteFailed: "Нет доступа к буферу — нажмите Ctrl+V",
    tabFilled: "Взят адрес текущей вкладки",
  },
  en: {
    headline: "Settings",
    title: "Redirect<br>Settings",
    subtitle: "Specify the sites to show content and the redirect link",
    site1Title: "Site 1", site1Sub: "Whose content we show", site1Label: "Source URL",
    site2Title: "Site 2", site2Sub: "Which link we show", site2Label: "Redirect URL",
    toggleTitle: "Enable spoofing", toggleSub: "All transitions will be redirected",
    sectionTitle: "Target URLs",
    btnText: "Save changes", saved: "Saved",
    customTitle: "Custom Page Title", customTitlePlaceholder: "Will be taken from Site 1",
    effectsHeader: "Effects", appearanceHeader: "Appearance",
    snowLabel: "Snow mode", snowSub: "Snowfall with depth",
    rainLabel: "Rain mode", rainSub: "Slanted drops with splashes",
    starsLabel: "Stars mode", starsSub: "Stars and shooting meteors",
    auroraLabel: "Aurora mode", auroraSub: "Northern lights",
    bubblesLabel: "Bubbles mode", bubblesSub: "Floating bubbles",
    firefliesLabel: "Fireflies mode", firefliesSub: "Glowing fireflies",
    liquidLabel: "Liquid mode", liquidSub: "Animated gradient",
    constellationLabel: "Constellation", constellationSub: "Linked stars that follow the cursor",
    sakuraLabel: "Sakura", sakuraSub: "Swirling petals",
    matrixLabel: "Matrix", matrixSub: "Digital rain",
    wavesLabel: "Waves", wavesSub: "Waves along the bottom",
    confettiLabel: "Confetti on save", confettiSub: "Fireworks on save",
    accentLabel: "Theme color", accentSub: "Material You",
    glassLabel: "Glass mode", glassSub: "Background blur",
    actionClose: "Close", actionUndo: "Undo",
    statusOn: "Active", statusOff: "Off",
    flowContent: "Content from", flowAddress: "Address shown",
    draftHint: "Draft kept — don't forget to save",
    invalidUrl: "Invalid URL",
    pasteFailed: "No clipboard access — press Ctrl+V",
    tabFilled: "Took the current tab's address",
  }
};

const EFFECTS = [
  { name: "snow", icon: "ac_unit" },
  { name: "rain", icon: "water_drop" },
  { name: "stars", icon: "auto_awesome" },
  { name: "aurora", icon: "blur_on" },
  { name: "bubbles", icon: "bubble_chart" },
  { name: "fireflies", icon: "flare" },
  { name: "liquid", icon: "gradient" },
  { name: "constellation", icon: "hub" },
  { name: "sakura", icon: "local_florist" },
  { name: "matrix", icon: "terminal" },
  { name: "waves", icon: "waves" },
  { name: "confetti", icon: "celebration" },
];

const browserLang = (navigator.language || "").toLowerCase();
let currentLang = browserLang.startsWith("ru") ? "ru" : "en";
const t = (k) => dict[currentLang][k] || k;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const iconEl = (name) => {
  const el = document.createElement("span");
  el.className = "material-symbols-rounded";
  el.textContent = name;
  return el;
};

function buildEffectsList() {
  const header = document.getElementById("t-effectsHeader");
  const template = document.getElementById("effectRowTemplate");
  const rows = EFFECTS.map(({ name, icon }) => {
    const row = template.content.firstElementChild.cloneNode(true);
    row.dataset.effect = name;
    row.querySelector(".li-icon .material-symbols-rounded").textContent = icon;
    row.querySelector(".li-headline").id = `t-${name}Label`;
    row.querySelector(".li-supporting").id = `t-${name}Sub`;
    row.querySelector("input").dataset.effectInput = name;
    return row;
  });
  header.after(...rows);
  document.querySelectorAll("#settingsInner > *").forEach((el, i) => el.style.setProperty("--i", i));
}

function applyLang() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  // Multi-line strings use "<br>" as a line separator.
  const setLines = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    const parts = val.split("<br>").flatMap((line, i) => i ? [document.createElement("br"), line] : [line]);
    el.replaceChildren(...parts);
  };
  document.documentElement.lang = currentLang;
  set("t-headline", t("headline"));
  setLines("t-title", t("title"));
  set("t-subtitle", t("subtitle"));
  set("t-site1Title", t("site1Title")); set("t-site1Sub", t("site1Sub")); set("t-site1Label", t("site1Label"));
  set("t-site2Title", t("site2Title")); set("t-site2Sub", t("site2Sub")); set("t-site2Label", t("site2Label"));
  set("t-toggleTitle", t("toggleTitle")); set("t-toggleSub", t("toggleSub"));
  set("t-sectionTitle", t("sectionTitle"));
  set("btnText", t("btnText"));
  set("t-customTitleText", t("customTitle"));
  document.getElementById("customTitle").placeholder = t("customTitlePlaceholder");
  set("t-effectsHeader", t("effectsHeader"));
  set("t-appearanceHeader", t("appearanceHeader"));
  for (const { name } of EFFECTS) {
    set(`t-${name}Label`, t(`${name}Label`));
    set(`t-${name}Sub`, t(`${name}Sub`));
  }
  set("t-accentLabel", t("accentLabel")); set("t-accentSub", t("accentSub"));
  set("t-glassLabel", t("glassLabel")); set("t-glassSub", t("glassSub"));
  set("snackbarActionText", t("actionClose"));
  set("t-flowOpen", t("flowContent"));
  set("t-flowSee", t("flowAddress"));
  set("t-draftHint", t("draftHint"));
}

const mcu = window.materialColorUtilities;
const MDC = mcu.MaterialDynamicColors;
const Hct = mcu.Hct;
const hexToArgb = (hex) => mcu.argbFromHex(hex);
const argbToHex = (a) => mcu.hexFromArgb(a);

const PALETTE_ROLES = [
  "primary", "onPrimary", "primaryContainer", "onPrimaryContainer",
  "secondary", "onSecondary", "secondaryContainer", "onSecondaryContainer",
  "tertiary", "onTertiary", "tertiaryContainer", "onTertiaryContainer",
  "error", "onError", "background", "onBackground",
  "surface", "onSurface", "surfaceVariant", "onSurfaceVariant",
  "surfaceDim", "surfaceBright",
  "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer",
  "surfaceContainerHigh", "surfaceContainerHighest",
  "outline", "outlineVariant", "inverseSurface", "inverseOnSurface",
  "inversePrimary", "surfaceTint",
];

const toCssVar = (role) => "--md-sys-color-" + role.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

function generatePalette(hex) {
  const scheme = new mcu.SchemeTonalSpot(Hct.fromInt(hexToArgb(hex)), true, 0);
  const palette = {};
  for (const role of PALETTE_ROLES) palette[role] = argbToHex(MDC[role].getArgb(scheme));
  return palette;
}

function applyPalette(p) {
  const r = document.documentElement;
  for (const role of PALETTE_ROLES) r.style.setProperty(toCssVar(role), p[role]);
}

function hexToRgb(hex) {
  if (!hex) return { r: 255, g: 255, b: 255 };
  let h = hex.replace("#", "");
  if (h.length === 8) h = h.slice(2);
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`;
const rand = (min, max) => min + Math.random() * (max - min);

class EffectsEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.animId = null;
    this.active = new Set();
    this.state = {};
    this.width = 0;
    this.height = 0;
    this.mouse = { x: -9999, y: -9999 };
    this.colors = null;
    this._resize = this._resize.bind(this);
    this._loop = this._loop.bind(this);
    window.addEventListener("resize", this._resize);
    window.addEventListener("mousemove", (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    document.addEventListener("mouseleave", () => { this.mouse.x = -9999; this.mouse.y = -9999; });
    this._resize();
  }

  // Colors are read live by the draw functions, so changing the accent recolors effects without resetting them.
  setPalette(p) {
    const c = (k) => hexToRgb(p[k]);
    this.colors = {
      primary: c("primary"), secondary: c("secondary"), tertiary: c("tertiary"),
      primaryContainer: c("primaryContainer"), tertiaryContainer: c("tertiaryContainer"),
      inversePrimary: c("inversePrimary"), onSurface: c("onSurface"),
    };
    this.colors.mix = [
      this.colors.primary, this.colors.secondary, this.colors.tertiary,
      this.colors.primaryContainer, this.colors.tertiaryContainer, this.colors.inversePrimary,
    ];
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  isActive(n) { return this.active.has(n); }

  enable(n) {
    if (this.active.has(n)) return;
    this.active.add(n);
    this._init(n);
    if (!this.animId) this.animId = requestAnimationFrame(this._loop);
  }

  disable(n) {
    if (!this.active.has(n)) return;
    this.active.delete(n);
    delete this.state[n];
    if (this.active.size === 0 && this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  toggle(n) {
    if (this.isActive(n)) this.disable(n); else this.enable(n);
    return this.isActive(n);
  }

  burst(n, ...args) {
    this._init(n, true, ...args);
    this.active.add(n);
    if (!this.animId) this.animId = requestAnimationFrame(this._loop);
  }

  _init(name, isBurst, ...args) {
    const W = this.width, H = this.height;
    const mixLen = 6;

    if (name === "snow") {
      this.state.snow = Array.from({ length: 110 }, () => {
        const z = Math.random(); // depth: 0 far .. 1 near
        return {
          x: Math.random() * W, y: Math.random() * H, z,
          r: 0.6 + z * 2.8,
          speed: 0.3 + z * 1.3,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: rand(0.005, 0.02),
          opacity: 0.25 + z * 0.7,
        };
      });
    }
    else if (name === "rain") {
      const drops = Array.from({ length: 130 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        len: rand(8, 22), speed: rand(8, 15), opacity: rand(0.15, 0.5),
      }));
      this.state.rain = { drops, splashes: [] };
    }
    else if (name === "stars") {
      const pts = Array.from({ length: 200 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: rand(0.3, 1.5), baseA: rand(0.3, 0.8),
        phase: Math.random() * Math.PI * 2,
      }));
      this.state.stars = { pts, t: 0, meteors: [] };
    }
    else if (name === "aurora") {
      this.state.aurora = { t: 0 };
    }
    else if (name === "bubbles") {
      this.state.bubbles = Array.from({ length: 25 }, () => ({
        x: Math.random() * W, y: H + Math.random() * H,
        r: rand(6, 24), speed: rand(0.3, 1.1),
        wobble: Math.random() * Math.PI * 2, wobbleSpeed: rand(0.01, 0.04),
        ci: Math.floor(Math.random() * mixLen), opacity: rand(0.3, 0.7),
      }));
    }
    else if (name === "fireflies") {
      this.state.fireflies = Array.from({ length: 30 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: 0, vy: 0,
        tx: Math.random() * W, ty: Math.random() * H,
        phase: Math.random() * Math.PI * 2, phaseSpeed: rand(0.02, 0.06),
      }));
    }
    else if (name === "liquid") {
      this.state.liquid = { t: 0 };
    }
    else if (name === "constellation") {
      this.state.constellation = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
        r: rand(1, 2.2),
      }));
    }
    else if (name === "sakura") {
      this.state.sakura = Array.from({ length: 34 }, () => this._newPetal(W, H, true));
    }
    else if (name === "matrix") {
      const size = 14;
      const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF";
      const cols = Math.ceil(W / size);
      const columns = Array.from({ length: cols }, (_, i) => ({
        x: i * size,
        y: rand(-H, H),
        speed: rand(1.2, 3.5),
        len: Math.floor(rand(6, 20)),
        chars: Array.from({ length: 24 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]),
      }));
      this.state.matrix = { columns, size, glyphs };
    }
    else if (name === "waves") {
      this.state.waves = { t: 0 };
    }
    else if (name === "confetti") {
      const cx = isBurst ? args[0] : W / 2;
      const cy = isBurst ? args[1] : H / 2;
      this.state.confetti = Array.from({ length: 220 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(4, 13);
        return {
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5,
          size: rand(3, 8),
          shape: Math.floor(Math.random() * 3), // 0 rect, 1 circle, 2 ribbon
          rot: Math.random() * Math.PI,
          rotSpeed: rand(-0.2, 0.2),
          tilt: Math.random() * Math.PI,
          ci: Math.floor(Math.random() * mixLen),
          life: 0,
          maxLife: rand(90, 160),
        };
      });
    }
  }

  _newPetal(W, H, anywhere) {
    return {
      x: Math.random() * W * 1.2 - W * 0.1,
      y: anywhere ? Math.random() * H : -20,
      size: rand(5, 10),
      speed: rand(0.5, 1.3),
      drift: rand(0.3, 1.0),
      rot: Math.random() * Math.PI * 2,
      rotSpeed: rand(-0.03, 0.03),
      flip: Math.random() * Math.PI * 2,
      flipSpeed: rand(0.02, 0.06),
      sway: Math.random() * Math.PI * 2,
      ci: Math.random() < 0.6 ? 4 : 2, // tertiaryContainer / tertiary
      opacity: rand(0.55, 0.9),
    };
  }

  _loop() {
    const ctx = this.ctx;
    const W = this.width, H = this.height;
    ctx.clearRect(0, 0, W, H);
    for (const name of this.active) {
      const fn = this["_draw" + name[0].toUpperCase() + name.slice(1)];
      if (fn && this.state[name]) {
        ctx.save();
        fn.call(this, ctx, W, H);
        ctx.restore();
      }
    }
    this.animId = requestAnimationFrame(this._loop);
  }

  _drawSnow(ctx, W, H) {
    ctx.fillStyle = "#fff";
    for (const s of this.state.snow) {
      s.sway += s.swaySpeed;
      s.y += s.speed;
      s.x += Math.sin(s.sway) * (0.2 + s.z * 0.5) + (this.mouse.x > 0 ? (this.mouse.x - W / 2) * 0.0006 * s.z : 0);
      if (s.y > H + s.r) { s.y = -s.r; s.x = Math.random() * W; }
      if (s.x > W + s.r) s.x = -s.r;
      if (s.x < -s.r) s.x = W + s.r;
      ctx.globalAlpha = s.opacity;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _drawRain(ctx, W, H) {
    const s = this.state.rain;
    const c = this.colors.primary;
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    for (const d of s.drops) {
      d.y += d.speed; d.x -= 1.4;
      if (d.y > H) {
        if (Math.random() < 0.4) s.splashes.push({ x: d.x, y: H - 2, r: 0, life: 0 });
        d.y = -d.len; d.x = Math.random() * (W + 80);
      }
      const grad = ctx.createLinearGradient(d.x, d.y, d.x - 4, d.y + d.len);
      grad.addColorStop(0, rgba(c, 0));
      grad.addColorStop(1, `rgba(200,225,255,${d.opacity})`);
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 4, d.y + d.len);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(200,225,255,1)";
    for (let i = s.splashes.length - 1; i >= 0; i--) {
      const sp = s.splashes[i];
      sp.r += 0.6; sp.life++;
      ctx.globalAlpha = Math.max(0, 0.5 - sp.life * 0.04);
      ctx.beginPath();
      ctx.ellipse(sp.x, sp.y, sp.r, sp.r * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (sp.life > 12) s.splashes.splice(i, 1);
    }
  }

  _drawStars(ctx, W, H) {
    const s = this.state.stars;
    s.t += 0.02;
    const c = this.colors.onSurface;
    for (const p of s.pts) {
      const a = p.baseA + Math.sin(s.t + p.phase) * 0.4;
      ctx.fillStyle = rgba(c, Math.max(0, Math.min(1, a)));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (Math.random() < 0.006 && s.meteors.length < 2) {
      s.meteors.push({ x: rand(W * 0.2, W * 1.1), y: rand(-20, H * 0.4), v: rand(7, 11), life: 0, max: rand(40, 70) });
    }
    const pc = this.colors.primary;
    ctx.lineCap = "round";
    for (let i = s.meteors.length - 1; i >= 0; i--) {
      const m = s.meteors[i];
      m.x -= m.v; m.y += m.v * 0.45; m.life++;
      const fade = Math.sin((m.life / m.max) * Math.PI);
      const tailX = m.x + m.v * 9, tailY = m.y - m.v * 9 * 0.45;
      const g = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      g.addColorStop(0, `rgba(255,255,255,${fade})`);
      g.addColorStop(0.3, rgba(pc, fade * 0.6));
      g.addColorStop(1, rgba(pc, 0));
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      if (m.life >= m.max) s.meteors.splice(i, 1);
    }
  }

  _drawAurora(ctx, W, H) {
    const s = this.state.aurora;
    s.t += 0.008;
    const { primary, tertiary, secondary } = this.colors;
    const colors = [primary, tertiary, secondary, primary];
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 4; i++) {
      const rgb = colors[i];
      const yBase = H * 0.2 + i * 50;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 8) {
        const y = yBase + Math.sin(x * 0.005 + s.t + i) * 60 + Math.cos(x * 0.002 - s.t * 0.5) * 40;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, yBase - 80, 0, H);
      grad.addColorStop(0, rgba(rgb, 0));
      grad.addColorStop(0.4, rgba(rgb, 0.22));
      grad.addColorStop(1, rgba(rgb, 0));
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  _drawBubbles(ctx, W, H) {
    const mix = this.colors.mix;
    for (const b of this.state.bubbles) {
      b.y -= b.speed;
      b.wobble += b.wobbleSpeed;
      let x = b.x + Math.sin(b.wobble) * 12;
      // gently pushed away from the cursor
      const dx = x - this.mouse.x, dy = b.y - this.mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 90) { b.x += (dx / dist) * 1.5; x = b.x + Math.sin(b.wobble) * 12; }
      if (b.y + b.r < 0) { b.y = H + b.r; b.x = Math.random() * W; }
      const rgb = mix[b.ci];
      const grad = ctx.createRadialGradient(x - b.r * 0.35, b.y - b.r * 0.35, 1, x, b.y, b.r);
      grad.addColorStop(0, `rgba(255,255,255,${b.opacity * 0.9})`);
      grad.addColorStop(0.3, rgba(rgb, b.opacity * 0.6));
      grad.addColorStop(1, rgba(rgb, 0.05));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${b.opacity * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  _drawFireflies(ctx, W, H) {
    const rgb = this.colors.tertiary;
    ctx.globalCompositeOperation = "lighter";
    for (const f of this.state.fireflies) {
      f.phase += f.phaseSpeed;
      f.vx += (f.tx - f.x) * 0.0008;
      f.vy += (f.ty - f.y) * 0.0008;
      f.vx *= 0.96; f.vy *= 0.96;
      f.x += f.vx + Math.cos(f.phase) * 0.4;
      f.y += f.vy + Math.sin(f.phase) * 0.4;
      if (Math.random() < 0.005) { f.tx = Math.random() * W; f.ty = Math.random() * H; }
      const a = 0.5 + Math.sin(f.phase * 2) * 0.5;
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 16);
      grad.addColorStop(0, `rgba(255,255,255,${a})`);
      grad.addColorStop(0.15, rgba(rgb, a));
      grad.addColorStop(0.5, rgba(rgb, a * 0.3));
      grad.addColorStop(1, rgba(rgb, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _drawLiquid(ctx, W, H) {
    const s = this.state.liquid;
    s.t += 0.01;
    const { primary: a, tertiary: b, secondary: c } = this.colors;
    const blob = (x, y, r, col, alpha) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(col, alpha));
      g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };
    blob(W * 0.3 + Math.sin(s.t) * 60, H * 0.3 + Math.cos(s.t * 1.3) * 40, W * 0.6, a, 0.35);
    blob(W * 0.7 + Math.cos(s.t * 0.8) * 70, H * 0.7 + Math.sin(s.t * 1.1) * 50, W * 0.5, b, 0.3);
    blob(W / 2 + Math.sin(s.t * 0.5) * 80, H / 2, W * 0.4, c, 0.2);
  }

  _drawConstellation(ctx, W, H) {
    const pts = this.state.constellation;
    const c = this.colors.primary;
    const LINK = 110, MOUSE = 150;
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = this.mouse.x - p.x, dy = this.mouse.y - p.y;
      const d = Math.hypot(dx, dy);
      if (d < MOUSE && d > 1) { p.x += dx / d * 0.35; p.y += dy / d * 0.35; }
    }
    ctx.lineWidth = 0.8;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = rgba(c, (1 - d / LINK) * 0.45);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - this.mouse.x, a.y - this.mouse.y);
      if (dm < MOUSE) {
        ctx.strokeStyle = rgba(this.colors.tertiary, (1 - dm / MOUSE) * 0.7);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(this.mouse.x, this.mouse.y); ctx.stroke();
      }
      ctx.fillStyle = rgba(c, 0.9);
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  _drawSakura(ctx, W, H) {
    const petals = this.state.sakura;
    const mix = this.colors.mix;
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.sway += 0.015;
      p.y += p.speed;
      p.x += p.drift + Math.sin(p.sway) * 0.6;
      p.rot += p.rotSpeed;
      p.flip += p.flipSpeed;
      if (p.y > H + 20 || p.x > W + 30) { petals[i] = this._newPetal(W, H, false); continue; }
      const col = mix[p.ci];
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.8 + 0.2);
      const s = p.size;
      const g = ctx.createLinearGradient(-s, 0, s, 0);
      g.addColorStop(0, `rgba(255,255,255,${p.opacity})`);
      g.addColorStop(1, rgba(col, p.opacity));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-s, 0);
      ctx.bezierCurveTo(-s * 0.4, -s * 0.9, s * 0.6, -s * 0.7, s, 0);
      ctx.bezierCurveTo(s * 0.6, s * 0.7, -s * 0.4, s * 0.9, -s, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  _drawMatrix(ctx, W, H) {
    const m = this.state.matrix;
    const c = this.colors.primary;
    ctx.font = `${m.size}px monospace`;
    ctx.textBaseline = "top";
    for (const col of m.columns) {
      col.y += col.speed;
      if (col.y - col.len * m.size > H) {
        col.y = rand(-H * 0.5, 0);
        col.speed = rand(1.2, 3.5);
      }
      if (Math.random() < 0.05) {
        col.chars[Math.floor(Math.random() * col.chars.length)] = m.glyphs[Math.floor(Math.random() * m.glyphs.length)];
      }
      const headRow = Math.floor(col.y / m.size);
      for (let k = 0; k < col.len; k++) {
        const row = headRow - k;
        const y = row * m.size;
        if (y < -m.size || y > H) continue;
        const ch = col.chars[((row % col.chars.length) + col.chars.length) % col.chars.length];
        if (k === 0) ctx.fillStyle = "rgba(255,255,255,0.75)";
        else ctx.fillStyle = rgba(c, (1 - k / col.len) * 0.45);
        ctx.fillText(ch, col.x, y);
      }
    }
  }

  _drawWaves(ctx, W, H) {
    const s = this.state.waves;
    s.t += 0.015;
    const { primary, tertiary, secondary } = this.colors;
    const layers = [
      { c: secondary, amp: 14, len: 0.012, speed: 0.6, base: H - 90, a: 0.14 },
      { c: tertiary, amp: 18, len: 0.009, speed: -0.8, base: H - 65, a: 0.18 },
      { c: primary, amp: 12, len: 0.015, speed: 1.1, base: H - 40, a: 0.24 },
    ];
    for (const L of layers) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 6) {
        const y = L.base + Math.sin(x * L.len + s.t * L.speed) * L.amp + Math.sin(x * L.len * 2.3 - s.t) * L.amp * 0.3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, L.base - L.amp, 0, H);
      g.addColorStop(0, rgba(L.c, L.a));
      g.addColorStop(1, rgba(L.c, 0.02));
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  _drawConfetti(ctx) {
    const arr = this.state.confetti;
    const mix = this.colors.mix;
    let alive = false;
    for (const p of arr) {
      p.vy += 0.25; p.vx *= 0.99; p.vy *= 0.99;
      p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed; p.tilt += 0.1; p.life++;
      if (p.life < p.maxLife) alive = true; else continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.fillStyle = rgba(mix[p.ci], 1);
      if (p.shape === 0) {
        ctx.scale(1, Math.cos(p.tilt));
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === 1) {
        ctx.beginPath(); ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-p.size, 0);
        ctx.quadraticCurveTo(0, Math.sin(p.tilt) * p.size, p.size, 0);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (!alive) this.disable("confetti");
  }
}

const ACCENT_PRESETS = [
  "#6750A4", "#0061A4", "#386A20", "#984061",
  "#7D5260", "#B3261E", "#00696D", "#7B5800",
  "#5B5F97", "#A03B5E", "#1E6F50", "#7A4F00",
];

// Circular color reveal from (x, y) when the accent changes.
function withReveal(x, y, update) {
  if (!document.startViewTransition || reducedMotion) { update(); return; }
  const root = document.documentElement;
  root.classList.add("vt-running");
  const vt = document.startViewTransition(update);
  vt.ready.then(() => {
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(0.2, 0, 0, 1)", pseudoElement: "::view-transition-new(root)" }
    );
  }).catch(() => {});
  vt.finished.finally(() => root.classList.remove("vt-running"));
}

function centerOf(el) {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}

function buildAccentPicker(onPick) {
  const row = document.getElementById("accentRow");
  row.innerHTML = "";
  ACCENT_PRESETS.forEach(hex => {
    const sw = document.createElement("div");
    sw.className = "accent-swatch";
    sw.style.background = hex;
    sw.style.setProperty("--accent-glow", hex);
    sw.dataset.color = hex;
    sw.title = hex;
    sw.addEventListener("click", () => onPick(hex, ...centerOf(sw)));
    row.appendChild(sw);
  });
  const randBtn = document.createElement("button");
  randBtn.className = "accent-random";
  randBtn.title = "Random";
  randBtn.innerHTML = '<span class="material-symbols-rounded">shuffle</span>';
  randBtn.addEventListener("click", () => {
    const hct = Hct.from(Math.floor(Math.random() * 360), 35 + Math.random() * 35, 50);
    onPick(argbToHex(hct.toInt()), ...centerOf(randBtn));
  });
  row.appendChild(randBtn);
}

function setAccentActive(hex) {
  document.querySelectorAll(".accent-swatch").forEach(s => {
    s.classList.toggle("active", !!s.dataset.color && s.dataset.color.toLowerCase() === (hex || "").toLowerCase());
  });
}

let snackbarTimer = null;
function showSnackbar(text, icon = "check_circle") {
  const sb = document.getElementById("snackbar");
  document.getElementById("snackbarText").textContent = text;
  sb.querySelector(".material-symbols-rounded").textContent = icon;
  sb.classList.remove("show");
  void sb.offsetWidth; // restart the icon animation
  sb.classList.add("show");
  if (snackbarTimer) clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() => sb.classList.remove("show"), 2400);
}

function attachRipples() {
  const selector = ".md-fab, .md-icon-btn, .md-list-item, .md-segmented button, .accent-random, .snackbar-action, .field-action";
  document.addEventListener("pointerdown", (e) => {
    const host = e.target.closest(selector);
    if (!host || reducedMotion) return;
    const rect = host.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
    ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
    host.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

function normalizeUrl(value) {
  let v = value.trim();
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  return v;
}

function hostFromInput(value) {
  const v = normalizeUrl(value);
  if (!v) return null;
  try {
    const host = new URL(v).hostname;
    return host.includes(".") || host === "localhost" ? host : null;
  } catch { return null; }
}

function isValidUrl(value) {
  if (!value.trim()) return true;
  return hostFromInput(value) !== null;
}

document.addEventListener("DOMContentLoaded", () => {
  const site1Input = document.getElementById("site1");
  const site2Input = document.getElementById("site2");
  const customTitleInput = document.getElementById("customTitle");
  const enabledCheckbox = document.getElementById("enabled");
  const saveBtn = document.getElementById("saveBtn");
  const btnText = document.getElementById("btnText");
  const langSegmented = document.getElementById("langSegmented");
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsPanel = document.getElementById("settingsPanel");
  const appCard = document.getElementById("appCard");
  const glassToggle = document.getElementById("glassToggle");
  const snowCanvas = document.getElementById("snowCanvas");
  const snackbarAction = document.getElementById("snackbarAction");
  const statusChip = document.getElementById("statusChip");
  const enableRow = document.getElementById("enableRow");
  const draftHint = document.getElementById("draftHint");
  const flow = document.getElementById("flow");
  const logoImg = document.getElementById("logoImg");

  logoImg.addEventListener("error", () => { logoImg.style.display = "none"; });

  buildEffectsList();
  attachRipples();

  const engine = new EffectsEngine(snowCanvas);

  // Last values written by "Save"; anything different is an unsaved draft.
  let saved = { site1: "", site2: "", customTitle: "", enabled: false };

  const currentForm = () => ({
    site1: site1Input.value,
    site2: site2Input.value,
    customTitle: customTitleInput.value,
    enabled: enabledCheckbox.checked,
  });

  const isDirty = () => {
    const f = currentForm();
    return normalizeUrl(f.site1) !== saved.site1 || normalizeUrl(f.site2) !== saved.site2 ||
      f.customTitle.trim() !== saved.customTitle || f.enabled !== saved.enabled;
  };

  // The popup is destroyed as soon as it loses focus (e.g. when the user goes to copy the second URL),
  // so every edit is persisted immediately as a draft and restored on the next open.
  function persistDraft() {
    const dirty = isDirty();
    browser.storage.local.set({ draft: dirty ? currentForm() : null });
    renderDirty(dirty);
  }

  function renderDirty(dirty = isDirty()) {
    saveBtn.classList.toggle("is-dirty", dirty);
    draftHint.classList.toggle("show", dirty);
  }

  function renderStatus() {
    const on = !!(saved.enabled && saved.site1 && saved.site2);
    statusChip.classList.toggle("on", on);
    document.getElementById("statusText").textContent = on ? t("statusOn") : t("statusOff");
    enableRow.classList.toggle("on", enabledCheckbox.checked);
  }

  function updateLangButtons() {
    let active = null;
    langSegmented.querySelectorAll("button").forEach(b => {
      const on = b.dataset.lang === currentLang;
      b.classList.toggle("active", on);
      if (on) active = b;
    });
    const indicator = langSegmented.querySelector(".seg-indicator");
    if (active && indicator) {
      indicator.style.left = active.offsetLeft + "px";
      indicator.style.width = active.offsetWidth + "px";
    }
  }
  // Place the indicator without animating, then enable the slide; re-measure once fonts arrive.
  updateLangButtons();
  requestAnimationFrame(() => langSegmented.classList.add("ready"));
  if (document.fonts) document.fonts.ready.then(updateLangButtons);

  // Confetti is a "fire on save" option, not a continuous effect, so it is tracked separately.
  let confettiOn = false;
  const isEffectOn = (name) => name === "confetti" ? confettiOn : engine.isActive(name);

  function updateEffectSwitches() {
    document.querySelectorAll("[data-effect-input]").forEach(inp => {
      inp.checked = isEffectOn(inp.dataset.effectInput);
      inp.closest(".md-list-item").classList.toggle("on", inp.checked);
    });
  }

  function setGlass(on) {
    appCard.classList.toggle("glass", on);
    glassToggle.checked = on;
    glassToggle.closest(".md-list-item").classList.toggle("on", on);
  }

  function persistEffects() {
    const active = Array.from(engine.active).filter(n => n !== "confetti");
    if (confettiOn) active.push("confetti");
    browser.storage.local.set({ activeEffects: active });
  }

  function applyAccent(hex) {
    const p = generatePalette(hex);
    applyPalette(p);
    engine.setPalette(p);
    setAccentActive(hex);
  }

  buildAccentPicker((hex, x, y) => {
    withReveal(x, y, () => applyAccent(hex));
    browser.storage.local.set({ accent: hex });
  });

  // ---------- fields, favicons, flow diagram ----------
  const favTimers = {};
  function updateFavicon(id) {
    const slot = document.querySelector(`[data-fav-for="${id}"]`);
    const img = slot.querySelector("img");
    const host = hostFromInput(document.getElementById(id).value);
    if (!host) { slot.classList.remove("has-fav"); img.removeAttribute("src"); return; }
    const src = `https://${host}/favicon.ico`;
    if (img.getAttribute("src") === src) return;
    slot.classList.remove("has-fav");
    img.onload = () => slot.classList.add("has-fav");
    img.onerror = () => slot.classList.remove("has-fav");
    img.src = src;
  }

  function updateFlowNode(n, value) {
    const hostEl = document.getElementById("flowHost" + n);
    const fav = document.getElementById("flowFav" + n);
    const host = hostFromInput(value);
    const text = host || "—";
    if (hostEl.textContent !== text) {
      hostEl.textContent = text;
      hostEl.classList.toggle("empty", !host);
      hostEl.classList.remove("bump"); void hostEl.offsetWidth; hostEl.classList.add("bump");
    }
    const fallbackIcon = n === 1 ? "public" : "link";
    const src = host ? `https://${host}/favicon.ico` : null;
    const img = fav.querySelector("img");
    if (!src) {
      fav.replaceChildren(iconEl(fallbackIcon));
    } else if (!img || img.getAttribute("src") !== src) {
      const next = new Image();
      next.onload = () => fav.replaceChildren(next);
      next.onerror = () => fav.replaceChildren(iconEl(fallbackIcon));
      next.src = src;
    }
  }

  function updateFlow() {
    updateFlowNode(1, site1Input.value);
    updateFlowNode(2, site2Input.value);
    flow.classList.toggle("active", !!(hostFromInput(site1Input.value) && hostFromInput(site2Input.value)));
  }

  function syncFloatingLabel(inp) {
    const field = inp.closest(".md-outlined-field");
    if (field) field.classList.toggle("is-floating", inp.value.length > 0);
  }

  function onFieldChanged(inp) {
    syncFloatingLabel(inp);
    inp.closest(".md-outlined-field").classList.remove("error");
    if (inp === site1Input || inp === site2Input) {
      clearTimeout(favTimers[inp.id]);
      favTimers[inp.id] = setTimeout(() => updateFavicon(inp.id), 350);
      updateFlow();
    }
    persistDraft();
  }

  [site1Input, site2Input, customTitleInput].forEach(inp => {
    inp.addEventListener("input", () => onFieldChanged(inp));
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") save(); });
  });

  function fillField(inp, value) {
    inp.value = value;
    onFieldChanged(inp);
    inp.focus();
  }

  document.querySelectorAll("[data-paste-for]").forEach(btn => {
    btn.title = "Paste";
    btn.addEventListener("click", async () => {
      const inp = document.getElementById(btn.dataset.pasteFor);
      try {
        const text = (await navigator.clipboard.readText()).trim();
        if (text) fillField(inp, text);
      } catch {
        inp.focus();
        showSnackbar(t("pasteFailed"), "content_paste_off");
      }
    });
  });

  document.querySelectorAll("[data-tab-for]").forEach(btn => {
    btn.title = "Current tab";
    btn.addEventListener("click", async () => {
      const inp = document.getElementById(btn.dataset.tabFor);
      try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.url && /^https?:/.test(tab.url)) {
          const u = new URL(tab.url);
          fillField(inp, u.origin + u.pathname.replace(/\/$/, ""));
          showSnackbar(t("tabFilled"), "tab");
        }
      } catch { /* no access to this tab */ }
    });
  });

  enableRow.addEventListener("click", (e) => {
    if (!e.target.closest(".md-switch")) enabledCheckbox.click();
  });

  enabledCheckbox.addEventListener("change", () => {
    renderStatus();
    persistDraft();
  });

  // ---------- initial load ----------
  browser.storage.local.get([
    "site1", "site2", "enabled", "lang", "customTitle",
    "snowMode", "activeEffects", "accent", "glassMode", "draft",
  ]).then((data) => {
    saved = {
      site1: data.site1 || "",
      site2: data.site2 || "",
      customTitle: data.customTitle || "",
      enabled: !!data.enabled,
    };
    const form = { ...saved, ...(data.draft || {}) };
    site1Input.value = form.site1;
    site2Input.value = form.site2;
    customTitleInput.value = form.customTitle;
    enabledCheckbox.checked = !!form.enabled;
    if (data.lang) currentLang = data.lang;

    const accent = data.accent || ACCENT_PRESETS[0];
    applyAccent(accent);

    let effects = [];
    if (Array.isArray(data.activeEffects)) effects = data.activeEffects;
    else if (data.snowMode) effects = ["snow"];
    confettiOn = effects.includes("confetti");
    effects.filter(e => e !== "confetti").forEach(e => engine.enable(e));

    setGlass(!!data.glassMode);
    applyLang();
    updateLangButtons();
    updateEffectSwitches();
    [site1Input, site2Input, customTitleInput].forEach(syncFloatingLabel);
    updateFavicon("site1");
    updateFavicon("site2");
    updateFlow();
    renderStatus();
    renderDirty();
  });

  langSegmented.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-lang]");
    if (!btn || btn.dataset.lang === currentLang) return;
    currentLang = btn.dataset.lang;
    browser.storage.local.set({ lang: currentLang });
    applyLang();
    updateLangButtons();
    renderStatus();
  });

  // ---------- settings panel ----------
  let settingsOpen = false;
  function openSettings() {
    if (settingsOpen) return;
    settingsOpen = true;
    // offsetLeft/Top ignore the panel's current scale transform, unlike getBoundingClientRect.
    const btnRect = settingsBtn.getBoundingClientRect();
    const cardRect = appCard.getBoundingClientRect();
    const startX = btnRect.left + btnRect.width / 2 - cardRect.left - settingsPanel.offsetLeft;
    const startY = btnRect.top + btnRect.height / 2 - cardRect.top - settingsPanel.offsetTop;
    settingsPanel.style.transformOrigin = `${startX}px ${startY}px`;
    settingsPanel.classList.add("open");
    settingsBtn.classList.add("is-on");
  }
  function closeSettings() {
    if (!settingsOpen) return;
    settingsOpen = false;
    settingsPanel.classList.remove("open");
    settingsBtn.classList.remove("is-on");
  }

  settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (settingsOpen) closeSettings(); else openSettings();
  });

  document.addEventListener("click", (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) closeSettings();
  });

  // Whole list rows toggle their switch, not just the switch itself.
  document.querySelectorAll("[data-toggle-row]").forEach(row => {
    row.addEventListener("click", (e) => {
      if (e.target.closest(".md-switch")) return;
      row.querySelector(".md-switch input").click();
    });
  });

  document.querySelectorAll("[data-effect-input]").forEach(inp => {
    inp.addEventListener("change", () => {
      const name = inp.dataset.effectInput;
      if (name === "confetti") {
        confettiOn = inp.checked;
        if (confettiOn) engine.burst("confetti", ...centerOf(inp.closest(".md-switch")));
      } else {
        engine.toggle(name);
      }
      inp.closest(".md-list-item").classList.toggle("on", inp.checked);
      persistEffects();
    });
  });

  glassToggle.addEventListener("change", () => {
    setGlass(glassToggle.checked);
    browser.storage.local.set({ glassMode: glassToggle.checked });
  });

  // ---------- save ----------
  function save() {
    const fields = [site1Input, site2Input];
    const invalid = fields.filter(inp => !isValidUrl(inp.value));
    if (invalid.length) {
      invalid.forEach(inp => {
        const field = inp.closest(".md-outlined-field");
        field.classList.remove("error"); void field.offsetWidth; field.classList.add("error");
      });
      invalid[0].focus();
      showSnackbar(t("invalidUrl"), "error");
      return;
    }

    const site1 = normalizeUrl(site1Input.value);
    const site2 = normalizeUrl(site2Input.value);
    const customTitle = customTitleInput.value.trim();
    const enabled = enabledCheckbox.checked;
    site1Input.value = site1;
    site2Input.value = site2;
    customTitleInput.value = customTitle;

    saveBtn.classList.add("is-saving");
    const fabIcon = saveBtn.querySelector(".fab-icon");
    btnText.textContent = t("saved");
    if (fabIcon) fabIcon.textContent = "check";

    if (confettiOn) engine.burst("confetti", ...centerOf(saveBtn));

    browser.storage.local.set({ site1, site2, enabled, customTitle, draft: null }).then(() => {
      saved = { site1, site2, customTitle, enabled };
      renderDirty(false);
      renderStatus();
      showSnackbar(t("saved"));
      setTimeout(() => {
        saveBtn.classList.remove("is-saving");
        btnText.textContent = t("btnText");
        if (fabIcon) fabIcon.textContent = "bolt";
      }, 1500);
      browser.runtime.sendMessage({ action: "updateRules" }).catch(() => {});
    });
  }

  saveBtn.addEventListener("click", save);
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); }
    if (e.key === "Escape") closeSettings();
  });

  snackbarAction.addEventListener("click", () => {
    document.getElementById("snackbar").classList.remove("show");
  });

  // ---------- pointer-driven ambience ----------
  const blobs = document.querySelectorAll(".blob");
  document.body.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const mx = (e.clientX - cx) * 0.04;
    const my = (e.clientY - cy) * 0.04;
    blobs[0].style.transform = `translate(${mx}px, ${my}px)`;
    blobs[1].style.transform = `translate(${-mx * 0.7}px, ${-my * 0.7}px)`;
    blobs[2].style.transform = `translate(calc(-50% + ${mx * 0.5}px), calc(-50% + ${my * 0.5}px))`;

    const r = appCard.getBoundingClientRect();
    appCard.style.setProperty("--mx", (e.clientX - r.left) + "px");
    appCard.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
  appCard.addEventListener("mouseenter", () => appCard.classList.add("is-hovered"));
  appCard.addEventListener("mouseleave", () => appCard.classList.remove("is-hovered"));
});
