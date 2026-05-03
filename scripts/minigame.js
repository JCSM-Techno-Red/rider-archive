// ============================================================
// MINIGAME: RIDER DUEL — VERSÃO ULTIMATE (CORRIGIDA)
// Inclui: Hazard Mode, Rider Gauge, Deck Building, IA, Estatísticas
// ============================================================

window.KR = window.KR || {};
KR.Duel = (() => {
    'use strict';

    // ========== BANCO DE CARTAS BALANCEADO ==========
    const CARDS_DB = {
        // ----- RIDERS BASE -----
        'Kamen Rider 1': {
            type: 'rider', cost: 3, atk: 1900, def: 1600,
            effect: 'Ciclone Impacto: causa 300 de dano direto ao invocar',
            icon: '🦗', desc: 'O lendário primeiro Rider.',
            hazard: { available: true, name: 'Ciclone Máximo', desc: '+500 ATK e causa 500 de dano direto' }
        },
        'Kamen Rider 2': {
            type: 'rider', cost: 3, atk: 1850, def: 1650,
            effect: 'Chute Duplo: +200 ATK se Kamen Rider 1 estiver em campo',
            icon: '🦗', desc: 'O segundo Rider.'
        },
        'Kamen Rider BLACK': {
            type: 'rider', cost: 3, atk: 1950, def: 1700,
            effect: 'Sombra do Rei: +200 ATK se você tiver menos PV que o oponente',
            icon: '🌑', desc: 'Príncipe das trevas.'
        },
        'Kamen Rider Kuuga': {
            type: 'rider', cost: 4, atk: 2100, def: 1800,
            effect: 'Mighty Kick: ao destruir um monstro, causa 400 de dano ao oponente',
            icon: '💪', desc: 'O guerreiro de 2000.'
        },
        'Kamen Rider Ryuki': {
            type: 'rider', cost: 4, atk: 2150, def: 1700,
            effect: 'Dragão Final: sacrifique este monstro para destruir 1 adversário',
            icon: '🐉', desc: 'Cavaleiro do espelho.'
        },
        'Kamen Rider Faiz': {
            type: 'rider', cost: 4, atk: 2050, def: 1900,
            effect: 'Fim da Virada: +300 ATK se mão tiver ≤3 cartas',
            icon: '⚡', desc: 'A fênix de fogo.'
        },
        'Kamen Rider W': {
            type: 'rider', cost: 4, atk: 2100, def: 1800,
            effect: 'Maximum Drive: descarte 1 carta para atacar duas vezes',
            icon: '🔌', desc: 'Dois em um.'
        },
        'Kamen Rider OOO': {
            type: 'rider', cost: 4, atk: 2050, def: 1850,
            effect: 'TATOBA! +300 ATK se tiver 2+ magias no cemitério',
            icon: '🪙', desc: 'Rider das medalhas.'
        },
        'Kamen Rider Gaim': {
            type: 'rider', cost: 5, atk: 2300, def: 1900,
            effect: 'Kachidoki: invulnerável a magias neste turno',
            icon: '🍊', desc: 'Dançarino divino.'
        },
        'Kamen Rider Ex-Aid': {
            type: 'rider', cost: 5, atk: 2350, def: 1700,
            effect: 'Critical Strike: ao atacar, cura 200 PV',
            icon: '🎮', desc: 'Médico gamer.'
        },
        'Kamen Rider Build': {
            type: 'rider', cost: 5, atk: 2300, def: 1950,
            effect: 'Best Match! +400 ATK se jogou uma magia neste turno',
            icon: '🧪', desc: 'Gênio físico.'
        },
        'Kamen Rider Zero-One': {
            type: 'rider', cost: 5, atk: 2400, def: 1800,
            effect: 'Rising Impact: +300 ATK se "Henshin!" no cemitério',
            icon: '🤖', desc: 'CEO e herói.'
        },
        'Kamen Rider Geats': {
            type: 'rider', cost: 5, atk: 2450, def: 1750,
            effect: 'Boost Time! : pague 2 energias para atacar novamente',
            icon: '🦊', desc: 'Desejo vencedor.'
        },
        'Kamen Rider Decade': {
            type: 'rider', cost: 5, atk: 2350, def: 1850,
            effect: 'Kamen Ride: copia efeito de um Rider adversário',
            icon: '📸', desc: 'Destruidor de mundos.'
        },
        'Kamen Rider Saber': {
            type: 'rider', cost: 4, atk: 2150, def: 1800,
            effect: 'Brave Dragon: +200 ATK por cada Rider no campo',
            icon: '⚔️', desc: 'Espadachim lendário.'
        },
        'Kamen Rider Revice': {
            type: 'rider', cost: 4, atk: 2100, def: 1850,
            effect: 'Buddy Up! : invoca ficha Vice (1000/1000)',
            icon: '🦖', desc: 'Pacto com demônio.'
        },
        'Kamen Rider Gotchard': {
            type: 'rider', cost: 4, atk: 2150, def: 1750,
            effect: 'Gotcha! Ao invocar, compre 1 carta',
            icon: '🃏', desc: 'Alquimista.'
        },

        // ----- MAGIAS -----
        'Henshin!': { type: 'spell', cost: 1, effect: 'Rider ganha +500 ATK até o fim do turno', icon: '✨', desc: 'Grito de transformação.' },
        'Rider Kick': { type: 'spell', cost: 2, effect: 'Causa 800 de dano direto', icon: '🦵', desc: 'Golpe mais famoso.' },
        'Rider Punch': { type: 'spell', cost: 1, effect: 'Causa 400 de dano direto', icon: '👊', desc: 'Golpe poderoso.' },
        'Ciclo de Proteção': { type: 'spell', cost: 1, effect: 'Cura 500 PV', icon: '💚', desc: 'Esperança.' },
        'Shocker Invasion': { type: 'spell', cost: 2, effect: 'Monstro adversário perde -400 ATK permanentemente', icon: '⚡', desc: 'Mal ataca.' },
        'Chamado da Ciclone': { type: 'spell', cost: 1, effect: 'Compre 1 carta', icon: '🌪️', desc: 'Velocidade do vento.' },
        'Final Attack Ride': { type: 'spell', cost: 3, effect: 'Destrói o monstro adversário mais forte', icon: '💥', desc: 'Ataque final.' },
        'Full Charge': { type: 'spell', cost: 2, effect: '+5 energia máxima e +2 energia', icon: '🔋', desc: 'Recarrega o Driver!' },

        // ----- ARMADILHAS -----
        'Contra-ataque': { type: 'trap', cost: 1, effect: 'Ao ser atacado, causa 600 de dano', icon: '🛡️', desc: 'Resposta rápida.' },
        'Apelo Final': { type: 'trap', cost: 2, effect: 'Evita derrota (PV=1) e descarta mão', icon: '🔥', desc: 'Última chance.' },
        'Escudo Espelho': { type: 'trap', cost: 1, effect: 'Anula ataque e causa 300 de dano', icon: '🪞', desc: 'Reflete.' },
        'Barreira do Vento': { type: 'trap', cost: 2, effect: 'Reduz próximo dano em 500 e devolve 200', icon: '🌬️', desc: 'Defesa ciclone.' }
    };

    // Evoluídas (Hazard)
    const EVOLVED_CARDS = {
        'Kamen Rider 1_EVOLVED': {
            type: 'rider', cost: 6, atk: 2800, def: 2300,
            effect: 'Ciclone Máximo: causa 500 de dano ao invocar e +500 ATK permanente',
            icon: '🦗⚡', desc: 'Evoluído.',
            hazard: { available: true, name: 'Hazard Overload', desc: 'Sacrifique 500 HP e destrua 1 monstro oponente' }
        },
        'Kamen Rider BLACK_EVOLVED': {
            type: 'rider', cost: 6, atk: 3000, def: 2500,
            effect: 'Rei das Sombras: +200 ATK ao sofrer dano',
            icon: '🌑⚡', desc: 'Evoluído.'
        },
        'Kamen Rider Kuuga_EVOLVED': {
            type: 'rider', cost: 6, atk: 3200, def: 2600,
            effect: 'Ultimate Form: ao invocar, destrua 1 monstro adversário',
            icon: '💪⚡', desc: 'Evoluído.'
        },
        'Kamen Rider Decade_EVOLVED': {
            type: 'rider', cost: 6, atk: 3100, def: 2500,
            effect: 'Complete Form: copia ATK do monstro adversário mais forte',
            icon: '📸⚡', desc: 'Evoluído.'
        }
    };
    Object.assign(CARDS_DB, EVOLVED_CARDS);

    // ========== DECK DO JOGADOR ==========
    let playerDeckCache = null;
    const DEFAULT_DECK = ['Kamen Rider 1', 'Kamen Rider BLACK', 'Henshin!', 'Rider Kick', 'Ciclo de Proteção', 'Shocker Invasion', 'Contra-ataque', 'Full Charge', 'Kamen Rider Kuuga', 'Kamen Rider W'];

    function loadPlayerDeck() {
        const saved = localStorage.getItem('kr_duel_deck');
        if (saved) {
            try {
                const deck = JSON.parse(saved);
                if (Array.isArray(deck) && deck.length === 20 && deck.every(id => CARDS_DB[id]))
                    return deck;
            } catch(e) {}
        }
        const defaultDeck = [];
        while (defaultDeck.length < 20) {
            for (let card of DEFAULT_DECK) {
                if (defaultDeck.length < 20) defaultDeck.push(card);
                else break;
            }
        }
        return defaultDeck;
    }

    function savePlayerDeck(deck) {
        if (deck.length === 20 && deck.every(id => CARDS_DB[id])) {
            localStorage.setItem('kr_duel_deck', JSON.stringify(deck));
            playerDeckCache = deck;
            return true;
        }
        return false;
    }

    function getPlayerDeck() {
        if (!playerDeckCache) playerDeckCache = loadPlayerDeck();
        return [...playerDeckCache];
    }

    // ========== ESTADO DO DUELO ==========
    let gameState = {
        active: false,
        player: { name: 'Agente Ω1', hp: 4000, energy: 100, maxEnergy: 100, deck: [], hand: [], field: [], grave: [], energyUsed: 0, trapSet: null, hazardUsed: false, gauge: 0, reducedDamage: false },
        opponent: { name: 'Duelista Mascarado', hp: 4000, energy: 50, maxEnergy: 50, deck: [], hand: [], field: [], grave: [], energyUsed: 0, trapSet: null, hazardUsed: false, gauge: 0, reducedDamage: false },
        turn: 'player',
        phase: 'main',
        attackTarget: null,
        logEntries: [],
        stats: { playerDamageDone: 0, playerHealing: 0, biggestHit: 0, cardsPlayed: 0 }
    };

    // ========== UTILITÁRIOS ==========
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function addDuelLog(msg) {
        gameState.logEntries.unshift(msg);
        if (gameState.logEntries.length > 25) gameState.logEntries.pop();
        renderDuelScreen();
    }

    // ========== MEDIDOR RIDER ==========
    function addGauge(player, amount) {
        if (!gameState.active) return;
        const p = player === 'player' ? gameState.player : gameState.opponent;
        p.gauge = Math.min(100, p.gauge + amount);
        if (p.gauge >= 100 && !p.hazardUsed) {
            addDuelLog(`⚡ MEDIDOR RIDER CHEIO! ${player === 'player' ? 'Você' : 'Oponente'} pode ativar HAZARD MODE!`);
            renderDuelScreen();
        }
    }

    // ========== MODIFICAÇÃO DE HP (COM REDUÇÃO DE DANO) ==========
    function modifyHP(target, delta, source = null) {
        const p = target === 'player' ? gameState.player : gameState.opponent;
        let actualDelta = delta;
        // Aplica redução de dano se houver flag e for dano negativo
        if (delta < 0 && p.reducedDamage) {
            const reduction = 500;
            actualDelta = Math.min(0, delta + reduction);
            addDuelLog(`🌬️ Barreira do Vento reduziu o dano em ${reduction}!`);
            p.reducedDamage = false; // consome o efeito
        }
        const oldHp = p.hp;
        p.hp = Math.min(4000, Math.max(0, p.hp + actualDelta));
        const appliedDelta = p.hp - oldHp;

        if (appliedDelta !== 0 && target === 'opponent' && appliedDelta < 0) {
            gameState.stats.playerDamageDone += Math.abs(appliedDelta);
            if (Math.abs(appliedDelta) > gameState.stats.biggestHit) gameState.stats.biggestHit = Math.abs(appliedDelta);
            addGauge('player', Math.abs(appliedDelta) / 10);
        }
        if (appliedDelta > 0 && target === 'player') gameState.stats.playerHealing += appliedDelta;
        if (appliedDelta < 0 && target === 'player') addGauge('player', Math.abs(appliedDelta) / 10);

        animateDamage(target, appliedDelta);
        renderDuelScreen();
        checkWin();
    }

    function animateDamage(target, amount) {
        const modal = document.getElementById('modal-content');
        if (modal && amount !== 0) {
            const targetDiv = target === 'player' ? modal.querySelector('.duel-player.player') : modal.querySelector('.duel-player.opponent');
            if (targetDiv) {
                targetDiv.classList.add('damage-flash');
                setTimeout(() => targetDiv.classList.remove('damage-flash'), 300);
            }
        }
    }

    // ========== DECKS ==========
    function initDeckFromList(cardIds) {
        const deck = [];
        for (let id of cardIds) {
            const cardData = CARDS_DB[id];
            if (cardData) deck.push({ id, ...cardData });
            else deck.push({ id: 'Kamen Rider 1', ...CARDS_DB['Kamen Rider 1'] });
        }
        return shuffle(deck);
    }

    function initPlayerGameDeck() {
        return initDeckFromList(getPlayerDeck());
    }

    function initOpponentDeck() {
        const oppDeckIds = [
            'Kamen Rider Kuuga', 'Kamen Rider Ryuki', 'Kamen Rider Faiz', 'Kamen Rider W', 'Kamen Rider OOO',
            'Henshin!', 'Rider Kick', 'Shocker Invasion', 'Contra-ataque', 'Chamado da Ciclone', 'Full Charge',
            'Kamen Rider Gaim', 'Kamen Rider Ex-Aid', 'Kamen Rider Build', 'Ciclo de Proteção', 'Escudo Espelho'
        ];
        while (oppDeckIds.length < 20) oppDeckIds.push('Henshin!');
        return initDeckFromList(oppDeckIds.slice(0,20));
    }

    function drawCard(player, count = 1) {
        if (!gameState.active) return false;
        for (let i = 0; i < count; i++) {
            if (player.deck.length === 0) {
                addDuelLog('❌ Sem cartas no deck! Sofre 500 de dano de exaustão.');
                modifyHP(player === gameState.player ? 'player' : 'opponent', -500);
                return false;
            }
            const card = player.deck.shift();
            player.hand.push(card);
            if (player.hand.length > 7) {
                const descartada = player.hand.shift();
                addDuelLog(`📤 Mão cheia: ${descartada.id} descartada.`);
                player.grave.push(descartada);
            }
        }
        renderDuelScreen();
        return true;
    }

    // ========== TURNOS ==========
    function startTurn() {
        if (!gameState.active) return;
        const player = gameState.turn === 'player' ? gameState.player : gameState.opponent;
        player.energy = Math.min(player.maxEnergy, player.energy + 2);
        player.energyUsed = 0;
        drawCard(player, 1);
        addDuelLog(`⚡ ${gameState.turn === 'player' ? 'Seu' : 'Oponente'} turno! Energia: ${player.energy}/${player.maxEnergy} (${player.energy - player.energyUsed} disponível)`);
        gameState.phase = 'main';
        renderDuelScreen();
        if (gameState.turn === 'opponent') setTimeout(() => opponentTurn(), 600);
    }

    // ========== HAZARD MODE ==========
    function activateHazard(card, owner, cardIdx) {
        const playerObj = owner === 'player' ? gameState.player : gameState.opponent;
        if (!playerObj.hazardUsed && playerObj.gauge >= 100 && card.hazard && card.hazard.available) {
            playerObj.hazardUsed = true;
            playerObj.gauge = 0;
            if (owner === 'player') modifyHP('player', -500);
            // Efeito específico do hazard
            if (card.id === 'Kamen Rider 1_EVOLVED') {
                card.atk += 500;
                modifyHP('opponent', -500);
                addDuelLog(`⚠️ HAZARD! ${card.id} ativou Ciclone Máximo! +500 ATK e -500 HP oponente.`);
            } else {
                if (gameState.opponent.field.length) {
                    const target = [...gameState.opponent.field].sort((a,b)=>b.atk - a.atk)[0];
                    const idx = gameState.opponent.field.indexOf(target);
                    gameState.opponent.field.splice(idx,1);
                    addDuelLog(`⚠️ HAZARD! ${card.id} destruiu ${target.id}!`);
                } else {
                    addDuelLog(`⚠️ HAZARD ativado, mas nenhum alvo!`);
                }
            }
            renderDuelScreen();
            return true;
        } else if (playerObj.gauge < 100) {
            addDuelLog(`⚠️ Medidor Rider em ${playerObj.gauge}% - precisa de 100% para HAZARD.`);
        } else if (playerObj.hazardUsed) {
            addDuelLog(`⚠️ HAZARD já foi usado neste duelo.`);
        }
        return false;
    }

    // ========== AÇÕES DO JOGADOR ==========
    function summonMonster(cardIdx) {
        if (gameState.phase !== 'main') { addDuelLog('Só pode invocar na Fase Principal.'); return false; }
        const card = gameState.player.hand[cardIdx];
        if (!card || card.type !== 'rider') return false;
        if (gameState.player.field.length >= 3) { addDuelLog('Campo cheio!'); return false; }
        if (gameState.player.energy - gameState.player.energyUsed < card.cost) { addDuelLog(`Energia insuficiente (custo ${card.cost}).`); return false; }
        gameState.player.energyUsed += card.cost;
        gameState.player.hand.splice(cardIdx, 1);
        gameState.player.field.push(card);
        addDuelLog(`✨ Invocou ${card.id} (ATK ${card.atk}/DEF ${card.def})`);
        gameState.stats.cardsPlayed++;
        addGauge('player', 20);
        if (card.id === 'Kamen Rider 1') modifyHP('opponent', -300);
        if (card.id === 'Kamen Rider Gotchard') drawCard(gameState.player, 1);
        const hasRider1 = gameState.player.field.some(c => c.id === 'Kamen Rider 1');
        const hasRider2 = gameState.player.field.some(c => c.id === 'Kamen Rider 2');
        if (hasRider1 && hasRider2) {
            gameState.player.field.forEach(c => { if (c.id === 'Kamen Rider 2') c.atk += 200; });
            addDuelLog(`🤝 Sinergia! Rider 2 ganhou +200 ATK.`);
        }
        renderDuelScreen();
        return true;
    }

    function activateSpell(cardIdx) {
        if (gameState.phase !== 'main') { addDuelLog('Só pode ativar magias na Fase Principal.'); return; }
        const card = gameState.player.hand[cardIdx];
        if (!card || card.type !== 'spell') return;
        if (gameState.player.energy - gameState.player.energyUsed < card.cost) { addDuelLog(`Energia insuficiente para ${card.id}.`); return; }
        gameState.player.energyUsed += card.cost;
        gameState.player.hand.splice(cardIdx, 1);
        gameState.player.grave.push(card);
        gameState.stats.cardsPlayed++;
        addGauge('player', 15);

        switch (card.id) {
            case 'Henshin!':
                if (gameState.player.field.length) {
                    gameState.player.field[0].atk += 500;
                    addDuelLog(`💪 ${card.id}! ATK do primeiro Rider +500!`);
                } else addDuelLog('Nenhum Rider no campo.');
                break;
            case 'Rider Kick': modifyHP('opponent', -800); break;
            case 'Rider Punch': modifyHP('opponent', -400); break;
            case 'Ciclo de Proteção': modifyHP('player', 500); break;
            case 'Shocker Invasion':
                if (gameState.opponent.field.length) {
                    gameState.opponent.field[0].atk = Math.max(0, gameState.opponent.field[0].atk - 400);
                    addDuelLog(`⚡ ATK do primeiro oponente -400!`);
                } else addDuelLog('Nenhum monstro adversário.');
                break;
            case 'Chamado da Ciclone': drawCard(gameState.player, 1); break;
            case 'Final Attack Ride':
                if (gameState.opponent.field.length) {
                    const strongest = [...gameState.opponent.field].sort((a,b)=>b.atk - a.atk)[0];
                    const idx = gameState.opponent.field.indexOf(strongest);
                    gameState.opponent.field.splice(idx,1);
                    addDuelLog(`💥 Destruiu ${strongest.id}!`);
                } else addDuelLog('Nenhum monstro.');
                break;
            case 'Full Charge':
                gameState.player.maxEnergy += 5;
                gameState.player.energy += 2;
                addDuelLog(`🔋 Energia máxima +5 e +2 energia!`);
                break;
            default: addDuelLog(`📜 ${card.id} ativada.`);
        }
        renderDuelScreen();
    }

    function setTrap(cardIdx) {
        if (gameState.phase !== 'main') return;
        const card = gameState.player.hand[cardIdx];
        if (!card || card.type !== 'trap') return;
        if (gameState.player.energy - gameState.player.energyUsed < card.cost) { addDuelLog(`Energia insuficiente.`); return; }
        if (gameState.player.trapSet) { addDuelLog('Você já tem armadilha preparada.'); return; }
        gameState.player.energyUsed += card.cost;
        gameState.player.hand.splice(cardIdx, 1);
        gameState.player.trapSet = card;
        addDuelLog(`⚠️ Armadilha ${card.id} preparada!`);
        renderDuelScreen();
    }

    // ========== BATALHA ==========
    function enterBattlePhase() {
        if (gameState.phase !== 'main') { addDuelLog('Só pode na Fase Principal.'); return; }
        if (gameState.player.field.length === 0) { addDuelLog('Sem Riders no campo!'); return; }
        gameState.phase = 'battle';
        addDuelLog('⚔️ Fase de Batalha! Escolha um atacante.');
        renderDuelScreen();
    }

    function selectAttacker(idx) {
        if (gameState.phase !== 'battle') return;
        const attacker = gameState.player.field[idx];
        if (!attacker) return;
        gameState.attackTarget = { attackerIdx: idx };
        addDuelLog(`Selecionou ${attacker.id}. Clique em um alvo adversário ou no oponente para ataque direto.`);
        renderDuelScreen();
    }

    function selectTarget(targetType, targetIdx = null) {
        if (gameState.phase !== 'battle' || !gameState.attackTarget) return;
        const attacker = gameState.player.field[gameState.attackTarget.attackerIdx];
        if (!attacker) { gameState.attackTarget = null; return; }
        let defender = null, isDirect = false;
        if (targetType === 'opponent') isDirect = true;
        else if (targetType === 'monster' && targetIdx !== null && gameState.opponent.field[targetIdx]) defender = gameState.opponent.field[targetIdx];
        else { addDuelLog('Alvo inválido.'); return; }

        if (isDirect) {
            modifyHP('opponent', -attacker.atk);
            addDuelLog(`💥 ATAQUE DIRETO! ${attacker.id} causa ${attacker.atk} de dano!`);
            addGauge('player', 10);
        } else {
            const atk = attacker.atk;
            const def = defender.def;
            if (atk > def) {
                const diff = atk - def;
                const idx = gameState.opponent.field.indexOf(defender);
                if (idx !== -1) gameState.opponent.field.splice(idx,1);
                modifyHP('opponent', -diff);
                addDuelLog(`⚔️ ${attacker.id} derrotou ${defender.id}! Oponente sofre ${diff} de dano!`);
                if (attacker.id === 'Kamen Rider Kuuga') modifyHP('opponent', -400);
                addGauge('player', 15);
            } else if (atk < def) {
                const diff = def - atk;
                modifyHP('player', -diff);
                addDuelLog(`🛡️ ${defender.id} resistiu! Você sofre ${diff} de dano!`);
                const idx2 = gameState.player.field.indexOf(attacker);
                if (idx2 !== -1) gameState.player.field.splice(idx2,1);
            } else {
                const idxA = gameState.player.field.indexOf(attacker);
                const idxD = gameState.opponent.field.indexOf(defender);
                if (idxA !== -1) gameState.player.field.splice(idxA,1);
                if (idxD !== -1) gameState.opponent.field.splice(idxD,1);
                addDuelLog(`🤝 Empate! Ambos destruídos.`);
            }
        }
        gameState.attackTarget = null;
        if (gameState.player.field.length === 0) {
            addDuelLog('Seus Riders acabaram. Fim da Batalha.');
            endBattlePhase();
        } else {
            renderDuelScreen();
            addDuelLog('Escolha outro atacante ou finalize a batalha.');
        }
    }

    function endBattlePhase() {
        gameState.phase = 'end';
        addDuelLog('🔚 Fim da Batalha.');
        endTurn();
    }

    // ========== FINALIZAR TURNO ==========
    function endTurn() {
        if (gameState.phase === 'battle') endBattlePhase();
        if (gameState.turn === 'player' && gameState.opponent.trapSet) resolveTrap(gameState.opponent.trapSet, 'player');
        if (gameState.turn === 'opponent' && gameState.player.trapSet) resolveTrap(gameState.player.trapSet, 'opponent');
        gameState.player.energyUsed = 0;
        gameState.opponent.energyUsed = 0;
        gameState.turn = gameState.turn === 'player' ? 'opponent' : 'player';
        gameState.phase = 'main';
        gameState.attackTarget = null;
        startTurn();
    }

    function resolveTrap(trap, target) {
        addDuelLog(`🪤 Armadilha ativada: ${trap.id}!`);
        if (trap.id === 'Contra-ataque') modifyHP(target, -600);
        else if (trap.id === 'Escudo Espelho') modifyHP(target, -300);
        else if (trap.id === 'Apelo Final' && (target === 'player' ? gameState.player.hp <= 0 : gameState.opponent.hp <= 0)) {
            if (target === 'player') { gameState.player.hp = 1; gameState.player.hand = []; }
            else { gameState.opponent.hp = 1; gameState.opponent.hand = []; }
            addDuelLog(`🔥 ${trap.id} salvou ${target}! Mão descartada.`);
        } else if (trap.id === 'Barreira do Vento') {
            // Ativa redução de dano para o alvo do próximo ataque
            const targetObj = target === 'player' ? gameState.player : gameState.opponent;
            targetObj.reducedDamage = true;
            addDuelLog(`🌬️ Barreira do Vento ativada! Próximo dano reduzido em 500.`);
        }
        renderDuelScreen();
        checkWin();
    }

    // ========== IA DO OPONENTE ==========
    function opponentTurn() {
        if (!gameState.active) return;
        addDuelLog('🤖 Turno do oponente...');
        const opp = gameState.opponent;
        const player = gameState.player;

        // 1) Curar se HP < 1000
        const healSpell = opp.hand.find(c => c.id === 'Ciclo de Proteção' && (opp.energy - opp.energyUsed) >= c.cost);
        if (opp.hp < 1000 && healSpell) {
            const idx = opp.hand.indexOf(healSpell);
            opp.hand.splice(idx,1);
            opp.grave.push(healSpell);
            opp.energyUsed += healSpell.cost;
            modifyHP('opponent', 500);
            addDuelLog(`💚 Oponente usou Ciclo de Proteção!`);
        }

        // 2) Invocar monstro mais caro possível
        let monsters = opp.hand.filter(c => c.type === 'rider').sort((a,b)=>b.cost - a.cost);
        for (let card of monsters) {
            if (opp.field.length < 3 && (opp.energy - opp.energyUsed) >= card.cost) {
                opp.energyUsed += card.cost;
                const idx = opp.hand.indexOf(card);
                opp.hand.splice(idx,1);
                opp.field.push(card);
                addDuelLog(`✨ Oponente invocou ${card.id}!`);
                break;
            }
        }

        // 3) Sinergia Rider 1 + Rider 2
        const hasRider1 = opp.field.some(c => c.id === 'Kamen Rider 1');
        if (hasRider1) {
            const rider2 = opp.hand.find(c => c.id === 'Kamen Rider 2' && (opp.energy - opp.energyUsed) >= c.cost);
            if (rider2 && opp.field.length < 3) {
                opp.energyUsed += rider2.cost;
                const idx = opp.hand.indexOf(rider2);
                opp.hand.splice(idx,1);
                opp.field.push(rider2);
                addDuelLog(`✨ Oponente invocou Kamen Rider 2 (sinergia)!`);
                const r1Card = opp.field.find(c => c.id === 'Kamen Rider 1');
                if (r1Card && rider2) rider2.atk += 200;
            }
        }

        // 4) Preparar armadilha
        if (!opp.trapSet) {
            const trap = opp.hand.find(c => c.type === 'trap' && (opp.energy - opp.energyUsed) >= c.cost);
            if (trap) {
                opp.energyUsed += trap.cost;
                const idx = opp.hand.indexOf(trap);
                opp.hand.splice(idx,1);
                opp.trapSet = trap;
                addDuelLog(`⚠️ Oponente preparou armadilha ${trap.id}.`);
            }
        }

        // 5) Usar magia ofensiva
        let usedSpell = false;
        const offensiveSpells = opp.hand.filter(c => c.type === 'spell' && (c.id === 'Rider Kick' || c.id === 'Rider Punch' || c.id === 'Final Attack Ride') && (opp.energy - opp.energyUsed) >= c.cost);
        if (offensiveSpells.length) {
            const spell = offensiveSpells[0];
            opp.energyUsed += spell.cost;
            const idx = opp.hand.indexOf(spell);
            opp.hand.splice(idx,1);
            opp.grave.push(spell);
            if (spell.id === 'Rider Kick') modifyHP('player', -800);
            else if (spell.id === 'Rider Punch') modifyHP('player', -400);
            else if (spell.id === 'Final Attack Ride' && player.field.length) {
                const strongest = [...player.field].sort((a,b)=>b.atk - a.atk)[0];
                const tIdx = player.field.indexOf(strongest);
                player.field.splice(tIdx,1);
                addDuelLog(`💥 Oponente destruiu ${strongest.id}!`);
            }
            usedSpell = true;
            addDuelLog(`🔥 Oponente usou ${spell.id}!`);
        }
        if (!usedSpell) {
            const buffSpell = opp.hand.find(c => c.id === 'Henshin!' && opp.field.length && (opp.energy - opp.energyUsed) >= c.cost);
            if (buffSpell) {
                opp.energyUsed += buffSpell.cost;
                const idx = opp.hand.indexOf(buffSpell);
                opp.hand.splice(idx,1);
                opp.grave.push(buffSpell);
                opp.field[0].atk += 500;
                addDuelLog(`💪 Oponente usou Henshin! em ${opp.field[0].id}.`);
            }
        }

        // 6) Ataque
        if (opp.field.length) {
            const attacker = opp.field[0];
            let targetMonster = null;
            if (player.field.length) {
                targetMonster = [...player.field].sort((a,b)=>a.def - b.def)[0];
                const idxTarget = player.field.indexOf(targetMonster);
                const atk = attacker.atk, def = targetMonster.def;
                if (atk > def) {
                    const diff = atk - def;
                    player.field.splice(idxTarget,1);
                    modifyHP('opponent', -diff);
                    addDuelLog(`⚔️ ${attacker.id} derrotou ${targetMonster.id}! Oponente causa ${diff} dano.`);
                } else if (atk < def) {
                    const diff = def - atk;
                    opp.field.shift();
                    modifyHP('player', -diff);
                    addDuelLog(`🛡️ ${targetMonster.id} resistiu! Você sofre ${diff} dano.`);
                } else {
                    player.field.splice(idxTarget,1);
                    opp.field.shift();
                    addDuelLog(`🤝 Empate! Ambos destruídos.`);
                }
            } else {
                const totalAtk = opp.field.reduce((s,m)=>s+m.atk,0);
                modifyHP('player', -totalAtk);
                addDuelLog(`💥 ATAQUE DIRETO! -${totalAtk} HP!`);
            }
        }
        endTurn();
    }

    // ========== FIM DE DUELO ==========
    function checkWin() {
        if (gameState.player.hp <= 0) {
            gameState.active = false;
            addDuelLog('💀 VOCÊ PERDEU!');
            const state = KR.Game.getState();
            state.duelLosses = (state.duelLosses || 0) + 1;
            KR.Game.save();
            showPostDuelStats(false);
            setTimeout(() => { KR.UI.closeModal(); KR.UI.notify('❌ Derrota!', '💀'); }, 3000);
        } else if (gameState.opponent.hp <= 0) {
            gameState.active = false;
            addDuelLog('🏆 VITÓRIA!');
            const state = KR.Game.getState();
            const wins = (state.duelWins || 0) + 1;
            state.duelWins = wins;
            let bonusCoins = 25, bonusXP = 50;
            if (gameState.stats.playerDamageDone > 5000) { bonusCoins += 10; bonusXP += 30; }
            if (gameState.player.hp > 3000) { bonusCoins += 5; bonusXP += 20; }
            if (gameState.stats.biggestHit > 2000) { bonusCoins += 8; bonusXP += 25; }
            KR.Game.addCoins(bonusCoins);
            KR.Game.addXP(bonusXP);
            if (wins === 1) KR.Game.addItem('booster_pack');
            if (wins === 3) KR.Game.addItem('booster_pack');
            if (wins === 5) KR.Game.addItem('duel_champion_badge');
            KR.Game.save();
            showPostDuelStats(true);
            setTimeout(() => {
                KR.UI.closeModal();
                KR.UI.notify(`✅ Vitória! +${bonusCoins}🪙 +${bonusXP}XP`, '🏆');
                KR.UI.updateLeftPanel();
            }, 3000);
        }
        if (!gameState.active) renderDuelScreen();
    }

    function showPostDuelStats(isWin) {
        const s = gameState.stats;
        const msg = `📊 ESTATÍSTICAS DO DUELO\n• Dano causado: ${s.playerDamageDone}\n• Maior ataque: ${s.biggestHit}\n• Cura recebida: ${s.playerHealing}\n• Cartas jogadas: ${s.cardsPlayed}\n${isWin ? '🏆 BÔNUS POR DESEMPENHO!' : '💀 Tente melhorar.'}`;
        addDuelLog(msg);
    }

    function concede() {
        gameState.active = false;
        addDuelLog('🏳️ Você se rendeu.');
        const state = KR.Game.getState();
        state.duelLosses = (state.duelLosses || 0) + 1;
        KR.Game.save();
        setTimeout(() => { KR.UI.closeModal(); KR.UI.notify('Você se rendeu...', '🏳️'); }, 1500);
    }

    // ========== CONSTRUÇÃO DE DECK ==========
    function openDeckBuilder() {
        const currentDeck = getPlayerDeck();
        const allCards = Object.keys(CARDS_DB).filter(id => CARDS_DB[id].type === 'rider' || CARDS_DB[id].type === 'spell' || CARDS_DB[id].type === 'trap');
        const html = `
            <div class="deck-builder">
                <div class="modal-lore-title">🃏 CONSTRUIR DECK (20 cartas)</div>
                <div style="display:flex; gap:20px;">
                    <div style="flex:1;">
                        <div class="field-label">📇 TODAS AS CARTAS</div>
                        <div id="card-list" style="max-height:400px; overflow-y:auto; display:grid; grid-template-columns:repeat(2,1fr); gap:4px;"></div>
                    </div>
                    <div style="flex:1;">
                        <div class="field-label">📦 SEU DECK (${currentDeck.length}/20)</div>
                        <div id="deck-list" style="max-height:400px; overflow-y:auto; display:flex; flex-direction:column; gap:4px;"></div>
                        <div style="margin-top:12px; display:flex; gap:8px;">
                            <button class="btn" id="save-deck">💾 SALVAR DECK</button>
                            <button class="btn" id="reset-deck">↺ RESETAR</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        KR.UI.openModal(html);
        const cardListDiv = document.getElementById('card-list');
        const deckListDiv = document.getElementById('deck-list');
        let tempDeck = [...currentDeck];

        function renderDecks() {
            cardListDiv.innerHTML = '';
            deckListDiv.innerHTML = '';
            for (let cardId of allCards) {
                const card = CARDS_DB[cardId];
                const btn = document.createElement('button');
                btn.className = 'deck-card-item';
                btn.innerHTML = `${card.icon} ${cardId}`;
                btn.onclick = () => {
                    if (tempDeck.length < 20 && !tempDeck.includes(cardId)) {
                        tempDeck.push(cardId);
                        renderDecks();
                    } else if (tempDeck.includes(cardId)) KR.UI.notify('Carta já no deck!', '⚠️');
                    else KR.UI.notify('Deck cheio (20 cartas)!', '⚠️');
                };
                cardListDiv.appendChild(btn);
            }
            for (let cardId of tempDeck) {
                const card = CARDS_DB[cardId];
                const div = document.createElement('div');
                div.className = 'deck-card-item';
                div.innerHTML = `${card.icon} ${cardId} <button class="remove-card" data-id="${cardId}">✖</button>`;
                div.querySelector('.remove-card').onclick = () => {
                    const idx = tempDeck.indexOf(cardId);
                    if (idx !== -1) tempDeck.splice(idx,1);
                    renderDecks();
                };
                deckListDiv.appendChild(div);
            }
        }
        renderDecks();
        document.getElementById('save-deck').onclick = () => {
            if (tempDeck.length === 20) {
                savePlayerDeck(tempDeck);
                KR.UI.closeModal();
                KR.UI.notify('Deck salvo!', '✅');
            } else KR.UI.notify('Deck precisa ter exatamente 20 cartas!', '⚠️');
        };
        document.getElementById('reset-deck').onclick = () => {
            tempDeck = [...DEFAULT_DECK];
            while (tempDeck.length < 20) tempDeck.push('Henshin!');
            renderDecks();
        };
    }

    // ========== RENDERIZAÇÃO DO DUELO ==========
    function renderDuelScreen() {
        const modal = document.getElementById('modal-content');
        if (!modal) return;

        const playerFieldHtml = gameState.player.field.map((card, idx) => `
            <div class="duel-card" data-loc="player-field" data-idx="${idx}" style="border-color: #27ae60;">
                <div class="duel-card-icon">${card.icon || '🃏'}</div>
                <div class="duel-card-name">${card.id}</div>
                <div class="duel-card-stats">⚔️${card.atk} 🛡️${card.def}</div>
                <div class="duel-card-effect" title="${card.effect}">✨ ${card.effect.substring(0,40)}</div>
                ${gameState.phase === 'battle' ? `<button class="duel-attack-btn" data-idx="${idx}">⚔️ ATACAR</button>` : ''}
                ${card.hazard && card.hazard.available && !gameState.player.hazardUsed && gameState.player.gauge >= 100 ? `<button class="hazard-btn" data-idx="${idx}">⚠️ HAZARD</button>` : ''}
            </div>
        `).join('');

        const opponentFieldHtml = gameState.opponent.field.map((card, idx) => `
            <div class="duel-card opponent-card" data-loc="opponent-field" data-idx="${idx}" style="border-color: #e74c3c;">
                <div class="duel-card-icon">${card.icon || '🃏'}</div>
                <div class="duel-card-name">${card.id}</div>
                <div class="duel-card-stats">⚔️${card.atk} 🛡️${card.def}</div>
                <div class="duel-card-effect" title="${card.effect}">✨ ${card.effect.substring(0,40)}</div>
                ${gameState.phase === 'battle' && gameState.attackTarget ? `<button class="duel-target-btn" data-idx="${idx}">🎯 ALVO</button>` : ''}
            </div>
        `).join('');

        const playerHandHtml = gameState.player.hand.map((card, idx) => {
            const canPlay = (gameState.player.energy - gameState.player.energyUsed) >= card.cost;
            return `
                <div class="hand-card ${canPlay ? 'playable' : ''}" data-idx="${idx}" data-type="${card.type}">
                    <div class="hand-card-icon">${card.icon || '🃏'}</div>
                    <div class="hand-card-name">${card.id.length > 12 ? card.id.slice(0,10)+'..' : card.id}</div>
                    <div class="hand-card-cost">💠 ${card.cost}</div>
                    <div class="hand-card-desc" title="${card.desc}">ⓘ</div>
                </div>
            `;
        }).join('');

        const logHtml = gameState.logEntries.slice(0, 8).map(msg => `<div>▶ ${msg}</div>`).join('');

        modal.innerHTML = `
            <div class="duel-container">
                <div class="duel-header">
                    <div class="duel-player opponent">
                        <span>${gameState.opponent.name}</span>
                        <div class="hp-bar"><div class="hp-fill" style="width:${(gameState.opponent.hp/4000)*100}%"></div></div>
                        <span>❤️ ${gameState.opponent.hp} | 🔋 ${gameState.opponent.energy}/${gameState.opponent.maxEnergy}</span>
                        <div class="gauge-bar"><div class="gauge-fill" style="width:${gameState.opponent.gauge}%"></div><span>RIDER GAUGE ${gameState.opponent.gauge}%</span></div>
                    </div>
                    <div class="duel-phase">⚡ ${gameState.turn === 'player' ? 'SEU TURNO' : 'TURNO ADVERSÁRIO'} — ${gameState.phase.toUpperCase()}</div>
                    <div class="duel-player player">
                        <span>${gameState.player.name}</span>
                        <div class="hp-bar"><div class="hp-fill" style="width:${(gameState.player.hp/4000)*100}%"></div></div>
                        <span>❤️ ${gameState.player.hp} | 🔋 ${gameState.player.energy - gameState.player.energyUsed}/${gameState.player.maxEnergy}</span>
                        <div class="gauge-bar"><div class="gauge-fill" style="width:${gameState.player.gauge}%"></div><span>RIDER GAUGE ${gameState.player.gauge}%</span></div>
                    </div>
                </div>
                <div class="duel-field opponent-field">
                    <div class="field-label">CAMPO DO OPONENTE</div>
                    <div class="field-cards">${opponentFieldHtml || '<div class="empty-field">— vazio —</div>'}</div>
                </div>
                <div class="duel-field player-field">
                    <div class="field-label">SEU CAMPO</div>
                    <div class="field-cards">${playerFieldHtml || '<div class="empty-field">— vazio —</div>'}</div>
                </div>
                <div class="duel-hand">
                    <div class="hand-label">SUA MÃO (${gameState.player.hand.length} cartas) | 💠 Energia disponível: ${gameState.player.energy - gameState.player.energyUsed}</div>
                    <div class="hand-cards">${playerHandHtml || '<div class="empty-field">— sem cartas —</div>'}</div>
                </div>
                <div class="duel-actions">
                    ${gameState.turn === 'player' && gameState.phase === 'main' ? `
                        <button class="btn duel-action-btn" id="duel-battle-phase">⚔️ FASE DE BATALHA</button>
                        <button class="btn duel-action-btn" id="duel-end-turn">🔚 FINALIZAR TURNO</button>
                        <button class="btn duel-action-btn" id="deck-builder-btn">🃏 DECK</button>
                    ` : gameState.turn === 'player' && gameState.phase === 'battle' ? `
                        <button class="btn duel-action-btn" id="duel-end-battle">🛑 CANCELAR BATALHA</button>
                    ` : ''}
                    <button class="btn duel-action-btn" id="duel-concede">🏳️ RENDIÇÃO</button>
                </div>
                <div class="duel-log">${logHtml}</div>
            </div>
        `;

        // Eventos (usando delegação ou uma única vez para evitar duplicação)
        // Como o modal inteiro é recriado, podemos anexar listeners diretamente.
        document.querySelectorAll('.hand-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(card.dataset.idx);
                const selected = gameState.player.hand[idx];
                if (selected.type === 'rider') summonMonster(idx);
                else if (selected.type === 'spell') activateSpell(idx);
                else if (selected.type === 'trap') setTrap(idx);
            });
        });

        document.querySelectorAll('.duel-attack-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                if (gameState.phase === 'battle') selectAttacker(idx);
                else addDuelLog('Só pode atacar na Fase de Batalha.');
            });
        });

        document.querySelectorAll('.duel-target-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                if (gameState.phase === 'battle' && gameState.attackTarget) selectTarget('monster', idx);
                else addDuelLog('Selecione um atacante primeiro.');
            });
        });

        document.querySelectorAll('.hazard-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                const card = gameState.player.field[idx];
                if (card) activateHazard(card, 'player', idx);
            });
        });

        const oppHeader = modal.querySelector('.duel-player.opponent');
        if (oppHeader && gameState.phase === 'battle' && gameState.attackTarget) {
            oppHeader.style.cursor = 'pointer';
            oppHeader.addEventListener('click', () => selectTarget('opponent'));
        }

        document.getElementById('duel-battle-phase')?.addEventListener('click', enterBattlePhase);
        document.getElementById('duel-end-turn')?.addEventListener('click', endTurn);
        document.getElementById('duel-end-battle')?.addEventListener('click', endBattlePhase);
        document.getElementById('duel-concede')?.addEventListener('click', concede);
        document.getElementById('deck-builder-btn')?.addEventListener('click', openDeckBuilder);
    }

    // ========== INICIAR DUELO ==========
    function startDuel() {
        const playerDeck = initPlayerGameDeck();
        const opponentDeck = initOpponentDeck();
        gameState = {
            active: true,
            player: {
                name: 'Agente Ω1', hp: 4000, energy: 2, maxEnergy: 10,
                deck: playerDeck, hand: [], field: [], grave: [], energyUsed: 0, trapSet: null,
                hazardUsed: false, gauge: 0, reducedDamage: false
            },
            opponent: {
                name: 'Duelista Mascarado', hp: 4000, energy: 2, maxEnergy: 10,
                deck: opponentDeck, hand: [], field: [], grave: [], energyUsed: 0, trapSet: null,
                hazardUsed: false, gauge: 0, reducedDamage: false
            },
            turn: 'player',
            phase: 'main',
            attackTarget: null,
            logEntries: ['Duelo iniciado!', 'Você começa.'],
            stats: { playerDamageDone: 0, playerHealing: 0, biggestHit: 0, cardsPlayed: 0 }
        };
        drawCard(gameState.player, 5);
        drawCard(gameState.opponent, 5);
        renderDuelScreen();
        addDuelLog('⚡ Seu turno! Use suas cartas com sabedoria.');
    }

    // ========== API PÚBLICA ==========
    function evolveCard(originalId) {
        const state = KR.Game.getState();
        const deck = state.duelCards || [];
        const idx = deck.indexOf(originalId);
        if (idx === -1) return null;
        const evolvedId = originalId + '_EVOLVED';
        if (!CARDS_DB[evolvedId]) return null;
        deck[idx] = evolvedId;
        state.duelCards = deck;
        KR.Game.save();
        return { name: evolvedId, ...CARDS_DB[evolvedId] };
    }

    function addCardToDeck(cardId) {
        if (!CARDS_DB[cardId]) return false;
        const state = KR.Game.getState();
        if (!state.duelCards) state.duelCards = [];
        if (!state.duelCards.includes(cardId)) {
            state.duelCards.push(cardId);
            KR.Game.save();
            return true;
        }
        return false;
    }

    function getPlayerCards() {
        const state = KR.Game.getState();
        const cards = state.duelCards || DEFAULT_DECK;
        return cards.filter(cardId => CARDS_DB[cardId]);
    }

    return {
        startDuel,
        evolveCard,
        addCardToDeck,
        getPlayerCards,
        openDeckBuilder,
        CARDS_DB
    };
})();