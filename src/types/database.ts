export interface DiagnosticData {
  sintoma: string;
  causa: string;
  solucao: string;
  herramientas: string[];
  urgencia: 'Baja' | 'Media' | 'Alta' | 'Emergencia';
}

export interface PlumbingRecord {
  id: string;
  moduloId: 1 | 2 | 3 | 4 | 5;
  modulo: string;
  categoria: string;
  subcategoria: string;
  problemaServicio: string;
  causasProvaveis: string[];
  materialNecessario: string[];
  passoAPassoTecnico: string[];
  checklistFinal: string[];
  precoSugeridoUSD: number;
  tempoEstimadoMinutos: number;
  nivelDificuldade: 'Básico' | 'Intermedio' | 'Avanzado' | 'Especialista';
  diagnosticoRapido?: DiagnosticData;
}

export type ModuleFilterType = 'ALL' | 1 | 2 | 3 | 4 | 5;

export interface FilterState {
  search: string;
  moduloId: ModuleFilterType;
  subcategoria: string;
  dificuldade: string;
  precioMin: number;
  precioMax: number;
  sortBy: 'id' | 'precio-asc' | 'precio-desc' | 'problema' | 'modulo';
}
