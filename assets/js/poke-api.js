
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

function convertPokeApiToPokemonStats(pokeStats) {
    const pokemonStats = new Pokemon()

    pokemonStats.number = pokeStats.id
    pokemonStats.name = pokeStats.name

    const types = pokeStats.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemonStats.types = types
    pokemonStats.type = type

    const statsNames = pokeStats.stats.map((statSlot => statSlot.stat.name))
    const [statName] = statsNames

    pokemonStats.statsNames = statsNames
    pokemonStats.statName = statName

    const statsValues = pokeStats.stats.map((statSlotValue => statSlotValue.base_stat))
    const [statValue] = statsValues

    pokemonStats.statsValues = statsValues
    pokemonStats.statValue = statValue

    pokemonStats.photo = pokeStats.sprites.other.dream_world.front_default
    
    return pokemonStats

}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemon = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody)
        .then(convertPokeApiToPokemonStats)
}

pokeApi.getEvolution = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter informações de Pokemon.')
            }
            return response.json()
        })
        .then(responseData => {
            const urlEvolution = responseData.evolution_chain.url
            return fetch(urlEvolution)
        })
        .then(evolutionResponse => {
            if (!evolutionResponse.ok) {
                throw new Error('Erro ao obter informações de evolução')
            }
            return evolutionResponse.json()
        })
        .then(infoEvolution => {
            let listIdEvolution = [];
            let urlsPokemons = [];
            if (infoEvolution.chain && infoEvolution.chain.species) {
                const idFirstPokemon =
                    infoEvolution.chain.species.url.split('/').slice(-2, -1)[0];
                listIdEvolution.push(idFirstPokemon)
            }

            if (infoEvolution.chain.evolves_to && infoEvolution.chain.evolves_to[0]
                &&
                infoEvolution.chain.evolves_to[0].species) {
                const idSecondEvolution =
                    infoEvolution.chain.evolves_to[0].species.url.split('/').slice(-2, -1)[0];
                listIdEvolution.push(idSecondEvolution);
            }

            if (infoEvolution.chain.evolves_to[0].evolves_to
                && infoEvolution.chain.evolves_to[0].evolves_to[0]
                && infoEvolution.chain.evolves_to[0].evolves_to[0].species) {
                const idThirdEvolution =
                    infoEvolution.chain.evolves_to[0].evolves_to[0].species.url.split('/').slice(-2, -1)[0];
                listIdEvolution.push(idThirdEvolution);
            }
            
            urlsPokemons = listIdEvolution.map(id => `https://pokeapi.co/api/v2/pokemon/${id}/`)
            const promises = urlsPokemons.map(urlPokemon => {
                return fetch(urlPokemon)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao obter informações do Pokémon evoluído.');
                        }
                        return response.json()
                    })
            })
            return Promise.all(promises)
        })
        .catch(erro => {
            console.error('Erro', erro.message);
            return null
        })
}
