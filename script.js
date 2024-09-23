// Elementos del DOM
const newPlayerInput = document.getElementById('new-player');
const addPlayerButton = document.getElementById('add-player');
const playerListDiv = document.getElementById('player-list');
const startTournamentButton = document.getElementById('start-tournament');
const tournamentSection = document.getElementById('tournament-section');
const bracketsDiv = document.getElementById('brackets');
const nextRoundButton = document.getElementById('next-round');

// Variables para manejar jugadores y emparejamientos
let players = JSON.parse(localStorage.getItem('players')) || [];
let brackets = [];

// Función para agregar un nuevo jugador
addPlayerButton.addEventListener('click', function() {
    const playerName = newPlayerInput.value.trim();
    if (playerName && !players.includes(playerName)) {
        players.push(playerName);
        localStorage.setItem('players', JSON.stringify(players));
        displayPlayers();
        newPlayerInput.value = '';
    }
});

// Función para mostrar lista de jugadores
function displayPlayers() {
    playerListDiv.innerHTML = '';
    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        
        const playerNameSpan = document.createElement('span');
        playerNameSpan.textContent = player;
        playerDiv.appendChild(playerNameSpan);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-btn');
        deleteButton.addEventListener('click', () => deletePlayer(index));
        playerDiv.appendChild(deleteButton);

        playerListDiv.appendChild(playerDiv);
    });
}

// Función para eliminar un jugador
function deletePlayer(index) {
    players.splice(index, 1);
    localStorage.setItem('players', JSON.stringify(players));
    displayPlayers();
}

// Mostrar jugadores al cargar la página
displayPlayers();

// Función para iniciar el torneo
startTournamentButton.addEventListener('click', function() {
    if (players.length < 2) {
        alert('Por favor, agregue al menos 2 jugadores.');
        return;
    }

    // Inicializar el torneo
    brackets = generateBrackets(players);
    displayBrackets(brackets);
    tournamentSection.style.display = 'block';
});

// Función para generar los emparejamientos
function generateBrackets(players) {
    const shuffledPlayers = players.sort(() => 0.5 - Math.random());
    const brackets = [];

    while (shuffledPlayers.length > 1) {
        // Emparejamos dos jugadores
        const player1 = shuffledPlayers.pop();
        const player2 = shuffledPlayers.pop();
        brackets.push([player1, player2]);
    }

    // Si queda un jugador sin emparejar, se empareja con otro aleatoriamente
    if (shuffledPlayers.length === 1) {
        const lastPlayer = shuffledPlayers.pop();
        const randomIndex = Math.floor(Math.random() * brackets.length);
        brackets[randomIndex].push(lastPlayer);
    }

    return brackets;
}

// Función para mostrar los emparejamientos en la pantalla
function displayBrackets(brackets) {
    bracketsDiv.innerHTML = ''; // Limpiar brackets anteriores

    const currentLevel = document.createElement('div');
    currentLevel.classList.add('bracket-level');

    brackets.forEach((match, index) => {
        const matchDiv = document.createElement('div');
        matchDiv.classList.add('match');

        if (match.length === 2) {  // Emparejamiento normal
            matchDiv.innerHTML = `
                <p>${match[0]} vs ${match[1]}</p>
                <label><input type="radio" name="match-${index}" value="${match[0]}" required> ${match[0]}</label>
                <label><input type="radio" name="match-${index}" value="${match[1]}" required> ${match[1]}</label>
            `;
        } else if (match.length === 3) {  // Cuando hay un tercer jugador añadido
            matchDiv.innerHTML = `
                <p>${match[0]} y ${match[2]} vs ${match[1]}</p>
                <label><input type="radio" name="match-${index}" value="${match[0]} y ${match[2]}" required> ${match[0]} y ${match[2]}</label>
                <label><input type="radio" name="match-${index}" value="${match[1]}" required> ${match[1]}</label>
            `;
        }

        currentLevel.appendChild(matchDiv);
    });

    bracketsDiv.appendChild(currentLevel);
    nextRoundButton.style.display = 'inline-block';
}

// Función para avanzar a la siguiente ronda
nextRoundButton.addEventListener('click', function() {
    const winners = [];
    const matches = document.querySelectorAll('.match');

    matches.forEach((match, index) => {
        const selectedWinner = document.querySelector(`input[name="match-${index}"]:checked`);
        if (selectedWinner) {
            winners.push(selectedWinner.value);
        }
    });

    if (winners.length > 1) {
        brackets = generateBrackets(winners);
        displayBrackets(brackets);
    } else {
        bracketsDiv.innerHTML = `<h3>¡El ganador del torneo es ${winners[0]}!</h3>`;
        nextRoundButton.style.display = 'none';
    }
});