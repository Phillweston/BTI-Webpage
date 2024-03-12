/* eslint-disable no-undef */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { siteConfig } from '@/lib/config';
import { useGlobal } from '@/lib/global';

export default function ThreeDModel() {
  const { switchTheme } = useGlobal();
  const showPet = JSON.parse(siteConfig('WIDGET_PET'));
  const petLink = siteConfig('WIDGET_PET_LINK'); // URL to your 3D model
  const canvasRef = useRef();

  useEffect(() => {
    if (!showPet) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Enhanced Ambient Light for softer overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Adjust intensity as needed
    scene.add(ambientLight);

    // Enhanced Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 3, 3); // Reposition to illuminate the model more evenly
    scene.add(directionalLight);

    // Optional: Additional Light Source
    const additionalLight = new THREE.PointLight(0xffffff, 0.5, 100);
    additionalLight.position.set(-5, 3, 5); // Adjust position as needed
    scene.add(additionalLight);

    camera.position.z = 5;

    const proxyUrl = `/api/modelProxy?modelUrl=${encodeURIComponent(petLink)}`;
    const loader = new GLTFLoader();
    let model;
    loader.load(proxyUrl, (gltf) => {
      model = gltf.scene;

      // Change color to blue and scale the model
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(0x0f73bb); // Blue color
          child.material.emissive = new THREE.Color(0x111111); // Slight emissive property for additional brightness
        }
      });
      model.scale.set(1, 1, 1); // Scale the model up

      scene.add(model);
    }, undefined, (error) => {
      console.error(error);
    });

    function animate() {
      if (model) {
        model.rotation.y += 0.01;
      }
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showPet, petLink]);

  function handleClick() {
    if (JSON.parse(siteConfig('WIDGET_PET_SWITCH_THEME'))) {
      switchTheme();
    }
  }

  if (!showPet) {
    return null;
  }

  return (
    <canvas ref={canvasRef} width="400" height="600" onClick={handleClick}
      className="cursor-grab"
      onMouseDown={(e) => e.target.classList.add('cursor-grabbing')}
      onMouseUp={(e) => e.target.classList.remove('cursor-grabbing')} />
  );
}
