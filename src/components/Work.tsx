import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Work.css";
import WorkImage from "./WorkImage";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      let translateX: number = 0;

      function setTranslateX() {
        const box = document.getElementsByClassName("work-box");
        const rectLeft = document
          .querySelector(".work-container")!
          .getBoundingClientRect().left;
        const rect = box[0].getBoundingClientRect();
        const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
        let padding: number =
          parseInt(window.getComputedStyle(box[0]).padding) / 2;
        translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
      }

      setTranslateX();

      let timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: `+=${translateX}`, // Use actual scroll width
          scrub: true,
          pin: true,
          id: "work",
        },
      });

      timeline.to(".work-flex", {
        x: -translateX,
        ease: "none",
      });

      // Clean up (optional, good practice)
      return () => {
        timeline.kill();
        ScrollTrigger.getById("work")?.kill();
      };
    });
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {[
            {
              name: "AI Interview Platform (SaaS)",
              category: "AI & Full-Stack",
              tech: "Next.js, OpenAI API, Node.js, Tailwind",
              image: "/images/project1.png",
            },
            {
              name: "Project Management System",
              category: "Productivity Tool",
              tech: "React.js, Tailwind, Local Storage, GSAP",
              image: "/images/tailwind.png",
            },
            {
              name: "MERN Auth & MVC System",
              category: "Backend & Security",
              tech: "MongoDB, Express, React, Node.js, JWT",
              image: "/images/mongo.webp",
            },
            {
              name: "Django REST Auth Pro",
              category: "API & Backend",
              tech: "Python, Django, DRF, JWT, SQL",
              image: "/images/python.png",
            },
          ].map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tech}</p>
              </div>
              <WorkImage image={project.image} alt={project.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
