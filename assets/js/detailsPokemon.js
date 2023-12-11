const id = localStorage.getItem('id')
const pokemonDetail = document.getElementById('container')

function convertPokemonToDiv(pokemon, imgsEvolution) {
    let statsList = '';

    let evolutionPokemonList = '';

    pokemon.statsNames.forEach((statName, index) => {
        statsList += `
            <li class="name"> 
                <span>${statName}</span>
                <span class="valueStats">${pokemon.statsValues[index]}</span>

                <div id="myProgress${index}">
                    <div id="myBar${index}"></div>
                </div>

            </li>
        `

    })

    imgsEvolution.forEach((img) => {
        evolutionPokemonList += `
            <li class="listItemEvolution">
                <div class = "evolution"> 
                <img class="imgEvolutionPokemon" src = "${img.sprites.other.dream_world.front_default}">
                </div>
            </li>
        `
    })

    return `
        <div class="details ${pokemon.type}">
            <span class="name">${pokemon.name}</span>
            <img class="img" src="${pokemon.photo}"
                alt="${pokemon.name}">
            <span class="type ${pokemon.type}">${pokemon.type}</span>

            <div class="stats">
                <ol class="names">
                    ${statsList}
                </ol>
            </div>

            <p class="textEvolution" style="color:${pokemon.type};">Evolution</p>

            <ol id="orderListEvolution">
                ${evolutionPokemonList}
            </ol>
        </div>
    `
}

function loadDetails(idPokemon) {
    pokeApi.getPokemon(idPokemon).then((pokemon) => {
        pokeApi.getEvolution(idPokemon).then((imgs = []) => {
            const newHtml = convertPokemonToDiv(pokemon, imgs)
            if (pokemonDetail) {
                pokemonDetail.innerHTML += newHtml
                defineProgress(pokemon.statsValues)
            }
        })
    })
}

function defineProgress(statsValues) {
    let index = 0;
    for (let i = 0; i < statsValues.length; i++) {
        let myBar = document.getElementById(`myBar${index}`)
        index++;
        myBar.style.width = `${statsValues[i]}%`
    }
}

loadDetails(id)

