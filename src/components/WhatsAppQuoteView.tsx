import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  CheckSquare, 
  Sparkles, 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Smartphone,
  CheckCheck,
  CheckCircle2,
  Award,
  RefreshCw,
  Share2
} from 'lucide-react';
import { PlumbingRecord } from '../types/database';
import { BudgetCalculation } from './CalculatorView';
import { copyToClipboard } from '../utils/exportUtils';
import { playClickSound, playSuccessSound } from '../utils/audioFeedback';

interface WhatsAppQuoteViewProps {
  activeRecord: PlumbingRecord | null;
  activeBudget: BudgetCalculation | null;
  records: PlumbingRecord[];
  onSelectRecordForChecklist: (record: PlumbingRecord) => void;
}

export const WhatsAppQuoteView: React.FC<WhatsAppQuoteViewProps> = ({
  activeRecord,
  activeBudget,
  records,
  onSelectRecordForChecklist
}) => {
  // Tab within this screen: WhatsApp Quote vs Checklist Interativo
  const [subTab, setSubTab] = useState<'quote' | 'checklist'>('quote');

  // Client Details Form
  const [clientName, setClientName] = useState('Estimado/a Cliente');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceLocation, setServiceLocation] = useState('Domicilio Residencial');
  const [serviceTitle, setServiceTitle] = useState(
    activeBudget?.serviceTitle || activeRecord?.problemaServicio || 'Mantenimiento e Instalación Hidráulica'
  );
  const [finalPrice, setFinalPrice] = useState(
    activeBudget?.finalPriceUSD || activeRecord?.precoSugeridoUSD || 120
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    activeBudget ? `${activeBudget.laborHours} horas` : activeRecord ? `${activeRecord.tempoEstimadoMinutos} min` : '2 horas'
  );
  const [warrantyDays, setWarrantyDays] = useState('90 días');
  const [selectedTemplate, setSelectedTemplate] = useState<'express' | 'detallada' | 'urgencia'>('detallada');
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedActa, setCopiedActa] = useState(false);

  // Field Checklist Items
  const defaultChecklist = [
    { text: 'Cierre seguro de llaves de paso principales y despresurización total de la línea', done: true },
    { text: 'Inspección previa de corrosión galvánica, roscas desgastadas o fatiga de material', done: true },
    { text: 'Limpieza profunda y desengrasado de superficies y filetes de rosca antes de sellado', done: false },
    { text: 'Aplicación de cinta teflón PTFE de alta densidad en sentido horario o sellador anaeróbico', done: false },
    { text: 'Apriete mecánico uniforme sin sobretorque en conexiones plásticas o roscas de latón', done: false },
    { text: 'Presurización gradual de la red hidráulica y purga completa de aire atrapado', done: false },
    { text: 'Prueba de estanqueidad continua durante 10 minutos para certificar cero microfugas', done: false },
    { text: 'Comprobación de caudal adecuado, aireadores limpios y retorno sin resistencia', done: false },
    { text: 'Área de trabajo completamente limpia, seca y escombros/empaques viejos retirados', done: false },
    { text: 'Explicación técnica al cliente y entrega formal de garantía por escrito', done: false }
  ];

  const [checklistItems, setChecklistItems] = useState<{ text: string; done: boolean }[]>(() => {
    if (activeRecord?.checklistFinal) {
      return activeRecord.checklistFinal.map((text, i) => ({ text, done: i === 0 }));
    }
    return defaultChecklist;
  });
  const [newCheckItem, setNewCheckItem] = useState('');

  // Update quote if budget changes
  useEffect(() => {
    if (activeBudget) {
      setServiceTitle(activeBudget.serviceTitle);
      setFinalPrice(activeBudget.finalPriceUSD);
      setEstimatedDuration(`${activeBudget.laborHours} horas`);
    } else if (activeRecord) {
      setServiceTitle(activeRecord.problemaServicio);
      setFinalPrice(activeRecord.precoSugeridoUSD);
      setEstimatedDuration(`${activeRecord.tempoEstimadoMinutos} min`);
    }
  }, [activeBudget, activeRecord]);

  // Update checklist if activeRecord changes
  useEffect(() => {
    if (activeRecord?.checklistFinal && activeRecord.checklistFinal.length > 0) {
      setChecklistItems(activeRecord.checklistFinal.map((text, i) => ({ text, done: i === 0 })));
    }
  }, [activeRecord]);

  // Toggle checklist item
  const toggleCheck = (idx: number) => {
    const nextDone = !checklistItems[idx].done;
    if (nextDone) {
      playSuccessSound();
    } else {
      playClickSound();
    }
    setChecklistItems(prev => prev.map((item, i) => i === idx ? { ...item, done: nextDone } : item));
  };

  const handleMarkAll = (done: boolean) => {
    playSuccessSound();
    setChecklistItems(prev => prev.map(item => ({ ...item, done })));
  };

  const addCustomCheckItem = () => {
    if (!newCheckItem.trim()) return;
    playClickSound();
    setChecklistItems(prev => [...prev, { text: newCheckItem.trim(), done: false }]);
    setNewCheckItem('');
  };

  const removeCheckItem = (idx: number) => {
    playClickSound();
    setChecklistItems(prev => prev.filter((_, i) => i !== idx));
  };

  // Checklist completion statistics
  const completedCount = checklistItems.filter(i => i.done).length;
  const progressPercent = Math.round((completedCount / (checklistItems.length || 1)) * 100);

  // Template Generation
  const generatedMessage = useMemo(() => {
    const name = clientName.trim() || 'Estimado/a Cliente';
    const loc = serviceLocation.trim() || 'Domicilio del cliente';

    if (selectedTemplate === 'express') {
      return `¡Hola ${name}! 👋
Le saluda el *Servicio Técnico Hidráulico Residencial*.

Cotización para su solicitud:
🔧 *Trabajo:* ${serviceTitle}
📍 *Ubicación:* ${loc}
⏱️ *Tiempo estimado:* ${estimatedDuration}
🛡️ *Garantía:* ${warrantyDays} de estanqueidad certificada

💰 *PRECIO FINAL:* *$${finalPrice} USD*

¿Desea coordinar el horario de visita para hoy o mañana? Quedo a su disposición.`;
    }

    if (selectedTemplate === 'urgencia') {
      return `🚨 *ATENCIÓN TÉCNICA DE URGENCIA HIDRÁULICA* 🚨
Para: *${name}*
Ubicación: *${loc}*

⚠️ *RECOMENDACIÓN INMEDIATA:* Si aún no lo ha hecho, por favor *cierre la llave de paso general* del domicilio o del ramal para evitar mayores daños materiales.

🛠️ *Servicio de Emergencia:* ${serviceTitle}
⏱️ *Respuesta de arribo:* Dentro de los próximos 45-60 min
🛡️ *Garantía de intervención:* ${warrantyDays}

💵 *Presupuesto Estimado:* *$${finalPrice} USD* (Incluye desplazamiento inmediato y contención prioritaria)

👉 Por favor, responda *CONFIRMAR* enviando su dirección exacta para despachar la unidad técnica de inmediato.`;
    }

    // Default: Detallada
    return `🔧 *PRESUPUESTO TÉCNICO HIDRÁULICO CERTIFICADO* 🔧
Estimado/a: *${name}*
Dirección: *${loc}*
Fecha: ${new Date().toLocaleDateString('es-ES')}
---------------------------------------------
📋 *DESCRIPCIÓN DEL SERVICIO:*
${serviceTitle}

⏱️ *Tiempo Estimado de Ejecución:* ${estimatedDuration}
🛡️ *Garantía de Conformidad:* ${warrantyDays} contra fugas y defectos de estanqueidad
🧪 *Control de Calidad:* Prueba de presión y hermetismo continuo (10 minutos certificada)

💰 *INVERSIÓN TOTAL:* *$${finalPrice} USD*
(Incluye mano de obra calificada, selladores técnicos y prueba hidráulica)
---------------------------------------------
Quedo atento a su confirmación para reservar el turno técnico en su domicilio. ¡Muchas gracias por su confianza!`;
  }, [clientName, serviceLocation, serviceTitle, finalPrice, estimatedDuration, warrantyDays, selectedTemplate]);

  const handleCopy = async () => {
    playSuccessSound();
    await copyToClipboard(generatedMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2200);
  };

  const handleSendWhatsApp = () => {
    playSuccessSound();
    const cleanPhone = clientPhone.replace(/\D/g, '');
    const encodedText = encodeURIComponent(generatedMessage);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank');
  };

  const handleCopyActa = async () => {
    playSuccessSound();
    const actaText = `📋 ACTA TÉCNICA DE CONFORMIDAD Y ENTREGA DE OBRA
Cliente: ${clientName}
Dirección: ${serviceLocation}
Servicio: ${serviceTitle}
Fecha: ${new Date().toLocaleDateString('es-ES')}
-----------------------------------------------
VERIFICACIONES REALIZADAS (${completedCount}/${checklistItems.length} completadas):
${checklistItems.map(i => `${i.done ? '✅' : '⬜'} ${i.text}`).join('\n')}
-----------------------------------------------
Garantía: ${warrantyDays} a partir de la fecha.
Certificación de prueba de estanqueidad superada con cero goteos.`;

    await copyToClipboard(actaText);
    setCopiedActa(true);
    setTimeout(() => setCopiedActa(false), 2200);
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto">
      
      {/* View Switcher Header (Cotizador vs Checklist) */}
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0b1019] border border-[#1e293b] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 flex items-center justify-center font-bold shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white font-mono flex items-center gap-1.5">
              COTIZADOR WHATSAPP & CHECKLIST
            </h2>
            <p className="text-xs text-slate-400">
              Cotizaciones profesionales con cierre de venta y actas de conformidad
            </p>
          </div>
        </div>

        {/* Sub-tab pills (Mobile responsive full-width) */}
        <div className="grid grid-cols-2 bg-[#121927] p-1 rounded-xl border border-[#243046] text-xs font-bold font-mono w-full sm:w-auto">
          <button
            onClick={() => {
              playClickSound();
              setSubTab('quote');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg transition-all ${
              subTab === 'quote' 
                ? 'bg-[#25D366] text-black shadow font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Cotizador</span>
            <span className="hidden sm:inline">Cotizador WhatsApp</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSubTab('checklist');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg transition-all ${
              subTab === 'checklist' 
                ? 'bg-[#FFCC00] text-black shadow font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Checklist ({progressPercent}%)</span>
            <span className="hidden sm:inline">Checklist Obra ({progressPercent}%)</span>
          </button>
        </div>
      </div>

      {subTab === 'quote' ? (
        /* COTIZADOR WHATSAPP VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          
          {/* Left Form: Client Data & Parameters (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Template Selector */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0d1420] border border-[#1e293b] space-y-2.5">
              <label className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFCC00]" />
                Formato de Plantilla de Mensaje
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono">
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedTemplate('detallada');
                  }}
                  className={`py-2 px-1.5 sm:px-2 rounded-xl border text-center transition-all ${
                    selectedTemplate === 'detallada'
                      ? 'bg-[#152338] text-white border-[#FFCC00] font-bold shadow-[0_0_10px_rgba(255,204,0,0.2)]'
                      : 'bg-[#121927] border-[#223046] text-slate-400 hover:text-white'
                  }`}
                >
                  📋 Detallada
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedTemplate('express');
                  }}
                  className={`py-2 px-1.5 sm:px-2 rounded-xl border text-center transition-all ${
                    selectedTemplate === 'express'
                      ? 'bg-[#152338] text-white border-[#25D366] font-bold shadow-[0_0_10px_rgba(37,211,102,0.2)]'
                      : 'bg-[#121927] border-[#223046] text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Express
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedTemplate('urgencia');
                  }}
                  className={`py-2 px-1.5 sm:px-2 rounded-xl border text-center transition-all ${
                    selectedTemplate === 'urgencia'
                      ? 'bg-rose-950/40 text-rose-300 border-rose-500 font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                      : 'bg-[#121927] border-[#223046] text-slate-400 hover:text-white'
                  }`}
                >
                  🚨 Urgencia
                </button>
              </div>
            </div>

            {/* Client Inputs Form */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1420] border border-[#1e293b] space-y-3.5">
              <div className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5 pb-1 border-b border-[#1e293b]">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Datos del Cliente y Servicio
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Nombre del Cliente:</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#121927] border border-[#243046] focus:border-[#25D366] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    placeholder="Ej: Sra. María Gómez"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Teléfono WhatsApp (opcional):</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-[#121927] border border-[#243046] focus:border-[#25D366] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    placeholder="Ej: +54 9 11 2345 6789"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Dirección o Sector:</label>
                <input
                  type="text"
                  value={serviceLocation}
                  onChange={(e) => setServiceLocation(e.target.value)}
                  className="w-full bg-[#121927] border border-[#243046] focus:border-[#25D366] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  placeholder="Ej: Av. San Martín 1240, Dpto 4B"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Servicio / Reparación:</label>
                <input
                  type="text"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full bg-[#121927] border border-[#243046] focus:border-[#FFCC00] rounded-xl px-3 py-2 text-xs text-white outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Precio USD:</label>
                  <input
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(Number(e.target.value) || 0)}
                    className="w-full bg-[#121927] border border-[#243046] focus:border-[#FFCC00] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#FFCC00] outline-none text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Tiempo Est.:</label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    className="w-full bg-[#121927] border border-[#243046] rounded-xl px-3 py-2 text-xs font-mono text-white outline-none text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Garantía:</label>
                  <input
                    type="text"
                    value={warrantyDays}
                    onChange={(e) => setWarrantyDays(e.target.value)}
                    className="w-full bg-[#121927] border border-[#243046] rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 font-bold outline-none text-center"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Realistic WhatsApp Phone Mockup (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Phone Screen Mockup */}
            <div className="rounded-3xl bg-[#0b141a] border-4 border-[#1e2a38] shadow-2xl overflow-hidden flex flex-col">
              
              {/* WhatsApp App Bar Header */}
              <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between text-white border-b border-[#2a3942]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-black font-black flex items-center justify-center text-xs">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight flex items-center gap-1">
                      <span>Plomero Pro Certificado</span>
                      <CheckCircle2 className="w-3 h-3 text-[#25D366]" />
                    </div>
                    <div className="text-[10px] text-emerald-400 leading-tight">en línea</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  WhatsApp Preview
                </div>
              </div>

              {/* Chat Canvas with Wallpaper */}
              <div className="p-4 bg-[#0b141a] min-h-[320px] max-h-[460px] overflow-y-auto space-y-3 font-sans">
                
                {/* Outgoing Message Bubble */}
                <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-sm p-3.5 shadow-md ml-auto max-w-[95%] text-xs leading-relaxed space-y-2 border border-[#02735e]">
                  <div className="whitespace-pre-line select-text font-normal text-[12px]">
                    {generatedMessage}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/70 font-mono">
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  </div>
                </div>

              </div>

              {/* Action Bar Footer */}
              <div className="p-3 bg-[#1f2c34] border-t border-[#2a3942] space-y-2">
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black uppercase tracking-wider text-xs transition-all active:scale-95 shadow-[0_0_16px_rgba(37,211,102,0.35)]"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Enviar por WhatsApp {clientPhone ? `al ${clientPhone}` : ''}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#121b22] hover:bg-[#18232c] text-slate-200 border border-[#2a3942] text-xs font-bold transition-all active:scale-95"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">¡Texto Copiado al Portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#25D366]" />
                      <span>Copiar Texto Formateado</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* INTERACTIVE CHECKLIST VIEW */
        <div className="space-y-4">
          
          {/* Progress Header Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1420] via-[#101b2c] to-[#0d1420] border border-[#1e293b] shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Protocolo Técnico de Calidad y Cero Fugas
                </span>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  {serviceTitle}
                </h3>
              </div>

              {/* Progress Stat */}
              <div className="flex items-center gap-3 bg-[#070a0f] border border-[#243046] px-4 py-2 rounded-xl font-mono">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Progreso</div>
                  <div className="text-sm font-black text-[#FFCC00]">
                    {completedCount} / {checklistItems.length}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center font-bold text-xs text-white" style={{
                  borderColor: progressPercent === 100 ? '#10b981' : '#FFCC00'
                }}>
                  {progressPercent}%
                </div>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="h-2 rounded-full bg-[#121927] overflow-hidden border border-[#1e293b]">
              <div 
                className="h-full bg-gradient-to-r from-[#FFCC00] to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Batch Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkAll(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#141e2e] hover:bg-[#1a273b] text-emerald-300 border border-emerald-500/30 font-bold transition-all"
                >
                  ✓ Marcar Todos
                </button>
                <button
                  onClick={() => handleMarkAll(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#141e2e] hover:bg-[#1a273b] text-slate-400 border border-[#243046] font-medium transition-all"
                >
                  Desmarcar Todos
                </button>
              </div>

              <button
                onClick={handleCopyActa}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFCC00] hover:bg-[#ffd633] text-black font-black uppercase text-[11px] transition-all active:scale-95 shadow"
              >
                {copiedActa ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedActa ? '¡Acta Copiada!' : 'Copiar Acta de Entrega'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Checklist Cards */}
          <div className="space-y-2">
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all flex items-start justify-between gap-3 ${
                  item.done
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.08)]'
                    : 'bg-[#0d1420] border-[#1e293b] text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                    item.done
                      ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                      : 'border-slate-600 bg-[#070a0f]'
                  }`}>
                    {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className={`text-xs sm:text-sm font-medium leading-relaxed ${item.done ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {item.text}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCheckItem(idx);
                  }}
                  className="text-slate-600 hover:text-rose-400 p-1 opacity-60 hover:opacity-100 transition-opacity"
                  title="Eliminar este ítem"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom item box */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0d1420] border border-[#1e293b]">
            <input
              type="text"
              value={newCheckItem}
              onChange={(e) => setNewCheckItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomCheckItem()}
              placeholder="Agregar verificación personalizada (ej: 'Reemplazo de abrazadera sin fin en flexible')..."
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={addCustomCheckItem}
              className="px-3 py-1.5 rounded-lg bg-[#141e2e] hover:bg-[#1a273b] text-[#FFCC00] border border-[#27374f] text-xs font-bold transition-all"
            >
              + Agregar
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
