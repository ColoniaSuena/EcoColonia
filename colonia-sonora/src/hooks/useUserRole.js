import { useEffect, useState } from 'react';

function useUserRole({ sessionLoaded, userLoaded, user, session, supabase }) {
  const [perfil, setPerfil] = useState({ userId: null, sessionId: null, role: '', error: '' });

  useEffect(() => {
    if (!sessionLoaded || !userLoaded || !supabase) return undefined;
    let activo = true;

    if (!user) {
      return () => {
        activo = false;
      };
    }

    async function cargarRol() {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (!activo) return;

      if (error) {
        setPerfil({
          userId: user.id,
          sessionId: session?.id ?? null,
          role: '',
          error: `No se pudo verificar el rol de la cuenta: ${error.message}`,
        });
        return;
      }

      setPerfil({
        userId: user.id,
        sessionId: session?.id ?? null,
        role: data?.role ?? 'user',
        error: '',
      });
    }

    void cargarRol();

    return () => {
      activo = false;
    };
  }, [sessionLoaded, userLoaded, user, session, supabase]);

  const rol = user && session && perfil.userId === user.id && perfil.sessionId === session.id
    ? perfil.role
    : '';

  const errorCuenta = user && session && perfil.userId === user.id && perfil.sessionId === session.id
    ? perfil.error
    : '';

  return { rol, errorCuenta };
}

export default useUserRole;
