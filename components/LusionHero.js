/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { FaRobot, FaSearch, FaUserPlus } from 'react-icons/fa';

function WavyPlane() {
  const materialRef = useRef();
  const clickTimeRef = useRef(0);
  const clickPosRef = useRef([0.5, 0.5]);
  const { clock } = useThree();

  useFrame(() => {
    if (materialRef.current) {
      const t = clock.getElapsedTime();
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uClickTime.value = clickTimeRef.current;
      materialRef.current.uniforms.uClickPos.value.set(
        clickPosRef.current[0],
        clickPosRef.current[1]
      );
    }
  });

  const handleClick = (e) => {
    if (!materialRef.current) return;
    if (e.uv) {
      clickPosRef.current = [e.uv.x, e.uv.y];
    }
    clickTimeRef.current = clock.getElapsedTime();
  };

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, -1, 0]}
      onPointerDown={handleClick}
    >
      <planeGeometry args={[10, 10, 200, 200]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          uTime: { value: 0 },
          uClickPos: { value: new THREE.Vector2(0.5, 0.5) },
          uClickTime: { value: 0 },
        }}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform vec2 uClickPos;
          uniform float uClickTime;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave1 = sin(pos.x * 2.0 + uTime * 1.2) * 0.15;
            float wave2 = cos(pos.y * 3.0 - uTime * 0.8) * 0.1;
            float wave3 = sin((pos.x + pos.y) * 1.5 + uTime * 0.6) * 0.08;

            // click ripple in UV space
            float dt = max(uTime - uClickTime, 0.0);
            float dist = distance(vUv, uClickPos);
            float waveFront = dt * 1.8;
            float ripple = sin((dist - waveFront) * 18.0) * 0.12;
            float fade = exp(-6.0 * abs(dist - waveFront));

            pos.z += wave1 + wave2 + wave3;
            pos.z += ripple * fade;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;

          void main() {
            float depth = 1.0 - vUv.y;
            vec3 topColor = vec3(0.0, 0.3, 0.7);
            vec3 bottomColor = vec3(0.0, 0.05, 0.2);
            vec3 color = mix(bottomColor, topColor, depth);
            color += vec3(0.1, 0.2, 0.35) * smoothstep(0.6, 1.0, depth);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
        transparent={false}
      />
    </mesh>
  );
}

export default function LusionHero() {
  return (
    <section className="lusion-hero">
      <div className="lusion-hero-canvas">
        <Canvas camera={{ position: [0, 2.5, 4.5], fov: 55 }}>
          <color attach="background" args={['#020617']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 3]} intensity={1.1} />
          <directionalLight position={[-3, 3, -2]} intensity={0.5} color="#4f46e5" />
          <WavyPlane />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      <div className="lusion-hero-overlay">
        <div className="lusion-hero-inner">
          <div className="lusion-hero-content">
            <p className="lusion-hero-kicker">Beyond Resumes, Into Real Jobs</p>
            <h1 className="lusion-hero-title">
              Find Your Dream Job with <span>AI Illusion</span>
            </h1>
            <p className="lusion-hero-subtitle">
              An immersive, AI-powered job portal that feels alive — guiding you to real
              opportunities with intelligent matching and modern experiences.
            </p>
            <div className="lusion-hero-actions">
              <Link href="/jobs" className="btn btn-primary">
                <FaSearch /> Start Job Search
              </Link>
              <Link href="/register" className="btn btn-secondary">
                <FaUserPlus /> Create Free Profile
              </Link>
            </div>
          </div>

          <div className="lusion-hero-avatar">
            <div className="lusion-hero-avatar-circle">
              <FaRobot />
            </div>
            <p className="lusion-hero-avatar-caption">
              Luna, your AI career assistant, is ready to help.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lusion-hero {
          position: relative;
          min-height: 80vh;
          overflow: hidden;
          color: #e5e7eb;
          background: radial-gradient(circle at top left, #0f172a, #020617 60%);
        }

        .lusion-hero-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .lusion-hero-overlay {
          position: relative;
          z-index: 1;
          padding: 4rem 5%;
        }

        .lusion-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
        }

        .lusion-hero-content {
          flex: 1.4;
          max-width: 640px;
        }

        .lusion-hero-kicker {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #93c5fd;
          margin-bottom: 0.75rem;
        }

        .lusion-hero-title {
          font-size: 3rem;
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #f9fafb;
        }

        .lusion-hero-title span {
          background: linear-gradient(120deg, #38bdf8, #4f46e5, #a855f7);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .lusion-hero-subtitle {
          font-size: 1.1rem;
          color: #cbd5f5;
          max-width: 520px;
          margin-bottom: 2rem;
        }

        .lusion-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn {
          padding: 0.9rem 1.8rem;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease,
            color 0.2s ease;
        }

        .btn-primary {
          background: linear-gradient(120deg, #38bdf8, #4f46e5);
          color: #0b1220;
          box-shadow: 0 18px 45px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: #e5e7eb;
          border: 1px solid rgba(148, 163, 184, 0.7);
          backdrop-filter: blur(8px);
        }

        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(30, 64, 175, 0.5);
        }

        .lusion-hero-avatar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .lusion-hero-avatar-circle {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffffff, #93c5fd 45%, #1e3a8a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4.5rem;
          color: #1f2937;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.8);
          animation: float 5s ease-in-out infinite;
        }

        .lusion-hero-avatar-caption {
          font-size: 0.95rem;
          color: #9ca3af;
          text-align: center;
          max-width: 260px;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @media (max-width: 900px) {
          .lusion-hero {
            min-height: 70vh;
          }

          .lusion-hero-inner {
            flex-direction: column;
            align-items: flex-start;
          }

          .lusion-hero-avatar {
            align-items: flex-start;
          }
        }

        @media (max-width: 640px) {
          .lusion-hero-overlay {
            padding: 3rem 1.5rem;
          }

          .lusion-hero-title {
            font-size: 2.2rem;
          }

          .lusion-hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .lusion-hero-avatar {
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}

