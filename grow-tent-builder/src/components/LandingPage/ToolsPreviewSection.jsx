import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';
import './ToolsPreview.css';

export default function ToolsPreviewSection() {
    const { t, getLocalizedPath } = useSettings();

    const tools = [
        { path: '/tools/electricity-cost-calculator', icon: 'mdi:flash', title: t('landingCostCalculator'), desc: t('landingCostCalculatorDesc') },
        { path: '/tools/unit-converter', icon: 'mdi:water-percent', title: t('landingUnitConverter'), desc: t('landingUnitConverterDesc') },
        { path: '/tools/co2-calculator', icon: 'mdi:molecule-co2', title: t('landingCo2Calculator'), desc: t('landingCo2CalculatorDesc') },
        { path: '/tools/ppfd-heatmap', icon: 'mdi:weather-sunny', title: t('landingPpfdMapTitle'), desc: t('landingPpfdMapDesc') },
    ];

    return (
        <section className="tools-dock-section">
            <div className="dock-header">
                <h2>{t('landingGrowTools')}</h2>
                <Link to={getLocalizedPath('/tools')} className="view-all-link">
                    {t('landingViewAllTools')} →
                </Link>
            </div>

            <div className="tools-dock-container">
                {tools.map((tool, index) => (
                    <Link to={getLocalizedPath(tool.path)} key={index} className="dock-item">
                        <div className="icon-circle">
                            <Icon icon={tool.icon} size={28} />
                        </div>
                        <div className="dock-info">
                            <span className="dock-title">{tool.title}</span>
                            <span className="dock-desc">{tool.desc}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
