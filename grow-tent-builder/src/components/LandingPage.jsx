import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';

export default function LandingPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const { hasSeenOnboarding } = useOnboarding();
    const navigate = useNavigate();

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
                        Design Your <br />
                        <span className="gradient-text">Perfect Harvest</span>
                    </h1>
                    <p className="hero-subtitle">
                        Advanced simulation for serious growers. Calculate PPFD, estimate costs,
                        and optimize your environment before you buy.
                    </p>
                    <button onClick={handleStartBuilding} className="cta-button">
                        Start Building Now
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
                    <h3>PPFD Simulation</h3>
                    <p>Visualize light intensity and coverage with our advanced heatmap engine.</p>
                </div>
                <div className="feature-card slide-in" style={{ transitionDelay: '0.2s' }}>
                    <div className="feature-icon">⚡</div>
                    <h3>Cost Estimator</h3>
                    <p>Calculate monthly electricity costs based on your local rates and equipment.</p>
                </div>
                <div className="feature-card slide-in" style={{ transitionDelay: '0.3s' }}>
                    <div className="feature-icon">🌬️</div>
                    <h3>Environment Control</h3>
                    <p>Match ventilation and filtration to your specific tent dimensions.</p>
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
