import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const CostCalculator = () => {
    const { language } = useSettings();
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

    const t = {
        en: {
            title: "Electricity Cost Calculator",
            subtitle: "Calculate the cost of running your grow equipment",
            inputs: {
                power: "Power consumption",
                time: "Usage time",
                price: "Energy price",
                energy: "Energy consumed",
                cost: "Cost"
            },
            units: {
                w: "W",
                hrs: "hrs",
                min: "min",
                kwh: "kWh",
                currency: "$"
            },
            content: {
                introTitle: "How to calculate electricity cost",
                introText: "If you're wondering how much electricity costs, all you need to know is the power consumption of your electrical device, how long it runs, and the actual energy prices offered by your supplier. The calculation runs in two steps.",
                introSteps: [
                    "First, multiply power consumption of your device by usage time to find how much energy your device consumed: power consumption × usage time = energy consumed",
                    "Then, check the electricity cost per kWh from your local energy supplier and multiply it by the amount of energy consumed: cost = energy consumed × energy price"
                ],
                introExample: "Example: 700W vacuum for 30 mins. 700W × 0.5h = 350Wh = 0.35 kWh. 0.35 kWh × $0.14/kWh = $0.05.",
                worksTitle: "How electricity cost – single usage calculator works",
                worksText: "Our electricity cost – single usage calculator needs just a few steps to tell you how much electricity costs once the selected device is running:",
                worksList: [
                    "Determine power consumption of your device in watts.",
                    "Enter usage time (hours and minutes).",
                    "The calculator returns the energy consumed in kWh.",
                    "Enter the actual electricity cost per kWh to see the total cost."
                ],
                tipsTitle: "How to lower your electric bill",
                tipsList: [
                    "Get a home energy audit.",
                    "Switch to dimmer switches.",
                    "Keep your fridge and freezer closed.",
                    "Keep the air circulating in your home with ceiling fans.",
                    "Eliminate phantom loads from televisions, computers, etc.",
                    "Switch to LED light bulbs.",
                    "Shade your home with trees, curtains, and blinds.",
                    "Use cool water for laundry.",
                    "Wash laundry in full loads or use 'eco' mode.",
                    "Install a water heater timer.",
                    "Check if your home is properly insulated."
                ],
                faqTitle: "FAQs",
                faqs: [
                    { q: "How to calculate my electric bill?", a: "Get the power of each device, multiply by operating time to get energy consumption (convert to kWh), then multiply by electricity cost." },
                    { q: "How much does it cost to run a 1500 watt oven?", a: "$0.36 for 1.5 hours at $0.16/kWh. (1500W × 1.5h = 2.25 kWh. 2.25 kWh × $0.16 = $0.36)." },
                    { q: "What uses a lot of electricity?", a: "Electrical heaters, water heaters, and HVAC systems consume a lot of electricity." },
                    { q: "Is 100 kWh per day a lot?", a: "Yes. 100 kWh/day = 3000 kWh/month, which exceeds the U.S. average of 893 kWh/month." }
                ]
            }
        },
        tr: {
            title: "Elektrik Maliyeti Hesaplayıcı",
            subtitle: "Ekipmanlarınızı çalıştırmanın maliyetini hesaplayın",
            inputs: {
                power: "Güç tüketimi",
                time: "Kullanım süresi",
                price: "Enerji fiyatı",
                energy: "Tüketilen enerji",
                cost: "Maliyet"
            },
            units: {
                w: "W",
                hrs: "saat",
                min: "dk",
                kwh: "kWh",
                currency: "₺"
            },
            content: {
                introTitle: "Elektrik maliyeti nasıl hesaplanır",
                introText: "Elektriğin ne kadar tuttuğunu merak ediyorsanız, bilmeniz gereken tek şey elektrikli cihazınızın güç tüketimi, ne kadar süre çalıştığı ve tedarikçiniz tarafından sunulan gerçek enerji fiyatlarıdır. Hesaplama iki adımda gerçekleşir.",
                introSteps: [
                    "İlk olarak, cihazınızın ne kadar enerji tükettiğini bulmak için güç tüketimini kullanım süresiyle çarpın: güç tüketimi × kullanım süresi = tüketilen enerji",
                    "Ardından, yerel enerji tedarikçinizden kWh başına elektrik maliyetini kontrol edin ve bunu tüketilen enerji miktarıyla çarpın: maliyet = tüketilen enerji × enerji fiyatı"
                ],
                introExample: "Örnek: 30 dakika boyunca 700W süpürge. 700W × 0.5sa = 350Wh = 0.35 kWh. 0.35 kWh × 0.14₺/kWh = 0.05₺.",
                worksTitle: "Elektrik maliyeti hesaplayıcı nasıl çalışır",
                worksText: "Elektrik maliyeti hesaplayıcımız, seçilen cihaz çalıştığında elektriğin ne kadar tuttuğunu size söylemek için sadece birkaç adıma ihtiyaç duyar:",
                worksList: [
                    "Cihazınızın güç tüketimini watt cinsinden belirleyin.",
                    "Kullanım süresini (saat ve dakika) girin.",
                    "Hesaplayıcı, tüketilen enerjiyi kWh cinsinden döndürür.",
                    "Toplam maliyeti görmek için kWh başına gerçek elektrik maliyetini girin."
                ],
                tipsTitle: "Elektrik faturanızı nasıl düşürürsünüz",
                tipsList: [
                    "Ev enerji denetimi yaptırın.",
                    "Dimmer anahtarlara geçin.",
                    "Buzdolabınızı ve dondurucunuzu kapalı tutun.",
                    "Tavan vantilatörleri ile evinizdeki havayı dolaştırın.",
                    "Televizyonlar, bilgisayarlar vb. cihazlardan kaynaklanan hayalet yükleri ortadan kaldırın.",
                    "LED ampullere geçin.",
                    "Evinizi ağaçlar, perdeler ve panjurlarla gölgeleyin.",
                    "Çamaşır için soğuk su kullanın.",
                    "Çamaşırları tam yükte yıkayın veya 'eko' modunu kullanın.",
                    "Su ısıtıcı zamanlayıcısı takın.",
                    "Evinizin uygun şekilde yalıtılıp yalıtılmadığını kontrol edin."
                ],
                faqTitle: "SSS",
                faqs: [
                    { q: "Elektrik faturamı nasıl hesaplarım?", a: "Her cihazın gücünü alın, enerji tüketimini (kWh'ye çevirin) elde etmek için çalışma süresiyle çarpın, ardından elektrik maliyetiyle çarpın." },
                    { q: "1500 watt'lık bir fırını çalıştırmak ne kadara mal olur?", a: "1.5 saat için 0.16₺/kWh fiyatla 0.36₺. (1500W × 1.5sa = 2.25 kWh. 2.25 kWh × 0.16 = 0.36₺)." },
                    { q: "Ne çok elektrik tüketir?", a: "Elektrikli ısıtıcılar, su ısıtıcıları ve HVAC sistemleri çok fazla elektrik tüketir." },
                    { q: "Günde 100 kWh çok mu?", a: "Evet. Günde 100 kWh = ayda 3000 kWh, bu da ortalamanın oldukça üzerindedir." }
                ]
            }
        }
    }[language];

    return (
        <div className="page-container">
            <Helmet>
                <title>{t.title} | GroWizard</title>
                <meta name="description" content={t.subtitle} />
            </Helmet>
            <Navbar />
            <div className="tool-content">
                <div className="tool-card">
                    <div className="tool-header">
                        <div className="tool-icon">⚡</div>
                        <h1>{t.title}</h1>
                        <p>{t.subtitle}</p>
                    </div>

                    <div className="calculator-form">
                        {/* Power Consumption */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t.inputs.power}</label>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    value={power}
                                    onChange={(e) => setPower(parseFloat(e.target.value) || 0)}
                                />
                                <span className="unit">{t.units.w}</span>
                                <span className="arrow">⌄</span>
                            </div>
                        </div>

                        {/* Usage Time */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t.inputs.time}</label>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper time-wrapper">
                                <div className="time-input">
                                    <input
                                        type="number"
                                        value={hours}
                                        onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="unit">{t.units.hrs}</span>
                                </div>
                                <span className="divider">|</span>
                                <div className="time-input">
                                    <input
                                        type="number"
                                        value={minutes}
                                        onChange={(e) => setMinutes(parseFloat(e.target.value) || 0)}
                                    />
                                    <span className="unit">{t.units.min}</span>
                                </div>
                                <span className="arrow">⌄</span>
                            </div>
                        </div>

                        {/* Energy Consumed (Read-only) */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t.inputs.energy}</label>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper read-only">
                                <span className="value highlight-blue">
                                    {energyConsumed.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </span>
                                <span className="unit highlight-blue">{t.units.kwh}</span>
                            </div>
                        </div>

                        {/* Energy Price */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t.inputs.price}</label>
                                <span className="pin">📌</span>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper">
                                <span className="currency-prefix">{t.units.currency}</span>
                                <input
                                    type="number"
                                    value={price}
                                    step="0.01"
                                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                    className="price-input"
                                />
                                <span className="unit-suffix">/ {t.units.kwh}</span>
                            </div>
                        </div>

                        {/* Total Cost (Read-only) */}
                        <div className="input-group">
                            <div className="label-row">
                                <label>{t.inputs.cost}</label>
                                <span className="dots">•••</span>
                            </div>
                            <div className="input-wrapper read-only cost-wrapper">
                                <span className="currency-prefix highlight-blue">{t.units.currency}</span>
                                <span className="value highlight-blue">
                                    {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>{t.content.introTitle}</h2>
                    <p>{t.content.introText}</p>
                    <ul>
                        {t.content.introSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ul>
                    <p className="example">{t.content.introExample}</p>

                    <h2>{t.content.worksTitle}</h2>
                    <p>{t.content.worksText}</p>
                    <ol>
                        {t.content.worksList.map((item, i) => <li key={i}>{item}</li>)}
                    </ol>

                    <h2>{t.content.tipsTitle}</h2>
                    <ul className="tips-list">
                        {t.content.tipsList.map((tip, i) => <li key={i}>✅ {tip}</li>)}
                    </ul>

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
                    max-width: 500px;
                    width: 100%;
                    color: white;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                }

                .tool-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .tool-icon {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                    color: #f59e0b;
                }

                .tool-header h1 {
                    font-size: 1.75rem;
                    margin-bottom: 0.5rem;
                    color: white;
                    font-weight: 700;
                }

                .tool-header p {
                    color: #94a3b8;
                }

                .calculator-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 600;
                }

                .dots {
                    color: #475569;
                    letter-spacing: 2px;
                    font-size: 1.2rem;
                    line-height: 0.5;
                }

                .input-wrapper {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .input-wrapper:focus-within {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .input-wrapper.read-only {
                    background: rgba(255, 255, 255, 0.02);
                    border-color: rgba(255, 255, 255, 0.05);
                }

                .input-wrapper input {
                    background: transparent;
                    border: none;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: white;
                    width: 100%;
                    outline: none;
                }

                .unit, .unit-suffix, .currency-prefix {
                    color: #3b82f6;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .arrow {
                    color: #3b82f6;
                    font-weight: bold;
                    font-size: 0.8rem;
                }

                .time-wrapper {
                    justify-content: space-between;
                }

                .time-input {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .time-input input {
                    width: 3rem;
                    text-align: right;
                }

                .divider {
                    color: #475569;
                }

                .highlight-blue {
                    color: #3b82f6;
                    font-weight: 700;
                    font-size: 1.25rem;
                }

                .cost-wrapper {
                    padding: 1rem;
                }

                .pin {
                    color: #ef4444;
                    font-size: 0.9rem;
                    transform: rotate(45deg);
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

                .info-section ul, .info-section ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1.5rem;
                }

                .info-section li {
                    margin-bottom: 0.5rem;
                }

                .example {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 0.5rem;
                    border-left: 4px solid #3b82f6;
                    margin-bottom: 1.5rem;
                }

                .tips-list {
                    list-style: none;
                    padding-left: 0 !important;
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

export default CostCalculator;
