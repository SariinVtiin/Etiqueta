// frontend/src/pages/Cadastros/Cadastros.jsx
// ============================================
// SALUSVITA TECH - Hub de Cadastros
// Desenvolvido por FerMax Solution
// ============================================
// NOVO: Cards filtrados por permissão do usuário
// Admin vê tudo. Nutricionista vê só o que tem permissão.
// ============================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Cadastros.css";
import RelatorioLogin from "../../components/RelatorioLogin/RelatorioLogin";


function Cadastros() {
  const navigate = useNavigate();
  const { temPermissao } = useAuth();
  const [relatorioLoginAberto, setRelatorioLoginAberto] = useState(false);

  // Definição dos cards com suas permissões
  const cards = [
    {
      permissao: "cadastros_usuarios",
      icon: "👥",
      titulo: "Gestão de Usuários",
      descricao: "Criar, editar e gerenciar usuários do sistema",
      acao: () => navigate("/admin/usuarios"),
      botao: "Acessar",
    },
    {
      permissao: "cadastros_leitos",
      icon: "🏥",
      titulo: "Setores e Leitos",
      descricao: "Gerenciar setores hospitalares e leitos",
      acao: () => navigate("/admin/leitos"),
      botao: "Acessar",
    },
    {
      permissao: "cadastros_dietas",
      icon: "🍽️",
      titulo: "Tipos de Dieta",
      descricao: "Configurar tipos de alimentação disponíveis",
      acao: () => navigate("/admin/dietas"),
      botao: "Acessar",
    },
    {
      permissao: "cadastros_condicoes",
      icon: "🩺",
      titulo: "Condição Nutricional",
      descricao: "Gerenciar condições nutricionais para prescrições (HPS, DM, IRC, etc.)",
      acao: () => navigate("/admin/condicoes"),
      botao: "Acessar",
    },
    {
      permissao: "cadastros_acrescimos",
      icon: "📥",
      titulo: "Acréscimos",
      descricao: "Importar planilha de suplementos e acréscimos",
      acao: () => navigate("/admin/acrescimos"),
      botao: "Acessar",
    },
    {
      permissao: "cadastros_logs",
      icon: "🔐",
      titulo: "Logs de Login",
      descricao: "Gerar relatório Excel com histórico de acessos ao sistema",
      acao: () => setRelatorioLoginAberto(true),
      botao: "Gerar Relatório",
    },
    {
      permissao: "cadastros_refeicoes",
      icon: "🍽️",
      titulo: "Tipos de Refeição",
      descricao: "Gerenciar refeições disponíveis (Desjejum, Almoço, Jantar...)",
      acao: () => navigate("/admin/refeicoes"),
      botao: "Acessar",
    },
    {
      permissao: "cadastros_condicoes_acompanhante",
      icon: "👥",
      titulo: "Cond. Nutricional Acompanhante",
      descricao: "Gerenciar condições nutricionais específicas para acompanhantes",
      acao: () => navigate("/admin/condicoes-acompanhante"),
      botao: "Acessar",
    },
    {
      permissao: "cadastros_configuracoes",
      icon: "⚙️",
      titulo: "Configurações",
      descricao: "Opções gerais do sistema",
      acao: () => navigate("/admin/configuracoes"),
      botao: "Acessar",
    },
    {
      permissao: "cadastros_convenios",
      icon: "🏦",
      titulo: "Convênios",
      descricao: "Gerenciar tipos de convênio (SUS, Particular, etc.)",
      acao: () => navigate("/admin/convenios"),
      botao: "Acessar",
    },
  ];

  // Filtrar cards por permissão
  const cardsVisiveis = cards.filter((card) => temPermissao(card.permissao));

  return (
    <div className="cadastros-container">
      <div className="cadastros-header">
        <h1>Configurações e Cadastros</h1>
      </div>

      {cardsVisiveis.length === 0 ? (
        <div className="cadastros-vazio">
          <p>Você não tem permissões de cadastro configuradas.</p>
          <p>Entre em contato com o administrador do sistema.</p>
        </div>
      ) : (
        <div className="cadastros-cards">
          {cardsVisiveis.map((card, index) => (
            <div
              key={index}
              className="cadastro-card"
              onClick={card.acao}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-icon">{card.icon}</div>
              <h3>{card.titulo}</h3>
              <p>{card.descricao}</p>
              <button className="card-button">{card.botao}</button>
            </div>
          ))}
        </div>

        {/* Condição Nutricional (seu projeto renomeou de restrição -> condição) */}
        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/condicoes")}
        >
          <div className="card-icon">🩺</div>
          <h3>Condição Nutricional</h3>
          <p>
            Gerenciar condições nutricionais para prescrições (HPS, DM, IRC,
            etc.)
          </p>
          <button className="card-button">Acessar</button>
        </div>

        {/* ✅ Acréscimos (AGORA COMO ROTA) */}
        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/acrescimos")}
        >
          <div className="card-icon">📥</div>
          <h3>Acréscimos</h3>
          <p>Importar planilha de suplementos e acréscimos</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Logs de Login */}
        <div
          className="cadastro-card"
          onClick={() => setRelatorioLoginAberto(true)}
        >
          <div className="card-icon">🔐</div>
          <h3>Logs de Login</h3>
          <p>Gerar relatório Excel com histórico de acessos ao sistema</p>
          <button className="card-button">Gerar Relatório</button>
        </div>

        {/* Tipos de Refeição */}
        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/refeicoes")}
        >
          <div className="card-icon">🍽️</div>
          <h3>Tipos de Refeição</h3>
          <p>Gerenciar refeições disponíveis (Desjejum, Almoço, Jantar...)</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Condições Nutricionais do Acompanhante */}
        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/condicoes-acompanhante")}
        >
          <div className="card-icon">👥</div>
          <h3>Cond. Nutricional Acompanhante</h3>
          <p>Gerenciar condições nutricionais específicas para acompanhantes</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Configurações */}
        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/configuracoes")}
        >
          <div className="card-icon">⚙️</div>
          <h3>Configurações</h3>
          <p>Opções gerais do sistema</p>
          <button className="card-button">Acessar</button>
        </div>

        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/convenios")}
        >
          <div className="card-icon">🏦</div>
          <h3>Convênios</h3>
          <p>Gerenciar tipos de convênio (SUS, Particular, etc.)</p>
          <button className="card-button">Acessar</button>
        </div>

        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/tabela-precos")}
        >
          <div className="card-icon">💰</div>
          <h3>Tabela de Preços</h3>
          <p>Gerenciar os valores base usados no faturamento do sistema</p>
          <button className="card-button">Acessar</button>
        </div>
      </div>

      <RelatorioLogin
        isOpen={relatorioLoginAberto}
        onClose={() => setRelatorioLoginAberto(false)}
      />
    </div>
  );
}

export default Cadastros;