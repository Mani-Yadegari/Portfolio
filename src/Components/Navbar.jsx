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

      <button type="button" onClick={onNavigateToContact}>
        <p>Hire Me</p>
        <ArrowRight size={24} />
      </button>
    </nav>
  );
};

export default Navbar;
