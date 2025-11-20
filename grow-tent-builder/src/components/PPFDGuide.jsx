import React, { useState } from 'react';

export default function PPFDGuide() {
    const [isOpen, setIsOpen] = useState(false);

    const data = [
        { range: '0 - 100', color: '#000000', bg: '#333', label: 'Yetersiz', desc: 'Fotosentez başlamaz, bitki ölür.', effect: 'Yetersiz Işık' },
        { range: '100 - 300', color: '#0000FF', bg: 'rgba(0, 0, 255, 0.2)', label: 'Fide / Klon', desc: 'Köklendirme ve ilk yaprak gelişimi için ideal.', effect: 'Köklenme' },
        { range: '300 - 600', color: '#008000', bg: 'rgba(0, 128, 0, 0.2)', label: 'Vejetatif', desc: 'Sağlıklı gövde ve yaprak büyümesi.', effect: 'Büyüme' },
        { range: '600 - 900', color: '#FFA500', bg: 'rgba(255, 165, 0, 0.2)', label: 'Çiçeklenme', desc: 'Yüksek verimli çiçek/meyve üretimi.', effect: 'Verim' },
        { range: '900 - 1200', color: '#FF0000', bg: 'rgba(255, 0, 0, 0.2)', label: 'Yüksek Yoğunluk', desc: 'Deneyimli yetiştirici seviyesi. Dikkatli besleme gerektirir.', effect: 'Stres Riski' },
        { range: '> 1200', color: '#FFFFFF', bg: 'rgba(255, 255, 255, 0.3)', label: 'CO2 / Yanık Riski', desc: 'CO2 olmadan yaprak hasarı oluşur. Sadece profesyonel sistemler.', effect: 'Tehlike' },
    ];

    return (
        <div style={{ marginTop: '1rem', position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 auto',
                    transition: 'all 0.2s ease',
                    minHeight: '44px', // Touch-friendly
                    justifyContent: 'center'
                }}
            >
                ℹ️ PPFD Rehberi {isOpen ? '▲' : '▼'}
            </button>

            {isOpen && (
                <div className="fade-in" style={{
                    marginTop: '1rem',
                    background: 'rgba(30, 30, 30, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    padding: '1rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}>
                    {/* Desktop Table View */}
                    <div className="desktop-view">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>PPFD (μmol/m²/s)</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Durum</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Açıklama</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Etki</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr
                                        key={index}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            background: row.bg,
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{row.range}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                background: row.color,
                                                marginRight: '0.5rem',
                                                border: row.color === '#FFFFFF' || row.color === '#000000' ? '1px solid #555' : 'none'
                                            }}></span>
                                            {row.label}
                                        </td>
                                        <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{row.desc}</td>
                                        <td style={{ padding: '0.75rem', fontStyle: 'italic' }}>{row.effect}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="mobile-view" style={{ display: 'none', flexDirection: 'column', gap: '0.75rem' }}>
                        {data.map((row, index) => (
                            <div key={index} style={{
                                background: row.bg,
                                borderRadius: 'var(--radius-sm)',
                                padding: '1rem',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{row.range}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: row.color,
                                            marginRight: '0.5rem',
                                            border: row.color === '#FFFFFF' || row.color === '#000000' ? '1px solid #555' : 'none'
                                        }}></span>
                                        {row.label}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {row.desc}
                                </div>
                                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                    Etki: {row.effect}
                                </div>
                            </div>
                        ))}
                    </div>

                    <style>{`
                        @media (max-width: 768px) {
                            .desktop-view {
                                display: none;
                            }
                            .mobile-view {
                                display: flex !important;
                            }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
