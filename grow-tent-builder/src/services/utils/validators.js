/**
 * Validate tent dimensions
 * @param {Object} dimensions - Tent dimensions
 * @param {number} dimensions.width
 * @param {number} dimensions.depth
 * @param {number} dimensions.height
 * @returns {{isValid: boolean, errors: string[]}}
 */
export function validateTentDimensions(dimensions) {
    const errors = [];
    const { width, depth, height } = dimensions;

    if (!width || width <= 0) {
        errors.push('Width must be a positive number');
    }
    
    if (!depth || depth <= 0) {
        errors.push('Depth must be a positive number');
    }
    
    if (!height || height <= 0) {
        errors.push('Height must be a positive number');
    }

    // Maximum reasonable dimensions
    if (width > 20) {
        errors.push('Width cannot exceed 20 feet');
    }
    
    if (depth > 20) {
        errors.push('Depth cannot exceed 20 feet');
    }
    
    if (height > 12) {
        errors.push('Height cannot exceed 12 feet');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate numeric input
 * @param {*} value - Value to validate
 * @param {Object} options - Validation options
 * @param {number} [options.min] - Minimum value
 * @param {number} [options.max] - Maximum value
 * @param {boolean} [options.integer] - Must be integer
 * @returns {{isValid: boolean, error: string|null}}
 */
export function validateNumber(value, options = {}) {
    const num = Number(value);
    
    if (isNaN(num)) {
        return { isValid: false, error: 'Must be a valid number' };
    }
    
    if (options.min !== undefined && num < options.min) {
        return { isValid: false, error: `Must be at least ${options.min}` };
    }
    
    if (options.max !== undefined && num > options.max) {
        return { isValid: false, error: `Must be at most ${options.max}` };
    }
    
    if (options.integer && !Number.isInteger(num)) {
        return { isValid: false, error: 'Must be a whole number' };
    }
    
    return { isValid: true, error: null };
}
