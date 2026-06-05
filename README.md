# 🌿 Porto Digital Amazônico

Plataforma de comércio e logística fluvial para produtores, compradores e freteiros da região amazônica. Frontend em React com dados mockados, cobrindo todos os 19 casos de uso do sistema.

---

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (já vem com o Node)

### Passos

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** no navegador (ou a porta indicada no terminal caso 5173 já esteja em uso).

---

## Usuários de teste

Todos os logins usam CPF + código SMS (simulado — o código aparece na própria tela).

| Perfil | CPF | Código SMS |
|--------|-----|------------|
| Produtor (Maria da Silva) | `111.111.111-11` | `1234` |
| Produtor (Ana Ribeiro) | `444.444.444-44` | `3456` |
| Comprador/Freteiro (João Pereira) | `222.222.222-22` | `5678` |
| Comprador/Freteiro (Carlos Mendes) | `333.333.333-33` | `9012` |
| Administrador | `000.000.000-00` | `0000` |

---

## Funcionalidades implementadas

### Módulo: Cadastro e Autenticação
- **UC01** — Cadastro de Produtor (nome, CPF, comunidade, porto, tipos de produção, PIX)
- **UC02** — Cadastro de Comprador/Freteiro (com ou sem embarcação)
- **UC03** — Autenticação via CPF + código SMS no totem

### Módulo: Gestão de Produção
- **UC04** — Registro digital de colheitas com histórico permanente e auditoria
- **UC05** — Anúncio de mercadoria no catálogo com vínculo opcional a colheita

### Módulo: Rotas e Logística
- **UC06** — Cadastro de rotas fluviais (origem, destino, paradas, frequência, capacidade)
- **UC07** — Consulta de fretes disponíveis com filtros por porto e capacidade

### Módulo: Compra e Transação
- **UC08** — Compra de mercadoria no catálogo com pagamento PIX simulado (QR Code fake)
- **UC09** — Solicitação de frete terceiro com seleção de freteiro e pagamento PIX
- **UC14** — Penalidade automática de reputação por cancelamento de frete pago

### Módulo: Rastreamento e Entrega
- **UC10** — Rastreamento visual da carga com steps de status em tempo real
- **UC11** — Confirmação de retirada da mercadoria no porto de origem
- **UC12** — Confirmação de entrega no porto de destino

### Módulo: Avaliação e Reputação
- **UC13** — Avaliação de produtor, comprador e freteiro com notas (1–5) e comentários

### Módulo: Histórico e Indicadores
- **UC15** — Histórico de transações com filtros por status e período
- **UC16** — Painel de indicadores com gráficos de barras: volume por produto, receita por mês, rotas mais demandadas, preço médio, ranking de produtores

### Módulo: Administração
- **UC17** — Gestão de totens digitais (ativar/desativar/reiniciar remotamente)
- **UC18** — Configuração de taxas da plataforma (produto e frete)
- **UC19** — Mediação de disputas entre as partes

---

## Estrutura do projeto

```
src/
  context/
    AuthContext.jsx       # Autenticação e sessão do usuário
    AppContext.jsx        # Estado global (transações, mercadorias)
  data/
    mockData.js           # Todos os dados simulados
  components/
    Navbar.jsx
    Sidebar.jsx           # Menu lateral por perfil
    StatusBadge.jsx       # Badges coloridos de status
    RatingStars.jsx       # Componente de estrelas
    PIXModal.jsx          # Modal de pagamento PIX simulado
  pages/
    auth/                 # Login, cadastro produtor, cadastro comprador
    dashboard/            # Painel inicial por perfil
    production/           # Registrar colheita, anunciar mercadoria
    logistics/            # Cadastrar rota, consultar fretes
    transactions/         # Catálogo, frete, rastreamento, retirada, entrega
    evaluation/           # Avaliação de transação
    history/              # Histórico e indicadores
    admin/                # Painel administrativo
  styles/
    global.css            # Tema amazônico (verde floresta, azul rio)
```

---

## Tecnologias

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [React Router DOM 7](https://reactrouter.com/)
- CSS puro com variáveis de tema (sem biblioteca de UI externa)
# PortoAmazonico
