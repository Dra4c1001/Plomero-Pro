import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Clock, 
  Truck, 
  TrendingUp, 
  Wrench, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Search, 
  Plus, 
  Minus,
  Sparkles,
  Layers,
  Coins,
  Percent,
  Sliders,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { PlumbingRecord } from '../types/database';
import { copyToClipboard } from '../utils/exportUtils';
import { playClickSound, playSuccessSound } from '../utils/audioFeedback';
import { SUPPORTED_CURRENCIES, convertFromUSD, formatCurrency } from '../utils/currencyUtils';

export interface BudgetCalculation {
  serviceTitle: string;
  materialCost: number;
  laborHours: number;
  hourlyRate: number;
  travelCost: number;
  additionalCost: number;
  profitMarginPercent: number;
  subtotalLabor: number;
  subtotalMaterials: number;
  subtotalBase: number;
  profitAmount: number;
  finalPriceUSD: number;
  notes: string;
  currencyCode?: string;
  convertedFinalPrice?: number;
}

interface CalculatorViewProps {
  initialRecord?: PlumbingRecord | null;
  records: PlumbingRecord[];
  onTransferToQuote: (budget: BudgetCalculation) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  initialRecord,
  records,
  onTransferToQuote
}) => {
  // State variables for the Pro Formula: Material + Labor + Travel + Profit = Final Price
  const [serviceTitle, setServiceTitle] = useState(initialRecord?.problemaServicio || 'Servicio Hidráulico General');
  const [materialCost, setMaterialCost] = useState(initialRecord ? Math.round(initialRecord.precoSugeridoUSD * 0.35) : 45);
  const [laborHours, setLaborHours] = useState(initialRecord ? Math.max(1, Math.round(initialRecord.tempoEstimadoMinutos / 60)) : 2);
  const [hourlyRate, setHourlyRate] = useState(35); // Default $35/hr
  const [travelCost, setTravelCost] = useState(25); // Desplazamiento
  const [additionalCost, setAdditionalCost] = useState(10); // Desgaste herramientas / consumibles
  const [profitMarginPercent, setProfitMarginPercent] = useState(30); // 30% margin default
  const [notes, setNotes] = useState(initialRecord ? `Ref ID: ${initialRecord.id} - ${initialRecord.subcategoria}` : '');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [copied, setCopied] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [serviceSearch, setServiceSearch] = useState('');

  // Update whenever initialRecord changes
  useEffect(() => {
    if (initialRecord) {
      setServiceTitle(initialRecord.problemaServicio);
      setMaterialCost(Math.round(initialRecord.precoSugeridoUSD * 0.35));
      setLaborHours(Math.max(1, Math.round(initialRecord.tempoEstimadoMinutos / 60)));
      setNotes(`Ref ID: ${initialRecord.id} - ${initialRecord.subcategoria}`);
    }
  }, [initialRecord]);

  // Mathematical Calculations
  const subtotalLabor = laborHours * hourlyRate;
  const subtotalMaterials = materialCost;
  const baseCost = subtotalLabor + subtotalMaterials + travelCost + additionalCost;
  const profitAmount = Math.round(baseCost * (profitMarginPercent / 100));
  const finalPriceUSD = baseCost + profitAmount;

  // Multi-currency calculation
  const convertedPrice = useMemo(() => {
    return convertFromUSD(finalPriceUSD, selectedCurrency);
  }, [finalPriceUSD, selectedCurrency]);

  // Proportions for visual breakdown bar
  const totalBar = finalPriceUSD || 1;
  const pMaterials = Math.round((subtotalMaterials / totalBar) * 100);
  const pLabor = Math.round((subtotalLabor / totalBar) * 100);
  const pTravel = Math.round((travelCost / totalBar) * 100);
  const pAdditional = Math.round((additionalCost / totalBar) * 100);
  const pProfit = Math.round((profitAmount / totalBar) * 100);

  const currentCalculation: BudgetCalculation = {
    serviceTitle,
    materialCost,
    laborHours,
    hourlyRate,
    travelCost,
    additionalCost,
    profitMarginPercent,
    subtotalLabor,
    subtotalMaterials,
    subtotalBase: baseCost,
    profitAmount,
    finalPriceUSD,
    notes,
    currencyCode: selectedCurrency,
    convertedFinalPrice: convertedPrice
  };

  const handleCopySummary = async () => {
    playSuccessSound();
    const currSym = SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrency)?.symbol || '$';
    const text = `🔧 PRESUPUESTO TÉCNICO HIDRÁULICO
Servicio: ${serviceTitle}
----------------------------------------
• Materiales e Insumos: $${materialCost} USD (${currSym} ${convertFromUSD(materialCost, selectedCurrency)})
• Mano de Obra (${laborHours}h x $${hourlyRate}/h): $${subtotalLabor} USD
• Desplazamiento Técnico: $${travelCost} USD
• Consumibles y Desgaste: $${additionalCost} USD
• Margen de Rentabilidad: ${profitMarginPercent}% ($${profitAmount} USD)
----------------------------------------
TOTAL ESTIMADO: $${finalPriceUSD} USD (${formatCurrency(convertedPrice, selectedCurrency)})
Garantía de Estanqueidad: 90 Días
${notes ? `Notas: ${notes}` : ''}`;

    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleReset = () => {
    playClickSound();
    setServiceTitle('Servicio Hidráulico General');
    setMaterialCost(45);
    setLaborHours(2);
    setHourlyRate(35);
    setTravelCost(25);
    setAdditionalCost(10);
    setProfitMarginPercent(30);
    setNotes('');
  };

  const handleSelectServiceFromSearch = (rec: PlumbingRecord) => {
    playClickSound();
    setServiceTitle(rec.problemaServicio);
    setMaterialCost(Math.round(rec.precoSugeridoUSD * 0.35));
    setLaborHours(Math.max(1, Math.round(rec.tempoEstimadoMinutos / 60)));
    setNotes(`Ref: ${rec.id} - ${rec.subcategoria} (${rec.nivelDificuldade})`);
    setShowSearchModal(false);
  };

  const filteredSearchRecords = useMemo(() => {
    if (!serviceSearch.trim()) return records.slice(0, 15);
    const q = serviceSearch.toLowerCase();
    return records.filter(r => 
      r.id.toLowerCase().includes(q) || 
      r.problemaServicio.toLowerCase().includes(q) ||
      r.subcategoria.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [records, serviceSearch]);

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      
      {/* Header Banner with Interactive Currency Switcher */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1019] border border-[#1e293b] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6B800] text-black flex items-center justify-center font-black shadow-[0_0_20px_rgba(255,204,0,0.3)] shrink-0">
            <Calculator className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white font-mono flex items-center gap-2">
              CALCULADORA DE PRESUPUESTOS <span className="text-[#FFCC00]">PRO</span>
            </h2>
            <p className="text-xs text-slate-400">
              Fórmula de costos reales: Materiales + Mano de Obra + Desplazamiento + Margen de Utilidad
            </p>
          </div>
        </div>

        {/* Currency Switcher & Presets (Mobile Friendly) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-[#121927] border border-[#243046] px-3 py-1.5 rounded-xl text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#FFCC00]" />
              <span className="text-slate-400 text-[11px]">Moneda:</span>
            </div>
            <select
              value={selectedCurrency}
              onChange={(e) => {
                playClickSound();
                setSelectedCurrency(e.target.value);
              }}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0b1019] text-white">
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setShowSearchModal(true);
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#152236] hover:bg-[#1d304d] text-slate-200 border border-[#2c4060] text-xs font-bold transition-all active:scale-95"
          >
            <Search className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span>Cargar Servicio BD</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs vs Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Columns: Interactive Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Service Title Input */}
          <div className="p-4 rounded-2xl bg-[#0d1420] border border-[#1e293b] space-y-2">
            <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-[#FFCC00]" />
              Concepto / Nombre del Trabajo
            </label>
            <input
              type="text"
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              className="w-full bg-[#121927] border border-[#243046] focus:border-[#FFCC00] rounded-xl px-3.5 py-2.5 text-sm text-white font-medium outline-none transition-all"
              placeholder="Ej: Instalación de grifería monomando y reemplazo de sifón..."
            />
          </div>

          {/* 1. Materiales e Insumos */}
          <div className="p-4 rounded-2xl bg-[#0d1420] border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase text-blue-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                1. Costo de Materiales e Insumos ($ USD)
              </label>
              <span className="text-sm font-mono font-bold text-white">
                ${materialCost} USD
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setMaterialCost(prev => Math.max(0, prev - 10));
                }}
                className="p-2.5 rounded-xl bg-[#121927] border border-[#243046] hover:bg-[#1a2538] text-slate-300 active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={0}
                value={materialCost}
                onChange={(e) => setMaterialCost(Math.max(0, Number(e.target.value) || 0))}
                className="flex-1 bg-[#121927] border border-[#243046] focus:border-blue-400 rounded-xl px-3 py-2 text-center text-base font-mono font-bold text-white outline-none"
              />
              <button
                onClick={() => {
                  playClickSound();
                  setMaterialCost(prev => prev + 10);
                }}
                className="p-2.5 rounded-xl bg-[#121927] border border-[#243046] hover:bg-[#1a2538] text-slate-300 active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {/* Quick Chips */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-slate-500">Presets:</span>
              {[20, 50, 100, 180, 250].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    playClickSound();
                    setMaterialCost(val);
                  }}
                  className={`px-2 py-0.5 rounded-lg border ${materialCost === val ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold' : 'bg-[#121927] border-[#223046] text-slate-400'}`}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Mano de Obra: Horas y Tarifa */}
          <div className="p-4 rounded-2xl bg-[#0d1420] border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase text-[#FFCC00] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                2. Mano de Obra (Horas & Tarifa)
              </label>
              <span className="text-sm font-mono font-bold text-[#FFCC00]">
                Subtotal: ${subtotalLabor} USD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Labor Hours */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Horas estimadas:</span>
                  <strong className="text-white">{laborHours}h</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      playClickSound();
                      setLaborHours(prev => Math.max(1, prev - 1));
                    }}
                    className="p-2 rounded-xl bg-[#121927] border border-[#243046] text-slate-300 active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={laborHours}
                    onChange={(e) => setLaborHours(Math.max(1, Number(e.target.value) || 1))}
                    className="flex-1 bg-[#121927] border border-[#243046] rounded-xl py-1.5 text-center font-mono font-bold text-white text-sm outline-none"
                  />
                  <button
                    onClick={() => {
                      playClickSound();
                      setLaborHours(prev => prev + 1);
                    }}
                    className="p-2 rounded-xl bg-[#121927] border border-[#243046] text-slate-300 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Tarifa horaria:</span>
                  <strong className="text-white">${hourlyRate}/h</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      playClickSound();
                      setHourlyRate(prev => Math.max(10, prev - 5));
                    }}
                    className="p-2 rounded-xl bg-[#121927] border border-[#243046] text-slate-300 active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min={10}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Math.max(10, Number(e.target.value) || 10))}
                    className="flex-1 bg-[#121927] border border-[#243046] rounded-xl py-1.5 text-center font-mono font-bold text-white text-sm outline-none"
                  />
                  <button
                    onClick={() => {
                      playClickSound();
                      setHourlyRate(prev => prev + 5);
                    }}
                    className="p-2 rounded-xl bg-[#121927] border border-[#243046] text-slate-300 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Desplazamiento y Consumibles */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#0d1420] border border-[#1e293b] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Desplazamiento
                </span>
                <span>${travelCost}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={travelCost}
                onChange={(e) => setTravelCost(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d1420] border border-[#1e293b] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-purple-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Desgaste / Consumibles
                </span>
                <span>${additionalCost}</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={additionalCost}
                onChange={(e) => setAdditionalCost(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Margen de Ganancia Slider */}
          <div className="p-4 rounded-2xl bg-[#0d1420] border border-[#1e293b] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Margen de Beneficio / Ganancia Neta
              </label>
              <span className="text-sm font-mono font-black text-amber-300">
                {profitMarginPercent}% (+${profitAmount} USD)
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={profitMarginPercent}
              onChange={(e) => setProfitMarginPercent(Number(e.target.value))}
              className="w-full accent-[#FFCC00] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] sm:text-[10px] font-mono text-slate-400">
              <span>10% Mín.</span>
              <span>30% Estándar</span>
              <span>50% Demanda</span>
              <span>80% Urgencia</span>
            </div>
          </div>

          {/* Notes Input */}
          <div className="p-3 rounded-2xl bg-[#0d1420] border border-[#1e293b]">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas técnicas o referencias adicionales (opcional)..."
              className="w-full bg-transparent text-xs text-slate-300 placeholder-slate-500 outline-none"
            />
          </div>

        </div>

        {/* Right Column: Visual Breakdown & Final Total (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#111928] to-[#0a101b] border-2 border-[#2b3d5b] shadow-2xl space-y-5 sticky top-20">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-[#1f2d44] pb-3 font-mono">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFCC00]" />
                Resumen Financiero
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                title="Restablecer valores"
              >
                <RotateCcw className="w-3 h-3" /> Restablecer
              </button>
            </div>

            {/* Visual Proportional Breakdown Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Distribución de Costos:</span>
                <span className="text-slate-300">Base ${baseCost} + Margen ${profitAmount}</span>
              </div>
              <div className="h-4 rounded-xl overflow-hidden flex bg-[#070b12] border border-[#1e2a3e]">
                <div style={{ width: `${pMaterials}%` }} className="bg-blue-500" title={`Materiales: ${pMaterials}%`} />
                <div style={{ width: `${pLabor}%` }} className="bg-amber-400" title={`Mano de Obra: ${pLabor}%`} />
                <div style={{ width: `${pTravel}%` }} className="bg-emerald-500" title={`Desplazamiento: ${pTravel}%`} />
                <div style={{ width: `${pAdditional}%` }} className="bg-purple-500" title={`Consumibles: ${pAdditional}%`} />
                <div style={{ width: `${pProfit}%` }} className="bg-rose-500" title={`Ganancia: ${pProfit}%`} />
              </div>
              {/* Legend */}
              <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Mat. {pMaterials}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Mano {pLabor}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Viaje {pTravel}%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Cons. {pAdditional}%
                </span>
                <span className="flex items-center gap-1 col-span-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Ganancia Neta {pProfit}%
                </span>
              </div>
            </div>

            {/* Line Item List */}
            <div className="space-y-2 text-xs font-mono border-t border-[#1f2d44] pt-3">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Materiales e Insumos:</span>
                <span className="font-bold">${materialCost} USD</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Mano de Obra ({laborHours}h × ${hourlyRate}):</span>
                <span className="font-bold">${subtotalLabor} USD</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Desplazamiento Técnico:</span>
                <span className="font-bold">${travelCost} USD</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Consumibles y Desgaste:</span>
                <span className="font-bold">${additionalCost} USD</span>
              </div>
              <div className="flex justify-between text-amber-400 border-t border-[#1e2a3e] pt-1.5 font-bold">
                <span>Beneficio ({profitMarginPercent}%):</span>
                <span>+${profitAmount} USD</span>
              </div>
            </div>

            {/* Big Total Price Display */}
            <div className="p-4 rounded-2xl bg-[#070b12] border border-[#24354f] text-center space-y-1">
              <div className="text-[11px] font-mono uppercase font-bold text-slate-400">
                Total Recomendado para Cotización
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#FFCC00] font-mono tracking-tight">
                ${finalPriceUSD} <span className="text-xs font-bold text-slate-400">USD</span>
              </div>

              {selectedCurrency !== 'USD' && (
                <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-1">
                  ≈ {formatCurrency(convertedPrice, selectedCurrency)}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  playClickSound();
                  onTransferToQuote(currentCalculation);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-3 sm:px-4 rounded-xl bg-[#FFCC00] hover:bg-[#ffd633] text-black font-black uppercase tracking-wider text-xs transition-all active:scale-95 shadow-[0_0_18px_rgba(255,204,0,0.3)]"
              >
                <Send className="w-4 h-4 stroke-[2.5] shrink-0" />
                <span className="sm:hidden">Transferir a Cotizador</span>
                <span className="hidden sm:inline">Transferir a Cotizador WhatsApp</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#141e2e] hover:bg-[#1a273b] text-slate-200 border border-[#273850] text-xs font-bold transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">¡Presupuesto Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#FFCC00]" />
                    <span>Copiar Resumen Técnico</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Database Search Modal for Presets */}
      {showSearchModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowSearchModal(false)}
        >
          <div 
            className="bg-[#0b1019] border border-[#243046] w-full max-w-2xl rounded-2xl shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Search className="w-4 h-4 text-[#FFCC00]" />
                Seleccionar Servicio Base de la Base de Datos
              </h3>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                Cerrar [ESC]
              </button>
            </div>

            <input
              type="text"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              placeholder="Escriba para filtrar servicio o material..."
              className="w-full bg-[#121927] border border-[#243046] focus:border-[#FFCC00] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              autoFocus
            />

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredSearchRecords.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleSelectServiceFromSearch(r)}
                  className="p-3 rounded-xl bg-[#0e1624] hover:bg-[#152236] border border-[#1e293b] hover:border-[#FFCC00]/50 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFCC00]/15 text-[#FFCC00]">
                        {r.id}
                      </span>
                      <span className="text-slate-400 text-[11px] font-medium">
                        {r.subcategoria}
                      </span>
                    </div>
                    <div className="text-white font-bold line-clamp-1">
                      {r.problemaServicio}
                    </div>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <div className="text-[#FFCC00] font-black text-sm">
                      ${r.precoSugeridoUSD} USD
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {r.tempoEstimadoMinutos} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
