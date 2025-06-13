import { createContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface LoginFormData {
  email: string;
  password: string;
}
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
interface UserProviderProps {
  children: ReactNode;
}
interface UserContextType {
  userLogin: (formData: LoginFormData) => void;
  userRegister: (formData: RegisterFormData) => void;
}

export const UserContext = createContext<UserContextType>({} as UserContextType);
export const UserContextProvider = ({ children }: UserProviderProps): JSX.Element => {
  const navigate = useNavigate();
  const userLogin = (formData: LoginFormData) => {
    console.log("Login:", formData);
    navigate("/dashboard")
  };

  const userRegister = (formData: RegisterFormData) => {
    console.log("Register:", formData);
  };

  return (
    <UserContext.Provider value={{ userLogin, userRegister }}>
      {children}
    </UserContext.Provider>
  );
};
