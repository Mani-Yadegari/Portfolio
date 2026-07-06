import { useEffect, useState, useCallback } from "react";
import Hero from "./Components/Hero.jsx";
import Projects from "./Components/Projects.jsx";
import Loader from "./Components/Loading.jsx";
import "./Styles.css";
import About from "./Components/About.jsx";
import Contact from "./Components/Contact.jsx";

const PAGE_ORDER = ["hero", "projects", "about", "contact"];
const ANIM_DURATION = 1300;

function App() {
  const [loading, setLoading] = useState(true);
  const [exitLoader, setExitLoader] = useState(false);

  const [currentPage, setCurrentPage] = useState("hero");
  const [prevPage, setPrevPage] = useState(null);
  const [direction, setDirection] = useState("forward");
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useCallback(
    (to) => {
      if (loading || isAnimating || currentPage === to) return;

      const fromIdx = PAGE_ORDER.indexOf(currentPage);
      const toIdx = PAGE_ORDER.indexOf(to);
      const dir = toIdx > fromIdx ? "forward" : "backward";

      setDirection(dir);
      setPrevPage(currentPage);
      setCurrentPage(to);
      setIsAnimating(true);

      setTimeout(() => {
        setPrevPage(null);
        setIsAnimating(false);
      }, ANIM_DURATION);
    },
    [loading, isAnimating, currentPage],
  );

  useEffect(() => {
    const handleWheel = (e) => {
      if (loading || isAnimating) return;
      const idx = PAGE_ORDER.indexOf(currentPage);
      if (e.deltaY > 50 && idx < PAGE_ORDER.length - 1)
        navigate(PAGE_ORDER[idx + 1]);
      else if (e.deltaY < -50 && idx > 0) navigate(PAGE_ORDER[idx - 1]);
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentPage, isAnimating, loading, navigate]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (loading || isAnimating) return;
      const idx = PAGE_ORDER.indexOf(currentPage);
      const fwd = e.key === "ArrowDown" || e.key === "ArrowRight";
      const bwd = e.key === "ArrowUp" || e.key === "ArrowLeft";
      if (fwd && idx < PAGE_ORDER.length - 1) navigate(PAGE_ORDER[idx + 1]);
      else if (bwd && idx > 0) navigate(PAGE_ORDER[idx - 1]);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, isAnimating, loading, navigate]);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    document.body.style.overflow = "hidden";
    const timerExit = setTimeout(() => setExitLoader(true), 1600);
    const timerRemove = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "hidden";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 2000);
    return () => {
      clearTimeout(timerExit);
      clearTimeout(timerRemove);
    };
  }, []);

  // هر صفحه سه حالت داره:
  // show   → صفحه فعال فعلیه
  // exit   → داره خارج میشه (انیمیشن exit در حال اجراست)
  // نه show نه exit → مخفی (ولی mount هست)
  const pageProps = (name) => ({
    show: currentPage === name,
    exit: prevPage === name,
    direction,
  });

  return (
    <>
      {loading && <Loader exit={exitLoader} />}

      {!loading && (
        <div className="app">
          <Hero
            {...pageProps("hero")}
            onNavigateToHero={() => navigate("hero")}
            onNavigateToProjects={() => navigate("projects")}
            onNavigateToAbout={() => navigate("about")}
            onNavigateToContact={() => navigate("contact")}
          />

          <Projects
            {...pageProps("projects")}
            onNavigateToHero={() => navigate("hero")}
            onNavigateToProjects={() => navigate("projects")}
            onNavigateToAbout={() => navigate("about")}
            onNavigateToContact={() => navigate("contact")}
          />

          <About
            {...pageProps("about")}
            onNavigateToHero={() => navigate("hero")}
            onNavigateToProjects={() => navigate("projects")}
            onNavigateToAbout={() => navigate("about")}
            onNavigateToContact={() => navigate("contact")}
          />

          <Contact
            {...pageProps("contact")}
            onNavigateToHero={() => navigate("hero")}
            onNavigateToProjects={() => navigate("projects")}
            onNavigateToAbout={() => navigate("about")}
            onNavigateToContact={() => navigate("contact")}
          />
        </div>
      )}
    </>
  );
}

export default App;
