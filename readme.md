## Sobre o Projeto
- Sobre o projeto montei uma arquitetura modular, a ideia veio justamentente por não nenhum ORM para o bance dados. e outro motivo e por ter familharidade devido ao angular provalmente os nomes dos arquivos já diz tudo rs. Como esta nós requisitos usar sqlite, mantive seguir com emplementação. pensei em clona boilerplate de beckend Node.js, mas resolvi contruir do zero. apliquei conceito importante de Inversão de controler e injeção de dependência, mas de uma forma manual, conhecida como injeção via construto. Vir vantangem quando estava criando os testes de unidade, acabei focando na camada serviço, pois é onde tudo acontece e também nós middlewares.


## ✅ Técnologias
- Typescript
- Node.js
- Sqlite
- Swagger
- Express
- Autenticação JWT
- Jest

## ✅ Pré-requisitos

* Docker instalado
* Git instalado


1. Clone este repositório usando o comando:

   ```bash
   git clone https://github.com/erikbernard/task-manager.git
   ```
2. Acesse a pasta `task-manager`:

   ```bash
   cd task-manager
   ```
3.  A pasta `task-manager`, localize o arquivo `.env.example` e cole o seguinte conteúdo:

   ``` bash
  PORT=3333
  JWT_SECRET="SUA_CHAVE_SECRETA_SUPER_SEGURA_AQUI
  ```

4. Para iniciar o ambiente Docker, execute o seguinte comando:

   ```bash
    docker-compose up -d

    # ou no docker engine

    docker compose up -d
   ```
   Isso iniciará os contêineres Docker necessários.

## 🌐 Acesso ao open API swaggwer

Com os contêineres em execução, você poderá acessar a versão temporária do deployment:

1. Abra o navegador e acesse Swagger:
   [http://localhost:3333/api-docs/](http://localhost:3333/api-docs/)
   
2. o backend rodando na porta 3333:
   [http://localhost:3333](http://localhost:3333)



## 🌐 Deploy na AWS

- Sobre o fron-end poder ser hospedado um site estático usando o Amazon S3, seria o ideal para site estático e tem valores mais acessiveis. 
Outro ponto seria o uso do Amazon CloudFront, justamente para que o site carregue rapidamente para usuários em qualquer lugar e ter HTTPS (SSL/TLS) de forma fácil. Achei um pouco semelhante ao serviço de Azure Front Door, mas o da aws é mais simples.
- Sobre o backend o primeiro problema do projeto atual e que usa o sqlite banco embutido (baseado em arquivo). Para implamplantar sistemas em ambiente de cloud, onde a aplicação pode rodar em múltiplos contêineres ou servidores que não compartilham o mesmo sistema de arquivos e inviaável.
- A forma que contruir o backend, bastar implementar um novo repositorio para um banco PostgreSQL, MySQL ou SQL Server. e poderiamos utilizar Amazon RDS para o banco e para hospedagem da aplicação AWS Fargate com Amazon ECS usando o dockefile.