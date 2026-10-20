import { Show, SignInButton, UserButton } from '@clerk/react';

function Header({ user, rol, onOpenAdmin }) {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Colonia Sonora, inicio">
        <img className="brand-mark" src="/Logo.png" alt="" />
        <span className="brand-lockup">
          <span className="brand-name">ECOS<br />COLONIA</span>
          <span className="brand-tagline">A TRAVÉS DE LA MÚSICA</span>
        </span>
      </a>
      <div className="account-actions">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="login-link" type="button">
              <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6" r="3" /><path d="M4 17c0-2.2 2.7-4 6-4s6 1.8 6 4" /></svg>
              Ingresar
            </button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          {rol === 'admin' && <button className="login-link admin-open" type="button" onClick={onOpenAdmin}>Administrar</button>}
          <span className="account-email">{user?.primaryEmailAddress?.emailAddress}</span>
          <UserButton />
        </Show>
      </div>
    </header>
  );
}

export default Header;
