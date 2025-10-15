// ======== JAVASCRIPT DO CARRINHO ========
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
const listaCarrinho = document.getElementById("listaCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const mensagem = document.getElementById("mensagem");

function adicionarCarrinho(nome, preco) {
  carrinho.push({ nome, preco });
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  alert(`${nome} adicionado ao carrinho!`);
}

function atualizarCarrinho() {
  if (!listaCarrinho) return; // Só roda na página de carrinho
  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = "Nenhum item adicionado.";
    totalCarrinho.innerText = "Total: R$ 0,00";
    return;
  }

  listaCarrinho.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, index) => {
    total += item.preco;
    const div = document.createElement("div");
    div.classList.add("item-carrinho");
    div.innerHTML = `
      <span>${item.nome}</span>
      <span>R$ ${item.preco.toFixed(2)} 
      <button class="btn" style="padding:4px 8px; font-size:12px;" onclick="removerItem(${index})">Remover</button></span>
    `;
    listaCarrinho.appendChild(div);
  });
  totalCarrinho.innerText = "Total: R$ " + total.toFixed(2);
}

function removerItem(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

if (document.getElementById("formCompra")) {
  document.getElementById("formCompra").addEventListener("submit", function(e) {
    e.preventDefault();
    if (carrinho.length === 0) {
      alert("Adicione pelo menos um item ao carrinho!");
      return;
    }
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const endereco = document.getElementById("endereco").value;

    mensagem.innerHTML = `<p style="color:#047857; font-weight:bold;">Obrigado, ${nome}! Sua compra foi finalizada.<br>Enviaremos para ${endereco}.</p>`;
    carrinho = [];
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
    this.reset();
  });
}

if (listaCarrinho) atualizarCarrinho();
