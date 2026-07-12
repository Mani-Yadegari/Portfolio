import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { Globe, Hourglass, ChevronRight } from "lucide-react";
import "./Styles/Hero.css";
import lottie from "lottie-web";

import ReactLogo from "../assets/Images/React.svg";
import NextLogo from "../assets/Images/nextjs.svg";
import NodeLogo from "../assets/Images/nodejs.svg";
import MongoLogo from "../assets/Images/MongoDB.svg";
import GitHubLogo from "../assets/Images/GitHub.svg";
import DownloadIcon from "../assets/Images/Download.svg";
import ResumeEN from "../assets/ManiYadegari-ResumeEN.pdf";

const Hero = ({
  isLoaded,
  show,
  exit,
  direction,
  onNavigateToHero,
  onNavigateToProjects,
  onNavigateToAbout,
  onNavigateToContact,
}) => {
  const sectionRef = useRef(null);
  const animationDiv = useRef(null);
  const lottieInstance = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!animationDiv.current) return;
    lottieInstance.current = lottie.loadAnimation({
      container: animationDiv.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/Animation/animation.json",
      assetsPath: "/Animation/images/",
      rendererSettings: { progressiveLoad: true, hideOnTransparent: true },
    });
    return () => lottieInstance.current?.destroy();
  }, []);

  useEffect(() => {
    if (show) {
      setLoaded(false);

      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoaded(true);
        });
      });

      return () => cancelAnimationFrame(raf);
    }

    setLoaded(false);
  }, [show]);

  const isReturning = show && direction === "backward";

  // Download Resume  Start
  const [showCVModal, setShowCVModal] = useState(false);

  // The modal is pinned to the top of .hero-section (position:absolute,
  // inset:0). On the breakpoints where the section itself scrolls
  // (stacked/mobile), opening the modal while scrolled down would leave
  // it out of view, so scroll back to the top first.
  //
  // Scroll is instant ("auto"), not smooth. The overflow-lock effect below
  // fires as soon as showCVModal flips to true, and with an animated
  // scroll that lock interrupts the scroll mid-flight (freezing it
  // wherever it happened to be) — which is what caused the section to
  // stay scrolled down on mobile while the modal appeared pinned at the
  // top. An instant scroll completes synchronously before the lock
  // effect runs, so there's no race.
  const openCVModal = () => {
    sectionRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setShowCVModal(true);
  };

  // Lock the section's own scroll while the modal is open — otherwise
  // the background content behind the overlay can still be scrolled.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.style.overflowY = showCVModal ? "hidden" : "";
  }, [showCVModal]);

  const downloadResume = (file, filename) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowCVModal(false);
  };
  // Download Resume  End

  return (
    <section
      ref={sectionRef}
      className={`hero-section
          ${loaded ? "loaded" : ""}
          ${show && !exit ? "active" : ""}
          ${exit ? "exit" : ""}
          ${isReturning ? "returning" : ""}
          ${!show && !exit ? "hidden" : ""}
        `}
    >
      <div className="box">
        <Navbar
          activePage="home"
          onNavigateToHero={onNavigateToHero}
          onNavigateToProjects={onNavigateToProjects}
          onNavigateToAbout={onNavigateToAbout}
          onNavigateToContact={onNavigateToContact}
        />
        <section className="components">
          <div className="left">
            <h1>DEVELOPER</h1>
            <h2>
              Turning ideas into clean <br /> and functional web experiences
            </h2>
            <p>
              I build fast and scalable web applications with a strong focus on
              clean UI and performance.
            </p>
            <p>
              Every decision is driven by real-world usability, not just
              visuals.
            </p>
            <div className="icons-container">
              <div className="icon" title="React">
                <img src={ReactLogo} alt="React Logo" />
                <div className="line"></div>
                <span>Fast, interactive, and scalable user interfaces.</span>
              </div>
              <div className="icon" title="Next js">
                <img src={NextLogo} alt="Next.js Logo" id="next-icon" />
                <div className="line"></div>
                <span>High-performance, SEO-ready web applications.</span>
              </div>
              <div className="icon" title="Node js">
                <img src={NodeLogo} alt="Node.js Logo" />
                <div className="line"></div>
                <span>Scalable backend services and APIs.</span>
              </div>
              <div className="icon" title="Mongo DB">
                <img src={MongoLogo} alt="MongoDB Logo" />
                <div className="line"></div>
                <span>Flexible NoSQL database solutions.</span>
              </div>
            </div>
            <div className="info">
              <div className="info-item">
                <span className="ultra-dot"></span>
                <p>Available for freelance</p>
              </div>
              <span className="separator"></span>
              <div className="info-item">
                <Globe size={18} />
                <p>Remote-friendly</p>
              </div>
              <span className="separator"></span>
              <div className="info-item">
                <Hourglass size={18} />
                <p>Focused on long-term product quality</p>
              </div>
            </div>
            <div className="button-container">
              <button
                onClick={() =>
                  window.open(
                    "https://github.com/Mani-Yadegari",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <img src={GitHubLogo} alt="GitHub Logo" />
                <p>GitHub</p>
              </button>
              <button onClick={openCVModal}>
                <img src={DownloadIcon} alt="Download Icon" />
                <p>Download CV</p>
              </button>
            </div>
            <p className="description">
              I don't just write code — I help shape digital products. From
              architecture decisions to UI details, I focus on building
              solutions that are maintainable, scalable, and aligned with real
              business goals.
            </p>
          </div>
          <div className="right">
            <div className="animation" ref={animationDiv}></div>
            <div className="text">
              <h1>Hi, I'm Mani</h1>
              <h2>
                I design and build modern web applications that are fast,
                reliable, and built to scale. Let's create something that
                actually drives growth.
              </h2>
              <div className="button-container">
                <button className="primary" onClick={onNavigateToProjects}>
                  <p>View Case Studies</p>
                  <ChevronRight />
                </button>
                <button className="secondary" onClick={onNavigateToContact}>
                  <p>Start a Project</p>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {showCVModal && (
        <div className="cv-modal-overlay" onClick={() => setShowCVModal(false)}>
          <div className="cv-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Select Resume Language</h2>

            <p>Choose which version of my resume you'd like to download.</p>

            <div className="cv-buttons">
              <button
                onClick={() =>
                  downloadResume(ResumeEN, "Mani-Yadegari-Resume-EN.pdf")
                }
              >
                <span>English Resume</span>
              </button>

              <button
                onClick={() =>
                  downloadResume(ResumeFA, "Mani-Yadegari-Resume-FA.pdf")
                }
              >
                <span>Persian Resume</span>
              </button>
            </div>

            <button
              className="close-modal"
              onClick={() => setShowCVModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
