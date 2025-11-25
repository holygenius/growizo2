import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const UnitConverter = () => {
    const { t } = useSettings();

    // Base value is always in Liters
    const [liters, setLiters] = useState(1);

    // Conversion factors to Liters
    const factors = {
        ml: 0.001,
        l: 1,
        gal: 3.78541, // US Gallon
        qt: 0.946353, // US Quart
        pt: 0.473176, // US Pint
        cup: 0.236588, // US Cup
        floz: 0.0295735, // US Fluid Ounce
        tbsp: 0.0147868, // US Tablespoon
        tsp: 0.00492892, // US Teaspoon
        m3: 1000,
        ft3: 28.3168
    };

    const updateFrom = (unit, value) => {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            setLiters(num * factors[unit]);
        } else if (value === '') {
            setLiters(0);
        }
    };

    const getValue = (unit) => {
        const val = liters / factors[unit];
        // Avoid floating point errors for display
        if (val === 0) return '';
        // Format to reasonable decimals, but keep precision for editing
        return parseFloat(val.toFixed(6));
    };

    const units = {
        ml: t('unitConvMl'),
        l: t('unitConvL'),
        gal: t('unitConvGal'),
        qt: t('unitConvQt'),
        pt: t('unitConvPt'),
        cup: t('unitConvCup'),
        floz: t('unitConvFloz'),
        tbsp: t('unitConvTbsp'),
        tsp: t('unitConvTsp'),
        m3: t('unitConvM3'),
        ft3: t('unitConvFt3')
    };

    const introList = [
        "cubic millimeters (mm³)*", "cubic centimeters (cm³)*", "cubic decimeters (dm³)*", "cubic meters (m³)*",
        "cubic inches (cu in)*", "cubic feet (cu ft)*", "cubic yards (cu yd)*",
        "milliliters (ml)", "liters (l)",
        "gallons (US) / gallons (UK) (gal)", "quarts (US) / quarts (UK) (qt)",
        "pints (US) / pints (UK) (pt)", "fluid ounces (US) / fluid ounces (UK) (fl oz)",
        "US customary cups/glasses (236.59ml) (cups)",
        "tablespoons (15 ml) (tablespoons)", "teaspoons (5 ml) (teaspoons)"
    ];

    const chartHeaders = [t('unitConvChartMeasure'), t('unitConvChartUS'), t('unitConvChartMetric')];
    const chartRows = [
        ["Teaspoon", "4.93", "5"],
        ["Tablespoon", "14.79", "15"],
        ["Fluid ounce", "29.57", "30"],
        ["Cup", "236.59", "250"],
        ["Pint", "473.18", "568.26 (UK)"],
        ["Quart", "946.35", "1136.52 (UK)"],
        ["Gallon", "3785.41", "4546.09 (UK)"]
    ];

    const faqs = [
        { q: t('unitConvFaq1Q'), a: t('unitConvFaq1A') },
        { q: t('unitConvFaq2Q'), a: t('unitConvFaq2A') },
        { q: t('unitConvFaq3Q'), a: t('unitConvFaq3A') }
    ];

    const unitKeys = ['ml', 'l', 'gal', 'qt', 'pt', 'cup', 'floz', 'tbsp', 'tsp', 'm3', 'ft3'];

    return (
        <div className="page-container">
            <Navbar />
            <div className="tool-content">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="tool-icon">💧</div>
                        <h1>{t('unitConvTitle')}</h1>
                        <p>{t('unitConvSubtitle')}</p>
                    </div>

                    <div className="converter-grid">
                        {unitKeys.map((key) => (
                            <div key={key} className="input-group">
                                <label>{units[key]}</label>
                                <input
                                    type="number"
                                    value={getValue(key)}
                                    onChange={(e) => updateFrom(key, e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="info-section">
                    <h2>{t('unitConvIntroTitle')}</h2>
                    <p>{t('unitConvIntroText')}</p>
                    <ul>
                        {introList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <p className="note">{t('unitConvIntroNote')}</p>

                    <h2>{t('unitConvChartTitle')}</h2>
                    <p>{t('unitConvChartText')}</p>
                    <div className="chart-container">
                        <table className="conversion-table">
                            <thead>
                                <tr>
                                    {chartHeaders.map((h, i) => <th key={i}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {chartRows.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => <td key={j}>{cell}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h2>{t('unitConvHowTitle')}</h2>
                    <p>{t('unitConvHowText')}</p>

                    <h2>{t('unitConvFaqTitle')}</h2>
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
                    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .tool-header p {
                    color: #94a3b8;
                }

                .converter-grid {
                    display: grid;
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

                .input-group input[type="number"] {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-size: 1.25rem;
                    width: 100%;
                    transition: all 0.2s;
                }

                .input-group input[type="number"]:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.1);
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
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 0.5rem;
                }

                .info-section li {
                    margin-bottom: 0.5rem;
                }

                .note {
                    font-style: italic;
                    color: #94a3b8;
                    font-size: 0.9rem;
                }

                .chart-container {
                    overflow-x: auto;
                    margin-bottom: 2rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .conversion-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: rgba(255, 255, 255, 0.02);
                }

                .conversion-table th,
                .conversion-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .conversion-table th {
                    background: rgba(255, 255, 255, 0.05);
                    font-weight: 600;
                    color: white;
                }

                .conversion-table tr:last-child td {
                    border-bottom: none;
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
                }
            `}</style>
        </div>
    );
};

export default UnitConverter;
