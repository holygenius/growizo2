/**
 * Elektrik Maliyet Tahmincisi
 *
 * Basit bir modül: kullanıcı tarafından verilen cihaz listelerine (ışıklar, fanlar)
 * ve elektrik fiyatına göre aylık maliyeti hesaplar.
 *
 * Varsayımlar / Esneklik:
 * - Bir ay = 30 gün olarak hesaplanır (kolaylık için). İsteğe göre değiştirilebilir.
 * - Işıklar için iki çalışma zamanı hesaplanır:
 *   - Büyüme (veg): 18 saat/ gün
 *   - Çiçeklenme (flower): 12 saat/ gün
 * - Fanlar tipik olarak 24 saat/ gün çalışır (ancak cihaz bazlı hoursPerDay verilebilir).
 * - Cihaz tanımı: { name, watt, quantity = 1, hoursPerDay? }
 *
 * Tüm çıktı kWh ve para birimi cinsinden döner. pricePerKwh parametresi `kWh başına` fiyat olarak beklenir
 * (ör. 1.2 TL/kWh veya 0.15 USD/kWh).
 */

const DEFAULT_DAYS_PER_MONTH = 30;
const DEFAULT_HOURS = {
  veg: 18, // büyüme dönemi: 18/6
  flower: 12, // çiçeklenme dönemi: 12/12
  fan: 24,
};

const toKw = (watts) => watts / 1000;

const dailyKwh = (watt, hoursPerDay) => toKw(watt) * hoursPerDay;

/**
 * devices: [{name, watt, quantity=1, hoursPerDay?}, ...]
 */
function monthlyKwhForDevices(devices = [], hoursPerDay, daysPerMonth = DEFAULT_DAYS_PER_MONTH) {
  const monthly = devices.reduce((acc, d) => {
    const qty = d.quantity || 1;
    const hours = typeof d.hoursPerDay === 'number' ? d.hoursPerDay : hoursPerDay;
    const daily = dailyKwh(d.watt, hours) * qty;
    const monthlyKwh = daily * daysPerMonth;
    acc.total += monthlyKwh;
    acc.items.push({
      name: d.name || 'unknown',
      watt: d.watt,
      quantity: qty,
      hoursPerDay: hours,
      dailyKwh: Number(daily.toFixed(4)),
      monthlyKwh: Number(monthlyKwh.toFixed(4)),
    });
    return acc;
  }, { total: 0, items: [] });

  monthly.total = Number(monthly.total.toFixed(4));
  return monthly;
}

function costFromKwh(kwh, pricePerKwh) {
  return Number((kwh * pricePerKwh).toFixed(4));
}

/**
 * estimateMonthlyCost
 *
 * options:
 * - lights: array of devices
 * - fans: array of devices
 * - pricePerKwh: number (zorunlu)
 * - daysPerMonth: optional (default 30)
 * - overrideHours: optional object to override default hours, e.g. { veg: 16, flower: 12, fan: 20 }
 *
 * returns: { veg: {...}, flower: {...} }
 */
function estimateMonthlyCost(options = {}) {
  const { lights = [], fans = [], pricePerKwh, daysPerMonth = DEFAULT_DAYS_PER_MONTH, overrideHours = {} } = options;

  if (typeof pricePerKwh !== 'number' || Number.isNaN(pricePerKwh)) {
    throw new Error('pricePerKwh must be provided as a number (kWh başına fiyat).');
  }

  const hours = {
    veg: typeof overrideHours.veg === 'number' ? overrideHours.veg : DEFAULT_HOURS.veg,
    flower: typeof overrideHours.flower === 'number' ? overrideHours.flower : DEFAULT_HOURS.flower,
    fan: typeof overrideHours.fan === 'number' ? overrideHours.fan : DEFAULT_HOURS.fan,
  };

  // Lights: veg and flower use different hours
  const vegLights = monthlyKwhForDevices(lights, hours.veg, daysPerMonth);
  const flowerLights = monthlyKwhForDevices(lights, hours.flower, daysPerMonth);

  // Fans: typically 24h (or override/device-specific hours)
  const fansMonthly = monthlyKwhForDevices(fans, hours.fan, daysPerMonth);

  // Combine lights + fans for each phase
  const vegTotalKwh = Number((vegLights.total + fansMonthly.total).toFixed(4));
  const flowerTotalKwh = Number((flowerLights.total + fansMonthly.total).toFixed(4));

  const vegCost = costFromKwh(vegTotalKwh, pricePerKwh);
  const flowerCost = costFromKwh(flowerTotalKwh, pricePerKwh);

  // Build breakdown objects
  const combineBreakdown = (lightsMonthly, fansMonthly) => {
    const combinedItems = [...lightsMonthly.items, ...fansMonthly.items];
    const totalKwh = Number((lightsMonthly.total + fansMonthly.total).toFixed(4));
    const totalCost = costFromKwh(totalKwh, pricePerKwh);
    return { items: combinedItems, totalKwh, totalCost };
  };

  return {
    pricePerKwh,
    daysPerMonth,
    veg: {
      hoursPerDay: { light: hours.veg, fan: hours.fan },
      ...combineBreakdown(vegLights, fansMonthly),
    },
    flower: {
      hoursPerDay: { light: hours.flower, fan: hours.fan },
      ...combineBreakdown(flowerLights, fansMonthly),
    },
  };
}

export {
  DEFAULT_HOURS,
  monthlyKwhForDevices,
  estimateMonthlyCost,
  costFromKwh,
};

export default estimateMonthlyCost;
