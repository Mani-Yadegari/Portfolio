import React, { useRef, useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./Styles/Projects.css";
import FinoraIMG from "../assets/Images/finora.webp";
import CineVerseIMG from "../assets/Images/cineverse.webp";
import JobPilotIMG from "../assets/Images/jobpilot.webp";
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const Projects = ({
  show,
  exit,
  direction,
  onNavigateToHero,
  onNavigateToProjects,
  onNavigateToAbout,
  onNavigateToContact,
}) => {
  const trackRef = useRef();
  const [index, setIndex] = useState(5);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const data = [
    {
      title: "Finora",
      type: "Personal Finance Dashboard",
      description:
        "A premium finance dashboard focused on budgeting, analytics, transaction management, and real-time financial insights.",
      tags: ["React", "Node.js", "MongoDB"],
      image: FinoraIMG,
      github: "#",
      demo: "#",
      available: false,
    },

    {
      title: "CineVerse",
      type: "Movie Discovery Platform",
      description:
        "Discover trending movies, explore detailed information, manage watchlists, and enjoy a cinematic browsing experience powered by TMDB.",
      tags: ["React", "TMDB API", "Express"],
      image: CineVerseIMG,
      github: "#",
      demo: "#",
      available: false,
    },

    {
      title: "JobPilot",
      type: "Job Application Manager",
      description:
        "Track job applications, interviews, offers, and career progress with a clean productivity-focused dashboard.",
      tags: ["React", "MongoDB", "Express"],
      image: JobPilotIMG,
      github: "#",
      demo: "#",
      available: false,
    },
  ];

  const projects = [...data, ...data, ...data];
  const cardWidth = 584;
  const totalOriginal = data.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = isTransitioning
      ? "transform 0.6s ease-out"
      : "none";
    track.style.transform = `translateX(-${index * cardWidth}px)`;
    if (index === totalOriginal * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(totalOriginal);
      }, 600);
    }
  }, [index, isTransitioning]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setIndex((p) => p + 1), 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const next = () => {
    setIsTransitioning(true);
    setIndex((p) => p + 1);
  };
  const prev = () => {
    setIsTransitioning(true);
    setIndex((p) => (p > totalOriginal ? p - 1 : totalOriginal * 2 - 1));
  };
  const handleDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    setIsPaused(true);
  };
  const handleUp = (e) => {
    if (!isDragging.current) return;
    const diff = e.clientX - startX.current;
    if (diff > 60) prev();
    if (diff < -60) next();
    isDragging.current = false;
    setIsPaused(false);
  };

  return (
    <section
      className={`projects-section ${show ? "show" : ""} ${exit ? "exit" : ""} ${!show && !exit ? "hidden" : ""}`}
    >
      <div className="box">
        <Navbar
          activePage="projects"
          onNavigateToHero={onNavigateToHero}
          onNavigateToProjects={onNavigateToProjects}
          onNavigateToAbout={onNavigateToAbout}
          onNavigateToContact={onNavigateToContact}
        />
        <div className="content">
          <div className="section-header fade-item delay-0">
            <div className="slide-buttons">
              <button onClick={prev} className="left">
                <ChevronLeft size={26} />
              </button>
              <button onClick={next} className="right">
                <ChevronRight size={26} />
              </button>
            </div>
            <div className="title-block">
              <h1>My Projects</h1>
              <div className="title-underline"></div>
              <p>
                Crafted with performance, clean architecture and attention to
                detail.
              </p>
            </div>
            <div className="controls">
              <button className="view-all">
                <p>Explore My Work</p>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <div
            className="viewport fade-item delay-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              handleUp({ clientX: startX.current });
            }}
            onMouseDown={handleDown}
            onMouseUp={handleUp}
          >
            <div className="track" ref={trackRef}>
              {projects.map((item, i) => (
                <div className="project-wrapper" key={i}>
                  <div className="project">
                    <img src={item.image} alt={item.title} />
                    <div className="overlay">
                      <div className="top-container">
                        <div className="left">
                          <h3>{item.title}</h3>
                          <p>{item.type}</p>
                        </div>
                        {item.available ? (
                          <a href={item.demo} target="_blank" rel="noreferrer">
                            View Project <ArrowUpRight size={16} />
                          </a>
                        ) : (
                          <div className="project-status">
                            <span className="status-dot"></span>
                            Currently Building
                          </div>
                        )}
                      </div>
                      <p className="description">{item.description}</p>
                      <div className="label">
                        {item.tags.map((tag) => (
                          <div key={tag}>{tag}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="footer-note fade-item delay-2">
            Every project is built with attention to detail, performance, and
            real-world usability — from architecture decisions to UI details.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
