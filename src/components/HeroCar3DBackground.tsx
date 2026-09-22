import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Gauge, Sparkles, Zap, Navigation, Eye, Cpu } from 'lucide-react';
import heroCarRealImage from '../assets/images/realistic_hero_car_1790078403463.jpg';

interface HeroCar3DBackgroundProps {
  interactive?: boolean;
}

export const HeroCar3DBackground: React.FC<HeroCar3DBackgroundProps> = ({ interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState<'photo' | 'hologram'>('photo');
  const [speedLevel, setSpeedLevel] = useState<number>(248); // km/h
  const animFrameId = useRef<number | null>(null);

  // Parallax on scroll
  const { scrollY } = useScroll();
  const bannerY = useTransform(scrollY, [0, 400], [0, 60]);

  // Mouse move handler for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setMousePos((prev) => ({ ...prev, targetX: x, targetY: y }));
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos((prev) => ({ ...prev, targetX: 0, targetY: 0 }));
  };

  // Canvas 3D Highway, Light Streaks, and Wind Tunnel Streamlines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Particles / Aerodynamic light beams
    interface Particle {
      x: number;
      y: number;
      z: number;
      length: number;
      speed: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    const numParticles = 60;
    const colors = [
      'rgba(59, 130, 246, ',   // blue
      'rgba(99, 102, 241, ',   // indigo
      'rgba(14, 165, 233, ',   // sky
      'rgba(16, 185, 129, ',   // emerald safe
      'rgba(244, 63, 94, ',    // taillight red
    ];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 1000 + 100,
        length: Math.random() * 40 + 20,
        speed: Math.random() * 12 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    // Road Grid Lines state
    let roadOffset = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      // Smooth interpolation for mouse position
      currentX += (mousePos.targetX - currentX) * 0.08;
      currentY += (mousePos.targetY - currentY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const fov = 400;
      const vanishingX = width * 0.72 + currentX * 60; // Focal point on right side
      const vanishingY = height * 0.42 + currentY * 30;

      // 1. Draw 3D Perspective Road Grid
      const horizonY = vanishingY;
      roadOffset = (roadOffset + 4) % 60;

      ctx.save();
      // Draw grid lines converging to 3D vanishing point
      const numRoadLanes = 8;
      ctx.lineWidth = 1;

      for (let i = -numRoadLanes; i <= numRoadLanes; i++) {
        const bottomX = vanishingX + (i * width) / 5;
        const bottomY = height + 40;

        const grad = ctx.createLinearGradient(vanishingX, vanishingY, bottomX, bottomY);
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.02)');
        grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.12)');
        grad.addColorStop(1, 'rgba(59, 130, 246, 0.28)');

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(vanishingX, vanishingY);
        ctx.lineTo(bottomX, bottomY);
        ctx.stroke();
      }

      // Draw horizontal perspective speed bars
      for (let z = 50; z < 800; z += 55) {
        const perspectiveZ = (z + roadOffset) % 800;
        if (perspectiveZ < 40) continue;
        const scale = fov / perspectiveZ;
        const y = vanishingY + scale * 40;

        if (y > horizonY && y < height + 30) {
          const spreadWidth = scale * (width * 0.85);
          const leftX = vanishingX - spreadWidth;
          const rightX = vanishingX + spreadWidth;

          const hGrad = ctx.createLinearGradient(leftX, y, rightX, y);
          hGrad.addColorStop(0, 'rgba(59, 130, 246, 0)');
          hGrad.addColorStop(0.5, `rgba(99, 102, 241, ${Math.min(0.35, scale * 0.35)})`);
          hGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

          ctx.strokeStyle = hGrad;
          ctx.beginPath();
          ctx.moveTo(leftX, y);
          ctx.lineTo(rightX, y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 2. Draw 3D Aerodynamic Flow Streamlines (Wind tunnel particles)
      particles.forEach((p) => {
        p.z -= p.speed;
        if (p.z <= 10) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * width * 1.5;
          p.y = (Math.random() - 0.5) * height * 1.2;
        }

        const scale = fov / p.z;
        const x2d = vanishingX + (p.x + currentX * 120) * scale;
        const y2d = vanishingY + (p.y + currentY * 80) * scale;

        const tailScale = fov / (p.z + p.length);
        const tailX = vanishingX + (p.x + currentX * 120) * tailScale;
        const tailY = vanishingY + (p.y + currentY * 80) * tailScale;

        if (x2d >= -50 && x2d <= width + 50 && y2d >= -50 && y2d <= height + 50) {
          const alpha = Math.min(1, Math.max(0, p.alpha * (1 - p.z / 1000)));
          ctx.strokeStyle = `${p.color}${alpha})`;
          ctx.lineWidth = Math.max(1, scale * 2.2);
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(x2d, y2d);
          ctx.stroke();
        }
      });

      // 3. Draw Dual Headlight Projector Cones cutting through the atmosphere
      const carBaseX = width * 0.72 + currentX * 25;
      const carBaseY = height * 0.54 + currentY * 15;

      // Left light beam
      const beamGradLeft = ctx.createRadialGradient(
        carBaseX - 35,
        carBaseY,
        5,
        carBaseX - 160 + currentX * 50,
        carBaseY + 120,
        240
      );
      beamGradLeft.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      beamGradLeft.addColorStop(0.3, 'rgba(59, 130, 246, 0.2)');
      beamGradLeft.addColorStop(1, 'rgba(30, 58, 138, 0)');

      ctx.fillStyle = beamGradLeft;
      ctx.beginPath();
      ctx.moveTo(carBaseX - 45, carBaseY - 5);
      ctx.lineTo(carBaseX - 260, carBaseY + 140);
      ctx.lineTo(carBaseX + 40, carBaseY + 140);
      ctx.closePath();
      ctx.fill();

      // Right light beam
      const beamGradRight = ctx.createRadialGradient(
        carBaseX + 35,
        carBaseY,
        5,
        carBaseX + 160 + currentX * 50,
        carBaseY + 120,
        240
      );
      beamGradRight.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      beamGradRight.addColorStop(0.3, 'rgba(99, 102, 241, 0.2)');
      beamGradRight.addColorStop(1, 'rgba(30, 58, 138, 0)');

      ctx.fillStyle = beamGradRight;
      ctx.beginPath();
      ctx.moveTo(carBaseX + 45, carBaseY - 5);
      ctx.lineTo(carBaseX - 40, carBaseY + 140);
      ctx.lineTo(carBaseX + 260, carBaseY + 140);
      ctx.closePath();
      ctx.fill();

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [mousePos.targetX, mousePos.targetY]);

  // Calculate 3D card tilt angles
  const tiltX = -mousePos.targetY * 8; // degrees
  const tiltY = mousePos.targetX * 12; // degrees

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 overflow-hidden pointer-events-auto select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D WebGL / Canvas Highway Simulation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 3D Atmospheric Radial Glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[450px] bg-gradient-to-bl from-blue-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-[450px] h-[350px] bg-gradient-to-t from-emerald-600/15 via-teal-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 3D Interactive Car Silhouette / Photorealistic Card on the Right Side */}
      <motion.div
        className="absolute right-4 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 w-80 md:w-96 lg:w-[480px] pointer-events-auto z-10 hidden sm:block"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {/* Holographic Speed Telemetry HUD Ring behind */}
        <div className="relative flex items-center justify-center p-2">
          {/* Ambient luminous aura */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-teal-400/20 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

          {/* Rotating HUD geometric rings */}
          <div className="absolute w-80 h-80 rounded-full border border-blue-500/15 border-dashed animate-[spin_50s_linear_infinite] pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full border border-indigo-500/20 animate-[spin_30s_linear_infinite_reverse] pointer-events-none" />

          {/* Main 3D Card Container */}
          <div className="relative z-20 w-full flex flex-col items-center">
            {viewMode === 'photo' ? (
              /* REALISTIC CAR PHOTO PRESENTATION */
              <div className="relative w-full rounded-2xl overflow-hidden border border-blue-500/40 bg-slate-950/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(30,58,138,0.6)] group/card">
                {/* Photorealistic Hero Car Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <img
                    src={heroCarRealImage}
                    alt="Coche Deportivo Europeo de Alta Gama"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover/card:scale-105"
                  />

                  {/* Dynamic Specular Light Glare following mouse tilt */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${50 + mousePos.targetX * 35}% ${45 + mousePos.targetY * 35}%, rgba(56, 189, 248, 0.6) 0%, rgba(99, 102, 241, 0.2) 40%, transparent 70%)`,
                    }}
                  />

                  {/* Atmospheric gradient overlay at edges for seamless blending */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-blue-400/40 text-[10px] font-semibold text-blue-300 shadow-lg">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Fotografía Realista 8K</span>
                  </div>

                  {/* Speed Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-400/40 text-[10px] font-mono text-emerald-300 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>248 km/h</span>
                  </div>

                  {/* Bottom Image Overlay Badges */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[11px] text-slate-200">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Inspección 150 Puntos</span>
                    </div>

                    <button
                      onClick={() => setViewMode('hologram')}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-500 text-white text-[10px] font-medium transition-all shadow-md cursor-pointer pointer-events-auto"
                      title="Ver mapa de flujo aerodinámico"
                    >
                      <Cpu className="w-3 h-3" />
                      <span>Ver 3D Aero</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Telemetry Strip */}
                <div className="px-4 py-2.5 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    <span className="text-white font-bold">GT SPORT EDITION</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-slate-400">CX: <strong className="text-blue-300">0.24</strong></span>
                    <span className="text-slate-400">TRACCIÓN: <strong className="text-emerald-300">AWD</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              /* AERODYNAMIC 3D HOLOGRAM VIEW */
              <div className="relative w-full p-4 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-blue-500/40 shadow-2xl">
                {/* Switch back button */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-blue-300 font-mono">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    <span>TELEMETRÍA DE TÚNEL DE VIENTO</span>
                  </div>
                  <button
                    onClick={() => setViewMode('photo')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-medium transition-all cursor-pointer pointer-events-auto"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Ver Foto Realista</span>
                  </button>
                </div>

                {/* Aerodynamic GT Car Silhouette SVG with glowing Xenon DRL lights */}
                <svg
                  viewBox="0 0 520 220"
                  className="w-full h-auto drop-shadow-[0_15px_30px_rgba(59,130,246,0.45)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#2563eb" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.3" />
                    </linearGradient>

                    <linearGradient id="glowLine" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>

                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Ground Shadow Reflection */}
                  <ellipse cx="260" cy="180" rx="210" ry="20" fill="rgba(37,99,235,0.25)" filter="blur(10px)" />

                  {/* Sleek Aerodynamic Car Body Contours */}
                  <path
                    d="M 120 120 C 160 85, 230 55, 310 58 C 370 60, 420 85, 450 122"
                    stroke="url(#glowLine)"
                    strokeWidth="2.5"
                    filter="url(#neonGlow)"
                  />

                  {/* Side Window Arc */}
                  <path
                    d="M 165 110 C 200 78, 260 68, 315 68 C 365 68, 395 85, 410 110 Z"
                    fill="rgba(30, 58, 138, 0.4)"
                    stroke="rgba(56, 189, 248, 0.6)"
                    strokeWidth="1.5"
                  />

                  {/* B-pillar divider */}
                  <line x1="280" y1="68" x2="280" y2="110" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="2" />

                  {/* Front Hood & Fender line */}
                  <path
                    d="M 450 122 C 480 128, 505 135, 510 148 C 510 156, 495 160, 470 162"
                    stroke="url(#glowLine)"
                    strokeWidth="3"
                    filter="url(#neonGlow)"
                  />

                  {/* Rear Fastback & Trunk Line */}
                  <path
                    d="M 120 120 C 80 128, 40 138, 20 148 C 15 154, 25 160, 50 162"
                    stroke="url(#glowLine)"
                    strokeWidth="3"
                    filter="url(#neonGlow)"
                  />

                  {/* Lower Rocker Panel & Chassis */}
                  <path
                    d="M 50 162 L 105 162 M 195 162 L 345 162 M 435 162 L 470 162"
                    stroke="rgba(148, 163, 184, 0.7)"
                    strokeWidth="2.5"
                  />

                  {/* Front Wheel Arch */}
                  <path
                    d="M 345 162 C 345 130, 435 130, 435 162"
                    stroke="url(#glowLine)"
                    strokeWidth="2.5"
                  />

                  {/* Rear Wheel Arch */}
                  <path
                    d="M 105 162 C 105 130, 195 130, 195 162"
                    stroke="url(#glowLine)"
                    strokeWidth="2.5"
                  />

                  {/* Front Alloy Wheel with 3D Disc Brake */}
                  <circle cx="390" cy="158" r="32" stroke="#38bdf8" strokeWidth="2" fill="rgba(15, 23, 42, 0.9)" />
                  <circle cx="390" cy="158" r="22" stroke="rgba(244, 63, 94, 0.6)" strokeWidth="3" strokeDasharray="6 4" />
                  <circle cx="390" cy="158" r="8" fill="#38bdf8" />
                  <line x1="390" y1="126" x2="390" y2="190" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="358" y1="158" x2="422" y2="158" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="367" y1="135" x2="413" y2="181" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="367" y1="181" x2="413" y2="135" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Rear Alloy Wheel with 3D Disc Brake */}
                  <circle cx="150" cy="158" r="32" stroke="#38bdf8" strokeWidth="2" fill="rgba(15, 23, 42, 0.9)" />
                  <circle cx="150" cy="158" r="22" stroke="rgba(244, 63, 94, 0.6)" strokeWidth="3" strokeDasharray="6 4" />
                  <circle cx="150" cy="158" r="8" fill="#38bdf8" />
                  <line x1="150" y1="126" x2="150" y2="190" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="118" y1="158" x2="182" y2="158" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="127" y1="135" x2="173" y2="181" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="127" y1="181" x2="173" y2="135" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Xenon LED Headlight DRL Matrix */}
                  <path
                    d="M 488 138 L 508 143 L 485 146 Z"
                    fill="#38bdf8"
                    filter="url(#neonGlow)"
                  />
                  <circle cx="496" cy="142" r="3" fill="#ffffff" />

                  {/* Rear OLED Tail Light Strip */}
                  <path
                    d="M 22 144 L 40 142 L 35 148 Z"
                    fill="#f43f5e"
                    filter="url(#neonGlow)"
                  />
                  <line x1="22" y1="144" x2="60" y2="142" stroke="#f43f5e" strokeWidth="3" filter="url(#neonGlow)" />

                  {/* Side Door Character Crease Line */}
                  <path
                    d="M 190 128 Q 290 132 420 126"
                    stroke="rgba(56, 189, 248, 0.45)"
                    strokeWidth="1.5"
                  />

                  {/* Aerodynamic Airflow Streamlines over the car */}
                  <path
                    d="M 30 110 Q 140 70 280 48 T 490 115"
                    stroke="rgba(52, 211, 153, 0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="8 6"
                    className="animate-[pulse_3s_ease-in-out_infinite]"
                  />
                  <path
                    d="M 60 90 Q 180 50 320 38 T 510 120"
                    stroke="rgba(56, 189, 248, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="12 8"
                  />
                </svg>

                {/* 3D Telemetry HUD Badge below car */}
                <div className="mt-3 flex items-center justify-between w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-blue-500/30 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>AERO TUNNEL 3D</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">CX:</span>
                    <span className="text-white font-bold">0.24 Cd</span>
                    <span className="text-emerald-400 font-bold ml-1">● ACTIVO</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Speed dial and Perspective controller pill (bottom-right of banner) */}
      <div className="absolute bottom-4 right-6 hidden md:flex items-center gap-2 z-20">
        <button
          onClick={() => setViewMode(viewMode === 'photo' ? 'hologram' : 'photo')}
          className="px-3 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-blue-500/40 text-[10px] font-mono text-slate-200 flex items-center gap-2 shadow-lg transition-colors cursor-pointer pointer-events-auto"
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>VISTA: {viewMode === 'photo' ? 'FOTO REALISTA 3D' : 'TELEMETRÍA AERO'}</span>
        </button>
      </div>
    </div>
  );
};
