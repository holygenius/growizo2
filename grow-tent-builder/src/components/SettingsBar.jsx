import { useSettings, CURRENCIES } from '../context/SettingsContext';

export default function SettingsBar() {
    const {
        language, setLanguage,
        currency, setCurrency,
        unitSystem, setUnitSystem
    } = useSettings();

    const isMobile = window.innerWidth <= 768;

    return (
        <div className="glass-header" style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '0.75rem 0'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                {/* Logo */}
                <div style={{
                    fontWeight: '700',
                    fontSize: '1.25rem',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: 'fit-content'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🌿</span> GrowBuilder
                </div>

                {/* Settings Group */}
                <div className="settings-stack-mobile" style={{
                    display: 'flex',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    alignItems: 'center'
                }}>
                    {/* Language Toggle */}
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="modern-select lang-select"
                    >
                        <option value="en">🇺🇸</option>
                        <option value="tr">🇹🇷</option>
                    </select>

                    {/* Currency Toggle */}
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="modern-select currency-select"
                    >
                        {Object.keys(CURRENCIES).map(c => (
                            <option key={c} value={c}>{CURRENCIES[c].symbol}</option>
                        ))}
                    </select>

                    {/* Unit Toggle */}
                    <select
                        value={unitSystem}
                        onChange={(e) => setUnitSystem(e.target.value)}
                        className="modern-select unit-select"
                    >
                        <option value="IMPERIAL">ft</option>
                        <option value="METRIC">cm</option>
                    </select>
                </div>
            </div>
            <style>{`
                .modern-select {
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-full);
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    outline: none;
                    white-space: nowrap;
                    line-height: 1.2;
                }
                .modern-select:hover, .modern-select:focus {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
                }
                
                /* Mobile specific fixes */
                @media (max-width: 768px) {
                    .glass-header {
                        padding: 0.4rem 0 !important;
                    }
                    .glass-header .container {
                        gap: 0.5rem !important;
                        padding: 0 0.5rem !important;
                    }
                    .glass-header .container > div:first-child {
                        font-size: 1rem !important;
                        gap: 0.25rem !important;
                    }
                    .glass-header .container > div:first-child span {
                        font-size: 1.25rem !important;
                    }
                    .settings-stack-mobile {
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        gap: 0.35rem !important;
                        align-items: center !important;
                    }
                    .modern-select {
                        padding: 0.35rem 0.5rem;
                        font-size: 1.1rem;
                        min-width: 40px;
                        text-align: center;
                    }
                }
                
                @media (max-width: 480px) {
                    .glass-header .container > div:first-child {
                        display: none !important;
                    }
                    .settings-stack-mobile {
                        gap: 0.25rem !important;
                    }
                    .modern-select {
                        padding: 0.3rem 0.4rem;
                        font-size: 1rem;
                        min-width: 36px;
                    }
                }
            `}</style>
        </div>
    );
}
