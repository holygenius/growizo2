import { useState, useRef, useEffect } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';

export default function LightPlacementCanvas() {
    const { state, dispatch } = useBuilder();
    const { formatUnit, getUnitLabel } = useSettings();
    const { tentSize, selectedItems } = state;
    const lights = selectedItems.lighting;

    const containerRef = useRef(null);
    const [dragging, setDragging] = useState(null); // { id, index, startX, startY, initialLeft, initialTop }

    // Initialize positions if not present
    useEffect(() => {
        lights.forEach(light => {
            const quantity = light.quantity || 1;
            // If positions array doesn't match quantity, re-initialize
            if (!light.positions || light.positions.length !== quantity) {
                const newPositions = Array(quantity).fill(0).map((_, i) => ({
                    x: 0.5 + (Math.random() * 0.2 - 0.1), // Center-ish random
                    y: 0.5 + (Math.random() * 0.2 - 0.1)
                }));
                dispatch({
                    type: 'UPDATE_ITEM_POSITIONS',
                    payload: { category: 'lighting', itemId: light.id, positions: newPositions }
                });
            }
        });
    }, [lights, dispatch]);

    const handlePointerDown = (e, lightId, index, currentX, currentY) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = containerRef.current.getBoundingClientRect();
        setDragging({
            id: lightId,
            index: index,
            startX: e.clientX,
            startY: e.clientY,
            initialX: currentX, // normalized 0-1
            initialY: currentY, // normalized 0-1
            rect
        });
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!dragging) return;

        const deltaX = (e.clientX - dragging.startX) / dragging.rect.width;
        const deltaY = (e.clientY - dragging.startY) / dragging.rect.height;

        let newX = Math.max(0, Math.min(1, dragging.initialX + deltaX));
        let newY = Math.max(0, Math.min(1, dragging.initialY + deltaY));

        // Update local state or dispatch immediately? Dispatching might be slow for 60fps
        // For now, let's dispatch. If slow, we can use local state and dispatch on up.
        // Actually, let's update a local "preview" state if we wanted optimization, 
        // but for this app, direct dispatch is likely fine or we can debounce.
        // Better: update the specific light's positions in the context.

        const light = lights.find(l => l.id === dragging.id);
        if (light) {
            const newPositions = [...(light.positions || [])];
            newPositions[dragging.index] = { x: newX, y: newY };

            dispatch({
                type: 'UPDATE_ITEM_POSITIONS',
                payload: { category: 'lighting', itemId: dragging.id, positions: newPositions }
            });
        }
    };

    const handlePointerUp = (e) => {
        if (dragging) {
            e.target.releasePointerCapture(e.pointerId);
            setDragging(null);
        }
    };

    // Calculate aspect ratio for the container
    const aspectRatio = tentSize.width / tentSize.depth;

    return (
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Light Placement</h3>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Drag lights to position them. The glow represents coverage area.
            </p>

            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    aspectRatio: `${aspectRatio}`,
                    background: '#1a1a1a',
                    position: 'relative',
                    margin: '0 auto',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    touchAction: 'none'
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {/* Grid Lines */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
                    backgroundSize: '20% 20%',
                    opacity: 0.1,
                    pointerEvents: 'none'
                }} />

                {/* Lights */}
                {lights.map(light => {
                    const quantity = light.quantity || 1;
                    const positions = light.positions || Array(quantity).fill({ x: 0.5, y: 0.5 });

                    return positions.map((pos, idx) => {
                        // Default to 1ft x 1ft if dimensions are missing (e.g. stale state)
                        const physW = light.physicalWidth || 1;
                        const physD = light.physicalDepth || 1;

                        // Calculate relative size of light vs tent
                        const widthPercent = (physW / tentSize.width) * 100;
                        const depthPercent = (physD / tentSize.depth) * 100;

                        // Coverage radius (approximate for visualization)
                        // coverage is area in sq ft. radius = sqrt(area/PI)
                        const coverageRadiusFt = Math.sqrt(light.coverage / Math.PI);
                        const coverageDiameterFt = coverageRadiusFt * 2;

                        // Calculate glow size relative to the light body size
                        // We want the glow to be coverageDiameterFt / physW * 100 percent of the light width
                        const glowWidthPercent = (coverageDiameterFt / physW) * 100;
                        const glowHeightPercent = (coverageDiameterFt / physD) * 100;

                        return (
                            <div
                                key={`${light.id}-${idx}`}
                                style={{
                                    position: 'absolute',
                                    left: `${pos.x * 100}%`,
                                    top: `${pos.y * 100}%`,
                                    width: `${widthPercent}%`,
                                    height: `${depthPercent}%`,
                                    transform: 'translate(-50%, -50%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10
                                }}
                            >
                                {/* Coverage Glow */}
                                <div style={{
                                    position: 'absolute',
                                    width: `${glowWidthPercent}%`,
                                    height: `${glowHeightPercent}%`,
                                    background: 'radial-gradient(circle, rgba(255, 255, 0, 0.3) 0%, rgba(255, 255, 0, 0.1) 60%, transparent 100%)',
                                    borderRadius: '50%',
                                    pointerEvents: 'none',
                                    zIndex: -1,
                                    transform: 'translate(0, 0)' // Already centered in flex parent
                                }} />

                                {/* Physical Light Body */}
                                <div
                                    onPointerDown={(e) => handlePointerDown(e, light.id, idx, pos.x, pos.y)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'var(--bg-surface)',
                                        border: '2px solid var(--color-primary)',
                                        borderRadius: '4px',
                                        cursor: 'move',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                        zIndex: 2
                                    }}
                                >
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-primary)', pointerEvents: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '2px' }}>
                                        {light.name.split(' ')[0]}
                                    </span>
                                </div>
                            </div>
                        );
                    });
                })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {formatUnit(tentSize.width)} x {formatUnit(tentSize.depth)} {getUnitLabel('length')} Tent Floor
            </div>
        </div>
    );
}
