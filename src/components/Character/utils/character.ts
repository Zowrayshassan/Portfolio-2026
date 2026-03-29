// @ts-nocheck
import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setAllTimeline, setCharTimeline } from "../../utils/GsapScroll";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>((resolve) => {
      loader.load(
        "/models/character1.glb",
        async (gltf) => {
          const character = gltf.scene;
          await renderer.compileAsync(character, camera, scene);
          character.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              child.frustumCulled = true;
            }
          });
          resolve(gltf);
          try {
            setCharTimeline(character, camera);
            setAllTimeline();
          } catch (err) {
            console.warn("GSAP timeline setup (non-fatal):", err);
          }
          dracoLoader.dispose();
        },
        undefined,
        (error) => {
          console.error("Error loading character1.glb:", error);
          resolve(null);
        }
      );
    });
  };

  return { loadCharacter };
};

export default setCharacter;
