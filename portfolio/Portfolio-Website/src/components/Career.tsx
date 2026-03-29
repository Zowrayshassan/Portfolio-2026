import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Developer Intern</h4>
                <h5>Eyratech Software House</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Building and contributing to real-world full-stack applications.
              Learning and applying system design and scalable architecture
              concepts. Working on SaaS-based solutions in a professional team
              environment.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Co-Founder & Developer</h4>
                <h5>ZH Developers</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Leading development of modern websites and SaaS-focused solutions.
              Building high-converting landing pages for client acquisition.
              Managing technical decisions and project execution.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Content Creator</h4>
                <h5>Personal Brand</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Creating content around web development, learning journey, and
              growth. Building a personal brand through consistency and
              value-driven content. Simplifying tech concepts and sharing real
              experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
