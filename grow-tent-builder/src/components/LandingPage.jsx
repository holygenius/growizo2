import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';
import { blogPosts } from './Blog/blogData';
import { useSettings } from '../context/SettingsContext';
import Footer from './Footer';
import Navbar from './Navbar';

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
        },
        infoBoxes: {
            title: "Critical Success Factors",
            subtitle: "Essential knowledge for optimal plant growth",
            items: [
                {
                    icon: "💡",
                    title: "Light Intensity Matters",
                    description: "Without proper PPFD levels for your plant type, growth will slow or stop completely."
                },
                {
                    icon: "🌬️",
                    title: "Air Circulation is Essential",
                    description: "Stagnant air increases mold and pest risk; fans are mandatory for healthy growth."
                },
                {
                    icon: "🌡️",
                    title: "Humidity & Temperature Balance",
                    description: "Excessive humidity or heat creates plant stress; controlled environment is crucial."
                }
            ]
        },
        faq: {
            title: "Frequently Asked Questions",
            subtitle: "Everything you need to know about indoor growing",
            items: [
                { q: "Why do plants need light?", a: "To perform photosynthesis." },
                { q: "Why is photosynthesis important?", a: "Plants produce their food this way." },
                { q: "Which plants are suitable for indoor growing?", a: "Herbs, vegetables, flowers." },
                { q: "What happens if I don't install a fan in my grow tent?", a: "Temperature rises, mold forms." },
                { q: "How many hours of light per day during vegetative stage?", a: "16 hours is generally sufficient." },
                { q: "How many hours of light per day during flowering stage?", a: "12 hours is generally sufficient." },
                { q: "Why LED lights?", a: "Efficient, cool, and long-lasting." },
                { q: "How long does germination typically take?", a: "Usually 3 to 10 days." },
                { q: "What should humidity be in the tent during vegetative stage?", a: "50–70% is ideal." }
            ]
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
        },
        infoBoxes: {
            title: "Kritik Başarı Faktörleri",
            subtitle: "Optimal bitki gelişimi için temel bilgiler",
            items: [
                {
                    icon: "💡",
                    title: "Işık Yoğunluğu Önemlidir",
                    description: "Bitkinin türüne uygun PPFD seviyesi olmazsa gelişim yavaşlar veya durur."
                },
                {
                    icon: "🌬️",
                    title: "Hava Sirkülasyonu Şarttır",
                    description: "Durgun hava küf ve haşere riskini artırır; mutlaka fan kullanılmalı."
                },
                {
                    icon: "🌡️",
                    title: "Nem ve Sıcaklık Dengesi",
                    description: "Aşırı nem ya da ısı bitkide stres yaratır; kontrollü ortam şart."
                }
            ]
        },
        faq: {
            title: "Sıkça Sorulan Sorular",
            subtitle: "İç mekan yetiştiriciliği hakkında bilmeniz gerekenler",
            items: [
                { q: "Bitkiler neden yapay ışığa ihtiyaç duyar?", a: "Bitkiler büyümek, gelişmek ve enerji üretmek için fotosentez yapar. İç mekan yetiştiriciliğinde doğal güneş ışığı yeterli olmadığından yapay aydınlatma (özellikle LED grow ışıkları) kullanılır." },
                { q: "Fotosentez neden bitki sağlığı için kritiktir?", a: "Fotosentez, bitkilerin su ve karbondioksiti güneş (veya yapay) ışığı ile şekere dönüştürmesini sağlar. Bu süreç, bitkinin enerji kaynağını oluşturur ve sağlıklı gelişimi mümkün kılar." },
                { q: "İç mekanda hangi bitki türleri yetiştirilebilir?", a: "Aromatik otlar (fesleğen, nane), yapraklı sebzeler (marul, ıspanak) ve bazı çiçekli türler (orkide, sardunya) iç mekan yetiştiriciliğine uygundur. Bu bitkiler sınırlı alanda, kontrollü iklim şartlarında iyi sonuç verir." },
                { q: "Fan olmayan yetiştirme kabininde ne olur?", a: "Fan kullanılmayan kabinlerde hava dolaşımı olmaz, bu da sıcaklık artışına ve nem birikmesine neden olur. Sonuç olarak mantar oluşumu, küf ve bitki hastalıkları riski yükselir." },
                { q: "Büyüme döneminde bitkiye günde kaç saat ışık verilmeli?", a: "Büyüme (vejetatif) aşamasında çoğu bitki 16–18 saatlik ışık süresine ihtiyaç duyar. Bu süre, yaprak gelişimini ve sağlıklı gövde oluşumunu destekler." },
                { q: "Çiçeklenme döneminde ışık süresi ne olmalı?", a: "Çiçeklenme döneminde fotoperiyodik bitkiler için 12 saat ışık, 12 saat karanlık döngüsü uygulanmalıdır. Bu denge, çiçek ve meyve oluşumunu teşvik eder." },
                { q: "LED grow ışıklarının avantajı nedir?", a: "LED bitki lambaları, düşük enerji tüketimi, uzun ömür ve minimal ısı yayımı ile ideal iç mekan aydınlatması sunar. Ayrıca, bitki evresine uygun tam spektrum ışık sağlayabilir." },
                { q: "Tohumlar çimlenme döneminde kaç günde filizlenir?", a: "Çimlenme süresi bitki türüne bağlı olmakla birlikte genellikle 3 ila 10 gün arasında tamamlanır. Bu dönemde nemli ortam ve sabit sıcaklık sağlanmalıdır." },
                { q: "Büyüme döneminde çadır içi nem oranı ne olmalı?", a: "Vejetatif büyüme aşamasında ideal nem oranı %50 ila %70 aralığındadır. Bu nem seviyesi, yaprakların su kaybını dengeleyerek hızlı gelişimi destekler." }
            ]
        }
    }
};

export default function LandingPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    // scrollY is intentionally unused in this component but kept for future effects
    const [, setScrollY] = useState(0);
    const { hasSeenOnboarding } = useOnboarding();
    const navigate = useNavigate();
    const { language } = useSettings();

    // Use page-local translations but driven by global language
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
            <Navbar />
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

            {/* Info Boxes Section */}
            <section className="info-boxes-section">
                <div className="info-boxes-header">
                    <h2>⚠️ {t.infoBoxes.title}</h2>
                    <p>{t.infoBoxes.subtitle}</p>
                </div>
                <div className="info-boxes-container">
                    {t.infoBoxes.items.map((item, index) => (
                        <div
                            key={index}
                            className="info-box"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="info-box-icon">{item.icon}</div>
                            <div className="info-box-content">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
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

            {/* Tools Preview Section */}
            <section className="tools-preview-section">
                <div className="section-header">
                    <h2>🛠️ {language === 'tr' ? 'Yetiştirme Araçları' : 'Grow Tools'}</h2>
                    <p>{language === 'tr' ? 'Başarılı bir hasat için ihtiyacınız olan her şey' : 'Everything you need for a successful harvest'}</p>
                </div>
                <div className="tools-grid">
                    <Link to="/tools/cost-calculator" className="tool-preview-card">
                        <div className="tool-icon">⚡</div>
                        <h3>{language === 'tr' ? 'Maliyet Hesaplayıcı' : 'Cost Calculator'}</h3>
                        <p>{language === 'tr' ? 'Elektrik masraflarınızı hesaplayın' : 'Estimate electricity costs'}</p>
                    </Link>
                    <Link to="/tools/liter-converter" className="tool-preview-card">
                        <div className="tool-icon">💧</div>
                        <h3>{language === 'tr' ? 'Birim Çevirici' : 'Unit Converter'}</h3>
                        <p>{language === 'tr' ? 'Litre ve Galon dönüşümü' : 'Convert Liters & Gallons'}</p>
                    </Link>
                    <Link to="/tools/co2-calculator" className="tool-preview-card">
                        <div className="tool-icon">🌫️</div>
                        <h3>{language === 'tr' ? 'CO2 Hesaplayıcı' : 'CO2 Calculator'}</h3>
                        <p>{language === 'tr' ? 'Optimal CO2 seviyelerini bulun' : 'Find optimal CO2 levels'}</p>
                    </Link>
                </div>
                <div className="center-btn">
                    <Link to="/tools" className="secondary-btn">
                        {language === 'tr' ? 'Tüm Araçları Gör' : 'View All Tools'}
                    </Link>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="faq-header">
                    <h2>❓ {t.faq.title}</h2>
                    <p>{t.faq.subtitle}</p>
                </div>
                <div className="faq-container">
                    {t.faq.items.map((item, index) => (
                        <div
                            key={index}
                            className="faq-item"
                            onClick={(e) => {
                                const answer = e.currentTarget.querySelector('.faq-answer');
                                const icon = e.currentTarget.querySelector('.faq-icon');
                                answer.classList.toggle('open');
                                icon.textContent = answer.classList.contains('open') ? '−' : '+';
                            }}
                        >
                            <div className="faq-question">
                                <span>{item.q}</span>
                                <span className="faq-icon">+</span>
                            </div>
                            <div className="faq-answer">
                                {item.a}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Blog Preview Section */}
            <section className="blog-preview-section">
                <div className="blog-preview-header">
                    <h2>📚 {language === 'tr' ? 'En Son Makaleler' : 'Latest Articles'}</h2>
                    <p>{language === 'tr' ? 'Modern yetiştiricilik tekniklerini keşfedin' : 'Discover modern growing techniques'}</p>
                </div>
                <div className="blog-preview-grid">
                    {blogPosts.slice(0, 3).map((post) => (
                        <Link to={`/blog/${post.slug[language]}`} key={post.id} className="blog-preview-card">
                            <div className="preview-image" style={{ backgroundImage: `url(${post.image})` }} />
                            <div className="preview-content">
                                <span className="preview-tag">{post.category}</span>
                                <h3>{post.title[language]}</h3>
                                <div className="preview-meta">
                                    <span>{post.readTime}</span>
                                    <span className="arrow">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="blog-cta">
                    <Link to="/blog" className="view-all-btn">
                        {language === 'tr' ? 'Tüm Yazıları Gör' : 'View All Articles'}
                    </Link>
                </div>
            </section>

            {/* Featured Guides Section (Additional Blog Section) */}
            <section className="featured-guides-section">
                <div className="section-header">
                    <h2>🌟 {language === 'tr' ? 'Öne Çıkan Rehberler' : 'Featured Guides'}</h2>
                    <p>{language === 'tr' ? 'Uzmanlardan derinlemesine bilgiler' : 'In-depth knowledge from experts'}</p>
                </div>
                <div className="featured-grid">
                    {blogPosts.slice(0, 2).map((post) => (
                        <Link to={`/blog/${post.slug[language]}`} key={`featured-${post.id}`} className="featured-guide-card">
                            <div className="guide-content">
                                <span className="guide-tag">{post.category}</span>
                                <h3>{post.title[language]}</h3>
                                <p>{post.excerpt[language]}</p>
                                <span className="read-more">{language === 'tr' ? 'Devamını Oku →' : 'Read More →'}</span>
                            </div>
                            <div className="guide-image" style={{ backgroundImage: `url(${post.image})` }} />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Footer / Künye */}
            {/* Footer / Künye */}
            <Footer />

            <style>{`
                .landing-container {
                    min-height: 100vh;
                    background: #0a0a0a;
                    color: white;
                    overflow-x: hidden;
                    position: relative;
                }

                /* Footer Styles */
                .landing-footer {
                    background: rgba(15, 23, 42, 0.95);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 2rem 10%;
                    position: relative;
                    z-index: 10;
                }

                .footer-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .footer-info p {
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                .footer-lang-toggle {
                    display: flex;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.25rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .footer-lang-toggle button {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 0.4rem 0.75rem;
                    border-radius: 0.375rem;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }

                .footer-lang-toggle button.active {
                    background: #10b981;
                    color: white;
                }

                .footer-lang-toggle button:hover:not(.active) {
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

                /* Info Boxes Section */
                .info-boxes-section {
                    padding: 4rem 10%;
                    position: relative;
                    z-index: 1;
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%);
                }

                .info-boxes-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .info-boxes-header h2 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    color: white;
                }

                .info-boxes-header p {
                    color: #94a3b8;
                    font-size: 1.125rem;
                }

                .info-boxes-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .info-box {
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px solid rgba(245, 158, 11, 0.2);
                    border-radius: 1rem;
                    padding: 2rem;
                    display: flex;
                    gap: 1.5rem;
                    align-items: flex-start;
                    transition: all 0.3s ease;
                    opacity: 0;
                    animation: slideInUp 0.6s ease-out forwards;
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .info-box:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(245, 158, 11, 0.5);
                    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2);
                }

                .info-box-icon {
                    font-size: 3rem;
                    flex-shrink: 0;
                    filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.3));
                }

                .info-box-content {
                    flex: 1;
                }

                .info-box-content h3 {
                    font-size: 1.25rem;
                    margin-bottom: 0.75rem;
                    color: #fbbf24;
                    font-weight: 700;
                }

                .info-box-content p {
                    color: #cbd5e1;
                    line-height: 1.6;
                    font-size: 0.95rem;
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
                    margin-top: 1.5rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #fbbf24;
                    text-align: center;
                    min-height: 1.5em;
                }

                /* Tools Preview Section */
                .tools-preview-section {
                    padding: 4rem 10%;
                    background: rgba(0, 0, 0, 0.2);
                    position: relative;
                    z-index: 1;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .section-header h2 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    color: white;
                }

                .section-header p {
                    color: #94a3b8;
                    font-size: 1.125rem;
                }

                .tools-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .tool-preview-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 2rem;
                    border-radius: 1rem;
                    text-align: center;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .tool-preview-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .tool-preview-card .tool-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }

                .tool-preview-card h3 {
                    color: white;
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                }

                .tool-preview-card p {
                    color: #94a3b8;
                    font-size: 0.9rem;
                }

                .center-btn {
                    text-align: center;
                }

                .secondary-btn {
                    display: inline-block;
                    padding: 0.75rem 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.5rem;
                    color: white;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .secondary-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: white;
                }

                /* Featured Guides Section */
                .featured-guides-section {
                    padding: 4rem 10%;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8));
                    position: relative;
                    z-index: 1;
                }

                .featured-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 2rem;
                }

                .featured-guide-card {
                    display: flex;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 1rem;
                    overflow: hidden;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    height: 250px;
                }

                .featured-guide-card:hover {
                    transform: translateY(-5px);
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .guide-content {
                    flex: 1;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .guide-image {
                    width: 40%;
                    background-size: cover;
                    background-position: center;
                }

                .guide-tag {
                    color: #3b82f6;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 0.5rem;
                }

                .guide-content h3 {
                    color: white;
                    font-size: 1.5rem;
                    margin-bottom: 0.75rem;
                    line-height: 1.2;
                }

                .guide-content p {
                    color: #94a3b8;
                    font-size: 0.95rem;
                    margin-bottom: 1rem;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .read-more {
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-top: auto;
                }

                @media (max-width: 768px) {
                    .featured-guide-card {
                        flex-direction: column-reverse;
                        height: auto;
                    }
                    .guide-image {
                        width: 100%;
                        height: 200px;
                    }
                }
                    text-align: center;
                    margin-top: 1.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #10b981;
                    min-height: 2rem;
                }

                /* FAQ Section */
                .faq-section {
                    padding: 4rem 10%;
                    position: relative;
                    z-index: 1;
                }

                .faq-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .faq-header h2 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    color: white;
                }

                .faq-header p {
                    color: #94a3b8;
                    font-size: 1.125rem;
                }

                .faq-container {
                    max-width: 800px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .faq-item {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .faq-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(16, 185, 129, 0.3);
                }

                .faq-question {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                    color: white;
                    font-size: 1.125rem;
                }

                .faq-icon {
                    font-size: 1.5rem;
                    color: #10b981;
                    font-weight: 300;
                    min-width: 24px;
                    text-align: center;
                }

                .faq-answer {
                    max-height: 0;
                    overflow: hidden;
                    color: #94a3b8;
                    line-height: 1.6;
                    transition: max-height 0.3s ease, margin-top 0.3s ease;
                }

                .faq-answer.open {
                    max-height: 200px;
                    margin-top: 1rem;
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

                    .info-boxes-container {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .info-box {
                        flex-direction: column;
                        text-align: center;
                        align-items: center;
                    }

                    .info-box-icon {
                        font-size: 2.5rem;
                    }

                    .info-boxes-header h2 {
                        font-size: 1.75rem;
                    }

                    .footer-content {
                        flex-direction: column;
                        text-align: center;
                    }

                    .badge {
                        font-size: 0.75rem;
                        padding: 0.4rem 0.8rem;
                    }

                    /* Cost Calculator Mobile Fixes */
                    .cost-tool-section {
                        padding: 2rem 5%;
                    }

                    .cost-tool-container {
                        padding: 1.5rem;
                    }

                    .cost-tool-header h2 {
                        font-size: 1.5rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        line-height: 1.4;
                    }

                    .input-group input {
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .cost-tool-inputs {
                        width: 100%;
                    }
                }
                /* Blog Preview Section */
                .blog-preview-section {
                    padding: 6rem 10%;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(16, 185, 129, 0.05));
                    position: relative;
                    z-index: 1;
                }

                .blog-preview-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .blog-preview-header h2 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                    color: white;
                }

                .blog-preview-header p {
                    color: #94a3b8;
                }

                .blog-preview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto 3rem;
                }

                .blog-preview-card {
                    background: rgba(30, 41, 59, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1rem;
                    overflow: hidden;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .blog-preview-card:hover {
                    transform: translateY(-5px);
                    border-color: #10b981;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .preview-image {
                    height: 200px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .preview-image::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent);
                }

                .preview-content {
                    padding: 1.5rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .preview-tag {
                    color: #10b981;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }

                .preview-content h3 {
                    color: white;
                    font-size: 1.25rem;
                    margin-bottom: 1rem;
                    line-height: 1.4;
                    flex: 1;
                }

                .preview-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                .blog-cta {
                    text-align: center;
                }

                .view-all-btn {
                    display: inline-block;
                    padding: 0.75rem 2rem;
                    border: 1px solid #10b981;
                    color: #10b981;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .view-all-btn:hover {
                    background: #10b981;
                    color: white;
                }
            `}</style>
        </div >
    );
}
