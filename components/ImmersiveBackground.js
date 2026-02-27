/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function WavyBackgroundPlane() {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.5, 0]}>
      <planeGeometry args={[40, 40, 300, 300]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave1 = sin(pos.x * 1.5 + uTime * 0.8) * 0.6;
            float wave2 = cos(pos.y * 2.0 - uTime * 0.6) * 0.4;
            float wave3 = sin((pos.x + pos.y) * 0.7 + uTime * 0.9) * 0.3;
            pos.z += wave1 + wave2 + wave3;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;

          void main() {
            float depth = 1.0 - vUv.y;
            vec3 deepColor = vec3(0.01, 0.05, 0.16);
            vec3 midColor = vec3(0.06, 0.27, 0.55);
            vec3 surfaceColor = vec3(0.4, 0.75, 1.0);
            vec3 color = mix(deepColor, midColor, depth);
            color = mix(color, surfaceColor, smoothstep(0.65, 1.0, depth));
            gl_FragColor = vec4(color, 1.0);
          }
        `}
        transparent={false}
      />
    </mesh>
  );
}

export default function ImmersiveBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 4, 6], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 3]} intensity={1.1} color="#60a5fa" />
        <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#0ea5e9" />
        <WavyBackgroundPlane />
      </Canvas>
    </div>
  );
}

