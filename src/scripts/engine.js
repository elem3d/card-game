const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: 'player-cards',
        player1BOX: document.querySelector("#player-cards"),
        computer: 'computer-cards',
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById('next-duel')
    }, 
}

const pathImages = './src/assets/img/'
const cardData = [
    {
        id: 0,
        name: 'Bulbassaur',
        type: 'Grass',
        img: `${pathImages}Bulbasaur.jpeg`,
        pokemon: `${pathImages}/pokemon/bulbassaur.png`,
        winOf: [1, 6],
        loseOf: [2, 3, 7],
    },
    {
        id: 1,
        name: 'Squirtle',
        type: 'Water',
        img: `${pathImages}Squirtle.jpeg`,
        pokemon: `${pathImages}/pokemon/squirtle.png`,
        winOf: [2, 7],
        loseOf: [0, 5, 3],
    },
    {
        id: 2,
        name: 'Charmander',
        type: 'Fire',
        img: `${pathImages}Charmander.jpeg`,
        pokemon: `${pathImages}/pokemon/charmander.png`,
        winOf: [0, 5],
        loseOf: [1, 6, 3],
    },
    {
        id: 3,
        name: 'Snorlax',
        type: 'Sleep',
        img: `${pathImages}Snorlax.jpeg`,
        pokemon: `${pathImages}/pokemon/snorlax.png`,
        winOf: [0, 1, 2, 5, 6, 7],
        loseOf: [4],
    },
    {
        id: 4,
        name: 'Eevee',
        type: 'Normal',
        img: `${pathImages}Eevee.jpeg`,
        pokemon: `${pathImages}/pokemon/eevee.png`,
        winOf: [3, 5, 6, 7],
        loseOf: [0, 1, 2],
        evolution: [
            {
                id: 5,
                name: 'Leafeon',
                type: 'Grass',
                img: `${pathImages}Leafeon.jpeg`,
                pokemon: `${pathImages}/pokemon/leafeon.png`,
                winOf: [1, 6],
                loseOf: [2, 3, 7],
            },
            {
                id: 6,
                name: 'Vaporeon',
                type: 'Water',
                img: `${pathImages}Vaporeon.jpeg`,
                pokemon: `${pathImages}/pokemon/vaporeon.png`,
                winOf: [2, 7],
                loseOf: [0, 5, 3],
            },
            {
                id: 7,
                name: 'Flareon',
                type: 'Fire',
                img: `${pathImages}Flareon.jpeg`,
                pokemon: `${pathImages}/pokemon/flareon.png`,
                winOf: [0, 5],
                loseOf: [1, 6, 3],
            },
        ]
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}


async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "130px");
    cardImage.setAttribute("src", "./src/assets/img/card-back.png");
    cardImage.setAttribute("data-id", IdCard);

    if(fieldSide === state.playerSides.player1) {
        cardImage.classList.add("card");

        cardImage.addEventListener('mouseover', () => {
            drawSelectedCard(IdCard);
        });
        
        cardImage.addEventListener('mouseleave', () => {
            removeCardInfo()
        });

        cardImage.addEventListener("click", ()=> {
            setCardsInField(cardImage.getAttribute("data-id"))
        });
    }

    return cardImage;
}

async function setCardsInField(cardId) {
    await removeAllCardsImages();
    
    let computerCardId = await getRandomCardId(); 

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].pokemon;
    state.fieldCards.computer.src = cardData[computerCardId].pokemon;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function removeAllCardsImages() {
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW"
    let playerCard = cardData[playerCardId];
    let computerCard = cardData[computerCardId];

    if(playerCard.winOf.includes(computerCardId)) {
        duelResults = "WIN"
        await playAudio(duelResults);
        state.score.playerScore++

    } else if(playerCard.loseOf.includes(computerCardId)) {
        duelResults = "LOSE"
        await playAudio(duelResults);
        state.score.computerScore++
    }

    return duelResults;
}

async function drawButton(text) {
    state.actions.button.innerText = text
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore}     Lose: ${state.score.computerScore}`;
}

async function drawSelectedCard(id) {
    state.cardSprites.avatar.src = cardData[id].img;
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = "Atribute : " + cardData[id].type;
}

async function removeCardInfo() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "Select a Card";
}

async function drawCards(cardNum, fieldSide) {
    for(let i = 0; i < cardNum; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "Select a Card";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}


async function playAudio(status) {
    const audio = new Audio(`src/assets/audio/${status}.WAV`);
    audio.play();
}

function init() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

init();