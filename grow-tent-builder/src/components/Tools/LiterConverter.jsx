import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Navbar from '../Navbar';
import Footer from '../Footer';

const LiterConverter = () => {
    const { language } = useSettings();
    const [liters, setLiters] = useState('');
    const [gallons, setGallons] = useState('');

    const handleLitersChange = (e) => {
        const val = e.target.value;
        setLiters(val);
        if (val === '') {
            setGallons('');
        } else {
            setGallons((parseFloat(val) * 0.264172).toFixed(3));
        }
    };

    const handleGallonsChange = (e) => {
        const val = e.target.value;
        setGallons(val);
        if (val === '') {
            setLiters('');
        } else {
            setLiters((parseFloat(val) / 0.264172).toFixed(3));
        }
    };

    const t = {
        en: {
            title: "Volume Converter",
            subtitle: "Convert between Liters and US Gallons",
            liters: "Liters (L)",
            gallons: "US Gallons (gal)",
            desc: "Essential for mixing nutrients accurately regardless of your recipe's units."
        },
        tr: {
            title: "Hacim Dönüştürücü",
            subtitle: "Litre ve ABD Galonu arasında dönüşüm yapın",
            liters: "Litre (L)",
            gallons: "ABD Galonu (gal)",
            desc: "Besinlerinizi reçetenizin birimine bakılmaksızın doğru şekilde karıştırmak için gereklidir."
        }
    }[language];

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
                        <div className="input-group">
                            <label>{t.liters}</label>
                            <input
                                type="number"
                                value={liters}
                                onChange={handleLitersChange}
                                placeholder="0"
                            />
                        </div>
                        <div className="exchange-icon">⇄</div>
                        <div className="input-group">
                            <label>{t.gallons}</label>
                            <input
                                type="number"
                                value={gallons}
                                onChange={handleGallonsChange}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="tool-info">
                        <p>{t.desc}</p>
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
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
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
                    margin-bottom: 3rem;
                }

                .tool-icon {
                    font-size: 4rem;
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
                    display: flex;
                    align-items: flex-end;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .exchange-icon {
                    font-size: 2rem;
                    color: #94a3b8;
                    padding-bottom: 0.5rem;
                }

                .input-group {
                    flex: 1;
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
                    padding: 1rem;
                    border-radius: 0.75rem;
                    font-size: 1.25rem;
                    width: 100%;
                    transition: all 0.2s;
                }

                .input-group input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: rgba(255, 255, 255, 0.08);
                }

                .tool-info {
                    text-align: center;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    color: #64748b;
                    font-size: 0.9rem;
                }

                @media (max-width: 600px) {
                    .converter-grid {
                        flex-direction: column;
                        align-items: center;
                    }
                    .exchange-icon {
                        transform: rotate(90deg);
                        padding: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default LiterConverter;
