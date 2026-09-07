// src/components/Viewer3D.js
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const Viewer3D = ({ fileUrl, color = 0x3b82f6 }) => {
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 10);
    scene.add(ambientLight, dirLight);

    // 🌀 Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 📂 Load STL
    const loader = new STLLoader();
    loader.load(
      fileUrl,
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.3,
          roughness: 0.5,
        });
        const mesh = new THREE.Mesh(geometry, material);

        // Center geometry
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const center = new THREE.Vector3();
        box.getCenter(center);
        geometry.translate(-center.x, -center.y, -center.z);

        // Scale to fit view
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 50 / maxDim;
        mesh.scale.set(scale, scale, scale);
        scene.add(mesh);

        // Fit camera
        camera.position.set(0, 0, 100);
        controls.update();
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
      (error) => console.error("Error loading STL:", error)
    );

    // 🔁 Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 📏 Resize handler
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // 🧹 Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [fileUrl, color]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
        background: "#0b1121",
      }}
    />
  );
};

export default Viewer3D;
