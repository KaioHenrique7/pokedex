# Pokédex completa

## Requisitos
- Node.js 18 ou superior
- Internet para consultar a PokéAPI

## Como executar no VS Code
1. Abra a pasta `backend` no VS Code.
2. No terminal PowerShell, rode `npm.cmd install`.
3. Rode `npm.cmd start`.
4. Abra `http://localhost:3000` no navegador.

## Estrutura
- `backend/server.js`: servidor Express, cache Map, timeout e tratamento dos erros 400/404/503.
- `backend/public/index.html`: página.
- `backend/public/style.css`: estilos.
- `backend/public/script.js`: interface e consultas à API local.

## Testes
- `http://localhost:3000/api/pokemons/pikachu`: 200
- `http://localhost:3000/api/pokemons/25`: 200
- `http://localhost:3000/api/pokemons/naoexiste`: 404
- `http://localhost:3000/api/pokemons/abc123`: 400
- `http://localhost:3000/api/pokemons/0`: 400
- 503: ocorre quando a PokéAPI falha ou demora mais de 5 segundos.

## Diferença em relação ao vídeo
A página consulta somente o servidor Express, que busca os dados na PokéAPI. O servidor valida entradas, devolve JSON simplificado, usa cache em memória e limita o tempo de resposta. Extras: Pokémon aleatório e histórico das últimas seis pesquisas.
