import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, Profile } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import { LoginFormType } from "../schemas/loginSchema";
import { RegisterFormType } from "../schemas/registerSchema";
import { Session, AuthChangeEvent } from '@supabase/supabase-js';


interface UserProviderProps {
  children: ReactNode;
}

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  userLogin: (formData: LoginFormType) => Promise<void>;
  userRegister: (formData: RegisterFormType) => Promise<void>;
  userLogout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserContextProvider = ({ children }: UserProviderProps): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      const { session } = data;
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const userLogin = async (formData: LoginFormType) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const userRegister = async (formData: RegisterFormType) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: formData.name,
            email: formData.email,
          });

        if (profileError) throw profileError;

        navigate("/sucesso");
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const userLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw new Error(error.message || 'Erro ao sair');
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      profile,
      loading,
      userLogin,
      userRegister,
      userLogout
    }}>
      {children}
    </UserContext.Provider>
  );
};