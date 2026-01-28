import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';

export default function ToolsPreviewSection() {
    const { t, getLocalizedPath } = useSettings();

    return (
        <section className="tools-preview-section">
            <div className="section-header">
                <h2><Icon icon="mdi:toolbox" size={24} /> {t('landingGrowTools')}</h2>
                <p>{t('landingGrowToolsSubtitle')}</p>
            </div>
            <div className="tools-grid">
                <Link to={getLocalizedPath('/tools/electricity-cost-calculator')} className="tool-preview-card">
                    <div className="tool-icon"><Icon icon="mdi:lightning-bolt" size={32} /></div>
                    <h3>{t('landingCostCalculator')}</h3>
                    <p>{t('landingCostCalculatorDesc')}</p>
                </Link>
                <Link to={getLocalizedPath('/tools/unit-converter')} className="tool-preview-card">
                    <div className="tool-icon"><Icon icon="mdi:water" size={32} /></div>
                    <h3>{t('landingUnitConverter')}</h3>
                    <p>{t('landingUnitConverterDesc')}</p>
                </Link>
                <Link to={getLocalizedPath('/tools/co2-calculator')} className="tool-preview-card">
                    <div className="tool-icon"><Icon icon="mdi:smog" size={32} /></div>
                    <h3>{t('landingCo2Calculator')}</h3>
                    <p>{t('landingCo2CalculatorDesc')}</p>
                </Link>
                <Link to={getLocalizedPath('/tools/ppfd-heatmap')} className="tool-preview-card">
                    <div className="tool-icon"><Icon icon="mdi:white-balance-sunny" size={32} /></div>
                    <h3>{t('landingPpfdMapTitle')}</h3>
                    <p>{t('landingPpfdMapDesc')}</p>
                </Link>
            </div>
            <div className="center-btn">
                <Link to={getLocalizedPath('/tools')} className="secondary-btn">
                    {t('landingViewAllTools')}
                </Link>
            </div>
        </section>
    );
}
