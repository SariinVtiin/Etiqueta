import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RelatorioLogin from "../../components/RelatorioLogin/RelatorioLogin";
import "./Cadastros.css";

function Cadastros() {
  const navigate = useNavigate();
  const [relatorioLoginAberto, setRelatorioLoginAberto] = useState(false);

  return (
    <div className="cadastros-container">
      <div className="cadastros-header">
        <h1>Configurações e Cadastros</h1>
      </div>

      <div className="cadastros-cards">
        {/* Gestão de Usuários */}
        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/usuarios")}
        >
          <div className="card-icon">👥</div>
          <h3>Gestão de Usuários</h3>
          <p>Criar, editar e gerenciar usuários do sistema</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Setores e Leitos */}
        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/leitos")}
        >
          <div className="card-icon">🏥</div>
          <h3>Setores e Leitos</h3>
          <p>Gerenciar setores hospitalares e leitos</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Tipos de Dieta */}
        <div
          className="cadastro-card"
          onClick={() => navigate("/admin/dietas")}
        >
          <div className="card-icon">🍽️</div>
          <h3>Tipos de Dieta</h3>
          <p>Configurar tipos de alimentação disponíveis</p>
          <button className="card-button">Acessar</button>
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
          <p>
            Gerenciar condições nutricionais específicas para acompanhantes
          </p>
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

      </div>

      <RelatorioLogin
        isOpen={relatorioLoginAberto}
        onClose={() => setRelatorioLoginAberto(false)}
      />
    </div>
  );
}

export default Cadastros;
