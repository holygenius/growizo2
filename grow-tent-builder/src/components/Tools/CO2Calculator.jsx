import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CO2Calculator = () => {
    const { t } = useSettings();
    const [width, setWidth] = useState(120);
    const [length, setLength] = useState(120);
    const [height, setHeight] = useState(200);
    const [targetPPM, setTargetPPM] = useState(1200);
    const [fillTime, setFillTime] = useState(15); // Minutes

    // Volume in cubic meters
    const volumeM3 = (width * length * height) / 1000000;
    // Volume in cubic feet
    const volumeFt3 = volumeM3 * 35.3147;

    // Required CO2 in cubic feet to reach target from ambient (approx 400ppm)
    const ambientPPM = 400;
    const requiredPPM = Math.max(0, targetPPM - ambientPPM);
    const requiredCO2Ft3 = (volumeFt3 * requiredPPM) / 1000000;
    const requiredCO2Liters = requiredCO2Ft3 * 28.3168;

    // Flow rate estimation
    const flowRateCFM = requiredCO2Ft3 / fillTime;
    const flowRateLPM = requiredCO2Liters / fillTime;

    const calcList = [t('co2CalcHowList1'), t('co2CalcHowList2')];
    const faqs = [
        { q: t('co2CalcFaq1Q'), a: t('co2CalcFaq1A') },
        { q: t('co2CalcFaq2Q'), a: t('co2CalcFaq2A') },
        { q: t('co2CalcFaq3Q'), a: t('co2CalcFaq3A') }
    ];

    return (
        <div className="page-container">
            <Navbar />
            <div className="tool-content">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="tool-icon">🌫️</div>
                        <h1>{t('co2CalcTitle')}</h1>
                        <p>{t('co2CalcSubtitle')}</p>
                    </div>

                    <div className="calculator-form">
                        <div className="section-label">{t('co2CalcDims')}</div>
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
                            <label>{t('co2CalcTarget')}</label>
                            <div className="range-wrapper">
                                <input
                                    type="range"
                                    min="400"
                                    max="2000"
                                    step="50"
                                    value={targetPPM}
                                    onChange={(e) => setTargetPPM(parseFloat(e.target.value))}
                                    className="range-slider"
                                />
                                <span className="range-value">{targetPPM} PPM</span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label>{t('co2CalcFillTime')}</label>
                            <div className="range-wrapper">
                                <input
                                    type="range"
                                    min="1"
                                    max="60"
                                    step="1"
                                    value={fillTime}
                                    onChange={(e) => setFillTime(parseFloat(e.target.value))}
                                    className="range-slider"
                                />
                                <span className="range-value">{fillTime} min</span>
                            </div>
                        </div>

                        <div className="results-grid">
                            <div className="result-item">
                                <span className="label">{t('co2CalcVolume')}</span>
                                <span className="value">{volumeM3.toFixed(2)} m³</span>
                                <span className="sub-value">({volumeFt3.toFixed(2)} ft³)</span>
                            </div>
                            <div className="result-item highlight">
                                <span className="label">{t('co2CalcRequired')}</span>
                                <span className="value">{requiredCO2Ft3.toFixed(4)} ft³</span>
                                <span className="sub-value">({requiredCO2Liters.toFixed(2)} L)</span>
                            </div>
                            <div className="result-item highlight-green">
                                <span className="label">{t('co2CalcFlow')}</span>
                                <span className="value">{flowRateLPM.toFixed(2)} L/min</span>
                                <span className="sub-value">({flowRateCFM.toFixed(4)} CFM)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>{t('co2CalcIntroTitle')}</h2>
                    <p>{t('co2CalcIntroText')}</p>
                    <p>{t('co2CalcIntroText2')}</p>

                    <h2>{t('co2CalcHowTitle')}</h2>
                    <p>{t('co2CalcHowText')}</p>
                    <ul>
                        {calcList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <p>{t('co2CalcHowText2')}</p>

                    <h2>{t('co2CalcFaqTitle')}</h2>
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <h3>{faq.q}</h3>
                                <p>{faq.a}</p>
                            </div>
                        ))}
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
                    flex-direction: column;
                    align-items: center;
                    padding: 4rem 1.5rem;
                    gap: 4rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }

                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    padding: 3rem;
                    max-width: 600px;
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
                }

                .tool-header h1 {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, #94a3b8 0%, #e2e8f0 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .tool-header p {
                    color: #94a3b8;
                }

                .calculator-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .section-label {
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: -0.5rem;
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
                    text-align: center;
                }

                .range-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .range-value {
                    min-width: 80px;
                    text-align: right;
                    font-variant-numeric: tabular-nums;
                    color: #e2e8f0;
                    font-weight: 600;
                }

                .range-slider {
                    flex: 1;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    appearance: none;
                }

                .range-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #e2e8f0;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid #0a0a0a;
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
                }

                .results-grid {
                    display: grid;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .result-item {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1.25rem;
                    border-radius: 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .result-item.highlight {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                }

                .result-item.highlight-green {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .result-item .label {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    margin-bottom: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .result-item .value {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .result-item .sub-value {
                    font-size: 0.9rem;
                    color: #64748b;
                }

                .info-section {
                    max-width: 800px;
                    width: 100%;
                    color: #cbd5e1;
                    line-height: 1.7;
                }

                .info-section h2 {
                    color: white;
                    font-size: 1.75rem;
                    margin: 3rem 0 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 0.5rem;
                }

                .info-section h2:first-child {
                    margin-top: 0;
                }

                .info-section p {
                    margin-bottom: 1.5rem;
                }

                .info-section ul {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }

                .info-section li {
                    margin-bottom: 0.5rem;
                }

                .faq-list {
                    display: grid;
                    gap: 1.5rem;
                }

                .faq-item {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.5rem;
                }

                .faq-item h3 {
                    color: #e2e8f0;
                    font-size: 1.1rem;
                    margin-bottom: 0.75rem;
                }

                .faq-item p {
                    margin-bottom: 0;
                    color: #94a3b8;
                }

                @media (max-width: 768px) {
                    .tool-content {
                        padding: 2rem 1rem;
                    }
                    
                    .tool-card {
                        padding: 1.5rem;
                    }

                    .dims-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default CO2Calculator;
