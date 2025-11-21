import { useState, useRef, useEffect, useMemo } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { generatePPFDMap, calculateMetrics } from '../utils/lightingUtils';
import PPFDGuide from './PPFDGuide';

export default function LightPlacementCanvas() {
    const { state, dispatch } = useBuilder();
    const { t, formatUnit, getUnitLabel } = useSettings();
    const { tentSize, selectedItems } = state;
    const lights = selectedItems.lighting;

    const containerRef = useRef(null);
    const heatmapCanvasRef = useRef(null);
    const [dragging, setDragging] = useState(null); // { id, index, startX, startY, initialLeft, initialTop }
    const [metrics, setMetrics] = useState({ average: 0, min: 0, max: 0, uniformity: 0 });
    const [lightHeight, setLightHeight] = useState(1.5); // Default global height in feet

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

    // Calculate Heatmap and Metrics
    useEffect(() => {
        if (!heatmapCanvasRef.current) return;

        const canvas = heatmapCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width, depth } = tentSize;

        // Resolution: pixels per foot for the heatmap calculation
        // Higher = smoother but slower. 4 is good (3 inch cells).
        const resolution = 4;

        // Generate PPFD Map
        const map = generatePPFDMap(width, depth, lights, resolution, lightHeight);
        const newMetrics = calculateMetrics(map);
        setMetrics(newMetrics);

        // Render Heatmap to Canvas
        const cols = map[0].length;
        const rows = map.length;

        // Resize canvas to match grid resolution
        canvas.width = cols;
        canvas.height = rows;

        const imgData = ctx.createImageData(cols, rows);
        const data = imgData.data;

        // Thresholds for isolines
        const thresholds = [400, 600, 900];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ppfd = map[r][c];
                const index = (r * cols + c) * 4;

                // Semantic Color Mapping
                let red, green, blue, alpha;

                if (ppfd < 200) {
                    // 0-200: Gray/Black (Insufficient)
                    const t = ppfd / 200;
                    red = 30 + (50 * t);
                    green = 30 + (50 * t);
                    blue = 30 + (50 * t);
                    alpha = 180;
                } else if (ppfd < 400) {
                    // 200-400: Blue/Purple (Clones/Seedlings)
                    const t = (ppfd - 200) / 200;
                    red = 50 * t;
                    green = 50 * t;
                    blue = 150 + (105 * t);
                    alpha = 180;
                } else if (ppfd < 600) {
                    // 400-600: Green (Veg)
                    const t = (ppfd - 400) / 200;
                    red = 50 * (1 - t);
                    green = 150 + (105 * t);
                    blue = 50 * (1 - t);
                    alpha = 180;
                } else if (ppfd < 900) {
                    // 600-900: Yellow/Orange (Flower)
                    const t = (ppfd - 600) / 300;
                    red = 200 + (55 * t);
                    green = 200 + (55 * (1 - t * 0.5)); // Fade green slightly to orange
                    blue = 0;
                    alpha = 190;
                } else if (ppfd < 1200) {
                    // 900-1200: Red/Dark Orange (High Intensity)
                    const t = (ppfd - 900) / 300;
                    red = 255;
                    green = 100 * (1 - t);
                    blue = 0;
                    alpha = 200;
                } else {
                    // > 1200: White (Bleaching)
                    red = 255;
                    green = 255;
                    blue = 255;
                    alpha = 220;
                }

                // Isoline Detection (Simple Edge)
                // Check right and bottom neighbors to see if we cross a threshold
                let isContour = false;
                if (c < cols - 1) {
                    const rightPPFD = map[r][c + 1];
                    for (const th of thresholds) {
                        if ((ppfd < th && rightPPFD >= th) || (ppfd >= th && rightPPFD < th)) {
                            isContour = true;
                            break;
                        }
                    }
                }
                if (!isContour && r < rows - 1) {
                    const bottomPPFD = map[r + 1][c];
                    for (const th of thresholds) {
                        if ((ppfd < th && bottomPPFD >= th) || (ppfd >= th && bottomPPFD < th)) {
                            isContour = true;
                            break;
                        }
                    }
                }

                if (isContour) {
                    red = 255;
                    green = 255;
                    blue = 255;
                    alpha = 255; // Solid white line
                }

                data[index] = red;
                data[index + 1] = green;
                data[index + 2] = blue;
                data[index + 3] = alpha;
            }
        }

        ctx.putImageData(imgData, 0, 0);

    }, [lights, tentSize, lightHeight]);

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

        const light = lights.find(l => l.id === dragging.id);
        if (light) {
            const newPositions = [...(light.positions || [])];
            // Preserve existing rotation or default to 0
            const currentRotation = newPositions[dragging.index].rotation || 0;
            newPositions[dragging.index] = { x: newX, y: newY, rotation: currentRotation };

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

    const handleDoubleClick = (e, lightId, index) => {
        e.preventDefault();
        e.stopPropagation();

        const light = lights.find(l => l.id === lightId);
        if (light) {
            const newPositions = [...(light.positions || [])];
            const currentRotation = newPositions[index].rotation || 0;
            const newRotation = currentRotation === 0 ? 90 : 0;

            // Keep position, update rotation
            newPositions[index] = { ...newPositions[index], rotation: newRotation };

            dispatch({
                type: 'UPDATE_ITEM_POSITIONS',
                payload: { category: 'lighting', itemId: lightId, positions: newPositions }
            });
        }
    };

    // Calculate aspect ratio for the container
    const aspectRatio = tentSize.width / tentSize.depth;

    return (
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{t('lightPlacementTitle')}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Height:</label>
                    <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={lightHeight}
                        onChange={(e) => setLightHeight(parseFloat(e.target.value))}
                        style={{ width: '100px' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', minWidth: '3rem' }}>
                        {formatUnit(lightHeight, 'length')} {getUnitLabel('length')}
                    </span>
                </div>
            </div>

            <p style={{ marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {t('dragTip')}
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                marginBottom: '1rem',
                background: 'var(--bg-surface)',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)'
            }}>
                <MetricBox label={t('avgPPFD')} value={metrics.average} unit="µmol" />
                <MetricBox label={t('minPPFD')} value={metrics.min} unit="µmol" />
                <MetricBox label={t('maxPPFD')} value={metrics.max} unit="µmol" />
                <MetricBox label={t('uniformity')} value={metrics.uniformity} unit="" />
            </div>

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
                {/* Heatmap Canvas */}
                <canvas
                    ref={heatmapCanvasRef}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.6,
                        imageRendering: 'pixelated' // Keep it sharp or smooth? Smooth is better for heatmap look usually, but pixelated shows the grid.
                    }}
                />

                {/* Grid Lines Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
                    backgroundSize: '20% 20%',
                    opacity: 0.2,
                    pointerEvents: 'none'
                }} />

                {/* Lights */}
                {lights.map(light => {
                    const quantity = light.quantity || 1;
                    const positions = light.positions || Array(quantity).fill({ x: 0.5, y: 0.5 });

                    return positions.map((pos, idx) => {
                        const physW = light.physicalWidth || 1;
                        const physD = light.physicalDepth || 1;
                        const widthPercent = (physW / tentSize.width) * 100;
                        const depthPercent = (physD / tentSize.depth) * 100;

                        const rotation = pos.rotation || 0;

                        return (
                            <div
                                key={`${light.id}-${idx}`}
                                style={{
                                    position: 'absolute',
                                    left: `${pos.x * 100}%`,
                                    top: `${pos.y * 100}%`,
                                    width: `${widthPercent}%`,
                                    height: `${depthPercent}%`,
                                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10,
                                    transition: 'transform 0.2s ease'
                                }}
                            >
                                {/* Physical Light Body */}
                                <div
                                    onPointerDown={(e) => handlePointerDown(e, light.id, idx, pos.x, pos.y)}
                                    onDoubleClick={(e) => handleDoubleClick(e, light.id, idx)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '2px solid #fff',
                                        borderRadius: '2px',
                                        cursor: 'move',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(2px)'
                                    }}
                                >
                                    <span style={{ fontSize: '0.6rem', color: '#fff', pointerEvents: 'none', textShadow: '0 1px 2px black', transform: `rotate(-${rotation}deg)` }}>
                                        {light.name.split(' ')[0]}
                                    </span>
                                </div>
                            </div>
                        );
                    });
                })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {formatUnit(tentSize.width)} x {formatUnit(tentSize.depth)} {getUnitLabel('length')} {t('tentFloor')}
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginTop: '1rem',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                maxWidth: '600px',
                marginInline: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 10, height: 10, background: '#555' }}></span> &lt;200 ({t('low')})</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 10, height: 10, background: 'blue' }}></span> 200-400 ({t('seedling')})</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 10, height: 10, background: 'green' }}></span> 400-600 ({t('veg')})</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 10, height: 10, background: 'orange' }}></span> 600-900 ({t('flower')})</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 10, height: 10, background: 'red' }}></span> 900-1200 ({t('high')})</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 10, height: 10, background: 'white', border: '1px solid #555' }}></span> &gt;1200 ({t('high')})</div>
            </div>

            <PPFDGuide />
        </div>
    );
}

function MetricBox({ label, value, unit }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {value} <span style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>{unit}</span>
            </div>
        </div>
    );
}
