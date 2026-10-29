import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Calculator, 
  Flame, 
  Zap, 
  Bus, 
  Trash2, 
  Info, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export interface CarbonAuditResult {
  totalAnnualKg: number;
  totalAnnualTonnes: number;
  electricityKg: number;
  cookingFuelKg: number;
  transportKg: number;
  wasteKg: number;
  nationalComparisonFactor: number;
  mitigationPlan: { action: string; reductionKg: number }[];
}

interface CarbonCalculatorProps {
  onExportAudit?: (audit: CarbonAuditResult) => void;
}

export const CarbonCalculator: React.FC<CarbonCalculatorProps> = ({ onExportAudit }) => {
  const { language } = useLanguage();
  const isSwahili = language === 'sw';

  // State inputs with local East African units
  const [cookingFuel, setCookingFuel] = useState<'lpg' | 'charcoal' | 'kerosene' | 'electricity'>('lpg');
  const [cookingAmount] = useState<number>(13); // e.g. 13kg cylinder per 2 months or debis
  const [electricityKwhMonth, setElectricityKwhMonth] = useState<number>(60); // Monthly kWh from KPLC token
  const [transportMode, setTransportMode] = useState<'matatu' | 'boda' | 'car' | 'walking'>('matatu');
  const [dailyKm, setDailyKm] = useState<number>(18); // Round-trip commute in Nairobi
  const [wasteSeparation, setWasteSeparation] = useState<boolean>(false);

  // Documented East African emission factors (KPLC, EPRA, IPCC Tier-1 regional)
  // Electricity: Kenya has ~90% renewable grid (Geothermal, Hydro, Wind) -> ~0.12 kg CO2e / kWh
  const EF_GRID_KWH = 0.12; 
  
  // Cooking Fuels (annualized):
  // LPG: 3.0 kg CO2e / kg. (13kg cylinder used over ~2 months = ~78 kg/year)
  // Charcoal: 9.8 kg CO2e / kg (accounting for low-efficiency traditional earth kilns and non-renewable biomass)
  // Kerosene: 2.5 kg CO2e / liter
  const calcAnnualCooking = (): number => {
    switch (cookingFuel) {
      case 'lpg':
        return (cookingAmount * 6) * 3.0; // 6 refills/year * 3.0 kg/kg
      case 'charcoal':
        return (cookingAmount * 12 * 4) * 2.45; // 4kg debi * monthly count
      case 'kerosene':
        return (cookingAmount * 12) * 2.5; // liters per month
      case 'electricity':
        return (cookingAmount * 12) * EF_GRID_KWH;
      default:
        return 0;
    }
  };

  // Transport factors:
  // Matatu (14-seater): ~0.045 kg CO2e / passenger-km
  // Boda-boda (150cc): ~0.075 kg CO2e / passenger-km
  // Personal petrol sedan: ~0.192 kg CO2e / km
  // Walking / Bicycle: 0.00
  const calcAnnualTransport = (): number => {
    const annualKm = dailyKm * 300; // 300 active travel days
    switch (transportMode) {
      case 'matatu': return annualKm * 0.045;
      case 'boda': return annualKm * 0.075;
      case 'car': return annualKm * 0.192;
      case 'walking': return 0;
    }
  };

  const annualElectricityKg = electricityKwhMonth * 12 * EF_GRID_KWH;
  const annualCookingKg = calcAnnualCooking();
  const annualTransportKg = calcAnnualTransport();
  const annualWasteKg = wasteSeparation ? 40 : 180; // composting organic waste saves landfill methane

  const totalKg = Math.round(annualElectricityKg + annualCookingKg + annualTransportKg + annualWasteKg);
  const totalTonnes = Math.round((totalKg / 1000) * 100) / 100;

  // Comparison: Kenyan per-capita emissions ~0.38 tCO2e/yr; Global ~4.7 tCO2e/yr
  const nationalComparison = Math.round((totalTonnes / 0.38) * 10) / 10;

  const mitigationActions = [
    {
      action: 'Shift cooking from charcoal/kerosene to Tier-4 Electric Induction or Biogas',
      reductionKg: cookingFuel === 'charcoal' ? Math.round(annualCookingKg * 0.8) : (cookingFuel === 'kerosene' ? Math.round(annualCookingKg * 0.6) : 50)
    },
    {
      action: 'Use high-occupancy Matatu / Commuter Rail instead of private car or solo Boda',
      reductionKg: transportMode === 'car' ? Math.round(annualTransportKg * 0.75) : 30
    },
    {
      action: 'Separate household kitchen organic peels for community composting or black soldier fly farming',
      reductionKg: wasteSeparation ? 0 : 140
    }
  ];

  const handleExport = () => {
    if (onExportAudit) {
      onExportAudit({
        totalAnnualKg: totalKg,
        totalAnnualTonnes: totalTonnes,
        electricityKg: Math.round(annualElectricityKg),
        cookingFuelKg: Math.round(annualCookingKg),
        transportKg: Math.round(annualTransportKg),
        wasteKg: Math.round(annualWasteKg),
        nationalComparisonFactor: nationalComparison,
        mitigationPlan: mitigationActions
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-green bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Methodology: IPCC Tier-1 & Kenya EPRA Factors
          </span>
          <h3 className="text-xl font-bold text-gray-900 mt-1 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-forest-green" />
            {isSwahili ? 'Kikokotoo cha Carbon Afrika Mashariki' : 'East Africa Household Carbon Footprint Calculator'}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-forest-green">{totalTonnes} tCO₂e</span>
          <span className="text-xs text-gray-400 block">per year ({totalKg} kg)</span>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Cooking Fuel */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70">
          <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-600" />
            {isSwahili ? 'Nishati ya Kupikia:' : 'Primary Cooking Fuel:'}
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { id: 'lpg', label: 'LPG Gas (Mtungi)' },
              { id: 'charcoal', label: 'Charcoal (Makaa)' },
              { id: 'kerosene', label: 'Kerosene (Mafuta Taa)' },
              { id: 'electricity', label: 'Electric Cooker' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCookingFuel(f.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition border ${
                  cookingFuel === f.id
                    ? 'border-forest-green bg-emerald-50 text-forest-green'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Annual Cooking Emissions:</span>
            <strong>{Math.round(annualCookingKg)} kg CO₂e</strong>
          </div>
        </div>

        {/* Electricity */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70">
          <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            {isSwahili ? 'Matumizi ya Umeme (KPLC Tokens):' : 'Monthly Electricity Consumption:'}
          </label>
          <div className="flex items-center gap-3 mb-3">
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={electricityKwhMonth}
              onChange={(e) => setElectricityKwhMonth(parseInt(e.target.value))}
              className="flex-1 accent-forest-green"
            />
            <span className="w-20 text-xs font-bold bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 text-center">
              {electricityKwhMonth} kWh
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Grid Factor (0.12 kg/kWh):</span>
            <strong>{Math.round(annualElectricityKg)} kg CO₂e / yr</strong>
          </div>
        </div>

        {/* Transport */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70">
          <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
            <Bus className="w-4 h-4 text-blue-600" />
            {isSwahili ? 'Usafiri wa Kila Siku Nairobi:' : 'Daily Commute in Nairobi:'}
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { id: 'matatu', label: 'Matatu / Bus' },
              { id: 'boda', label: 'Boda-Boda' },
              { id: 'car', label: 'Personal Car' },
              { id: 'walking', label: 'Walking / Bicycle' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTransportMode(m.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition border ${
                  transportMode === m.id
                    ? 'border-forest-green bg-emerald-50 text-forest-green'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Daily km:</span>
            <input
              type="range"
              min="2"
              max="60"
              step="2"
              value={dailyKm}
              onChange={(e) => setDailyKm(parseInt(e.target.value))}
              className="flex-1 accent-forest-green"
            />
            <span className="w-16 text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-center">
              {dailyKm} km
            </span>
          </div>
        </div>

        {/* Solid Waste & Organic Sorting */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-purple-600" />
              {isSwahili ? 'Udhibiti wa Taka za Nyumbani:' : 'Household Waste Sorting & Composting:'}
            </label>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Dandora landfill emits anaerobic methane (CH₄). Sorting kitchen waste for composting eliminates open methane fermentation.
            </p>
          </div>
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-xs font-semibold text-gray-700">Separate organics for compost?</span>
            <button
              type="button"
              onClick={() => setWasteSeparation(!wasteSeparation)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                wasteSeparation ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {wasteSeparation ? 'Yes (Saves 140kg)' : 'No (Landfill Dump)'}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison & Mitigation Recommendations */}
      <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-100 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-green mb-2 flex items-center gap-1.5">
          <Info className="w-4 h-4" />
          Benchmark & National Context (Kenya)
        </h4>
        <p className="text-xs text-emerald-950 leading-relaxed mb-3">
          Your estimated carbon footprint is <strong>{totalTonnes} tCO₂e/year</strong>. An average Kenyan individual generates <strong>0.38 tCO₂e</strong>, while an average citizen in industrialized high-emitting countries generates <strong>4.7 to 14.5 tCO₂e</strong>.
        </p>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-emerald-900 block">Recommended Reduction Actions:</span>
          {mitigationActions.map((act, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-gray-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-green shrink-0" />
                {act.action}
              </span>
              <span className="font-bold text-forest-green shrink-0 ml-2">
                -{act.reductionKg} kg/yr
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export / Attach to Project Action */}
      {onExportAudit && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleExport}
            className="px-6 py-3 bg-forest-green hover:bg-forest-green/90 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
          >
            <span>Attach Carbon Audit to Applied Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
