// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import setAnimations from "./utils/animationUtils";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import {
  findMouseBones,
  handleHeadRotation,
  handleMouseMove,
  handleTouchEnd,
  handleTouchMove,
} from "./utils/mouseUtils";
import handleResize from "./utils/resizeUtils";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let neckBone: THREE.Object3D | null = null;
      let spineBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      // Use the original setCharacter utility — it handles GSAP timelines needed for loading to complete
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          setChar(character);
          scene.add(character);

          // Auto-fit camera to the character's bounding box
          const box = new THREE.Box3().setFromObject(character);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          console.log("Character bounds — center:", center, "size:", size);

          // Position camera to show the upper half of the character (head/torso)
          const charHeight = size.y;
          camera.position.set(
            center.x,
            center.y + charHeight * 0.15, // slightly above center → shows head
            center.z + charHeight * 2.2   // distance based on height
          );
          camera.lookAt(center.x, center.y + charHeight * 0.25, center.z);
          camera.updateProjectionMatrix();

          // Auto-discover head, neck and spine bones for mouse-tracking
          const mouseBones = findMouseBones(character);
          headBone = mouseBones.headBone;
          neckBone = mouseBones.neckBone;
          spineBone = mouseBones.spineBone;

          // Attach gold glasses to head bone
          if (headBone) {
            const glassesGroup = new THREE.Group();
            const goldMat = new THREE.MeshStandardMaterial({
              color: "#d4af37",
              metalness: 1,
              roughness: 0.15,
              emissive: "#1a0e00",
            });

            const rimGeo = new THREE.TorusGeometry(0.3, 0.035, 16, 32);
            const leftRim = new THREE.Mesh(rimGeo, goldMat);
            leftRim.position.set(-0.35, 0.08, 0.65);

            const rightRim = new THREE.Mesh(rimGeo, goldMat);
            rightRim.position.set(0.35, 0.08, 0.65);

            const bridgeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28);
            const bridge = new THREE.Mesh(bridgeGeo, goldMat);
            bridge.rotation.z = Math.PI / 2;
            bridge.position.set(0, 0.12, 0.65);

            const templeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9);
            const leftTemple = new THREE.Mesh(templeGeo, goldMat);
            leftTemple.rotation.x = Math.PI / 2;
            leftTemple.position.set(-0.62, 0.08, 0.2);

            const rightTemple = new THREE.Mesh(templeGeo, goldMat);
            rightTemple.rotation.x = Math.PI / 2;
            rightTemple.position.set(0.62, 0.08, 0.2);

            glassesGroup.add(leftRim, rightRim, bridge, leftTemple, rightTemple);
            glassesGroup.position.set(0, 0.75, -0.15);
            headBone.add(glassesGroup);
          }

          screenLight = character.getObjectByName("screenlight") || null;

          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });

          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        } else {
          // Character failed to load — still complete loading so site is accessible
          progress.loaded().then(() => {
            setTimeout(() => light.turnOnLights(), 2500);
          });
        }
      }).catch(() => {
        // Absolute last resort fallback
        progress.loaded().then(() => {
          setTimeout(() => light.turnOnLights(), 2500);
        });
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp,
            neckBone,
            spineBone
          );
          light.setPointLight(screenLight);
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
