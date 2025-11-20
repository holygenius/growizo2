import { useEffect, useState } from 'react';
import estimateMonthlyCost from '../utils/electricCostEstimator';
import { useSettings } from '../context/SettingsContext';

const STORAGE_KEY = 'electricEstimator.v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore
  }
}

export default function ElectricCostEstimator({ onClose } = {}) {
  const { currency } = useSettings();
  const saved = loadState();

  const [lights, setLights] = useState(saved?.lights || [{ name: 'LED 300W', watt: 300, quantity: 1 }]);
  const [fans, setFans] = useState(saved?.fans || [{ name: 'Inline Fan 100W', watt: 100, quantity: 1 }]);
  const [pricePerKwh, setPricePerKwh] = useState(saved?.pricePerKwh ?? 1.2);
  const [daysPerMonth, setDaysPerMonth] = useState(saved?.daysPerMonth ?? 30);
  const [report, setReport] = useState(null);

  useEffect(() => {
    const r = estimateMonthlyCost({ lights, fans, pricePerKwh: Number(pricePerKwh), daysPerMonth: Number(daysPerMonth) });
    setReport(r);
    saveState({ lights, fans, pricePerKwh, daysPerMonth });
  }, [lights, fans, pricePerKwh, daysPerMonth]);

  // Helpers for device lists
  const updateDevice = (list, setList, idx, patch) => {
    const copy = list.map((it, i) => i === idx ? { ...it, ...patch } : it);
    setList(copy);
  };

  const addDevice = (list, setList, template) => setList([...list, template]);
  const removeDevice = (list, setList, idx) => setList(list.filter((_, i) => i !== idx));

  const symbol = currency || '';

  return (
    <div style={{ width: 520, maxWidth: 'calc(100vw - 32px)', padding: 12, background: 'var(--bg-surface)', boxShadow: '0 8px 24px rgba(2,6,23,0.6)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong>Elektrik Maliyet Tahmincisi</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn small" onClick={() => { saveState({ lights, fans, pricePerKwh, daysPerMonth }); if (onClose) onClose(); }}>Kapat</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label style={{ fontSize: 12 }}>Elektrik fiyatı (kWh)</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="number" step="0.01" min="0" value={pricePerKwh} onChange={(e) => setPricePerKwh(e.target.value)} className="input" />
            <span style={{ fontSize: 14 }}>{currency}</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12 }}>Gün/ay</label>
          <input type="number" min="1" max="31" value={daysPerMonth} onChange={(e) => setDaysPerMonth(e.target.value)} className="input" />
        </div>
      </div>

      <hr style={{ margin: '12px 0', borderColor: 'var(--border-color)' }} />

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 220 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Işıklar</strong>
            <button className="btn small" onClick={() => addDevice(lights, setLights, { name: 'Yeni ışık', watt: 100, quantity: 1 })}>Ekle</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {lights.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input value={d.name} onChange={(e) => updateDevice(lights, setLights, i, { name: e.target.value })} className="input" />
                <input type="number" value={d.watt} onChange={(e) => updateDevice(lights, setLights, i, { watt: Number(e.target.value) })} className="input tiny" />
                <input type="number" value={d.quantity} min={1} onChange={(e) => updateDevice(lights, setLights, i, { quantity: Number(e.target.value) })} className="input tiny" />
                <button className="btn danger" onClick={() => removeDevice(lights, setLights, i)}>Sil</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1 1 200px', minWidth: 200 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Fanlar</strong>
            <button className="btn small" onClick={() => addDevice(fans, setFans, { name: 'Yeni fan', watt: 50, quantity: 1 })}>Ekle</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {fans.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input value={d.name} onChange={(e) => updateDevice(fans, setFans, i, { name: e.target.value })} className="input" />
                <input type="number" value={d.watt} onChange={(e) => updateDevice(fans, setFans, i, { watt: Number(e.target.value) })} className="input tiny" />
                <input type="number" value={d.quantity} min={1} onChange={(e) => updateDevice(fans, setFans, i, { quantity: Number(e.target.value) })} className="input tiny" />
                <button className="btn danger" onClick={() => removeDevice(fans, setFans, i)}>Sil</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={{ margin: '12px 0', borderColor: 'var(--border-color)' }} />

      {report && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>Büyüme (18/6)</strong>
            <span>{report.veg.totalKwh} kWh — {(report.veg.totalCost).toFixed(2)} {currency}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <strong>Çiçeklenme (12/12)</strong>
            <span>{report.flower.totalKwh} kWh — {(report.flower.totalCost).toFixed(2)} {currency}</span>
          </div>

          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer' }}>Detaylı döküm</summary>
            <div style={{ marginTop: 8 }}>
              <strong>Işıklar ve Fanlar (aylık kWh / adet)</strong>
              <ul>
                {report.veg.items.map((it, idx) => (
                  <li key={idx}>{it.name}: {it.monthlyKwh} kWh</li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      )}

      <style>{`
        .input { width: 100%; padding: 8px 10px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-primary); }
        .input.tiny { width: 72px; }
        .btn { background: var(--bg-card); border: 1px solid var(--border-color); padding: 6px 8px; border-radius: 8px; cursor: pointer; }
        .btn.small { padding: 4px 8px; font-size: 0.85rem; }
        .btn.danger { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.18); }

        @media (max-width: 720px) {
          .input.tiny { width: 56px; }
          .btn { padding: 6px 6px; }
        }
      `}</style>
    </div>
  );
}
