document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
});

function renderizarCarrinho() {
    const containerCarrinho = document.getElementById('lista_carrinho');
    const containerSubtotal = document.getElementById('subtotal_valor');
    const containerTotal = document.getElementById('valor_total');
    let carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];

    if (!containerCarrinho) return;

    if (carrinho.length === 0) {
        containerCarrinho.innerHTML = `<h2>Seus produtos</h2><p class="carrinho_vazio">Seu carrinho está vazio</p>`;
        if (containerSubtotal) containerSubtotal.innerText = 'R$ 0,00';
        if (containerTotal) containerTotal.innerText = 'R$ 0,00';
        return;
    }

    let html = '<h2>Seus produtos</h2>';
    let subtotalGeral = 0;
    const taxaEntrega = 5.00;

    carrinho.forEach((item, index) => {
        const subtotalItem = item.preco * item.quantidade;
        subtotalGeral += subtotalItem;

        html += `
        <div class="produto_carrinho">
            <div class="produto_imagem">
                <img src="${item.imagem}" alt="${item.nome}">
            </div>
            <div class="produto_info">
                <h3>${item.nome}</h3>
                <strong class="preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</strong>
            </div>
            <div class="quantidade">
                <button type="button" class="btn_menos" onclick="alterarQuantidade(${index}, -1)">−</button>
                <span class="qtd_num">${item.quantidade}</span>
                <button type="button" class="btn_mais" onclick="alterarQuantidade(${index}, 1)">+</button>
            </div>
            <button type="button" class="remover" onclick="removerItem(${index})" title="Remover item">🗑️</button>
        </div>
        `;
    });

    containerCarrinho.innerHTML = html;

    const totalGeral = subtotalGeral + taxaEntrega;

    if (containerSubtotal) {
        containerSubtotal.innerText = `R$ ${subtotalGeral.toFixed(2).replace('.', ',')}`;
    }
    if (containerTotal) {
        containerTotal.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    }
}

function alterarQuantidade(index, mudanca) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];

    carrinho[index].quantidade += mudanca;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    localStorage.setItem('carrinhoRaizes', JSON.stringify(carrinho));
    renderizarCarrinho();

    if (typeof atualizarContadorCarrinho === 'function') {
        atualizarContadorCarrinho();
    }
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
    carrinho.splice(index, 1);

    localStorage.setItem('carrinhoRaizes', JSON.stringify(carrinho));
    renderizarCarrinho();

    if (typeof atualizarContadorCarrinho === 'function') {
        atualizarContadorCarrinho();
    }
}

// Bloqueia e redireciona se o carrinho estiver vazio ao tentar ir para o pedido
function irParaCheckout(event) {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];

    if (carrinho.length === 0) {
        if (event) event.preventDefault();
        alert('Seu carrinho está vazio! Adicione itens do cardápio para continuar.');
        window.location.href = 'cardapio.html';
        return false;
    }

    window.location.href = 'pedido.html';
}