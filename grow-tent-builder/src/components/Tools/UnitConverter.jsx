import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const UnitConverter = () => {
    const { language } = useSettings();

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

    const t = {
        en: {
            title: "Volume Converter",
            subtitle: "Convert freely between imperial and metric volume units",
            units: {
                ml: "Milliliters (ml)",
                l: "Liters (L)",
                gal: "Gallons (US gal)",
                qt: "Quarts (US qt)",
                pt: "Pints (US pt)",
                cup: "Cups (US cup)",
                floz: "Fluid Ounces (US fl oz)",
                tbsp: "Tablespoons (tbsp)",
                tsp: "Teaspoons (tsp)",
                m3: "Cubic Meters (m³)",
                ft3: "Cubic Feet (ft³)"
            },
            content: {
                introTitle: "Volume units",
                introText: "Choose the unit and convert freely between imperial and metric systems. Our calculator contains the following:",
                introList: [
                    "cubic millimeters (mm³)*", "cubic centimeters (cm³)*", "cubic decimeters (dm³)*", "cubic meters (m³)*",
                    "cubic inches (cu in)*", "cubic feet (cu ft)*", "cubic yards (cu yd)*",
                    "milliliters (ml)", "liters (l)",
                    "gallons (US) / gallons (UK) (gal)", "quarts (US) / quarts (UK) (qt)",
                    "pints (US) / pints (UK) (pt)", "fluid ounces (US) / fluid ounces (UK) (fl oz)",
                    "US customary cups/glasses (236.59ml) (cups)",
                    "tablespoons (15 ml) (tablespoons)", "teaspoons (5 ml) (teaspoons)"
                ],
                introNote: "*Some units are simplified in this view for common usage.",
                chartTitle: "Volume conversion chart",
                chartText: "One quick way of changing imperial volume units to the most popular metric, one milliliter, is using this conversion chart:",
                chartHeaders: ["Measure", "US (ml)", "Metric (ml)"],
                chartRows: [
                    ["Teaspoon", "4.93", "5"],
                    ["Tablespoon", "14.79", "15"],
                    ["Fluid ounce", "29.57", "30"],
                    ["Cup", "236.59", "250"],
                    ["Pint", "473.18", "568.26 (UK)"],
                    ["Quart", "946.35", "1136.52 (UK)"],
                    ["Gallon", "3785.41", "4546.09 (UK)"]
                ],
                howtoTitle: "How to find the volume in a different unit",
                howtoText: "Let's imagine that you want to bake a cake, but the problem is that the recipe comes from a different part of the world. You are used to your standard units, such as cups or pints, but you have no idea how much is 550 ml of milk. What can you do? Put that value in the calculator next to the milliliters unit, and immediately you will get the answer in cups (2.32), pints (1.16), or even teaspoons (110) if you wish.",
                faqTitle: "FAQs",
                faqs: [
                    { q: "How do I convert from liters to gallons?", a: "To convert from liters to gallons, use the formula: 1 L = 0.264 gal (US). You can roughly divide by 4 for a quick estimate." },
                    { q: "How much is 5 liters in cubic feet?", a: "5 liters equal to 0.177 cubic feet (ft³). Formula: 5 L / 1000 * 35.315 = 0.177 ft³." },
                    { q: "Why do we measure volume in cubic meters?", a: "We measure volume in cubic meters because volume measures the space occupied in three dimensions. Since the meter is a measure of length, the cubic meter (m³) represents a three-dimensional quantity." }
                ]
            }
        },
        tr: {
            title: "Hacim Çevirici",
            subtitle: "İmperyal ve metrik hacim birimleri arasında özgürce dönüşüm yapın",
            units: {
                ml: "Mililitre (ml)",
                l: "Litre (L)",
                gal: "Galon (US gal)",
                qt: "Çeyrek (US qt)",
                pt: "Pint (US pt)",
                cup: "Fincan (US cup)",
                floz: "Sıvı Ons (US fl oz)",
                tbsp: "Yemek Kaşığı (tbsp)",
                tsp: "Çay Kaşığı (tsp)",
                m3: "Metreküp (m³)",
                ft3: "Fitküp (ft³)"
            },
            content: {
                introTitle: "Hacim birimleri",
                introText: "Birimi seçin ve imperyal ve metrik sistemler arasında özgürce dönüştürün. Hesaplayıcımız şunları içerir:",
                introList: [
                    "milimetreküp (mm³)*", "santimetreküp (cm³)*", "desimetreküp (dm³)*", "metreküp (m³)*",
                    "inçküp (cu in)*", "fitküp (cu ft)*", "yardaküp (cu yd)*",
                    "mililitre (ml)", "litre (l)",
                    "galon (ABD) / galon (BK) (gal)", "çeyrek (ABD) / çeyrek (BK) (qt)",
                    "pint (ABD) / pint (BK) (pt)", "sıvı ons (ABD) / sıvı ons (BK) (fl oz)",
                    "ABD standart fincan/bardak (236.59ml) (cups)",
                    "yemek kaşığı (15 ml) (tablespoons)", "çay kaşığı (5 ml) (teaspoons)"
                ],
                introNote: "*Bazı birimler yaygın kullanım için bu görünümde basitleştirilmiştir.",
                chartTitle: "Hacim dönüşüm tablosu",
                chartText: "İmperyal hacim birimlerini en popüler metrik birim olan mililitreye değiştirmenin hızlı bir yolu bu dönüşüm tablosunu kullanmaktır:",
                chartHeaders: ["Ölçü", "ABD (ml)", "Metrik (ml)"],
                chartRows: [
                    ["Çay Kaşığı", "4.93", "5"],
                    ["Yemek Kaşığı", "14.79", "15"],
                    ["Sıvı Ons", "29.57", "30"],
                    ["Fincan", "236.59", "250"],
                    ["Pint", "473.18", "568.26 (BK)"],
                    ["Çeyrek", "946.35", "1136.52 (BK)"],
                    ["Galon", "3785.41", "4546.09 (BK)"]
                ],
                howtoTitle: "Farklı bir birimde hacim nasıl bulunur",
                howtoText: "Diyelim ki bir kek yapmak istiyorsunuz, ancak sorun şu ki tarif dünyanın farklı bir yerinden geliyor. Fincan veya pint gibi standart birimlerinize alışkınsınız, ancak 550 ml sütün ne kadar olduğu hakkında hiçbir fikriniz yok. Ne yapabilirsiniz? Bu değeri hesaplayıcıda mililitre biriminin yanına koyun ve hemen fincan (2.32), pint (1.16) veya isterseniz çay kaşığı (110) cinsinden cevabı alacaksınız.",
                faqTitle: "SSS",
                faqs: [
                    { q: "Litreyi galona nasıl çeviririm?", a: "Litreyi galona çevirmek için şu formülü kullanın: 1 L = 0.264 gal (ABD). Hızlı bir tahmin için 4'e bölebilirsiniz." },
                    { q: "5 litre kaç fitküptür?", a: "5 litre 0.177 fitküpe (ft³) eşittir. Formül: 5 L / 1000 * 35.315 = 0.177 ft³." },
                    { q: "Neden hacmi metreküp olarak ölçüyoruz?", a: "Hacmi metreküp olarak ölçüyoruz çünkü hacim, bir nesnenin üç boyutta kapladığı alanı ölçer. Metre bir uzunluk ölçüsü olduğundan, metreküp (m³) üç boyutlu bir niceliği temsil eder." }
                ]
            }
        }
    }[language];

    const unitKeys = ['ml', 'l', 'gal', 'qt', 'pt', 'cup', 'floz', 'tbsp', 'tsp', 'm3', 'ft3'];

    return (
        <div className="page-container">
            <Navbar />
            <div className="tool-content">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="tool-icon">💧</div>
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>

                    <div className="converter-grid">
                        {unitKeys.map((key) => (
                            <div key={key} className="input-group">
                                <label>{t.units[key]}</label>
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

                <div className="info-section">
                    <h2>{t.content.introTitle}</h2>
                    <p>{t.content.introText}</p>
                    <ul>
                        {t.content.introList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <p className="note">{t.content.introNote}</p>

                    <h2>{t.content.chartTitle}</h2>
                    <p>{t.content.chartText}</p>
                    <div className="chart-container">
                        <table className="conversion-table">
                            <thead>
                                <tr>
                                    {t.content.chartHeaders.map((h, i) => <th key={i}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {t.content.chartRows.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => <td key={j}>{cell}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h2>{t.content.howtoTitle}</h2>
                    <p>{t.content.howtoText}</p>

                    <h2>{t.content.faqTitle}</h2>
                    <div className="faq-list">
                        {t.content.faqs.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <h3>{faq.q}</h3>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />

            <style>{`
                .page-container {
                    min-height: 100vh;
                    background: #0a0a0a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                }

                .tool-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 4rem 1.5rem;
                    gap: 4rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }

                .tool-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    padding: 3rem;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }

                .tool-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .tool-icon {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                }

                .tool-header h1 {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .tool-header p {
                    color: #94a3b8;
                }

                .converter-grid {
                    display: grid;
                    gap: 1.5rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .input-group label {
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .input-group input[type="number"] {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-size: 1.25rem;
                    width: 100%;
                    transition: all 0.2s;
                }

                .input-group input[type="number"]:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: rgba(59, 130, 246, 0.1);
                }

                .info-section {
                    max-width: 800px;
                    width: 100%;
                    color: #cbd5e1;
                    line-height: 1.7;
                }

                .info-section h2 {
                    color: white;
                    font-size: 1.75rem;
                    margin: 3rem 0 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 0.5rem;
                }

                .info-section h2:first-child {
                    margin-top: 0;
                }

                .info-section p {
                    margin-bottom: 1.5rem;
                }

                .info-section ul {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 0.5rem;
                }

                .info-section li {
                    margin-bottom: 0.5rem;
                }

                .note {
                    font-style: italic;
                    color: #94a3b8;
                    font-size: 0.9rem;
                }

                .chart-container {
                    overflow-x: auto;
                    margin-bottom: 2rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .conversion-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: rgba(255, 255, 255, 0.02);
                }

                .conversion-table th,
                .conversion-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .conversion-table th {
                    background: rgba(255, 255, 255, 0.05);
                    font-weight: 600;
                    color: white;
                }

                .conversion-table tr:last-child td {
                    border-bottom: none;
                }

                .faq-list {
                    display: grid;
                    gap: 1.5rem;
                }

                .faq-item {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.5rem;
                }

                .faq-item h3 {
                    color: #e2e8f0;
                    font-size: 1.1rem;
                    margin-bottom: 0.75rem;
                }

                .faq-item p {
                    margin-bottom: 0;
                    color: #94a3b8;
                }

                @media (max-width: 768px) {
                    .tool-content {
                        padding: 2rem 1rem;
                    }
                    
                    .tool-card {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default UnitConverter;
