import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Wrench, 
  ListOrdered, 
  CheckSquare, 
  Calculator, 
  MessageSquare, 
  Copy, 
  Check,
  Flame,
  Bath,
  Gauge,
  Waves,
  Activity,
  Star,
  Share2
} from 'lucide-react';
import { PlumbingRecord } from '../types/database';
import { copyToClipboard } from '../utils/exportUtils';
import { playClickSound, playFavoriteSound, playSuccessSound } from '../utils/audioFeedback';

interface TechnicalRecordModalProps {
  record: PlumbingRecord | null;
  onClose: () => void;
  onSendToCalculator: (record: PlumbingRecord) => void;
  onSendToQuote: (record: PlumbingRecord) => void;
  onStartChecklist: (record: PlumbingRecord) => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}

export const TechnicalRecordModal: React.FC<TechnicalRecordModalProps> = ({
  record,
  onClose,
  onSendToCalculator,
  onSendToQuote,
  onStartChecklist,
  favorites = [],
  onToggleFavorite
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Reset progress when record changes
  useEffect(() => {
    setCheckedItems({});
    setCompletedSteps({});
  }, [record?.id]);

  if (!record) return null;

  const isFavorite = favorites.includes(record.id);

  const handleCopyMaterials = async () => {
    playSuccessSound();
    const text = record.materialNecessario.join('\n• ');
    await copyToClipboard(`• ${text}`);
    setCopiedSection('materials');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopySteps = async () => {
    playSuccessSound();
    const text = record.passoAPassoTecnico.map((p, i) => `${i + 1}. ${p}`).join('\n');
    await copyToClipboard(text);
    setCopiedSection('steps');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleCheck = (idx: number) => {
    const nextState = !checkedItems[idx];
    if (nextState) playSuccessSound();
    else playClickSound();
    setCheckedItems((prev) => ({ ...prev, [idx]: nextState }));
  };

  const toggleStep = (idx: number) => {
    const nextState = !completedSteps[idx];
    if (nextState) playSuccessSound();
    else playClickSound();
    setCompletedSteps((prev) => ({ ...prev, [idx]: nextState }));
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      playFavoriteSound(!isFavorite);
      onToggleFavorite(record.id);
    }
  };

  const getModuleIcon = (id: number) => {
    switch (id) {
      case 1: return <Bath className="w-5 h-5 text-emerald-400" />;
      case 2: return <Gauge className="w-5 h-5 text-blue-400" />;
      case 3: return <Waves className="w-5 h-5 text-amber-400" />;
      case 4: return <Flame className="w-5 h-5 text-rose-400" />;
      case 5: return <Activity className="w-5 h-5 text-purple-400" />;
      default: return <Wrench className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto"
      onClick={() => {
        playClickSound();
        onClose();
      }}
    >
      <div 
        className="bg-[#0b1019] border border-[#243046] w-full max-w-3xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-[#1e293b] bg-[#070b12] flex items-start justify-between gap-3 sticky top-0 z-10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#121926] border border-[#243046] shrink-0 mt-0.5 shadow-inner">
              {getModuleIcon(record.moduloId)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30">
                  {record.id}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {record.modulo}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-medium">
                  {record.subcategoria}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                {record.problemaServicio}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Star Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                isFavorite 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-[#121926] text-slate-400 border-[#243046] hover:text-white'
              }`}
              title={isFavorite ? 'Remover de favoritos' : 'Guardar en favoritos'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-2 rounded-xl bg-[#141c2c] hover:bg-[#1e2a42] text-slate-400 hover:text-white border border-[#243046] active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 bg-[#0e1522] border-b border-[#1e293b] text-center font-mono shrink-0">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#070a0f] border border-[#1e293b]">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Precio</span>
            <span className="text-sm sm:text-lg font-black text-[#FFCC00] flex items-center whitespace-nowrap">
              ${record.precoSugeridoUSD} <span className="text-[10px] sm:text-xs text-slate-400 ml-1">USD</span>
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#070a0f] border border-[#1e293b]">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tiempo</span>
            <span className="text-sm sm:text-lg font-bold text-slate-100 flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              {record.tempoEstimadoMinutos} <span className="text-[10px] sm:text-xs text-slate-400">m</span>
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#070a0f] border border-[#1e293b]">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dificultad</span>
            <span className={`text-[10px] sm:text-xs font-bold uppercase mt-0.5 px-2 py-0.5 rounded-lg whitespace-nowrap ${
              record.nivelDificuldade === 'Básico' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              record.nivelDificuldade === 'Intermedio' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
              record.nivelDificuldade === 'Avanzado' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {record.nivelDificuldade}
            </span>
          </div>
        </div>

        {/* Scrollable Technical Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">

          {/* Special Diagnóstico Rápido Box if Module 5 */}
          {record.diagnosticoRapido && (
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Matriz Directa Síntoma → Causa → Solución
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg font-mono ${
                  record.diagnosticoRapido.urgencia === 'Emergencia' ? 'bg-red-500 text-white animate-pulse' :
                  record.diagnosticoRapido.urgencia === 'Alta' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  Urgencia {record.diagnosticoRapido.urgencia}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#070b12] border border-[#243046]">
                  <div className="text-[10px] text-red-400 font-bold uppercase mb-1">Síntoma Visual / Acústico</div>
                  <div className="text-slate-200 font-medium">{record.diagnosticoRapido.sintoma}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#070b12] border border-[#243046]">
                  <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">Causa Raíz Probable</div>
                  <div className="text-slate-200 font-medium">{record.diagnosticoRapido.causa}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#070b12] border border-purple-700/50">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Solución Inmediata</div>
                  <div className="text-slate-200 font-medium">{record.diagnosticoRapido.solucao}</div>
                </div>
              </div>
            </div>
          )}

          {/* 1. Causas Prováveis */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Causas Prováveis Detectadas ({record.causasProvaveis.length})
            </h3>
            <ul className="grid grid-cols-1 gap-2">
              {record.causasProvaveis.map((causa, idx) => (
                <li 
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121927] border border-[#1e293b] text-slate-300"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-[0_0_6px_#f59e0b]"></span>
                  <span className="leading-relaxed">{causa}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. Material Necessário & Herramientas */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Material Necessário y Herramientas ({record.materialNecessario.length})
              </h3>
              <button
                onClick={handleCopyMaterials}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
              >
                {copiedSection === 'materials' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Lista</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {record.materialNecessario.map((mat, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111827] border border-[#2a3854] text-xs font-medium text-slate-200 hover:border-[#FFCC00]/50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  {mat}
                </span>
              ))}
            </div>
          </section>

          {/* 3. Passo a Passo Técnico (Con marcado interactivo) */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFCC00] flex items-center gap-2">
                <ListOrdered className="w-4 h-4" />
                Passo a Passo Técnico ({record.passoAPassoTecnico.length} etapas - clic para completar)
              </h3>
              <button
                onClick={handleCopySteps}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
              >
                {copiedSection === 'steps' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Pasos</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-2.5">
              {record.passoAPassoTecnico.map((paso, idx) => {
                const isDone = !!completedSteps[idx];
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isDone 
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                        : 'bg-[#0e1624] border-[#1e293b] hover:border-[#2f4060] text-slate-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border ${
                      isDone 
                        ? 'bg-emerald-500 text-black border-emerald-400' 
                        : 'bg-[#FFCC00]/15 text-[#FFCC00] border-[#FFCC00]/30'
                    }`}>
                      {isDone ? '✓' : String(idx + 1).padStart(2, '0')}
                    </div>
                    <p className={`leading-relaxed ${isDone ? 'line-through opacity-80' : ''}`}>
                      {paso}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Checklist Final (Checkboxes interactivos) */}
          <section className="space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Checklist Final de Entrega y Calidad
            </h3>
            <div className="space-y-2 bg-[#0c131f] p-3 rounded-2xl border border-emerald-900/30">
              {record.checklistFinal.map((check, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-[#121a28] border-[#1e293b] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                      isChecked 
                        ? 'bg-emerald-500 text-black border-emerald-400 font-bold' 
                        : 'border-slate-600 bg-[#0b1019]'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-xs leading-relaxed ${isChecked ? 'line-through opacity-80' : ''}`}>
                      {check}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* Modal Action Footer: Mobile Friendly with Non-Truncating Labels */}
        <div className="p-2.5 sm:p-4 bg-[#070a0f] border-t border-[#1e293b] grid grid-cols-3 gap-1.5 sm:gap-2 sticky bottom-0 z-10 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
          <button
            onClick={() => {
              playClickSound();
              onSendToCalculator(record);
              onClose();
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl bg-[#141f30] hover:bg-[#1d2d46] text-white border border-[#2b3c58] text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
          >
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFCC00] shrink-0" />
            <span className="sm:hidden">Calcular</span>
            <span className="hidden sm:inline">Calcular Presupuesto</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onSendToQuote(record);
              onClose();
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="sm:hidden">WhatsApp</span>
            <span className="hidden sm:inline">Cotizar WhatsApp</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onStartChecklist(record);
              onClose();
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 sm:py-3 px-1.5 sm:px-2 rounded-xl bg-[#FFCC00] hover:bg-[#ffd633] text-black text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-[0_0_12px_rgba(255,204,0,0.25)] whitespace-nowrap"
          >
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
            <span className="sm:hidden">Checklist</span>
            <span className="hidden sm:inline">Checklist Obra</span>
          </button>
        </div>

      </div>
    </div>
  );
};
