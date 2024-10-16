const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3'),
    document.getElementById('reel4'),
    document.getElementById('reel5'),
    document.getElementById('reel6')
];

const spinButton = document.getElementById('spinButton');
const resultText = document.getElementById('result');
const betInput = document.getElementById('bet');
const saldoText = document.getElementById('saldo');

const symbols = ['🍒', '🍋', '🍇', '🍉', '⭐', '🔔'];

// Ubah nilai pengali kemenangan
const payoutMultipliers = {
    '🍒': 0,
    '🍋': 0.01,
    '🍇': 0.2, // Menaikkan pengali untuk simbol ini
    '🍉': 1, // Menaikkan pengali untuk simbol ini
    '⭐': 2, // Menaikkan pengali untuk simbol ini
    '🔔': 10 // Menaikkan pengali untuk simbol ini
};

// Distribusi simbol berdasarkan peluang kemunculan
const symbolDistribution = [
    ...Array(40).fill('🍒'),  // Mengurangi peluang
    ...Array(20).fill('🍋'),  // Mengurangi peluang
    ...Array(25).fill('🍇'),  // Mengurangi peluang
    ...Array(15).fill('🍉'),  // Mengurangi peluang
    ...Array(10).fill('⭐'),   // Mengurangi peluang
    ...Array(5).fill('🔔') ,   
];

let totalWin = 0; 
let saldo = 100000; 
let bet = 0; 

function updateSaldoText() {
    saldoText.textContent = `Saldo: Rp${saldo.toLocaleString()}`;
}

function fillReel(reel) {
    reel.innerHTML = ''; 
    for (let i = 0; i < 5; i++) {
        const symbol = document.createElement('div');
        symbol.textContent = symbolDistribution[Math.floor(Math.random() * symbolDistribution.length)];
        symbol.style.fontSize = '40px';
        reel.appendChild(symbol);
    }
}

function spin() {
    bet = parseFloat(betInput.value); 

    if (bet > saldo) {
        resultText.textContent = "TARUHAN KURANG SILAHKAN DEPOSIT LAGI";
        return;
    }

    saldo -= bet;
    updateSaldoText();

    reels.forEach(fillReel);

    totalWin = 0; 

    processSymbols();
}

function countSymbols() {
    let symbolCounts = { '🍒': 0, '🍋': 0, '🍇': 0, '🍉': 0, '⭐': 0, '🔔': 0 };

    reels.forEach(reel => {
        for (let i = 0; i < reel.children.length; i++) {
            let symbol = reel.children[i].textContent;
            symbolCounts[symbol]++;
        }
    });

    return symbolCounts;
}

function explodeAndReplaceSymbols(symbol, callback) {
    let elementsToExplode = []; 

    reels.forEach(reel => {
        for (let i = 0; i < reel.children.length; i++) {
            let child = reel.children[i];
            if (child.textContent === symbol) {
                elementsToExplode.push(child); 
                child.classList.add('explode');
            }
        }
    });

    setTimeout(() => {
        elementsToExplode.forEach(child => {
            child.textContent = symbolDistribution[Math.floor(Math.random() * symbolDistribution.length)];
            child.classList.remove('explode'); 
        });
        callback(); 
    }, 500); 
}

function processSymbols() {
    let symbolCounts = countSymbols();
    let winOccurred = false; 

    for (let symbol in symbolCounts) {
        if (symbolCounts[symbol] >= 10) { // Menaikkan ambang batas kemenangan
            winOccurred = true;
            let winAmount = bet * payoutMultipliers[symbol]; 
            totalWin += winAmount; 

            resultText.textContent = `MENANG BESAR: Rp${totalWin.toLocaleString()} 🎉`;

            explodeAndReplaceSymbols(symbol, function() {
                processSymbols(); 
            });
            return; 
        }
    }

    if (!winOccurred) {
        saldo += totalWin; 
        updateSaldoText();
        resultText.textContent = `SENSASIONAL CUY: Rp${totalWin.toLocaleString()} 🎉`;
    }
}

function initializeGame() {
    reels.forEach(fillReel); 
    updateSaldoText(); 
}

spinButton.addEventListener('click', spin);

window.onload = initializeGame;
