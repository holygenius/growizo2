import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';

export default function StatsBar() {
    const { state } = useBuilder();
    const { formatPrice, t } = useSettings();
    const { cost, power, cfmRequired } = state.totals;

    return (
        <div className="glass-header no-print" style={{
            position: 'sticky',
            top: '56px', // Below navbar (56px height)
            zIndex: 900,
            padding: '1rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div className="mobile-hide" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {t('buildingSetup')}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <StatItem label={t('estCost')} value={formatPrice(cost)} highlight />
                    <StatItem label={t('power')} value={`${power}W`} />
                    <StatItem label={t('reqCFM')} value={`${cfmRequired} CFM`} />
                </div>
            </div>
        </div>
    );
}

function StatItem({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            <span style={{
                fontWeight: '700',
                color: highlight ? 'var(--color-primary)' : 'var(--text-primary)',
                fontSize: '1.1rem',
                textShadow: highlight ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
            }}>{value}</span>
        </div>
    );
}
