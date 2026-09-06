import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { TabBar, MainTabType } from './components/TabBar';
import { ManualView } from './components/ManualView';
import { DiagnosticView } from './components/DiagnosticView';
import { CalculatorView, BudgetCalculation } from './components/CalculatorView';
import { WhatsAppQuoteView } from './components/WhatsAppQuoteView';
import { TechnicalRecordModal } from './components/TechnicalRecordModal';
import { DocumentationModal } from './components/DocumentationModal';
import { generatePlumbingDatabase } from './data/databaseGenerator';
import { PlumbingRecord } from './types/database';

export default function App() {
  // Generate and memoize the database of 2,850+ records
  const databaseRecords = useMemo(() => {
    return generatePlumbingDatabase();
  }, []);

  // Application States
  const [activeTab, setActiveTab] = useState<MainTabType>('manual');
  const [selectedRecord, setSelectedRecord] = useState<PlumbingRecord | null>(null);
  const [calculatorRecord, setCalculatorRecord] = useState<PlumbingRecord | null>(null);
  const [activeBudget, setActiveBudget] = useState<BudgetCalculation | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [searchQueryTrigger, setSearchQueryTrigger] = useState('');
  const [onlyFavoritesFilter, setOnlyFavoritesFilter] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('plomero_pro_favorites');
      if (saved) return JSON.parse(saved);
      // Pre-populate with 3 helpful emergency favorites as starter
      return ['PLUMB-0001', 'PLUMB-0701', 'PLUMB-1301'];
    } catch {
      return ['PLUMB-0001', 'PLUMB-0701', 'PLUMB-1301'];
    }
  });

  // Save favorites whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('plomero_pro_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites to localStorage:', e);
    }
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenFavorites = () => {
    setOnlyFavoritesFilter(true);
    setActiveTab('manual');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for seamless workflow across tabs
  const handleSelectRecord = (record: PlumbingRecord) => {
    setSelectedRecord(record);
  };

  const handleSendToCalculator = (record: PlumbingRecord) => {
    setCalculatorRecord(record);
    setActiveTab('calculadora');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendToQuote = (record: PlumbingRecord) => {
    setSelectedRecord(record);
    setActiveTab('cotizador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChecklist = (record: PlumbingRecord) => {
    setSelectedRecord(record);
    setActiveTab('cotizador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTransferToQuoteFromCalc = (budget: BudgetCalculation) => {
    setActiveBudget(budget);
    setActiveTab('cotizador');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFocus = () => {
    setOnlyFavoritesFilter(false);
    setActiveTab('manual');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col selection:bg-[#FFCC00] selection:text-black font-sans antialiased">
      
      {/* Top Bar Header with Sound & Favorites counters */}
      <Header
        records={databaseRecords}
        onOpenDocs={() => setIsDocsOpen(true)}
        onSearchFocus={handleSearchFocus}
        totalCount={databaseRecords.length}
        favoritesCount={favorites.length}
        onOpenFavorites={handleOpenFavorites}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {activeTab === 'manual' && (
          <ManualView
            records={databaseRecords}
            onSelectRecord={handleSelectRecord}
            onSendToCalculator={handleSendToCalculator}
            onSendToQuote={handleSendToQuote}
            initialSearch={searchQueryTrigger}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onlyFavoritesFilter={onlyFavoritesFilter}
          />
        )}

        {activeTab === 'diagnostico' && (
          <DiagnosticView
            records={databaseRecords}
            onSelectRecord={handleSelectRecord}
            onSendToCalculator={handleSendToCalculator}
            onSendToQuote={handleSendToQuote}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'calculadora' && (
          <CalculatorView
            initialRecord={calculatorRecord}
            records={databaseRecords}
            onTransferToQuote={handleTransferToQuoteFromCalc}
          />
        )}

        {activeTab === 'cotizador' && (
          <WhatsAppQuoteView
            activeRecord={selectedRecord}
            activeBudget={activeBudget}
            records={databaseRecords}
            onSelectRecordForChecklist={handleSelectRecord}
          />
        )}
      </main>

      {/* Bottom Sticky Tab Bar for field ergonomic navigation */}
      <TabBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setOnlyFavoritesFilter(false);
          setActiveTab(tab);
        }}
        hasActiveChecklist={!!selectedRecord}
      />

      {/* Technical Record Modal Drawer */}
      <TechnicalRecordModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onSendToCalculator={handleSendToCalculator}
        onSendToQuote={handleSendToQuote}
        onStartChecklist={handleStartChecklist}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Architecture & Documentation Modal */}
      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        records={databaseRecords}
      />

    </div>
  );
}
