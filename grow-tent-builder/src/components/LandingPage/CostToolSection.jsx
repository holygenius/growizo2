import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function CostToolSection() {
    const { language, t } = useSettings();
    const [power, setPower] = useState(300);
    const [hours, setHours] = useState(18);
    const [rate, setRate] = useState(0.12);
    const [result, setResult] = useState(0);

    const handleCalculate = () => {
        const monthlyCost = (power / 1000) * hours * 30 * rate;
        setResult(monthlyCost);
    };

    const currencySymbol = language === 'tr' ? '₺' : '$';

    return (
        <section className="cost-tool-section">
            <div className="cost-tool-container">
                <div className="cost-tool-header">
                    <h2>⚡ {t('landingCostToolTitle')}</h2>
                    <p>{t('landingCostToolSubtitle')}</p>
                </div>
                <div className="cost-tool-inputs">
                    <div className="input-group">
                        <label>{t('landingCostToolPower')}</label>
                        <input
                            type="number"
                            placeholder="300"
                            value={power}
                            onChange={(e) => setPower(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('landingCostToolHours')}</label>
                        <input
                            type="number"
                            placeholder="18"
                            value={hours}
                            onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('landingCostToolRate')}</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.12"
                            value={rate}
                            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <button
                    className="calc-button"
                    onClick={handleCalculate}
                >
                    {t('landingCostToolCalculate')}
                </button>
                <div className="cost-result">
                    {t('landingCostToolResult')}: {currencySymbol}{result.toFixed(2)}
                </div>
            </div>
        </section>
    );
}
