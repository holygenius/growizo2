/**
 * Advanced PPFD Calculation Utilities
 * Implements Inverse Distance Weighting (IDW) and professional horticultural lighting models
 */

// Growth stage configurations with PPFD targets
export const GROWTH_STAGES = {
    seedling: {
        name: 'Seedling',
        minPPFD: 200,
        optimalPPFD: 400,
        maxPPFD: 400,
        description: 'Young plants need lower light intensity'
    },
    veg: {
        name: 'Vegetative',
        minPPFD: 400,
        optimalPPFD: 600,
        maxPPFD: 600,
        description: 'Active growth stage requires moderate light'
    },
    flower: {
        name: 'Flowering',
        minPPFD: 600,
        optimalPPFD: 900,
        maxPPFD: 900,
        description: 'Bloom stage needs high light for max yield'
    },
    co2: {
        name: 'CO2 Enriched',
        minPPFD: 1000,
        optimalPPFD: 1300,
        maxPPFD: 1500,
        description: 'With CO2 supplementation, higher light is safe'
    }
};

// Perceptually uniform color scales (Viridis-style)
export const COLOR_SCALES = {
    viridis: {
        name: 'Viridis (Scientific)',
        colors: [
            { pos: 0.0, r: 68, g: 1, b: 84 },
            { pos: 0.2, r: 72, g: 35, b: 116 },
            { pos: 0.4, r: 64, g: 67, b: 135 },
            { pos: 0.6, r: 52, g: 94, b: 141 },
            { pos: 0.8, r: 41, g: 120, b: 142 },
            { pos: 1.0, r: 253, g: 231, b: 37 }
        ]
    },
    growers: {
        name: "Grower's Palette",
        colors: [
            { pos: 0.0, r: 30, g: 30, b: 100 },      // Too low (blue)
            { pos: 0.25, r: 50, g: 100, b: 200 },    // Seedling (light blue)
            { pos: 0.4, r: 0, g: 180, b: 0 },        // Optimal veg (green)
            { pos: 0.6, r: 180, g: 200, b: 0 },      // Optimal flower (yellow-green)
            { pos: 0.8, r: 255, g: 140, b: 0 },      // High (orange)
            { pos: 0.9, r: 255, g: 50, b: 0 },       // Very high (red)
            { pos: 1.0, r: 255, g: 255, b: 255 }     // Extreme (white)
        ]
    },
    rainbow: {
        name: 'Rainbow',
        colors: [
            { pos: 0.0, r: 0, g: 0, b: 255 },
            { pos: 0.25, r: 0, g: 255, b: 255 },
            { pos: 0.5, r: 0, g: 255, b: 0 },
            { pos: 0.75, r: 255, g: 255, b: 0 },
            { pos: 1.0, r: 255, g: 0, b: 0 }
        ]
    }
};

/**
 * Get color for a given PPFD value based on selected scale
 * @param {number} ppfd - The PPFD value
 * @param {string} scaleName - The color scale to use
 * @param {number} maxPPFD - Maximum PPFD for normalization (default 1500)
 * @returns {Object} { r, g, b, alpha, category }
 */
export function getPPFDColor(ppfd, scaleName = 'growers', maxPPFD = 1500) {
    const scale = COLOR_SCALES[scaleName] || COLOR_SCALES.growers;
    const normalized = Math.min(ppfd / maxPPFD, 1);
    
    // Find color segment
    let lower = scale.colors[0];
    let upper = scale.colors[scale.colors.length - 1];
    
    for (let i = 0; i < scale.colors.length - 1; i++) {
        if (normalized >= scale.colors[i].pos && normalized <= scale.colors[i + 1].pos) {
            lower = scale.colors[i];
            upper = scale.colors[i + 1];
            break;
        }
    }
    
    // Interpolate between colors
    const range = upper.pos - lower.pos;
    const t = range === 0 ? 0 : (normalized - lower.pos) / range;
    
    const r = Math.round(lower.r + (upper.r - lower.r) * t);
    const g = Math.round(lower.g + (upper.g - lower.g) * t);
    const b = Math.round(lower.b + (upper.b - lower.b) * t);
    
    // Determine category for filtering
    let category = 'low';
    let alpha = 180;
    
    if (ppfd < 200) {
        category = 'low';
        alpha = 150;
    } else if (ppfd < 400) {
        category = 'seedling';
        alpha = 170;
    } else if (ppfd < 600) {
        category = 'veg';
        alpha = 180;
    } else if (ppfd < 900) {
        category = 'flower';
        alpha = 190;
    } else if (ppfd < 1200) {
        category = 'high';
        alpha = 200;
    } else {
        category = 'extreme';
        alpha = 220;
    }
    
    return { r, g, b, alpha, category };
}

/**
 * Calculate Daily Light Integral (DLI)
 * DLI = PPFD × Photoperiod (hours) × 3600 / 1,000,000
 * @param {number} avgPPFD - Average PPFD
 * @param {number} photoperiod - Hours of light per day
 * @returns {number} DLI in mol/m²/day
 */
export function calculateDLI(avgPPFD, photoperiod = 18) {
    return (avgPPFD * photoperiod * 3600) / 1000000;
}

/**
 * Get DLI recommendation based on growth stage
 * @param {string} stage - Growth stage key
 * @returns {Object} DLI recommendations
 */
export function getDLIRecommendations(stage) {
    const stageConfig = GROWTH_STAGES[stage] || GROWTH_STAGES.veg;
    return {
        minDLI: (stageConfig.minPPFD * 18 * 3600) / 1000000,
        optimalDLI: (stageConfig.optimalPPFD * 18 * 3600) / 1000000,
        maxDLI: (stageConfig.maxPPFD * 18 * 3600) / 1000000
    };
}

/**
 * Inverse Distance Weighting (IDW) Interpolation
 * More accurate for light distribution modeling than simple cosine law
 * 
 * @param {Array} sensorPoints - Array of {x, y, value} objects
 * @param {number} targetX - Target X coordinate
 * @param {number} targetY - Target Y coordinate
 * @param {number} power - Power parameter (p=2 for inverse square law behavior)
 * @returns {number} Interpolated PPFD value
 */
export function idwInterpolate(sensorPoints, targetX, targetY, power = 2) {
    if (!sensorPoints || sensorPoints.length === 0) return 0;
    
    let numerator = 0;
    let denominator = 0;
    
    for (const point of sensorPoints) {
        const dx = targetX - point.x;
        const dy = targetY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Avoid division by zero
        if (distance < 0.0001) {
            return point.value;
        }
        
        const weight = 1 / Math.pow(distance, power);
        numerator += weight * point.value;
        denominator += weight;
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Generate PPFD map using IDW interpolation from sensor grid
 * @param {number} tentWidth - Width in feet
 * @param {number} tentDepth - Depth in feet
 * @param {Array} sensorGrid - 2D array of sensor readings
 * @param {number} resolution - Cells per foot
 * @returns {Array<Array<number>>} 2D PPFD map
 */
export function generatePPFDMapIDW(tentWidth, tentDepth, sensorGrid, resolution = 4) {
    const cols = Math.ceil(tentWidth * resolution);
    const rows = Math.ceil(tentDepth * resolution);
    
    // Convert sensor grid to sensor points
    const sensorPoints = [];
    const gridRows = sensorGrid.length;
    const gridCols = sensorGrid[0]?.length || 0;
    
    if (gridCols === 0 || gridRows === 0) {
        return Array(rows).fill(0).map(() => Array(cols).fill(0));
    }
    
    const cellWidth = tentWidth / gridCols;
    const cellHeight = tentDepth / gridRows;
    
    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            if (sensorGrid[r][c] !== null && sensorGrid[r][c] !== undefined) {
                sensorPoints.push({
                    x: (c + 0.5) * cellWidth,
                    y: (r + 0.5) * cellHeight,
                    value: sensorGrid[r][c]
                });
            }
        }
    }
    
    const map = Array(rows).fill(0).map(() => Array(cols).fill(0));
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const targetX = (c + 0.5) / resolution;
            const targetY = (r + 0.5) / resolution;
            map[r][c] = idwInterpolate(sensorPoints, targetX, targetY, 2);
        }
    }
    
    return map;
}

/**
 * Original PPFD calculation using Lambertian distribution model
 * I(r) = I_max * cos(theta)
 * 
 * @param {Object} light - Light object with maxPPFD, beamAngle, recommendedHeight
 * @param {number} targetX - Target X coordinate (feet)
 * @param {number} targetY - Target Y coordinate (feet)
 * @param {number} lightX - Light X coordinate (feet)
 * @param {number} lightY - Light Y coordinate (feet)
 * @param {number} height - Mounting height (feet)
 * @returns {number} PPFD value
 */
export function calculatePPFD(light, targetX, targetY, lightX, lightY, height) {
    if (!light.maxPPFD) return 0;

    const dx = targetX - lightX;
    const dy = targetY - lightY;
    const r = Math.sqrt(dx * dx + dy * dy);
    const theta = Math.atan(r / height);

    let ppfdAtHeight = light.maxPPFD;
    if (light.recommendedHeight) {
        const recH = light.recommendedHeight / 12;
        const effectiveHeight = Math.max(0.5, height);
        const scale = Math.pow(recH / effectiveHeight, 2);
        ppfdAtHeight = light.maxPPFD * scale;
    }

    // Lambertian cosine law
    const cosTheta = Math.cos(theta);
    return Math.max(0, ppfdAtHeight * cosTheta);
}

/**
 * Enhanced PPFD calculation with cosine law and beam angle falloff
 * More physically accurate than simple cosine
 * 
 * @param {Object} light - Light configuration
 * @param {number} targetX - Target position X
 * @param {number} targetY - Target position Y
 * @param {number} lightX - Light position X
 * @param {number} lightY - Light position Y
 * @param {number} height - Mounting height
 * @returns {number} PPFD value
 */
export function calculatePPFDEnhanced(light, targetX, targetY, lightX, lightY, height) {
    if (!light.maxPPFD) return 0;

    const dx = targetX - lightX;
    const dy = targetY - lightY;
    const horizontalDist = Math.sqrt(dx * dx + dy * dy);
    const slantDistance = Math.sqrt(horizontalDist * horizontalDist + height * height);
    
    // Angle from nadir
    const theta = Math.acos(height / slantDistance);
    
    // Beam angle check (FWHM)
    const halfBeamAngle = ((light.beamAngle || 120) * Math.PI / 180) / 2;
    
    // Height-based scaling using inverse square law
    let ppfdAtPoint = light.maxPPFD;
    if (light.recommendedHeight) {
        const recH = light.recommendedHeight / 12;
        const scale = Math.pow(recH / height, 2);
        ppfdAtPoint = light.maxPPFD * scale;
    }
    
    // Cosine falloff (Lambertian)
    const cosineFalloff = Math.cos(theta);
    
    // Beam angle penalty (smooth cutoff)
    let beamFactor = 1;
    if (theta > halfBeamAngle) {
        const beamRange = Math.PI / 2 - halfBeamAngle;
        const beamPos = (theta - halfBeamAngle) / beamRange;
        // Smooth falloff outside beam angle
        beamFactor = Math.pow(1 - beamPos, 2);
    }
    
    return Math.max(0, ppfdAtPoint * cosineFalloff * beamFactor);
}

/**
 * Generate PPFD map from light sources (original method)
 * @param {number} tentWidth - Width in feet
 * @param {number} tentDepth - Depth in feet
 * @param {Array} lights - Array of light objects
 * @param {number} resolution - Cells per foot
 * @param {number} globalHeight - Global hanging height
 * @returns {Array<Array<number>>} 2D PPFD map
 */
export function generatePPFDMap(tentWidth, tentDepth, lights, resolution = 4, globalHeight = null) {
    const cols = Math.ceil(tentWidth * resolution);
    const rows = Math.ceil(tentDepth * resolution);
    const map = Array(rows).fill(0).map(() => Array(cols).fill(0));

    const getCoord = (index) => (index + 0.5) / resolution;

    lights.forEach(light => {
        const quantity = light.quantity || 1;
        const positions = light.positions || [];

        for (let i = 0; i < quantity; i++) {
            const pos = positions[i] || { x: 0.5, y: 0.5 };
            const lightX = pos.x * tentWidth;
            const lightY = pos.y * tentDepth;

            let h = globalHeight;
            if (h === null) {
                h = light.recommendedHeight ? light.recommendedHeight / 12 : 1.5;
            }

            for (let r = 0; r < rows; r++) {
                const cellY = getCoord(r);
                for (let c = 0; c < cols; c++) {
                    const cellX = getCoord(c);
                    const ppfd = calculatePPFDEnhanced(light, cellX, cellY, lightX, lightY, h);
                    map[r][c] += ppfd;
                }
            }
        }
    });

    return map;
}

/**
 * Calculate metrics from PPFD map
 * @param {Array<Array<number>>} ppfdMap - 2D PPFD array
 * @returns {Object} Metrics object
 */
export function calculateMetrics(ppfdMap) {
    let total = 0;
    let min = Infinity;
    let max = -Infinity;
    let count = 0;

    for (let r = 0; r < ppfdMap.length; r++) {
        for (let c = 0; c < ppfdMap[r].length; c++) {
            const val = ppfdMap[r][c];
            total += val;
            if (val < min) min = val;
            if (val > max) max = val;
            count++;
        }
    }

    if (count === 0) return { average: 0, min: 0, max: 0, uniformity: 0 };

    const average = total / count;
    // Uniformity coefficient of variation (CV) = (std dev / mean)
    // Or uniformity ratio = min / avg
    const uniformity = average > 0 ? min / average : 0;

    return {
        average: Math.round(average),
        min: Math.round(min),
        max: Math.round(max),
        uniformity: parseFloat(uniformity.toFixed(2))
    };
}

/**
 * Perform gap analysis and generate recommendations
 * @param {Array<Array<number>>} ppfdMap - PPFD map
 * @param {string} growthStage - Current growth stage
 * @returns {Object} Analysis results
 */
export function analyzePPFDMap(ppfdMap, growthStage = 'flower') {
    const metrics = calculateMetrics(ppfdMap);
    const stage = GROWTH_STAGES[growthStage] || GROWTH_STAGES.flower;
    
    const issues = [];
    const recommendations = [];
    
    // Check for hotspots
    if (metrics.max > stage.maxPPFD * 1.2) {
        issues.push({
            type: 'hotspot',
            severity: 'warning',
            message: `High light intensity detected (${metrics.max} PPFD)`,
            recommendation: 'Consider raising light fixtures or adding diffusers'
        });
    }
    
    // Check for shadows
    if (metrics.min < stage.minPPFD) {
        issues.push({
            type: 'shadow',
            severity: 'warning',
            message: `Low light areas detected (${metrics.min} PPFD)`,
            recommendation: 'Consider adding supplemental side lighting or adjusting fixture positions'
        });
    }
    
    // Check uniformity
    if (metrics.uniformity < 0.7) {
        issues.push({
            type: 'uniformity',
            severity: 'info',
            message: `Non-uniform light distribution (${Math.round(metrics.uniformity * 100)}%)`,
            recommendation: 'Increase hanging height or add more fixtures for better coverage'
        });
    }
    
    // Calculate coverage percentage
    let optimalCoverage = 0;
    let belowOptimal = 0;
    let aboveOptimal = 0;
    let total = 0;
    
    for (let r = 0; r < ppfdMap.length; r++) {
        for (let c = 0; c < ppfdMap[r].length; c++) {
            const val = ppfdMap[r][c];
            if (val >= stage.minPPFD && val <= stage.maxPPFD) {
                optimalCoverage++;
            } else if (val < stage.minPPFD) {
                belowOptimal++;
            } else {
                aboveOptimal++;
            }
            total++;
        }
    }
    
    return {
        metrics,
        stage,
        issues,
        recommendations,
        coverage: {
            optimal: parseFloat(((optimalCoverage / total) * 100).toFixed(1)),
            below: parseFloat(((belowOptimal / total) * 100).toFixed(1)),
            above: parseFloat(((aboveOptimal / total) * 100).toFixed(1))
        },
        dli: calculateDLI(metrics.average)
    };
}

/**
 * Generate contour lines for visualization
 * @param {Array<Array<number>>} ppfdMap - PPFD map
 * @param {Array<number>} thresholds - PPFD thresholds for contours
 * @returns {Array} Contour data
 */
export function generateContours(ppfdMap, thresholds = [200, 400, 600, 900, 1200]) {
    const rows = ppfdMap.length;
    const cols = ppfdMap[0]?.length || 0;
    const contours = [];
    
    // Simple contour finding using Marching Squares-like approach
    for (const threshold of thresholds) {
        const lines = [];
        
        // Horizontal edges
        for (let r = 0; r < rows - 1; r++) {
            for (let c = 0; c < cols - 1; c++) {
                const v0 = ppfdMap[r][c];
                const v1 = ppfdMap[r][c + 1];
                const v2 = ppfdMap[r + 1][c];
                const v3 = ppfdMap[r + 1][c + 1];
                
                // Check if threshold crossing exists
                const above0 = v0 >= threshold;
                const above1 = v1 >= threshold;
                const above2 = v2 >= threshold;
                const above3 = v3 >= threshold;
                
                // If not all same, there's a crossing
                if (above0 !== above1 || above0 !== above2 || above0 !== above3) {
                    lines.push({
                        threshold,
                        row: r,
                        col: c,
                        type: 'crossing'
                    });
                }
            }
        }
        
        if (lines.length > 0) {
            contours.push({ threshold, lines });
        }
    }
    
    return contours;
}
