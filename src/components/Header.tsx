import React, { useState } from 'react';
import { 
  Wrench, 
  Download, 
  BookOpen, 
  Search, 
  Star,
  Volume2,
  VolumeX,
  FileJson,
  FileSpreadsheet,
  MoreVertical,
  X
} from 'lucide-react';
import { downloadJsonFile, downloadCsvFile } from '../utils/exportUtils';
import { PlumbingRecord } from '../types/database';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audioFeedback';

interface HeaderProps {
  records: PlumbingRecord[];
  onOpenDocs: () => void;
  onSearchFocus?: () => void;
  totalCount: number;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  records, 
  onOpenDocs, 
  onSearchFocus, 
  totalCount,
  favoritesCount = 0,
  onOpenFavorites
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  const handleExportJson = () => {
    playClickSound();
    downloadJsonFile(records, `plomero-pro-database-${records.length}-entradas.json`);
    setShowExportMenu(false);
    setShowMobileMenu(false);
  };

  const handleExportCsv = () => {
    playClickSound();
    downloadCsvFile(records, `plomero-pro-database-${records.length}-entradas.csv`);
    setShowExportMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070a0f]/95 border-b border-[#1e293b] px-3 sm:px-6 lg:px-8 py-2 select-none backdrop-blur-md shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#E6B800] text-black flex items-center justify-center font-black shadow-[0_0_16px_rgba(255,204,0,0.35)] shrink-0 transition-transform active:scale-95">
            <Wrench className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-base font-black tracking-wider uppercase text-white font-mono flex items-center gap-1 truncate">
                PLOMERO <span className="text-[#FFCC00]">PRO</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30 font-mono">
                v2.6
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-tight truncate hidden xs:block">
              Manual Hidráulico Residencial
            </p>
          </div>
        </div>

        {/* Status Indicators & Database Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-[#0d1522] border border-[#1e293b] px-3 py-1.5 rounded-xl shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-mono text-[11px]">
              <strong className="text-white font-bold">{totalCount.toLocaleString()}</strong> fichas técnicas
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Quick search button for mobile */}
          {onSearchFocus && (
            <button
              onClick={() => {
                playClickSound();
                onSearchFocus();
              }}
              className="p-2 sm:hidden rounded-xl bg-[#121927] border border-[#243046] text-slate-300 hover:text-white active:scale-95"
              title="Buscar en el manual"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Sound/Audio Feedback Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all text-xs active:scale-95 ${
              soundOn 
                ? 'bg-[#121927] border-[#243046] text-[#FFCC00] hover:border-[#FFCC00]/50' 
                : 'bg-[#10141e] border-[#1c2436] text-slate-500 hover:text-slate-300'
            }`}
            title={soundOn ? 'Sonido activado' : 'Sonido silenciado'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Starred / Favorites button */}
          {onOpenFavorites && (
            <button
              onClick={() => {
                playClickSound();
                onOpenFavorites();
              }}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                favoritesCount > 0
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-[#121927] border-[#243046] text-slate-400 hover:text-slate-200'
              }`}
              title="Ver favoritos"
            >
              <Star className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Favoritos</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black ${
                favoritesCount > 0 ? 'bg-amber-500 text-black' : 'bg-[#1c273a] text-slate-400'
              }`}>
                {favoritesCount}
              </span>
            </button>
          )}

          {/* Desktop Documentation Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenDocs();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121927] hover:bg-[#1a2335] text-slate-200 border border-[#243046] hover:border-[#FFCC00]/40 text-xs font-semibold transition-all active:scale-95"
            title="Ver documentación técnica"
          >
            <BookOpen className="w-4 h-4 text-[#FFCC00]" />
            <span>Manual</span>
          </button>

          {/* Desktop Export Menu Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                playClickSound();
                setShowExportMenu(!showExportMenu);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#ffd633] text-black text-xs font-black tracking-wide uppercase shadow-[0_0_14px_rgba(255,204,0,0.25)] transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Exportar</span>
            </button>

            {showExportMenu && (
              <div 
                className="absolute right-0 mt-2 w-60 bg-[#0c121e] border border-[#243046] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 font-mono">
                  Descargar Base de Datos
                </div>
                <button
                  onClick={handleExportJson}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-[#162033] hover:text-[#FFCC00] transition-colors"
                >
                  <FileJson className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <div className="font-bold">Archivo JSON Completo</div>
                    <div className="text-[10px] text-slate-400 font-normal">+{totalCount} objetos estructurados</div>
                  </div>
                </button>
                <button
                  onClick={handleExportCsv}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-[#162033] hover:text-[#FFCC00] transition-colors mt-1"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold">Planilla CSV / Excel</div>
                    <div className="text-[10px] text-slate-400 font-normal">Formato tabular para hojas de cálculo</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Overflow Menu Button (Prevents header crowding) */}
          <div className="relative sm:hidden">
            <button
              onClick={() => {
                playClickSound();
                setShowMobileMenu(!showMobileMenu);
              }}
              className="p-2 rounded-xl bg-[#121927] border border-[#243046] text-slate-300 hover:text-white active:scale-95"
              title="Más opciones"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMobileMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-[#0c121e] border border-[#243046] rounded-2xl shadow-2xl p-2 z-50"
                onClick={() => setShowMobileMenu(false)}
              >
                <button
                  onClick={onOpenDocs}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-[#162033] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#FFCC00]" />
                  <span>Manual y Documentación</span>
                </button>
                <button
                  onClick={handleExportJson}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-[#162033] transition-colors"
                >
                  <FileJson className="w-4 h-4 text-blue-400" />
                  <span>Descargar Base JSON</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-[#162033] transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Descargar Planilla CSV</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
