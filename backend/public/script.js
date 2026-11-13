const formulario = document.querySelector('#form-busca');
const campo = document.querySelector('#termo');
const mensagem = document.querySelector('#mensagem');
const resultado = document.querySelector('#resultado');
const imagem = document.querySelector('#imagem');
const numero = document.querySelector('#numero');
const nome = document.querySelector('#nome');
const tipos = document.querySelector('#tipos');
const historico = document.querySelector('#historico');
const botaoAleatorio = document.querySelector('#aleatorio');
const botaoLimpar = document.querySelector('#limpar');
let pesquisas = [];

function atualizarHistorico() {
  historico.replaceChildren();
  if (pesquisas.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'vazio';
    vazio.textContent = 'Nenhuma pesquisa ainda.';
    historico.appendChild(vazio);
    return;
  }
  pesquisas.forEach((pokemon) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = `#${pokemon.numero} ${pokemon.nome}`;
    botao.addEventListener('click', () => buscarPokemon(String(pokemon.numero)));
    historico.appendChild(botao);
  });
}

function exibirPokemon(pokemon) {
  numero.textContent = `#${String(pokemon.numero).padStart(4, '0')}`;
  nome.textContent = pokemon.nome.replaceAll('-', ' ');
  imagem.src = pokemon.imagem || '';
  imagem.alt = `Imagem de ${pokemon.nome}`;
  tipos.replaceChildren();
  pokemon.tipos.forEach((tipo) => {
    const elemento = document.createElement('span');
    elemento.className = 'tipo';
    elemento.textContent = tipo;
    tipos.appendChild(elemento);
  });
  resultado.hidden = false;
  pesquisas = [pokemon, ...pesquisas.filter((p) => p.numero !== pokemon.numero)].slice(0, 6);
  atualizarHistorico();
}

async function buscarPokemon(termo) {
  mensagem.className = 'mensagem';
  mensagem.textContent = 'Buscando Pokémon...';
  resultado.hidden = true;
  try {
    const resposta = await fetch(`/api/pokemons/${encodeURIComponent(termo.trim())}`);
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || 'Erro ao buscar Pokémon.');
    exibirPokemon(dados);
    mensagem.textContent = 'Pokémon encontrado!';
  } catch (erro) {
    mensagem.className = 'mensagem erro';
    mensagem.textContent = erro.message || 'Não foi possível completar a pesquisa.';
  }
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  buscarPokemon(campo.value);
});

botaoAleatorio.addEventListener('click', () => {
  const numeroAleatorio = Math.floor(Math.random() * 1025) + 1;
  campo.value = String(numeroAleatorio);
  buscarPokemon(campo.value);
});

botaoLimpar.addEventListener('click', () => {
  pesquisas = [];
  atualizarHistorico();
});
