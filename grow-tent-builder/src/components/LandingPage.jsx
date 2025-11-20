import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';

const translations = {
    en: {
        title: "Design Your Perfect Harvest",
        subtitle: "Advanced simulation for serious growers. Calculate PPFD, estimate costs, and optimize your environment before you buy.",
        cta: "Start Building Now",
        features: {
            ppfd: {
                title: "PPFD Simulation",
                description: "Visualize light intensity and coverage with our advanced heatmap engine."
            },
            cost: {
                title: "Cost Estimator",
                description: "Calculate monthly electricity costs based on your local rates and equipment."
            },
            environment: {
                title: "Environment Control",
                description: "Match ventilation and filtration to your specific tent dimensions."
            }
        },
        costTool: {
            title: "Quick Cost Calculator",
            subtitle: "Estimate your monthly electricity costs",
            power: "Total Power (Watts)",
            hours: "Hours per Day",
            rate: "Electricity Rate ($/kWh)",
            calculate: "Calculate",
            result: "Estimated Monthly Cost"
        }
    },
    tr: {
        title: "Mükemmel Hasadınızı Tasarlayın",
        subtitle: "Ciddi yetiştiriciler için gelişmiş simülasyon. PPFD hesaplayın, maliyetleri tahmin edin ve satın almadan önce ortamınızı optimize edin.",
        cta: "Hemen Başla",
        features: {
            ppfd: {
                title: "PPFD Simülasyonu",
                description: "Gelişmiş ısı haritası motorumuzla ışık yoğunluğunu ve kapsamını görselleştirin."
            },
            cost: {
                title: "Maliyet Hesaplayıcı",
                description: "Yerel tarifelerinize ve ekipmanınıza göre aylık elektrik maliyetlerini hesaplayın."
            },
            environment: {
                title: "Ortam Kontrolü",
                description: "Havalandırma ve filtrasyonu çadır boyutlarınıza göre eşleştirin."
            }
        },
        costTool: {
            title: "Hızlı Maliyet Hesaplayıcı",
            subtitle: "Aylık elektrik maliyetlerinizi tahmin edin",
            power: "Toplam Güç (Watt)",
            hours: "Günlük Saat",
            rate: "Elektrik Tarifesi (₺/kWh)",
            calculate: "Hesapla",
            result: "Tahmini Aylık Maliyet"
        }
    }
};

export default function LandingPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const { hasSeenOnboarding } = useOnboarding();
    const navigate = useNavigate();

    // Detect system language
    const [language, setLanguage] = useState(() => {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('tr') ? 'tr' : 'en';
    });

    const t = translations[language];

    const handleStartBuilding = () => {
        if (hasSeenOnboarding()) {
            navigate('/builder');
        } else {
            navigate('/onboarding');
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1
            });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="landing-container">
            {/* Language Toggle */}
            <div className="lang-toggle">
                <button
                    onClick={() => setLanguage('en')}
                    className={language === 'en' ? 'active' : ''}
                >
                    EN
                </button>
                <button
                    onClick={() => setLanguage('tr')}
                    className={language === 'tr' ? 'active' : ''}
                >
                    TR
                </button>
            </div>

            {/* Animated Background */}
            <div className="landing-bg">
                <div className="glow-orb orb-1" style={{
                    transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
                }} />
                <div className="glow-orb orb-2" style={{
                    transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`
                }} />
                <div className="grid-overlay" />
            </div>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content fade-in-up">
                    <div className="badge">🌱 Professional Grow Planner</div>
                    <h1 className="hero-title">
                        {t.title.split(' ').slice(0, 2).join(' ')} <br />
                        <span className="gradient-text">{t.title.split(' ').slice(2).join(' ')}</span>
                    </h1>
                    <p className="hero-subtitle">
                        {t.subtitle}
                    </p>
                    <button onClick={handleStartBuilding} className="cta-button">
                        {t.cta}
                        <span className="arrow">→</span>
                    </button>
                </div>

                {/* 3D-like Visual Representation */}
                <div className="hero-visual" style={{
                    transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`
                }}>
                    <div className="tent-frame">
                        <div className="plant-icon">🌿</div>
                        <div className="light-beam" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="feature-card slide-in" style={{ transitionDelay: '0.1s' }}>
                    <div className="feature-icon">💡</div>
                    <h3>{t.features.ppfd.title}</h3>
                    <p>{t.features.ppfd.description}</p>
                </div>
                <div className="feature-card slide-in" style={{ transitionDelay: '0.3s' }}>
                    <div className="feature-icon">🌬️</div>
                    <h3>{t.features.environment.title}</h3>
                    <p>{t.features.environment.description}</p>
                </div>
            </section>

            {/* Cost Calculator Tool */}
            <section className="cost-tool-section">
                <div className="cost-tool-container">
                    <div className="cost-tool-header">
                        <h2>⚡ {t.costTool.title}</h2>
                        <p>{t.costTool.subtitle}</p>
                    </div>
                    <div className="cost-tool-inputs">
                        <div className="input-group">
                            <label>{t.costTool.power}</label>
                            <input
                                type="number"
                                id="power-input"
                                placeholder="300"
                                defaultValue="300"
                            />
                        </div>
                        <div className="input-group">
                            <label>{t.costTool.hours}</label>
                            <input
                                type="number"
                                id="hours-input"
                                placeholder="18"
                                defaultValue="18"
                            />
                        </div>
                        <div className="input-group">
                            <label>{t.costTool.rate}</label>
                            <input
                                type="number"
                                step="0.01"
                                id="rate-input"
                                placeholder="0.12"
                                defaultValue="0.12"
                            />
                        </div>
                    </div>
                    <button
                        className="calc-button"
                        onClick={() => {
                            const power = parseFloat(document.getElementById('power-input').value) || 0;
                            const hours = parseFloat(document.getElementById('hours-input').value) || 0;
                            const rate = parseFloat(document.getElementById('rate-input').value) || 0;
                            const monthlyCost = (power / 1000) * hours * 30 * rate;
                            document.getElementById('cost-result').textContent =
                                `${t.costTool.result}: ${language === 'tr' ? '₺' : '$'}${monthlyCost.toFixed(2)}`;
                        }}
                    >
                        {t.costTool.calculate}
                    </button>
                    <div id="cost-result" className="cost-result"></div>
                </div>
            </section>

            <style>{`
                .landing-container {
                    min-height: 100vh;
                    background: #0a0a0a;
                    color: white;
                    overflow-x: hidden;
                    position: relative;
                }

                .lang-toggle {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    z-index: 100;
                    display: flex;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.25rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .lang-toggle button {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .lang-toggle button.active {
                    background: #10b981;
                    color: white;
                }

                .lang-toggle button:hover:not(.active) {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }

                .landing-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    pointer-events: none;
                }

                .glow-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.4;
                    transition: transform 0.1s ease-out;
                }

                .orb-1 {
                    width: 400px;
                    height: 400px;
                    background: #10b981;
                    top: -100px;
                    right: -100px;
                }

                .orb-2 {
                    width: 300px;
                    height: 300px;
                    background: #3b82f6;
                    bottom: -50px;
                    left: -50px;
                }

                .grid-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                    mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
                }

                .hero-section {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 10%;
                    position: relative;
                    z-index: 1;
                }

                .hero-content {
                    max-width: 600px;
                }

                .badge {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    border-radius: 999px;
                    color: #10b981;
                    font-weight: 600;
                    font-size: 0.875rem;
                    margin-bottom: 1.5rem;
                }

                .hero-title {
                    font-size: 4.5rem;
                    line-height: 1.1;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.02em;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: #94a3b8;
                    margin-bottom: 2.5rem;
                    line-height: 1.6;
                }

                .cta-button {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    font-size: 1.125rem;
                    font-weight: 600;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
                }

                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
                    background: #059669;
                }

                .arrow {
                    transition: transform 0.3s ease;
                }

                .cta-button:hover .arrow {
                    transform: translateX(4px);
                }

                .hero-visual {
                    width: 400px;
                    height: 400px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                }

                .tent-frame {
                    font-size: 8rem;
                    position: relative;
                }

                .light-beam {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 100px;
                    height: 200px;
                    background: linear-gradient(to bottom, rgba(255, 255, 0, 0.2), transparent);
                    clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
                    filter: blur(5px);
                }

                .features-section {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    padding: 4rem 10%;
                    position: relative;
                    z-index: 1;
                    background: rgba(0, 0, 0, 0.3);
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 2rem;
                    border-radius: 1rem;
                    transition: all 0.3s ease;
                }

                .feature-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .feature-card h3 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: white;
                }

                .feature-card p {
                    color: #94a3b8;
                    line-height: 1.5;
                }

                /* Cost Calculator Tool */
                .cost-tool-section {
                    padding: 4rem 10%;
                    position: relative;
                    z-index: 1;
                    background: rgba(16, 185, 129, 0.05);
                }

                .cost-tool-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.5rem;
                    padding: 3rem;
                }

                .cost-tool-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .cost-tool-header h2 {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                    color: white;
                }

                .cost-tool-header p {
                    color: #94a3b8;
                }

                .cost-tool-inputs {
                    display: grid;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
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

                .input-group input {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                }

                .input-group input:focus {
                    outline: none;
                    border-color: #10b981;
                    background: rgba(255, 255, 255, 0.08);
                }

                .calc-button {
                    width: 100%;
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .calc-button:hover {
                    background: #059669;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .cost-result {
                    text-align: center;
                    margin-top: 1.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #10b981;
                    min-height: 2rem;
                }

                /* Animations */
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .fade-in-up {
                    animation: fadeInUp 1s ease-out forwards;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .hero-section {
                        flex-direction: column;
                        text-align: center;
                        padding-top: 4rem;
                        justify-content: center;
                    }

                    .hero-content {
                        margin-bottom: 3rem;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .hero-visual {
                        width: 280px;
                        height: 280px;
                        margin: 0 auto;
                    }

                    .cta-button {
                        margin: 0 auto;
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}
