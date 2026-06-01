"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ---------- Утилиты ---------- */
const R = 2; // радиус глобуса

function latLngToVec3(lat: number, lng: number, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

const HUBS: [number, number][] = [
  [55.75, 37.62], [40.71, -74.0], [35.68, 139.69], [25.2, 55.27],
  [51.5, -0.12], [48.85, 2.35], [1.35, 103.82], [-33.86, 151.2],
  [37.77, -122.41], [19.43, -99.13], [-23.55, -46.63], [13.75, 100.5],
  [52.52, 13.4], [41.0, 28.97], [31.22, 121.45], [28.61, 77.2],
];

/* ---------- Глобус (точечная сфера) ---------- */
function GlobeDots() {
  const points = useMemo(() => {
    const pts: number[] = [];
    const n = 1600;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push(Math.cos(theta) * radius * R, y * R, Math.sin(theta) * radius * R);
    }
    return new Float32Array(pts);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#1f4d4d" transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

/* ---------- Каркасная сфера + атмосфера ---------- */
function GlobeShell() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[R * 0.99, 48, 48]} />
        <meshBasicMaterial color="#062222" transparent opacity={0.55} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R * 1.02, 64, 64]} />
        <meshBasicMaterial color="#103838" wireframe transparent opacity={0.18} />
      </mesh>
      {/* атмосферное свечение */}
      <mesh scale={1.18}>
        <sphereGeometry args={[R, 64, 64]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          uniforms={{ c: { value: new THREE.Color("#ffdead") } }}
          vertexShader={`varying float i;void main(){vec3 n=normalize(normalMatrix*normal);vec3 v=normalize(-(modelViewMatrix*vec4(position,1.0)).xyz);i=pow(1.0-dot(n,v),2.4);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
          fragmentShader={`uniform vec3 c;varying float i;void main(){gl_FragColor=vec4(c,i*0.45);}`}
        />
      </mesh>
    </>
  );
}

/* ---------- Точки подключения (хабы) ---------- */
function Hubs() {
  return (
    <group>
      {HUBS.map((h, idx) => {
        const p = latLngToVec3(h[0], h[1], R * 1.01);
        return (
          <mesh key={idx} position={p}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshBasicMaterial color="#ffdead" />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------- Дуги-маршруты с бегущими частицами ---------- */
function Arc({ from, to, delay }: { from: [number, number]; to: [number, number]; delay: number }) {
  const dotRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const start = latLngToVec3(from[0], from[1]);
    const end = latLngToVec3(to[0], to[1]);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.normalize().multiplyScalar(R + dist * 0.45);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)), [curve]);

  useFrame(({ clock }) => {
    if (!dotRef.current) return;
    const t = (clock.elapsedTime * 0.18 + delay) % 1;
    const p = curve.getPoint(t);
    dotRef.current.position.copy(p);
    const s = Math.sin(t * Math.PI);
    dotRef.current.scale.setScalar(0.4 + s * 0.9);
  });

  return (
    <group>
      <primitive object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#ffdead", transparent: true, opacity: 0.32 }))} />
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Routes() {
  const routes = useMemo(() => {
    const r: { from: [number, number]; to: [number, number]; delay: number }[] = [];
    for (let i = 0; i < 9; i++) {
      const a = HUBS[(i * 3) % HUBS.length];
      const b = HUBS[(i * 5 + 2) % HUBS.length];
      r.push({ from: a, to: b, delay: (i / 9) });
    }
    return r;
  }, []);
  return <>{routes.map((rt, i) => <Arc key={i} {...rt} />)}</>;
}

/* ---------- Спутниковые орбиты ---------- */
function Orbits() {
  const g1 = useRef<THREE.Group>(null);
  const g2 = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g1.current) g1.current.rotation.y += d * 0.12;
    if (g2.current) g2.current.rotation.x += d * 0.09;
  });
  const ring = (radius: number) => {
    const pts = new THREE.Path().absarc(0, 0, radius, 0, Math.PI * 2, false).getPoints(80);
    return new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, p.y, 0)));
  };
  return (
    <>
      <group ref={g1} rotation={[Math.PI / 2.6, 0, 0]}>
        <primitive object={new THREE.Line(ring(R * 1.5), new THREE.LineBasicMaterial({ color: "#1f4d4d", transparent: true, opacity: 0.5 }))} />
      </group>
      <group ref={g2} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <primitive object={new THREE.Line(ring(R * 1.75), new THREE.LineBasicMaterial({ color: "#103838", transparent: true, opacity: 0.45 }))} />
      </group>
    </>
  );
}

/* ---------- Вращающийся мир + параллакс мыши ---------- */
function World() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, d) => {
    if (!group.current) return;
    group.current.rotation.y += d * 0.045;
    // мягкий параллакс к курсору
    group.current.rotation.x += (pointer.y * 0.25 - group.current.rotation.x) * 0.04;
    group.current.position.x += (pointer.x * 0.4 - group.current.position.x) * 0.04;
  });
  return (
    <group ref={group}>
      <GlobeShell />
      <GlobeDots />
      <Hubs />
      <Routes />
      <Orbits />
    </group>
  );
}

export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 6.2], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 3, 5]} intensity={1.2} color="#ffdead" />
      <World />
    </Canvas>
  );
}
