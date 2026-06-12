/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Palette, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Eye, 
  Compass, 
  ExternalLink,
  Verified,
  FileCheck
} from 'lucide-react';
import { PRESET_ARTWORKS } from '../data';

interface LandingPageProps {
  onStartProtecting: (presetId?: string) => void;
  onGoToStudio: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  userEmail?: string;
}

export default function LandingPage({ 
  onStartProtecting, 
  onGoToStudio, 
  onOpenAuth, 
  isLoggedIn,
  userEmail 
}: LandingPageProps) {

  // Reference the beautiful 16:9 scenic states generated
  const state1Img = "/src/assets/images/scene_state1_artist_ready_1780087668126.png";
  const state2Img = "/src/assets/images/scene_state2_artist_uploading_1780087688099.png";
  const state3Img = "/src/assets/images/scene_state3_artist_protected_1780087706714.png";

  const workflowSteps = [
    {
      step: "01",
      title: "Carga Criativa",
      subtitle: "Estado 1: O Atelier Pronto",
      description: "Carregue sua obra em alta definição. Defina os parâmetros da sua identidade visual criativa: sua assinatura, o tipo de estampa estegânica e os níveis de reforço cromático.",
      image: state1Img,
      badge: "Inoculação Inicial"
    },
    {
      step: "02",
      title: "Sintonização de Marcas",
      subtitle: "Estado 2: Modulação Ativa",
      description: "Nosso motor decompõe os canais da imagem e injeta uma semente criptográfica única. Uma assinatura invisível é tecida nas cores, dificultando raspagens por bots de inteligência artificial.",
      image: state2Img,
      badge: "Envelopamento Binário"
    },
    {
      step: "03",
      title: "Ativo de Salvaguarda",
      subtitle: "Estado 3: Estabilidade & Certificação",
      description: "Sua obra está selada. Receba um certificado de autenticidade completo contendo chaves SHA-256 e metadados invioláveis que dão a você soberania judicial e controle autoral total.",
      image: state3Img,
      badge: "Registro Imutável"
    }
  ];

  const valuePillars = [
    {
      icon: Cpu,
      title: "Moduladores Criptográficos",
      description: "Injeção de hashes SHA-256 diretamente nos metadados EXIF e nos pixels estruturais da tela para resguardar a autoria permanente."
    },
    {
      icon: Shield,
      title: "Corte de Raspagem de IA (Scrapers)",
      description: "Embaralha de forma suave os vetores de frequência da imagem, tornando o arquivo hostil para treinamento automatizado ou clones não licenciados."
    },
    {
      icon: Verified,
      title: "Certidões Jurídicas de Autoria",
      description: "Geração instantânea de certidões criptográficas que atestam a titularidade e o carimbo de data (timestamp) de sua obra de arte no ether."
    }
  ];

  return (
    <div id="landing-page-root" className="space-y-20 pb-12">
      
      {/* 1. HERO SECTION WITH RICH VISUAL AMBIENCE */}
      <section id="hero-section" className="relative bg-white border border-brand-outline-variant/10 rounded-2xl p-8 md:p-14 shadow-lg overflow-hidden flex flex-col lg:flex-row gap-10 items-center justify-between">
        {/* Soft Background Ambiance Circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-secondary opacity-25 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-accent/20 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="space-y-6 max-w-2xl relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 border border-brand-primary/10 rounded-full text-brand-primary text-xs font-bold font-mono uppercase tracking-wide">
            <Lock className="w-3.5 h-3.5 text-brand-accent fill-brand-accent/10" />
            Fortaleza da Autoria Digital
          </div>

          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-brand-primary tracking-tight font-extrabold leading-[1.1]">
            O porto seguro para sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-primary-container">identidade criativa</span>.
          </h1>

          <p className="text-sm md:text-base text-brand-on-surface/75 leading-relaxed max-w-xl">
            O Creative Sanctuary protege suas obras-primas contra raspagem não autorizada de modelos de IA e carimba sua assinatura autoral diretamente no código das telas, gerando certificados imutáveis e auditáveis.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              id="hero-protect-btn"
              onClick={() => onStartProtecting()}
              className="bg-brand-primary text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-lg shadow-brand-primary/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-brand-accent" />
              Proteger Minha Arte
            </button>

            {isLoggedIn ? (
              <button
                id="hero-studio-btn"
                onClick={onGoToStudio}
                className="bg-zinc-100 hover:bg-zinc-200 text-brand-primary font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full border border-black/5 transition-all flex items-center gap-2"
              >
                <Palette className="w-4 h-4 text-brand-primary" />
                Ir para o Meu Estúdio
              </button>
            ) : (
              <button
                id="hero-login-btn"
                onClick={onOpenAuth}
                className="bg-brand-secondary text-brand-primary font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full hover:bg-brand-secondary/80 transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Entrar / Registrar-se
              </button>
            )}
          </div>

          {/* Micro telemetry footer */}
          <div className="flex items-center gap-4 text-[10.5px] text-brand-outline font-mono pt-4 border-t border-brand-outline-variant/10">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              Padrão Ativo: SHA-256
            </span>
            <span>•</span>
            <span>Criptografia Estegânica Inteligente</span>
            <span>•</span>
            <span>Proteção Contra Scraping</span>
          </div>
        </div>

        {/* Hero Interactive Showcase Banner */}
        <div className="w-full lg:w-[420px] shrink-0 space-y-4">
          <div className="bg-gradient-to-tr from-brand-primary to-brand-primary-container text-white rounded-2xl p-6 shadow-xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-xl"></div>
            <p className="text-[10px] font-mono tracking-widest text-brand-accent uppercase font-bold mb-1">NÓ ATIVO DE SEGURANÇA</p>
            <h4 className="font-headline-sm font-bold text-lg mb-3">Sua Autoria Garantida</h4>
            <div className="p-3 bg-white/10 rounded-xl space-y-2 text-xs border border-white/10 font-mono">
              <div className="flex justify-between border-b border-white/5 pb-1 text-white/80">
                <span>Artista</span>
                <span className="font-bold text-white">Você / Identidade Digital</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1 text-white/80">
                <span>Carimbo de Data</span>
                <span className="font-bold text-white">Imutável (UTC)</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Rastreamento</span>
                <span className="font-bold text-brand-accent">MTRX_PROTECTED</span>
              </div>
            </div>
            
            <p className="text-[10px] text-white/60 leading-relaxed mt-4">
              Cada alteração estilística insere carimbos invisíveis para reter sua propriedade intelectual e direitos de distribuição comercial.
            </p>
          </div>

          {/* Quick Stats list */}
          <div className="grid grid-cols-2 gap-3 text-center text-xs">
            <div className="bg-white p-4 rounded-xl border border-brand-outline-variant/20 shadow-sm">
              <span className="block text-xl font-extrabold text-brand-primary">100%</span>
              <span className="text-[10px] text-brand-outline">Autonomia nas Telas</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-brand-outline-variant/20 shadow-sm">
              <span className="block text-xl font-extrabold text-brand-primary">LOCKED_99</span>
              <span className="text-[10px] text-brand-outline">Fórmula Anti-Bot</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 3 STATES WORKFLOW TOUR SECTION */}
      <section id="tour-section" className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-[11px] font-bold text-brand-primary/80 uppercase tracking-widest font-mono">Como Funciona</p>
          <h2 className="font-display-md text-3xl text-brand-primary font-bold">Os Três Estados do Santuário Criptográfico</h2>
          <p className="text-sm text-brand-on-surface/65">
            Entenda como nosso fluxo de inoculação protege e valida suas imagens em tempo real através dos três cenários e estados da aplicação.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {workflowSteps.map((ws, i) => (
            <div 
              key={ws.step} 
              className="bg-white rounded-2xl border border-brand-outline-variant/25 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Aspect Ratio 16:9 matching the beautiful assets */}
              <div className="relative aspect-[16/9] w-full bg-zinc-100 overflow-hidden group">
                <img 
                  src={ws.image} 
                  alt={ws.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-brand-primary/95 text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full shadow">
                  Passo {ws.step}
                </span>
                <span className="absolute bottom-3 right-3 bg-brand-accent text-zinc-950 text-[8px] font-bold px-2.5 py-1 rounded tracking-wider uppercase font-mono shadow">
                  {ws.badge}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-brand-outline uppercase tracking-wider block">
                    {ws.subtitle}
                  </span>
                  <h3 className="font-headline-sm text-lg font-bold text-brand-primary">{ws.title}</h3>
                  <p className="text-xs text-brand-on-surface/70 leading-relaxed">
                    {ws.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VALUE PILLARS & ROADMAP SPECIFICATION */}
      <section id="pillars-section" className="bg-brand-surface border border-brand-outline-variant/25 rounded-2xl p-8 md:p-12 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valuePillars.map((vp) => {
            const Icon = vp.icon;
            return (
              <div key={vp.title} className="space-y-3 text-left">
                <div className="w-12 h-12 bg-white border border-brand-outline-variant/30 text-brand-primary rounded-xl flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="font-headline-sm font-bold text-brand-primary text-base">{vp.title}</h3>
                <p className="text-xs text-brand-on-surface/65 leading-relaxed">
                  {vp.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PRESET EXPERIMENTAL TELEMETRIES (TRY ON DEMAND) */}
      <section id="preset-tryout-section" className="space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-3 text-left">
          <div>
            <h2 className="font-headline-md text-brand-primary text-lg font-bold flex items-center gap-2">
              <Palette className="w-5 h-5" /> Catálogo de Amostras para Inocular
            </h2>
            <p className="text-xs text-brand-on-surface/50">Selecione uma destas belas obras clássicas para testar instantaneamente os filtros do atelier.</p>
          </div>
          <button 
            type="button"
            onClick={() => onStartProtecting()}
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1.5"
          >
            Começar do zero <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRESET_ARTWORKS.map((pa) => (
            <div 
              key={pa.id}
              onClick={() => onStartProtecting(pa.id)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-brand-outline-variant/20 hover:border-brand-primary shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-3 text-left">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 mb-3">
                  <img 
                    src={pa.imageUrl} 
                    alt={pa.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-brand-primary/95 text-white rounded-full font-mono text-[8px] px-2.5 py-1 tracking-wider uppercase shadow">
                    PROMO_DEMO
                  </div>
                </div>

                <div className="px-1 space-y-1">
                  <h4 className="font-headline-sm text-brand-primary text-sm font-bold truncate">{pa.title}</h4>
                  <div className="flex justify-between items-center text-[9.5px] text-brand-on-surface/50 font-mono">
                    <span>{pa.artist}</span>
                    <span>{pa.medium}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 hover:bg-brand-secondary/20 px-3.5 py-2.5 border-t border-zinc-100 flex justify-between items-center text-[10.5px] text-brand-primary font-bold transition-colors">
                <span>Inoculação rápida de marcas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GUEST CONVITE BANNER FOR UNREGISTERED USERS */}
      {!isLoggedIn && (
        <section id="guest-conversion-banner" className="bg-gradient-to-r from-brand-primary-container to-brand-primary text-white rounded-2xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-brand-accent/5 rounded-l-full blur-2xl"></div>
          <div className="space-y-2 relative z-10">
            <h3 className="font-headline-md text-2xl font-bold">Pronto para assumir propriedade sobre seu trabalho?</h3>
            <p className="text-xs md:text-sm text-brand-secondary max-w-xl">
              Crie uma conta gratuita em segundos usando seu pseudônimo. Guarde seu histórico de salvaguarda, baixe certificados de autenticidade assinados e controle seu portfólio.
            </p>
          </div>
          <button
            id="conversion-register-btn"
            onClick={onOpenAuth}
            className="bg-brand-accent hover:opacity-95 text-zinc-950 font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full shadow-lg transition-transform active:scale-95 relative z-10 whitespace-nowrap"
          >
            Criar Minha Conta de Artista
          </button>
        </section>
      )}

    </div>
  );
}
