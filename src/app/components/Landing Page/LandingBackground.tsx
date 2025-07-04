"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const LandingBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050014); // deep blacklight purple

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearAlpha(0); // transparent
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Responsive resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Create floating spheres
    const spheres: THREE.Mesh[] = [];
    const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x00fff7, // neon cyan
      emissive: 0x7f00ff, // neon purple glow
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.3,
      metalness: 0.7,
    });
    for (let i = 0; i < 12; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
      sphere.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      );
      scene.add(sphere);
      spheres.push(sphere);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x00fff7, 0.5); // neon cyan
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xff00ea, 1.2); // neon magenta
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Animation loop
    let frameId: number;
    const animate = () => {
      spheres.forEach((sphere, i) => {
        sphere.position.y += Math.sin(Date.now() * 0.001 + i) * 0.005;
        sphere.position.x += Math.cos(Date.now() * 0.0012 + i) * 0.003;
        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.002;
      });
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -10,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
};

export default LandingBackground; 