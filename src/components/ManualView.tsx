import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  LayoutGrid, 
  Table as TableIcon, 
  Wrench, 
  Sparkles, 
  X,
  Bath,
  Gauge,
  Waves,
  Flame,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Star,
  ChevronDown,
  ChevronUp,
  Calculator,
  MessageSquare,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { PlumbingRecord, ModuleFilterType } from '../types/database';
import { playClickSound, playFavoriteSound } from '../utils/audioFeedback';

interface ManualViewProps {
  records: PlumbingRecord[];
  onSelectRecord: (record: PlumbingRecord) => void;
  onSendToCalculator?: (record: PlumbingRecord) => void;
  onSendToQuote?: (record: PlumbingRecord) => void;
  initialSearch?: string;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  onlyFavoritesFilter?: boolean;
}

type SortOption = 'id-asc' | 'precio-asc' | 'precio-desc' | 'tiempo-asc' | 'dificultad';
type PriceFilter = 'ALL' | 'under50' | '50to120' | 'over120';

const QUICK_SEARCH_CHIPS = [
  'Golpe de ariete',
  'Presión baja',
  'Fuga inodoro',
  'Válvula T&P',
  'Monomando',
  'Cisterna',
  'Termotanque',
  'Trampa grasa'
];

export const ManualView: React.FC<ManualViewProps> = ({
  records,
  onSelectRecord,
  onSendToCalculator,
  onSendToQuote,
  initialSearch = '',
  favorites = [],
  onToggleFavorite,
  onlyFavoritesFilter = false
}) => {
  // State variables
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedModule, setSelectedModule] = useState<ModuleFilterType>('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('id-asc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(onlyFavoritesFilter);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'cards' ? 12 : 20;

  // React to prop change
  React.useEffect(() => {
    if (onlyFavoritesFilter) {
      setShowOnlyFavorites(true);
      setCurrentPage(1);
    }
  }, [onlyFavoritesFilter]);

  // Available Modules with visual badges
  const availableModules = [
    { id: 1 as const, name: 'Módulo 1: Baños y Cocinas', shortName: 'Baños y Cocinas', icon: Bath, count: 700, color: 'emerald' },
    { id: 2 as const, name: 'Módulo 2: Suministro y Presión', shortName: 'Suministro y Presión', icon: Gauge, count: 600, color: 'blue' },
    { id: 3 as const, name: 'Módulo 3: Desagües y Esgotos', shortName: 'Desagües y Esgotos', icon: Waves, count: 600, color: 'amber' },
    { id: 4 as const, name: 'Módulo 4: Calentadores y Agua Caliente', shortName: 'Calentadores', icon: Flame, count: 500, color: 'rose' },
  ];

  // Dynamic subcategories based on selected module
  const availableSubcategories = useMemo(() => {
    let pool = records;
    if (selectedModule !== 'ALL') {
      pool = records.filter(r => r.moduloId === selectedModule);
    }
    const unique = Array.from(new Set(pool.map(r => r.subcategoria))).filter(Boolean);
    return unique.sort();
  }, [records, selectedModule]);

  // Main filter & sort calculation
  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = records.filter((rec) => {
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(rec.id)) {
        return false;
      }

      // Module filter
      if (selectedModule !== 'ALL' && rec.moduloId !== selectedModule) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'ALL' && rec.subcategoria !== selectedSubcategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && rec.nivelDificuldade !== selectedDifficulty) {
        return false;
      }

      // Price filter
      if (priceFilter === 'under50' && rec.precoSugeridoUSD >= 50) return false;
      if (priceFilter === '50to120' && (rec.precoSugeridoUSD < 50 || rec.precoSugeridoUSD > 120)) return false;
      if (priceFilter === 'over120' && rec.precoSugeridoUSD <= 120) return false;

      // Search match
      if (!query) return true;

      return (
        rec.id.toLowerCase().includes(query) ||
        rec.problemaServicio.toLowerCase().includes(query) ||
        rec.subcategoria.toLowerCase().includes(query) ||
        rec.materialNecessario.some(m => m.toLowerCase().includes(query)) ||
        rec.causasProvaveis.some(c => c.toLowerCase().includes(query))
      );
    });

    // Sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'precio-asc':
          return a.precoSugeridoUSD - b.precoSugeridoUSD;
        case 'precio-desc':
          return b.precoSugeridoUSD - a.precoSugeridoUSD;
        case 'tiempo-asc':
          return a.tempoEstimadoMinutos - b.tempoEstimadoMinutos;
        case 'dificultad': {
          const diffMap: Record<string, number> = { 'Básico': 1, 'Intermedio': 2, 'Avanzado': 3, 'Especialista': 4 };
          return (diffMap[a.nivelDificuldade] || 0) - (diffMap[b.nivelDificuldade] || 0);
        }
        case 'id-asc':
        default:
          return a.id.localeCompare(b.id, undefined, { numeric: true });
      }
    });
  }, [records, selectedModule, selectedDifficulty, selectedSubcategory, priceFilter, sortBy, searchQuery, showOnlyFavorites, favorites]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const handleModuleChange = (mod: ModuleFilterType) => {
    playClickSound();
    setSelectedModule(mod);
    setSelectedSubcategory('ALL');
    setCurrentPage(1);
  };

  const handleQuickChip = (chip: string) => {
    playClickSound();
    setSearchQuery(chip);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    playClickSound();
    setSearchQuery('');
    setSelectedModule('ALL');
    setSelectedDifficulty('ALL');
    setSelectedSubcategory('ALL');
    setPriceFilter('ALL');
    setShowOnlyFavorites(false);
    setCurrentPage(1);
  };

  const toggleAccordion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setExpandedRecordId(prev => prev === id ? null : id);
  };

  const handleStarToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      const isFav = favorites.includes(id);
      playFavoriteSound(!isFav);
      onToggleFavorite(id);
    }
  };

  const activeFiltersCount = (selectedSubcategory !== 'ALL' ? 1 : 0) + 
    (selectedDifficulty !== 'ALL' ? 1 : 0) + 
    (priceFilter !== 'ALL' ? 1 : 0) + 
    (selectedModule !== 'ALL' ? 1 : 0) +
    (showOnlyFavorites ? 1 : 0);

  const hasActiveFilters = searchQuery || activeFiltersCount > 0;

  return (
    <div className="space-y-3 sm:space-y-4 pb-24">
      
      {/* 1. Module Selector: Clean Horizontal Scroller on Mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
        <button
          onClick={() => handleModuleChange('ALL')}
          className={`px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all border ${
            selectedModule === 'ALL'
              ? 'bg-[#FFCC00] text-black border-[#FFCC00] shadow-[0_0_14px_rgba(255,204,0,0.3)] font-black'
              : 'bg-[#0f1726] text-slate-300 border-[#223046] hover:border-slate-500 hover:text-white'
          }`}
        >
          <span className="sm:hidden">Todos ({records.length})</span>
          <span className="hidden sm:inline">Todos los Módulos ({records.length})</span>
        </button>

        {availableModules.map((m) => {
          const isSelected = selectedModule === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => handleModuleChange(m.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border whitespace-nowrap ${
                isSelected
                  ? 'bg-[#152338] text-white border-[#FFCC00] shadow-[0_0_12px_rgba(255,204,0,0.25)]'
                  : 'bg-[#0f1726] text-slate-300 border-[#223046] hover:border-slate-500 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{m.shortName}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-400">
                {m.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Buscador Inteligente & Filtros */}
      <div className="bg-[#0b1019] p-3 sm:p-4 rounded-2xl border border-[#1e293b] shadow-xl space-y-3">
        
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-[#FFCC00]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por síntoma, código, tubería..."
            className="w-full bg-[#121927] border border-[#26354d] focus:border-[#FFCC00] rounded-xl pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-slate-400 outline-none font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                playClickSound();
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Keyword Chips (Horizontal Scroller) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs -mx-1 px-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FFCC00]" /> Atajos:
          </span>
          {QUICK_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleQuickChip(chip)}
              className={`px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap shrink-0 transition-all ${
                searchQuery.toLowerCase() === chip.toLowerCase()
                  ? 'bg-[#FFCC00] text-black font-bold border-[#FFCC00]'
                  : 'bg-[#141b29] text-slate-300 border-[#253248] hover:border-[#FFCC00]/50'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Primary Controls Row: Mobile-First Responsive Grid */}
        <div className="pt-2 border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-2">
          
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Favorites filter toggle */}
            <button
              onClick={() => {
                playClickSound();
                setShowOnlyFavorites(!showOnlyFavorites);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                showOnlyFavorites
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-[#121a28] border-[#25344c] text-slate-300 hover:border-slate-500'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden xs:inline">Favoritos</span>
              <span className="text-[10px] font-mono font-black text-[#FFCC00]">({favorites.length})</span>
            </button>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => {
                playClickSound();
                setShowMobileFilters(!showMobileFilters);
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                showMobileFilters || activeFiltersCount > 0
                  ? 'bg-[#1b273b] border-[#FFCC00] text-[#FFCC00]'
                  : 'bg-[#121a28] border-[#25344c] text-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FFCC00] text-black text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Sort & View Mode Switcher */}
          <div className="flex items-center gap-2">
            {/* Sort selector (Compact & Responsive) */}
            <div className="flex items-center gap-1 bg-[#121a28] border border-[#25344c] rounded-xl px-2 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FFCC00] shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => {
                  playClickSound();
                  setSortBy(e.target.value as SortOption);
                }}
                className="bg-transparent text-slate-200 outline-none text-xs font-medium cursor-pointer max-w-[120px] sm:max-w-none truncate"
              >
                <option value="id-asc" className="bg-[#0b1019]">Orden ID</option>
                <option value="precio-asc" className="bg-[#0b1019]">$ Menor</option>
                <option value="precio-desc" className="bg-[#0b1019]">$ Mayor</option>
                <option value="tiempo-asc" className="bg-[#0b1019]">Más Rápidos</option>
                <option value="dificultad" className="bg-[#0b1019]">Dificultad</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#121a28] p-0.5 rounded-xl border border-[#25344c]">
              <button
                onClick={() => {
                  playClickSound();
                  setViewMode('cards');
                }}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-[#FFCC00] text-black shadow' : 'text-slate-400 hover:text-white'}`}
                title="Tarjetas"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setViewMode('table');
                }}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[#FFCC00] text-black shadow' : 'text-slate-400 hover:text-white'}`}
                title="Tabla"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Expandable Filter Panel: Perfectly sized for Mobile & Desktop without cuts */}
        {(showMobileFilters || window.innerWidth >= 1024) && (
          <div className="pt-3 border-t border-[#182335] space-y-2.5 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              
              {/* Subcategory select */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Subcategoría:</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    playClickSound();
                    setSelectedSubcategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#121a28] border border-[#25344c] rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-[#FFCC00] truncate text-xs"
                >
                  <option value="ALL">Todas las Subcategorías</option>
                  {availableSubcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty select */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Dificultad:</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    playClickSound();
                    setSelectedDifficulty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#121a28] border border-[#25344c] rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-[#FFCC00] text-xs"
                >
                  <option value="ALL">Todas las Dificultades</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Especialista">Especialista</option>
                </select>
              </div>

              {/* Price range pills: Fully visible and mobile-friendly */}
              <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400">Rango de Precio USD:</label>
                <div className="grid grid-cols-4 bg-[#121a28] p-0.5 rounded-xl border border-[#25344c] text-[11px] font-mono text-center">
                  <button
                    onClick={() => {
                      playClickSound();
                      setPriceFilter('ALL');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 rounded-lg ${priceFilter === 'ALL' ? 'bg-[#FFCC00] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setPriceFilter('under50');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 rounded-lg ${priceFilter === 'under50' ? 'bg-[#FFCC00] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    &lt;$50
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setPriceFilter('50to120');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 rounded-lg ${priceFilter === '50to120' ? 'bg-[#FFCC00] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    $50-120
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      setPriceFilter('over120');
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 rounded-lg ${priceFilter === 'over120' ? 'bg-[#FFCC00] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    &gt;$120
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#162132] text-xs">
            <span className="text-[10px] font-mono text-slate-400">Activos:</span>
            {showOnlyFavorites && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                ⭐ Favoritos
                <button onClick={() => setShowOnlyFavorites(false)} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedModule !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px]">
                Módulo {selectedModule}
                <button onClick={() => setSelectedModule('ALL')} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSubcategory !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] max-w-[150px] truncate">
                <span className="truncate">{selectedSubcategory}</span>
                <button onClick={() => setSelectedSubcategory('ALL')} className="hover:text-white shrink-0"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedDifficulty !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px]">
                {selectedDifficulty}
                <button onClick={() => setSelectedDifficulty('ALL')} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            {priceFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                {priceFilter === 'under50' ? '< $50' : priceFilter === '50to120' ? '$50 - $120' : '> $120'}
                <button onClick={() => setPriceFilter('ALL')} className="hover:text-white"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-[10px] text-[#FFCC00] hover:underline font-mono ml-auto py-0.5"
            >
              Limpiar filtros
            </button>
          </div>
        )}

      </div>

      {/* 3. Results Counter */}
      <div className="flex items-center justify-between px-1 text-xs font-mono">
        <span className="text-slate-400 text-[11px] sm:text-xs truncate">
          <strong className="text-[#FFCC00] font-bold">{filteredRecords.length.toLocaleString()}</strong> fichas encontradas
        </span>
        <span className="text-slate-500 text-[10px] sm:text-[11px] shrink-0">
          Pág. {currentPage}/{totalPages}
        </span>
      </div>

      {/* 4. Results Rendering */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 px-4 bg-[#0b1019] rounded-2xl border border-[#1e293b]">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm sm:text-base font-bold text-white mb-1">No se encontraron fichas</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
            Pruebe modificando las palabras clave o restableciendo los filtros.
          </p>
          <button
            onClick={clearFilters}
            className="px-3.5 py-1.5 rounded-xl bg-[#FFCC00] text-black text-xs font-bold uppercase tracking-wider active:scale-95"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        // CARDS VIEW: Optimized for mobile screens with zero clipping
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {paginatedRecords.map((record) => {
            const isFavorite = favorites.includes(record.id);
            const isExpanded = expandedRecordId === record.id;

            return (
              <div
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#0d1420] hover:bg-[#121c2c] border border-[#1e2b3e] hover:border-[#FFCC00]/60 transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99] relative overflow-hidden shadow-lg"
              >
                <div>
                  {/* Top Bar: Clean layout that never squishes badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#FFCC00]/15 text-[#FFCC00] border border-[#FFCC00]/30">
                        {record.id}
                      </span>
                      <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-lg font-bold uppercase ${
                        record.nivelDificuldade === 'Básico' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        record.nivelDificuldade === 'Intermedio' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        record.nivelDificuldade === 'Avanzado' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {record.nivelDificuldade}
                      </span>
                    </div>

                    {/* Favorite Star Button (Comfortable touch target) */}
                    <button
                      onClick={(e) => handleStarToggle(record.id, e)}
                      className={`p-1.5 rounded-lg transition-all ${
                        isFavorite 
                          ? 'text-amber-400' 
                          : 'text-slate-600 hover:text-slate-300'
                      }`}
                      title={isFavorite ? 'Remover favorito' : 'Guardar favorito'}
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Subcategory Line */}
                  <div className="text-[11px] font-medium text-slate-400 truncate mb-1">
                    {record.subcategoria}
                  </div>

                  {/* Service Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FFCC00] transition-colors leading-snug line-clamp-2 mb-2">
                    {record.problemaServicio}
                  </h3>

                  {/* Primary Cause preview */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    <strong className="text-slate-300">Causa:</strong> {record.causasProvaveis[0]}
                  </p>
                </div>

                {/* Inline Accordion Preview (Expanded Details) */}
                {isExpanded && (
                  <div 
                    className="my-2.5 p-3 rounded-xl bg-[#080d15] border border-[#243046] text-xs space-y-2.5 animate-in fade-in duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-400 block mb-1">
                        Materiales Principales ({record.materialNecessario.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {record.materialNecessario.slice(0, 4).map((m, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-[#131b29] border border-[#253248] text-[10px] text-slate-300">
                            {m}
                          </span>
                        ))}
                        {record.materialNecessario.length > 4 && (
                          <span className="text-[10px] text-slate-500 self-center">
                            +{record.materialNecessario.length - 4} más
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#FFCC00] block mb-1">
                        Primeros Pasos Técnicos:
                      </span>
                      <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px]">
                        {record.passoAPassoTecnico.slice(0, 2).map((step, sIdx) => (
                          <li key={sIdx} className="line-clamp-1">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Direct Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1c273a]">
                      {onSendToCalculator && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playClickSound();
                            onSendToCalculator(record);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#141e2e] hover:bg-[#1d2b40] text-slate-200 border border-[#26374f] text-[11px] font-bold transition-all"
                        >
                          <Calculator className="w-3.5 h-3.5 text-[#FFCC00]" />
                          <span>Presupuestar</span>
                        </button>
                      )}
                      {onSendToQuote && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playClickSound();
                            onSendToQuote(record);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-[11px] font-bold transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Cotizar</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom Info Bar & Quick Toggle */}
                <div className="pt-2.5 border-t border-[#1a2538] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 sm:gap-3 font-mono">
                    <span className="font-black text-[#FFCC00] text-sm sm:text-base whitespace-nowrap">
                      ${record.precoSugeridoUSD} <span className="text-[9px] text-slate-400">USD</span>
                    </span>
                    <span className="text-slate-400 flex items-center gap-1 text-[10px] sm:text-[11px] whitespace-nowrap">
                      <Clock className="w-3 h-3 text-blue-400" />
                      {record.tempoEstimadoMinutos} min
                    </span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={(e) => toggleAccordion(record.id, e)}
                      className="px-2 py-1 rounded-lg hover:bg-[#162132] text-slate-400 hover:text-slate-200 text-[10px] sm:text-[11px] flex items-center gap-0.5"
                      title={isExpanded ? 'Ocultar' : 'Previa'}
                    >
                      <span>{isExpanded ? 'Menos' : 'Previa'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <div className="flex items-center gap-0.5 text-[#FFCC00] font-bold text-xs pl-1">
                      <span>Ficha</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#FFCC00] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        // TABLE VIEW (With horizontal scroll wrapper)
        <div className="bg-[#0b1019] rounded-2xl border border-[#1e293b] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
              <thead className="bg-[#070b12] text-slate-400 uppercase font-mono text-[10px] border-b border-[#1e293b]">
                <tr>
                  <th className="py-2.5 px-2 text-center w-8">⭐</th>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Subcategoría</th>
                  <th className="py-2.5 px-3">Problema / Servicio</th>
                  <th className="py-2.5 px-2">Dificultad</th>
                  <th className="py-2.5 px-3 text-right">Precio</th>
                  <th className="py-2.5 px-2 text-right">Tiempo</th>
                  <th className="py-2.5 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162132]">
                {paginatedRecords.map((r) => {
                  const isFav = favorites.includes(r.id);
                  return (
                    <tr 
                      key={r.id}
                      onClick={() => onSelectRecord(r)}
                      className="hover:bg-[#121b2a] cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-2 text-center" onClick={(e) => handleStarToggle(r.id, e)}>
                        <button className="p-1 hover:scale-110 transition-transform">
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#FFCC00]">
                        {r.id}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-400 max-w-[150px] truncate">
                        {r.subcategoria}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-white max-w-[220px] truncate">
                        {r.problemaServicio}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#141d2c] text-slate-300 border border-[#243046]">
                          {r.nivelDificuldade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#FFCC00] text-right">
                        ${r.precoSugeridoUSD}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-400 text-right">
                        {r.tempoEstimadoMinutos}m
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button className="px-2 py-1 rounded-lg bg-[#162235] hover:bg-[#FFCC00] hover:text-black font-bold text-[10px] transition-colors">
                          Abrir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Mobile-Optimized Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-2.5 sm:p-3 bg-[#0b1019] rounded-2xl border border-[#1e293b] text-xs font-mono shadow-md">
          <span className="text-slate-400 text-[11px]">
            Mostrando <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-white">{Math.min(currentPage * itemsPerPage, filteredRecords.length)}</strong> de <strong className="text-[#FFCC00]">{filteredRecords.length}</strong>
          </span>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => {
                playClickSound();
                setCurrentPage(1);
              }}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#121927] border border-[#233146] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2438] active:scale-95"
              title="Primera página"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playClickSound();
                setCurrentPage(prev => Math.max(prev - 1, 1));
              }}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#121927] border border-[#233146] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2438] active:scale-95"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2.5 py-1 bg-[#151f30] rounded-xl border border-[#27374f] font-bold text-[#FFCC00] text-xs whitespace-nowrap">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => {
                playClickSound();
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
              }}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#121927] border border-[#233146] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2438] active:scale-95"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                playClickSound();
                setCurrentPage(totalPages);
              }}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#121927] border border-[#233146] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a2438] active:scale-95"
              title="Última página"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
