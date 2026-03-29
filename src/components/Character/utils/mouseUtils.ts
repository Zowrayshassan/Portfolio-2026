import * as THREE from "three";

export const handleMouseMove = (
  event: MouseEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchMove = (
  event: TouchEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchEnd = (
  setMousePosition: (
    x: number,
    y: number,
    interpolationX: number,
    interpolationY: number
  ) => void
) => {
  setTimeout(() => {
    setMousePosition(0, 0, 0.03, 0.03);
    setTimeout(() => {
      setMousePosition(0, 0, 0.1, 0.2);
    }, 1000);
  }, 2000);
};

/**
 * Rotates a chain of bones (head, neck, spine) to follow the mouse.
 * Each bone in the chain receives a decreasing fraction of the total rotation,
 * giving a natural, fluid look as if the whole upper body is reacting.
 */
export const handleHeadRotation = (
  headBone: THREE.Object3D | null,
  mouseX: number,
  mouseY: number,
  interpolationX: number,
  interpolationY: number,
  lerp: (x: number, y: number, t: number) => number,
  neckBone?: THREE.Object3D | null,
  spineBone?: THREE.Object3D | null
) => {
  if (!headBone) return;

  let basePitch = 0;
  let baseYaw = 0;

  if (window.scrollY >= 200 && window.innerWidth > 1024) {
    basePitch = -0.4;
    baseYaw = -0.3;
  }

  const maxYaw = Math.PI / 6;
  const maxPitch = Math.PI / 8;

  const clampedX = Math.max(-1, Math.min(1, mouseX));
  const clampedY = Math.max(-0.5, Math.min(0.5, mouseY));

  headBone.rotation.y = lerp(
    headBone.rotation.y,
    baseYaw + clampedX * maxYaw,
    interpolationY
  );
  headBone.rotation.x = lerp(
    headBone.rotation.x,
    basePitch - clampedY * maxPitch,
    interpolationX
  );

  if (neckBone) {
    neckBone.rotation.y = lerp(
      neckBone.rotation.y,
      (baseYaw / 2) + clampedX * maxYaw * 0.5,
      interpolationY * 0.8
    );
    neckBone.rotation.x = lerp(
      neckBone.rotation.x,
      (basePitch / 2) - clampedY * maxPitch * 0.5,
      interpolationX * 0.8
    );
  }

  if (spineBone) {
    spineBone.rotation.y = lerp(
      spineBone.rotation.y,
      (baseYaw / 4) + clampedX * maxYaw * 0.25,
      interpolationY * 0.5
    );
    spineBone.rotation.x = lerp(
      spineBone.rotation.x,
      (basePitch / 4) - clampedY * maxPitch * 0.25,
      interpolationX * 0.5
    );
  }
};

/**
 * Auto-discovers head, neck, and upper-spine bones from a loaded GLB character.
 * Returns them in order: [headBone, neckBone, spineBone].
 * Priority order matches both Mixamo and Blender rigs.
 */
export const findMouseBones = (
  character: THREE.Object3D
): {
  headBone: THREE.Object3D | null;
  neckBone: THREE.Object3D | null;
  spineBone: THREE.Object3D | null;
} => {
  const allBones: { name: string; obj: THREE.Object3D }[] = [];

  character.traverse((child) => {
    if (child.name) {
      allBones.push({ name: child.name.toLowerCase(), obj: child });
    }
  });

  const findBone = (...keywords: string[]): THREE.Object3D | null => {
    for (const kw of keywords) {
      const match = allBones.find((b) => b.name === kw.toLowerCase());
      if (match) return match.obj;
    }
    // Fallback: partial match
    for (const kw of keywords) {
      const match = allBones.find((b) => b.name.includes(kw.toLowerCase()));
      if (match) return match.obj;
    }
    return null;
  };

  const headBone = findBone(
    "Head", "head",
    "mixamorigHead",
    "Bip01 Head", "Bip001 Head"
  );

  const neckBone = findBone(
    "Neck", "neck",
    "mixamorigNeck",
    "Bip01 Neck", "Bip001 Neck"
  );

  // Prefer upper-most spine bone (spine003, spine002, spine001, spine)
  const spineBone = findBone(
    "spine006", "spine005", "spine004", "spine003", "spine002", "spine001",
    "mixamorigSpine1", "mixamorigSpine",
    "Spine1", "Spine"
  );

  console.log(
    "[MouseBones] head:", headBone?.name ?? "none",
    "| neck:", neckBone?.name ?? "none",
    "| spine:", spineBone?.name ?? "none"
  );

  return { headBone, neckBone, spineBone };
};
