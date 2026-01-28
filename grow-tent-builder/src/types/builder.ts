// Builder State Types

export interface TentSize {
  width: number;
  depth: number;
  height: number;
  unit: 'ft' | 'm';
}

export interface BuilderItem {
  id: string;
  name: string;
  price: number;
  watts?: number;
  quantity: number;
  category: BuilderCategory;
  image?: string;
  description?: string;
  brand?: string;
  positions?: number[][];
}

export type BuilderCategory = 
  | 'tent'
  | 'lighting'
  | 'ventilation'
  | 'environment'
  | 'nutrients'
  | 'monitoring'
  | 'substrates'
  | 'accessories';

export interface BuilderTotals {
  cost: number;
  power: number;
  cfmRequired: number;
}

export interface BuilderState {
  currentStep: number;
  tentSize: TentSize;
  mediaType: string | null;
  selectedPreset: string | null;
  selectedItems: Record<BuilderCategory, BuilderItem[]>;
  totals: BuilderTotals;
}

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  tentDims: TentSize;
  mediaType: string;
  items: Record<BuilderCategory, BuilderItem[]>;
}

// Builder Actions
export type BuilderAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_TENT_SIZE'; payload: TentSize }
  | { type: 'SET_MEDIA_TYPE'; payload: string }
  | { type: 'ADD_ITEM'; payload: { category: BuilderCategory; item: BuilderItem } }
  | { type: 'INCREMENT_ITEM'; payload: { category: BuilderCategory; itemId: string } }
  | { type: 'DECREMENT_ITEM'; payload: { category: BuilderCategory; itemId: string } }
  | { type: 'REMOVE_ITEM'; payload: { category: BuilderCategory; itemId: string } }
  | { type: 'UPDATE_ITEM_POSITIONS'; payload: { category: BuilderCategory; itemId: string; positions: number[][] } }
  | { type: 'LOAD_PRESET'; payload: { preset: PresetConfig; tentDims: TentSize; items: Record<BuilderCategory, BuilderItem[]>; mediaType: string } }
  | { type: 'LOAD_BUILD'; payload: { tentSize: TentSize; mediaType: string | null; selectedItems: Record<BuilderCategory, BuilderItem[]> } }
  | { type: 'CLEAR_PRESET' }
  | { type: 'RESET' };
