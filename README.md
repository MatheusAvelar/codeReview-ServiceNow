# 🧩 Code Review - Update Set (ServiceNow)

Uma ferramenta criada para **facilitar e padronizar o processo de revisão de código (Code Review)** em Update Sets dentro do **ServiceNow**.  
Permite listar artefatos de Update Sets, aplicar filtros por tipo e marcar manualmente quais registros passaram ou não passaram na revisão.

---

## 🚀 Funcionalidades

✅ Buscar artefatos de um ou mais **Update Sets** informados  
✅ Filtrar por **tipo de artefato (Type)** e **excluir tipos específicos**  
✅ Exibir informações como:
- Nome do artefato  
- Tipo (`type`)  
- Update Set  
- Aplicativo (`application`)  
✅ Criar link direto para o artefato no ambiente ServiceNow  
✅ Marcar registros como **“Passou”** ou **“Não Passou”**  
✅ Aplicar filtros visuais para exibir apenas os artefatos que passaram ou não passaram  
✅ Contagem total de artefatos retornados  

---

## 🧠 Estrutura do Projeto

O projeto é composto por dois principais arquivos:

### 1️⃣ Script Include — GetUpdateSetArtifacts  
Responsável por consultar a tabela `sys_update_xml` e retornar todos os artefatos de um ou mais Update Sets, aplicando filtros opcionais de tipo (`type`) e tipos a excluir (`notType`).  
O resultado é retornado em formato **JSON** para ser consumido na UI Page.

### 2️⃣ UI Page (Jelly + Client Script)  
Interface construída em **Jelly**, com **Client Script** integrado, permitindo ao usuário buscar, visualizar e filtrar os artefatos retornados pelo Script Include.  
Os resultados são exibidos em uma tabela dinâmica e interativa.

🎨 **Design:**
- Layout moderno e responsivo  
- Cores inspiradas na identidade visual do ServiceNow (verde e cinza)  
- Checkboxes coloridos para feedback visual imediato:
  - ✅ Verde → passou  
  - ❌ Vermelho → não passou  

---

## ⚙️ Como Usar

1. No ServiceNow, crie um novo **Script Include** com o nome `GetUpdateSetArtifacts`  
   - Marque a opção **Client Callable = true**  
2. Crie uma **UI Page**  
   - Cole o conteúdo Jelly fornecido no projeto  
3. Publique e acesse a página através da URL:  
   `https://<sua_instancia>.service-now.com/<nome_ui_page>.do`  
4. Informe um ou mais nomes de Update Sets separados por vírgula  
5. Clique em **Buscar**  
6. Utilize os checkboxes para marcar o resultado dos code reviews  

---

## 🧩 Exemplo de Uso

### Entrada:
- Update Sets: `Update_Set_API`, `Update_Set_UI`  
- Type: `Script Include`  
- Not Type: `UI Action`  

### Saída esperada:
Tabela contendo os artefatos encontrados, com as colunas:
- Nome  
- Type  
- Update Set  
- Application  
- Passou / Não Passou  

---

## 📊 Demonstração Visual

| Exemplo de Tela |
|------------------|
| ![preview](https://inovacodigo.com.br/camila/images.png) |

---

## 👩‍💻 Tecnologias Usadas

- **ServiceNow Platform**  
- **Jelly**  
- **GlideAjax**  
- **JavaScript (Client Script)**  
- **HTML/CSS**

---

## 💡 Autor

👨‍💻 **Matheus Avelar**  
Desenvolvedor ServiceNow & Web Developer  
🔗 [LinkedIn](https://www.linkedin.com/in/matheusavelar)

---

## 🧾 Licença

Este projeto é de uso interno e educacional.  
Você pode adaptá-lo livremente para suas necessidades em outras instâncias ServiceNow.
