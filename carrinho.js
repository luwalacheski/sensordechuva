// =========================
// CARRINHO DE COMPRAS
// =========================

// Estado inicial do carrinho
let cart = JSON.parse(localStorage.getItem('cart_demo') || '[]');

// Produtos disponíveis para teste
const products = [
  { id: 1, name: 'Produto A', price: 49.90 },
  { id: 2, name: 'Produto B', price: 29.90 },
  { id: 3, name: 'Produto C', price: 19.90 },
  { id: 4, name: 'Produto D', price: 99.90 }
];

// Formata valores em reais
function formatPrice(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}

// Salva o carrinho no localStorage
function saveCart() {
  localStorage.setItem('cart_demo', JSON.stringify(cart));
}

// Renderiza produtos disponíveis
function renderProducts() {
  const productListEl = document.getElementById('product-list');
  if (!productListEl) return;

  productListEl.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div style="font-weight:600">${p.name}</div>
      <div>${formatPrice(p.price)}</div>
      <button class="btn" onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
    `;
    productListEl.appendChild(card);
  });
}

// Adiciona produto ao carrinho
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.q++;
  } else {
    cart.push({ ...product, q: 1 });
  }

  saveCart();
  renderCart();
}

// Renderiza o carrinho
function renderCart() {
  const cartListEl = document.getElementById('cart-list');
  const cartTotalEl = document.getElementById('cart-total');
  if (!cartListEl || !cartTotalEl) return;

  cartListEl.innerHTML = '';

  if (cart.length === 0) {
    cartListEl.innerHTML = '<div class="small">Carrinho vazio</div>';
    cartTotalEl.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.q;

    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div>
        <div style="font-weight:600">${item.name}</div>
        <div class="small">${item.q} x ${formatPrice(item.price)}</div>
      </div>
      <div style="text-align:right">
        <div style="margin-bottom:6px">${formatPrice(item.price * item.q)}</div>
        <div>
          <button class="btn ghost" onclick="changeQty(${item.id}, -1)">-</button>
          <button class="btn ghost" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="btn ghost" onclick="removeFromCart(${item.id})">Remover</button>
        </div>
      </div>
    `;
    cartListEl.appendChild(row);
  });

  cartTotalEl.textContent = formatPrice(total);
}

// Alterar quantidade
function changeQty(id, delta) {
  id = Number(id);
  const it = cart.find(c => Number(c.id) === id);
  if (!it) return;

  it.q += delta;
  if (it.q < 1) cart = cart.filter(c => Number(c.id) !== id);

  saveCart();
  renderCart();
}

// Remover item
function removeFromCart(id) {
  id = Number(id);
  cart = cart.filter(c => Number(c.id) !== id);
  saveCart();
  renderCart();
}

// =========================
// CHECKOUT
// =========================

const checkoutForm = document.getElementById('checkout-form');

if (checkoutForm) {
  checkoutForm.addEventListener('submit', ev => {
    ev.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const cep = document.getElementById('cep').value.trim();

    if (!nome || !cpf || !telefone || !endereco || !cidade || !cep) {
      alert('Preencha todos os campos.');
      return;
    }

    if (cart.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const order = {
      id: 'ORD-' + Date.now(),
      customer: { nome, cpf, telefone, endereco, cidade, cep },
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.q, 0),
      date: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('orders_demo') || '[]');
    orders.push(order);
    localStorage.setItem('orders_demo', JSON.stringify(orders));

    // Limpa carrinho
    cart = [];
    saveCart();
    renderCart();

    // Mensagem de sucesso
    const result = document.getElementById('order-result');
    if (result) {
      result.innerHTML = `
        <div>
          Obrigado pela preferência!<br>
          Pedido finalizado.<br>
          ID do pedido: ${order.id}<br>
          Total: ${formatPrice(order.total)}
        </div>`;
    }
  });
}

// =========================
// FUNÇÕES GLOBAIS
// =========================
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.addToCart = addToCart;

// Inicializa renderização ao carregar
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
});
