import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './CostCalculator.module.css';

const CostCalculator = () => {
    const { t } = useSettings();
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
        <div className={styles.pageContainer}>
            <Helmet>
                <title>{t('costCalcTitle')} | GroWizard</title>
                <meta name="description" content={t('costCalcSubtitle')} />
            </Helmet>
            <Navbar />
            <div className={styles.toolContent}>
                <div className={styles.toolCard}>
                    <div className={styles.toolHeader}>
                        <div className={styles.toolIcon}>
                            <Icon icon="mdi:lightning-bolt" size={48} color="var(--color-primary)" />
                        </div>
                        <h1>{t('costCalcTitle')}</h1>
                        <p>{t('costCalcSubtitle')}</p>
                    </div>

                    <div className={styles.calculatorForm}>
                        {/* Power Consumption */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label>{t('costCalcPower')}</label>
                                <span className={styles.dots}>•••</span>
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    value={power}
                                    onChange={(e) => setPower(parseFloat(e.target.value) || 0)}
                                />
                                <span className={styles.unit}>{t('costCalcW')}</span>
                                <span className={styles.arrow}>⌄</span>
                            </div>
                        </div>

                        {/* Usage Time */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label>{t('costCalcTime')}</label>
                                <span className={styles.dots}>•••</span>
                            </div>
                            <div className={`${styles.inputWrapper} ${styles.timeWrapper}`}>
                                <div className={styles.timeInput}>
                                    <input
                                        type="number"
                                        value={hours}
                                        onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className={styles.unit}>{t('costCalcHrs')}</span>
                                </div>
                                <span className={styles.divider}>|</span>
                                <div className={styles.timeInput}>
                                    <input
                                        type="number"
                                        value={minutes}
                                        onChange={(e) => setMinutes(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className={styles.unit}>{t('costCalcMin')}</span>
                                </div>
                                <span className={styles.arrow}>⌄</span>
                            </div>
                        </div>

                        {/* Energy Consumed (Read-only) */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label>{t('costCalcEnergy')}</label>
                                <span className={styles.dots}>•••</span>
                            </div>
                            <div className={`${styles.inputWrapper} ${styles.inputWrapperReadOnly}`}>
                                <span className={styles.highlightGreen}>
                                    {energyConsumed.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </span>
                                <span className={`${styles.unit} ${styles.highlightGreen}`}>{t('costCalcKwh')}</span>
                            </div>
                        </div>

                        {/* Energy Price */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label>{t('costCalcPrice')}</label>
                                <span className={styles.pin}>📌</span>
                                <span className={styles.dots}>•••</span>
                            </div>
                            <div className={styles.inputWrapper}>
                                <span className={styles.currencyPrefix}>{t('costCalcCurrency')}</span>
                                <input
                                    type="number"
                                    value={price}
                                    step="0.01"
                                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                />
                                <span className={styles.unitSuffix}>/ {t('costCalcKwh')}</span>
                            </div>
                        </div>

                        {/* Total Cost (Read-only) */}
                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label>{t('costCalcCost')}</label>
                                <span className={styles.dots}>•••</span>
                            </div>
                            <div className={`${styles.inputWrapper} ${styles.inputWrapperReadOnly} ${styles.costWrapper}`}>
                                <span className={`${styles.currencyPrefix} ${styles.highlightGreen}`}>{t('costCalcCurrency')}</span>
                                <span className={styles.highlightGreen}>
                                    {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <h2>{t('costCalcIntroTitle')}</h2>
                    <p>{t('costCalcIntroText')}</p>
                    <ul>
                        {introSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                    <p className={styles.example}>{t('costCalcIntroExample')}</p>

                    <h2>{t('costCalcWorksTitle')}</h2>
                    <p>{t('costCalcWorksText')}</p>
                    <ol>
                        {worksList.map((item, i) => <li key={i}>{item}</li>)}
                    </ol>

                    <h2>{t('costCalcTipsTitle')}</h2>
                    <ul className={styles.tipsList}>
                        {tipsList.map((tip, i) => <li key={i}>✅ {tip}</li>)}
                    </ul>

                    <h2>{t('costCalcFaqTitle')}</h2>
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

export default CostCalculator;
