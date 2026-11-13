const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const cache = new Map();
const TIMEOUT_MS = 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/pokemons/:termo', async (req, res) => {
  const termo = req.params.termo.trim().toLowerCase();

  if (!/^(?:[a-z][a-z-]*|[1-9][0-9]*)$/.test(termo) || termo.length > 50) {
    return res.status(400).json({ erro: 'Informe um nome válido ou número positivo de Pokémon.' });
  }

  if (cache.has(termo)) return res.json(cache.get(termo));

  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(termo)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });

    if (resposta.status === 404) {
      return res.status(404).json({ erro: 'Pokémon não encontrado.' });
    }
    if (!resposta.ok) {
      return res.status(503).json({ erro: 'PokéAPI indisponível. Tente novamente mais tarde.' });
    }

    const dados = await resposta.json();
    const pokemon = {
      numero: dados.id,
      nome: dados.name,
      tipos: dados.types.map((item) => item.type.name),
      imagem: dados.sprites.other['official-artwork'].front_default || dados.sprites.front_default
    };

    cache.set(termo, pokemon);
    cache.set(String(pokemon.numero), pokemon);
    cache.set(pokemon.nome, pokemon);
    res.json(pokemon);
  } catch (erro) {
    console.error('Falha ao consultar PokéAPI:', erro.message);
    res.status(503).json({ erro: 'PokéAPI indisponível ou demorou para responder.' });
  }
});

app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota da API não encontrada.' }));

app.listen(PORT, () => console.log(`Pokédex rodando em http://localhost:${PORT}`));
