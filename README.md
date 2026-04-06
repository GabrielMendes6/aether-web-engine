# 📦 SystemBox: Sistema de Autogestão e Catálogo Digital

O **SystemBox** é uma plataforma de e-commerce e gerenciamento de conteúdo (CMS) de alto desempenho, desenvolvida para transformar empreendedores informais em negócios digitais profissionais. O projeto permite a criação de vitrines dinâmicas e personalizadas através de uma interface **No-Code**, eliminando a dependência técnica para ajustes de design e catálogo.

---

## 🚀 Diferenciais do Projeto

* **Arquitetura Híbrida:** Backend robusto em Laravel (PHP 8+) e Frontend reativo em React.js.
* **Editor No-Code (Page Builder):** Sistema de blocos flexíveis (`FlexSections`) que permite arrastar, soltar e personalizar componentes em tempo real.
* **Persistência via JSON Schemas:** Layouts complexos salvos em estruturas JSON dinâmicas, permitindo flexibilidade total de design sem a necessidade de alterar o esquema do banco de dados a cada novo componente.

---

## 🛠️ Stack Técnica

### **Backend**
* **Framework:** Laravel 10/11
* **Linguagem:** PHP 8.x
* **Banco de Dados:** MySQL

### **Frontend**
* **Biblioteca:** React.js
* **Estilização:** Tailwind CSS (Classes dinâmicas e utilitárias).
* **Componentes de UI:** Lucide React (Ícones) e React-Rnd (Drag, Drop & Resize).
* **Gerenciamento de Estado:** React Hooks (`useState`, `useEffect`, `useMemo`).

---

## 📖 Estrutura do Sistema

### 1. Vitrine (Página do Cliente)
Interface focada em conversão e performance, totalmente responsiva.
* **Hero Sections:** Banners de alto impacto com chamadas para ação (CTA).
* **Grids de Produtos:** Exposição inteligente com suporte a busca automática (por categoria/limite) ou seleção manual de IDs.
* **Navegação Mobile-First:** Otimizada para uma experiência fluida em smartphones.

### 2. Painel Administrativo (Modo Edição)
Um ambiente de design intuitivo para o empreendedor gerir sua marca:
* **Sidebar Dinâmica:** Controle total sobre tipografia, cores, arredondamento de bordas e espaçamentos (gaps).
* **Live Preview:** Alternância de *breakpoints* para simular Desktop, Tablet e Mobile instantaneamente.
* **Gestão de Inventário:** Cadastro de produtos com lógica de preços promocionais e controle de status (Ativo/Inativo).

---

## ⚙️ Fluxo de Renderização Dinâmica

O sistema utiliza um fluxo de **Hidratação de Componentes**:

1.  O Frontend identifica o **Slug** da URL e solicita os dados à API.
2.  O Backend recupera o objeto **JSON** estruturado do banco de dados.
3.  O React percorre este JSON e mapeia cada `type` (ex: `ProductGrid`, `HeroSection`) para seu componente correspondente, injetando as propriedades de estilo e conteúdo em tempo real.

```json
{
  "type": "ProductGrid",
  "title": "Nossos Boxes Exclusivos",
  "style": {
    "columns": 4,
    "gap": "24px",
    "titleColor": "#1e293b"
  },
  "produtos": []
}