import { createContext, useContext, useReducer } from 'react';

const BuilderContext = createContext();

const initialState = {
    currentStep: 1,
    tentSize: { width: 4, depth: 4, height: 7, unit: 'ft' },
    mediaType: null,
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
