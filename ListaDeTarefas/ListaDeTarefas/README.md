# Lista de Tarefas - Backend

API REST desenvolvida em ASP.NET Core para gerenciamento de tarefas com autenticação JWT.

## Tecnologias
- .NET 10.0
- Entity Framework Core
- PostgreSQL
- JWT Bearer Authentication
- BCrypt para hashing de senhas
- Swagger/OpenAPI

## Estrutura
- `Program.cs`: Configuração da aplicação, middleware e endpoints
- `AuthEndpoints.cs`: Endpoints de autenticação (login/registro)
- `TarefasEndpoints.cs`: Endpoints CRUD de tarefas
- `Data/ListaDeTarefasContext.cs`: Contexto EF Core
- `Modelos/`: Entidades do domínio (Tarefa, Usuario)
- `DTOs/`: Objetos de transferência de dados
- `Filters/`: Filtros de validação
- `Migrations/`: Migrações do banco
- `Tests/`: Testes unitários

## Como Rodar
1. Configure `appsettings.Development.json` com string de conexão PostgreSQL
2. Execute migrações: `dotnet ef database update`
3. Rode: `dotnet run`
4. API em `http://localhost:5253`
5. Swagger em `http://localhost:5253/swagger`

## Deploy no Render
1. Conecte repositório GitHub
2. Selecione Web Service
3. Runtime: Docker
4. Build Command: (vazio, usa Dockerfile)
5. Start Command: `./ListaDeTarefas`
6. Variáveis de ambiente:
   - `DATABASE_URL`: Connection string PostgreSQL
   - `JWT__KEY`: Chave JWT segura
   - `JWT__ISSUER=ListaDeTarefas`
   - `JWT__AUDIENCE=ListaDeTarefasUsers`

## Endpoints
Ver documentação completa no README raiz ou Swagger UI.
