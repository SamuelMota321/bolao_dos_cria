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
    const getSession = async () => {
      try {
        console.log("chamando getSession")
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }

        const { session } = data;
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.id);

        setUser(session?.user ?? null);
        if (session?.user) {
          console.log("estou sendo chamado")
          await fetchProfile(session.user.id);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  

  const fetchProfile = async (userId: string) => {
    console.log('Iniciando fetchProfile para', userId);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log("Sai do await supabase.from().select");

      if (error) {
        console.error('Erro ao buscar perfil:', error);
      }

      console.log("Erro do supabase:", error);
      console.log("Dados recebidos do perfil:", data);
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil (try/catch):', error);
    }
  };

  const userLogin = async (formData: LoginFormType) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error('Erro no login:', error);
        throw new Error(error.message || 'Erro ao fazer login');
      }

      if (data.user) {
        console.log('Login realizado com sucesso:', data.user.id);
        // O redirecionamento será feito pelo useEffect quando o estado do usuário mudar
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw error;
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

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw profileError;
        }

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