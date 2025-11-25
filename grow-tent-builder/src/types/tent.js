/**
 * @typedef {Object} TentSize
 * @property {number} width - Width of the tent
 * @property {number} depth - Depth of the tent
 * @property {number} height - Height of the tent
 * @property {'ft' | 'm'} unit - Unit of measurement
 */

/**
 * @typedef {Object} TentItem
 * @property {string} id - Unique identifier
 * @property {string} name - Item name
 * @property {number} price - Item price
 * @property {number} [watts] - Power consumption in watts
 * @property {number} [quantity] - Quantity selected
 * @property {Array<{x: number, y: number, rotation: number}>} [positions] - Light positions
 */

/**
 * @typedef {Object} SelectedItems
 * @property {TentItem[]} lighting - Selected lighting items
 * @property {TentItem[]} ventilation - Selected ventilation items
 * @property {TentItem[]} environment - Selected environment items
 * @property {TentItem[]} nutrients - Selected nutrient items
 * @property {TentItem[]} monitoring - Selected monitoring items
 */

/**
 * @typedef {Object} Totals
 * @property {number} cost - Total cost
 * @property {number} power - Total power consumption
 * @property {number} cfmRequired - Required CFM for ventilation
 */

/**
 * @typedef {Object} BuilderState
 * @property {number} currentStep - Current wizard step
 * @property {TentSize} tentSize - Tent dimensions
 * @property {string|null} mediaType - Selected media type
 * @property {SelectedItems} selectedItems - Selected items by category
 * @property {Totals} totals - Calculated totals
 */

// Export empty object to make this a module
export {};
