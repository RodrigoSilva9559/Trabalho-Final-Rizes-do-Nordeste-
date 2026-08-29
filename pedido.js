document.addEventListener('DOMContentLoaded', () => {
    // Trava de segurança: Redireciona se o carrinho estiver vazio
    const carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio! Adicione produtos do cardápio primeiro.');
        window.location.href = 'cardapio.html';
        return;
    }

    carregarFidelidade();
    calcularResumoPedido();
    preencherEnderecoUsuario();
});

function getDadosTaxaEEntrega() {
    const unidade = localStorage.getItem('unidadeSelecionada') || 'Camaquã';
    if (unidade === 'Pelotas') return { taxa: 7.00, tempo: '35 - 45 minutos' };
    if (unidade === 'Porto Alegre') return { taxa: 9.00, tempo: '45 - 60 minutos' };
    return { taxa: 5.00, tempo: '30 - 40 minutos' }; // Camaquã
}

function preencherEnderecoUsuario() {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (!usuarioSalvo) return;

    try {
        const usuario = JSON.parse(usuarioSalvo);
        if (usuario.nome) document.getElementById('nome').value = usuario.nome;
        if (usuario.cep) document.getElementById('cep').value = usuario.cep;
        if (usuario.rua) document.getElementById('rua').value = usuario.rua;
        if (usuario.numero) document.getElementById('numero').value = usuario.numero;
        if (usuario.complemento) document.getElementById('complemento').value = usuario.complemento;
        if (usuario.bairro) document.getElementById('bairro').value = usuario.bairro;
        if (usuario.cidade) document.getElementById('cidade').value = usuario.cidade;
    } catch (e) {
        console.error('Erro ao carregar dados do usuário:', e);
    }
}

function carregarFidelidade() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    let pontos = 0;

    if (usuarioLogado) {
        pontos = usuarioLogado.pontos ?? usuarioLogado.pontosFidelidade ?? parseInt(localStorage.getItem('pontosFidelidade')) ?? 0;
    } else {
        pontos = parseInt(localStorage.getItem('pontosFidelidade')) || 0;
    }

    const elSaldo = document.getElementById('exibicao_saldo');
    const containerResgate = document.getElementById('container_resgate');

    if (elSaldo) {
        elSaldo.innerHTML = `Você possui <strong>${pontos}</strong> Pontos Fidelidade`;
    }

    if (containerResgate) {
        containerResgate.style.display = pontos >= 100 ? 'block' : 'none';
    }
}

function calcularResumoPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
    const containerProdutos = document.getElementById('lista_resumo_produtos');
    const { taxa: taxaEntrega } = getDadosTaxaEEntrega();
    let subtotal = 0;

    if (containerProdutos) {
        let htmlProdutos = '';
        carrinho.forEach(item => {
            const totalItem = item.preco * item.quantidade;
            subtotal += totalItem;
            htmlProdutos += `
                <div class="produto_resumo">
                    <div>
                        <strong>${item.nome}</strong>
                        <span>${item.quantidade}x</span>
                    </div>
                    <strong>R$ ${totalItem.toFixed(2).replace('.', ',')}</strong>
                </div>
            `;
        });
        containerProdutos.innerHTML = htmlProdutos;
    }

    let desconto = 0;
    const chkPontos = document.getElementById('chk_resgatar_pontos');

    if (chkPontos && chkPontos.checked) {
        desconto = 10.00;
    }

    const totalFinal = Math.max(0, subtotal + taxaEntrega - desconto);

    const elSubtotal = document.getElementById('subtotal_valor');
    const elTaxa = document.getElementById('taxa_entrega_valor');
    const elTotal = document.getElementById('valor_total');

    if (elSubtotal) elSubtotal.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (elTaxa) elTaxa.innerText = `R$ ${taxaEntrega.toFixed(2).replace('.', ',')}`;
    if (elTotal) elTotal.innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}

function confirmarPedido(event) {
    if (event) event.preventDefault();

    const carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];

    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        window.location.href = 'cardapio.html';
        return;
    }

    const formaPagamento = document.querySelector('input[name="pagamento"]:checked')?.value;

    if (!formaPagamento) {
        alert('Por favor, selecione uma forma de pagamento.');
        return;
    }

    let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || {};
    usuarioLogado.nome = document.getElementById('nome').value;
    usuarioLogado.cep = document.getElementById('cep').value;
    usuarioLogado.rua = document.getElementById('rua').value;
    usuarioLogado.numero = document.getElementById('numero').value;
    usuarioLogado.complemento = document.getElementById('complemento').value;
    usuarioLogado.bairro = document.getElementById('bairro').value;
    usuarioLogado.cidade = document.getElementById('cidade').value;

    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    if (formaPagamento === 'pix') {
        processarPagamentoPix();
    } else if (formaPagamento === 'credito' || formaPagamento === 'debito') {
        abrirModalCartao();
    } else if (formaPagamento === 'dinheiro') {
        alert('Pedido confirmado! O pagamento em dinheiro deverá ser feito na entrega.');
        finalizarProcessamentoPedido();
    }
}

function processarPagamentoPix() {
    const modalPix = document.getElementById('modal_pix');
    const statusPendente = document.getElementById('status_pix_pendente');
    const statusSucesso = document.getElementById('status_pix_sucesso');

    if (statusPendente) statusPendente.style.display = 'block';
    if (statusSucesso) statusSucesso.style.display = 'none';
    if (modalPix) modalPix.style.display = 'flex';

    setTimeout(() => {
        if (statusPendente) statusPendente.style.display = 'none';
        if (statusSucesso) statusSucesso.style.display = 'block';

        setTimeout(() => {
            if (modalPix) modalPix.style.display = 'none';
            finalizarProcessamentoPedido();
        }, 2000);
    }, 5000);
}

function abrirModalCartao() {
    const modalCartao = document.getElementById('modal_cartao');
    const formCartao = document.getElementById('status_cartao_form');
    const statusPendente = document.getElementById('status_cartao_pendente');
    const statusSucesso = document.getElementById('status_cartao_sucesso');

    if (formCartao) formCartao.style.display = 'block';
    if (statusPendente) statusPendente.style.display = 'none';
    if (statusSucesso) statusSucesso.style.display = 'none';
    if (modalCartao) modalCartao.style.display = 'flex';
}

function fecharModalCartao() {
    const modalCartao = document.getElementById('modal_cartao');
    if (modalCartao) modalCartao.style.display = 'none';
}

function processarPagamentoCartao(event) {
    if (event) event.preventDefault();

    const formCartao = document.getElementById('status_cartao_form');
    const statusPendente = document.getElementById('status_cartao_pendente');
    const statusSucesso = document.getElementById('status_cartao_sucesso');

    if (formCartao) formCartao.style.display = 'none';
    if (statusPendente) statusPendente.style.display = 'block';

    setTimeout(() => {
        if (statusPendente) statusPendente.style.display = 'none';
        if (statusSucesso) statusSucesso.style.display = 'block';

        setTimeout(() => {
            fecharModalCartao();
            finalizarProcessamentoPedido();
        }, 2000);
    }, 5000);
}

function finalizarProcessamentoPedido() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
    let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || {};
    const unidade = localStorage.getItem('unidadeSelecionada') || 'Camaquã';
    const { taxa: taxaEntrega, tempo: tempoEstimado } = getDadosTaxaEEntrega();

    let ultimoNumero = parseInt(localStorage.getItem('ultimoNumeroPedido')) || 1000;
    let numeroPedidoAtual = ultimoNumero + 1;
    localStorage.setItem('ultimoNumeroPedido', numeroPedidoAtual);

    let subtotal = 0;
    carrinho.forEach(item => subtotal += item.preco * item.quantidade);
    const totalPedido = subtotal + taxaEntrega;

    const pontosGanhos = Math.floor(subtotal);
    let pontosAtuais = usuarioLogado.pontos ?? usuarioLogado.pontosFidelidade ?? 0;
    pontosAtuais += pontosGanhos;

    usuarioLogado.pontos = pontosAtuais;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));

    const novoPedido = {
        numero: numeroPedidoAtual,
        unidade: unidade,
        tempoEstimado: tempoEstimado,
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        itens: carrinho,
        total: totalPedido,
        formaPagamento: document.querySelector('input[name="pagamento"]:checked')?.value || 'dinheiro',
        pontosGanhos: pontosGanhos
    };

    let historicoPedidos = JSON.parse(localStorage.getItem(`pedidos_${usuarioLogado.email || 'guest'}`)) || [];
    historicoPedidos.unshift(novoPedido);
    localStorage.setItem(`pedidos_${usuarioLogado.email || 'guest'}`, JSON.stringify(historicoPedidos));

    localStorage.setItem('ultimoPedidoConfirmado', JSON.stringify(novoPedido));
    localStorage.removeItem('carrinhoRaizes');

    window.location.href = 'pedido_confirmado.html';
}