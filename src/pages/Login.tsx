import React, { useState } from 'react';
import { useStore } from '@/store';
import { Shield, Eye, EyeOff, Lock, Smartphone, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

// ================================================================
// Pantalla de Login — DAREY Integrador
// ================================================================

export default function Login() {
  const { loginWithPassword, verifyTOTP, authStep, loginError, skipMFASetup } = useStore();
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
    if (totp.length !== 6) { setTotpError('El código debe tener 6 dígitos'); return; }
    setLoading(true);
    setTotpError('');
    const ok = await verifyTOTP(totp);
    setLoading(false);
    if (!ok) {
      setTotpError('Código incorrecto o expirado');
      setTotp('');
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-azul-profundo via-azul-darey to-cian flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-md">
        {/* Logo Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-azul-profundo to-azul-darey px-8 py-6 text-center">
            <div className="flex justify-center mb-3">
              <img
                src="/darey-icon-circle.jpg"
                alt="Logo DAREY"
                className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white/80 bg-white"
              />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">DAREY</h1>
            <p className="text-cian/90 text-sm font-semibold mt-0.5">Integrador de Expedientes</p>
            <p className="text-white/70 text-xs mt-0.5 font-medium">Ajustadores Profesionales S.C.</p>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {authStep === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
                <div>
                  <p className="text-sm font-semibold text-carbon mb-4">Acceso al sistema</p>
                  {loginError && (
                    <div className="alert-error mb-4">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {loginError}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Usuario</label>
                  <input
                    className="input-darey"
                    placeholder="Ej. AJUSTADOR-01"
                    value={username}
                    onChange={e => setUsername(e.target.value.toUpperCase())}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">Contraseña</label>
                  <div className="relative">
                    <input
                      className="input-darey pr-10"
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-carbon"
                      onClick={() => setShowPass(v => !v)}
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Turnstile visual simulado */}
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-text-muted">Verificación anti-bots activa <span className="text-azul-darey font-semibold">Cloudflare Turnstile</span></span>
                </div>

                <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {loading ? 'Verificando...' : 'Iniciar sesión'}
                </button>

                {/* Demo credentials hint */}
                <details className="text-xs text-text-muted border border-dashed border-gray-200 rounded-lg p-3">
                  <summary className="cursor-pointer font-semibold text-azul-darey">Credenciales de demo</summary>
                  <div className="mt-2 space-y-1 font-mono">
                    <div>SUPER-ADMIN / admin123</div>
                    <div>AJUSTADOR-01 / ajust123</div>
                    <div>AJUSTADOR-02 / ajust123</div>
                    <div>REVISOR-01 / rev123</div>
                    <div>COORDINADOR / coord123</div>
                  </div>
                </details>
              </form>
            )}

            {authStep === 'mfa_setup' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 text-azul-darey mx-auto mb-3" />
                  <h2 className="font-bold text-carbon">Configura el Authenticator</h2>
                  <p className="text-sm text-text-muted mt-1">Es la primera vez que accedes. Escanea el código QR con tu app Authenticator.</p>
                </div>

                {/* QR simulado */}
                <div className="flex justify-center">
                  <div className="w-40 h-40 border-4 border-azul-darey rounded-lg flex items-center justify-center bg-bg-subtle">
                    <div className="text-center text-xs text-text-muted">
                      <div className="text-3xl mb-1">📱</div>
                      <div className="font-semibold">QR Simulado</div>
                      <div className="text-azul-darey font-mono mt-1 text-[10px]">DAREY-DEMO</div>
                    </div>
                  </div>
                </div>

                <div className="alert-info text-xs">
                  <div>En producción aquí aparecerá el código QR real TOTP. Usa Google Authenticator, Microsoft Authenticator o Authy.</div>
                </div>

                <button onClick={skipMFASetup} className="btn-primary w-full">
                  Continuar (demo sin TOTP real)
                </button>
              </div>
            )}

            {authStep === 'totp' && (
              <form onSubmit={handleTOTP} className="space-y-5 animate-fadeIn">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 text-azul-darey mx-auto mb-3" />
                  <h2 className="font-bold text-carbon">Verificación de 2 pasos</h2>
                  <p className="text-sm text-text-muted mt-1">Ingresa el código de 6 dígitos de tu app Authenticator.</p>
                </div>

                {totpError && (
                  <div className="alert-error">
                    <AlertCircle className="w-4 h-4" />
                    {totpError}
                  </div>
                )}

                {/* Input TOTP estilo big */}
                <div>
                  <input
                    className="w-full text-center text-2xl font-bold tracking-[0.5em] py-3 border-2 border-gray-200 rounded-xl focus:border-azul-darey focus:ring-2 focus:ring-azul-darey/20 outline-none bg-bg-subtle"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={totp}
                    onChange={e => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    autoFocus
                  />
                </div>

                <div className="alert-info text-xs">
                  <div><strong>Demo:</strong> ingresa cualquier 6 dígitos (ej. <span className="font-mono">123456</span>)</div>
                </div>

                <button type="submit" className="btn-primary w-full py-2.5" disabled={loading}>
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  {loading ? 'Verificando...' : 'Verificar código'}
                </button>

                <button type="button" className="btn-ghost w-full text-xs"
                  onClick={() => useStore.setState({ authStep: 'login', pendingUserId: null })}>
                  ← Volver al login
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-5 text-center">
            <p className="text-xs text-text-muted">
              DAREY Ajustadores Profesionales S.C. · Sistema v1.0
            </p>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-4">
          Protegido por Cloudflare · TLS activo
        </p>
      </div>
    </div>
  );
}
