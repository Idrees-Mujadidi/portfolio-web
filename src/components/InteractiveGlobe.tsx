import React, { useEffect, useRef } from 'react';

interface Hub {
  latRad: number;
  lonRad: number;
  label: string;
}

interface Packet {
  fromHubIndex: number;
  toHubIndex: number;
  progress: number;
  speed: number;
  trail: Array<{ x: number; y: number; z: number }>;
}

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let RepublicOfGlobeRunning = true;
    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Interactive orientation state & inertia variables
    let angleY = 0;
    let angleX = 0;
    let spinVelocityY = 0.005;
    let spinVelocityX = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Coordinate helper for both Mouse and Touch motions
    const getCoordinates = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        if (e.touches.length > 0) {
          return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return null;
      }
      return { x: e.clientX, y: e.clientY };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      const coords = getCoordinates(e);
      if (!coords) return;
      isDragging = true;
      lastMouseX = coords.x;
      lastMouseY = coords.y;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const coords = getCoordinates(e);
      if (!coords) return;

      const deltaX = coords.x - lastMouseX;
      const deltaY = coords.y - lastMouseY;

      // High precision rotation sensitivity scaling with screen dimensions
      const sensitivity = 0.005;
      spinVelocityY = deltaX * sensitivity;
      spinVelocityX = deltaY * sensitivity;

      lastMouseX = coords.x;
      lastMouseY = coords.y;

      // Prevent window scrolling while dragging the globe canvas
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const handleEnd = () => {
      isDragging = false;
    };

    // Cast handlers helper to keep TypeScript compiler completely happy
    const onMouseDown = (e: MouseEvent) => handleStart(e);
    const onMouseMove = (e: MouseEvent) => handleMove(e);
    const onMouseUp = () => handleEnd();

    const onTouchStart = (e: TouchEvent) => handleStart(e);
    const onTouchMove = (e: TouchEvent) => handleMove(e);
    const onTouchEnd = () => handleEnd();

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    // Realistic geographical location coordinates for major network hubs (Lats, Lons in Degrees)
    // Positive Lat is North, Negative Y in our projection
    const hubsData: Hub[] = [
      { latRad: 34.54 * Math.PI / 180, lonRad: 69.21 * Math.PI / 180, label: "KBL" },      // Kabul, Afghanistan
      { latRad: 32.90 * Math.PI / 180, lonRad: -97.04 * Math.PI / 180, label: "DFW" },    // Dallas, USA
      { latRad: 52.31 * Math.PI / 180, lonRad: 4.76 * Math.PI / 180, label: "AMS" },      // Amsterdam, Netherlands
      { latRad: 50.03 * Math.PI / 180, lonRad: 8.57 * Math.PI / 180, label: "FRA" },      // Frankfurt, Germany
      { latRad: 1.35 * Math.PI / 180, lonRad: 103.99 * Math.PI / 180, label: "SIN" },     // Singapore
      { latRad: 51.47 * Math.PI / 180, lonRad: -0.45 * Math.PI / 180, label: "LHR" },     // London Heathrow, UK
      { latRad: 35.78 * Math.PI / 180, lonRad: 140.39 * Math.PI / 180, label: "NRT" },    // Tokyo Narita, Japan
      { latRad: 25.25 * Math.PI / 180, lonRad: 55.36 * Math.PI / 180, label: "DXB" },     // Dubai, UAE
      { latRad: -33.92 * Math.PI / 180, lonRad: 18.42 * Math.PI / 180, label: "CPT" },    // Cape Town, South Africa
      { latRad: -1.29 * Math.PI / 180, lonRad: 36.82 * Math.PI / 180, label: "NBO" },     // Nairobi, Kenya
      { latRad: 30.04 * Math.PI / 180, lonRad: 31.24 * Math.PI / 180, label: "CAI" },     // Cairo, Egypt
      { latRad: -23.44 * Math.PI / 180, lonRad: -46.47 * Math.PI / 180, label: "GRU" },   // São Paulo, Brazil
      { latRad: -34.82 * Math.PI / 180, lonRad: -58.54 * Math.PI / 180, label: "EZE" },   // Buenos Aires, Argentina
      { latRad: 48.11 * Math.PI / 180, lonRad: 16.57 * Math.PI / 180, label: "VIE" },     // Vienna, Austria
      { latRad: 55.97 * Math.PI / 180, lonRad: 37.41 * Math.PI / 180, label: "SVO" },     // Moscow, Russia
      { latRad: 55.01 * Math.PI / 180, lonRad: 82.65 * Math.PI / 180, label: "OVB" },     // Novosibirsk, Russia
      { latRad: -33.95 * Math.PI / 180, lonRad: 151.18 * Math.PI / 180, label: "SYD" },   // Sydney, Australia
      { latRad: 19.09 * Math.PI / 180, lonRad: 72.87 * Math.PI / 180, label: "BOM" },     // Mumbai, India
      { latRad: 37.47 * Math.PI / 180, lonRad: 126.45 * Math.PI / 180, label: "ICN" },    // Seoul Incheon, South Korea
      { latRad: -12.02 * Math.PI / 180, lonRad: -77.11 * Math.PI / 180, label: "LIM" },   // Lima, Peru
    ];

    // High quality geographic land checking to render an "original globe map"
    const isLand = (lat: number, lon: number): boolean => {
      // lat range: -pi/2 (South Pole) to pi/2 (North Pole)
      // lon range: 0 to 2*pi
      const latDeg = (lat * 180) / Math.PI;
      let lonDeg = (lon * 180) / Math.PI;
      if (lonDeg > 180) lonDeg -= 360;

      // Antarctica
      if (latDeg < -60) return true;

      // Greenland
      if (latDeg > 60 && latDeg < 83 && lonDeg > -75 && lonDeg < -12) return true;

      // North America
      if (latDeg > 15 && latDeg < 75 && lonDeg > -168 && lonDeg < -52) {
        if (latDeg > 51 && latDeg < 64 && lonDeg > -95 && lonDeg < -76) return false; // Hudson Bay
        if (latDeg > 15 && latDeg < 30 && lonDeg > -98 && lonDeg < -83) return false; // Gulf of Mexico
        return true;
      }

      // South America
      if (latDeg > -55 && latDeg <= 13 && lonDeg > -82 && lonDeg < -34) {
        if (latDeg < -15) {
          const left = -76 + (latDeg + 15) * 0.45;
          const right = -35 - (latDeg + 15) * 0.85;
          return lonDeg > left && lonDeg < right;
        }
        return true;
      }

      // Africa
      if (latDeg > -35 && latDeg < 37 && lonDeg > -18 && lonDeg < 51) {
        if (latDeg > 12 && lonDeg > 43) return false; // Red sea / Sinai
        if (latDeg > 15 && latDeg < 35 && lonDeg < -15) return false;
        if (latDeg < 5) {
          const left = 7 - (latDeg - 5) * 0.15;
          const right = 41 + (latDeg - 5) * 0.25;
          return lonDeg > left && lonDeg < right;
        }
        return true;
      }

      // Arabia & Middle East
      if (latDeg > 12 && latDeg < 32 && lonDeg > 35 && lonDeg < 60) return true;

      // Australia
      if (latDeg > -40 && latDeg < -10 && lonDeg > 112 && lonDeg < 154) {
        if (latDeg > -15 && latDeg < -11 && lonDeg > 135 && lonDeg < 142) return false; // Carpentaria
        return true;
      }

      // Japan
      if (latDeg > 31 && latDeg < 45 && lonDeg > 130 && lonDeg < 146) return true;

      // Madagascar
      if (latDeg > -26 && latDeg < -12 && lonDeg > 43 && lonDeg < 51) return true;

      // New Zealand
      if (latDeg > -47 && latDeg < -34 && lonDeg > 166 && lonDeg < 179) return true;

      // Eurasia (Europe + Asia)
      if (latDeg > 12 && latDeg < 78 && lonDeg > -10 && lonDeg < 180) {
        // Indian Ocean / Southeast Asia adjustments
        if (latDeg > 12 && latDeg < 25) {
          const inIndia = (lonDeg > 68 && lonDeg < 89);
          const inIndochina = (lonDeg > 95 && lonDeg < 111);
          const inChina = (lonDeg >= 111);
          return inIndia || inIndochina || inChina;
        }
        if (latDeg > 30 && latDeg < 46 && lonDeg > -5 && lonDeg < 36) {
          // Mediterranean Sea
          const inMed = (latDeg > 31 && latDeg < 43 && lonDeg > -5 && lonDeg < 28) ||
                        (latDeg > 31 && latDeg < 36 && lonDeg >= 28 && lonDeg < 35);
          if (inMed) return false;
        }
        return true;
      }

      // Southeast Asia Archipelagos
      if (latDeg > -11 && latDeg < 15 && lonDeg > 95 && lonDeg < 150) {
        if (latDeg > -6 && latDeg < 6 && lonDeg > 95 && lonDeg < 105 && (latDeg + (lonDeg - 95)*0.5 < 6)) return true; // Sumatra
        if (latDeg > -4 && latDeg < 7 && lonDeg > 108 && lonDeg < 119) return true; // Borneo
        if (latDeg > -5 && latDeg < 2 && lonDeg > 119 && lonDeg < 126) return true; // Sulawesi
        if (latDeg > -8 && latDeg < 0 && lonDeg > 130 && lonDeg < 151) return true; // New Guinea
        if (latDeg >= 5 && latDeg < 19 && lonDeg > 120 && lonDeg < 127) return true; // Philippines
        if (latDeg > -9 && latDeg < -6 && lonDeg > 105 && lonDeg < 116) return true; // Java
      }

      return false;
    };

    // Calculate interactive globe dimensions dynamically
    const getRadius = () => Math.min(width, height) * 0.42;
    let radius = getRadius();

    // 3D Sphere Points: high resolution detailed dot-matrix layer
    const points: Array<{ x: number; y: number; z: number; isLandPoint: boolean; originalLat: number; originalLon: number; size: number }> = [];
    const numLatitudes = 50;
    const numLongitudes = 100;

    for (let i = 0; i < numLatitudes; i++) {
      const lat = (Math.PI / numLatitudes) * i - Math.PI / 2;
      for (let j = 0; j < numLongitudes; j++) {
        const lon = (2 * Math.PI / numLongitudes) * j;
        const land = isLand(lat, lon);

        // Map onto sphere coords
        const x = Math.cos(lat) * Math.cos(lon);
        const y = -Math.sin(lat);
        const z = Math.cos(lat) * Math.sin(lon);

        if (land) {
          points.push({ 
            x, y, z, 
            isLandPoint: true, 
            originalLat: lat, 
            originalLon: lon, 
            size: Math.random() < 0.22 ? 1.4 : 0.95 
          });
        } else {
          // Sparse layout points representing ocean currents to maintain solid spherical mesh outline
          if (i % 3 === 0 && j % 4 === 0) {
            points.push({ 
              x, y, z, 
              isLandPoint: false, 
              originalLat: lat, 
              originalLon: lon, 
              size: 0.5 
            });
          }
        }
      }
    }

    // Set up active airport network hubs on our 3D globe coordinates
    const hubs = hubsData.map(h => {
      const x = Math.cos(h.latRad) * Math.cos(h.lonRad);
      const y = -Math.sin(h.latRad);
      const z = Math.cos(h.latRad) * Math.sin(h.lonRad);
      return { ...h, x, y, z };
    });

    const getPacketSpeed = (fromIdx: number, toIdx: number): number => {
      const fromHub = hubsData[fromIdx];
      const toHub = hubsData[toIdx];

      // Spherical law of cosines to find central angle theta on a unit sphere:
      const sinLat1 = Math.sin(fromHub.latRad);
      const sinLat2 = Math.sin(toHub.latRad);
      const cosLat1 = Math.cos(fromHub.latRad);
      const cosLat2 = Math.cos(toHub.latRad);
      const cosDeltaLon = Math.cos(toHub.lonRad - fromHub.lonRad);

      const cosTheta = sinLat1 * sinLat2 + cosLat1 * cosLat2 * cosDeltaLon;
      const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta))); // Angle range [0, PI]

      // We want a constant physical speed across the surface of the globe.
      // Since progress is 0 to 1, the step size (speed) should be inversely proportional to the travel angle.
      const baseVelocity = 0.015;
      // Cap the minimum angle at 0.4 to prevent extremely fast transitions over nearby nodes
      const speed = baseVelocity / Math.max(0.4, theta);

      // Add small organic random variance (±10%) so consecutive transmissions have slight speed variations
      return speed * (0.9 + Math.random() * 0.2);
    };

    // Three active network data packets traversing the globe simultaneously
    const packets: Packet[] = [
      {
        fromHubIndex: 1, // DFW
        toHubIndex: 5,   // LHR (London)
        progress: 0,
        speed: getPacketSpeed(1, 5),
        trail: [],
      },
      {
        fromHubIndex: 6, // NRT (Tokyo)
        toHubIndex: 7,   // DXB (Dubai)
        progress: 0.33,  // staggered start
        speed: getPacketSpeed(6, 7),
        trail: [],
      },
      {
        fromHubIndex: 13, // VIE (Vienna)
        toHubIndex: 8,    // CPT (Cape Town)
        progress: 0.66,   // staggered start
        speed: getPacketSpeed(13, 8),
        trail: [],
      }
    ];

    const resetPacket = (p: Packet) => {
      p.fromHubIndex = p.toHubIndex;
      let newDest = Math.floor(Math.random() * hubs.length);
      while (newDest === p.fromHubIndex) {
        newDest = Math.floor(Math.random() * hubs.length);
      }
      p.toHubIndex = newDest;
      p.progress = 0;
      p.speed = getPacketSpeed(p.fromHubIndex, p.toHubIndex);
      p.trail = [];
    };

    const perspective = 450;

    const draw = () => {
      if (!RepublicOfGlobeRunning) return;

      // Recalculate dimensions in case of resizing / changes
      radius = getRadius();
      const cx = width / 2;
      const cy = height / 2;

      // Paint backdrop strict black color with no borders
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Update rotation angles with decay and limits
      angleY += spinVelocityY;
      angleX += spinVelocityX;

      if (!isDragging) {
        // Decay to dynamic resting spin velocity
        spinVelocityX *= 0.93;
        spinVelocityY = spinVelocityY * 0.93 + 0.005 * 0.07;
      } else {
        // Decay while dragging to avoid velocity building up infinitely
        spinVelocityX *= 0.8;
        spinVelocityY *= 0.8;
      }

      // Constrain vertical rotation X-axis to avoid gimbal lock/flip options (clamping -PI/2.2 to PI/2.2 is very elegant)
      angleX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, angleX));

      const cosRotY = Math.cos(angleY);
      const sinRotY = Math.sin(angleY);
      const cosRotX = Math.cos(angleX);
      const sinRotX = Math.sin(angleX);

      // Project the land matrix and ocean grid points
      const projectedPoints = points.map(p => {
        // 3D coordinates scaled by current radius
        const px = p.x * radius;
        const py = p.y * radius;
        const pz = p.z * radius;

        // Rotate Y-axis (rotating left to right)
        const rx1 = px * cosRotY - pz * sinRotY;
        const ry1 = py;
        const rz1 = px * sinRotY + pz * cosRotY;

        // Rotate X-axis (rotating up/down)
        const rx2 = rx1;
        const ry2 = ry1 * cosRotX - rz1 * sinRotX;
        const rz2 = ry1 * sinRotX + rz1 * cosRotX;

        // Perspective Formula
        const scale = perspective / (perspective + rz2);
        const sx = cx + rx2 * scale;
        const sy = cy + ry2 * scale;

        return { x: sx, y: sy, z: rz2, isLandPoint: p.isLandPoint, size: p.size };
      });

      // Project the fixed Airport Hub circles
      const projectedHubs = hubs.map(h => {
        const px = h.x * radius;
        const py = h.y * radius;
        const pz = h.z * radius;

        // Rotate Y-axis (rotating left to right)
        const rx1 = px * cosRotY - pz * sinRotY;
        const ry1 = py;
        const rz1 = px * sinRotY + pz * cosRotY;

        // Rotate X-axis (rotating up/down)
        const rx2 = rx1;
        const ry2 = ry1 * cosRotX - rz1 * sinRotX;
        const rz2 = ry1 * sinRotX + rz1 * cosRotX;

        const scale = perspective / (perspective + rz2);
        const sx = cx + rx2 * scale;
        const sy = cy + ry2 * scale;

        return { x: sx, y: sy, z: rz2, label: h.label };
      });

      // Compute & Update Packet travels
      packets.forEach(p => {
        const fromHub = hubs[p.fromHubIndex];
        const toHub = hubs[p.toHubIndex];

        // Linear interpolation step
        p.progress += p.speed;
        if (p.progress >= 1) {
          resetPacket(p);
          return;
        }

        const dLat = toHub.latRad - fromHub.latRad;
        let dLon = toHub.lonRad - fromHub.lonRad;

        // Choose shortest spherical arc direction for longitude
        if (dLon > Math.PI) dLon -= 2 * Math.PI;
        if (dLon < -Math.PI) dLon += 2 * Math.PI;

        const currentLat = fromHub.latRad + p.progress * dLat;
        const currentLon = fromHub.lonRad + p.progress * dLon;

        // Spherical coordinate mapping back to 3D surface
        const px = radius * Math.cos(currentLat) * Math.cos(currentLon);
        const py = -radius * Math.sin(currentLat);
        const pz = radius * Math.cos(currentLat) * Math.sin(currentLon);

        p.trail.push({ x: px, y: py, z: pz });
        if (p.trail.length > 20) {
          p.trail.shift();
        }
      });

      // Draw standard atmospheric atmospheric ring bounds background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw faint coordinate tick outer dashes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.setLineDash([1, 12]);
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw globe dot matrix
      projectedPoints.forEach(p => {
        // Render only front hemisphere dots brilliantly to prevent visual overlapping with back
        if (p.z < 20) {
          const alpha = p.isLandPoint 
            ? Math.max(0.12, 0.72 * (1 - p.z / radius)) 
            : 0.12 * (1 - p.z / radius);

          ctx.fillStyle = p.isLandPoint 
            ? `rgba(255, 255, 255, ${alpha})` 
            : `rgba(255, 255, 255, ${alpha * 0.4})`;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw interconnecting light pathways between front-facing hubs
      const activeHubs = projectedHubs.filter(h => h.z < 10);
      ctx.lineWidth = 0.5;
      for (let a = 0; a < activeHubs.length; a++) {
        for (let b = a + 1; b < activeHubs.length; b++) {
          const distance = Math.hypot(activeHubs[a].x - activeHubs[b].x, activeHubs[a].y - activeHubs[b].y);
          if (distance < radius * 1.35) {
            ctx.strokeStyle = `rgba(255, 255, 255, 0.09)`;
            ctx.beginPath();
            ctx.moveTo(activeHubs[a].x, activeHubs[a].y);
            ctx.lineTo(activeHubs[b].x, activeHubs[b].y);
            ctx.stroke();
          }
        }
      }

      // Draw the packets AND their trails gracefully while rotating
      packets.forEach(p => {
        const projectedTrail = p.trail.map(tp => {
          // Rotate path point according to current global orbital angle so it moves with the continents
          // Rotate Y-axis (rotating left-right)
          const rx1 = tp.x * cosRotY - tp.z * sinRotY;
          const ry1 = tp.y;
          const rz1 = tp.x * sinRotY + tp.z * cosRotY;

          // Rotate X-axis (rotating up-down)
          const rx2 = rx1;
          const ry2 = ry1 * cosRotX - rz1 * sinRotX;
          const rz2 = ry1 * sinRotX + rz1 * cosRotX;

          const scale = perspective / (perspective + rz2);
          const sx = cx + rx2 * scale;
          const sy = cy + ry2 * scale;

          return { x: sx, y: sy, z: rz2 };
        });

        // Draw fading beam trails
        ctx.beginPath();
        let first = true;
        projectedTrail.forEach((pt, index) => {
          if (pt.z < 25) {
            const alpha = (index / projectedTrail.length) * 0.85;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.75 + (index / projectedTrail.length) * 1.5;

            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        });
        ctx.stroke();

        // Draw glowing bright white data packet head
        if (projectedTrail.length > 0) {
          const head = projectedTrail[projectedTrail.length - 1];
          // Only draw if packet matches front coordinates
          if (head.z < 25) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(head.x, head.y, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Ripple glow wave
            const pulse = (Date.now() / 14) % 12;
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - pulse / 12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(head.x, head.y, pulse, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      // Render airport names & signal rings for front-facing datacenters
      activeHubs.forEach(h => {
        // Hub beacon
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(h.x, h.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing radar around node
        const pulseSize = (Date.now() / 25) % 15;
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - pulseSize / 15})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(h.x, h.y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        // Text labels printed cleanly
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '7.5px "JetBrains Mono", monospace';
        ctx.fillText(h.label, h.x + 6, h.y + 2.5);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      RepublicOfGlobeRunning = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center p-0 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover bg-black cursor-grab active:cursor-grabbing select-none"
      />
    </div>
  );
}

