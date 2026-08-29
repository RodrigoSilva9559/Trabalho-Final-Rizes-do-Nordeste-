/* ================= EVENTOS GLOBAIS ================= */
document.addEventListener('DOMContentLoaded', () => {

    /* Menu Mobile */
    const btnMenuMobile = document.querySelector('.menu-mobile');
    const nav = document.querySelector('nav');

    if (btnMenuMobile && nav) {
        btnMenuMobile.addEventListener('click', () => {
            nav.classList.toggle('ativo');
        });
    }

    /* Seletor de Unidade */
    const selectUnidade = document.querySelector('.complemento_titulo select');

    if (selectUnidade) {
        const unidadeSalva = localStorage.getItem('unidadeSelecionada') || 'Camaquã';
        selectUnidade.value = unidadeSalva;

        selectUnidade.addEventListener('change', (e) => {
            localStorage.setItem('unidadeSelecionada', e.target.value);
            // Recarrega a página ao alterar para atualizar os preços na tela
            window.location.reload();
        });
    }

    /* Header Fixo na Rolagem */
    const header = document.querySelector('header.cabecalho_site');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('rolado');
            } else {
                header.classList.remove('rolado');
            }
        });
    }

    atualizarContadorCarrinho();
    renderizarMaisVendidosHome();
    atualizarNomeUsuarioHeader();
    atualizarQuadrosFidelidade();
});

/* Função Auxiliar Global: Obtém acréscimo com base na unidade */
function getAcrescimoUnidade() {
    const unidade = localStorage.getItem('unidadeSelecionada') || 'Camaquã';
    if (unidade === 'Pelotas') return 2.00;
    if (unidade === 'Porto Alegre') return 5.00;
    return 0.00;
}

/* ================= CONTADOR DO CARRINHO ================= */
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    const elementoContador = document.querySelector('.carrinho_usuario .itens p');
    if (elementoContador) {
        elementoContador.innerText = `Meu Carrinho (${totalItens})`;
    }
}

/* ================= SLIDER / CARROSSEL DA HOME ================= */
let slideAtual = 0;
const slides = document.querySelectorAll(".slide");
const pontos = document.querySelectorAll(".ponto");

function mostrarSlide(numero) {
    if (slides.length === 0) return;

    slides.forEach(slide => slide.classList.remove("ativo"));
    pontos.forEach(ponto => ponto.classList.remove("ativo"));

    slides[numero].classList.add("ativo");
    if (pontos[numero]) pontos[numero].classList.add("ativo");
}

function mudarSlide(direcao) {
    if (slides.length === 0) return;
    slideAtual = (slideAtual + direcao + slides.length) % slides.length;
    mostrarSlide(slideAtual);
}

function irParaSlide(numero) {
    slideAtual = numero;
    mostrarSlide(slideAtual);
}

if (slides.length > 0) {
    setInterval(() => mudarSlide(1), 5000);
}

/* ================= MAIS VENDIDOS NA HOME ================= */
function renderizarMaisVendidosHome() {
    const listaProdutos = document.getElementById("listaProdutos");
    if (!listaProdutos) return;

    const acrescimo = getAcrescimoUnidade();

    const produtosMaisVendidos = [
        { imagem: "./imagens/comidas/cardapio/Hamburguer_de_Carne_de_Sol_com_Queijo_Coalho.png", nome: "Carne de Sol com Queijo Coalho", preco: 34.90 + acrescimo},
        { imagem: "./imagens/comidas/cardapio/Carne_de_Sol_com_Macaxeira_Frita.png", nome: "Carne de Sol com Macaxeira Frita", preco: 46.90 + acrescimo},
        { imagem: "./imagens/comidas/cardapio/Guarana_Jesus.png", nome: "Guarana Jesus", preco: 8.50 + acrescimo},
        { imagem: "./imagens/comidas/cardapio/Pudim_de_Tapioca_com_Calda_de_Melaço.png", nome: "Pudim de Tapioca com Calda de Melaço", preco: 16.90 + acrescimo}
    ];

    let html = "";
    produtosMaisVendidos.forEach(produto => {
        html += `
            <div class="card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-img">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
                <button onclick="location.href='cardapio.html#hamburgueres'">
                    Confira
                </button>
            </div>
        `;
    });

    listaProdutos.innerHTML = html;
}

/* ================= NOME E LINK DO PERFIL NO HEADER ================= */
function atualizarNomeUsuarioHeader() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const linkPerfil = document.querySelector('.carrinho_usuario .itens:last-child a');
    const textoPerfil = document.querySelector('.carrinho_usuario .itens:last-child p');

    if (usuarioLogado && usuarioLogado.nome) {
        const primeiroNome = usuarioLogado.nome.split(' ')[0];

        if (textoPerfil) {
            textoPerfil.innerText = primeiroNome;
        }

        if (linkPerfil) {
            linkPerfil.href = 'perfil.html';
        }
    } else {
        if (textoPerfil) {
            textoPerfil.innerText = 'Meu Perfil';
        }

        if (linkPerfil) {
            linkPerfil.href = 'login_cadastro.html';
        }
    }
}

/* ================= ATUALIZAR QUADROS DE FIDELIDADE (HOME E CARDÁPIO) ================= */
function atualizarQuadrosFidelidade() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const caixasFidelidade = document.querySelectorAll('.fidelidade, .fidelidade_cardapio');

    caixasFidelidade.forEach(caixa => {
        const elementoPontos = caixa.querySelector('p strong');
        const botaoFidelidade = caixa.querySelector('button');

        if (usuarioLogado) {
            let saldo = usuarioLogado.pontos ?? 
                        usuarioLogado.pontosFidelidade ?? 
                        usuarioLogado.saldoPontos ?? 
                        usuarioLogado.saldo;

            if (saldo === undefined || saldo === null) {
                const elementoPerfil = document.getElementById('saldo_pontos_perfil');
                if (elementoPerfil) {
                    saldo = elementoPerfil.innerText;
                }
            }

            let pontosNumericos = '0';
            if (saldo !== undefined && saldo !== null) {
                pontosNumericos = String(saldo).replace(/\D/g, '') || '0';
            }

            if (elementoPontos) {
                elementoPontos.innerText = pontosNumericos;
            }

            if (botaoFidelidade) {
                botaoFidelidade.innerText = 'Meu Perfil';
                botaoFidelidade.setAttribute('onclick', "location.href='perfil.html'");
            }
        } else {
            if (elementoPontos) {
                elementoPontos.innerText = '0';
            }

            if (botaoFidelidade) {
                botaoFidelidade.innerText = 'Login';
                botaoFidelidade.setAttribute('onclick', "location.href='login_cadastro.html'");
            }
        }
    });
}