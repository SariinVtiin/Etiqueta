import { useState, useCallback } from "react";

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

  const fecharModal = useCallback(() => {
    setModal((prev) => ({ ...prev, visivel: false }));
  }, []);

  const mostrarAlerta = useCallback(({
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
        setModal((prev) => ({ ...prev, visivel: false }));
        if (onConfirmar) onConfirmar();
      },
      onCancelar: () => setModal((prev) => ({ ...prev, visivel: false })),
    });
  }, []);

  const mostrarConfirmacao = useCallback(({
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
        setModal((prev) => ({ ...prev, visivel: false }));
        if (onConfirmar) onConfirmar();
      },
      onCancelar: () => {
        setModal((prev) => ({ ...prev, visivel: false }));
        if (onCancelar) onCancelar();
      },
    });
  }, []);

  return { modal, fecharModal, mostrarAlerta, mostrarConfirmacao };
}