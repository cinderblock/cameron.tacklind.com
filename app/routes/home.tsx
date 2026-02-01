import type { MetaFunction } from "react-router";
import { Github, Linkedin, Mail, Facebook, Trophy, Instagram } from "lucide-react";

export const meta: MetaFunction = () => {
  const description =
    "Cameron Tacklind is a complete stack roboticist — from BLDC to React and everything in between.";
  return [
    { title: "Cameron Tacklind - Complete Stack Roboticist" },
    { name: "description", content: description },
    { name: "author", content: "Cameron Tacklind" },
    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Cameron Tacklind - Complete Stack Roboticist" },
    { property: "og:description", content: description },
    { property: "og:url", content: "https://cameron.tacklind.com" },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Cameron Tacklind - Complete Stack Roboticist" },
    { name: "twitter:description", content: description },
  ];
};

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Cameron Tacklind</h1>
        <p className="intro">from Motors to React</p>
        <p className="tagline">
          <span className="tooltip-wrapper">
            <span
              className="tooltip-trigger"
              tabIndex={0}
              aria-describedby="complete-tooltip"
            >
              Complete
            </span>
            <span className="tooltip" id="complete-tooltip" role="tooltip">
              <span className="tooltip-row">
                <span className="tooltip-label">Artist</span>
                <span className="tooltip-value">
                  <a href="https://www.foldhaus.com/radialumia" target="_blank" rel="noopener noreferrer">RadiaLumia</a>,{" "}
                  <a href="https://www.indiegogo.com/projects/opus-burning-man-2019" target="_blank" rel="noopener noreferrer">OPUS</a>,{" "}
                  <a href="https://www.indiegogo.com/projects/incenter-burning-man-2022" target="_blank" rel="noopener noreferrer">INCENTER</a>,{" "}
                  <a href="https://www.entheosrising.org/empyrean-gate-art-installation" target="_blank" rel="noopener noreferrer" style={{whiteSpace: "nowrap"}}>The Empyrean Gate</a>,{" "}
                  <a href="https://www.instagram.com/p/DIAP3VMyT63/" target="_blank" rel="noopener noreferrer" style={{whiteSpace: "nowrap"}}>Out The Other</a>
                </span>
              </span>
              <span className="tooltip-row">
                <span className="tooltip-label">Maker</span>
                <span className="tooltip-value">3D, PCBs, Metal, Fabric, Wood</span>
              </span>
              <span className="tooltip-row">
                <span className="tooltip-label">Languages</span>
                <span className="tooltip-value">Français y <a href="https://www.duolingo.com/profile/cinderblock63" target="_blank" rel="noopener noreferrer" style={{whiteSpace: "nowrap"}}>aprendiendo Español</a></span>
              </span>
              <span className="tooltip-row">
                <span className="tooltip-label">Design</span>
                <span className="tooltip-value">SolidWorks, Altium, Mathematica</span>
              </span>
            </span>
          </span>{" "}
          <span className="tooltip-wrapper">
            <span
              className="tooltip-trigger"
              tabIndex={0}
              aria-describedby="stack-tooltip"
            >
              Stack
            </span>
            <span className="tooltip" id="stack-tooltip" role="tooltip">
              <span className="tooltip-row">
                <span className="tooltip-label">Hardware</span>
                <span className="tooltip-value">ARM, ESP, AVR, Buck/Boost, Clocks</span>
              </span>
              <span className="tooltip-row">
                <span className="tooltip-label">Firmware</span>
                <span className="tooltip-value">C/C++, Assembly, GCC, Linkers</span>
              </span>
              <span className="tooltip-row">
                <span className="tooltip-label">Software</span>
                <span className="tooltip-value">Linux, Cloud, Node.js, TypeScript</span>
              </span>
              <span className="tooltip-row">
                <span className="tooltip-label">Interfaces</span>
                <span className="tooltip-value">React, <a href="https://www.npmjs.com/package/react-smoothie" target="_blank" rel="noopener noreferrer">Realtime Charts</a>, Electron</span>
              </span>
            </span>
          </span>{" "}
          <span className="tooltip-wrapper">
            <span
              className="tooltip-trigger"
              tabIndex={0}
              aria-describedby="roboticist-tooltip"
            >
              Roboticist
            </span>
            <span className="tooltip" id="roboticist-tooltip" role="tooltip">
              <span className="tooltip-row">
                <span className="tooltip-label">Control</span>
                <span className="tooltip-value">BLDC, Kalman, Kane, Full State</span>
              </span>
              <span className="tooltip-row">
                <span className="tooltip-label">Domains</span>
                <span className="tooltip-value">Medical, Wearable, Personal, Commercial, Home, Whimsy, Art</span>
              </span>
              <span className="tooltip-row">
                <span className="tooltip-label first-logo-label">
                  <img src="/first-logo.png" alt="FIRST" className="first-logo first-logo-light" />
                  <img src="/first-logo-dark.png" alt="FIRST" className="first-logo first-logo-dark" />
                </span>
                <span className="tooltip-value">
                  <span className="tooltip-wrapper nested">
                    <span className="tooltip-trigger" tabIndex={0} aria-describedby="alum-tooltip">Alum</span>
                    <span className="tooltip nested" id="alum-tooltip" role="tooltip">
                      Team 8
                      <br />
                      <a href="https://www.thebluealliance.com/team/8/2006" target="_blank" rel="noopener noreferrer">
                        <Trophy size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }} aria-hidden="true" />
                        2006 Regional Winner
                      </a>
                    </span>
                  </span>
                  ,{" "}
                  <span className="tooltip-wrapper nested">
                    <span className="tooltip-trigger" tabIndex={0} aria-describedby="mentor-tooltip">Mentor</span>
                    <span className="tooltip nested" id="mentor-tooltip" role="tooltip">Bloomhouse teams</span>
                  </span>
                  , and{" "}
                  <span className="tooltip-wrapper nested">
                    <span className="tooltip-trigger" tabIndex={0} aria-describedby="volunteer-tooltip">Volunteer</span>
                    <span className="tooltip nested" id="volunteer-tooltip" role="tooltip">
                      Since 2015
                      <br />
                      <a href="https://www.thebluealliance.com/event/2023casj#awards" target="_blank" rel="noopener noreferrer">
                        <Trophy size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }} aria-hidden="true" />
                        2023 Volunteer of the Year
                      </a>
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </p>
        <nav className="social-links" aria-label="Social links">
          <a
            href="https://github.com/cinderblock"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
          >
            <Github size={24} aria-hidden="true" />
          </a>
          <a
            href="https://linkedin.com/in/camerontacklind"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={24} aria-hidden="true" />
          </a>
          <a
            href="https://www.facebook.com/cameron.tacklind/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook Profile"
          >
            <Facebook size={24} aria-hidden="true" />
          </a>
          <a href="mailto:cameron@tacklind.com" aria-label="Email me">
            <Mail size={24} aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/cinderblock63"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
          >
            <Instagram size={24} aria-hidden="true" />
          </a>
        </nav>
      </section>
      <footer className="sticky-footer">FDT</footer>
    </main>
  );
}
