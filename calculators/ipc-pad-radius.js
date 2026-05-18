/**
 * @fileoverview IPC-7351 Pad Corner Radius Calculator.
 */

document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('btn-calc-pad-radius');
    
    if (calcBtn) {
        calcBtn.addEventListener('click', calculatePadRadius);
    }

    const inputs = ['radius-dim-x', 'radius-dim-y'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    calculatePadRadius();
                }
            });
        }
    });
});

function calculatePadRadius() {
    const dimX = parseFloat(document.getElementById('radius-dim-x').value);
    const dimY = parseFloat(document.getElementById('radius-dim-y').value);
    const unit = document.getElementById('radius-unit').value;
    
    if (isNaN(dimX) || dimX <= 0 || isNaN(dimY) || dimY <= 0) {
        window.showError("Please enter valid positive numbers for both pad dimensions.");
        return;
    }
    
    // IPC logic dictates using the shortest side as the pad width
    const width = Math.min(dimX, dimY);
    
    // Calculate the 25% ratio
    let calculatedRadius = width * 0.25;
    
    // Apply the IPC Maximum Limit (0.25mm or 10 mils)
    const maxLimit = unit === 'mm' ? 0.25 : 0.010; 
    const finalRadius = Math.min(calculatedRadius, maxLimit);
    
    // Altium Designer specific calculation: Reverse calculate the final percentage
    // Math.round() ensures we get a clean integer (e.g., 25%, 18%) to drop right into the ECAD tool.
    const finalPercentage = Math.round((finalRadius / width) * 100);
    
    // Formatting numbers for the UI
    const decimalPlaces = unit === 'mm' ? 2 : 3;
    const widthStr = width.toFixed(decimalPlaces);
    const calcRadiusStr = calculatedRadius.toFixed(decimalPlaces);
    const limitStr = unit === 'mm' ? "0.25" : "0.010";
    const finalStr = finalRadius.toFixed(decimalPlaces);

    const tbody = document.getElementById('pad-radius-results-body');
    tbody.innerHTML = `
        <tr>
            <td>Shortest Dimension (Pad Width)</td>
            <td>${widthStr} ${unit}</td>
        </tr>
        <tr>
            <td>Standard 25% Ratio</td>
            <td>${calcRadiusStr} ${unit}</td>
        </tr>
        <tr>
            <td>IPC Maximum Limit</td>
            <td>${limitStr} ${unit}</td>
        </tr>
        <tr>
            <td><strong>Final Compliant Corner Radius</strong></td>
            <td style="font-weight: 700; color: var(--sidebar-link-active); font-size: 1.1rem;">
                ${finalStr} ${unit}
                <span style="font-size: 0.9rem; color: var(--text-secondary); font-weight: normal; margin-left: 8px;">(${finalPercentage}%)</span>
            </td>
        </tr>
    `;
    
    document.getElementById('pad-radius-results').style.display = 'block';
}
