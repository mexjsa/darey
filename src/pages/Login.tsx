import React, { useState } from 'react';
import { useStore } from '@/store';
import { Shield, Eye, EyeOff, Lock, Smartphone, CheckCircle, AlertCircle, RefreshCw, Building2, Sparkles } from 'lucide-react';

export default function Login() {
  const {
    loginWithPassword,
    verifyTOTP,
    authStep,
    loginError,
    skipMFASetup,
    getCurrentTenant,
    tenants,
    currentTenantId,
    switchTenant
  } = useStore();

  const currentTenant = getCurrentTenant();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [totp, setTotp] = useState('');
  const [loading, setLoading] = useState(false);
  const [totpError, setTotpError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginWithPassword(username, password);
    setLoading(false);
  };

  const handleTOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totp.length !== 6) { setTotpError('El codigo debe tener 6 dogitos'); return; }
    setLoading(true);
    setTotpError('');
    const ok = await verifyTOTP(totp);
    setLoading(false);
    if (!ok) {
      setTotpError('Codigo incorrecto o expirado');
      setTotp('');
    } else {
      setSuccess(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: `linear-gradient(135deg, ${currentTenant.secondary_color} 0%, ${currentTenant.primary_color} 100%)`
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />

      <div className="relative w-full max-w-md">
        {/* Tenant Quick Switcher Pills for Demo */}
        <div className="mb-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-white/80 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
            ?? Despacho:
          </span>
          {tenants.map(t => (
            <button
              key={t.id}
              onClick={() => switchTenant(t.id)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all backdrop-blur-sm ${
                currentTenantId === t.id
                  ? 'bg-white text-slate-900 shadow-md font-bold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {t.short_name}
            </button>
          ))}
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div
            className="px-8 py-6 text-center text-white relative"
            style={{
              background: `linear-gradient(to right, ${currentTenant.secondary_color}, ${currentTenant.primary_color})`
            }}
          >
            <div className="flex justify-center mb-3">
              <div
                className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white/80 bg-white flex items-center justify-center overflow-hidden"
              >
                {currentTenant.logo_url ? (
                  <img
                    src={currentTenant.logo_url}
                    alt={currentTenant.short_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-slate-800">{currentTenant.short_name.slice(0, 2)}</span>
                )}
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-wide">{currentTenant.short_name}</h1>
            <p className="text-white/90 text-sm font-medium mt-0.5">Integrador Documental de Campo</p>
            <p className="text-white/70 text-[11px] mt-0.5 font-normal">{currentTenant.name}</p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6">
            {authStep === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-4">Acceso Seguro de Personal</p>
                  {loginError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 mb-4">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      {loginError}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuario</label>
                  <input
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
                    placeholder="Ej. AJUSTADOR-01"
                    value={username}
                    onChange={e => setUsername(e.target.value.toUpperCase())}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contraseña</label>
                  <div className="relative">
                    <input
                      className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
                      type={showPass ? 'text' : 'password'}
                      placeholder="oooooooo"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPass(v => !v)}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white font-semibold rounded-xl text-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: currentTenant.primary_color }}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Iniciar Sesion
                    </>
                  )}
                </button>
              </form>
            )}

            {authStep === 'totp' && (
              <form onSubmit={handleTOTP} className="space-y-5 animate-fadeIn">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Verificacion 2FA Requerida</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Ingresa el codigo de 6 dogitos de tu aplicacion autenticadora.
                  </p>
                </div>

                {totpError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {totpError}
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="123456"
                    value={totp}
                    onChange={e => setTotp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || totp.length !== 6}
                  className="w-full py-3 text-white font-semibold rounded-xl text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50"
                  style={{ backgroundColor: currentTenant.primary_color }}
                >
                  {loading ? 'Verificando...' : 'Verificar y Entrar'}
                </button>
              </form>
            )}

            {authStep === 'mfa_setup' && (
              <div className="space-y-4 text-center animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Configurar Autenticación 2FA</h3>
                <p className="text-xs text-slate-500">
                  Por política de ciberseguridad NIST/OWASP L3, tu cuenta requiere doble factor de autenticación.
                </p>
                <button
                  onClick={skipMFASetup}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-all"
                >
                  Continuar al Entorno
                </button>
              </div>
            )}
          </div>

          {/* Footer Powered By NEXOS */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              Cifrado AES-256 + SHA-256
            </span>
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Powered by NEXOS IA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
