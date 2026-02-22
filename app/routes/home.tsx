import { useEffect } from "react";
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

const SPOTS = [
  { baseX: 25, baseY: 0 },
  { baseX: 75, baseY: 15 },
  { baseX: 50, baseY: 85 },
];

const ALPHA = 0.002;
const BETA = 0.0004;

function useGradientMouse() {
  useEffect(() => {
    let mouseX = 50;
    let mouseY = 50;
    const state = SPOTS.map((s) => ({
      x: s.baseX,
      y: s.baseY,
      vx: 0,
      vy: 0,
    }));
    let frameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 100;
      mouseY = (e.clientY / window.innerHeight) * 100;
    };

    const animate = () => {
      const style = document.documentElement.style;

      for (let i = 0; i < SPOTS.length; i++) {
        const { baseX, baseY } = SPOTS[i];
        const s = state[i];

        // Repulsion target
        const dx = baseX - mouseX;
        const dy = baseY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = 600 / (dist + 8);
        const targetX = baseX + (dx / (dist + 1)) * force;
        const targetY = baseY + (dy / (dist + 1)) * force;

        // Predict
        const predX = s.x + s.vx;
        const predY = s.y + s.vy;

        // Correct
        const resX = targetX - predX;
        const resY = targetY - predY;
        s.x = predX + ALPHA * resX;
        s.y = predY + ALPHA * resY;
        s.vx += BETA * resX;
        s.vy += BETA * resY;

        style.setProperty(`--gx${i + 1}`, `${s.x}%`);
        style.setProperty(`--gy${i + 1}`, `${s.y}%`);
      }

      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);
}

export default function Home() {
  useGradientMouse();

  return (
    <main className="container">
      <section className="hero">
        <h1>Cameron Tacklind</h1>
        <p className="intro">from Robots to React</p>
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
                  <a href="https://www.firstinspires.org/" target="_blank" rel="noopener noreferrer">
                    <img src="/first-logo.png" alt="FIRST" className="first-logo first-logo-light" loading="lazy" />
                    <img src="/first-logo-dark.png" alt="FIRST" className="first-logo first-logo-dark" loading="lazy" />
                  </a>
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
          <a
            href="https://paypal.me/CameronTacklind"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PayPal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
            </svg>
          </a>
          <a
            href="https://venmo.com/cinderblock"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Venmo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3.94 9.04c.18.2.36.36.56.48.28.18.6.28.92.28.52 0 1.04-.22 1.48-.62.36-.32.64-.76.84-1.2.2-.48.32-.96.36-1.44.04-.52-.04-1-.24-1.36a1.52 1.52 0 0 0-1.24-.68c-.48 0-.96.2-1.36.56-.36.32-.64.74-.84 1.2-.2.46-.32.94-.36 1.44-.04.48.02.92.2 1.28zm16.54-7.68C21.44 2.64 22 4.24 22 6.2c0 2.64-1 6.08-2.84 9.24C17.12 18.92 14.56 22 11.92 24H4.6L2 5.12l6.52-.6 1.36 11c1.4-2.44 3.12-6.36 3.12-9.08 0-1.84-.32-3.08-.76-4.04l8.24-1.04z" />
            </svg>
          </a>
        </nav>
      </section>
      <footer className="sticky-footer">FDT</footer>
    </main>
  );
}
