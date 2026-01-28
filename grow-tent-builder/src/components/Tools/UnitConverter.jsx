import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './UnitConverter.module.css';

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
        <div className={styles.pageContainer}>
            <Helmet>
                <title>{t('navUnitConv')} | GroWizard</title>
            </Helmet>
            <Navbar />
            <div className={styles.toolContent}>
                <div className={styles.toolCard}>
                    <div className={styles.toolHeader}>
                        <div className={styles.toolIcon}>
                            <Icon icon="mdi:water" size={48} color="var(--color-primary)" />
                        </div>
                        <h1>{t('unitConvTitle')}</h1>
                        <p>{t('unitConvSubtitle')}</p>
                    </div>

                    <div className={styles.converterGrid}>
                        {unitKeys.map((key) => (
                            <div key={key} className={styles.inputGroup}>
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

                <div className={styles.infoSection}>
                    <h2>{t('unitConvIntroTitle')}</h2>
                    <p>{t('unitConvIntroText')}</p>
                    <ul>
                        {introList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <p className={styles.note}>{t('unitConvIntroNote')}</p>

                    <h2>{t('unitConvChartTitle')}</h2>
                    <p>{t('unitConvChartText')}</p>
                    <div className={styles.chartContainer}>
                        <table className={styles.conversionTable}>
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
                    <div className={styles.faqList}>
                        {faqs.map((faq, i) => (
                            <div key={i} className={styles.faqItem}>
                                <h3>{faq.q}</h3>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UnitConverter;
