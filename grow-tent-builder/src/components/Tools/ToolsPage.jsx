import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './ToolsPage.module.css';

const ToolsPage = () => {
    const { t, getLocalizedPath } = useSettings();

    const tools = [
        {
            id: 'cost',
            icon: 'mdi:lightning-bolt',
            titleKey: 'toolCostTitle',
            descKey: 'toolCostDesc',
            path: '/tools/electricity-cost-calculator',
            color: 'from-yellow-400 to-orange-500'
        },
        {
            id: 'unit',
            icon: 'mdi:water',
            titleKey: 'toolUnitTitle',
            descKey: 'toolUnitDesc',
            path: '/tools/unit-converter',
            color: 'from-blue-400 to-cyan-500'
        },
        {
            id: 'co2',
            icon: 'mdi:smog',
            titleKey: 'toolCo2Title',
            descKey: 'toolCo2Desc',
            path: '/tools/co2-calculator',
            color: 'from-gray-400 to-gray-600'
        },
        {
            id: 'ppfd',
            icon: 'mdi:thermometer-lines',
            titleKey: 'toolPpfdTitle',
            descKey: 'toolPpfdDesc',
            path: '/tools/ppfd-heatmap',
            color: 'from-red-400 to-red-600'
        }
    ];

    return (
        <div className={styles.pageContainer}>
            <Helmet>
                <title>{t('navTools')} | GroWizard</title>
            </Helmet>
            <Navbar />
            <div className={styles.toolsContent}>
                <div className={styles.toolsHeader}>
                    <h1>{t('toolsTitle')}</h1>
                    <p>{t('toolsSubtitle')}</p>
                </div>

                <div className={styles.toolsGrid}>
                    {tools.map((tool) => (
                        <Link to={getLocalizedPath(tool.path)} key={tool.id} className={styles.toolCard}>
                            <div className={styles.cardIcon}>
                                <Icon icon={tool.icon} size={32} />
                            </div>
                            <h3>{t(tool.titleKey)}</h3>
                            <p>{t(tool.descKey)}</p>
                            <div className={styles.cardArrow}>→</div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ToolsPage;
