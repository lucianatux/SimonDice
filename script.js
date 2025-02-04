let sequence = [];
let playerSequence = [];
let colors = ["green", "red", "blue", "yellow"];
let frequencies = { // Frecuencias de cada color
    green: 261.63,  // C4
    red: 329.63,    // E4
    blue: 392.00,   // G4
    yellow: 523.25  // C5
};
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let canClick = false;

function startGame() {
    sequence = [];
    playerSequence = [];
    document.getElementById("roundCounter").innerText = "1";
    document.getElementById("message").innerText = "Memoriza la secuencia";
    nextRound();
}

function nextRound() {
    playerSequence = [];
    canClick = false;
    sequence.push(Math.floor(Math.random() * 4));
    document.getElementById("roundCounter").innerText = sequence.length;
    showSequence(0);
}

function showSequence(index) {
    if (index < sequence.length) {
        let color = colors[sequence[index]];
        let button = document.querySelector("." + color);
        playTone(frequencies[color]);
        button.classList.add("active");
        setTimeout(() => {
            button.classList.remove("active");
            setTimeout(() => showSequence(index + 1), 500);
        }, 800);
    } else {
        canClick = true;
        document.getElementById("message").innerText = "Repite la secuencia";
    }
}

function playerClick(index) {
    if (!canClick) return;
    playerSequence.push(index);
    let color = colors[index];
    let button = document.querySelector("." + color);
    playTone(frequencies[color]);
    button.classList.add("active");
    setTimeout(() => button.classList.remove("active"), 300);
    
    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
        document.getElementById("message").innerText = "¡Perdiste! Presiona iniciar para jugar de nuevo.";
        canClick = false;
        return;
    }
    
    if (playerSequence.length === sequence.length) {
        document.getElementById("message").innerText = "¡Bien hecho! Siguiente ronda...";
        setTimeout(nextRound, 1000);
    }
}

function playTone(frequency) {
    let oscillator = audioContext.createOscillator();
    let gainNode = audioContext.createGain();
    
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 300);
}