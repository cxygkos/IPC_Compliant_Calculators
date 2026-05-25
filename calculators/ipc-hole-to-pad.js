/**
 * @fileoverview Datasheet Hole to Pad Size Calculator.
 * Calculates pad dimensions based on a known hole, including slots and oblongs.
 */

document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('btn-calc-hole-to-pad');
    const typeSelect = document.getElementById('hole-pad-type');
    
    // Bind change event to toggle input field visibility
    if (typeSelect) {
        typeSelect.addEventListener('change', updateInputVisibility);
        // Set initial visibility on load
        updateInputVisibility();
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', calculatePadFromHole);
    }

    const inputs = ['hole-input-size', 'pad-input-x', 'slot-input-length', 'slot-input-width', 'hole-input-unit'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    calculatePadFromHole();
                }
            });
        }
    });
});

/**
 * @brief Toggles the visibility of specific input fields based on geometry selection.
 */
function updateInputVisibility() {
    const type = document.getElementById('hole-pad-type').value;
    
    // Round / Oblong Hole Size visibility
    document.getElementById('group-hole-size').style.display = (type === 'round' || type === 'oblong') ? 'flex' : 'none';
    
    // Oblong X-Dimension visibility
    document.getElementById('group-pad-x').style.display = (type === 'oblong') ? 'flex' : 'none';
    
    // Slot Dimensions visibility
    document.getElementById('group-slot-length').style.display = (type === 'slot') ? 'flex' : 'none';
    document.getElementById('group-slot-width').style.display = (type === 'slot') ? 'flex' : 'none';
}

/**
 * @brief Performs the pad calculation from given hole/slot sizes.
 * Dynamically handles Round, Oblong, and Slot geometry paths.
 */
function calculatePadFromHole() {
    const type = document.getElementById('hole-pad-type').value;
    const unit = document.getElementById('hole-input-unit').value;
    const resultsContainer = document.getElementById('hole-to-pad-results');
    const tbody = document.getElementById('hole-to-pad-results-body');
    
    let baseDim1 = 0, baseDim2 = 0;
    let isSlotOrOblong = (type === 'oblong' || type === 'slot');
    let fixedXMM = 0;

    // --- Validation and Data Gathering based on Type ---
    if (type === 'round') {
        const holeInput = document.getElementById('hole-input-size').value;
        if (holeInput.trim() === '' || isNaN(holeInput) || parseFloat(holeInput) <= 0) {
            window.showError("Please enter a valid positive number for the Hole Size.");
            return;
        }
        baseDim1 = parseFloat(holeInput);

    } else if (type === 'oblong') {
        const holeInput = document.getElementById('hole-input-size').value;
        const padXInput = document.getElementById('pad-input-x').value;
        if (holeInput.trim() === '' || isNaN(holeInput) || parseFloat(holeInput) <= 0 ||
            padXInput.trim() === '' || isNaN(padXInput) || parseFloat(padXInput) <= 0) {
            window.showError("Please enter valid positive numbers for BOTH the Hole Size and Pad X Dimension.");
            return;
        }
        baseDim1 = parseFloat(holeInput);
        let rawPadX = parseFloat(padXInput);
        fixedXMM = unit === 'in' ? rawPadX * 25.4 : rawPadX; // Store fixed X dimension in MM

    } else if (type === 'slot') {
        const slotLen = document.getElementById('slot-input-length').value;
        const slotWid = document.getElementById('slot-input-width').value;
        if (slotLen.trim() === '' || isNaN(slotLen) || parseFloat(slotLen) <= 0 ||
            slotWid.trim() === '' || isNaN(slotWid) || parseFloat(slotWid) <= 0) {
            window.showError("Please enter valid positive numbers for BOTH Slot Length and Slot Width.");
            return;
        }
        baseDim1 = parseFloat(slotLen);
        baseDim2 = parseFloat(slotWid);
    }

    // Convert everything to Metric for standard calculation
    let dim1MM = unit === 'in' ? baseDim1 * 25.4 : baseDim1;
    let dim2MM = unit === 'in' ? baseDim2 * 25.4 : baseDim2;

    const levels = [
        { level: 'A', density: 'Low Density', padAdd: 0.70 },
        { level: 'B', density: 'Moderate Density', padAdd: 0.60 },
        { level: 'C', density: 'High Density', padAdd: 0.50 }
    ];

    tbody.innerHTML = ''; 
    const unitLabel = unit === 'in' ? 'in' : 'mm';
    const decimals = 2; 

    levels.forEach(lvl => {
        let displayOutput = "";

        if (type === 'round') {
            let padMM = dim1MM + lvl.padAdd;
            let finalPad = unit === 'in' ? padMM / 25.4 : padMM;
            displayOutput = `${finalPad.toFixed(decimals)} ${unitLabel}`;

        } else if (type === 'oblong') {
            // Y-dimension is computed based on the hole. X is fixed by the user.
            let padYMM = dim1MM + lvl.padAdd;
            let finalPadY = unit === 'in' ? padYMM / 25.4 : padYMM;
            let finalPadX = unit === 'in' ? fixedXMM / 25.4 : fixedXMM;
            displayOutput = `${finalPadX.toFixed(decimals)} ${unitLabel} × ${finalPadY.toFixed(decimals)} ${unitLabel}`;

        } else if (type === 'slot') {
            // Both length and width receive the clearance treatment
            let padLenMM = dim1MM + lvl.padAdd;
            let padWidMM = dim2MM + lvl.padAdd;
            let finalPadLen = unit === 'in' ? padLenMM / 25.4 : padLenMM;
            let finalPadWid = unit === 'in' ? padWidMM / 25.4 : padWidMM;
            displayOutput = `${finalPadLen.toFixed(decimals)} ${unitLabel} × ${finalPadWid.toFixed(decimals)} ${unitLabel}`;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>Level ${lvl.level}</strong></td>
            <td>${lvl.density}</td>
            <td>${displayOutput}</td>
        `;
        tbody.appendChild(row);
    });

    resultsContainer.style.display = 'block';
}
