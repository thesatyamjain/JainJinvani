import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface JapMala3DProps {
  totalBeads: number; // 9, 27, 108 or custom
  currentBead: number; // 0 to totalBeads
  onTap: () => void;
  className?: string;
  themeMode?: 'dark' | 'manuscript';
}

export const JapMala3D: React.FC<JapMala3DProps> = ({
  totalBeads,
  currentBead,
  onTap,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const malaGroupRef = useRef<THREE.Group | null>(null);
  const beadMeshesRef = useRef<THREE.Mesh[]>([]);
  const activeGlowLightRef = useRef<THREE.PointLight | null>(null);

  // Interaction tracking
  const isDraggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.12, y: 0 });
  const currentRotationRef = useRef({ x: 0.12, y: 0 });
  const totalDragDistRef = useRef(0);

  const visualBeadCount = Math.min(totalBeads, 108);

  // Bead radius calculation (tuned to fit comfortably around central medallion)
  const getBeadScale = (count: number) => {
    if (count <= 9) return 0.15;
    if (count <= 27) return 0.105;
    if (count <= 54) return 0.075;
    return 0.055;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene & Camera Setup (centered with headroom for Sumeru & tassel)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.08, 7.5);
    cameraRef.current = camera;

    // 2. High-performance Antialiased WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Sacred Temple Diya Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    // Warm Sun/Diya key light
    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Golden side fill light
    const fillLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    // Active bead point light
    const activeGlowLight = new THREE.PointLight(0xfbbf24, 1.8, 3.5);
    activeGlowLight.position.set(0, 0, 1.5);
    scene.add(activeGlowLight);
    activeGlowLightRef.current = activeGlowLight;

    // 4. Mala Group Structure
    const malaGroup = new THREE.Group();
    malaGroup.rotation.x = currentRotationRef.current.x;
    malaGroup.rotation.y = currentRotationRef.current.y;
    scene.add(malaGroup);
    malaGroupRef.current = malaGroup;

    // 5. Silk Thread Cord (ब्रह्मसूत्र)
    const RING_RADIUS = 2.05;
    const cordGeometry = new THREE.TorusGeometry(RING_RADIUS, 0.015, 16, 120);
    const cordMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.65,
      metalness: 0.05,
    });
    const cordMesh = new THREE.Mesh(cordGeometry, cordMaterial);
    malaGroup.add(cordMesh);

    // 6. Sacred Sumeru (Guru Bead with Stupa Cap & Silk Tassel) at Top (12 o'clock)
    const sumeruGroup = new THREE.Group();
    sumeruGroup.position.set(0, RING_RADIUS, 0);

    // Master Jewel Bead
    const sumeruGeometry = new THREE.SphereGeometry(0.12, 32, 24);
    const sumeruMaterial = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.22,
      metalness: 0.55,
    });
    const sumeruBead = new THREE.Mesh(sumeruGeometry, sumeruMaterial);
    sumeruBead.scale.set(1.0, 1.25, 1.0);
    sumeruGroup.add(sumeruBead);

    // Golden Stupa Cap
    const capGeometry = new THREE.ConeGeometry(0.075, 0.12, 24);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.85,
    });
    const stupaCap = new THREE.Mesh(capGeometry, goldMaterial);
    stupaCap.position.set(0, 0.16, 0);
    sumeruGroup.add(stupaCap);

    // Golden Tie Ring
    const ringGeometry = new THREE.TorusGeometry(0.055, 0.012, 12, 24);
    const tieRing = new THREE.Mesh(ringGeometry, goldMaterial);
    tieRing.position.set(0, 0.23, 0);
    tieRing.rotation.x = Math.PI / 2;
    sumeruGroup.add(tieRing);

    // Silk Tassel
    const tasselGeometry = new THREE.CylinderGeometry(0.03, 0.065, 0.32, 16);
    const tasselMaterial = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.7,
      metalness: 0.05,
    });
    const tassel = new THREE.Mesh(tasselGeometry, tasselMaterial);
    tassel.position.set(0, 0.40, 0);
    sumeruGroup.add(tassel);

    malaGroup.add(sumeruGroup);

    // 7. Generate Dynamic Spherical Beads
    const baseSphereGeo = new THREE.SphereGeometry(1, 24, 20);
    const beadRadius = getBeadScale(visualBeadCount);
    const stepAngle = (2 * Math.PI) / (visualBeadCount + 1);

    const meshes: THREE.Mesh[] = [];

    for (let i = 0; i < visualBeadCount; i++) {
      // 12 o'clock is Math.PI / 2.
      // Clockwise distribution: decrement angle
      const angle = Math.PI / 2 - (i + 1) * stepAngle;
      const x = RING_RADIUS * Math.cos(angle);
      const y = RING_RADIUS * Math.sin(angle);
      const z = Math.sin(angle * 3) * 0.025; // Subtle physical depth wave

      const isQuad =
        visualBeadCount === 108
          ? (i + 1) === 27 || (i + 1) === 54 || (i + 1) === 81
          : visualBeadCount === 27
          ? (i + 1) === 9 || (i + 1) === 18
          : false;

      // Initial Sandalwood material
      const mat = new THREE.MeshStandardMaterial({
        color: isQuad ? 0x991b1b : 0xc28549,
        roughness: isQuad ? 0.2 : 0.5,
        metalness: isQuad ? 0.2 : 0.06,
      });

      const beadMesh = new THREE.Mesh(baseSphereGeo, mat);
      beadMesh.position.set(x, y, z);
      const scale = isQuad ? beadRadius * 1.25 : beadRadius;
      beadMesh.scale.set(scale, scale, scale);

      malaGroup.add(beadMesh);
      meshes.push(beadMesh);
    }

    beadMeshesRef.current = meshes;

    // 8. Animation & Render Loop with Breathing Aura
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damping interpolation towards target rotation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      if (malaGroupRef.current) {
        // Gentle ambient breathing tilt
        const breathX = Math.sin(elapsedTime * 0.8) * 0.012;
        const breathY = Math.cos(elapsedTime * 0.6) * 0.012;

        malaGroupRef.current.rotation.x = currentRotationRef.current.x + breathX;
        malaGroupRef.current.rotation.y = currentRotationRef.current.y + breathY;
      }

      // Breathing active bead glow light
      if (activeGlowLightRef.current) {
        activeGlowLightRef.current.intensity = 1.6 + Math.sin(elapsedTime * 3.5) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      baseSphereGeo.dispose();
      cordGeometry.dispose();
      cordMaterial.dispose();
      sumeruGeometry.dispose();
      sumeruMaterial.dispose();
      capGeometry.dispose();
      goldMaterial.dispose();
      ringGeometry.dispose();
      tasselGeometry.dispose();
      tasselMaterial.dispose();

      meshes.forEach((m) => {
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => mat.dispose());
        } else {
          m.material.dispose();
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [visualBeadCount]);

  // Update Bead Materials & Glow when currentBead advances
  useEffect(() => {
    const meshes = beadMeshesRef.current;
    if (!meshes || meshes.length === 0) return;

    const baseScale = getBeadScale(visualBeadCount);

    meshes.forEach((mesh, idx) => {
      const beadIndex = idx + 1;
      let isCounted = false;
      let isCurrent = false;

      if (totalBeads <= 108) {
        isCounted = currentBead >= beadIndex;
        isCurrent = currentBead === beadIndex;
      } else {
        const threshold = Math.round((beadIndex * totalBeads) / visualBeadCount);
        const prevThreshold = Math.round(((beadIndex - 1) * totalBeads) / visualBeadCount);
        isCounted = currentBead >= threshold;
        isCurrent = currentBead > prevThreshold && currentBead <= threshold;
      }

      const isQuad =
        visualBeadCount === 108
          ? beadIndex === 27 || beadIndex === 54 || beadIndex === 81
          : visualBeadCount === 27
          ? beadIndex === 9 || beadIndex === 18
          : false;

      const mat = mesh.material as THREE.MeshStandardMaterial;

      if (isCurrent) {
        // Active glowing bead
        mat.color.setHex(0xffffff);
        mat.emissive.setHex(0xf59e0b);
        mat.emissiveIntensity = 0.9;
        mat.roughness = 0.12;
        mat.metalness = 0.9;
        const s = baseScale * 1.35;
        mesh.scale.set(s, s, s);

        // Position glow light at active bead
        if (activeGlowLightRef.current) {
          activeGlowLightRef.current.position.set(mesh.position.x, mesh.position.y, mesh.position.z + 0.25);
        }
      } else if (isCounted) {
        // Radiant 24k Gold counted bead
        mat.color.setHex(0xf59e0b);
        mat.emissive.setHex(0x78350f);
        mat.emissiveIntensity = 0.25;
        mat.roughness = 0.18;
        mat.metalness = 0.85;
        const s = isQuad ? baseScale * 1.25 : baseScale;
        mesh.scale.set(s, s, s);
      } else if (isQuad) {
        // Carnelian Gemstone Spacer
        mat.color.setHex(0x991b1b);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
        mat.roughness = 0.22;
        mat.metalness = 0.15;
        const s = baseScale * 1.25;
        mesh.scale.set(s, s, s);
      } else {
        // Natural Mysore Sandalwood uncounted bead
        mat.color.setHex(0xc28549);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0;
        mat.roughness = 0.52;
        mat.metalness = 0.05;
        mesh.scale.set(baseScale, baseScale, baseScale);
      }
    });
  }, [currentBead, totalBeads, visualBeadCount]);

  // Touch / Pointer Event Handlers for interactive 3D Drag & Tap
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    totalDragDistRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    totalDragDistRef.current += Math.hypot(deltaX, deltaY);

    // Rotate mala smoothly on drag
    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x = Math.max(-0.4, Math.min(0.4, targetRotationRef.current.x + deltaY * 0.005));

    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    // If user clicked or barely moved (< 8px total movement), trigger tap count!
    if (totalDragDistRef.current < 8) {
      onTap();
    }
  };

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none touch-none ${className}`}
      title="3D माला को घुमाएं या मनका गिनने हेतु टैप करें"
    />
  );
};
