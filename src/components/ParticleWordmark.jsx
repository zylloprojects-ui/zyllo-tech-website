"use client";

import { useEffect, useRef } from "react";

export default function ParticleWordmark() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let animFrameId = null;
    let isVisible = true;
    const mouse = { x: -1000, y: -1000, isOver: false, radius: 105 };
    const word = "ZYLLOTECH";

    function initParticles() {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      width = Math.floor(rect.width) || 1140;
      if (width <= 50) width = 1140;

      // Responsive height based on breakpoint matching reference
      height = width < 480 ? 70 : width < 768 ? 95 : width < 992 ? 125 : 150;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Offscreen canvas for typography rasterization mask
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const oCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!oCtx) return;

      // Calculate responsive font size & tracking
      let fontSize = Math.floor(height * 0.62);
      fontSize = Math.min(Math.max(fontSize, 26), 96);
      let tracking = Math.max(3, Math.floor(width * 0.016));

      function measureWordWidth(tCtx, fSize, trk) {
        tCtx.font = `700 ${fSize}px "Space Grotesk", "Syncopate", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        let totalW = 0;
        for (let i = 0; i < word.length; i++) {
          totalW += tCtx.measureText(word[i]).width;
          if (i < word.length - 1) totalW += trk;
        }
        return totalW;
      }

      const targetW = width * (width < 600 ? 0.96 : 0.88);
      const measuredW = measureWordWidth(oCtx, fontSize, tracking);
      if (measuredW > 0) {
        const scale = targetW / measuredW;
        fontSize = Math.min(Math.max(Math.floor(fontSize * scale), 20), Math.floor(height * 0.78));
        tracking = Math.max(2, Math.floor(tracking * scale));
      }

      oCtx.font = `700 ${fontSize}px "Space Grotesk", "Syncopate", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      oCtx.fillStyle = "#ffffff";
      oCtx.textAlign = "center";
      oCtx.textBaseline = "middle";

      let totalRenderW = 0;
      const letterWidths = [];
      for (let i = 0; i < word.length; i++) {
        const lw = oCtx.measureText(word[i]).width;
        letterWidths.push(lw);
        totalRenderW += lw;
        if (i < word.length - 1) totalRenderW += tracking;
      }

      let currentX = (width - totalRenderW) / 2;
      const centerY = Math.floor(height / 2);
      for (let i = 0; i < word.length; i++) {
        oCtx.fillText(word[i], currentX + letterWidths[i] / 2, centerY);
        currentX += letterWidths[i] + tracking;
      }

      const imgData = oCtx.getImageData(0, 0, width, height).data;

      // Density step & dot radius based on screen width
      const step = width < 480 ? 3.6 : width < 992 ? 4.0 : 4.2;
      const dotRadius = width < 480 ? 1.05 : 1.25;

      const newParticles = [];
      for (let y = Math.floor(step / 2); y < height; y += step) {
        for (let x = Math.floor(step / 2); x < width; x += step) {
          const px = Math.floor(x);
          const py = Math.floor(y);
          const pixelIndex = (py * width + px) * 4 + 3;
          if (imgData[pixelIndex] > 40) {
            newParticles.push({
              originX: x,
              originY: y,
              x: x,
              y: y,
              vx: 0,
              vy: 0,
              radius: dotRadius,
            });
          }
        }
      }

      particles = newParticles;
    }

    function updateAndDraw() {
      if (particles.length === 0) return;

      ctx.clearRect(0, 0, width, height);

      const baseColor = "rgba(163, 175, 204, 0.55)";
      const activeSwirlColor = "#f96706";
      const maxDist = mouse.radius;
      let anyMoving = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReduced && mouse.isOver) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDist && dist > 0.001) {
            const force = Math.pow(1 - dist / maxDist, 1.4);
            const angle = Math.atan2(dy, dx);

            const repX = Math.cos(angle) * force * 7.5;
            const repY = Math.sin(angle) * force * 7.5;
            const swirlX = -Math.sin(angle) * force * 5.0;
            const swirlY = Math.cos(angle) * force * 5.0;

            p.vx += repX + swirlX;
            p.vy += repY + swirlY;
            anyMoving = true;
          }
        }

        const homeDx = p.originX - p.x;
        const homeDy = p.originY - p.y;
        p.vx += homeDx * 0.085;
        p.vy += homeDy * 0.085;

        p.vx *= 0.82;
        p.vy *= 0.82;

        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.hypot(p.vx, p.vy);
        const distFromHome = Math.hypot(homeDx, homeDy);
        if (!mouse.isOver && speed < 0.04 && distFromHome < 0.15) {
          p.x = p.originX;
          p.y = p.originY;
          p.vx = 0;
          p.vy = 0;
        } else if (speed > 0.04 || distFromHome > 0.15) {
          anyMoving = true;
        }

        ctx.fillStyle = speed > 1.8 ? activeSwirlColor : baseColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced && isVisible && (mouse.isOver || anyMoving)) {
        animFrameId = requestAnimationFrame(updateAndDraw);
      } else {
        animFrameId = null;
      }
    }

    function startAnimationLoop() {
      if (!animFrameId && isVisible && !prefersReduced) {
        animFrameId = requestAnimationFrame(updateAndDraw);
      }
    }

    initParticles();
    updateAndDraw();

    // Fonts load backup
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        initParticles();
        updateAndDraw();
      });
    }

    // Debounced window resize
    let resizeTimer = null;
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initParticles();
        updateAndDraw();
      }, 150);
    }
    window.addEventListener("resize", handleResize);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible) {
          startAnimationLoop();
        } else if (!isVisible && animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isOver = true;
      startAnimationLoop();
    }

    function onMouseLeave() {
      mouse.isOver = false;
      mouse.x = -1000;
      mouse.y = -1000;
      startAnimationLoop();
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.isOver = true;
        startAnimationLoop();
      }
    }

    function onTouchEnd() {
      mouse.isOver = false;
      mouse.x = -1000;
      mouse.y = -1000;
      startAnimationLoop();
    }

    canvas.addEventListener("mousemove", onMouseMove, { passive: true });
    canvas.addEventListener("mouseenter", onMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", onMouseLeave, { passive: true });
    canvas.addEventListener("touchstart", onTouchMove, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      intersectionObserver.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchMove);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="zy-footer-particle-wrap relative my-3 flex w-full select-none items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="zy-footer-particle-canvas block cursor-crosshair select-none"
        style={{ touchAction: "none" }}
        aria-label="Interactive dot-matrix typography for ZYLLOTECH"
      />
    </div>
  );
}
