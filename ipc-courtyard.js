/**
 * @fileoverview IPC-7351 Courtyard Size Calculator.
 */

document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('btn-calc-courtyard');
    
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateCourtyard);
    }

    const inputs = ['court-dim-x', 'court-dim-y', 'court-unit'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    calculateCourtyard();
                }
            });
        }
    });
});

/**
 * @brief Performs the courtyard calculation based on IPC-7351.
 * Uses window.showError() instead of standard alerts.
 */
function calculateCourtyard() {
    const dimXInput = document.getElementById('court-dim-x').value;
    const dimYInput = document.getElementById('court-dim-y').value;
    const unit = document.getElementById('court-unit').value;
    const resultsContainer = document.getElementById('courtyard-results');
    const tbody = document.getElementById('courtyard-results-body');

    // Strict Input Validation using custom modal
    if (dimXInput.trim() === '' || isNaN(dimXInput) || parseFloat(dimXInput) <= 0 ||
        dimYInput.trim() === '' || isNaN(dimYInput) || parseFloat(dimYInput) <= 0) {
        window.showError("Please enter valid positive numbers for BOTH the X and Y dimensions. Fields cannot be empty or zero.");
        return;
    }

    const dimX = parseFloat(dimXInput);
    const dimY = parseFloat(dimYInput);

    let dimXMM = unit === 'in' ? dimX * 25.4 : dimX;
    let dimYMM = unit === 'in' ? dimY * 25.4 : dimY;

    const levels = [
        { level: 'A', density: 'Low Density', excess: 0.50 },
        { level: 'B', density: 'Moderate Density', excess: 0.25 },
        { level: 'C', density: 'High Density', excess: 0.10 }
    ];

    tbody.innerHTML = ''; 
    const unitLabel = unit === 'in' ? 'in' : 'mm';
    const decimals = 2; 

    levels.forEach(lvl => {
        let finalXMM = dimXMM + (lvl.excess * 2);
        let finalYMM = dimYMM + (lvl.excess * 2);

        finalXMM = Math.ceil(finalXMM / 0.05) * 0.05;
        finalYMM = Math.ceil(finalYMM / 0.05) * 0.05;

        let displayX = unit === 'in' ? finalXMM / 25.4 : finalXMM;
        let displayY = unit === 'in' ? finalYMM / 25.4 : finalYMM;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>Level ${lvl.level}</strong></td>
            <td>${lvl.density}</td>
            <td>${displayX.toFixed(decimals)} ${unitLabel} × ${displayY.toFixed(decimals)} ${unitLabel}</td>
        `;
        tbody.appendChild(row);
    });

    resultsContainer.style.display = 'block';
}