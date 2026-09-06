import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Database, 
  GitBranch, 
  ShieldAlert, 
  FileJson, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers, 
  Smartphone, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PlumbingRecord } from '../types/database';
import { MODULE_METADATA } from '../data/databaseGenerator';
import { downloadJsonFile, downloadCsvFile } from '../utils/exportUtils';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PlumbingRecord[];
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
  records
}) => {
  const [activeSection, setActiveSection] = useState<'flow' | 'data' | 'standards'>('flow');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#0b1019] border border-[#243046] w-full max-w-4xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#1e293b] bg-[#070b12] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFCC00] text-black flex items-center justify-center font-black">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-mono uppercase">
                PLOMERO PRO: Manual Técnico & Arquitectura
              </h2>
              <p className="text-xs text-slate-400">
                Documentación del sistema, estructura de datos y flujo de trabajo de campo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#141d2d] hover:bg-[#1e2b40] text-slate-400 hover:text-white border border-[#243046]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-[#1e293b] bg-[#0c121e] text-xs font-mono font-bold">
          <button
            onClick={() => setActiveSection('flow')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeSection === 'flow'
                ? 'border-[#FFCC00] text-[#FFCC00]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Mapeo de Flujos UX</span>
          </button>

          <button
            onClick={() => setActiveSection('data')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeSection === 'data'
                ? 'border-[#FFCC00] text-[#FFCC00]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Estructura de Base de Datos (+2.850)</span>
          </button>

          <button
            onClick={() => setActiveSection('standards')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
              activeSection === 'standards'
                ? 'border-[#FFCC00] text-[#FFCC00]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Estándares y Seguridad Hidráulica</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm text-slate-300">
          
          {activeSection === 'flow' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl bg-[#101725] border border-[#1f2b3e]">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#FFCC00]" />
                  Experiencia de Usuario de Campo (Dirty Hands UX)
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  El operario en campo trabaja con guantes, iluminación solar variable o con las manos ocupadas. Por ello, la aplicación implementa una interfaz táctil de alto contraste (Industrial Dark Mode #0b0f17 con acentos en Amarillo Obra #FFCC00), botones con áreas de contacto mínimas de 44px y accesos directos de 1 toque.
                </p>
              </div>

              {/* User Flow Step by Step */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-[#FFCC00] tracking-wider">
                  Flujo Operativo de 5 Etapas del Fontanero
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      step: '01',
                      title: 'Llegada y Triaje Rápido',
                      desc: 'El fontanero escucha el síntoma del cliente o inspecciona la instalación. Usa el Buscador Inteligente o la Matriz Síntoma → Causa → Solución (ej: "golpe de ariete", "bomba no corta", "olor a cloaca").',
                      color: 'border-blue-500/40 bg-blue-950/20'
                    },
                    {
                      step: '02',
                      title: 'Ficha Técnica y Materiales Requeridos',
                      desc: 'Abre la ficha técnica del servicio. Verifica inmediatamente la lista de materiales compatibles (PPR, Cobre, PEX, PVC) y copia la lista de compras o repuestos con un solo clic.',
                      color: 'border-emerald-500/40 bg-emerald-950/20'
                    },
                    {
                      step: '03',
                      title: 'Cálculo del Presupuesto Rentable',
                      desc: 'Transfiere el servicio a la Calculadora Pro. El sistema aplica la fórmula: Material + (Horas × Tarifa) + Desplazamiento + Margen = Precio Rentable. Ajusta las horas con botones táctiles grandes (+ / -).',
                      color: 'border-amber-500/40 bg-amber-950/20'
                    },
                    {
                      step: '04',
                      title: 'Generación y Envío de Cotización WhatsApp',
                      desc: 'Selecciona una de las 3 plantillas profesionales (Detallada, Express o Urgencia). El sistema formatea automáticamente el mensaje con negritas, emojis y garantía. Se envía en 1 toque directo al chat del cliente.',
                      color: 'border-green-500/40 bg-green-950/20'
                    },
                    {
                      step: '05',
                      title: 'Ejecución y Checklist de Calidad',
                      desc: 'Durante la reparación, el técnico marca los puntos de control del Checklist (prueba de estanqueidad de 10 min presurizado, ausencia de goteos, área limpia y seca) para respaldar la garantía ante el cliente.',
                      color: 'border-purple-500/40 bg-purple-950/20'
                    }
                  ].map((s) => (
                    <div 
                      key={s.step}
                      className={`p-3.5 rounded-xl border ${s.color} flex items-start gap-3.5`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#070b12] text-[#FFCC00] border border-[#243046] flex items-center justify-center font-mono font-black text-sm shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{s.title}</div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeSection === 'data' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#101725] border border-[#1f2b3e] flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Base de Datos Estructurada</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Total cargado en memoria local: <strong className="text-[#FFCC00]">{records.length.toLocaleString()} entradas técnicas</strong> divididas en 5 módulos.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadJsonFile(records, 'plomero-pro-db.json')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <FileJson className="w-3.5 h-3.5" /> JSON
                  </button>
                  <button
                    onClick={() => downloadCsvFile(records, 'plomero-pro-db.csv')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                  </button>
                </div>
              </div>

              {/* Modules breakdown table */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
                  Resumen de los 5 Módulos Técnicos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MODULE_METADATA.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-[#0c121e] border border-[#1e2a3c] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{m.title}</span>
                        <span className="font-mono text-xs font-bold text-[#FFCC00] bg-[#141e2e] px-2 py-0.5 rounded">
                          {m.count} entradas
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Schema Definition */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
                  Esquema JSON por Entrada
                </h4>
                <pre className="p-3.5 rounded-xl bg-[#070b12] border border-[#1c2738] font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
{`{
  "id": "M1-BC-0001",
  "moduloId": 1,
  "modulo": "Módulo 1: Baños y Cocinas",
  "categoria": "Baños y Cocinas - Inodoros y Sanitarios",
  "subcategoria": "Inodoros y Sanitarios",
  "problemaServicio": "Instalación de inodoro two-piece con brida flexible...",
  "causasProvaveis": ["Desgaste natural de sello...", "Corrosión galvánica"],
  "materialNecessario": ["Inodoro completo", "Brida 4\\"", "Cinta teflón PTFE"],
  "passoAPassoTecnico": ["Paso 1: Cerrar llave...", "Paso 2: Colocar brida..."],
  "checklistFinal": ["Verificación de estanqueidad...", "Nivelación con nivel"],
  "precoSugeridoUSD": 65,
  "tempoEstimadoMinutos": 60,
  "nivelDificuldade": "Intermedio"
}`}
                </pre>
              </div>

            </div>
          )}

          {activeSection === 'standards' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Buenas Prácticas de Seguridad en Plomería
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span><strong>Despresurización Obligatoria:</strong> Antes de cortar tuberías de agua o gas, cortar la alimentación principal y abrir un grifo en la cota más baja para evacuar presión residual.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span><strong>Prueba de Estanqueidad Estándar:</strong> Todo circuito modificado debe permanecer 10 a 15 minutos presurizado antes de cerrar paredes o colocar zócalos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span><strong>Protección Térmica y Gas:</strong> En calentadores y termotanques, verificar siempre la tubería de desagüe de la válvula de seguridad T&P (3 bar / 99°C) dirigida al suelo.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#070b12] border-t border-[#1e293b] flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            PLOMERO PRO • Sistema de Campo v2.6
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FFCC00] text-black text-xs font-black uppercase tracking-wider active:scale-95"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
