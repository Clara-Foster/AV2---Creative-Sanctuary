/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabaseClient';
import { 
  Shield, 
  Palette, 
  HelpCircle, 
  LogOut, 
  Settings, 
  Bell, 
  Compass, 
  PlusCircle, 
  ChevronRight, 
  Verified, 
  Lock, 
  History,
  FileCheck,
  Smartphone,
  ExternalLink,
  Laptop,
  Home
} from 'lucide-react';

import { ProtectedRecord } from './types';
import { PRESET_ARTWORKS, INITIAL_RECORDS } from './data';
import ProtectionWorkshop from './components/ProtectionWorkshop';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'estudio' | 'proteger'>('inicio');
  const [records, setRecords] = useState<ProtectedRecord[]>(INITIAL_RECORDS);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  
  // Auth states
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; initials: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const getStorageKey = (userId: string) => `creative-sanctuary-records-${userId}`;

  const loadStoredRecords = (userId: string) => {
    try {
      const stored = localStorage.getItem(getStorageKey(userId));
      if (!stored) return INITIAL_RECORDS;
      const parsed = JSON.parse(stored) as ProtectedRecord[];
      return Array.isArray(parsed) ? parsed : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  };

  const persistRecordsForUser = (userId: string, recordsToStore: ProtectedRecord[]) => {
    try {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(recordsToStore));
    } catch (error) {
      console.warn('Falha ao salvar registros do estúdio', error);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (user) {
        const userName = user.user_metadata?.name || user.email || '';
        const initials = userName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        setCurrentUser({
          id: user.id,
          name: userName,
          email: user.email,
          initials,
        });
        setRecords(loadStoredRecords(user.id));
      }
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user;
      if (user) {
        const userName = user.user_metadata?.name || user.email || '';
        const initials = userName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        setCurrentUser({
          id: user.id,
          name: userName,
          email: user.email,
          initials,
        });
        setRecords(loadStoredRecords(user.id));
      } else {
        setCurrentUser(null);
        setRecords(INITIAL_RECORDS);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setRecords(INITIAL_RECORDS);
    setActiveTab('proteger');
  };

  const handleAddRecord = (newRec: ProtectedRecord) => {
    setRecords(prev => {
      const next = [newRec, ...prev];
      if (currentUser) {
        persistRecordsForUser(currentUser.id, next);
      }
      return next;
    });
  };

  // Quick detail modal state for an artwork record
  const [activeDetailRecord, setActiveDetailRecord] = useState<ProtectedRecord | null>(null);

  // Notifications simulation
  const [notifications, setNotifications] = useState<string[]>([
    'Seu Estúdio criativo está seguro e monitorado.',
    'Assinatura digital inserida com sucesso em "Pétalas da Manhã".',
    'Conexão estável estabelecida no nó de criptografia porta 3000.'
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Trigger quick screen action
  const triggerPrepareNewScreen = (presetId?: string) => {
    if (presetId) {
      setSelectedPresetId(presetId);
    } else {
      setSelectedPresetId(null);
    }
    setActiveTab('proteger');
  };

  return (
    <div className="bg-brand-surface text-brand-on-surface font-sans min-h-screen selection:bg-brand-secondary selection:text-brand-primary overflow-x-hidden pb-16">
      
      {/* GLOBAL HEADER BAR */}
      <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-brand-outline-variant/30 flex justify-between items-center px-10 h-20 shadow-sm shadow-brand-primary/5">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('inicio')}>
          <div className="relative w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-md shadow-brand-primary/20">
            <Shield className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full animate-ping"></div>
          </div>
          <div>
            <span className="font-headline-sm text-lg font-bold tracking-tight text-brand-primary block">
              Creative Sanctuary
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-outline font-semibold">
              Estúdio de Salvaguarda
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('inicio')}
            className={`font-label-md text-sm transition-all pb-1 cursor-pointer ${
              activeTab === 'inicio' 
                ? 'text-brand-primary border-b-2 border-brand-primary font-bold' 
                : 'text-brand-on-surface/60 hover:text-brand-primary font-medium'
            }`}
          >
            Início
          </button>

          <button 
            onClick={() => setActiveTab('estudio')}
            className={`font-label-md text-sm transition-all pb-1 cursor-pointer ${
              activeTab === 'estudio' 
                ? 'text-brand-primary border-b-2 border-brand-primary font-bold' 
                : 'text-brand-on-surface/60 hover:text-brand-primary font-medium'
            }`}
          >
            Meu Estúdio
          </button>
          
          <button 
            onClick={() => triggerPrepareNewScreen()}
            className={`font-label-md text-sm transition-all pb-1 cursor-pointer ${
              activeTab === 'proteger' 
                ? 'text-brand-primary border-b-2 border-brand-primary font-bold' 
                : 'text-brand-on-surface/60 hover:text-brand-primary font-medium'
            }`}
          >
            Proteger Arte
          </button>
        </nav>

        {/* Utility Icons Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => triggerPrepareNewScreen()}
            className="bg-brand-primary text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-brand-primary-container hover:opacity-95 transition-all shadow-md shadow-brand-primary/10 active:scale-95"
          >
            Enviar Arte
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="relative p-2.5 text-brand-primary hover:bg-brand-secondary/35 rounded-full transition-colors"
            >
              <Bell className="w-4 h-4" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-accent rounded-full border border-white"></div>
            </button>

            <AnimatePresence>
              {showNotificationDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-brand-outline-variant/40 shadow-xl p-4 z-50 text-xs"
                >
                  <p className="font-bold border-b pb-2 text-brand-primary mb-2 flex items-center justify-between">
                    <span>Central de Avisos</span>
                    <span className="text-[10px] text-brand-outline px-2 py-0.5 bg-zinc-100 rounded">Ativo</span>
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {notifications.map((note, index) => (
                      <div key={index} className="p-2 bg-brand-surface rounded border border-brand-outline-variant/10 text-brand-on-surface/75">
                        {note}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {currentUser ? (
            <div 
              id="header-user-badge"
              onClick={() => {
                setActiveTab('estudio');
              }}
              title={`Ver Meu Estúdio (${currentUser.name})`}
              className="w-9 h-9 rounded-full bg-brand-primary text-brand-secondary flex items-center justify-center font-bold text-xs ring-2 ring-brand-secondary cursor-pointer shadow-md shadow-brand-primary/10 hover:opacity-90"
            >
              {currentUser.initials}
            </div>
          ) : (
            <button
              id="header-enter-btn"
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 bg-brand-secondary text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-all text-xs font-bold ring-1 ring-brand-primary/10"
            >
              Entrar
            </button>
          )}
        </div>
      </header>

      {/* THREE STATES SIDEBAR DRAWER (PERSISTENT / OFF-MOBILE GUEST RAIL) */}
      <aside className="hidden lg:flex flex-col py-6 px-4 gap-4 h-screen w-64 fixed left-0 top-20 bg-brand-surface-container shadow-md border-r border-brand-outline-variant/10">
        <div className="px-4 py-2 border-b border-brand-outline-variant/20 pb-4 mb-2">
          <p className="text-[10px] font-bold text-brand-outline tracking-wider uppercase">Espaço do Artista</p>
          <h3 className="font-headline-sm text-brand-primary text-lg font-bold">Estúdio Criativo</h3>
        </div>

        <nav className="flex flex-col gap-2">
          <div 
            onClick={() => setActiveTab('inicio')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs cursor-pointer transition-all hover:translate-x-1 ${
              activeTab === 'inicio' 
                ? 'bg-brand-primary text-white shadow shadow-brand-primary/25' 
                : 'text-brand-on-surface/75 hover:bg-brand-secondary/30'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Início</span>
          </div>

          <div 
            onClick={() => setActiveTab('estudio')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs cursor-pointer transition-all hover:translate-x-1 ${
              activeTab === 'estudio' 
                ? 'bg-brand-primary text-white shadow shadow-brand-primary/25' 
                : 'text-brand-on-surface/75 hover:bg-brand-secondary/30'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Meu Estúdio</span>
          </div>

          <div 
            onClick={() => triggerPrepareNewScreen()}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs cursor-pointer transition-all hover:translate-x-1 ${
              activeTab === 'proteger' 
                ? 'bg-brand-primary text-white shadow shadow-brand-primary/25' 
                : 'text-brand-on-surface/75 hover:bg-brand-secondary/30'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Proteger Arte</span>
          </div>
        </nav>

        {/* Quick statistics tracker overlay */}
        <div className="mt-8 bg-white border border-brand-outline-variant/20 rounded-xl p-4 text-xs space-y-3">
          <p className="font-bold text-brand-primary uppercase text-[9px] tracking-wider">Histórico de Atividade</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-zinc-500">
              <span>Nível de Proteção</span>
              <span className="font-bold text-brand-primary">LOCKED_99%</span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full w-[95%]"></div>
            </div>
            <p className="text-[9.5px] text-zinc-400">Nós seguros ativos para mitigação de raspagem de inteligência artificial.</p>
          </div>
        </div>

        {/* Sidebar help / exit controls at bottom */}
        <div className="mt-auto flex flex-col gap-1 border-t border-brand-outline-variant/20 pt-4 text-xs">
          <div className="flex items-center gap-3 px-4 py-2 text-brand-on-surface/75 hover:bg-zinc-150 rounded-lg cursor-pointer transition-all" onClick={() => alert('Dúvidas? Entre em contato pelo correio cfm@cesar.school')}>
            <HelpCircle className="w-4 h-4 text-brand-primary" />
            <span>Ajuda</span>
          </div>
          {currentUser ? (
            <div 
              id="sidebar-logout-btn"
              className="flex items-center gap-3 px-4 py-2 text-brand-on-surface/75 hover:bg-red-50 hover:text-red-600 rounded-lg cursor-pointer transition-all font-bold" 
              onClick={async () => {
                if (window.confirm('Desconectando do seu Santuário Criativo... Deseja prosseguir?')) {
                  await handleLogout();
                }
              }}
            >
              <LogOut className="w-4 h-4 text-brand-primary hover:text-red-600" />
              <span>Sair ({currentUser.name})</span>
            </div>
          ) : (
            <div 
              id="sidebar-login-btn"
              className="flex items-center gap-3 px-4 py-2 text-brand-on-surface/75 hover:bg-brand-secondary/35 rounded-lg cursor-pointer transition-all font-bold text-brand-primary" 
              onClick={() => setIsAuthModalOpen(true)}
            >
              <Lock className="w-4 h-4 text-brand-primary" />
              <span>Entrar</span>
            </div>
          )}
        </div>
      </aside>

      {/* CORE WORKSPACE ENTRY CONTAINER */}
      <main className="pt-32 px-6 lg:ml-64 lg:px-16 max-w-7xl mx-auto w-full">
        
        {/* VIEW 0: HOME LANDING PAGE */}
        {activeTab === 'inicio' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <LandingPage 
              onStartProtecting={(presetId) => {
                triggerPrepareNewScreen(presetId);
              }}
              onGoToStudio={() => setActiveTab('estudio')}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              isLoggedIn={!!currentUser}
              userEmail={currentUser?.email}
            />
          </motion.div>
        )}

        {/* VIEW 1: MEU ESTÚDIO COCKPIT */}
        {activeTab === 'estudio' && (
          !currentUser ? (
            <motion.div
              id="estudio-locked-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 max-w-xl mx-auto text-center py-12"
            >
              <div className="bg-white p-8 rounded-2xl border border-brand-outline-variant/30 shadow-xl space-y-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-brand-secondary/40 border border-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary shadow-inner">
                  <Lock className="w-8 h-8 text-brand-primary animate-pulse" />
                </div>
                
                <div className="space-y-2">
                  <h2 className="font-headline-md text-2xl text-brand-primary font-bold">Portal Restrito ao Artista</h2>
                  <p className="text-sm text-brand-on-surface/60 max-w-md mx-auto leading-relaxed">
                    Para acessar o seu Atelier pessoal, monitorar suas obras e visualizar metadados originais de proteção, é preciso estar conectado.
                  </p>
                </div>

                <div className="w-full p-4 bg-brand-surface rounded-xl border border-brand-outline-variant/20 text-xs text-brand-on-surface/80 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-brand-primary shrink-0" />
                  <p className="text-left leading-relaxed">
                    Utilizamos criptografia ponta a ponta. Suas credenciais vinculam a autoria das marcas digitais de forma segura e livre de raspagem de dados.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 w-full">
                  <button
                    id="locked-view-login-btn"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full bg-brand-primary text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider transition-all hover:opacity-95 active:scale-95 shadow-lg shadow-brand-primary/25 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 text-brand-accent fill-brand-accent/25" />
                    Entrar no Meu Estúdio
                  </button>
                  <p className="text-[10px] text-brand-on-surface/50 font-mono">
                    Conexão de segurança local estabelecida na porta 3000
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              id="estudio-unlocked-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Greetings Banner */}
              <section className="space-y-1 bg-white p-8 rounded-xl border border-brand-outline-variant/10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-brand-secondary opacity-15 rounded-l-full blur-2xl"></div>
                <h1 className="font-display-lg text-brand-primary tracking-tight">Olá, {currentUser.name}.</h1>
                <p className="text-sm text-brand-on-surface/70 max-w-2xl">
                  Seu santuário é cuidado e seguro. Explore suas últimas obras-primas e ativos digitais protegidos com assinaturas indelúveis contra reprodução não autorizada.
                </p>
              </section>

            {/* Quick Stat Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Peace of Mind Card */}
              <div className="glass-panel p-6 rounded-xl flex items-center gap-6 border border-brand-outline-variant/20 shadow shadow-brand-primary/5 transition-all hover:scale-[1.01]">
                <div className="bg-brand-secondary p-4 rounded-full text-brand-primary">
                  <Shield className="w-8 h-8 text-brand-primary" />
                </div>
                <div>
                  <h2 className="font-headline-sm text-brand-primary text-lg">Tranquilidade</h2>
                  <p className="text-xs text-brand-on-surface/60">Seu Estúdio está Seguro</p>
                </div>
                <div className="ml-auto bg-green-100 text-green-800 text-[9px] font-bold font-mono px-2 py-1 rounded">
                  ATIVO
                </div>
              </div>

              {/* Card 2: Autograph Counters */}
              <div className="glass-panel p-6 rounded-xl flex items-center gap-6 border border-brand-outline-variant/20 shadow shadow-brand-primary/5 transition-all hover:scale-[1.01]">
                <div className="bg-brand-primary text-white p-4 rounded-full">
                  <Verified className="w-8 h-8 text-brand-accent h-[32px] w-[32px]" />
                </div>
                <div>
                  <h2 className="font-headline-sm text-brand-primary text-lg">
                    {records.length} Obras-primas Verificadas
                  </h2>
                  <p className="text-xs text-brand-on-surface/60">Ativos Criptografados no Bloco</p>
                </div>
              </div>
            </section>

            {/* Curated Protected Gallery */}
            <section className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <h2 className="font-headline-md text-brand-primary text-lg font-bold flex items-center gap-2">
                  <FileCheck className="w-5 h-5" /> Ativos Protegidos no Atelier
                </h2>
                <button 
                  onClick={() => triggerPrepareNewScreen()}
                  className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
                >
                  Criar Novo Registro <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Protected Assets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {records.map((rec) => (
                  <motion.div 
                    key={rec.id}
                    layoutId={rec.id}
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-brand-outline-variant/20 hover:border-brand-primary shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="p-3">
                      {/* Image Viewer Cover */}
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 mb-3">
                        <img 
                          src={rec.originalImage} 
                          alt={rec.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-brand-primary/90 text-white rounded-full font-mono text-[8px] px-2.5 py-1 flex items-center gap-1 backdrop-blur shadow">
                          <Lock className="w-2.5 h-2.5 text-brand-accent" />
                          <span>MTRX_SECURED</span>
                        </div>
                        
                        {/* Hover Overlay */}
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDetailRecord(rec);
                          }}
                          className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-auto"
                        >
                          <span className="bg-white/90 text-brand-primary text-xs px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 shadow-lg">
                            <Verified className="w-4 h-4" /> Ver Certificado
                          </span>
                        </div>
                      </div>

                      {/* Header details */}
                      <div className="px-1 space-y-1">
                        <h3 className="font-headline-sm text-brand-primary text-base truncate font-bold">{rec.title}</h3>
                        <div className="flex justify-between items-center text-[10px] text-brand-on-surface/50 font-mono">
                          <span>{rec.artist}</span>
                          <span>REG: {rec.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Security credentials footer inside galler card */}
                    <div className="bg-zinc-50 px-4 py-2 border-t border-zinc-100 flex justify-between items-center text-[10px] text-brand-outline font-mono">
                      <span>Hash: {rec.hash}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPresetId(PRESET_ARTWORKS.find(p => p.title === rec.title)?.id || null);
                          setActiveTab('proteger');
                        }}
                        className="text-brand-primary font-bold hover:underline"
                      >
                        Recriar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
         )
        )}

        {/* VIEW 2: CRYPTOGRAPHIC PROTECTION WORKSHOP & STATES */}
        {activeTab === 'proteger' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Main title & header context matching the mockup screenshots */}
            <section className="text-center max-w-3xl mx-auto space-y-3 mb-8">
              <h1 className="font-display-lg text-brand-primary tracking-tight leading-tight">
                Compartilhe sua visão com o mundo, com proteção.
              </h1>
              <p className="text-sm md:text-base text-brand-on-surface/75">
                Usamos criptografia suave para escanear sua obra-prima, garantindo que seus direitos criativos sejam preservados antes de chegarem ao éter digital.
              </p>
            </section>

            {/* Mount Workshop component */}
            <ProtectionWorkshop 
              onAddRecord={handleAddRecord}
              onNavigateToGallery={() => setActiveTab('estudio')}
              activePresetId={selectedPresetId}
              clearActivePreset={() => setSelectedPresetId(null)}
            />
          </motion.div>
        )}

      </main>

      {/* DETAILED DIALOG: Authentic Certificate of Authenticity Overlay */}
      <AnimatePresence>
        {activeDetailRecord && (
          <div 
            className="fixed inset-0 bg-zinc-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setActiveDetailRecord(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Certificate layout resembling the 4th success card in mockup */}
              <div className="bg-brand-primary text-white p-6 relative">
                <div className="absolute top-4 right-4 text-brand-accent bg-brand-primary-container px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase">
                  Registro Original
                </div>
                <h3 className="font-headline-sm text-lg font-bold text-white">Certificado de Autenticidade</h3>
                <p className="text-[10px] text-brand-secondary tracking-widest uppercase font-mono mt-1">CS-ATELIER-IMMUTABLE-SECURE</p>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Micro presentation of registered work */}
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200">
                  <img 
                    src={activeDetailRecord.originalImage} 
                    alt={activeDetailRecord.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Metadata Fields */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-brand-surface rounded-lg border border-brand-outline-variant/30">
                    <div className="w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary font-bold">
                      EV
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-brand-outline uppercase tracking-wider">CRIADOR</p>
                      <p className="text-xs text-brand-primary font-bold">Autoria Verificada: {activeDetailRecord.artist}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1 font-mono">REGISTRO</span>
                      <span className="font-medium text-brand-primary">{activeDetailRecord.title}</span>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col justify-between font-mono text-[11px]">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1 font-sans">IMUTÁVEL</span>
                      <span className="text-brand-primary truncate">{activeDetailRecord.timestamp}</span>
                    </div>
                  </div>

                  <div className="p-3 border border-dashed border-zinc-200 rounded-lg font-mono text-xs flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-sans">CHAVE SHA-256 DO COFRE</p>
                      <p className="text-brand-primary text-[11px] font-bold truncate mt-0.5">{activeDetailRecord.hash}</p>
                    </div>
                    <Lock className="w-4 h-4 text-brand-primary" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      alert('Download do Certificado e do fiduciário de autoria gerado com sucesso em PDF!');
                    }}
                    className="flex-1 bg-brand-primary text-white font-bold py-3 rounded-full text-xs hover:opacity-95 transition-all text-center"
                  >
                    Baixar Certificado (PDF)
                  </button>
                  <button 
                    onClick={() => setActiveDetailRecord(null)}
                    className="px-6 border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold py-3 rounded-full"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PERSISTENT FLOATING ACTION ACTION (FAB) IN GOLDEN ACCENT */}
      <AnimatePresence>
        {activeTab !== 'proteger' && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => triggerPrepareNewScreen()}
            className="fixed bottom-10 right-10 z-40 bg-brand-tertiary-fixed text-zinc-950 font-bold px-8 py-5 rounded-full flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none"
          >
            <PlusCircle className="w-5 h-5 fill-zinc-950" />
            <span className="text-xs uppercase tracking-wider">PREPARAR NOVA TELA</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Auth PopUp Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(user) => {
          setCurrentUser(user);
          setRecords(loadStoredRecords(user.id));
          setActiveTab('estudio');
          setNotifications(prev => [
            `Sessão autorizada para o artista: ${user.name}`,
            ...prev
          ]);
        }} 
      />

    </div>
  );
}
