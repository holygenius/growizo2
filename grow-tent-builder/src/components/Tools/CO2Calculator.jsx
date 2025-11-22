import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CO2Calculator = () => {
    const { language } = useSettings();
    const [width, setWidth] = useState(120);
    const [length, setLength] = useState(120);
    const [height, setHeight] = useState(200);
    const [targetPPM, setTargetPPM] = useState(1200);

    // Volume in cubic meters
    const volumeM3 = (width * length * height) / 1000000;
    // Volume in cubic feet
    const volumeFt3 = volumeM3 * 35.3147;

    // Simple estimation: 0.001 cubic feet of CO2 raises 1 cubic foot of air by 1000ppm
    // Required CO2 in cubic feet to reach target from ambient (approx 400ppm)
    const ambientPPM = 400;
    const requiredPPM = Math.max(0, targetPPM - ambientPPM);
    const requiredCO2Ft3 = (volumeFt3 * requiredPPM) / 1000000;

    // Flow rate estimation (very rough, usually for 15 mins)
    // If we want to fill it in 15 mins:
    const flowRate = requiredCO2Ft3 / 15; // CFM (Cubic Feet per Minute)

    const t = {
        en: {
            title: "CO2 Calculator",
            subtitle: "Estimate CO2 requirements for your grow space",
            dims: "Tent Dimensions (cm)",
            target: "Target PPM",
            volume: "Room Volume",
            required: "Required CO2 Amount",
            flow: "Flow Rate (for 15 min fill)",
            desc: "Calculate how much CO2 you need to reach optimal levels for accelerated growth."
        },
        tr: {
            title: "CO2 Hesaplayıcı",
            subtitle: "Yetiştirme alanınız için CO2 gereksinimlerini tahmin edin",
            dims: "Çadır Boyutları (cm)",
            target: "Hedef PPM",
            volume: "Oda Hacmi",
            required: "Gerekli CO2 Miktarı",
            flow: "Akış Hızı (15 dk dolum için)",
            desc: "Hızlandırılmış büyüme için optimal seviyelere ulaşmak adına ne kadar CO2'ye ihtiyacınız olduğunu hesaplayın."
        }
    }[language];

    return (
        <div className="page-container">
            <Navbar />
            <div className="tool-content">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="tool-icon">🌫️</div>
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>

                    <div className="calculator-form">
                        <div className="dims-grid">
                            <div className="input-group">
                                <label>W (cm)</label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="input-group">
                                <label>L (cm)</label>
                                <input
                                    type="number"
                                    value={length}
                                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="input-group">
                                <label>H (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>{t.target}</label>
                            <input
                                type="number"
                                value={targetPPM}
                                step="100"
                                onChange={(e) => setTargetPPM(parseFloat(e.target.value) || 0)}
                            />
                            <input
                                type="range"
                                min="400"
                                max="2000"
                                step="50"
                                value={targetPPM}
                                onChange={(e) => setTargetPPM(parseFloat(e.target.value))}
                                className="range-slider"
                            />
                        </div>

                        <div className="results-grid">
                            <div className="result-item">
                                <span className="label">{t.volume}</span>
                                <span className="value">{volumeM3.toFixed(2)} m³</span>
                                <span className="sub-value">({volumeFt3.toFixed(2)} ft³)</span>
                            </div>
                            <div className="result-item highlight">
                                <span className="label">{t.required}</span>
                                <span className="value">{requiredCO2Ft3.toFixed(4)} ft³</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            <style>{`
                .page-container {
                    min-height: 100vh;
                    background: #0a0a0a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                }

                .tool-content {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                }

                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    padding: 3rem;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }

                .tool-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .tool-icon {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
                }

                .tool-header h1 {
                    font-size: 1.75rem;
                    margin-bottom: 0.5rem;
                    color: white;
                }

                .tool-header p {
                    color: #94a3b8;
                }

                .calculator-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .dims-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .input-group label {
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .input-group input[type="number"] {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 1.125rem;
                    width: 100%;
                }

                .range-slider {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    appearance: none;
                }

                .range-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #94a3b8;
                    border-radius: 50%;
                    cursor: pointer;
                }

                .results-grid {
                    display: grid;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .result-item {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1rem;
                    border-radius: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .result-item.highlight {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                }

                .result-item .label {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    margin-bottom: 0.25rem;
                }

                .result-item .value {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                }

                .result-item .sub-value {
                    font-size: 0.875rem;
                    color: #64748b;
                }
            `}</style>
        </div>
    );
};

export default CO2Calculator;
