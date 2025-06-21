import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TelaInicialLogin } from "./screens/TelaInicialLogin";
import { TelaCadastro } from "./screens/TelaCadastro";
import { TelaSucesso } from "./screens/TelaSucesso";
import { Dashboard } from "./screens/Dashboard";
import { CriarBolao } from "./screens/CriarBolao";
import { ParticiparBolao } from "./screens/ParticiparBolao";
import { PerfilUsuario } from "./screens/PerfilUsuario";
import { Ranking } from "./screens/Ranking";
import { Partidas } from "./screens/Partidas";
import { EsqueciSenha } from "./screens/EsqueciSenha";
import { VerificarCodigo } from "./screens/VerificarCodigo";
import { RedefinirSenha } from "./screens/RedefinirSenha";
import { SenhaAtualizada } from "./screens/SenhaAtualizada";
import { UserContextProvider } from "./providers/UserContext";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Router>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<TelaInicialLogin />} />
          <Route path="/cadastro" element={<TelaCadastro />} />
          <Route path="/sucesso" element={<TelaSucesso />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/verificar-codigo" element={<VerificarCodigo />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/senha-atualizada" element={<SenhaAtualizada />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/criar-bolao" element={
            <ProtectedRoute>
              <CriarBolao />
            </ProtectedRoute>
          } />
          <Route path="/participar-bolao" element={
            <ProtectedRoute>
              <ParticiparBolao />
            </ProtectedRoute>
          } />
          <Route path="/perfil-usuario" element={
            <ProtectedRoute>
              <PerfilUsuario />
            </ProtectedRoute>
          } />
          <Route path="/ranking" element={
            <ProtectedRoute>
              <Ranking />
            </ProtectedRoute>
          } />
          <Route path="/partidas" element={
            <ProtectedRoute>
              <Partidas />
            </ProtectedRoute>
          } />
        </Routes>
      </UserContextProvider>
    </Router>
  </StrictMode>
);