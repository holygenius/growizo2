import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CostCalculator = () => {
    const { language } = useSettings();
    const [power, setPower] = useState(300);
    const [hours, setHours] = useState(18);
    const [rate, setRate] = useState(0.12);

    const monthlyCost = (power / 1000) * hours * 30 * rate;

    const t = {
        en: {
            title: "Electricity Cost Calculator",
            subtitle: "Estimate your monthly running costs",
            power: "Total Power Draw (Watts)",
            hours: "Hours On per Day",
            rate: "Electricity Rate (Cost/kWh)",
            result: "Estimated Monthly Cost",
            desc: "Calculate the running cost of your grow lights, fans, and other equipment."
        },
        tr: {
            title: "Elektrik Maliyet Hesaplayıcı",
            subtitle: "Aylık işletme maliyetlerinizi tahmin edin",
            power: "Toplam Güç Tüketimi (Watt)",
            hours: "Günlük Çalışma Saati",
            rate: "Elektrik Birim Fiyatı (TL/kWh)",
            result: "Tahmini Aylık Maliyet",
            desc: "Yetiştirme ışıklarınızın, fanlarınızın ve diğer ekipmanlarınızın işletme maliyetini hesaplayın."
        }
    }[language];

    const currencySymbol = language === 'tr' ? '₺' : '$';

    return (
        <div className="page-container">
            <Navbar />
            <div className="tool-content">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="tool-icon">⚡</div>
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>

                    <div className="calculator-form">
                        <div className="input-group">
                            <label>{t.power}</label>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    value={power}
                                    onChange={(e) => setPower(parseFloat(e.target.value) || 0)}
                                />
                                <span className="unit">W</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                value={power}
                                onChange={(e) => setPower(parseFloat(e.target.value))}
                                className="range-slider"
                            />
                        </div>

                        <div className="input-group">
                            <label>{t.hours}</label>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    value={hours}
                                    onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                                    max="24"
                                />
                                <span className="unit">h</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="24"
                                value={hours}
                                onChange={(e) => setHours(parseFloat(e.target.value))}
                                className="range-slider"
                            />
                        </div>

                        <div className="input-group">
                            <label>{t.rate}</label>
                            <div className="input-wrapper">
                                <span className="prefix">{currencySymbol}</span>
                                <input
                                    type="number"
                                    value={rate}
                                    step="0.01"
                                    onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className="result-box">
                            <span className="result-label">{t.result}</span>
                            <span className="result-value">
                                {currencySymbol}{monthlyCost.toFixed(2)}
                            </span>
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
                    color: #fbbf24;
                    filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.3));
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

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-wrapper input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 1.125rem;
                    transition: all 0.2s;
                }

                .input-wrapper input:focus {
                    outline: none;
                    border-color: #fbbf24;
                    background: rgba(255, 255, 255, 0.08);
                }

                .unit, .prefix {
                    position: absolute;
                    color: #64748b;
                    font-weight: 600;
                }

                .unit { right: 1rem; }
                .prefix { left: 1rem; }
                .input-wrapper .prefix + input { padding-left: 2rem; }

                .range-slider {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    appearance: none;
                    margin-top: 0.5rem;
                }

                .range-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    background: #fbbf24;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.1s;
                }

                .range-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }

                .result-box {
                    margin-top: 1rem;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .result-label {
                    color: #10b981;
                    font-weight: 600;
                }

                .result-value {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default CostCalculator;
