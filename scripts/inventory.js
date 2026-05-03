window.KR = window.KR || {};
KR.Inventory = (() => {
    'use strict';

    // =========================================================================
    // 1. ITEMS DATABASE
    // =========================================================================
    const ITEMS_DB = {
        // ---------- LORE / INFORMAÇÃO ----------
        note_intro: {
            id: 'note_intro', name: 'Nota Classificada', icon: '📄',
            desc: '"A chave está no grito de transformação. HENSHIN. — Agente X"',
            type: 'lore', usable: false
        },

        // ---------- CHAVES / FRAGMENTOS ----------
        fragment_showa: {
            id: 'fragment_showa', name: 'Fragmento Showa', icon: '🔶',
            desc: 'Fragmento da Era Showa (1971–1989). Desbloqueia Ala Heisei e Galeria.',
            type: 'key', usable: false
        },
        fragment_heisei: {
            id: 'fragment_heisei', name: 'Fragmento Heisei', icon: '🔷',
            desc: 'Fragmento da Era Heisei (2000–2019). Desbloqueia Ala Reiwa.',
            type: 'key', usable: false
        },
        fragment_reiwa: {
            id: 'fragment_reiwa', name: 'Fragmento Reiwa', icon: '🔹',
            desc: 'Fragmento da Era Reiwa (2019–atual). Necessário para Crossovers.',
            type: 'key', usable: false
        },
        lab_keycard: {
            id: 'lab_keycard', name: 'Cartão do Lab', icon: '💳',
            desc: 'Credencial Omega do Laboratório. Abre Arquivos Especiais.',
            type: 'key', usable: false
        },
        archive_pass: {
            id: 'archive_pass', name: 'Passe de Arquivo', icon: '🎫',
            desc: 'Passe pós-puzzle dos Arquivos. Junto ao Fragmento Reiwa abre Crossovers.',
            type: 'key', usable: false
        },
        cinema_pass: {
            id: 'cinema_pass', name: 'Passe Cinema', icon: '🎬',
            desc: 'Acesso às instalações do Cinema Rider.',
            type: 'key', usable: false
        },
        hazard_core: {
            id: 'hazard_core', name: '⚠️ Hazard Core', icon: '⚠️',
            desc: 'Fragmento do Hazard Trigger de Build. Permite acesso a formas especiais.',
            type: 'key', usable: false
        },
        xtreme_memory: {
            id: 'xtreme_memory', name: '💿 Xtreme Memory', icon: '💿',
            desc: 'Gaia Memory avançada de Kamen Rider W. Contém o poder da fusão.',
            type: 'key', usable: false
        },
        archivist_seal: {
            id: 'archivist_seal', name: '🔓 Selo do Arquivista', icon: '🔓',
            desc: 'Selo do Arquivista Absoluto. Prova que você dominou todo o conhecimento Rider.',
            type: 'legendary', usable: false
        },

        // ---------- RECOMPENSAS / TROFÉUS ----------
        omega_core: {
            id: 'omega_core', name: 'Núcleo Omega', icon: '⚛️',
            desc: 'Síntese dos três Fragmentos. Abre a Área Secreta.',
            type: 'legendary', usable: false
        },
        omega_certificate: {
            id: 'omega_certificate', name: 'Certificado Omega', icon: '🏆',
            desc: 'Certificado de exploração completa.',
            type: 'reward', usable: false
        },
        bike_manual: {
            id: 'bike_manual', name: 'Manual das Motos', icon: '📖',
            desc: 'Catálogo técnico das motocicletas Rider.',
            type: 'lore', usable: false
        },
        training_badge: {
            id: 'training_badge', name: 'Distintivo de Agente', icon: '🎖️',
            desc: 'Prova de conclusão do treinamento.',
            type: 'reward', usable: false
        },
        music_disk: {
            id: 'music_disk', name: 'Disco Henshin Raro', icon: '💿',
            desc: 'Gravação rara com temas de todas as eras. Ao ouvir, você sente sua determinação aumentar.',
            type: 'reward', usable: false
        },
        kaijin_report: {
            id: 'kaijin_report', name: 'Relatório Kaijin', icon: '📜',
            desc: 'Arquivo confidencial com todas as organizações vilãs da história Rider.',
            type: 'lore', usable: false
        },
        survival_card: {
            id: 'survival_card', name: 'Carta de Sobrevivente', icon: '🃏',
            desc: 'Carta lendária de um Rider que venceu o Battle Royale. +10% XP em puzzles.',
            type: 'reward', usable: false
        },
        manga_volume: {
            id: 'manga_volume', name: 'Volume Manga Raro', icon: '📘',
            desc: 'Edição limitada com histórias exclusivas e ilustrações inéditas.',
            type: 'lore', usable: false
        },
        duel_champion_badge: {
            id: 'duel_champion_badge', name: 'Insígnia de Campeão', icon: '🏅',
            desc: 'Prova de que você venceu 5 duelos na Arena Rider.',
            type: 'legendary', usable: false
        },
        driver_catalog: {
            id: 'driver_catalog', name: '📋 Catálogo de Drivers', icon: '📋',
            desc: 'Lista completa de todos os Henshin Belts da história.',
            type: 'lore', usable: false
        },

        // ---------- ITENS USÁVEIS (com função .use) ----------
        showa_vinyl: {
            id: 'showa_vinyl', name: 'Vinil Raro 1971', icon: '💿',
            desc: 'Vinil original da abertura de Kamen Rider 1. Raríssimo! +10 XP ao ouvir.',
            type: 'reward', usable: true,
            use: () => {
                KR.Game.addXP(10);
                KR.UI.notify('Você ouviu o vinil e ganhou +10 XP!', '🎵');
            }
        },
        heisei_cd_box: {
            id: 'heisei_cd_box', name: 'CD Box Heisei', icon: '📀',
            desc: 'Box com todos os 20 temas da Era Heisei. +25 XP, bônus em duelos com cartas Heisei.',
            type: 'reward', usable: true,
            use: () => {
                KR.Game.addXP(25);
                KR.UI.notify('Você escutou o CD Box e ganhou +25 XP!', '🎵');
            }
        },
        booster_pack: {
            id: 'booster_pack', name: 'Booster Pack', icon: '📦',
            desc: 'Contém 3 cartas aleatórias para seu deck.',
            type: 'reward', usable: true,
            use: () => {
                const cardPool = [
                    'Kamen Rider Geats', 'Kamen Rider Ex-Aid', 'Kamen Rider Zero-One',
                    'Kamen Rider Build', 'Kamen Rider OOO', 'Rider Kick', 'Rider Punch',
                    'Henshin!', 'Contra-ataque', 'Final Attack Ride', 'Kamen Rider Kuuga',
                    'Kamen Rider Ryuki', 'Kamen Rider Faiz', 'Kamen Rider W'
                ];
                const obtained = [];
                for (let i = 0; i < 3; i++) {
                    const card = cardPool[Math.floor(Math.random() * cardPool.length)];
                    if (!obtained.includes(card)) obtained.push(card);
                }
                const state = KR.Game.getState();
                const current = state.duelCards || ['Kamen Rider 1', 'Henshin!', 'Rider Kick', 'Kamen Rider BLACK', 'Ciclo de Proteção'];
                for (const card of obtained) {
                    if (!current.includes(card)) current.push(card);
                }
                state.duelCards = current;
                KR.Game.save();
                KR.UI.notify(`Booster aberto! Novas cartas: ${obtained.join(', ')}`, '📦');
                KR.Inventory.render();
            }
        },
        legendary_evolution_core: {
            id: 'legendary_evolution_core', name: '⚛️ Núcleo de Evolução Lendária', icon: '⚛️',
            desc: 'Fragmento da linha do tempo restaurada. Permite evoluir permanentemente uma carta do seu deck.',
            type: 'legendary', usable: true,
            use: () => {
                if (!window.KR.Duel || typeof KR.Duel.evolveCard !== 'function') {
                    KR.UI.notify('Sistema de evolução não disponível. Recarregue a página.', '⚠️');
                    return;
                }
                const state = KR.Game.getState();
                const deck = state.duelCards || [];
                const evolvable = deck.filter(cardId => {
                    const cardData = KR.Duel.CARDS_DB?.[cardId];
                    const evolvedExists = KR.Duel.CARDS_DB?.[cardId + '_EVOLVED'];
                    return cardData && cardData.type === 'rider' && evolvedExists;
                });
                if (evolvable.length === 0) {
                    KR.UI.notify('Você não tem cartas de Rider que podem ser evoluídas!', '⚠️');
                    return;
                }
                const modalHtml = `
                    <div class="modal-lore-title">⚛️ ESCOLHA UMA CARTA PARA EVOLUIR</div>
                    <div style="display:flex; flex-direction:column; gap:8px; max-height:300px; overflow-y:auto;">
                        ${evolvable.map(cardId => {
                            const data = KR.Duel.CARDS_DB[cardId];
                            return `<button class="btn evolve-card-btn" data-card="${cardId}">${data.icon || '🃏'} ${cardId} (ATK ${data.atk} / DEF ${data.def})</button>`;
                        }).join('')}
                    </div>
                    <button class="btn" id="cancel-evolve">CANCELAR</button>
                `;
                KR.UI.openModal(modalHtml);
                setTimeout(() => {
                    document.querySelectorAll('.evolve-card-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const cardId = btn.dataset.card;
                            const evolved = KR.Duel.evolveCard(cardId);
                            if (evolved) {
                                KR.UI.closeModal();
                                KR.UI.notify(`✨ ${cardId} evoluiu para ${evolved.name}! Agora pode ativar HAZARD MODE.`, '⭐');
                                KR.Game.removeItem('legendary_evolution_core');
                                KR.Inventory.render();
                            } else {
                                KR.UI.notify(`Falha ao evoluir ${cardId}.`, '❌');
                            }
                        });
                    });
                    document.getElementById('cancel-evolve')?.addEventListener('click', () => KR.UI.closeModal());
                }, 50);
            }
        },
        skip_puzzle_key: {
            id: 'skip_puzzle_key', name: '🔓 Chave do Cofre', icon: '🔑',
            desc: 'Permite resolver um puzzle instantaneamente.',
            type: 'reward', usable: true,
            use: () => {
                KR.UI.notify('Use esta chave clicando em um puzzle bloqueado!', '🔓');
                KR.Game.getState().skipPuzzleAvailable = true;
                KR.Game.save();
                KR.Inventory.render();
            }
        },

        // ---------- CARTAS COLECIONÁVEIS (para o Livro de Cartas) ----------
        card_vintage_1_item: {
            id: 'card_vintage_1_item', name: 'Carta: Rider 1 (1971)', icon: '🃏',
            desc: 'Carta raríssima da primeira edição.', type: 'legendary', usable: false
        },
        card_vintage_2_item: {
            id: 'card_vintage_2_item', name: 'Carta: BLACK (1987)', icon: '🌑',
            desc: 'Cromo original da série BLACK.', type: 'legendary', usable: false
        },
        card_kuuga_item: {
            id: 'card_kuuga_item', name: 'Carta: Kuuga Mighty', icon: '💪',
            desc: 'Data Carddass 2000 – o primeiro Rider Heisei.', type: 'reward', usable: false
        },
        card_ryuki_item: {
            id: 'card_ryuki_item', name: 'Carta: Ryuki & Dragreder', icon: '🐉',
            desc: 'Carta com Mirror Monster.', type: 'reward', usable: false
        },
        card_faiz_item: {
            id: 'card_faiz_item', name: 'Carta: Faiz Blaster', icon: '⚡',
            desc: 'Código 555 – poder máximo.', type: 'reward', usable: false
        },
        card_w_item: {
            id: 'card_w_item', name: 'Carta: W CycloneJoker', icon: '🔌',
            desc: 'Double Driver ativado!', type: 'reward', usable: false
        },
        card_ooo_item: {
            id: 'card_ooo_item', name: 'Carta: OOO TaToBa', icon: '🪙',
            desc: 'Medalhas da alquimia.', type: 'reward', usable: false
        },
        card_build_item: {
            id: 'card_build_item', name: 'Carta: Build Hazard', icon: '🧪',
            desc: 'Cuidado com o Hazard Trigger!', type: 'reward', usable: false
        },
        card_geats_item: {
            id: 'card_geats_item', name: 'Carta: Geats Boost', icon: '🦊',
            desc: 'Grande Prêmio do Desejo.', type: 'reward', usable: false
        },
        card_gotchard_item: {
            id: 'card_gotchard_item', name: 'Carta: Gotchard', icon: '🃏',
            desc: 'Alquimia e Chemy Cards.', type: 'reward', usable: false
        },
        card_sign_fujioka: {
            id: 'card_sign_fujioka', name: 'Assinatura – Hiroshi Fujioka', icon: '✍️',
            desc: 'Autógrafo do Rider 1 original.', type: 'legendary', usable: false
        },
        card_sign_ishinomori: {
            id: 'card_sign_ishinomori', name: 'Assinatura – Shotaro Ishinomori', icon: '✍️',
            desc: 'O criador. Item lendário.', type: 'legendary', usable: false
        },
        card_50th: {
            id: 'card_50th', name: '50 Anos – Platinum', icon: '🏆',
            desc: 'Carta comemorativa banhada a platina.', type: 'legendary', usable: false
        },
        card_50th_gold: {
            id: 'card_50th_gold', name: '50 Anos – Gold', icon: '🥇',
            desc: 'Carta comemorativa banhada a ouro.', type: 'legendary', usable: false
        }
    };

    // =========================================================================
    // 2. SORT MODE (persistente)
    // =========================================================================
    let sortMode = 'default';
    const TYPE_ORDER = { legendary: 0, reward: 1, key: 2, lore: 3 };

    function saveSortMode() {
        try {
            localStorage.setItem('kr_inventory_sort', sortMode);
        } catch (e) {}
    }

    function loadSortMode() {
        try {
            const saved = localStorage.getItem('kr_inventory_sort');
            sortMode = (saved === 'type') ? 'type' : 'default';
        } catch (e) {}
    }

    // =========================================================================
    // 3. RENDER INVENTORY (com cache eficiente)
    // =========================================================================
    let lastItemsHash = '';
    let lastSortMode = '';

    function render() {
        const grid = document.getElementById('inventory-grid');
        const countEl = document.getElementById('item-count');
        const hintEl = document.getElementById('inventory-hint');

        if (!grid) return;

        const itemIds = KR.Game.getItems();
        const itemCount = itemIds.length;

        if (countEl) countEl.textContent = itemCount;

        // Dica especial para combinar fragmentos
        if (hintEl) {
            if (KR.Game.canCombineOmega && KR.Game.canCombineOmega() && !KR.Game.hasItem('omega_core')) {
                hintEl.textContent = '⚛️ Todos os Fragmentos! Vá ao Hall de Crossovers.';
                hintEl.style.color = 'var(--era-secret)';
            } else {
                hintEl.textContent = '';
            }
        }

        if (itemCount === 0) {
            grid.innerHTML = '<div class="inventory-empty-msg">[ VAZIO ]</div>';
            lastItemsHash = '';
            return;
        }

        // Ordenação por tipo, se solicitado
        let sorted = [...itemIds];
        if (sortMode === 'type') {
            sorted.sort((a, b) => {
                const da = ITEMS_DB[a];
                const db = ITEMS_DB[b];
                const orderA = da?.type ? TYPE_ORDER[da.type] : 9;
                const orderB = db?.type ? TYPE_ORDER[db.type] : 9;
                if (orderA !== orderB) return orderA - orderB;
                const nameA = da?.name || a;
                const nameB = db?.name || b;
                return nameA.localeCompare(nameB);
            });
        }

        const currentHash = sorted.join(',');
        const currentSort = sortMode;
        if (lastItemsHash === currentHash && lastSortMode === currentSort && grid.children.length === sorted.length) {
            return; // nada mudou
        }
        lastItemsHash = currentHash;
        lastSortMode = currentSort;

        const fragment = document.createDocumentFragment();
        for (const id of sorted) {
            const data = ITEMS_DB[id];
            if (!data) continue;

            const slot = document.createElement('div');
            slot.className = 'inv-slot';
            slot.dataset.itemId = id;
            slot.setAttribute('data-tooltip', data.name);
            slot.setAttribute('aria-label', data.name);
            slot.setAttribute('role', 'button');
            slot.setAttribute('tabindex', '0');

            // Estilo especial baseado no tipo
            if (data.type === 'legendary') {
                slot.style.borderColor = 'var(--era-secret)';
                slot.style.boxShadow = '0 0 8px var(--era-secret-glow)';
            } else if (data.type === 'reward') {
                slot.style.borderColor = '#27ae60';
                slot.style.background = 'rgba(39,174,96,0.05)';
            } else if (data.type === 'key') {
                slot.style.borderColor = 'rgba(241,196,15,0.35)';
            }

            slot.innerHTML = `<span class="inv-slot-icon">${data.icon}</span><span class="inv-slot-name">${data.name.split(' ')[0]}</span>`;
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                inspectItem(id);
            });
            slot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === 'Space') {
                    e.preventDefault();
                    inspectItem(id);
                }
            });
            fragment.appendChild(slot);
        }

        grid.innerHTML = '';
        grid.appendChild(fragment);
        if (KR.UI && KR.UI.updateLeftPanel) KR.UI.updateLeftPanel();
    }

    // =========================================================================
    // 4. INSPECT ITEM (modal + uso)
    // =========================================================================
    function inspectItem(itemId) {
        const data = ITEMS_DB[itemId];
        if (!data) return;

        const modalHtml = `
            <div class="item-inspect">
                <span class="item-inspect-icon">${data.icon}</span>
                <div class="item-inspect-name">${data.name}</div>
                <span class="item-inspect-type">${data.type.toUpperCase()}</span>
                <p class="item-inspect-desc">${data.desc}</p>
                ${data.usable ? `<button class="btn btn-primary" id="use-item-btn" style="margin-top:12px;">📦 USAR ITEM</button>` : ''}
            </div>
        `;
        KR.UI.openModal(modalHtml);

        if (data.usable) {
            setTimeout(() => {
                const useBtn = document.getElementById('use-item-btn');
                if (useBtn) {
                    useBtn.onclick = () => {
                        KR.UI.closeModal();
                        if (data.use) data.use();
                        else KR.UI.notify('Este item não tem ação definida.', '⚠️');
                    };
                }
            }, 50);
        }
    }

    // =========================================================================
    // 5. AUXILIARES PÚBLICOS
    // =========================================================================
    function setSortMode(mode) {
        if (mode === 'type' || mode === 'default') {
            sortMode = mode;
            saveSortMode();
            render();
        }
    }

    function getSortMode() {
        return sortMode;
    }

    function getItemData(id) {
        return ITEMS_DB[id] || null;
    }

    function getAllItemsDB() {
        return { ...ITEMS_DB };
    }

    // Wrappers que chamam KR.Game e atualizam a UI
    function addItem(id) {
        const added = KR.Game.addItem(id);
        if (added) {
            render();
            if (KR.UI && KR.UI.updateLeftPanel) KR.UI.updateLeftPanel();
            if (KR.UI && KR.UI.checkAchievements) KR.UI.checkAchievements();
        }
        return added;
    }

    function hasItem(id) {
        return KR.Game.hasItem(id);
    }

    function removeItem(id) {
        const removed = KR.Game.removeItem(id);
        if (removed) {
            render();
            if (KR.UI && KR.UI.updateLeftPanel) KR.UI.updateLeftPanel();
        }
        return removed;
    }

    // =========================================================================
    // 6. INITIALIZATION
    // =========================================================================
    loadSortMode();

    // Aguarda o DOM estar pronto para renderizar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => render());
    } else {
        setTimeout(() => render(), 0);
    }

    // =========================================================================
    // 7. EXPOSED API
    // =========================================================================
    return {
        render,
        inspectItem,
        getItemData,
        getAllItemsDB,
        setSortMode,
        getSortMode,
        addItem,
        hasItem,
        removeItem
    };
})();