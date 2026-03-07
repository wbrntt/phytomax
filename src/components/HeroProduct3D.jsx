import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import productImage from '../assets/phytogold.png'

// Seeded random for deterministic particle positions
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Check WebGL support outside of React
const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

const SUPPORTS_WEBGL = typeof window !== 'undefined' ? checkWebGLSupport() : false

// Product plane with texture and reflections
function ProductPlane({ mousePosition }) {
  const meshRef = useRef()
  const shaderRef = useRef()
  const texture = useTexture(productImage)

  // Animate based on mouse position and update shader uniforms
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mousePosition.x * 0.3,
        0.08
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mousePosition.y * 0.15,
        0.08
      )
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }

    // Update shader uniforms directly
    if (shaderRef.current) {
      shaderRef.current.uniforms.uMouse.value.x = mousePosition.x
      shaderRef.current.uniforms.uMouse.value.y = mousePosition.y
    }
  })

  const aspectRatio = texture ? texture.image.width / texture.image.height : 1
  const planeHeight = 3.2
  const planeWidth = planeHeight * aspectRatio

  // Create uniforms once
  const uniforms = useMemo(() => ({
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), [])

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.15}
    >
      <group ref={meshRef}>
        {/* Main product plane */}
        <mesh>
          <planeGeometry args={[planeWidth, planeHeight]} />
          <meshBasicMaterial map={texture} transparent />
        </mesh>

        {/* Foil reflections */}
        <mesh position={[0, 0, 0.003]}>
          <planeGeometry args={[planeWidth, planeHeight]} />
          <shaderMaterial
            ref={shaderRef}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            uniforms={uniforms}
            vertexShader={`
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec2 uMouse;
              varying vec2 vUv;

              // Smooth noise function
              vec2 hash2(vec2 p) {
                p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
                return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
              }

              float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);

                return mix(mix(dot(hash2(i), f),
                               dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                           mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                               dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
              }

              void main() {
                // Light direction from mouse
                vec2 lightDir = normalize(vec2(0.5 + uMouse.x, 0.5 - uMouse.y));

                // Simple, sparse wrinkles - lower frequency
                float height = noise(vUv * 3.5);

                // Calculate normal from heightmap
                float eps = 0.015;
                float hL = noise((vUv - vec2(eps, 0.0)) * 3.5);
                float hR = noise((vUv + vec2(eps, 0.0)) * 3.5);
                float hD = noise((vUv - vec2(0.0, eps)) * 3.5);
                float hU = noise((vUv + vec2(0.0, eps)) * 3.5);
                vec2 normal = vec2(hL - hR, hD - hU);

                // How much this surface catches the light
                float lighting = dot(normalize(normal), lightDir);
                lighting = smoothstep(0.0, 0.6, lighting);

                // Very subtle highlight
                float reflection = lighting * 0.1;

                // Edge fade
                float edge = smoothstep(0.0, 0.03, vUv.x) * smoothstep(1.0, 0.97, vUv.x);
                edge *= smoothstep(0.0, 0.03, vUv.y) * smoothstep(1.0, 0.97, vUv.y);

                reflection *= edge;

                vec3 color = vec3(1.0, 0.97, 0.9);
                gl_FragColor = vec4(color, reflection);
              }
            `}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Update shader uniforms
function ShaderUpdater({ mousePosition }) {
  useFrame((state) => {
    state.scene.traverse((child) => {
      if (child.material && child.material.uniforms) {
        if (child.material.uniforms.uTime) {
          child.material.uniforms.uTime.value = state.clock.elapsedTime
        }
        if (child.material.uniforms.uMouse) {
          child.material.uniforms.uMouse.value.x = mousePosition.x
          child.material.uniforms.uMouse.value.y = mousePosition.y
        }
      }
    })
  })
  return null
}

// Animated light particles
function GoldenParticles({ count = 30 }) {
  const particlesRef = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seededRandom(i * 3 + 100) - 0.5) * 6
      pos[i * 3 + 1] = (seededRandom(i * 3 + 101) - 0.5) * 6
      pos[i * 3 + 2] = (seededRandom(i * 3 + 102) - 0.5) * 3 - 1
    }
    return pos
  }, [count])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03
      const posArray = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.5) * 0.003
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#D4A574"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}


// Scene setup with lighting - neutral white lights to preserve original colors
function Scene({ mousePosition }) {
  return (
    <>
      {/* Shader updater */}
      <ShaderUpdater mousePosition={mousePosition} />

      {/* Ambient fill - neutral white */}
      <ambientLight intensity={0.6} color="#ffffff" />

      {/* Key light - bright white from top-right */}
      <directionalLight
        position={[4, 4, 5]}
        intensity={1.2}
        color="#ffffff"
      />

      {/* Fill light - softer from left */}
      <directionalLight
        position={[-3, 2, 3]}
        intensity={0.6}
        color="#ffffff"
      />

      {/* Rim light - subtle back light */}
      <pointLight
        position={[0, 1, -3]}
        intensity={0.4}
        color="#ffffff"
      />

      {/* Product */}
      <Suspense fallback={null}>
        <ProductPlane mousePosition={mousePosition} />
      </Suspense>

      {/* Particles */}
      <GoldenParticles />
    </>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
    </div>
  )
}

// Main 3D Product Component
export default function HeroProduct3D({ mousePosition = { x: 0, y: 0 } }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Check for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', checkMobile)
    
    // Simulate loading
    const timer = setTimeout(() => setIsLoaded(true), 100)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timer)
    }
  }, [])
  
  // Mobile or no WebGL fallback - CSS-based reflections
  if (isMobile || !SUPPORTS_WEBGL) {
    return <MobileProductFallback mousePosition={mousePosition} />
  }
  
  return (
    <div className="w-full h-[450px] md:h-[500px] lg:h-[550px] relative">
      {!isLoaded && <LoadingFallback />}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{
          background: 'transparent',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
        onCreated={() => setIsLoaded(true)}
      >
        <Scene mousePosition={mousePosition} />
      </Canvas>
    </div>
  )
}

// Mobile fallback - clean display with interactive reflections
function MobileProductFallback({ mousePosition }) {
  const [isLoaded, setIsLoaded] = useState(false)

  const transformStyle = useMemo(() => ({
    transform: `
      perspective(1000px)
      rotateY(${mousePosition.x * 8}deg)
      rotateX(${-mousePosition.y * 5}deg)
    `,
    transition: 'transform 0.2s ease-out',
  }), [mousePosition])

  // Multiple highlights that move with mouse to simulate foil reflections
  const reflectionStyle = useMemo(() => {
    const mx = mousePosition.x
    const my = mousePosition.y
    return {
      background: `
        radial-gradient(
          ellipse 40% 30% at ${50 + mx * 40}% ${30 + my * 25}%,
          rgba(255,255,255,0.35) 0%,
          transparent 70%
        ),
        radial-gradient(
          ellipse 25% 20% at ${35 + mx * 30}% ${55 + my * 20}%,
          rgba(255,255,255,0.2) 0%,
          transparent 60%
        ),
        radial-gradient(
          ellipse 30% 25% at ${65 - mx * 25}% ${45 - my * 15}%,
          rgba(212,165,116,0.25) 0%,
          transparent 65%
        ),
        linear-gradient(
          ${135 + mx * 20}deg,
          transparent 30%,
          rgba(255,255,255,0.08) 45%,
          transparent 55%
        ),
        linear-gradient(
          ${45 - mx * 15}deg,
          transparent 40%,
          rgba(212,165,116,0.1) 50%,
          transparent 60%
        )
      `,
    }
  }, [mousePosition])

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      {/* Main product container */}
      <div
        className="relative"
        style={transformStyle}
      >
        {/* Subtle glow behind */}
        <div
          className="absolute -inset-4 rounded-2xl blur-2xl -z-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(212,165,116,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Product image - full brightness */}
        <div className="relative">
          <img
            src={productImage}
            alt="Phyto Gold Premium Supplement"
            className={`w-64 md:w-80 lg:w-96 h-auto object-contain transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
            }}
          />

          {/* Multi-layer moving reflections */}
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-150"
            style={reflectionStyle}
          />
        </div>
      </div>
    </div>
  )
}