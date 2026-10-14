import { useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase.js';

function AuthPanel({ onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError('La autenticación todavía no está configurada. Revisá las variables de Supabase.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (authError) throw authError;
        if (data.session) {
          onClose();
        } else {
          setNotice('Te enviamos un correo de validación. Confirmá tu dirección desde ese mensaje antes de ingresar; revisá también la carpeta de correo no deseado.');
          setMode('login');
        }
      } else if (mode === 'reset') {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (authError) throw authError;
        setNotice('Si existe una cuenta para ese correo, recibirá instrucciones para cambiar la contraseña.');
      } else if (mode === 'update') {
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
        setNotice('La contraseña se actualizó correctamente.');
        onClose();
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        onClose();
      }
    } catch (authError) {
      setError(authError.message || 'No se pudo completar la solicitud.');
    } finally {
      setLoading(false);
    }
  }

  const title = mode === 'signup'
    ? 'Crear cuenta'
    : mode === 'reset'
      ? 'Recuperar contraseña'
      : mode === 'update'
        ? 'Elegir contraseña nueva'
        : 'Ingresar';

  return (
    <div className="account-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <button className="account-close" type="button" aria-label="Cerrar" onClick={onClose}>×</button>
        <p className="eyebrow">ECOS COLONIA</p>
        <h2 id="account-title">{title}</h2>
        <p className="account-intro">
          {mode === 'signup'
            ? 'Registrate para participar en la comunidad.'
              : mode === 'update'
                ? 'Elegí una contraseña nueva para tu cuenta.'
                : mode === 'reset'
                ? 'Te enviaremos un enlace para crear una contraseña nueva.'
                : 'Ingresá a tu cuenta para continuar.'}
        </p>
        <form className="account-form" onSubmit={submit}>
          <label htmlFor="account-email">Correo electrónico</label>
          <input
            id="account-email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          {mode !== 'reset' && (
            <>
              <label htmlFor="account-password">Contraseña</label>
              <input
                id="account-password"
                autoComplete={mode === 'signup' || mode === 'update' ? 'new-password' : 'current-password'}
                type="password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {(mode === 'signup' || mode === 'update') && <small>Usá al menos 8 caracteres.</small>}
            </>
          )}
          {mode === 'signup' && (
            <>
              <label htmlFor="account-confirm-password">Repetir contraseña</label>
              <input
                id="account-confirm-password"
                autoComplete="new-password"
                type="password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </>
          )}
          {error && <p className="account-message is-error" role="alert">{error}</p>}
          {notice && <p className="account-message" role="status">{notice}</p>}
          <button className="account-submit" type="submit" disabled={loading}>
            {loading ? 'Un momento…' : title}
          </button>
        </form>
        <div className="account-options">
          {mode === 'login' && (
            <>
              <button type="button" onClick={() => { setMode('signup'); setError(''); setNotice(''); }}>Crear una cuenta</button>
              <button type="button" onClick={() => { setMode('reset'); setError(''); setNotice(''); }}>Olvidé mi contraseña</button>
            </>
          )}
          {mode !== 'login' && mode !== 'update' && (
            <button type="button" onClick={() => { setMode('login'); setError(''); setNotice(''); }}>Volver a ingresar</button>
          )}
        </div>
        {!supabaseConfigured && (
          <p className="account-setup-note" role="note">
            Falta configurar <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.
          </p>
        )}
      </section>
    </div>
  );
}

export default AuthPanel;
