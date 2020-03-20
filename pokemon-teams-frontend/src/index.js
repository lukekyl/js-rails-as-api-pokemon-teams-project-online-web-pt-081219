const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main')

    // Fetch Trainers
    function renderTrainer(trainers) {
        trainers.forEach(trainer => {
            const card = document.createElement('div')
            card.setAttribute('class', 'card')
            card.setAttribute('data-id', `${trainer.id}`)
            card.innerHTML = `<p>${trainer.name}</p>`
            const addBtn = document.createElement('button')
            addBtn.setAttribute('data-trainer-id', `${trainer.id}`)
            addBtn.innerHTML = 'Add Pokemon'
            card.appendChild(addBtn);
            addBtn.addEventListener('click', (e) => {
                let trainer_id = e.target.getAttribute('data-trainer-id')
                console.log(trainer_id)
                addPokemon(trainer_id)
            });

            const ul = document.createElement('ul')
            trainer.pokemons.forEach(pokemon => {
                const li = document.createElement('li')
                li.setAttribute('id', `${pokemon.id}`)
                li.innerHTML = `${pokemon.nickname} (${pokemon.species})`
                const releaseBtn = document.createElement('button')
                releaseBtn.setAttribute('class', 'release')
                releaseBtn.setAttribute('data-pokemon-id', `${pokemon.id}`)
                releaseBtn.innerHTML = 'Release'
                li.appendChild(releaseBtn);
                releaseBtn.addEventListener('click', (e) => {
                    let pokemon_id = e.target.getAttribute('data-pokemon-id')
                    console.log(pokemon_id)
                    removePokemon(pokemon_id)
                });

                ul.appendChild(li);
            });

            card.appendChild(ul);
            main.appendChild(card);
        });
    };

    function renderError(error) {
        const p = document.createElement('p');
        p.innerHTML = `<p style="color:red;"><strong>${error.message}</strong></p>`
        main.appendChild(p);
        console.log(error.message);
    };

    fetch(TRAINERS_URL)
        .then(function (response){
            return response.json();
        })
        .then(function (trainers){
            console.log(trainers)
            renderTrainer(trainers);
        })
        .catch(function (error){
            alert("Error!");
            renderError(error)
        });

    // Add Pokemon
    function addPokemon(trainer_id) {
        function renderPokemon(pokemon) {
            const trainerCard = main.querySelector(`.card[data-id='${pokemon.trainer_id}']`)
            const li = document.createElement('li')
            li.setAttribute('id', `${pokemon.id}`)
            li.innerHTML = `${pokemon.nickname} (${pokemon.species})`
            const releaseBtn = document.createElement('button')
            releaseBtn.setAttribute('class', 'release')
            releaseBtn.setAttribute('data-pokemon-id', `${pokemon.id}`)
            releaseBtn.innerHTML = 'Release'
            li.appendChild(releaseBtn);
            releaseBtn.addEventListener('click', (e) => {
                let pokemon_id = e.target.getAttribute('data-pokemon-id')
                console.log(pokemon_id)
                removePokemon(pokemon_id)
            });

            trainerCard.querySelector('ul').appendChild(li);
        };

        let formData = {
            trainer_id: trainer_id
        };
        let configPokemon = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        };

        fetch("http://localhost:3000/pokemons", configPokemon)
            .then(function (response) {
                return response.json();
            })
            .then(function (pokemon) {
                renderPokemon(pokemon);
            })
            .catch(function (error) {
                alert("Error! Pokemon was not created.");
                renderError(error);
            });
    };


    // Release Pokemon

    function removePokemon(pokemon_id) {
        function deletePokemon(pokemon) {
            // console.log(pokemon.id)
            const trainerCard = main.querySelector(`.card[data-id='${pokemon.trainer_id}']`)
            const pokemonList = document.getElementById(`${pokemon.id}`)

            trainerCard.querySelector('ul').removeChild(pokemonList);
        };

        let deleteRequest = {
            method: "DELETE",
        };

        fetch(`http://localhost:3000/pokemons/${pokemon_id}`, deleteRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (pokemon) {
                deletePokemon(pokemon);
            })
            .catch(function (error) {
                alert("Error! Pokemon was not deleted.");
                renderError(error);
            });
    };


});