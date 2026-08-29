document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.querySelector('.formulario_cadastro') || document.querySelector('form');

    if (formCadastro) {
        formCadastro.addEventListener('submit', salvarCadastro);
    }
});

function salvarCadastro(event) {
    event.preventDefault();

    // Captura dos valores usando os IDs do seu HTML
    const nome = document.getElementById('nome_usuario_cadastro')?.value.trim();
    const email = document.getElementById('email_usuario_cadastro')?.value.trim();
    const celular = document.getElementById('celular_usuario_cadastro')?.value.trim();
    const cpf = document.getElementById('cpf_usuario_cadastro')?.value.trim();
    const dataNascimento = document.getElementById('data_usuario_cadastro')?.value;
    const senha = document.getElementById('senha_usuario_cadastro')?.value;
    const confirmaSenha = document.getElementById('confirma_senha_usuario')?.value;

    const cep = document.getElementById('cep_usuario_cadastro')?.value.trim();
    const rua = document.getElementById('rua_usuario_cadastro')?.value.trim();
    const numero = document.getElementById('numero_usuario_cadastro')?.value.trim();
    const complemento = document.getElementById('comp_usuario_cadastro')?.value.trim();
    const bairro = document.getElementById('bairro_usuario_cadastro')?.value.trim();
    const cidade = document.getElementById('cidade_usuario_cadastro')?.value.trim();

    // Validação de campos obrigatórios
    if (!nome || !email || !senha) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Validação de senhas
    if (senha !== confirmaSenha) {
        alert('As senhas digitadas não coincidem!');
        return;
    }

    // Busca a lista de usuários já cadastrados no localStorage
    let usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verifica se já existe alguém cadastrado com esse mesmo e-mail
    const emailExiste = usuariosCadastrados.some(user => user.email === email);
    if (emailExiste) {
        alert('Este e-mail já está cadastrado. Tente fazer login!');
        return;
    }

    // Cria o objeto do novo usuário com os pontos de boas-vindas
    const novoUsuario = {
        nome: nome,
        email: email,
        celular: celular || '',
        cpf: cpf || '',
        dataNascimento: dataNascimento || '',
        senha: senha,
        cep: cep || '',
        rua: rua || '',
        numero: numero || '',
        complemento: complemento || '',
        bairro: bairro || '',
        cidade: cidade || 'Camaquã',
        pontos: 20,
        aceitouLGPD: false
    };

    // Salva o usuário apenas no banco/lista de usuários registrados
    usuariosCadastrados.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuariosCadastrados));

    // REMOVIDOS:
    // localStorage.setItem('usuarioLogado', ...); -> Não loga o usuário
    // localStorage.setItem('pontosFidelidade', ...); -> Evita colisão de sessão

    // Alerta e direcionamento para a página de login
    alert('Cadastro realizado com sucesso! Faça login para acessar sua conta.');
    window.location.href = 'login_cadastro.html';
}