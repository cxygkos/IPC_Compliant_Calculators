/**
 * @fileoverview IPC-7525 Solder Paste Stencil Area Ratio Calculator.
 */

document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('btn-calc-area-ratio');
    const shapeSelect = document.getElementById('ar-shape');
    const groupY = document.getElementById('group-ar-dim-y');
    const labelX = document.getElementById('label-ar-dim-x'); // New label reference
    
    // Toggle Y dimension visibility and X label text based on shape
    if (shapeSelect && groupY && labelX) {
        shapeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'circular') {
                groupY.style.display = 'none';
                labelX.textContent = "Aperture Diameter (mm):"; // Update label
            } else {
                groupY.style.display = 'flex';
                labelX.textContent = "Aperture Width (X) (mm):"; // Revert label
            }
        });
    }

    if (calcBtn) {
        calcBtn.addEventListener('click', calculateAreaRatio);
    }

    const inputs = ['ar-dim-x', 'ar-dim-y', 'ar-thickness'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    calculateAreaRatio();
                }
            });
        }
    });
});

function calculateAreaRatio() {
    const shape = document.getElementById('ar-shape').value;
    const dimX = parseFloat(document.getElementById('ar-dim-x').value);
    const dimY = parseFloat(document.getElementById('ar-dim-y').value);
    const thickness = parseFloat(document.getElementById('ar-thickness').value);
    
    if (isNaN(dimX) || dimX <= 0 || isNaN(thickness) || thickness <= 0) {
        window.showError("Please enter valid positive numbers for the aperture dimensions and stencil thickness.");
        return;
    }

    if (shape === 'rectangular' && (isNaN(dimY) || dimY <= 0)) {
        window.showError("Please enter a valid Y dimension for rectangular apertures.");
        return;
    }
    
    let areaRatio = 0;
    let formulaContext = "";
    
    // IPC-7525 Formulas formatted with pure HTML/CSS "LaTeX" style
    if (shape === 'rectangular') {
        areaRatio = (dimX * dimY) / (2 * (dimX + dimY) * thickness);
        formulaContext = `<div class="math-fraction" aria-label="X times Y divided by 2 times X plus Y times T">
                <span class="numerator">X &times; Y</span>
                <span class="denominator">2 &times; (X + Y) &times; T</span>
            </div>`;
    } else {
        areaRatio = dimX / (4 * thickness);
        formulaContext = `<div class="math-fraction" aria-label="D divided by 4 times T">
                <span class="numerator">D</span>
                <span class="denominator">4 &times; T</span>
            </div>`;
    }
    
    // IPC-7525 strict Area Ratio limit is 0.66
    const isPass = areaRatio >= 0.66;
    const statusClass = isPass ? 'text-pass' : 'text-fail';
    const statusText = isPass ? 'PASS: Reliable Release' : 'FAIL: Paste Sticking Risk';
    
    // Dynamic Troubleshooting Advice (Only shows on FAIL)
    let troubleshootingHTML = '';
    if (!isPass) {
        troubleshootingHTML = `
            <tr>
                <td colspan="2" style="padding: 0; border-bottom: none;">
                    <div class="info-box" style="margin: 1.5rem 1rem; border-left-color: var(--status-fail); background-color: rgba(211, 47, 47, 0.05);">
                        <strong style="color: var(--status-fail); display: block; margin-bottom: 0.8rem;">How to fix a failing Area Ratio:</strong>
                        <ul style="margin-left: 1.5rem; color: var(--text-primary); font-size: 0.95rem; line-height: 1.6;">
                            <li style="margin-bottom: 0.5rem;"><strong>Reduce Stencil Thickness:</strong> Use a thinner global foil or request a "step-down" stencil for this specific dense area.</li>
                            <li style="margin-bottom: 0.5rem;"><strong>Enlarge the Pad:</strong> Marginally increase the X/Y dimensions if component pitch and clearance rules allow it.</li>
                            <li><strong>Advanced Fabrication:</strong> Specify a nano-coated or electroformed stencil to reduce wall friction, and utilize a finer solder paste (e.g., Type 4 or 5).</li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
    }
    
    const tbody = document.getElementById('area-ratio-results-body');
    tbody.innerHTML = `
        <tr>
            <td>Calculation Expression</td>
            <td>${formulaContext}</td>
        </tr>
        <tr>
            <td>Calculated Area Ratio</td>
            <td style="font-weight: 700;">${areaRatio.toFixed(2)}</td>
        </tr>
        <tr>
            <td><strong>Release Viability (Limit > 0.66)</strong></td>
            <td class="${statusClass}">${statusText}</td>
        </tr>
        ${troubleshootingHTML}
    `;
    
    document.getElementById('area-ratio-results').style.display = 'block';
}
