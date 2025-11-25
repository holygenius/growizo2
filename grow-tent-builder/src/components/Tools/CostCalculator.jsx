import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CostCalculator = () => {
    const { language, t } = useSettings();
    const [power, setPower] = useState(200);
    const [hours, setHours] = useState(18);
    const [minutes, setMinutes] = useState(0);
    const [price, setPrice] = useState(0.12);

    // Calculate Energy Consumed (kWh)
    // Power (W) * Time (h) / 1000
    const totalHours = hours + (minutes / 60);
    const energyConsumed = (power * totalHours) / 1000;

    // Calculate Cost
    const totalCost = energyConsumed * price;

    const introSteps = [t('costCalcIntroStep1'), t('costCalcIntroStep2')];
    const worksList = [t('costCalcWorksList1'), t('costCalcWorksList2'), t('costCalcWorksList3'), t('costCalcWorksList4')];
    const tipsList = [
        t('costCalcTip1'), t('costCalcTip2'), t('costCalcTip3'), t('costCalcTip4'),
        t('costCalcTip5'), t('costCalcTip6'), t('costCalcTip7'), t('costCalcTip8'),
        t('costCalcTip9'), t('costCalcTip10'), t('costCalcTip11')
    ];
    const faqs = [
        { q: t('costCalcFaq1Q'), a: t('costCalcFaq1A') },
        { q: t('costCalcFaq2Q'), a: t('costCalcFaq2A') },
        { q: t('costCalcFaq3Q'), a: t('costCalcFaq3A') },
        { q: t('costCalcFaq4Q'), a: t('costCalcFaq4A') }
    ];

    return (
        <div className="page-container">
            <Helmet>
                <title>{t('costCalcTitle')} | GroWizard</title>
                <meta name="description" content={t('costCalcSubtitle')} />
            </Helmet>
            <Navbar />
            <div className="tool-content">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="tool-icon">⚡</div>
                        <h1>{t('costCalcTitle')}</h1>
                        <p>{t('costCalcSubtitle')}</p>
                    </div>

                    <div className="calculator-form">
                        {/* Power Consumption */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t('costCalcPower')}</label>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    value={power}
                                    onChange={(e) => setPower(parseFloat(e.target.value) || 0)}
                                />
                                <span className="unit">{t('costCalcW')}</span>
                                <span className="arrow">⌄</span>
                            </div>
                        </div>

                        {/* Usage Time */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t('costCalcTime')}</label>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper time-wrapper">
                                <div className="time-input">
                                    <input
                                        type="number"
                                        value={hours}
                                        onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="unit">{t('costCalcHrs')}</span>
                                </div>
                                <span className="divider">|</span>
                                <div className="time-input">
                                    <input
                                        type="number"
                                        value={minutes}
                                        onChange={(e) => setMinutes(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="unit">{t('costCalcMin')}</span>
                                </div>
                                <span className="arrow">⌄</span>
                            </div>
                        </div>

                        {/* Energy Consumed (Read-only) */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t('costCalcEnergy')}</label>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper read-only">
                                <span className="value highlight-blue">
                                    {energyConsumed.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </span>
                                <span className="unit highlight-blue">{t('costCalcKwh')}</span>
                            </div>
                        </div>

                        {/* Energy Price */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t('costCalcPrice')}</label>
                                <span className="pin">📌</span>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper">
                                <span className="currency-prefix">{t('costCalcCurrency')}</span>
                                <input
                                    type="number"
                                    value={price}
                                    step="0.01"
                                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                    className="price-input"
                                />
                                <span className="unit-suffix">/ {t('costCalcKwh')}</span>
                            </div>
                        </div>

                        {/* Total Cost (Read-only) */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t('costCalcCost')}</label>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper read-only cost-wrapper">
                                <span className="currency-prefix highlight-blue">{t('costCalcCurrency')}</span>
                                <span className="value highlight-blue">
                                    {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>{t('costCalcIntroTitle')}</h2>
                    <p>{t('costCalcIntroText')}</p>
                    <ul>
                        {introSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                    <p className="example">{t('costCalcIntroExample')}</p>

                    <h2>{t('costCalcWorksTitle')}</h2>
                    <p>{t('costCalcWorksText')}</p>
                    <ol>
                        {worksList.map((item, i) => <li key={i}>{item}</li>)}
                    </ol>

                    <h2>{t('costCalcTipsTitle')}</h2>
                    <ul className="tips-list">
                        {tipsList.map((tip, i) => <li key={i}>✅ {tip}</li>)}
                    </ul>

                    <h2>{t('costCalcFaqTitle')}</h2>
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
                    max-width: 500px;
                    width: 100%;
                    color: white;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }

                .tool-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .tool-icon {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                    color: #f59e0b;
                }

                .tool-header h1 {
                    font-size: 1.75rem;
                    margin-bottom: 0.5rem;
                    color: white;
                    font-weight: 700;
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

                .label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .dots {
                    color: #475569;
                    letter-spacing: 2px;
                    font-size: 1.2rem;
                    line-height: 0.5;
                }

                .input-wrapper {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .input-wrapper:focus-within {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .input-wrapper.read-only {
                    background: rgba(255, 255, 255, 0.02);
                    border-color: rgba(255, 255, 255, 0.05);
                }

                .input-wrapper input {
                    background: transparent;
                    border: none;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    width: 100%;
                    outline: none;
                }

                .unit, .unit-suffix, .currency-prefix {
                    color: #3b82f6;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .arrow {
                    color: #3b82f6;
                    font-weight: bold;
                    font-size: 0.8rem;
                }

                .time-wrapper {
                    justify-content: space-between;
                }

                .time-input {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .time-input input {
                    width: 3rem;
                    text-align: right;
                }

                .divider {
                    color: #475569;
                }

                .highlight-blue {
                    color: #3b82f6;
                    font-weight: 700;
                    font-size: 1.25rem;
                }

                .cost-wrapper {
                    padding: 1rem;
                }

                .pin {
                    color: #ef4444;
                    font-size: 0.9rem;
                    transform: rotate(45deg);
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

                .info-section ul, .info-section ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }

                .info-section li {
                    margin-bottom: 0.5rem;
                }

                .example {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 0.5rem;
                    border-left: 4px solid #3b82f6;
                    margin-bottom: 1.5rem;
                }

                .tips-list {
                    list-style: none;
                    padding-left: 0 !important;
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

export default CostCalculator;
