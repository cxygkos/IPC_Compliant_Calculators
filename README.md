# IPC Compliant Calculators

A standards-compliant suite of web-based electrical engineering utility calculators designed to streamline PCB layout design, footprint synthesis, and manufacturing tolerance compliance. Built entirely with vanilla modern web technologies, this responsive application serves as a self-contained engineering hub for hardware designers.

## 🚀 Key Features

- ***IPC Pad & Hole Size Calculator:*** Computes minimum fabrication hole and copper pad dimensions directly from component pin geometries per **IPC-2221** and **IPC-2222** specifications.
  
- ***Datasheet Hole to Pad Size Calculator:*** Reverses standard IPC formulas to reconstruct necessary land patterns when component manufacturer datasheets only specify recommended finished hole or slot dimensions.
  
- ***Pad Corner Radius:*** Calculates optimal IPC-7351 rounded corner radii for SMD pads to improve solder paste release, capped at standard maximums.
  
- ***IPC-7351 Courtyard Calculator:*** Synthesizes minimum clearance perimeters (Courtyards) to protect automated placement boundaries during pick-and-place assembly, optical inspections, and manual rework loops.
  
- ***Universal IPC Name Generator:*** Automates standardized naming formatting for both **IPC-7351 (SMD)** and **IPC-7251 (THT)** component packages, encouraging cleaner BOM architecture and CAD library management.

## ♿ Accessibility (WCAG 2.1 AA Compliant)

This application was engineered to meet strict European Accessibility Act (EAA) and WCAG 2.1 AA standards:
- ***Color Contrast:*** All UI elements and text strictly adhere to the 4.5:1 mathematical contrast ratio.
- ***Keyboard Navigation:*** Full support for keyboard-only navigation with highly visible programmatic focus rings (`:focus-visible`).
- ***Screen Reader Ready:*** Implements dynamic ARIA states (`aria-expanded`, `aria-live` regions) and programmatic focus shifting on page transitions.
- ***Focus Trapping:*** Custom modal dialogues securely trap keyboard focus until dismissed, returning focus to the original element upon closing.
- ***Bypass Blocks:*** Includes a hidden "Skip to main content" link that integrates flawlessly with SPA hash routing.

## 📁 Repository Structure

```text
├── index.html                      # Core HTML layout and routing hooks
├── style.css                       # Global styles, layout dimensions, transitions, and theme tokens
├── app.js                          # Main application runtime, page state controller, modal manager
└── calculators/
    ├── ipc-pad-hole.js             # Analytical math for through-hole pin transformations
    ├── ipc-hole-to-pad.js          # Analytical inverse math for finished-hole processing
    ├── ipc-courtyard.js            # Boundaries rounding and clearance mapping logic
    ├── ipc-name-generator.js       # Architectural lookup dictionary and prefix parsing compiler
    └── ipc-pad-radius.js           # Optimal SMD pad corner rounding determination
```
## 🛠️ Installation & Setup

Because this suite is built entirely using vanilla clientside technologies, it requires **zero runtime dependencies, package installations, or command-line compilation tools**.

1. Download or clone this repository to your filesystem.
2. Navigate into the directory and double-click `index.html` to execute the code instantly inside your preferred web browser.

*Note: To deploy for your team, simply host the repository on GitHub Pages or any static file server.*

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## ⚖️ Legal Disclaimer

This suite of tools is provided for reference and educational purposes only. Calculations and formatting logic are generated based on industry standards, developed in part with
the assistance of automated artificial intelligence technologies. Because fabrication environments and manufacturing tolerances vary, no warranties are provided, express or
implied, regarding absolute accuracy or compliance.

**Use at your own risk.** 

Always verify generated calculations and footprint structures against official component datasheets and your selected manufacturer's specific capabilities before processing production routing orders.

## 📬 Contact

To prevent spam and keep project discussions centralized, direct email support is not provided.

If you have a feature proposal, standard alignment feedback, or have found a bug, please [open a new Issue](https://github.com/cxygkos/IPC_Compliant_Calculators/issues).
