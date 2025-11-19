import { createContext, useContext, useReducer } from 'react';

const BuilderContext = createContext();

const initialState = {
    currentStep: 1,
    tentSize: { width: 4, depth: 4, height: 7, unit: 'ft' }, // Default 4x4x7
    mediaType: null, // 'soil', 'coco', 'hydro'
    selectedItems: {
        lighting: [],
        ventilation: [],
        environment: [],
        nutrients: [],
        monitoring: []
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
        cost += item.price || 0;
        power += item.watts || 0;
    });

    // CFM Calculation: Width * Depth * Height * 1.2 (exchange rate)
    // We need to ensure we use feet for calculation regardless of display unit
    // But for now, let's assume the tentSize is stored in feet or converted before storage
    // (The TentSelection component handles conversion to feet for storage)
    const { width, depth, height } = state.tentSize;
    const volume = width * depth * height;
    const cfmRequired = Math.ceil(volume * 1.2); // 1.2 exchanges per minute

    return { cost, power, cfmRequired };
}

function builderReducer(state, action) {
    switch (action.type) {
        case 'NEXT_STEP':
            return { ...state, currentStep: Math.min(state.currentStep + 1, 8) }; // Increased max step to 8
        case 'PREV_STEP':
            return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
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
                // Clear nutrients if media changes to avoid incompatibility
                selectedItems: {
                    ...state.selectedItems,
                    nutrients: []
                }
            };
        case 'ADD_ITEM': {
            const { category, item } = action.payload;
            const newItemsAdd = {
                ...state.selectedItems,
                [category]: [...state.selectedItems[category], item]
            };
            const newStateAdd = { ...state, selectedItems: newItemsAdd };
            return { ...newStateAdd, totals: calculateTotals(newStateAdd) };
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
