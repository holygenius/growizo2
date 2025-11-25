import { useContext } from 'react';
import { BuilderContext } from '../context/BuilderContext';

/**
 * Custom hook for accessing tent builder state and actions
 * @returns {{state: Object, dispatch: Function, actions: Object}}
 */
export function useTent() {
    const context = useContext(BuilderContext);
    
    if (!context) {
        throw new Error('useTent must be used within a BuilderProvider');
    }
    
    const { state, dispatch } = context;
    
    // Helper actions
    const actions = {
        nextStep: () => dispatch({ type: 'NEXT_STEP' }),
        prevStep: () => dispatch({ type: 'PREV_STEP' }),
        setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
        setTentSize: (size) => dispatch({ type: 'SET_TENT_SIZE', payload: size }),
        setMediaType: (type) => dispatch({ type: 'SET_MEDIA_TYPE', payload: type }),
        addItem: (category, item) => dispatch({ type: 'ADD_ITEM', payload: { category, item } }),
        removeItem: (category, itemId) => dispatch({ type: 'REMOVE_ITEM', payload: { category, itemId } }),
        incrementItem: (category, itemId) => dispatch({ type: 'INCREMENT_ITEM', payload: { category, itemId } }),
        decrementItem: (category, itemId) => dispatch({ type: 'DECREMENT_ITEM', payload: { category, itemId } }),
        updateItemPositions: (category, itemId, positions) => 
            dispatch({ type: 'UPDATE_ITEM_POSITIONS', payload: { category, itemId, positions } }),
        reset: () => dispatch({ type: 'RESET' }),
    };
    
    return {
        state,
        dispatch,
        actions,
        // Convenient accessors
        currentStep: state.currentStep,
        tentSize: state.tentSize,
        mediaType: state.mediaType,
        selectedItems: state.selectedItems,
        totals: state.totals,
    };
}

export default useTent;
