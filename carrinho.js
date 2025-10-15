// =========================
// CARRINHO DE COMPRAS
// =========================
let cart = JSON.parse(localStorage.getItem('cart_demo') || '[]');

function formatPrice(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}

function saveCart() {
  localStorage.setItem('cart_demo', JSON.stringify(cart));
}

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
  id = Number(id);
  const it = cart.find(c => Number(c.id) === id);
  if (!it) return;
  it.q += delta;
  if (it.q < 1) cart = cart.filter(c => Number(c.id) !== id);
  saveCart();
  renderCart();
}

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

// =========================
// FUNÇÕES GLOBAIS
// =========================
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;

document.addEventListener('DOMContentLoaded', renderCart);
