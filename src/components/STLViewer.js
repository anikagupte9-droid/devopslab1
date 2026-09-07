import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const STLViewer = ({ fileUrl }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!fileUrl || !mountRef.current) return;

    const mount = mountRef.current;

    // 🧱 Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1121);

    // 🎥 Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);

    // 🖥️ Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // 💡 Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(ambientLight, directionalLight);

    // 🌀 Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;

    // 📂 STL Loader
    const loader = new STLLoader();
    loader.load(
      fileUrl,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({
          color: 0x3b82f6,
          metalness: 0.3,
          roughness: 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);

        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const center = new THREE.Vector3();
        box.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 50 / maxDim;
        mesh.scale.set(scale, scale, scale);

        scene.add(mesh);
        camera.position.set(0, 0, maxDim * 1.5);
        controls.update();
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
      (error) => console.error('Error loading STL:', error)
    );

    // 🔁 Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 📏 Resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 🧹 Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [fileUrl]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '12px',
        background: '#0b1121',
      }}
    />
  );
};

export default STLViewer;
