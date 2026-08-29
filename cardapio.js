// ===========================================
// DADOS DOS PRODUTOS BASE
// ===========================================

const hamburgueresBase = [
    { imagem: "./imagens/comidas/cardapio/Hamburguer_de_Carne_de_Sol_com_Queijo_Coalho.png", nome: "Carne de Sol com Queijo Coalho", preco: 34.90 },
    { imagem: "./imagens/comidas/cardapio/Hamburguer_de_Cupim_na_Manteiga_de_Garrafa.png", nome: "Cupim na Manteiga de Garrafa", preco: 38.90 },,
    { imagem: "./imagens/comidas/cardapio/Hamburguer_de_Linguiça_Sertaneja.png", nome: "Linguiça Sertaneja", preco: 32.90 },
    { imagem: "./imagens/comidas/cardapio/X_Carne_Seca_com_Requeijao_Moreno.png", nome: "Carne Seca com Requeijão Moreno", preco: 36.90 }
];

const porcoesBase = [
    { imagem: "./imagens/comidas/cardapio/Carne_de_Sol_com_Macaxeira_Frita.png", nome: "Carne de Sol com Macaxeira Frita", preco: 46.90 },
    { imagem: "./imagens/comidas/cardapio/Dadinho_de_Tapioca_com_Queijo_Coalho.png", nome: "Dadinho de Tapioca com Queijo Coalho", preco: 26.90 },
    { imagem: "./imagens/comidas/cardapio/Pastel_de_Carne_Seca_com_Catupiry.png", nome: "Pastel de Carne Seca com Catupiry", preco: 29.90 },
    { imagem: "./imagens/comidas/cardapio/Torresmo_de_Rolo_Sertanejo.png", nome: "Torresmo de Rolo Sertanejo", preco: 38.90 }
];

const bebidasBase = [
    { imagem: "./imagens/comidas/cardapio/Guarana_Jesus.png", nome: "Guarana Jesus", preco: 8.50 },
    { imagem: "./imagens/comidas/cardapio/Cajuina_Sao_Geral.png", nome: "Cajuina Sao Geraldo", preco: 9.50 },
    { imagem: "./imagens/comidas/cardapio/Suco_Natural_de_Graviola.png", nome: "Suco Natural de Graviola", preco: 11.90 },
    { imagem: "./imagens/comidas/cardapio/Suco_Natural_de_Umbu_Caja.png", nome: "Suco Natural de Umbu-Cajá", preco: 11.90 }
];

const sobremesasBase = [
    { imagem: "./imagens/comidas/cardapio/Bolo_de_Rolo com_Sorvete_de_Creme.png", nome: "Bolo de Rolo com Sorvete de Creme", preco: 19.90 },
    { imagem: "./imagens/comidas/cardapio/Cartola_Pernambucana.png", nome: "Cartola Pernambucana", preco: 22.90 },
    { imagem: "./imagens/comidas/cardapio/Cocada_Cremosa_de_Colher.png", nome: "Cocada Cremosa de Colher", preco: 14.90 },
    { imagem: "./imagens/comidas/cardapio/Pudim_de_Tapioca_com_Calda_de_Melaço.png", nome: "Pudim de Tapioca com Calda de Melaço", preco: 16.90 }
];

// Função para aplicar o preço com acréscimo conforme a cidade
function obterProdutosComAcrescimo(listaProdutos) {
    const acrescimo = (typeof getAcrescimoUnidade === 'function') ? getAcrescimoUnidade() : 0;
    return listaProdutos.map(p => ({
        ...p,
        preco: p.preco + acrescimo
    }));
}

// ===========================================
// ADICIONAR AO CARRINHO (LOCALSTORAGE)
// ===========================================

function adicionarCarrinho(nome, preco, imagem) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        alert('Você precisa estar logado para adicionar itens ao carrinho!');
        window.location.href = 'login_cadastro.html';
        return;
    }

    let carrinho = JSON.parse(localStorage.getItem('carrinhoRaizes')) || [];

    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinhoRaizes', JSON.stringify(carrinho));

    if (typeof atualizarContadorCarrinho === 'function') {
        atualizarContadorCarrinho();
    }

    alert(`${nome} foi adicionado ao seu carrinho!`);
}

// ===========================================
// RENDERIZAR PRODUTOS NA TELA
// ===========================================

function carregarProdutos(idLista, produtos) {
    const lista = document.getElementById(idLista);
    if (!lista) return;

    lista.innerHTML = "";

    produtos.forEach(produto => {
        lista.innerHTML += `
        <div class="card">
            <img src="${produto.imagem}" class="produto-img" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
            <button onclick="adicionarCarrinho('${produto.nome}', ${produto.preco}, '${produto.imagem}')">
                Adicionar ao Pedido
            </button>
        </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos("lista_hamburgueres", obterProdutosComAcrescimo(hamburgueresBase));
    carregarProdutos("lista_porcoes", obterProdutosComAcrescimo(porcoesBase));
    carregarProdutos("lista_bebidas", obterProdutosComAcrescimo(bebidasBase));
    carregarProdutos("lista_sobremesas", obterProdutosComAcrescimo(sobremesasBase));
});

document.addEventListener('DOMContentLoaded', () => {
    const inputPesquisa = document.getElementById('pesquisa');

    if (inputPesquisa) {
        // Filtra enquanto o usuário digita
        inputPesquisa.addEventListener('input', filtrarProdutos);
    }
});

function filtrarProdutos() {
    const termoBusca = document.getElementById('pesquisa').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card, .card_produto');

    cards.forEach(card => {
        const titulo = card.querySelector('h3') ? card.querySelector('h3').innerText.toLowerCase() : '';
        const descricao = card.querySelector('p') ? card.querySelector('p').innerText.toLowerCase() : '';

        if (titulo.includes(termoBusca) || descricao.includes(termoBusca)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}