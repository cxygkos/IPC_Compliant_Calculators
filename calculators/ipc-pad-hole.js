/**
 * @fileoverview IPC-2221 / IPC-2222 Pad and Hole Calculator.
 * Calculates standard minimum hole and pad geometries based on lead dimensions.
 * Now features dynamic custom annular ring support.
 */

document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('btn-calc-ipc');
    const annularSelect = document.getElementById('annular-ring-select');
    const customAnnularGroup = document.getElementById('group-custom-annular');
    
    // Toggle Custom Annular Ring Input
    if (annularSelect) {
        annularSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customAnnularGroup.style.display = 'flex';
            } else {
                customAnnularGroup.style.display = 'none';
            }
        });
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateIpcPadHole);
    }

    // Bind Enter keypress for quick calculation
    const inputs = ['pin-size', 'custom-annular-input'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    calculateIpcPadHole();
                }
            });
        }
    });
});

/**
 * @brief Gathers inputs, checks standard compliance, and generates the Pad/Hole table.
 */
function calculateIpcPadHole() {
    const shape = document.getElementById('pin-shape').value;
    const sizeStr = document.getElementById('pin-size').value;
    const unit = document.getElementById('pin-unit').value;
    const annularPref = document.getElementById('annular-ring-select').value;
    
    const resultsContainer = document.getElementById('ipc-results');
    const tbody = document.getElementById('ipc-results-body');

    // 1. Validate Pin Size
    if (sizeStr.trim() === '' || isNaN(sizeStr) || parseFloat(sizeStr) <= 0) {
        window.showError("Please enter a valid positive number for the Pin Size.");
        return;
    }

    let pinSizeBase = parseFloat(sizeStr);
    let pinSizeMM = unit === 'in' ? pinSizeBase * 25.4 : pinSizeBase;

    // 2. Validate Custom Annular Ring (if selected)
    let customAnnularMM = 0;
    if (annularPref === 'custom') {
        const customStr = document.getElementById('custom-annular-input').value;
        if (customStr.trim() === '' || isNaN(customStr) || parseFloat(customStr) < 0) {
            window.showError("Please enter a valid positive number for the Custom Annular Ring.");
            return;
        }
        customAnnularMM = parseFloat(customStr);
    }

    // 3. Calculate Maximum Effective Lead Diameter
    // IPC dictates that for square/rectangular pins, the hole must clear the diagonal.
    let effectiveDiameterMM = pinSizeMM;
    if (shape === 'square') {
        // Diagonal = width * sqrt(2)
        effectiveDiameterMM = pinSizeMM * 1.4142;
    }

    // 4. Configuration Array for IPC Density Levels
    // IPC-2222 Clearances (Hole = Lead + Clearance)
    // IPC-2221 Fabrication Allowances (Pad = Hole + 2*Annular + FabAllowance)
    const levels = [
        { 
            level: 'A', 
            density: 'Low Density', 
            holeClearance: 0.25, 
            fabAllowance: 0.60, 
            ipcAnnular: 0.15 
        },
        { 
            level: 'B', 
            density: 'Moderate Density', 
            holeClearance: 0.20, 
            fabAllowance: 0.50, 
            ipcAnnular: 0.10 
        },
        { 
            level: 'C', 
            density: 'High Density', 
            holeClearance: 0.15, 
            fabAllowance: 0.40, 
            ipcAnnular: 0.05 
        }
    ];

    tbody.innerHTML = ''; 

    // 5. Generate Output Data
    levels.forEach(lvl => {
        
        // Calculate Finished Hole Size
        let holeMM = effectiveDiameterMM + lvl.holeClearance;
        
        // Resolve Annular Ring
        let annularRing = 0;
        if (annularPref === 'ipc') {
            annularRing = lvl.ipcAnnular;
        } else if (annularPref === 'custom') {
            annularRing = customAnnularMM;
        } else {
            annularRing = parseFloat(annularPref);
        }

        // Calculate Pad Diameter
        let padMM = holeMM + (2 * annularRing) + lvl.fabAllowance;

        // Convert back to original unit for display formatting
        let displayHole = unit === 'in' ? (holeMM / 25.4).toFixed(4) : holeMM.toFixed(2);
        let displayPad = unit === 'in' ? (padMM / 25.4).toFixed(4) : padMM.toFixed(2);
        let unitLabel = unit === 'in' ? 'in' : 'mm';

        // Build Table Row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>Level ${lvl.level}</strong></td>
            <td>${lvl.density}</td>
            <td style="font-weight: bold; color: #e74c3c;">
                ${displayHole} ${unitLabel}
            </td>
            <td style="font-weight: bold; color: #2c3e50;">
                ${displayPad} ${unitLabel}
            </td>
        `;
        tbody.appendChild(row);
    });

    resultsContainer.style.display = 'block';
}
