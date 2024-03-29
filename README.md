# Movie And Friends

## Pré-requesitos:

Antes de tudo, verifique se você tem todos os softwares instalados no seu computador:
- [Docker](https://docs.docker.com/get-docker/)
- [NodeJS](https://nodejs.org/pt-br/download)

## Configurações

### Servidor
#### Passo a passo para rodar o servidor

1. Duplique o arquivo **.env.template** e renomei para **.env**:

    1.1 Preencha asinformações do banco de dados;

    1.2 Preencha qual porta deseja;

    1.3 Escolha um valor para o **AUTH_SECRET** e guarde em um lugar seguro, pois as informações serão criptografadas a partir desse valor;

    1.4 Caso deseje utilizar o sistemas de email, preencha o campo email, aprenda como utilizar [aqui](https://www.freecodecamp.org/portuguese/news/como-usar-o-nodemailer-para-enviar-emails-do-seu-servidor-do-node-js/);

   1.5 Faça login no [TMDB_API](https://developer.themoviedb.org/reference/intro/getting-started) e copie sua chave de acesso para API e preencha no campo **API_KEY_TMDB**;

3. Entre no diretório do servidor:
```bash
cd server/
``` 

3. Instale as dependências do projeto usando:
```bash
npm install
```

4. Crie o banco de dados:
```bash
docker-compose up -d
```

5. Rode as migrations:
```bash
npx sequelize db:migrate
```

6. Rode o servidor;
```bash
npm start
```
7. Pronto! O servidor está rodando com sucesso, vamos agora para o client;

