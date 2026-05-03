window.KR = window.KR || {};
KR.Events = (() => {
    'use strict';

    // =========================================================================
    // 1. PUZZLES DEFINITION (mantido do original, com todos os puzzles)
    // =========================================================================
    const PUZZLES = {
        // ---------- match: moto → rider ----------
        match: {
            title: '🏍️ Liga a Moto ao Rider',
            build(c, solve) {
                const pairs = [
                    { a: 'Cyclone', b: 'Kamen Rider 1' },
                    { a: 'Battle Hopper', b: 'Kamen Rider BLACK' },
                    { a: 'HardBoilder', b: 'Kamen Rider W' },
                    { a: 'Ride Chaser', b: 'Kamen Rider Drive' }
                ];
                const leftItems = [...pairs].sort(() => Math.random() - 0.5);
                const rightItems = [...pairs].sort(() => Math.random() - 0.5);
                let selected = null;
                const matches = {};

                c.innerHTML = `
                    <div class="pz-title">🏍️ Liga a Moto ao Rider</div>
                    <div class="pz-subtitle">Clique numa moto, depois no Rider correspondente.</div>
                    <div class="pz-match-wrap">
                        <div class="pz-col" id="mc"></div>
                        <div class="pz-col" id="rc"></div>
                    </div>
                    <div class="pz-feedback" id="pzf"></div>
                    <button class="btn btn-primary" id="pzck">✓ VERIFICAR</button>
                `;

                const leftCol = c.querySelector('#mc');
                const rightCol = c.querySelector('#rc');

                leftItems.forEach(p => {
                    const btn = document.createElement('button');
                    btn.className = 'pz-item pz-moto';
                    btn.textContent = '🏍️ ' + p.a;
                    btn.dataset.key = p.a;
                    btn.onclick = () => {
                        c.querySelectorAll('.pz-moto').forEach(x => x.classList.remove('pz-selected'));
                        btn.classList.add('pz-selected');
                        selected = p.a;
                    };
                    leftCol.appendChild(btn);
                });

                rightItems.forEach(p => {
                    const btn = document.createElement('button');
                    btn.className = 'pz-item pz-rider';
                    btn.textContent = '🦸 ' + p.b;
                    btn.onclick = () => {
                        if (!selected) {
                            c.querySelector('#pzf').textContent = 'Selecione uma moto primeiro!';
                            return;
                        }
                        matches[selected] = p.b;
                        c.querySelectorAll('.pz-moto').forEach(x => {
                            if (x.dataset.key === selected) x.classList.add('pz-matched');
                        });
                        btn.classList.add('pz-matched');
                        selected = null;
                        c.querySelectorAll('.pz-moto').forEach(x => x.classList.remove('pz-selected'));
                    };
                    rightCol.appendChild(btn);
                });

                c.querySelector('#pzck').onclick = () => {
                    if (pairs.every(p => matches[p.a] === p.b)) {
                        const fb = c.querySelector('#pzf');
                        fb.style.color = '#27ae60';
                        fb.textContent = '✅ Perfeito!';
                        setTimeout(solve, 700);
                    } else {
                        const fb = c.querySelector('#pzf');
                        fb.style.color = '#e74c3c';
                        fb.textContent = '❌ Alguma está errada!';
                    }
                };
            }
        },

        // ---------- sequence: ordem cronológica ----------
        sequence: {
            title: '⏱ Sequência Cronológica',
            build(c, solve) {
                const correct = ['Kamen Rider 1', 'Kamen Rider V3', 'Kamen Rider BLACK', 'Kamen Rider Kuuga', 'Kamen Rider Faiz'];
                let order = [...correct].sort(() => Math.random() - 0.5);

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">⏱ Sequência Cronológica</div>
                        <div class="pz-subtitle">Ordene do mais antigo ao mais recente usando ▲▼</div>
                        <div class="pz-seq-list" id="sl"></div>
                        <div class="pz-feedback" id="pzf2"></div>
                        <button class="btn btn-primary" id="pzsc">✓ VERIFICAR</button>
                    `;
                    const list = c.querySelector('#sl');
                    order.forEach((name, i) => {
                        const row = document.createElement('div');
                        row.className = 'pz-seq-row';
                        row.innerHTML = `
                            <span class="pz-seq-num">${i + 1}</span>
                            <span class="pz-seq-name">${name}</span>
                            <div class="pz-seq-btns">
                                <button class="pz-arr" data-d="up" data-i="${i}">▲</button>
                                <button class="pz-arr" data-d="down" data-i="${i}">▼</button>
                            </div>
                        `;
                        list.appendChild(row);
                    });

                    list.querySelectorAll('.pz-arr').forEach(btn => {
                        btn.onclick = () => {
                            const i = +btn.dataset.i;
                            const dir = btn.dataset.d;
                            if (dir === 'up' && i > 0) [order[i], order[i - 1]] = [order[i - 1], order[i]];
                            if (dir === 'down' && i < order.length - 1) [order[i], order[i + 1]] = [order[i + 1], order[i]];
                            render();
                        };
                    });

                    c.querySelector('#pzsc').onclick = () => {
                        if (JSON.stringify(order) === JSON.stringify(correct)) {
                            const fb = c.querySelector('#pzf2');
                            fb.style.color = '#27ae60';
                            fb.textContent = '✅ Correto!';
                            setTimeout(solve, 700);
                        } else {
                            const fb = c.querySelector('#pzf2');
                            fb.style.color = '#e74c3c';
                            fb.textContent = '❌ Ordem incorreta!';
                        }
                    };
                };
                render();
            }
        },

        // ---------- code: código do arquivo (5239) ----------
        code: {
            title: '🔐 Código do Arquivo',
            build(c, solve) {
                c.innerHTML = `
                    <div class="pz-title">🔐 Código do Arquivo</div>
                    <div class="pz-subtitle">Pistas nas alas Showa e Heisei...<br><em>Showa: '52' | Heisei: '39'</em></div>
                    <div class="pz-code-wrap"><input class="pz-code-input" id="pci" maxlength="6" placeholder="_ _ _ _ _ _" autocomplete="off"></div>
                    <div class="pz-feedback" id="pzf3"></div>
                    <button class="btn btn-primary" id="pzcc">✓ CONFIRMAR</button>
                `;
                const check = () => {
                    const val = c.querySelector('#pci').value.replace(/\D/g, '');
                    if (val === '5239') {
                        const fb = c.querySelector('#pzf3');
                        fb.style.color = '#27ae60';
                        fb.textContent = '✅ Acesso concedido!';
                        setTimeout(solve, 700);
                    } else {
                        const fb = c.querySelector('#pzf3');
                        fb.style.color = '#e74c3c';
                        fb.textContent = '❌ Código incorreto.';
                    }
                };
                c.querySelector('#pzcc').onclick = check;
                c.querySelector('#pci').addEventListener('keydown', e => e.key === 'Enter' && check());
            }
        },

        // ---------- quiz: 5 perguntas ----------
        quiz: {
            title: '🎓 Quiz Kamen Rider',
            build(c, solve) {
                const questions = [
                    { q: 'Qual é o grito padrão de transformação?', o: ['HENSHIN!', 'TRANSFORM!', 'RIDER KICK!', 'POWER UP!'], a: 0 },
                    { q: 'Em que ano estreou o primeiro Kamen Rider?', o: ['1965', '1971', '1975', '1980'], a: 1 },
                    { q: 'Quem criou Kamen Rider?', o: ['Toshiki Inoue', 'Yasuko Kobayashi', 'Shotaro Ishinomori', 'Go Nagai'], a: 2 },
                    { q: 'Qual Rider estreou a Era Heisei em 2000?', o: ['Agito', 'Faiz', 'Kuuga', 'Ryuki'], a: 2 },
                    { q: 'Qual organização era o vilão original de 1971?', o: ['Gorgom', 'Destron', 'SHOCKER', 'Dai-Shocker'], a: 2 }
                ];
                let idx = 0, score = 0;

                const render = () => {
                    if (idx >= questions.length) {
                        const ok = score >= 4;
                        c.innerHTML = `
                            <div class="pz-title">Resultado: ${score}/5</div>
                            <div class="pz-quiz-result ${ok ? 'pz-pass' : 'pz-fail'}">${ok ? '✅ Excelente! Verdadeiro agente Rider!' : '❌ Insuficiente. Estude mais os arquivos.'}</div>
                            ${ok ? '<button class="btn btn-primary" id="qd">✓ CONCLUIR</button>' : '<button class="btn" id="qr">↺ TENTAR DE NOVO</button>'}
                        `;
                        if (ok) c.querySelector('#qd').onclick = solve;
                        else c.querySelector('#qr').onclick = () => { idx = 0; score = 0; render(); };
                        return;
                    }

                    const q = questions[idx];
                    c.innerHTML = `
                        <div class="pz-title">🎓 Pergunta ${idx + 1}/5</div>
                        <div class="pz-quiz-q">${q.q}</div>
                        <div class="pz-quiz-opts" id="qo"></div>
                        <div class="pz-score">Score: ${score}/${idx}</div>
                    `;
                    const optsDiv = c.querySelector('#qo');
                    q.o.forEach((opt, i) => {
                        const btn = document.createElement('button');
                        btn.className = 'pz-quiz-opt';
                        btn.textContent = opt;
                        btn.onclick = () => {
                            c.querySelectorAll('.pz-quiz-opt').forEach(x => x.disabled = true);
                            if (i === q.a) {
                                btn.classList.add('pz-opt-correct');
                                score++;
                            } else {
                                btn.classList.add('pz-opt-wrong');
                                c.querySelectorAll('.pz-quiz-opt')[q.a].classList.add('pz-opt-correct');
                            }
                            setTimeout(() => { idx++; render(); }, 900);
                        };
                        optsDiv.appendChild(btn);
                    });
                };
                render();
            }
        },

        // ---------- henshin_type: digitar HENSHIN ----------
        henshin_type: {
            title: '変身 Grito Henshin',
            build(c, solve) {
                let attempts = 0;
                c.innerHTML = `
                    <div class="pz-title" style="font-size:1.5rem;letter-spacing:0.3em;color:var(--era-current)">変身</div>
                    <div class="pz-subtitle">Você é um Rider agora.<br>Prove digitando o grito de transformação em MAIÚSCULAS:</div>
                    <div class="pz-code-wrap"><input class="pz-code-input" id="hti" maxlength="10" placeholder="_ _ _ _ _ _ _" autocomplete="off" style="font-size:1.8rem;letter-spacing:0.4em"></div>
                    <div class="pz-feedback" id="hfb" style="font-size:1rem;min-height:30px"></div>
                    <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-micro);margin-top:8px">Tentativas: <span id="hat">0</span></div>
                `;
                const input = c.querySelector('#hti');
                const fb = c.querySelector('#hfb');
                const attemptSpan = c.querySelector('#hat');

                const check = () => {
                    attempts++;
                    attemptSpan.textContent = attempts;
                    const val = input.value.trim();
                    if (val === 'HENSHIN') {
                        fb.style.color = 'var(--era-secret)';
                        fb.style.fontSize = '1.5rem';
                        fb.textContent = '✦ HENSHIN! ✦';
                        input.style.color = 'var(--era-secret)';
                        input.style.boxShadow = '0 0 30px var(--era-secret-glow)';
                        if (KR.UI && KR.UI.triggerHenshin) KR.UI.triggerHenshin();
                        setTimeout(solve, 1200);
                    } else if (val.toLowerCase() === 'henshin') {
                        fb.style.color = '#e67e22';
                        fb.textContent = '⚠️ MAIÚSCULAS! Um Rider grita com força!';
                        input.value = '';
                    } else {
                        fb.style.color = '#e74c3c';
                        fb.textContent = '❌ Isso não é o grito certo. Você sabe qual é.';
                        input.value = '';
                    }
                };
                input.addEventListener('keydown', e => e.key === 'Enter' && check());
                input.focus();
            }
        },

        // ---------- quotes: qual rider disse ----------
        quotes: {
            title: '💬 Qual Rider disse?',
            build(c, solve) {
                const quotes = [
                    { quote: '"Eu luto para que ninguém precise chorar."', rider: 'Kamen Rider Kuuga', opts: ['Kamen Rider W', 'Kamen Rider Kuuga', 'Kamen Rider Gaim', 'Kamen Rider Build'] },
                    { quote: '"Uma meia pessoa não pode ser um detetive."', rider: 'Kamen Rider W', opts: ['Kamen Rider Drive', 'Kamen Rider Decade', 'Kamen Rider W', 'Kamen Rider Faiz'] },
                    { quote: '"Tendo nascido num mundo assim, é tudo bem eu querer mudar tudo?"', rider: 'Kamen Rider Gaim', opts: ['Kamen Rider Gaim', 'Kamen Rider Build', 'Kamen Rider Ghost', 'Kamen Rider Ex-Aid'] },
                    { quote: '"O melhor do mundo sou eu. Nesse momento, nesse lugar — o homem do céu!"', rider: 'Kamen Rider Kabuto', opts: ['Kamen Rider Kabuto', 'Kamen Rider OOO', 'Kamen Rider Blade', 'Kamen Rider Kiva'] },
                    { quote: '"Meu sonho era fazer as pessoas sorrirem. Então eu fui ser médico."', rider: 'Kamen Rider Ex-Aid', opts: ['Kamen Rider Ex-Aid', 'Kamen Rider Wizard', 'Kamen Rider Drive', 'Kamen Rider Zero-One'] }
                ];
                let idx = 0, score = 0;

                const render = () => {
                    if (idx >= quotes.length) {
                        const ok = score >= 4;
                        c.innerHTML = `
                            <div class="pz-title">Resultado: ${score}/5</div>
                            <div class="pz-quiz-result ${ok ? 'pz-pass' : 'pz-fail'}">${ok ? '✅ Você conhece os Riders de cor!' : '❌ Revise os terminais das eras.'}</div>
                            ${ok ? '<button class="btn btn-primary" id="qd">✓ CONCLUIR</button>' : '<button class="btn" id="qr">↺ TENTAR DE NOVO</button>'}
                        `;
                        if (ok) c.querySelector('#qd').onclick = solve;
                        else c.querySelector('#qr').onclick = () => { idx = 0; score = 0; render(); };
                        return;
                    }

                    const q = quotes[idx];
                    const shuffledOpts = [...q.opts].sort(() => Math.random() - 0.5);
                    c.innerHTML = `
                        <div class="pz-title">💬 Pergunta ${idx + 1}/5</div>
                        <div class="pz-quiz-q" style="font-style:italic;font-size:1.05rem">${q.quote}</div>
                        <div class="pz-quiz-opts" id="qo"></div>
                        <div class="pz-score">Score: ${score}/${idx}</div>
                    `;
                    const optsDiv = c.querySelector('#qo');
                    shuffledOpts.forEach(opt => {
                        const btn = document.createElement('button');
                        btn.className = 'pz-quiz-opt';
                        btn.textContent = opt;
                        btn.onclick = () => {
                            c.querySelectorAll('.pz-quiz-opt').forEach(x => x.disabled = true);
                            if (opt === q.rider) {
                                btn.classList.add('pz-opt-correct');
                                score++;
                            } else {
                                btn.classList.add('pz-opt-wrong');
                                const correctBtn = [...optsDiv.querySelectorAll('.pz-quiz-opt')].find(b => b.textContent === q.rider);
                                if (correctBtn) correctBtn.classList.add('pz-opt-correct');
                            }
                            setTimeout(() => { idx++; render(); }, 1000);
                        };
                        optsDiv.appendChild(btn);
                    });
                };
                render();
            }
        },

        // ---------- symbols: símbolos rider ----------
        symbols: {
            title: '⚜️ Símbolos Rider',
            build(c, solve) {
                const pairs = [
                    { sym: '🦗 Gafanhoto', rider: 'Kamen Rider 1 / Zero-One' },
                    { sym: '🌑 Pedra Negra', rider: 'Kamen Rider BLACK' },
                    { sym: '🦊 Raposa', rider: 'Kamen Rider Geats' },
                    { sym: '🌪️ W / Duplo', rider: 'Kamen Rider W' }
                ];
                const leftItems = [...pairs].sort(() => Math.random() - 0.5);
                const rightItems = [...pairs].sort(() => Math.random() - 0.5);
                let selected = null;
                const matches = {};

                c.innerHTML = `
                    <div class="pz-title">⚜️ Símbolos Rider</div>
                    <div class="pz-subtitle">Associe cada símbolo ao Rider correto.</div>
                    <div class="pz-match-wrap">
                        <div class="pz-col" id="mc2"></div>
                        <div class="pz-col" id="rc2"></div>
                    </div>
                    <div class="pz-feedback" id="pzfs"></div>
                    <button class="btn btn-primary" id="pzss">✓ VERIFICAR</button>
                `;
                const leftCol = c.querySelector('#mc2');
                const rightCol = c.querySelector('#rc2');

                leftItems.forEach(p => {
                    const btn = document.createElement('button');
                    btn.className = 'pz-item pz-moto';
                    btn.textContent = p.sym;
                    btn.dataset.key = p.sym;
                    btn.onclick = () => {
                        c.querySelectorAll('.pz-moto').forEach(x => x.classList.remove('pz-selected'));
                        btn.classList.add('pz-selected');
                        selected = p.sym;
                    };
                    leftCol.appendChild(btn);
                });

                rightItems.forEach(p => {
                    const btn = document.createElement('button');
                    btn.className = 'pz-item pz-rider';
                    btn.textContent = p.rider;
                    btn.onclick = () => {
                        if (!selected) return;
                        matches[selected] = p.rider;
                        c.querySelectorAll('.pz-moto').forEach(x => {
                            if (x.dataset.key === selected) x.classList.add('pz-matched');
                        });
                        btn.classList.add('pz-matched');
                        selected = null;
                        c.querySelectorAll('.pz-moto').forEach(x => x.classList.remove('pz-selected'));
                    };
                    rightCol.appendChild(btn);
                });

                c.querySelector('#pzss').onclick = () => {
                    if (pairs.every(p => matches[p.sym] === p.rider)) {
                        const fb = c.querySelector('#pzfs');
                        fb.style.color = '#27ae60';
                        fb.textContent = '✅ Perfeito!';
                        setTimeout(solve, 700);
                    } else {
                        const fb = c.querySelector('#pzfs');
                        fb.style.color = '#e74c3c';
                        fb.textContent = '❌ Alguma está errada!';
                    }
                };
            }
        },

        // ---------- memory: pareamento de formas ----------
        memory: {
            title: '🃏 Pareamento de Formas',
            build(c, solve) {
                const pairs = [
                    { base: 'Kuuga Mighty', final: 'Kuuga Ultimate' },
                    { base: 'W CycloneJoker', final: 'W CycloneJokerGold' },
                    { base: 'OOO TaToBa', final: 'OOO Super TaToBa' },
                    { base: 'Build RabbitTank', final: 'Build Genius' }
                ];
                const cards = [
                    ...pairs.map(p => ({ txt: p.base, id: p.base, group: p.base })),
                    ...pairs.map(p => ({ txt: p.final, id: p.final, group: p.base }))
                ].sort(() => Math.random() - 0.5);

                let flipped = [];
                let matched = new Set();
                let lock = false;

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">🃏 Pareamento de Formas</div>
                        <div class="pz-subtitle">Encontre a forma base e a forma final de cada Rider.</div>
                        <div class="pz-memory-grid" id="mg"></div>
                        <div class="pz-feedback" id="pzmf">Pares encontrados: ${matched.size / 2}/${pairs.length}</div>
                    `;
                    const grid = c.querySelector('#mg');
                    cards.forEach((card, i) => {
                        const isMatched = matched.has(card.id);
                        const isFlipped = flipped.includes(i);
                        const cardDiv = document.createElement('div');
                        cardDiv.className = `pz-mem-card ${isMatched ? 'pz-mem-matched' : ''} ${isFlipped ? 'pz-mem-open' : ''}`;
                        cardDiv.textContent = isMatched || isFlipped ? card.txt : '?';
                        cardDiv.dataset.i = i;

                        if (!isMatched && !isFlipped) {
                            cardDiv.onclick = () => {
                                if (lock || matched.has(card.id) || flipped.includes(i)) return;
                                flipped.push(i);
                                cardDiv.textContent = card.txt;
                                cardDiv.classList.add('pz-mem-open');

                                if (flipped.length === 2) {
                                    lock = true;
                                    const [a, b] = flipped.map(idx => cards[idx]);
                                    if (a.group === b.group) {
                                        matched.add(a.id);
                                        matched.add(b.id);
                                        flipped = [];
                                        lock = false;
                                        const feedback = c.querySelector('#pzmf');
                                        feedback.textContent = `Pares encontrados: ${matched.size / 2}/${pairs.length}`;
                                        if (matched.size === cards.length) {
                                            feedback.style.color = '#27ae60';
                                            feedback.textContent = '✅ Todos os pares encontrados!';
                                            setTimeout(solve, 700);
                                        } else {
                                            render();
                                        }
                                    } else {
                                        setTimeout(() => {
                                            flipped = [];
                                            lock = false;
                                            render();
                                        }, 1000);
                                    }
                                }
                            };
                        }
                        grid.appendChild(cardDiv);
                    });
                };
                render();
            }
        },

        // ---------- era_code: código das eras (7119) ----------
        era_code: {
            title: '🔢 Código das Eras',
            build(c, solve) {
                c.innerHTML = `
                    <div class="pz-title">🔢 Código das Eras</div>
                    <div class="pz-subtitle">Os anos de estreia das eras contêm um código.<br>
                    Showa começou em <em>1971</em>, Heisei em <em>2000</em>, Reiwa em <em>2019</em>.<br>
                    O código está nos extremos: primeiro e último dígito de Showa (1 e 1) e primeiro e último de Reiwa (2 e 9).<br>
                    Junte na ordem: primeiro de Showa, último de Showa, primeiro de Reiwa, último de Reiwa = 1 1 2 9? <br>
                    Tente também 1971 ou 7119.</div>
                    <div class="pz-code-wrap"><input class="pz-code-input" id="eci" maxlength="4" placeholder="_ _ _ _" autocomplete="off"></div>
                    <div class="pz-feedback" id="ecf"></div>
                    <button class="btn btn-primary" id="ecck">✓ CONFIRMAR</button>
                `;
                const check = () => {
                    const val = c.querySelector('#eci').value.replace(/\D/g, '');
                    if (val === '7119' || val === '1971') {
                        const fb = c.querySelector('#ecf');
                        fb.style.color = '#27ae60';
                        fb.textContent = '✅ Código correto! Era Showa decifrada.';
                        setTimeout(solve, 700);
                    } else {
                        const fb = c.querySelector('#ecf');
                        fb.style.color = '#e74c3c';
                        fb.textContent = '❌ Incorreto. Dica: tente 1971 ao contrário ou os extremos.';
                    }
                };
                c.querySelector('#ecck').onclick = check;
                c.querySelector('#eci').addEventListener('keydown', e => e.key === 'Enter' && check());
            }
        },

        // ---------- thirteen: ordenar 13 riders showa ----------
        thirteen: {
            title: '🔢 Os 13 Riders Showa',
            build(c, solve) {
                const correct = ['Kamen Rider 1', 'Kamen Rider 2', 'V3', 'Riderman', 'X', 'Amazon', 'Stronger', 'Skyrider', 'Super-1', 'ZX', 'BLACK', 'BLACK RX', 'Shin'];
                let order = [...correct].sort(() => Math.random() - 0.5);

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">🔢 Os 13 Riders Showa</div>
                        <div class="pz-subtitle">Ordene todos os 13 Riders da era Showa em ordem de estreia. Use ▲▼</div>
                        <div class="pz-seq-list" id="sl13" style="max-height:300px;overflow-y:auto"></div>
                        <div class="pz-feedback" id="pzf13"></div>
                        <button class="btn btn-primary" id="p13c">✓ VERIFICAR</button>
                    `;
                    const list = c.querySelector('#sl13');
                    order.forEach((name, i) => {
                        const row = document.createElement('div');
                        row.className = 'pz-seq-row';
                        row.innerHTML = `
                            <span class="pz-seq-num">${i + 1}</span>
                            <span class="pz-seq-name">${name}</span>
                            <div class="pz-seq-btns">
                                <button class="pz-arr" data-d="up" data-i="${i}">▲</button>
                                <button class="pz-arr" data-d="down" data-i="${i}">▼</button>
                            </div>
                        `;
                        list.appendChild(row);
                    });
                    list.querySelectorAll('.pz-arr').forEach(btn => {
                        btn.onclick = () => {
                            const i = +btn.dataset.i;
                            const dir = btn.dataset.d;
                            if (dir === 'up' && i > 0) [order[i], order[i - 1]] = [order[i - 1], order[i]];
                            if (dir === 'down' && i < order.length - 1) [order[i], order[i + 1]] = [order[i + 1], order[i]];
                            render();
                        };
                    });
                    c.querySelector('#p13c').onclick = () => {
                        if (JSON.stringify(order) === JSON.stringify(correct)) {
                            const fb = c.querySelector('#pzf13');
                            fb.style.color = '#27ae60';
                            fb.textContent = '✅ Ordem perfeita! Você conhece todos!';
                            setTimeout(solve, 800);
                        } else {
                            const fb = c.querySelector('#pzf13');
                            fb.style.color = '#e74c3c';
                            fb.textContent = '❌ Ordem incorreta. Revise a Ala Showa!';
                        }
                    };
                };
                render();
            }
        },

        // ---------- belt: driver quebrado (ordem) ----------
        belt: {
            title: '🔧 Driver Quebrado',
            build(c, solve) {
                const correct = ['① Gaia Memory A', '② Frame', '③ Gaia Memory B', '④ Trigger', '⑤ Release'];
                let order = [...correct].sort(() => Math.random() - 0.5);

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">🔧 Driver Quebrado</div>
                        <div class="pz-subtitle">Recoloque as peças do Double Driver na ordem correta.</div>
                        <div class="pz-seq-list" id="bsl"></div>
                        <div class="pz-feedback" id="bfb"></div>
                        <button class="btn btn-primary" id="bck">✓ VERIFICAR</button>
                    `;
                    const list = c.querySelector('#bsl');
                    order.forEach((name, i) => {
                        const row = document.createElement('div');
                        row.className = 'pz-seq-row';
                        row.innerHTML = `
                            <span class="pz-seq-num">${i + 1}</span>
                            <span class="pz-seq-name">${name}</span>
                            <div class="pz-seq-btns">
                                <button class="pz-arr" data-d="up" data-i="${i}">▲</button>
                                <button class="pz-arr" data-d="down" data-i="${i}">▼</button>
                            </div>
                        `;
                        list.appendChild(row);
                    });
                    list.querySelectorAll('.pz-arr').forEach(btn => {
                        btn.onclick = () => {
                            const i = +btn.dataset.i;
                            const dir = btn.dataset.d;
                            if (dir === 'up' && i > 0) [order[i], order[i - 1]] = [order[i - 1], order[i]];
                            if (dir === 'down' && i < order.length - 1) [order[i], order[i + 1]] = [order[i + 1], order[i]];
                            render();
                        };
                    });
                    c.querySelector('#bck').onclick = () => {
                        if (JSON.stringify(order) === JSON.stringify(correct)) {
                            const fb = c.querySelector('#bfb');
                            fb.style.color = '#27ae60';
                            fb.textContent = '✅ Driver reconstruído com sucesso!';
                            setTimeout(solve, 700);
                        } else {
                            const fb = c.querySelector('#bfb');
                            fb.style.color = '#e74c3c';
                            fb.textContent = '❌ Ordem incorreta. O Driver não ativou!';
                        }
                    };
                };
                render();
            }
        },

        // ---------- episodes: ordem cronológica de episódios ----------
        episodes: {
            title: '📅 Ordem dos Episódios',
            build(c, solve) {
                const correct = ['KR1 vs. Shocker (1972)', 'Kamen Rider BLACK Ep.01 (1987)', 'Kuuga Ep.01 (2000)', 'W Ep.01 (2009)', 'SHIN Kamen Rider (2023)'];
                let order = [...correct].sort(() => Math.random() - 0.5);

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">📅 Ordem Cronológica</div>
                        <div class="pz-subtitle">Ordene esses marcos da história Rider do mais antigo ao mais recente.</div>
                        <div class="pz-seq-list" id="esl"></div>
                        <div class="pz-feedback" id="efb"></div>
                        <button class="btn btn-primary" id="eck">✓ VERIFICAR</button>
                    `;
                    const list = c.querySelector('#esl');
                    order.forEach((name, i) => {
                        const row = document.createElement('div');
                        row.className = 'pz-seq-row';
                        row.innerHTML = `
                            <span class="pz-seq-num">${i + 1}</span>
                            <span class="pz-seq-name">${name}</span>
                            <div class="pz-seq-btns">
                                <button class="pz-arr" data-d="up" data-i="${i}">▲</button>
                                <button class="pz-arr" data-d="down" data-i="${i}">▼</button>
                            </div>
                        `;
                        list.appendChild(row);
                    });
                    list.querySelectorAll('.pz-arr').forEach(btn => {
                        btn.onclick = () => {
                            const i = +btn.dataset.i;
                            const dir = btn.dataset.d;
                            if (dir === 'up' && i > 0) [order[i], order[i - 1]] = [order[i - 1], order[i]];
                            if (dir === 'down' && i < order.length - 1) [order[i], order[i + 1]] = [order[i + 1], order[i]];
                            render();
                        };
                    });
                    c.querySelector('#eck').onclick = () => {
                        if (JSON.stringify(order) === JSON.stringify(correct)) {
                            const fb = c.querySelector('#efb');
                            fb.style.color = '#27ae60';
                            fb.textContent = '✅ Ordem perfeita!';
                            setTimeout(solve, 700);
                        } else {
                            const fb = c.querySelector('#efb');
                            fb.style.color = '#e74c3c';
                            fb.textContent = '❌ Ordem incorreta!';
                        }
                    };
                };
                render();
            }
        },

        // ---------- wordsearch: caça-palavras (CORRIGIDO + dica) ----------
        wordsearch: {
            title: '🔍 Caça-Palavras Rider',
            build(c, solve) {
                // Grade 10x10 ajustada para conter 'BATTLE' horizontalmente na linha 4
                const grid = [
                    ['K', 'R', 'I', 'D', 'E', 'R', 'X', 'S', 'H', 'O'],
                    ['H', 'E', 'N', 'S', 'H', 'I', 'N', 'C', 'Y', 'C'],
                    ['S', 'C', 'Y', 'C', 'L', 'O', 'N', 'E', 'B', 'E'],
                    ['M', 'A', 'S', 'K', 'E', 'D', 'F', 'A', 'I', 'Z'],
                    ['B', 'A', 'T', 'T', 'L', 'E', 'F', 'O', 'O', 'O'],  // BATTLE
                    ['C', 'Y', 'B', 'O', 'R', 'G', 'G', 'U', 'S', 'A'],
                    ['R', 'I', 'D', 'E', 'R', 'K', 'I', 'C', 'K', 'P'],
                    ['G', 'O', 'R', 'G', 'O', 'M', 'R', 'U', 'Y', 'U'],
                    ['S', 'H', 'O', 'C', 'K', 'E', 'R', 'A', 'R', 'T'],
                    ['K', 'U', 'U', 'G', 'A', 'R', 'O', 'D', 'E', 'N']
                ];
                const words = ['RIDER', 'HENSHIN', 'CYCLONE', 'BATTLE', 'CYBORG', 'SHOCKER', 'GORGOM', 'KUUGA', 'FAIZ', 'RIDERKICK'];
                let found = new Array(words.length).fill(false);

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">🔍 Caça-Palavras Rider</div>
                        <div class="pz-subtitle">Encontre as palavras na grade. Clique na primeira e última letra de cada palavra.</div>
                        <div class="pz-subtitle" style="font-size:0.7rem; color:var(--text-micro); margin-top:-8px;">
                            💡 Como jogar: clique na PRIMEIRA letra da palavra, depois na ÚLTIMA letra.
                        </div>
                        <div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;">
                            <div id="ws-grid" style="display:grid;grid-template-columns:repeat(10,35px);gap:2px;background:var(--bg-mid);padding:10px;border-radius:6px;"></div>
                            <div id="ws-words" style="background:var(--bg-panel);padding:12px;border-radius:6px;min-width:140px;"></div>
                        </div>
                        <div class="pz-feedback" id="ws-fb"></div>
                        <button class="btn btn-primary" id="ws-check" ${found.every(v => v) ? '' : 'disabled'}>✅ CONCLUIR</button>
                    `;
                    const gridDiv = c.querySelector('#ws-grid');
                    const wordsDiv = c.querySelector('#ws-words');
                    wordsDiv.innerHTML = '<div style="font-family:var(--font-mono);font-size:0.7rem;margin-bottom:6px;">PALAVRAS:</div>' +
                        words.map((w, i) => `<div style="font-family:var(--font-mono);font-size:0.7rem;${found[i] ? 'color:#27ae60;text-decoration:line-through;' : ''}">${w}</div>`).join('');

                    let selection = { active: false, start: null };
                    for (let r = 0; r < 10; r++) {
                        for (let c_ = 0; c_ < 10; c_++) {
                            const cell = document.createElement('div');
                            cell.textContent = grid[r][c_];
                            cell.style.cssText = 'width:35px;height:35px;display:flex;align-items:center;justify-content:center;background:var(--bg-mid);border:1px solid var(--border-dim);font-family:var(--font-mono);font-size:0.75rem;cursor:pointer;transition:0.1s';
                            cell.dataset.r = r;
                            cell.dataset.c = c_;
                            cell.onclick = (() => {
                                const rr = r, cc = c_;
                                if (!selection.active) {
                                    selection.active = true;
                                    selection.start = { r: rr, c: cc };
                                    cell.style.backgroundColor = 'var(--era-current-bg)';
                                } else {
                                    const sr = selection.start.r, sc = selection.start.c;
                                    let dr = rr - sr, dc = cc - sc;
                                    const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
                                    dr = dr === 0 ? 0 : dr / Math.abs(dr);
                                    dc = dc === 0 ? 0 : dc / Math.abs(dc);
                                    let wordFound = '';
                                    for (let i = 0; i < len; i++) {
                                        const nr = sr + i * dr, nc = sc + i * dc;
                                        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) wordFound += grid[nr][nc];
                                    }
                                    const idx = words.findIndex(w => w === wordFound);
                                    if (idx !== -1 && !found[idx]) {
                                        found[idx] = true;
                                        wordsDiv.children[idx + 1].style.color = '#27ae60';
                                        wordsDiv.children[idx + 1].style.textDecoration = 'line-through';
                                        const fb = c.querySelector('#ws-fb');
                                        fb.textContent = `✅ Palavra "${wordFound}" encontrada!`;
                                        fb.style.color = '#27ae60';
                                        if (found.every(v => v)) {
                                            c.querySelector('#ws-check').disabled = false;
                                            fb.textContent = '🏆 Todas as palavras encontradas! Clique em CONCLUIR.';
                                        }
                                    } else {
                                        const fb = c.querySelector('#ws-fb');
                                        fb.textContent = `❌ "${wordFound}" não está na lista.`;
                                        fb.style.color = '#e74c3c';
                                    }
                                    selection.active = false;
                                    if (selection.start) gridDiv.querySelectorAll('div').forEach(div => div.style.backgroundColor = '');
                                    selection.start = null;
                                }
                            });
                            gridDiv.appendChild(cell);
                        }
                    }
                    c.querySelector('#ws-check').onclick = () => found.every(v => v) && solve();
                };
                render();
            }
        },

        // ---------- cipher: cifra SHOCKER (CORRIGIDO) ----------
        cipher: {
            title: '🔐 Cifra SHOCKER',
            build(c, solve) {
                const code = "KRVWHU WKH KHDGV?";
                const answer = "HOPPER THE HEADS?";
                let attempts = 0;
                c.innerHTML = `
                    <div class="pz-title">🔐 Cifra SHOCKER</div>
                    <div class="pz-subtitle">As mensagens do SHOCKER são codificadas. Decifre: <strong style="color:var(--era-current)">${code}</strong></div>
                    <div class="pz-code-wrap"><input class="pz-code-input" id="ci" placeholder="Digite a mensagem decifrada" autocomplete="off" style="font-size:1rem;letter-spacing:normal;"></div>
                    <div class="pz-feedback" id="cfb"></div>
                    <div style="font-family:var(--font-mono);font-size:0.65rem;margin:8px 0;">💡 Dica: deslocamento de letras (Caesar) usado pelos espiões da Showa. Shift -3.</div>
                    <button class="btn btn-primary" id="cch">✓ VERIFICAR</button>
                `;
                const input = c.querySelector('#ci');
                const fb = c.querySelector('#cfb');
                const check = () => {
                    attempts++;
                    const val = input.value.trim().toUpperCase();
                    if (val === answer.toUpperCase()) {
                        fb.style.color = '#27ae60';
                        fb.textContent = '✅ Decifrado! Mensagem interceptada.';
                        setTimeout(solve, 700);
                    } else {
                        fb.style.color = '#e74c3c';
                        fb.textContent = `❌ Incorreto (tentativa ${attempts}). Tente um deslocamento de letras.`;
                    }
                };
                c.querySelector('#cch').onclick = check;
                input.addEventListener('keydown', e => e.key === 'Enter' && check());
            }
        },

        // ---------- rider_math: enigma dos números ----------
        rider_math: {
            title: '🧮 Enigma dos Números Rider',
            build(c, solve) {
                c.innerHTML = `
                    <div class="pz-title">🧮 Enigma dos Números Rider</div>
                    <div class="pz-subtitle">Descubra o valor de cada símbolo Rider para encontrar o resultado final.</div>
                    <div style="background:var(--bg-mid);padding:16px;border-radius:8px;margin:10px 0;font-family:var(--font-mono);">
                        🦗 + 🦗 + 🦗 = 60<br>
                        🦗 + 🌑 + 🌑 = 40<br>
                        🌑 + 🏍️ + 🏍️ = 50<br>
                        🦗 + 🌑 × 🏍️ = ?
                    </div>
                    <div class="pz-code-wrap"><input class="pz-code-input" id="mathAns" placeholder="Digite o número" autocomplete="off" style="font-size:1.4rem;width:120px;"></div>
                    <div class="pz-feedback" id="mathFb"></div>
                    <button class="btn btn-primary" id="mathBtn">✓ VERIFICAR</button>
                `;
                const check = () => {
                    const val = parseInt(c.querySelector('#mathAns').value, 10);
                    if (val === 220) {
                        const fb = c.querySelector('#mathFb');
                        fb.style.color = '#27ae60';
                        fb.textContent = '✅ Correto! Matemática Rider aprovada.';
                        setTimeout(solve, 700);
                    } else {
                        const fb = c.querySelector('#mathFb');
                        fb.style.color = '#e74c3c';
                        fb.textContent = '❌ Incorreto. Reveja as operações e a precedência.';
                    }
                };
                c.querySelector('#mathBtn').onclick = check;
                c.querySelector('#mathAns').addEventListener('keydown', e => e.key === 'Enter' && check());
            }
        },

        // ---------- logo_match: associar logos às séries ----------
        logo_match: {
            title: '🏷️ Logos das Séries',
            build(c, solve) {
                const pairs = [
                    { logo: '🦗🌪️', series: 'Kamen Rider 1' },
                    { logo: '🌑👑', series: 'Kamen Rider BLACK' },
                    { logo: '🟣🟢📖', series: 'Kamen Rider W' },
                    { logo: '🍊⚔️🎌', series: 'Kamen Rider Gaim' },
                    { logo: '🤖🟡📊', series: 'Kamen Rider Zero-One' },
                    { logo: '🦊🎯🎲', series: 'Kamen Rider Geats' },
                    { logo: '🎮💉⚡', series: 'Kamen Rider Ex-Aid' },
                    { logo: '🃏🪞🐉', series: 'Kamen Rider Ryuki' },
                    { logo: '🔥🦂🏺', series: 'Kamen Rider Kuuga' },
                    { logo: '🧪🐍⚠️', series: 'Kamen Rider Build' },
                    { logo: '👻🧿⛓️', series: 'Kamen Rider Ghost' },
                    { logo: '🚗💀🔧', series: 'Kamen Rider Drive' },
                    { logo: '🚀🌌👁️', series: 'Kamen Rider Fourze' },
                    { logo: '🧙‍♂️💍✨', series: 'Kamen Rider Wizard' },
                    { logo: '🦇🎻🌙', series: 'Kamen Rider Kiva' },
                    { logo: '📱⚡🧠', series: 'Kamen Rider Faiz' },
                    { logo: '⏳👑🌀', series: 'Kamen Rider Zi-O' },
                    { logo: '🚆🎫⚡', series: 'Kamen Rider Den-O' },
                    { logo: '💀🔫🃏', series: 'Kamen Rider Decade' },
                    { logo: '🧬🐉⚡', series: 'Kamen Rider Agito' },
                    { logo: '🎵🔊🐯', series: 'Kamen Rider Hibiki' }
                ];
                let selectedLogo = null;
                let matched = new Array(pairs.length).fill(false);

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">🏷️ Logos das Séries</div>
                        <div class="pz-subtitle">Associe cada logo à sua série.</div>
                        <div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;">
                            <div id="logos" style="display:flex;flex-direction:column;gap:8px;"></div>
                            <div id="series" style="display:flex;flex-direction:column;gap:8px;"></div>
                        </div>
                        <div class="pz-feedback" id="lmFb"></div>
                        <button class="btn btn-primary" id="lmCheck" ${matched.every(v => v) ? '' : 'disabled'}>✓ CONCLUIR</button>
                    `;
                    const logosDiv = c.querySelector('#logos');
                    const seriesDiv = c.querySelector('#series');

                    pairs.forEach((p, idx) => {
                        const logoBtn = document.createElement('button');
                        logoBtn.textContent = p.logo;
                        logoBtn.className = 'pz-item';
                        if (matched[idx]) {
                            logoBtn.style.background = 'rgba(39,174,96,0.1)';
                            logoBtn.style.textDecoration = 'line-through';
                        }
                        logoBtn.onclick = () => {
                            if (matched[idx]) return;
                            document.querySelectorAll('#logos .pz-item').forEach(b => b.classList.remove('pz-selected'));
                            logoBtn.classList.add('pz-selected');
                            selectedLogo = idx;
                        };
                        logosDiv.appendChild(logoBtn);
                    });

                    pairs.forEach((p, idx) => {
                        const seriesBtn = document.createElement('button');
                        seriesBtn.textContent = p.series;
                        seriesBtn.className = 'pz-item';
                        seriesBtn.onclick = () => {
                            if (matched[idx] || selectedLogo === null) return;
                            if (selectedLogo === idx) {
                                matched[idx] = true;
                                const logoDiv = document.querySelectorAll('#logos .pz-item')[idx];
                                logoDiv.style.background = 'rgba(39,174,96,0.1)';
                                logoDiv.style.textDecoration = 'line-through';
                                seriesBtn.style.background = 'rgba(39,174,96,0.1)';
                                seriesBtn.style.textDecoration = 'line-through';
                                const fb = c.querySelector('#lmFb');
                                fb.textContent = `✅ Corretamente associado: ${p.logo} → ${p.series}`;
                                if (matched.every(v => v)) {
                                    c.querySelector('#lmCheck').disabled = false;
                                    fb.textContent = '🏆 Todas as logos associadas!';
                                }
                            } else {
                                const fb = c.querySelector('#lmFb');
                                fb.textContent = `❌ ${p.logo} não corresponde a ${p.series}. Tente outra.`;
                            }
                            selectedLogo = null;
                            document.querySelectorAll('#logos .pz-item').forEach(b => b.classList.remove('pz-selected'));
                        };
                        seriesDiv.appendChild(seriesBtn);
                    });
                    c.querySelector('#lmCheck').onclick = () => matched.every(v => v) && solve();
                };
                render();
            }
        },

        // ---------- trivia_hard: quiz hardmode ----------
        trivia_hard: {
            title: '🎓 Quiz Hardmode — Só fã raiz',
            build(c, solve) {
                const questions = [
                    { q: "Qual foi o primeiro Rider a ter uma forma final com chifres dourados?", o: ["Black RX", "Kuuga Ultimate", "Agito Shining", "Ryuki Survive"], a: 1 },
                    { q: "Qual ator interpretou Kamen Rider 1 original e também Kamen Rider 2 em alguns episódios?", o: ["Hiroshi Fujioka", "Takeshi Sasaki", "Tetsuo Kurata", "Masahiro Inoue"], a: 1 },
                    { q: "Qual organização vilã aparece em Kamen Rider Build?", o: ["Shocker", "Foundation X", "Fangire", "Blood Tribe"], a: 3 },
                    { q: "Qual desses Riders NÃO é da Era Reiwa?", o: ["Zero-One", "Saber", "Zi-O", "Geats"], a: 2 },
                    { q: "Qual o nome do sistema de transformação de Kamen Rider Ex-Aid?", o: ["Gashat", "Full Bottle", "Eyecon", "Ridewatch"], a: 0 },
                    { q: "Qual é a frase de transformação de Kamen Rider Decade?", o: ["Henshin!", "Kamen Ride!", "Final Attack Ride!", "Decade Driver!"], a: 1 },
                    { q: "Quem foi o principal antagonista de Kamen Rider Gaim?", o: ["Kaito Kumon", "Ryoma Sengoku", "Mitsuzane", "Sagara"], a: 3 },
                    { q: "Em Kamen Rider Ryuki, qual é o Mirror Monster de Ryo Ogami?", o: ["Dragreder", "Volcancer", "Darkwing", "GuldThunder"], a: 1 },
                    { q: "Qual Kamen Rider possui a forma 'Fusion' com um alienígena?", o: ["Fourze", "Meteor", "Nadeshiko", "Wizard"], a: 0 },
                    { q: "Qual era a especialidade de Takeshi Hongo antes de ser modificado pelo SHOCKER?", o: ["Cientista", "Piloto", "Acrobata", "Lutador"], a: 2 },
                    { q: "Qual Kamen Rider tem uma forma final que é uma homenagem direta ao Kamen Rider original?", o: ["Kamen Rider 1 (Shin)", "Kamen Rider Zero-One", "Kamen Rider Build", "Kamen Rider Zi-O"], a: 0 },
                    { q: "Qual é o nome do filme que celebra os 50 anos de Kamen Rider, reunindo vários Riders de diferentes eras?", o: ["Kamen Rider Heisei Generations", "Kamen Rider Reiwa The First Generation", "Kamen Rider 1.5: The Movie", "Kamen Rider Decade: All Riders vs. Dai-Shocker"], a: 1 },
                    { q: "Qual Kamen Rider tem uma forma final chamada 'Genius'?", o: ["Kamen Rider Build", "Kamen Rider Ex-Aid", "Kamen Rider Zero-One", "Kamen Rider Saber"], a: 0 },
                    { q: "Em Kamen Rider W, qual é a combinação de Gaia Memories usada para a forma 'CycloneJoker Extreme'?", o: ["Cyclone + Joker", "Cyclone + Joker + Extreme", "Cyclone + Metal + Joker", "Cyclone + Joker + Heat"], a: 1 }
                ];
                let current = 0, score = 0;

                const render = () => {
                    if (current >= questions.length) {
                        const ok = score >= 7;
                        c.innerHTML = `
                            <div class="pz-title">Resultado: ${score}/${questions.length}</div>
                            <div class="pz-quiz-result ${ok ? 'pz-pass' : 'pz-fail'}">${ok ? '✅ Mestre Rider! Você é fera!' : '❌ Precisa revisar os arquivos.'}</div>
                            ${ok ? '<button class="btn btn-primary" id="thDone">✓ RECOMPENSA</button>' : '<button class="btn" id="thRetry">↺ TENTAR NOVAMENTE</button>'}
                        `;
                        if (ok) c.querySelector('#thDone').onclick = solve;
                        else c.querySelector('#thRetry').onclick = () => { current = 0; score = 0; render(); };
                        return;
                    }
                    const q = questions[current];
                    c.innerHTML = `
                        <div class="pz-title">🎓 Hardmode (${current + 1}/${questions.length})</div>
                        <div class="pz-quiz-q">${q.q}</div>
                        <div class="pz-quiz-opts" id="thOpts"></div>
                        <div class="pz-score">Acertos: ${score}</div>
                    `;
                    const optsDiv = c.querySelector('#thOpts');
                    q.o.forEach((opt, i) => {
                        const btn = document.createElement('button');
                        btn.className = 'pz-quiz-opt';
                        btn.textContent = opt;
                        btn.onclick = () => {
                            document.querySelectorAll('.pz-quiz-opt').forEach(b => b.disabled = true);
                            if (i === q.a) {
                                btn.classList.add('pz-opt-correct');
                                score++;
                            } else {
                                btn.classList.add('pz-opt-wrong');
                                const correctBtn = optsDiv.querySelectorAll('.pz-quiz-opt')[q.a];
                                if (correctBtn) correctBtn.classList.add('pz-opt-correct');
                            }
                            setTimeout(() => { current++; render(); }, 1000);
                        };
                        optsDiv.appendChild(btn);
                    });
                };
                render();
            }
        },

        // ---------- belt_order: ordem do driver (Zero-One) ----------
        belt_order: {
            title: '🔧 Ordem do Driver',
            build(c, solve) {
                const correct = ['① Insira o Progrise Key', '② Gire o driver', '③ Pressione o botão', '④ Henshin!'];
                let order = [...correct].sort(() => Math.random() - 0.5);

                const refresh = () => {
                    c.innerHTML = `
                        <div class="pz-title">🔧 Ordem do Driver</div>
                        <div class="pz-subtitle">Coloque os passos do Zero-One Driver na ordem correta (do 1º ao 4º).</div>
                        <div class="pz-seq-list" id="boList"></div>
                        <div class="pz-feedback" id="boFb"></div>
                        <button class="btn btn-primary" id="boCheck">✓ VERIFICAR</button>
                    `;
                    const list = c.querySelector('#boList');
                    order.forEach((step, i) => {
                        const row = document.createElement('div');
                        row.className = 'pz-seq-row';
                        row.innerHTML = `
                            <span class="pz-seq-num">${i + 1}</span>
                            <span class="pz-seq-name">${step}</span>
                            <div class="pz-seq-btns">
                                <button class="pz-arr" data-d="up" data-i="${i}">▲</button>
                                <button class="pz-arr" data-d="down" data-i="${i}">▼</button>
                            </div>
                        `;
                        list.appendChild(row);
                    });
                    list.querySelectorAll('.pz-arr').forEach(btn => {
                        btn.onclick = () => {
                            const i = parseInt(btn.dataset.i);
                            const dir = btn.dataset.d;
                            if (dir === 'up' && i > 0) [order[i], order[i - 1]] = [order[i - 1], order[i]];
                            if (dir === 'down' && i < order.length - 1) [order[i], order[i + 1]] = [order[i + 1], order[i]];
                            refresh();
                        };
                    });
                    c.querySelector('#boCheck').onclick = () => {
                        if (JSON.stringify(order) === JSON.stringify(correct)) {
                            const fb = c.querySelector('#boFb');
                            fb.style.color = '#27ae60';
                            fb.textContent = '✅ Driver ativado!';
                            setTimeout(solve, 600);
                        } else {
                            const fb = c.querySelector('#boFb');
                            fb.style.color = '#e74c3c';
                            fb.textContent = '❌ Ordem incorreta. O driver falhou.';
                        }
                    };
                };
                refresh();
            }
        },

        // ---------- villian_match: vilões vs riders ----------
        villian_match: {
            title: '👹 Vilões vs Riders',
            build(c, solve) {
                const pairs = [
                    { villain: 'SHOCKER', rider: 'Kamen Rider 1' },
                    { villain: 'Gorgom', rider: 'Kamen Rider BLACK' },
                    { villain: 'Grongi', rider: 'Kamen Rider Kuuga' },
                    { villain: 'ZECT', rider: 'Kamen Rider Kabuto' },
                    { villain: 'Foundation X', rider: 'Kamen Rider W' },
                    { villain: 'DGP', rider: 'Kamen Rider Geats' },
                    { villain: 'Fangire', rider: 'Kamen Rider Kiva' },
                    { villain: 'Malgams', rider: 'Kamen Rider Ex-Aid' },
                    { villain: 'Blood Tribe', rider: 'Kamen Rider Build' },
                    { villain: 'Revenger', rider: 'Kamen Rider Saber' }
                ];
                let left = [...pairs].sort(() => Math.random() - 0.5);
                let right = [...pairs].sort(() => Math.random() - 0.5);
                let matches = {};
                let selected = null;

                const update = () => {
                    c.innerHTML = `
                        <div class="pz-title">👹 Vilões vs Riders</div>
                        <div class="pz-subtitle">Associe cada organização vilã ao seu Rider principal.</div>
                        <div style="display:flex;gap:20px;justify-content:center;">
                            <div id="vLeft" style="display:flex;flex-direction:column;gap:6px;"></div>
                            <div id="vRight" style="display:flex;flex-direction:column;gap:6px;"></div>
                        </div>
                        <div class="pz-feedback" id="vmFb"></div>
                        <button class="btn btn-primary" id="vmCheck" ${Object.keys(matches).length === pairs.length ? '' : 'disabled'}>✓ CONCLUIR</button>
                    `;
                    const leftDiv = c.querySelector('#vLeft');
                    const rightDiv = c.querySelector('#vRight');

                    left.forEach(v => {
                        const btn = document.createElement('button');
                        btn.textContent = v.villain;
                        btn.className = 'pz-item';
                        if (matches[v.villain]) btn.style.textDecoration = 'line-through';
                        btn.onclick = () => {
                            if (matches[v.villain]) return;
                            document.querySelectorAll('#vLeft .pz-item').forEach(b => b.classList.remove('pz-selected'));
                            btn.classList.add('pz-selected');
                            selected = v.villain;
                        };
                        leftDiv.appendChild(btn);
                    });

                    right.forEach(r => {
                        const btn = document.createElement('button');
                        btn.textContent = r.rider;
                        btn.className = 'pz-item';
                        if (Object.values(matches).includes(r.rider)) btn.style.textDecoration = 'line-through';
                        btn.onclick = () => {
                            if (!selected) return;
                            const found = pairs.find(p => p.villain === selected);
                            if (found && found.rider === r.rider) {
                                matches[selected] = r.rider;
                                const fb = c.querySelector('#vmFb');
                                fb.textContent = `✅ Corretamente associado: ${selected} → ${r.rider}`;
                                if (Object.keys(matches).length === pairs.length) {
                                    c.querySelector('#vmCheck').disabled = false;
                                    fb.textContent = '🏆 Todos os vilões associados!';
                                }
                                update();
                            } else {
                                const fb = c.querySelector('#vmFb');
                                fb.textContent = `❌ ${selected} não combina com ${r.rider}. Tente novamente.`;
                                selected = null;
                                document.querySelectorAll('#vLeft .pz-item').forEach(b => b.classList.remove('pz-selected'));
                            }
                        };
                        rightDiv.appendChild(btn);
                    });
                    c.querySelector('#vmCheck').onclick = () => Object.keys(matches).length === pairs.length && solve();
                };
                update();
            }
        },

        // ---------- music_quiz: qual o tema? ----------
        music_quiz: {
            title: '🎵 Quiz: Qual o Tema?',
            build(c, solve) {
                const questions = [
                    { desc: "Tema clássico com 'Rider Kick' no refrão, era Showa.", answer: "Kamen Rider 1" },
                    { desc: "'Alive A life' — tema de um Rider que luta em espelhos.", answer: "Ryuki" },
                    { desc: "Tema industrial com 'Real eyez, open your eyes for the future'", answer: "Zero-One" },
                    { desc: "Tema que começa com 'Climax Jump' — viagem no tempo.", answer: "Den-O" },
                    { desc: "'Anything Goes!' — tema de um Rider com moedas.", answer: "OOO" },
                    { desc: "'EXCITE' — tema de um Rider médico que entra em jogos.", answer: "Ex-Aid" },
                    { desc: "'Trust·Last' — tema do Rider do Grande Prêmio do Desejo.", answer: "Geats" },
                    { desc: "'Just Live More' — tema de um Rider que é um super-herói de verdade.", answer: "Gaim" },
                    { desc: "'W-B-X ~W-Boiled Extreme~' — tema de um Rider que é detetive.", answer: "W" },
                    { desc: "'Let's Go!! Rider Kick 2011' — tema de um Rider que é fã de Kamen Rider.", answer: "Decade" }
                ];
                let idx = 0, score = 0;

                const render = () => {
                    if (idx >= questions.length) {
                        const ok = score >= 5;
                        c.innerHTML = `
                            <div class="pz-title">Resultado: ${score}/${questions.length}</div>
                            <div class="pz-quiz-result ${ok ? 'pz-pass' : 'pz-fail'}">${ok ? '✅ Melômano! Você conhece as trilhas!' : '❌ Precisa ouvir mais playlists.'}</div>
                            ${ok ? '<button class="btn btn-primary" id="mqDone">✓ RECOMPENSA</button>' : '<button class="btn" id="mqRetry">↺ TENTAR NOVAMENTE</button>'}
                        `;
                        if (ok) c.querySelector('#mqDone').onclick = solve;
                        else c.querySelector('#mqRetry').onclick = () => { idx = 0; score = 0; render(); };
                        return;
                    }
                    const q = questions[idx];
                    const allOptions = [...new Set([q.answer, ...questions.map(qq => qq.answer).filter(a => a !== q.answer).sort(() => Math.random() - 0.5).slice(0, 3)])];
                    c.innerHTML = `
                        <div class="pz-title">🎵 Qual é o Rider? (${idx + 1}/${questions.length})</div>
                        <div class="pz-quiz-q">"${q.desc}"</div>
                        <div class="pz-quiz-opts" id="mqOpts"></div>
                        <div class="pz-score">Acertos: ${score}</div>
                    `;
                    const optsDiv = c.querySelector('#mqOpts');
                    allOptions.forEach(opt => {
                        const btn = document.createElement('button');
                        btn.className = 'pz-quiz-opt';
                        btn.textContent = opt;
                        btn.onclick = () => {
                            document.querySelectorAll('.pz-quiz-opt').forEach(b => b.disabled = true);
                            if (opt === q.answer) {
                                btn.classList.add('pz-opt-correct');
                                score++;
                            } else {
                                btn.classList.add('pz-opt-wrong');
                                const correctBtn = [...optsDiv.querySelectorAll('.pz-quiz-opt')].find(b => b.textContent === q.answer);
                                if (correctBtn) correctBtn.classList.add('pz-opt-correct');
                            }
                            setTimeout(() => { idx++; render(); }, 1000);
                        };
                        optsDiv.appendChild(btn);
                    });
                };
                render();
            }
        },

        // ---------- battle_seq: sequência de batalhas ----------
        battle_seq: {
            title: '⚔️ Ordem das Batalhas',
            build(c, solve) {
                const correct = ['Ryuki vs Ouja (2002)', 'Gaim vs Baron (2013)', 'Ex-Aid vs Genm (2016)', 'Geats vs Buffa (2022)'];
                let order = [...correct].sort(() => Math.random() - 0.5);

                const refresh = () => {
                    c.innerHTML = `
                        <div class="pz-title">⚔️ Sequência de Batalhas</div>
                        <div class="pz-subtitle">Ordene os confrontos famosos do mais antigo ao mais recente.</div>
                        <div class="pz-seq-list" id="bsList"></div>
                        <div class="pz-feedback" id="bsFb"></div>
                        <button class="btn btn-primary" id="bsCheck">✓ VERIFICAR</button>
                    `;
                    const list = c.querySelector('#bsList');
                    order.forEach((item, i) => {
                        const row = document.createElement('div');
                        row.className = 'pz-seq-row';
                        row.innerHTML = `
                            <span class="pz-seq-num">${i + 1}</span>
                            <span class="pz-seq-name">${item}</span>
                            <div class="pz-seq-btns">
                                <button class="pz-arr" data-d="up" data-i="${i}">▲</button>
                                <button class="pz-arr" data-d="down" data-i="${i}">▼</button>
                            </div>
                        `;
                        list.appendChild(row);
                    });
                    list.querySelectorAll('.pz-arr').forEach(btn => {
                        btn.onclick = () => {
                            const i = parseInt(btn.dataset.i);
                            const dir = btn.dataset.d;
                            if (dir === 'up' && i > 0) [order[i], order[i - 1]] = [order[i - 1], order[i]];
                            if (dir === 'down' && i < order.length - 1) [order[i], order[i + 1]] = [order[i + 1], order[i]];
                            refresh();
                        };
                    });
                    c.querySelector('#bsCheck').onclick = () => {
                        if (JSON.stringify(order) === JSON.stringify(correct)) {
                            const fb = c.querySelector('#bsFb');
                            fb.style.color = '#27ae60';
                            fb.textContent = '✅ Ordem correta! Você conhece a cronologia das batalhas.';
                            setTimeout(solve, 700);
                        } else {
                            const fb = c.querySelector('#bsFb');
                            fb.style.color = '#e74c3c';
                            fb.textContent = '❌ Ordem incorreta. Reveja as eras dos confrontos.';
                        }
                    };
                };
                refresh();
            }
        },

        // ---------- manga_match: mangás vs anos ----------
        manga_match: {
            title: '📚 Mangás vs Anos',
            build(c, solve) {
                const pairs = [
                    { manga: 'Kamen Rider Spirits', year: '2001' },
                    { manga: 'Kuuga (Mangá)', year: '2014' },
                    { manga: 'Shin KR (Mangá)', year: '1992' },
                    { manga: 'Kamen Rider Black (Mangá)', year: '1987' },
                    { manga: 'Kamen Rider W (Mangá)', year: '2017' },
                    { manga: 'Kamen Rider Ex-Aid (Mangá)', year: '2016' },
                    { manga: 'Kamen Rider Revice (Mangá)', year: '2021' }
                ];
                let matches = {};
                let selected = null;

                const update = () => {
                    c.innerHTML = `
                        <div class="pz-title">📚 Associe o Mangá ao Ano</div>
                        <div class="pz-subtitle">Clique no mangá, depois no ano correto.</div>
                        <div style="display:flex;gap:30px;justify-content:center;">
                            <div id="mangaLeft" style="display:flex;flex-direction:column;gap:8px;"></div>
                            <div id="mangaRight" style="display:flex;flex-direction:column;gap:8px;"></div>
                        </div>
                        <div class="pz-feedback" id="mmFb"></div>
                        <button class="btn btn-primary" id="mmCheck" ${Object.keys(matches).length === pairs.length ? '' : 'disabled'}>✓ CONCLUIR</button>
                    `;
                    const leftDiv = c.querySelector('#mangaLeft');
                    const rightDiv = c.querySelector('#mangaRight');

                    pairs.forEach(p => {
                        const btn = document.createElement('button');
                        btn.textContent = p.manga;
                        btn.className = 'pz-item';
                        if (matches[p.manga]) btn.style.textDecoration = 'line-through';
                        btn.onclick = () => {
                            if (matches[p.manga]) return;
                            document.querySelectorAll('#mangaLeft .pz-item').forEach(b => b.classList.remove('pz-selected'));
                            btn.classList.add('pz-selected');
                            selected = p.manga;
                        };
                        leftDiv.appendChild(btn);
                    });

                    pairs.forEach(p => {
                        const btn = document.createElement('button');
                        btn.textContent = p.year;
                        btn.className = 'pz-item';
                        if (Object.values(matches).includes(p.year)) btn.style.textDecoration = 'line-through';
                        btn.onclick = () => {
                            if (!selected) {
                                c.querySelector('#mmFb').textContent = 'Selecione um mangá primeiro!';
                                return;
                            }
                            const found = pairs.find(pp => pp.manga === selected);
                            if (found && found.year === p.year) {
                                matches[selected] = p.year;
                                const fb = c.querySelector('#mmFb');
                                fb.style.color = '#27ae60';
                                fb.textContent = `✅ Correto! ${selected} → ${p.year}`;
                                if (Object.keys(matches).length === pairs.length) {
                                    c.querySelector('#mmCheck').disabled = false;
                                    fb.textContent = '🏆 Todos os mangás associados!';
                                }
                                update();
                            } else {
                                const fb = c.querySelector('#mmFb');
                                fb.style.color = '#e74c3c';
                                fb.textContent = `❌ ${selected} não é de ${p.year}. Tente novamente.`;
                                selected = null;
                                document.querySelectorAll('#mangaLeft .pz-item').forEach(b => b.classList.remove('pz-selected'));
                            }
                        };
                        rightDiv.appendChild(btn);
                    });
                    c.querySelector('#mmCheck').onclick = () => Object.keys(matches).length === pairs.length && solve();
                };
                update();
            }
        },

        // ---------- drivers_match: modo infinito ----------
        drivers_match: {
            title: '🔧 Associe o Driver ao Rider',
            build(c, solve) {
                const allPairs = [
                    { driver: 'Typhoon Belt', rider: 'Kamen Rider 1 / 2' },
                    { driver: 'King Stone', rider: 'Kamen Rider BLACK / BLACK RX' },
                    { driver: 'Arcle', rider: 'Kamen Rider Kuuga' },
                    { driver: 'V-Buckle', rider: 'Kamen Rider Ryuki' },
                    { driver: 'Smart Brain Gear', rider: 'Kamen Rider Faiz' },
                    { driver: 'Double Driver', rider: 'Kamen Rider W' },
                    { driver: 'OOO Driver', rider: 'Kamen Rider OOO' },
                    { driver: 'Fourze Driver', rider: 'Kamen Rider Fourze' },
                    { driver: 'Sengoku Driver', rider: 'Kamen Rider Gaim' },
                    { driver: 'Drive Driver', rider: 'Kamen Rider Drive' },
                    { driver: 'Build Driver', rider: 'Kamen Rider Build' },
                    { driver: 'Zero-One Driver', rider: 'Kamen Rider Zero-One' },
                    { driver: 'Desire Driver', rider: 'Kamen Rider Geats' },
                    { driver: 'DecaDriver', rider: 'Kamen Rider Decade' },
                    { driver: 'Gamer Driver', rider: 'Kamen Rider Ex-Aid' },
                    { driver: 'Seiken Swordriver', rider: 'Kamen Rider Saber' },
                    { driver: 'Gotchardriver', rider: 'Kamen Rider Gotchard' },
                    { driver: 'Legend Driver', rider: 'Kamen Rider Legend' },
                    { driver: 'Revice Driver', rider: 'Kamen Rider Revi / Vice' },
                    { driver: 'Amazon Driver', rider: 'Kamen Rider Amazon' },
                    { driver: 'Sun Driver', rider: 'Kamen Rider Black Sun' },
                    { driver: 'Hazard Trigger (Build)', rider: 'Kamen Rider Build Hazard Form' },
                    { driver: 'Xtreme Memory (W)', rider: 'Kamen Rider W Xtreme' }
                ];
                let currentIdx = 0;
                let streak = 0;
                let totalAttempts = 0;
                let highScore = KR.Game.getState().driverHighScore || 0;

                const getRandomOptions = (correctRider) => {
                    const others = allPairs.filter(p => p.rider !== correctRider).map(p => p.rider);
                    const shuffled = [correctRider, ...others.sort(() => Math.random() - 0.5).slice(0, 3)];
                    return shuffled.sort(() => Math.random() - 0.5);
                };

                let currentPair = allPairs[currentIdx];
                let currentOptions = getRandomOptions(currentPair.rider);

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">🔧 ASSOCIE O DRIVER AO RIDER</div>
                        <div class="pz-subtitle">Modo Infinito — Acertos consecutivos aumentam a pontuação!</div>
                        <div style="text-align:center; margin:20px 0;">
                            <div style="font-size:2rem; display:flex; justify-content:center; align-items:center; gap:10px;">
                                <span style="background:var(--bg-panel); padding:15px 25px; border-radius:8px; border:2px solid var(--era-current);">
                                    🔧 ${currentPair.driver}
                                </span>
                            </div>
                        </div>
                        <div class="pz-quiz-opts" id="driverOpts" style="margin:20px 0;"></div>
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:20px; margin-top:16px; flex-wrap:wrap;">
                            <div style="font-family:var(--font-mono); font-size:0.7rem;">🎯 Acertos consecutivos: <strong style="color:var(--era-secret); font-size:1.2rem;">${streak}</strong></div>
                            <div style="font-family:var(--font-mono); font-size:0.7rem;">🏆 Recorde: <strong>${highScore}</strong></div>
                            <div style="font-family:var(--font-mono); font-size:0.7rem;">📊 Total acertados: <strong>${totalAttempts}</strong></div>
                            <div style="font-family:var(--font-mono); font-size:0.7rem;">💡 Dica: Mantenha a sequência para aumentar sua pontuação!</div>
                        </div>
                        <div class="pz-feedback" id="driverFb" style="margin-top:16px;"></div>
                        <div style="margin-top:16px; display:flex; gap:10px; justify-content:center;">
                            <button class="btn" id="driverReset">🔄 NOVO JOGO</button>
                            <button class="btn" id="driverQuit">🚪 SAIR</button>
                        </div>
                    `;

                    const optsDiv = c.querySelector('#driverOpts');
                    currentOptions.forEach(opt => {
                        const btn = document.createElement('button');
                        btn.className = 'pz-quiz-opt';
                        btn.textContent = opt;
                        btn.style.margin = '4px';
                        btn.onclick = () => {
                            document.querySelectorAll('.pz-quiz-opt').forEach(b => b.disabled = true);
                            if (opt === currentPair.rider) {
                                btn.classList.add('pz-opt-correct');
                                streak++;
                                totalAttempts++;
                                const fb = c.querySelector('#driverFb');
                                fb.style.color = '#27ae60';
                                fb.innerHTML = `✅ CORRETO! +1 ponto | Sequência: ${streak}`;
                                const nextIndex = (currentIdx + 1) % allPairs.length;
                                if (nextIndex === 0) {
                                    fb.innerHTML += `<br>🏆 VOCÊ COMPLETOU O CICLO! Bônus de 10 pontos!`;
                                    streak += 10;
                                    totalAttempts += 10;
                                }
                                currentIdx = nextIndex;
                                currentPair = allPairs[currentIdx];
                                currentOptions = getRandomOptions(currentPair.rider);
                                if (streak > highScore) {
                                    highScore = streak;
                                    KR.Game.getState().driverHighScore = highScore;
                                    KR.Game.save();
                                    fb.innerHTML += `<br>🎉 NOVO RECORDE! 🎉`;
                                }
                                if (streak > 0 && streak % 10 === 0) {
                                    fb.innerHTML += `<br>🎁 BÔNUS: +10🪙 +20XP!`;
                                    KR.Game.addCoins(10);
                                    KR.Game.addXP(20);
                                    KR.UI.updateLeftPanel();
                                }
                                setTimeout(() => render(), 800);
                            } else {
                                btn.classList.add('pz-opt-wrong');
                                const fb = c.querySelector('#driverFb');
                                fb.style.color = '#e74c3c';
                                fb.innerHTML = `❌ INCORRETO! A resposta era: ${currentPair.rider}<br>🎯 Você acertou ${streak} seguidos!`;
                                document.querySelectorAll('.pz-quiz-opt').forEach(b => {
                                    if (b.textContent === currentPair.rider) b.classList.add('pz-opt-correct');
                                });
                                streak = 0;
                                setTimeout(() => render(), 2000);
                            }
                        };
                        optsDiv.appendChild(btn);
                    });

                    c.querySelector('#driverReset').onclick = () => {
                        currentIdx = 0;
                        streak = 0;
                        currentPair = allPairs[0];
                        currentOptions = getRandomOptions(currentPair.rider);
                        render();
                    };
                    c.querySelector('#driverQuit').onclick = () => {
                        KR.UI.closeModal();
                        KR.UI.notify(`Você acertou ${totalAttempts} drivers! Recorde: ${highScore}`, '🔧');
                    };
                };
                render();
            }
        },

        // ---------- drivers_rebuild: reconstrução épica dos drivers (com limpeza de intervalo) ----------
        drivers_rebuild: {
            title: '🔧 RECONSTRUIR OS DRIVERS — RESTAURAR LINHAS DO TEMPO',
            build(c, solve) {
                const driversList = [
                    { id: 'typhoon', name: '🌀 Typhoon Belt', rider: 'Kamen Rider 1 / 2', steps: ['Conectar turbina', 'Fixar hélices', 'Ativar vento'] },
                    { id: 'kingstone', name: '💎 King Stone', rider: 'Kamen Rider BLACK / RX', steps: ['Sincronizar pedras gêmeas', 'Canalizar energia solar', 'Despertar King Stone'] },
                    { id: 'arcle', name: '⚡ Arcle', rider: 'Kamen Rider Kuuga', steps: ['Reconstruir artefato', 'Cristalizar poder ancestral', 'Aceitar o destino'] },
                    { id: 'vbuckle', name: '🃏 V-Buckle', rider: 'Kamen Rider Ryuki', steps: ['Reforçar espelho dimensional', 'Carregar deck de cartas', 'Conectar ao Mirror World'] },
                    { id: 'smartbrain', name: '📱 Smart Brain Gear', rider: 'Kamen Rider Faiz', steps: ['Reiniciar sistema Phi', 'Configurar código 555', 'Estabilizar fótons'] },
                    { id: 'double', name: '🔌 Double Driver', rider: 'Kamen Rider W', steps: ['Inserir Gaia Memories', 'Sincronizar duas almas', 'Ativar Xtreme Memory'] },
                    { id: 'ooo', name: '🪙 OOO Driver', rider: 'Kamen Rider OOO', steps: ['Fixar scanner', 'Carregar medalhas', 'Girar mecanismo'] },
                    { id: 'fourze', name: '🚀 Fourze Driver', rider: 'Kamen Rider Fourze', steps: ['Instalar Astroswitches', 'Calibrar propulsão', 'Girar interruptor'] },
                    { id: 'sengoku', name: '🍊 Sengoku Driver', rider: 'Kamen Rider Gaim', steps: ['Bloquear Lockseed', 'Cortar fruta', 'Ativar Genesis Core'] },
                    { id: 'drive', name: '🚗 Drive Driver', rider: 'Kamen Rider Drive', steps: ['Conectar Shift Car', 'Ignition!', 'Modo Tridoron'] },
                    { id: 'build', name: '🧪 Build Driver', rider: 'Kamen Rider Build', steps: ['Inserir FullBottles', 'Girar manivela', 'Ativar Hazard Trigger'] },
                    { id: 'zeroone', name: '🤖 Zero-One Driver', rider: 'Kamen Rider Zero-One', steps: ['Autorizar Progrise Key', 'Jump & Rise', 'Form Rising Hopper'] },
                    { id: 'desire', name: '🦊 Desire Driver', rider: 'Kamen Rider Geats', steps: ['Raise Buckle', 'Dual On!', 'Boost Time!'] },
                    { id: 'decade', name: '📸 DecaDriver', rider: 'Kamen Rider Decade', steps: ['Kamen Ride Card', 'Final Attack Ride', 'Viajar dimensões'] },
                    { id: 'gamer', name: '🎮 Gamer Driver', rider: 'Kamen Rider Ex-Aid', steps: ['Gashat', 'Level Up!', 'Mighty Action X'] },
                    { id: 'seiken', name: '⚔️ Seiken Swordriver', rider: 'Kamen Rider Saber', steps: ['Wonder Ride Book', 'Brave Dragon', 'Espada sagrada'] },
                    { id: 'revice', name: '🦖 Revice Driver', rider: 'Kamen Rider Revi / Vice', steps: ['Vistamp', 'Buddy Up!', 'Contrato com demônio'] },
                    { id: 'gotchard', name: '🃏 Gotchardriver', rider: 'Kamen Rider Gotchard', steps: ['Chemy Cards', 'Gotcha!', 'Alquimia'] }
                ];
                let currentIdx = 0;
                let currentStep = 0;
                let glitchActive = false;
                let animInterval = null;

                const showGlitchEffect = (driverName, stepName) => {
                    const fb = document.getElementById('rebuild-feedback');
                    if (fb) {
                        fb.innerHTML = `<div style="font-family:var(--font-mono); color:var(--era-secret); text-shadow:0 0 5px red;">
                            ⚡ GLITCH CORRIGIDO: ${driverName} — ${stepName} restaurado!
                        </div>`;
                        setTimeout(() => { if (fb) fb.innerHTML = ''; }, 800);
                    }
                };

                const cleanupIntervals = () => {
                    if (animInterval) {
                        clearInterval(animInterval);
                        animInterval = null;
                    }
                };

                const renderStep = () => {
                    if (currentIdx >= driversList.length) {
                        c.innerHTML = `
                            <div class="pz-title">✨ LINHA DO TEMPO RESTAURADA ✨</div>
                            <div class="pz-subtitle">Os ${driversList.length} Drivers foram reconstruídos. Os Riders estão de volta.</div>
                            <div style="text-align:center; margin:20px;">
                                <div class="secret-omega">⚛️</div>
                                <div style="font-family:var(--font-display); font-size:1.2rem; color:var(--era-secret);">
                                    TODOS OS RIDERS SINCERONIZAM
                                </div>
                                <pre style="background:var(--bg-mid); padding:10px; margin:15px 0; border-radius:6px;">
          ╔═══════════════════════════════════════╗
          ║   A BATALHA FINAL COMEÇA AGORA.      ║
          ║   OHMA ZI-O E EVOLT BLACK HOLE       ║
          ║   ENFRENTAM A LEGIÃO DE HERÓIS       ║
          ║   QUE VOCÊ RESTAUROU.                ║
          ║                                      ║
          ║   RECOMPENSA: CARTA LENDÁRIA         ║
          ║   [ EVOLUIR UM RIDER DO SEU DECK ]   ║
          ╚═══════════════════════════════════════╝
                                </pre>
                                <button class="btn btn-primary" id="finish-rebuild">⚔️ RECEBER CARTA LENDÁRIA ⚔️</button>
                            </div>
                        `;
                        c.querySelector('#finish-rebuild').onclick = () => {
                            KR.Game.setFlag('timeline_restored', true);
                            KR.Game.addCoins(100);
                            KR.Game.addXP(300);
                            KR.Game.addItem('legendary_evolution_core');
                            KR.UI.notify('🎴 Carta Lendária desbloqueada! Vá ao seu inventário e escolha um Rider para evoluir.', '⭐');
                            solve();
                        };
                        cleanupIntervals();
                        return;
                    }

                    const driver = driversList[currentIdx];
                    const stepDesc = driver.steps[currentStep];
                    const progressPercent = Math.round((currentIdx / driversList.length) * 100);
                    c.innerHTML = `
                        <div class="pz-title">🔧 RECONSTRUÇÃO DOS DRIVERS — ${driver.name}</div>
                        <div class="pz-subtitle" style="color:${glitchActive ? '#ff5555' : '#aaa'}">
                            ${glitchActive ? '⚠️ CORRUPÇÃO TEMPORAL DETECTADA ⚠️' : 'Rider: ' + driver.rider}
                        </div>
                        <div style="background:var(--bg-panel); border-radius:8px; padding:12px; margin:10px 0;">
                            <div style="font-family:var(--font-mono); font-size:0.7rem;">Processo atual:</div>
                            <div style="font-size:1.1rem; font-weight:bold;">${stepDesc}</div>
                            <div class="loading-bar-track" style="margin-top:10px;">
                                <div class="loading-bar" id="step-progress" style="width:0%; background:var(--era-current);"></div>
                            </div>
                        </div>
                        <div class="pz-feedback" id="rebuild-feedback" style="min-height:60px;"></div>
                        <div style="display:flex; justify-content:space-between; margin-top:16px;">
                            <div>📀 Driver ${currentIdx + 1} / ${driversList.length}</div>
                            <div>⚡ Progresso geral: ${progressPercent}%</div>
                        </div>
                        <div class="progress-track" style="margin:5px 0;">
                            <div class="progress-fill" style="width:${progressPercent}%; background:var(--era-secret);"></div>
                        </div>
                        <div style="display:flex; gap:10px; justify-content:center; margin-top:16px;">
                            <button class="btn" id="retry-step">↺ TENTAR ETAPA NOVAMENTE</button>
                            <button class="btn btn-primary" id="attempt-repair">🔧 TENTAR REPARAR</button>
                        </div>
                    `;

                    let bar = c.querySelector('#step-progress');
                    let p = 0;
                    cleanupIntervals();
                    animInterval = setInterval(() => {
                        if (p >= 100) {
                            cleanupIntervals();
                        } else {
                            p += 2;
                            if (bar) bar.style.width = p + '%';
                        }
                    }, 30);

                    const closeOverlay = document.getElementById('puzzle-close');
                    const escHandler = (e) => {
                        if (e.key === 'Escape') {
                            cleanupIntervals();
                            document.removeEventListener('keydown', escHandler);
                        }
                    };
                    document.addEventListener('keydown', escHandler);
                    if (closeOverlay) {
                        closeOverlay.addEventListener('click', () => {
                            cleanupIntervals();
                            document.removeEventListener('keydown', escHandler);
                        }, { once: true });
                    }

                    c.querySelector('#attempt-repair').onclick = () => {
                        cleanupIntervals();
                        const successChance = glitchActive ? 0.5 : 1.0;
                        if (Math.random() < successChance) {
                            showGlitchEffect(driver.name, stepDesc);
                            if (currentStep + 1 < driver.steps.length) {
                                currentStep++;
                                renderStep();
                            } else {
                                currentIdx++;
                                currentStep = 0;
                                glitchActive = false;
                                renderStep();
                            }
                        } else {
                            glitchActive = true;
                            const fb = c.querySelector('#rebuild-feedback');
                            fb.innerHTML = '<div style="color:#ff5555;">❌ REPARO FALHOU! O driver entrou em curto-circuito. Tente novamente com cuidado.</div>';
                            setTimeout(() => { if (fb) fb.innerHTML = ''; }, 1500);
                        }
                    };
                    c.querySelector('#retry-step').onclick = () => {
                        cleanupIntervals();
                        renderStep();
                    };
                };
                renderStep();
            }
        },

        // ---------- ultimate_riders_list: ordenar TODOS os riders ----------
        ultimate_riders_list: {
            title: '🏆 O Nome de Todos os Riders',
            build(c, solve) {
                const correctOrder = [
                    'Kamen Rider 1', 'Kamen Rider 2', 'V3', 'Riderman', 'X', 'Amazon', 'Stronger',
                    'Skyrider', 'Super-1', 'ZX', 'BLACK', 'BLACK RX', 'Shin', 'ZO', 'J',
                    'Kuuga', 'Agito', 'Ryuki', 'Faiz', 'Blade', 'Hibiki', 'Kabuto', 'Den-O', 'Kiva',
                    'Decade', 'W', 'OOO', 'Fourze', 'Wizard', 'Gaim', 'Drive', 'Ghost', 'Ex-Aid', 'Build', 'Zi-O',
                    'Zero-One', 'Saber', 'Revice', 'Geats', 'Gotchard'
                ];
                let order = [...correctOrder].sort(() => Math.random() - 0.5);

                const refresh = () => {
                    c.innerHTML = `
                        <div class="pz-title">🏆 O Nome de Todos os Riders</div>
                        <div class="pz-subtitle">Ordene cronologicamente TODOS os Riders principais (Showa → Heisei → Reiwa).</div>
                        <div class="pz-seq-list" id="ultList" style="max-height:400px;overflow-y:auto;"></div>
                        <div class="pz-feedback" id="ultFb"></div>
                        <button class="btn btn-primary" id="ultCheck">✓ VERIFICAR (VOCÊ CONSEGUE!)</button>
                    `;
                    const list = c.querySelector('#ultList');
                    order.forEach((name, i) => {
                        const row = document.createElement('div');
                        row.className = 'pz-seq-row';
                        row.innerHTML = `
                            <span class="pz-seq-num">${i + 1}</span>
                            <span class="pz-seq-name">${name}</span>
                            <div class="pz-seq-btns">
                                <button class="pz-arr" data-d="up" data-i="${i}">▲</button>
                                <button class="pz-arr" data-d="down" data-i="${i}">▼</button>
                            </div>
                        `;
                        list.appendChild(row);
                    });
                    list.querySelectorAll('.pz-arr').forEach(btn => {
                        btn.onclick = () => {
                            const i = parseInt(btn.dataset.i);
                            const dir = btn.dataset.d;
                            if (dir === 'up' && i > 0) [order[i], order[i - 1]] = [order[i - 1], order[i]];
                            if (dir === 'down' && i < order.length - 1) [order[i], order[i + 1]] = [order[i + 1], order[i]];
                            refresh();
                        };
                    });
                    c.querySelector('#ultCheck').onclick = () => {
                        if (JSON.stringify(order) === JSON.stringify(correctOrder)) {
                            const fb = c.querySelector('#ultFb');
                            fb.style.color = '#27ae60';
                            fb.textContent = '✅ PERFEITO! Você realmente conhece todos os Riders!';
                            setTimeout(() => {
                                KR.Game.addCoins(100);
                                KR.Game.addXP(300);
                                KR.UI.notify('🏆 Arquivista Absoluto! +100🪙 +300XP', '🏆');
                                solve();
                            }, 800);
                        } else {
                            const fb = c.querySelector('#ultFb');
                            fb.style.color = '#e74c3c';
                            fb.textContent = '❌ Ordem incorreta. Revise as eras!';
                        }
                    };
                };
                refresh();
            }
        },

        // ---------- driver_voices: associar voz ao driver ----------
        driver_voices: {
            title: '🎤 A Voz do Driver',
            build(c, solve) {
                const pairs = [
                    { voice: '"CYCLONE! JOKER!"', driver: 'Double Driver (W)' },
                    { voice: '"TAKA! TORA! BATTA! TATOBA!"', driver: 'OOO Driver' },
                    { voice: '"RABBIT! TANK! BEST MATCH!"', driver: 'Build Driver' },
                    { voice: '"AUTHORIZE! JUMP! RISE!"', driver: 'Zero-One Driver' },
                    { voice: '"BOOST! MARK II! MAGNUM!"', driver: 'Desire Driver (Geats)' },
                    { voice: '"KAMEN RIDE! DECADE!"', driver: 'DecaDriver' },
                    { voice: '"LEVEL UP! MIGHTY JUMP!"', driver: 'Gamer Driver (Ex-Aid)' },
                    { voice: '"BRAVE DRAGON! WONDER RIDE!"', driver: 'Seiken Swordriver (Saber)' },
                    { voice: '"REX! BUDDY UP!"', driver: 'Revice Driver' },
                    { voice: '"GOTCHA! STEAM! LINER!"', driver: 'Gotchardriver' }
                ];
                let selected = null;
                let matches = {};
                const shuffleLeft = [...pairs].sort(() => Math.random() - 0.5);
                const shuffleRight = [...pairs].sort(() => Math.random() - 0.5);

                const render = () => {
                    c.innerHTML = `
                        <div class="pz-title">🎤 Associe a Voz ao Driver</div>
                        <div class="pz-subtitle">Cada frase icônica pertence a um Driver. Clique na voz, depois no driver.</div>
                        <div style="display:flex; gap:20px; justify-content:center;">
                            <div id="voiceCol" style="display:flex; flex-direction:column; gap:6px;"></div>
                            <div id="driverCol" style="display:flex; flex-direction:column; gap:6px;"></div>
                        </div>
                        <div class="pz-feedback" id="vFb"></div>
                        <button class="btn btn-primary" id="vCheck" ${Object.keys(matches).length === pairs.length ? '' : 'disabled'}>✓ CONCLUIR</button>
                    `;
                    const leftDiv = c.querySelector('#voiceCol');
                    const rightDiv = c.querySelector('#driverCol');

                    shuffleLeft.forEach(p => {
                        const btn = document.createElement('button');
                        btn.textContent = p.voice;
                        btn.className = 'pz-item';
                        if (matches[p.voice]) btn.style.textDecoration = 'line-through';
                        btn.onclick = () => {
                            if (matches[p.voice]) return;
                            document.querySelectorAll('#voiceCol .pz-item').forEach(b => b.classList.remove('pz-selected'));
                            btn.classList.add('pz-selected');
                            selected = p.voice;
                        };
                        leftDiv.appendChild(btn);
                    });

                    shuffleRight.forEach(p => {
                        const btn = document.createElement('button');
                        btn.textContent = p.driver;
                        btn.className = 'pz-item';
                        if (Object.values(matches).includes(p.driver)) btn.style.textDecoration = 'line-through';
                        btn.onclick = () => {
                            if (!selected) {
                                c.querySelector('#vFb').textContent = 'Selecione uma voz primeiro!';
                                return;
                            }
                            const found = pairs.find(pp => pp.voice === selected);
                            if (found && found.driver === p.driver) {
                                matches[selected] = p.driver;
                                const fb = c.querySelector('#vFb');
                                fb.style.color = '#27ae60';
                                fb.textContent = `✅ Correto! ${selected} → ${p.driver}`;
                                if (Object.keys(matches).length === pairs.length) {
                                    c.querySelector('#vCheck').disabled = false;
                                    fb.textContent = '🏆 Todas as vozes associadas!';
                                }
                                render();
                            } else {
                                const fb = c.querySelector('#vFb');
                                fb.style.color = '#e74c3c';
                                fb.textContent = `❌ "${selected}" não corresponde a "${p.driver}".`;
                                selected = null;
                                document.querySelectorAll('#voiceCol .pz-item').forEach(b => b.classList.remove('pz-selected'));
                            }
                        };
                        rightDiv.appendChild(btn);
                    });
                    c.querySelector('#vCheck').onclick = () => Object.keys(matches).length === pairs.length && solve();
                };
                render();
            }
        },

        // ---------- crossover_timeline: linha do tempo dos crossovers ----------
        crossover_timeline: {
            title: '🌐 Linha do Tempo dos Crossovers',
            build(c, solve) {
                const correct = [
                    'Kamen Rider vs. Shocker (1972)',
                    'Kamen Rider BLACK: Terrifying! The Phantom House of Devil Pass (1988)',
                    'Kamen Rider Den-O & Kiva: Climax Deka (2008)',
                    'Kamen Rider Decade: All Riders vs. Dai-Shocker (2009)',
                    'Kamen Rider × Kamen Rider W & Decade: Movie War 2010 (2009)',
                    'Kamen Rider OOO Wonderful: The Shogun and 21 Core Medals (2011)',
                    'Kamen Rider × Super Sentai: Super Hero Taisen (2012)',
                    'Kamen Rider × Kamen Rider Gaim & Wizard: The Fateful Sengoku Movie Battle (2013)',
                    'Kamen Rider Heisei Generations: Dr. Pac-Man vs. Ex-Aid & Ghost (2016)',
                    'Kamen Rider Heisei Generations Final: Build & Ex-Aid (2017)',
                    'Kamen Rider Zi-O: Over Quartzer (2019)',
                    'Kamen Rider Reiwa: The First Generation (2019)',
                    'Kamen Rider Saber + Zenkaiger: Superhero Senki (2021)',
                    'Kamen Rider: Beyond Generations (2021)',
                    'Kamen Rider Geats × Revice: Movie Battle Royale (2022)'
                ];
                let order = [...correct].sort(() => Math.random() - 0.5);

                const refresh = () => {
                    c.innerHTML = `
                        <div class="pz-title">🌐 Linha do Tempo dos Crossovers</div>
                        <div class="pz-subtitle">Ordene os filmes de crossover do mais antigo ao mais recente.</div>
                        <div class="pz-seq-list" id="crossList" style="max-height:350px;overflow-y:auto;"></div>
                        <div class="pz-feedback" id="crossFb"></div>
                        <button class="btn btn-primary" id="crossCheck">✓ VERIFICAR</button>
                    `;
                    const list = c.querySelector('#crossList');
                    order.forEach((item, i) => {
                        const row = document.createElement('div');
                        row.className = 'pz-seq-row';
                        row.innerHTML = `
                            <span class="pz-seq-num">${i + 1}</span>
                            <span class="pz-seq-name">${item}</span>
                            <div class="pz-seq-btns">
                                <button class="pz-arr" data-d="up" data-i="${i}">▲</button>
                                <button class="pz-arr" data-d="down" data-i="${i}">▼</button>
                            </div>
                        `;
                        list.appendChild(row);
                    });
                    list.querySelectorAll('.pz-arr').forEach(btn => {
                        btn.onclick = () => {
                            const i = parseInt(btn.dataset.i);
                            const dir = btn.dataset.d;
                            if (dir === 'up' && i > 0) [order[i], order[i - 1]] = [order[i - 1], order[i]];
                            if (dir === 'down' && i < order.length - 1) [order[i], order[i + 1]] = [order[i + 1], order[i]];
                            refresh();
                        };
                    });
                    c.querySelector('#crossCheck').onclick = () => {
                        if (JSON.stringify(order) === JSON.stringify(correct)) {
                            const fb = c.querySelector('#crossFb');
                            fb.style.color = '#27ae60';
                            fb.textContent = '✅ Cronologia perfeita! Você conhece os crossovers!';
                            setTimeout(() => solve(), 700);
                        } else {
                            const fb = c.querySelector('#crossFb');
                            fb.style.color = '#e74c3c';
                            fb.textContent = '❌ Ordem incorreta. Reveja os filmes!';
                        }
                    };
                };
                refresh();
            }
        },

        // ---------- final_showdown: batalha final contra Ohma Zi-O ----------
        final_showdown: {
            title: '⚔️ BATALHA FINAL: OHMA ZI-O vs. TODOS OS RIDERS',
            build(c, solve) {
                let wave = 1;
                let playerHP = 300;
                let playerPower = 60;
                const enemies = {
                    wave1: { name: 'Shocker Kaijin', hp: 100, atk: 30, desc: 'Os primeiros monstros de 1971' },
                    wave2: { name: 'Gorgom Priest', hp: 150, atk: 40, desc: 'Servo de Gorgom' },
                    wave3: { name: 'Grongi', hp: 180, atk: 45, desc: 'O caçador de esportes' },
                    wave4: { name: 'Orphnoch King', hp: 220, atk: 50, desc: 'O rei dos mortos-vivos' },
                    wave5: { name: 'Dopant (Terror)', hp: 250, atk: 55, desc: 'A memória do medo' },
                    wave6: { name: 'Kurokage Troopers', hp: 200, atk: 60, desc: 'Soldados de Yggdrasill' },
                    wave7: { name: 'Evol Black Hole', hp: 350, atk: 70, desc: 'O vilão mais poderoso de Build' },
                    wave8: { name: 'Ark-One', hp: 400, atk: 80, desc: 'A IA maligna de Zero-One' },
                    wave9: { name: 'Jyamato (Garden)', hp: 300, atk: 65, desc: 'As plantas do desejo' },
                    wave10: { name: 'OHMA ZI-O', hp: 500, atk: 100, desc: 'O Rei Demônio que controla todas as eras' }
                };
                let enemy = { ...enemies.wave1 };

                const renderBattle = () => {
                    c.innerHTML = `
                        <div class="pz-title">⚔️ ${wave === 10 ? 'BATALHA FINAL' : 'FASE ' + wave} - ${enemy.name}</div>
                        <div class="pz-subtitle">${enemy.desc} | ❤️ ${enemy.hp} HP | ⚔️ ATK ${enemy.atk}</div>
                        <div style="background:var(--bg-mid); padding:15px; border-radius:8px; margin:10px 0;">
                            <div style="font-size:1.5rem; text-align:center;">⚔️</div>
                            <div style="display:flex; justify-content:space-between;">
                                <span>💪 SEU PODER: ${playerPower}</span>
                                <span>❤️ SEUS PONTOS: ${playerHP}</span>
                            </div>
                            <div class="progress-track" style="margin:10px 0;"><div class="progress-fill" id="battleHpBar" style="width:${(playerHP / 500) * 100}%; background:#27ae60;"></div></div>
                        </div>
                        <div class="pz-feedback" id="battleFb"></div>
                        <div style="display:flex; gap:12px; justify-content:center;">
                            <button class="btn btn-primary" id="attackBtn">⚡ ATACAR ⚡</button>
                            <button class="btn" id="henshinBoost">変 HENSHIN BOOST (+30 ATK por 1 vez)</button>
                        </div>
                        <div id="criticalLog" style="margin-top:12px; font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted);"></div>
                    `;

                    const attackBtn = c.querySelector('#attackBtn');
                    const boostBtn = c.querySelector('#henshinBoost');
                    const fb = c.querySelector('#battleFb');
                    const logDiv = c.querySelector('#criticalLog');
                    let boosted = false;

                    attackBtn.onclick = () => {
                        let damage = playerPower + Math.floor(Math.random() * 30);
                        const crit = Math.random() < 0.15;
                        if (crit) {
                            damage = Math.floor(damage * 1.8);
                            logDiv.innerHTML = '<span style="color:#f1c40f;">✨ CRITICAL HENSHIN! ✨ Dano x1.8!</span>';
                        } else {
                            logDiv.innerHTML = '';
                        }
                        enemy.hp -= damage;
                        fb.innerHTML = `💥 Você causou ${damage} de dano!`;

                        if (enemy.hp <= 0) {
                            fb.innerHTML += `<br>🎉 ${enemy.name} derrotado!`;
                            if (wave === 10) {
                                fb.innerHTML += `<br><span style="color:#f1c40f;font-size:1.2rem;">🏆 VITÓRIA! Você derrotou OHMA ZI-O e salvou todas as eras! 🏆</span>`;
                                setTimeout(() => {
                                    KR.Game.addCoins(200);
                                    KR.Game.addXP(500);
                                    KR.Game.addItem('legendary_evolution_core');
                                    KR.UI.notify('🏆 SALVADOR DAS ERAS! +200🪙 +500XP +Núcleo Evolução', '🏆');
                                    solve();
                                }, 1500);
                                return;
                            }
                            setTimeout(() => nextWave(), 1200);
                            return;
                        }

                        const counter = enemy.atk + Math.floor(Math.random() * 20);
                        playerHP -= counter;
                        fb.innerHTML += `<br>💢 ${enemy.name} contra-ataca e causa ${counter} de dano!`;

                        if (playerHP <= 0) {
                            fb.innerHTML += `<br><span style="color:#e74c3c;">💀 DERROTA! Você foi vencido. Tente novamente.</span>`;
                            setTimeout(() => {
                                KR.UI.closeModal();
                                KR.UI.notify('❌ Você foi derrotado na batalha final...', '💀');
                            }, 1500);
                            return;
                        }
                        const hpPercent = (playerHP / 500) * 100;
                        const hpBar = c.querySelector('#battleHpBar');
                        if (hpBar) hpBar.style.width = Math.max(0, hpPercent) + '%';
                    };

                    boostBtn.onclick = () => {
                        if (boosted) {
                            fb.innerHTML = '❌ Você já usou o Henshin Boost nesta fase!';
                            return;
                        }
                        playerPower += 30;
                        boosted = true;
                        fb.innerHTML = '✨ HENSHIN BOOST! Seu poder aumentou em 30! ✨';
                        boostBtn.disabled = true;
                    };
                };

                const nextWave = () => {
                    wave++;
                    const waveKey = `wave${wave}`;
                    if (enemies[waveKey]) {
                        enemy = { ...enemies[waveKey] };
                        renderBattle();
                    }
                };
                renderBattle();
            }
        }
    };

    // =========================================================================
    // 2. OVERLAY MANAGEMENT (pilha)
    // =========================================================================
    let overlayStack = [];

    function pushOverlay(overlayId) {
        const ov = document.getElementById(overlayId);
        if (ov && !ov.classList.contains('active')) {
            ov.classList.add('active');
            overlayStack.push(overlayId);
        }
    }

    function popOverlay() {
        if (overlayStack.length === 0) return;
        const lastId = overlayStack.pop();
        const ov = document.getElementById(lastId);
        if (ov) ov.classList.remove('active');
    }

    // =========================================================================
    // 3. PUZZLE OPENING & REWARDS
    // =========================================================================
    const NO_DEFAULT_REWARD = ['drivers_rebuild', 'final_showdown'];

    function openPuzzle(obj) {
        const pz = PUZZLES[obj.puzzleId];
        if (!pz) return;
        const ov = document.getElementById('puzzle-overlay');
        const cnt = document.getElementById('puzzle-content');
        pushOverlay('puzzle-overlay');

        cnt.innerHTML = `<div class="loading-puzzle"><div class="spinner"></div> Carregando puzzle...</div>`;

        requestAnimationFrame(() => {
            pz.build(cnt, () => {
                popOverlay();
                KR.Game.markObjectUsed(obj.id);

                const flagMap = {
                    sequence: 'labPuzzleDone', code: 'archivePuzzleDone', match: 'garagePuzzleDone',
                    quiz: 'trainingPuzzleDone', era_code: 'galleryPuzzleDone', episodes: 'cinemaPuzzleDone',
                    thirteen: 'showaComplete'
                };
                if (flagMap[obj.puzzleId]) KR.Game.setFlag(flagMap[obj.puzzleId]);

                const coinsReward = {
                    match: 5, sequence: 8, code: 10, quiz: 8, henshin_type: 15,
                    quotes: 8, symbols: 6, memory: 10, era_code: 12, thirteen: 20,
                    belt: 6, episodes: 8
                };
                const xpReward = {
                    match: 30, sequence: 40, code: 50, quiz: 40, henshin_type: 60,
                    quotes: 40, symbols: 30, memory: 50, era_code: 60, thirteen: 100,
                    belt: 30, episodes: 40
                };

                if (!NO_DEFAULT_REWARD.includes(obj.puzzleId)) {
                    KR.Game.addCoins(coinsReward[obj.puzzleId] || 5);
                    KR.Game.addXP(xpReward[obj.puzzleId] || 20);
                }

                const rewards = { sequence: 'lab_keycard', code: 'archive_pass' };
                if (rewards[obj.puzzleId]) {
                    KR.Game.addItem(rewards[obj.puzzleId]);
                    const itemData = KR.Inventory.getItemData(rewards[obj.puzzleId]);
                    KR.UI.notify(`Item: ${itemData ? itemData.name : rewards[obj.puzzleId]}`, itemData ? itemData.icon : '🔑');
                } else if (!NO_DEFAULT_REWARD.includes(obj.puzzleId)) {
                    KR.UI.notify(`Puzzle resolvido! +${coinsReward[obj.puzzleId] || 5}🪙 +${xpReward[obj.puzzleId] || 20}XP`, '✅');
                } else {
                    KR.UI.notify(`Puzzle resolvido!`, '✅');
                }

                KR.UI.addLog(`Puzzle resolvido: ${obj.name}`, 'log-puzzle');
                KR.Inventory.render();
                KR.UI.updateLeftPanel();

                const currentRoom = KR.Game.getCurrentRoom();
                const room = KR.Rooms.getRoom(currentRoom);
                if (room) KR.UI.renderRoom(room.id);

                checkAchievementsNow();
                playSound('puzzle');
            });
        });
    }

    // =========================================================================
    // 4. COMBINE (Núcleo Omega) com limpeza de intervalo
    // =========================================================================
    function handleCombine(obj) {
        if (!(obj.requires || []).every(i => KR.Game.hasItem(i))) {
            KR.UI.notify('Você precisa dos 3 Fragmentos!', '⚠️');
            return;
        }
        if (KR.Game.hasItem('omega_core')) {
            KR.UI.notify('Núcleo Omega já criado!', '⚛️');
            return;
        }

        const ov = document.getElementById('puzzle-overlay');
        const cnt = document.getElementById('puzzle-content');
        pushOverlay('puzzle-overlay');

        cnt.innerHTML = `
            <div class="combine-screen">
                <div class="combine-title">⚛️ SÍNTESE OMEGA</div>
                <div class="combine-fragments">
                    <span class="combine-frag">🔶</span>
                    <span class="combine-plus">+</span>
                    <span class="combine-frag">🔷</span>
                    <span class="combine-plus">+</span>
                    <span class="combine-frag">🔹</span>
                </div>
                <div class="combine-arrow">↓</div>
                <div class="combine-result" id="cr">[ SINTETIZANDO... ]</div>
                <div class="combine-instructions">Os fragmentos se fundem, criando o poderoso Núcleo Omega!</div>
                <div class="combine-bar-track"><div class="combine-bar" id="cb"></div></div>
            </div>
        `;

        let p = 0;
        const bar = cnt.querySelector('#cb');
        const intervalId = setInterval(() => {
            p += 4;
            bar.style.width = p + '%';
            if (p >= 100) {
                clearInterval(intervalId);
                cnt.querySelector('#cr').innerHTML = '<span style="color:var(--era-secret);font-size:2rem">⚛️ NÚCLEO OMEGA CRIADO!</span>';
                setTimeout(() => {
                    popOverlay();
                    KR.Game.addItem('omega_core');
                    KR.Game.addXP(200);
                    KR.Game.addCoins(50);
                    KR.UI.notify('Núcleo Omega sintetizado! Área Secreta desbloqueada!', '⚛️');
                    KR.UI.addLog('Núcleo Omega criado!', 'log-secret');
                    KR.Inventory.render();
                    KR.UI.updateLeftPanel();
                    const room = KR.Rooms.getRoom(KR.Game.getCurrentRoom());
                    if (room) KR.UI.renderRoom(room.id);
                }, 800);
            }
        }, 50);

        const closeBtn = document.getElementById('puzzle-close');
        const cleanup = () => clearInterval(intervalId);
        if (closeBtn) closeBtn.addEventListener('click', cleanup, { once: true });
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        KR.Game.markObjectUsed(obj.id);
    }

    // =========================================================================
    // 5. DAILY CHALLENGE
    // =========================================================================
    function showDailyChallenge() {
        if (KR.Game.getState().dailyChallengeDone) {
            KR.UI.notify('Desafio diário já concluído hoje!', '📅');
            return;
        }
        const challenges = ['quiz', 'quotes', 'symbols', 'memory', 'henshin_type', 'sequence'];
        const today = new Date().toISOString().slice(0, 10);
        const idx = today.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % challenges.length;
        const pzId = challenges[idx];
        const pz = PUZZLES[pzId];
        if (!pz) return;

        const ov = document.getElementById('puzzle-overlay');
        const cnt = document.getElementById('puzzle-content');
        pushOverlay('puzzle-overlay');
        cnt.innerHTML = `
            <div style="text-align:center;margin-bottom:12px">
                <div style="font-family:var(--font-display);color:var(--era-secret);font-size:0.8rem;letter-spacing:0.2em">📅 DESAFIO DIÁRIO</div>
                <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--text-muted)">Recompensa: +10🪙 +50XP</div>
            </div>
            <div id="dc-pz"></div>
        `;
        pz.build(cnt.querySelector('#dc-pz'), () => {
            popOverlay();
            KR.Game.completeDaily();
            KR.UI.notify('Desafio diário concluído! +10🪙 +50XP', '📅');
            KR.UI.updateLeftPanel();
        });
    }

    // =========================================================================
    // 6. SHOP FUNCTIONS (mantido igual)
    // =========================================================================
    function openShop() {
        const coins = KR.Game.getCoins();
        const state = KR.Game.getState();
        const hasCRT = state.crtMode;
        const wins = state.duelWins || 0;
        const purchasedThemes = state.purchasedThemes || [];
        const purchasedItems = state.shopPurchases || [];

        const modalHtml = `
            <div class="modal-lore">
                <div class="modal-lore-title">🪙 LOJA DO ARQUIVO — ${coins} moedas disponíveis</div>
                <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); text-align:center; margin-bottom:16px;">
                    ⚡ Novos itens toda semana! Volte sempre para ofertas especiais ⚡
                </div>
                <div class="shop-grid" style="display:grid; gap:12px; max-height:500px; overflow-y:auto; padding-right:8px;">
                    <div class="shop-section" style="background:var(--bg-mid); border-radius:6px; padding:8px; margin-bottom:4px;">
                        <div class="shop-section-title">🎨 PERSONALIZAÇÃO</div>
                        <div class="shop-item"><span>🎨 Tema Âmbar</span><span>Esquema de cores vintage</span><button class="btn" onclick="KR.Events.buyTheme('amber')" ${purchasedThemes.includes('amber') ? 'disabled' : ''}>${purchasedThemes.includes('amber') ? '✓ ADQUIRIDO' : '15🪙'}</button></div>
                        <div class="shop-item"><span>🎨 Tema Neon Heisei</span><span>Cores ciano da Era Heisei</span><button class="btn" onclick="KR.Events.buyTheme('heisei-neon')" ${purchasedThemes.includes('heisei-neon') ? 'disabled' : ''}>${purchasedThemes.includes('heisei-neon') ? '✓ ADQUIRIDO' : '20🪙'}</button></div>
                        <div class="shop-item"><span>🎨 Tema Showa Retro</span><span>Estilo fotograma antigo</span><button class="btn" onclick="KR.Events.buyTheme('showa-retro')" ${purchasedThemes.includes('showa-retro') ? 'disabled' : ''}>${purchasedThemes.includes('showa-retro') ? '✓ ADQUIRIDO' : '25🪙'}</button></div>
                        <div class="shop-item"><span>📟 Modo CRT</span><span>Efeito scanlines retro</span><button class="btn" onclick="KR.Events.buyCRT()">${hasCRT ? '✓ ATIVADO' : '10🪙'}</button></div>
                    </div>
                    <div class="shop-section" style="background:var(--bg-mid); border-radius:6px; padding:8px; margin-bottom:4px;">
                        <div class="shop-section-title">💡 DICAS E AJUDA</div>
                        <div class="shop-item"><span>💡 Dica de Puzzle</span><span>Revela uma resposta</span><button class="btn" onclick="KR.Events.buyHint()">5🪙</button></div>
                        <div class="shop-item"><span>🔍 Dica de Localização</span><span>Revela onde encontrar fragmentos</span><button class="btn" onclick="KR.Events.buyLocationHint()">8🪙</button></div>
                        <div class="shop-item"><span>🗺️ Mapa Secreto</span><span>Revela todas as salas</span><button class="btn" onclick="KR.Events.buyMapReveal()" ${purchasedItems.includes('map_reveal') ? 'disabled' : ''}>${purchasedItems.includes('map_reveal') ? '✓ ADQUIRIDO' : '50🪙'}</button></div>
                    </div>
                    <div class="shop-section" style="background:var(--bg-mid); border-radius:6px; padding:8px; margin-bottom:4px;">
                        <div class="shop-section-title">🎁 ITENS ESPECIAIS</div>
                        <div class="shop-item"><span>📦 Booster Pack</span><span>3 cartas para seu deck</span><button class="btn" onclick="KR.Events.buyBooster()">25🪙</button></div>
                        <div class="shop-item"><span>💊 Poção de Energia</span><span>+50 HP no próximo duelo</span><button class="btn" onclick="KR.Events.buyEnergyPotion()">15🪙</button></div>
                        <div class="shop-item"><span>⚡ Bônus de XP (x2)</span><span>Dobra XP por 1 hora</span><button class="btn" onclick="KR.Events.buyXpBoost()">40🪙</button></div>
                        <div class="shop-item"><span>💰 Multiplicador de Moedas (x2)</span><span>Dobra moedas por 30 min</span><button class="btn" onclick="KR.Events.buyCoinBoost()">35🪙</button></div>
                        <div class="shop-item"><span>🔓 Chave do Cofre</span><span>Resolve um puzzle instantaneamente</span><button class="btn" onclick="KR.Events.buySkipPuzzle()" ${purchasedItems.includes('skip_puzzle') ? 'disabled' : ''}>${purchasedItems.includes('skip_puzzle') ? '✓ USADO' : '100🪙'}</button></div>
                    </div>
                    <div class="shop-section" style="background:var(--bg-mid); border-radius:6px; padding:8px; margin-bottom:4px;">
                        <div class="shop-section-title">🃏 CARTAS LENDÁRIAS</div>
                        ${['Kamen Rider Kuuga', 'Kamen Rider Ryuki', 'Kamen Rider Faiz', 'Kamen Rider W', 'Kamen Rider OOO', 'Kamen Rider Build'].map(card =>
            `<div class="shop-item"><span>🃏 ${card}</span><span>ATK/DEF variável</span><button class="btn" onclick="KR.Events.buyCard('${card}')">30🪙</button></div>`
        ).join('')}
                        <div class="shop-item"><span>🃏 Final Attack Ride</span><span>Destrói o monstro mais forte</span><button class="btn" onclick="KR.Events.buyCard('Final Attack Ride')">20🪙</button></div>
                        <div class="shop-item"><span>🃏 Rider Punch</span><span>Causa 400 de dano direto</span><button class="btn" onclick="KR.Events.buyCard('Rider Punch')">15🪙</button></div>
                        <div class="shop-item"><span>🛡️ Escudo Espelho</span><span>Anula ataque e causa 300 de dano</span><button class="btn" onclick="KR.Events.buyCard('Escudo Espelho')">20🪙</button></div>
                    </div>
                    <div class="shop-section" style="background:linear-gradient(135deg, rgba(241,196,15,0.1), rgba(230,126,34,0.05)); border:1px solid var(--era-secret); border-radius:6px; padding:8px; margin-bottom:4px;">
                        <div class="shop-section-title">⚡ OFERTAS ESPECIAIS ⚡</div>
                        <div class="shop-item"><span>🎁 Pack Iniciante</span><span>1 Booster + 2 Dicas + 50 XP</span><button class="btn" onclick="KR.Events.buyStarterPack()">75🪙</button></div>
                        <div class="shop-item"><span>🎁 Pack Duelista</span><span>3 Boosters + Carta Lendária</span><button class="btn" onclick="KR.Events.buyDuelistPack()">150🪙</button></div>
                        <div class="shop-item"><span>🎁 Pack Arquivista</span><span>Todos os temas + Avatar + Bônus</span><button class="btn" onclick="KR.Events.buyArchivistPack()">300🪙</button></div>
                    </div>
                </div>
                <div class="shop-coins" style="margin-top:16px; text-align:center; font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted); border-top:1px solid var(--border-dim); padding-top:12px;">
                    💰 Você tem ${coins} moedas | ${wins} vitórias em duelos
                </div>
            </div>
        `;
        KR.UI.openModal(modalHtml);
    }

    function buyTheme(theme) {
        const themes = {
            amber: { name: 'Tema Âmbar', price: 15, bgDeep: '#1a1200', bgDark: '#1f1600', bgMid: '#2a1f00', bgPanel: '#2a1f08' },
            'heisei-neon': { name: 'Tema Neon Heisei', price: 20, bgDeep: '#001a1a', bgDark: '#002222', bgMid: '#003333', bgPanel: '#003030' },
            'showa-retro': { name: 'Tema Showa Retro', price: 25, bgDeep: '#1a0a00', bgDark: '#2a1500', bgMid: '#3a2000', bgPanel: '#3a2008' }
        };
        const t = themes[theme];
        if (!t) return;
        if (!KR.Game.spendCoins(t.price)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        if (!state.purchasedThemes) state.purchasedThemes = [];
        if (!state.purchasedThemes.includes(theme)) state.purchasedThemes.push(theme);
        document.documentElement.style.setProperty('--bg-deep', t.bgDeep);
        document.documentElement.style.setProperty('--bg-dark', t.bgDark);
        document.documentElement.style.setProperty('--bg-mid', t.bgMid);
        document.documentElement.style.setProperty('--bg-panel', t.bgPanel);
        if (theme === 'heisei-neon') document.documentElement.style.setProperty('--era-current', '#00c8e0');
        if (theme === 'showa-retro') {
            document.documentElement.style.setProperty('--era-current', '#e67e22');
            document.body.classList.add('crt-mode');
        }
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify(`${t.name} ativado!`, '🎨');
        KR.UI.updateLeftPanel();
    }

    function buyCRT() {
        if (!KR.Game.spendCoins(10)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const newMode = !document.body.classList.contains('crt-mode');
        KR.Game.setCrtMode(newMode);
        KR.UI.closeModal();
        KR.UI.notify('Modo CRT alternado!', '📟');
    }

    function buyHint() {
        if (!KR.Game.spendCoins(5)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        KR.UI.closeModal();
        KR.UI.notify('💡 Dica: Leia os terminais de cada ala para encontrar fragmentos! Use o mapa para navegar.', '💡');
    }

    function buyLocationHint() {
        if (!KR.Game.spendCoins(8)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        const missing = [];
        if (!state.collectedItems.includes('fragment_showa')) missing.push('Fragmento Showa → Sala Showa após ler terminal');
        if (!state.collectedItems.includes('fragment_heisei')) missing.push('Fragmento Heisei → Sala Heisei após ler terminal');
        if (!state.collectedItems.includes('fragment_reiwa')) missing.push('Fragmento Reiwa → Sala Reiwa após ler terminal');
        if (!state.collectedItems.includes('fragment_era')) missing.push('Fragmento Era → Sala Secreta após coletar os 3 anteriores');
        if (!state.collectedItems.includes('fragment_episodes')) missing.push('Fragmento Episódios → Sala de Cinema após ler terminal');
        let hint = '🔍 Dica de Localização:\n';
        hint += missing.length ? missing.join('\n') : 'Você já tem todos os fragmentos! Vá ao Hall dos Crossovers para sintetizar o Núcleo Omega.';
        KR.UI.closeModal();
        KR.UI.notify(hint, '🗺️');
    }

    function buyMapReveal() {
        if (!KR.Game.spendCoins(50)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        if (!state.shopPurchases) state.shopPurchases = [];
        state.shopPurchases.push('map_reveal');
        state.flags.map_revealed = true;
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify('🗺️ Mapa revelado! Todas as salas estão visíveis!', '🗺️');
    }

    function buyBooster() {
        if (!KR.Game.spendCoins(25)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const cardPool = ['Kamen Rider Geats', 'Kamen Rider Ex-Aid', 'Kamen Rider Zero-One', 'Kamen Rider Build', 'Kamen Rider OOO', 'Rider Kick', 'Rider Punch', 'Henshin!', 'Contra-ataque', 'Final Attack Ride', 'Kamen Rider Kuuga', 'Kamen Rider Ryuki', 'Kamen Rider Faiz', 'Kamen Rider W'];
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
        KR.UI.closeModal();
        KR.UI.notify(`📦 Booster aberto! Novas cartas: ${obtained.join(', ')}`, '📦');
        KR.UI.updateLeftPanel();
    }

    function buyEnergyPotion() {
        if (!KR.Game.spendCoins(15)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        if (!state.shopPurchases) state.shopPurchases = [];
        state.shopPurchases.push('energy_potion');
        state.energyPotion = true;
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify('💊 Poção de Energia adquirida! Próxima batalha terá +50 HP inicial.', '💊');
    }

    function buyXpBoost() {
        if (!KR.Game.spendCoins(40)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        if (!state.shopPurchases) state.shopPurchases = [];
        state.shopPurchases.push('xp_boost');
        state.xpBoostExpiry = Date.now() + 3600000;
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify('⚡ XP Boost ativado por 1 hora!', '⚡');
    }

    function buyCoinBoost() {
        if (!KR.Game.spendCoins(35)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        if (!state.shopPurchases) state.shopPurchases = [];
        state.shopPurchases.push('coin_boost');
        state.coinBoostExpiry = Date.now() + 1800000;
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify('🪙 Coin Boost ativado por 30 minutos!', '🪙');
    }

    function buySkipPuzzle() {
        if (!KR.Game.spendCoins(100)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        if (!state.shopPurchases) state.shopPurchases = [];
        state.shopPurchases.push('skip_puzzle');
        state.skipPuzzleAvailable = true;
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify('🔓 Chave do Cofre adquirida! Use em qualquer puzzle para resolvê-lo instantaneamente.', '🔓');
    }

    function buyCard(cardId) {
        const prices = {
            'Kamen Rider Kuuga': 30, 'Kamen Rider Ryuki': 30, 'Kamen Rider Faiz': 30,
            'Kamen Rider W': 30, 'Kamen Rider OOO': 30, 'Kamen Rider Build': 30,
            'Final Attack Ride': 20, 'Rider Punch': 15, 'Escudo Espelho': 20
        };
        const price = prices[cardId];
        if (!price) return;
        if (!KR.Game.spendCoins(price)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        const current = state.duelCards || ['Kamen Rider 1', 'Henshin!', 'Rider Kick', 'Kamen Rider BLACK', 'Ciclo de Proteção'];
        if (!current.includes(cardId)) {
            current.push(cardId);
            state.duelCards = current;
            KR.Game.save();
            KR.UI.closeModal();
            KR.UI.notify(`🃏 Carta ${cardId} adicionada ao seu deck!`, '🃏');
        } else {
            KR.UI.notify(`Você já possui a carta ${cardId}!`, '⚠️');
        }
    }

    function buyStarterPack() {
        if (!KR.Game.spendCoins(75)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const newCards = ['Kamen Rider Geats', 'Kamen Rider Ex-Aid', 'Rider Kick', 'Rider Punch', 'Henshin!'];
        const obtained = [];
        for (let i = 0; i < 3; i++) {
            const card = newCards[Math.floor(Math.random() * newCards.length)];
            if (!obtained.includes(card)) obtained.push(card);
        }
        const state = KR.Game.getState();
        const current = state.duelCards || ['Kamen Rider 1', 'Henshin!', 'Rider Kick', 'Kamen Rider BLACK', 'Ciclo de Proteção'];
        for (const card of obtained) {
            if (!current.includes(card)) current.push(card);
        }
        state.duelCards = current;
        if (!state.shopPurchases) state.shopPurchases = [];
        state.shopPurchases.push('starter_pack');
        state.hintCredits = (state.hintCredits || 0) + 2;
        KR.Game.addXP(50);
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify('🎁 Pack Iniciante adquirido! +3 cartas, +2 dicas, +50 XP!', '🎁');
        KR.UI.updateLeftPanel();
    }

    function buyDuelistPack() {
        if (!KR.Game.spendCoins(150)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const allCards = ['Kamen Rider Kuuga', 'Kamen Rider Ryuki', 'Kamen Rider Faiz', 'Kamen Rider W', 'Kamen Rider OOO', 'Kamen Rider Build', 'Kamen Rider Geats', 'Kamen Rider Ex-Aid', 'Kamen Rider Zero-One', 'Final Attack Ride', 'Rider Kick'];
        const obtained = [];
        for (let b = 0; b < 3; b++) {
            for (let i = 0; i < 3; i++) {
                const card = allCards[Math.floor(Math.random() * allCards.length)];
                if (!obtained.includes(card)) obtained.push(card);
            }
        }
        const legendaryCards = ['Kamen Rider Kuuga', 'Kamen Rider Ryuki', 'Kamen Rider Faiz', 'Kamen Rider Build', 'Kamen Rider Geats'];
        const legendary = legendaryCards[Math.floor(Math.random() * legendaryCards.length)];
        if (!obtained.includes(legendary)) obtained.push(legendary);
        const state = KR.Game.getState();
        const current = state.duelCards || ['Kamen Rider 1', 'Henshin!', 'Rider Kick', 'Kamen Rider BLACK', 'Ciclo de Proteção'];
        for (const card of obtained) {
            if (!current.includes(card)) current.push(card);
        }
        state.duelCards = current;
        if (!state.shopPurchases) state.shopPurchases = [];
        state.shopPurchases.push('duelist_pack');
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify(`🎁 Pack Duelista adquirido! +${obtained.length} cartas (incluindo ${legendary} lendário!)`, '🎁');
        KR.UI.updateLeftPanel();
    }

    function buyArchivistPack() {
        if (!KR.Game.spendCoins(300)) {
            KR.UI.notify('Moedas insuficientes!', '❌');
            return;
        }
        const state = KR.Game.getState();
        if (!state.shopPurchases) state.shopPurchases = [];
        state.shopPurchases.push('archivist_pack');
        if (!state.purchasedThemes) state.purchasedThemes = [];
        const allThemes = ['amber', 'heisei-neon', 'showa-retro'];
        for (const theme of allThemes) {
            if (!state.purchasedThemes.includes(theme)) state.purchasedThemes.push(theme);
        }
        state.avatar = 'legend';
        KR.Game.addXP(100);
        const extraCards = ['Kamen Rider Kuuga', 'Kamen Rider Ryuki', 'Kamen Rider Faiz', 'Kamen Rider W', 'Kamen Rider OOO', 'Kamen Rider Build'];
        const current = state.duelCards || ['Kamen Rider 1', 'Henshin!', 'Rider Kick', 'Kamen Rider BLACK', 'Ciclo de Proteção'];
        for (let i = 0; i < 4; i++) {
            const card = extraCards[Math.floor(Math.random() * extraCards.length)];
            if (!current.includes(card)) current.push(card);
        }
        state.duelCards = current;
        KR.Game.save();
        KR.UI.closeModal();
        KR.UI.notify('🏆 Pack Arquivista! Todos os temas desbloqueados + Avatar Lendário + Bônus!', '🏆');
        KR.UI.updateLeftPanel();
    }

    // =========================================================================
    // 7. LIVRO DE CARTAS COMPLETO (chama KR.UI.createFlipCard)
    // =========================================================================
    function openCardBook() {
        const cardsData = [
            // SHOWA (1971-1994)
            { id: 'card_rider1', name: 'Kamen Rider 1', icon: '🦗', era: 'showa', year: '1971', desc: 'Takeshi Hongo, o lendário primeiro Rider.', atk: 1800, def: 1500, unlock: () => true, unlockHint: 'Sempre disponível' },
            { id: 'card_rider2', name: 'Kamen Rider 2', icon: '🦗', era: 'showa', year: '1971', desc: 'Hayato Ichimonji, o segundo Rider.', atk: 1850, def: 1550, unlock: () => KR.Game.hasVisited('showa'), unlockHint: 'Visite a Ala Showa' },
            { id: 'card_v3', name: 'Kamen Rider V3', icon: '🦗', era: 'showa', year: '1973', desc: 'Shiro Kazami, 26 transformações secretas.', atk: 1900, def: 1600, unlock: () => KR.Game.hasItem('fragment_showa'), unlockHint: 'Colete o Fragmento Showa' },
            { id: 'card_riderman', name: 'Riderman', icon: '🦾', era: 'showa', year: '1973', desc: 'Joji Yuki, braço mecânico e gancho.', atk: 1700, def: 1400, unlock: () => KR.Game.hasVisited('villains'), unlockHint: 'Visite o Arquivo dos Vilões' },
            { id: 'card_x', name: 'Kamen Rider X', icon: '⚡', era: 'showa', year: '1974', desc: 'Keisuke Jin, Rider aquático.', atk: 1750, def: 1650, unlock: () => KR.Game.hasVisited('garage'), unlockHint: 'Visite a Garagem' },
            { id: 'card_amazon', name: 'Kamen Rider Amazon', icon: '🦎', era: 'showa', year: '1974', desc: 'Daisuke Yamamoto, criado na selva.', atk: 1950, def: 1300, unlock: () => KR.Game.hasItem('cinema_pass'), unlockHint: 'Obtenha o Passe Cinema' },
            { id: 'card_stronger', name: 'Kamen Rider Stronger', icon: '⚡', era: 'showa', year: '1975', desc: 'Shigeru Jo, Rider elétrico.', atk: 2000, def: 1700, unlock: () => KR.Game.hasVisited('special'), unlockHint: 'Visite Riders Especiais' },
            { id: 'card_skyrider', name: 'Skyrider', icon: '🪽', era: 'showa', year: '1979', desc: 'Hiroshi Tsukuba, primeiro Rider a voar.', atk: 1750, def: 1550, unlock: () => KR.Game.getFlag('showaComplete'), unlockHint: 'Resolva o Puzzle dos 13 Riders' },
            { id: 'card_super1', name: 'Super-1', icon: '🤖', era: 'showa', year: '1980', desc: 'Kazuya Oki, 5 mãos intercambiáveis.', atk: 1850, def: 1650, unlock: () => KR.Game.getFlag('showaComplete'), unlockHint: 'Resolva o Puzzle dos 13 Riders' },
            { id: 'card_zx', name: 'Kamen Rider ZX', icon: '🗡️', era: 'showa', year: '1982', desc: 'Ryo Murasame, o ninja Rider.', atk: 1900, def: 1600, unlock: () => KR.Game.hasItem('fragment_showa'), unlockHint: 'Colete o Fragmento Showa' },
            { id: 'card_black', name: 'Kamen Rider BLACK', icon: '🌑', era: 'showa', year: '1987', desc: 'Kotaro Minami, príncipe das trevas.', atk: 2000, def: 1800, unlock: () => KR.Game.hasVisited('showa'), unlockHint: 'Visite a Ala Showa' },
            { id: 'card_black_rx', name: 'Kamen Rider BLACK RX', icon: '🌟', era: 'showa', year: '1988', desc: 'Evolução de BLACK. Robo Rider e Bio Rider.', atk: 2200, def: 1900, unlock: () => KR.Game.hasVisited('gallery'), unlockHint: 'Visite a Galeria de Formas' },
            { id: 'card_shin', name: 'Kamen Rider Shin', icon: '💉', era: 'showa', year: '1992', desc: 'Shin Kazamatsuri. Transformação perturbadora.', atk: 1700, def: 1400, unlock: () => KR.Game.hasVisited('special'), unlockHint: 'Visite Riders Especiais' },
            { id: 'card_zo', name: 'Kamen Rider ZO', icon: '🦎', era: 'showa', year: '1993', desc: 'Masaru Aso. Hibernou por anos.', atk: 1800, def: 1550, unlock: () => KR.Game.hasVisited('special'), unlockHint: 'Visite Riders Especiais' },
            { id: 'card_j', name: 'Kamen Rider J', icon: '🌍', era: 'showa', year: '1994', desc: 'Cresce até 40m. Luta por meio ambiente.', atk: 2100, def: 1800, unlock: () => KR.Game.hasVisited('special'), unlockHint: 'Visite Riders Especiais' },
            // HEISEI (2000-2018)
            { id: 'card_kuuga', name: 'Kamen Rider Kuuga', icon: '💪', era: 'heisei', year: '2000', desc: 'Yusuke Godai. "Luto para que ninguém precise chorar."', atk: 2000, def: 1800, unlock: () => KR.Game.hasVisited('heisei'), unlockHint: 'Visite a Ala Heisei' },
            { id: 'card_agito', name: 'Kamen Rider Agito', icon: '👑', era: 'heisei', year: '2001', desc: 'Shoichi Tsugami. Poder do sol.', atk: 2100, def: 1700, unlock: () => KR.Game.hasItem('fragment_heisei'), unlockHint: 'Colete o Fragmento Heisei' },
            { id: 'card_ryuki', name: 'Kamen Rider Ryuki', icon: '🐉', era: 'heisei', year: '2002', desc: 'Shinji Kido. Battle Royale.', atk: 1900, def: 1600, unlock: () => KR.Game.hasVisited('battle_royale'), unlockHint: 'Visite Battle Royale' },
            { id: 'card_faiz', name: 'Kamen Rider Faiz', icon: '⚡', era: 'heisei', year: '2003', desc: 'Takumi Inui. "Standing by... Complete."', atk: 1950, def: 1750, unlock: () => KR.Game.hasVisited('heisei'), unlockHint: 'Visite a Ala Heisei' },
            { id: 'card_blade', name: 'Kamen Rider Blade', icon: '♠️', era: 'heisei', year: '2004', desc: 'Kazuma Kenzaki. Cartas de baralho.', atk: 1900, def: 1900, unlock: () => KR.Game.getFlag('archivePuzzleDone'), unlockHint: 'Resolva o puzzle do Arquivo' },
            { id: 'card_hibiki', name: 'Kamen Rider Hibiki', icon: '🎵', era: 'heisei', year: '2005', desc: 'Hibiki. Música e tambores.', atk: 1850, def: 1650, unlock: () => KR.Game.hasVisited('music'), unlockHint: 'Visite a Sala das Músicas' },
            { id: 'card_kabuto', name: 'Kamen Rider Kabuto', icon: '🪲', era: 'heisei', year: '2006', desc: 'Souji Tendou. "Clock Up!"', atk: 2100, def: 1700, unlock: () => KR.Game.hasVisited('heisei'), unlockHint: 'Visite a Ala Heisei' },
            { id: 'card_deno', name: 'Kamen Rider Den-O', icon: '🚂', era: 'heisei', year: '2007', desc: 'Ryotaro Nogami. "Ore, sanjou!"', atk: 2000, def: 1700, unlock: () => KR.Game.hasVisited('cinema'), unlockHint: 'Visite o Cinema' },
            { id: 'card_kiva', name: 'Kamen Rider Kiva', icon: '🦇', era: 'heisei', year: '2008', desc: 'Wataru Kurenai. Rider vampiro.', atk: 1950, def: 1800, unlock: () => KR.Game.hasVisited('gallery'), unlockHint: 'Visite a Galeria' },
            { id: 'card_decade', name: 'Kamen Rider Decade', icon: '📸', era: 'heisei', year: '2009', desc: 'Tsukasa Kadoya. Viajante de mundos.', atk: 2050, def: 1750, unlock: () => KR.Game.hasVisited('crossovers'), unlockHint: 'Visite o Hall dos Crossovers' },
            { id: 'card_w', name: 'Kamen Rider W', icon: '🔌', era: 'heisei', year: '2009', desc: 'Shotaro & Philip. Dois em um.', atk: 2000, def: 1700, unlock: () => KR.Game.hasVisited('garage'), unlockHint: 'Visite a Garagem' },
            { id: 'card_ooo', name: 'Kamen Rider OOO', icon: '🪙', era: 'heisei', year: '2010', desc: 'Eiji Hino. Medalhas da alquimia.', atk: 1950, def: 1750, unlock: () => KR.Game.hasItem('xtreme_memory'), unlockHint: 'Obtenha a Xtreme Memory' },
            { id: 'card_fourze', name: 'Kamen Rider Fourze', icon: '🚀', era: 'heisei', year: '2011', desc: 'Gentaro Kisaragi. "UCHU KITA!"', atk: 1900, def: 1800, unlock: () => KR.Game.hasVisited('training'), unlockHint: 'Complete o treinamento' },
            { id: 'card_wizard', name: 'Kamen Rider Wizard', icon: '🧙', era: 'heisei', year: '2012', desc: 'Haruto Souma. Anéis elementais.', atk: 1850, def: 1850, unlock: () => KR.Game.hasItem('hazard_core'), unlockHint: 'Obtenha o Hazard Core' },
            { id: 'card_gaim', name: 'Kamen Rider Gaim', icon: '🍊', era: 'heisei', year: '2013', desc: 'Kouta Kazuraba. Frutas samurai.', atk: 2150, def: 1800, unlock: () => KR.Game.hasVisited('battle_royale'), unlockHint: 'Visite Battle Royale' },
            { id: 'card_drive', name: 'Kamen Rider Drive', icon: '🚗', era: 'heisei', year: '2014', desc: 'Shinnosuke Tomari. Rider policial.', atk: 2050, def: 1900, unlock: () => KR.Game.hasVisited('drivers'), unlockHint: 'Visite a Sala dos Drivers' },
            { id: 'card_ghost', name: 'Kamen Rider Ghost', icon: '👻', era: 'heisei', year: '2015', desc: 'Takeru Tenkuji. 99 dias para reviver.', atk: 1800, def: 1700, unlock: () => KR.Game.hasVisited('gallery'), unlockHint: 'Visite a Galeria' },
            { id: 'card_exaid', name: 'Kamen Rider Ex-Aid', icon: '🎮', era: 'heisei', year: '2016', desc: 'Emu Hojo. Médico gamer.', atk: 2200, def: 1500, unlock: () => KR.Game.getFlag('trainingPuzzleDone'), unlockHint: 'Resolva o puzzle de treino' },
            { id: 'card_build', name: 'Kamen Rider Build', icon: '🧪', era: 'heisei', year: '2017', desc: 'Sento Kiryu. "Best Match!"', atk: 2150, def: 1850, unlock: () => KR.Game.hasItem('fragment_heisei'), unlockHint: 'Colete o Fragmento Heisei' },
            { id: 'card_zio', name: 'Kamen Rider Zi-O', icon: '⌚', era: 'heisei', year: '2018', desc: 'Sougo Tokiwa. Rei Demônio do tempo.', atk: 2300, def: 2000, unlock: () => KR.Game.hasVisited('crossovers'), unlockHint: 'Acesse o Hall dos Crossovers' },
            // REIWA (2019-ATUAL)
            { id: 'card_zeroone', name: 'Kamen Rider Zero-One', icon: '🤖', era: 'reiwa', year: '2019', desc: 'Aruto Hiden. "AUTHORIZE! JUMP! RISE!"', atk: 2200, def: 1700, unlock: () => KR.Game.hasVisited('reiwa'), unlockHint: 'Visite a Ala Reiwa' },
            { id: 'card_saber', name: 'Kamen Rider Saber', icon: '⚔️', era: 'reiwa', year: '2020', desc: 'Touma Kamiyama. Escritor e espadachim.', atk: 2050, def: 1650, unlock: () => KR.Game.hasItem('fragment_reiwa'), unlockHint: 'Colete o Fragmento Reiwa' },
            { id: 'card_revice', name: 'Kamen Rider Revice', icon: '🦖', era: 'reiwa', year: '2021', desc: 'Ikki & Vice. Pacto com demônio.', atk: 2100, def: 1800, unlock: () => KR.Game.hasVisited('drivers'), unlockHint: 'Visite a Sala dos Drivers' },
            { id: 'card_geats', name: 'Kamen Rider Geats', icon: '🦊', era: 'reiwa', year: '2022', desc: 'Ukiyo Ace. Grande Prêmio do Desejo.', atk: 2400, def: 1600, unlock: () => KR.Game.getFlag('timeline_restored'), unlockHint: 'Complete a reconstrução dos Drivers' },
            { id: 'card_gotchard', name: 'Kamen Rider Gotchard', icon: '🃏', era: 'reiwa', year: '2023', desc: 'Houtaro Ichinose. Alquimia e Chemy Cards.', atk: 2150, def: 1750, unlock: () => KR.Game.hasVisited('games'), unlockHint: 'Visite o Game Archive' },
            // LENDÁRIAS
            { id: 'card_ishinomori', name: 'Shotaro Ishinomori', icon: '✍️', era: 'legend', year: '1938-1998', desc: 'Criador de Kamen Rider.', atk: 3000, def: 3000, unlock: () => KR.Game.hasItem('archivist_seal'), unlockHint: 'Obtenha o Selo do Arquivista' },
            { id: 'card_fujioka', name: 'Hiroshi Fujioka', icon: '⭐', era: 'legend', year: '1946-', desc: 'Ator original de Rider 1.', atk: 2800, def: 2500, unlock: () => KR.Game.getHenshinCount() >= 50, unlockHint: 'Grite HENSHIN 50 vezes' },
            { id: 'card_50th', name: '50 Anos de Kamen Rider', icon: '🏆', era: 'legend', year: '2021', desc: 'Carta comemorativa da platina.', atk: 3500, def: 3500, unlock: () => KR.Game.hasItem('omega_core'), unlockHint: 'Sintetize o Núcleo Omega' }
        ];

        const gridHtml = cardsData.map(card => {
            const isUnlocked = card.unlock();
            return `
                <div class="book-card ${isUnlocked ? 'book-card-owned' : 'book-card-locked'}" data-card-id="${card.id}" data-era="${card.era}">
                    <div class="book-card-icon">${card.icon}</div>
                    <div class="book-card-name">${card.name}</div>
                    <div class="book-card-era">${card.era === 'showa' ? '📺 SHOWA' : card.era === 'heisei' ? '💎 HEISEI' : card.era === 'reiwa' ? '🌿 REIWA' : '✨ LENDÁRIA'}</div>
                    <div class="book-card-status">${isUnlocked ? '✓ DESBLOQUEADA' : '🔒 BLOQUEADA'}</div>
                </div>
            `;
        }).join('');

        const modalHtml = `
            <div class="modal-lore">
                <div class="modal-lore-title">📖 LIVRO DE CARTAS — TODOS OS RIDERS</div>
                <div class="book-intro">
                    Toque em uma carta desbloqueada para vê-la em detalhes.
                    <span class="book-intro-highlight">Cartas bloqueadas são liberadas ao explorar o arquivo!</span>
                </div>
                <div class="book-filters">
                    <button class="filter-btn active" data-filter="all">📇 TODOS</button>
                    <button class="filter-btn" data-filter="showa">📺 SHOWA</button>
                    <button class="filter-btn" data-filter="heisei">💎 HEISEI</button>
                    <button class="filter-btn" data-filter="reiwa">🌿 REIWA</button>
                    <button class="filter-btn" data-filter="legend">✨ LENDÁRIAS</button>
                    <button class="filter-btn" data-filter="unlocked">✓ DESBLOQUEADAS</button>
                    <button class="filter-btn" data-filter="locked">🔒 BLOQUEADAS</button>
                </div>
                <div class="book-grid" id="bookGrid">
                    ${gridHtml}
                </div>
                <div class="book-stats">
                    <span>📊 ${cardsData.filter(c => c.unlock()).length}/${cardsData.length} cartas desbloqueadas</span>
                    <span>🏆 Progresso: ${Math.round((cardsData.filter(c => c.unlock()).length / cardsData.length) * 100)}%</span>
                </div>
                <div class="book-footer">Colete fragmentos, resolva puzzles e explore todas as salas para desbloquear novas cartas!</div>
            </div>
        `;

        KR.UI.openModal(modalHtml);

        setTimeout(() => {
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const filter = btn.dataset.filter;
                    filterCards(filter);
                });
            });

            document.querySelectorAll('.book-card').forEach(el => {
                const cardId = el.dataset.cardId;
                const card = cardsData.find(c => c.id === cardId);
                if (!card) return;

                el.addEventListener('click', () => {
                    if (!card.unlock()) {
                        KR.UI.notify(`🔒 Carta "${card.name}" bloqueada!\n💡 Dica: ${card.unlockHint}`, '🔒');
                        return;
                    }
                    const content = `
                        ${card.name} (${card.year})
                        
                        ${card.desc}
                        
                        📊 ESTATÍSTICAS:
                        • ATAQUE: ${card.atk}
                        • DEFESA: ${card.def}
                        
                        ${card.era === 'showa' ? '📺 Era Showa — O início de tudo' : card.era === 'heisei' ? '💎 Era Heisei — A evolução' : card.era === 'reiwa' ? '🌿 Era Reiwa — O futuro digital' : '✨ CARTA LENDÁRIA'}
                        
                        ✨ "HENSHIN!" — O grito ecoa através das eras.
                    `;
                    KR.UI.createFlipCard(content, card.name, card.icon);
                });
            });
        }, 100);

        function filterCards(filter) {
            const cards = document.querySelectorAll('.book-card');
            cards.forEach(card => {
                const cardId = card.dataset.cardId;
                const cardData = cardsData.find(c => c.id === cardId);
                const isUnlocked = cardData.unlock();
                const era = cardData.era;
                let show = false;
                switch (filter) {
                    case 'all': show = true; break;
                    case 'showa': show = era === 'showa'; break;
                    case 'heisei': show = era === 'heisei'; break;
                    case 'reiwa': show = era === 'reiwa'; break;
                    case 'legend': show = era === 'legend'; break;
                    case 'unlocked': show = isUnlocked; break;
                    case 'locked': show = !isUnlocked; break;
                    default: show = true;
                }
                card.style.display = show ? 'flex' : 'none';
            });
        }
    }

    // =========================================================================
    // 8. SOUND & AUDIO
    // =========================================================================
    let audioCtx = null;

    function getAudioCtx() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API não suportada');
            }
        }
        return audioCtx;
    }

    function playSound(type) {
        if (document.body.classList.contains('mute-mode')) return;
        const ctx = getAudioCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === 'puzzle') {
            osc.frequency.setValueAtTime(523, ctx.currentTime);
            osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
            osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        } else if (type === 'item') {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        } else if (type === 'nav') {
            osc.frequency.setValueAtTime(330, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        }
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    }

    // =========================================================================
    // 9. KEYBOARD SHORTCUTS
    // =========================================================================
    function initKeyboard() {
        document.addEventListener('keydown', e => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const key = e.key;
            if (key === 'h' || key === 'H') document.getElementById('henshin-btn')?.click();
            if (key === 'm' || key === 'M') document.getElementById('map-btn')?.click();
            if (key === 'i' || key === 'I') document.getElementById('inv-sort-btn')?.click();
            if (key === 'f' || key === 'F') toggleFullscreen();
            if (key === 'Escape') { e.preventDefault(); popOverlay(); }
            if (key === 'd' || key === 'D') showDailyChallenge();
            if (key === 's' || key === 'S') document.getElementById('save-btn')?.click();
        });
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen();
        }
    }

    // =========================================================================
    // 10. EASTER EGGS / DATA ESPECIAIS
    // =========================================================================
    function checkEasterEggs() {
        const now = new Date();
        const md = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        if (md === '04-03') {
            setTimeout(() => KR.UI.notify('🎂 03/04 — Aniversário de Kamen Rider! (1971) Feliz Henshin Day!', '🎂'), 2000);
        }
        if (md === '09-20') {
            setTimeout(() => KR.UI.notify('🌙 20/09 — Dia de Shotaro Ishinomori! Obrigado, pai dos Riders.', '✍️'), 2000);
        }
    }

    // =========================================================================
    // 11. ACHIEVEMENTS CHECK
    // =========================================================================
    function checkAchievementsNow() {
        if (KR.UI && KR.UI.checkAchievements) KR.UI.checkAchievements();
    }

    // =========================================================================
    // 12. INITIALIZATION
    // =========================================================================
    function init() {
        const elements = {
            modalClose: document.getElementById('modal-close'),
            modalOverlay: document.getElementById('modal-overlay'),
            mapBtn: document.getElementById('map-btn'),
            mapClose: document.getElementById('map-close'),
            puzzleClose: document.getElementById('puzzle-close'),
            saveBtn: document.getElementById('save-btn'),
            resetBtn: document.getElementById('reset-btn'),
            henshinBtn: document.getElementById('henshin-btn'),
            dailyBtn: document.getElementById('daily-btn'),
            shopBtn: document.getElementById('shop-btn'),
            crtBtn: document.getElementById('crt-btn'),
            muteBtn: document.getElementById('mute-btn'),
            fsBtn: document.getElementById('fs-btn'),
            invSortBtn: document.getElementById('inv-sort-btn')
        };

        if (elements.modalClose) elements.modalClose.addEventListener('click', () => KR.UI.closeModal());
        if (elements.modalOverlay) elements.modalOverlay.addEventListener('click', e => {
            if (e.target === elements.modalOverlay) KR.UI.closeModal();
        });
        if (elements.mapBtn) elements.mapBtn.addEventListener('click', () => {
            KR.UI.renderMap();
            pushOverlay('map-overlay');
        });
        if (elements.mapClose) elements.mapClose.addEventListener('click', () => popOverlay());
        if (elements.puzzleClose) elements.puzzleClose.addEventListener('click', () => popOverlay());
        if (elements.saveBtn) elements.saveBtn.addEventListener('click', () => {
            KR.Game.save();
            KR.UI.notify('Progresso salvo!', '💾');
        });
        if (elements.resetBtn) elements.resetBtn.addEventListener('click', () => {
            if (!confirm('Resetar todo o progresso? Essa ação não pode ser desfeita.')) return;
            KR.Game.reset();
            popOverlay();
            KR.UI.notify('Resetado.', '↺');
            KR.UI.renderRoom('intro');
        });
        if (elements.henshinBtn) elements.henshinBtn.addEventListener('click', () => {
            KR.Game.incrementHenshin();
            if (KR.UI.triggerHenshin) KR.UI.triggerHenshin();
            KR.UI.updateLeftPanel();
            playSound('item');
        });
        if (elements.dailyBtn) elements.dailyBtn.addEventListener('click', showDailyChallenge);
        if (elements.shopBtn) elements.shopBtn.addEventListener('click', openShop);
        if (elements.crtBtn) elements.crtBtn.addEventListener('click', () => {
            const newMode = !document.body.classList.contains('crt-mode');
            KR.Game.setCrtMode(newMode);
            KR.UI.notify('Modo CRT alternado', '📟');
        });
        if (elements.muteBtn) elements.muteBtn.addEventListener('click', () => {
            document.body.classList.toggle('mute-mode');
            if (elements.muteBtn) elements.muteBtn.textContent = document.body.classList.contains('mute-mode') ? '🔇 SOM' : '🔊 SOM';
        });
        if (elements.fsBtn) elements.fsBtn.addEventListener('click', toggleFullscreen);
        if (elements.invSortBtn) elements.invSortBtn.addEventListener('click', () => {
            const m = document.body.dataset.sortMode === 'type' ? 'default' : 'type';
            document.body.dataset.sortMode = m;
            KR.Inventory.setSortMode(m);
            KR.UI.notify(m === 'type' ? 'Ordenado por tipo' : 'Ordem padrão', '📦');
        });

        document.querySelectorAll('.lp-era-card').forEach(card => {
            card.addEventListener('click', () => {
                const rid = card.dataset.room;
                if (rid && KR.Game.isRoomUnlocked(rid)) KR.UI.renderRoom(rid);
                else KR.UI.notify('Área bloqueada.', '🔒');
            });
        });

        initKeyboard();
        if (KR.UI && KR.UI.runLoadingScreen) {
            KR.UI.runLoadingScreen(() => {
                KR.Game.init();
                KR.UI.renderRoom(KR.Game.getCurrentRoom());
                KR.UI.addLog('Rider Archive v1.3 inicializado.', 'log-system');
                checkEasterEggs();
            });
        }
    }

    // =========================================================================
    // 13. EXPOSED API
    // =========================================================================
    return {
        init,
        openPuzzle,
        handleCombine,
        showDailyChallenge,
        openShop,
        buyHint,
        buyTheme,
        buyCRT,
        playSound,
        buyLocationHint,
        buyMapReveal,
        buyBooster,
        buyEnergyPotion,
        buyXpBoost,
        buyCoinBoost,
        buySkipPuzzle,
        buyCard,
        buyStarterPack,
        buyDuelistPack,
        buyArchivistPack,
        getAudioCtx,
        openCardBook
    };
})();