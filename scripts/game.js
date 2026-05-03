window.KR = window.KR || {};
KR.Game = (() => {
    'use strict';

    const CURRENT_VERSION = '1.3';  // versão atual do jogo

    const DEFAULT_STATE = {
        currentRoom: 'intro', visitedRooms: [], collectedItems: [], usedObjects: [],
        flags: {
            showaUnlocked: false, heiseiUnlocked: false, reiwaUnlocked: false, labUnlocked: true,
            archivesUnlocked: false, crossoversUnlocked: false, secretUnlocked: false,
            labPuzzleDone: false, archivePuzzleDone: false, garagePuzzleDone: false,
            trainingPuzzleDone: false, galleryPuzzleDone: false, cinemaPuzzleDone: false,
            intro_lore_read: false, showaComplete: false, heiseiComplete: false, reiwaComplete: false,
            timeline_restored: false,
        },
        totalRooms: 25,
        coins: 0, xp: 0, level: 1, henshinCount: 0,
        clickCount: 0, totalPlayTime: 0, sessionStart: Date.now(),
        favoriteRooms: [], agentName: 'AGENTE-Ω1',
        dailyChallengeDate: '', dailyChallengeDone: false,
        bestClickCount: null, nightOwl: false,
        duelCards: ['Kamen Rider 1', 'Henshin!', 'Rider Kick', 'Kamen Rider BLACK', 'Cyclone', 'Rider Punch', 'Kamen Rider W', 'Joker', 'Trigger', 'Kamen Rider OOO', 'Tajador', 'Kamen Rider Build', 'Rabbit Tank', 'Kamen Rider Zi-O', 'Time Breaker', 'Kamen Rider Zero-One', 'Rising Hopper', 'Kamen Rider Saber', 'Sword Striker'],  // NOVO: cartas disponíveis para o duelo
        duelWins: 0, duelLosses: 0,
        driverHighScore: 0,   // NOVO: recorde do puzzle drivers_match
        crtMode: false,
        version: CURRENT_VERSION,
    };

    let state = {};

    function migrateState(loadedState) {
        const oldVersion = loadedState.version || '1.0';
        if (oldVersion === CURRENT_VERSION) return loadedState;

        console.log(`Migrando save da versão ${oldVersion} para ${CURRENT_VERSION}`);

        const migrated = Object.assign({}, DEFAULT_STATE, loadedState);
        migrated.flags = Object.assign({}, DEFAULT_STATE.flags, loadedState.flags || {});

        if (oldVersion === '1.0' || oldVersion === '1.1' || oldVersion === '1.2') {
            if (migrated.duelCards === undefined) migrated.duelCards = DEFAULT_STATE.duelCards;
            if (migrated.duelWins === undefined) migrated.duelWins = 0;
            if (migrated.duelLosses === undefined) migrated.duelLosses = 0;
            if (migrated.driverHighScore === undefined) migrated.driverHighScore = 0; // NOVO
            if (migrated.crtMode === undefined) migrated.crtMode = false;
            if (migrated.flags.timeline_restored === undefined) migrated.flags.timeline_restored = false;
        }

        migrated.version = CURRENT_VERSION;
        return migrated;
    }

    function updateNightOwl() {
        const h = new Date().getHours();
        state.nightOwl = (h >= 0 && h < 5);
    }

    function saveToLocalStorage() {
        try {
            state.totalPlayTime += (Date.now() - state.sessionStart);
            state.sessionStart = Date.now();
            updateNightOwl();
            localStorage.setItem('kr_archive_save', JSON.stringify(state));
            return true;
        } catch (e) {
            console.warn('Erro ao salvar no localStorage:', e);
            return false;
        }
    }

    function loadFromLocalStorage() {
        const saved = localStorage.getItem('kr_archive_save');
        if (!saved) return null;
        try {
            const parsed = JSON.parse(saved);
            return parsed;
        } catch (e) {
            console.warn('Erro ao fazer parse do save:', e);
            return null;
        }
    }

    function init() {
        const loaded = loadFromLocalStorage();
        if (loaded) {
            state = migrateState(loaded);
            state.sessionStart = Date.now();
        } else {
            state = deepCopy(DEFAULT_STATE);
            state.sessionStart = Date.now();
        }
        updateNightOwl();
        checkDailyChallenge();

        if (state.crtMode) {
            document.body.classList.add('crt-mode');
        } else {
            document.body.classList.remove('crt-mode');
        }

        return state;
    }

    function checkDailyChallenge() {
        const today = new Date().toISOString().slice(0, 10);
        if (state.dailyChallengeDate !== today) {
            state.dailyChallengeDate = today;
            state.dailyChallengeDone = false;
        }
    }

    function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }

    function save() {
        saveToLocalStorage();
    }

    function reset() {
        localStorage.removeItem('kr_archive_save');
        state = deepCopy(DEFAULT_STATE);
        state.sessionStart = Date.now();
        state.crtMode = false;
        document.body.classList.remove('crt-mode');
        save();
        return state;
    }

    function hasSave() {
        return !!localStorage.getItem('kr_archive_save');
    }

    function getState() { return state; }
    function getCurrentRoom() { return state.currentRoom; }
    function getFlags() { return state.flags; }

    function setRoom(rid) {
        state.currentRoom = rid;
        if (!state.visitedRooms.includes(rid)) state.visitedRooms.push(rid);
        state.clickCount++;
        save();
    }

    function hasVisited(rid) { return state.visitedRooms.includes(rid); }

    function addItem(id) {
        if (!state.collectedItems.includes(id)) {
            state.collectedItems.push(id);
            save();
            return true;
        }
        return false;
    }

    function hasItem(id) { return state.collectedItems.includes(id); }
    function getItems() { return [...state.collectedItems]; }

    function removeItem(id) {
        const i = state.collectedItems.indexOf(id);
        if (i > -1) {
            state.collectedItems.splice(i, 1);
            save();
            return true;
        }
        return false;
    }

    function markObjectUsed(id) {
        if (!state.usedObjects.includes(id)) {
            state.usedObjects.push(id);
            state.clickCount++;
            state.xp += 10;
            checkLevelUp();
            save();
        }
    }

    function isObjectUsed(id) { return state.usedObjects.includes(id); }

    function setFlag(f, v = true) {
        state.flags[f] = v;
        save();
    }

    function getFlag(f) { return state.flags[f] || false; }

    function addCoins(n) {
        state.coins += n;
        save();
    }

    function spendCoins(n) {
        if (state.coins >= n) {
            state.coins -= n;
            save();
            return true;
        }
        return false;
    }

    function getCoins() { return state.coins; }

    function addXP(n) {
        state.xp += n;
        checkLevelUp();
        save();
    }

    function checkLevelUp() {
        const thresholds = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 9000];
        let lv = 1;
        for (let i = thresholds.length - 1; i >= 0; i--) {
            if (state.xp >= thresholds[i]) { lv = i + 1; break; }
        }
        if (lv > state.level) {
            state.level = lv;
            return true;
        }
        return false;
    }

    function getLevel() { return state.level; }
    function getXP() { return state.xp; }

    function incrementHenshin() {
        state.henshinCount++;
        state.xp += 5;
        addCoins(1);
        save();
    }

    function getHenshinCount() { return state.henshinCount; }

    function toggleFavorite(rid) {
        const i = state.favoriteRooms.indexOf(rid);
        if (i > -1) state.favoriteRooms.splice(i, 1);
        else state.favoriteRooms.push(rid);
        save();
    }

    function isFavorite(rid) { return state.favoriteRooms.includes(rid); }

    function completeDaily() {
        state.dailyChallengeDone = true;
        addCoins(10);
        addXP(50);
        save();
    }

    function isRoomUnlocked(rid) {
        switch (rid) {
            case 'intro': case 'showa': case 'lab':
            case 'garage': case 'training': case 'cinema':
                return true;
            case 'music': return hasVisited('intro') || hasVisited('showa');
            case 'villains': return hasVisited('showa');
            case 'battle_royale': return hasVisited('heisei');
            case 'manga': return hasVisited('reiwa');
            case 'rider_duel': return hasVisited('crossovers');
            case 'heisei': return hasItem('fragment_showa');
            case 'reiwa': return hasItem('fragment_heisei');
            case 'gallery': return hasItem('fragment_showa');
            case 'archives': return hasItem('lab_keycard');
            case 'crossovers': return hasItem('fragment_reiwa') && getFlag('archivePuzzleDone');
            case 'secret': return hasItem('omega_core');
            case 'special': return hasVisited('cinema');
            case 'female': return hasVisited('gallery');
            case 'drivers': return hasVisited('lab');
            case 'legacy':
                return hasItem('archivist_seal') && getFlag('timeline_restored');
            case 'cards_collector':
                return hasVisited('rider_duel') && state.duelWins >= 3;
            default: return false;
            case 'drivers': return hasVisited('lab');
            case 'game': return hasVisited('drivers') && getFlag('drivers_puzzle_done');
        }
    }

    function getProgress() {
        return Math.min(100, Math.round((state.visitedRooms.length / state.totalRooms) * 100));
    }

    function getExplorationStats() {
        const puzzles = [
            getFlag('labPuzzleDone'), getFlag('archivePuzzleDone'),
            getFlag('garagePuzzleDone'), getFlag('trainingPuzzleDone'),
            getFlag('galleryPuzzleDone'), getFlag('cinemaPuzzleDone')
        ].filter(Boolean).length;
        return {
            visited: state.visitedRooms.length, total: state.totalRooms,
            items: state.collectedItems.length, puzzles,
            secretUnlocked: hasItem('omega_core'), coins: state.coins,
            level: state.level, xp: state.xp,
            henshinCount: state.henshinCount, clickCount: state.clickCount
        };
    }

    function checkCompletion() {
        return ['fragment_showa', 'fragment_heisei', 'fragment_reiwa', 'omega_core'].every(i => hasItem(i));
    }

    function canCombineOmega() {
        return hasItem('fragment_showa') && hasItem('fragment_heisei') && hasItem('fragment_reiwa');
    }

    function getClickCount() { return state.clickCount; }
    function getBestClick() { return state.bestClickCount; }

    function recordCompletion() {
        if (!state.bestClickCount || state.clickCount < state.bestClickCount) {
            state.bestClickCount = state.clickCount;
            save();
        }
    }

    function setCrtMode(enabled) {
        state.crtMode = enabled;
        if (enabled) document.body.classList.add('crt-mode');
        else document.body.classList.remove('crt-mode');
        save();
    }

    function getCrtMode() { return state.crtMode; }

    // NOVO: getter para driverHighScore (caso precise)
    function getDriverHighScore() { return state.driverHighScore; }
    function setDriverHighScore(score) {
        if (score > state.driverHighScore) {
            state.driverHighScore = score;
            save();
        }
    }

    return {
        init, save, reset, hasSave, getState,
        getCurrentRoom, getFlags, setRoom, hasVisited,
        addItem, hasItem, getItems, removeItem,
        markObjectUsed, isObjectUsed,
        setFlag, getFlag,
        addCoins, spendCoins, getCoins,
        addXP, getXP, getLevel,
        getHenshinCount, incrementHenshin,
        toggleFavorite, isFavorite,
        completeDaily,
        isRoomUnlocked, getProgress, getExplorationStats,
        checkCompletion, canCombineOmega,
        getClickCount, getBestClick, recordCompletion,
        setCrtMode, getCrtMode,
        getDriverHighScore, setDriverHighScore  // NOVO: exportar funções
    };
})();