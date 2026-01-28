import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './CO2Calculator.module.css';

const CO2Calculator = () => {
    const { t } = useSettings();
    const [width, setWidth] = useState(120);
    const [length, setLength] = useState(120);
    const [height, setHeight] = useState(200);
    const [targetPPM, setTargetPPM] = useState(1200);
    const [fillTime, setFillTime] = useState(15); // Minutes

    // Volume in cubic meters
    const volumeM3 = (width * length * height) / 1000000;
    // Volume in cubic feet
    const volumeFt3 = volumeM3 * 35.3147;

    // Required CO2 in cubic feet to reach target from ambient (approx 400ppm)
    const ambientPPM = 400;
    const requiredPPM = Math.max(0, targetPPM - ambientPPM);
    const requiredCO2Ft3 = (volumeFt3 * requiredPPM) / 1000000;
    const requiredCO2Liters = requiredCO2Ft3 * 28.3168;

    // Flow rate estimation
    const flowRateCFM = requiredCO2Ft3 / fillTime;
    const flowRateLPM = requiredCO2Liters / fillTime;

    const calcList = [t('co2CalcHowList1'), t('co2CalcHowList2')];
    const faqs = [
        { q: t('co2CalcFaq1Q'), a: t('co2CalcFaq1A') },
        { q: t('co2CalcFaq2Q'), a: t('co2CalcFaq2A') },
        { q: t('co2CalcFaq3Q'), a: t('co2CalcFaq3A') }
    ];

    return (
        <div className={styles.pageContainer}>
            <Helmet>
                <title>{t('navCo2Calc')} | GroWizard</title>
            </Helmet>
            <Navbar />
            <div className={styles.toolContent}>
                <div className={styles.toolCard}>
                    <div className={styles.toolHeader}>
                        <div className={styles.toolIcon}>
                            <Icon icon="mdi:smog" size={48} color="var(--color-primary)" />
                        </div>
                        <h1>{t('co2CalcTitle')}</h1>
                        <p>{t('co2CalcSubtitle')}</p>
                    </div>

                    <div className={styles.calculatorForm}>
                        <div className={styles.sectionLabel}>{t('co2CalcDims')}</div>
                        <div className={styles.dimsGrid}>
                            <div className={styles.inputGroup}>
                                <label>{t('width')} (cm)</label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>{t('length')} (cm)</label>
                                <input
                                    type="number"
                                    value={length}
                                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>{t('height')} (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>{t('co2CalcTarget')}</label>
                            <div className={styles.rangeWrapper}>
                                <input
                                    type="range"
                                    min="400"
                                    max="2000"
                                    step="50"
                                    value={targetPPM}
                                    onChange={(e) => setTargetPPM(parseFloat(e.target.value))}
                                    className={styles.rangeSlider}
                                />
                                <span className={styles.rangeValue}>{targetPPM} PPM</span>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>{t('co2CalcFillTime')}</label>
                            <div className={styles.rangeWrapper}>
                                <input
                                    type="range"
                                    min="1"
                                    max="60"
                                    step="1"
                                    value={fillTime}
                                    onChange={(e) => setFillTime(parseFloat(e.target.value))}
                                    className={styles.rangeSlider}
                                />
                                <span className={styles.rangeValue}>{fillTime} min</span>
                            </div>
                        </div>

                        <div className={styles.resultsGrid}>
                            <div className={styles.resultItem}>
                                <span className="label">{t('co2CalcVolume')}</span>
                                <span className="value">{volumeM3.toFixed(2)} m³</span>
                                <span className="subValue">({volumeFt3.toFixed(2)} ft³)</span>
                            </div>
                            <div className={`${styles.resultItem} ${styles.resultItemHighlight}`}>
                                <span className="label">{t('co2CalcRequired')}</span>
                                <span className="value">{requiredCO2Ft3.toFixed(4)} ft³</span>
                                <span className="subValue">({requiredCO2Liters.toFixed(2)} L)</span>
                            </div>
                            <div className={`${styles.resultItem} ${styles.resultItemHighlightGreen}`}>
                                <span className="label">{t('co2CalcFlow')}</span>
                                <span className="value">{flowRateLPM.toFixed(2)} L/min</span>
                                <span className="subValue">({flowRateCFM.toFixed(4)} CFM)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <h2>{t('co2CalcIntroTitle')}</h2>
                    <p>{t('co2CalcIntroText')}</p>
                    <p>{t('co2CalcIntroText2')}</p>

                    <h2>{t('co2CalcHowTitle')}</h2>
                    <p>{t('co2CalcHowText')}</p>
                    <ul>
                        {calcList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <p>{t('co2CalcHowText2')}</p>

                    <h2>{t('co2CalcFaqTitle')}</h2>
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

export default CO2Calculator;
