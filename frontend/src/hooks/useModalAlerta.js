import { useState } from "react";

export default function useModalAlerta() {
  const [modal, setModal] = useState({
    visivel: false,
    titulo: "",
    mensagem: "",
    tipo: "info",
    textoBotaoConfirmar: "",
    textoBotaoCancelar: "",
    onConfirmar: null,
    onCancelar: null,
  });

  const fecharModal = () => {
    setModal((prev) => ({
      ...prev,
      visivel: false,
    }));
  };

  const mostrarAlerta = ({
    titulo = "Aviso",
    mensagem = "",
    tipo = "info",
    textoBotaoConfirmar = "OK",
    onConfirmar,
  }) => {
    setModal({
      visivel: true,
      titulo,
      mensagem,
      tipo,
      textoBotaoConfirmar,
      textoBotaoCancelar: "",
      onConfirmar: () => {
        fecharModal();
        if (onConfirmar) onConfirmar();
      },
      onCancelar: fecharModal,
    });
  };

  const mostrarConfirmacao = ({
    titulo = "Confirmar ação",
    mensagem = "",
    tipo = "confirmar",
    textoBotaoConfirmar = "Confirmar",
    textoBotaoCancelar = "Cancelar",
    onConfirmar,
    onCancelar,
  }) => {
    setModal({
      visivel: true,
      titulo,
      mensagem,
      tipo,
      textoBotaoConfirmar,
      textoBotaoCancelar,
      onConfirmar: () => {
        fecharModal();
        if (onConfirmar) onConfirmar();
      },
      onCancelar: () => {
        fecharModal();
        if (onCancelar) onCancelar();
      },
    });
  };

  return {
    modal,
    fecharModal,
    mostrarAlerta,
    mostrarConfirmacao,
  };
}
