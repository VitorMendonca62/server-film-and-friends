const html = (username, code) => {
  const text = `
  <html lang="pt-br">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
          }
          h2 {
            color: #25A96C;
          }
          .text {
            color: #333333;
          }
          .code {
            color: #25A96C;
            font-weight: bold;
            font-size: 1.5rem;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h2>Redefinir Senha</h2>
          <p class="text">Olá, ${username}.</p>
          <p class="text">Você solicitou a redefinição da senha. Aqui está o código de redefinição:</p>
          
          <p class="code">${code}</p>
          
          <p class="text">Por favor, retorne à página e insira o código acima para confirmar sua identidade.</p>
          <p class="text">Se você não solicitou a redefinição da senha, por favor, ignore este e-mail.</p>
  
          <p class="text">Atenciosamente, Equipe de Suporte Movie&Friends.</p>
      </div>
  </body>
  </html>`;
  return text;
};

export default html;
