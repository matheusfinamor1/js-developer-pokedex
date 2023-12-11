const pokemonList = document.getElementById('pokemonList')
const maxRecords = 151;
const limit = 10;
let offset = 0;

function loadButton() {
    const loadMoreButton = document.getElementById('loadMoreButton')
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            offset += limit
            const qtdRecordsWithNexPage = offset + limit
            if (qtdRecordsWithNexPage >= maxRecords) {
                const newLimit = maxRecords - offset
                loadPokemonItens(offset, newLimit)
                loadMoreButton.parentElement.removeChild(loadMoreButton)
            } else {
                loadPokemonItens(offset, limit)
            }
        })
    }
}

function convertPokemonToLi(pokemon) {
    return `
        <li id="${pokemon.number}" class="pokemon ${pokemon.type}" onclick="clickItem('${pokemon.number}')">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
    
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
    
                    <img src="${pokemon.photo}"
                         alt="${pokemon.name}">
                </div>
            </li>
        `
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        if (pokemonList) {
            pokemonList.innerHTML += newHtml
        }
    })

}

window.clickItem = function (number) {
    console.log(number)
    localStorage.setItem('id', `${number}`)
    window.location.href = '../detailPokemon.html'
}

loadPokemonItens(offset, limit)
loadButton()