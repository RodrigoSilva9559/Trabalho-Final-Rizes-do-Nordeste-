document.addEventListener('DOMContentLoaded', () => {
    carregarDadosUsuario();
    atualizarExibicaoPerfil();
    carregarHistoricoPedidos();
});

// 1. Carrega os dados cadastrais do usuário logado
function carregarDadosUsuario() {
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioSalvo) {
        const elNome = document.getElementById('perfil_nome');
        const elEmail = document.getElementById('perfil_email');
        const elCelular = document.getElementById('perfil_celular');

        if (elNome && usuarioSalvo.nome) elNome.innerText = usuarioSalvo.nome;
        if (elEmail && usuarioSalvo.email) elEmail.innerText = usuarioSalvo.email;
        if (elCelular && usuarioSalvo.celular) elCelular.innerText = usuarioSalvo.celular;
    }
}

// 2. Atualiza a pontuação e barra de fidelidade
function atualizarExibicaoPerfil() {
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    let pontos = 0;
    if (usuarioSalvo) {
        pontos = usuarioSalvo.pontos ?? usuarioSalvo.pontosFidelidade ?? parseInt(localStorage.getItem('pontosFidelidade')) ?? 0;
    } else {
        pontos = parseInt(localStorage.getItem('pontosFidelidade')) || 0;
    }

    const elPontos = document.getElementById('saldo_pontos_perfil');
    const elBarra = document.getElementById('barra_progresso_fidelidade');
    const elTextoMetas = document.getElementById('texto_metas_pontos');

    if (elPontos) {
        elPontos.innerText = `${pontos} pontos`;
    }

    const metaPontos = 200;
    const porcentagem = Math.min((pontos / metaPontos) * 100, 100);

    if (elBarra) {
        elBarra.style.width = `${porcentagem}%`;
    }

    if (elTextoMetas) {
        elTextoMetas.innerText = `${pontos} / ${metaPontos} pontos`;
    }
}

// 3. Conta e exibe todos os pedidos do usuário
function carregarHistoricoPedidos() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || {};
    const chavePedidos = `pedidos_${usuarioLogado.email || 'guest'}`;
    const historicoPedidos = JSON.parse(localStorage.getItem(chavePedidos)) || [];

    const elContador = document.getElementById('total_pedidos_contador');
    const containerLista = document.getElementById('lista_pedidos_usuario');

    // Atualiza a contagem total de pedidos
    if (elContador) {
        elContador.innerText = historicoPedidos.length;
    }

    if (!containerLista) return;

    if (historicoPedidos.length === 0) {
        containerLista.innerHTML = '<p class="sem_pedidos">Você ainda não realizou nenhum pedido.</p>';
        return;
    }

    // Renderiza cada pedido salvo
    let htmlContent = '';
    historicoPedidos.forEach(pedido => {
        let itensHTML = '';
        if (pedido.itens && Array.isArray(pedido.itens)) {
            pedido.itens.forEach(item => {
                itensHTML += `<li>${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</li>`;
            });
        }

        htmlContent += `
            <div class="card_pedido" style="border: 1px solid #e0e0e0; padding: 15px; border-radius: 8px; margin-bottom: 15px; background: #fff; text-align: left;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                    <strong>🍔 Pedido #${pedido.numero}</strong>
                    <span style="font-size: 13px; color: #666;">📅 ${pedido.data} às ${pedido.hora}</span>
                </div>
                
                <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px; color: #444;">
                    ${itensHTML}
                </ul>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 8px; font-size: 14px;">
                    <span>Pagamento: <strong>${(pedido.formaPagamento || 'DINHEIRO').toUpperCase()}</strong></span>
                    <strong style="color: #d05714; font-size: 16px;">Total: R$ ${(pedido.total || 0).toFixed(2).replace('.', ',')}</strong>
                </div>
            </div>
        `;
    });

    containerLista.innerHTML = htmlContent;
}

// 4. Logout do usuário
function fazerLogout() {
    if (confirm("Deseja realmente sair da sua conta?")) {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login_cadastro.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const elementoTitulo = document.getElementById('titulo_nome_usuario');

    if (elementoTitulo) {
        if (usuarioLogado && usuarioLogado.nome) {
            const primeiroNome = usuarioLogado.nome.split(' ')[0];
            elementoTitulo.innerText = `Bem-Vindo, Sr(a) ${primeiroNome}!`;
        } else {
            elementoTitulo.innerText = 'MEU PERFIL';
        }
    }
});