<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VaralAuto - Carrinho</title>
  <link rel="stylesheet" href="style.css">
  <script defer src="script.js"></script>
</head>
<body>

<header>
  <div class="container">
    <div class="logo">VaralAuto</div>
    <nav>
      <a href="index.html">Produtos</a>
      <a href="sobre.html">Sobre</a>
      <a href="contato.html">Contato</a>
      <a href="carrinho.html">Carrinho</a>
    </nav>
  </div>
</header>

<main>
  <section id="carrinho">
    <h2>Seu Carrinho</h2>
    <div class="carrinho-lista" id="listaCarrinho">Nenhum item adicionado.</div>
    <div class="total" id="totalCarrinho">Total: R$ 0,00</div>

    <h3>Finalizar Compra</h3>
    <form id="formCompra">
      <label>Nome Completo:
        <input type="text" id="nome" required>
      </label>
      <label>CPF:
        <input type="text" id="cpf" required placeholder="000.000.000-00">
      </label>
      <label>Endereço:
        <input type="text" id="endereco" required placeholder="Rua, número, bairro">
      </label>
      <button class="btn" type="submit">Finalizar Compra</button>
    </form>
    <div id="mensagem"></div>
  </section>
</main>

<footer>
  © 2025 VaralAuto — Sistema de varal automático com sensor de chuva.
</footer>
</body>
</html>
