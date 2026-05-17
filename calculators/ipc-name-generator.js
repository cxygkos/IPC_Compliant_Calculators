/**
 * @fileoverview Universal IPC Footprint Name Generator.
 * Supports IPC-7351 (SMD) and IPC-7251 (Through-Hole) component families dynamically.
 */

// Master IPC Architecture Dictionary
const IPC_FAMILIES = {
    // --- IPC-7351 SMD FAMILIES ---
    'passives': {
        prefixes: [
            'RESC (Resistor, Chip)', 
            'CAPC (Capacitor, Chip)', 
            'INDC (Inductor, Chip)', 
            'INDW (Inductor, Wirewound)', // Added Wirewound Chip Inductor
            'FUSC (Fuse, Chip)', 
            'LEDC (LED, Chip)', 
            'VARC (Varistor)', 
            'THERMC (Thermistor)', 
            'RESA (Resistor Array)', 
            'CAPA (Capacitor Array)'
        ],
        show: ['prefixDropdown', 'dimX', 'dimY', 'height'],
        labels: { dimX: "Body Length (X) (mm):", dimY: "Body Width (Y) (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.trunc(x*10).toString().padStart(2,'0')}${Math.trunc(y*10).toString().padStart(2,'0')}X${Math.round(h*100)}${lvl}`
    },
    'melf': {
        prefixes: ['RESM (Resistor MELF)', 'CAPM (Capacitor MELF)', 'DIOM (Diode MELF)'],
        show: ['prefixDropdown', 'dimX', 'dimY', 'height'],
        labels: { dimX: "Body Length (X) (mm):", dimY: "Body Diameter (Y) (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.trunc(x*10).toString().padStart(2,'0')}${Math.trunc(y*10).toString().padStart(2,'0')}X${Math.round(h*100)}${lvl}`
    },
    'base_mount': {
        prefixes: ['CAPAE (Aluminum Electrolytic)', 'INDP (Inductor, Base Mount)', 'INDM (Inductor, Molded)'],
        show: ['prefixDropdown', 'dimX', 'dimY', 'height'],
        labels: { dimX: "Base/Body Length (X) (mm):", dimY: "Base/Body Width (Y) (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.round(x*100)}X${Math.round(y*100)}X${Math.round(h*100)}${lvl}`
    },
    'dual_lead': {
        prefixes: ['SOIC (Small Outline IC)', 'SOP (Small Outline Pkg)', 'SSOP (Shrink SOP)', 'TSSOP (Thin Shrink SOP)', 'MSOP (Micro SOP)', 'VSOP (Very SOP)', 'SOJ (Small Outline J-Lead)', 'SOT (Small Outline Transistor)', 'TO (Transistor Outline)', 'DPAK (Discrete Pkg)', 'CPAK (Ceramic Pkg)'],
        show: ['prefixDropdown', 'pitch', 'dimX', 'height', 'pins'],
        labels: { pitch: "Pin Pitch (mm):", dimX: "Lead Span (Tip-to-Tip) (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.round(pitch*100)}P${Math.round(x*100)}X${Math.round(h*100)}-${pins}${lvl}`
    },
    'quad_lead': {
        prefixes: ['QFP (Quad Flat Pkg)', 'LQFP (Low-Profile QFP)', 'TQFP (Thin QFP)', 'CQFP (Ceramic QFP)', 'PQFP (Plastic QFP)', 'PLCC (Plastic Leaded Chip Carrier)'],
        show: ['prefixDropdown', 'pitch', 'dimX', 'dimY', 'height', 'pins'],
        labels: { pitch: "Pin Pitch (mm):", dimX: "Lead Span X (Tip-to-Tip) (mm):", dimY: "Lead Span Y (Tip-to-Tip) (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.round(pitch*100)}P${Math.round(x*100)}X${Math.round(y*100)}X${Math.round(h*100)}-${pins}${lvl}`
    },
    'grid_no_lead': {
        prefixes: ['BGA (Ball Grid Array)', 'CGA (Column Grid Array)', 'LGA (Land Grid Array)', 'QFN (Quad Flat No-Lead)', 'DFN (Dual Flat No-Lead)', 'SON (Small Outline No-Lead)', 'PQFN (Power Quad Flat No-Lead)', 'LCC (Leadless Chip Carrier)', 'RESCA (Resistor Chip Array)', 'CAPCA (Capacitor Chip Array)', 'OSC (Oscillator)'],
        show: ['prefixDropdown', 'pitch', 'dimX', 'dimY', 'height', 'pins'],
        labels: { pitch: "Pin Pitch (mm):", dimX: "Body Length (X) (mm):", dimY: "Body Width (Y) (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.round(pitch*100)}P${Math.round(x*100)}X${Math.round(y*100)}X${Math.round(h*100)}-${pins}${lvl}`
    },

    // --- IPC-7251 THROUGH-HOLE (THT) FAMILIES ---
    'tht_axial': {
        prefixes: ['RESAD (Axial Resistor)', 'CAPAD (Axial Capacitor)', 'DIOAD (Axial Diode)', 'INDAD (Axial Inductor)'],
        show: ['prefixDropdown', 'pitch', 'leadWidth', 'dimX', 'dimY'],
        labels: { pitch: "Lead Spacing (mm):", leadWidth: "Lead/Wire Diameter (mm):", dimX: "Body Length (mm):", dimY: "Body Diameter (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.round(pitch*100)}W${Math.round(lw*100)}L${Math.round(x*100)}D${Math.round(y*100)}${lvl}`
    },
    'tht_radial': {
        prefixes: [
            'CAPPRD (Radial Capacitor, Polarized)', 
            'CAPRD (Radial Capacitor, Non-Polarized)', 
            'RESRD (Radial Resistor)', 
            'INDRD (Radial Inductor)', // Added Radial Inductor
            'LEDRD (Radial LED)', 
            'VAR (Radial Varistor)'
        ],
        show: ['prefixDropdown', 'pitch', 'leadWidth', 'dimX', 'height'],
        labels: { pitch: "Lead Spacing (mm):", leadWidth: "Lead/Wire Diameter (mm):", dimX: "Body Diameter (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.round(pitch*100)}W${Math.round(lw*100)}D${Math.round(x*100)}H${Math.round(h*100)}${lvl}`
    },
    'tht_dip': {
        prefixes: ['DIP (Dual In-line Package)', 'SIP (Single In-line Package)', 'ZIP (Zig-zag In-line Package)'],
        show: ['prefixDropdown', 'span', 'leadWidth', 'pitch', 'dimX', 'height', 'pins'],
        labels: { span: "Row Spacing / Span (mm) [0 for SIP]:", leadWidth: "Lead Width (mm):", pitch: "Pin Pitch (mm):", dimX: "Body Length (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => {
            if (p === 'SIP') {
                return `${p}${Math.round(pitch*100)}W${Math.round(lw*100)}L${Math.round(x*100)}H${Math.round(h*100)}Q${pins}${lvl}`;
            }
            return `${p}${Math.round(span*100)}W${Math.round(lw*100)}P${Math.round(pitch*100)}L${Math.round(x*100)}H${Math.round(h*100)}Q${pins}${lvl}`;
        }
    },

    // --- CUSTOM ---
    'custom': {
        prefixes: [], 
        show: ['customPrefix', 'pitch', 'dimX', 'dimY', 'height', 'pins'],
        labels: { pitch: "Pin Pitch (mm):", dimX: "Overall Outer Length (X) (mm):", dimY: "Overall Outer Width (Y) (mm):" },
        generate: (p, pitch, x, y, h, pins, lvl, span, lw) => `${p}${Math.round(pitch*100)}P${Math.round(x*100)}X${Math.round(y*100)}X${Math.round(h*100)}-${pins}${lvl}`
    }
};

// FontAwesome SVG Paths
const faCopyIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor"><path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>`;
const faCheckIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;

document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('btn-calc-name-gen');
    const familySelect = document.getElementById('name-family');
    
    if (familySelect) {
        familySelect.addEventListener('change', updateEngineUI);
        updateEngineUI();
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', generateIPCNames);
    }

    const inputs = ['name-pitch', 'name-span', 'name-lead-width', 'name-pins', 'name-dim-x', 'name-dim-y', 'name-height', 'name-prefix-text'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    generateIPCNames();
                }
            });
        }
    });
});

/**
 * @brief Reads the Master Dictionary and restructures the UI fields/labels dynamically.
 */
function updateEngineUI() {
    const familyKey = document.getElementById('name-family').value;
    const config = IPC_FAMILIES[familyKey];

    // 1. Populate the Standard Prefix Dropdown
    if (config.prefixes && config.prefixes.length > 0) {
        const prefixSelect = document.getElementById('name-prefix');
        prefixSelect.innerHTML = '';
        config.prefixes.forEach(prefixStr => {
            const prefixCode = prefixStr.split(' ')[0];
            const option = document.createElement('option');
            option.value = prefixCode;
            option.textContent = prefixStr;
            prefixSelect.appendChild(option);
        });
    }

    // 2. Toggle Field Visibility and Update Labels
    const groups = {
        'prefixDropdown': document.getElementById('group-prefix'),
        'customPrefix': document.getElementById('group-prefix-custom'),
        'pitch': document.getElementById('group-pitch'),
        'span': document.getElementById('group-span'),
        'leadWidth': document.getElementById('group-lead-width'),
        'pins': document.getElementById('group-pins'),
        'dimX': document.getElementById('group-dim-x'),
        'dimY': document.getElementById('group-dim-y'),
        'height': document.getElementById('group-height')
    };

    // Reset visibility entirely
    Object.values(groups).forEach(g => { if (g) g.style.display = 'none'; });

    // Turn on needed fields and apply custom labels
    config.show.forEach(fieldId => {
        if (groups[fieldId]) {
            groups[fieldId].style.display = 'flex';
        }
        
        if (config.labels && config.labels[fieldId]) {
            const labelId = `label-${fieldId.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            const labelEl = document.getElementById(labelId);
            if (labelEl) labelEl.textContent = config.labels[fieldId];
        }
    });
}

/**
 * @brief Universal Generator logic. Only validates fields explicitly shown by the UI.
 */
function generateIPCNames() {
    const familyKey = document.getElementById('name-family').value;
    const config = IPC_FAMILIES[familyKey];
    
    const resultsContainer = document.getElementById('name-results');
    const tbody = document.getElementById('name-results-body');

    // Standard variable containers
    let prefix = "", pitch = 0, span = 0, lw = 0, dimX = 0, dimY = 0, pins = 0, height = 0;

    // 1. Resolve and Validate the Prefix
    if (config.show.includes('prefixDropdown')) {
        prefix = document.getElementById('name-prefix').value;
    } else if (config.show.includes('customPrefix')) {
        let rawPrefix = document.getElementById('name-prefix-text').value.trim();
        prefix = rawPrefix.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (prefix === '') {
            window.showError("Please enter a valid Custom Prefix (letters and numbers only).");
            return;
        }
    }

    // 2. Dynamic Validation based on required fields
    if (config.show.includes('height')) {
        const valStr = document.getElementById('name-height').value;
        if (valStr.trim() === '' || isNaN(valStr) || parseFloat(valStr) <= 0) {
            window.showError("Please enter a valid positive number for the Maximum Component Height.");
            return;
        }
        height = parseFloat(valStr);
    }

    if (config.show.includes('pitch')) {
        const valStr = document.getElementById('name-pitch').value;
        if (valStr.trim() === '' || isNaN(valStr) || parseFloat(valStr) <= 0) {
            window.showError(`Please enter a valid positive number for the ${config.labels.pitch || "Pin Pitch"}.`);
            return;
        }
        pitch = parseFloat(valStr);
    }

    if (config.show.includes('span')) {
        const valStr = document.getElementById('name-span').value;
        if (valStr.trim() === '' || isNaN(valStr) || parseFloat(valStr) < 0) {
            window.showError("Please enter a valid positive number for the Lead Span / Row Spacing.");
            return;
        }
        span = parseFloat(valStr);
    }

    if (config.show.includes('leadWidth')) {
        const valStr = document.getElementById('name-lead-width').value;
        if (valStr.trim() === '' || isNaN(valStr) || parseFloat(valStr) <= 0) {
            window.showError("Please enter a valid positive number for the Lead Diameter / Width.");
            return;
        }
        lw = parseFloat(valStr);
    }

    if (config.show.includes('dimX')) {
        const valStr = document.getElementById('name-dim-x').value;
        if (valStr.trim() === '' || isNaN(valStr) || parseFloat(valStr) <= 0) {
            window.showError(`Please enter a valid positive number for the ${config.labels.dimX}`);
            return;
        }
        dimX = parseFloat(valStr);
    }

    if (config.show.includes('dimY')) {
        const valStr = document.getElementById('name-dim-y').value;
        if (valStr.trim() === '' || isNaN(valStr) || parseFloat(valStr) <= 0) {
            window.showError(`Please enter a valid positive number for the ${config.labels.dimY}`);
            return;
        }
        dimY = parseFloat(valStr);
    }

    if (config.show.includes('pins')) {
        const valStr = document.getElementById('name-pins').value;
        if (valStr.trim() === '' || isNaN(valStr) || parseInt(valStr) <= 0 || !Number.isInteger(parseFloat(valStr))) {
            window.showError("Please enter a valid whole number for the Pin Count.");
            return;
        }
        pins = parseInt(valStr);
    }

    // 3. Generate Output Table
    const levels = [
        { level: 'A', density: 'Low Density', suffix: 'M' },
        { level: 'B', density: 'Moderate Density', suffix: 'N' },
        { level: 'C', density: 'High Density', suffix: 'L' }
    ];

    tbody.innerHTML = ''; 

    levels.forEach(lvl => {
        const finalName = config.generate(prefix, pitch, dimX, dimY, height, pins, lvl.suffix, span, lw);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>Level ${lvl.level}</strong></td>
            <td>${lvl.density}</td>
            <td class="result-action-cell">
                <span class="generated-name-text">${finalName}</span>
                <button class="copy-btn" title="Copy to clipboard" aria-label="Copy ${finalName}">${faCopyIcon}</button>
            </td>
        `;
        
        // Pure SVG Copy to Clipboard Logic
        const copyBtn = row.querySelector('.copy-btn');
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(finalName).then(() => {
                this.innerHTML = faCheckIcon;
                this.style.color = 'var(--density-border)'; // Turns the icon green
                
                // Reverts back to standard fa-copy icon after 2 seconds
                setTimeout(() => {
                    this.innerHTML = faCopyIcon;
                    this.style.color = ''; // Clears inline color to inherit from CSS again
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy text: ", err);
                window.showError("Clipboard access denied. Please copy manually.");
            });
        });

        tbody.appendChild(row);
    });

    resultsContainer.style.display = 'block';
}
