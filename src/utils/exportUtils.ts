import { PlumbingRecord } from '../types/database';

export function downloadJsonFile(data: unknown, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsvFile(records: PlumbingRecord[], filename: string) {
  const headers = [
    'ID',
    'Modulo',
    'Categoria',
    'Subcategoria',
    'Problema_Servicio',
    'Causas_Provaveis',
    'Material_Necessario',
    'Passo_a_Passo_Tecnico',
    'Checklist_Final',
    'Preco_Sugerido_USD',
    'Tiempo_Estimado_Minutos',
    'Nivel_Dificultad',
    'Sintoma_Diagnostico',
    'Causa_Diagnostico',
    'Solucion_Diagnostico'
  ];

  const escapeCsv = (str: string) => {
    if (!str) return '""';
    const cleanStr = String(str).replace(/"/g, '""');
    return `"${cleanStr}"`;
  };

  const rows = records.map((r) => [
    escapeCsv(r.id),
    escapeCsv(r.modulo),
    escapeCsv(r.categoria),
    escapeCsv(r.subcategoria),
    escapeCsv(r.problemaServicio),
    escapeCsv(r.causasProvaveis.join(' | ')),
    escapeCsv(r.materialNecessario.join(' | ')),
    escapeCsv(r.passoAPassoTecnico.join(' | ')),
    escapeCsv(r.checklistFinal.join(' | ')),
    r.precoSugeridoUSD,
    r.tempoEstimadoMinutos,
    escapeCsv(r.nivelDificuldade),
    escapeCsv(r.diagnosticoRapido?.sintoma || ''),
    escapeCsv(r.diagnosticoRapido?.causa || ''),
    escapeCsv(r.diagnosticoRapido?.solucao || '')
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      return Promise.resolve(true);
    } catch {
      textArea.remove();
      return Promise.resolve(false);
    }
  }
}
