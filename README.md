# Frontend InsperJr Trainee

Frontend da aplicação InsperJr Trainee desenvolvido com React + Vite e Tailwind CSS.

## 🚀 Como executar

### Pré-requisitos
- **Node.js** (versão 20.19+ ou 22.12+)
- **Git** (para baixar o projeto)

### Passo a passo

1. **Instale o Node.js** (se não tiver):
   - Acesse: https://nodejs.org/
   - Baixe a versão **LTS** (recomendada)
   - Execute o instalador e siga as instruções

2. **Baixe o projeto:**
   - Clone o repositório ou baixe o ZIP
   - Extraia em uma pasta de sua escolha

3. **Abra o Terminal/Prompt de Comando:**
   - **Windows**: Pressione `Win + R`, digite `cmd` e pressione Enter
   - **Mac**: Pressione `Cmd + Espaço`, digite "Terminal" e pressione Enter
   - **Linux**: Pressione `Ctrl + Alt + T`

4. **Navegue até a pasta do projeto:**
   ```bash
   cd caminho/para/frontend-insperjr-trainee
   ```

5. **Instale as dependências:**
   ```bash
   npm install
   ```
   ⏳ *Aguarde terminar (pode demorar alguns minutos na primeira vez)*

6. **Execute o projeto:**
   ```bash
   npm run dev
   ```

7. **Abra no navegador:**
   - Acesse: http://localhost:5173
   - Ou: http://127.0.0.1:5173

### ✅ Se tudo der certo, você verá:
- No terminal: `VITE v7.1.5 ready in 667 ms`
- No navegador: A página do InsperJr Trainee

### 🆘 Problemas comuns:
- **"node não é reconhecido"**: Reinstale o Node.js
- **"npm não é reconhecido"**: Reinstale o Node.js (npm vem junto)
- **"porta já está em uso"**: Feche outros programas na porta 5173
- **Página não carrega**: Verifique se o terminal ainda está rodando `npm run dev`

## 📁 Estrutura

```
src/
├── components/      # Header, Footer, Layout
├── pages/          # Páginas do site
├── styles/         # Estilos CSS
├── config/         # Configurações
├── lib/            # Utilitários
└── utils/          # Funções auxiliares
```

## 🎨 Componentes prontos

- **Header** - Navegação responsiva
- **Footer** - Links e informações
- **Layout** - Estrutura principal
- **Home** - Página inicial

## 🛠️ Scripts

- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
- `npm run preview` - Preview do build