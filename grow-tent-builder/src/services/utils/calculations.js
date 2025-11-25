/**
 * Calculate total costs and power from selected items
 * @param {Object} state - Builder state
 * @returns {{cost: number, power: number, cfmRequired: number}}
 */
export function calculateTotals(state) {
    let cost = 0;
    let power = 0;

    Object.values(state.selectedItems).flat().forEach(item => {
        const qty = item.quantity || 1;
        cost += (item.price || 0) * qty;
        power += (item.watts || 0) * qty;
    });

    const { width, depth, height } = state.tentSize;
    const volume = width * depth * height;
    const cfmRequired = Math.ceil(volume * 1.2);

    return { cost, power, cfmRequired };
}

/**
 * Calculate monthly electricity cost
 * @param {number} watts - Total power in watts
 * @param {number} hoursPerDay - Hours of operation per day
 * @param {number} ratePerKwh - Electricity rate per kWh
 * @returns {number} Monthly cost
 */
export function calculateMonthlyCost(watts, hoursPerDay, ratePerKwh) {
    return (watts / 1000) * hoursPerDay * 30 * ratePerKwh;
}

/**
 * Calculate CFM required for tent ventilation
 * @param {number} width - Tent width
 * @param {number} depth - Tent depth
 * @param {number} height - Tent height
 * @param {number} [exhaustMultiplier=1.2] - Exhaust multiplier
 * @returns {number} Required CFM
 */
export function calculateRequiredCFM(width, depth, height, exhaustMultiplier = 1.2) {
    const volume = width * depth * height;
    return Math.ceil(volume * exhaustMultiplier);
}

/**
 * Convert dimensions between feet and meters
 * @param {number} value - Value to convert
 * @param {'ft' | 'm'} fromUnit - Source unit
 * @param {'ft' | 'm'} toUnit - Target unit
 * @returns {number} Converted value
 */
export function convertUnit(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'ft' && toUnit === 'm') {
        return value * 0.3048;
    }
    
    if (fromUnit === 'm' && toUnit === 'ft') {
        return value / 0.3048;
    }
    
    return value;
}
