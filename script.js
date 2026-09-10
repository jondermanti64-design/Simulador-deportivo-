
function poissonRandom(lambda) {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}

function simulateMetric(baseValue, variance = 2) {
    let simulated = baseValue + (Math.random() * (variance * 2) - variance);
    return Math.max(0, Math.round(simulated));
}

function runSimulation() {
    const homeName = document.getElementById('home-name').value;
    const awayName = document.getElementById('away-name').value;
    
    // Obtener xG Ofensivo y Defensivo
    const homeXg = parseFloat(document.getElementById('home-xg').value);
    const homeXga = parseFloat(document.getElementById('home-xga').value);
    const awayXg = parseFloat(document.getElementById('away-xg').value);
    const awayXga = parseFloat(document.getElementById('away-xga').value);
    
    const homeShotsInput = parseInt(document.getElementById('home-shots').value);
    const awayShotsInput = parseInt(document.getElementById('away-shots').value);
    const homeSotInput = parseInt(document.getElementById('home-sot').value);
    const awaySotInput = parseInt(document.getElementById('away-sot').value);
    
    // Córners a favor y en contra
    const homeCornersFav = parseInt(document.getElementById('home-corners').value);
    const homeCornersCon = parseInt(document.getElementById('home-corners-conceded').value);
    const awayCornersFav = parseInt(document.getElementById('away-corners').value);
    const awayCornersCon = parseInt(document.getElementById('away-corners-conceded').value);
    
    let homePoss = parseFloat(document.getElementById('home-poss').value);
    let awayPoss = parseFloat(document.getElementById('away-poss').value);
    
    const homeWinRate = parseFloat(document.getElementById('home-winrate').value) / 100;
    const awayWinRate = parseFloat(document.getElementById('away-winrate').value) / 100;

    // Normalizar Posesión
    const totalPoss = homePoss + awayPoss;
    if (totalPoss > 0) {
        homePoss = Math.round((homePoss / totalPoss) * 100);
        awayPoss = 100 - homePoss;
    } else {
        homePoss = 50;
        awayPoss = 50;
    }

    // --- CRUCE PROFESIONAL DE xG (Ataque Local vs Defensa Visitante, y viceversa) ---
    // Promediamos el poder ofensivo del equipo con la debilidad defensiva del rival, aplicando el factor de localía/visitante
    let finalHomeXg = ((homeXg + awayXga) / 2) * (0.85 + (homeWinRate * 0.3));
    let finalAwayXg = ((awayXg + homeXga) / 2) * (0.85 + (awayWinRate * 0.3));

    // --- CRUCE PROFESIONAL DE CÓRNERS (Favor vs Concedido rival) ---
    let finalHomeCorners = (homeCornersFav + awayCornersCon) / 2;
    let finalAwayCorners = (awayCornersFav + homeCornersCon) / 2;

    // Simulación de Goles con Poisson usando el xG cruzado
    const homeGoals = poissonRandom(finalHomeXg);
    const awayGoals = poissonRandom(finalAwayXg);

    // Simulación de estadísticas físicas
    const simHomeShots = simulateMetric(homeShotsInput, 3);
    const simAwayShots = simulateMetric(awayShotsInput, 3);
    
    const simHomeSot = Math.min(simHomeShots, simulateMetric(homeSotInput, 1.5));
    const simAwaySot = Math.min(simAwayShots, simulateMetric(awaySotInput, 1.5));
    
    const simHomeCorners = simulateMetric(finalHomeCorners, 2);
    const simAwayCorners = simulateMetric(finalAwayCorners, 2);

    // Actualizar Encabezados y Marcador
    document.getElementById('res-home-name').innerText = homeName;
    document.getElementById('res-away-name').innerText = awayName;
    document.getElementById('res-score').innerText = `${homeGoals} - ${awayGoals}`;
    
    document.getElementById('th-home').innerText = homeName;
    document.getElementById('th-away').innerText = awayName;

    // Rellenar la tabla de estadísticas perfecta
    const statsBody = document.getElementById('stats-body');
    statsBody.innerHTML = `
        <tr><td><strong>Goles Esperados (xG Cruzado)</strong></td><td>${finalHomeXg.toFixed(2)}</td><td>${finalAwayXg.toFixed(2)}</td></tr>
        <tr><td><strong>Posesión de Balón</strong></td><td>${homePoss}%</td><td>${awayPoss}%</td></tr>
        <tr><td><strong>Remates Totales</strong></td><td>${simHomeShots}</td><td>${simAwayShots}</td></tr>
        <tr><td><strong>Remates a Puerta</strong></td><td>${simHomeSot}</td><td>${simAwaySot}</td></tr>
        <tr><td><strong>Tiros de Esquina</strong></td><td>${simHomeCorners}</td><td>${simAwayCorners}</td></tr>
    `;

    document.getElementById('results').classList.remove('hidden');
}
