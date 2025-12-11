import { createContext, useContext, useReducer } from 'react';

export const BuilderContext = createContext();

const initialState = {
    currentStep: 0, // Start with preset selection
    tentSize: { width: 4, depth: 4, height: 7, unit: 'ft' },
    mediaType: null,
    selectedPreset: null, // ID of the loaded preset set
    selectedItems: {
        tent: [],
        lighting: [],
        ventilation: [],
        environment: [],
        nutrients: [],
        monitoring: [],
        substrates: [],
        accessories: []
    },
    totals: {
        cost: 0,
        power: 0,
        cfmRequired: 0
    }
};

function calculateTotals(state) {
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

function builderReducer(state, action) {
    switch (action.type) {
        case 'NEXT_STEP':
            return { ...state, currentStep: Math.min(state.currentStep + 1, 8) };
        case 'PREV_STEP':
            return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
        case 'SET_STEP':
            return { ...state, currentStep: action.payload };
        case 'SET_TENT_SIZE': {
            const newStateWithSize = { ...state, tentSize: action.payload };
            return { ...newStateWithSize, totals: calculateTotals(newStateWithSize) };
        }
        case 'SET_MEDIA_TYPE':
            return {
                ...state,
                mediaType: action.payload,
                selectedItems: {
                    ...state.selectedItems,
                    nutrients: []
                }
            };
        case 'ADD_ITEM': {
            const { category, item } = action.payload;
            const existingItem = state.selectedItems[category].find(i => i.id === item.id);

            let newItems;
            if (existingItem) {
                newItems = {
                    ...state.selectedItems,
                    [category]: state.selectedItems[category].map(i =>
                        i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
                    )
                };
            } else {
                newItems = {
                    ...state.selectedItems,
                    [category]: [...state.selectedItems[category], { ...item, quantity: 1 }]
                };
            }
            const newStateAdd = { ...state, selectedItems: newItems };
            return { ...newStateAdd, totals: calculateTotals(newStateAdd) };
        }
        case 'INCREMENT_ITEM': {
            const { category, itemId } = action.payload;
            const newItems = {
                ...state.selectedItems,
                [category]: state.selectedItems[category].map(i =>
                    i.id === itemId ? { ...i, quantity: (i.quantity || 1) + 1 } : i
                )
            };
            const newStateInc = { ...state, selectedItems: newItems };
            return { ...newStateInc, totals: calculateTotals(newStateInc) };
        }
        case 'DECREMENT_ITEM': {
            const { category, itemId } = action.payload;
            const item = state.selectedItems[category].find(i => i.id === itemId);

            let newItems;
            if (item && item.quantity <= 1) {
                // Remove item if quantity is 1
                newItems = {
                    ...state.selectedItems,
                    [category]: state.selectedItems[category].filter(i => i.id !== itemId)
                };
            } else {
                // Decrease quantity
                newItems = {
                    ...state.selectedItems,
                    [category]: state.selectedItems[category].map(i =>
                        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
                    )
                };
            }
            const newStateDec = { ...state, selectedItems: newItems };
            return { ...newStateDec, totals: calculateTotals(newStateDec) };
        }
        case 'REMOVE_ITEM': {
            const { category, itemId } = action.payload;
            const newItemsRem = {
                ...state.selectedItems,
                [category]: state.selectedItems[category].filter(i => i.id !== itemId)
            };
            const newStateRem = { ...state, selectedItems: newItemsRem };
            return { ...newStateRem, totals: calculateTotals(newStateRem) };
        }
        case 'UPDATE_ITEM_POSITIONS': {
            const { category, itemId, positions } = action.payload;
            const newItems = {
                ...state.selectedItems,
                [category]: state.selectedItems[category].map(i =>
                    i.id === itemId ? { ...i, positions } : i
                )
            };
            return { ...state, selectedItems: newItems };
        }
        case 'LOAD_PRESET': {
            // Load a preset set configuration
            const { preset, tentDims, items, mediaType } = action.payload;
            const newState = {
                ...state,
                selectedPreset: preset.id,
                tentSize: tentDims,
                mediaType: mediaType,
                selectedItems: items,
                currentStep: 1 // Start from step 1, products already selected
            };
            return { ...newState, totals: calculateTotals(newState) };
        }
        case 'LOAD_BUILD': {
            // Load a saved user build
            const { tentSize, mediaType, selectedItems } = action.payload;
            const newState = {
                ...state,
                selectedPreset: null, // Clear preset since this is a custom build
                tentSize: tentSize,
                mediaType: mediaType,
                selectedItems: selectedItems,
                currentStep: 8 // Jump to summary/final step or step 1? Let's go to step 1 to review
            };
            // Decide where to send user. Step 8 is Summary. Step 0 is Preset. Step 1 is Tent.
            // If it's a "Saved Set", maybe sending them to Summary (Step 8) is best to see the whole thing,
            // or Step 1 to edit. Let's send to Step 1 (Products) so they can edit, 
            // but we need to verify if 'currentStep' 1 is correct for "Products".
            // Looking at the reducer, NEXT_STEP increments.
            // Let's assume Step 8 is a good place if they want to just view it, but Step 1 if they want to edit.
            // Let's go to Step 8 (Summary) so they see the result first.
            // Wait, looking at `initialState`, currentStep is 0.

            return { ...newState, currentStep: 8, totals: calculateTotals(newState) };
        }
        case 'CLEAR_PRESET':
            return {
                ...state,
                selectedPreset: null
            };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

export function BuilderProvider({ children }) {
    const [state, dispatch] = useReducer(builderReducer, initialState);

    return (
        <BuilderContext.Provider value={{ state, dispatch }}>
            {children}
        </BuilderContext.Provider>
    );
}

export function useBuilder() {
    const context = useContext(BuilderContext);
    if (!context) {
        throw new Error('useBuilder must be used within a BuilderProvider');
    }
    return context;
}
