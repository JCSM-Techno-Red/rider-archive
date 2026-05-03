window.KR = window.KR || {};
KR.UI = (() => {
    'use strict';

    // Cache de elementos DOM para evitar múltiplas buscas
    let domCache = {};

    function getEl(id) {
        if (!domCache[id]) domCache[id] = document.getElementById(id);
        return domCache[id];
    }

    const ERA_VARS = {
        intro: { c: '#c0392b', g: 'rgba(192,57,43,0.4)', b: 'rgba(192,57,43,0.05)' },
        showa: { c: '#e67e22', g: 'rgba(230,126,34,0.4)', b: 'rgba(230,126,34,0.05)' },
        heisei: { c: '#00c8e0', g: 'rgba(0,200,224,0.4)', b: 'rgba(0,200,224,0.05)' },
        reiwa: { c: '#27ae60', g: 'rgba(39,174,96,0.4)', b: 'rgba(39,174,96,0.05)' },
        lab: { c: '#8e44ad', g: 'rgba(142,68,173,0.4)', b: 'rgba(142,68,173,0.05)' },
        archives: { c: '#c0a060', g: 'rgba(192,160,96,0.4)', b: 'rgba(192,160,96,0.05)' },
        crossovers: { c: '#e74c3c', g: 'rgba(231,76,60,0.4)', b: 'rgba(231,76,60,0.05)' },
        secret: { c: '#f1c40f', g: 'rgba(241,196,15,0.5)', b: 'rgba(241,196,15,0.06)' },
        garage: { c: '#e67e22', g: 'rgba(230,126,34,0.4)', b: 'rgba(230,126,34,0.05)' },
        training: { c: '#8e44ad', g: 'rgba(142,68,173,0.4)', b: 'rgba(142,68,173,0.05)' },
        cinema: { c: '#00c8e0', g: 'rgba(0,200,224,0.4)', b: 'rgba(0,200,224,0.05)' },
        gallery: { c: '#f1c40f', g: 'rgba(241,196,15,0.5)', b: 'rgba(241,196,15,0.06)' },
        special: { c: '#e67e22', g: 'rgba(230,126,34,0.4)', b: 'rgba(230,126,34,0.05)' },
        female: { c: '#00c8e0', g: 'rgba(0,200,224,0.4)', b: 'rgba(0,200,224,0.05)' },
        music: { c: '#8e44ad', g: 'rgba(142,68,173,0.4)', b: 'rgba(142,68,173,0.05)' },
        villains: { c: '#c0392b', g: 'rgba(192,57,43,0.4)', b: 'rgba(192,57,43,0.05)' },
        battle_royale: { c: '#27ae60', g: 'rgba(39,174,96,0.4)', b: 'rgba(39,174,96,0.05)' },
        manga: { c: '#00c8e0', g: 'rgba(0,200,224,0.4)', b: 'rgba(0,200,224,0.05)' },
        rider_duel: { c: '#8e44ad', g: 'rgba(142,68,173,0.4)', b: 'rgba(142,68,173,0.05)' },
        drivers: { c: '#c0a060', g: 'rgba(192,160,96,0.4)', b: 'rgba(192,160,96,0.05)' },
        games: { c: '#e74c3c', g: 'rgba(231,76,60,0.4)', b: 'rgba(231,76,60,0.05)' },
        card_collection: { c: '#f1c40f', g: 'rgba(241,196,15,0.5)', b: 'rgba(241,196,15,0.06)' },
        legacy: { c: '#8e44ad', g: 'rgba(142,68,173,0.4)', b: 'rgba(142,68,173,0.05)' }
    };

    const XP_THRESHOLDS = [0, 100, 250, 500, 900, 1500, 2500, 4000, 6000, 9000];

    const ACHIEVEMENTS = [
        { id: 'first_room', icon: '🏁', label: 'Primeira Missão', desc: 'Visite uma sala', check: s => s.visitedRooms.length >= 2 },
        { id: 'all_frags', icon: '💫', label: 'Colecionador', desc: 'Colete todos os Fragmentos', check: s => ['fragment_showa', 'fragment_heisei', 'fragment_reiwa'].every(i => s.collectedItems.includes(i)) },
        { id: 'omega', icon: '⚛️', label: 'Núcleo Omega', desc: 'Sintetize o Núcleo Omega', check: s => s.collectedItems.includes('omega_core') },
        { id: 'mechanic', icon: '🏍️', label: 'Mecânico Rider', desc: 'Leia arquivos da Garagem', check: s => s.usedObjects.includes('garage_cyclone') && s.usedObjects.includes('garage_hardboilder') },
        { id: 'scholar', icon: '📚', label: 'Estudioso', desc: 'Leia 6 arquivos de lore', check: s => s.usedObjects.filter(o => ['mural', 'capsula', 'scrolls', 'hologram', 'anatomy', 'battle', 'shin', 'zo', 'j', 'scene', 'ishinomori'].some(k => o.includes(k))).length >= 6 },
        { id: 'agent', icon: '🎖️', label: 'Agente Cert.', desc: 'Ganhe o Distintivo', check: s => s.collectedItems.includes('training_badge') },
        { id: 'secret_found', icon: '✨', label: 'Área Secreta', desc: 'Acesse a Convergência Omega', check: s => s.visitedRooms.includes('secret') },
        { id: 'completed', icon: '🏆', label: 'Arquivo Completo', desc: 'Certificado Omega', check: s => s.collectedItems.includes('omega_certificate') },
        { id: 'rider_orator', icon: '🗣️', label: 'Orador', desc: 'Resolva o Puzzle Henshin', check: s => s.usedObjects.includes('training_puzzle_henshin') },
        { id: 'henshin50', icon: '変', label: 'Transformado', desc: 'Pressione Henshin 50x', check: s => (s.henshinCount || 0) >= 50 },
        { id: 'showa_comp', icon: '📺', label: 'Completista Showa', desc: 'Leia todos os terminais Showa', check: s => ['showa_terminal_1', 'showa_terminal_black', 'showa_scrolls'].every(o => s.usedObjects.includes(o)) },
        { id: 'heisei_comp', icon: '💎', label: 'Completista Heisei', desc: 'Leia terminais Heisei', check: s => ['heisei_terminal_kuuga', 'heisei_catalog'].every(o => s.usedObjects.includes(o)) },
        { id: 'night_owl', icon: '🦉', label: 'Insone', desc: 'Jogue entre meia-noite e 5h', check: s => s.nightOwl === true },
        { id: 'memory_master', icon: '🃏', label: 'Boa Memória', desc: 'Resolva o Puzzle de Pareamento', check: s => s.usedObjects.includes('training_puzzle_memory') },
        { id: 'cinephile', icon: '🎬', label: 'Cinéfilo', desc: 'Leia todas as cenas do Cinema', check: s => ['cinema_scene_1', 'cinema_scene_2', 'cinema_shin_anno'].every(o => s.usedObjects.includes(o)) },
        { id: 'rider13', icon: '🔢', label: 'Enciclopédia', desc: 'Resolva o Puzzle dos 13 Riders', check: s => s.usedObjects.includes('showa_puzzle_13') },
        { id: 'speed_200', icon: '⚡', label: 'Speed Demon', desc: 'Menos de 200 ações no total', check: s => (s.clickCount || 0) <= 200 && s.collectedItems.includes('omega_certificate') },
        { id: 'games_comp', icon: '🎮', label: 'Completista Games', desc: 'Explore todas as salas de jogos', check: s => s.visitedRooms.filter(r => r.includes('games')).length >= 5 }
    ];

    let currentRoomId = null;

    function setEraTheme(roomId) {
        const era = ERA_VARS[roomId] || ERA_VARS.intro;
        const r = document.documentElement.style;
        r.setProperty('--era-current', era.c);
        r.setProperty('--era-current-glow', era.g);
        r.setProperty('--era-current-bg', era.b);
        r.setProperty('--accent-color', era.c);
        r.setProperty('--accent-glow', era.g);
    }

    // ======================== RENDER PRINCIPAL ========================
    function renderRoom(roomId) {
        const room = KR.Rooms.getRoom(roomId);
        if (!room) return;
        currentRoomId = roomId;
        KR.Game.setRoom(roomId);
        setEraTheme(roomId);
        if (KR.Events && KR.Events.playSound) KR.Events.playSound('nav');

        // Atualiza HUD
        const hudIcon = getEl('hud-room-icon');
        const hudName = getEl('hud-room-name');
        const eraBadge = getEl('room-era-badge');
        const roomTitle = getEl('room-title');
        const visitedEl = getEl('room-visited');
        const favBtn = getEl('fav-btn');

        if (hudIcon) hudIcon.textContent = room.icon;
        if (hudName) hudName.textContent = room.name;
        if (eraBadge) {
            eraBadge.textContent = room.era;
            eraBadge.className = 'room-era-badge ' + room.eraClass;
        }
        if (roomTitle) roomTitle.textContent = room.name;

        const visited = KR.Game.hasVisited(room.id);
        if (visitedEl) {
            visitedEl.textContent = visited ? '● VISITADO' : '○ NOVO';
            visitedEl.className = 'room-visited-indicator ' + (visited ? 'visited' : 'new');
        }
        if (favBtn) {
            const isFav = KR.Game.isFavorite(room.id);
            favBtn.textContent = isFav ? '★' : '☆';
            favBtn.setAttribute('aria-label', isFav ? 'Remover favorito' : 'Adicionar favorito');
        }

        // Arte ASCII
        const artDiv = getEl('room-art');
        if (artDiv) artDiv.innerHTML = `<pre class="room-ascii">${room.artAscii || ''}</pre>`;

        // Descrições
        const descDiv = getEl('room-description');
        const narrativeDiv = getEl('room-narrative');
        if (descDiv) descDiv.textContent = room.description;
        if (narrativeDiv) narrativeDiv.textContent = room.narrative;

        // Objetos e saídas
        renderObjects(room);
        renderExits(room);

        updateProgress();
        KR.Inventory.render();
        updateLeftPanel();

        const rv = getEl('room-view');
        if (rv) {
            rv.classList.add('room-transitioning');
            setTimeout(() => rv.classList.remove('room-transitioning'), 400);
        }

        addLog(`Entrou em: ${room.name}`, 'log-system');
        checkAchievements();
    }

    function renderObjects(room) {
        const container = getEl('room-objects');
        if (!container) return;
        container.innerHTML = '';
        if (!room.objects || !room.objects.length) {
            container.innerHTML = '<div class="objects-empty">[ Nenhum objeto detectado ]</div>';
            return;
        }
        const fragment = document.createDocumentFragment();
        room.objects.forEach(obj => {
            const used = KR.Game.isObjectUsed(obj.id);
            let blocked = false;
            if (obj.requires && obj.requiresType === 'object_used') blocked = !KR.Game.isObjectUsed(obj.requires);
            else if (obj.requires && obj.requiresType === 'items_all') blocked = !obj.requires.every(i => KR.Game.hasItem(i));
            const collected = obj.type === 'item' && obj.gives && KR.Game.hasItem(obj.gives);
            const div = document.createElement('div');
            div.className = ['obj-card', used ? 'obj-used' : '', blocked ? 'obj-blocked' : '', collected ? 'obj-collected' : '', obj.type === 'puzzle' ? 'obj-puzzle' : '', obj.type === 'item' ? 'obj-item' : ''].filter(Boolean).join(' ');
            div.setAttribute('aria-label', `${obj.name} - ${blocked ? 'bloqueado' : obj.hint}`);
            if (!blocked) div.setAttribute('role', 'button');
            if (!blocked) div.setAttribute('tabindex', '0');
            const tagMap = { puzzle: '<span class="tag tag-puzzle">PUZZLE</span>', item: '<span class="tag tag-item">ITEM</span>', terminal: '<span class="tag tag-terminal">TERMINAL</span>' };
            div.innerHTML = `<div class="obj-icon">${obj.icon}</div><div class="obj-info"><div class="obj-name">${obj.name}</div><div class="obj-hint">${blocked ? '🔒 Interaja com o objeto anterior primeiro' : obj.hint}</div></div><div class="obj-action-tag">${tagMap[obj.type] || '<span class="tag tag-lore">LORE</span>'}</div>`;
            if (!blocked) {
                div.style.cursor = 'pointer';
                div.addEventListener('click', () => handleObjectClick(obj));
                div.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === 'Space') handleObjectClick(obj); });
            }
            fragment.appendChild(div);
        });
        container.appendChild(fragment);
    }

    function handleObjectClick(obj) {
        if (obj.type === 'item') {
            if (KR.Game.hasItem(obj.gives)) {
                notify('Você já possui este item.', '📦');
                return;
            }
            KR.Game.addItem(obj.gives);
            KR.Game.markObjectUsed(obj.id);
            KR.Game.addXP(15); KR.Game.addCoins(2);
            if (obj.flagSet) KR.Game.setFlag(obj.flagSet);
            KR.Inventory.render(); updateLeftPanel();
            const d = KR.Inventory.getItemData(obj.gives);
            notify(`Item: ${d ? d.name : obj.gives}`, d ? d.icon : '✦');
            addLog(`Item obtido: ${d ? d.name : obj.gives}`, 'log-item');
            openModal(`<div class="item-inspect"><span class="item-inspect-icon">${d ? d.icon : '📦'}</span><div class="item-inspect-name">${d ? d.name : obj.gives}</div><span class="item-inspect-type">${d ? d.type.toUpperCase() : ''}</span><p class="item-inspect-desc">${d ? d.desc : ''}</p></div>`);
            renderObjects(KR.Rooms.getRoom(currentRoomId));
            checkAchievements(); if (KR.Events && KR.Events.playSound) KR.Events.playSound('item');
            return;
        }
        if (obj.action === 'combine') { KR.Events.handleCombine(obj); return; }
        if (obj.type === 'puzzle') { KR.Events.openPuzzle(obj); return; }
        KR.Game.markObjectUsed(obj.id);
        KR.Game.addXP(10); KR.Game.addCoins(1);
        if (obj.flagSet) KR.Game.setFlag(obj.flagSet);
        openContentModal(obj.content);
        renderObjects(KR.Rooms.getRoom(currentRoomId));
        checkAchievements();
        if (obj.action === 'duel') {
            openModal('<div class="duel-loading">Carregando arena de duelos...</div>');
            setTimeout(() => KR.Duel.startDuel(), 100);
        }

        if (obj.customHandler && typeof obj.customHandler === 'function') {
            obj.customHandler();
            return;
        }
    }

    function renderExits(room) {
        const list = getEl('exits-list');
        const search = getEl('exit-search');
        if (!list) return;
        const query = search ? search.value.toLowerCase() : '';
        list.innerHTML = '';
        if (!room.connections || !room.connections.length) {
            list.innerHTML = '<div class="exits-empty">[ Sem saídas ]</div>';
            return;
        }
        const conns = query ? room.connections.filter(c => c.label.toLowerCase().includes(query)) : room.connections;
        if (!conns.length) {
            list.innerHTML = '<div class="exits-empty">[ Nenhuma saída encontrada ]</div>';
            return;
        }
        const fragment = document.createDocumentFragment();
        conns.forEach(conn => {
            const unlocked = KR.Game.isRoomUnlocked(conn.targetId);
            const btn = document.createElement('button');
            btn.className = 'exit-btn' + (!unlocked ? ' exit-locked' : '');
            btn.style.setProperty('--exit-color', conn.color || 'var(--era-current)');
            btn.setAttribute('aria-label', `${conn.label} - ${unlocked ? conn.desc : (conn.lockMsg || 'Bloqueado')}`);
            if (unlocked) btn.setAttribute('tabindex', '0');
            const visited = KR.Game.hasVisited(conn.targetId);
            const hasPuzzle = (KR.Rooms.getRoom(conn.targetId)?.objects || []).some(o => o.type === 'puzzle');
            const puzzleDone = hasPuzzle && (KR.Rooms.getRoom(conn.targetId)?.objects || []).filter(o => o.type === 'puzzle').every(o => KR.Game.isObjectUsed(o.id));
            btn.innerHTML = `<span class="exit-icon">${conn.icon}</span>
                <div class="exit-info"><span class="exit-name">${conn.label}</span><span class="exit-desc">${unlocked ? conn.desc : (conn.lockMsg || 'Bloqueado')}</span></div>
                ${puzzleDone ? '<span title="Puzzle resolvido">🧩</span>' : ''}
                ${KR.Game.isFavorite(conn.targetId) ? '<span style="color:var(--era-secret)">★</span>' : ''}
                ${visited ? '<span class="exit-visited-dot">●</span>' : ''}
                ${unlocked ? '<span class="exit-arrow">→</span>' : '<span class="exit-lock-icon">🔒</span>'}`;
            if (unlocked) btn.addEventListener('click', () => renderRoom(conn.targetId));
            else btn.addEventListener('click', () => notify(conn.lockMsg || 'Bloqueado', '🔒'));
            fragment.appendChild(btn);
        });
        list.appendChild(fragment);
    }

    // ======================== MODAIS OTIMIZADOS ========================
    function openModal(html) {
        const modalContent = getEl('modal-content');
        const modalOverlay = getEl('modal-overlay');
        if (!modalContent || !modalOverlay) return;
        requestAnimationFrame(() => {
            modalContent.innerHTML = html;
            modalOverlay.classList.add('active');
            const firstFocusable = modalContent.querySelector('button, input, [tabindex="0"]');
            if (firstFocusable) firstFocusable.focus();
        });
    }

    function closeModal() {
        const modalOverlay = getEl('modal-overlay');
        if (modalOverlay) modalOverlay.classList.remove('active');
    }

    function openContentModal(content) {
        if (!content) return;
        let html = '';
        if (content.type === 'rider') {
            const stars = '★'.repeat(content.rating) + '☆'.repeat(5 - content.rating);
            html = `<div class="modal-rider">
                <div class="rider-header"><span class="rider-big-icon">${content.icon}</span>
                <div><div class="rider-name">${content.name}</div><div class="rider-meta">${content.era} · ${content.year} · ${stars}</div></div></div>
                <div class="rider-section"><div class="rider-section-title">SINOPSE</div><p>${content.synopsis}</p></div>
                <div class="rider-section"><div class="rider-section-title">PROTAGONISTA</div><p>${content.protagonist.name} — <em>${content.protagonist.actor}</em> · ${content.protagonist.type}</p></div>
                <div class="rider-section"><div class="rider-section-title">TEMA</div><p>${content.theme}</p></div>
                ${content.forms ? `<div class="rider-section"><div class="rider-section-title">FORMAS</div><div class="rider-forms">${content.forms.map(f => `<span class="form-tag">${f}</span>`).join('')}</div></div>` : ''}
                <div class="rider-section"><div class="rider-section-title">BELT/DRIVER</div><p>${content.belt}</p></div>
                <div class="rider-section"><div class="rider-section-title">EPISÓDIOS · VILÕES</div><p>${content.episodes} eps · ${content.villains}</p></div>
                ${content.lore ? `<div class="rider-section rider-lore-box"><div class="rider-section-title">◈ LORE SECRETO</div><p>${content.lore}</p></div>` : ''}
            </div>`;
        } else if (content.type === 'secret') {
            html = `<div class="modal-secret"><div class="secret-omega">⚛️</div><div class="secret-title">${content.title}</div><div class="modal-lore-text secret-text">${content.text.replace(/\n/g, '<br>')}</div></div>`;
        } else {
            html = `<div class="modal-lore"><div class="modal-lore-title">${content.title || ''}</div><div class="modal-lore-text">${(content.text || '').replace(/\n/g, '<br>')}</div></div>`;
        }
        openModal(html);
    }

    // ======================== OUTRAS FUNÇÕES ========================
    function updateProgress() {
        const pct = KR.Game.getProgress();
        const fill = getEl('progress-fill');
        const text = getEl('progress-text');
        if (fill) fill.style.width = pct + '%';
        if (text) text.textContent = pct + '%';
    }

    function notify(msg, icon = '✦') {
        const n = getEl('notification');
        const iconSpan = getEl('notif-icon');
        const textSpan = getEl('notif-text');
        if (!n) return;
        if (iconSpan) iconSpan.textContent = icon;
        if (textSpan) textSpan.textContent = msg;
        n.classList.add('show');
        if (n._t) clearTimeout(n._t);
        n._t = setTimeout(() => n.classList.remove('show'), 3200);
    }

    function addLog(msg, cls = '') {
        const log = getEl('log-entries');
        if (!log) return;
        const div = document.createElement('div');
        div.className = 'log-entry ' + cls;
        const t = new Date();
        div.innerHTML = `<span class="log-timestamp">[${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}]</span>${msg}`;
        log.insertBefore(div, log.firstChild);
        while (log.children.length > 40) log.removeChild(log.lastChild);
    }

    // ======================== MAPA ========================
    function renderMap() {
        const mapContainer = document.getElementById('map-visual');
        if (!mapContainer) return;

        const layout = KR.Rooms.getMapLayout();
        const searchTerm = document.getElementById('map-search')?.value.toLowerCase() || '';

        const roomMeta = {
            intro:     { name: 'Hall de Entrada',    icon: '⬡', era: 'intro' },
            showa:     { name: 'Ala Showa',          icon: '📺', era: 'showa' },
            heisei:    { name: 'Ala Heisei',         icon: '💎', era: 'heisei' },
            reiwa:     { name: 'Ala Reiwa',          icon: '🌿', era: 'reiwa' },
            lab:       { name: 'Laboratório',        icon: '🔬', era: 'lab' },
            archives:  { name: 'Arquivos',           icon: '🗄️', era: 'archives' },
            crossovers:{ name: 'Crossovers',         icon: '🌐', era: 'crossovers' },
            secret:    { name: 'Convergência Omega', icon: '∞', era: 'secret' },
            garage:    { name: 'Garagem',            icon: '🏍️', era: 'garage' },
            training:  { name: 'Treinamento',        icon: '🥊', era: 'training' },
            cinema:    { name: 'Cinema',             icon: '🎬', era: 'cinema' },
            gallery:   { name: 'Galeria de Formas',  icon: '⚡', era: 'gallery' },
            special:   { name: 'Especiais 90s',      icon: '🎭', era: 'special' },
            female:    { name: 'Riders Femininas',   icon: '👑', era: 'female' },
            music:     { name: 'Sala das Músicas',   icon: '🎵', era: 'music' },
            villains:  { name: 'Vilões',             icon: '👹', era: 'villains' },
            battle_royale: { name: 'Battle Royale',  icon: '⚔️', era: 'battle_royale' },
            manga:     { name: 'Mangás',             icon: '📚', era: 'manga' },
            rider_duel:{ name: 'Arena de Duelo',     icon: '🃏', era: 'rider_duel' },
            drivers:   { name: 'Drivers',            icon: '🔧', era: 'drivers' },
            games:     { name: 'Game Archive',       icon: '🎮', era: 'games' },
            card_collection: { name: 'Card Archive', icon: '🃏📔', era: 'cards' },
            legacy:    { name: 'Câmara dos Criadores', icon: '✨', era: 'secret' },
            bookcards:   { name: 'Bookcards',           icon: '📇', era: 'secret' }
        };

        let html = '<div class="map-grid">';
        for (const row of layout) {
            html += '<div class="map-row">';
            for (const roomId of row) {
                if (!roomId) {
                    html += '<div class="map-cell map-empty"></div>';
                    continue;
                }
                const meta = roomMeta[roomId] || { name: roomId, icon: '◈', era: 'intro' };
                const isCurrent = roomId === KR.Game.getCurrentRoom();
                const isVisited = KR.Game.hasVisited(roomId);
                const isUnlocked = KR.Game.isRoomUnlocked(roomId);
                const hasPuzzle = (KR.Rooms.getRoom(roomId)?.objects || []).some(o => o.type === 'puzzle');
                const puzzleDone = hasPuzzle && (KR.Rooms.getRoom(roomId)?.objects || []).filter(o => o.type === 'puzzle').every(o => KR.Game.isObjectUsed(o.id));
                const isFavorite = KR.Game.isFavorite(roomId);
                const color = KR.Rooms.getRoomEraColor(roomId);

                if (searchTerm && !meta.name.toLowerCase().includes(searchTerm) && !roomId.includes(searchTerm)) {
                    html += `<div class="map-cell map-hidden" style="display:none;"></div>`;
                    continue;
                }

                let cellClass = 'map-cell';
                if (isCurrent) cellClass += ' map-current';
                else if (isVisited) cellClass += ' map-visited';
                else if (!isUnlocked) cellClass += ' map-locked';
                else cellClass += ' map-available';

                const titleText = `${meta.name}\n${isUnlocked ? (isVisited ? '✓ Visitado' : 'Disponível') : '🔒 Bloqueado'}`;
                html += `
                    <div class="${cellClass}" style="--mc:${color}" data-room="${roomId}" title="${titleText}">
                        <span class="map-cell-icon">${meta.icon}</span>
                        <span class="map-cell-name">${meta.name}</span>
                        ${puzzleDone ? '<span class="map-pz-done" title="Puzzle resolvido">🧩</span>' : ''}
                        ${isFavorite ? '<span class="map-fav" title="Favorito">★</span>' : ''}
                    </div>
                `;
            }
            html += '</div>';
        }
        html += '</div>';

        if (!mapContainer.querySelector('.map-search')) {
            const searchHtml = `<div class="map-header"><h2 class="map-title">⊞ MAPA DO ARQUIVO</h2><input type="text" class="map-search" id="map-search" placeholder="🔍 Filtrar salas..."></div>`;
            mapContainer.innerHTML = searchHtml + html;
        } else {
            mapContainer.querySelector('.map-grid')?.remove();
            mapContainer.insertAdjacentHTML('beforeend', html);
        }

        mapContainer.querySelectorAll('.map-cell[data-room]').forEach(el => {
            const rid = el.dataset.room;
            if (KR.Game.isRoomUnlocked(rid)) {
                el.style.cursor = 'pointer';
                el.addEventListener('click', () => {
                    KR.UI.renderRoom(rid);
                    const mapOverlay = document.getElementById('map-overlay');
                    if (mapOverlay) mapOverlay.classList.remove('active');
                });
            }
        });

        const searchInput = document.getElementById('map-search');
        if (searchInput && !searchInput.listenerAdded) {
            searchInput.listenerAdded = true;
            searchInput.addEventListener('input', () => renderMap());
        }
    }

    // ======================== LEFT PANEL ========================
    function updateLeftPanel() {
        const stats = KR.Game.getExplorationStats();
        const elIds = ['lp-rooms', 'lp-items', 'lp-puzzles', 'lp-coins', 'lp-henshin', 'lp-level', 'lp-xp-fill', 'lp-xp-text', 'lp-clicks'];
        const els = {};
        elIds.forEach(id => { els[id] = getEl(id); });

        if (els['lp-rooms']) els['lp-rooms'].textContent = stats.visited;
        if (els['lp-items']) els['lp-items'].textContent = stats.items;
        if (els['lp-puzzles']) els['lp-puzzles'].textContent = stats.puzzles;
        if (els['lp-coins']) els['lp-coins'].textContent = stats.coins;
        if (els['lp-henshin']) els['lp-henshin'].textContent = stats.henshinCount;

        const lv = KR.Game.getLevel(), xp = KR.Game.getXP();
        if (els['lp-level']) els['lp-level'].textContent = 'NV.' + lv;
        const nextXP = XP_THRESHOLDS[Math.min(lv, XP_THRESHOLDS.length - 1)] || 9999;
        const prevXP = XP_THRESHOLDS[Math.max(lv - 1, 0)] || 0;
        const pct = Math.min(100, Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100));
        if (els['lp-xp-fill']) els['lp-xp-fill'].style.width = pct + '%';
        if (els['lp-xp-text']) els['lp-xp-text'].textContent = xp + ' XP';
        if (els['lp-clicks']) els['lp-clicks'].textContent = KR.Game.getClickCount();

        const eraMap = { showa: 'fragment_showa', heisei: 'fragment_heisei', reiwa: 'fragment_reiwa' };
        Object.entries(eraMap).forEach(([era, item]) => {
            const card = getEl('lp-era-' + era);
            const ck = getEl('lp-era-' + era + '-ck');
            if (!card) return;
            if (KR.Game.hasItem(item)) {
                card.classList.remove('lp-era-locked');
                card.classList.add('lp-era-unlocked', 'lp-era-complete');
                if (ck) ck.textContent = '✓';
            } else if (KR.Game.isRoomUnlocked(era)) {
                card.classList.remove('lp-era-locked');
                card.classList.add('lp-era-unlocked');
                if (ck) ck.textContent = '○';
            }
        });

        const favList = getEl('lp-favorites');
        if (favList) {
            const favs = KR.Game.getState().favoriteRooms;
            if (favs.length === 0) {
                favList.innerHTML = '<div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--text-micro);text-align:center;padding:6px">[ Nenhum favorito ]</div>';
            } else {
                favList.innerHTML = '';
                favs.forEach(rid => {
                    const r = KR.Rooms.getRoom(rid); if (!r) return;
                    const btn = document.createElement('button');
                    btn.className = 'fav-item';
                    btn.textContent = r.icon + ' ' + r.name;
                    btn.setAttribute('aria-label', `Favorito: ${r.name}`);
                    btn.onclick = () => { if (KR.Game.isRoomUnlocked(rid)) renderRoom(rid); else notify('Sala bloqueada.', '🔒'); };
                    favList.appendChild(btn);
                });
            }
        }
        checkAchievements();
    }

    function checkAchievements() {
        const s = KR.Game.getState();
        const container = getEl('lp-achievements');
        if (!container) return;
        container.innerHTML = '';
        let newUnlock = false;
        ACHIEVEMENTS.forEach(ach => {
            const done = ach.check(s);
            const prev = container.dataset['ach_' + ach.id];
            if (done && !prev) newUnlock = true;
            const div = document.createElement('div');
            div.className = 'lp-achievement' + (done ? ' lp-ach-done' : '');
            div.innerHTML = `<span class="lp-ach-icon">${ach.icon}</span><div class="lp-ach-info"><div class="lp-ach-label">${ach.label}</div><div class="lp-ach-desc">${ach.desc}</div></div>${done ? '<span class="lp-ach-check">✓</span>' : ''}`;
            container.appendChild(div);
            container.dataset['ach_' + ach.id] = done ? '1' : '';
        });
        if (newUnlock) notify('Nova conquista desbloqueada!', '🏅');
    }

    // ======================== HENSHIN ========================
    function triggerHenshin() {
        const flash = getEl('henshin-flash');
        const word = getEl('henshin-word');
        if (flash) flash.classList.add('henshin-active');
        if (word) word.classList.add('henshin-word-active');
        if (KR.Game.getState().henshinCount === 0) {
            notify('HENSHIN! Você descobriu o poder da transformação!', '変');
        } else {
            notify('HENSHIN! Transformação ativada!', '変');
        }
        setTimeout(() => {
            if (flash) flash.classList.remove('henshin-active');
            if (word) word.classList.remove('henshin-word-active');
        }, 1800);
        addLog('HENSHIN! Transformação ativada!', 'log-secret');
    }

    // ======================== STATS MODAL (CORRIGIDO) ========================
    function showStats() {
        const stats = KR.Game.getExplorationStats();
        const ms = Math.floor(KR.Game.getState().totalPlayTime / 1000);
        const min = Math.floor(ms / 60), sec = ms % 60;
        const wins = KR.Game.getState().duelWins || 0;
        const losses = KR.Game.getState().duelLosses || 0;
        openModal(`<div class="modal-lore">
            <div class="modal-lore-title">📊 ESTATÍSTICAS DO AGENTE</div>
            <div class="stats-grid">
                <div class="stat-row"><span>Salas visitadas</span><span>${stats.visited}/${stats.total}</span></div>
                <div class="stat-row"><span>Itens coletados</span><span>${stats.items}</span></div>
                <div class="stat-row"><span>Puzzles resolvidos</span><span>${stats.puzzles}</span></div>
                <div class="stat-row"><span>Moedas Rider</span><span>🪙 ${stats.coins}</span></div>
                <div class="stat-row"><span>Nível do Agente</span><span>NV.${stats.level}</span></div>
                <div class="stat-row"><span>XP Total</span><span>${stats.xp}</span></div>
                <div class="stat-row"><span>Gritos Henshin</span><span>変 ${stats.henshinCount}</span></div>
                <div class="stat-row"><span>Ações totais</span><span>${stats.clickCount}</span></div>
                <div class="stat-row"><span>Tempo de jogo</span><span>${min}min ${sec}s</span></div>
                <div class="stat-row"><span>Melhor run</span><span>${KR.Game.getBestClick() || '—'} ações</span></div>
                <div class="stat-row"><span>Duelos (V/D)</span><span>${wins}/${losses}</span></div>
            </div>
            <div class="stats-footer">Continue explorando para melhorar suas estatísticas e desbloquear conquistas!</div>
            <div style="display:flex; gap:12px; justify-content:center; margin-top:20px;">
                <button class="btn" id="export-save-btn">📤 EXPORTAR SAVE</button>
                <button class="btn" id="import-save-btn">📥 IMPORTAR SAVE</button>
                <button class="btn btn-primary" id="stats-close-btn">FECHAR</button>
            </div>
        </div>`);
        setTimeout(() => {
            const exportBtn = document.getElementById('export-save-btn');
            const importBtn = document.getElementById('import-save-btn');
            const closeBtn = document.getElementById('stats-close-btn');
            if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
            if (exportBtn) exportBtn.addEventListener('click', exportSave);
            if (importBtn) importBtn.addEventListener('click', importSave);
            if (exportBtn) exportBtn.focus();
        }, 50);
    }

    function exportSave() {
        const state = KR.Game.getState();
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rider_archive_save_${new Date().toISOString().slice(0, 19)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        notify('Save exportado com sucesso!', '💾');
    }

    function importSave() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const imported = JSON.parse(ev.target.result);
                    if (!imported.version || !imported.currentRoom) throw new Error('Arquivo inválido');
                    localStorage.setItem('kr_archive_save', JSON.stringify(imported));
                    notify('Save importado! Recarregando...', '🔄');
                    setTimeout(() => location.reload(), 1500);
                } catch (err) {
                    notify('Erro ao importar save: arquivo corrompido.', '❌');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // ======================== TUTORIAL ========================
    function showTutorial() {
        const state = KR.Game.getState();
        if (state.flags.tutorial_done) return;
        openModal(`<div class="modal-lore">
            <div class="modal-lore-title">🎓 BEM-VINDO AO RIDER ARCHIVE, AGENTE</div>
            <div class="modal-lore-text">
                <p>Você acessou o arquivo secreto dos Kamen Riders. Explore as salas, interaja com objetos, resolva puzzles e colecione fragmentos para desbloquear novas áreas.</p>
                <ul style="margin:12px 0 12px 20px;">
                    <li><kbd>H</kbd> — GRITE HENSHIN e ganhe moedas</li>
                    <li><kbd>M</kbd> — Abre o mapa interativo</li>
                    <li><kbd>D</kbd> — Desafio diário com recompensas</li>
                    <li><kbd>F</kbd> — Tela cheia</li>
                    <li><kbd>ESC</kbd> — Fecha janelas</li>
                    <li><kbd>Setas</kbd> — Navegação rápida entre salas (se habilitado)</li>
                </ul>
                <p>No painel esquerdo você acompanha seu nível, conquistas e fragmentos. No inventário, itens colecionados.</p>
                <p><strong>Boa sorte, agente. O destino dos Riders está em suas mãos.</strong></p>
            </div>
            <div style="text-align:center; margin-top:16px;">
                <button class="btn btn-primary" id="tutorial-ok">ENTENDIDO! HENSHIN!</button>
            </div>
        </div>`);
        const closeBtn = document.getElementById('tutorial-ok');
        if (closeBtn) {
            closeBtn.onclick = () => {
                closeModal();
                KR.Game.setFlag('tutorial_done', true);
            };
        }
    }

    // ======================== LOADING ========================
    function runLoadingScreen(onDone) {
        const bar = getEl('loading-bar');
        const text = getEl('loading-text');
        const msgs = ['Inicializando protocolos de acesso...', 'Carregando arquivos Showa...', 'Sincronizando dados Heisei...', 'Processando registros Reiwa...', 'Verificando credenciais Omega...', 'Montando cinema e galeria...', 'Acesso concedido.'];
        let p = 0, mi = 0;
        const iv = setInterval(() => {
            p += Math.random() * 18 + 6; if (p > 100) p = 100;
            if (bar) bar.style.width = p + '%';
            const ni = Math.floor((p / 100) * (msgs.length - 1));
            if (ni !== mi && text) { mi = ni; text.textContent = msgs[mi]; }
            if (p >= 100) {
                clearInterval(iv);
                if (text) text.textContent = msgs[msgs.length - 1];
                setTimeout(() => {
                    const ls = getEl('loading-screen');
                    if (ls) {
                        ls.style.opacity = '0';
                        ls.style.transition = 'opacity 0.6s';
                        setTimeout(() => {
                            ls.classList.add('hidden');
                            const gameContainer = getEl('game-container');
                            if (gameContainer) gameContainer.classList.remove('hidden');
                            onDone();
                            setTimeout(() => showTutorial(), 500);
                        }, 600);
                    }
                }, 500);
            }
        }, 180);
    }

    // ============================================
    // EFEITOS DE TELA (CRACK / GLITCH / SHAKE) - mantidos
    // ============================================

    let crackTimeout = null;
    let glitchTimeout = null;

    function applyScreenCrack() {
        removeScreenEffects();

        const crackDiv = document.createElement('div');
        crackDiv.className = 'screen-crack';
        crackDiv.id = 'screen-crack';
        document.body.appendChild(crackDiv);

        const glitchDiv = document.createElement('div');
        glitchDiv.className = 'glitch-lines';
        glitchDiv.id = 'glitch-lines';
        document.body.appendChild(glitchDiv);

        const crackOverlay = document.createElement('div');
        crackOverlay.className = 'crack-overlay';
        crackOverlay.id = 'crack-overlay';
        document.body.appendChild(crackOverlay);

        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.classList.add('screen-shake');
        }

        setTimeout(() => {
            if (crackDiv) crackDiv.classList.add('active');
        }, 10);

        setTimeout(() => {
            if (glitchDiv) glitchDiv.classList.add('active');
        }, 50);

        setTimeout(() => {
            if (crackOverlay) crackOverlay.classList.add('active');
        }, 100);

        crackTimeout = setTimeout(() => {
            removeScreenEffects();
        }, 1000);
    }

    function removeScreenEffects() {
        const crackDiv = document.getElementById('screen-crack');
        const glitchDiv = document.getElementById('glitch-lines');
        const crackOverlay = document.getElementById('crack-overlay');
        const gameContainer = document.getElementById('game-container');

        if (crackDiv) crackDiv.remove();
        if (glitchDiv) glitchDiv.remove();
        if (crackOverlay) crackOverlay.remove();
        if (gameContainer) gameContainer.classList.remove('screen-shake');

        if (crackTimeout) clearTimeout(crackTimeout);
        if (glitchTimeout) clearTimeout(glitchTimeout);
    }

    // ============================================
    // CARD FLIP EFFECT PARA CONTEÚDO
    // ============================================

    function createFlipCard(content, title, icon) {
        applyScreenCrack();

        setTimeout(() => {
            const cardHtml = `
            <div class="card-flip-container">
                <div class="card-flipper" id="flippable-card">
                    <div class="card-front">
                        <div class="card-front-icon">${icon || '🃏'}</div>
                        <div class="card-front-title">${title || 'KAMEN RIDER'}</div>
                        <div class="card-front-subtitle">ARQUIVO SECRETO</div>
                        <div class="card-front-hint">
                            <span>🖱️</span> CLIQUE PARA REVELAR <span>🖱️</span>
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="card-back-title">${title || 'REVELAÇÃO'}</div>
                        <div class="card-back-text">${content.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            </div>
            <div class="flip-instruction">✨ Clique na carta para virar e revelar o conteúdo ✨</div>
        `;

            openModal(cardHtml);

            setTimeout(() => {
                const flipper = document.getElementById('flippable-card');
                if (flipper) {
                    flipper.addEventListener('click', function (e) {
                        e.stopPropagation();
                        this.classList.toggle('flipped');

                        try {
                            if (KR.Events && KR.Events.getAudioCtx) {
                                const ctx = KR.Events.getAudioCtx();
                                if (ctx && !document.body.classList.contains('mute-mode')) {
                                    const o = ctx.createOscillator();
                                    const g = ctx.createGain();
                                    o.connect(g);
                                    g.connect(ctx.destination);
                                    o.frequency.value = 880;
                                    g.gain.setValueAtTime(0.1, ctx.currentTime);
                                    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                                    o.start();
                                    o.stop(ctx.currentTime + 0.3);
                                }
                            }
                        } catch (err) { }
                    });
                }
            }, 50);
        }, 300);
    }

    function openModalWithCrack(html) {
        applyScreenCrack();
        setTimeout(() => {
            openModal(html);
        }, 400);
    }

    function initDebounce() {
        const exitSearch = getEl('exit-search');
        if (exitSearch) {
            let debounceTimer;
            exitSearch.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    const r = KR.Rooms.getRoom(KR.Game.getCurrentRoom());
                    if (r) renderRoom(r.id);
                }, 150);
            });
        }
    }

    function init() {
        initDebounce();
        // Adiciona aria-live ao elemento de notificação
        const notif = getEl('notification');
        if (notif) notif.setAttribute('aria-live', 'polite');
    }

    return {
        renderRoom, renderMap, openModal, closeModal, notify,
        addLog, updateLeftPanel, checkAchievements, triggerHenshin,
        runLoadingScreen, openContentModal, showStats, init, showTutorial, exportSave, importSave,
        applyScreenCrack, removeScreenEffects, createFlipCard, openModalWithCrack
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    if (KR.UI && KR.UI.init) KR.UI.init();
});