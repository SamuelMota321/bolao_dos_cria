import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TelaInicialLogin } from "./screens/TelaInicialLogin";
import { TelaCadastro } from "./screens/TelaCadastro";
import { TelaSucesso } from "./screens/TelaSucesso";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<TelaInicialLogin />} />
        <Route path="/cadastro" element={<TelaCadastro />} />
        <Route path="/sucesso" element={<TelaSucesso />} />
      </Routes>
    </Router>
  </StrictMode>
);