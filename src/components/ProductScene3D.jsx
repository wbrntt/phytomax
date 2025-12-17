import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Seeded random for deterministic particle positions
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Reflective product display component
function ReflectiveProduct({ texture, mousePosition }) {
  const meshRef = useRef()
  const materialRef = useRef()
  
  // Create a rounded box geometry for the product package
  const geometry = useMemo(() => {
    return new THREE.BoxGeometry(2, 3, 0.4, 32, 32, 32)
  }, [])
  
  // Animate based on mouse position
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation following mouse
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mousePosition.x * 0.3,
        0.05
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mousePosition.y * 0.15,
        0.05
      )
      
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
    
    // Animate environment intensity for shimmer effect
    if (materialRef.current) {
      materialRef.current.envMapIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.8}
          color="#D4A574"
        />
      </mesh>
      
      {/* Golden rim light effect */}
      <mesh geometry={geometry} scale={1.02}>
        <meshBasicMaterial
          color="#D4A574"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </Float>
  )
}

// Animated light particles
function GoldenParticles({ count = 50 }) {
  const particlesRef = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Use seeded random for deterministic positions
      pos[i * 3] = (seededRandom(i * 3) - 0.5) * 8
      pos[i * 3 + 1] = (seededRandom(i * 3 + 1) - 0.5) * 8
      pos[i * 3 + 2] = (seededRandom(i * 3 + 2) - 0.5) * 4
    }
    return pos
  }, [count])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002
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
        size={0.03}
        color="#D4A574"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Reflective floor
function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[20, 20]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#050505"
        metalness={0.5}
        mirror={0.5}
      />
    </mesh>
  )
}

// Scene setup with lighting
function Scene({ mousePosition, productTexture }) {
  return (
    <>
      {/* Dramatic lighting setup */}
      <ambientLight intensity={0.2} />
      
      {/* Key light - golden warm */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        color="#D4A574"
        castShadow
      />
      
      {/* Fill light - cooler */}
      <spotLight
        position={[-5, 3, 2]}
        angle={0.5}
        penumbra={1}
        intensity={1}
        color="#ffffff"
      />
      
      {/* Rim light - dramatic back light */}
      <pointLight
        position={[0, 3, -5]}
        intensity={2}
        color="#D4A574"
      />
      
      {/* Bottom accent */}
      <pointLight
        position={[0, -3, 2]}
        intensity={0.5}
        color="#B8956E"
      />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Product */}
      <ReflectiveProduct texture={productTexture} mousePosition={mousePosition} />
      
      {/* Particles */}
      <GoldenParticles />
      
      {/* Reflective floor */}
      <ReflectiveFloor />
    </>
  )
}

// Main 3D Product Component
export default function ProductScene3D({ mousePosition = { x: 0, y: 0 } }) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Mobile fallback - CSS-based reflections
  if (isMobile) {
    return <MobileProductFallback mousePosition={mousePosition} />
  }
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Scene mousePosition={mousePosition} productTexture={null} />
      </Canvas>
    </div>
  )
}

// Mobile fallback with CSS-based reflections
function MobileProductFallback({ mousePosition }) {
  const containerRef = useRef(null)
  
  const reflectionStyle = useMemo(() => ({
    transform: `
      perspective(1000px) 
      rotateY(${mousePosition.x * 15}deg) 
      rotateX(${-mousePosition.y * 10}deg)
      translateZ(20px)
    `,
    transition: 'transform 0.1s ease-out',
  }), [mousePosition])
  
  const highlightStyle = useMemo(() => ({
    background: `
      radial-gradient(
        ellipse at ${50 + mousePosition.x * 30}% ${50 + mousePosition.y * 30}%, 
        rgba(255,255,255,0.4) 0%, 
        rgba(212,165,116,0.2) 30%, 
        transparent 70%
      )
    `,
  }), [mousePosition])
  
  const fresnelStyle = useMemo(() => ({
    background: `
      linear-gradient(
        ${90 + mousePosition.x * 45}deg,
        transparent 0%,
        rgba(212,165,116,0.3) 45%,
        rgba(255,255,255,0.5) 50%,
        rgba(212,165,116,0.3) 55%,
        transparent 100%
      )
    `,
    opacity: 0.7 + Math.abs(mousePosition.x) * 0.3,
  }), [mousePosition])

  return (
    <div 
      ref={containerRef}
      className="relative w-64 md:w-80 lg:w-96 h-auto mx-auto"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-3xl blur-3xl scale-110 -z-10 animate-pulse"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,165,116,0.4) 0%, transparent 70%)',
        }}
      />
      
      {/* Main product container */}
      <div
        className="relative"
        style={reflectionStyle}
      >
        {/* Product image placeholder - will be replaced with actual image */}
        <div 
          className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
            boxShadow: `
              0 25px 50px rgba(0,0,0,0.5),
              0 0 100px rgba(212,165,116,0.2),
              inset 0 1px 1px rgba(255,255,255,0.1)
            `,
          }}
        >
          {/* Highlight overlay */}
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-100"
            style={highlightStyle}
          />
          
          {/* Fresnel edge effect */}
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-100"
            style={fresnelStyle}
          />
          
          {/* Shimmer animation */}
          <div 
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div 
              className="absolute w-[200%] h-full -left-full animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Reflection on floor */}
      <div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16"
        style={{
          background: 'linear-gradient(to bottom, rgba(212,165,116,0.2), transparent)',
          filter: 'blur(20px)',
          transform: `scaleY(0.3) translateY(${mousePosition.y * 10}px)`,
        }}
      />
    </div>
  )
}