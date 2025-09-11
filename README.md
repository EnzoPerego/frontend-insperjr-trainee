# Frontend InsperJr Trainee

Frontend da aplicação InsperJr Trainee desenvolvido com React + Vite e Tailwind CSS.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn UI** - Biblioteca de componentes (configurada)

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Bens da aplicação (imagens, ícones, etc.)
├── components/      # Componentes do UI (Shadcn UI)
├── config/          # Configuração geral (URL do backend)
├── lib/             # Arquivos de apoio das libs (Tailwind, utils)
├── pages/           # Páginas do site efetivamente
├── styles/          # Estilos gerais
└── utils/           # Funções ajudantes
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🎨 Componentes

O projeto está configurado com Shadcn UI. Para adicionar novos componentes:

```bash
npx shadcn-ui@latest add [component-name]
```

## 📝 Configuração

- **Backend URL**: Configure em `src/config/index.js`
- **Estilos**: Personalize em `src/styles/globals.css`
- **Tailwind**: Configuração em `tailwind.config.js`

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 📦 Dependências Principais

- `react` - Biblioteca principal
- `vite` - Build tool
- `tailwindcss` - Framework CSS
- `class-variance-authority` - Utilitário para variantes de componentes
- `clsx` - Utilitário para classes condicionais
- `tailwind-merge` - Merge inteligente de classes Tailwind