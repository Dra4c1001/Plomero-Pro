import React from 'react';
import { 
  BookOpen, 
  Activity, 
  Calculator, 
  MessageSquareText, 
  CheckSquare
} from 'lucide-react';

export type MainTabType = 'manual' | 'diagnostico' | 'calculadora' | 'cotizador';

interface TabBarProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  hasActiveChecklist?: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange, hasActiveChecklist }) => {
  const tabs = [
    {
      id: 'manual' as MainTabType,
      label: 'Manual',
      mobileLabel: 'Manual',
      sublabel: '+2.850 Entradas',
      icon: BookOpen,
      badge: 'M1-M4'
    },
    {
      id: 'diagnostico' as MainTabType,
      label: 'Diagnóstico',
      mobileLabel: 'Diagnóstico',
      sublabel: 'Sintoma → Solución',
      icon: Activity,
      badge: 'M5'
    },
    {
      id: 'calculadora' as MainTabType,
      label: 'Calculadora',
      mobileLabel: 'Calcular',
      sublabel: 'Presupuestos',
      icon: Calculator,
      badge: '$ USD'
    },
    {
      id: 'cotizador' as MainTabType,
      label: 'Cotizador',
      mobileLabel: 'Cotizar',
      sublabel: 'WhatsApp & Check',
      icon: hasActiveChecklist ? CheckSquare : MessageSquareText,
      badge: hasActiveChecklist ? 'Activo' : 'WA'
    }
  ];

  return (
    <nav 
      aria-label="Navegación principal de campo"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#06090e]/95 border-t-2 border-[#1e293b] shadow-[0_-8px_24px_rgba(0,0,0,0.8)] px-1.5 sm:px-4 py-1 backdrop-blur-xl pb-[max(0.35rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-3xl mx-auto grid grid-cols-4 gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[56px] sm:min-h-[60px] py-1 px-1 rounded-xl transition-all duration-150 relative select-none active:scale-95 ${
                isActive
                  ? 'bg-[#151f30] text-[#FFCC00] shadow-[inset_0_0_12px_rgba(255,204,0,0.15)] border-t-2 border-[#FFCC00]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0d1420]'
              }`}
            >
              {/* Active Glow indicator */}
              {isActive && (
                <span className="absolute -top-[3px] w-6 sm:w-8 h-[3px] bg-[#FFCC00] rounded-full shadow-[0_0_8px_#FFCC00]"></span>
              )}

              <div className="relative">
                <Icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4] text-[#FFCC00]' : 'stroke-[1.8]'
                  }`} 
                />
                {tab.id === 'cotizador' && hasActiveChecklist && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#06090e] animate-ping" />
                )}
              </div>

              {/* Clean label that never breaks or cuts off */}
              <span className={`text-[11px] sm:text-xs font-bold tracking-tight mt-0.5 whitespace-nowrap overflow-hidden ${
                isActive ? 'text-white' : 'text-slate-400'
              }`}>
                <span className="inline sm:hidden">{tab.mobileLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>

              <span className={`text-[9px] font-mono hidden sm:inline-block leading-none mt-0.5 ${
                isActive ? 'text-[#FFCC00] font-semibold' : 'text-slate-500'
              }`}>
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
