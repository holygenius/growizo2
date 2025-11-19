import { useSettings, CURRENCIES, UNITS } from '../context/SettingsContext';

export default function SettingsBar() {
    const {
        language, setLanguage,
        currency, setCurrency,
        unitSystem, setUnitSystem
    } = useSettings();

    return (
        <div className="glass-header" style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '0.75rem 0'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>🌿</span> GrowBuilder
                </div>

                <div className="settings-stack-mobile" style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                    {/* Language Toggle */}
                    <div className="setting-group">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="modern-select"
                        >
                            <option value="en">🇺🇸 English</option>
                            <option value="tr">🇹🇷 Türkçe</option>
                        </select>
                    </div>

                    {/* Currency Toggle */}
                    <div className="setting-group">
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="modern-select"
                        >
                            {Object.keys(CURRENCIES).map(c => (
                                <option key={c} value={c}>{CURRENCIES[c].symbol} {c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Unit Toggle */}
                    <div className="setting-group">
                        <select
                            value={unitSystem}
                            onChange={(e) => setUnitSystem(e.target.value)}
                            className="modern-select"
                        >
                            <option value="IMPERIAL">📏 Imperial (ft)</option>
                            <option value="METRIC">📏 Metric (cm)</option>
                        </select>
                    </div>
                </div>
            </div>
            <style>{`
                .modern-select {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-full);
                    padding: 0.35rem 1rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    outline: none;
                }
                .modern-select:hover, .modern-select:focus {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--color-primary);
                }
                .setting-group {
                    display: flex;
                    align-items: center;
                }
                
                /* Mobile specific fixes */
                @media (max-width: 768px) {
                    .glass-header {
                        padding: 0.5rem 0 !important;
                    }
                    .settings-stack-mobile {
                        flex-direction: row !important;
                        align-items: center !important;
                        gap: 0.5rem !important;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .setting-group {
                        flex: 0 0 auto;
                    }
                    .modern-select {
                        padding: 0.25rem 0.5rem;
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
}
