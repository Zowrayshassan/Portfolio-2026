// @ts-nocheck
import gsap from "gsap";
import { SplitText } from "gsap-trial/SplitText";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0a0a",
    duration: 0.5,
    delay: 1,
  });

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  var t1 = new SplitText(".landing-h2-1", TextProps);
  var t2 = new SplitText(".landing-h2-2", TextProps);
  var t3 = new SplitText(".landing-h2-3", TextProps);

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  LoopThreeTexts(t1, t2, t3);
}

function LoopThreeTexts(t1: SplitText, t2: SplitText, t3: SplitText) {
  var tl = gsap.timeline({ repeat: -1 });
  const duration = 1.2;
  const pause = 3;
  const ease = "power3.inOut";

  // Hide initially
  gsap.set([t2.chars, t3.chars], { y: 80, opacity: 0 });

  tl.to(t1.chars, { y: -80, opacity: 0, duration, ease, stagger: 0.05, delay: pause })
    .fromTo(t2.chars, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration, ease, stagger: 0.05 }, "-=0.8")
    .to(t2.chars, { y: -80, opacity: 0, duration, ease, stagger: 0.05, delay: pause })
    .fromTo(t3.chars, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration, ease, stagger: 0.05 }, "-=0.8")
    .to(t3.chars, { y: -80, opacity: 0, duration, ease, stagger: 0.05, delay: pause })
    .fromTo(t1.chars, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration, ease, stagger: 0.05 }, "-=0.8");
}
