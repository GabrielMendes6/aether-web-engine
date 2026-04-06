# 📦 SystemBox: Sistema de Autogestão e Catálogo Digital

O **SystemBox** é uma plataforma de Gerenciamento de Conteúdo (CMS) e Catálogo Digital de alta performance, desenvolvida para transformar pequenos empreendedores em negócios digitais profissionais. Através de uma interface **No-Code**, o sistema permite que o usuário gerencie sua vitrine e produtos com total autonomia, sem a necessidade de conhecimento técnico em programação.

---

## 🚀 Diferenciais Técnicos

### 🏗️ Infraestrutura Moderna (Docker & Redis)
O projeto foi concebido para ser escalável e fácil de distribuir:
* **Docker & Docker Compose:** Todo o ambiente (Aplicação, Banco de Dados e Cache) é conteinerizado, garantindo que o sistema rode de forma idêntica em qualquer servidor.
* **Redis Cache:** Utilizado para armazenar as estruturas das páginas e sessões em memória, garantindo um carregamento de página ultra-rápido para o cliente final e reduzindo a carga no banco de dados MySQL.

### 🎨 Editor No-Code (Page Builder)
Diferente de catálogos estáticos, o SystemBox oferece um editor visual em tempo real:
* **FlexSection Architecture:** Sistema de blocos arrastáveis e redimensionáveis.
* **Live Preview:** O administrador visualiza as alterações de cores, gaps, arredondamentos e tipografia instantaneamente antes de salvar.
* **Responsividade Nativa:** Toggle de visualização para Mobile, Tablet e Desktop integrado ao editor.

### 🔐 Segurança e Performance
* **Sanitização de Dados:** Implementação de *Traits* no Laravel que limpam automaticamente qualquer entrada de texto, protegendo o sistema contra ataques de XSS (Cross-Site Scripting).
* **JSON Schemas:** A "receita" de cada página é salva em formato JSON dinâmico, permitindo flexibilidade total de layout sem alterações estruturais no banco de dados.

---

## 🛠️ Stack Tecnológica

* **Backend:** Laravel 10/11 (PHP 8.x)
* **Frontend:** React.js + Tailwind CSS
* **Banco de Dados:** MySQL 8
* **Cache/Sessão:** Redis
* **Containerização:** Docker & Docker Compose
* **UI/UX:** Lucide React (Ícones) & React-Rnd (Drag & Resize)

---

## 📖 Estrutura de Rotas

O sistema separa estritamente o ambiente de consumo do ambiente de gestão para garantir performance e segurança:

* **Página Principal (`/home`):** Interface de visualização do cliente. Otimizada para SEO e velocidade, consumindo dados preferencialmente do cache.
* **Modo Edição (`admin/editor/home`):** Rota protegida por autenticação. Apenas administradores acessam as ferramentas de manipulação de componentes e salvamento de configurações.

---

## ⚙️ Fluxo de Funcionamento

1.  **Requisição:** O cliente acessa a URL.
2.  **Cache Check:** O Laravel verifica no **Redis** se a estrutura daquela página já está processada.
3.  **Hidratação:** O React recebe o JSON de configuração e "monta" os componentes dinamicamente na tela.
4.  **Sincronização:** O componente `ProductGrid` identifica se deve buscar produtos automaticamente (por categoria) ou exibir uma lista manual selecionada pelo admin.

---

## 👥 Público-Alvo e Contexto

Este projeto foi desenvolvido como parte do **Hands On Work V** para atender ao empreendimento de **Hericksson Djeimer (Brusque-SC)**. O foco inicial é o mercado de **Box de Presentes**, provendo uma base tecnológica sólida para que o negócio inicie suas operações de forma profissional e escalável.

---

## 👨‍💻 Desenvolvedor
* **Gabriel Mendes Gonçalves**
* Projeto de Extensão - UNIVALI 2026.1
---