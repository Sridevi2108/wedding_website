import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Blessing } from '../../data/weddingConfig';
import {
  RotateCcw,
  Sparkles,
  Heart,
  Shuffle,
  X,
  PlusCircle,
  Maximize2,
  Minimize2,
  ChevronRight,
  Eye,
  Calendar,
} from 'lucide-react';

interface BlessingsTree3DProps {
  blessings: Blessing[];
  onPlantBlessingClick: () => void;
  isDedicatedFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onBlessingSubmitted?: () => void;
}

// Math helpers pre-allocated outside render loop for zero GC pressure
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

export const BlessingsTree3D: React.FC<BlessingsTree3DProps> = ({
  blessings,
  onPlantBlessingClick,
  isDedicatedFullscreen = false,
  onToggleFullscreen,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active blessing card displayed on the right (matching reference image)
  const [activeBlessing, setActiveBlessing] = useState<Blessing | null>(
    blessings.length > 0 ? blessings[0] : null
  );
  const [hoveredBlessingId, setHoveredBlessingId] = useState<string | null>(null);

  useEffect(() => {
    setActiveBlessing((current) => {
      if (blessings.length === 0) return null;
      if (!current) return blessings[0];
      return blessings.find((blessing) => blessing.id === current.id) || blessings[0];
    });
  }, [blessings]);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const leafMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const initialCamPos = useRef(new THREE.Vector3(0, 4.6, 11.5));
  const initialCamTarget = useRef(new THREE.Vector3(0, 4.0, 0));

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.copy(initialCamPos.current);
    controlsRef.current.target.copy(initialCamTarget.current);
    controlsRef.current.update();
  }, []);

  // Read Random Blessing
  const handleRandomBlessing = useCallback(() => {
    if (blessings.length === 0) return;
    const randomItem = blessings[Math.floor(Math.random() * blessings.length)];
    setActiveBlessing(randomItem);

    const mesh = leafMeshesRef.current.get(randomItem.id);
    if (mesh) {
      mesh.scale.set(1.4, 1.4, 1.4);
      setTimeout(() => {
        mesh.scale.set(1.0, 1.0, 1.0);
      }, 400);
    }
  }, [blessings]);

  // Read Next Blessing in card
  const handleNextBlessing = useCallback(() => {
    if (blessings.length === 0) return;
    const currentIndex = activeBlessing
      ? blessings.findIndex((b) => b.id === activeBlessing.id)
      : -1;
    const nextIndex = (currentIndex + 1) % blessings.length;
    const nextItem = blessings[nextIndex];
    setActiveBlessing(nextItem);

    const mesh = leafMeshesRef.current.get(nextItem.id);
    if (mesh) {
      mesh.scale.set(1.4, 1.4, 1.4);
      setTimeout(() => {
        mesh.scale.set(1.0, 1.0, 1.0);
      }, 400);
    }
  }, [blessings, activeBlessing]);

  // 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js skill
    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) return true;
      const ext = probe.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf6ede1); // Warm ivory courtyard background
    scene.fog = new THREE.FogExp2(0xf6ede1, 0.022);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 80);
    camera.position.copy(initialCamPos.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 4. RoomEnvironment reflection map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(initialCamTarget.current);
    controls.minDistance = 6.5;
    controls.maxDistance = 18;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2.08; // Prevent camera from dipping below the floor
    controls.enablePan = true;
    controls.autoRotate = !isSoftwareGl;
    controls.autoRotateSpeed = 0.35;
    controlsRef.current = controls;

    const onControlStart = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener('start', onControlStart);

    // 6. Lighting Rig (Golden Morning Sunlight & Temple Deepams)
    // Warm Key Sunlight
    const sunLight = new THREE.DirectionalLight(0xfffaec, 2.8);
    sunLight.position.set(10, 18, 12);
    sunLight.castShadow = !isSoftwareGl;
    if (sunLight.castShadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 40;
      sunLight.shadow.camera.left = -10;
      sunLight.shadow.camera.right = 10;
      sunLight.shadow.camera.top = 10;
      sunLight.shadow.camera.bottom = -10;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    // Soft sky and floor fill
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0xd4c7b5, 1.4);
    scene.add(hemiLight);

    // Golden rim/backlight
    const rimLight = new THREE.DirectionalLight(0xc49a58, 1.2);
    rimLight.position.set(-10, 10, -12);
    scene.add(rimLight);

    // Warm deepam lights around the pedestal
    const flameLight1 = new THREE.PointLight(0xff9433, 1.2, 8, 1.5);
    flameLight1.position.set(2.8, 0.8, 2.8);
    scene.add(flameLight1);

    const flameLight2 = new THREE.PointLight(0xff9433, 1.2, 8, 1.5);
    flameLight2.position.set(-2.8, 0.8, -2.8);
    scene.add(flameLight2);

    // 7. Courtyard Floor & Multi-Tiered Carved Marble Pedestal
    const courtyardGroup = new THREE.Group();
    scene.add(courtyardGroup);

    // Marble Courtyard Floor
    const floorGeo = new THREE.CircleGeometry(24, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebe0,
      roughness: 0.35,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !isSoftwareGl;
    courtyardGroup.add(floor);

    // Pedestal Base Tier (Carved circular marble plinth)
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xfbf6ed,
      roughness: 0.38,
      metalness: 0.1,
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.88,
    });

    const tier1Geo = new THREE.CylinderGeometry(4.2, 4.4, 0.35, 48);
    const tier1 = new THREE.Mesh(tier1Geo, pedestalMat);
    tier1.position.y = 0.175;
    tier1.receiveShadow = !isSoftwareGl;
    courtyardGroup.add(tier1);

    // Tier 1 Gold Trim Ring
    const trim1Geo = new THREE.TorusGeometry(4.28, 0.05, 12, 64);
    const trim1 = new THREE.Mesh(trim1Geo, goldTrimMat);
    trim1.rotation.x = Math.PI / 2;
    trim1.position.y = 0.35;
    courtyardGroup.add(trim1);

    // Tier 2 (Carved Lotus Relief Band)
    const tier2Geo = new THREE.CylinderGeometry(3.5, 3.7, 0.45, 48);
    const tier2 = new THREE.Mesh(tier2Geo, pedestalMat);
    tier2.position.y = 0.575;
    tier2.receiveShadow = !isSoftwareGl;
    courtyardGroup.add(tier2);

    // Tier 2 Gold Trim Ring
    const trim2Geo = new THREE.TorusGeometry(3.55, 0.05, 12, 64);
    const trim2 = new THREE.Mesh(trim2Geo, goldTrimMat);
    trim2.rotation.x = Math.PI / 2;
    trim2.position.y = 0.8;
    courtyardGroup.add(trim2);

    // Tier 3 (Top Plinth where trunk and jasmine mound rest)
    const tier3Geo = new THREE.CylinderGeometry(2.8, 3.0, 0.3, 48);
    const tier3 = new THREE.Mesh(tier3Geo, pedestalMat);
    tier3.position.y = 0.95;
    tier3.receiveShadow = !isSoftwareGl;
    courtyardGroup.add(tier3);

    // 8. Mound of Fresh White Jasmine Blossoms at Tree Roots
    const jasmineMoundGroup = new THREE.Group();
    const petalShapeGeo = new THREE.SphereGeometry(0.08, 6, 6);
    petalShapeGeo.scale(1, 0.35, 1.8);
    const jasminePetalMat = new THREE.MeshStandardMaterial({
      color: 0xfffef9,
      roughness: 0.4,
      metalness: 0.05,
    });
    const orangeBudMat = new THREE.MeshStandardMaterial({
      color: 0x98502f,
      roughness: 0.6,
    });

    for (let i = 0; i < 70; i++) {
      const angle = (i / 70) * Math.PI * 2 + Math.random() * 0.15;
      const radius = 1.4 + Math.random() * 1.1;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 1.1 + Math.random() * 0.15;

      const flower = new THREE.Group();
      flower.position.set(x, y, z);
      flower.rotation.y = Math.random() * Math.PI * 2;

      for (let p = 0; p < 5; p++) {
        const pAngle = (p / 5) * Math.PI * 2;
        const pMesh = new THREE.Mesh(petalShapeGeo, jasminePetalMat);
        pMesh.position.set(Math.cos(pAngle) * 0.12, 0.015, Math.sin(pAngle) * 0.12);
        pMesh.rotation.y = pAngle;
        flower.add(pMesh);
      }
      const center = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 5), orangeBudMat);
      center.position.y = 0.035;
      flower.add(center);

      jasmineMoundGroup.add(flower);
    }
    courtyardGroup.add(jasmineMoundGroup);

    // Traditional Brass Deepams around the pedestal
    const deepamPositions = [
      [2.9, 0.4, 2.9],
      [-2.9, 0.4, -2.9],
      [-2.9, 0.4, 2.9],
      [2.9, 0.4, -2.9],
    ];
    deepamPositions.forEach(([dx, dy, dz]) => {
      const deepam = new THREE.Group();
      deepam.position.set(dx, dy, dz);

      // Brass base
      const dBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 0.1, 16), goldTrimMat);
      deepam.add(dBase);
      // Basin
      const dBasin = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.15, 0.12, 16), goldTrimMat);
      dBasin.position.y = 0.1;
      deepam.add(dBasin);
      // Flame
      const dFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.08, 0.22, 12),
        new THREE.MeshBasicMaterial({ color: 0xffa333 })
      );
      dFlame.position.y = 0.24;
      deepam.add(dFlame);

      courtyardGroup.add(deepam);
    });

    // 9. THE BRAIDED / TWISTED SACRED TREE MODEL
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    const barkMat = new THREE.MeshStandardMaterial({
      color: 0x5a3e2b, // Warm gnarled woody bark
      roughness: 0.85,
      metalness: 0.08,
    });

    // Construct 8 braided twisting trunk strands using CatmullRom splines & TubeGeometry
    const strandCount = 8;
    for (let s = 0; s < strandCount; s++) {
      const baseAngle = (s / strandCount) * Math.PI * 2;
      const points: THREE.Vector3[] = [];

      // Spline points from roots up to crown fork
      const steps = 7;
      for (let st = 0; st <= steps; st++) {
        const progress = st / steps; // 0 to 1
        const y = 1.0 + progress * 3.8; // 1.0 to 4.8

        // Spiral twist angle
        const twistAngle = baseAngle + progress * 1.8;

        // Radius: flares wide at roots, tightens in middle, flares again at crown
        let r = 0.55;
        if (progress < 0.25) {
          r = 1.3 - progress * 2.8; // roots flare out to 1.3
        } else if (progress > 0.75) {
          r = 0.55 + (progress - 0.75) * 1.8; // crown split
        } else {
          r = 0.52 + Math.sin(progress * Math.PI) * 0.08;
        }

        const x = Math.cos(twistAngle) * r;
        const z = Math.sin(twistAngle) * r;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.14, 10, false);
      const strandMesh = new THREE.Mesh(tubeGeo, barkMat);
      strandMesh.castShadow = !isSoftwareGl;
      treeGroup.add(strandMesh);
    }

    // 8 Grand Branching Boughs arcing outwards and upwards to form umbrella dome
    const boughConfigs = [
      { angle: 0, spread: 3.4, height: 6.8, arcY: 5.6 },
      { angle: Math.PI * 0.25, spread: 3.6, height: 7.2, arcY: 5.8 },
      { angle: Math.PI * 0.5, spread: 3.3, height: 6.9, arcY: 5.5 },
      { angle: Math.PI * 0.75, spread: 3.5, height: 7.1, arcY: 5.7 },
      { angle: Math.PI, spread: 3.4, height: 6.7, arcY: 5.6 },
      { angle: Math.PI * 1.25, spread: 3.7, height: 7.3, arcY: 5.9 },
      { angle: Math.PI * 1.5, spread: 3.3, height: 6.8, arcY: 5.5 },
      { angle: Math.PI * 1.75, spread: 3.5, height: 7.0, arcY: 5.7 },
    ];

    boughConfigs.forEach((cfg) => {
      const bPoints = [
        new THREE.Vector3(Math.cos(cfg.angle) * 0.6, 4.6, Math.sin(cfg.angle) * 0.6),
        new THREE.Vector3(Math.cos(cfg.angle) * 1.8, cfg.arcY, Math.sin(cfg.angle) * 1.8),
        new THREE.Vector3(Math.cos(cfg.angle) * cfg.spread, cfg.height, Math.sin(cfg.angle) * cfg.spread),
      ];
      const bCurve = new THREE.CatmullRomCurve3(bPoints);
      const bTube = new THREE.TubeGeometry(bCurve, 24, 0.13, 8, false);
      const bMesh = new THREE.Mesh(bTube, barkMat);
      bMesh.castShadow = !isSoftwareGl;
      treeGroup.add(bMesh);
    });

    // 10. DENSE IVORY BLOSSOM CANOPY
    const blossomGroup = new THREE.Group();
    treeGroup.add(blossomGroup);

    // Ivory flower material
    const ivoryFlowerMat = new THREE.MeshStandardMaterial({
      color: 0xfffef7,
      roughness: 0.42,
      metalness: 0.08,
    });
    // Golden-green leaf material
    const leafGreenMat = new THREE.MeshStandardMaterial({
      color: 0xa8b57e,
      roughness: 0.5,
      metalness: 0.1,
    });

    // 35 Blossom Cluster Spheres arranged in a natural umbrella dome
    const clusterCount = 35;
    for (let c = 0; c < clusterCount; c++) {
      const angle = (c / clusterCount) * Math.PI * 2 + (c % 3) * 0.25;
      const radius = 1.6 + ((c * 7) % 11) * 0.22;
      const height = 5.6 + ((c * 5) % 9) * 0.32;

      const cluster = new THREE.Group();
      cluster.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);

      // Ivory white blossom cloud
      const flowerCloudGeo = new THREE.DodecahedronGeometry(0.75 + (c % 3) * 0.15, 1);
      const flowerMesh = new THREE.Mesh(flowerCloudGeo, ivoryFlowerMat);
      flowerMesh.scale.set(1.4, 0.9, 1.4);
      cluster.add(flowerMesh);

      // Green leaf undertone
      const leafGeo = new THREE.IcosahedronGeometry(0.55 + (c % 2) * 0.1, 0);
      const leafMesh = new THREE.Mesh(leafGeo, leafGreenMat);
      leafMesh.position.set(0.15, -0.15, 0.15);
      cluster.add(leafMesh);

      blossomGroup.add(cluster);
    }

    // 11. SIGNATURE HANGING GOLDEN BLESSING LEAVES
    const hangingLeavesGroup = new THREE.Group();
    treeGroup.add(hangingLeavesGroup);

    // Peepal / Bodhi sacred leaf shape with distinct curved lobes and elegant tip
    const peepalShape = new THREE.Shape();
    peepalShape.moveTo(0, 0);
    peepalShape.bezierCurveTo(0.28, 0.3, 0.48, 0.7, 0.38, 1.2);
    peepalShape.bezierCurveTo(0.28, 1.5, 0.12, 1.7, 0, 2.0); // Pointy tip
    peepalShape.bezierCurveTo(-0.12, 1.7, -0.28, 1.5, -0.38, 1.2);
    peepalShape.bezierCurveTo(-0.48, 0.7, -0.28, 0.3, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(peepalShape);
    leafGeo.center();

    // Luminous polished temple gold leaf material
    const goldLeafMat = new THREE.MeshStandardMaterial({
      color: 0xf2c94c, // Auspicious radiant temple gold
      emissive: 0x6e4905,
      emissiveIntensity: 0.35,
      metalness: 0.92,
      roughness: 0.18,
      side: THREE.DoubleSide,
    });

    const highlightGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffe277,
      emissive: 0xb86a14,
      emissiveIntensity: 0.75,
      metalness: 0.95,
      roughness: 0.1,
      side: THREE.DoubleSide,
    });

    const cordMat = new THREE.MeshBasicMaterial({ color: 0xb87333 });
    const leafMeshes = new Map<string, THREE.Mesh>();
    const leafDataList: { mesh: THREE.Mesh; baseAngle: number; swaySpeed: number }[] = [];

    // Distribute hanging golden leaves naturally below the boughs
    blessings.forEach((blessing, idx) => {
      const angle = (idx / Math.max(blessings.length, 1)) * Math.PI * 2 + (idx % 3) * 0.45;
      const radius = 2.0 + ((idx * 5) % 8) * 0.22;
      const branchHeight = 5.5 + ((idx * 3) % 7) * 0.25;
      const cordLength = 0.9 + ((idx * 2) % 5) * 0.18;

      const lx = Math.cos(angle) * radius;
      const lz = Math.sin(angle) * radius;
      const ly = branchHeight - cordLength;

      // Hanging golden thread
      const cordGeo = new THREE.CylinderGeometry(0.012, 0.012, cordLength, 6);
      const cord = new THREE.Mesh(cordGeo, cordMat);
      cord.position.set(lx, branchHeight - cordLength / 2, lz);
      hangingLeavesGroup.add(cord);

      // Golden peepal leaf mesh
      const leafMesh = new THREE.Mesh(leafGeo, goldLeafMat);
      leafMesh.scale.set(0.65, 0.65, 0.65);
      leafMesh.position.set(lx, ly, lz);
      leafMesh.rotation.y = angle + Math.PI / 2;
      leafMesh.userData = { blessingId: blessing.id, blessing };

      hangingLeavesGroup.add(leafMesh);
      leafMeshes.set(blessing.id, leafMesh);
      leafDataList.push({
        mesh: leafMesh,
        baseAngle: angle,
        swaySpeed: 1.2 + (idx % 4) * 0.2,
      });
    });

    leafMeshesRef.current = leafMeshes;

    // 12. Floating White Petals Particle System
    const petalCount = isSoftwareGl ? 35 : 80;
    const floatingPetalGeo = new THREE.PlaneGeometry(0.12, 0.16);
    const floatingPetalMat = new THREE.MeshStandardMaterial({
      color: 0xfffef9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const floatingPetalsGroup = new THREE.Group();
    const petalParticles: {
      mesh: THREE.Mesh;
      baseX: number;
      baseZ: number;
      speedY: number;
      sway: number;
    }[] = [];

    for (let p = 0; p < petalCount; p++) {
      const pMesh = new THREE.Mesh(floatingPetalGeo, floatingPetalMat);
      const bx = (Math.random() - 0.5) * 14;
      const bz = (Math.random() - 0.5) * 14;
      const by = 1.5 + Math.random() * 8;
      pMesh.position.set(bx, by, bz);
      floatingPetalsGroup.add(pMesh);

      petalParticles.push({
        mesh: pMesh,
        baseX: bx,
        baseZ: bz,
        speedY: 0.012 + Math.random() * 0.016,
        sway: Math.random() * Math.PI * 2,
      });
    }
    scene.add(floatingPetalsGroup);

    // 13. Raycasting Interaction (Click & Hover)
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const leaves = Array.from(leafMeshesRef.current.values());
      const intersects = _raycaster.intersectObjects(leaves, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        setHoveredBlessingId(hit.userData.blessingId);
        container.style.cursor = 'pointer';
      } else {
        setHoveredBlessingId(null);
        container.style.cursor = 'grab';
      }
    };

    const onPointerDown = () => {
      container.style.cursor = 'grabbing';
    };

    const onPointerUp = (e: MouseEvent) => {
      container.style.cursor = 'grab';
      const rect = container.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      const leaves = Array.from(leafMeshesRef.current.values());
      const intersects = _raycaster.intersectObjects(leaves, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const b = hit.userData.blessing as Blessing;
        if (b) {
          setActiveBlessing(b);
          hit.scale.set(1.4, 1.4, 1.4);
          setTimeout(() => hit.scale.set(1.0, 1.0, 1.0), 300);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mouseup', onPointerUp);

    // 14. Resize Handler
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 15. Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const elapsed = clock.getElapsedTime();
      controls.update();

      // Gentle pendulum sway of hanging golden leaves
      for (let i = 0; i < leafDataList.length; i++) {
        const { mesh, swaySpeed } = leafDataList[i];
        const bId = mesh.userData.blessingId;
        const isHovered = bId === hoveredBlessingId;
        const isSelected = activeBlessing && activeBlessing.id === bId;

        // Pendulum angle in wind
        mesh.rotation.z = Math.sin(elapsed * swaySpeed + i) * 0.14;

        if (isHovered || isSelected) {
          mesh.material = highlightGoldMat;
          mesh.scale.setScalar(0.85);
        } else {
          mesh.material = goldLeafMat;
          mesh.scale.setScalar(0.65);
        }
      }

      // Drifting flower petals
      for (let i = 0; i < petalParticles.length; i++) {
        const p = petalParticles[i];
        p.mesh.position.y -= p.speedY;
        p.mesh.position.x = p.baseX + Math.sin(elapsed * 1.2 + p.sway) * 0.5;
        p.mesh.position.z = p.baseZ + Math.cos(elapsed * 0.9 + p.sway) * 0.5;
        p.mesh.rotation.x += 0.015;
        p.mesh.rotation.y += 0.02;

        if (p.mesh.position.y <= 0.2) {
          p.mesh.position.y = 8 + Math.random() * 2;
        }
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mouseup', onPointerUp);
      controls.removeEventListener('start', onControlStart);
      controls.dispose();

      renderer.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      tier1Geo.dispose();
      tier2Geo.dispose();
      tier3Geo.dispose();
      pedestalMat.dispose();
      goldTrimMat.dispose();
      barkMat.dispose();
      ivoryFlowerMat.dispose();
      leafGreenMat.dispose();
      leafGeo.dispose();
      goldLeafMat.dispose();
      highlightGoldMat.dispose();
      floatingPetalGeo.dispose();
      floatingPetalMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [blessings]);

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${
        isDedicatedFullscreen
          ? 'h-screen'
          : 'h-[620px] sm:h-[700px] rounded-3xl border-2 border-[#E5D8C4] shadow-lg'
      }`}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP-LEFT CARD: Pixel-matched to user's reference image */}
      <div className="absolute top-6 left-6 z-20 pointer-events-auto">
        <div className="bg-[#2D1D13]/90 border border-[#C49A58]/60 text-[#FFFDF9] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md max-w-[210px] sm:max-w-[230px]">
          <div className="flex items-center space-x-2.5 mb-2">
            {/* Golden Leaf Emblem */}
            <div className="w-8 h-8 rounded-lg bg-[#FAF5EC]/15 border border-[#C49A58] flex items-center justify-center text-[#F2C94C]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </div>
            <span className="font-serif-royal font-bold text-sm tracking-wide text-[#FFFDF9]">
              Blessings Tree
            </span>
          </div>

          <div className="mt-2">
            <span className="font-serif-royal text-3xl sm:text-4xl font-bold tracking-tight text-[#F2C94C] block leading-none">
              {blessings.length}
            </span>
            <span className="text-[11px] text-[#E5D8C4] tracking-wide block mt-1 font-serif-royal">
              Blessings planted so far
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT FLOATING CARD: Selected Blessing Card (Matching reference image) */}
      {activeBlessing && (
        <div className="absolute top-6 right-6 z-20 max-w-[300px] sm:max-w-[340px] w-full pointer-events-auto animate-fadeIn">
          <div className="bg-[#FFFDF9]/95 border-2 border-[#C49A58] rounded-2xl p-5 shadow-2xl backdrop-blur-md relative">
            {/* Top row: Guest name + Close button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5D8C4] mb-3">
              <span className="font-serif-royal font-semibold text-sm text-[#98502F]">
                {activeBlessing.guestName}
              </span>

              <button
                onClick={() => setActiveBlessing(null)}
                className="p-1 text-[#766B60] hover:text-[#98502F] rounded-full hover:bg-[#FAF5EC]"
                aria-label="Close blessing card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Blessing Message Quote */}
            <blockquote className="font-cormorant italic text-base sm:text-lg text-[#45352A] leading-relaxed mb-4">
              &ldquo;{activeBlessing.message}&rdquo;
            </blockquote>

            <div className="pt-3 border-t border-[#E5D8C4] flex justify-end">
              <button
                onClick={handleNextBlessing}
                className="flex items-center space-x-1 text-[11px] font-serif-royal text-[#766B60] hover:text-[#98502F] font-semibold"
                title="Read Next Blessing"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C49A58]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM-RIGHT BADGE: Control Guidance & Actions */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2 pointer-events-auto">
        {/* Reset Camera View */}
        <button
          onClick={handleResetCamera}
          className="p-2.5 bg-[#2D1D13]/90 hover:bg-[#3E2C1E] border border-[#C49A58]/60 text-[#FFFDF9] rounded-xl shadow-lg transition-colors cursor-pointer"
          title="Reset Camera View"
          aria-label="Reset Camera View"
        >
          <RotateCcw className="w-4 h-4 text-[#F2C94C]" />
        </button>

        {/* Read Random Blessing */}
        <button
          onClick={handleRandomBlessing}
          className="flex items-center space-x-1.5 px-3 py-2 bg-[#2D1D13]/90 hover:bg-[#3E2C1E] border border-[#C49A58]/60 text-xs font-serif-royal text-[#FFFDF9] rounded-xl shadow-lg transition-colors cursor-pointer"
          title="Read a Random Blessing"
        >
          <Shuffle className="w-3.5 h-3.5 text-[#F2C94C]" />
          <span className="hidden sm:inline">Random Blessing</span>
        </button>

        {/* Fullscreen Toggle */}
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-2.5 bg-[#2D1D13]/90 hover:bg-[#3E2C1E] border border-[#C49A58]/60 text-[#FFFDF9] rounded-xl shadow-lg transition-colors cursor-pointer"
            title={isDedicatedFullscreen ? 'Exit Fullscreen' : 'Dedicated Fullscreen Scene'}
            aria-label="Toggle Fullscreen"
          >
            {isDedicatedFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[#F2C94C]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-[#F2C94C]" />
            )}
          </button>
        )}
      </div>

      {/* BOTTOM-LEFT BADGE: Touch/Mouse Guidance Pill */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:block">
        <div className="bg-[#2D1D13]/80 border border-[#C49A58]/40 px-3.5 py-1.5 rounded-full text-[11px] font-serif-royal text-[#E5D8C4] shadow-md backdrop-blur-xs">
          Drag to explore • Tap golden leaves • Pinch to zoom
        </div>
      </div>

      {/* BOTTOM-CENTER ACTION BAR: Plant a Blessing */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-md w-full px-4 flex flex-col items-center space-y-2">
        {/* Primary CTA: Plant My Blessing */}
        <button
          onClick={onPlantBlessingClick}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#98502F] via-[#B87333] to-[#C49A58] hover:brightness-105 active:scale-98 text-white rounded-full font-serif-royal text-xs font-bold shadow-xl transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#FFF1B8]" />
          <span>Plant My Blessing</span>
        </button>
      </div>
    </div>
  );
};
