import { useEffect, useState, useMemo } from 'react';
import estimateMonthlyCost from '../utils/electricCostEstimator';
import { useSettings } from '../context/SettingsContext';
import { useBuilder } from '../context/BuilderContext';
import styles from './ElectricCostEstimator.module.css';

const STORAGE_KEY = 'electricEstimator.v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// Helper to convert builder items (which may use `watts`) to estimator device shape ({name, watt, quantity, hoursPerDay?})
const fromBuilderItems = (items = []) => items.map(i => ({
  name: i.name || i.title || 'unknown',
  watt: Number(i.watts || i.watt || 0),
  quantity: i.quantity || 1,
  hoursPerDay: i.hoursPerDay
}));

export default function ElectricCostEstimator({ onClose } = {}) {
  const { currency, t } = useSettings();
  const saved = loadState();
  const { state: builderState } = useBuilder();

  // Initialize lists: prefer builder-selected items when present, otherwise saved, otherwise sensible defaults
  const initialLights = (builderState?.selectedItems?.lighting?.length > 0)
    ? fromBuilderItems(builderState.selectedItems.lighting)
    : (saved?.lights || [{ name: t('defaultLightName'), watt: 300, quantity: 1 }]);

  const initialFans = (builderState?.selectedItems?.ventilation?.length > 0)
    ? fromBuilderItems(builderState.selectedItems.ventilation)
    : (saved?.fans || [{ name: t('defaultFanName'), watt: 100, quantity: 1 }]);

  const [lights, setLights] = useState(initialLights);
  const [fans, setFans] = useState(initialFans);
  const [pricePerKwh, setPricePerKwh] = useState(saved?.pricePerKwh ?? 1.2);
  const [daysPerMonth, setDaysPerMonth] = useState(saved?.daysPerMonth ?? 30);

  // Compute report using useMemo to avoid cascading renders
  const report = useMemo(() => {
    return estimateMonthlyCost({ lights, fans, pricePerKwh: Number(pricePerKwh), daysPerMonth: Number(daysPerMonth) });
  }, [lights, fans, pricePerKwh, daysPerMonth]);

  // Save state to localStorage as a side effect
  useEffect(() => {
    saveState({ lights, fans, pricePerKwh, daysPerMonth });
  }, [lights, fans, pricePerKwh, daysPerMonth]);

  // Helpers for device lists
  const updateDevice = (list, setList, idx, patch) => {
    const copy = list.map((it, i) => i === idx ? { ...it, ...patch } : it);
    setList(copy);
  };

  const addDevice = (list, setList, template) => setList([...list, template]);
  const removeDevice = (list, setList, idx) => setList(list.filter((_, i) => i !== idx));

  return (
    <div className={styles.estimatorContainer}>
      <div className={styles.estimatorHeader}>
        <h3>{t('estTitle')}</h3>
        <button className={`${styles.btn} ${styles.btnSmall}`} onClick={() => { saveState({ lights, fans, pricePerKwh, daysPerMonth }); if (onClose) onClose(); }}>{t('estClose')}</button>
      </div>

      <div className={styles.estimatorInputsGrid}>
        <div>
          <label className={styles.inputLabel}>{t('estElectricityPrice')}</label>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              step="0.01"
              min="0"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(e.target.value)}
              className={styles.input}
            />
            <span className={styles.currencySymbol}>{currency}</span>
          </div>
        </div>
        <div>
          <label className={styles.inputLabel}>{t('estDaysPerMonth')}</label>
          <input
            type="number"
            min="1"
            max="31"
            value={daysPerMonth}
            onChange={(e) => setDaysPerMonth(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.estimatorDevicesFlex}>
        <div className={styles.deviceSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t('estLights')}</span>
            <button className={`${styles.btn} ${styles.btnSmall}`} onClick={() => addDevice(lights, setLights, { name: t('estNewLight'), watt: 100, quantity: 1 })}>{t('estAdd')}</button>
          </div>
          <div className={styles.deviceList}>
            {lights.map((d, i) => (
              <div key={i} className={styles.deviceRow}>
                <input
                  value={d.name}
                  onChange={(e) => updateDevice(lights, setLights, i, { name: e.target.value })}
                  className={`${styles.input} ${styles.inputDeviceName}`}
                  placeholder={t('estDeviceName')}
                />
                <input
                  type="number"
                  value={d.watt}
                  onChange={(e) => updateDevice(lights, setLights, i, { watt: Number(e.target.value) })}
                  className={`${styles.input} ${styles.inputTiny}`}
                  placeholder="W"
                />
                <input
                  type="number"
                  value={d.quantity}
                  min={1}
                  onChange={(e) => updateDevice(lights, setLights, i, { quantity: Number(e.target.value) })}
                  className={`${styles.input} ${styles.inputTiny}`}
                  placeholder="#"
                />
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => removeDevice(lights, setLights, i)}>{t('estDelete')}</button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.deviceSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>{t('estFans')}</span>
            <button className={`${styles.btn} ${styles.btnSmall}`} onClick={() => addDevice(fans, setFans, { name: t('estNewFan'), watt: 50, quantity: 1 })}>{t('estAdd')}</button>
          </div>
          <div className={styles.deviceList}>
            {fans.map((d, i) => (
              <div key={i} className={styles.deviceRow}>
                <input
                  value={d.name}
                  onChange={(e) => updateDevice(fans, setFans, i, { name: e.target.value })}
                  className={`${styles.input} ${styles.inputDeviceName}`}
                  placeholder={t('estDeviceName')}
                />
                <input
                  type="number"
                  value={d.watt}
                  onChange={(e) => updateDevice(fans, setFans, i, { watt: Number(e.target.value) })}
                  className={`${styles.input} ${styles.inputTiny}`}
                  placeholder="W"
                />
                <input
                  type="number"
                  value={d.quantity}
                  min={1}
                  onChange={(e) => updateDevice(fans, setFans, i, { quantity: Number(e.target.value) })}
                  className={`${styles.input} ${styles.inputTiny}`}
                  placeholder="#"
                />
                <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => removeDevice(fans, setFans, i)}>{t('estDelete')}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {report && (
        <div className={styles.resultsSection}>
          <div className={styles.phaseSection}>
            <div className={styles.phaseHeader}>
              <span className={styles.phaseIcon}></span>
              {t('estGrowPhase')}
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>{t('estMonthlyCost')}</span>
              <span className={styles.resultValue}>{report.veg.totalKwh.toFixed(1)} kWh — {(report.veg.totalCost).toFixed(2)} {currency}</span>
            </div>
          </div>

          <div className={styles.phaseSection}>
            <div className={styles.phaseHeader}>
              <span className={styles.phaseIcon}></span>
              {t('estFlowerPhase')}
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>{t('estMonthlyCost')}</span>
              <span className={styles.resultValue}>{report.flower.totalKwh.toFixed(1)} kWh — {(report.flower.totalCost).toFixed(2)} {currency}</span>
            </div>
          </div>

          <div className={styles.totalSection}>
            <div className={styles.totalLabel}>{t('estDailyAverage')}</div>
            <div className={styles.totalValue}>{((report.veg.totalCost + report.flower.totalCost) / 2 / daysPerMonth).toFixed(2)} {currency}/day</div>
          </div>

          <details className={styles.detailsSection}>
            <summary className={styles.detailsSummary}>{t('estDetailedBreakdown')}</summary>
            <div className={styles.detailsContent}>
              <div className={styles.breakdownTitle}>{t('estLightsAndFans')}</div>
              <ul className={styles.estList}>
                {report.veg.items.map((it, idx) => (
                  <li key={idx}><strong>{it.name}</strong>: {it.monthlyKwh.toFixed(2)} kWh</li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
