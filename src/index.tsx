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
import { EsqueciSenha } from "./screens/EsqueciSenha";
import { VerificarCodigo } from "./screens/VerificarCodigo";
import { RedefinirSenha } from "./screens/RedefinirSenha";
import { SenhaAtualizada } from "./screens/SenhaAtualizada";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<TelaInicialLogin />} />
        <Route path="/cadastro" element={<TelaCadastro />} />
        <Route path="/sucesso" element={<TelaSucesso />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/criar-bolao" element={<CriarBolao />} />
        <Route path="/participar-bolao" element={<ParticiparBolao />} />
        <Route path="/perfil-usuario" element={<PerfilUsuario />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/senha-atualizada" element={<SenhaAtualizada />} />
      </Routes>
    </Router>
  </StrictMode>
);