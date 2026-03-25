# Lista de Tarefas

## Visão Geral

Esta aplicação é um sistema de gerenciamento de tarefas pessoais com autenticação de usuários. Permite que usuários criem, editem, marquem como concluídas e excluam tarefas, com controle de prazo. O projeto resolve a necessidade de organização pessoal de afazeres, destinado a usuários individuais que desejam gerenciar suas tarefas diárias de forma segura e intuitiva.

## Estrutura do Monorepo

```
ListaDeTarefas-Full/
├── ListaDeTarefas/                    # Subprojeto backend (API ASP.NET Core)
│   ├── ListaDeTarefas.csproj          # Arquivo de projeto .NET
│   ├── Program.cs                     # Configuração da aplicação e middleware
│   ├── AuthEndpoints.cs               # Endpoints de autenticação (login/registro)
│   ├── TarefasEndpoints.cs            # Endpoints CRUD de tarefas
│   ├── appsettings.json               # Configurações gerais
│   ├── appsettings.Development.json   # Configurações de desenvolvimento (DB, JWT)
│   ├── Data/
│   │   └── ListaDeTarefasContext.cs   # Contexto Entity Framework Core
│   ├── DTOs/                          # Objetos de transferência de dados
│   │   ├── AuthDTOs.cs                # DTOs para autenticação
│   │   ├── CriarTarefaRequest.cs      # DTO para criação de tarefa
│   │   ├── AtualizarTarefaRequest.cs  # DTO para atualização de tarefa
│   │   └── TarefaResponse.cs          # DTO para resposta de tarefa
│   ├── Filters/
│   │   └── ValidationFilter.cs        # Filtro de validação para endpoints
│   ├── Migrations/                    # Migrações do banco de dados
│   ├── Modelos/                       # Entidades do domínio
│   │   ├── Tarefa.cs                  # Modelo de tarefa
│   │   └── Usuario.cs                 # Modelo de usuário
│   ├── Properties/
│   │   └── launchSettings.json        # Configurações de execução
│   └── Tests/                         # Testes unitários e de integração
│       ├── CustomWebApplicationFactory.cs
│       ├── TarefaEndpointsTests.cs
│       └── Tests.csproj
├── ListaDeTarefas-Frontend/           # Subprojeto frontend (React)
│   ├── package.json                   # Dependências e scripts Node.js
│   ├── vite.config.js                 # Configuração do Vite
│   ├── .env                           # Variáveis de ambiente (URL da API)
│   ├── index.html                     # Página HTML principal
│   ├── src/
│   │   ├── main.jsx                   # Ponto de entrada da aplicação React
│   │   ├── App.jsx                    # Componente raiz
│   │   ├── api/
│   │   │   └── tasksApi.js            # Cliente API com Axios
│   │   ├── components/                # Componentes reutilizáveis
│   │   │   ├── ProtectedRoute.jsx     # Rota protegida por autenticação
│   │   │   ├── TaskFormDialog.jsx     # Modal de formulário de tarefa
│   │   │   ├── TaskItem.jsx           # Item individual de tarefa
│   │   │   ├── TaskList.jsx           # Lista de tarefas
│   │   │   └── CreateTaskModal.jsx    # Modal de criação (não utilizado)
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Contexto de autenticação
│   │   ├── pages/                     # Páginas da aplicação
│   │   │   ├── LoginPage.jsx          # Página de login/registro
│   │   │   └── TaskPage.jsx           # Página principal de tarefas
│   │   └── styles/
│   │       └── theme.js               # Estilos globais e tema
│   └── public/                        # Arquivos estáticos
└── README.md                          # Este arquivo
```

## Stack e Tecnologias

### Frontend
- **React 19.2.4**: Biblioteca para construção da interface
- **Vite 8.0.1**: Ferramenta de build e desenvolvimento
- **Material-UI (@mui/material 7.3.9, @mui/icons-material 7.3.9)**: Componentes de UI
- **Axios 1.13.6**: Cliente HTTP para requisições à API
- **date-fns 4.1.0**: Utilitários para manipulação de datas
- **@emotion/react 11.14.0, @emotion/styled 11.14.1**: Sistema de estilos CSS-in-JS

### Backend
- **.NET 10.0**: Framework para desenvolvimento da API
- **ASP.NET Core**: Framework web para APIs REST
- **Entity Framework Core 10.0.5**: ORM para acesso ao banco
- **Npgsql.EntityFrameworkCore.PostgreSQL 10.0.0**: Provider PostgreSQL para EF Core
- **Microsoft.AspNetCore.Authentication.JwtBearer 10.0.5**: Autenticação JWT
- **BCrypt.Net-Next 4.1.0**: Hashing de senhas
- **Swashbuckle.AspNetCore 6.4.6**: Documentação Swagger/OpenAPI

### Ferramentas de Desenvolvimento
- **ESLint**: Linting para JavaScript/React
- **Entity Framework Tools**: Migrações e scaffolding de banco
- **Vite**: Servidor de desenvolvimento frontend
- **xUnit**: Framework de testes para .NET

## Arquitetura e Fluxo

O frontend se comunica com o backend via API REST, utilizando autenticação JWT. O fluxo de autenticação funciona da seguinte forma:

1. Usuário faz login/registro na página de login
2. Backend valida credenciais e retorna token JWT
3. Token é armazenado no localStorage do navegador
4. Axios interceptor injeta automaticamente o token em todas as requisições subsequentes
5. Backend valida token em endpoints protegidos usando middleware JWT
6. Se token inválido/expirado, usuário é redirecionado para login

O gerenciamento de estado no frontend utiliza Context API para autenticação global. Rotas são protegidas pelo componente `ProtectedRoute`, que verifica se há usuário autenticado. Requisições são feitas via cliente Axios centralizado em `tasksApi.js`.

## Variáveis de Ambiente

### Backend (appsettings.Development.json)
- `ConnectionStrings:DefaultConnection`: String de conexão Oracle
  - Exemplo: `User Id=USUARIO;Password=SENHA;Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=HOST)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=SERVICO)))`
- `Jwt:Key`: Chave secreta para assinatura JWT
  - Exemplo: `FC%]b,^YN:=[X/f(!>u0G;+3A#g7el8JtrVPjR2&no]`
- `Jwt:Issuer`: Emissor do token JWT
  - Exemplo: `ListaDeTarefas`
- `Jwt:Audience`: Audiência do token JWT
  - Exemplo: `ListaDeTarefasUsers`

### Frontend (.env)
- `VITE_API_URL`: URL base da API backend
  - Exemplo: `http://localhost:5253`

## Como Rodar Localmente

### Pré-requisitos
- .NET 10 SDK
- Node.js 18+
- Oracle Database (ou container Oracle)
- Git

### Backend
1. Navegue até `ListaDeTarefas/ListaDeTarefas/`
2. Configure a string de conexão em `appsettings.Development.json`
3. Execute migrações: `dotnet ef database update`
4. Rode a aplicação: `dotnet run`
5. API estará disponível em `http://localhost:5253`

### Frontend
1. Navegue até `ListaDeTarefas-Frontend/`
2. Instale dependências: `npm install`
3. Configure `VITE_API_URL` no arquivo `.env` se necessário
4. Rode o servidor: `npm run dev`
5. Aplicação estará disponível em `http://localhost:5173`

**Ordem de inicialização**: Backend deve ser iniciado primeiro, pois o frontend depende da API.

## Endpoints da API

### Autenticação
- `POST /api/auth/registrar`
  - Descrição: Registra novo usuário
  - Body: `{ "email": "string", "senha": "string" }`
  - Resposta: `{ "id": number, "email": "string" }`

- `POST /api/auth/login`
  - Descrição: Faz login do usuário
  - Body: `{ "email": "string", "senha": "string" }`
  - Resposta: `{ "token": "string", "email": "string" }`

### Tarefas
- `GET /api/Tarefa`
  - Descrição: Lista todas as tarefas do usuário autenticado
  - Resposta: Array de objetos tarefa

- `GET /api/Tarefa/{id}`
  - Descrição: Obtém tarefa específica por ID
  - Resposta: Objeto tarefa

- `POST /api/Tarefa`
  - Descrição: Cria nova tarefa
  - Body: `{ "titulo": "string", "prazo": "yyyy-MM-dd" }`
  - Resposta: Objeto tarefa criado

- `PUT /api/Tarefa/{id}`
  - Descrição: Atualiza tarefa existente
  - Body: `{ "titulo": "string", "prazo": "yyyy-MM-dd", "concluido": boolean }`
  - Resposta: 204 No Content

- `DELETE /api/Tarefa/{id}`
  - Descrição: Exclui tarefa
  - Resposta: 204 No Content

**Formato de resposta tarefa**: `{ "id": number, "titulo": "string", "prazo": "yyyy-MM-dd", "concluido": boolean, "createdAt": "datetime" }`

## Decisões Técnicas Relevantes

- **Minimal APIs**: Utilizadas no backend para endpoints concisos e performáticos, evitando controllers tradicionais
- **Entity Framework Core com PostgreSQL**: Escolhido para persistência devido à integração nativa com .NET e suporte em plataformas cloud como Render
- **JWT Authentication**: Implementada para segurança stateless, com expiração de 8 horas
- **BCrypt para hashing**: Usado para senhas por ser seguro contra rainbow tables
- **Context API no frontend**: Gerenciamento de estado global simples para autenticação
- **Axios interceptors**: Centralização da injeção de token JWT em requisições
- **Material-UI**: Framework de componentes para UI consistente e acessível
- **Vite**: Build tool moderno para desenvolvimento rápido no frontend
- **Validação com Data Annotations**: Validações automáticas em DTOs usando atributos .NET

## Deploy em Produção

### Vercel (Frontend)
1. Conecte o repositório GitHub ao Vercel
2. Configure o build para o diretório `ListaDeTarefas-Frontend`
3. Defina variável de ambiente: `VITE_API_URL=https://seu-backend-render.onrender.com`
4. Deploy automático

### Render (Backend)
1. Conecte o repositório GitHub ao Render
2. Configure como Web Service para .NET
3. Defina variáveis de ambiente:
   - `DATABASE_URL`: Connection string PostgreSQL (Render fornece automaticamente)
   - `JWT__KEY`: Chave secreta JWT (gere uma nova segura)
   - `JWT__ISSUER=ListaDeTarefas`
   - `JWT__AUDIENCE=ListaDeTarefasUsers`
4. Configure build command: `dotnet restore && dotnet ef database update`
5. Start command: `dotnet run --urls=http://0.0.0.0:$PORT`

### Banco de Dados
- Use PostgreSQL no Render (gratuito até certos limites)
- Execute migrações automaticamente no deploy
- Configure CORS no backend para o domínio do Vercel</content>
<parameter name="filePath">c:\Alura\ListaDeTarefas-Full\README.md