import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  Wrench,
  PersonStanding,
  ShieldCheck,
  Split,
  TabletSmartphone,
  Rocket,
  Lightbulb,
} from "lucide-react";
import "./Styles/About.css";

const SKILL_CARDS = [
  {
    icon: <Wrench size={32} strokeWidth={2.2} color="#78cfff" />,
    title: "Performance Optimization",
    description:
      "Built web apps that load in the blink of an eye using cutting-edge techniques.",
  },
  {
    icon: <PersonStanding size={32} strokeWidth={2.2} color="#78cfff" />,
    title: "Accessibility",
    description:
      "Improved accessibility in projects, making the web inclusive and usable for everyone.",
  },
  {
    icon: <ShieldCheck size={32} strokeWidth={2.2} color="#78cfff" />,
    title: "Code Quality",
    description:
      "Maintained clean, well documented, and tested codebases across all projects.",
  },
  {
    icon: <Split size={32} strokeWidth={2.2} color="#78cfff" />,
    title: "Code Splitting",
    description:
      "Optimized apps by reducing initial load times with code-splitting strategies.",
  },
  {
    icon: <TabletSmartphone size={32} strokeWidth={2.2} color="#78cfff" />,
    title: "Responsive Designs",
    description:
      "Crafted interfaces that look and work great on any device, delivering smooth and consistent user experiences.",
  },
  {
    icon: <Rocket size={32} strokeWidth={2.2} color="#78cfff" />,
    title: "Modern Techniques",
    description:
      "Leveraged the latest tools like React.js, Next.js, and Tailwind CSS to build modern and scalable web applications.",
  },
];

const JOURNEY_STEPS = [
  { title: "Curiosity", description: "Started exploring how websites work." },
  { title: "Learning", description: "Focused on modern frontend development." },
  { title: "Building", description: "Creating polished digital experiences." },
];

const About = ({
  show,
  exit,
  direction,
  onNavigateToHero,
  onNavigateToProjects,
  onNavigateToAbout,
  onNavigateToContact,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setLoaded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setLoaded(false);
    }
  }, [show]);

  return (
    <section
      className={`about-section ${show ? "show" : ""} ${exit ? "exit" : ""} ${loaded ? "loaded" : ""} ${!show && !exit ? "hidden" : ""}`}
    >
      <div className="box">
        <Navbar
          activePage="about"
          onNavigateToHero={onNavigateToHero}
          onNavigateToProjects={onNavigateToProjects}
          onNavigateToAbout={onNavigateToAbout}
          onNavigateToContact={onNavigateToContact}
        />
        <section className="content">
          <div className="left-box">
            <div className="title">
              <h2>Years Of Experience, Delivery Real Value</h2>
              <p>
                Over the years, I've worn many hats, learned valuable lessons,
                and created web solutions that drive success. Here's a bit more
                about what I do.
              </p>
            </div>
            <div className="cards">
              {SKILL_CARDS.map(({ icon, title, description }) => (
                <div className="card" key={title}>
                  <div className="title">
                    <div className="circle">{icon}</div>
                    <h3>{title}</h3>
                  </div>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="right-box">
            <span>ABOUT ME</span>
            <h2>Building products with purpose.</h2>
            <p>
              My journey into web development started with curiosity about how
              digital experiences are created. Over time, that curiosity evolved
              into a passion for building products that people genuinely enjoy
              using.
            </p>
            <div className="mindset-card">
              <div className="icon">
                <Lightbulb size={32} strokeWidth={2.2} color="#78cfff" />
              </div>
              <div className="content">
                <h3>My Philosophy</h3>
                <p>
                  Great products are not defined by complexity. They are defined
                  by clarity, usability, and meaningful experiences.
                </p>
              </div>
            </div>
            <div className="journey">
              {JOURNEY_STEPS.map(({ title, description }, index) => (
                <div className="step" key={index}>
                  <span></span>
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default About;
