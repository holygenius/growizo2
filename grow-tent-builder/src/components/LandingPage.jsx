import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { blogPosts } from './Blog/blogData';
import { useSettings } from '../context/SettingsContext';
import Footer from './Footer';
import Navbar from './Navbar';
import './LandingPage.css';

export default function LandingPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    // scrollY is intentionally unused in this component but kept for future effects
    const [, setScrollY] = useState(0);
    const { language, getBuilderUrl, t, getLocalizedPath } = useSettings();
    const navigate = useNavigate();

    const infoBoxItems = [
        { icon: "💡", titleKey: 'landingInfoLight', descKey: 'landingInfoLightDesc' },
        { icon: "🌬️", titleKey: 'landingInfoAir', descKey: 'landingInfoAirDesc' },
        { icon: "🌡️", titleKey: 'landingInfoHumidity', descKey: 'landingInfoHumidityDesc' }
    ];

    const faqItems = language === 'en' ? [
        { q: "Why do plants need light?", a: "To perform photosynthesis." },
        { q: "Why is photosynthesis important?", a: "Plants produce their food this way." },
        { q: "Which plants are suitable for indoor growing?", a: "Herbs, vegetables, flowers." },
        { q: "What happens if I don't install a fan in my grow tent?", a: "Temperature rises, mold forms." },
        { q: "How many hours of light per day during vegetative stage?", a: "16 hours is generally sufficient." },
        { q: "How many hours of light per day during flowering stage?", a: "12 hours is generally sufficient." },
        { q: "Why LED lights?", a: "Efficient, cool, and long-lasting." },
        { q: "How long does germination typically take?", a: "Usually 3 to 10 days." },
        { q: "What should humidity be in the tent during vegetative stage?", a: "50–70% is ideal." }
    ] : [
        { q: "Bitkiler neden yapay ışığa ihtiyaç duyar?", a: "Bitkiler büyümek, gelişmek ve enerji üretmek için fotosentez yapar. İç mekan yetiştiriciliğinde doğal güneş ışığı yeterli olmadığından yapay aydınlatma (özellikle LED grow ışıkları) kullanılır." },
        { q: "Fotosentez neden bitki sağlığı için kritiktir?", a: "Fotosentez, bitkilerin su ve karbondioksiti güneş (veya yapay) ışığı ile şekere dönüştürmesini sağlar. Bu süreç, bitkinin enerji kaynağını oluşturur ve sağlıklı gelişimi mümkün kılar." },
        { q: "İç mekanda hangi bitki türleri yetiştirilebilir?", a: "Aromatik otlar (fesleğen, nane), yapraklı sebzeler (marul, ıspanak) ve bazı çiçekli türler (orkide, sardunya) iç mekan yetiştiriciliğine uygundur. Bu bitkiler sınırlı alanda, kontrollü iklim şartlarında iyi sonuç verir." },
        { q: "Fan olmayan yetiştirme kabininde ne olur?", a: "Fan kullanılmayan kabinlerde hava dolaşımı olmaz, bu da sıcaklık artışına ve nem birikmesine neden olur. Sonuç olarak mantar oluşumu, küf ve bitki hastalıkları riski yükselir." },
        { q: "Büyüme döneminde bitkiye günde kaç saat ışık verilmeli?", a: "Büyüme (vejetatif) aşamasında çoğu bitki 16–18 saatlik ışık süresine ihtiyaç duyar. Bu süre, yaprak gelişimini ve sağlıklı gövde oluşumunu destekler." },
        { q: "Çiçeklenme döneminde ışık süresi ne olmalı?", a: "Çiçeklenme döneminde fotoperiyodik bitkiler için 12 saat ışık, 12 saat karanlık döngüsü uygulanmalıdır. Bu denge, çiçek ve meyve oluşumunu teşvik eder." },
        { q: "LED grow ışıklarının avantajı nedir?", a: "LED bitki lambaları, düşük enerji tüketimi, uzun ömür ve minimal ısı yayımı ile ideal iç mekan aydınlatması sunar. Ayrıca, bitki evresine uygun tam spektrum ışık sağlayabilir." },
        { q: "Tohumlar çimlenme döneminde kaç günde filizlenir?", a: "Çimlenme süresi bitki türüne bağlı olmakla birlikte genellikle 3 ila 10 gün arasında tamamlanır. Bu dönemde nemli ortam ve sabit sıcaklık sağlanmalıdır." },
        { q: "Büyüme döneminde çadır içi nem oranı ne olmalı?", a: "Vejetatif büyüme aşamasında ideal nem oranı %50 ila %70 aralığındadır. Bu nem seviyesi, yaprakların su kaybını dengeleyerek hızlı gelişimi destekler." }
    ];

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleStartBuilding = () => {
        navigate(getBuilderUrl());
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="landing-container">
            <Helmet>
                <title>{t('landingTitle')} | GroWizard</title>
                <meta name="description" content={t('landingSubtitle')} />
            </Helmet>
            <div className="landing-bg">
                <div className="glow-orb orb-1" style={{
                    transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`
                }} />
                <div className="glow-orb orb-2" style={{
                    transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`
                }} />
                <div className="grid-overlay" />
            </div>

            <Navbar />

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content fade-in-up">
                    <div className="badge">{t('landingBadge')}</div>
                    <h1 className="hero-title">
                        {t('landingTitle').split(' ').slice(0, 2).join(' ')} <br />
                        <span className="gradient-text">{t('landingTitle').split(' ').slice(2).join(' ')}</span>
                    </h1>
                    <p className="hero-subtitle">
                        {t('landingSubtitle')}
                    </p>
                    <button onClick={handleStartBuilding} className="cta-button">
                        {t('landingCta')}
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

            {/* Tools Preview Section */}
            <section className="tools-preview-section">
                <div className="section-header">
                    <h2>🛠️ {t('landingGrowTools')}</h2>
                    <p>{t('landingGrowToolsSubtitle')}</p>
                </div>
                <div className="tools-grid">
                    <Link to={getLocalizedPath('/tools/electricity-cost-calculator')} className="tool-preview-card">
                        <div className="tool-icon">⚡</div>
                        <h3>{t('landingCostCalculator')}</h3>
                        <p>{t('landingCostCalculatorDesc')}</p>
                    </Link>
                    <Link to={getLocalizedPath('/tools/unit-converter')} className="tool-preview-card">
                        <div className="tool-icon">💧</div>
                        <h3>{t('landingUnitConverter')}</h3>
                        <p>{t('landingUnitConverterDesc')}</p>
                    </Link>
                    <Link to={getLocalizedPath('/tools/co2-calculator')} className="tool-preview-card">
                        <div className="tool-icon">🌫️</div>
                        <h3>{t('landingCo2Calculator')}</h3>
                        <p>{t('landingCo2CalculatorDesc')}</p>
                    </Link>
                    <Link to={getLocalizedPath('/tools/ppfd-heatmap')} className="tool-preview-card">
                        <div className="tool-icon">☀️</div>
                        <h3>{t('landingPpfdMapTitle')}</h3>
                        <p>{t('landingPpfdMapDesc')}</p>
                    </Link>
                </div>
                <div className="center-btn">
                    <Link to={getLocalizedPath('/tools')} className="secondary-btn">
                        {t('landingViewAllTools')}
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="feature-card slide-in" style={{ transitionDelay: '0.1s' }}>
                    <div className="feature-icon">💡</div>
                    <h3>{t('landingPpfdTitle')}</h3>
                    <p>{t('landingPpfdDesc')}</p>
                </div>
                <div className="feature-card slide-in" style={{ transitionDelay: '0.3s' }}>
                    <div className="feature-icon">🌬️</div>
                    <h3>{t('landingEnvTitle')}</h3>
                    <p>{t('landingEnvDesc')}</p>
                </div>
            </section>

            {/* Info Boxes Section */}
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

            {/* PPFD Map Section */}
            <section className="ppfd-section">
                <div className="section-header">
                    <h2>🌈 {t('landingPpfdMapTitle')}</h2>
                    <p>{t('landingPpfdMapDesc')}</p>
                </div>
                <div className="ppfd-visual-container">
                    <div className="ppfd-card-3d">
                        <div className="ppfd-overlay">
                            <span className="ppfd-badge">3D Mode</span>
                        </div>
                        <div className="ppfd-placeholder-3d">
                            <div className="grid-floor"></div>
                            <div className="heat-cone"></div>
                        </div>
                    </div>
                    <div className="ppfd-card-2d">
                        <div className="ppfd-overlay">
                            <span className="ppfd-badge">2D Mode</span>
                        </div>
                        <div className="ppfd-placeholder-2d">
                            <div className="heat-circle c1"></div>
                            <div className="heat-circle c2"></div>
                            <div className="heat-circle c3"></div>
                        </div>
                    </div>
                </div>
                <div className="center-btn">
                    <Link to={getLocalizedPath('/tools/ppfd-heatmap')} className="cta-button secondary">
                        {t('landingPpfdTitle')} <span className="arrow">→</span>
                    </Link>
                </div>
            </section>

            {/* Feeding Schedules Section */}
            <section className="feeding-section">
                <div className="section-header">
                    <h2>🌱 {t('landingFeedingTitle')}</h2>
                    <p>{t('landingFeedingDesc')}</p>
                </div>
                <div className="feeding-grid">
                    <Link to={getLocalizedPath('/tools/feeding-schedule')} className="feeding-card biobizz">
                        <div className="feeding-icon-wrapper">
                            <img
                                src="/images/cropped-Biobizz-Icon-Brown-Texture-180x180.jpg"
                                alt="BioBizz"
                                className="feeding-icon-img"
                            />
                        </div>
                        <div className="feeding-content">
                            <h3>{t('biobizzTitle')}</h3>
                            <p>{t('biobizzDesc')}</p>
                            <span className="brand-tag">BioBizz</span>
                        </div>
                        <div className="feeding-arrow">→</div>
                    </Link>

                    <Link to={getLocalizedPath('/feeding/advanced-nutrients')} className="feeding-card advanced-nutrients">
                        <div className="feeding-icon-wrapper">
                            <img src="/images/advanced-nutrients-logo.png" alt="Advanced Nutrients" className="feeding-icon-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div className="feeding-content">
                            <h3>{t('anFeedingScheduleTitle')}</h3>
                            <p>{t('anFeedingScheduleSubtitle')}</p>
                            <span className="brand-tag">Advanced Nutrients</span>
                        </div>
                        <div className="feeding-arrow">→</div>
                    </Link>
                </div>
            </section>

            {/* Featured Guides Section (Slider) */}
            <section className="featured-guides-section">
                <div className="section-header">
                    <h2>🌟 {t('landingFeaturedGuides')}</h2>
                    <p>{t('landingFeaturedGuidesSubtitle')}</p>
                </div>

                <div className="slider-container">
                    <button
                        className="slider-btn prev"
                        onClick={() => setCurrentSlide(prev => (prev === 0 ? Math.ceil(blogPosts.length / 2) - 1 : prev - 1))}
                    >
                        ←
                    </button>

                    <div className="slider-track-container">
                        <div
                            className="slider-track"
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`
                            }}
                        >
                            {/* Group posts into pairs for the slider */}
                            {Array.from({ length: Math.ceil(blogPosts.slice(0, 4).length / 2) }).map((_, groupIndex) => (
                                <div key={groupIndex} className="slider-slide">
                                    {blogPosts.slice(0, 4).slice(groupIndex * 2, groupIndex * 2 + 2).map((post) => (
                                        <Link to={getLocalizedPath(`/blog/${post.slug[language]}`)} key={`featured-${post.id}`} className="featured-guide-card">
                                            <div className="guide-content">
                                                <span className="guide-tag">{post.category}</span>
                                                <h3>{post.title[language]}</h3>
                                                <p>{post.excerpt[language]}</p>
                                                <span className="read-more">{t('landingReadMore')}</span>
                                            </div>
                                            <div className="guide-image" style={{ backgroundImage: `url(${post.image})` }} />
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="slider-btn next"
                        onClick={() => setCurrentSlide(prev => (prev === Math.ceil(blogPosts.slice(0, 4).length / 2) - 1 ? 0 : prev + 1))}
                    >
                        →
                    </button>
                </div>

                <div className="slider-dots">
                    {Array.from({ length: Math.ceil(blogPosts.slice(0, 4).length / 2) }).map((_, index) => (
                        <button
                            key={index}
                            className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Cost Calculator Tool */}
            <section className="cost-tool-section">
                <div className="cost-tool-container">
                    <div className="cost-tool-header">
                        <h2>⚡ {t('landingCostToolTitle')}</h2>
                        <p>{t('landingCostToolSubtitle')}</p>
                    </div>
                    <div className="cost-tool-inputs">
                        <div className="input-group">
                            <label>{t('landingCostToolPower')}</label>
                            <input
                                type="number"
                                id="power-input"
                                placeholder="300"
                                defaultValue="300"
                            />
                        </div>
                        <div className="input-group">
                            <label>{t('landingCostToolHours')}</label>
                            <input
                                type="number"
                                id="hours-input"
                                placeholder="18"
                                defaultValue="18"
                            />
                        </div>
                        <div className="input-group">
                            <label>{t('landingCostToolRate')}</label>
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
                                `${t('landingCostToolResult')}: ${language === 'tr' ? '₺' : '$'}${monthlyCost.toFixed(2)}`;
                        }}
                    >
                        {t('landingCostToolCalculate')}
                    </button>
                    <div className="cost-result" id="cost-result">
                        {t('landingCostToolResult')}: {language === 'tr' ? '₺' : '$'}0.00
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="section-header">
                    <h2>❓ {t('landingFaqTitle')}</h2>
                    <p>{t('landingFaqSubtitle')}</p>
                </div>
                <div className="faq-grid">
                    {faqItems.map((item, index) => (
                        <div key={index} className="faq-item">
                            <h3>{item.q}</h3>
                            <p>{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Blog Preview Section */}
            <section className="blog-preview-section">
                <div className="blog-preview-header">
                    <h2>📚 {t('landingLatestArticles')}</h2>
                    <p>{t('landingLatestArticlesSubtitle')}</p>
                </div>
                <div className="blog-preview-grid">
                    {blogPosts.slice(0, 3).map((post) => (
                        <Link to={getLocalizedPath(`/blog/${post.slug[language]}`)} key={post.id} className="blog-preview-card">
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
                    <Link to={getLocalizedPath('/blog')} className="view-all-btn">
                        {t('landingViewAllArticles')}
                    </Link>
                </div>
            </section>

            <Footer />

            {/* Scroll to Top Button */}
            <button
                className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                ↑
            </button>

        </div>
    );
}
