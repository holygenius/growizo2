import { useSettings } from '../context/SettingsContext';
import StatsBar from './StatsBar';
import ProgressTracker from './ProgressTracker';
import Footer from './Common/Footer/Footer';

export default function Layout({ children }) {
    const { t, language, setLanguage, currency, setCurrency, unitSystem, setUnitSystem } = useSettings();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
            <StatsBar />

            <main className="container" style={{ flex: 1, padding: 'calc(56px + 1rem) 1rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <ProgressTracker />

                <div className="glass-panel slide-up" style={{
                    padding: '2.5rem',
                    borderRadius: 'var(--radius-lg)',
                    marginTop: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative glow */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
                        pointerEvents: 'none',
                        zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {children}
                    </div>
                </div>
            </main>

            <footer className="no-print" style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                borderTop: '1px solid var(--border-color)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                }}>
                    {/* Language */}
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value="en">🇬🇧 EN</option>
                        <option value="tr">🇹🇷 TR</option>
                    </select>

                    {/* Currency */}
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value="USD">$ USD</option>
                        <option value="EUR">€ EUR</option>
                        <option value="TRY">₺ TRY</option>
                    </select>

                    {/* Units */}
                    <select
                        value={unitSystem}
                        onChange={(e) => setUnitSystem(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        <option value="IMPERIAL">ft</option>
                        <option value="METRIC">cm</option>
                    </select>
                </div>
                <p>{t('footer')}</p>
            </footer>
        </div>
    );
}
