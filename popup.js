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
    snowLabel: "Snow mode", snowSub: "Снегопад на фоне",
    rainLabel: "Rain mode", rainSub: "Косые капли со всплесками",
    starsLabel: "Stars mode", starsSub: "Мерцающие звёзды",
    auroraLabel: "Aurora mode", auroraSub: "Северное сияние",
    bubblesLabel: "Bubbles mode", bubblesSub: "Всплывающие пузыри",
    firefliesLabel: "Fireflies mode", firefliesSub: "Светлячки в темноте",
    liquidLabel: "Liquid mode", liquidSub: "Анимированный градиент",
    confettiLabel: "Confetti on save", confettiSub: "Салют при сохранении",
    accentLabel: "Цвет темы", accentSub: "Material You",
    glassLabel: "Glass mode", glassSub: "Размытие фона",
    actionClose: "Закрыть", actionUndo: "Отменить",
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
    snowLabel: "Snow mode", snowSub: "Snowfall on background",
    rainLabel: "Rain mode", rainSub: "Slanted drops with splashes",
    starsLabel: "Stars mode", starsSub: "Twinkling stars",
    auroraLabel: "Aurora mode", auroraSub: "Northern lights",
    bubblesLabel: "Bubbles mode", bubblesSub: "Floating bubbles",
    firefliesLabel: "Fireflies mode", firefliesSub: "Glowing fireflies",
    liquidLabel: "Liquid mode", liquidSub: "Animated gradient",
    confettiLabel: "Confetti on save", confettiSub: "Fireworks on save",
    accentLabel: "Theme color", accentSub: "Material You",
    glassLabel: "Glass mode", glassSub: "Background blur",
    actionClose: "Close", actionUndo: "Undo",
  }
};

const browserLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
let currentLang = browserLang.startsWith("ru") ? "ru" : "en";
const t = (k) => dict[currentLang][k] || k;

function applyLang() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
  set("t-headline", t("headline"));
  setHTML("t-title", t("title"));
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
  set("t-snowLabel", t("snowLabel")); set("t-snowSub", t("snowSub"));
  set("t-rainLabel", t("rainLabel")); set("t-rainSub", t("rainSub"));
  set("t-starsLabel", t("starsLabel")); set("t-starsSub", t("starsSub"));
  set("t-auroraLabel", t("auroraLabel")); set("t-auroraSub", t("auroraSub"));
  set("t-bubblesLabel", t("bubblesLabel")); set("t-bubblesSub", t("bubblesSub"));
  set("t-firefliesLabel", t("firefliesLabel")); set("t-firefliesSub", t("firefliesSub"));
  set("t-liquidLabel", t("liquidLabel")); set("t-liquidSub", t("liquidSub"));
  set("t-confettiLabel", t("confettiLabel")); set("t-confettiSub", t("confettiSub"));
  set("t-accentLabel", t("accentLabel")); set("t-accentSub", t("accentSub"));
  set("t-glassLabel", t("glassLabel")); set("t-glassSub", t("glassSub"));
  set("snackbarActionText", t("actionClose"));
}

const mcu = window.materialColorUtilities;
const MDC = mcu.MaterialDynamicColors;
const Hct = mcu.Hct;
const hexToArgb = (hex) => mcu.argbFromHex(hex);
const argbToHex = (a) => mcu.hexFromArgb(a);

let currentScheme = null;
let currentPalette = null;
let currentHex = null;

function generatePalette(hex) {
  const hct = Hct.fromInt(hexToArgb(hex));
  currentScheme = new mcu.SchemeTonalSpot(hct, true, 0);
  currentHex = hex;
  currentPalette = {
    primary:           argbToHex(MDC.primary.getArgb(currentScheme)),
    onPrimary:         argbToHex(MDC.onPrimary.getArgb(currentScheme)),
    primaryContainer:  argbToHex(MDC.primaryContainer.getArgb(currentScheme)),
    onPrimaryContainer:argbToHex(MDC.onPrimaryContainer.getArgb(currentScheme)),
    secondary:         argbToHex(MDC.secondary.getArgb(currentScheme)),
    onSecondary:       argbToHex(MDC.onSecondary.getArgb(currentScheme)),
    secondaryContainer:argbToHex(MDC.secondaryContainer.getArgb(currentScheme)),
    onSecondaryContainer: argbToHex(MDC.onSecondaryContainer.getArgb(currentScheme)),
    tertiary:          argbToHex(MDC.tertiary.getArgb(currentScheme)),
    onTertiary:        argbToHex(MDC.onTertiary.getArgb(currentScheme)),
    tertiaryContainer: argbToHex(MDC.tertiaryContainer.getArgb(currentScheme)),
    onTertiaryContainer: argbToHex(MDC.onTertiaryContainer.getArgb(currentScheme)),
    error:             argbToHex(MDC.error.getArgb(currentScheme)),
    onError:           argbToHex(MDC.onError.getArgb(currentScheme)),
    background:        argbToHex(MDC.background.getArgb(currentScheme)),
    onBackground:      argbToHex(MDC.onBackground.getArgb(currentScheme)),
    surface:           argbToHex(MDC.surface.getArgb(currentScheme)),
    onSurface:         argbToHex(MDC.onSurface.getArgb(currentScheme)),
    surfaceVariant:    argbToHex(MDC.surfaceVariant.getArgb(currentScheme)),
    onSurfaceVariant:  argbToHex(MDC.onSurfaceVariant.getArgb(currentScheme)),
    surfaceDim:        argbToHex(MDC.surfaceDim.getArgb(currentScheme)),
    surfaceBright:     argbToHex(MDC.surfaceBright.getArgb(currentScheme)),
    surfaceContainerLowest:  argbToHex(MDC.surfaceContainerLowest.getArgb(currentScheme)),
    surfaceContainerLow:     argbToHex(MDC.surfaceContainerLow.getArgb(currentScheme)),
    surfaceContainer:        argbToHex(MDC.surfaceContainer.getArgb(currentScheme)),
    surfaceContainerHigh:    argbToHex(MDC.surfaceContainerHigh.getArgb(currentScheme)),
    surfaceContainerHighest: argbToHex(MDC.surfaceContainerHighest.getArgb(currentScheme)),
    outline:           argbToHex(MDC.outline.getArgb(currentScheme)),
    outlineVariant:    argbToHex(MDC.outlineVariant.getArgb(currentScheme)),
    inverseSurface:    argbToHex(MDC.inverseSurface.getArgb(currentScheme)),
    inverseOnSurface:  argbToHex(MDC.inverseOnSurface.getArgb(currentScheme)),
    inversePrimary:    argbToHex(MDC.inversePrimary.getArgb(currentScheme)),
    surfaceTint:       argbToHex(MDC.surfaceTint.getArgb(currentScheme)),
  };
  return currentPalette;
}

function applyPalette(p) {
  const r = document.documentElement;
  const set = (k, v) => r.style.setProperty(k, v);
  set("--md-sys-color-primary", p.primary);
  set("--md-sys-color-on-primary", p.onPrimary);
  set("--md-sys-color-primary-container", p.primaryContainer);
  set("--md-sys-color-on-primary-container", p.onPrimaryContainer);
  set("--md-sys-color-secondary", p.secondary);
  set("--md-sys-color-on-secondary", p.onSecondary);
  set("--md-sys-color-secondary-container", p.secondaryContainer);
  set("--md-sys-color-on-secondary-container", p.onSecondaryContainer);
  set("--md-sys-color-tertiary", p.tertiary);
  set("--md-sys-color-on-tertiary", p.onTertiary);
  set("--md-sys-color-tertiary-container", p.tertiaryContainer);
  set("--md-sys-color-on-tertiary-container", p.onTertiaryContainer);
  set("--md-sys-color-error", p.error);
  set("--md-sys-color-on-error", p.onError);
  set("--md-sys-color-background", p.background);
  set("--md-sys-color-on-background", p.onBackground);
  set("--md-sys-color-surface", p.surface);
  set("--md-sys-color-on-surface", p.onSurface);
  set("--md-sys-color-surface-variant", p.surfaceVariant);
  set("--md-sys-color-on-surface-variant", p.onSurfaceVariant);
  set("--md-sys-color-surface-dim", p.surfaceDim);
  set("--md-sys-color-surface-bright", p.surfaceBright);
  set("--md-sys-color-surface-container-lowest", p.surfaceContainerLowest);
  set("--md-sys-color-surface-container-low", p.surfaceContainerLow);
  set("--md-sys-color-surface-container", p.surfaceContainer);
  set("--md-sys-color-surface-container-high", p.surfaceContainerHigh);
  set("--md-sys-color-surface-container-highest", p.surfaceContainerHighest);
  set("--md-sys-color-outline", p.outline);
  set("--md-sys-color-outline-variant", p.outlineVariant);
  set("--md-sys-color-inverse-surface", p.inverseSurface);
  set("--md-sys-color-inverse-on-surface", p.inverseOnSurface);
  set("--md-sys-color-inverse-primary", p.inversePrimary);
  set("--md-sys-color-surface-tint", p.surfaceTint);
}

class EffectsEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.animId = null;
    this.active = new Set();
    this.state = {};
    this.width = 0;
    this.height = 0;
    this._resize = this._resize.bind(this);
    this._loop = this._loop.bind(this);
    window.addEventListener("resize", this._resize);
    this._resize();
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

  _paletteHexes() {
    const r = getComputedStyle(document.documentElement);
    const get = (k) => r.getPropertyValue(k).trim();
    return {
      primary:        get("--md-sys-color-primary"),
      onPrimary:      get("--md-sys-color-on-primary"),
      primaryContainer: get("--md-sys-color-primary-container"),
      secondary:      get("--md-sys-color-secondary"),
      secondaryContainer: get("--md-sys-color-secondary-container"),
      tertiary:       get("--md-sys-color-tertiary"),
      tertiaryContainer: get("--md-sys-color-tertiary-container"),
      surface:        get("--md-sys-color-surface"),
      onSurface:      get("--md-sys-color-on-surface"),
      surfaceContainer: get("--md-sys-color-surface-container"),
      surfaceContainerHigh: get("--md-sys-color-surface-container-high"),
      inversePrimary: get("--md-sys-color-inverse-primary"),
    };
  }

  _hexToRgb(hex) {
    if (!hex) return { r: 255, g: 255, b: 255 };
    let h = hex.replace("#", "");
    if (h.length === 8) h = h.slice(2);
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  _init(name, isBurst, ...args) {
    const W = this.width, H = this.height;
    const p = this._paletteHexes();

    if (name === "snow") {
      const arr = [];
      for (let i = 0; i < 80; i++) {
        arr.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          wind: Math.random() * 0.6 - 0.3,
          opacity: Math.random() * 0.5 + 0.4,
        });
      }
      this.state.snow = arr;
    }
    else if (name === "rain") {
      const arr = [];
      for (let i = 0; i < 120; i++) {
        arr.push({
          x: Math.random() * W, y: Math.random() * H,
          len: Math.random() * 14 + 8,
          speed: Math.random() * 6 + 8,
          opacity: Math.random() * 0.3 + 0.2,
        });
      }
      this.state.rain = { drops: arr, splashes: [] };
    }
    else if (name === "stars") {
      const arr = [];
      for (let i = 0; i < 200; i++) {
        arr.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.2 + 0.3,
          baseA: Math.random() * 0.5 + 0.3,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.04 + 0.01,
        });
      }
      this.state.stars = { pts: arr, t: 0, color: p.onSurface || "#FFFFFF" };
    }
    else if (name === "aurora") {
      this.state.aurora = { t: 0, p1: p.primary, p2: p.tertiary, p3: p.secondary };
    }
    else if (name === "bubbles") {
      const colors = [p.primary, p.secondary, p.tertiary, p.primaryContainer, p.tertiaryContainer].filter(Boolean);
      const arr = [];
      for (let i = 0; i < 25; i++) {
        arr.push({
          x: Math.random() * W,
          y: H + Math.random() * 100,
          r: Math.random() * 18 + 6,
          speed: Math.random() * 0.8 + 0.3,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.03 + 0.01,
          color: colors[Math.floor(Math.random() * colors.length)] || "#6750A4",
          opacity: Math.random() * 0.4 + 0.3,
        });
      }
      this.state.bubbles = arr;
    }
    else if (name === "fireflies") {
      const arr = [];
      for (let i = 0; i < 30; i++) {
        arr.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: 0, vy: 0,
          tx: Math.random() * W, ty: Math.random() * H,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: Math.random() * 0.04 + 0.02,
        });
      }
      this.state.fireflies = { arr, color: p.tertiary || p.primary || "#FFD740" };
    }
    else if (name === "liquid") {
      this.state.liquid = {
        t: 0,
        c1: p.primary, c2: p.tertiary, c3: p.secondary,
      };
    }
    else if (name === "confetti") {
      const colors = [p.primary, p.secondary, p.tertiary, p.inversePrimary, p.primaryContainer, p.tertiaryContainer]
        .filter(Boolean);
      const arr = [];
      const cx = isBurst ? args[0] : W / 2;
      const cy = isBurst ? args[1] : H / 2;
      for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        arr.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          g: 0.25,
          size: Math.random() * 4 + 3,
          rot: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)] || "#FF5252",
          life: 0,
          maxLife: 90 + Math.random() * 60,
        });
      }
      this.state.confetti = arr;
    }
  }

  _loop() {
    const ctx = this.ctx;
    const W = this.width, H = this.height;
    ctx.clearRect(0, 0, W, H);
    for (const name of this.active) {
      const fn = this["_draw" + name[0].toUpperCase() + name.slice(1)];
      if (fn) fn.call(this, ctx, W, H);
    }
    this.animId = requestAnimationFrame(this._loop);
  }

  _drawSnow(ctx, W, H) {
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    for (const s of this.state.snow) {
      s.y += s.speed; s.x += s.wind;
      if (s.y > H) { s.y = -s.r; s.x = Math.random() * W; }
      if (s.x > W) s.x = -s.r;
      if (s.x < -s.r) s.x = W;
      ctx.globalAlpha = s.opacity;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  _drawRain(ctx, W, H) {
    const s = this.state.rain;
    ctx.strokeStyle = "rgba(180,210,255,1)";
    ctx.lineWidth = 1;
    for (const d of s.drops) {
      d.y += d.speed; d.x -= 1.4;
      if (d.y > H) {
        if (Math.random() < 0.4) s.splashes.push({ x: d.x, y: H - 2, r: 0, life: 0 });
        d.y = -d.len; d.x = Math.random() * W + 40;
      }
      ctx.globalAlpha = d.opacity;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 4, d.y + d.len);
      ctx.stroke();
    }
    for (let i = s.splashes.length - 1; i >= 0; i--) {
      const sp = s.splashes[i];
      sp.r += 0.6; sp.life++;
      ctx.globalAlpha = Math.max(0, 0.5 - sp.life * 0.04);
      ctx.beginPath();
      ctx.ellipse(sp.x, sp.y, sp.r, sp.r * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (sp.life > 12) s.splashes.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }

  _drawStars(ctx, W, H) {
    const s = this.state.stars;
    s.t += 0.02;
    for (const p of s.pts) {
      const a = p.baseA + Math.sin(s.t + p.phase) * 0.4;
      ctx.globalAlpha = Math.max(0, Math.min(1, a));
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  _drawAurora(ctx, W, H) {
    const s = this.state.aurora;
    s.t += 0.008;
    const colors = [s.p1, s.p2, s.p3, s.p1, s.p2];
    for (let i = 0; i < 4; i++) {
      const baseColor = colors[i] || "#6750A4";
      const rgb = this._hexToRgb(baseColor);
      const yBase = H * 0.2 + i * 50;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 8) {
        const y = yBase + Math.sin(x * 0.005 + s.t + i) * 60
                       + Math.cos(x * 0.002 - s.t * 0.5) * 40;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, yBase - 80, 0, H);
      grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
      grad.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},0.28)`);
      grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  _drawBubbles(ctx, W, H) {
    for (const b of this.state.bubbles) {
      b.y -= b.speed;
      b.wobble += b.wobbleSpeed;
      const x = b.x + Math.sin(b.wobble) * 12;
      if (b.y + b.r < 0) {
        b.y = H + b.r;
        b.x = Math.random() * W;
      }
      const rgb = this._hexToRgb(b.color);
      const grad = ctx.createRadialGradient(x - b.r * 0.35, b.y - b.r * 0.35, 1, x, b.y, b.r);
      grad.addColorStop(0, `rgba(255,255,255,${b.opacity * 0.9})`);
      grad.addColorStop(0.3, `rgba(${rgb.r},${rgb.g},${rgb.b},${b.opacity})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
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
    const s = this.state.fireflies;
    const rgb = this._hexToRgb(s.color);
    for (const f of s.arr) {
      f.phase += f.phaseSpeed;
      const dx = f.tx - f.x;
      const dy = f.ty - f.y;
      f.vx += dx * 0.0008;
      f.vy += dy * 0.0008;
      f.vx *= 0.96; f.vy *= 0.96;
      f.x += f.vx + Math.cos(f.phase) * 0.4;
      f.y += f.vy + Math.sin(f.phase) * 0.4;
      if (Math.random() < 0.005) { f.tx = Math.random() * W; f.ty = Math.random() * H; }
      const a = 0.5 + Math.sin(f.phase * 2) * 0.5;
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 14);
      grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`);
      grad.addColorStop(0.5, `rgba(${rgb.r},${rgb.g},${rgb.b},${a * 0.4})`);
      grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _drawLiquid(ctx, W, H) {
    const s = this.state.liquid;
    s.t += 0.01;
    const cx1 = W * 0.3 + Math.sin(s.t) * 60;
    const cy1 = H * 0.3 + Math.cos(s.t * 1.3) * 40;
    const cx2 = W * 0.7 + Math.cos(s.t * 0.8) * 70;
    const cy2 = H * 0.7 + Math.sin(s.t * 1.1) * 50;
    const a = this._hexToRgb(s.c1);
    const b = this._hexToRgb(s.c2);
    const c = this._hexToRgb(s.c3);
    const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, W * 0.6);
    g1.addColorStop(0, `rgba(${a.r},${a.g},${a.b},0.35)`);
    g1.addColorStop(1, `rgba(${a.r},${a.g},${a.b},0)`);
    ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, W * 0.5);
    g2.addColorStop(0, `rgba(${b.r},${b.g},${b.b},0.3)`);
    g2.addColorStop(1, `rgba(${b.r},${b.g},${b.b},0)`);
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
    const g3 = ctx.createRadialGradient(W/2 + Math.sin(s.t*0.5)*80, H/2, 0, W/2, H/2, W*0.4);
    g3.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.2)`);
    g3.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
    ctx.fillStyle = g3; ctx.fillRect(0, 0, W, H);
  }

  _drawConfetti(ctx, W, H) {
    const arr = this.state.confetti;
    let alive = false;
    for (const p of arr) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed; p.life++;
      const a = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life < p.maxLife) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (!alive) this.disable("confetti");
  }
}

const ACCENT_PRESETS = [
  "#6750A4", "#0061A4", "#386A20", "#984061",
  "#7D5260", "#B3261E", "#00696D", "#7B5800",
  "#5B5F97", "#A03B5E", "#1E6F50", "#7A4F00",
];

function buildAccentPicker(onPick) {
  const row = document.getElementById("accentRow");
  row.innerHTML = "";
  ACCENT_PRESETS.forEach(hex => {
    const sw = document.createElement("div");
    sw.className = "accent-swatch";
    sw.style.background = hex;
    sw.dataset.color = hex;
    sw.title = hex;
    sw.addEventListener("click", () => {
      row.querySelectorAll(".accent-swatch").forEach(s => s.classList.remove("active"));
      sw.classList.add("active");
      onPick(hex);
    });
    row.appendChild(sw);
  });
  const rand = document.createElement("button");
  rand.className = "accent-random";
  rand.title = "Random";
  rand.innerHTML = '<span class="material-symbols-rounded">shuffle</span>';
  rand.addEventListener("click", () => {
    const h = Math.floor(Math.random() * 360);
    const c = 35 + Math.random() * 35;
    const t = 50;
    const hct = Hct.from(h, c, t);
    const hex = argbToHex(hct.toInt());
    row.querySelectorAll(".accent-swatch").forEach(s => s.classList.remove("active"));
    onPick(hex);
  });
  row.appendChild(rand);
}

function setAccentActive(hex) {
  document.querySelectorAll(".accent-swatch").forEach(s => {
    s.classList.toggle("active", s.dataset.color && s.dataset.color.toLowerCase() === (hex || "").toLowerCase());
  });
}

let snackbarTimer = null;
function showSnackbar(text) {
  const sb = document.getElementById("snackbar");
  document.getElementById("snackbarText").textContent = text;
  sb.classList.add("show");
  if (snackbarTimer) clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() => sb.classList.remove("show"), 2400);
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

  const engine = new EffectsEngine(snowCanvas);

  function updateLangButtons() {
    langSegmented.querySelectorAll("button").forEach(b => {
      b.classList.toggle("active", b.dataset.lang === currentLang);
    });
  }

  function updateEffectSwitches() {
    document.querySelectorAll("[data-effect-input]").forEach(inp => {
      inp.checked = engine.isActive(inp.dataset.effectInput);
    });
  }

  function setGlass(on) {
    appCard.classList.toggle("glass", on);
    glassToggle.checked = on;
  }

  function persistEffects() {
    const active = Array.from(engine.active);
    browser.storage.local.set({ activeEffects: active });
  }

  function applyAccentAndPersist(hex) {
    const p = generatePalette(hex);
    applyPalette(p);
    setAccentActive(hex);
    browser.storage.local.set({ accent: hex });
    for (const name of engine.active) {
      if (name === "stars" || name === "aurora" || name === "bubbles" ||
          name === "fireflies" || name === "liquid" || name === "confetti") {
        engine._init(name);
      }
    }
  }

  buildAccentPicker(applyAccentAndPersist);

  function syncFloatingLabels() {
    document.querySelectorAll(".md-outlined-field").forEach(field => {
      const input = field.querySelector("input");
      if (!input) return;
      if (input.value.length > 0) field.classList.add("is-floating");
      else field.classList.remove("is-floating");
    });
  }
  document.querySelectorAll(".md-outlined-field input").forEach(inp => {
    inp.addEventListener("input", () => {
      const field = inp.closest(".md-outlined-field");
      if (!field) return;
      if (inp.value.length > 0) field.classList.add("is-floating");
      else field.classList.remove("is-floating");
    });
  });

  browser.storage.local.get([
    "site1", "site2", "enabled", "lang", "customTitle",
    "snowMode", "activeEffects", "accent", "glassMode"
  ]).then((data) => {
    if (data.site1) site1Input.value = data.site1;
    if (data.site2) site2Input.value = data.site2;
    if (data.customTitle) customTitleInput.value = data.customTitle;
    if (data.enabled !== undefined) enabledCheckbox.checked = data.enabled;
    if (data.lang) currentLang = data.lang;

    const accent = data.accent || ACCENT_PRESETS[0];
    const palette = generatePalette(accent);
    applyPalette(palette);
    setAccentActive(accent);

    let effects = [];
    if (Array.isArray(data.activeEffects)) {
      effects = data.activeEffects;
    } else if (data.snowMode) {
      effects = ["snow"];
    }
    effects.forEach(e => engine.enable(e));

    setGlass(!!data.glassMode);
    applyLang();
    updateLangButtons();
    updateEffectSwitches();
    syncFloatingLabels();
  });

  langSegmented.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-lang]");
    if (!btn) return;
    const newLang = btn.dataset.lang;
    if (newLang === currentLang) return;
    currentLang = newLang;
    browser.storage.local.set({ lang: currentLang });
    applyLang();
    updateLangButtons();
  });

  let settingsOpen = false;
  function openSettings() {
    if (settingsOpen) return;
    settingsOpen = true;
    const btnRect = settingsBtn.getBoundingClientRect();
    const cardRect = appCard.getBoundingClientRect();
    const startX = btnRect.left + btnRect.width / 2 - cardRect.left;
    const startY = btnRect.top + btnRect.height / 2 - cardRect.top;
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
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
      closeSettings();
    }
  });

  document.querySelectorAll("[data-effect-input]").forEach(inp => {
    inp.addEventListener("change", () => {
      const name = inp.dataset.effectInput;
      engine.toggle(name);
      const active = Array.from(engine.active);
      browser.storage.local.set({ activeEffects: active });
    });
  });

  glassToggle.addEventListener("change", () => {
    setGlass(glassToggle.checked);
    browser.storage.local.set({ glassMode: glassToggle.checked });
  });

  saveBtn.addEventListener("click", () => {
    let site1 = site1Input.value.trim();
    let site2 = site2Input.value.trim();
    const customTitle = customTitleInput.value.trim();
    const enabled = enabledCheckbox.checked;
    if (site1 && !site1.startsWith("http")) site1 = "https://" + site1;
    if (site2 && !site2.startsWith("http")) site2 = "https://" + site2;

    saveBtn.classList.add("is-saving");
    const fabIcon = saveBtn.querySelector(".fab-icon");
    const originalText = t("btnText");
    btnText.textContent = t("saved");
    if (fabIcon) fabIcon.textContent = "check";

    if (engine.isActive("confetti")) {
      const rect = saveBtn.getBoundingClientRect();
      engine.burst("confetti", rect.left + rect.width / 2, rect.top + rect.height / 2);
      persistEffects();
    }

    browser.storage.local.set({ site1, site2, enabled, customTitle }).then(() => {
      showSnackbar(t("saved"));
      setTimeout(() => {
        saveBtn.classList.remove("is-saving");
        btnText.textContent = originalText;
        if (fabIcon) fabIcon.textContent = "bolt";
      }, 1500);
      browser.runtime.sendMessage({ action: "updateRules", site1, site2, enabled }).catch(() => {});
    });
  });

  snackbarAction.addEventListener("click", () => {
    document.getElementById("snackbar").classList.remove("show");
  });

  const blobs = document.querySelectorAll(".blob");
  document.body.addEventListener("mousemove", (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const mx = (e.clientX - cx) * 0.04;
    const my = (e.clientY - cy) * 0.04;
    blobs[0].style.transform = `translate(${mx}px, ${my}px)`;
    blobs[1].style.transform = `translate(${-mx * 0.7}px, ${-my * 0.7}px)`;
    blobs[2].style.transform = `translate(calc(-50% + ${mx * 0.5}px), calc(-50% + ${my * 0.5}px))`;
  });
});
