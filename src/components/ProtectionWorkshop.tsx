/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  UploadCloud, 
  Cpu, 
  CheckCircle, 
  Sparkles, 
  RefreshCw, 
  Lock, 
  Settings, 
  Download, 
  Share2, 
  Eye, 
  FileText, 
  Hash, 
  User, 
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AppState, SignatureConfig, PresetArtwork, ProtectedRecord } from '../types';
import { PRESET_ARTWORKS } from '../data';

// Reference local generated image paths directly as strings to comply with TypeScript mapping
const state1Img = "/src/assets/images/scene_state1_artist_ready_1780087668126.png";
const state2Img = "/src/assets/images/scene_state2_artist_uploading_1780087688099.png";
const state3Img = "/src/assets/images/scene_state3_artist_protected_1780087706714.png";

interface WorkshopProps {
  onAddRecord: (record: ProtectedRecord) => void;
  onNavigateToGallery: () => void;
  activePresetId?: string | null;
  clearActivePreset: () => void;
}

export default function ProtectionWorkshop({ 
  onAddRecord, 
  onNavigateToGallery, 
  activePresetId, 
  clearActivePreset 
}: WorkshopProps) {
  // State management
  const [appState, setAppState] = useState<AppState>('ready');
  const [selectedPreset, setSelectedPreset] = useState<PresetArtwork | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [customImageUrlError, setCustomImageUrlError] = useState<string>('');
  
  // Signature Customization Control
  const [signatureConfig, setSignatureConfig] = useState<SignatureConfig>({
    artistName: 'Elena Vance',
    artworkTitle: 'Sussurros do Horizonte',
    creationYear: '2026',
    style: 'hexadecimal',
    color: '#d0a0ff', // Light slate purple
    density: 'medium',
    position: 'bottom-right'
  });

  // Processing steps simulation status
  const [processProgress, setProcessProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [processingDelay, setProcessingDelay] = useState(3000); // 3 seconds demo
  const [generatedHash, setGeneratedHash] = useState('');
  
  // View mode tab for the 16:9 screens
  // 'interactive' = show the tool workspace
  // 'artist_scenes' = show the 16:9 scenery images of "the artist interacting with the tool"
  const [viewTab, setViewTab] = useState<'interactive' | 'artist_scenes'>('interactive');
  
  // State tab explicitly to review the 3 states generated in 16:9 aspect ratio
  const [selectedSceneState, setSelectedSceneState] = useState<AppState>('ready');

  // Sync with active preset from dashboard if selected
  useEffect(() => {
    if (activePresetId) {
      const found = PRESET_ARTWORKS.find(a => a.id === activePresetId);
      if (found) {
        setSelectedPreset(found);
        setCustomImageUrl('');
        setCustomImageUrlError('');
        setSignatureConfig(prev => ({
          ...prev,
          artistName: found.artist,
          artworkTitle: found.title,
          creationYear: found.year
        }));
        setAppState('ready');
        setSelectedSceneState('ready');
      }
    }
  }, [activePresetId]);

  // Set default preset if nothing is selected and no custom URL exists
  useEffect(() => {
    if (!selectedPreset && !customImageUrl.trim()) {
      setSelectedPreset(PRESET_ARTWORKS[0]);
    }
  }, [selectedPreset, customImageUrl]);

  // Generate a mock hash when entering protected state
  const mockGenerateHash = () => {
    const chars = '0123456789ABCDEF';
    let hex = '0x';
    for (let i = 0; i < 40; i++) {
      hex += chars[Math.floor(Math.random() * 16)];
    }
    return hex;
  };

  const validateImageUrl = (value: string) => {
    if (!value.trim()) return false;
    try {
      const url = new URL(value.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleCustomImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomImageUrl(value);
    setCustomImageUrlError('');
    if (value.trim() && !validateImageUrl(value)) {
      setCustomImageUrlError('Use um endereço de imagem válido começando com http:// ou https://');
    }
    if (value.trim()) {
      setSelectedPreset(null);
    }
  };

  // State machine simulation triggers
  const handleStartProtection = () => {
    if (!selectedPreset && !customImageUrl.trim()) return;
    if (customImageUrl.trim() && !validateImageUrl(customImageUrl)) {
      setCustomImageUrlError('Use um endereço de imagem válido começando com http:// ou https://');
      return;
    }
    
    setAppState('processing');
    setSelectedSceneState('processing');
    setProcessProgress(0);
    setCurrentStep(0);
  };

  // Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === 'processing') {
      interval = setInterval(() => {
        setProcessProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            const newHash = mockGenerateHash();
            setGeneratedHash(newHash);
            
            // Generate historical record to sync with Galeria
            const title = customImageUrl ? signatureConfig.artworkTitle : (selectedPreset?.title || signatureConfig.artworkTitle);
            const artist = customImageUrl ? signatureConfig.artistName : (selectedPreset?.artist || signatureConfig.artistName);
            const year = signatureConfig.creationYear;
            const img = customImageUrl || selectedPreset?.imageUrl || PRESET_ARTWORKS[0].imageUrl;

            onAddRecord({
              id: `rec-${Date.now()}`,
              title,
              artist,
              year,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              hash: newHash.substring(0, 7) + '...' + newHash.substring(35),
              signatureStyle: signatureConfig.style,
              originalImage: img
            });

            // Set final completed states after slight delay
            setTimeout(() => {
              setAppState('protected');
              setSelectedSceneState('protected');
            }, 500);
            
            return 100;
          }
          const nextProgress = prev + Math.floor(Math.random() * 12) + 4;
          return Math.min(nextProgress, 100);
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [appState]);

  // Handle current execution step based on progress percent
  useEffect(() => {
    if (processProgress < 35) {
      setCurrentStep(0); // Escaneando Integridade
    } else if (processProgress < 75) {
      setCurrentStep(1); // Autenticando Autoria
    } else {
      setCurrentStep(2); // Injetando Assinatura
    }
  }, [processProgress]);

  // Reset tool
  const handleReset = () => {
    setAppState('ready');
    setSelectedSceneState('ready');
    setProcessProgress(0);
    // If we have custom upload, keep it, otherwise keep the default preset
  };

  // Render the technical signature over the canvas
  const renderSignatureMarkup = () => {
    const { artistName, artworkTitle, creationYear, style, color, density, position } = signatureConfig;
    const isOverlay = position === 'overlay';
    
    // Position classes
    let positionClass = 'absolute bottom-4 right-4 text-right';
    if (position === 'bottom-left') positionClass = 'absolute bottom-4 left-4 text-left';
    if (position === 'top-right') positionClass = 'absolute top-4 right-4 text-right';
    if (isOverlay) positionClass = 'absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-black/10';

    // Dense elements array
    const hexItems = ['0x4E7FF9', 'SEC_COV_256', 'CS_MUTABLE_FALSE', 'METADATA_LOCKED', 'ID_992_EV', 'AES_PROOF_A3'];
    const binaryItems = ['11010101', '00101011', '11110001', 'CR_SECURE', 'SYM_AUTH_1'];

    return (
      <div className={`pointer-events-none font-mono tracking-tight select-none z-20 ${positionClass}`} style={{ color }}>
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            className={`p-3 rounded backdrop-blur-md bg-black/40 border border-white/10 ${isOverlay ? 'scale-110 max-w-sm' : 'text-xs'}`}
          >
            {/* Header info */}
            <div className="flex items-center gap-1.5 opacity-90 border-b border-white/10 pb-1.5 mb-1.5 justify-start text-[10px]">
              <Lock className="w-3 h-3 text-brand-accent animate-pulse" />
              <span className="uppercase tracking-widest font-semibold">Cripto-Assinatura Integrada</span>
            </div>

            {/* Content style dependent */}
            {style === 'hexadecimal' && (
              <div className="space-y-1">
                <p className="font-bold leading-none text-white tracking-wide">
                  {artworkTitle.substring(0, 16).toUpperCase()} // {creationYear}
                </p>
                <p className="opacity-80">Criador: {artistName}</p>
                <p className="text-[10px] opacity-60 text-brand-accent font-semibold">{generatedHash || '0x451274Fde33F399...A2'}</p>
                {density !== 'low' && (
                  <p className="text-[9px] opacity-40 leading-none">
                    HASH_CHECK_OK // SHIELD_LEVEL_5 // UTC_2026_05_29
                  </p>
                )}
              </div>
            )}

            {style === 'binary' && (
              <div className="space-y-0.5 text-left">
                <p className="font-bold text-white">{artistName.toUpperCase()}</p>
                <div className="grid grid-cols-2 gap-x-2 text-[9px] opacity-70">
                  <span>REG: 1010011</span>
                  <span>SIG: {binaryItems[0]}</span>
                  <span>VER: {binaryItems[1]}</span>
                  <span>VAL: {creationYear}</span>
                </div>
                {density === 'high' && (
                  <p className="text-[8px] opacity-40 font-mono mt-1 text-center">
                    01100011 01110010 01111001 01110000 01110100 01101111
                  </p>
                )}
              </div>
            )}

            {style === 'matrix' && (
              <div className="space-y-0.5 text-left text-[10px]">
                <div className="flex justify-between gap-4 font-bold border-b border-white/5 pb-1">
                  <span className="text-white">{artworkTitle}</span>
                  <span className="text-[9px] px-1 bg-brand-primary text-white rounded">MTRX</span>
                </div>
                <div className="font-mono text-[9px] text-zinc-300 opacity-80 grid grid-cols-1 space-y-0.5 pt-1">
                  <span>SYS: ATELIER_ST_v2.0</span>
                  <span>KEY: SECURE_PROOF_NODE_3000</span>
                  <span>LOC: {position.toUpperCase()}</span>
                  <span>AUT: SECURE_HASH_AUTHENTICATED</span>
                </div>
              </div>
            )}

            {style === 'geometric' && (
              <div className="space-y-1 text-right text-[10px]">
                <div className="text-white font-bold tracking-widest">{artistName} ({creationYear})</div>
                <div className="border border-white/10 p-1 bg-white/5 rounded text-left flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <span className="text-[9px] text-zinc-200">COORD_X_Y: Locked Immutable</span>
                </div>
                {density === 'high' && (
                  <span className="text-[7px] text-zinc-500 block text-right font-mono mt-1">
                     Δ: {generatedHash.substring(0, 12)} / θ: 57.2°
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Ambient scattered technical bits on high density */}
        {density === 'high' && !isOverlay && (
          <div className="absolute top-4 left-4 font-mono text-[8.5px] opacity-25 p-1 bg-black/20 rounded pointer-events-none text-left tracking-normal space-y-0.5">
            <div>MD5: 24cf8f1e63a18e001a1db9ff</div>
            <div>STATUS: INTEGRITY_CR_SECURE</div>
            <div>NET_NODE: CONTAINER_RUNNING_PORT_3000</div>
          </div>
        )}
      </div>
    );
  };

  // Get active image for background or image rendering
  const getActiveProductImage = () => {
    if (customImageUrl) return customImageUrl;
    if (selectedPreset) return selectedPreset.imageUrl;
    return PRESET_ARTWORKS[0].imageUrl;
  };

  return (
    <div className="space-y-10">
      
      {/* Upper Mode Toggle Header: Present the double functionality clearly */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-brand-primary/5 rounded-xl border border-brand-primary/10 gap-4">
        <div>
          <span className="font-label-sm text-brand-primary bg-brand-secondary px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Modos de Visualização
          </span>
          <h2 className="font-headline-sm text-brand-primary">Escolha como inspecionar os Estados</h2>
          <p className="text-sm text-brand-on-surface/70 mt-1 max-w-xl">
            Visualize o fluxo do ponto de vista do <strong>artista (na cena 16:9)</strong> ou teste o <strong>dashboard interativo</strong> do estúdio logo abaixo.
          </p>
        </div>
        
        <div className="flex gap-2 bg-white p-1 rounded-full border border-brand-outline-variant/30 shadow-sm self-end md:self-center">
          <button
            onClick={() => setViewTab('interactive')}
            className={`px-4 py-2 rounded-full font-label-md text-xs transition-all flex items-center gap-2 ${
              viewTab === 'interactive' 
                ? 'bg-brand-primary text-white font-semibold' 
                : 'text-brand-on-surface/60 hover:text-brand-primary'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Ferramenta Interativa
          </button>
          <button
            onClick={() => {
              setViewTab('artist_scenes');
              // Align scene tab to current app state
              setSelectedSceneState(appState);
            }}
            className={`px-4 py-2 rounded-full font-label-md text-xs transition-all flex items-center gap-2 ${
              viewTab === 'artist_scenes' 
                ? 'bg-brand-primary text-white font-semibold' 
                : 'text-brand-on-surface/60 hover:text-brand-primary'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Cenas Paisagem (16:9)
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Main Visual Workspace (Depends on selected mode tab) */}
        <div className="lg:col-span-8 space-y-6">

          {/* VIEW TAB 1: INTERACTIVE WORKSPACE */}
          {viewTab === 'interactive' && (
            <AnimatePresence mode="wait">
              {/* STATE 1: READY / TELA INICIAL */}
              {appState === 'ready' && (
                <motion.div
                  key="state-ready"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl p-6 border border-brand-outline-variant/20 shadow-xl shadow-brand-primary/5 space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-brand-primary text-base">Atelier de Link Externo</h3>
                        <p className="text-xs text-brand-on-surface/50">Forneça um link de imagem externo ou escolha uma obra do estúdio para proteger.</p>
                      </div>
                    </div>
                    {customImageUrl && (
                      <button 
                        onClick={() => {
                          setCustomImageUrl('');
                          setCustomImageUrlError('');
                          setSelectedPreset(PRESET_ARTWORKS[0]);
                        }}
                        className="text-xs text-brand-primary hover:underline flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className="w-3 h-3" /> Limpar Link
                      </button>
                    )}
                  </div>

                  <div className="relative h-80 rounded-xl border-2 border-dashed p-8 text-center overflow-hidden transition-all duration-300 border-brand-outline-variant bg-brand-surface">
                    <div className="relative h-full flex flex-col justify-center gap-5">
                      <div className="mx-auto w-full max-w-3xl">
                        <label className="block text-left text-[11px] font-semibold uppercase tracking-wider text-brand-primary mb-2">
                          Link da Arte (URL pública)
                        </label>
                        <input
                          type="url"
                          value={customImageUrl}
                          onChange={handleCustomImageUrlChange}
                          placeholder="https://example.com/sua-obra.jpg"
                          className="w-full rounded-2xl border border-brand-outline-variant/60 bg-white/90 px-4 py-3 text-sm text-brand-on-surface shadow-sm outline-none transition-all focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                        />
                        {customImageUrlError && (
                          <p className="mt-2 text-[11px] text-rose-500">{customImageUrlError}</p>
                        )}
                      </div>

                      {customImageUrl ? (
                        <div className="relative mx-auto w-full max-w-3xl rounded-3xl overflow-hidden border border-brand-outline-variant bg-zinc-100">
                          <img
                            src={customImageUrl}
                            alt="Preview da Arte Externa"
                            className="w-full h-64 object-contain bg-zinc-100"
                            referrerPolicy="no-referrer"
                            onLoad={() => setCustomImageUrlError('')}
                            onError={() => setCustomImageUrlError('Não foi possível carregar a imagem desse link. Verifique o endereço e tente novamente.')}
                          />
                        </div>
                      ) : (
                        <div className="space-y-4 py-12">
                          <div className="w-20 h-20 bg-brand-secondary/30 rounded-full flex items-center justify-center mx-auto text-brand-primary border border-brand-primary/10">
                            <Shield className="w-10 h-10 text-brand-primary" />
                          </div>
                          <div>
                            <p className="font-headline-sm text-brand-primary text-lg font-bold">Insira o link da sua obra</p>
                            <p className="text-sm text-brand-on-surface/60 mt-1 max-w-sm mx-auto">
                              Cole o URL público direto para a imagem hospedada pelo usuário. O armazenamento fica a cargo do usuário.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preset Choice Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-brand-primary uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-spin" style={{ animationDuration: '4s' }} />
                      <span>Ou Selecione uma Obra do Nosso Estúdio</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {PRESET_ARTWORKS.map((art) => {
                        const isSelected = selectedPreset?.id === art.id;
                        return (
                          <div 
                            key={art.id}
                            onClick={() => {
                              setSelectedPreset(art);
                              setCustomImageUrl('');
                              setCustomImageUrlError('');
                              setSignatureConfig(prev => ({
                                ...prev,
                                artistName: art.artist,
                                artworkTitle: art.title,
                                creationYear: art.year
                              }));
                            }}
                            className={`group cursor-pointer rounded-lg overflow-hidden border p-2 transition-all flex flex-col justify-between ${
                              isSelected 
                                ? 'border-brand-primary bg-brand-secondary/20 shadow-md ring-1 ring-brand-primary' 
                                : 'border-brand-outline-variant/30 hover:border-brand-primary/40 bg-zinc-50'
                            }`}
                          >
                            <div className="aspect-[4/3] rounded overflow-hidden bg-zinc-200 relative mb-2">
                              <img 
                                src={art.imageUrl} 
                                alt={art.title} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-brand-primary truncate">{art.title}</p>
                              <p className="text-[9px] text-brand-on-surface/60 truncate">{art.artist} • {art.year}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STATE 2: PROCESSING / CARREGAMENTO E CRIPTOGRAFIA */}
              {appState === 'processing' && (
                <motion.div
                  key="state-processing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl p-8 border border-brand-outline-variant/20 shadow-2xl flex flex-col items-center justify-center space-y-8"
                >
                  {/* Central animated orbit spinner */}
                  <div className="relative w-36 h-36">
                    <div className="absolute inset-0 border-[4px] border-zinc-100 rounded-full"></div>
                    <div className="absolute inset-0 border-[4px] border-brand-primary rounded-full animate-spin" style={{ borderTopColor: 'transparent', animationDuration: '1.2s' }}></div>
                    <div className="absolute inset-2 border-[2px] border-brand-accent/20 border-dotted rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-brand-primary text-white p-4 rounded-full shadow-lg animate-bounce">
                        <Lock className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  {/* Encryption copy block */}
                  <div className="text-center space-y-2">
                    <h3 className="font-headline-sm text-brand-primary text-xl font-bold">Comprimindo e Criptografando Canvas</h3>
                    <p className="text-sm text-brand-on-surface/60 max-w-md mx-auto">
                      Estamos envolvendo sua obra-prima em proteção criptográfica. Isso registrará a autoria permanente de <strong>{signatureConfig.artistName}</strong>.
                    </p>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full max-w-md bg-zinc-100 h-3 rounded-full overflow-hidden border border-zinc-200">
                    <div 
                      className="h-full bg-brand-primary rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${processProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between w-full max-w-md text-xs font-mono font-bold text-brand-primary mt-1">
                    <span className="uppercase tracking-widest text-[10px]">Injeção de Metadados</span>
                    <span>{processProgress}%</span>
                  </div>

                  {/* Active status indicator steps */}
                  <div className="grid grid-cols-3 gap-4 w-full max-w-lg pt-4 border-t border-zinc-100">
                    <div className={`p-3 rounded-lg border text-center space-y-1 transition-all ${
                      currentStep >= 0 
                        ? 'border-brand-primary bg-brand-secondary/15 text-brand-primary' 
                        : 'border-zinc-150 bg-zinc-50 opacity-40'
                    }`}>
                      <UploadCloud className={`w-4 h-4 mx-auto ${currentStep === 0 ? 'animate-pulse text-brand-primary' : 'text-zinc-400'}`} />
                      <p className="font-label-sm text-[10px] uppercase font-bold text-brand-primary">1. Escaneando</p>
                      <p className="text-[9px] text-brand-on-surface/50 leading-tight">Checagem de Metadados</p>
                    </div>

                    <div className={`p-3 rounded-lg border text-center space-y-1 transition-all ${
                      currentStep >= 1 
                        ? 'border-brand-primary bg-brand-secondary/15 text-brand-primary font-bold' 
                        : 'border-zinc-150 bg-zinc-50 opacity-40 grayscale'
                    }`}>
                      <User className={`w-4 h-4 mx-auto ${currentStep === 1 ? 'animate-pulse text-brand-primary' : 'text-zinc-400'}`} />
                      <p className="font-label-sm text-[10px] uppercase font-bold">2. Autenticando</p>
                      <p className="text-[9px] text-brand-on-surface/50 leading-tight">Verificação do Artista</p>
                    </div>

                    <div className={`p-3 rounded-lg border text-center space-y-1 transition-all ${
                      currentStep >= 2
                        ? 'border-brand-primary bg-brand-secondary/15 text-brand-primary font-bold' 
                        : 'border-zinc-150 bg-zinc-50 opacity-40 grayscale'
                    }`}>
                      <Cpu className={`w-4 h-4 mx-auto ${currentStep === 2 ? 'animate-pulse text-brand-primary' : 'text-zinc-400'}`} />
                      <p className="font-label-sm text-[10px] uppercase font-bold">3. Protegendo</p>
                      <p className="text-[9px] text-brand-on-surface/50 leading-tight">Criptografia do Cofre</p>
                    </div>
                  </div>

                  {/* Micro simulated logs */}
                  <div className="w-full max-w-md bg-zinc-950 rounded-lg p-3 font-mono text-[9px] text-emerald-400 space-y-1 text-left border border-white/5 shadow-inner">
                    <p className="opacity-60 text-zinc-500">// Terminal Registro do Atelier v2.0</p>
                    <p>{processProgress > 10 && `> INICIANDO SHIELD_TRANS_SESSION`}</p>
                    <p>{processProgress > 30 && `> ENCODING: CANVAS_IMG_BYTE_STREAM (OK)`}</p>
                    <p>{processProgress > 60 && `> AUTENTICANDO: ${signatureConfig.artistName.toUpperCase().replace(/\s/g, '_')}`}</p>
                    <p>{processProgress > 85 && `> APPLICANDO ASSINATURA: [ESTILO: ${signatureConfig.style.toUpperCase()}]`}</p>
                    {processProgress === 100 && (
                      <p className="text-emerald-300 font-bold animate-pulse">&gt; SINTONIA COMPLETA - GERANDO HASH DO CERTIFICADO...</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STATE 3: PROTECTED / SUCESSO CERTIDÃO */}
              {appState === 'protected' && (
                <motion.div
                  key="state-protected"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl p-6 border border-brand-outline-variant/20 shadow-xl space-y-6"
                >
                  {/* Visual Success Confirmation Banner */}
                  <div className="flex flex-col items-center text-center p-4 bg-emerald-50 rounded-lg border border-emerald-150">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2 shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-headline-sm text-emerald-900 font-bold text-lg">Assinatura Injetada com Sucesso</h3>
                    <p className="text-xs text-emerald-800/80 mt-0.5 max-w-lg">
                      Sua visão criativa de <strong>{signatureConfig.artworkTitle}</strong> agora carrega uma assinatura digital estéril, indelével e protegida contra uso não autorizado.
                    </p>
                  </div>

                  {/* Main Work Display containing custom digital overlays */}
                  <div className="aspect-[4/3] rounded-lg border border-zinc-200 overflow-hidden relative shadow-inner bg-zinc-950 flex items-center justify-center">
                    {/* Render live protected image */}
                    <img 
                      src={getActiveProductImage()} 
                      alt="Peça Protegida" 
                      className="w-full h-full object-contain relative z-10"
                      referrerPolicy="no-referrer"
                    />

                    {/* Technical signature rendering on top */}
                    {renderSignatureMarkup()}

                    {/* Subtle micro security pattern backdrop - light hexagonal net on image borders */}
                    <div className="absolute inset-0 opacity-15 border-[8px] border-dashed border-emerald-400 pointer-events-none z-10"></div>
                  </div>

                  {/* Actions buttons underneath protected art */}
                  <div className="bg-brand-surface p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-brand-primary" />
                      <span className="text-xs text-brand-on-surface/70 font-mono">
                        HASH DE SEGURANÇA: <strong className="text-brand-primary">{generatedHash.substring(0, 16)}...{generatedHash.substring(34)}</strong>
                      </span>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => alert(`Certificado do arquivo "${signatureConfig.artworkTitle}" compartilhado com sucesso na comunidade artística Creative Sanctuary!`)}
                        className="flex-1 md:flex-none py-2 px-4 rounded-full border border-brand-outline text-brand-primary hover:bg-brand-secondary/25 transition-all text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" /> Compartilhar
                      </button>
                      <button 
                        onClick={() => {
                          alert(`Preparando download da obra em alta resolução com assinatura criptográfica integrada. ID do Ativo: CS-${generatedHash.substring(2, 8).toUpperCase()}`);
                        }}
                        className="flex-1 md:flex-none py-2 px-5 rounded-full bg-brand-primary text-white hover:opacity-95 transition-all text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
                      >
                        <Download className="w-4 h-4" /> Baixar Protegido (PNG)
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* VIEW TAB 2: ARTIFACT PRESERVED 16:9 LANDSCAPE VIEWER */}
          {viewTab === 'artist_scenes' && (
            <div className="bg-white rounded-xl p-6 border border-brand-outline-variant/20 shadow-xl space-y-6">
              
              {/* Internal instructions to inspect state artwork */}
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <div>
                  <h3 className="font-headline-sm text-brand-primary text-base">Portfólio de Visualização: O Artista na Cena</h3>
                  <p className="text-xs text-brand-on-surface/50">Foco estilístico: Exibição conceitual nas proporções paisagem (16:9) do artista trabalhando com a segurança do atelier</p>
                </div>
              </div>

              {/* State Choice Buttons - 16:9 Switcher */}
              <div className="grid grid-cols-3 gap-2 bg-brand-surface p-1 rounded-xl border border-zinc-200">
                <button
                  onClick={() => setSelectedSceneState('ready')}
                  className={`py-3 rounded-lg text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedSceneState === 'ready' 
                      ? 'bg-white text-brand-primary shadow-sm ring-1 ring-brand-primary/20' 
                      : 'text-brand-on-surface/60 hover:text-brand-primary'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-brand-primary mb-1"></span>
                  Estado 1: Tela Inicial
                  <span className="text-[9px] font-normal opacity-75">(Convite para Proteção)</span>
                </button>

                <button
                  onClick={() => setSelectedSceneState('processing')}
                  className={`py-3 rounded-lg text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedSceneState === 'processing' 
                      ? 'bg-white text-brand-primary shadow-sm ring-1 ring-brand-primary/20' 
                      : 'text-brand-on-surface/60 hover:text-brand-primary'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-brand-accent mb-1 animate-ping"></span>
                  Estado 2: Em Processo
                  <span className="text-[9px] font-normal opacity-75">(Upload Ativo)</span>
                </button>

                <button
                  onClick={() => setSelectedSceneState('protected')}
                  className={`py-3 rounded-lg text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedSceneState === 'protected' 
                      ? 'bg-white text-brand-primary shadow-sm ring-1 ring-brand-primary/20' 
                      : 'text-brand-on-surface/60 hover:text-brand-primary'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mb-1"></span>
                  Estado 3: Resultado Final
                  <span className="text-[9px] font-normal opacity-75">(Assinatura Concluída)</span>
                </button>
              </div>

              {/* Large 16:9 Display Aspect Ratio Frame */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center group shadow-2xl border border-zinc-200">
                
                {selectedSceneState === 'ready' && (
                  <img 
                    src={state1Img} 
                    alt="Estado 1: Convite de Entrada" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}

                {selectedSceneState === 'processing' && (
                  <img 
                    src={state2Img} 
                    alt="Estado 2: Processamento Criptográfico" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}

                {selectedSceneState === 'protected' && (
                  <img 
                    src={state3Img} 
                    alt="Estado 3: Proteção Ativada" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Overlaid state banner descriptors */}
                <div className="absolute top-4 left-4 z-20 bg-brand-primary/95 text-white py-1.5 px-4 rounded-full text-xs font-mono tracking-tight flex items-center gap-2 shadow-lg backdrop-blur">
                  <Shield className="w-3.5 h-3.5 text-brand-accent" />
                  <span>
                    PROPORÇÃO 16:9 //{' '}
                    {selectedSceneState === 'ready' && 'ESTADO 1: TELA INICIAL'}
                    {selectedSceneState === 'processing' && 'ESTADO 2: SEGURO UPLOADING'}
                    {selectedSceneState === 'protected' && 'ESTADO 3: ATIVO PROTEGIDO'}
                  </span>
                </div>

                {/* Explanatory description footer on overlays */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white z-10">
                  {selectedSceneState === 'ready' && (
                    <p className="text-sm font-medium leading-relaxed drop-shadow-sm max-w-2xl">
                      <strong>Tela Inicial:</strong> Área central de upload livre com ícone de escudo sutil. Exprime empoderamento criativo — o artista domina a ferramenta, iniciando a tutela de sua criação autoral original.
                    </p>
                  )}
                  {selectedSceneState === 'processing' && (
                    <p className="text-sm font-medium leading-relaxed drop-shadow-sm max-w-2xl">
                      <strong>Upload em Andamento:</strong> Processo dinâmico de assinatura onde partículas de dados delicados e traços circulares se espalham ao redor para indicar a compressão de autoria nos blocos digitais.
                    </p>
                  )}
                  {selectedSceneState === 'protected' && (
                    <p className="text-sm font-medium leading-relaxed drop-shadow-sm max-w-2xl">
                      <strong>Resultado Final:</strong> Marcador técnico e discreto (padrões hexadecimais, fragmentos de dados e métricas) sobrepostos harmonicamente sobre a obra sem prejudicar as cores, evocando solidez técnica.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar Metadata & Cryptographic Customization Panel */}
        <div className="lg:col-span-4 space-y-6">

          {/* Action Trigger Box & Control Center */}
          <div className="bg-white rounded-xl p-5 border border-brand-outline-variant/20 shadow-lg space-y-5">
            <h3 className="font-headline-sm text-brand-primary text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Controles do Atelier
            </h3>

            {/* Quick Trigger Button */}
            {appState === 'ready' ? (
              <button
                onClick={handleStartProtection}
                className="w-full bg-brand-tertiary-fixed text-zinc-950 hover:bg-brand-tertiary font-bold py-4 rounded-full text-xs uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-brand-tertiary-fixed/25"
              >
                <Shield className="w-4 h-4 fill-zinc-950" />
                Iniciar Proteção da Tela
              </button>
            ) : appState === 'processing' ? (
              <div className="w-full bg-zinc-100 text-zinc-400 py-4 rounded-full text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 border border-zinc-200">
                <RefreshCw className="w-4 h-4 animate-spin text-brand-primary" />
                Processando Criptografia...
              </div>
            ) : (
              <button
                onClick={handleReset}
                className="w-full bg-brand-primary text-white hover:opacity-95 font-bold py-4 rounded-full text-xs uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25"
              >
                <RefreshCw className="w-4 h-4" />
                Prepara Nova Tela
              </button>
            )}

            {/* Config Fields */}
            <div className="space-y-4 pt-3 border-t border-zinc-100">
              <h4 className="text-[11px] font-bold text-brand-primary uppercase tracking-widest">Informações da Obra</h4>
              
              {/* Artist Name Input */}
              <div>
                <label className="block text-[11px] font-bold text-brand-on-surface/75 mb-1 bg-brand-secondary/40 px-2 py-0.5 rounded w-max">
                  Nome do Artista (Autor)
                </label>
                <input
                  type="text"
                  value={signatureConfig.artistName}
                  onChange={(e) => setSignatureConfig({ ...signatureConfig, artistName: e.target.value })}
                  disabled={appState === 'processing'}
                  className="w-full bg-brand-surface border border-brand-outline-variant/35 rounded-full px-4 py-2.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary focus:bg-white transition-all disabled:opacity-55"
                  placeholder="Nome do criador"
                />
              </div>

              {/* Artwork Title Input */}
              <div>
                <label className="block text-[11px] font-bold text-brand-on-surface/75 mb-1 bg-brand-secondary/40 px-2 py-0.5 rounded w-max">
                  Título da Obra-prima
                </label>
                <input
                  type="text"
                  value={signatureConfig.artworkTitle}
                  onChange={(e) => setSignatureConfig({ ...signatureConfig, artworkTitle: e.target.value })}
                  disabled={appState === 'processing'}
                  className="w-full bg-brand-surface border border-brand-outline-variant/35 rounded-full px-4 py-2.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary focus:bg-white transition-all disabled:opacity-55"
                  placeholder="Título da obra"
                />
              </div>

              {/* Year & Custom Specs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-on-surface/75 mb-1 bg-brand-secondary/40 px-2 py-0.5 rounded w-max">
                    Ano
                  </label>
                  <input
                    type="number"
                    value={signatureConfig.creationYear}
                    onChange={(e) => setSignatureConfig({ ...signatureConfig, creationYear: e.target.value })}
                    disabled={appState === 'processing'}
                    className="w-full bg-brand-surface border border-brand-outline-variant/35 rounded-full px-4 py-2.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary focus:bg-white transition-all disabled:opacity-55"
                    placeholder="Ano"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-brand-on-surface/75 mb-1 bg-brand-secondary/40 px-2 py-0.5 rounded w-max">
                    Cor da Assinatura
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={signatureConfig.color}
                      onChange={(e) => setSignatureConfig({ ...signatureConfig, color: e.target.value })}
                      disabled={appState === 'processing'}
                      className="w-8 h-8 rounded-full border border-zinc-200 cursor-pointer focus:outline-none overflow-hidden"
                    />
                    <span className="text-[10px] font-mono select-all bg-zinc-100 px-2 py-1 rounded text-brand-outline">
                      {signatureConfig.color}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Placement and Style Controls */}
            <div className="space-y-4 pt-3 border-t border-zinc-100">
              <h4 className="text-[11px] font-bold text-brand-primary uppercase tracking-widest">Estilo Criptográfico</h4>

              {/* Style selector */}
              <div>
                <label className="block text-[11px] font-bold text-brand-on-surface/75 mb-1 inline-block">
                  Padrão Visual Técnico
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-zinc-50 p-1 rounded-lg border border-zinc-250">
                  {(['hexadecimal', 'binary', 'matrix', 'geometric'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      disabled={appState === 'processing'}
                      onClick={() => setSignatureConfig({ ...signatureConfig, style })}
                      className={`py-1.5 px-3 rounded-md text-[10px] leading-tight font-mono capitalize text-center ${
                        signatureConfig.style === style 
                          ? 'bg-brand-primary text-white shadow-sm font-bold' 
                          : 'text-brand-on-surface/75 hover:bg-zinc-200/50'
                      }`}
                    >
                      {style === 'hexadecimal' && 'Hexadecimal'}
                      {style === 'binary' && 'Code Binário'}
                      {style === 'matrix' && 'Sist. Matrix'}
                      {style === 'geometric' && 'Vetor Geo'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Density and Position Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Density selection */}
                <div>
                  <label className="block text-[11px] font-bold text-brand-on-surface/75 mb-1 inline-block">
                    Densidade
                  </label>
                  <select
                    value={signatureConfig.density}
                    disabled={appState === 'processing'}
                    onChange={(e) => setSignatureConfig({ ...signatureConfig, density: e.target.value as any })}
                    className="w-full bg-brand-surface border border-brand-outline-variant/35 rounded-full px-3 py-1.5 text-[11px] text-brand-on-surface focus:outline-none focus:border-brand-primary transition-all disabled:opacity-55"
                  >
                    <option value="low">Subtil (Baixo)</option>
                    <option value="medium">Equilibrado</option>
                    <option value="high">Avançado (Alto)</option>
                  </select>
                </div>

                {/* Position selector */}
                <div>
                  <label className="block text-[11px] font-bold text-brand-on-surface/75 mb-1 inline-block">
                    Posicionamento
                  </label>
                  <select
                    value={signatureConfig.position}
                    disabled={appState === 'processing'}
                    onChange={(e) => setSignatureConfig({ ...signatureConfig, position: e.target.value as any })}
                    className="w-full bg-brand-surface border border-brand-outline-variant/35 rounded-full px-3 py-1.5 text-[11px] text-brand-on-surface focus:outline-none focus:border-brand-primary transition-all disabled:opacity-55"
                  >
                    <option value="bottom-right">Canto Dir Info</option>
                    <option value="bottom-left">Canto Esq Info</option>
                    <option value="top-right">Canto Dir Sup</option>
                    <option value="overlay">Matriz Central</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive informational Card showing Security layers */}
          <div className="bg-brand-primary text-white rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 scale-125 transform translate-x-4 -translate-y-4">
              <Shield className="w-40 h-40" />
            </div>
            
            <h3 className="font-headline-sm text-sm font-bold flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-brand-accent animate-pulse" />
              Especificação Técnica
            </h3>
            <p className="text-[11px] text-brand-secondary leading-relaxed mb-3">
              Nossa tecnologia patenteia e embute marcas d'água técnica invisíveis no espectro de cores da obra, vinculando metadados imutáveis que previnem deturpações de autoria em treinos generativos sem autorização.
            </p>

            <ul className="text-[10px] space-y-1.5 border-t border-white/10 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-brand-accent" />
                <span>Assinatura Digital Técnico-Abstrata</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-brand-accent" />
                <span>Marcação contra treino de IA Slop</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-brand-accent" />
                <span>Metadados Fixados Permanentemente</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
