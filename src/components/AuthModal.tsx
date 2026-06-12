/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Palette
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: string; name: string; email: string; initials: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (tab === 'register' && !name) {
      setErrorMsg('Por favor, preencha o seu nome artístico.');
      return;
    }

    setIsLoading(true);

    (async () => {
      try {
        const normalizedEmail = email.toLowerCase();
        let response;

        if (tab === 'login') {
          response = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password,
          });
        } else {
          response = await supabase.auth.signUp({
            email: normalizedEmail,
            password,
            options: {
              data: { name },
            },
          });
        }

        const { data, error } = response;
        if (error) {
          setErrorMsg(error.message || 'Erro na autenticação');
          setIsLoading(false);
          return;
        }

        const user = 'user' in data ? data.user : data;
        if (!user) {
          setSuccessMsg('Verifique o seu e-mail para concluir o cadastro.');
          setIsLoading(false);
          return;
        }

        const userName = user.user_metadata?.name || name || user.email || '';
        const initials = userName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();

        onSuccess({
          id: user.id,
          name: userName,
          email: user.email,
          initials,
        });

        setSuccessMsg(tab === 'login' ? `Bem-vindo de volta, ${user.user_metadata?.name || name}!` : 'Cadastro concluído com sucesso!');
        setTimeout(() => {
          onClose();
          setIsLoading(false);
          setSuccessMsg('');
        }, 900);
      } catch (e) {
        console.error(e);
        setErrorMsg('Erro de rede. Tente novamente.');
        setIsLoading(false);
      }
    })();
  };

  const autofillDemo = () => {
    setEmail('cfm@cesar.school');
    setPassword('123456');
    setTab('login');
    setErrorMsg('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="auth-modal-overlay" className="fixed inset-0 bg-brand-primary/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          id="auth-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-brand-outline-variant/30 flex flex-col relative"
        >
          {/* Decorative Purple Banner Node */}
          <div className="bg-brand-primary text-white p-6 relative">
            <button 
              id="auth-modal-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-secondary/25 border border-white/20 rounded-xl flex items-center justify-center text-brand-tertiary-fixed shadow-inner animate-pulse">
                <Lock className="w-5 h-5 text-brand-accent fill-brand-accent/20" />
              </div>
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-white tracking-tight">Portal de Acesso</h3>
                <p className="text-[10px] text-brand-secondary tracking-widest uppercase font-mono mt-0.5">Área de Autenticação do Artista</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Tabs for Login / Register selection */}
            <div id="auth-modal-tabs" className="grid grid-cols-2 gap-1 p-1 bg-brand-surface rounded-xl border border-brand-outline-variant/20">
              <button
                id="auth-tab-login"
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all uppercase flex items-center justify-center gap-1.5 ${
                  tab === 'login'
                    ? 'bg-brand-primary text-white shadow-md font-bold'
                    : 'text-brand-on-surface/60 hover:text-brand-primary hover:bg-brand-secondary/15'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Entrar
              </button>
              <button
                id="auth-tab-register"
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 rounded-lg text-xs font-semibold tracking-tight transition-all uppercase flex items-center justify-center gap-1.5 ${
                  tab === 'register'
                    ? 'bg-brand-primary text-white shadow-md font-bold'
                    : 'text-brand-on-surface/60 hover:text-brand-primary hover:bg-brand-secondary/15'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Cadastrar-se
              </button>
            </div>

            {/* Error & Success Feedback alerts */}
            {errorMsg && (
              <div id="auth-modal-error" className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-150 rounded-lg text-red-900 text-xs">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="leading-normal font-medium">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div id="auth-modal-success" className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-150 rounded-lg text-emerald-900 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="leading-normal font-medium">{successMsg}</p>
              </div>
            )}

            {/* Form */}
            <form id="auth-modal-form" onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Name Field (Register exclusive) */}
              {tab === 'register' && (
                <div id="auth-register-name-field">
                  <label className="block text-[11px] font-bold text-brand-primary uppercase tracking-wider mb-1.5 ml-1">
                    Nome Artístico / Pseudônimo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-brand-outline" />
                    <input
                      id="input-register-name"
                      type="text"
                      required
                      placeholder="Ex: Elena Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-brand-surface border border-brand-outline-variant/35 rounded-full pl-10 pr-4 py-2.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-brand-primary uppercase tracking-wider mb-1.5 ml-1">
                  E-mail do Criador
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-outline" />
                  <input
                    id="input-auth-email"
                    type="email"
                    required
                    placeholder="artista@creativesanctuary.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-brand-surface border border-brand-outline-variant/35 rounded-full pl-10 pr-4 py-2.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-brand-primary uppercase tracking-wider mb-1.5 ml-1 flex justify-between">
                  <span>Senha</span>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={autofillDemo}
                      className="text-[9px] text-brand-outline hover:text-brand-primary lowercase font-semibold underline underline-offset-1"
                    >
                      Preencher demonstração
                    </button>
                  )}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-brand-outline" />
                  <input
                    id="input-auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 5 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-brand-surface border border-brand-outline-variant/35 rounded-full pl-10 pr-10 py-2.5 text-xs text-brand-on-surface focus:outline-none focus:border-brand-primary focus:bg-white transition-all disabled:opacity-50"
                  />
                  <button
                    id="toggle-auth-password-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-brand-outline hover:text-brand-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-brand-primary text-white hover:opacity-95 font-bold py-3.5 rounded-full text-xs uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Carregando Metadados...
                  </span>
                ) : (
                  <>
                    <span>{tab === 'login' ? 'Acessar Meu Estúdio' : 'Registrar Minha Assinatura'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div id="auth-predefined-hint" className="p-3 bg-brand-surface border border-brand-outline-variant/20 rounded-xl text-[10.5px] leading-relaxed text-zinc-500 text-center">
              💡 <span className="font-semibold text-brand-primary">Dica rápida:</span> Use seu e-mail e senha para entrar ou registrar sua conta.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
