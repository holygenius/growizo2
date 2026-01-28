import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
    generatePPFDMap, 
    calculateMetrics, 
    analyzePPFDMap,
    getPPFDColor,
    COLOR_SCALES,
    GROWTH_STAGES,
    calculateDLI
} from '../../utils/lightingUtils';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useSettings } from '../../context/SettingsContext';
import PPFDInfoSection from './PPFDInfoSection';
import PPFD3DScene from './PPFD3DScene';
import styles from './PPFDHeatMapTool.module.css';

// Counter for generating unique IDs
let lightIdCounter = 0;

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
    // Initialize with default metric values (200x200 cm)
    const [dimensions, setDimensions] = useState({ width: 200, depth: 200, height: 200 });

    const [activeLights, setActiveLights] = useState([
        {
            ...AVAILABLE_LIGHTS[0], // Quantum Board 100W
            instanceId: 'default_1',
            positions: [{ x: 0.5, y: 0.5, rotation: 0 }]
        },
        {
            ...AVAILABLE_LIGHTS[0],
            instanceId: 'default_2',
            positions: [{ x: 0.25, y: 0.25, rotation: 0 }]
        },
        {
            ...AVAILABLE_LIGHTS[0],
            instanceId: 'default_3',
            positions: [{ x: 0.75, y: 0.25, rotation: 0 }]
        },
        {
            ...AVAILABLE_LIGHTS[0],
            instanceId: 'default_4',
            positions: [{ x: 0.25, y: 0.75, rotation: 0 }]
        },
        {
            ...AVAILABLE_LIGHTS[0],
            instanceId: 'default_5',
            positions: [{ x: 0.75, y: 0.75, rotation: 0 }]
        }
    ]);

    const containerRef = useRef(null);
    const heatmapCanvasRef = useRef(null);
    const [dragging, setDragging] = useState(null);

    // 3D State
    const [is3D, setIs3D] = useState(true);
    
    // Input Mode: 'lights' or 'sensor'
    const [inputMode, setInputMode] = useState('lights');
    
    // Sensor Grid for manual input mode (4x4 default)
    const [sensorGrid, setSensorGrid] = useState(() => {
        const grid = [];
        for (let r = 0; r < 4; r++) {
            const row = [];
            for (let c = 0; c < 4; c++) {
                row.push(null);
            }
            grid.push(row);
        }
        return grid;
    });
    
    // Growth Stage
    const [growthStage, setGrowthStage] = useState('flower');
    
    // Color Scale
    const [colorScale, setColorScale] = useState('growers');
    
    // Photoperiod for DLI calculation
    const [photoperiod, setPhotoperiod] = useState(18);

    // Filter State
    const [activeFilters, setActiveFilters] = useState({
        low: true,
        seedling: true,
        veg: true,
        flower: true,
        high: true,
        extreme: true
    });

    const toggleFilter = (key) => {
        setActiveFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // 3D Display Options
    const [showGuideLines, setShowGuideLines] = useState(true);
    const [voxelOpacity, setVoxelOpacity] = useState(0.3);
    const [showDisplacement, setShowDisplacement] = useState(false);
    const [showVolumetric, setShowVolumetric] = useState(false);

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
            unitToggle: "Unit System",
            viewMode: "View Mode",
            view2D: "2D Editor",
            view3D: "3D Visualizer",
            rotation: "Rotation",
            filters: "PPFD Range Filters",
            showGuides: "Show Guide Lines",
            voxelTransparency: "Voxel Transparency"
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
            unitToggle: "Birim Sistemi",
            viewMode: "Görünüm Modu",
            view2D: "2D Düzenleyici",
            view3D: "3D Görselleştirici",
            rotation: "Döndürme",
            filters: "PPFD Aralık Filtreleri",
            showGuides: "Kılavuz Çizgilerini Göster",
            voxelTransparency: "Küplerin Şeffaflığı"
        }
    }[language];

    // Add a light to the canvas
    const addLight = useCallback((lightTemplate) => {
        lightIdCounter += 1;
        const newLight = {
            ...lightTemplate,
            instanceId: lightIdCounter,
            positions: [{ x: 0.5, y: 0.5, rotation: 0 }]
        };
        setActiveLights(prev => [...prev, newLight]);
    }, []);

    // Remove a light
    const removeLight = (instanceId) => {
        setActiveLights(activeLights.filter(l => l.instanceId !== instanceId));
    };

    // Compute PPFD map and metrics using useMemo to avoid cascading renders
    const { ppfdMap, metrics } = useMemo(() => {
        // Convert current dimensions to feet for calculation
        const widthFt = unit === 'cm' ? dimensions.width / 30.48 : dimensions.width;
        const depthFt = unit === 'cm' ? dimensions.depth / 30.48 : dimensions.depth;
        const heightFt = unit === 'cm' ? dimensions.height / 30.48 : dimensions.height;

        // Validate
        if (!widthFt || widthFt <= 0 || !depthFt || depthFt <= 0) {
            return { ppfdMap: [], metrics: { average: 0, min: 0, max: 0, uniformity: 0 } };
        }

        const resolution = 4; // pixels per foot
        const map = generatePPFDMap(widthFt, depthFt, activeLights, resolution, heightFt);
        const computedMetrics = calculateMetrics(map);
        return { ppfdMap: map, metrics: computedMetrics };
    }, [dimensions, activeLights, unit]);

    // Render Heatmap to Canvas (side effect only)
    useEffect(() => {
        // Only draw to canvas if ref exists (2D mode)
        if (!heatmapCanvasRef.current || ppfdMap.length === 0 || !ppfdMap[0]) return;

        const canvas = heatmapCanvasRef.current;
        const ctx = canvas.getContext('2d');

        const cols = ppfdMap[0].length;
        const rows = ppfdMap.length;

        canvas.width = cols;
        canvas.height = rows;

        const imgData = ctx.createImageData(cols, rows);
        const data = imgData.data;

        const thresholds = [400, 600, 900];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const ppfd = ppfdMap[r][c];
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
                    const rightPPFD = ppfdMap[r][c + 1];
                    for (const th of thresholds) {
                        if ((ppfd < th && rightPPFD >= th) || (ppfd >= th && rightPPFD < th)) isContour = true;
                    }
                }
                if (!isContour && r < rows - 1) {
                    const bottomPPFD = ppfdMap[r + 1][c];
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

    }, [ppfdMap, is3D]); // Re-run when switching to 2D to ensure canvas draws

    // Dragging Logic
    const handlePointerDown = (e, instanceId, currentX, currentY) => {
        if (is3D) return;
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
        if (is3D) return;
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
        <div className={styles.ppfdToolContainer}>
            <Helmet>
                <title>{t.title} | GroWizard</title>
            </Helmet>
            <Navbar />
            <div className={styles.toolMain}>
                <div className={styles.toolHeader}>
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>

                <div className={styles.toolWorkspace}>
                    {/* Controls Sidebar */}
                    <div className={`${styles.controlsPanel} ${styles.glassPanel}`}>

                        <div className={styles.controlGroup}>
                            <h3>Input Mode</h3>
                            <div className={styles.unitToggle}>
                                <button
                                    className={inputMode === 'lights' ? styles.activeButton : ''}
                                    onClick={() => setInputMode('lights')}
                                >Lights</button>
                                <button
                                    className={inputMode === 'sensor' ? styles.activeButton : ''}
                                    onClick={() => setInputMode('sensor')}
                                >Sensor Grid</button>
                            </div>
                        </div>

                        <div className={styles.controlGroup}>
                            <h3>Growth Stage</h3>
                            <select 
                                value={growthStage}
                                onChange={(e) => setGrowthStage(e.target.value)}
                                className={styles.selectInput}
                            >
                                {Object.entries(GROWTH_STAGES).map(([key, stage]) => (
                                    <option key={key} value={key}>
                                        {stage.name} ({stage.minPPFD}-{stage.maxPPFD})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.controlGroup}>
                            <h3>Color Scale</h3>
                            <select 
                                value={colorScale}
                                onChange={(e) => setColorScale(e.target.value)}
                                className={styles.selectInput}
                            >
                                {Object.entries(COLOR_SCALES).map(([key, scale]) => (
                                    <option key={key} value={key}>{scale.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.controlGroup}>
                            <h3>{t.viewMode}</h3>
                            <div className={styles.unitToggle}>
                                <button
                                    className={!is3D ? styles.activeButton : ''}
                                    onClick={() => setIs3D(false)}
                                >{t.view2D}</button>
                                <button
                                    className={is3D ? styles.activeButton : ''}
                                    onClick={() => setIs3D(true)}
                                >{t.view3D}</button>
                            </div>
                        </div>

                        {is3D && (
                            <div className={styles.controlGroup}>
                                <h3>3D Visualization</h3>
                                <label className={styles.filterItem}>
                                    <input
                                        type="checkbox"
                                        checked={showDisplacement}
                                        onChange={(e) => setShowDisplacement(e.target.checked)}
                                    />
                                    <span className={styles.checkbox}></span>
                                    <span>Displacement Map</span>
                                </label>
                                <label className={styles.filterItem}>
                                    <input
                                        type="checkbox"
                                        checked={showVolumetric}
                                        onChange={(e) => setShowVolumetric(e.target.checked)}
                                    />
                                    <span className={styles.checkbox}></span>
                                    <span>Volumetric Beams</span>
                                </label>
                            </div>
                        )}

                        {is3D && (
                            <div className={styles.controlGroup}>
                                <h3>{t.filters}</h3>
                                <div className={styles.filterList}>
                                    {Object.entries(t.legend).map(([key, label]) => (
                                        <label key={key} className={styles.filterItem}>
                                            <input
                                                type="checkbox"
                                                checked={activeFilters[key]}
                                                onChange={() => toggleFilter(key)}
                                            />
                                            <span className={styles.checkbox}></span>
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {is3D && (
                            <div className={styles.controlGroup}>
                                <h3>{t.showGuides}</h3>
                                <label className={styles.filterItem}>
                                    <input
                                        type="checkbox"
                                        checked={showGuideLines}
                                        onChange={(e) => setShowGuideLines(e.target.checked)}
                                    />
                                    <span className={styles.checkbox}></span>
                                    <span>{t.showGuides}</span>
                                </label>
                            </div>
                        )}

                        {is3D && (
                            <div className={styles.controlGroup}>
                                <h3>{t.voxelTransparency}</h3>
                                <div className={styles.sliderWrap}>
                                    <input
                                        type="range"
                                        min="0.05"
                                        max="0.8"
                                        step="0.05"
                                        value={voxelOpacity}
                                        onChange={(e) => setVoxelOpacity(parseFloat(e.target.value))}
                                    />
                                    <span>{voxelOpacity.toFixed(2)}</span>
                                </div>
                            </div>
                        )}


                        <div className={styles.controlGroup}>
                            <h3>{t.unitToggle}</h3>
                            <div className={styles.unitToggle}>
                                <button
                                    className={unit === 'ft' ? styles.activeButton : ''}
                                    onClick={() => handleUnitChange('ft')}
                                >FT</button>
                                <button
                                    className={unit === 'cm' ? styles.activeButton : ''}
                                    onClick={() => handleUnitChange('cm')}
                                >CM</button>
                            </div>
                        </div>

                        <div className={styles.controlGroup}>
                            <h3>{t.dimensions}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputWrap}>
                                    <label>{t.width}</label>
                                    <input
                                        type="number"
                                        value={dimensions.width}
                                        onChange={(e) => handleDimensionChange('width', e.target.value)}
                                        min="1"
                                    />
                                </div>
                                <div className={styles.inputWrap}>
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

                        <div className={styles.controlGroup}>
                            <h3>{t.height}</h3>
                            <div className={styles.sliderWrap}>
                                <input
                                    type="range"
                                    min={unit === 'cm' ? 15 : 0.5}
                                    max={unit === 'cm' ? 500 : 16.5}
                                    step={unit === 'cm' ? 5 : 0.1}
                                    value={dimensions.height || 0}
                                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                                />
                                <span>{dimensions.height} {unit}</span>
                            </div>
                        </div>

                        <div className={styles.controlGroup}>
                            <h3>{t.addLight}</h3>
                            <div className={styles.lightList}>
                                {AVAILABLE_LIGHTS.map(light => (
                                    <button key={light.id} className={styles.lightBtn} onClick={() => addLight(light)}>
                                        <span>💡</span>
                                        <div className={styles.lightInfo}>
                                            <span className={styles.lightName}>{light.name}</span>
                                            <span className={styles.lightSpecs}>{light.maxPPFD} PPFD</span>
                                        </div>
                                        <span className={styles.addIcon}>+</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className={styles.canvasArea}>
                        <div className={`${styles.metricsBar} ${styles.glassPanel}`}>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>{t.metrics.avg}</span>
                                <span className={styles.metricValue}>{metrics.average}</span>
                            </div>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>{t.metrics.min}</span>
                                <span className={styles.metricValue}>{metrics.min}</span>
                            </div>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>{t.metrics.max}</span>
                                <span className={styles.metricValue}>{metrics.max}</span>
                            </div>
                            <div className={styles.metric}>
                                <span className={styles.metricLabel}>{t.metrics.uni}</span>
                                <span className={styles.metricValue}>{metrics.uniformity}</span>
                            </div>
                        </div>

                        <div className={styles.sceneContainer}>
                            {is3D ? (
                                <div className={styles.sceneWrapper3d}>
                                    <PPFD3DScene
                                        dimensions={dimensions}
                                        activeLights={activeLights}
                                        unit={unit}
                                        activeFilters={activeFilters}
                                        showGuideLines={showGuideLines}
                                        voxelOpacity={voxelOpacity}
                                        showDisplacement={showDisplacement}
                                        showVolumetric={showVolumetric}
                                    />
                                </div>
                            ) : (
                                <div
                                    className={styles.canvasWrapper}
                                    ref={containerRef}
                                    style={{
                                        aspectRatio: `${(dimensions.width || 1) / (dimensions.depth || 1)}`
                                    }}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    onPointerLeave={handlePointerUp}
                                >
                                    <canvas ref={heatmapCanvasRef} className={styles.heatmapCanvas} />
                                    <div className={styles.gridOverlay} />

                                    <div className={styles.lightsLayer}>
                                        {activeLights.map((light) => {
                                            const pos = light.positions[0];
                                            const lightW = unit === 'cm' ? light.physicalWidth * 30.48 : light.physicalWidth;
                                            const lightD = unit === 'cm' ? light.physicalDepth * 30.48 : light.physicalDepth;

                                            const widthPercent = (lightW / (dimensions.width || 1)) * 100;
                                            const depthPercent = (lightD / (dimensions.depth || 1)) * 100;

                                            return (
                                                <div
                                                    key={light.instanceId}
                                                    className={styles.lightElement}
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
                                                    <div className={styles.lightBody}>
                                                        <span className={styles.removeBtn} onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeLight(light.instanceId);
                                                        }}>×</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <p className={styles.instructions}>{t.instructions}</p>

                        <div className={`${styles.legend} ${styles.glassPanel}`}>
                            <div className={styles.legendItem}><span className={styles.dot} style={{ background: '#333' }}></span> {t.legend.low}</div>
                            <div className={styles.legendItem}><span className={styles.dot} style={{ background: 'blue' }}></span> {t.legend.seedling}</div>
                            <div className={styles.legendItem}><span className={styles.dot} style={{ background: 'green' }}></span> {t.legend.veg}</div>
                            <div className={styles.legendItem}><span className={styles.dot} style={{ background: 'orange' }}></span> {t.legend.flower}</div>
                            <div className={styles.legendItem}><span className={styles.dot} style={{ background: 'red' }}></span> {t.legend.high}</div>
                            <div className={styles.legendItem}><span className={styles.dot} style={{ background: 'white', border: '1px solid #555' }}></span> {t.legend.extreme}</div>
                        </div>
                    </div>
                </div>
                <PPFDInfoSection language={language} />
            </div>
            <Footer />
        </div>
    );
}
