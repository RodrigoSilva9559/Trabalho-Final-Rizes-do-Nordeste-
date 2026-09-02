document.addEventListener('DOMContentLoaded', () => {
    carregarDadosPedido();
    iniciarSimulacaoStatus();
});

function carregarDadosPedido() {
    const ultimoPedido = JSON.parse(localStorage.getItem('ultimoPedidoConfirmado'));
    const elNumero = document.getElementById('exibicao_numero_pedido');
    const elCaixaPontos = document.getElementById('caixa_pontos_confirmado');
    const elMsgPontos = document.getElementById('msg_pontos_ganhos');
    
    const elUnidade = document.getElementById('exibicao_unidade_pedido');
    const elTempo = document.getElementById('exibicao_tempo_pedido');

    if (ultimoPedido) {
        if (elNumero) {
            elNumero.innerText = `#${ultimoPedido.numero}`;
        }

        if (elUnidade) {
            elUnidade.innerText = ultimoPedido.unidade || 'Camaquã';
        }

        if (elTempo) {
            elTempo.innerText = ultimoPedido.tempoEstimado || '40 - 50 minutos';
        }

        if (ultimoPedido.pontosGanhos > 0 && elCaixaPontos && elMsgPontos) {
            elCaixaPontos.style.display = 'block';
            elMsgPontos.innerText = `Você acumulou +${ultimoPedido.pontosGanhos} pontos fidelidade com este pedido!`;
        }
    }
}

function iniciarSimulacaoStatus() {
    const etapas = document.querySelectorAll('.status_pedido .etapa');
    const linhas = document.querySelectorAll('.status_pedido .linha');

    if (etapas.length < 4) return;

    const ativarEtapa = (index) => {
        if (etapas[index]) {
            etapas[index].classList.add('ativa');
            const bolinha = etapas[index].querySelector('.bolinha');
            if (bolinha) bolinha.innerText = '✓';
        }
        if (linhas[index - 1]) {
            linhas[index - 1].classList.add('ativa');
        }
    };

    setTimeout(() => {
        ativarEtapa(1);
    }, 5000);

    setTimeout(() => {
        ativarEtapa(2);
    }, 10000);

    setTimeout(() => {
        ativarEtapa(3);
    }, 15000);
}