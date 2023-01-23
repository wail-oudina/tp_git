const pokemonContainer = document.querySelector(".pokemon-container");

const colors = {
    grass: "#d2f2c2",
    poison: "#f7cdf7",
    fire: "#ffd1b5",
    flying: "#eae3ff",
    water: "#c2f3ff",
    bug: "#e0e8a2",
    normal: "#e6e6c3",
    electric: "#fff1ba",
    ground: "#e0ccb1",
    fighting: "#fcada9",
    psychic: "#ffc9da",
    rock: "#f0e09c",
    fairy: "#ffdee5",
    steel: "#e6eaf0",
    ice: "#e8feff",
    ghost: "#dbbaff",
    dragon: "#c4bdff"
};

// Traduction des types de pokémons en français
const traduction = {
    grass: "plante",
    poison: "poison",
    fire: "feu",
    flying: "vol",
    water: "eau",
    bug: "insecte",
    normal: "normal",
    electric: "électrique",
    ground: "sol",
    fighting: "combat",
    psychic: "psy",
    rock: "roche",
    fairy: "fée",
    steel: "acier",
    ice: "glace",
    ghost: "spectre",
    dragon: "dragon"
}

const API_URL = 'https://pokeapi.co/api/v2/'
fetch(API_URL + "pokemon?limit=151")
    .then((response) => response.json())
    .then((json) => {
        let allPromises = [];
        json.results.forEach((el) => {
            allPromises.push(fetch(el.url));
        });

        return Promise.all(allPromises);
    })
    .then((responses) => {
        let allJsons = [];
        responses.forEach((el) => {
            allJsons.push(el.json());
        });

        return Promise.all(allJsons);
    })
    .then((jsons) => {
        pokemonContainer.innerHTML = "";
        jsons.forEach((json, index) => {
            let pokemonName = json.name;
            fetch(API_URL + "pokemon-species/" + (index + 1))
                .then((response) => response.json())
                .then((data) => {
                    for (let name of data.names) {
                        if (name.language.name === "fr") {
                            pokemonName = name.name;
                        }
                    }

                    const pokemonImg = json.sprites.front_default;
                    const pokemonTypes = [];
                    json.types.forEach((item) => {
                        pokemonTypes.push(item.type.name);
                    });
                    pokemonContainer.innerHTML += `
			<div class="pokemon-card ${pokemonTypes.join(" ")}">
				<img src="${pokemonImg}" alt="" />
				<div class="circle"></div>
				<h5 class="poke-id"> #${index + 1} </h5>
				<h5 class="poke-name"> ${pokemonName.replace(/\w/, (ch) =>
                        ch.toUpperCase()
                    )} </h5>
				<h5> ${pokemonTypes.map((type) => traduction[type])
                        .join(" / ")
                        .replace(/\b\w/g, (ch) => ch.toUpperCase())} </h5>
			</div>
			`;
                    const pokemonCards = document.querySelectorAll(".pokemon-card");
                    const pokemonCard = pokemonCards[pokemonCards.length - 1];
                    /*if (pokemonTypes[1]) {
                        pokemonCard.style.background =
                            "linear-gradient(150deg," +
                            colors[json.types[0].type.name] +
                            " 50%," +
                            colors[json.types[1].type.name] +
                            " 50%)";
                    } else {
                        pokemonCard.style.background = colors[pokemonTypes[0]];
                    }*/
                });
        });
    });
