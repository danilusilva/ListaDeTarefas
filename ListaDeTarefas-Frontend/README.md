# Lista de Tarefas - Frontend

Interface web desenvolvida em React para gerenciamento de tarefas com autenticação.

## Tecnologias
- React 19.2.4
- Vite 8.0.1
- Material-UI
- Axios
- Context API para estado

## Estrutura
- `src/App.jsx`: Componente raiz
- `src/main.jsx`: Ponto de entrada
- `src/context/AuthContext.jsx`: Gerenciamento de autenticação
- `src/api/tasksApi.js`: Cliente HTTP para API
- `src/pages/`: Páginas (Login, Tarefas)
- `src/components/`: Componentes reutilizáveis
- `src/styles/theme.js`: Estilos globais

## Como Rodar
1. Instale dependências: `npm install`
2. Configure `.env` com `VITE_API_URL`
3. Rode: `npm run dev`
4. Aplicação em `http://localhost:5173`

## Deploy no Vercel
1. Conecte repositório GitHub
2. Configure root directory: `ListaDeTarefas-Frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Variável de ambiente: `VITE_API_URL=https://seu-backend.onrender.com`

## Funcionalidades
- Login/registro de usuários
- CRUD de tarefas
- Interface responsiva com Material-UI
- Proteção de rotas por autenticação
