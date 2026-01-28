import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { BuilderState, BuilderAction, BuilderItem, BuilderCategory, TentSize, PresetConfig } from '../types';

// Initial state
const initialState: BuilderState = {
  currentStep: 0,
  tentSize: { width: 4, depth: 4, height: 7, unit: 'ft' },
  mediaType: null,
  selectedPreset: null,
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

// Calculate totals helper
function calculateTotals(state: BuilderState): BuilderState['totals'] {
  let cost = 0;
  let power = 0;

  Object.values(state.selectedItems).flat().forEach((item: BuilderItem) => {
    const qty = item.quantity || 1;
    cost += (item.price || 0) * qty;
    power += (item.watts || 0) * qty;
  });

  const { width, depth, height } = state.tentSize;
  const volume = width * depth * height;
  const cfmRequired = Math.ceil(volume * 1.2);

  return { cost, power, cfmRequired };
}

// Reducer function
function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
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

      let newItems: Record<BuilderCategory, BuilderItem[]>;
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
      const newItems: Record<BuilderCategory, BuilderItem[]> = {
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

      let newItems: Record<BuilderCategory, BuilderItem[]>;
      if (item && item.quantity <= 1) {
        newItems = {
          ...state.selectedItems,
          [category]: state.selectedItems[category].filter(i => i.id !== itemId)
        };
      } else {
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
      const newItemsRem: Record<BuilderCategory, BuilderItem[]> = {
        ...state.selectedItems,
        [category]: state.selectedItems[category].filter(i => i.id !== itemId)
      };
      const newStateRem = { ...state, selectedItems: newItemsRem };
      return { ...newStateRem, totals: calculateTotals(newStateRem) };
    }
    case 'UPDATE_ITEM_POSITIONS': {
      const { category, itemId, positions } = action.payload;
      const newItems: Record<BuilderCategory, BuilderItem[]> = {
        ...state.selectedItems,
        [category]: state.selectedItems[category].map(i =>
          i.id === itemId ? { ...i, positions } : i
        )
      };
      return { ...state, selectedItems: newItems };
    }
    case 'LOAD_PRESET': {
      const { preset, tentDims, items, mediaType } = action.payload;
      const newState: BuilderState = {
        ...state,
        selectedPreset: preset.id,
        tentSize: tentDims,
        mediaType: mediaType,
        selectedItems: items,
        currentStep: 1
      };
      return { ...newState, totals: calculateTotals(newState) };
    }
    case 'LOAD_BUILD': {
      const { tentSize, mediaType, selectedItems } = action.payload;
      const newState: BuilderState = {
        ...state,
        selectedPreset: null,
        tentSize: tentSize,
        mediaType: mediaType,
        selectedItems: selectedItems,
        currentStep: 8
      };
      return { ...newState, totals: calculateTotals(newState) };
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

// Context type
interface BuilderContextType {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  return (
    <BuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </BuilderContext.Provider>
  );
}

export { BuilderContext };
export function useBuilder(): BuilderContextType {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}

export default BuilderContext;
