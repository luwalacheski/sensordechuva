// =========================
// PRODUTOS DISPONÍVEIS
// =========================
const products = [
  {
    id: 1,
    name: "VaralAuto Compact",
    price: 249.90,
    description: "Módulo sensor de chuva FC-37, detecta gotas de água e aciona sistemas automáticos.",
    image: "images/varalauto-compact.png"
  },
  {
    id: 2,
    name: "VaralAuto Pro",
    price: 399.90,
    description: "Sensor de chuva com Arduino Nano, display LCD e buzzer para alertas.",
    image: "images/varalauto-pro.png"
  },
  {
    id: 3,
    name: "Kit DIY (sensor + código)",
    price: 99.90,
    description: "Sistema completo com Arduino Uno, relé e sensor FC-37, ideal para projetos domésticos.",
    image: "images/kit-diy.png"
  }
];

// =========================
// CARRINHO
// =========================
let cart = JSON.parse(localStorage.getItem('cart_demo') || '[]');

function formatPrice(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}

function saveCart() {
  localStorage.setItem('cart_demo', JSON.stringify(cart));
}

// =========================
// RENDERIZA PRODUTOS NA PÁGINA PRINCIPAL
// =========================
function renderProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="price">${formatPrice(p.price)}</div>
      <button class="btn" onclick="addToCart(${p.id})">Adicionar</button>
    `;
    container.appendChild(card);
  });
}

// =========================
// ADICIONAR PRODUTO AO CARRINHO
// =========================
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
  alert(`${product.name} adicionado ao carrinho!`);
}

// =========================
// FUNÇÕES GLOBAIS PARA O CHECKOUT
// =========================
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

function changeQty(id, delta) {
  const it = cart.find(c => c.id === id);
  if (!it) return;
  it.q += delta;
  if (it.q < 1) cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
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
      total: cart.reduce((s,i)=>s+i.price*i.q,0),
      date: new Date().toISOString()
    };
    const orders = JSON.parse(localStorage.getItem('orders_demo')||'[]');
    orders.push(order);
    localStorage.setItem('orders_demo', JSON.stringify(orders));

    cart = [];
    saveCart();
    renderCart();

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

// Inicializa produtos e carrinho
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
});

// Expõe funções globais
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
