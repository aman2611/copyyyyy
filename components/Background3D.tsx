
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../App';

const Background3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    
    const bgColor = isDarkMode ? 0x020617 : 0xf8fafc;
    const primaryColor = isDarkMode ? 0x3b82f6 : 0x2563eb;
    const secondaryColor = isDarkMode ? 0x06b6d4 : 0x94a3b8;

    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.02);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 50); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const getParticleTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.5, 'rgba(255,255,255,0.4)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 32, 32);
        }
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };

    const rows = 120;
    const cols = 120;
    const separation = 1.2;
    const particleCount = rows * cols;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(primaryColor);
    const c2 = new THREE.Color(secondaryColor);

    let idx = 0;
    for (let x = 0; x < rows; x++) {
        for (let z = 0; z < cols; z++) {
            positions[idx * 3] = (x - rows / 2) * separation;
            positions[idx * 3 + 1] = 0;
            positions[idx * 3 + 2] = (z - cols / 2) * separation;

            const ratio = (x / rows) + (Math.random() * 0.1);
            const mixedColor = c1.clone().lerp(c2, ratio);
            
            colors[idx * 3] = mixedColor.r;
            colors[idx * 3 + 1] = mixedColor.g;
            colors[idx * 3 + 2] = mixedColor.b;

            idx++;
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        map: getParticleTexture(),
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0.8
    });

    const ocean = new THREE.Points(geometry, material);
    scene.add(ocean);

    const shapesGroup = new THREE.Group();
    const shapeGeo = new THREE.IcosahedronGeometry(1, 0);
    const shapeMat = new THREE.MeshBasicMaterial({ 
        color: primaryColor, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.1 
    });

    for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(shapeGeo, shapeMat);
        mesh.position.set(
            (Math.random() - 0.5) * 100,
            Math.random() * 20 + 5,
            (Math.random() - 0.5) * 80
        );
        mesh.scale.setScalar(Math.random() * 2 + 0.5);
        mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        shapesGroup.add(mesh);
    }
    scene.add(shapesGroup);

    let time = 0;
    let frameId: number;

    const animate = () => {
      time += 0.03;
      
      const posAttribute = ocean.geometry.attributes.position;
      const positionsArr = posAttribute.array as Float32Array;

      let i = 0;
      for (let x = 0; x < rows; x++) {
        for (let z = 0; z < cols; z++) {
          const px = positionsArr[i*3];
          const pz = positionsArr[i*3 + 2];
          
          const y = Math.sin(px * 0.1 + time * 0.5) * 2.0 + 
                    Math.cos(pz * 0.08 + time * 0.4) * 2.0 + 
                    Math.sin((px + pz) * 0.05 + time) * 1.0;
          
          positionsArr[i*3 + 1] = y;
          i++;
        }
      }
      posAttribute.needsUpdate = true;

      shapesGroup.rotation.y = time * 0.05;
      shapesGroup.children.forEach((shape, index) => {
          shape.rotation.x += 0.005;
          shape.rotation.y += 0.01;
          shape.position.y += Math.sin(time + index) * 0.02;
      });

      camera.position.x = Math.sin(time * 0.05) * 10;
      camera.position.y = 15 + Math.cos(time * 0.05) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      shapeGeo.dispose();
      shapeMat.dispose();
      renderer.dispose();
    };
  }, [isDarkMode]);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default Background3D;
