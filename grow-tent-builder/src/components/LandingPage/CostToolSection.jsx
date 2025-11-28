import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function CostToolSection() {
    const { language, t } = useSettings();

    const handleCalculate = () => {
        const power = parseFloat(document.getElementById('power-input').value) || 0;
        const hours = parseFloat(document.getElementById('hours-input').value) || 0;
        const rate = parseFloat(document.getElementById('rate-input').value) || 0;
        const monthlyCost = (power / 1000) * hours * 30 * rate;
        document.getElementById('cost-result').textContent =
            `${t('landingCostToolResult')}: ${language === 'tr' ? '₺' : '$'}${monthlyCost.toFixed(2)}`;
    };

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
                            id="power-input"
                            placeholder="300"
                            defaultValue="300"
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('landingCostToolHours')}</label>
                        <input
                            type="number"
                            id="hours-input"
                            placeholder="18"
                            defaultValue="18"
                        />
                    </div>
                    <div className="input-group">
                        <label>{t('landingCostToolRate')}</label>
                        <input
                            type="number"
                            step="0.01"
                            id="rate-input"
                            placeholder="0.12"
                            defaultValue="0.12"
                        />
                    </div>
                </div>
                <button
                    className="calc-button"
                    onClick={handleCalculate}
                >
                    {t('landingCostToolCalculate')}
                </button>
                <div className="cost-result" id="cost-result">
                    {t('landingCostToolResult')}: {language === 'tr' ? '₺' : '$'}0.00
                </div>
            </div>
        </section>
    );
}
