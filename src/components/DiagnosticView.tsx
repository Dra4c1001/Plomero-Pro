import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  X, 
  Filter, 
  Sparkles, 
  Zap, 
  ChevronRight,
  Star,
  MessageSquare,
  Calculator
} from 'lucide-react';
import { PlumbingRecord } from '../types/database';
import { playClickSound, playFavoriteSound } from '../utils/audioFeedback';

interface DiagnosticViewProps {
  records: PlumbingRecord[];
  onSelectRecord: (record: PlumbingRecord) => void;
  onSendToCalculator: (record: PlumbingRecord) => void;
  onSendToQuote: (record: PlumbingRecord) => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({
  records,
  onSelectRecord,
  onSendToCalculator,
  onSendToQuote,
  favorites = [],
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter only Module 5 records
  const diagnosticRecords = useMemo(() => {
    return records.filter((r) => r.moduloId === 5);
  }, [records]);

  // Frequent symptoms on the field
  const COMMON_SYMPTOMS = [
    'Golpe de ariete al cerrar',
    'Olor a cloaca / gas séptico',
    'Bomba enciende y apaga sola',
    'Calentador de agua se apaga',
    'Presión baja en toda la casa',
    'Inodoro gotea continuamente',
    'Agua sale turbia o con óxido',
    'Gorgoteo en fregadero'
  ];

  const filteredDiagnostics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return diagnosticRecords.filter((rec) => {
      const diag = rec.diagnosticoRapido;
      if (!diag) return false;

      if (selectedUrgency !== 'ALL' && diag.urgencia !== selectedUrgency) {
        return false;
      }
      if (selectedCategory !== 'ALL' && rec.subcategoria !== selectedCategory) {
        return false;
      }
      if (!q) return true;

      return (
        diag.sintoma.toLowerCase().includes(q) ||
        diag.causa.toLowerCase().includes(q) ||
        diag.solucao.toLowerCase().includes(q) ||
        diag.herramientas.some(h => h.toLowerCase().includes(q)) ||
        rec.problemaServicio.toLowerCase().includes(q)
      );
    });
  }, [diagnosticRecords, searchQuery, selectedUrgency, selectedCategory]);

  const handleStarToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      const isFav = favorites.includes(id);
      playFavoriteSound(!isFav);
      onToggleFavorite(id);
    }
  };

  return (
    <div className="space-y-5 pb-24">
      
      {/* Banner de Diagnóstico de Campo */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#180e2b] via-[#101424] to-[#0a101b] border-2 border-purple-800/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/40 shrink-0 shadow-inner">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                Módulo 5
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Matriz Sintoma → Causa → Solução
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Diagnóstico Rápido en Terreno
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-0.5">
              Identifique anomalías hidráulicas al instante mediante la observación del síntoma, localización de la causa raíz física y ejecución de la solución certificada.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-black/50 border border-purple-700/40 text-center font-mono shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Casos de Matriz</span>
          <span className="text-lg font-black text-purple-300">{diagnosticRecords.length}</span>
        </div>
      </div>

      {/* Buscador de Síntomas & Filtros */}
      <div className="bg-[#0b1019] p-4 rounded-2xl border border-[#1e293b] space-y-3 shadow-xl">
        
        {/* Input con Icono de Diagnóstico */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por síntoma (ej: 'ruido de martillo', 'agua tibia', 'olor a cloaca', 'bomba ciclo corto')..."
            className="w-full bg-[#121927] border border-[#2a3854] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-400 outline-none font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                playClickSound();
                setSearchQuery('');
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Atajos de Síntomas Frecuentes */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] uppercase font-mono font-bold text-purple-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Síntomas clave:
          </span>
          {COMMON_SYMPTOMS.map((sym) => (
            <button
              key={sym}
              onClick={() => {
                playClickSound();
                setSearchQuery(sym);
              }}
              className={`px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap transition-all ${
                searchQuery.toLowerCase() === sym.toLowerCase()
                  ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                  : 'bg-[#141b29] text-slate-300 border-[#253248] hover:border-purple-500/50'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Urgencias y Categorías */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1e293b] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Nivel Urgencia:</span>
            {['ALL', 'Emergencia', 'Alta', 'Media', 'Baja'].map((urg) => (
              <button
                key={urg}
                onClick={() => {
                  playClickSound();
                  setSelectedUrgency(urg);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold uppercase transition-all border ${
                  selectedUrgency === urg
                    ? urg === 'Emergencia' ? 'bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                      urg === 'Alta' ? 'bg-amber-500 text-black border-amber-400' :
                      urg === 'Media' ? 'bg-blue-500 text-black border-blue-400' :
                      'bg-purple-600 text-white border-purple-500'
                    : 'bg-[#121927] text-slate-400 border-[#243147] hover:text-slate-200'
                }`}
              >
                {urg === 'ALL' ? 'Todas' : urg}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            <strong className="text-purple-300 font-bold">{filteredDiagnostics.length}</strong> diagnósticos listados
          </span>
        </div>

      </div>

      {/* Matriz Sintoma → Causa → Solução Cards */}
      <div className="space-y-4">
        {filteredDiagnostics.map((record) => {
          const diag = record.diagnosticoRapido!;
          const isFav = favorites.includes(record.id);
          
          return (
            <div
              key={record.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0c121e] border-2 border-[#1e2b3e] hover:border-purple-500/50 transition-all shadow-md space-y-4"
            >
              {/* Header card: ID, Urgencia, Categoría y Preço (Mobile Friendly) */}
              <div className="border-b border-[#182335] pb-2.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] sm:text-xs font-black px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {record.id}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      diag.urgencia === 'Emergencia' ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' :
                      diag.urgencia === 'Alta' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      diag.urgencia === 'Media' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                      'bg-slate-700/40 text-slate-300 border border-slate-600'
                    }`}>
                      {diag.urgencia}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-xs sm:text-sm font-black text-[#FFCC00]">
                      ${record.precoSugeridoUSD} <span className="text-[10px] text-slate-400">USD</span>
                    </span>

                    {/* Favorite button */}
                    <button
                      onClick={(e) => handleStarToggle(record.id, e)}
                      className={`p-1.5 rounded-lg transition-all ${
                        isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                      }`}
                      title={isFav ? 'Remover favorito' : 'Marcar como favorito'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-medium truncate">
                  {record.subcategoria}
                </div>
              </div>

              {/* Technical 3-Block Flow: SÍNTOMA → CAUSA → SOLUCIÓN */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                
                {/* 1. SÍNTOMA */}
                <div className="p-3.5 rounded-xl bg-[#140f1a] border border-red-900/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-wider text-red-400 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                      1. Síntoma Reportado
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                      {diag.sintoma}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-red-950/60 text-[10px] text-slate-400 font-mono">
                    Detectado en campo / llamada del cliente
                  </div>
                </div>

                {/* 2. CAUSA RAÍZ */}
                <div className="p-3.5 rounded-xl bg-[#1a1710] border border-amber-900/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-wider text-amber-400 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      2. Causa Raíz Probable
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
                      {diag.causa}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-950/60 text-[10px] text-slate-400 font-mono">
                    Origen físico, hidráulico o desgaste
                  </div>
                </div>

                {/* 3. SOLUCIÓN TÉCNICA */}
                <div className="p-3.5 rounded-xl bg-[#0e1c18] border border-emerald-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-wider text-emerald-400 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      3. Solución Certificada
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
                      {diag.solucao}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-950/60 text-[10px] text-slate-400 font-mono">
                    Protocolo de reparación estándar
                  </div>
                </div>

              </div>

              {/* Herramientas & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#182335]">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-blue-400" /> Herramientas:
                  </span>
                  {diag.herramientas.map((h, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#131c2c] border border-[#24334a] text-[11px] text-slate-300 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      playClickSound();
                      onSelectRecord(record);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-[#141e2e] hover:bg-[#1d2b40] text-slate-200 border border-[#27374f] text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-colors text-center"
                  >
                    <span className="sm:hidden">Ficha</span>
                    <span className="hidden sm:inline">Ver Ficha</span>
                    <ChevronRight className="w-3 h-3 text-purple-400 shrink-0" />
                  </button>

                  <button
                    onClick={() => {
                      playClickSound();
                      onSendToCalculator(record);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-[#16253b] hover:bg-[#203452] text-[#FFCC00] border border-[#294166] text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 text-center"
                  >
                    <Calculator className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>Calcular</span>
                  </button>

                  <button
                    onClick={() => {
                      playClickSound();
                      onSendToQuote(record);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 text-center"
                  >
                    <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
