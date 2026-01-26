const express = require('express');
const cors = require('cors');
const net = require('net');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DA IMPRESSORA - AJUSTE O IP AQUI
const IMPRESSORA_IP = '192.168.1.100'; // ALTERE para o IP da sua Zebra
const IMPRESSORA_PORTA = 9100;

// Gerar comando ZPL para a etiqueta
function gerarZPL(dados) {
  const zpl = `
^XA

^FO20,20^ADN,25,15^FDLeito: ${dados.leito}^FS
^FO20,55^GB380,2,2^FS

^FO20,70^ADN,30,18^FDDieta: ${dados.dieta}^FS

${dados.obs1 ? `^FO20,115^ADN,20,12^FD${dados.obs1}^FS` : ''}
${dados.obs2 ? `^FO20,145^ADN,20,12^FD${dados.obs2}^FS` : ''}
${dados.obs3 ? `^FO20,175^ADN,20,12^FD${dados.obs3}^FS` : ''}

^FO20,210^GB380,2,2^FS

${dados.merenda ? `^FO20,225^ADN,20,12^FDMerenda: ${dados.merenda}^FS` : ''}
${dados.jantar ? `^FO20,250^ADN,20,12^FDJantar: ${dados.jantar}^FS` : ''}

^XZ
`;
  
  return zpl;
}

// Enviar para impressora Zebra
function enviarParaZebra(zpl) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    
    client.connect(IMPRESSORA_PORTA, IMPRESSORA_IP, () => {
      console.log('Conectado à impressora Zebra');
      client.write(zpl);
      client.end();
    });

    client.on('close', () => {
      console.log('Impressão enviada');
      resolve();
    });

    client.on('error', (err) => {
      console.error('Erro ao conectar:', err);
      reject(err);
    });

    client.setTimeout(5000, () => {
      client.destroy();
      reject(new Error('Timeout ao conectar com impressora'));
    });
  });
}

// Endpoint para imprimir etiquetas
app.post('/api/imprimir', async (req, res) => {
  try {
    const { etiquetas } = req.body;

    if (!etiquetas || etiquetas.length === 0) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Nenhuma etiqueta para imprimir' 
      });
    }

    for (const etiqueta of etiquetas) {
      const zpl = gerarZPL(etiqueta);
      await enviarParaZebra(zpl);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    res.json({ 
      sucesso: true, 
      total: etiquetas.length 
    });

  } catch (erro) {
    console.error('Erro ao imprimir:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

// Endpoint de teste
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Backend funcionando!' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});