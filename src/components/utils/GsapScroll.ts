// @ts-nocheck
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  let intensity: number = 0;
  setInterval(() => {
    intensity = Math.random();
  }, 200);
  let screenLight: any, monitor: any;
  character?.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.027") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#C8BFFF");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = object;
    }
  });

  let neckBone = character?.getObjectByName("spine005");
  if (!neckBone && character) {
    // Fallback: try to find anything named 'neck' or 'spine'
    character.traverse((child: any) => {
      if (!neckBone && (child.name.toLowerCase().includes("neck") || child.name.toLowerCase().includes("spine"))) {
        neckBone = child;
      }
    });
  }

  let mm = gsap.matchMedia();

  mm.add("(min-width: 1025px)", () => {
    if (!character) return;
    const tl1 = gsap.timeline({ scrollTrigger: { trigger: ".landing-section", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
    const tl2 = gsap.timeline({ scrollTrigger: { trigger: ".about-section", start: "center 55%", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
    const tl3 = gsap.timeline({ scrollTrigger: { trigger: ".whatIDO", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } });

    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
      .to(camera.position, { z: "+=0" }, 0)
      .fromTo(".character-model", { x: "-10%", y: "0%" }, { x: "-35%", y: "10%", duration: 1 }, 0)
      .fromTo(".landing-container", { opacity: 1 }, { opacity: 0, duration: 0.4 }, 0)
      .fromTo(".landing-container", { y: "0%" }, { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me", { y: "-50%", x: "-5%" }, { y: 0, x: 0 }, 0);

    tl2
      .to(camera.position, { z: "+=3", y: 12.5, duration: 6, delay: 2, ease: "power3.inOut" }, 0)
      .to(".about-section", { y: "30%", duration: 6 }, 0)
      .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
      .fromTo(".character-model", { pointerEvents: "inherit" }, { pointerEvents: "none", x: "-40%", delay: 2, duration: 5 }, 0)
      .to(character.rotation, { y: 0.9, x: -0.05, delay: 1, duration: 2 }, 0);
        
    if (neckBone) {
      tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
    }

    if (monitor && monitor.material) {
      tl2.to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0)
         .fromTo(monitor.position, { y: -10, z: 2 }, { y: 0, z: 0, delay: 1.5, duration: 3 }, 0);
    }
    
    if (screenLight && screenLight.material) {
      tl2.to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
    }

    tl2
      .fromTo(".character-rim", { opacity: 1, scaleX: 1.4 }, { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 }, 0.3);

    const tM2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".what-box",
        start: "top 70%",
        end: "bottom top",
      },
    });
    tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);

    tl3
      .fromTo(".character-model", { y: "0%" }, { y: "-100%", duration: 4, ease: "none", delay: 1 }, 0)
      .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
      .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
  });

  mm.add("(max-width: 1024px)", () => {
    if (!character) return;
    
    const tM2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".what-box",
        start: "top 70%",
        end: "bottom top",
      },
    });
    tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
  });
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5 },
      0
    )

    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }
}
