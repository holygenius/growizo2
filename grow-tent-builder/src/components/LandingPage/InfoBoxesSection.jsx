import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';

const infoBoxItems = [
    { icon: "mdi:lightbulb", titleKey: 'landingInfoLight', descKey: 'landingInfoLightDesc' },
    { icon: "mdi:air-filter", titleKey: 'landingInfoAir', descKey: 'landingInfoAirDesc' },
    { icon: "mdi:thermometer", titleKey: 'landingInfoHumidity', descKey: 'landingInfoHumidityDesc' }
];

export default function InfoBoxesSection() {
    const { t } = useSettings();

    return (
        <section className="info-boxes-section">
            <div className="section-header">
                <h2><Icon icon="mdi:alert-circle-outline" size={24} /> {t('landingInfoTitle')}</h2>
                <p>{t('landingInfoSubtitle')}</p>
            </div>
            <div className="info-boxes-container">
                {infoBoxItems.map((item, index) => (
                    <div
                        key={index}
                        className="info-box"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="info-box-icon"><Icon icon={item.icon} size={32} /></div>
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
