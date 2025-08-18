## Sobre o Projeto
Sobre o projeto montei API RESTful com uma arquitetura modular, construída com Node.js, TypeScript e Express para gestão de utilizadores e tarefas. No projeto o incluindo separação de responsabilidades, injeção de dependência e uma suíte de testes focada nas camada serviço, pois é onde concentra as regras de negocios e também nós middlewares onde ocorre validações das rotas protegidas.


## ✅ Funcionalidades

### Módulo de Utilizadores
- **Autenticação:** Sistema completo de autenticação via JWT (JSON Web Tokens).
- **CRUD de Utilizador:**
  - `POST /api/users`: Criação de um novo utilizador com senha encriptada (bcrypt).
  - `POST /api/login`: Login de utilizador e geração de token de acesso.
  - `GET /api/profile`: Busca do perfil do utilizador autenticado.
  - `PUT /api/users/me`: Atualização completa dos dados (nome, e-mail) do utilizador autenticado.
  - `PUT /api/users/me/password`: Alteração de senha com verificação da senha antiga.
  - `DELETE /api/users/me`: Eliminação da conta do utilizador autenticado.

### Módulo de Tarefas
- **CRUD de Tarefas:**
  - `POST /api/task`: Criação de uma nova tarefa associada ao utilizador logado.
  - `GET /api/tasks`: Listagem de todas as tarefas do utilizador logado com suporte a filtros e paginação.
  - `GET /api/task/:id`: Busca de uma tarefa específica por ID.
  - `PATCH /api/task/:id`: Atualização parcial de uma tarefa (título, descrição, prioridade, estado).
  - `DELETE /api/task/:id`: Eliminação de uma tarefa.
- **Filtros e Paginação:**
  - Filtro por `prioridade` (`HIGH`, `MEDIUM`, `LOW`).
  - Filtro por `estado` (`PENDING`, `COMPLETED`, etc.).
  - Paginação completa com `page` e `limit`, retornando o total de itens e de páginas no corpo da resposta.

## Arquitetura e Padrões

A Forma como projetei a arquitetura foi se seguindo modelo comum de projetos node.js **(Model-Service-Controller-Repositories-middlewares)**, mas adaptada para o contexto mais modular semelhante ao que e usado no `Framework Nestjs`. A estrutura é modularizada também traz vantagens para testes e desacoplamento da camada acesso ao banco de dados, atualmente usar `SQlite`.

**Adotei essa forma pois não utilizei nenhum ORM, já não tinha premissa se podia usar no teste tecnico, de forma foquei no uso SQlite,mas deixando abertura melhoria, arquitura modular serviu bem**

- **Controllers:** Responsáveis por receber as requisições HTTP, validar os dados de entrada (usando DTOs com Zod) e enviar a resposta. Mantêm-se "magros", delegando toda a lógica para a camada de serviço.
- **Services:** Onde reside o "cérebro" da aplicação. Contêm toda a lógica de negócio, orquestrando as operações e as regras da aplicação (ex: verificar se um e-mail já existe, validar uma senha).
- **Repositories:** A única camada que interage diretamente com a base de dados. Abstrai a lógica de acesso a dados (queries SQL), permitindo que o resto da aplicação seja agnóstico em relação à base de dados utilizada.
- **Middlewares:** Funções que interceptam o ciclo de requisição-resposta. São usados para tarefas transversais como autenticação (`auth.middleware.ts` para validar tokens JWT) e tratamento centralizado de erros (`error.handler.ts`), mantendo os controllers limpos.
- **Injeção de Dependência (via Construtor):** O projeto utiliza injeção de dependência manual. As dependências (ex: um repositório) são "injetadas" nas classes que as utilizam (ex: um serviço) através dos seus construtores.

### Vantagens da Arquitetura
- **Alta Testabilidade:** A injeção de dependência e a separação de camadas permitem testar a lógica de negócio de forma isolada (testes de unidade), usando "mocks" para simular o comportamento da base de dados.
- **Baixo Acoplamento:** As camadas são independentes. É possível trocar a base de dados (de SQLite para PostgreSQL, por exemplo) alterando apenas a camada de repositório, sem impactar a lógica de negócio.
- **Escalabilidade:** A estrutura modular facilita a adição de novas funcionalidades (ex: um módulo de "Projetos") sem afetar os módulos existentes.
- **Manutenção Simplificada:** A clara separação de responsabilidades torna o código mais fácil de entender, depurar e modificar.

### Desvantagens
- **Boilerplate:** Para funcionalidades simples, a criação de múltiplos ficheiros (controller, service, repository, DTO) pode parecer excessiva.
- **Curva de Aprendizagem:** Desenvolvedores menos familiarizados com estes padrões podem levar algum tempo para se adaptar ao fluxo de trabalho.


## Sobre o SQLite

Foi sugerido o uso SQLite para este projeto, por ser banco embutido (baseado em arquivo) e facil de configurá e simples de inicial um projeto.

**Limitações a Considerar:** O SQLite pode apresentar estrangulamentos de concorrência sob alta carga de escrita, pois bloqueia a base de dados inteira durante as operações de escrita. Para aplicações em cloud de ser feito a migração para um sistema de base de dados cliente-servidor como **PostgreSQL** ou **MySQL** é recomendada ou pode usar um servico como [Turso](https://docs.turso.tech/introduction) que basicamente em SQlite como serviço.


## ✅ Técnologias
- Backend: Node.js, TypeScript, Express.js
- Base de Dados: SQLite 3
- Validação: Zod
- Autenticação: JSON Web Token (jsonwebtoken), bcrypt
- Testes: Jest, Supertest, ts-jest
- Contentorização: Docker, Docker Compose
- Documentação: Swagger (OpenAPI) via swagger-ui-express

## Como Executar o Projeto
### Pré-requisitos

- Node.js (v20.x ou superior)
- npm ou yarn
- Docker e Docker Compose (para execução com contentor)

### Executando Localmente

Clone este repositório usando o comando e acesse a pasta:

   ```bash
   git clone https://github.com/erikbernard/task-manager.git

   cd task-manager
   ```


1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. Na pasta `task-manager`, localize o arquivo `.env.example` ou renomeie o para `.env.example`

   ``` bash
   PORT=3333
   JWT_SECRET="SUA_CHAVE_SECRETA_SUPER_SEGURA_AQUI
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
## Testes com Jest

Para executar a suíte completa de testes (unidade e integração), execute:
   ```bash
   npm test
   ```


### Ambiente Docker
Para iniciar o ambiente Docker, execute o seguinte comando:

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


## 🌐 Melhorias Futuras

- **Migração de Base de Dados:** Implementar suporte para uma base de dados mais robusta como PostgreSQL, utilizando uma ferramenta de migração como o Knex.js ou usarom ORM.
- **Refresh Tokens:** Adicionar um sistema de refresh tokens para um fluxo de autenticação mais seguro e duradouro.
- **Controlo de Acesso (RBAC):** Adicionar papéis de utilizador (ex: `admin`, `user`) para controlar o acesso a determinadas rotas.
- **Logging e Monitorização:** Integrar uma ferramenta de logging (como Winston) e monitorização (como Sentry ou New Relic) para o ambiente de produção.


## 🌐 Deploy na AWS

- Sobre o fron-end poder ser hospedado um site estático usando o Amazon S3, seria o ideal para site estático e tem valores mais acessiveis. 
Outro ponto seria o uso do Amazon CloudFront, justamente para que o site carregue rapidamente para usuários em qualquer lugar e ter HTTPS (SSL/TLS) de forma fácil. Achei um pouco semelhante ao serviço de Azure Front Door, mas o da aws é mais simples.
- Sobre o backend o primeiro problema do projeto atual e que usa o sqlite banco embutido (baseado em arquivo). Para implamplantar sistemas em ambiente de cloud, onde a aplicação pode rodar em múltiplos contêineres ou servidores que não compartilham o mesmo sistema de arquivos e inviaável.
- A forma que contruir o backend, bastar implementar um novo repositorio para um banco PostgreSQL, MySQL ou SQL Server. e poderiamos utilizar Amazon RDS para o banco e para hospedagem da aplicação AWS Fargate com Amazon ECS usando o dockefile.





