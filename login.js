document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelector('.caixa_esquerda') || document.querySelector('form');

    if (formLogin) {
        formLogin.addEventListener('submit', solicitarAceiteLGPD);
    }

    configurarMonitoramentoRolagemLGPD();
});

let usuarioPendenteLogin = null;

function solicitarAceiteLGPD(event) {
    event.preventDefault();

    const emailDigitado = document.getElementById('email_login')?.value.trim();
    const senhaDigitada = document.getElementById('senha_login')?.value;

    if (!emailDigitado || !senhaDigitada) {
        alert('Por favor, preencha e-mail e senha.');
        return;
    }

    const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = usuariosCadastrados.find(
        user => user.email === emailDigitado && user.senha === senhaDigitada
    );

    if (usuarioEncontrado) {
        if (usuarioEncontrado.aceitouLGPD) {
            concluirLogin(usuarioEncontrado);
        } else {
            usuarioPendenteLogin = usuarioEncontrado;
            
            const modal = document.getElementById('modal_lgpd');
            const caixaTexto = document.getElementById('caixa_texto_lgpd');
            const btnAceitar = document.getElementById('btn_aceitar_lgpd');

            if (modal) {
                modal.style.display = 'flex';
                
                if (caixaTexto && btnAceitar && caixaTexto.scrollHeight <= caixaTexto.clientHeight) {
                    btnAceitar.disabled = false;
                }
            } else {
                concluirLogin(usuarioEncontrado);
            }
        }
    } else {
        alert('E-mail ou senha incorretos.');
    }
}

function configurarMonitoramentoRolagemLGPD() {
    const caixaTexto = document.getElementById('caixa_texto_lgpd');
    const btnAceitar = document.getElementById('btn_aceitar_lgpd');

    if (caixaTexto && btnAceitar) {
        caixaTexto.addEventListener('scroll', () => {
            const chegouAoFim = (caixaTexto.scrollTop + caixaTexto.clientHeight) >= (caixaTexto.scrollHeight - 15);
            
            if (chegouAoFim) {
                btnAceitar.disabled = false;
            }
        });

        btnAceitar.addEventListener('click', () => {
            if (usuarioPendenteLogin) {
                let usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];
                
                usuariosCadastrados = usuariosCadastrados.map(user => {
                    if (user.email === usuarioPendenteLogin.email) {
                        return { 
                            ...user, 
                            aceitouLGPD: true, 
                            dataAceiteLGPD: new Date().toISOString() 
                        };
                    }
                    return user;
                });

                localStorage.setItem('usuarios', JSON.stringify(usuariosCadastrados));
                usuarioPendenteLogin.aceitouLGPD = true;
                
                concluirLogin(usuarioPendenteLogin);
            }
        });
    }
}

function concluirLogin(usuario) {
    // Garante inicialização da propriedade 'pontos' caso não exista no objeto
    if (usuario.pontos === undefined && usuario.pontosFidelidade === undefined) {
        usuario.pontos = 0;
    }

    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    
    const primeiroNome = usuario.nome ? usuario.nome.split(' ')[0] : 'Usuário';
    alert(`Bem-vindo(a) de volta, ${primeiroNome}!`);
    
    window.location.href = 'index.html';
}