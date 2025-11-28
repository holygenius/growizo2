import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const infoBoxItems = [
    { icon: "💡", titleKey: 'landingInfoLight', descKey: 'landingInfoLightDesc' },
    { icon: "🌬️", titleKey: 'landingInfoAir', descKey: 'landingInfoAirDesc' },
    { icon: "🌡️", titleKey: 'landingInfoHumidity', descKey: 'landingInfoHumidityDesc' }
];

export default function InfoBoxesSection() {
    const { t } = useSettings();

    return (
        <section className="info-boxes-section">
            <div className="section-header">
                <h2>⚠️ {t('landingInfoTitle')}</h2>
                <p>{t('landingInfoSubtitle')}</p>
            </div>
            <div className="info-boxes-container">
                {infoBoxItems.map((item, index) => (
                    <div
                        key={index}
                        className="info-box"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="info-box-icon">{item.icon}</div>
                        <div className="info-box-content">
                            <h3>{t(item.titleKey)}</h3>
                            <p>{t(item.descKey)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
