import React, { useState, useRef, useEffect } from 'react';
import { generatePPFDMap, calculateMetrics } from '../../utils/lightingUtils';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useSettings } from '../../context/SettingsContext';
import PPFDInfoSection from './PPFDInfoSection';

// Mock Data for Lights
const AVAILABLE_LIGHTS = [
    { id: 'l1', name: 'Quantum Board 100W', maxPPFD: 800, recommendedHeight: 18, physicalWidth: 1, physicalDepth: 1, beamAngle: 120 },
    { id: 'l2', name: 'Bar Light 600W', maxPPFD: 1600, recommendedHeight: 24, physicalWidth: 3.5, physicalDepth: 3.5, beamAngle: 120 },
    { id: 'l3', name: 'COB LED 200W', maxPPFD: 1200, recommendedHeight: 20, physicalWidth: 1.5, physicalDepth: 1.5, beamAngle: 90 },
];

export default function PPFDHeatMapTool() {
    const { language } = useSettings();
    const [unit, setUnit] = useState('cm'); // 'ft' or 'cm'

    // Store dimensions in the CURRENT unit to avoid typing issues
    // Initialize with default metric values (150x150 cm)
    const [dimensions, setDimensions] = useState({ width: 150, depth: 150, height: 45 });

    const [activeLights, setActiveLights] = useState([]);
    const [metrics, setMetrics] = useState({ average: 0, min: 0, max: 0, uniformity: 0 });

    const containerRef = useRef(null);
    const heatmapCanvasRef = useRef(null);
    const [dragging, setDragging] = useState(null);

    // Handle Unit Switching
    const handleUnitChange = (newUnit) => {
        if (newUnit === unit) return;

        setDimensions(prev => {
            const factor = newUnit === 'cm' ? 30.48 : 1 / 30.48;
            return {
                width: parseFloat((prev.width * factor).toFixed(1)),
                depth: parseFloat((prev.depth * factor).toFixed(1)),
                height: parseFloat((prev.height * factor).toFixed(1))
            };
        });
        setUnit(newUnit);
    };

    const t = {
        en: {
            title: "Advanced PPFD Heat Map",
            subtitle: "Visualize light intensity and optimize your grow space",
            dimensions: `Room Dimensions (${unit})`,
            width: "Width",
            depth: "Depth",
            addLight: "Add Light Source",
            height: `Global Light Height (${unit})`,
            metrics: {
                avg: "Average PPFD",
                min: "Min PPFD",
                max: "Max PPFD",
                uni: "Uniformity"
            },
            legend: {
                low: "Low (<200)",
                seedling: "Seedling (200-400)",
                veg: "Veg (400-600)",
                flower: "Flower (600-900)",
                high: "High (900-1200)",
                extreme: "Extreme (>1200)"
            },
            instructions: "Drag lights to position. Double click to rotate.",
            unitToggle: "Unit System"
        },
        tr: {
            title: "Gelişmiş PPFD Isı Haritası",
            subtitle: "Işık yoğunluğunu görselleştirin ve alanınızı optimize edin",
            dimensions: `Oda Boyutları (${unit})`,
            width: "Genişlik",
            depth: "Derinlik",
            addLight: "Işık Kaynağı Ekle",
            height: `Genel Işık Yüksekliği (${unit})`,
            metrics: {
                avg: "Ortalama PPFD",
                min: "Min PPFD",
                max: "Maks PPFD",
                uni: "Üniformite"
            },
            legend: {
                low: "Düşük (<200)",
                seedling: "Fide (200-400)",
                veg: "Gelişim (400-600)",
                flower: "Çiçek (600-900)",
                high: "Yüksek (900-1200)",
                extreme: "Aşırı (>1200)"
            },
            instructions: "Işıkları sürükleyerek konumlandırın. Döndürmek için çift tıklayın.",
            unitToggle: "Birim Sistemi"
        }
    }[language];

    // Add a light to the canvas
    const addLight = (lightTemplate) => {
        const newLight = {
            ...lightTemplate,
            instanceId: Date.now(),
            positions: [{ x: 0.5, y: 0.5, rotation: 0 }]
        };
        setActiveLights([...activeLights, newLight]);
    };

    // Remove a light
    const removeLight = (instanceId) => {
        setActiveLights(activeLights.filter(l => l.instanceId !== instanceId));
    };

    // Update Heatmap
    useEffect(() => {
        if (!heatmapCanvasRef.current) return;

        // Convert current dimensions to feet for calculation
        const widthFt = unit === 'cm' ? dimensions.width / 30.48 : dimensions.width;
        const depthFt = unit === 'cm' ? dimensions.depth / 30.48 : dimensions.depth;
        const heightFt = unit === 'cm' ? dimensions.height / 30.48 : dimensions.height;

        // Validate
        if (!widthFt || widthFt <= 0 || !depthFt || depthFt <= 0) return;

        const canvas = heatmapCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const resolution = 4; // pixels per foot

        const map = generatePPFDMap(widthFt, depthFt, activeLights, resolution, heightFt);
        const newMetrics = calculateMetrics(map);
        setMetrics(newMetrics);

        const cols = map[0].length;
        const rows = map.length;

        canvas.width = cols;
        canvas.height = rows;

        const imgData = ctx.createImageData(cols, rows);
        const data = imgData.data;

        const thresholds = [400, 600, 900];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ppfd = map[r][c];
                const index = (r * cols + c) * 4;

                let red, green, blue, alpha;

                if (ppfd < 200) {
                    const t = ppfd / 200;
                    red = 30 + (50 * t); green = 30 + (50 * t); blue = 30 + (50 * t); alpha = 180;
                } else if (ppfd < 400) {
                    const t = (ppfd - 200) / 200;
                    red = 50 * t; green = 50 * t; blue = 150 + (105 * t); alpha = 180;
                } else if (ppfd < 600) {
                    const t = (ppfd - 400) / 200;
                    red = 50 * (1 - t); green = 150 + (105 * t); blue = 50 * (1 - t); alpha = 180;
                } else if (ppfd < 900) {
                    const t = (ppfd - 600) / 300;
                    red = 200 + (55 * t); green = 200 + (55 * (1 - t * 0.5)); blue = 0; alpha = 190;
                } else if (ppfd < 1200) {
                    const t = (ppfd - 900) / 300;
                    red = 255; green = 100 * (1 - t); blue = 0; alpha = 200;
                } else {
                    red = 255; green = 255; blue = 255; alpha = 220;
                }

                // Isolines
                let isContour = false;
                if (c < cols - 1) {
                    const rightPPFD = map[r][c + 1];
                    for (const th of thresholds) {
                        if ((ppfd < th && rightPPFD >= th) || (ppfd >= th && rightPPFD < th)) isContour = true;
                    }
                }
                if (!isContour && r < rows - 1) {
                    const bottomPPFD = map[r + 1][c];
                    for (const th of thresholds) {
                        if ((ppfd < th && bottomPPFD >= th) || (ppfd >= th && bottomPPFD < th)) isContour = true;
                    }
                }

                if (isContour) {
                    red = 255; green = 255; blue = 255; alpha = 255;
                }

                data[index] = red; data[index + 1] = green; data[index + 2] = blue; data[index + 3] = alpha;
            }
        }

        ctx.putImageData(imgData, 0, 0);

    }, [dimensions, activeLights, unit]);

    // Dragging Logic
    const handlePointerDown = (e, instanceId, currentX, currentY) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = containerRef.current.getBoundingClientRect();
        setDragging({
            instanceId,
            startX: e.clientX,
            startY: e.clientY,
            initialX: currentX,
            initialY: currentY,
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

        setActiveLights(prev => prev.map(l => {
            if (l.instanceId === dragging.instanceId) {
                return { ...l, positions: [{ ...l.positions[0], x: newX, y: newY }] };
            }
            return l;
        }));
    };

    const handlePointerUp = (e) => {
        if (dragging) {
            e.target.releasePointerCapture(e.pointerId);
            setDragging(null);
        }
    };

    const handleDoubleClick = (e, instanceId) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveLights(prev => prev.map(l => {
            if (l.instanceId === instanceId) {
                const currentRot = l.positions[0].rotation || 0;
                return { ...l, positions: [{ ...l.positions[0], rotation: currentRot === 0 ? 90 : 0 }] };
            }
            return l;
        }));
    };

    // Safe input handler
    const handleDimensionChange = (field, value) => {
        // Allow empty string for clearing input
        if (value === '') {
            setDimensions(prev => ({ ...prev, [field]: '' }));
            return;
        }
        const num = parseFloat(value);
        if (!isNaN(num)) {
            setDimensions(prev => ({ ...prev, [field]: num }));
        }
    };

    return (
        <div className="ppfd-tool-container">
            <Navbar />
            <div className="tool-main">
                <div className="tool-header">
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>

                <div className="tool-workspace">
                    {/* Controls Sidebar */}
                    <div className="controls-panel glass-panel">

                        <div className="control-group">
                            <h3>{t.unitToggle}</h3>
                            <div className="unit-toggle">
                                <button
                                    className={unit === 'ft' ? 'active' : ''}
                                    onClick={() => handleUnitChange('ft')}
                                >FT</button>
                                <button
                                    className={unit === 'cm' ? 'active' : ''}
                                    onClick={() => handleUnitChange('cm')}
                                >CM</button>
                            </div>
                        </div>

                        <div className="control-group">
                            <h3>{t.dimensions}</h3>
                            <div className="input-row">
                                <div className="input-wrap">
                                    <label>{t.width}</label>
                                    <input
                                        type="number"
                                        value={dimensions.width}
                                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                                        min="1"
                                    />
                                </div>
                                <div className="input-wrap">
                                    <label>{t.depth}</label>
                                    <input
                                        type="number"
                                        value={dimensions.depth}
                                        onChange={(e) => handleDimensionChange('depth', e.target.value)}
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="control-group">
                            <h3>{t.height}</h3>
                            <div className="slider-wrap">
                                <input
                                    type="range"
                                    min={unit === 'cm' ? 15 : 0.5}
                                    max={unit === 'cm' ? 150 : 5}
                                    step={unit === 'cm' ? 5 : 0.1}
                                    value={dimensions.height || 0}
                                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                                />
                                <span>{dimensions.height} {unit}</span>
                            </div>
                        </div>

                        <div className="control-group">
                            <h3>{t.addLight}</h3>
                            <div className="light-list">
                                {AVAILABLE_LIGHTS.map(light => (
                                    <button key={light.id} className="light-btn" onClick={() => addLight(light)}>
                                        <span className="light-icon">💡</span>
                                        <div className="light-info">
                                            <span className="light-name">{light.name}</span>
                                            <span className="light-specs">{light.maxPPFD} PPFD</span>
                                        </div>
                                        <span className="add-icon">+</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="canvas-area">
                        <div className="metrics-bar glass-panel">
                            <div className="metric">
                                <span className="metric-label">{t.metrics.avg}</span>
                                <span className="metric-value">{metrics.average}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">{t.metrics.min}</span>
                                <span className="metric-value">{metrics.min}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">{t.metrics.max}</span>
                                <span className="metric-value">{metrics.max}</span>
                            </div>
                            <div className="metric">
                                <span className="metric-label">{t.metrics.uni}</span>
                                <span className="metric-value">{metrics.uniformity}</span>
                            </div>
                        </div>

                        <div
                            className="canvas-wrapper"
                            ref={containerRef}
                            style={{ aspectRatio: `${(dimensions.width || 1) / (dimensions.depth || 1)}` }}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                        >
                            <canvas ref={heatmapCanvasRef} className="heatmap-canvas" />
                            <div className="grid-overlay" />

                            {activeLights.map((light) => {
                                const pos = light.positions[0];
                                // Calculate percentage based on current dimensions
                                // light.physicalWidth is in feet. 
                                // dimensions.width is in current unit.
                                // We need to convert light width to current unit OR dimensions to feet.
                                // Let's convert light width to current unit for percentage calc.
                                const lightW = unit === 'cm' ? light.physicalWidth * 30.48 : light.physicalWidth;
                                const lightD = unit === 'cm' ? light.physicalDepth * 30.48 : light.physicalDepth;

                                const widthPercent = (lightW / (dimensions.width || 1)) * 100;
                                const depthPercent = (lightD / (dimensions.depth || 1)) * 100;

                                return (
                                    <div
                                        key={light.instanceId}
                                        className="light-element"
                                        style={{
                                            left: `${pos.x * 100}%`,
                                            top: `${pos.y * 100}%`,
                                            width: `${widthPercent}%`,
                                            height: `${depthPercent}%`,
                                            transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`
                                        }}
                                        onPointerDown={(e) => handlePointerDown(e, light.instanceId, pos.x, pos.y)}
                                        onDoubleClick={(e) => handleDoubleClick(e, light.instanceId)}
                                    >
                                        <div className="light-body">
                                            <span className="remove-btn" onClick={(e) => {
                                                e.stopPropagation();
                                                removeLight(light.instanceId);
                                            }}>×</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="instructions">{t.instructions}</p>

                        <div className="legend glass-panel">
                            <div className="legend-item"><span className="dot" style={{ background: '#333' }}></span> {t.legend.low}</div>
                            <div className="legend-item"><span className="dot" style={{ background: 'blue' }}></span> {t.legend.seedling}</div>
                            <div className="legend-item"><span className="dot" style={{ background: 'green' }}></span> {t.legend.veg}</div>
                            <div className="legend-item"><span className="dot" style={{ background: 'orange' }}></span> {t.legend.flower}</div>
                            <div className="legend-item"><span className="dot" style={{ background: 'red' }}></span> {t.legend.high}</div>
                            <div className="legend-item"><span className="dot" style={{ background: 'white', border: '1px solid #555' }}></span> {t.legend.extreme}</div>
                        </div>
                    </div>
                </div>
                <PPFDInfoSection language={language} />
            </div>
            <Footer />

            <style>{`
                .ppfd-tool-container {
                    min-height: 100vh;
                    background: #0a0a0a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                }
                .tool-main {
                    flex: 1;
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                    padding: 2rem;
                }
                .tool-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .tool-header h1 {
                    font-size: 2.5rem;
                    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                }
                .tool-header p { color: #94a3b8; }

                .tool-workspace {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 2rem;
                    align-items: start;
                }

                .glass-panel {
                    background: rgba(30, 41, 59, 0.5);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.5rem;
                }

                .controls-panel {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .control-group h3 {
                    font-size: 1rem;
                    color: #10b981;
                    margin-bottom: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .unit-toggle {
                    display: flex;
                    background: rgba(0,0,0,0.3);
                    border-radius: 0.5rem;
                    padding: 0.25rem;
                }
                .unit-toggle button {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 0.5rem;
                    border-radius: 0.25rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .unit-toggle button.active {
                    background: #10b981;
                    color: white;
                }

                .input-row {
                    display: flex;
                    gap: 1rem;
                }
                .input-wrap {
                    flex: 1;
                }
                .input-wrap label {
                    display: block;
                    font-size: 0.8rem;
                    color: #94a3b8;
                    margin-bottom: 0.25rem;
                }
                .input-wrap input {
                    width: 100%;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                }

                .slider-wrap {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .slider-wrap input { flex: 1; }
                .slider-wrap span { font-family: monospace; color: #10b981; white-space: nowrap; }

                .light-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .light-btn {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                .light-btn:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: #10b981;
                }
                .light-info { flex: 1; }
                .light-name { display: block; font-weight: 600; font-size: 0.9rem; }
                .light-specs { display: block; font-size: 0.75rem; color: #94a3b8; }
                .add-icon { color: #10b981; font-weight: bold; }

                .canvas-area {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                }

                .metrics-bar {
                    display: flex;
                    justify-content: space-around;
                    width: 100%;
                    padding: 1rem;
                }
                .metric { text-align: center; }
                .metric-label { display: block; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.25rem; }
                .metric-value { font-size: 1.25rem; font-weight: 700; color: white; }

                .canvas-wrapper {
                    width: 100%;
                    max-width: 800px;
                    background: #111;
                    position: relative;
                    border-radius: 1rem;
                    overflow: hidden;
                    border: 2px solid rgba(255,255,255,0.1);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    touch-action: none;
                }

                .heatmap-canvas {
                    width: 100%;
                    height: 100%;
                    display: block;
                    opacity: 0.8;
                    image-rendering: pixelated;
                }

                .grid-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 20% 20%;
                    pointer-events: none;
                }

                .light-element {
                    position: absolute;
                    z-index: 10;
                    cursor: move;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .light-body {
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.15);
                    border: 2px solid white;
                    border-radius: 4px;
                    box-shadow: 0 0 15px rgba(255,255,255,0.3);
                    position: relative;
                }

                .remove-btn {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    width: 20px;
                    height: 20px;
                    background: red;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .light-element:hover .remove-btn { opacity: 1; }

                .instructions {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .legend {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                    justify-content: center;
                    margin-top: 1rem;
                }
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    color: #cbd5e1;
                }
                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }

                @media (max-width: 1024px) {
                    .tool-workspace {
                        grid-template-columns: 1fr;
                    }
                    .canvas-wrapper {
                        order: -1;
                    }
                }
            `}</style>
        </div>
    );
}
