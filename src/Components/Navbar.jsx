import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Logo from "../assets/Images/Logo.webp";
import "./Styles/Navbar.css";

const Navbar = ({
  activePage = "home",
  onNavigateToHero,
  onNavigateToProjects,
  onNavigateToAbout,
  onNavigateToContact,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const handleNavigate = (callback) => {
    setMenuOpen(false);
    callback();
  };
  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={Logo} alt="Logo" />
        <p>Mani</p>
      </div>

      <ul>
        <li
          className={activePage === "home" ? "active" : ""}
          onClick={onNavigateToHero}
        >
          Home
        </li>

        <li
          className={activePage === "projects" ? "active" : ""}
          onClick={onNavigateToProjects}
        >
          Projects
        </li>

        <li
          className={activePage === "about" ? "active" : ""}
          onClick={onNavigateToAbout}
        >
          About
        </li>

        <li
          className={activePage === "contact" ? "active" : ""}
          onClick={onNavigateToContact}
        >
          Contact
        </li>
      </ul>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      {menuOpen && (
        <div className="mobile-dropdown">
          <p
            className={activePage === "home" ? "active" : ""}
            onClick={() => handleNavigate(onNavigateToHero)}
          >
            Home
          </p>

          <p
            className={activePage === "projects" ? "active" : ""}
            onClick={() => handleNavigate(onNavigateToProjects)}
          >
            Projects
          </p>

          <p
            className={activePage === "about" ? "active" : ""}
            onClick={() => handleNavigate(onNavigateToAbout)}
          >
            About
          </p>

          <p onClick={() => handleNavigate(onNavigateToContact)}>Contact</p>

          <button onClick={() => handleNavigate(onNavigateToContact)}>
            Hire Me
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      <button type="button" onClick={onNavigateToContact}>
        <p>Hire Me</p>
        <ArrowRight size={24} />
      </button>
    </nav>
  );
};

export default Navbar;
