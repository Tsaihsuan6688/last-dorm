/* Last Dorm 2.6.0 — generated from src/. Do not edit this bundle. */
(()=>{
'use strict';
const factories={
"release.json": function(module, exports, require) {
module.exports = {"appVersion":"2.6.0","saveSchemaVersion":25,"readableSaveVersions":[19,20,21,22,23,24,25],"scope":"skill-tree-lite-life-resource-release","storageKey":"lastdorm_preview_localonly_v1","baseGitBlobSha":"711127c39f48e1ad5cb93dbcb9d9fd0e0466af73","artChanged":false,"additionalPropAssets":5,"externalPacks":false,"companionArtRevision":"companion.gsd.1","refactorRevision":1,"appearanceRevision":"presentation.fatigue.1","distribution":"versioned-resources","researchDate":"2026-10-21"};
},
"src/assistant/local.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAssistant = startAssistant;
function startAssistant() {
    const E = id => document.getElementById(id), engine = () => window.LastDorm;
    const STORE = 'lastdorm_localonly_desk_v1';
    const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    function cleanMemory(v) { return { story: v?.story === 2 ? 2 : 1, messages: Array.isArray(v?.messages) ? v.messages.filter(m => m && ['user', 'assistant', 'system'].includes(m.role) && typeof m.text === 'string').slice(-60).map(m => ({ role: m.role, text: m.text.slice(0, 6500), source: String(m.source || '本機紀錄').slice(0, 60), at: typeof m.at === 'string' ? m.at : new Date().toISOString(), actions: Array.isArray(m.actions) ? m.actions.filter(x => x && typeof x === 'object').slice(0, 6) : [] })) : [] }; }
    let memory = { messages: [], story: 1 }, storageError = false;
    try {
        memory = cleanMemory(JSON.parse(localStorage.getItem(STORE)));
    }
    catch {
        storageError = true;
    }
    let tab = 'talk', draft = '', notice = '', pendingMemory = null;
    const knownPanels = ['exam516', 'build', 'signal', 'decor', 'tasks', 'courses', 'inventory', 'journal', 'tophat', 'health', 'focus', 'saves', 'world', 'kitchen', 'wardrobe', 'companion', 'routine'];
    function saveMemory() {
        try {
            localStorage.setItem(STORE, JSON.stringify(memory));
            storageError = false;
        }
        catch {
            storageError = true;
            notice = '對話未存入瀏覽器；請用本機備份保留。';
        }
    }
    function clock() { return new Intl.DateTimeFormat('zh-TW', { timeZone: 'America/Los_Angeles', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date()); }
    function add(role, text, source = '本機規則', actions = []) { memory.messages.push({ id: uid(), role, text: String(text).slice(0, 6500), source, at: new Date().toISOString(), actions }); memory.messages = memory.messages.slice(-60); saveMemory(); }
    function snapshot() { return engine().snapshot(); }
    function nextTasks(s) { return engine().plan ? engine().plan() : s.tasks.filter(t => t.status !== 'done'); }
    function localAnswer(text) {
        const s = snapshot();
        if (/期中|midterm|top\s*hat|第?[七八78]章/i.test(text)) {
            const cfg = s.study516;
            const status = gid => { const t = s.tasks.find(x => x.id === cfg?.taskLinks?.[gid]); return t?.status === 'done' ? '已完成' : t?.status === 'inprogress' ? '進行中' : '未完成'; };
            return { text: `GSBA 516 先準備期中。TopHat 一章一個任務，不用登記題數。\nChapter 7：${status('ch7')}\nChapter 8：${status('ch8')}\n期中練習：${status('practice')}\n\n做完整章後自行勾選；我沒有讀取妳的 TopHat。新章節等老師發布後再新增，跨週不清零。`, actions: [{ label: 'TopHat 章節任務', panel: 'exam516' }, { label: '期中與其他優先任務', panel: 'tasks' }] };
        }
        if (/建設|升級基地|修復點|工作區復電|工作燈|暖燈/.test(text)) {
            const b = s.firstBuild;
            return { text: b.installedAt ? '第一個修復點已完成。工作區暖燈已接通；可以開關燈或查看本段室內訊號。基地仍是 Tier 0，沒有扣資源或重發 XP。' : b.evidence ? '已保存選定目標的新增進度。現在可到基地建設免費接通暖燈；不重發原任務獎勵。' : b.goal ? '本次目標：' + b.goal.label + '。請回原面板記錄真正完成的進度；計時與簽到不代替這一步。' : '第一段基地建設已可接取：從現有 TopHat、Journal 或待辦選一項。接取後再推進，完成時免費修復工作區暖燈。', actions: [{ label: '基地建設第一段', panel: 'build' }] };
        }
        if (/佈置|擺件|安置|放進房间|房間進度/.test(text))
            return { text: `目前已安置 ${Object.keys(s.roomDecor?.slots || {}).length} 件。取得的擺件可以放到房間固定位置，未取得只可免費試擺；收回不收費，也不重新發獎。`, actions: [{ label: '房間佈置', panel: 'decor' }, { label: '查看背包與兌換', panel: 'inventory' }] };
        if (/routine|例行|每週|每天|日常/i.test(text))
            return { text: '日常例行與有截止日的主線分開。每日依洛杉磯日期、每週依週一週期更新；不累积沒上線的欠項。TopHat 改為每章一項手動任務，未完成章節不因跨週消失。', actions: [{ label: '例行任務', panel: 'routine' }, { label: '主線優先級', panel: 'tasks' }] };
        if (/刻痕|抽屜|劇情|線索/.test(text)) {
            if (s.firstBuild?.installedAt)
                return { text: s.firstBuild.signalReadAt ? '妳已接通工作區照明，也讀過線路另一端的短訊。已知刻痕是編號 01；發訊者與其他編號尚未確認。後續章節未安裝，不能冒充權限不足。' : '工作區已復電，有一則本段室內訊號可以查看。不開門、不外出，也不扣資源。', actions: [{ label: '查看基地終端', panel: 'build' }] };
            return { text: memory.story === 2 ? '妳已在網站查看「住戶檢查卡」：日期、已確認任務、尚待確認的公告。後續章節尚未實作，不會冒充「權限不足」。本次沒有新增 XP 或生存幣。' : '門框的「01」已讓書桌抽屜鬆開。這是聊天中已發現的線索，目前移入網站；不重發獎勵。可在這裡查看抽屜，不用回 ChatGPT。', actions: [{ label: memory.story === 2 ? '查看住戶檢查卡' : '查看書桌抽屜', story: true }] };
        }
        if (/背包|物品|抽獎|分解/.test(text)) {
            return { text: `目前本機背包：\n${s.items.map(x => `${x.name} ×${x.qty}`).join('\n') || '沒有物品'}\n\n物品圖已接入背包。可分解物件會先列出產物並確認；起始、鎖定或未匹配物件不可分解。`, actions: [{ label: '打開背包', panel: 'inventory' }] };
        }
        if (/餘額|帳本|金幣|生存幣|狀態|XP|等級/i.test(text)) {
            return { text: `正式主帳仍鎖定在 140 XP／75 生存幣。\n這個網頁的網站本機帳本：${s.xp} XP／${s.coins} 生存幣／${s.tickets} 張探索券。\n兩者不相加。詢問系統不加分；AI 也無權修改任何餘額。`, actions: [{ label: '查看存檔', panel: 'saves' }] };
        }
        if (/任務|今天|現在要|接下來|作業|課程|截止|TopHat|journal/i.test(text)) {
            const tasks = nextTasks(s).slice(0, 4);
            return { text: `洛杉磯 ${clock()}。依本機資料，優先查看：\n${tasks.map((t, i) => `${i + 1}. ${t.course}｜${t.title}｜${t.due || t.window || '日期待確認'}${t.time ? ' ' + t.time : ''}（${t.status}）`).join('\n')}\n\n我沒有即時讀取 Brightspace；日期已過也只代表待核對，不會自動當作妳沒交。`, actions: [{ label: '打開任務', panel: 'tasks' }, { label: 'TopHat 章節任務', panel: 'tophat' }, { label: 'Journal 進度', panel: 'journal' }] };
        }
        return { text: '目前是本機規則模式，不是已連線的 AI。我能查網站裡的任務、餘額、物品與已公開線索；本版不提供自由 AI 問答；不會連外、也不需要登入。遊戲操作都在這個網頁內完成。', actions: [{ label: '查看任務', panel: 'tasks' }, { label: '資料與備份', tab: 'privacy' }] };
    }
    const host = document.createElement('div');
    host.innerHTML = `<button id="systemLauncher" data-open-assistant><span>✧</span><span>策策系統<small>本機查詢・無 AI 連線</small></span></button><dialog id="systemDesk" aria-labelledby="sdTitle"><header class="sd-head"><div><span class="sd-kicker">LAST DORM / LOCAL SYSTEM</span><h2 id="sdTitle">策策 · 本機主控台</h2></div><span class="sd-status" id="sdMode">本機查詢 · 非 AI</span><button class="sd-close" id="sdClose" aria-label="關閉系統助手">×</button></header><nav class="sd-tabs" role="tablist"><button data-sdtab="talk" role="tab">任務查詢</button><button data-sdtab="ledger" role="tab">本機帳本</button><button data-sdtab="privacy" role="tab">資料與備份</button></nav><div class="sd-body" id="sdBody"></div><div class="sd-footer" id="sdFooter"></div></dialog>`;
    document.body.append(host);
    function messageHTML(m) { return `<article class="sd-msg ${m.role === 'user' ? 'user' : ''}"><span class="sd-label">${m.role === 'user' ? 'LYDIA' : escape(m.source || '本機規則')}</span><p>${escape(m.text)}</p>${(m.actions || []).map(a => knownPanels.includes(a.panel) ? `<button class="sd-action" data-sdpanel="${a.panel}">${escape(a.label)} ↗</button>` : a.story ? `<button class="sd-action" data-sdstory>${escape(a.label)} ↗</button>` : a.tab === 'privacy' ? '<button class="sd-action" data-sdtab="privacy">資料與備份 ↗</button>' : '').join('')}</article>`; }
    function render() {
        if (!E('systemDesk').open)
            return;
        const s = snapshot();
        document.querySelectorAll('[data-sdtab][role=tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.sdtab === tab)));
        if (tab === 'talk') {
            E('sdBody').innerHTML = `<div class="sd-context">初階住戶 · LA ${clock()}<br>本機規則，不是付費 AI。聊天不加經驗、不改金幣。</div><div class="sd-chips"><button data-sdprompt="今天有哪些任務？">今天有哪些任務？</button><button data-sdprompt="查看目前帳本">查看帳本</button><button data-sdprompt="背包有什麼？">背包有什麼？</button></div>${memory.messages.length ? memory.messages.map(messageHTML).join('') : '<article class="sd-msg"><span class="sd-label">本機規則 · 不連外</span><p>現在只做一件事就好：打開「任務」查看一項，或登記本週 TopHat 章節。<br>沒有 Supabase 登入、API 金鑰欄位或付費 AI。資料只留在這個瀏覽器；這不是雲端同步版。</p><button class="sd-action" data-sdpanel="tasks">打開任務 ↗</button><button class="sd-action" data-sdpanel="tophat">登記 TopHat ↗</button></article>'}`;
            E('sdFooter').innerHTML = `<form id="sdSendForm" class="sd-compose"><textarea id="sdInput" rows="2" maxlength="1500" placeholder="查詢任務、帳本、背包…" aria-label="詢問本機系統">${escape(draft)}</textarea><button class="sd-send">查詢</button></form><div class="sd-fine">沒有任何雲端或 AI 呼叫。${storageError ? '本機對話儲存失敗，請匯出備份。' : '對話留在此瀏覽器；不是這串 ChatGPT 的延伸。'}</div>`;
        }
        else if (tab === 'ledger') {
            E('sdBody').innerHTML = `<div class="sd-grid"><div class="sd-card"><h3>正式主帳 · 不自動變動</h3><p><b>140 XP／75 生存幣</b></p><p>本機操作不疊加到這串對話的正式帳本。</p></div><div class="sd-card"><h3>網站本機紀錄</h3><p><b>${s.xp} XP／${s.coins} 生存幣</b></p><p>${s.tasks.filter(t => t.status === 'done').length} 項完成 · ${s.items.length} 種物品</p></div></div><div class="sd-card"><h3>先玩，不新增帳號</h3><p>本次更新沿用同一儲存位置，不相加其他對話或舊測試帳本。任務與物品的結算只由遊戲按鈕執行。</p><button class="sd-action" data-sdpanel="saves">遊戲存檔中心 ↗</button><button class="sd-action" data-sdtab="privacy">備份本機資料 ↗</button></div>`;
            E('sdFooter').innerHTML = '<div class="sd-fine">此頁顯示本機資料，不同裝置不會自動同步。</div>';
        }
        else {
            E('sdBody').innerHTML = `<div class="sd-note"><b>遊戲不將紀錄上傳雲端，也不呼叫 AI。</b><br>沒有登入、金鑰欄位或資料傳送程式；連線政策禁止程式發出 connect 請求。從 GitHub Pages 開站仍需要下載頁面，主機商可能保留一般存取紀錄。</div><div class="sd-card"><h3>資料留在哪裡？</h3><p>任務、對話及休整紀錄存於此瀏覽器。不會自動送到 OpenAI 或 Supabase。共用電腦上的其他使用者仍可能查看；此檔不是加密保險箱。</p><p>網站公開的是程式、美術及內建任務模板；妳後來輸入的任務、對話與休整紀錄不會自動上傳。請不要把 JSON 備份、原始寫真、課綱 PDF 或任何金鑰放進公開儲存庫。</p><p>不同瀏覽器或装置沒有自動同步。清除網站資料可能刪除存檔。檔案模式的保存行為依瀏覽器而異，請保留 JSON 備份。</p></div><div class="sd-card"><h3>手動備份</h3><p>完整備份包含這個網站的遊戲、對話及休整紀錄，不含任何登入或金鑰。備份是私人物件，<b>不要上傳公開 GitHub</b>。</p><div class="sd-inline"><button class="sd-action" id="sdExport">匯出本機完整備份</button><label class="sd-action">匯入網站備份<input id="sdImport" type="file" accept=".json,application/json" hidden></label><button class="sd-action" data-sdpanel="saves">只匯入／匯出遊戲</button></div></div><div class="sd-card"><h3>目前範圍</h3><p>保留原有美術與基本遊戲功能。尚未新增自由 AI、雲端同步或 ZIP 安裝器；分解使用遊戲背包的既有規則，不把未完成的功能說成已上線。</p><p>可以隨時關閉遊戲，不設離線、缺席或失眠懲罰。</p></div><div class="sd-result" role="status">${escape(notice)}</div><button class="sd-history-action" id="sdClear">清除本機系統對話（不動遊戲存檔）</button>`;
            E('sdFooter').innerHTML = '<div class="sd-fine">沒有 API 用量費，也不要求信用卡。這是本版的功能範圍，不是完整安全認證。</div>';
        }
    }
    function openDesk(next = 'talk') {
        document.querySelectorAll('dialog[open]').forEach(d => {
            if (d !== E('systemDesk'))
                d.close();
        });
        tab = ['talk', 'ledger', 'privacy'].includes(next) ? next : 'talk';
        if (!E('systemDesk').open)
            E('systemDesk').showModal();
        render();
    }
    function jump(panel) {
        if (!knownPanels.includes(panel))
            return;
        E('systemDesk').close();
        engine().openPanel(panel);
    }
    function ask(text) {
        text = String(text).trim().slice(0, 1500);
        if (!text)
            return;
        if (/sk-[a-zA-Z0-9_-]{12,}|sb_secret_/.test(text)) {
            add('system', '訊息可能含有秘密金鑰；未保存內容。本檔不需要金鑰，請勿貼上。', '安全提示');
            draft = '';
            render();
            return;
        }
        add('user', text, '使用者');
        draft = '';
        const a = localAnswer(text);
        add('assistant', a.text, '本機規則 · 非 AI', a.actions);
        render();
        E('sdBody').scrollTop = E('sdBody').scrollHeight;
    }
    function bundle() { return { format: 'lastdorm-web-bundle', version: 1, mode: 'local-only', exportedAt: new Date().toISOString(), officialBaseline: { xp: 140, coins: 75 }, game: snapshot(), assistant: structuredClone(memory) }; }
    function download() {
        if (engine().protectionStatus?.().readError) {
            jump('updates');
            return;
        }
        const blob = new Blob([JSON.stringify(bundle(), null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url;
        a.download = `LastDorm_本機完整備份_${engine().today()}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
    async function importBundle(v) {
        if (!v || v.format !== 'lastdorm-web-bundle' || v.version !== 1 || !v.game || !Number.isSafeInteger(v.game.xp) || !Number.isSafeInteger(v.game.coins) || !Array.isArray(v.game.tasks))
            throw Error('不是完整網站備份。純遊戲 JSON 請至遊戲存檔中心匯入。');
        pendingMemory = cleanMemory(v.assistant);
        E('systemDesk').close();
        const ok = await engine().previewImport(v.game);
        if (!ok)
            pendingMemory = null;
    }
    window.addEventListener('lastdorm:imported', () => {
        if (!pendingMemory)
            return;
        memory = pendingMemory;
        pendingMemory = null;
        saveMemory();
    });
    document.addEventListener('input', e => {
        if (e.target.id === 'sdInput')
            draft = e.target.value;
    });
    document.addEventListener('change', e => {
        if (e.target.id === 'importSave')
            pendingMemory = null;
        if (e.target.id === 'sdImport') {
            const f = e.target.files?.[0];
            if (f) {
                if (f.size > 1500000) {
                    notice = '備份過大，未匯入。';
                    render();
                    return;
                }
                f.text().then(t => importBundle(JSON.parse(t))).catch(err => { notice = err.message; render(); });
            }
        }
    });
    document.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b || b.disabled)
            return;
        if (b.id === 'cancelImport' || b.id === 'resetSave')
            pendingMemory = null;
        if (b.hasAttribute('data-open-assistant'))
            return openDesk();
        if (b.id === 'sdClose') {
            E('systemDesk').close();
            return;
        }
        if (b.dataset.sdtab) {
            tab = ['talk', 'ledger', 'privacy'].includes(b.dataset.sdtab) ? b.dataset.sdtab : 'talk';
            render();
            return;
        }
        if (b.dataset.sdpanel)
            return jump(b.dataset.sdpanel);
        if (b.dataset.sdprompt)
            return ask(b.dataset.sdprompt);
        if (b.hasAttribute('data-sdstory')) {
            memory.story = 2;
            add('system', '抽屜裡是一張住戶檢查卡：確認基地日期、查看必要作業，未知的截止時刻標註待確認。\n這是已公開的本機劇情，不發 XP、不抽獎、不開門。後續事件尚未實作。', '本機劇情', [{ label: '查看任務', panel: 'tasks' }]);
            render();
            return;
        }
        if (b.id === 'sdExport') {
            download();
            notice = '已請求下載本機備份，請確認瀏覽器下載清單。';
            render();
        }
        if (b.id === 'sdClear' && confirm('只清除本機系統對話？遊戲存檔不變。')) {
            memory.messages = [];
            saveMemory();
            render();
        }
    });
    document.addEventListener('submit', e => {
        if (e.target.id === 'sdSendForm') {
            e.preventDefault();
            ask(draft);
        }
    });
    window.LastDormSystem = { open: openDesk, snapshot: () => structuredClone(memory), bundle: () => structuredClone(bundle()), cloudConnected: () => false, mode: 'local-only' };
}

},
"src/core/boot-tail.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindFixtures = bindFixtures;
/** core/boot-tail — extracted from verified 2.3.1; visual/gameplay parity first. */
const art_js_1 = require("src/data/art.js");
const dom_js_1 = require("src/ui/dom.js");
function bindFixtures() {
    (0, dom_js_1.$)('worklightFixture').src = art_js_1.ART['prop-lantern'];
}

},
"src/core/bootstrap.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGameState = initializeGameState;
/** core/bootstrap — extracted from verified 2.3.1; visual/gameplay parity first. */
const section516_js_1 = require("src/features/section516.js");
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const runtime_js_1 = require("src/core/runtime.js");
const schema_js_1 = require("src/core/schema.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const routines_model_js_1 = require("src/features/routines-model.js");
const study516_model_js_1 = require("src/features/study516-model.js");
function initializeGameState() {
    const loadNotice = document.getElementById("resourceLoadNotice");
    if (loadNotice)
        loadNotice.hidden = true;
    runtime_js_1.runtime.skillTrack = 'sql';
    runtime_js_1.runtime.skillNode = null;
    runtime_js_1.runtime.skillCredential = null;
    runtime_js_1.runtime.profileTab = 'goal';
    runtime_js_1.runtime.growthEditing = null;
    runtime_js_1.runtime.supplyRequest = null;
    runtime_js_1.runtime.supplyResult = null;
    runtime_js_1.runtime.appearancePreview = null;
    runtime_js_1.runtime.appearanceRoomPreview = false;
    runtime_js_1.runtime.taskLane = 'main';
    runtime_js_1.runtime.visualPreview = 'auto';
    runtime_js_1.runtime.selectedItem = null;
    runtime_js_1.runtime.storageConflict = false;
    runtime_js_1.runtime.bagTab = 'items';
    runtime_js_1.runtime.bagFilter = 'all';
    runtime_js_1.runtime.bagSort = 'rarity';
    runtime_js_1.runtime.bagPage = 0;
    runtime_js_1.runtime.bagSelected = null;
    runtime_js_1.runtime.decorPreview = null;
    runtime_js_1.runtime.decorBefore = false;
    runtime_js_1.runtime.buildPreview = false;
    runtime_js_1.runtime.expectedRaw = null;
    runtime_js_1.runtime.committedState = null;
    runtime_js_1.runtime.readError = '';
    runtime_js_1.runtime.writerMode = 'pending';
    runtime_js_1.runtime.lockRelease = null;
    runtime_js_1.runtime.lockRequested = false;
    runtime_js_1.runtime.state = undefined;
    runtime_js_1.runtime.storageOK = true;
    runtime_js_1.runtime.activePanel = '';
    runtime_js_1.runtime.taskFilter = 'all';
    runtime_js_1.runtime.dogOverride = null;
    runtime_js_1.runtime.drawResult = null;
    runtime_js_1.runtime.toastTimer = undefined;
    runtime_js_1.runtime.focus = null;
    runtime_js_1.runtime.importCandidate = null;
    runtime_js_1.runtime.lastDate = (0, clock_js_1.today)();
    try {
        runtime_js_1.runtime.expectedRaw = localStorage.getItem(config_js_1.KEY);
        runtime_js_1.runtime.state = runtime_js_1.runtime.expectedRaw !== null ? (0, schema_js_1.validate)(JSON.parse(runtime_js_1.runtime.expectedRaw)) : (0, schema_js_1.initial)();
    }
    catch (e) {
        runtime_js_1.runtime.state = (0, schema_js_1.initial)();
        runtime_js_1.runtime.storageOK = false;
        runtime_js_1.runtime.readError = '保護模式：' + e.message + ' 原始存檔未被覆寫；請到更新與存檔保護匯出原檔。';
        setTimeout(() => (0, ui_port_js_1.warn)(runtime_js_1.runtime.readError), 0);
    }
    (0, routines_model_js_1.normalizePlanner)(runtime_js_1.runtime.state);
    (0, study516_model_js_1.normalizeStudy516)(runtime_js_1.runtime.state);
    (0, section516_js_1.applySection15555)(runtime_js_1.runtime.state);
    runtime_js_1.runtime.committedState = structuredClone(runtime_js_1.runtime.state);
}

},
"src/core/clock.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIGHT_BANDS = void 0;
exports.parts = parts;
exports.today = today;
exports.stamp = stamp;
exports.localTime = localTime;
exports.lightFor = lightFor;
exports.isoDay = isoDay;
exports.monday = monday;
exports.cycleKey = cycleKey;
/** core/clock — extracted from verified 2.3.1; visual/gameplay parity first. */
const config_js_1 = require("src/core/config.js");
function parts(date = new Date()) { return Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: config_js_1.TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(date).filter(p => p.type !== 'literal').map(p => [p.type, p.value])); }
function today() { const p = parts(); return `${p.year}-${p.month}-${p.day}`; }
function stamp() { return new Date().toISOString(); }
function localTime(iso) {
    try {
        return new Intl.DateTimeFormat('zh-TW', { timeZone: config_js_1.TZ, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));
    }
    catch {
        return '時間待確認';
    }
}
exports.LIGHT_BANDS = { dawn: { name: '晨光', label: '05–08', sky: '拂曉，基地慢慢醒來。' }, day: { name: '日間', label: '08–16', sky: '日光進屋，先選一件重要的事。' }, dusk: { name: '黃昏', label: '16–19', sky: '夕光落在桌面，收好今天走過的路。' }, night: { name: '夜間', label: '19–05', sky: '夜裡的燈留著。例行照顧，不等於再開一場硬仗。' } };
function lightFor(date = new Date()) { const h = +parts(date).hour; return h < 5 || h >= 19 ? 'night' : h < 8 ? 'dawn' : h < 16 ? 'day' : 'dusk'; }
function isoDay(date) { const p = parts(date); return `${p.year}-${p.month}-${p.day}`; }
function monday(day = today()) { const d = new Date(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); }
function cycleKey(r, day = today()) { return (r.repeat === 'weekly' ? 'w:' + monday(day) : 'd:' + day); }

},
"src/core/config.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TZ = exports.BACKUP = exports.KEY = exports.RELEASE = exports.COMPANION_ART = exports.DATA = void 0;
const game_js_1 = require("src/data/game.js");
Object.defineProperty(exports, "DATA", { enumerable: true, get: function () { return game_js_1.DATA; } });
const art_js_1 = require("src/data/art.js");
Object.defineProperty(exports, "COMPANION_ART", { enumerable: true, get: function () { return art_js_1.COMPANION_ART; } });
const release_js_1 = require("src/core/release.js");
Object.defineProperty(exports, "RELEASE", { enumerable: true, get: function () { return release_js_1.RELEASE; } });
exports.KEY = 'lastdorm_preview_localonly_v1';
exports.BACKUP = exports.KEY + '_previous';
exports.TZ = game_js_1.DATA.timezone;

},
"src/core/download.js": function(module, exports, require) {
"use strict";
/** core/download — extracted from verified 2.3.1; visual/gameplay parity first. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = download;
function download(content, name) { const blob = new Blob([content], { type: 'application/json;charset=utf-8' }), a = document.createElement('a'); const url = URL.createObjectURL(blob); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }

},
"src/core/files.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportSave = exportSave;
exports.importSave = importSave;
exports.confirmImport = confirmImport;
/** core/files — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const download_js_1 = require("src/core/download.js");
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const schema_js_1 = require("src/core/schema.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const dom_js_1 = require("src/ui/dom.js");
function exportSave() {
    if (runtime_js_1.runtime.readError) {
        (0, storage_js_1.exportOriginal)();
        return;
    }
    (0, download_js_1.download)(JSON.stringify({ ...runtime_js_1.runtime.state, exportedAt: (0, clock_js_1.stamp)(), mode: 'local-only', officialBaseline: { xp: 140, coins: 75 } }, null, 2), `LastDorm_v${config_js_1.RELEASE.appVersion}_${(0, clock_js_1.today)()}.json`);
    (0, ui_port_js_1.toast)('JSON 已匯出；請放在不會被解壓縮覆蓋的位置。');
}
async function importSave(file) {
    if (!file)
        return false;
    try {
        if (runtime_js_1.runtime.readError)
            throw Error('既有存檔處於保護模式，先匯出原檔；此頁不允許降版替換。');
        if (file.size > 5000000)
            throw Error('檔案大於 5 MB');
        const candidate = (0, schema_js_1.validate)(JSON.parse(await file.text()));
        runtime_js_1.runtime.importCandidate = candidate;
        (0, dom_js_1.$)('importPreview').innerHTML = `<div class="card"><span class="tag pending">尚未匯入</span><h3>確認替換本機帳本，不相加</h3><p>目前：${runtime_js_1.runtime.state.xp} XP / ${runtime_js_1.runtime.state.coins} 幣<br>匯入：${candidate.xp} XP / ${candidate.coins} 幣<br>任務：${candidate.tasks.length} 筆</p><div class="row"><button id="confirmImport">確認替換</button><button id="cancelImport">取消</button></div><small class="muted">正式主帳仍是 140 XP / 75 幣，不會被此檔案覆蓋。</small></div>`;
    }
    catch (e) {
        runtime_js_1.runtime.importCandidate = null;
        if ((0, dom_js_1.$)('importPreview'))
            (0, dom_js_1.$)('importPreview').innerHTML = '';
        (0, ui_port_js_1.toast)('匯入未執行：' + e.message);
        return false;
    }
    return true;
}
function confirmImport() {
    if (!runtime_js_1.runtime.importCandidate)
        return;
    runtime_js_1.runtime.state = runtime_js_1.runtime.importCandidate;
    runtime_js_1.runtime.state.importInfo = { xp: runtime_js_1.runtime.state.xp, coins: runtime_js_1.runtime.state.coins, at: (0, clock_js_1.stamp)() };
    runtime_js_1.runtime.importCandidate = null;
    (0, ledger_js_1.log)('手動確認匯入：替換本機帳本，未與舊數值相加。');
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('saves');
    (0, ui_port_js_1.toast)('本機存檔已替換；原本數值沒有重複相加。');
    window.dispatchEvent(new Event('lastdorm:imported'));
}

},
"src/core/ledger.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
exports.reward = reward;
/** core/ledger — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const runtime_js_1 = require("src/core/runtime.js");
function log(text) { runtime_js_1.runtime.state.logs.unshift({ date: (0, clock_js_1.stamp)(), text }); /* history retained; the UI only renders recent entries */ }
function reward(key, xp = 0, coins = 0) {
    if (Object.hasOwn(runtime_js_1.runtime.state.events, key))
        return false;
    runtime_js_1.runtime.state.events[key] = (0, clock_js_1.stamp)();
    runtime_js_1.runtime.state.xp += xp;
    runtime_js_1.runtime.state.coins += coins;
    return true;
}

},
"src/core/lifecycle.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLifecycle = startLifecycle;
/** core/lifecycle — extracted from verified 2.3.1; visual/gameplay parity first. */
const comfort_js_1 = require("src/features/comfort.js");
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const focus_js_1 = require("src/features/focus.js");
const dom_js_1 = require("src/ui/dom.js");
const home_js_1 = require("src/ui/home.js");
function startLifecycle() {
    (0, ui_port_js_1.render)();
    let lastHiddenAt = null;
    window.addEventListener('lastdorm:writer-ready', () => (0, comfort_js_1.maybeWake)('load'));
    (0, storage_js_1.startWriterLock)();
    window.addEventListener('pagehide', () => {
        if (runtime_js_1.runtime.lockRelease)
            runtime_js_1.runtime.lockRelease();
        runtime_js_1.runtime.lockRequested = false;
        runtime_js_1.runtime.writerMode = 'readonly';
    });
    window.addEventListener('pageshow', e => {
        if (e.persisted)
            (0, storage_js_1.startWriterLock)();
    });
    setInterval(() => {
        (0, home_js_1.renderClock)();
        if (runtime_js_1.runtime.lastDate !== (0, clock_js_1.today)()) {
            runtime_js_1.runtime.lastDate = (0, clock_js_1.today)();
            (0, ui_port_js_1.render)();
            if (['kitchen', 'routine', 'tasks', 'profile', 'exercise', 'health', 'skillTree'].includes(runtime_js_1.runtime.activePanel))
                (0, ui_port_js_1.show)(runtime_js_1.runtime.activePanel, true);
        }
        if (runtime_js_1.runtime.focus) {
            const txt = (0, focus_js_1.focusText)();
            const el = (0, dom_js_1.$)('focusTime');
            if (el)
                el.textContent = txt;
            (0, dom_js_1.$)('focusSummary').textContent = '剩餘 ' + txt;
            if (Date.now() >= runtime_js_1.runtime.focus.end) {
                runtime_js_1.runtime.focus = null;
                (0, dom_js_1.$)('focusSummary').textContent = '這一段結束了，先停一下。';
                (0, ui_port_js_1.toast)('專注時段結束。先活動一下，再自行確認真正完成的任務。');
            }
        }
    }, 1000);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            lastHiddenAt = Date.now();
            return;
        }
        if (!document.hidden) {
            const hiddenMs = lastHiddenAt === null ? 0 : Date.now() - lastHiddenAt;
            lastHiddenAt = null;
            (0, comfort_js_1.maybeWake)('foreground', hiddenMs);
            (0, home_js_1.renderClock)();
            if (runtime_js_1.runtime.lastDate !== (0, clock_js_1.today)()) {
                runtime_js_1.runtime.lastDate = (0, clock_js_1.today)();
                (0, ui_port_js_1.render)();
                if (['routine', 'tasks', 'kitchen', 'profile', 'exercise', 'health', 'skillTree'].includes(runtime_js_1.runtime.activePanel))
                    (0, ui_port_js_1.show)(runtime_js_1.runtime.activePanel, true);
            }
        }
    });
    // Read-only QA hooks: no hidden rewards, no API keys, no network calls.
    window.addEventListener('storage', e => {
        if ((e.key === config_js_1.KEY || e.key === null) && e.newValue !== runtime_js_1.runtime.expectedRaw) {
            runtime_js_1.runtime.storageConflict = true;
            (0, ui_port_js_1.warn)('另一個分頁更新了本機存檔。請重新整理本頁後再操作，避免覆寫較新的紀錄。');
        }
    });
}

},
"src/core/public-api.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposePublicAPI = exposePublicAPI;
/** core/public-api — extracted from verified 2.3.1; visual/gameplay parity first. */
const skill_tree_model_js_1 = require("src/features/skill-tree-model.js");
const comfort_model_js_1 = require("src/features/comfort-model.js");
const growth_model_js_1 = require("src/features/growth-model.js");
const appearance_js_1 = require("src/features/appearance.js");
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const files_js_1 = require("src/core/files.js");
const runtime_js_1 = require("src/core/runtime.js");
const schema_js_1 = require("src/core/schema.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const companion_js_1 = require("src/features/companion.js");
const study516_query_js_1 = require("src/features/study516-query.js");
const tasks_query_js_1 = require("src/features/tasks-query.js");
function exposePublicAPI() {
    window.LastDorm = { skillTreeStatus: () => structuredClone((0, skill_tree_model_js_1.treeSummary)(runtime_js_1.runtime.state, (0, clock_js_1.today)())), complexionStatus: () => structuredClone((0, comfort_model_js_1.complexion)(runtime_js_1.runtime.state, (0, clock_js_1.today)())), growthStatus: () => structuredClone({ career: (0, growth_model_js_1.careerSummary)(runtime_js_1.runtime.state.growth, (0, clock_js_1.today)()), skills: (0, growth_model_js_1.skillSummary)(runtime_js_1.runtime.state.growth, (0, clock_js_1.today)()), points: (0, growth_model_js_1.skillPoints)(runtime_js_1.runtime.state.growth, (0, clock_js_1.today)()), wellbeing: (0, growth_model_js_1.wellbeingSummary)(runtime_js_1.runtime.state, (0, clock_js_1.today)()) }), version: config_js_1.DATA.version, appearanceStatus: () => structuredClone((0, appearance_js_1.appearanceStatus)()), study516Status: () => structuredClone(runtime_js_1.runtime.state.study516), examFocusAt: day => (0, study516_query_js_1.examFocusActive)(day), bagView: () => ({ tab: runtime_js_1.runtime.bagTab, filter: runtime_js_1.runtime.bagFilter, sort: runtime_js_1.runtime.bagSort, page: runtime_js_1.runtime.bagPage, selected: runtime_js_1.runtime.bagSelected }), buildStatus: () => structuredClone(runtime_js_1.runtime.state.firstBuild), decorStatus: () => ({ placed: structuredClone(runtime_js_1.runtime.state.roomDecor), preview: runtime_js_1.runtime.decorPreview, before: runtime_js_1.runtime.decorBefore }), protectionStatus: storage_js_1.protectionStatus, validateForImport: value => structuredClone((0, schema_js_1.validate)(value)), snapshot: () => structuredClone(runtime_js_1.runtime.state), dogState: () => ({ ...(0, companion_js_1.dogState)() }), today: clock_js_1.today, storageKey: config_js_1.KEY,
        plan: () => (0, tasks_query_js_1.orderedTasks)().filter(t => t.status !== 'done').map(t => ({ ...t, priorityInfo: (0, tasks_query_js_1.taskPriority)(t) })), routineCycle: (repeat, date) => (0, clock_js_1.cycleKey)({ repeat }, date), lightAt: (iso) => (0, clock_js_1.lightFor)(new Date(iso)),
        openPanel: (name) => {
            if (['skillTree', 'skillNode', 'credential', 'profile', 'growthGoal', 'careerRecord', 'skillEvidence', 'exercise', 'supply', 'tasks', 'courses', 'inventory', 'journal', 'tophat', 'health', 'focus', 'saves', 'world', 'kitchen', 'wardrobe', 'companion', 'routine', 'settings', 'newtask', 'updates', 'decor', 'build', 'signal', 'exam516', 'studyTrack'].includes(name))
                (0, ui_port_js_1.show)(name);
        },
        previewImport: (value) => { (0, ui_port_js_1.show)('saves'); return (0, files_js_1.importSave)(new File([JSON.stringify(value)], 'cloud-snapshot.json', { type: 'application/json' })); } };
}

},
"src/core/release.js": function(module, exports, require) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RELEASE = void 0;
const release_json_1 = __importDefault(require("release.json"));
exports.RELEASE = release_json_1.default;

},
"src/core/runtime.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtime = void 0;
/** Shared runtime only. Persistent changes are committed by core/storage.js. */
exports.runtime = {
    profileTab: 'goal', growthEditing: null, supplyRequest: null, supplyResult: null,
    appearancePreview: null,
    appearanceRoomPreview: false,
    taskLane: undefined,
    visualPreview: undefined,
    selectedItem: undefined,
    storageConflict: undefined,
    bagTab: undefined,
    bagFilter: undefined,
    bagSort: undefined,
    bagPage: undefined,
    bagSelected: undefined,
    decorPreview: undefined,
    decorBefore: undefined,
    buildPreview: undefined,
    expectedRaw: undefined,
    committedState: undefined,
    readError: undefined,
    writerMode: undefined,
    lockRelease: undefined,
    lockRequested: undefined,
    state: undefined,
    storageOK: undefined,
    activePanel: undefined,
    taskFilter: undefined,
    dogOverride: undefined,
    drawResult: undefined,
    toastTimer: undefined,
    focus: undefined,
    importCandidate: undefined,
    lastDate: undefined
};

},
"src/core/schema.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.initial = initial;
/** core/schema — extracted from verified 2.3.1; visual/gameplay parity first. */
const growth_model_js_1 = require("src/features/growth-model.js");
const skill_tree_model_js_1 = require("src/features/skill-tree-model.js");
const comfort_model_js_1 = require("src/features/comfort-model.js");
const section516_js_1 = require("src/features/section516.js");
const clock_js_1 = require("src/core/clock.js");
const appearance_model_js_1 = require("src/features/appearance-model.js");
const config_js_1 = require("src/core/config.js");
const utils_js_1 = require("src/core/utils.js");
const validation_primitives_js_1 = require("src/core/validation-primitives.js");
const build_model_js_1 = require("src/features/build-model.js");
const decor_model_js_1 = require("src/features/decor-model.js");
const routines_model_js_1 = require("src/features/routines-model.js");
const study516_model_js_1 = require("src/features/study516-model.js");
function validate(v) {
    if (!v || typeof v !== 'object' || Array.isArray(v))
        throw Error('存檔格式不正確。');
    if (v.format !== 'last-dorm-save')
        throw Error('不是支援的遊戲存檔；規格書、安裝 ZIP 和其他舊格式不能在這裡匯入。');
    if (!Number.isSafeInteger(v.version) || ![19, 20, 21, 22, 23, 24, 25].includes(v.version))
        throw Error(Number.isSafeInteger(v.version) && v.version > 25 ? '這份存檔由較新版遊戲產生；目前只支援格式 19／20／21／22／23／24／25。請保留原檔，不可降版覆盖。' : '存檔版本不受支援；原資料未變更。');
    (0, validation_primitives_js_1.ensureSafeJSON)(v);
    if (v.saveRevision !== undefined && !(0, utils_js_1.num)(v.saveRevision, 0, Number.MAX_SAFE_INTEGER - 1))
        throw Error('存檔提交序號不正確。');
    const out = { ...initial(), ...structuredClone(v) };
    for (const k of ['xp', 'coins', 'tickets'])
        if (!(0, utils_js_1.num)(v[k]))
            throw Error(k + ' 必須是非負整數。');
    for (const k of ['shards', 'draws'])
        if (out[k] !== undefined && !(0, utils_js_1.num)(out[k]))
            throw Error(k + ' 必須是非負整數。');
    if (!(0, utils_js_1.num)(out.pity, 0, 8))
        throw Error('保底紀錄格式不正確。');
    (0, validation_primitives_js_1.checkedList)(v.tasks, '任務', 2000);
    (0, validation_primitives_js_1.checkedIDList)(v.tasks, '任務');
    out.tasks = structuredClone(v.tasks);
    for (const t of out.tasks) {
        (0, validation_primitives_js_1.checkedText)(t.title, '任務名稱', 400);
        if (!(0, utils_js_1.num)(t.xp ?? 0, 0, 500) || !(0, utils_js_1.num)(t.coins ?? 0, 0, 500))
            throw Error('任務獎勵格式不正確。');
        if (!['todo', 'inprogress', 'draft', 'ready', 'done'].includes(t.status))
            throw Error('任務狀態不受支援。');
        for (const k of ['course', 'detail', 'window', 'source'])
            if (t[k] !== undefined)
                (0, validation_primitives_js_1.checkedText)(t[k], k, k === 'detail' ? 3000 : 400);
        if (t.due !== undefined && t.due !== null && !/^\d{4}-\d{2}-\d{2}$/.test(t.due))
            throw Error('任務日期不正確。');
        if (t.time !== undefined && t.time !== null && !/^([01]\d|2[0-3]):[0-5]\d$/.test(t.time))
            throw Error('任務時間不正確。');
        if (t.priority !== undefined && !['auto', 'p1', 'p2', 'p3'].includes(t.priority))
            throw Error('任務優先級不正確。');
        if (t.lane !== undefined && !['main', 'side'].includes(t.lane))
            throw Error('任務分類不受此版支援。');
    }
    (0, validation_primitives_js_1.checkedList)(v.items, '背包', 2000);
    out.items = structuredClone(v.items);
    for (const x of out.items) {
        if (!x || typeof x !== 'object' || !(0, utils_js_1.num)(x.qty, 0, 100000))
            throw Error('物品數量不正確。');
        (0, validation_primitives_js_1.checkedText)(x.name, '物品名稱', 200);
        (0, validation_primitives_js_1.checkedText)(x.type, '物品類型', 40);
    }
    (0, validation_primitives_js_1.checkedList)(out.journal, 'Journal', 5);
    if (out.journal.length !== 5)
        throw Error('Journal 應有五篇進度。');
    for (const j of out.journal) {
        (0, validation_primitives_js_1.checkedText)(j.title, 'Journal 名稱', 140);
        if (!['todo', 'draft', 'revised', 'ready', 'submitted'].includes(j.status))
            throw Error('Journal 狀態不正確。');
    }
    (0, validation_primitives_js_1.checkedList)(out.chapters, 'TopHat', 2000);
    (0, validation_primitives_js_1.checkedIDList)(out.chapters, 'TopHat');
    for (const ch of out.chapters) {
        (0, validation_primitives_js_1.checkedText)(ch.title, '章節名称', 160);
        if (!(0, utils_js_1.num)(ch.total, 1, 1000) || !(0, utils_js_1.num)(ch.done, 0, ch.total) || !(0, utils_js_1.num)(ch.awarded, 0, ch.total))
            throw Error('TopHat 章節任務或已領紀錄不正確。');
    }
    out.events = (0, validation_primitives_js_1.checkedMap)(v.events, '獎勵收據');
    out.routineHistory = (0, validation_primitives_js_1.checkedMap)(v.routineHistory, '日常週期紀錄');
    (0, validation_primitives_js_1.checkedList)(out.checkins, '簽到紀錄', 40000);
    if (out.checkins.some(d => typeof d !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(d)))
        throw Error('簽到日期不正確。');
    for (const k of ['health', 'cooking', 'logs']) {
        (0, validation_primitives_js_1.checkedList)(out[k], k, 40000);
        for (const x of out[k])
            if (!x || typeof x !== 'object' || Array.isArray(x))
                throw Error(k + '內容不正確。');
    }
    if (!out.settings || typeof out.settings !== 'object' || Array.isArray(out.settings))
        throw Error('設定格式不正確。');
    if (v.routines !== undefined) {
        (0, validation_primitives_js_1.checkedList)(v.routines, '例行任務', 2000);
        (0, validation_primitives_js_1.checkedIDList)(v.routines, '例行任務');
        for (const r of v.routines) {
            (0, validation_primitives_js_1.checkedText)(r.title, '例行名稱', 160);
            if (!['daily', 'weekly'].includes(r.repeat) || !(0, utils_js_1.num)(r.xp, 0, 40) || !(0, utils_js_1.num)(r.coins, 0, 15))
                throw Error('例行任務格式不正確。');
            if (r.action && !['health', 'kitchen', 'tophat', 'exercise'].includes(r.action))
                throw Error('例行任務連結不受支援。');
        }
    }
    if (v.plannerVersion !== undefined && ![0, 1].includes(v.plannerVersion))
        throw Error('任務規劃器由較新版產生，請勿降版匯入。');
    if (!out.inventoryLocks || typeof out.inventoryLocks !== 'object' || Array.isArray(out.inventoryLocks))
        throw Error('收藏鎖定資料不正確。');
    for (const [k, val] of Object.entries(out.inventoryLocks))
        if (k.length > 200 || typeof val !== 'boolean')
            throw Error('收藏鎖定值不正確。');
    // Only add missing planner defaults. Existing and unknown fields remain intact.
    if (v.routines === undefined)
        out.routines = (0, routines_model_js_1.routineDefaults)();
    (0, routines_model_js_1.normalizePlanner)(out);
    (0, decor_model_js_1.validateDecor)(out);
    if (v.version < 21) {
        out.migrationHistory = Array.isArray(out.migrationHistory) ? out.migrationHistory : [];
        if (!out.migrationHistory.some(x => x && x.id === 'core.room-decor.v1'))
            out.migrationHistory.push({ id: 'core.room-decor.v1', from: v.version, to: 21, at: (0, clock_js_1.stamp)() });
    }
    (0, build_model_js_1.validateFirstBuild)(out);
    if (v.version < 22) {
        out.migrationHistory = Array.isArray(out.migrationHistory) ? out.migrationHistory : [];
        if (!out.migrationHistory.some(x => x && x.id === 'core.first-build.v1'))
            out.migrationHistory.push({ id: 'core.first-build.v1', from: Math.max(v.version, 21), to: 22, at: (0, clock_js_1.stamp)() });
    }
    (0, study516_model_js_1.normalizeStudy516)(out);
    (0, validation_primitives_js_1.checkedIDList)(out.tasks, '任務');
    (0, validation_primitives_js_1.checkedIDList)(out.chapters, 'TopHat');
    (0, appearance_model_js_1.validateAppearance)(out);
    (0, growth_model_js_1.validateGrowth)(out);
    if (v.version < 24) {
        (0, growth_model_js_1.ensureGrowthRoutine)(out);
        out.migrationHistory = Array.isArray(out.migrationHistory) ? out.migrationHistory : [];
        if (!out.migrationHistory.some(x => x?.id === 'core.growth-supplies.v1'))
            out.migrationHistory.push({ id: 'core.growth-supplies.v1', from: v.version, to: 24, at: (0, clock_js_1.stamp)() });
    }
    (0, skill_tree_model_js_1.validateMastery)(out);
    (0, comfort_model_js_1.validateComfort)(out);
    (0, section516_js_1.applySection15555)(out);
    if (v.version < 25) {
        out.migrationHistory = Array.isArray(out.migrationHistory) ? out.migrationHistory : [];
        if (!out.migrationHistory.some(x => x?.id === 'core.game-points.v1'))
            out.migrationHistory.push({ id: 'core.game-points.v1', from: v.version, to: 25, at: (0, clock_js_1.stamp)() });
    }
    out.version = 25;
    return out;
}
function initial() { return { format: 'last-dorm-save', version: 25, mastery: (0, skill_tree_model_js_1.masteryDefaults)(), comfort: (0, comfort_model_js_1.comfortDefaults)(), growth: (0, growth_model_js_1.growthDefaults)(), appearance: (0, appearance_model_js_1.appearanceDefaults)(), firstBuild: (0, build_model_js_1.firstBuildDefault)(), roomDecor: { version: 1, slots: {} }, plannerVersion: 1, routines: (0, routines_model_js_1.routineDefaults)(), routineHistory: {}, inventoryLocks: {}, xp: 140, coins: 75, tickets: 1, shards: 2, items: [{ name: '晨間補給包', type: '補給', qty: 1 }, { name: '初始生存服', type: '外觀', qty: 1 }], tasks: config_js_1.DATA.tasks.map(t => ({ ...t, status: 'todo', rewarded: false })), journal: [{ title: '談判紀錄 1', status: 'draft' }, { title: '談判紀錄 2', status: 'draft' }, ...Array.from({ length: 3 }, (_, i) => ({ title: `談判紀錄 ${i + 3}`, status: 'todo' }))], chapters: [], health: [], cooking: [], logs: [], events: {}, checkins: [], settings: { hotspots: true, reduceMotion: false }, draws: 0, pity: 0, createdAt: (0, clock_js_1.stamp)(), lastSaved: null, importInfo: null }; }

},
"src/core/storage.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveStopped = exports.BEFORE_UPDATE = void 0;
exports.protectionStatus = protectionStatus;
exports.statusText = statusText;
exports.startWriterLock = startWriterLock;
exports.abortSave = abortSave;
exports.persist = persist;
exports.guarded = guarded;
exports.exportOriginal = exportOriginal;
exports.exportBeforeUpdate = exportBeforeUpdate;
exports.updatesPanel = updatesPanel;
/** core/storage — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const download_js_1 = require("src/core/download.js");
const runtime_js_1 = require("src/core/runtime.js");
const schema_js_1 = require("src/core/schema.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const validation_primitives_js_1 = require("src/core/validation-primitives.js");
const build_model_js_1 = require("src/features/build-model.js");
const dom_js_1 = require("src/ui/dom.js");
exports.BEFORE_UPDATE = config_js_1.KEY + '_before_' + config_js_1.RELEASE.appVersion.replaceAll('.', '_');
class SaveStopped extends Error {
    constructor(message) { super(message); this.name = 'SaveStopped'; }
}
exports.SaveStopped = SaveStopped;
function protectionStatus() {
    return { appVersion: config_js_1.RELEASE.appVersion, saveSchemaVersion: config_js_1.RELEASE.saveSchemaVersion, loadedSchema: runtime_js_1.runtime.expectedRaw ? (() => {
            try {
                return JSON.parse(runtime_js_1.runtime.expectedRaw).version;
            }
            catch {
                return null;
            }
        })() : null, writerMode: runtime_js_1.runtime.writerMode, readError: runtime_js_1.runtime.readError, conflict: runtime_js_1.runtime.storageConflict, backupKey: exports.BEFORE_UPDATE, storageKey: config_js_1.KEY, revision: runtime_js_1.runtime.state?.saveRevision || 0, externalPacks: false };
}
function statusText() { return runtime_js_1.runtime.readError ? '保護模式：既有存檔未被改寫' : runtime_js_1.runtime.storageConflict ? '偵測到其他頁面更新；請先重新整理' : runtime_js_1.runtime.writerMode === 'writer' ? '可寫入 · 本分頁持有存檔鎖' : runtime_js_1.runtime.writerMode === 'pending' ? '正在檢查存檔鎖' : '唯讀 · 請關閉其他遊戲分頁後重新整理'; }
function startWriterLock() {
    if (runtime_js_1.runtime.lockRequested)
        return;
    runtime_js_1.runtime.lockRequested = true;
    if (!navigator.locks?.request) {
        runtime_js_1.runtime.writerMode = 'readonly';
        (0, ui_port_js_1.warn)('瀏覽器不支援存檔鎖，本版改為唯讀；請用新版 Chrome／Edge 開啟 HTTPS 網站。可照常匯出備份。');
        return;
    }
    navigator.locks.request(config_js_1.KEY + ':exclusive-writer', { ifAvailable: true }, async (lock) => {
        if (!lock) {
            runtime_js_1.runtime.writerMode = 'readonly';
            (0, ui_port_js_1.warn)('另一個遊戲分頁正在持有存檔鎖。本頁只讀，不會覆蓋；請關閉另一分頁，再重新整理本頁。');
            return;
        }
        runtime_js_1.runtime.writerMode = 'writer';
        if (runtime_js_1.runtime.readError)
            (0, ui_port_js_1.warn)(runtime_js_1.runtime.readError);
        else if (runtime_js_1.runtime.storageConflict)
            (0, ui_port_js_1.warn)(statusText());
        else {
            (0, dom_js_1.$)('saveStatus').textContent = '本機存檔保護已啟用 · ' + config_js_1.RELEASE.appVersion;
            (0, dom_js_1.$)('storageWarning').hidden = true;
        }
        window.dispatchEvent(new Event('lastdorm:writer-ready'));
        await new Promise(resolve => { runtime_js_1.runtime.lockRelease = resolve; });
        runtime_js_1.runtime.writerMode = 'readonly';
        runtime_js_1.runtime.lockRelease = null;
    }).catch(() => { runtime_js_1.runtime.writerMode = 'readonly'; (0, ui_port_js_1.warn)('無法取得存檔鎖，已阻止寫入。請匯出原檔並重新開啟網站。'); });
}
function abortSave(message) { runtime_js_1.runtime.state = structuredClone(runtime_js_1.runtime.committedState); runtime_js_1.runtime.drawResult = null; runtime_js_1.runtime.storageOK = false; (0, ui_port_js_1.warn)(message); throw new SaveStopped(message); }
function persist() {
    if (runtime_js_1.runtime.readError)
        abortSave('既有存檔未能安全辨識：已阻止覆蓋。請到「更新與存檔保護」匯出原始存檔。');
    if (runtime_js_1.runtime.writerMode !== 'writer')
        abortSave('本頁沒有存檔寫入權，這次操作未入帳。請關閉其他遊戲分頁並重新整理。');
    try {
        const old = localStorage.getItem(config_js_1.KEY);
        if (runtime_js_1.runtime.storageConflict || old !== runtime_js_1.runtime.expectedRaw) {
            runtime_js_1.runtime.storageConflict = true;
            throw Error('其他分頁已更新存檔；本次變更已取消。請重新整理後再操作。');
        }
        let candidate = structuredClone(runtime_js_1.runtime.state);
        candidate.version = config_js_1.RELEASE.saveSchemaVersion;
        (0, build_model_js_1.captureBuildEvidence)(candidate);
        candidate.updatedBy = config_js_1.RELEASE.appVersion;
        candidate.saveRevision = (runtime_js_1.runtime.committedState.saveRevision || 0) + 1;
        candidate.lastSaved = (0, clock_js_1.stamp)();
        candidate = (0, schema_js_1.validate)(candidate);
        const serialized = (0, validation_primitives_js_1.ensureSafeJSON)(candidate);
        // Backups must succeed before the single commit of the game state.
        if (old !== null) {
            if (localStorage.getItem(exports.BEFORE_UPDATE) === null)
                localStorage.setItem(exports.BEFORE_UPDATE, old);
            localStorage.setItem(config_js_1.BACKUP, old);
        }
        localStorage.setItem(config_js_1.KEY, serialized);
        runtime_js_1.runtime.expectedRaw = serialized;
        runtime_js_1.runtime.state = candidate;
        runtime_js_1.runtime.committedState = structuredClone(candidate);
        runtime_js_1.runtime.storageOK = true;
        (0, dom_js_1.$)('storageWarning').hidden = true;
        (0, dom_js_1.$)('saveStatus').textContent = '已存本機 ' + (0, clock_js_1.localTime)(runtime_js_1.runtime.state.lastSaved) + ' · v' + config_js_1.RELEASE.appVersion;
        return true;
    }
    catch (e) {
        abortSave((e?.name === 'QuotaExceededError' ? '儲存空間不足；' : '') + '這次操作未完成，畫面已回到上次成功存檔。' + (e.message || '請保留 JSON 備份。'));
    }
}
function guarded(handler) {
    return function (e) {
        try {
            return handler(e);
        }
        catch (err) {
            if (!(err instanceof SaveStopped))
                throw err;
            const panel = runtime_js_1.runtime.activePanel;
            (0, ui_port_js_1.render)();
            if (panel)
                (0, ui_port_js_1.show)(panel, true);
            (0, ui_port_js_1.warn)(err.message);
            (0, ui_port_js_1.toast)('未入帳：' + err.message);
        }
    };
}
function exportOriginal() {
    try {
        const raw = localStorage.getItem(config_js_1.KEY);
        if (raw === null)
            return (0, ui_port_js_1.toast)('這個位置尚未有原始存檔。');
        (0, download_js_1.download)(raw, 'LastDorm_原始存檔_' + (0, clock_js_1.today)() + '.json');
    }
    catch {
        (0, ui_port_js_1.toast)('瀏覽器禁止讀取原檔；請勿清除網站資料。');
    }
}
function exportBeforeUpdate() {
    try {
        const raw = localStorage.getItem(exports.BEFORE_UPDATE);
        if (raw === null)
            return (0, ui_port_js_1.toast)('尚未發生更新後的第一次寫入，因此還沒有更新前快照。');
        (0, download_js_1.download)(raw, 'LastDorm_更新前_' + config_js_1.RELEASE.appVersion + '_' + (0, clock_js_1.today)() + '.json');
    }
    catch {
        (0, ui_port_js_1.toast)('無法讀取更新前快照。');
    }
}
function updatesPanel() {
    const p = protectionStatus();
    let hasBackup = false;
    try {
        hasBackup = localStorage.getItem(exports.BEFORE_UPDATE) !== null;
    }
    catch { }
    return `<div class="note"><b>v2.6.0 · 技能點、低負擔休整與分檔資源</b><p>GSBA516 固定15555；技能摘要移出首頁。技能樹採具體能力與獨立成就登記；氣色是可覆核的遊戲值，不是健康分。</p></div><div class="card"><div class="statrow"><span>網站版本</span><b>${config_js_1.RELEASE.appVersion}</b></div><div class="statrow"><span>存檔格式</span><b>25（可讀19–25）</b></div><div class="statrow"><span>本機狀態</span><b>${(0, dom_js_1.esc)(statusText())}</b></div><div class="statrow"><span>儲存位置</span><code>${config_js_1.KEY}</code></div><div class="statrow"><span>更新前快照</span><b>${hasBackup ? '已保存' : '首次寫入前建立'}</b></div></div><h3 class="section-label">只屬於妳的資料留在瀏覽器</h3><p>5點後首次前景開啟預設會保存一筆「估計起床」，可關閉、改時間或撤銷；不讀手機解鎖、不推算真實睡眠。這是本次明確新增的自動寫入，不增減XP或幣。仍沒有雲端同步或付費AI。</p><div class="row"><button class="outline" id="exportOriginal">匯出原始存檔</button><button class="outline" id="exportBeforeUpdate" ${hasBackup ? '' : 'disabled'}>匯出更新前快照</button><button class="outline" data-panel="saves">存檔中心</button><button class="outline" id="reloadProtected">重新整理</button></div><h3 class="section-label">發布與資源</h3><p>這次提供完整網站ZIP：index.html、帶指紋的JS/CSS、assets。不是把ZIP匯入遊戲。請將內容同一次上傳，不能只換HTML。圖片檔名以SHA256固定，畫面文字由程式產生；缺少檔案應停止發布。任意外掛安裝器仍未開放。</p><p>相同網址／瀏覽器沿用存檔；格式25不可降版用2.5.0寫入。資源更新不重發獎、不覆寫帳本；原人物、德牧與31份美術位元組未換。備份請另存JSON，不要上傳私人存檔到公開GitHub。</p>`;
}

},
"src/core/ui-port.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toast = exports.warn = exports.close = exports.show = exports.render = void 0;
exports.configureUI = configureUI;
/** UI port keeps domain commands independent of renderers. Bound once at startup. */
let ui;
function configureUI(implementation) { if (ui)
    throw new Error('UI already configured'); ui = Object.freeze(implementation); }
function call(name, args) { if (!ui)
    throw new Error('UI not initialized'); return ui[name](...args); }
const render = (...args) => call('render', args);
exports.render = render;
const show = (...args) => call('show', args);
exports.show = show;
const close = (...args) => call('close', args);
exports.close = close;
const warn = (...args) => call('warn', args);
exports.warn = warn;
const toast = (...args) => call('toast', args);
exports.toast = toast;

},
"src/core/utils.js": function(module, exports, require) {
"use strict";
/** core/utils — extracted from verified 2.3.1; visual/gameplay parity first. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = uid;
exports.num = num;
function uid() { return 'id-' + (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`); }
function num(n, min = 0, max = 100000000) { return typeof n === 'number' && Number.isSafeInteger(n) && n >= min && n <= max; }

},
"src/core/validation-primitives.js": function(module, exports, require) {
"use strict";
/** core/validation-primitives — extracted from verified 2.3.1; visual/gameplay parity first. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSafeJSON = ensureSafeJSON;
exports.checkedMap = checkedMap;
exports.checkedList = checkedList;
exports.checkedText = checkedText;
exports.checkedIDList = checkedIDList;
function ensureSafeJSON(value) {
    const text = JSON.stringify(value);
    if (typeof text !== 'string' || new Blob([text]).size > 5000000)
        throw Error('存檔超過 5 MB；原資料不會被截短或覆蓋。');
    const walk = (v, depth = 0) => {
        if (depth > 30)
            throw Error('存檔巢狀結構過深。');
        if (v && typeof v === 'object')
            for (const k of Object.keys(v)) {
                if (['__proto__', 'prototype', 'constructor'].includes(k))
                    throw Error('存檔含不允許的結構鍵值。');
                walk(v[k], depth + 1);
            }
    };
    walk(value);
    return text;
}
function checkedMap(v, label, limit = 40000) {
    if (v === undefined)
        return {};
    if (!v || typeof v !== 'object' || Array.isArray(v))
        throw Error(label + '格式不正確。');
    const entries = Object.entries(v);
    if (entries.length > limit)
        throw Error(label + '過多；不會刪除歷史紀錄來強行載入。');
    for (const [k, val] of entries)
        if (k.length > 500 || typeof val !== 'string' || val.length > 160)
            throw Error(label + '含無法辨識的紀錄。');
    return structuredClone(v);
}
function checkedList(v, label, limit) {
    if (!Array.isArray(v) || v.length > limit)
        throw Error(label + '格式或數量不正確。');
    return v;
}
function checkedText(v, label, max = 3000) {
    if (typeof v !== 'string' || v.length > max)
        throw Error(label + '文字不正確或過長。');
    return v;
}
function checkedIDList(list, label) {
    const seen = new Set();
    for (const x of list) {
        if (!x || typeof x !== 'object' || Array.isArray(x))
            throw Error(label + '內容不正確。');
        checkedText(x.id, label + ' ID', 160);
        if (!x.id || seen.has(x.id))
            throw Error(label + '有空白或重複 ID。');
        seen.add(x.id);
    }
}

},
"src/data/art.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPANION_ART = exports.ART = void 0;
exports.ART = { "item-lantern": "assets/504805bd3fe278ddddde862eabc08bd332bdad5e90d88280081de695ba2bb57f.webp", "room-day": "assets/768659f7e070be7c0fda053dec8930a84832921aca93173fcd9e0eae1b7fe742.webp", "item-journal": "assets/59d971be2db393c6b79b34f24b1c66c502dfcd3f7254f74d6b63309e97ecf468.webp", "item-mat": "assets/654db1b5da6b6ab04f840858027e5defb0b2ae5916d9a55bccb8c7f25e17952d.webp", "item-tote": "assets/38d5b933eac1f9025b2785232383f0cfc29ea035cbaee48cf2405f62fc7152a1.webp", "item-bottle": "assets/21d3a8cabc02ed716bc67426ec78004cd4d9d3dac3a3311f21f552fb83b755ca.webp", "item-jacket": "assets/95827ce98a94e9a4d2f808fd21c8f7c4ff6b230b7fbb9521a8c27f070922489f.webp", "item-starclip": "assets/c45de2eed1cbcff18242b02f81717b0f2a9184f6c16163fdd87c92c8343edd1a.webp", "item-dessert": "assets/268504d585abdf77d598fd20b38667726dc7331c7fcbdca5b27da94938e494b8.webp", "item-thermos": "assets/26ef9825736bb37f7f7cca85c64217e7f7b38ecbbdc3546838ee42ff7012dff2.webp", "item-dripper": "assets/cbd65bf26159a083dcf12e5929c509edfb2c6fcd9659f758c042ddd8f4f528df.webp", "room-dusk": "assets/88bec35644a4fce03b780d4e4f28063312b220472ea6ebb9d3022532f061cf21.webp", "item-camera": "assets/da81dae41c6fe897cb1771aa3ffe1bd62794cea1a4456e751a9b21a8e4e7ca5f.webp", "item-plant": "assets/ad462cce78d16a38d4ec9651d6b12c594dedbb7dffa49143a4ca71a1c115dbb6.webp", "item-telescope": "assets/66dc3cdb2a7fbc388624094cebdf09e1f50754acce8100d01648dd4f3a358ef6.webp", "room-night": "assets/655b43a58d15074dcc44ee16bdda5f84f7a987b6d707dbf981ecff4f49ebd6fc.webp", "item-hairpin": "assets/8ec8060e9bd036bb279184f385fe5d2d9625a69aada01c4f3cded25a7195fd12.webp", "room-dawn": "assets/20246560822385726214bf87930101166992109421224f53a4587bf8e45b5639.webp", "item-map": "assets/7492dac49f79937d3c4b9da818d690c1fb3df7b1bd0e9beb9f2f2ac6819f5b79.webp", "item-pillow": "assets/a19a441c3d25b6460131b284c57d7c054392f23e0df2c9e8fb3e53e62d8bbe35.webp", "prop-pillow": "assets/72b30d59195353fa323d04b435620041ea6d66766b8b694d9a34a09285669ecc.png", "prop-dripper": "assets/241124e868814d32369b138ad8318c2d78ccfb5d2f894aceeab7bd97acbe1bbd.png", "prop-plant": "assets/458888913af8c6ea3da34b37eb93f61769b1e09077babd90290d2d4d776b4013.png", "prop-lantern": "assets/75902817db0034ef853b485451ce1ab14ea67b9067eb4c02f7b7d5153046325f.png", "prop-journal": "assets/bd72c920f95c6cfa69d8e428faa57e0a09d46790450ae2858835cb2e03f7b3df.png" };
exports.COMPANION_ART = Object.freeze({ "revision": "companion.gsd.1", "source": "夜幕下的德牧廚房時光.png", "sourceSha256": "ade62922e407c7cf6de0fdc0f1dfad363d69447335d9cd36c99e5f2986fefddd", "spriteSha256": "d60d8cfa3cb4f10949b86923f9d7d9f416d2a5f464e09980fadf1ef21bbef1fa", "portraitSha256": "45ea9d5712eecb8d83a5037611c1587b1d054fb2b30c0cbfea7afa87a2bf9da9", "sprite": "assets/d60d8cfa3cb4f10949b86923f9d7d9f416d2a5f464e09980fadf1ef21bbef1fa.webp", "portrait": "assets/45ea9d5712eecb8d83a5037611c1587b1d054fb2b30c0cbfea7afa87a2bf9da9.webp" });

},
"src/data/game.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA = void 0;
const release_js_1 = require("src/core/release.js");
exports.DATA = {
    version: release_js_1.RELEASE.appVersion, timezone: 'America/Los_Angeles',
    courses: [
        { id: '516', code: 'GSBA 516', name: '數據煉金工坊', label: 'Data Analysis & Modeling', color: '#8bbfd8', weight: 'Participation 15% · Labs 15% · HW 15% · Midterm 25% · Final 30%', policy: '僅限教師或作業明確許可時使用 AI。此處追蹤進度，不生成提交答案。', source: 'GSBA 516 Fall 2026 syllabus，p.2–4、8', notes: 'TopHat 第 7 章補發、第 8 章上週新作業、期中練習已列入名冊；以整章任務勾選；期限待核對，考試週不自動出新章。期中 10/21；可帶一張手寫 Letter-size 小抄。Section 15555：週三 11:00–12:20、HOH 114；期末 2026/12/09 11:00–13:00（洛杉磯）。' },
        { id: '552', code: 'DSO 552', name: '資料解碼塔', label: 'SQL Databases for Business Analysts', color: '#a7bce4', weight: 'Homework 30% · Group Project 25% · Final 45%', policy: '課綱禁止 AI 完成作業實質部分及考試；此處僅管理任務與時程。', source: 'DSO 552 Fall 2026 syllabus，p.2–8', notes: '四次 HW：11/2、11/9、11/16、11/23。12/1 全員上台及課前技術報告；12/3 課內 Final；12/5 23:59 自評。課程表第一週為 10/20、10/22；首頁另寫 10/19 開始，以課程公告確認。' },
        { id: '557', code: 'DSO 557B', name: '供應鏈指揮部', label: 'Global Supply Chain Management', color: '#b7cbaa', weight: 'Challenge 10% · Briefing 10% · Quiz 1/2 各15% · Field 10% · Paper 30% · Participation 10%', policy: 'Challenge Responses 明確 NO AI；Final Paper 禁止 AI 大綱、研究、撰寫、翻譯等。此處只追蹤。', source: 'DSO 557B Fall 2026 syllabus，p.1–8', notes: '10/19 當週有 Quiz 1 與課前 250–300 字回應；實際時間依 section／Brightspace。11/30–12/4 必修實地模組；12/7 8–10頁 APA 團隊報告。課表有日期／星期矛盾，未確認的期限不當成精確截止時間。' },
        { id: '569', code: 'MOR 569', name: '談判者議會', label: 'Negotiation and Deal-Making', color: '#d9b8a1', weight: 'Participation 15% · Journal 15% · Exam I 30% · Exam II 25% · Team Project 15%', policy: 'AI 使用依各作業另行規定。此處只記錄 Journal 階段，不代寫反思或提交內容。', source: 'MOR 569 Sat Online Fall 2026 syllabus，p.3–6、9–10', notes: 'Journal 共五次談判：起始目標、每次事前準備／事後反思／下次目標，結尾五項收穫。11/14 交 Journal；11/21 Mouse 準備筆記；12/5 Exam II；12/9 中午 Team Final。兩篇草稿不等於兩篇已提交。' }
    ],
    tasks: [
        { id: '552-setup', course: '552', title: '確認 PostgreSQL 與 DBeaver 能開啟', due: '2026-10-20', detail: '第一週環境準備；先檢查是否已完成，勿重複安裝。', type: 'practice', xp: 15, coins: 5, source: 'DSO552 p.2、7' },
        { id: '516-hw2', course: '516', title: 'HW 2', due: '2026-10-21', detail: '課表列於 10/21。精確截止時間、題目與繳交欄位待 Brightspace 確認。', type: 'assignment', xp: 30, coins: 10, source: 'GSBA516 p.8' },
        { id: '516-mid', course: '516', title: '期中考準備', due: '2026-10-21', detail: '成績占 25%；一張手寫 Letter-size 小抄。拆成自己能完成的小段，不以熬夜換 XP。', type: 'practice', xp: 20, coins: 5, source: 'GSBA516 p.4、8' },
        { id: '557-quiz', course: '557', title: '確認 Quiz 1 與課前 Challenge', due: null, window: '10/19 當週', detail: '250–300 字 Challenge + Quiz 1。需核對 section／Brightspace；不把 10/19 直接當截止日。', type: 'practice', xp: 10, coins: 3, source: 'DSO557B p.3、5' },
        { id: '516-brightspace', course: '516', title: '查看本週 Brightspace 新增作業', due: null, detail: '查明後用「新增任務」登記；檢查公告不代表已完成作業。網站沒有 Brightspace 自動連線。', type: 'practice', xp: 5, coins: 0 },
        { id: '569-read', course: '569', title: 'Persuasion／Lies & Deception 課前閱讀', due: '2026-10-24', detail: '依課表 CP 閱讀及 NG Ch.9，查看是否有新增課前要求。', type: 'practice', xp: 15, coins: 5, source: 'MOR569 p.9' },
        ...[['552-hw1', 'HW 1', '2026-11-02'], ['552-hw2', 'HW 2', '2026-11-09'], ['552-hw3', 'HW 3', '2026-11-16'], ['552-hw4', 'HW 4', '2026-11-23']].map(([id, title, due]) => ({ id, course: '552', title, due, type: 'assignment', xp: 30, coins: 10, detail: '每題須附 SQL 純文字程式碼與輸出截圖；確切截止時間看 Brightspace。', source: 'DSO552 p.4、7' })),
        { id: '569-journal', course: '569', title: 'Negotiation Journal｜完整提交', due: '2026-11-14', type: 'assignment', xp: 40, coins: 15, detail: '五次談判＋起始目標＋結尾五項收穫。兩篇草稿在 Journal 面板獨立追蹤。', source: 'MOR569 p.4、9' },
        { id: '516-hw3', course: '516', title: 'HW 3', due: '2026-11-18', type: 'assignment', xp: 30, coins: 10, detail: '題目及精確截止時間依 Brightspace。', source: 'GSBA516 p.8' },
        { id: '557-fieldplan', course: '557', title: '實地模組前計畫', due: null, window: '11/16 當週', type: 'assignment', xp: 30, coins: 10, detail: '1–2頁團隊計畫；課表同週列 Quiz 2。確切日期待確認。', source: 'DSO557B p.4、6' },
        { id: '569-mouse', course: '569', title: 'Mouse 事前準備筆記', due: '2026-11-21', type: 'assignment', xp: 20, coins: 5, detail: '依實際角色說明與課程公告完成。', source: 'MOR569 p.9' },
        { id: '552-project', course: '552', title: '團隊報告＋課堂簡報', due: '2026-12-01', time: '12:30', type: 'assignment', xp: 40, coins: 15, detail: '技術報告於該節課開始前提交；12/1 全體成員出席簡報。', source: 'DSO552 p.4–5' },
        { id: '552-final', course: '552', title: 'Final Exam 準備', due: '2026-12-03', type: 'practice', xp: 30, coins: 10, detail: '占 45%；課內考，沒有期中考。', source: 'DSO552 p.3、6' },
        { id: '552-self', course: '552', title: 'Presentation 自我評估', due: '2026-12-05', time: '23:59', type: 'assignment', xp: 15, coins: 5, detail: '觀看自己的簡報錄影後，親自完成反思。', source: 'DSO552 p.5、7' },
        { id: '569-exam2', course: '569', title: 'Exam II 準備', due: '2026-12-05', type: 'practice', xp: 30, coins: 10, detail: '占 25%；正式考試規則依老師公告。', source: 'MOR569 p.3、10' },
        { id: '557-final', course: '557', title: 'Final Team Strategy Paper', due: '2026-12-07', type: 'assignment', xp: 40, coins: 15, detail: '8–10頁、double-spaced、APA；無期末口頭簡報。NO AI 實質協助。', source: 'DSO557B p.3–4、8' },
        { id: '569-final', course: '569', title: 'Team Final Project', due: '2026-12-09', time: '12:00', type: 'assignment', xp: 40, coins: 15, detail: '已結束的複雜談判案例；公開資料分析。提交內容依作業規則親自準備。', source: 'MOR569 p.5、10' },
        { id: '516-final', course: '516', title: 'GSBA 516 期末考準備 · Section 15555', due: '2026-12-09', time: '11:00', window: '', type: 'practice', xp: 5, coins: 0, detail: 'Section 15555 已確認；2026/12/09 11:00–13:00。保留原任務進度與獎勵，不因確認日期補發。', source: 'GSBA516 p.4' },
        { id: 'career-case', course: 'career', title: 'Pokémon 作品集：完成一個可展示成果', due: null, type: 'practice', xp: 30, coins: 10, detail: '只選一張圖、一段已驗證分析，或一個介面功能。完成狀態依實際成果。' },
        { id: 'career-contact', course: 'career', title: '整理一位目標公司的聯絡對象', due: null, type: 'practice', xp: 15, coins: 5, detail: '不把找到名字當作已建立人脈；聯絡、回覆、面試分開記錄。' }
    ],
    confirmations: [
        { title: '12/1、12/3 與實地模組重疊', detail: 'DSO 557B 必修實地模組為 11/30–12/4；DSO 552 簡報12/1、期末12/3。這是課綱上的時間重疊，需向課程端確認安排。' },
        { title: 'DSO 557B 上課日期有矛盾', detail: '首頁寫週三但列出 11/9；11/11 又列無課。遊戲不自行修正老師的日期。' },
        { title: 'GSBA 516 · Section 15555 已確認', detail: '週三 11:00–12:20、HOH 114。期末：2026/12/09 11:00–13:00（洛杉磯）。' }
    ]
};

},
"src/features/appearance-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appearanceDefaults = exports.FATIGUE_OPTIONS = exports.SKIN_OPTIONS = exports.ENERGY_OPTIONS = exports.APPEARANCE_RULES = void 0;
exports.validateAppearance = validateAppearance;
exports.readObservation = readObservation;
exports.presentationOfRecord = presentationOfRecord;
exports.appearanceFor = appearanceFor;
/** Pure, versioned presentation rules. Never medical advice or an economic modifier. */
const comfort_model_js_1 = require("src/features/comfort-model.js");
exports.APPEARANCE_RULES = Object.freeze({ version: 1, revision: 'presentation.fatigue.1', labels: ['原貌', '輕微疲態', '需要休整'] });
exports.ENERGY_OPTIONS = ['未記錄', '有點累', '很疲倦', '普通', '精神不錯'];
exports.SKIN_OPTIONS = ['未記錄', '有些不穩定', '普通', '較穩定'];
exports.FATIGUE_OPTIONS = ['auto', 'base', 'light', 'tired'];
const appearanceDefaults = () => ({ version: 1, enabled: true });
exports.appearanceDefaults = appearanceDefaults;
function validateAppearance(s) {
    if (s.appearance === undefined)
        s.appearance = (0, exports.appearanceDefaults)();
    const a = s.appearance;
    if (!a || typeof a !== 'object' || Array.isArray(a) || a.version !== 1 || typeof a.enabled !== 'boolean')
        throw Error('人物狀態設定無法辨識；原存檔保留，不以預設值覆蓋。');
    for (const h of Array.isArray(s.health) ? s.health : []) {
        if (!h || typeof h !== 'object')
            continue;
        for (const k of ['skinRating', 'comfortRating'])
            if (h[k] !== undefined && h[k] !== null && (!Number.isInteger(h[k]) || h[k] < 1 || h[k] > 5))
                throw Error('自評欄位必須是 1–5 或未知');
        if (h.presentationRule === exports.APPEARANCE_RULES.revision) {
            if (!exports.FATIGUE_OPTIONS.includes(h.fatigue) || !exports.ENERGY_OPTIONS.includes(h.energy) || !exports.SKIN_OPTIONS.includes(h.skin))
                throw Error('人物狀態回報格式不正確，未改寫原紀錄。');
            if (h.hours !== null && (typeof h.hours !== 'number' || !Number.isFinite(h.hours) || h.hours < 0 || h.hours > 24))
                throw Error('人物狀態的睡眠時數不正確。');
        }
    }
    return s;
}
function readObservation(formData, day, recordedAt, prior = {}) {
    const sleep = String(formData.get('sleep') || ''), wake = String(formData.get('wake') || '');
    if ([sleep, wake].some(t => t && !/^([01]\d|2[0-3]):[0-5]\d$/.test(t)))
        throw Error('時間格式不正確。');
    const energy = String(formData.get('energy') || '未記錄'), skin = String(formData.get('skin') || '未記錄');
    const fatigue = String(formData.get('fatigue') || 'auto'), raw = String(formData.get('hours') ?? '').trim();
    const hours = raw === '' ? null : Number(raw);
    if (!exports.ENERGY_OPTIONS.includes(energy) || !exports.SKIN_OPTIONS.includes(skin) || !exports.FATIGUE_OPTIONS.includes(fatigue))
        throw Error('請選擇提供的狀態選項。');
    if (hours !== null && (!Number.isFinite(hours) || hours < 0 || hours > 24))
        throw Error('睡眠時數請填 0–24，記不清可以留白。');
    const rating = k => { if (!formData.has(k))
        return prior[k] ?? null; const raw = String(formData.get(k) ?? '').trim(); if (!raw)
        return null; const n = Number(raw); if (!Number.isInteger(n) || n < 1 || n > 5)
        throw Error('自評請選 1–5，或留白'); return n; };
    const skinRating = rating('skinRating'), comfortRating = rating('comfortRating');
    return { ...prior, date: day, sleep, wake, hours, energy, skin, fatigue, skinRating, comfortRating, recordedAt, presentationRule: exports.APPEARANCE_RULES.revision };
}
function presentationOfRecord(h) {
    if (!h)
        return { fatigue: 0, skin: false, known: false, reasons: [], label: '今日未回報' };
    const reasons = [];
    let fatigue = 0, known = false;
    const chosen = exports.FATIGUE_OPTIONS.includes(h.fatigue) ? h.fatigue : 'auto';
    if (chosen !== 'auto') {
        fatigue = ['base', 'light', 'tired'].indexOf(chosen);
        known = true;
        reasons.push('依妳手動選擇的外觀強度');
    }
    else {
        if (['有點累', '很疲倦', '普通', '精神不錯'].includes(h.energy)) {
            fatigue = h.energy === '很疲倦' ? 2 : h.energy === '有點累' ? 1 : 0;
            known = true;
            reasons.push('精神自評：' + h.energy);
        }
        // Optional, explicitly supplied ACTUAL hours, never elapsed bed-to-wake time.
        if (typeof h.hours === 'number' && Number.isFinite(h.hours) && h.hours >= 0 && h.hours <= 24) {
            fatigue = Math.max(fatigue, h.hours < 5 ? 2 : h.hours < 7 ? 1 : 0);
            known = true;
            reasons.push('自填睡眠 ' + h.hours + ' 小時（遊戲對照）');
        }
    }
    const skin = h.skin === '有些不穩定';
    if (['有些不穩定', '普通', '較穩定'].includes(h.skin)) {
        known = true;
        reasons.push('膚況自評：' + h.skin);
    }
    return { fatigue, skin, known, reasons, label: known ? exports.APPEARANCE_RULES.labels[fatigue] : '狀態待回報' };
}
function appearanceFor(s, day) {
    if (s.comfort?.mode === 'game') {
        const g = (0, comfort_model_js_1.complexion)(s, day), enabled = s.appearance?.enabled !== false;
        return { fatigue: enabled ? g.fatigue : 0, skin: enabled ? g.skin : false, known: true, reasons: ['遊戲氣色 ' + g.score + '/100；不是醫學膚況', g.override ? '妳已手動覆核' : '休整／活動依公開遊戲規則計點'], label: enabled ? g.label + ' · ' + g.score + '/100' : '外觀連動已關閉', enabled, date: day, lastDate: null, preview: false, ruleRevision: g.rule, game: true, score: g.score };
    }
    const records = (Array.isArray(s.health) ? s.health : []).filter(h => h && typeof h.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(h.date));
    const record = records.find(h => h.date === day) || null;
    const last = records.filter(h => h.date < day).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
    const result = presentationOfRecord(record), enabled = s.appearance?.enabled !== false;
    return { ...result, fatigue: enabled ? result.fatigue : 0, skin: enabled ? result.skin : false,
        enabled, date: record?.date || null, lastDate: last?.date || null,
        label: enabled ? result.label : '外觀連動已關閉', preview: false, ruleRevision: exports.APPEARANCE_RULES.revision };
}

},
"src/features/appearance-pixels.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FACE_MAP = void 0;
exports.tintAt = tintAt;
exports.makeTintPixels = makeTintPixels;
/** Local cosmetic tint mask for ONE locked pose. No warping, eye resizing or re-generation.
 * All coordinates are in the locked 996x844 hero source. Portrait is its own locked crop.
 * Zero alpha outside the documented cheek/under-eye region. No dog inputs are accepted.
 */
exports.FACE_MAP = Object.freeze({ hero: { width: 996, height: 844, ox: 0, oy: 0 }, portrait: { width: 364, height: 335, ox: 418, oy: 85 } });
function ellipse(x, y, cx, cy, rx, ry, angle) {
    const dx = x - cx, dy = y - cy, c = Math.cos(angle), s = Math.sin(angle), u = (dx * c + dy * s) / rx, v = (-dx * s + dy * c) / ry;
    const d = u * u + v * v;
    return d >= 1 ? 0 : (1 - d) * (1 - d);
}
function compose(p, color, alpha) {
    if (alpha <= 0)
        return p;
    const a = p[3], next = alpha + a * (1 - alpha);
    return [(color[0] * alpha + p[0] * a * (1 - alpha)) / next, (color[1] * alpha + p[1] * a * (1 - alpha)) / next, (color[2] * alpha + p[2] * a * (1 - alpha)) / next, next];
}
function tintAt(x, y, fatigue = 0, skin = false) {
    if (x < 475 || x > 646 || y < 259 || y > 395)
        return [0, 0, 0, 0];
    // Below the eyelids only; pupils, brows, nose bridge and jaw silhouette are protected.
    const underLeft = ellipse(x, y, 510, 291, 23, 10, -0.25);
    const underRight = ellipse(x, y, 575, 270, 25, 10, -0.35);
    const cheekLeft = ellipse(x, y, 512, 312, 22, 20, -0.2);
    const cheekRight = ellipse(x, y, 609, 300, 23, 23, -0.3);
    const chin = ellipse(x, y, 576, 379, 18, 10, -0.22);
    const f = [0, 0.125, 0.235][fatigue] || 0;
    let p = [0, 0, 0, 0];
    p = compose(p, [92, 71, 80], Math.max(underLeft, underRight) * f);
    p = compose(p, [157, 146, 138], Math.max(cheekLeft, cheekRight, chin) * (fatigue === 2 ? 0.052 : fatigue === 1 ? 0.024 : 0));
    // Generic, subtle uneven tone only: no fabricated acne or medical grading.
    if (skin)
        p = compose(p, [148, 67, 58], Math.max(cheekLeft, cheekRight) * 0.068);
    return [Math.round(p[0]), Math.round(p[1]), Math.round(p[2]), Math.round(p[3] * 255)];
}
function makeTintPixels(kind, fatigue, skin) {
    const m = exports.FACE_MAP[kind];
    if (!m)
        throw Error('Unknown locked face coordinate map');
    const bytes = new Uint8ClampedArray(m.width * m.height * 4);
    if (!fatigue && !skin)
        return { width: m.width, height: m.height, data: bytes };
    // Only visit the small facial region, not every pixel of the room or sprite.
    for (let y = Math.max(0, 259 - m.oy); y <= Math.min(m.height - 1, 395 - m.oy); y++)
        for (let x = Math.max(0, 475 - m.ox); x <= Math.min(m.width - 1, 646 - m.ox); x++) {
            const p = tintAt(x + m.ox, y + m.oy, fatigue, skin), i = (y * m.width + x) * 4;
            if (p[3]) {
                bytes[i] = p[0];
                bytes[i + 1] = p[1];
                bytes[i + 2] = p[2];
                bytes[i + 3] = p[3];
            }
        }
    return { width: m.width, height: m.height, data: bytes };
}

},
"src/features/appearance.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appearanceStatus = appearanceStatus;
exports.drawTint = drawTint;
exports.renderAppearance = renderAppearance;
exports.previewAppearance = previewAppearance;
exports.clearAppearancePreview = clearAppearancePreview;
exports.previewAppearanceInRoom = previewAppearanceInRoom;
exports.toggleAppearance = toggleAppearance;
exports.clearTodayObservation = clearTodayObservation;
/** Runtime presentation module. Settings live in the save; previews never do. */
const clock_js_1 = require("src/core/clock.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const appearance_model_js_1 = require("src/features/appearance-model.js");
const appearance_pixels_js_1 = require("src/features/appearance-pixels.js");
const masks = new Map();
function appearanceStatus() {
    const current = (0, appearance_model_js_1.appearanceFor)(runtime_js_1.runtime.state, (0, clock_js_1.today)());
    return runtime_js_1.runtime.appearancePreview ? { ...current, ...runtime_js_1.runtime.appearancePreview, preview: true,
        label: appearance_model_js_1.APPEARANCE_RULES.labels[runtime_js_1.runtime.appearancePreview.fatigue] + ' · 預覽', reasons: ['只看效果，未更改紀錄'] } : current;
}
function drawTint(canvas, status, original = false) {
    const kind = canvas.dataset.faceMap || 'portrait', f = original ? 0 : status.fatigue, s = original ? false : status.skin;
    const key = kind + '|' + f + '|' + Number(s);
    if (canvas.dataset.tintKey === key)
        return;
    canvas.dataset.tintKey = key;
    if (!masks.has(key)) {
        const p = (0, appearance_pixels_js_1.makeTintPixels)(kind, f, s);
        masks.set(key, p);
    }
    const pixels = masks.get(key);
    canvas.width = pixels.width;
    canvas.height = pixels.height;
    try {
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw Error('Canvas unavailable');
        ctx.putImageData(new ImageData(pixels.data, pixels.width, pixels.height), 0, 0);
        canvas.hidden = !f && !s;
        canvas.dataset.rendered = 'yes';
    }
    catch {
        canvas.hidden = true;
        canvas.dataset.rendered = 'fallback';
        const note = document.getElementById('appearanceRenderNote');
        if (note)
            note.textContent = '此瀏覽器無法顯示局部色彩層，保留核准原貌；紀錄仍可保存。';
    }
}
function renderAppearance() {
    if (!runtime_js_1.runtime.state)
        return;
    const status = appearanceStatus();
    document.querySelectorAll('canvas[data-face-map]').forEach(c => drawTint(c, status, c.dataset.appearanceOriginal === 'true'));
    document.querySelectorAll('[data-appearance-label]').forEach(el => el.textContent = status.label);
    const note = document.getElementById('appearanceSource');
    if (note)
        note.textContent = status.game && !status.preview ? '遊戲氣色自動演出 · 不用每日回報膚況' : status.preview ? '效果預覽，不會改進度或回報紀錄' : !status.enabled ? '原圖保留，隨時可再開啟' : status.date ? `${status.date} · 依妳回報的狀態` :
            status.lastDate ? `上次回報 ${status.lastDate}；今天未回報，不延用舊疲態` : '今天尚未回報，先保留核准原貌';
    const bar = document.getElementById('appearancePreviewBar');
    if (bar)
        bar.hidden = !status.preview;
    const detail = document.getElementById('appearanceReason');
    if (detail)
        detail.textContent = status.preview ? '範例演出，不代表妳今天的外貌。' : status.reasons.length ? status.reasons.join('；') : '不從現在幾點、等級或在線時間猜妳的精神。';
    document.querySelectorAll('[data-preview-appearance]').forEach(b => b.setAttribute('aria-pressed', String(status.preview && Number(b.dataset.previewAppearance) === status.fatigue)));
    const badge = document.getElementById('appearanceBadge');
    if (badge)
        badge.dataset.level = String(status.fatigue);
    const saved = document.getElementById('appearanceSavedLabel');
    if (saved)
        saved.textContent = (0, appearance_model_js_1.appearanceFor)(runtime_js_1.runtime.state, (0, clock_js_1.today)()).label;
}
function previewAppearance(level) {
    if (!Number.isInteger(level) || level < 0 || level > 2)
        return;
    runtime_js_1.runtime.appearancePreview = { fatigue: level, skin: level === 2 };
    runtime_js_1.runtime.appearanceRoomPreview = false;
    renderAppearance();
}
function clearAppearancePreview() {
    runtime_js_1.runtime.appearancePreview = null;
    runtime_js_1.runtime.appearanceRoomPreview = false;
    renderAppearance();
}
function previewAppearanceInRoom() {
    if (!runtime_js_1.runtime.appearancePreview) {
        const st = (0, appearance_model_js_1.appearanceFor)(runtime_js_1.runtime.state, (0, clock_js_1.today)());
        runtime_js_1.runtime.appearancePreview = { fatigue: st.fatigue, skin: st.skin };
    }
    runtime_js_1.runtime.appearanceRoomPreview = true;
    (0, ui_port_js_1.close)();
    renderAppearance();
    document.getElementById('scene')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function toggleAppearance() {
    runtime_js_1.runtime.state.appearance.enabled = !runtime_js_1.runtime.state.appearance.enabled;
    (0, storage_js_1.persist)();
    clearAppearancePreview();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('health', true);
    (0, ui_port_js_1.toast)(runtime_js_1.runtime.state.appearance.enabled ? '人物狀態連動已開啟；依目前選擇的遊戲／回報模式。' : '人物狀態連動已關閉，恢復核准原貌。');
}
function clearTodayObservation() {
    if (!runtime_js_1.runtime.state.health.some(h => h.date === (0, clock_js_1.today)()))
        return;
    if (!confirm('清除今天的本人回報？\n回報模式會恢復原貌；遊戲氣色模式不受影響。XP、幣、任務、狗狗與其他日期紀錄都不變。'))
        return;
    runtime_js_1.runtime.state.health = runtime_js_1.runtime.state.health.filter(h => h.date !== (0, clock_js_1.today)());
    (0, storage_js_1.persist)();
    clearAppearancePreview();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('health');
    (0, ui_port_js_1.toast)('今天的回報已清除，不影響獎勵或其他進度。');
}

},
"src/features/build-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOURNAL_STEPS = exports.BUILD_ID = void 0;
exports.firstBuildDefault = firstBuildDefault;
exports.validateFirstBuild = validateFirstBuild;
exports.captureBuildEvidence = captureBuildEvidence;
/** features/build-model — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const utils_js_1 = require("src/core/utils.js");
const validation_primitives_js_1 = require("src/core/validation-primitives.js");
exports.BUILD_ID = 'core.build.worklight.v1';
exports.JOURNAL_STEPS = ['todo', 'draft', 'revised', 'ready', 'submitted'];
function firstBuildDefault() { return { version: 1, goal: null, evidence: null, installedAt: null, signalReadAt: null, lampOn: true, homeCollapsed: null, archivedAt: null }; }
function validateFirstBuild(s) {
    if (s.firstBuild === undefined)
        s.firstBuild = firstBuildDefault();
    const b = s.firstBuild;
    if (!b || typeof b !== 'object' || Array.isArray(b) || b.version !== 1)
        throw Error('基地建設資料版本不受支援；原存檔保留。');
    for (const k of ['installedAt', 'signalReadAt'])
        if (b[k] !== null && (typeof b[k] !== 'string' || !Number.isFinite(Date.parse(b[k]))))
            throw Error('建設時間紀錄不正確。');
    if (typeof b.lampOn !== 'boolean')
        throw Error('建設照明狀態不正確。');
    if (b.goal !== null) {
        const g = b.goal;
        if (!g || typeof g !== 'object' || !['tophat', 'journal', 'task'].includes(g.kind))
            throw Error('建設目標類型不正確。');
        (0, validation_primitives_js_1.checkedText)(g.id, '建設目標 ID', 160);
        (0, validation_primitives_js_1.checkedText)(g.label, '建設目標', 500);
        if (!(0, utils_js_1.num)(g.baseline, 0, 1000) || typeof g.startedAt !== 'string' || !Number.isFinite(Date.parse(g.startedAt)))
            throw Error('建設目標基準不正確。');
    }
    if (b.evidence !== null) {
        const e = b.evidence;
        if (!e || typeof e !== 'object' || !b.goal || e.kind !== b.goal.kind || e.id !== b.goal.id || !(0, utils_js_1.num)(e.after, 1, 1001) || e.after <= b.goal.baseline || typeof e.at !== 'string' || !Number.isFinite(Date.parse(e.at)))
            throw Error('建設進度證明不正確。');
    }
    if (b.installedAt && !b.evidence)
        throw Error('已建設紀錄缺少本段進度證明。');
    if (b.signalReadAt && !b.installedAt)
        throw Error('尚未修復供電，不能已有訊號紀錄。');
    if (b.homeCollapsed === undefined || b.homeCollapsed === null)
        b.homeCollapsed = !!b.installedAt;
    if (typeof b.homeCollapsed !== 'boolean')
        throw Error('建設卡收合狀態不正確');
    if (b.archivedAt === undefined)
        b.archivedAt = null;
    if (b.archivedAt !== null && (typeof b.archivedAt !== 'string' || !Number.isFinite(Date.parse(b.archivedAt)) || !b.installedAt))
        throw Error('工程封存紀錄不正確');
    return s;
}
function captureBuildEvidence(s) {
    const b = s.firstBuild;
    if (!b?.goal || b.evidence)
        return;
    const g = b.goal;
    let after = g.baseline;
    if (g.kind === 'tophat') {
        const c = s.chapters.find(c => c.id === g.id);
        if (c)
            after = c.done;
    }
    if (g.kind === 'journal') {
        const j = s.journal[Number(g.id)];
        if (j)
            after = exports.JOURNAL_STEPS.indexOf(j.status);
    }
    if (g.kind === 'task') {
        const t = s.tasks.find(t => t.id === g.id);
        if (t?.status === 'done')
            after = 1;
    }
    if (after > g.baseline)
        b.evidence = { kind: g.kind, id: g.id, after, at: (0, clock_js_1.stamp)() };
}

},
"src/features/build.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildChoices = buildChoices;
exports.acceptBuildGoal = acceptBuildGoal;
exports.openBuildGoal = openBuildGoal;
exports.installWorklight = installWorklight;
exports.previewWorklight = previewWorklight;
exports.readBuildSignal = readBuildSignal;
exports.signalPanel = signalPanel;
exports.renderBuild = renderBuild;
exports.buildPanel = buildPanel;
exports.archiveBuild = archiveBuild;
exports.toggleBuildCard = toggleBuildCard;
exports.nextBuildTask = nextBuildTask;
/** features/build — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const art_js_1 = require("src/data/art.js");
const build_model_js_1 = require("src/features/build-model.js");
const tasks_query_js_1 = require("src/features/tasks-query.js");
const dom_js_1 = require("src/ui/dom.js");
function buildChoices() {
    const choices = [];
    runtime_js_1.runtime.state.journal.forEach((j, i) => {
        const rank = build_model_js_1.JOURNAL_STEPS.indexOf(j.status);
        if (rank < 4)
            choices.push({ kind: 'journal', id: String(i), baseline: rank, label: `Journal ${i + 1} · ${j.title}：推進 1 階段`, detail: `${tasks_query_js_1.stateName[j.status]} → ${rank + 1 === 3 ? '已定稿' : tasks_query_js_1.stateName[build_model_js_1.JOURNAL_STEPS[rank + 1]]}。只追蹤親自完成的進度，不代寫內容。` });
    });
    for (const t of (0, tasks_query_js_1.orderedTasks)().filter(t => t.status !== 'done' && ['516', '552', '557', '569', 'career'].includes(t.course)))
        choices.push({ kind: 'task', id: t.id, baseline: 0, label: `${(0, tasks_query_js_1.courseName)(t.course)} · ${t.title}`, detail: t.type === 'assignment' ? '需在課程平台真正提交後，在原任務確認。' : '在原任務面板確認真正完成；只切換「進行中」不算。' });
    return choices;
}
function acceptBuildGoal(key) {
    const b = runtime_js_1.runtime.state.firstBuild;
    if (b.installedAt || b.evidence)
        return (0, ui_port_js_1.toast)('本段已有進度證明，不需要重新接取。');
    const choice = buildChoices().find(c => c.kind + ':' + c.id === key);
    if (!choice)
        return (0, ui_port_js_1.toast)('這個目標已改變，請重新選擇。');
    if (b.goal && !confirm('切換本次建設目標？已做的課程進度與原獎勵不變；新目標會從現在的進度起算。'))
        return;
    b.goal = { kind: choice.kind, id: choice.id, baseline: choice.baseline, label: choice.label, startedAt: (0, clock_js_1.stamp)() };
    (0, ledger_js_1.log)('接取建設第一段：' + choice.label + '（不扣資源、不發 XP）');
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('build');
    (0, ui_port_js_1.toast)('已選定。回原本面板記錄真實進度，不需要維護逐題進度。');
}
function openBuildGoal() {
    const g = runtime_js_1.runtime.state.firstBuild.goal;
    if (!g)
        return (0, ui_port_js_1.show)('build');
    if (g.kind === 'tophat')
        (0, ui_port_js_1.show)('tophat');
    else if (g.kind === 'journal')
        (0, ui_port_js_1.show)('journal');
    else {
        runtime_js_1.runtime.taskFilter = 'all';
        runtime_js_1.runtime.taskLane = 'main';
        (0, ui_port_js_1.show)('tasks');
        [...document.querySelectorAll('[data-task-card]')].find(e => e.dataset.taskCard === g.id)?.scrollIntoView({ block: 'center' });
    }
}
function installWorklight() {
    const b = runtime_js_1.runtime.state.firstBuild;
    if (b.installedAt || Object.hasOwn(runtime_js_1.runtime.state.events, build_model_js_1.BUILD_ID))
        return (0, ui_port_js_1.toast)('這段工程已完成，不重複施工或領獎。');
    if (!b.evidence)
        return (0, ui_port_js_1.toast)('先完成選定的真實進度；預覽與計時不會自動算完成。');
    if (!confirm('接通工作桌暖燈？\n本段是新手建設：0 生存幣、0 維修零件、不另加 XP。\n沿用已完成的真實進度，啟用固定照明並開放一則室內訊號。'))
        return;
    b.installedAt = (0, clock_js_1.stamp)();
    b.homeCollapsed = true;
    b.lampOn = true;
    runtime_js_1.runtime.state.events[build_model_js_1.BUILD_ID] = b.installedAt;
    (0, ledger_js_1.log)('完成基地建設第一段：工作桌照明已接通（0 幣、0 材料、0 額外 XP）');
    (0, storage_js_1.persist)();
    runtime_js_1.runtime.buildPreview = false;
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.close)();
    (0, ui_port_js_1.toast)('工作區亮起來了。房間仍是 Tier 0，這是第一個修復點。');
    (0, dom_js_1.$)('scene').scrollIntoView({ block: 'center', behavior: runtime_js_1.runtime.state.settings.reduceMotion ? 'auto' : 'smooth' });
    if (innerWidth <= 640) {
        const sc = (0, dom_js_1.$)('sceneScroll');
        sc.scrollTo({ left: (0, dom_js_1.$)('scene').clientWidth * .57 - sc.clientWidth / 2, behavior: 'smooth' });
    }
}
function previewWorklight() {
    runtime_js_1.runtime.buildPreview = true;
    (0, ui_port_js_1.close)();
    renderBuild();
    (0, dom_js_1.$)('scene').scrollIntoView({ block: 'center', behavior: runtime_js_1.runtime.state.settings.reduceMotion ? 'auto' : 'smooth' });
    if (innerWidth <= 640) {
        const sc = (0, dom_js_1.$)('sceneScroll');
        sc.scrollTo({ left: (0, dom_js_1.$)('scene').clientWidth * .57 - sc.clientWidth / 2, behavior: 'smooth' });
    }
}
function readBuildSignal() {
    const b = runtime_js_1.runtime.state.firstBuild;
    if (!b.installedAt)
        return (0, ui_port_js_1.toast)('這個訊號尚未開放；先接通屋內供電。');
    if (!b.signalReadAt) {
        b.signalReadAt = (0, clock_js_1.stamp)();
        (0, ledger_js_1.log)('查看第一段室內訊號（無獎勵、無扣款）');
        (0, storage_js_1.persist)();
        (0, ui_port_js_1.render)();
    }
    (0, ui_port_js_1.show)('signal');
}
function signalPanel() { return `<div class="build-letter"><span class="eyebrow">RESIDENT TERMINAL / 本段已開放</span><h2>線路另一端</h2><p>暖燈亮起後，終端上的雜訊短暫退去。妳聽見一個不甚清楚的聲音。</p><blockquote>「這條線還有人用？……先別拆門框上的第二道刻痕。它不是刮傷，是一個編號。」</blockquote><p>畫面停在 <b>01</b>，對方沒有留下名字。</p><p class="muted">已確認：室內線路可以接收短訊。未確認：發訊者、其他編號。沒有打開房門，也沒有觸發外出。</p><div class="note">此段訊號可重看、不限時、不收費。後續章節尚未安裝，不把未完成功能說成「權限不足」。</div><button class="primary" data-panel="build">回基地建設</button></div>`; }
function renderBuild() {
    const b = runtime_js_1.runtime.state.firstBuild, on = (b.installedAt && b.lampOn) || runtime_js_1.runtime.buildPreview;
    (0, dom_js_1.$)('worklightLayer').hidden = !on;
    (0, dom_js_1.$)('worklightLayer').classList.toggle('preview', runtime_js_1.runtime.buildPreview);
    (0, dom_js_1.$)('buildPreviewBar').hidden = !runtime_js_1.runtime.buildPreview;
    if (runtime_js_1.runtime.buildPreview)
        (0, dom_js_1.$)('buildPreviewBar').innerHTML = '<div><strong>工作燈 · 效果預覽</strong><small>不扣資源、不發 XP、不保存安裝。人物、狗狗與房間原圖不變。</small></div><button class="outline" data-build-end-preview>結束預覽</button>';
    const stage = b.installedAt ? '已修復' : b.evidence ? '可施工' : b.goal ? '進行中' : '未接取';
    const sub = b.installedAt ? '工作桌暖燈已接通。可查看室內訊號，或管理照明。' : b.evidence ? '所選進度已完成。回到建設面板接通暖燈。' : b.goal ? b.goal.label : '選擇現有 TopHat、Journal 或待辦；推進一步後修復照明。';
    const card = (0, dom_js_1.$)('firstBuildCard');
    card.hidden = !!b.archivedAt;
    card.classList.toggle('is-compact', !!b.installedAt && b.homeCollapsed !== false);
    if (b.installedAt && b.homeCollapsed !== false) {
        card.innerHTML = `<div class="build-seal">${(0, dom_js_1.icon)('check')}</div><div><strong>工作區已復電</strong><small>照明保留 · 工程不佔任務名額${!b.signalReadAt ? ' · 有未讀訊號' : ''}</small></div><div class="row"><button class="primary" data-build-next>接下一項主線 →</button><button class="outline" data-build-archive>關閉完成提示</button><button class="link" data-panel="build">工程紀錄</button></div>`;
        (0, dom_js_1.$)('scene').dataset.worklight = on ? 'on' : 'off';
        return;
    }
    (0, dom_js_1.$)('firstBuildCard').innerHTML = `<div class="build-seal">${(0, dom_js_1.icon)('hammer')}</div><div><div class="build-inline-head"><span class="eyebrow">基地建設 / 第一個修復點</span><span class="build-state-chip">${stage}</span></div><h3>工作區復電 · 留一盞暖燈</h3><p>${(0, dom_js_1.esc)(sub)}</p><div class="build-mini-track">${[['選定目標', !!b.goal], ['回報進度', !!b.evidence], ['接通照明', !!b.installedAt]].map(([n, done]) => `<span class="${done ? 'done' : ''}">${done ? '✓ ' : ''}${n}</span>`).join('')}</div></div><div class="build-primary-actions"><button class="primary" data-panel="build">${b.installedAt ? '管理建設' : b.evidence ? '前往施工' : b.goal ? '繼續建設' : '開始建設'} →</button><small>新手工程 · 0 幣 / 0 材料</small></div>`;
    (0, dom_js_1.$)('scene').dataset.worklight = on ? 'on' : 'off';
}
function buildPanel() {
    const b = runtime_js_1.runtime.state.firstBuild, choices = buildChoices();
    const steps = [{ n: '01', title: '選定真實的一步', done: !!b.goal, desc: b.goal ? b.goal.label : '從現有課程或求職進度選一項。章節做完後勾選；也可選擇 Journal 一個階段或其他任務。' }, { n: '02', title: '在原面板記錄進度', done: !!b.evidence, desc: b.evidence ? '本段的新增進度已保存。原任務獎勵照舊，這裡不再發一次。' : '勾選所選 TopHat 整章完成、Journal 前進 1 階段，或完成所選待辦；只依妳的回報，不讀取外部平台。' }, { n: '03', title: '接通工作桌暖燈', done: !!b.installedAt, desc: '新手工程 0 幣、0 材料、0 額外 XP。啟用固定暖燈，接收到一則室內訊號。' }];
    return `<div class="feature-tabs"><button class="selected" data-panel="build">${(0, dom_js_1.icon)('hammer')}基地建設</button><button data-panel="decor">${(0, dom_js_1.icon)('layers')}房間佈置</button><button data-panel="inventory">${(0, dom_js_1.icon)('bag')}背包</button></div>${b.installedAt ? `<div class="build-completion"><span class="tag">工程完成 · 照明與進度保留</span><h3>這一段可以收工了。</h3><p>完成不會擋住其他任務。關閉的是首頁提示，不是拆掉暖燈或清除紀錄。</p><div class="row"><button class="primary" data-build-next>接下一項主線 →</button><button class="outline" data-build-archive>封存工程並回房間</button><button class="link" data-build-expand>${b.archivedAt ? '重新顯示首頁工程卡' : '展開／收合首頁卡'}</button></div></div>` : ''}<p class="build-purpose"><b>建設</b>是修復固定設施；<b>佈置</b>是擺放已持有的家具。這裡先開放工作區照明，不用再找隱藏按鈕。</p><div class="build-intro"><div><span class="eyebrow">CHAPTER 01 / MAKE A SMALL DIFFERENCE</span><h2>讓書桌，先亮起來。</h2><p>這次不是重新刷一份任務。妳在現實推進的那一步，會成為第一個修復點。</p></div><div class="build-lamp-preview"><img src="${art_js_1.ART['prop-lantern']}" alt="工作桌暖燈" /></div></div><div class="build-state"><span>基地仍為 Tier 0</span><b>${b.installedAt ? '工作區已復電' : b.evidence ? '可施工' : b.goal ? '等待真實進度' : '尚未接取'}</b></div>${b.installedAt ? '<details class="growth-explainer"><summary>已完成工程 · 查看三步紀錄</summary>' : ''}<ol class="build-steps">${steps.map(s => `<li class="${s.done ? 'complete' : ''}"><span class="build-stepno">${s.done ? '✓' : s.n}</span><div><h3>${s.title}</h3><p>${(0, dom_js_1.esc)(s.desc)}</p></div></li>`).join('')}</ol>${b.installedAt ? '</details>' : ''}${!b.evidence && !b.installedAt ? `<form id="buildGoalForm" class="stack"><label class="field">${b.goal ? '切換目標（不清除原進度）' : '選擇要推進的目標'}<select name="goalKey" required>${choices.map(c => `<option value="${(0, dom_js_1.esc)(c.kind + ':' + c.id)}" ${b.goal?.kind === c.kind && b.goal?.id === c.id ? 'selected' : ''}>${(0, dom_js_1.esc)(c.label)}</option>`).join('')}</select></label><div class="row"><button class="primary" type="submit" ${choices.length ? '' : 'disabled'}>${b.goal ? '重新選定' : '接取這一段'}</button><button class="outline" type="button" data-panel="tophat">登記實際 TopHat 章節</button></div></form>` : ''}<div class="build-actions">${b.goal && !b.evidence ? '<button class="primary" data-build-open-goal>回原面板推進這一步 →</button>' : ''}${b.evidence && !b.installedAt ? '<button class="primary" data-build-install>接通暖燈 · 免費</button>' : ''}${!b.installedAt ? '<button class="outline" data-build-preview>先看修復效果（不存檔）</button>' : `<button class="primary" data-build-signal>${b.signalReadAt ? '重看室內訊號' : '查看新收到的訊號'}</button><button class="outline" data-build-toggle>${b.lampOn ? '關燈' : '開燈'} · 免費</button><button class="outline" data-home>回到房間</button>`}</div><div class="note space">${b.installedAt ? '這是一個固定建設，不佔背包、不可分解；關燈不會失去已修復狀態。' : '接取與預覽不發獎。領取簽到、完成料理、重新匯入同一進度、單純跑完計時，都不會代替所選任務。'}<br>人物與德牧素材未改。基本課業、期限與健康資訊不受劇情權限限制。</div><p class="muted small space">目前開放這一段，後續章節不預先列攻略。整間宿舍擴建、更多 NPC 與換裝仍待製作；本段不宣稱基地已升到 Tier 1。</p>`;
}
function archiveBuild() { const b = runtime_js_1.runtime.state.firstBuild; if (!b.installedAt)
    return (0, ui_port_js_1.toast)('工程尚未完成，未清除進度'); b.archivedAt = (0, clock_js_1.stamp)(); b.homeCollapsed = true; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.close)(); (0, ui_port_js_1.toast)('完成提示已收起；暖燈、工程與任務進度保留'); }
function toggleBuildCard() { const b = runtime_js_1.runtime.state.firstBuild; if (!b.installedAt)
    return; b.archivedAt = null; b.homeCollapsed = !b.homeCollapsed; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('build'); }
function nextBuildTask() { const t = (0, tasks_query_js_1.orderedTasks)().find(t => t.status !== 'done' && ['516', '552', '557', '569', 'career'].includes(t.course)); if (!t) {
    (0, ui_port_js_1.show)('tasks');
    return (0, ui_port_js_1.toast)('目前沒有未完成學業／求職主線，可自行新增');
} runtime_js_1.runtime.taskFilter = 'all'; runtime_js_1.runtime.taskLane = 'main'; (0, ui_port_js_1.show)('tasks'); const el = [...document.querySelectorAll('[data-task-card]')].find(e => e.dataset.taskCard === t.id); el?.scrollIntoView({ block: 'center' }); el?.classList.add('growth-focus-task'); (0, ui_port_js_1.toast)('下一項：' + t.title + '。原任務繼續，不重複接取或發獎'); }

},
"src/features/comfort-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comfortRules = exports.comfortDefaults = void 0;
exports.validateComfort = validateComfort;
exports.inferWake = inferWake;
exports.beginRest = beginRest;
exports.cancelWake = cancelWake;
exports.instantForLA = instantForLA;
exports.setWake = setWake;
exports.complexion = complexion;
/** All numbers below are cosmetic game rules, NOT inferred skin/health/sleep data. */
const clock_js_1 = require("src/core/clock.js");
const growth_model_js_1 = require("src/features/growth-model.js");
const comfortDefaults = () => ({ version: 1, mode: 'game', autoWake: true, wakes: {}, rests: [], careDays: [], override: null });
exports.comfortDefaults = comfortDefaults;
exports.comfortRules = 'game.complexion.1';
const validTime = t => typeof t === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
function validateComfort(s) {
    if (s.comfort === undefined)
        s.comfort = (0, exports.comfortDefaults)();
    const c = s.comfort;
    if (!c || c.version !== 1 || !['game', 'reported'].includes(c.mode) || typeof c.autoWake !== 'boolean' || !c.wakes || typeof c.wakes !== 'object' || Array.isArray(c.wakes) || !Array.isArray(c.rests) || !Array.isArray(c.careDays))
        throw Error('休整自動化資料無效');
    if (c.override !== null && (!Number.isInteger(c.override) || c.override < 0 || c.override > 100))
        throw Error('氣色覆核須為 0–100');
    if (c.rests.length > 40000 || c.careDays.length > 40000 || Object.keys(c.wakes).length > 40000)
        throw Error('紀錄過多');
    for (const [d, w] of Object.entries(c.wakes))
        if (!(0, growth_model_js_1.validDay)(d) || !w || !validTime(w.time) || !['estimated', 'confirmed', 'dismissed'].includes(w.status) || !Number.isFinite(Date.parse(w.at)))
            throw Error('起床估記格式不正確');
    const ids = new Set();
    for (const r of c.rests) {
        if (!r || !(0, growth_model_js_1.validDay)(r.day) || !validTime(r.time) || !Number.isFinite(Date.parse(r.at)) || r.end !== null && !Number.isFinite(Date.parse(r.end)) || ids.has(r.day) || (r.wakeDay !== null && !(0, growth_model_js_1.validDay)(r.wakeDay)) || (r.end !== null && Date.parse(r.end) < Date.parse(r.at)))
            throw Error('休整紀錄格式不正確');
        ids.add(r.day);
    }
    if (c.careDays.some(d => !(0, growth_model_js_1.validDay)(d)) || new Set(c.careDays).size !== c.careDays.length)
        throw Error('整理紀錄格式不正確');
    return s;
}
function inferWake(s, now, trigger = 'load', hiddenMs = 0) {
    const p = (0, clock_js_1.parts)(now), day = (0, clock_js_1.isoDay)(now), c = s.comfort;
    if (!c.autoWake || +p.hour < 5 || c.wakes[day] || trigger === 'foreground' && hiddenMs < 30 * 60000)
        return false;
    c.wakes[day] = { time: p.hour + ':' + p.minute, at: now.toISOString(), status: 'estimated', source: 'first-visible', lowConfidence: +p.hour >= 14 };
    const pending = c.rests.filter(r => r.end === null && Date.parse(r.at) < now.getTime()).sort((a, b) => b.at.localeCompare(a.at))[0];
    if (pending) {
        const hours = (now.getTime() - Date.parse(pending.at)) / 3600000;
        if (hours >= 2 && hours <= 24) {
            pending.end = now.toISOString();
            pending.wakeDay = day;
            pending.endSource = 'estimated';
        }
    }
    return true;
}
function beginRest(s, now) { const day = (0, clock_js_1.isoDay)(now), p = (0, clock_js_1.parts)(now); if (s.comfort.rests.some(r => r.day === day))
    return false; s.comfort.rests.push({ day, time: p.hour + ':' + p.minute, at: now.toISOString(), end: null, wakeDay: null }); return true; }
function cancelWake(s, day) { const w = s.comfort.wakes[day]; if (!w)
    return false; w.status = 'dismissed'; for (const r of s.comfort.rests)
    if (r.wakeDay === day) {
        r.end = null;
        r.wakeDay = null;
        delete r.endSource;
    } return true; }
function instantForLA(day, time) { let ts = Date.parse(day + 'T' + time + ':00Z'); for (let i = 0; i < 4; i++) {
    const p = (0, clock_js_1.parts)(new Date(ts)), actual = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00Z`), wanted = Date.parse(day + 'T' + time + ':00Z');
    if (actual === wanted)
        return new Date(ts).toISOString();
    ts += wanted - actual;
} throw Error('此時間可能不存在（夏令時間切換），請選另一時間'); }
function setWake(s, day, time, now) {
    if (!(0, growth_model_js_1.validDay)(day) || !validTime(time))
        throw Error('起床時間格式無效');
    const at = instantForLA(day, time);
    if (Date.parse(at) > now.getTime())
        throw Error('起床時間不能在未來');
    s.comfort.wakes[day] = { time, at, status: 'confirmed', source: 'manual', lowConfidence: false };
    for (const old of s.comfort.rests)
        if (old.wakeDay === day) {
            old.end = null;
            old.wakeDay = null;
            delete old.endSource;
        }
    const pending = s.comfort.rests.filter(r => (r.end === null || r.wakeDay === day) && Date.parse(r.at) < Date.parse(at)).sort((a, b) => b.at.localeCompare(a.at))[0];
    if (pending) {
        const hours = (Date.parse(at) - Date.parse(pending.at)) / 3600000;
        pending.end = hours >= 2 && hours <= 24 ? at : null;
        pending.wakeDay = pending.end ? day : null;
        pending.endSource = 'manual';
    }
    return true;
}
function complexion(s, day) {
    const c = s.comfort || (0, exports.comfortDefaults)(), days = new Map();
    const add = (d, k, n) => { if (d > day)
        return; const o = days.get(d) || {}; o[k] = n; days.set(d, o); };
    for (const r of c.rests) {
        const h = +r.time.split(':')[0], penalty = h < 2 ? 3 : h < 4 ? 7 : h < 12 ? 12 : 0;
        add(r.day, '晚間休整節奏', -penalty);
        if (r.end && r.wakeDay && r.wakeDay <= day)
            add(r.wakeDay, '完成遊戲休整', 6);
    }
    for (const x of s.growth?.exercise || [])
        add(x.date, '活動已記錄', 4);
    for (const d of c.careDays)
        add(d, '整理儀容', 2);
    let score = 70;
    const reasons = [];
    for (const [d, v] of [...days].sort(([a], [b]) => a.localeCompare(b))) {
        const delta = Object.values(v).reduce((a, b) => a + b, 0);
        score = Math.max(20, Math.min(100, score + delta));
        reasons.push({ day: d, changes: v, delta });
    }
    if (c.override !== null)
        score = c.override;
    return { score, fatigue: score >= 70 ? 0 : score >= 45 ? 1 : 2, skin: score < 45, label: score >= 70 ? '氣色良好' : score >= 45 ? '略有倦容' : '需要休整', reasons: reasons.slice(-7), override: c.override !== null, rule: exports.comfortRules };
}

},
"src/features/comfort.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeWake = maybeWake;
exports.restNow = restNow;
exports.stillAwake = stillAwake;
exports.groomToday = groomToday;
exports.toggleAutoWake = toggleAutoWake;
exports.comfortMode = comfortMode;
exports.saveWakeForm = saveWakeForm;
exports.saveComplexion = saveComplexion;
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const clock_js_1 = require("src/core/clock.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const comfort_model_js_1 = require("src/features/comfort-model.js");
function maybeWake(trigger = 'load', hiddenMs = 0) {
    if (document.hidden || runtime_js_1.runtime.writerMode !== 'writer' || runtime_js_1.runtime.readError || runtime_js_1.runtime.storageConflict)
        return;
    try {
        if ((0, comfort_model_js_1.inferWake)(runtime_js_1.runtime.state, new Date(), trigger, hiddenMs)) {
            (0, storage_js_1.persist)();
            (0, ui_port_js_1.render)();
            (0, ui_port_js_1.toast)('已估記首次開啟為起床時間，可在休整修改／選「還沒睡」。不推算實際睡眠。');
        }
    }
    catch (e) {
        if (!(e instanceof storage_js_1.SaveStopped))
            throw e;
        (0, ui_port_js_1.render)();
    }
}
function restNow() { if (!(0, comfort_model_js_1.beginRest)(runtime_js_1.runtime.state, new Date()))
    return (0, ui_port_js_1.toast)('今天已記過準備休息；不重複結算。'); (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('health'); (0, ui_port_js_1.toast)('記下準備休息。不是已經睡著；不要求立刻入睡。'); }
function stillAwake() { (0, comfort_model_js_1.cancelWake)(runtime_js_1.runtime.state, (0, clock_js_1.today)()); (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('health'); (0, ui_port_js_1.toast)('這不是起床時間，估記已取消。今天可手動補真正起床時間。'); }
function groomToday() { const c = runtime_js_1.runtime.state.comfort; if (c.careDays.includes((0, clock_js_1.today)()))
    return (0, ui_port_js_1.toast)('今天已記過，不重複加遊戲氣色。'); c.careDays.push((0, clock_js_1.today)()); (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('health'); (0, ui_port_js_1.toast)('整理儀容：遊戲氣色 +2（每日一次，不是現實皮膚評估）。'); }
function toggleAutoWake() { runtime_js_1.runtime.state.comfort.autoWake = !runtime_js_1.runtime.state.comfort.autoWake; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('health'); }
function comfortMode(mode) { if (!['game', 'reported'].includes(mode))
    return; runtime_js_1.runtime.state.comfort.mode = mode; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('health'); }
function saveWakeForm(fd) { if (fd.get('date') !== (0, clock_js_1.today)())
    return (0, ui_port_js_1.toast)('日期已改變，請重新打開面板'); try {
    (0, comfort_model_js_1.setWake)(runtime_js_1.runtime.state, (0, clock_js_1.today)(), String(fd.get('time') || ''), new Date());
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('health');
    (0, ui_port_js_1.toast)('已改成妳確認的起床時間。');
}
catch (e) {
    if (e instanceof storage_js_1.SaveStopped)
        throw e;
    (0, ui_port_js_1.toast)(e.message);
} }
function saveComplexion(fd) { const raw = String(fd.get('score') || '').trim(), v = raw === '' ? null : Number(raw); if (v !== null && (!Number.isInteger(v) || v < 0 || v > 100))
    return (0, ui_port_js_1.toast)('請填 0–100，留白恢復自動'); runtime_js_1.runtime.state.comfort.override = v; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('health'); (0, ui_port_js_1.toast)(v === null ? '恢復遊戲規則計點' : '已手動調整遊戲氣色，不改真實健康紀錄'); }

},
"src/features/companion.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dogStates = void 0;
exports.bindCompanionArt = bindCompanionArt;
exports.dogState = dogState;
exports.renderDog = renderDog;
/** features/companion — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const runtime_js_1 = require("src/core/runtime.js");
const dom_js_1 = require("src/ui/dom.js");
function bindCompanionArt(root = document) {
    root.querySelectorAll('[data-companion-art]').forEach(img => {
        const src = config_js_1.COMPANION_ART[img.dataset.companionArt];
        if (src && img.getAttribute('src') !== src)
            img.src = src;
        img.dataset.artRevision = config_js_1.COMPANION_ART.revision;
    });
}
exports.dogStates = [{ place: '在墊子上休息', visible: true }, { place: '去走廊散步', visible: false }, { place: '在鏡頭外喝水', visible: false }, { place: '回來陪妳', visible: true }, { place: '在隔壁角落打盹', visible: false }, { place: '待在自己的墊子上', visible: true }];
function dogState() {
    if (runtime_js_1.runtime.dogOverride)
        return { place: runtime_js_1.runtime.dogOverride === 'present' ? '回到墊子上（預覽）' : '去走廊散步（預覽）', visible: runtime_js_1.runtime.dogOverride === 'present' };
    const p = (0, clock_js_1.parts)(), key = `${p.year}${p.month}${p.day}-${Math.floor(+p.hour / 2)}`;
    const hash = [...key].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 17);
    return exports.dogStates[hash % 6];
}
function renderDog() {
    bindCompanionArt();
    const d = dogState();
    (0, dom_js_1.$)('dog').hidden = !d.visible;
    (0, dom_js_1.$)('dogLine').textContent = '守衛 · ' + d.place;
    (0, dom_js_1.$)('matLabel').textContent = d.visible ? '摸摸德牧' : '守衛行蹤';
    (0, dom_js_1.$)('dogHint').textContent = d.place;
    document.querySelector('.companion-mini strong').textContent = d.visible ? '資深守衛，回家了。' : '資深守衛，有自己的行程。';
    const status = (0, dom_js_1.$)('dogModalState');
    if (status)
        status.textContent = d.place;
}

},
"src/features/decor-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DECOR_DEFS = void 0;
exports.decorForName = decorForName;
exports.decorItem = decorItem;
exports.decorPlaced = decorPlaced;
exports.validateDecor = validateDecor;
/** features/decor-model — extracted from verified 2.3.1; visual/gameplay parity first. */
const runtime_js_1 = require("src/core/runtime.js");
exports.DECOR_DEFS = Object.freeze({
    'core.decor.oldcity-lantern': { name: '舊城提燈', type: '收藏', art: 'prop-lantern', slot: 'entry-chest', where: '門邊矮櫃', x: 51.5, y: 46.8, w: 3.1, style: 'lantern', copy: '舊燈安置在入口，夜裡留一小圈暖光。', source: '維修零件 ×6 定向兌換' },
    'core.decor.pour-over': { name: '手沖杯組', type: '收藏', art: 'prop-dripper', slot: 'coffee-counter', where: '料理台邊緣', x: 85.4, y: 44.2, w: 2.7, style: '', copy: '杯子與濾杯有了固定的位置，不再只是一格收藏。', source: '維修零件 ×6 定向兌換' },
    'core.decor.cat-pillow': { name: '灰白貓咪抱枕', type: '收藏', art: 'prop-pillow', slot: 'bed-head', where: '床頭枕邊', x: 16.5, y: 41.9, w: 6.5, style: '', copy: '一隻安靜的布偶。不是新寵物，也不佔守衛的墊子。', source: '維修零件 ×6 定向兌換' },
    'core.decor.window-plant': { name: '植物小盆栽', type: '收藏', art: 'prop-plant', slot: 'window-hook', where: '窗框掛鉤', x: 77.7, y: 33.8, w: 4.0, style: 'hanging', copy: '窗邊的一簇綠色，保留空間給城市和夜色。', source: '維修零件 ×6 定向兌換' },
    'core.decor.study-notes': { name: '章節研究筆記', type: '材料', art: 'prop-journal', slot: 'desk-right', where: '書桌右側', x: 51.2, y: 81.5, w: 6.4, style: '', copy: '每一章親手做完的痕跡，現在也能放在桌上。', source: '完成一章已登記的 TopHat（沿用既有獎勵）' }
});
function decorForName(name) { return Object.entries(exports.DECOR_DEFS).find(([id, d]) => d.name === name); }
function decorItem(id, s = runtime_js_1.runtime.state) { const d = exports.DECOR_DEFS[id]; return d ? s.items.find(x => x.name === d.name && x.type === d.type) : null; }
function decorPlaced(id, s = runtime_js_1.runtime.state) { return Object.values(s.roomDecor?.slots || {}).includes(id); }
function validateDecor(out) {
    const v = out.roomDecor;
    if (v === undefined) {
        out.roomDecor = { version: 1, slots: {} };
        return out;
    }
    if (!v || typeof v !== 'object' || Array.isArray(v) || v.version !== 1 || !v.slots || typeof v.slots !== 'object' || Array.isArray(v.slots))
        throw Error('房間佈置資料不受此版支援；原檔保留。');
    for (const [slot, id] of Object.entries(v.slots)) {
        const d = exports.DECOR_DEFS[id];
        if (!d || d.slot !== slot)
            throw Error('未辨識的佈置位置或物件；不會自行移除。');
        const item = decorItem(id, out);
        if (!item || item.qty < 1)
            throw Error('已擺放的物品沒有對應持有量；請核對存檔。');
    }
    return out;
}

},
"src/features/decor.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorViewSlots = decorViewSlots;
exports.renderDecor = renderDecor;
exports.decorPanel = decorPanel;
exports.decorRoute = decorRoute;
exports.previewDecor = previewDecor;
exports.placeDecor = placeDecor;
exports.removeDecor = removeDecor;
exports.decorSource = decorSource;
/** features/decor — extracted from verified 2.3.1; visual/gameplay parity first. */
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const art_js_1 = require("src/data/art.js");
const decor_model_js_1 = require("src/features/decor-model.js");
const dom_js_1 = require("src/ui/dom.js");
function decorViewSlots() {
    const slots = runtime_js_1.runtime.decorBefore ? {} : { ...(runtime_js_1.runtime.state.roomDecor?.slots || {}) };
    if (runtime_js_1.runtime.decorPreview) {
        const d = decor_model_js_1.DECOR_DEFS[runtime_js_1.runtime.decorPreview];
        if (d)
            slots[d.slot] = runtime_js_1.runtime.decorPreview;
    }
    return slots;
}
function renderDecor() {
    const slots = decorViewSlots();
    (0, dom_js_1.$)('roomDecorLayer').innerHTML = Object.values(slots).map(id => { const d = decor_model_js_1.DECOR_DEFS[id]; return `<span class="room-prop ${d.style} ${runtime_js_1.runtime.decorPreview === id ? 'is-preview' : ''}" data-room-prop="${id}" style="left:${d.x}%;top:${d.y}%;width:${d.w}%"><img src="${art_js_1.ART[d.art]}" alt="${(0, dom_js_1.esc)(d.where + '：' + d.name)}" draggable="false"></span>`; }).join('');
    const n = Object.keys(runtime_js_1.runtime.state.roomDecor?.slots || {}).length;
    (0, dom_js_1.$)('roomProgress').innerHTML = `<span class="chapter-no">01</span><div><span class="eyebrow">ROOM JOURNAL / 初階住戶</span><h3>${n ? '妳的生活，開始留在房間裡。' : '先讓一件收藏，有自己的位置。'}</h3><p>${n ? `已安置 ${n} 件。物品仍屬於妳；收回不收費。` : '首批開放五個固定位置。先試擺，再決定想收集哪一件。'}</p><div class="progress-dots" aria-label="已安置 ${n} / 5">${Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</div></div><button class="outline" data-panel="decor">房間佈置 ${(0, dom_js_1.icon)('arrow')}</button>`;
    const d = decor_model_js_1.DECOR_DEFS[runtime_js_1.runtime.decorPreview];
    const bar = (0, dom_js_1.$)('decorPreviewBar');
    bar.hidden = !d && !runtime_js_1.runtime.decorBefore;
    if (d) {
        const owned = ((0, decor_model_js_1.decorItem)(runtime_js_1.runtime.decorPreview)?.qty || 0) > 0;
        bar.innerHTML = `<div><strong>試擺中 · ${(0, dom_js_1.esc)(d.name)}</strong><small>${owned ? '尚未儲存擺放。確認後才保留；不扣物品、XP 或幣。' : '展示預覽，尚未取得。不寫入存檔、不收費，也不算已擁有。'}</small></div><div class="row">${owned ? `<button class="primary" data-place-decor="${runtime_js_1.runtime.decorPreview}">確定擺放</button>` : `<button class="outline" data-decor-source="${runtime_js_1.runtime.decorPreview}">查看取得方式</button>`}<button class="outline" data-end-decor>取消試擺</button></div>`;
    }
    else if (runtime_js_1.runtime.decorBefore)
        bar.innerHTML = '<div><strong>佈置前對照</strong><small>只是暫時隱藏新增擺件；物品和進度沒有改變。</small></div><button class="outline" data-end-decor>回到目前房間</button>';
}
function decorPanel() { const n = Object.keys(runtime_js_1.runtime.state.roomDecor?.slots || {}).length; return `<div class="decor-intro"><div><span class="eyebrow">MAKE IT YOURS / 房間佈置</span><h2>不只是抽到，還能真正用上。</h2><p>這裡只展示初階已公開的五件擺件。試擺不收費；取得後才可保存。每件使用固定位置，不會壓到妳或德牧。</p></div><span class="decor-count">${n}<small> / 5</small></span></div><div class="decor-mode"><div><strong>房間與角色原圖不變</strong><p>新增的擺件可單獨收回。女主、守衛、日夜與其他任務保持原樣。</p></div><button class="outline" data-decor-before ${n ? '' : 'disabled'}>看佈置前</button></div><div class="decor-grid">${Object.entries(decor_model_js_1.DECOR_DEFS).map(([id, d]) => { const q = (0, decor_model_js_1.decorItem)(id)?.qty || 0, placed = (0, decor_model_js_1.decorPlaced)(id); return `<article class="decor-card ${placed ? 'placed' : ''}"><div class="decor-card-art"><img src="${art_js_1.ART[d.art]}" alt="${(0, dom_js_1.esc)(d.name)}" loading="lazy"></div><div><strong>${(0, dom_js_1.esc)(d.name)}</strong><small class="decor-place">${(0, dom_js_1.esc)(d.where)}</small><p>${(0, dom_js_1.esc)(d.copy)}</p><span class="decor-badge ${q ? '' : 'unowned'}">${placed ? '已擺放 · 1 件受保護' : q ? `已取得 ×${q}` : '尚未取得 · 可免費試擺'}</span></div><div class="decor-actions"><button class="outline" data-preview-decor="${id}">在房間試擺</button>${placed ? `<button class="primary" data-remove-decor="${id}">收回背包</button>` : q ? `<button class="primary" data-place-decor="${id}">擺進房間</button>` : `<button class="primary" data-decor-source="${id}">取得方式</button>`}</div></article>`; }).join('')}</div>${decorRoute()}<p class="muted small space">本版是小型擺件安置，不是自由拖曳大型家具；藍圖、髮飾和未完成佩戴素材不會冒充可裝備。安置或收回都不發獎勵。</p>`; }
function decorRoute() { const hasNotes = ((0, decor_model_js_1.decorItem)('core.decor.study-notes')?.qty || 0) > 0, placed = (0, decor_model_js_1.decorPlaced)('core.decor.study-notes'); return `<section class="decor-route"><span class="eyebrow">現實進度 → 房間裡的痕跡</span><h3>第一本研究手札</h3><p>完成一章妳實際在做的 TopHat，原本會獲得的「章節研究筆記」就能放上書桌。不新增一份任務，也不重複發獎。</p><div class="steps"><span>選定實際發布的章節</span><span class="${hasNotes ? 'ready' : ''}">完成章節 · 取得筆記</span><span class="${placed ? 'ready' : ''}">將筆記安置在書桌</span></div><div class="row"><button class="outline" data-panel="tophat">回到 TopHat 章節任務</button><button class="outline" data-panel="inventory">查看材料與既有兌換</button></div></section>`; }
function previewDecor(id) {
    if (!Object.hasOwn(decor_model_js_1.DECOR_DEFS, id))
        return;
    runtime_js_1.runtime.decorPreview = id;
    runtime_js_1.runtime.decorBefore = false;
    (0, ui_port_js_1.close)();
    renderDecor();
    (0, dom_js_1.$)('scene').scrollIntoView({ block: 'center', behavior: 'smooth' });
    if (innerWidth <= 640) {
        const d = decor_model_js_1.DECOR_DEFS[id], sc = (0, dom_js_1.$)('sceneScroll');
        sc.scrollTo({ left: (0, dom_js_1.$)('scene').clientWidth * d.x / 100 - sc.clientWidth / 2, behavior: 'smooth' });
    }
}
function placeDecor(id) {
    const d = decor_model_js_1.DECOR_DEFS[id];
    if (!d)
        return;
    if (!((0, decor_model_js_1.decorItem)(id)?.qty > 0))
        return (0, ui_port_js_1.toast)('尚未取得這件物品；只能試擺，沒有扣資源。');
    if ((0, decor_model_js_1.decorPlaced)(id)) {
        runtime_js_1.runtime.decorPreview = null;
        runtime_js_1.runtime.decorBefore = false;
        renderDecor();
        return (0, ui_port_js_1.toast)('這件已經在房間裡，不重複安置。');
    }
    if (!confirm(`將「${d.name}」放在${d.where}？\n不扣 XP、金幣或持有數；已擺放的這一件不可分解，收回後恢復可用。`))
        return;
    runtime_js_1.runtime.state.roomDecor.slots[d.slot] = id;
    (0, ledger_js_1.log)(`安置：${d.name} → ${d.where}（無額外費用）`);
    (0, storage_js_1.persist)();
    runtime_js_1.runtime.decorPreview = null;
    runtime_js_1.runtime.decorBefore = false;
    (0, ui_port_js_1.close)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.toast)('已安置並保存。這一次，房間真的多了一件妳的東西。');
}
function removeDecor(id) {
    const d = decor_model_js_1.DECOR_DEFS[id];
    if (!d || !(0, decor_model_js_1.decorPlaced)(id))
        return;
    if (!confirm(`將「${d.name}」收回？\n不減少收藏、不收費。`))
        return;
    delete runtime_js_1.runtime.state.roomDecor.slots[d.slot];
    (0, ledger_js_1.log)(`收回擺件：${d.name}（收藏數量不變）`);
    (0, storage_js_1.persist)();
    runtime_js_1.runtime.decorPreview = null;
    runtime_js_1.runtime.decorBefore = false;
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('decor');
    (0, ui_port_js_1.toast)('已收回；背包原有數量完整保留。');
}
function decorSource(id) {
    const d = decor_model_js_1.DECOR_DEFS[id];
    if (!d)
        return;
    runtime_js_1.runtime.decorPreview = null;
    runtime_js_1.runtime.decorBefore = false;
    renderDecor();
    if (id === 'core.decor.study-notes') {
        (0, ui_port_js_1.show)('tophat');
        (0, ui_port_js_1.toast)(d.source + '。安裝版本不會補發。');
    }
    else {
        runtime_js_1.runtime.bagTab = 'craft';
        (0, ui_port_js_1.show)('inventory');
        const el = [...document.querySelectorAll('[data-craft]')].find(x => x.dataset.craft === d.name);
        el?.scrollIntoView({ block: 'center' });
        (0, ui_port_js_1.toast)(d.source + '。不需要付費、不改原兌換價格。');
    }
}

},
"src/features/focus.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusText = focusText;
/** features/focus — extracted from verified 2.3.1; visual/gameplay parity first. */
const runtime_js_1 = require("src/core/runtime.js");
function focusText() {
    if (!runtime_js_1.runtime.focus)
        return '00:00';
    const left = Math.max(0, Math.ceil((runtime_js_1.runtime.focus.end - Date.now()) / 1000));
    return `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
}

},
"src/features/growth-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePerson = exports.pilatesRoutine = exports.PILATES_ID = exports.growthDefaults = exports.EXERCISE_TYPES = exports.CAREER_TYPES = exports.SKILL_STAGES = exports.SKILLS = void 0;
exports.validDay = validDay;
exports.validateGrowth = validateGrowth;
exports.ensureGrowthRoutine = ensureGrowthRoutine;
exports.careerSummary = careerSummary;
exports.skillSummary = skillSummary;
exports.skillPoints = skillPoints;
exports.weekStart = weekStart;
exports.daysAgo = daysAgo;
exports.exerciseSummary = exerciseSummary;
exports.wellbeingSummary = wellbeingSummary;
/** Evidence-based, self-reported progress. No inferred employment probability or medical score. */
exports.SKILLS = Object.freeze([
    { id: 'sql', name: 'SQL 查詢', hint: '查詢、JOIN、彙總與結果驗證' },
    { id: 'excel', name: 'Excel 建模', hint: '公式、樞紐分析、假設與敏感度' },
    { id: 'bi', name: 'BI 與視覺溝通', hint: 'Power BI / Tableau、指標與圖表敘事' },
    { id: 'python', name: 'Python 分析', hint: '資料整理、分析與可重跑的程式' },
    { id: 'planning', name: '供應鏈規劃', hint: '需求、MOQ、庫存、交期與成本取捨' },
    { id: 'process', name: '流程改善', hint: '問題定義、流程、改善方案與量測' },
    { id: 'coordination', name: '專案協調', hint: '排程、跨部門、風險與交付' },
    { id: 'communication', name: '英文／談判表達', hint: 'Coffee Chat、案例說明、面試與談判' }
]);
exports.SKILL_STAGES = ['未建立證據', '參考完成', '獨立完成', '應用與解釋', '可展示／有回饋'];
exports.CAREER_TYPES = { coffee: 'Coffee Chat', portfolio: '作品集成果', application: '正式投遞', interview: '面試', offer: '工作 Offer' };
exports.EXERCISE_TYPES = { pilates: '皮拉提斯', walk: '散步', strength: '肌力活動', stretch: '伸展', other: '其他運動' };
const growthDefaults = () => ({ version: 1, goal: { text: '2027 年 2 月前，取得美國心儀產業的工作機會', deadline: '2027-01-31', roles: 'Operations / Business Analytics / Supply Chain', industries: '遊戲、循環時尚、藝術', targets: { coffee: null, portfolio: null, application: null, interview: null, offer: null } }, records: [], evidence: [], exercise: [], pilatesWeeklyTarget: 1 });
exports.growthDefaults = growthDefaults;
exports.PILATES_ID = 'r-pilates';
const pilatesRoutine = () => ({ id: exports.PILATES_ID, title: '皮拉提斯 · 每週活動', course: 'life', repeat: 'weekly', xp: 0, coins: 0, action: 'exercise', enabled: true, detail: '起始排程每週 1 次，可在運動面板修改。依實際活動記錄；只記一次、不累積漏做欠債。' });
exports.pilatesRoutine = pilatesRoutine;
function validDay(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T12:00:00Z')) && new Date(s + 'T12:00:00Z').toISOString().slice(0, 10) === s; }
const normalizePerson = s => String(s || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
exports.normalizePerson = normalizePerson;
function text(v, label, max = 500) { if (typeof v !== 'string' || v.length > max)
    throw Error(label + ' 格式不正確'); }
function list(v, label) { if (!Array.isArray(v) || v.length > 10000)
    throw Error(label + ' 格式不正確'); const ids = new Set(); for (const r of v) {
    if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !r.id || r.id.length > 200 || ids.has(r.id))
        throw Error(label + ' 編號重複或無效');
    ids.add(r.id);
} }
function validateGrowth(s) {
    if (s.growth === undefined)
        s.growth = (0, exports.growthDefaults)();
    const g = s.growth;
    if (!g || g.version !== 1)
        throw Error('成長檔案版本不支援，保留原始存檔');
    if (!g.goal || !g.goal.targets)
        throw Error('目標資料缺少');
    for (const k of ['text', 'roles', 'industries'])
        text(g.goal[k], k, 1000);
    if (g.goal.deadline !== null && !validDay(g.goal.deadline))
        throw Error('目標日期不正確');
    for (const k of Object.keys(exports.CAREER_TYPES)) {
        const n = g.goal.targets[k];
        if (n !== null && (!Number.isSafeInteger(n) || n < 1 || n > 10000))
            throw Error('目標數量需是 1–10000，或留白');
    }
    if (!Number.isSafeInteger(g.pilatesWeeklyTarget) || g.pilatesWeeklyTarget < 1 || g.pilatesWeeklyTarget > 7)
        throw Error('每週排程請填 1–7 次');
    list(g.records, '求職紀錄');
    list(g.evidence, '技能證據');
    list(g.exercise, '運動紀錄');
    for (const r of g.records) {
        if (!Object.hasOwn(exports.CAREER_TYPES, r.kind) || !['planned', 'completed', 'cancelled'].includes(r.status) || !validDay(r.date))
            throw Error('求職紀錄格式不正確');
        text(r.title, '名稱', 200);
        text(r.note, '簡記', 1500);
        if (r.kind === 'coffee' && (typeof r.personKey !== 'string' || !r.personKey || r.personKey.length > 200))
            throw Error('Coffee Chat 需要對象代稱');
    }
    for (const e of g.evidence) {
        if (!exports.SKILLS.some(k => k.id === e.skill) || !Number.isInteger(e.stage) || e.stage < 1 || e.stage > 4 || !validDay(e.date))
            throw Error('技能證據格式不正確');
        text(e.title, '證據名稱', 200);
        text(e.note, '證據說明', 1500);
        if (!e.title.trim() || !e.note.trim())
            throw Error('技能階段需要證據說明');
    }
    for (const x of g.exercise) {
        if (!Object.hasOwn(exports.EXERCISE_TYPES, x.kind) || !validDay(x.date) || typeof x.session !== 'string' || x.session.length > 200)
            throw Error('運動紀錄格式不正確');
        if (x.minutes !== null && (!Number.isInteger(x.minutes) || x.minutes < 1 || x.minutes > 360))
            throw Error('時長請填 1–360 分鐘或留白');
        text(x.note, '活動簡記', 1000);
    }
    return s;
}
function ensureGrowthRoutine(s) { if (!s.routines.some(r => r.id === exports.PILATES_ID))
    s.routines.push((0, exports.pilatesRoutine)()); return s; }
function careerSummary(g, day) {
    const rows = g.records.filter(r => r.status === 'completed' && r.date <= day), coffee = rows.filter(r => r.kind === 'coffee');
    return { coffee: new Set(coffee.map(r => (0, exports.normalizePerson)(r.personKey))).size, coffeeSessions: coffee.length, portfolio: rows.filter(r => r.kind === 'portfolio').length, application: rows.filter(r => r.kind === 'application').length, interview: rows.filter(r => r.kind === 'interview').length, offer: rows.filter(r => r.kind === 'offer').length, planned: g.records.filter(r => r.status === 'planned').length };
}
function skillSummary(g, day) { return exports.SKILLS.map(k => { const evidence = g.evidence.filter(e => e.skill === k.id && e.date <= day); return { ...k, evidence, stage: Math.max(0, ...evidence.map(e => e.stage)) }; }); }
function skillPoints(g, day) { return skillSummary(g, day).reduce((n, k) => n + k.stage, 0); }
function weekStart(day) { const d = new Date(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); }
function daysAgo(day, n) { const d = new Date(day + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); }
function exerciseSummary(g, day) { const week = g.exercise.filter(x => x.date >= weekStart(day) && x.date <= day); return { count: week.length, pilates: week.filter(x => x.kind === 'pilates').length, minutes: week.reduce((n, x) => n + (x.minutes ?? 0), 0), missingMinutes: week.filter(x => x.minutes === null).length, records: week }; }
function wellbeingSummary(state, day) {
    const records = (state.health || []).filter(h => h.date >= daysAgo(day, 6) && h.date <= day), todayRecord = records.find(h => h.date === day) || null;
    const sleep = records.filter(h => typeof h.hours === 'number' && Number.isFinite(h.hours));
    return { todayRecord, sleepCount: sleep.length, averageSleep: sleep.length ? sleep.reduce((n, h) => n + h.hours, 0) / sleep.length : null, exercise: exerciseSummary(state.growth, day), days: Array.from({ length: 7 }, (_, i) => { const date = daysAgo(day, 6 - i), h = records.find(x => x.date === date); return { date, skin: h?.skin || null, skinRating: h?.skinRating ?? null, comfort: h?.comfortRating ?? null, hours: h?.hours ?? null, exercise: state.growth.exercise.filter(x => x.date === date).length }; }) };
}

},
"src/features/growth.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openGrowthForm = openGrowthForm;
exports.saveGoal = saveGoal;
exports.saveCareerRecord = saveCareerRecord;
exports.saveSkillEvidence = saveSkillEvidence;
exports.saveExercise = saveExercise;
exports.savePilatesGoal = savePilatesGoal;
exports.deleteGrowthRecord = deleteGrowthRecord;
exports.renderGrowthMini = renderGrowthMini;
/** One persistent growth record = one explicit user report. No XP or coin mutation. */
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const clock_js_1 = require("src/core/clock.js");
const utils_js_1 = require("src/core/utils.js");
const ledger_js_1 = require("src/core/ledger.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const growth_model_js_1 = require("src/features/growth-model.js");
const dom_js_1 = require("src/ui/dom.js");
const value = (f, k) => String(f.get(k) || '').trim();
function requirePast(date) { if (!(0, growth_model_js_1.validDay)(date) || date > (0, clock_js_1.today)())
    throw Error('完成日期須為今天或以前（洛杉磯日期）'); }
function openGrowthForm(kind, id = null) { runtime_js_1.runtime.growthEditing = id; (0, ui_port_js_1.show)(kind); }
function saveGoal(fd) {
    try {
        const g = runtime_js_1.runtime.state.growth.goal, t = value(fd, 'text');
        if (!t || t.length > 1000)
            throw Error('請填目標說明');
        const deadline = value(fd, 'deadline') || null;
        if (deadline && !(0, growth_model_js_1.validDay)(deadline))
            throw Error('日期無效');
        const targets = {};
        for (const k of Object.keys(growth_model_js_1.CAREER_TYPES)) {
            const raw = value(fd, 'target_' + k), n = raw === '' ? null : Number(raw);
            if (n !== null && (!Number.isInteger(n) || n < 1 || n > 10000))
                throw Error('目標次數填正整數，或留白');
            targets[k] = n;
        }
        runtime_js_1.runtime.state.growth.goal = { ...g, text: t, deadline, roles: value(fd, 'roles').slice(0, 1000), industries: value(fd, 'industries').slice(0, 1000), targets };
        (0, ledger_js_1.log)('更新個人成長目標，不修改獎勵');
        (0, storage_js_1.persist)();
        (0, ui_port_js_1.render)();
        (0, ui_port_js_1.show)('profile');
        (0, ui_port_js_1.toast)('目標已保存');
    }
    catch (e) {
        if (e.name === 'SaveStopped')
            throw e;
        (0, ui_port_js_1.toast)(e.message);
    }
}
function saveCareerRecord(fd) {
    try {
        const kind = value(fd, 'kind'), date = value(fd, 'date'), status = value(fd, 'status'), title = value(fd, 'title'), note = value(fd, 'note');
        if (!Object.hasOwn(growth_model_js_1.CAREER_TYPES, kind) || !['planned', 'completed', 'cancelled'].includes(status) || !(0, growth_model_js_1.validDay)(date) || !title || title.length > 200 || note.length > 1500)
            throw Error('請填有效類型、日期及名稱');
        if (status === 'completed')
            requirePast(date);
        const rows = runtime_js_1.runtime.state.growth.records, id = value(fd, 'recordId'), old = id ? rows.find(x => x.id === id) : null;
        if (id && !old)
            throw Error('原紀錄不存在，請重新開啟');
        const personKey = kind === 'coffee' ? (0, growth_model_js_1.normalizePerson)(title) : '';
        if (rows.some(x => x.id !== id && x.kind === kind && x.date === date && (0, growth_model_js_1.normalizePerson)(x.title) === (0, growth_model_js_1.normalizePerson)(title)))
            throw Error('同一天、同一對象／成果已登記，請修改原紀錄');
        const rec = { ...(old || {}), id: old?.id || (0, utils_js_1.uid)(), kind, date, status, title, note, personKey, updatedAt: (0, clock_js_1.stamp)() };
        if (old)
            Object.assign(old, rec);
        else
            rows.push(rec);
        (0, ledger_js_1.log)('保存 ' + growth_model_js_1.CAREER_TYPES[kind] + ' 紀錄（不重複發 XP）');
        (0, storage_js_1.persist)();
        runtime_js_1.runtime.growthEditing = null;
        (0, ui_port_js_1.render)();
        (0, ui_port_js_1.show)('profile');
        (0, ui_port_js_1.toast)('已登記；僅完成的會列入累計');
    }
    catch (e) {
        if (e.name === 'SaveStopped')
            throw e;
        (0, ui_port_js_1.toast)(e.message);
    }
}
function saveSkillEvidence(fd) { try {
    const skill = value(fd, 'skill'), stage = Number(fd.get('stage')), date = value(fd, 'date'), title = value(fd, 'title'), note = value(fd, 'note');
    requirePast(date);
    if (!growth_model_js_1.SKILLS.some(k => k.id === skill) || !Number.isInteger(stage) || stage < 1 || stage > 4 || !title || !note || title.length > 200 || note.length > 1500)
        throw Error('請填技能、階段、證據名稱及說明');
    const rows = runtime_js_1.runtime.state.growth.evidence, id = value(fd, 'recordId'), old = id ? rows.find(x => x.id === id) : null;
    if (id && !old)
        throw Error('原證據不存在');
    if (rows.some(x => x.id !== id && x.skill === skill && (0, growth_model_js_1.normalizePerson)(x.title) === (0, growth_model_js_1.normalizePerson)(title)))
        throw Error('同一技能的這份證據已存在，請編輯原紀錄');
    const e = { ...(old || {}), id: old?.id || (0, utils_js_1.uid)(), skill, stage, date, title, note, updatedAt: (0, clock_js_1.stamp)() };
    if (old)
        Object.assign(old, e);
    else
        rows.push(e);
    (0, ledger_js_1.log)('保存技能證據：' + title + '（自評，非認證）');
    (0, storage_js_1.persist)();
    runtime_js_1.runtime.growthEditing = null;
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('profile');
    (0, ui_port_js_1.toast)('技能刻度已依證據更新；重複練習不疊加同一階段');
}
catch (e) {
    if (e.name === 'SaveStopped')
        throw e;
    (0, ui_port_js_1.toast)(e.message);
} }
function saveExercise(fd) { try {
    const kind = value(fd, 'kind'), date = value(fd, 'date'), session = value(fd, 'session') || '當日一次活動', raw = value(fd, 'minutes'), minutes = raw === '' ? null : Number(raw), note = value(fd, 'note');
    requirePast(date);
    if (!Object.hasOwn(growth_model_js_1.EXERCISE_TYPES, kind) || session.length > 200 || note.length > 1000 || minutes !== null && (!Number.isInteger(minutes) || minutes < 1 || minutes > 360))
        throw Error('請確認活動內容與實際時長；不清楚可留白');
    const rows = runtime_js_1.runtime.state.growth.exercise, id = value(fd, 'recordId'), old = id ? rows.find(x => x.id === id) : null;
    if (id && !old)
        throw Error('原紀錄不存在');
    if (rows.some(x => x.id !== id && x.kind === kind && x.date === date && (0, growth_model_js_1.normalizePerson)(x.session) === (0, growth_model_js_1.normalizePerson)(session)))
        throw Error('這次活動已記過，不重複累計；可編輯原紀錄');
    const r = { ...(old || {}), id: old?.id || (0, utils_js_1.uid)(), kind, date, session, minutes, note, updatedAt: (0, clock_js_1.stamp)() };
    if (old)
        Object.assign(old, r);
    else
        rows.push(r);
    (0, ledger_js_1.log)('登記 ' + growth_model_js_1.EXERCISE_TYPES[kind] + '（活動同步遊戲氣色，不作健康評分）');
    (0, storage_js_1.persist)();
    runtime_js_1.runtime.growthEditing = null;
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('exercise');
    (0, ui_port_js_1.toast)('活動已保存，每週皮拉提斯同步更新一次');
}
catch (e) {
    if (e.name === 'SaveStopped')
        throw e;
    (0, ui_port_js_1.toast)(e.message);
} }
function savePilatesGoal(fd) { const n = Number(fd.get('target')); if (!Number.isInteger(n) || n < 1 || n > 7)
    return (0, ui_port_js_1.toast)('每週排程填 1–7 次'); runtime_js_1.runtime.state.growth.pilatesWeeklyTarget = n; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('exercise'); (0, ui_port_js_1.toast)('只更新之後的週目標，不清除活動紀錄'); }
function deleteGrowthRecord(type, id) { const map = { career: 'records', skill: 'evidence', exercise: 'exercise' }, key = map[type], rows = runtime_js_1.runtime.state.growth[key]; if (!rows)
    return; const i = rows.findIndex(x => x.id === id); if (i < 0)
    return; if (!confirm('刪除這筆登記？對應累計／自評刻度會重新計算，XP、生存幣、原任務不變。'))
    return; rows.splice(i, 1); (0, ledger_js_1.log)('刪除一筆個人成長登記（未更動獎勵）'); (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)(type === 'exercise' ? 'exercise' : 'profile'); }
function renderGrowthMini() { const el = (0, dom_js_1.$)('growthMini'); if (el) {
    el.hidden = true;
    el.textContent = '';
} }

},
"src/features/health.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveHealthObservation = saveHealthObservation;
/** User-reported observation only. No economic reward or medical assessment. */
const clock_js_1 = require("src/core/clock.js");
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const appearance_model_js_1 = require("src/features/appearance-model.js");
const appearance_js_1 = require("src/features/appearance.js");
function saveHealthObservation(fd) {
    if (fd.get('recordDate') && fd.get('recordDate') !== (0, clock_js_1.today)()) {
        (0, ui_port_js_1.show)('health');
        return (0, ui_port_js_1.toast)('洛杉磯日期已變更；舊表單沒有存入新的一天。請確認今天的回報再儲存。');
    }
    let h;
    try {
        h = (0, appearance_model_js_1.readObservation)(fd, (0, clock_js_1.today)(), (0, clock_js_1.stamp)(), runtime_js_1.runtime.state.health.find(x => x.date === (0, clock_js_1.today)()) || {});
    }
    catch (e) {
        return (0, ui_port_js_1.toast)(e.message);
    }
    runtime_js_1.runtime.state.health = runtime_js_1.runtime.state.health.filter(x => x.date !== (0, clock_js_1.today)());
    runtime_js_1.runtime.state.health.unshift(h);
    runtime_js_1.runtime.state.comfort.mode = 'reported';
    (0, ledger_js_1.log)('保存今日休整回報；只更新人物狀態，不增減獎勵。');
    (0, storage_js_1.persist)();
    (0, appearance_js_1.clearAppearancePreview)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('health');
    (0, ui_port_js_1.toast)('已保存本人回報並切換回報模式；五官、狗狗與帳本不變。');
}

},
"src/features/inventory-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATALOG = exports.BAG_PAGE_SIZE = void 0;
exports.itemMeta = itemMeta;
exports.bagGroup = bagGroup;
exports.addItem = addItem;
/** features/inventory-model — extracted from verified 2.3.1; visual/gameplay parity first. */
const runtime_js_1 = require("src/core/runtime.js");
const decor_model_js_1 = require("src/features/decor-model.js");
exports.BAG_PAGE_SIZE = 20;
exports.CATALOG = {
    '修復木板': { art: 'wood', type: '材料', rarity: 'N', desc: '修補用木料；目前可收藏或回收成維修零件。', yield: 1 },
    '備用螺絲': { art: 'bolt', type: '材料', rarity: 'N', desc: '小零件不是空白名字。回收後仍保有材料用途。', yield: 1 },
    '修復材料': { art: 'parts', type: '材料', rarity: 'N', desc: '每日補給獲得的通用材料。', yield: 1 },
    '維修零件': { art: 'parts', type: '材料', rarity: 'N', desc: '分解所得；可定向兌換當前已公開的小收藏。', yield: 0 },
    '知識碎片': { art: 'book', type: '材料', rarity: 'N', desc: '歷史學習紀錄對應的收藏材料。', yield: 0 },
    '晨間補給包': { art: 'supply', type: '補給', rarity: 'R', desc: '可拆封的既有補給包。開啟 1 包保證取得修復材料 ×2、維修零件 ×1；不加 XP 或生存幣。可鎖定保留。', yield: 0, supply: true },
    '初始生存服': { art: 'item-jacket', type: '外觀', rarity: 'R', desc: '起始外觀收藏。此縮圖為服裝意象，不取代定稿人物立繪。', yield: 0 },
    '章節研究筆記': { art: 'item-journal', type: '材料', rarity: 'R', desc: '完成 TopHat 章節後的研究筆記，可安置在書桌；不代表學業分數。', yield: 2 },
    '琥珀咖啡豆壁燈藍圖': { art: 'item-lantern', type: '家具藍圖', rarity: 'R', desc: '暖光燈具藍圖的概念意象。房間安裝圖尚未啟用；不扣安裝費。', yield: 3, blueprint: true },
    '編織狗墊藍圖': { art: 'item-mat', type: '家具藍圖', rarity: 'R', desc: '守衛的軟墊藍圖。收藏可見；還不是新的狗狗姿勢。', yield: 3, blueprint: true },
    '星霧髮飾': { art: 'item-starclip', type: '外觀', rarity: 'SR', desc: '冷銀星芒與細墜鏈。已接入物品圖；佩戴圖層未完成，不更換妳的臉。', yield: 6 },
    '青玉墜飾': { art: 'jade', type: '外觀', rarity: 'SR', desc: '青玉色小墜飾；目前以材質圖示呈現，收藏不附加健康效果。', yield: 6 },
    '灰白貓咪抱枕': { art: 'item-pillow', type: '收藏', rarity: 'R', desc: '過去素材裡的抱枕。可定向兌換並放在床頭，不會變成基地的新寵物。', yield: 2, cost: 6 },
    '手沖杯組': { art: 'item-dripper', type: '收藏', rarity: 'R', desc: '杯子與濾杯成套收納。可安置在料理台；不鼓勵為刷經驗多喝一杯。', yield: 2, cost: 6 },
    '舊城提燈': { art: 'item-lantern', type: '收藏', rarity: 'R', desc: '玻璃罩裡的一盞暖燈。可安置在門邊矮櫃；夜間有小範圍暖光。', yield: 2, cost: 6 },
    '植物小盆栽': { art: 'item-plant', type: '收藏', rarity: 'R', desc: '可安置在窗邊掛鉤，不改變房間或狗狗外觀。', yield: 2, cost: 6 }
};
function itemMeta(name) { return exports.CATALOG[name] || { art: 'bag', type: '收藏', rarity: '?', desc: '舊存檔中的物品，尚未匹配獨立素材；保留原名、數量，不冒充已完成美術。', yield: 0 }; }
function bagGroup(x) {
    const m = itemMeta(x.name);
    if (m.blueprint || (0, decor_model_js_1.decorForName)(x.name))
        return 'furniture';
    if (m.type === '外觀' || x.type === '外觀' || x.type === '時裝')
        return 'gear';
    if (m.type === '材料' || x.type === '材料')
        return 'materials';
    if (x.type === '補給' || x.type === '消耗品')
        return 'supplies';
    return 'other';
}
function addItem(name, type = '材料', qty = 1) {
    let item = runtime_js_1.runtime.state.items.find(x => x.name === name && x.type === type);
    if (item)
        item.qty += qty;
    else
        runtime_js_1.runtime.state.items.push({ name, type, qty });
}

},
"src/features/inventory.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemImage = itemImage;
exports.bagItems = bagItems;
exports.bagInspect = bagInspect;
exports.inventoryPanel = inventoryPanel;
exports.selectBagItem = selectBagItem;
exports.itemPanel = itemPanel;
exports.salvageItem = salvageItem;
exports.craftItem = craftItem;
exports.draw = draw;
/** features/inventory — extracted from verified 2.3.1; visual/gameplay parity first. */
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const art_js_1 = require("src/data/art.js");
const decor_model_js_1 = require("src/features/decor-model.js");
const inventory_model_js_1 = require("src/features/inventory-model.js");
const dom_js_1 = require("src/ui/dom.js");
function itemImage(name, large = false) {
    const m = (0, inventory_model_js_1.itemMeta)(name), src = art_js_1.ART[m.art];
    if (m.supply)
        return `<span class="supply-art ${large ? 'large' : ''}" role="img" aria-label="晨間補給包">${(0, dom_js_1.icon)('gift')}<small>晨間補給</small></span>`;
    if (src)
        return `<img class="item-art ${large ? 'large' : ''}" src="${src}" alt="${(0, dom_js_1.esc)(name)}${m.blueprint ? '藍圖意象' : ''}" loading="lazy" decoding="async">`;
    const symbols = { wood: '▱', bolt: '⚙', parts: '⚒', jade: '◈', book: '▤', bag: '▣' };
    return `<span class="material-art ${m.art} ${large ? 'large' : ''}" role="img" aria-label="${(0, dom_js_1.esc)(name)}材料圖示">${symbols[m.art] || '▣'}</span>`;
}
function bagItems() { const ranks = { SSR: 4, SR: 3, R: 2, N: 1, '?': 0 }; return runtime_js_1.runtime.state.items.filter(x => x.qty > 0 && (runtime_js_1.runtime.bagFilter === 'all' || (0, inventory_model_js_1.bagGroup)(x) === runtime_js_1.runtime.bagFilter)).slice().sort((a, b) => runtime_js_1.runtime.bagSort === 'quantity' ? b.qty - a.qty || a.name.localeCompare(b.name, 'zh-Hant') : runtime_js_1.runtime.bagSort === 'name' ? a.name.localeCompare(b.name, 'zh-Hant') : (ranks[(0, inventory_model_js_1.itemMeta)(b.name).rarity] || 0) - (ranks[(0, inventory_model_js_1.itemMeta)(a.name).rarity] || 0) || a.name.localeCompare(b.name, 'zh-Hant')); }
function bagInspect(name) {
    const x = runtime_js_1.runtime.state.items.find(x => x.name === name && x.qty > 0);
    if (!x)
        return `<div class="empty-inspector">${(0, dom_js_1.icon)('bag')}點選左側物品格，查看用途與操作。<br>這裡只列出妳實際持有的物品。</div>`;
    const m = (0, inventory_model_js_1.itemMeta)(x.name), d = (0, decor_model_js_1.decorForName)(x.name), placed = !!(d && (0, decor_model_js_1.decorPlaced)(d[0])), locked = !!runtime_js_1.runtime.state.inventoryLocks[x.name], reserved = placed ? 1 : 0, canSalvage = !!m.yield && !locked && x.qty > reserved;
    return `<div class="inspect-art">${itemImage(x.name, true)}<span class="inspect-rarity">${(0, dom_js_1.esc)(m.rarity)} / ${m.rarity === 'SR' ? '稀有' : m.rarity === 'SSR' ? '傳說' : m.rarity === 'N' ? '普通' : '收藏'}</span></div><div class="inspect-content"><span class="item-type">${(0, dom_js_1.esc)(m.type)}${m.blueprint ? ' · 圖紙' : ''}</span><h3>${(0, dom_js_1.esc)(x.name)}</h3><p class="item-description">${(0, dom_js_1.esc)(m.desc)}</p><div class="inspect-facts"><div><span>持有數量</span><b>× ${x.qty}</b></div><div><span>使用狀態</span><b>${placed ? '已安置 1 件' : locked ? '收藏已鎖定' : '留在背包'}</b></div><div><span>回收所得 / 件</span><b>${m.yield ? '維修零件 ×' + m.yield : '不可分解'}</b></div>${reserved ? '<div><span>可回收重複品</span><b>× ' + Math.max(0, x.qty - reserved) + '</b></div>' : ''}</div><div class="inspect-actions">${m.supply ? `<button class="primary" data-supply-preview="${(0, dom_js_1.esc)(x.name)}" ${locked ? 'disabled' : ''}>${(0, dom_js_1.icon)('gift')}查看內容／開啟 1 包</button>` : ''}${d ? `<button class="primary" ${placed ? `data-bag-remove="${d[0]}"` : `data-bag-place="${d[0]}"`}>${(0, dom_js_1.icon)('layers')}${placed ? '收回擺件 · 免費' : '安置到房間'}</button>` : ''}<button data-bag-lock="${(0, dom_js_1.esc)(x.name)}">${(0, dom_js_1.icon)('lock')}${locked ? '解除鎖定' : '鎖定'}</button><button class="danger-light" data-salvage="${(0, dom_js_1.esc)(x.name)}" ${canSalvage ? '' : 'disabled'}>${(0, dom_js_1.icon)('hammer')}分解 1 件</button></div><p class="inspect-hint">${m.supply ? '預覽不扣物品，確認後才消耗 1 包；開包不需要探索券。' : d ? '安置不減持有數；已安置的一件不會被分解。' : m.blueprint ? '此件是收藏藍圖，尚未開放對應建造，不會收取施工費。' : (0, inventory_model_js_1.bagGroup)(x) === 'gear' ? '目前是外觀收藏，穿戴素材未完成，不會改變妳的臉或造型。' : !m.yield ? '起始、紀念或核心物品受保護；不提供虛假的「使用」按鈕。' : '分解前會確認所得；最後一件另有提醒。'}${canSalvage && x.qty === 1 ? ' 這是最後一件，分解後會離開背包。' : ''}</p></div>`;
}
function inventoryPanel() {
    const owned = runtime_js_1.runtime.state.items.filter(x => x.qty > 0), total = owned.reduce((s, x) => s + x.qty, 0), all = bagItems(), pages = Math.max(1, Math.ceil(all.length / inventory_model_js_1.BAG_PAGE_SIZE));
    runtime_js_1.runtime.bagPage = Math.min(runtime_js_1.runtime.bagPage, pages - 1);
    const visible = all.slice(runtime_js_1.runtime.bagPage * inventory_model_js_1.BAG_PAGE_SIZE, (runtime_js_1.runtime.bagPage + 1) * inventory_model_js_1.BAG_PAGE_SIZE);
    if (!all.some(x => x.name === runtime_js_1.runtime.bagSelected))
        runtime_js_1.runtime.bagSelected = visible[0]?.name || null;
    const current = visible.some(x => x.name === runtime_js_1.runtime.bagSelected) ? runtime_js_1.runtime.bagSelected : visible[0]?.name || null;
    runtime_js_1.runtime.bagSelected = current;
    const partsQty = owned.filter(x => x.name === '維修零件').reduce((s, x) => s + x.qty, 0);
    let content = '';
    if (runtime_js_1.runtime.bagTab === 'items')
        content = `<div class="pack-toolbar"><div class="pack-filters" role="group" aria-label="背包分類">${[['all', '全部'], ['materials', '材料'], ['furniture', '家具'], ['gear', '裝備'], ['supplies', '補給'], ['other', '其他']].map(([k, v]) => `<button data-bag-filter="${k}" aria-pressed="${runtime_js_1.runtime.bagFilter === k}">${v}</button>`).join('')}</div><label class="pack-sort"><select id="bagSort" aria-label="背包排序">${[['rarity', '稀有度優先'], ['quantity', '數量優先'], ['name', '名稱排序']].map(([k, v]) => `<option value="${k}" ${runtime_js_1.runtime.bagSort === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div><div class="pack-layout"><div class="pack-compartment"><div class="pack-grid ${visible.length ? '' : 'empty'}" aria-label="已持有物品">${visible.map(x => { const m = (0, inventory_model_js_1.itemMeta)(x.name), placed = (0, decor_model_js_1.decorForName)(x.name) && (0, decor_model_js_1.decorPlaced)((0, decor_model_js_1.decorForName)(x.name)[0]); return `<button class="pack-slot rarity-${m.rarity.toLowerCase()} ${runtime_js_1.runtime.bagSelected === x.name ? 'selected' : ''}" data-bag-select="${(0, dom_js_1.esc)(x.name)}" aria-label="${(0, dom_js_1.esc)(x.name)}，${x.qty} 件${placed ? '，已安置' : ''}${runtime_js_1.runtime.state.inventoryLocks[x.name] ? '，已鎖定' : ''}" aria-pressed="${runtime_js_1.runtime.bagSelected === x.name}" aria-controls="bagInspector"><span class="slot-rarity">${(0, dom_js_1.esc)(m.rarity)}</span>${runtime_js_1.runtime.state.inventoryLocks[x.name] ? `<span class="slot-lock">${(0, dom_js_1.icon)('lock')}</span>` : ''}${itemImage(x.name)}<span class="slot-qty">×${x.qty}</span>${placed ? '<span class="slot-placed">安置中</span>' : ''}<span class="slot-name">${(0, dom_js_1.esc)(x.name)}</span></button>`; }).join('')}${Array.from({ length: Math.max(0, Math.max(10, Math.ceil(visible.length / 5) * 5) - visible.length) }, () => '<div class="pack-empty-slot" aria-hidden="true">＋</div>').join('')}</div>${!visible.length ? '<p class="pack-empty-text">這個分類還沒有物品。<br>沒有用未取得物品填滿背包；可到補給箱或回收工坊查看已公開的取得方式。</p>' : ''}<div class="pack-grid-meta"><span>${owned.length} 種 / 共 ${total} 件 · 不設容量上限</span>${pages > 1 ? `<div><button data-bag-page="${runtime_js_1.runtime.bagPage - 1}" ${runtime_js_1.runtime.bagPage === 0 ? 'disabled' : ''} aria-label="上一頁">‹</button> ${runtime_js_1.runtime.bagPage + 1} / ${pages} <button data-bag-page="${runtime_js_1.runtime.bagPage + 1}" ${runtime_js_1.runtime.bagPage === pages - 1 ? 'disabled' : ''} aria-label="下一頁">›</button></div>` : ''}</div><p class="pack-grid-note">空格只是視覺分隔，不是需要花錢解鎖的欄位。</p></div><section class="pack-inspector" id="bagInspector" aria-label="物品詳情">${bagInspect(current)}</section></div>`;
    if (runtime_js_1.runtime.bagTab === 'draw')
        content = `<div class="loot-box"><div>${(0, dom_js_1.icon)('gift')}<strong>探索補給箱</strong><p>材料 55% · 家具藍圖 30% · 外觀 15%<br>連續七次未得外觀，第八次保底；沿用原規則。</p><small>已探索 ${runtime_js_1.runtime.state.draws} 次 · 距外觀保底最多 ${8 - runtime_js_1.runtime.state.pity} 次</small></div><button class="primary" id="draw" ${runtime_js_1.runtime.state.tickets < 1 ? 'disabled' : ''}>探索券 ×1 · 開啟</button></div>${runtime_js_1.runtime.drawResult ? `<div class="draw-reveal">${itemImage(runtime_js_1.runtime.drawResult, true)}<div><span class="eyebrow">本次取得 · 已存檔</span><h3>${(0, dom_js_1.esc)(runtime_js_1.runtime.drawResult)}</h3><button class="primary" data-bag-reveal="${(0, dom_js_1.esc)(runtime_js_1.runtime.drawResult)}">在背包查看 →</button></div></div>` : '<p class="pack-notice">抽到的物品會放進背包。沒有抽獎券時不會扣生存幣，也不會呼叫付費 AI。</p>'}`;
    if (runtime_js_1.runtime.bagTab === 'craft')
        content = `<div class="pack-notice">持有維修零件 <b>${partsQty}</b> 個。此處只兌換已公開的小擺件；分解單件的操作在背包詳情裡。價格和回收數量未調整。</div><div class="craft-grid">${Object.entries(inventory_model_js_1.CATALOG).filter(([n, m]) => m.cost).map(([n, m]) => `<div class="craft-card">${itemImage(n)}<div><strong>${(0, dom_js_1.esc)(n)}</strong><small>維修零件 ×${m.cost} · 目前持有 ${owned.find(x => x.name === n)?.qty || 0}</small><button class="outline" data-craft="${(0, dom_js_1.esc)(n)}" ${partsQty < m.cost ? 'disabled' : ''}>${partsQty < m.cost ? '零件不足' : '兌換'}</button></div></div>`).join('')}</div>`;
    return `<div class="pack-top"><div class="pack-id"><span class="pack-emblem">${(0, dom_js_1.icon)('bag')}</span><div><span class="eyebrow">RESIDENT 188 / PERSONAL PACK</span><h3>Lydia 的行囊</h3><p>${owned.length} 種物品 · ${total} 件隨身收藏</p></div></div><div class="pack-currency"><span>${(0, dom_js_1.icon)('coin')}<b>${runtime_js_1.runtime.state.coins}</b><small>生存幣</small></span><span>${(0, dom_js_1.icon)('ticket')}<b>${runtime_js_1.runtime.state.tickets}</b><small>券</small></span></div></div><div class="pack-sections" role="tablist" aria-label="背包功能">${[['items', 'bag', '背包'], ['draw', 'gift', '補給抽獎'], ['craft', 'hammer', '回收兌換']].map(([k, ic, v]) => `<button role="tab" data-bag-tab="${k}" aria-selected="${runtime_js_1.runtime.bagTab === k}">${(0, dom_js_1.icon)(ic)}${v}</button>`).join('')}</div><div class="pack-content">${content}</div>`;
}
function selectBagItem(name) {
    runtime_js_1.runtime.bagSelected = name;
    document.querySelectorAll('[data-bag-select]').forEach(b => { const on = b.dataset.bagSelect === name; b.classList.toggle('selected', on); b.setAttribute('aria-pressed', String(on)); });
    (0, dom_js_1.$)('bagInspector').innerHTML = bagInspect(name);
    if (innerWidth <= 720)
        (0, dom_js_1.$)('bagInspector').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function itemPanel(name) {
    const x = runtime_js_1.runtime.state.items.find(x => x.name === name), m = (0, inventory_model_js_1.itemMeta)(name);
    if (!x || x.qty < 1)
        return '<p class="empty">這件物品不在背包。</p>';
    return `<div class="item-detail">${itemImage(name, true)}<div><span class="tag">${m.rarity} · ${(0, dom_js_1.esc)(x.type)}</span><h2>${(0, dom_js_1.esc)(name)}</h2><p>${(0, dom_js_1.esc)(m.desc)}</p><p>持有：${x.qty} 件</p>${(0, decor_model_js_1.decorForName)(name) && (0, decor_model_js_1.decorPlaced)((0, decor_model_js_1.decorForName)(name)[0]) ? '<p class="item-installed">已安置 1 件 · 這一件暫不可分解</p>' : ''}<div class="note">${m.yield ? `分解 1 件 → 維修零件 ×${m.yield}。不返還抽獎券或 XP。` : '起始、紀念、核心材料或未辨識物件受到保護，不開放分解。'}</div><div class="row space">${m.supply ? `<button class="primary" data-supply-preview="${(0, dom_js_1.esc)(name)}" ${runtime_js_1.runtime.state.inventoryLocks[name] ? 'disabled' : ''}>查看內容／開啟 1 包</button>` : ''}<button class="outline" data-lock-item="${(0, dom_js_1.esc)(name)}">${runtime_js_1.runtime.state.inventoryLocks[name] ? '解除收藏鎖定' : '鎖定收藏'}</button><button class="outline" data-salvage="${(0, dom_js_1.esc)(name)}" ${!m.yield || runtime_js_1.runtime.state.inventoryLocks[name] || ((0, decor_model_js_1.decorForName)(name) && (0, decor_model_js_1.decorPlaced)((0, decor_model_js_1.decorForName)(name)[0]) && x.qty <= 1) ? 'disabled' : ''}>分解 1 件</button><button class="link" data-panel="inventory">回背包</button></div>${(0, decor_model_js_1.decorForName)(name) ? `<div class="decor-detail-actions"><button class="primary" data-panel="decor">${(0, decor_model_js_1.decorPlaced)((0, decor_model_js_1.decorForName)(name)[0]) ? '管理已安置擺件' : '放進自己的房間'}</button><p class="muted small">安置不減收藏數，收回免費；已安置的一件受到分解保護。</p></div>` : '<p class="muted small space">此件暫為收藏圖或材料；不是所有家具藍圖／衣服都已有安裝素材。</p>'}</div></div>`;
}
function salvageItem(name) {
    const x = runtime_js_1.runtime.state.items.find(x => x.name === name), m = (0, inventory_model_js_1.itemMeta)(name);
    const dd = (0, decor_model_js_1.decorForName)(name), reserved = dd && (0, decor_model_js_1.decorPlaced)(dd[0]) ? 1 : 0;
    if (!x || x.qty <= reserved || !m.yield || runtime_js_1.runtime.state.inventoryLocks[name])
        return (0, ui_port_js_1.toast)('此物品已安置、受保護或已鎖定；請先收回。');
    if (!confirm(`分解「${name}」1 件？\n獲得維修零件 ×${m.yield}。${x.qty === 1 ? '\n這是最後一件，確定後物品將離開背包。' : ''}\n不可撤回。`))
        return;
    x.qty--;
    (0, inventory_model_js_1.addItem)('維修零件', '材料', m.yield);
    (0, ledger_js_1.log)(`回收：${name} ×1 → 維修零件 ×${m.yield}`);
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('inventory');
    (0, ui_port_js_1.toast)('回收已完成，幣與 XP 沒有改變。');
}
function craftItem(name) {
    const m = inventory_model_js_1.CATALOG[name], x = runtime_js_1.runtime.state.items.find(x => x.name === '維修零件');
    if (!m?.cost || !x || x.qty < m.cost)
        return (0, ui_port_js_1.toast)('維修零件不足；沒有扣除任何資源。');
    if (!confirm(`消耗 ${m.cost} 個維修零件，兌換「${name}」？`))
        return;
    x.qty -= m.cost;
    (0, inventory_model_js_1.addItem)(name, m.type, 1);
    (0, ledger_js_1.log)(`定向兌換：${name}，維修零件 −${m.cost}`);
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('inventory');
    (0, ui_port_js_1.toast)('收藏已加入背包。');
}
function draw() {
    if (runtime_js_1.runtime.state.tickets < 1)
        return;
    let r;
    if (globalThis.crypto?.getRandomValues) {
        const a = new Uint32Array(1);
        crypto.getRandomValues(a);
        r = a[0] / 4294967296;
    }
    else
        r = Math.random();
    let type, name;
    if (runtime_js_1.runtime.state.pity >= 7 || r >= .85) {
        type = '外觀';
        name = r > .94 ? '星霧髮飾' : '青玉墜飾';
        runtime_js_1.runtime.state.pity = 0;
    }
    else if (r >= .55) {
        type = '家具藍圖';
        name = r > .7 ? '琥珀咖啡豆壁燈藍圖' : '編織狗墊藍圖';
        runtime_js_1.runtime.state.pity++;
    }
    else {
        type = '材料';
        name = r > .27 ? '修復木板' : '備用螺絲';
        runtime_js_1.runtime.state.pity++;
    }
    runtime_js_1.runtime.state.tickets--;
    runtime_js_1.runtime.state.draws++;
    (0, inventory_model_js_1.addItem)(name, type);
    runtime_js_1.runtime.drawResult = name;
    (0, ledger_js_1.log)('本機探索券 −1；發現：' + name);
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('inventory', true);
    (0, ui_port_js_1.toast)('發現 ' + name + '。本次探索已存檔。');
}

},
"src/features/kitchen.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkin = checkin;
exports.doChapter = doChapter;
exports.cook = cook;
/** features/kitchen — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const inventory_model_js_1 = require("src/features/inventory-model.js");
function checkin() {
    const d = (0, clock_js_1.today)();
    if (runtime_js_1.runtime.state.checkins.includes(d))
        return;
    runtime_js_1.runtime.state.checkins.push(d);
    if ((0, ledger_js_1.reward)('checkin:' + d, 5, 0))
        (0, inventory_model_js_1.addItem)('修復材料', '材料');
    (0, ledger_js_1.log)('每日簽到：＋5 XP、修復材料 ×1（本機）');
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.toast)('今日補給已收好。明天來也好，休息幾天再來也好。');
}
function doChapter(id) { (0, ui_port_js_1.show)('tophat'); (0, ui_port_js_1.toast)('已改為整章任務，不再逐題登記或計分。'); }
function cook(name) {
    const d = (0, clock_js_1.today)();
    if (runtime_js_1.runtime.state.cooking.some(x => x.date === d && x.name === name))
        return;
    if (!confirm(`確認今天已在現實中完成「${name}」？\n只是記錄，不需要為了獎勵再做一次。`))
        return;
    runtime_js_1.runtime.state.cooking.unshift({ date: d, name });
    (0, ledger_js_1.reward)('cook:' + d + ':' + name, 10, 5);
    (0, ledger_js_1.log)(`生活技能：${name}（本機 ＋10 XP／＋5 幣）`);
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('kitchen', true);
    (0, ui_port_js_1.toast)('生活技能已記錄；不將咖啡當健康加成。');
}

},
"src/features/routines-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineDefaults = routineDefaults;
exports.normalizePlanner = normalizePlanner;
exports.routineDone = routineDone;
/** features/routines-model — extracted from verified 2.3.1; visual/gameplay parity first. */
const growth_model_js_1 = require("src/features/growth-model.js");
const clock_js_1 = require("src/core/clock.js");
const runtime_js_1 = require("src/core/runtime.js");
function routineDefaults() {
    return [
        (0, growth_model_js_1.pilatesRoutine)(),
        { id: 'r-brightspace', title: '查看 Brightspace 新公告', course: '516', repeat: 'daily', xp: 5, coins: 0, action: '', enabled: true, detail: '檢查公告 ≠ 完成作業。有新作業再登記成有截止日的主線。' },
        { id: 'r-space', title: '整理自己的桌面 5 分鐘', course: 'life', repeat: 'daily', xp: 5, coins: 0, action: '', enabled: true, detail: '只整理自己的區域，不替其他人承擔日常家務。' },
        { id: 'r-meal', title: '吃飯與料理', course: 'life', repeat: 'daily', xp: 0, coins: 0, action: 'kitchen', enabled: true, detail: '沿用料理紀錄，不在例行區重複領獎。' },
        { id: 'r-rest', title: '休整與睡眠觀察', course: 'life', repeat: 'daily', xp: 0, coins: 0, action: 'health', enabled: true, detail: '記錄即可，不要求一定睡著、不扣顏值或資源。' },
        { id: 'r-tophat', title: '確認 TopHat 是否有新章節', course: '516', repeat: 'weekly', xp: 0, coins: 0, action: 'tophat', enabled: true, detail: '只在老師實際發布時新增作業；考試週可能沒有新章節，先等公告。跨週不清掉未完成的第 7／8 章。' },
        { id: 'r-coffee', title: '虹吸／拿鐵練習（選做）', course: 'life', repeat: 'daily', xp: 0, coins: 0, action: 'kitchen', enabled: false, detail: '不是每天必喝；完成後用料理面板記錄，兩邊不重複結算。' }
    ];
}
function normalizePlanner(s) {
    s.routines = Array.isArray(s.routines) ? s.routines : routineDefaults();
    s.routineHistory = s.routineHistory || {};
    s.inventoryLocks = s.inventoryLocks || {};
    for (const t of s.tasks) {
        t.priority = ['auto', 'p1', 'p2', 'p3'].includes(t.priority) ? t.priority : 'auto';
        t.lane = ['main', 'side'].includes(t.lane) ? t.lane : (t.course === 'life' ? 'side' : 'main');
    }
    if (!s.plannerVersion) {
        const old = s.tasks.find(t => t.id === '516-brightspace');
        const oldAt = s.events?.['task:516-brightspace'];
        if (old?.status === 'done' && oldAt && !Number.isNaN(Date.parse(oldAt))) {
            const day = (0, clock_js_1.isoDay)(new Date(oldAt));
            s.routineHistory['r-brightspace|d:' + day] = oldAt;
        }
        s.plannerVersion = 1;
    }
    return s;
}
function routineDone(r) {
    if (r.action === 'exercise')
        return (0, growth_model_js_1.exerciseSummary)(runtime_js_1.runtime.state.growth, (0, clock_js_1.today)()).pilates >= runtime_js_1.runtime.state.growth.pilatesWeeklyTarget;
    if (r.action === 'health')
        return runtime_js_1.runtime.state.health.some(h => h.date === (0, clock_js_1.today)());
    if (r.action === 'kitchen')
        return runtime_js_1.runtime.state.cooking.some(c => c.date === (0, clock_js_1.today)() && (r.id === 'r-coffee' ? ['虹吸咖啡', '拿鐵'].includes(c.name) : c.name === '準備一餐'));
    if (r.action === 'tophat')
        return Boolean(runtime_js_1.runtime.state.routineHistory[r.id + '|' + (0, clock_js_1.cycleKey)(r)]);
    return Boolean(runtime_js_1.runtime.state.routineHistory[r.id + '|' + (0, clock_js_1.cycleKey)(r)]);
}

},
"src/features/routines.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineCard = routineCard;
exports.routinePanel = routinePanel;
exports.routineComplete = routineComplete;
/** features/routines — extracted from verified 2.3.1; visual/gameplay parity first. */
const growth_model_js_1 = require("src/features/growth-model.js");
const clock_js_1 = require("src/core/clock.js");
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const routines_model_js_1 = require("src/features/routines-model.js");
const dom_js_1 = require("src/ui/dom.js");
function routineCard(r, compact = false) {
    if (r.action === 'exercise') {
        const s = (0, growth_model_js_1.exerciseSummary)(runtime_js_1.runtime.state.growth, (0, clock_js_1.today)()), n = runtime_js_1.runtime.state.growth.pilatesWeeklyTarget;
        return `<article class="routine-card ${s.pilates >= n ? 'is-done' : ''}"><span class="routine-mark">${(0, dom_js_1.icon)('heart')}</span><div><strong>${(0, dom_js_1.esc)(r.title)}</strong><small>本週 ${s.pilates}/${n} 次${!r.enabled ? ' · 已暫停' : ''}</small><p class="small muted">完成活動後記一筆，同步到個人數值；不以運動次數直接計算健康分。</p></div><div class="routine-controls"><button class="outline" data-panel="exercise">記錄／查看活動</button><button class="link" data-routine-pause="${(0, dom_js_1.esc)(r.id)}">${r.enabled ? '暫停' : '啟用'}</button></div></article>`;
    }
    if (r.id === 'r-tophat') {
        const done = (0, routines_model_js_1.routineDone)(r);
        return `<article class="routine-card ${done ? 'is-done' : ''}" data-routine-card="r-tophat"><span class="routine-mark">${(0, dom_js_1.icon)('layers')}</span><div><strong>${(0, dom_js_1.esc)(r.title)}</strong><small>每週只確認發布情況${done ? ' · 本週已查看' : ''}${!r.enabled ? ' · 已暫停' : ''}</small><p class="small muted">${(0, dom_js_1.esc)(r.detail)}</p></div><div class="routine-controls"><button class="outline" data-panel="tophat">查看正式作業</button><button class="outline" data-study-checked ${done || !r.enabled ? 'disabled' : ''}>${done ? '本週已查看' : '確認本週已查看'}</button><button class="link" data-routine-pause="r-tophat">${r.enabled ? '暫停' : '啟用'}</button></div></article>`;
    }
    const done = (0, routines_model_js_1.routineDone)(r), key = (0, clock_js_1.cycleKey)(r);
    return `<article class="routine-card ${done ? 'is-done' : ''} ${!r.enabled ? 'paused' : ''}" data-routine-card="${(0, dom_js_1.esc)(r.id)}"><span class="routine-mark">${(0, dom_js_1.icon)(r.action === 'kitchen' ? 'coffee' : r.action === 'health' ? 'moon' : r.repeat === 'weekly' ? 'layers' : 'check')}</span><div><strong>${(0, dom_js_1.esc)(r.title)}</strong><small>${r.repeat === 'weekly' ? '每週 · 週一更新' : '每日 · 洛杉磯跨日更新'}${done ? ' · 本期已記錄' : ''}${!r.enabled ? ' · 暫停' : ''}</small>${!compact ? `<p>${(0, dom_js_1.esc)(r.detail)}</p><span class="reward">${r.action ? '連到原面板 · 不重複結算' : `${r.xp} XP / ${r.coins} 幣 · 每期一次`}</span>` : ''}</div><div class="routine-controls"><button class="outline" ${!r.enabled || (!r.action && done) ? 'disabled' : ''} ${r.action ? `data-panel="${r.action}"` : `data-routine-done="${(0, dom_js_1.esc)(r.id)}"`}>${r.action ? '開啟' : done ? '已記錄' : '完成'}</button>${!compact ? `<button class="link" data-routine-pause="${(0, dom_js_1.esc)(r.id)}">${r.enabled ? '暫停' : '啟用'}</button>` : ''}</div></article>`;
}
function routinePanel() { return `<div class="note">例行任務依 LA 日期刷新，沒有漏一天就累積一串欠款。暫停不扣分。老師臨時發布的作業仍是獨立主線，不自動變成 routine。</div><div class="row"><button class="outline" data-panel="newtask">＋ 新增例行／單次任務</button><span class="tag">${(0, clock_js_1.today)()} · 本週 ${(0, clock_js_1.monday)()}</span></div>${['daily', 'weekly'].map(freq => `<h3 class="section-label">${freq === 'daily' ? '每日 Routine' : '每週 Routine'}</h3>${runtime_js_1.runtime.state.routines.filter(r => r.repeat === freq).map(r => routineCard(r)).join('')}`).join('')}`; }
function routineComplete(id) {
    const r = runtime_js_1.runtime.state.routines.find(r => r.id === id);
    if (!r || !r.enabled || r.action || (0, routines_model_js_1.routineDone)(r))
        return;
    if (!confirm(`確認已完成「${r.title}」？本期只記一次。`))
        return;
    const key = r.id + '|' + (0, clock_js_1.cycleKey)(r);
    runtime_js_1.runtime.state.routineHistory[key] = (0, clock_js_1.stamp)();
    (0, ledger_js_1.reward)('routine:' + key, r.xp, r.coins);
    (0, ledger_js_1.log)('例行任務：' + r.title + ' · ' + (0, clock_js_1.cycleKey)(r));
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('routine', true);
    (0, ui_port_js_1.toast)('本期已記錄；下期重新開啟，不累積缺席懲罰。');
}

},
"src/features/section516.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySection15555 = applySection15555;
/** User explicitly confirmed 15555; source syllabus pp.1,4. No reward for migration. */
function applySection15555(s) {
    s.courseSections = { ...(s.courseSections || {}), '516': '15555' };
    if (s.section15555Applied)
        return s;
    const t = s.tasks.find(x => x.id === '516-final');
    if (t && t.title === '確認期末考 section／日期' && !t.due) {
        t.title = 'GSBA 516 期末考準備 · Section 15555';
        t.due = '2026-12-09';
        t.time = '11:00';
        t.window = '';
        t.detail = 'Section 15555 已由妳確認。課綱期末為 2026/12/09 11:00–13:00（洛杉磯）；題目及公告仍以老師最新通知為準。';
    }
    s.section15555Applied = true;
    return s;
}

},
"src/features/skill-tree-data.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESEARCH_DATE = exports.CREDENTIALS = exports.TREES = exports.SOURCES = void 0;
/** Curated game rubric. Provider syllabi inform topics, not our points or verification. */
exports.SOURCES = {
    hr: { name: 'HackerRank SQL 技能目錄／免費測驗', url: 'https://help.hackerrank.com/articles/2563639100-introduction-to-certification' },
    pg: { name: 'PostgreSQL 官方教學', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
    cs50: { name: 'CS50 SQL 免費證書條件', url: 'https://cs50.harvard.edu/sql/certificate/' },
    excel: { name: 'MOS Excel Associate 官方能力項目', url: 'https://learn.microsoft.com/en-us/credentials/certifications/mos-excel-associate-m365-apps/' },
    excelExpert: { name: 'MO-211 Excel Expert', url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mo-211/' },
    bi: { name: 'PL-300 官方能力大綱', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-300' },
    python: { name: 'HackerRank Python 技能測驗', url: 'https://www.hackerrank.com/skills-verification/python_basic' },
    kaggle: { name: 'Kaggle 入門競賽指南', url: 'https://www.kaggle.com/learn-guide/kaggle-competitions' }
};
const n = (id, name, points, criterion, source) => ({ id, name, points, criterion, source });
exports.TREES = [
    { id: 'sql', name: 'SQL 查詢', basis: 'HackerRank 能力分類＋PostgreSQL 官方教學', nodes: [
            n('sql.select', 'SELECT／WHERE／排序', 10, '不看答案完成新情境查詢，能解釋篩選、排序、LIMIT 與 NULL 的差異。', 'hr'),
            n('sql.aggregate', 'GROUP BY／HAVING／聚合', 10, '算出分組 KPI，分清 WHERE 與 HAVING；用小樣本核對 COUNT／SUM／AVG。', 'hr'),
            n('sql.join', 'JOIN 與資料粒度', 15, '能正確選 INNER／LEFT JOIN，說明一對多造成的重複列，核對總額沒有被放大。', 'hr'),
            n('sql.cte', '子查詢與 CTE', 15, '獨立拆解多步問題，寫出子查詢或 WITH，說明每一段輸入與輸出。', 'pg'),
            n('sql.clean', 'CASE／NULL／日期清理', 10, '處理空值與條件分類，定義日期區間並驗證邊界。', 'pg'),
            n('sql.window', '視窗函數', 15, '用 ROW_NUMBER／RANK／LAG 或累計 SUM OVER 解決問題，能解釋 PARTITION 與排序。', 'pg'),
            n('sql.schema', '資料表與約束', 10, '建立關聯資料表、主外鍵與必要約束，示範錯誤資料被拒絕。', 'pg'),
            n('sql.optimize', '索引與 EXPLAIN', 5, '讀出執行計畫的主要成本，對照索引前後結果；不能只背索引名稱。', 'hr'),
            n('sql.project', '可重跑分析成果', 10, '交付可重跑的 SQL、資料說明、驗證與一個商業結論；本人能說明做法。', 'cs50')
        ] },
    { id: 'excel', name: 'Excel 建模', basis: 'MOS 能力大綱＋營運分析應用；下列配分為遊戲設計', nodes: [
            n('excel.references', '參照、表格與資料整理', 10, '能正確使用相對／絕對參照，建立結構化表格及資料驗證。', 'excel'),
            n('excel.conditional', 'IF／SUMIFS／COUNTIFS', 15, '獨立完成多條件營運統計，驗證空值、零及條件邊界。', 'excelExpert'),
            n('excel.lookup', 'XLOOKUP／INDEX-MATCH', 15, '完成跨表比對，處理未匹配與重複鍵，並說明精確匹配的意義。', 'excelExpert'),
            n('excel.clean', '文字／日期／錯誤處理', 10, '清理資料格式並合理使用 IFERROR，不掩蓋真實資料問題。', 'excel'),
            n('excel.pivot', '樞紐分析與圖表', 15, '建立可更新的彙總、篩選與圖表，指標分母正確。', 'excelExpert'),
            n('excel.model', '情境／敏感度／求解', 15, '明確區分輸入、公式、限制，核對敏感度表或 Solver 結果。', 'excelExpert'),
            n('excel.automation', '巨集或自動處理', 10, '將重複操作自動化，保留輸入檢查及錯誤處理。', 'excelExpert'),
            n('excel.project', '可展示營運模型', 10, '他人能依使用說明重跑模型；能說明假設、限制及建議。', 'excel')
        ] },
    { id: 'bi', name: 'BI 與視覺溝通', basis: 'PL-300 能力領域；點數不是微軟考試分數', nodes: [
            n('bi.prepare', '整理與轉換資料', 20, '可重跑資料整理，處理缺值、型態與重複。', 'bi'), n('bi.model', '關聯模型', 20, '建立星狀模型，解釋關聯方向與粒度。', 'bi'), n('bi.measure', '量值與計算', 20, '建立 DAX 量值並說明篩選脈絡，核對分母。', 'bi'), n('bi.visual', '視覺化與互動', 20, '用圖表回答明確業務問題，篩選互動不誤導。', 'bi'), n('bi.project', '發布、權限與交付', 20, '整理可展示報告，說明更新與存取權限。', 'bi')
        ] },
    { id: 'python', name: 'Python 分析', basis: '基礎語法參考 HackerRank；分析成果為遊戲任務標準', nodes: [
            n('python.basics', '型態與流程控制', 20, '獨立使用清單、字典、條件與迴圈處理新資料。', 'python'), n('python.functions', '函式與錯誤處理', 20, '拆成函式、處理錯誤，能說明輸入輸出。', 'python'), n('python.data', '表格資料整理', 20, '讀寫資料，合併與分組並檢查缺值／筆數。', 'python'), n('python.analysis', '分析與驗證', 20, '產生可檢查的分析或模型，避免資料洩漏。', 'kaggle'), n('python.project', '可重跑作品／競賽', 20, '提交程式及說明，呈現基準比較；有排名不等於得獎。', 'kaggle')
        ] },
    ...[
        ['planning', '供應鏈規劃', ['需求與假設', '庫存／MOQ／交期', '情境與取捨', '交付規劃建議']],
        ['process', '流程改善', ['問題與基準', '流程與根因', '改善與驗證', '可展示改善成果']],
        ['coordination', '專案協調', ['工作拆解', '時程與依賴', '風險與溝通', '交付與復盤']],
        ['communication', '英文／談判表達', ['清楚自我介紹', '提問與傾聽', '解釋案例／取捨', '對談或簡報回饋']]
    ].map(([id, name, titles]) => ({ id, name, basis: '依妳的求職方向設計，非官方認證量尺', nodes: titles.map((t, i) => n(id + '.' + i, t, 25, '能以自己完成的案例說明做法、限制與成果；不要只列術語。', null)) }))
];
exports.CREDENTIALS = [
    { id: 'hr-basic', skill: 'sql', name: 'HackerRank SQL Basic', points: 15, cost: '免費', type: '平台技能測驗', url: 'https://www.hackerrank.com/skills-verification/sql_basic', note: '30 分鐘、2 題；不是監考職業證照。' },
    { id: 'hr-intermediate', skill: 'sql', name: 'HackerRank SQL Intermediate', points: 25, cost: '免費', type: '平台技能測驗', url: 'https://www.hackerrank.com/skills-verification/sql_intermediate', note: '35 分鐘、2 題；複雜 JOIN、UNION、子查詢。' },
    { id: 'hr-advanced', skill: 'sql', name: 'HackerRank SQL Advanced', points: 35, cost: '免費', type: '平台技能測驗', url: 'https://www.hackerrank.com/skills-verification/sql_advanced', note: '60 分鐘、2 題；最佳化、建模、索引與視窗函數等。' },
    { id: 'cs50-sql', skill: 'sql', name: 'CS50 SQL Certificate', points: 30, cost: '免費 CS50 版本', type: '課程完成證書', url: 'https://cs50.harvard.edu/sql/certificate/', note: '每一題及期末專題至少 70%；edX verified certificate 是不同方案，不等於 Harvard 學位或學分。' },
    { id: 'mos-excel', skill: 'excel', name: 'MOS Excel Associate / Expert', points: 30, cost: '考試付費；地區定價', type: '官方認證', url: 'https://learn.microsoft.com/en-us/credentials/certifications/mos-excel-associate-m365-apps/', note: '先按官方項目練能力，無須為遊戲點數付費考試。' },
    { id: 'pl300-practice', skill: 'bi', name: 'PL-300 官方練習評量', points: 10, cost: '免費練習', type: '準備用評量，不是證書', url: 'https://learn.microsoft.com/en-us/credentials/certifications/practice-assessments-for-microsoft-certifications', note: '練習結果只作學習檢核，不等於通過 PL-300 正式考試。' },
    { id: 'pl300', skill: 'bi', name: 'PL-300 正式認證', points: 30, cost: '正式考試付費', type: '官方認證', url: 'https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/', note: '免費訓練、練習、續證，不等於首次考試免費。' },
    { id: 'kaggle-result', skill: 'python', name: 'Kaggle 可重跑競賽成果', points: 20, cost: '依活動規則核對', type: '競賽作品，不是證書', url: 'https://www.kaggle.com/learn-guide/kaggle-competitions', note: '記錄作品、排名與日期；練習賽參加／排名不得冒稱獎牌或獲獎。' }
];
exports.RESEARCH_DATE = '2026-10-21';

},
"src/features/skill-tree-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masteryDefaults = void 0;
exports.validateMastery = validateMastery;
exports.treeSummary = treeSummary;
exports.achievementPoints = achievementPoints;
const skill_tree_data_js_1 = require("src/features/skill-tree-data.js");
const growth_model_js_1 = require("src/features/growth-model.js");
const masteryDefaults = () => ({ version: 1, checks: {}, credentials: {} });
exports.masteryDefaults = masteryDefaults;
function validateMastery(s) {
    if (s.mastery === undefined)
        s.mastery = (0, exports.masteryDefaults)();
    const m = s.mastery;
    if (!m || m.version !== 1 || !m.checks || typeof m.checks !== 'object' || !m.credentials || typeof m.credentials !== 'object' || Array.isArray(m.checks) || Array.isArray(m.credentials))
        throw Error('技能樹格式不受支援');
    for (const [id, c] of Object.entries(m.checks)) {
        if (!skill_tree_data_js_1.TREES.some(t => t.nodes.some(n => n.id === id)) || !c || !['practice', 'independent'].includes(c.level) || !(0, growth_model_js_1.validDay)(c.date) || typeof c.note !== 'string' || c.note.length > 1500)
            throw Error('技能節點紀錄無效');
    }
    for (const [id, c] of Object.entries(m.credentials)) {
        if (!skill_tree_data_js_1.CREDENTIALS.some(x => x.id === id) || !c || !(0, growth_model_js_1.validDay)(c.date) || typeof c.reference !== 'string' || !c.reference.trim() || c.reference.length > 1000)
            throw Error('證書或競賽依據無效');
    }
    return s;
}
function treeSummary(s, day) { return skill_tree_data_js_1.TREES.map(t => ({ ...t, nodes: t.nodes.map(n => ({ ...n, record: s.mastery?.checks[n.id]?.date <= day ? s.mastery.checks[n.id] : null })), score: t.nodes.reduce((v, n) => { const c = s.mastery?.checks[n.id]; return v + (!c || c.date > day ? 0 : c.level === 'independent' ? n.points : Math.round(n.points * .4)); }, 0) })); }
function achievementPoints(s, day) { return skill_tree_data_js_1.CREDENTIALS.reduce((v, c) => v + (s.mastery?.credentials[c.id]?.date <= day ? c.points : 0), 0); }

},
"src/features/skill-tree.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTree = selectTree;
exports.openNode = openNode;
exports.saveNode = saveNode;
exports.openCredential = openCredential;
exports.saveCredential = saveCredential;
exports.deleteCredential = deleteCredential;
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const clock_js_1 = require("src/core/clock.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const skill_tree_data_js_1 = require("src/features/skill-tree-data.js");
const growth_model_js_1 = require("src/features/growth-model.js");
function selectTree(id) { if (skill_tree_data_js_1.TREES.some(t => t.id === id))
    runtime_js_1.runtime.skillTrack = id; (0, ui_port_js_1.show)('skillTree'); }
function openNode(id) { if (!skill_tree_data_js_1.TREES.some(t => t.nodes.some(n => n.id === id)))
    return; runtime_js_1.runtime.skillNode = id; (0, ui_port_js_1.show)('skillNode'); }
function saveNode(fd) { const id = String(fd.get('id')), level = String(fd.get('level')), date = String(fd.get('date')), note = String(fd.get('note') || '').trim(); if (!skill_tree_data_js_1.TREES.some(t => t.nodes.some(n => n.id === id)) || !['none', 'practice', 'independent'].includes(level) || !(0, growth_model_js_1.validDay)(date) || date > (0, clock_js_1.today)() || note.length > 1500)
    return (0, ui_port_js_1.toast)('請確認節點、日期與階段'); if (level === 'none')
    delete runtime_js_1.runtime.state.mastery.checks[id];
else
    runtime_js_1.runtime.state.mastery.checks[id] = { level, date, note }; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('skillTree'); (0, ui_port_js_1.toast)('技能點已更新；只計此節點一次，不改 XP／生存幣'); }
function openCredential(id) { if (!skill_tree_data_js_1.CREDENTIALS.some(c => c.id === id))
    return; runtime_js_1.runtime.skillCredential = id; (0, ui_port_js_1.show)('credential'); }
function saveCredential(fd) { const id = String(fd.get('id')), date = String(fd.get('date')), reference = String(fd.get('reference') || '').trim(); if (!skill_tree_data_js_1.CREDENTIALS.some(c => c.id === id) || !(0, growth_model_js_1.validDay)(date) || date > (0, clock_js_1.today)() || !reference || reference.length > 1000)
    return (0, ui_port_js_1.toast)('請填日期與證書編號／作品或成績依據'); runtime_js_1.runtime.state.mastery.credentials[id] = { date, reference, verification: 'self-reported' }; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('skillTree'); (0, ui_port_js_1.toast)('成就已登記；未連接官方驗真，不自動通過整棵技能樹'); }
function deleteCredential(id) { if (!runtime_js_1.runtime.state.mastery.credentials[id])
    return; if (!confirm('移除這筆成就登記？技能節點與 XP 不變。'))
    return; delete runtime_js_1.runtime.state.mastery.credentials[id]; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('skillTree'); }

},
"src/features/study516-model.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STUDY516 = void 0;
exports.studyDefaults = studyDefaults;
exports.normalizedTitle = normalizedTitle;
exports.chapterNumber = chapterNumber;
exports.legacyIsSection = legacyIsSection;
exports.normalizeStudy516 = normalizeStudy516;
/** features/study516-model — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
exports.STUDY516 = Object.freeze({ version: 1, observedOn: '2026-10-19', examDate: '2026-10-21', groups: [
        { id: 'ch7', taskId: '516-tophat-ch7', title: 'Chapter 7: The Central Limit Theorem', badge: '補發作業', kind: 'homework', note: '老師補發的第 7 章。做完整章後，妳再勾選完成。', dueEvidence: '確切截止時間待確認。', units: ['ch7-1'] },
        { id: 'ch8', taskId: '516-tophat-ch8', title: 'Chapter 8: Confidence Intervals', badge: '上週新作業', kind: 'homework', note: '上週發布的第 8 章。做完整章後，妳再勾選完成。', dueEvidence: '確切截止時間待確認。', units: ['ch8'] },
        { id: 'practice', taskId: '516-tophat-practice', title: 'Midterm practice questions', badge: '期中複習', kind: 'practice', note: '整組期中練習獨立列一項；複習完再勾選，不拆成小題。', dueEvidence: '未設定截止時間。', units: ['practice'] }
    ], units: { 'ch7-1': { group: 'ch7', scope: 'section' }, ch8: { group: 'ch8', scope: 'chapter' }, practice: { group: 'practice', scope: 'practice' } } });
function studyDefaults() { return { version: 1, snapshotId: 'gsba516.tophat.20261019', focusEnabled: true, links: {}, taskLinks: {}, registeredAt: null }; }
function normalizedTitle(s) { return String(s || '').toLowerCase().replace(/[\s：:·｜|]/g, ''); }
function chapterNumber(title) { const m = String(title).match(/(?:chapter\s*|第\s*)(\d+)(?![\d.．])/i); return m ? Number(m[1]) : null; }
function legacyIsSection(c) { return c.scope === 'section' || /^\s*\d+[.．]\d+/.test(c.title) || c.scope === 'practice'; }
function normalizeStudy516(s) {
    const first = s.study516 === undefined;
    if (first)
        s.study516 = studyDefaults();
    const cfg = s.study516;
    if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg) || cfg.version !== 1 || typeof cfg.focusEnabled !== 'boolean')
        throw Error('GSBA 516 作業名冊設定不正確。');
    for (const field of ['links', 'taskLinks']) {
        if (!cfg[field] || typeof cfg[field] !== 'object' || Array.isArray(cfg[field]))
            throw Error('GSBA 516 連結設定不正確。');
        for (const [id, target] of Object.entries(cfg[field]))
            if (typeof target !== 'string' || target.length > 160 || !(field === 'links' ? Object.hasOwn(exports.STUDY516.units, id) : exports.STUDY516.groups.some(g => g.id === id)))
                throw Error('GSBA 516 連結內容不正確。');
    }
    for (const g of exports.STUDY516.groups) {
        let t = s.tasks.find(x => x.id === cfg.taskLinks[g.id]);
        if (!t) {
            t = s.tasks.find(x => x.id === g.taskId);
            if (!t) {
                const matches = s.tasks.filter(x => x.course === '516' && normalizedTitle(x.title) === normalizedTitle(g.title));
                if (matches.length === 1)
                    t = matches[0];
            }
            if (!t) {
                t = { id: g.taskId, title: g.title, course: '516', type: g.kind === 'homework' ? 'assignment' : 'practice', due: null, time: null, window: '期限待確認', detail: g.note, source: '使用者 TopHat 截圖與章節任務設定', priority: 'p1', lane: 'main', xp: 0, coins: 0, status: 'todo', rewarded: false, studyGroup: g.id };
                s.tasks.push(t);
            }
            cfg.taskLinks[g.id] = t.id;
        }
    }
    // Keep old per-question arrays verbatim. Only expose whole chapters as tasks.
    const linked = new Set(Object.values(cfg.links));
    for (const c of s.chapters) {
        if (linked.has(c.id) || legacyIsSection(c))
            continue;
        if (exports.STUDY516.groups.some(g => normalizedTitle(g.title) === normalizedTitle(c.title)) || [7, 8].includes(chapterNumber(c.title)))
            continue;
        let t = s.tasks.find(x => x.legacyTophatId === c.id);
        if (!t) {
            const same = s.tasks.filter(x => x.course === '516' && normalizedTitle(x.title) === normalizedTitle(c.title));
            if (same.length === 1)
                t = same[0];
        }
        if (t) {
            if (!t.legacyTophatId)
                t.legacyTophatId = c.id;
            t.tophatChapter = true;
            continue;
        }
        const tid = '516-chapter-legacy-' + c.id;
        if (tid.length > 160)
            continue;
        s.tasks.push({ id: tid, title: c.title, course: '516', type: 'assignment', due: c.due || null, time: null, window: '', detail: '既有章節紀錄保留。整章完成狀態由妳自行確認。', source: '既有網站章節紀錄', priority: 'auto', lane: 'main', xp: 0, coins: 0, status: c.done > 0 ? 'inprogress' : 'todo', rewarded: false, tophatChapter: true, legacyTophatId: c.id });
    }
    // An accepted old +1-question build goal follows the same whole-chapter task.
    const b = s.firstBuild;
    if (b?.goal?.kind === 'tophat' && !b.evidence && !b.installedAt) {
        const cid = b.goal.id, c = s.chapters.find(x => x.id === cid);
        let target = null;
        for (const g of exports.STUDY516.groups) {
            if (g.units.some(u => cfg.links[u] === cid) || (c && (c.sourceGroup === g.id || normalizedTitle(c.title) === normalizedTitle(g.title))))
                target = s.tasks.find(t => t.id === cfg.taskLinks[g.id]);
        }
        if (!target)
            target = s.tasks.find(t => t.legacyTophatId === cid);
        if (target && target.status !== 'done') {
            if (!b.legacyChapterGoal)
                b.legacyChapterGoal = structuredClone(b.goal);
            b.goal = { kind: 'task', id: target.id, label: '完成 ' + target.title, baseline: 0, startedAt: b.goal.startedAt };
        }
    }
    if (first) {
        cfg.registeredAt = (0, clock_js_1.stamp)();
    }
    return s;
}

},
"src/features/study516-query.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studyTask = studyTask;
exports.customChapterGroup = customChapterGroup;
exports.studyGroupForTask = studyGroupForTask;
exports.allChapterGroups = allChapterGroups;
exports.studyTracker = studyTracker;
exports.examFocusActive = examFocusActive;
exports.examFocusRank = examFocusRank;
exports.chapterStatus = chapterStatus;
exports.studyTaskSummary = studyTaskSummary;
exports.legacyChapterRecords = legacyChapterRecords;
exports.chapterBonusClaimed = chapterBonusClaimed;
exports.chapterRewardText = chapterRewardText;
/** features/study516-query — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const runtime_js_1 = require("src/core/runtime.js");
const study516_model_js_1 = require("src/features/study516-model.js");
function studyTask(gid, s = runtime_js_1.runtime.state) { return s.tasks.find(t => t.id === (s.study516.taskLinks[gid] || gid)); }
function customChapterGroup(t) { return { id: t.id, taskId: t.id, title: t.title, badge: '章節作業', kind: 'homework', note: '以整章為單位，做完後自行勾選。', dueEvidence: '期限可留白。', units: [] }; }
function studyGroupForTask(t) { return study516_model_js_1.STUDY516.groups.find(g => runtime_js_1.runtime.state.study516.taskLinks[g.id] === t.id) || (t.tophatChapter ? customChapterGroup(t) : null); }
function allChapterGroups() { const ids = new Set(Object.values(runtime_js_1.runtime.state.study516.taskLinks)); return [...study516_model_js_1.STUDY516.groups, ...runtime_js_1.runtime.state.tasks.filter(t => t.tophatChapter && !ids.has(t.id)).map(customChapterGroup)]; }
function studyTracker(id, s = runtime_js_1.runtime.state) { return s.chapters.find(c => c.id === s.study516.links[id]); }
function examFocusActive(day = (0, clock_js_1.today)()) { const exam = runtime_js_1.runtime.state.tasks.find(t => t.id === '516-mid'); return runtime_js_1.runtime.state.study516.focusEnabled && Boolean(exam) && day <= (exam.due || study516_model_js_1.STUDY516.examDate); }
function examFocusRank(t) {
    if (!examFocusActive())
        return 99;
    const rank = ['516-mid', runtime_js_1.runtime.state.study516.taskLinks.ch7, runtime_js_1.runtime.state.study516.taskLinks.ch8, runtime_js_1.runtime.state.study516.taskLinks.practice, '516-hw2'].indexOf(t.id);
    return rank < 0 ? 99 : rank;
}
function chapterStatus(t) { return t.status === 'done' ? '已完成' : t.status === 'todo' ? '未完成' : '進行中'; }
function studyTaskSummary(g) { return chapterStatus(studyTask(g.id)) + ' · ' + (g.kind === 'homework' ? '整章自行確認' : '整組自行確認'); }
function legacyChapterRecords(g, t) {
    const linked = (g.units || []).map(u => runtime_js_1.runtime.state.study516.links[u]).filter(Boolean);
    return runtime_js_1.runtime.state.chapters.filter(c => (linked.includes(c.id) || c.id === t.legacyTophatId || c.sourceGroup === g.id || (0, study516_model_js_1.normalizedTitle)(c.title) === (0, study516_model_js_1.normalizedTitle)(t.title) || (g.id === 'ch7' && (0, study516_model_js_1.chapterNumber)(c.title) === 7) || (g.id === 'ch8' && (0, study516_model_js_1.chapterNumber)(c.title) === 8)) && !(0, study516_model_js_1.legacyIsSection)(c));
}
function chapterBonusClaimed(g, t) { return t.rewarded || Object.hasOwn(runtime_js_1.runtime.state.events, 'task:' + t.id) || Object.hasOwn(runtime_js_1.runtime.state.events, 'chapter-task:' + t.id + ':complete') || legacyChapterRecords(g, t).some(c => c.bonus || Object.hasOwn(runtime_js_1.runtime.state.events, 'chapter:' + c.id + ':complete')); }
function chapterRewardText(g, t) { return g.kind !== 'homework' ? '複習狀態獨立記錄，不重複發獎。' : chapterBonusClaimed(g, t) ? '既有整章獎勵已保留，不會重領。' : '整章完成：10 XP ＋章節研究筆記 ×1；不再逐題計分。'; }

},
"src/features/study516.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studySubmit = studySubmit;
exports.chapterStart = chapterStart;
exports.studyGroupCard = studyGroupCard;
exports.studyTaskCard = studyTaskCard;
exports.study516Panel = study516Panel;
exports.otherChaptersPanel = otherChaptersPanel;
exports.addSimpleChapter = addSimpleChapter;
/** features/study516 — extracted from verified 2.3.1; visual/gameplay parity first. */
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const utils_js_1 = require("src/core/utils.js");
const inventory_model_js_1 = require("src/features/inventory-model.js");
const study516_model_js_1 = require("src/features/study516-model.js");
const study516_query_js_1 = require("src/features/study516-query.js");
const tasks_query_js_1 = require("src/features/tasks-query.js");
const dom_js_1 = require("src/ui/dom.js");
const home_js_1 = require("src/ui/home.js");
function studySubmit(gid) {
    const g = (0, study516_query_js_1.allChapterGroups)().find(x => x.id === gid), t = g && (0, study516_query_js_1.studyTask)(gid);
    if (!t || t.status === 'done')
        return;
    if (!confirm(`確認已${g.kind === 'homework' ? '做完整章' : '完成本組期中複習'}「${t.title}」？\n只依妳的勾選記錄，網站不會讀取 TopHat。\n${(0, study516_query_js_1.chapterRewardText)(g, t)}`))
        return;
    const oldBonus = (0, study516_query_js_1.chapterBonusClaimed)(g, t);
    t.status = 'done';
    if (g.kind === 'homework' && !oldBonus) {
        if ((0, ledger_js_1.reward)('chapter-task:' + t.id + ':complete', 10, 0))
            (0, inventory_model_js_1.addItem)('章節研究筆記', '材料');
    }
    t.rewarded = true;
    (0, ledger_js_1.log)('完成章節任務：' + t.title + (g.kind === 'homework' && !oldBonus ? '（＋10 XP，章節研究筆記 ×1；無逐題補發）' : '（保留既有獎勵，不重複入帳）'));
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('exam516', true);
    (0, ui_port_js_1.toast)('已記錄。其他章節、HW 2 和期中準備維持原狀。');
}
function chapterStart(gid) {
    const t = (0, study516_query_js_1.studyTask)(gid);
    if (!t || t.status !== 'todo')
        return;
    t.status = 'inprogress';
    (0, ledger_js_1.log)('開始章節任務：' + t.title);
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('exam516', true);
    (0, ui_port_js_1.toast)('已標示進行中，不加 XP。');
}
function studyGroupCard(g) { const t = (0, study516_query_js_1.studyTask)(g.id), done = t.status === 'done'; return `<article class="study-group chapter-only ${done ? 'chapter-done' : ''}" data-study-group="${(0, dom_js_1.esc)(g.id)}"><div class="study-group-head"><span class="tag">${g.badge}</span><span class="pbadge p${(0, tasks_query_js_1.taskPriority)(t).p}">P${(0, tasks_query_js_1.taskPriority)(t).p}</span><span class="chapter-status">${(0, study516_query_js_1.chapterStatus)(t)}</span></div><h3>${(0, dom_js_1.esc)(t.title)}</h3><p>${(0, dom_js_1.esc)(g.note)}</p>${t.due ? `<p class="study-deadline">${(0, dom_js_1.esc)((0, home_js_1.dateLabel)(t))}</p>` : ''}<div class="row space">${!done && t.status === 'todo' ? `<button class="outline" data-chapter-start="${(0, dom_js_1.esc)(g.id)}">開始做</button>` : ''}<button class="${done ? 'outline' : 'primary'}" data-study-submit="${(0, dom_js_1.esc)(g.id)}" ${done ? 'disabled' : ''}>${done ? '✓ 已完成' : g.kind === 'homework' ? '勾選整章完成' : '勾選本組完成'}</button><button class="link" data-edit-task="${(0, dom_js_1.esc)(t.id)}" ${done ? 'disabled' : ''}>${t.due ? '修改期限' : '期限（選填）'}</button></div><small class="muted chapter-reward">${(0, dom_js_1.esc)((0, study516_query_js_1.chapterRewardText)(g, t))}</small></article>`; }
function studyTaskCard(t, g) { const pr = (0, tasks_query_js_1.taskPriority)(t), done = t.status === 'done'; return `<article class="taskcard" data-task-card="${(0, dom_js_1.esc)(t.id)}"><div><div class="task-meta"><span class="pbadge p${pr.p}">P${pr.p}</span><small>GSBA 516 · ${g.badge} · ${(0, study516_query_js_1.chapterStatus)(t)}</small></div><h3 class="task-title">${(0, dom_js_1.esc)(t.title)}</h3><p>${g.kind === 'homework' ? '一章一個任務，做完再勾。' : '整組複習，完成再勾。'}</p>${t.due ? `<small>${(0, dom_js_1.esc)((0, home_js_1.dateLabel)(t))}</small>` : ''}</div><div class="task-tools"><button class="primary-action" data-study-submit="${(0, dom_js_1.esc)(g.id)}" ${done ? 'disabled' : ''}>${done ? '✓ 已完成' : '完成'}</button><button class="link" data-panel="exam516">查看章節任務</button></div></article>`; }
function study516Panel() {
    const exam = runtime_js_1.runtime.state.tasks.find(t => t.id === '516-mid'), groups = (0, study516_query_js_1.allChapterGroups)(), homework = groups.filter(g => g.kind === 'homework'), practice = groups.filter(g => g.kind === 'practice'), n = homework.filter(g => (0, study516_query_js_1.studyTask)(g.id).status === 'done').length;
    return `<section class="study-exam-hero"><span class="eyebrow">GSBA 516 / MIDTERM FIRST</span><div class="study-hero-head"><h3>期中先，章節一項一項做。</h3><span class="tag">${(0, study516_query_js_1.examFocusActive)() ? '期中置頂' : '期中準備'}</span></div><p>期中考 <b>${(0, dom_js_1.esc)(exam?.due || study516_model_js_1.STUDY516.examDate)}</b>。Chapter 7、Chapter 8 與期中練習分開；HW 2 仍是原本的獨立任務。</p><div class="row"><button class="primary" data-open-task="516-mid">期中準備主任務</button><button class="link" data-study-focus-toggle>${runtime_js_1.runtime.state.study516.focusEnabled ? '取消置頂' : '恢復置頂'}</button></div></section><div class="study-simple-note">一章一個任務。<b>做完整章，再勾完成。</b>不用填總題數、已答數或小節。<small>僅依妳手動勾選，不會讀取 TopHat；勾選不代表替妳在 TopHat 提交。</small></div><div class="study-tabs"><h3>TopHat 章節作業 <small>${n}／${homework.length} 章完成</small></h3></div>${homework.map(studyGroupCard).join('')}<h3 class="section-label">期中複習</h3>${practice.map(studyGroupCard).join('')}`;
}
function otherChaptersPanel() { return `<details class="study-reference space"><summary>＋ 老師發布新章節時，再新增</summary><form id="simpleChapterForm" class="stack space"><label class="field">章節名稱<input name="title" required maxlength="160" placeholder="例如：Chapter 9: …"></label><label class="field">截止日期（選填）<input name="due" type="date"></label><button type="submit" class="primary">新增章節任務</button></form><p class="small muted">不會每週自動產生新章節。未完成的章節留著，不因跨週清零。</p></details>`; }
function addSimpleChapter(fd) {
    const title = String(fd.get('title') || '').trim(), due = String(fd.get('due') || '') || null;
    if (!title || title.length > 160)
        return (0, ui_port_js_1.toast)('填入章節名稱即可；不用題數。');
    if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due))
        return (0, ui_port_js_1.toast)('日期格式不正確。');
    const n = (0, study516_model_js_1.chapterNumber)(title), duplicate = runtime_js_1.runtime.state.tasks.some(t => t.course === '516' && ((0, study516_model_js_1.normalizedTitle)(t.title) === (0, study516_model_js_1.normalizedTitle)(title) || (n !== null && (0, study516_model_js_1.chapterNumber)(t.title) === n)));
    if (duplicate)
        return (0, ui_port_js_1.toast)('這章已經在任務裡，不再建立第二份。');
    runtime_js_1.runtime.state.tasks.push({ id: '516-chapter-' + (0, utils_js_1.uid)(), title, course: '516', type: 'assignment', due, time: null, window: '', detail: '一章一個任務，做完後自行勾選。', source: '住戶手動新增', priority: 'auto', lane: 'main', xp: 0, coins: 0, status: 'todo', rewarded: false, tophatChapter: true });
    (0, ledger_js_1.log)('新增 TopHat 章節任務：' + title + '（不發獎、不填題數）');
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('exam516');
    (0, ui_port_js_1.toast)('已新增一個章節任務。');
}

},
"src/features/supplies.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPLY_DEFINITIONS = void 0;
exports.prepareSupply = prepareSupply;
exports.applySupply = applySupply;
exports.openSupply = openSupply;
exports.supplyPanel = supplyPanel;
/** Deterministic package opening. One explicit request, one atomic save, no money/XP. */
const runtime_js_1 = require("src/core/runtime.js");
const clock_js_1 = require("src/core/clock.js");
const utils_js_1 = require("src/core/utils.js");
const ledger_js_1 = require("src/core/ledger.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const inventory_model_js_1 = require("src/features/inventory-model.js");
const inventory_js_1 = require("src/features/inventory.js");
const dom_js_1 = require("src/ui/dom.js");
exports.SUPPLY_DEFINITIONS = Object.freeze({ '晨間補給包': { id: 'core.supply.morning.v1', name: '晨間補給包', contents: [{ name: '修復材料', type: '材料', qty: 2 }, { name: '維修零件', type: '材料', qty: 1 }] } });
function prepareSupply(name) { const def = exports.SUPPLY_DEFINITIONS[name], item = runtime_js_1.runtime.state.items.find(x => x.name === name && x.qty > 0); if (!def || !item)
    return (0, ui_port_js_1.toast)('這件補給未有可開啟的內容定義，沒有扣物品。'); if (runtime_js_1.runtime.state.inventoryLocks[name])
    return (0, ui_port_js_1.toast)('收藏已鎖定；請先解除鎖定，再開啟。'); runtime_js_1.runtime.supplyRequest = { token: (0, utils_js_1.uid)(), name, quantity: 1 }; runtime_js_1.runtime.supplyResult = null; (0, ui_port_js_1.show)('supply'); }
function applySupply(state, request, at) {
    const def = exports.SUPPLY_DEFINITIONS[request?.name];
    if (!def || typeof request.token !== 'string' || !request.token.startsWith('id-') || request.token.length > 200)
        throw Error('開包請求已失效，請重新預覽');
    const key = 'supply:open:' + request.token;
    if (Object.hasOwn(state.events, key))
        throw Error('這一包已開啟，不重複發物資');
    const item = state.items.find(x => x.name === def.name && x.qty > 0);
    if (!item || state.inventoryLocks[def.name])
        throw Error('補給不存在或已鎖定');
    for (const o of def.contents) {
        const old = state.items.find(x => x.name === o.name && x.type === o.type);
        if (old && old.qty + o.qty > 100000)
            throw Error('材料數量超出上限，這一包未開啟');
    }
    item.qty -= 1;
    for (const o of def.contents) {
        const old = state.items.find(x => x.name === o.name && x.type === o.type);
        if (old)
            old.qty += o.qty;
        else
            state.items.push({ ...o });
    }
    state.events[key] = at;
    return { name: def.name, token: request.token, contents: structuredClone(def.contents), openedAt: at };
}
function openSupply(token) { const req = runtime_js_1.runtime.supplyRequest; if (!req || req.token !== token)
    return (0, ui_port_js_1.toast)('這次開包已處理，請從背包重新選取'); let result; try {
    result = applySupply(runtime_js_1.runtime.state, req, (0, clock_js_1.stamp)());
}
catch (e) {
    return (0, ui_port_js_1.toast)(e.message);
} (0, ledger_js_1.log)('開啟 ' + req.name + ' ×1 → ' + result.contents.map(x => x.name + ' ×' + x.qty).join('、') + '（不加 XP／幣）'); (0, storage_js_1.persist)(); runtime_js_1.runtime.supplyRequest = null; runtime_js_1.runtime.supplyResult = result; (0, ui_port_js_1.render)(); (0, ui_port_js_1.show)('supply'); (0, ui_port_js_1.toast)('物资已放入背包；原補給減少 1 包'); }
function supplyPanel() { const result = runtime_js_1.runtime.supplyResult, req = runtime_js_1.runtime.supplyRequest, def = exports.SUPPLY_DEFINITIONS[result?.name || req?.name]; if (!def)
    return { title: '補給包', html: '<p class="empty">請先從背包選一個可開啟的補給包。</p><button data-panel="inventory">回背包</button>' }; return { title: result ? '補給已拆封' : '先確認，這包裡有什麼', kicker: 'SUPPLY / 非抽獎 · 保證內容', html: `<div class="supply-hero">${(0, dom_js_1.icon)('gift')}<div><span class="eyebrow">${result ? '已存檔 · 物資在背包' : '開啟前預覽 · 尚未扣物品'}</span><h3>${(0, dom_js_1.esc)(def.name)}</h3><p>${result ? '已消耗 1 包，不消耗探索券。' : '開啟會消耗 1 包。不是抽獎，不收取金幣或探索券。'}</p></div></div><div class="supply-contents">${def.contents.map(x => `<article>${(0, inventory_js_1.itemImage)(x.name, true)}<strong>${(0, dom_js_1.esc)(x.name)}</strong><b>×${x.qty}</b><small>保證取得</small></article>`).join('')}</div><div class="note space">修復材料可以保留或回收；維修零件可在回收工坊兌換擺件。補給不治療膚況、不抵銷睡眠不足，也不增加 XP 或生存幣。沒有重新發放舊包。</div><div class="row space">${result ? '<button class="primary" data-supply-back>在背包查看物資 →</button>' : `<button class="primary" data-supply-confirm="${(0, dom_js_1.esc)(req.token)}">確認開啟 1 包</button><button class="outline" data-supply-cancel>取消 · 不消耗</button>`}</div>` }; }

},
"src/features/tasks-query.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateName = exports.courseName = void 0;
exports.taskPriority = taskPriority;
exports.orderedTasks = orderedTasks;
/** features/tasks-query — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const runtime_js_1 = require("src/core/runtime.js");
const study516_query_js_1 = require("src/features/study516-query.js");
function taskPriority(t, day = (0, clock_js_1.today)()) {
    const days = t.due ? Math.round((Date.parse(t.due + 'T12:00:00Z') - Date.parse(day + 'T12:00:00Z')) / 86400000) : null;
    let p = 3, why = '日期未公布／由妳安排';
    if (days !== null) {
        if (days < 0) {
            p = 1;
            why = '日期已過 · 待確認是否已交';
        }
        else if (days === 0) {
            p = 1;
            const ptime = (0, clock_js_1.parts)();
            why = t.time && `${ptime.hour}:${ptime.minute}` > t.time ? '今日時刻已過 · 待確認' : '今天到期' + (t.time ? ' ' + t.time : ' · 時刻待確認');
        }
        else if (days <= 3) {
            p = 1;
            why = `${days} 天內到期`;
        }
        else if (days <= 7) {
            p = 2;
            why = `${days} 天後到期`;
        }
        else {
            p = 3;
            why = `${days} 天後到期`;
        }
    }
    if (t.window) {
        why = t.window + ' · 待確認';
        p = 2;
        const w = t.window.match(/^(\d{1,2})\/(\d{1,2}) 當週$/);
        if (w) {
            const start = day.slice(0, 4) + '-' + w[1].padStart(2, '0') + '-' + w[2].padStart(2, '0');
            const diff = (Date.parse(start + 'T12:00:00Z') - Date.parse(day + 'T12:00:00Z')) / 86400000;
            if (diff >= -6 && diff <= 3) {
                p = 1;
                why = '近期週期 · 先確認日期（' + t.window + '）';
            }
        }
    }
    if (t.priority !== 'auto') {
        p = +t.priority.slice(1);
        why = '妳設定的優先級' + (t.due ? ' · ' + (days < 0 ? '日期已過待確認' : days === 0 ? '今天' : days + ' 天後') : '');
    }
    if (t.id === '516-mid' && (0, study516_query_js_1.examFocusActive)(day)) {
        p = 1;
        why = '期中優先 · 妳指定的目前主線' + (t.due ? ' · ' + t.due : '');
    }
    return { p, why, days, label: ['', 'P1 先處理', 'P2 本週推進', 'P3 可排後'][p] };
}
function orderedTasks(filter = 'all') { return runtime_js_1.runtime.state.tasks.filter(t => t.id !== '516-brightspace' && (filter === 'all' || t.course === filter)).sort((a, b) => { const pa = taskPriority(a), pb = taskPriority(b); return Number(a.status === 'done') - Number(b.status === 'done') || (0, study516_query_js_1.examFocusRank)(a) - (0, study516_query_js_1.examFocusRank)(b) || pa.p - pb.p || (a.due || '9999').localeCompare(b.due || '9999') || a.title.localeCompare(b.title); }); }
const courseName = id => config_js_1.DATA.courses.find(x => x.id === id)?.code || ({ career: '求職主線', life: '生活' }[id] || id);
exports.courseName = courseName;
exports.stateName = { todo: '未開始', inprogress: '進行中', draft: '草稿', ready: '待提交', done: '完成', revised: '修訂中', submitted: '已提交' };

},
"src/features/tasks.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksPanel = tasksPanel;
exports.taskCard = taskCard;
exports.courseCards = courseCards;
exports.complete = complete;
/** features/tasks — extracted from verified 2.3.1; visual/gameplay parity first. */
const config_js_1 = require("src/core/config.js");
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const routines_js_1 = require("src/features/routines.js");
const study516_js_1 = require("src/features/study516.js");
const study516_query_js_1 = require("src/features/study516-query.js");
const tasks_query_js_1 = require("src/features/tasks-query.js");
const dom_js_1 = require("src/ui/dom.js");
const home_js_1 = require("src/ui/home.js");
function tasksPanel() { const all = (0, tasks_query_js_1.orderedTasks)(runtime_js_1.runtime.taskFilter), pending = all.filter(t => t.status !== 'done'), tabs = [['main', '主線／支線'], ['routine', 'Routine'], ['done', '已完成']]; return `<div class="task-tabs">${tabs.map(([k, v]) => `<button data-lane="${k}" aria-pressed="${runtime_js_1.runtime.taskLane === k}" class="${runtime_js_1.runtime.taskLane === k ? 'selected' : ''}">${v}</button>`).join('')}<button class="add-task" data-panel="newtask">＋ 登記任務</button></div>${runtime_js_1.runtime.taskLane === 'routine' ? (0, routines_js_1.routinePanel)() : `<div class="note">P1 先處理 → P2 本週 → P3 可排後。目前另有 GSBA 516 期中置頂；期限仍保留。妳可在期中面板取消置頂或逐項改優先級。未知時刻不假裝已逾期，草稿不等於已提交。</div><div class="filterbar">${[['all', '全部'], ...config_js_1.DATA.courses.map(x => [x.id, x.code]), ['career', '求職'], ['life', '生活']].map(([id, label]) => `<button data-filter="${id}" class="${runtime_js_1.runtime.taskFilter === id ? 'selected' : ''}">${label}</button>`).join('')}</div><div class="row space"><button class="outline" data-panel="tophat">TopHat 章節任務</button><button class="outline" data-panel="journal">Journal 階段</button></div>${runtime_js_1.runtime.taskLane === 'done' ? (all.filter(t => t.status === 'done').map(taskCard).join('') || '<p class="empty">尚無已完成項目。</p>') : [1, 2, 3].map(p => { const list = pending.filter(t => (0, tasks_query_js_1.taskPriority)(t).p === p); return list.length ? `<h3 class="priority-heading p${p}">${['', 'P1 · 先處理', 'P2 · 本週推進', 'P3 · 可以排後'][p]} <span>${list.length}</span></h3>${list.map(taskCard).join('')}` : ''; }).join('') || '<p class="empty">此分類沒有待辦。</p>'}`}`; }
function taskCard(t) {
    const group = (0, study516_query_js_1.studyGroupForTask)(t);
    if (group)
        return (0, study516_js_1.studyTaskCard)(t, group);
    const done = t.status === 'done', pr = (0, tasks_query_js_1.taskPriority)(t);
    return `<article class="taskcard ${done ? 'done' : ''}" data-task-card="${(0, dom_js_1.esc)(t.id)}"><div><div class="task-meta"><span class="pbadge p${pr.p}">P${pr.p}</span><small>${t.lane === 'side' ? '支線' : '主線'} · ${(0, dom_js_1.esc)((0, tasks_query_js_1.courseName)(t.course))} · ${(0, dom_js_1.esc)(pr.why)}</small></div><div class="task-title">${(0, dom_js_1.esc)(t.title)}</div><small class="muted">${(0, dom_js_1.esc)((0, home_js_1.dateLabel)(t))}</small><p>${(0, dom_js_1.esc)(t.detail || '')}</p><span class="reward">${t.rewarded ? '已結算 · 不重複領獎' : `${t.xp} XP / ${t.coins} 生存幣 · 網站本機`}</span>${t.source ? `<small class="muted" style="display:block">來源：${(0, dom_js_1.esc)(t.source)}</small>` : ''}</div><div class="task-tools"><span class="tag">${t.type === 'assignment' && done ? '已提交' : tasks_query_js_1.stateName[t.status]}</span>${!done ? `<button class="primary-action" data-complete="${(0, dom_js_1.esc)(t.id)}">${t.type === 'assignment' ? '確認已提交' : '確認完成'}</button><select aria-label="${(0, dom_js_1.esc)(t.title)} 的進度" data-stage="${(0, dom_js_1.esc)(t.id)}">${['todo', 'inprogress', 'draft', 'ready'].map(x => `<option value="${x}" ${t.status === x ? 'selected' : ''}>${tasks_query_js_1.stateName[x]}</option>`).join('')}</select><select aria-label="${(0, dom_js_1.esc)(t.title)} 的優先級" data-priority="${(0, dom_js_1.esc)(t.id)}">${[['auto', '自動排序'], ['p1', 'P1 先處理'], ['p2', 'P2 本週'], ['p3', 'P3 排後']].map(([k, l]) => `<option value="${k}" ${t.priority === k ? 'selected' : ''}>${l}</option>`).join('')}</select><button class="link" data-edit-task="${(0, dom_js_1.esc)(t.id)}">編輯日期／內容</button>` : ''}</div></article>`;
}
function courseCards() { return config_js_1.DATA.courses.map(c => `<article class="card"><span class="eyebrow" style="color:${c.color}">${c.code}</span><h3>${c.name}</h3><p class="weight">${c.weight}</p><p>${c.notes}</p><p><span class="tag">AI 使用規則</span> ${c.policy}</p><small class="muted">來源：${c.source}</small><div class="space"><button data-course="${c.id}">進入學院 ${(0, dom_js_1.icon)('arrow')}</button></div></article>`).join(''); }
function complete(id) {
    const t = runtime_js_1.runtime.state.tasks.find(x => x.id === id);
    if (!t || t.status === 'done')
        return;
    const group = (0, study516_query_js_1.studyGroupForTask)(t);
    if (group) {
        (0, study516_js_1.studySubmit)(group.id);
        return;
    }
    const submitted = t.type === 'assignment';
    if (!confirm(submitted ? `確認「${t.title}」已在課程平台提交？\n草稿不算已提交。` : `確認妳已實際完成「${t.title}」？`))
        return;
    t.status = 'done';
    if (!t.rewarded) {
        (0, ledger_js_1.reward)('task:' + t.id, t.xp, t.coins);
        t.rewarded = true;
    }
    (0, ledger_js_1.log)(`${submitted ? '已提交' : '已完成'}：${t.title}（本機 ＋${t.xp} XP／＋${t.coins} 幣）`);
    (0, storage_js_1.persist)();
    (0, ui_port_js_1.render)();
    (0, ui_port_js_1.show)('tasks', true);
    (0, ui_port_js_1.toast)('已記錄。獎勵只記在網站本機帳本，不疊加聊天主帳。');
}

},
"src/main.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = startGame;
const ui_port_js_1 = require("src/core/ui-port.js");
const home_js_1 = require("src/ui/home.js");
const router_js_1 = require("src/ui/router.js");
const feedback_js_1 = require("src/ui/feedback.js");
const bootstrap_js_1 = require("src/core/bootstrap.js");
const events_js_1 = require("src/ui/events.js");
const boot_tail_js_1 = require("src/core/boot-tail.js");
const lifecycle_js_1 = require("src/core/lifecycle.js");
const public_api_js_1 = require("src/core/public-api.js");
const local_js_1 = require("src/assistant/local.js");
const art_js_1 = require("src/data/art.js");
const game_js_1 = require("src/data/game.js");
const release_js_1 = require("src/core/release.js");
// One entry point. Existing UI/data hooks are kept read-only compatible.
let started = false;
function startGame() {
    if (started)
        return;
    started = true;
    window.DORM_ART = art_js_1.ART;
    window.DORM_COMPANION_ART = art_js_1.COMPANION_ART;
    window.DORM_DATA = game_js_1.DATA;
    window.DORM_RELEASE = release_js_1.RELEASE;
    (0, ui_port_js_1.configureUI)({ render: home_js_1.render, show: router_js_1.show, close: router_js_1.close, warn: feedback_js_1.warn, toast: feedback_js_1.toast });
    (0, bootstrap_js_1.initializeGameState)();
    (0, events_js_1.installGameEvents)();
    (0, boot_tail_js_1.bindFixtures)();
    (0, public_api_js_1.exposePublicAPI)();
    (0, lifecycle_js_1.startLifecycle)();
    (0, local_js_1.startAssistant)();
}
startGame();

},
"src/ui/appearance-view.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portraitView = portraitView;
/** Reuses the exact locked portrait. The canvas is ONLY a local transparent tint. */
const dom_js_1 = require("src/ui/dom.js");
function portraitView({ original = false, className = '', caption = '' } = {}) {
    return `<figure class="appearance-figure ${className}"><span class="appearance-portrait"><img src="assets/d79fce48ff3e5ab6f33496d6425869867beff25ae2b33b960bdc50ebbf41c0d6.webp" alt="Lydia 核准原貌，固定五官與髮飾" draggable="false"><canvas width="364" height="335" data-face-map="portrait" data-appearance-original="${original}" aria-hidden="true"></canvas></span>${caption ? `<figcaption>${(0, dom_js_1.esc)(caption)}</figcaption>` : ''}</figure>`;
}

},
"src/ui/dom.js": function(module, exports, require) {
"use strict";
/** ui/dom — extracted from verified 2.3.1; visual/gameplay parity first. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.icon = exports.ICONS = exports.esc = exports.$ = void 0;
exports.icons = icons;
const $ = id => document.getElementById(id);
exports.$ = $;
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
exports.esc = esc;
exports.ICONS = {
    heart: 'M12 21 3 12a5 5 0 0 1 7-7l2 2 2-2a5 5 0 0 1 7 7Z',
    chart: 'M3 3v18h18M7 17v-5m5 5V8m5 9V5',
    home: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9', book: 'M12 5v16M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z',
    check: 'M9 5H4v16h16V5h-5M9 3h6v4H9ZM8 13l3 3 5-6', coffee: 'M3 8h13v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM16 9h2a3 3 0 1 1 0 6h-2M6 3v2m5-2v2M2 22h17',
    bag: 'M8 5V4a4 4 0 0 1 8 0v1M6 5h12l2 5v11H4V10ZM4 11h16M7 15h10v6M12 6v3', hammer: 'm14 3 7 7-3 3-3-3-8 10-4-4 10-8-3-3 4-2Z', lock: 'M6 10h12v11H6ZM8 10V7a4 4 0 0 1 8 0v3M12 14v3', paw: 'M7 20c-4-1-4-4-1-6l3-3c2-2 4-2 6 0l3 3c3 2 3 5-1 6l-5-1ZM6 7c-3 1-4-4-2-5s5 4 2 5ZM11 5c-3 0-3-5-1-5s4 5 1 5ZM17 7c-3-1 0-6 2-5s1 6-2 5ZM20 12c-3-1 0-5 2-4s0 5-2 4',
    moon: 'M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11Z', sliders: 'M5 3v4m0 4v10m7-18v10m0 4v4m7-18v2m0 4v12M2 7h6v4H2Zm7 6h6v4H9Zm7-8h6v4h-6Z',
    coin: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 6v12m3-9c0-3-6-3-6 0s6 3 6 6-6 3-6 0', ticket: 'M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4ZM15 7v2m0 2v2m0 2v2',
    save: 'M4 3h13l4 4v14H3V3Zm3 0v6h10V3M7 21v-8h10v8', panel: 'M3 4h18v16H3ZM15 4v16', bed: 'M3 20V9m18 11v-8H3m1-4V4h16v8M6 8h4m4 0h4M3 17h18', door: 'M5 21V3h14v18ZM5 21h14M15 11v2',
    hanger: 'M9 5c0-4 6-4 6 0 0 2-3 2-3 4v2L2 17v3h20v-3l-10-6', window: 'M3 3h18v18H3ZM12 3v18M3 12h18', target: 'M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    chevron: 'm9 5 7 7-7 7', arrow: 'M3 12h18m-6-6 6 6-6 6', feather: 'M4 21 17 8M4 21l2-8L17 2c4-2 7 2 5 5L11 18ZM10 7l7 7', layers: 'm12 2 10 6-10 6L2 8Zm-9 11 9 5 9-5M3 18l9 5 9-5', timer: 'M9 2h6m-3 0v3M19 5l2 2M12 8v6l4 2M21 14a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    compass: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM16 8l-3 5-5 3 3-5Z', gift: 'M3 9h18v4H3ZM5 13v8h14v-8M12 9v12M12 9C2 8 5-2 10 5l2 4c10-1 7-11 2-4Z', close: 'M5 5l14 14M19 5 5 19'
};
const icon = k => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${exports.ICONS[k] || exports.ICONS.compass}"/></svg>`;
exports.icon = icon;
function icons(root = document) { root.querySelectorAll('[data-icon]').forEach(e => { e.outerHTML = (0, exports.icon)(e.dataset.icon); }); }

},
"src/ui/events.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installGameEvents = installGameEvents;
/** ui/events — extracted from verified 2.3.1; visual/gameplay parity first. */
const comfort_js_1 = require("src/features/comfort.js");
const skill_tree_js_1 = require("src/features/skill-tree.js");
const growth_js_1 = require("src/features/growth.js");
const supplies_js_1 = require("src/features/supplies.js");
const build_js_1 = require("src/features/build.js");
const appearance_js_1 = require("src/features/appearance.js");
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const download_js_1 = require("src/core/download.js");
const files_js_1 = require("src/core/files.js");
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const schema_js_1 = require("src/core/schema.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const build_js_2 = require("src/features/build.js");
const companion_js_1 = require("src/features/companion.js");
const decor_js_1 = require("src/features/decor.js");
const inventory_js_1 = require("src/features/inventory.js");
const inventory_model_js_1 = require("src/features/inventory-model.js");
const kitchen_js_1 = require("src/features/kitchen.js");
const routines_js_1 = require("src/features/routines.js");
const routines_model_js_1 = require("src/features/routines-model.js");
const study516_js_1 = require("src/features/study516.js");
const tasks_js_1 = require("src/features/tasks.js");
const tasks_query_js_1 = require("src/features/tasks-query.js");
const dom_js_1 = require("src/ui/dom.js");
const forms_js_1 = require("src/ui/forms.js");
const home_js_1 = require("src/ui/home.js");
function installGameEvents() {
    document.addEventListener('click', (0, storage_js_1.guarded)(e => {
        const b = e.target.closest('button');
        if (!b || b.disabled)
            return;
        if (b.dataset.skillTrack) {
            (0, skill_tree_js_1.selectTree)(b.dataset.skillTrack);
            return;
        }
        if (b.dataset.skillNode) {
            (0, skill_tree_js_1.openNode)(b.dataset.skillNode);
            return;
        }
        if (b.dataset.credential) {
            (0, skill_tree_js_1.openCredential)(b.dataset.credential);
            return;
        }
        if (b.dataset.credentialDelete) {
            (0, skill_tree_js_1.deleteCredential)(b.dataset.credentialDelete);
            return;
        }
        if (b.hasAttribute('data-rest-now')) {
            (0, comfort_js_1.restNow)();
            return;
        }
        if (b.hasAttribute('data-still-awake')) {
            (0, comfort_js_1.stillAwake)();
            return;
        }
        if (b.hasAttribute('data-groom-today')) {
            (0, comfort_js_1.groomToday)();
            return;
        }
        if (b.hasAttribute('data-auto-wake-toggle')) {
            (0, comfort_js_1.toggleAutoWake)();
            return;
        }
        if (b.dataset.comfortMode) {
            (0, comfort_js_1.comfortMode)(b.dataset.comfortMode);
            return;
        }
        if (b.hasAttribute('data-build-archive')) {
            (0, build_js_1.archiveBuild)();
            return;
        }
        if (b.hasAttribute('data-build-expand')) {
            (0, build_js_1.toggleBuildCard)();
            return;
        }
        if (b.hasAttribute('data-build-next')) {
            (0, build_js_1.nextBuildTask)();
            return;
        }
        if (b.dataset.growthTab) {
            if (b.dataset.growthTab === 'skillTree') {
                (0, ui_port_js_1.show)('skillTree');
                return;
            }
            runtime_js_1.runtime.profileTab = b.dataset.growthTab;
            (0, ui_port_js_1.show)('profile');
            return;
        }
        if (b.dataset.growthNew) {
            const panel = { goal: 'growthGoal', career: 'careerRecord', skill: 'skillEvidence', exercise: 'exercise' }[b.dataset.growthNew];
            if (panel)
                (0, growth_js_1.openGrowthForm)(panel);
            return;
        }
        if (b.dataset.growthEdit) {
            const panel = { career: 'careerRecord', skill: 'skillEvidence', exercise: 'exercise' }[b.dataset.growthEdit];
            if (panel)
                (0, growth_js_1.openGrowthForm)(panel, b.dataset.recordId);
            return;
        }
        if (b.dataset.growthDelete) {
            (0, growth_js_1.deleteGrowthRecord)(b.dataset.growthDelete, b.dataset.recordId);
            return;
        }
        if (b.dataset.supplyPreview) {
            (0, supplies_js_1.prepareSupply)(b.dataset.supplyPreview);
            return;
        }
        if (b.dataset.supplyConfirm) {
            (0, supplies_js_1.openSupply)(b.dataset.supplyConfirm);
            return;
        }
        if (b.hasAttribute('data-supply-cancel') || b.hasAttribute('data-supply-back')) {
            runtime_js_1.runtime.supplyRequest = null;
            runtime_js_1.runtime.supplyResult = null;
            runtime_js_1.runtime.bagTab = 'items';
            runtime_js_1.runtime.bagFilter = 'all';
            runtime_js_1.runtime.bagSelected = '維修零件';
            (0, ui_port_js_1.show)('inventory');
            return;
        }
        if (b.hasAttribute('data-preview-appearance')) {
            (0, appearance_js_1.previewAppearance)(Number(b.dataset.previewAppearance));
            return;
        }
        if (b.hasAttribute('data-appearance-restore')) {
            (0, appearance_js_1.clearAppearancePreview)();
            return;
        }
        if (b.hasAttribute('data-appearance-room')) {
            (0, appearance_js_1.previewAppearanceInRoom)();
            return;
        }
        if (b.hasAttribute('data-appearance-toggle')) {
            (0, appearance_js_1.toggleAppearance)();
            return;
        }
        if (b.hasAttribute('data-clear-health-today')) {
            (0, appearance_js_1.clearTodayObservation)();
            return;
        }
        if (b.dataset.chapterStart) {
            (0, study516_js_1.chapterStart)(b.dataset.chapterStart);
            return;
        }
        if (b.dataset.studySubmit) {
            (0, study516_js_1.studySubmit)(b.dataset.studySubmit);
            return;
        }
        if (b.hasAttribute('data-study-focus-toggle')) {
            runtime_js_1.runtime.state.study516.focusEnabled = !runtime_js_1.runtime.state.study516.focusEnabled;
            (0, storage_js_1.persist)();
            (0, ui_port_js_1.render)();
            (0, ui_port_js_1.show)('exam516', true);
            return;
        }
        if (b.hasAttribute('data-study-checked')) {
            const r = runtime_js_1.runtime.state.routines.find(r => r.id === 'r-tophat');
            if (!r || !r.enabled || (0, routines_model_js_1.routineDone)(r))
                return;
            runtime_js_1.runtime.state.routineHistory[r.id + '|' + (0, clock_js_1.cycleKey)(r)] = (0, clock_js_1.stamp)();
            (0, ledger_js_1.log)('本週已查看 TopHat 發布情況；不自動生成新章節、不發獎。');
            (0, storage_js_1.persist)();
            (0, ui_port_js_1.render)();
            (0, ui_port_js_1.show)('routine', true);
            return;
        }
        if (b.dataset.bagTab) {
            runtime_js_1.runtime.bagTab = ['items', 'draw', 'craft'].includes(b.dataset.bagTab) ? b.dataset.bagTab : 'items';
            (0, ui_port_js_1.show)('inventory');
            return;
        }
        if (b.dataset.bagFilter) {
            runtime_js_1.runtime.bagFilter = b.dataset.bagFilter;
            runtime_js_1.runtime.bagPage = 0;
            runtime_js_1.runtime.bagSelected = null;
            (0, ui_port_js_1.show)('inventory', true);
            return;
        }
        if (b.hasAttribute('data-bag-page')) {
            runtime_js_1.runtime.bagPage = Math.max(0, Number(b.dataset.bagPage) || 0);
            runtime_js_1.runtime.bagSelected = null;
            (0, ui_port_js_1.show)('inventory', true);
            return;
        }
        if (b.dataset.bagSelect) {
            (0, inventory_js_1.selectBagItem)(b.dataset.bagSelect);
            return;
        }
        if (b.dataset.bagReveal) {
            runtime_js_1.runtime.bagTab = 'items';
            runtime_js_1.runtime.bagFilter = 'all';
            runtime_js_1.runtime.bagSelected = b.dataset.bagReveal;
            const idx = (0, inventory_js_1.bagItems)().findIndex(x => x.name === runtime_js_1.runtime.bagSelected);
            runtime_js_1.runtime.bagPage = Math.max(0, Math.floor(idx / inventory_model_js_1.BAG_PAGE_SIZE));
            (0, ui_port_js_1.show)('inventory');
            return;
        }
        if (b.dataset.bagLock) {
            const n = b.dataset.bagLock;
            if (!runtime_js_1.runtime.state.items.some(x => x.name === n && x.qty > 0))
                return;
            runtime_js_1.runtime.state.inventoryLocks[n] = !runtime_js_1.runtime.state.inventoryLocks[n];
            (0, storage_js_1.persist)();
            (0, ui_port_js_1.render)();
            (0, ui_port_js_1.show)('inventory', true);
            return;
        }
        if (b.dataset.bagPlace) {
            const id = b.dataset.bagPlace;
            (0, decor_js_1.placeDecor)(id);
            runtime_js_1.runtime.bagTab = 'items';
            (0, ui_port_js_1.show)('inventory', true);
            return;
        }
        if (b.dataset.bagRemove) {
            const id = b.dataset.bagRemove;
            (0, decor_js_1.removeDecor)(id);
            runtime_js_1.runtime.bagTab = 'items';
            (0, ui_port_js_1.show)('inventory', true);
            return;
        }
        if (b.hasAttribute('data-build-open-goal')) {
            (0, build_js_2.openBuildGoal)();
            return;
        }
        if (b.hasAttribute('data-build-install')) {
            (0, build_js_2.installWorklight)();
            return;
        }
        if (b.hasAttribute('data-build-preview')) {
            (0, build_js_2.previewWorklight)();
            return;
        }
        if (b.hasAttribute('data-build-end-preview')) {
            runtime_js_1.runtime.buildPreview = false;
            (0, build_js_2.renderBuild)();
            return;
        }
        if (b.hasAttribute('data-build-signal')) {
            (0, build_js_2.readBuildSignal)();
            return;
        }
        if (b.hasAttribute('data-build-toggle')) {
            if (runtime_js_1.runtime.state.firstBuild.installedAt) {
                runtime_js_1.runtime.state.firstBuild.lampOn = !runtime_js_1.runtime.state.firstBuild.lampOn;
                (0, storage_js_1.persist)();
                (0, ui_port_js_1.render)();
                (0, ui_port_js_1.show)('build');
            }
            return;
        }
        if (b.dataset.previewDecor) {
            (0, decor_js_1.previewDecor)(b.dataset.previewDecor);
            return;
        }
        if (b.dataset.placeDecor) {
            (0, decor_js_1.placeDecor)(b.dataset.placeDecor);
            return;
        }
        if (b.dataset.removeDecor) {
            (0, decor_js_1.removeDecor)(b.dataset.removeDecor);
            return;
        }
        if (b.dataset.decorSource) {
            (0, decor_js_1.decorSource)(b.dataset.decorSource);
            return;
        }
        if (b.hasAttribute('data-end-decor')) {
            runtime_js_1.runtime.decorPreview = null;
            runtime_js_1.runtime.decorBefore = false;
            (0, decor_js_1.renderDecor)();
            return;
        }
        if (b.hasAttribute('data-decor-before')) {
            (0, ui_port_js_1.close)();
            runtime_js_1.runtime.decorPreview = null;
            runtime_js_1.runtime.decorBefore = true;
            (0, decor_js_1.renderDecor)();
            (0, dom_js_1.$)('scene').scrollIntoView({ block: 'center', behavior: 'smooth' });
            return;
        }
        if (b.dataset.lightmode) {
            runtime_js_1.runtime.visualPreview = ['auto', 'dawn', 'day', 'dusk', 'night'].includes(b.dataset.lightmode) ? b.dataset.lightmode : 'auto';
            (0, home_js_1.updateLight)();
            return;
        }
        if (b.dataset.lane) {
            runtime_js_1.runtime.taskLane = b.dataset.lane;
            (0, ui_port_js_1.show)('tasks');
            return;
        }
        if (b.dataset.routineDone) {
            (0, routines_js_1.routineComplete)(b.dataset.routineDone);
            return;
        }
        if (b.dataset.routinePause) {
            const r = runtime_js_1.runtime.state.routines.find(r => r.id === b.dataset.routinePause);
            if (r) {
                r.enabled = !r.enabled;
                (0, storage_js_1.persist)();
                (0, ui_port_js_1.render)();
                (0, ui_port_js_1.show)('routine', true);
            }
            return;
        }
        if (b.dataset.openTask) {
            runtime_js_1.runtime.taskFilter = 'all';
            runtime_js_1.runtime.taskLane = 'main';
            (0, ui_port_js_1.show)('tasks');
            const el = [...document.querySelectorAll('[data-task-card]')].find(e => e.dataset.taskCard === b.dataset.openTask);
            el?.scrollIntoView({ block: 'center' });
            return;
        }
        if (b.dataset.editTask) {
            runtime_js_1.runtime.selectedItem = b.dataset.editTask;
            (0, ui_port_js_1.show)('editTask');
            return;
        }
        if (b.dataset.item) {
            runtime_js_1.runtime.selectedItem = b.dataset.item;
            (0, ui_port_js_1.show)('item');
            return;
        }
        if (b.dataset.lockItem) {
            const n = b.dataset.lockItem;
            runtime_js_1.runtime.state.inventoryLocks[n] = !runtime_js_1.runtime.state.inventoryLocks[n];
            (0, storage_js_1.persist)();
            runtime_js_1.runtime.selectedItem = n;
            (0, ui_port_js_1.render)();
            (0, ui_port_js_1.show)('item');
            return;
        }
        if (b.dataset.salvage) {
            (0, inventory_js_1.salvageItem)(b.dataset.salvage);
            return;
        }
        if (b.dataset.craft) {
            (0, inventory_js_1.craftItem)(b.dataset.craft);
            return;
        }
        if (b.hasAttribute('data-home')) {
            (0, ui_port_js_1.close)();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (b.dataset.panel) {
            if (['exercise', 'careerRecord', 'skillEvidence'].includes(b.dataset.panel))
                runtime_js_1.runtime.growthEditing = null;
            (0, ui_port_js_1.show)(b.dataset.panel);
            return;
        }
        if (b.dataset.course) {
            runtime_js_1.runtime.taskFilter = b.dataset.course;
            runtime_js_1.runtime.taskLane = 'main';
            (0, ui_port_js_1.show)('tasks');
            return;
        }
        if (b.dataset.filter) {
            runtime_js_1.runtime.taskFilter = b.dataset.filter;
            (0, ui_port_js_1.show)('tasks');
            return;
        }
        if (b.dataset.taskdetail) {
            runtime_js_1.runtime.taskFilter = runtime_js_1.runtime.state.tasks.find(t => t.id === b.dataset.taskdetail)?.course || 'all';
            (0, ui_port_js_1.show)('tasks');
            return;
        }
        if (b.dataset.complete) {
            (0, tasks_js_1.complete)(b.dataset.complete);
            return;
        }
        if (b.dataset.chapter) {
            (0, kitchen_js_1.doChapter)(b.dataset.chapter);
            return;
        }
        if (b.dataset.cook) {
            (0, kitchen_js_1.cook)(b.dataset.cook);
            return;
        }
        if (b.dataset.focus) {
            runtime_js_1.runtime.focus = { end: Date.now() + Number(b.dataset.focus) * 60000 };
            (0, ui_port_js_1.show)('focus');
            (0, dom_js_1.$)('focusSummary').textContent = '計時中 · ' + b.dataset.focus + ' 分鐘';
            return;
        }
        switch (b.id) {
            case 'exportOriginal':
                (0, storage_js_1.exportOriginal)();
                break;
            case 'exportBeforeUpdate':
                (0, storage_js_1.exportBeforeUpdate)();
                break;
            case 'reloadProtected':
                location.reload();
                break;
            case 'closeDialog':
                (0, ui_port_js_1.close)();
                break;
            case 'toggleRail':
                document.body.classList.toggle('rail-hidden');
                b.setAttribute('aria-expanded', String(!document.body.classList.contains('rail-hidden')));
                break;
            case 'hotspotToggle':
                (0, forms_js_1.toggleHotspots)();
                break;
            case 'toggleHotspotsSetting':
                (0, forms_js_1.toggleHotspots)();
                (0, ui_port_js_1.show)('settings');
                break;
            case 'checkin':
                (0, kitchen_js_1.checkin)();
                break;
            case 'dogPresent':
                runtime_js_1.runtime.dogOverride = 'present';
                (0, companion_js_1.renderDog)();
                (0, ui_port_js_1.toast)('預覽：德牧回到墊子。女主與房間沒有換圖。');
                break;
            case 'dogAway':
                runtime_js_1.runtime.dogOverride = 'away';
                (0, companion_js_1.renderDog)();
                (0, ui_port_js_1.toast)('預覽：牠去走廊晃晃。墊子會留在原位。');
                break;
            case 'dogAuto':
                runtime_js_1.runtime.dogOverride = null;
                (0, companion_js_1.renderDog)();
                (0, ui_port_js_1.toast)('已恢復洛杉磯時段。');
                break;
            case 'lookAtDog':
                (0, ui_port_js_1.close)();
                if (innerWidth <= 640)
                    (0, dom_js_1.$)('sceneScroll').scrollTo({ left: 360, behavior: 'smooth' });
                break;
            case 'petDog':
                (0, ui_port_js_1.toast)('牠抬起耳朵看妳，又很認真地把下巴放回墊子。摸摸不扣錢。');
                break;
            case 'draw':
                (0, inventory_js_1.draw)();
                break;
            case 'exportSave':
                (0, files_js_1.exportSave)();
                break;
            case 'exportHistory':
                try {
                    const raw = localStorage.getItem(config_js_1.BACKUP);
                    if (!raw)
                        return (0, ui_port_js_1.toast)('還沒有上一次備份。');
                    (0, download_js_1.download)(raw, `LastDorm_v19_previous_${(0, clock_js_1.today)()}.json`);
                }
                catch {
                    (0, ui_port_js_1.toast)('無法讀取上一次備份。');
                }
                break;
            case 'confirmImport':
                (0, files_js_1.confirmImport)();
                break;
            case 'cancelImport':
                runtime_js_1.runtime.importCandidate = null;
                (0, dom_js_1.$)('importPreview').innerHTML = '';
                break;
            case 'stopFocus':
                runtime_js_1.runtime.focus = null;
                (0, ui_port_js_1.show)('focus');
                (0, dom_js_1.$)('focusSummary').textContent = '5 / 15 / 25 分鐘';
                (0, ui_port_js_1.toast)('計時已停止，不影響任何獎勵。');
                break;
            case 'resetSave':
                if (confirm('先確認已匯出備份。要重置網站本機紀錄？') && confirm('再次確認：回到 140 XP / 75 幣，只重置這個版本。')) {
                    runtime_js_1.runtime.state = (0, schema_js_1.initial)();
                    (0, storage_js_1.persist)();
                    (0, ui_port_js_1.render)();
                    (0, ui_port_js_1.show)('saves');
                }
                break;
        }
    }));
    document.addEventListener('submit', (0, storage_js_1.guarded)(e => {
        if (e.target instanceof HTMLFormElement) {
            e.preventDefault();
            (0, forms_js_1.submitForm)(e.target);
        }
    }));
    document.addEventListener('change', (0, storage_js_1.guarded)(e => {
        const el = e.target;
        if (el.id === 'bagSort') {
            runtime_js_1.runtime.bagSort = ['rarity', 'quantity', 'name'].includes(el.value) ? el.value : 'rarity';
            runtime_js_1.runtime.bagPage = 0;
            runtime_js_1.runtime.bagSelected = null;
            (0, ui_port_js_1.show)('inventory', true);
            return;
        }
        if (el.id === 'importSave') {
            (0, files_js_1.importSave)(el.files?.[0]);
            el.value = '';
            return;
        }
        if (el.dataset.priority) {
            const t = runtime_js_1.runtime.state.tasks.find(t => t.id === el.dataset.priority);
            if (t && ['auto', 'p1', 'p2', 'p3'].includes(el.value)) {
                t.priority = el.value;
                (0, storage_js_1.persist)();
                (0, ui_port_js_1.render)();
                (0, ui_port_js_1.show)('tasks', true);
            }
            return;
        }
        if (el.dataset.stage) {
            const t = runtime_js_1.runtime.state.tasks.find(x => x.id === el.dataset.stage);
            if (t && t.status !== 'done' && ['todo', 'inprogress', 'draft', 'ready'].includes(el.value)) {
                t.status = el.value;
                (0, storage_js_1.persist)();
                (0, ui_port_js_1.render)();
                (0, ui_port_js_1.show)('tasks', true);
            }
        }
        if (el.dataset.journal !== undefined) {
            const i = Number(el.dataset.journal);
            if (runtime_js_1.runtime.state.journal[i] && ['todo', 'draft', 'revised', 'ready', 'submitted'].includes(el.value)) {
                runtime_js_1.runtime.state.journal[i].status = el.value;
                (0, ledger_js_1.log)(`Journal 第${i + 1}篇：${tasks_query_js_1.stateName[el.value]}（狀態紀錄，不另發 XP）`);
                (0, storage_js_1.persist)();
                (0, ui_port_js_1.render)();
                (0, ui_port_js_1.show)('journal', true);
            }
        }
    }));
    (0, dom_js_1.$)('dialog').addEventListener('click', e => {
        if (e.target === (0, dom_js_1.$)('dialog')) {
            const r = (0, dom_js_1.$)('dialog').getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
                (0, ui_port_js_1.close)();
        }
    });
    (0, dom_js_1.$)('dialog').addEventListener('close', () => { runtime_js_1.runtime.activePanel = ''; if (!runtime_js_1.runtime.appearanceRoomPreview)
        (0, appearance_js_1.clearAppearancePreview)(); });
    document.querySelector('.brand').addEventListener('click', () => (0, ui_port_js_1.close)());
    for (const img of document.images)
        img.addEventListener('error', () => (0, ui_port_js_1.warn)('圖片載入失敗：' + (img.getAttribute('src') || '未知') + '。請確認 assets 與 index.html 位於同一資料夾。'));
}

},
"src/ui/feedback.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = warn;
exports.toast = toast;
/** ui/feedback — extracted from verified 2.3.1; visual/gameplay parity first. */
const runtime_js_1 = require("src/core/runtime.js");
const dom_js_1 = require("src/ui/dom.js");
function warn(text) { (0, dom_js_1.$)('storageWarning').textContent = text; (0, dom_js_1.$)('storageWarning').hidden = false; (0, dom_js_1.$)('saveStatus').textContent = '尚未可靠儲存 · 請匯出 JSON'; }
function toast(text) { (0, dom_js_1.$)('toast').textContent = text; (0, dom_js_1.$)('toast').hidden = false; clearTimeout(runtime_js_1.runtime.toastTimer); runtime_js_1.runtime.toastTimer = setTimeout(() => (0, dom_js_1.$)('toast').hidden = true, 4500); }

},
"src/ui/forms.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitForm = submitForm;
exports.toggleHotspots = toggleHotspots;
/** ui/forms — extracted from verified 2.3.1; visual/gameplay parity first. */
const skill_tree_js_1 = require("src/features/skill-tree.js");
const comfort_js_1 = require("src/features/comfort.js");
const growth_js_1 = require("src/features/growth.js");
const health_js_1 = require("src/features/health.js");
const ledger_js_1 = require("src/core/ledger.js");
const runtime_js_1 = require("src/core/runtime.js");
const storage_js_1 = require("src/core/storage.js");
const ui_port_js_1 = require("src/core/ui-port.js");
const utils_js_1 = require("src/core/utils.js");
const build_js_1 = require("src/features/build.js");
const study516_js_1 = require("src/features/study516.js");
function submitForm(form) {
    const fd = new FormData(form);
    const formId = form.getAttribute('id');
    const growthForms = { skillNodeForm: skill_tree_js_1.saveNode, credentialForm: skill_tree_js_1.saveCredential, wakeForm: comfort_js_1.saveWakeForm, complexionForm: comfort_js_1.saveComplexion, growthGoalForm: growth_js_1.saveGoal, careerRecordForm: growth_js_1.saveCareerRecord, skillEvidenceForm: growth_js_1.saveSkillEvidence, exerciseForm: growth_js_1.saveExercise, pilatesGoalForm: growth_js_1.savePilatesGoal };
    if (growthForms[formId]) {
        growthForms[formId](fd);
        return;
    }
    if (formId === 'simpleChapterForm') {
        (0, study516_js_1.addSimpleChapter)(fd);
        return;
    }
    if (formId === 'buildGoalForm') {
        (0, build_js_1.acceptBuildGoal)(String(fd.get('goalKey') || ''));
        return;
    }
    if (formId === 'newtaskForm') {
        const title = String(fd.get('title') || '').trim(), xp = Number(fd.get('xp')), repeat = String(fd.get('repeat') || 'once');
        if (!title || title.length > 160 || !(0, utils_js_1.num)(xp, 1, 100))
            return (0, ui_port_js_1.toast)('請確認名稱與難度');
        if (['daily', 'weekly'].includes(repeat)) {
            runtime_js_1.runtime.state.routines.push({ id: (0, utils_js_1.uid)(), title, course: String(fd.get('course')), repeat, xp: Math.min(xp, 15), coins: 0, action: '', enabled: true, detail: String(fd.get('detail') || '').slice(0, 1000) });
            (0, ledger_js_1.log)('新增例行任務：' + title);
            (0, storage_js_1.persist)();
            (0, ui_port_js_1.render)();
            (0, ui_port_js_1.show)('routine');
        }
        else {
            runtime_js_1.runtime.state.tasks.push({ id: (0, utils_js_1.uid)(), title, course: String(fd.get('course')), type: String(fd.get('type')), due: String(fd.get('due') || '') || null, time: String(fd.get('time') || '') || null, detail: String(fd.get('detail') || '').trim(), priority: ['p1', 'p2', 'p3'].includes(fd.get('priority')) ? String(fd.get('priority')) : 'auto', lane: fd.get('course') === 'life' ? 'side' : 'main', xp, coins: Math.ceil(xp / 3), status: 'todo', rewarded: false });
            (0, ledger_js_1.log)('新增任務：' + title);
            (0, storage_js_1.persist)();
            (0, ui_port_js_1.render)();
            runtime_js_1.runtime.taskLane = 'main';
            (0, ui_port_js_1.show)('tasks');
        }
        (0, ui_port_js_1.toast)('已登記；建立本身不領獎。');
    }
    if (formId === 'editTaskForm') {
        const t = runtime_js_1.runtime.state.tasks.find(t => t.id === fd.get('taskId'));
        if (!t || t.status === 'done')
            return;
        const title = String(fd.get('title') || '').trim();
        if (!title)
            return;
        t.title = title.slice(0, 160);
        t.due = String(fd.get('due') || '') || null;
        t.time = String(fd.get('time') || '') || null;
        t.detail = String(fd.get('detail') || '').slice(0, 3000);
        t.window = '';
        (0, ledger_js_1.log)('更新任務日期／內容：' + t.title);
        (0, storage_js_1.persist)();
        (0, ui_port_js_1.render)();
        (0, ui_port_js_1.show)('tasks');
    }
    if (formId === 'healthForm')
        (0, health_js_1.saveHealthObservation)(fd);
}
function toggleHotspots() { runtime_js_1.runtime.state.settings.hotspots = !runtime_js_1.runtime.state.settings.hotspots; (0, storage_js_1.persist)(); (0, ui_port_js_1.render)(); }

},
"src/ui/home.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPlanner = renderPlanner;
exports.updateLight = updateLight;
exports.renderClock = renderClock;
exports.dateLabel = dateLabel;
exports.render = render;
/** ui/home — extracted from verified 2.3.1; visual/gameplay parity first. */
const growth_js_1 = require("src/features/growth.js");
const appearance_js_1 = require("src/features/appearance.js");
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const runtime_js_1 = require("src/core/runtime.js");
const art_js_1 = require("src/data/art.js");
const build_js_1 = require("src/features/build.js");
const companion_js_1 = require("src/features/companion.js");
const decor_js_1 = require("src/features/decor.js");
const inventory_js_1 = require("src/features/inventory.js");
const routines_js_1 = require("src/features/routines.js");
const routines_model_js_1 = require("src/features/routines-model.js");
const study516_query_js_1 = require("src/features/study516-query.js");
const tasks_query_js_1 = require("src/features/tasks-query.js");
const dom_js_1 = require("src/ui/dom.js");
function renderPlanner() {
    const all = (0, tasks_query_js_1.orderedTasks)(), pending = all.filter(t => t.status !== 'done'), urgent = pending.filter(t => (0, tasks_query_js_1.taskPriority)(t).p === 1);
    (0, dom_js_1.$)('planCounts').textContent = `${pending.length} 項待辦 · ${urgent.length} 項優先`;
    const next = pending[0];
    (0, dom_js_1.$)('nextTask').innerHTML = next ? `<span class="eyebrow">NEXT ACTION · ${(0, dom_js_1.esc)((0, tasks_query_js_1.courseName)(next.course))}</span><h3>${(0, dom_js_1.esc)(next.title)}</h3><p>${(0, dom_js_1.esc)((0, tasks_query_js_1.taskPriority)(next).why)}</p><button class="primary" ${next.course === '516' && (0, study516_query_js_1.examFocusActive)() ? 'data-panel="exam516"' : `data-open-task="${(0, dom_js_1.esc)(next.id)}"`}>${next.course === '516' && (0, study516_query_js_1.examFocusActive)() ? '期中與 TopHat 進度' : '看這一項'} ${(0, dom_js_1.icon)('arrow')}</button>` : '<h3>主要待辦已完成</h3><p>可以休整，不必為了數字找事做。</p>';
    (0, dom_js_1.$)('radar').innerHTML = pending.slice(1, 4).map(t => { const pr = (0, tasks_query_js_1.taskPriority)(t); return `<button class="radar-row" data-open-task="${(0, dom_js_1.esc)(t.id)}"><span class="pbadge p${pr.p}">P${pr.p}</span><span><strong>${(0, dom_js_1.esc)((0, tasks_query_js_1.courseName)(t.course))} · ${(0, dom_js_1.esc)(t.title)}</strong><small>${(0, dom_js_1.esc)(pr.why)}</small></span></button>`; }).join('');
    (0, dom_js_1.$)('routineMini').innerHTML = runtime_js_1.runtime.state.routines.filter(r => r.enabled && r.repeat === 'daily').slice(0, 3).map(r => (0, routines_js_1.routineCard)(r, true)).join('');
    (0, dom_js_1.$)('routineMeta').textContent = `${runtime_js_1.runtime.state.routines.filter(r => r.enabled && (0, routines_model_js_1.routineDone)(r)).length} 項已記錄 · 不與主線混排`;
    const recent = runtime_js_1.runtime.state.items.filter(x => x.qty > 0).slice(-5).reverse();
    (0, dom_js_1.$)('shelf').innerHTML = recent.map(x => `<button class="shelf-item" data-item="${(0, dom_js_1.esc)(x.name)}">${(0, inventory_js_1.itemImage)(x.name)}<span>${(0, dom_js_1.esc)(x.name)}</span><small>×${x.qty}</small></button>`).join('');
}
function updateLight() {
    const mode = runtime_js_1.runtime.visualPreview === 'auto' ? (0, clock_js_1.lightFor)() : runtime_js_1.runtime.visualPreview;
    (0, dom_js_1.$)('scene').dataset.light = mode;
    const room = (0, dom_js_1.$)('room'), src = art_js_1.ART['room-' + mode];
    if (room.dataset.phase !== mode) {
        room.src = src;
        room.dataset.phase = mode;
    }
    (0, dom_js_1.$)('lightLabel').textContent = clock_js_1.LIGHT_BANDS[mode].name + (runtime_js_1.runtime.visualPreview === 'auto' ? ' · 跟隨 LA 時間' : ' · 畫面預覽');
    (0, dom_js_1.$)('lightNote').textContent = runtime_js_1.runtime.visualPreview === 'auto' ? clock_js_1.LIGHT_BANDS[mode].sky : '預覽只改畫面；日期、任務、獎勵仍用真正的 LA 時間。';
    document.querySelectorAll('[data-lightmode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lightmode === runtime_js_1.runtime.visualPreview)));
}
function renderClock() { const p = (0, clock_js_1.parts)(); (0, dom_js_1.$)('clock').textContent = `${p.hour}:${p.minute}`; const day = new Intl.DateTimeFormat('zh-TW', { timeZone: config_js_1.TZ, weekday: 'long' }).format(new Date()); (0, dom_js_1.$)('date').textContent = `${p.month}.${p.day} ${day} · Los Angeles`; updateLight(); (0, companion_js_1.renderDog)(); (0, appearance_js_1.renderAppearance)(); }
function dateLabel(t) { return t.due ? `${t.due}${t.time ? ' ' + t.time : ''}${t.time ? ' LA' : ' · 時刻待確認'}` : t.window ? `${t.window} · 待確認` : '未定日期'; }
function render() {
    const lv = Math.floor(runtime_js_1.runtime.state.xp / 100) + 1;
    (0, dom_js_1.$)('level').textContent = `Lv.${lv}`;
    (0, dom_js_1.$)('profileLevel').textContent = `Lv.${lv}`;
    (0, dom_js_1.$)('coins').textContent = runtime_js_1.runtime.state.coins;
    (0, dom_js_1.$)('tickets').textContent = runtime_js_1.runtime.state.tickets;
    (0, dom_js_1.$)('xpText').textContent = `${runtime_js_1.runtime.state.xp % 100} / 100 XP · 本機累計 ${runtime_js_1.runtime.state.xp}`;
    (0, dom_js_1.$)('xpBar').style.width = `${runtime_js_1.runtime.state.xp % 100}%`;
    (0, dom_js_1.$)('taskBadge').hidden = !runtime_js_1.runtime.state.tasks.some(t => t.status !== 'done');
    const due = runtime_js_1.runtime.state.tasks.filter(t => t.status !== 'done' && t.due).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 3);
    (0, dom_js_1.$)('radar').innerHTML = due.map(t => `<button class="radar-row" data-taskdetail="${(0, dom_js_1.esc)(t.id)}" style="width:100%;text-align:left"><div class="date-box">${t.due.slice(8)}<small>${t.due.slice(5, 7)} 月</small></div><div><strong>${(0, dom_js_1.esc)(t.title)}</strong><small>${(0, dom_js_1.esc)((0, tasks_query_js_1.courseName)(t.course))} · ${t.due < (0, clock_js_1.today)() ? '日期已過，待確認' : (t.type === 'assignment' ? '作業提交' : '準備任務')}</small></div></button>`).join('') || '<p class="empty">沒有已知的近期截止日。<br>仍請查看 Brightspace 新公告。</p>';
    const uncertain = runtime_js_1.runtime.state.tasks.find(t => t.id === '557-quiz' && t.status !== 'done');
    if (uncertain)
        (0, dom_js_1.$)('radar').insertAdjacentHTML('beforeend', `<button class="radar-row" data-taskdetail="557-quiz" style="width:100%;text-align:left"><div class="date-box">?<small>待確認</small></div><div><strong>DSO 557B · Quiz 1 / Challenge</strong><small>10/19 當週 · 依 section／公告</small></div></button>`);
    const claimed = runtime_js_1.runtime.state.checkins.includes((0, clock_js_1.today)());
    (0, dom_js_1.$)('checkin').disabled = claimed;
    (0, dom_js_1.$)('checkin').innerHTML = (0, dom_js_1.icon)(claimed ? 'check' : 'gift') + (claimed ? '今日補給已領取' : '領取今日補給');
    (0, dom_js_1.$)('dailyText').textContent = claimed ? '本機已記錄；不會自動把獎勵加進聊天主帳。' : '小份補給：5 XP＋修復材料。沒有連續簽到懲罰。';
    const drafts = runtime_js_1.runtime.state.journal.filter(x => x.status === 'draft').length, ready = runtime_js_1.runtime.state.journal.filter(x => x.status === 'ready' || x.status === 'submitted').length;
    (0, dom_js_1.$)('journalSummary').textContent = `${drafts} 篇草稿 · ${ready} / 5 篇定稿`;
    (0, dom_js_1.$)('tophatSummary').textContent = `Ch.7 ${(0, study516_query_js_1.chapterStatus)((0, study516_query_js_1.studyTask)('ch7'))} · Ch.8 ${(0, study516_query_js_1.chapterStatus)((0, study516_query_js_1.studyTask)('ch8'))}`;
    (0, dom_js_1.$)('hotspots').classList.toggle('off', !runtime_js_1.runtime.state.settings.hotspots);
    (0, dom_js_1.$)('hotspotToggle').setAttribute('aria-pressed', String(runtime_js_1.runtime.state.settings.hotspots));
    if (runtime_js_1.runtime.state.lastSaved && runtime_js_1.runtime.storageOK)
        (0, dom_js_1.$)('saveStatus').textContent = `已存本機 ${(0, clock_js_1.localTime)(runtime_js_1.runtime.state.lastSaved)} · 網站本機帳本`;
    renderPlanner();
    renderClock();
    (0, decor_js_1.renderDecor)();
    (0, build_js_1.renderBuild)();
    (0, growth_js_1.renderGrowthMini)();
    (0, dom_js_1.icons)();
}

},
"src/ui/panels/comfort.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comfortPanel = comfortPanel;
const runtime_js_1 = require("src/core/runtime.js");
const clock_js_1 = require("src/core/clock.js");
const comfort_model_js_1 = require("src/features/comfort-model.js");
const appearance_view_js_1 = require("src/ui/appearance-view.js");
const dom_js_1 = require("src/ui/dom.js");
function comfortPanel(manualHtml) { const s = runtime_js_1.runtime.state, c = s.comfort, g = (0, comfort_model_js_1.complexion)(s, (0, clock_js_1.today)()), w = c.wakes[(0, clock_js_1.today)()], t = s.health.find(x => x.date === (0, clock_js_1.today)()); return { title: '休整 · 遊戲氣色', kicker: '不必每天填膚況問卷', html: `<div class="comfort-hero">${(0, appearance_view_js_1.portraitView)({ caption: '固定五官 · 只改局部狀態層' })}<div><span class="eyebrow">氣色值 / 純遊戲屬性</span><h3>${g.score}<small> / 100</small></h3><p>${g.label}${g.override ? ' · 手動覆核' : ''}</p><p class="muted small">不是顏值評分，不是皮膚或健康判定。沒登入不扣分，不改德牧。</p></div></div><div class="growth-tabs"><button data-comfort-mode="game" aria-pressed="${c.mode === 'game'}">自動遊戲演出</button><button data-comfort-mode="reported" aria-pressed="${c.mode === 'reported'}">依本人回報</button></div><div class="row space"><button class="primary" data-rest-now>準備休息</button><button class="outline" data-groom-today ${c.careDays.includes((0, clock_js_1.today)()) ? 'disabled' : ''}>整理儀容 +2</button><button class="outline" data-panel="exercise">記錄活動 +4／日</button></div><div class="card space"><div class="row"><h3>起床估記</h3><button class="link" data-auto-wake-toggle>${c.autoWake ? '關閉自動估記' : '開啟自動估記'}</button></div><p>${w ? w.status === 'dismissed' ? '今天的估記已取消：剛剛還沒睡。' : `今天約 <b>${w.time}</b> · ${w.status === 'confirmed' ? '妳已確認' : '首次開啟估記，可修改'}${w.lowConfidence ? '（午後首次開啟，可信度較低）' : ''}` : '今天尚無估記。五點後首次開啟前景時可估記一次。'}</p><form id="wakeForm" class="row"><input type="hidden" name="date" value="${(0, clock_js_1.today)()}"><label>起床時間 <input type="time" name="time" value="${w?.status !== 'dismissed' ? (0, dom_js_1.esc)(w?.time || '') : ''}" required aria-label="起床時間"></label><button class="outline" type="submit">修改／確認</button>${w && w.status !== 'dismissed' ? '<button class="link" type="button" data-still-awake>我還沒睡，不算起床</button>' : ''}</form><p class="muted small">只能看到此瀏覽器何時打開遊戲，不會讀手機解鎖或偵測睡眠。連續開著跨過五點不會憑空產生紀錄；手機與電腦目前各自保存。</p></div><details class="appearance-details"><summary>氣色公式、覆核與免填原則</summary><p>初始 70。已登記的活動每日期 +4（一天一次）；整理儀容 +2／日；按「準備休息」後再次開啟，形成 2–24 小時休整區間時 +6（每日期一次，僅遊戲結算，不是實際睡眠）。準備休息時刻 00–02 扣3、02–04 扣7、04–12 扣12；其他時段不扣。自動值限制 20–100，不會因沒登入一直下降。</p><p>70 以上原貌；45–69 輕微疲態；低於45較明顯疲態。身體、骨架、狗狗均不變。皮膚改善不能由這些分數推定；不以咖啡、抽獎或額外運動次數無限刷分。</p><form id="complexionForm" class="row"><label>手動覆核 0–100 <input type="number" name="score" min="0" max="100" step="1" value="${c.override ?? ''}" placeholder="留白恢復自動"></label><button class="outline" type="submit">保存覆核</button></form><p class="muted small">停用遊戲演出可切回本人回報；下方詳細紀錄選填，不填也能玩。</p>${g.reasons.map(r => `<div class="activity"><small>${r.day}</small><p>${Object.entries(r.changes).map(([k, v]) => (0, dom_js_1.esc)(k) + ' ' + (v > 0 ? '+' : '') + v).join(' · ')}</p></div>`).join('') || '<p>目前沒有自動加減紀錄，70 是遊戲預設值。</p>'}</details><details class="appearance-details"><summary>真實睡眠／膚況紀錄與效果預覽（完全選填）</summary>${manualHtml}</details>` }; }

},
"src/ui/panels/companion.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCompanionPanel = buildCompanionPanel;
/** ui/panels/companion — extracted from verified 2.3.1; visual/gameplay parity first. */
const config_js_1 = require("src/core/config.js");
const companion_js_1 = require("src/features/companion.js");
const dom_js_1 = require("src/ui/dom.js");
function buildCompanionPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '妳的資深守衛';
        html = `<div class="companion-panel"><img data-companion-art="portrait" src="${config_js_1.COMPANION_ART.portrait}" alt="核准國漫德牧的同源面部裁切"><div><span class="eyebrow">COMPANION / 10 YEARS</span><h3>有點憨，但很可靠。</h3><p id="dogModalState">${(0, dom_js_1.esc)((0, companion_js_1.dogState)().place)}</p><p class="muted small">黑棕長毛、長鼻吻、大三角耳與嘴邊白毛。首頁、佈置與頭像沿用同一張核准國漫母版；不再將另一張臉接到身體上。女主疲態不影響牠。</p><button class="outline" id="petDog">${(0, dom_js_1.icon)('paw')}摸摸牠</button></div></div><h3 class="section-label">漫遊預覽 · 不改動帳本</h3><div class="companion-controls"><button class="outline" id="dogPresent">回到墊子上</button><button class="outline" id="dogAway">去走廊晃晃</button><button class="outline" id="dogAuto">恢復自動</button></div><p class="small muted space">自動模式依洛杉磯日期與兩小時時段切換。這版是出入場景的狀態切換，不是行走骨架動畫；離開時只有狗的圖層消失，房間與 Lydia 不換圖。</p><button class="text-button" id="lookAtDog">回到房間查看 ${(0, dom_js_1.icon)('arrow')}</button>`;
    }
    return { title, html, kicker };
}

},
"src/ui/panels/courses.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCoursesPanel = buildCoursesPanel;
/** ui/panels/courses — extracted from verified 2.3.1; visual/gameplay parity first. */
const config_js_1 = require("src/core/config.js");
const tasks_js_1 = require("src/features/tasks.js");
function buildCoursesPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '四大學院';
        html = `<div class="note">課程資料取自妳上傳的四份 Fall 2026 syllabus。臨時公告不會自動同步；日期衝突保留原文、列為待確認。</div><div class="cards">${(0, tasks_js_1.courseCards)()}</div><h3 class="section-label">需要先確認的課程情報</h3>${config_js_1.DATA.confirmations.map(x => `<div class="card space"><h3>${x.title}</h3><p>${x.detail}</p></div>`).join('')}`;
    }
    return { title, html, kicker };
}

},
"src/ui/panels/decor.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDecorPanel = buildDecorPanel;
/** ui/panels/decor — extracted from verified 2.3.1; visual/gameplay parity first. */
const decor_js_1 = require("src/features/decor.js");
function buildDecorPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '住進自己的房間';
        kicker = 'LAST DORM / ROOM DECOR';
        html = (0, decor_js_1.decorPanel)();
    }
    return { title, html, kicker };
}

},
"src/ui/panels/editTask.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEditTaskPanel = buildEditTaskPanel;
/** ui/panels/editTask — extracted from verified 2.3.1; visual/gameplay parity first. */
const runtime_js_1 = require("src/core/runtime.js");
const dom_js_1 = require("src/ui/dom.js");
function buildEditTaskPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        const t = runtime_js_1.runtime.state.tasks.find(t => t.id === runtime_js_1.runtime.selectedItem);
        title = '編輯任務';
        html = t ? `<form id="editTaskForm" class="stack"><input type="hidden" name="taskId" value="${(0, dom_js_1.esc)(t.id)}"><label class="field">名稱<input name="title" required maxlength="160" value="${(0, dom_js_1.esc)(t.title)}"></label><div class="form-grid"><label class="field">日期（未知留白）<input name="due" type="date" value="${(0, dom_js_1.esc)(t.due || '')}"></label><label class="field">LA 時間（未知留白）<input name="time" type="time" value="${(0, dom_js_1.esc)(t.time || '')}"></label></div><label class="field">說明<textarea name="detail" maxlength="3000">${(0, dom_js_1.esc)(t.detail || '')}</textarea></label><button class="primary">儲存，不改獎勵或已完成紀錄</button></form>` : '<p>任務不存在。</p>';
    }
    return { title, html, kicker };
}

},
"src/ui/panels/focus.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFocusPanel = buildFocusPanel;
/** ui/panels/focus — extracted from verified 2.3.1; visual/gameplay parity first. */
const focus_js_1 = require("src/features/focus.js");
function buildFocusPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '只做下一小步';
        html = `<div class="note">倒數是輔助，不會在時間一到就替妳宣稱完成學習，也不自動發 XP。完成後再回任務紀錄。</div><div class="timer" id="focusTime">${(0, focus_js_1.focusText)()}</div><div class="row" style="justify-content:center">${[5, 15, 25].map(n => `<button class="outline" data-focus="${n}">${n} 分鐘</button>`).join('')}<button class="outline" id="stopFocus">結束計時</button></div><p class="muted small space" style="text-align:center">可離開這個面板；計時仍依時間戳繼續。關閉整個網站則停止。</p>`;
    }
    return { title, html, kicker };
}

},
"src/ui/panels/health.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildHealthPanel = buildHealthPanel;
/** Daily self-report + preview. All inputs optional; examples never become health data. */
const comfort_js_1 = require("src/ui/panels/comfort.js");
const clock_js_1 = require("src/core/clock.js");
const runtime_js_1 = require("src/core/runtime.js");
const dom_js_1 = require("src/ui/dom.js");
const appearance_model_js_1 = require("src/features/appearance-model.js");
const appearance_view_js_1 = require("src/ui/appearance-view.js");
const options = (list, value) => list.map(v => `<option ${value === v ? 'selected' : ''}>${(0, dom_js_1.esc)(v)}</option>`).join('');
function buildHealthPanel() {
    const h = runtime_js_1.runtime.state.health.find(x => x.date === (0, clock_js_1.today)()) || {}, a = (0, appearance_model_js_1.appearanceFor)(runtime_js_1.runtime.state, (0, clock_js_1.today)());
    const title = '妳的狀態，不必靠系統猜', kicker = 'LYDIA / DAILY CONDITION';
    const html = `<div class="appearance-intro"><div><span class="eyebrow">${(0, clock_js_1.today)()} · LOS ANGELES</span><h3>五官固定，疲態可以變化。</h3><p>只記精神和膚況也可以。所有欄位選填，未知就留白。</p></div><span class="appearance-pill" id="appearanceSavedLabel">${(0, dom_js_1.esc)(a.label)}</span></div>
    <div class="appearance-card"><div class="appearance-compare">${(0, appearance_view_js_1.portraitView)({ original: true, caption: '核准原貌 · 固定骨架' })}${(0, appearance_view_js_1.portraitView)({ caption: '當前顯示／免費預覽' })}</div>
    <div class="appearance-controls"><span class="eyebrow">LOCAL COLOR LAYER / 非醫療判定</span><h3 data-appearance-label>${(0, dom_js_1.esc)(a.label)}</h3><p id="appearanceReason"></p>
    <div class="appearance-presets" aria-label="疲態效果預覽"><button type="button" data-preview-appearance="0" aria-pressed="false">原貌</button><button type="button" data-preview-appearance="1" aria-pressed="false">輕微疲態</button><button type="button" data-preview-appearance="2" aria-pressed="false">需要休整</button></div><small class="muted">這三個按鈕只看效果，不會寫入今天的紀錄。較深範例附輕微膚色不均，不新增痘痘。</small>
    <div class="row space"><button class="outline" type="button" data-appearance-room>在房間看效果</button><button class="link" type="button" data-appearance-restore>回到已保存狀態</button></div><p class="muted small" id="appearanceRenderNote">只在眼下及局部膚色增加薄色層。瞳孔、眼型、眉鼻、下顎和原圖透明度不變。</p></div></div>
    <form id="healthForm" class="stack"><input type="hidden" name="recordDate" value="${(0, clock_js_1.today)()}"><div class="form-grid"><label class="field">今天的精神<select name="energy">${options(appearance_model_js_1.ENERGY_OPTIONS, h.energy || '未記錄')}</select></label><label class="field">今天的膚況<select name="skin">${options(appearance_model_js_1.SKIN_OPTIONS, h.skin || '未記錄')}</select></label></div>
    <details class="appearance-details"><summary>膚況穩定度／身體舒適度自評（選填）</summary><p>不是顏值或醫學分數，1＝自己感覺較不穩／不舒服，5＝自己感覺穩定／舒服。只供回顧，不改變原貌。</p><div class="form-grid"><label class="field">膚況穩定度<select name="skinRating"><option value="">未回報</option>${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${h.skinRating === n ? 'selected' : ''}>${n} / 5</option>`).join('')}</select></label><label class="field">身體舒適度<select name="comfortRating"><option value="">未回報</option>${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${h.comfortRating === n ? 'selected' : ''}>${n} / 5</option>`).join('')}</select></label></div><button type="button" class="link" data-growth-tab="wellbeing">查看運動、睡眠與膚況的同日紀錄</button></details>
    <details class="appearance-details"><summary>睡眠細節與外觀強度（選填）</summary><div class="form-grid space"><label class="field">估計實際睡眠時數<input name="hours" type="number" min="0" max="24" step="0.1" placeholder="未知就留白" value="${typeof h.hours === 'number' ? h.hours : ''}"><small>不是上床至醒來的時間差。</small></label><label class="field">外觀強度<select name="fatigue"><option value="auto" ${!h.fatigue || h.fatigue === 'auto' ? 'selected' : ''}>依今天的回報</option><option value="base" ${h.fatigue === 'base' ? 'selected' : ''}>我選原貌</option><option value="light" ${h.fatigue === 'light' ? 'selected' : ''}>我選輕微疲態</option><option value="tired" ${h.fatigue === 'tired' ? 'selected' : ''}>我選需要休整</option></select><small>可以自行覆核，不必接受自動對照。</small></label><label class="field">估計入睡時間<input type="time" name="sleep" value="${(0, dom_js_1.esc)(h.sleep || '')}"></label><label class="field">醒來時間<input type="time" name="wake" value="${(0, dom_js_1.esc)(h.wake || '')}"></label></div></details>
    <div class="appearance-submit"><button class="primary" type="submit">儲存本人回報（切換回報模式）</button><span>不加／扣 XP、生存幣，也不影響德牧。</span></div></form>
    <div class="appearance-preference"><div><strong>人物狀態連動：${a.enabled ? '開啟' : '關閉'}</strong><p>關閉只恢復原貌，紀錄仍保留。重新開啟依目前的遊戲／回報模式顯示。</p></div><button class="outline" type="button" data-appearance-toggle>${a.enabled ? '關閉連動' : '開啟連動'}</button></div>
    <details class="appearance-details"><summary>查看「本人回報模式」對照規則與限制</summary><p>這是遊戲配色規則，不是顏值、皮膚或健康評分。精神「普通／精神不錯」用原貌；「有點累」用輕微疲態；「很疲倦」用需要休整。若自填實際睡眠時數，少於 5 小時對照較深、5 至未滿 7 對照輕微，與精神自評取較深者；這些數字只是可覆核的演出門檻，不是睡眠需求建議。手動選擇外觀強度會優先於自動對照。</p><p>膚況「有些不穩定」只加輕微膚色不均，不據此診斷或自動生成痘痘。入睡／醒來時刻只作紀錄，沒有自動相減；半夜開網站也不自動扣分。隔天尚未回報時保留原貌，清楚標示未知，不宣稱睡一晚就恢復。髮飾穿戴與頭髮變化仍未實作。</p></details>
    <h3 class="section-label">最近回報</h3>${runtime_js_1.runtime.state.health.length ? runtime_js_1.runtime.state.health.slice(0, 7).map(x => `<div class="activity"><small>${(0, dom_js_1.esc)(x.date)}</small><p>${(0, dom_js_1.esc)(x.energy || '精神未記錄')} · ${(0, dom_js_1.esc)(x.skin || '膚況未記錄')}${typeof x.hours === 'number' ? ' · 自填 ' + x.hours + ' 小時' : ''}</p><small>${(0, dom_js_1.esc)(x.sleep || '入睡未知')} → ${(0, dom_js_1.esc)(x.wake || '醒來未知')}（紀錄，不自動當作睡眠時數）</small></div>`).join('') : '<div class="empty">尚無本人回報；遊戲氣色另行演出，不代表真實膚況。</div>'}
    ${h.date ? '<button type="button" class="link space" data-clear-health-today>清除今天的回報（先確認）</button>' : ''}`;
    return (0, comfort_js_1.comfortPanel)(html);
}

},
"src/ui/panels/inventory.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInventoryPanel = buildInventoryPanel;
/** ui/panels/inventory — extracted from verified 2.3.1; visual/gameplay parity first. */
const inventory_js_1 = require("src/features/inventory.js");
function buildInventoryPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '住戶背包';
        kicker = 'PERSONAL INVENTORY / 隨身物資';
        html = (0, inventory_js_1.inventoryPanel)();
    }
    return { title, html, kicker };
}

},
"src/ui/panels/item.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildItemPanel = buildItemPanel;
/** ui/panels/item — extracted from verified 2.3.1; visual/gameplay parity first. */
const runtime_js_1 = require("src/core/runtime.js");
const inventory_js_1 = require("src/features/inventory.js");
function buildItemPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '物品檔案';
        html = (0, inventory_js_1.itemPanel)(runtime_js_1.runtime.selectedItem);
    }
    return { title, html, kicker };
}

},
"src/ui/panels/journal.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildJournalPanel = buildJournalPanel;
/** ui/panels/journal — extracted from verified 2.3.1; visual/gameplay parity first. */
const runtime_js_1 = require("src/core/runtime.js");
const tasks_query_js_1 = require("src/features/tasks-query.js");
const dom_js_1 = require("src/ui/dom.js");
function buildJournalPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '談判者手札';
        html = `<div class="note">11/14 截止，成績占 15%。現有兩篇只記作草稿；五次談判還需起始目標與結尾五項收穫。遊戲只追蹤妳親自完成的階段。</div>${runtime_js_1.runtime.state.journal.map((j, i) => `<div class="taskcard"><div><small>ENTRY 0${i + 1}</small><div class="task-title">${(0, dom_js_1.esc)(j.title)}</div><p>${tasks_query_js_1.stateName[j.status] || '未開始'}</p></div><label class="field">紀錄階段<select data-journal="${i}">${['todo', 'draft', 'revised', 'ready', 'submitted'].map(st => `<option value="${st}" ${j.status === st ? 'selected' : ''}>${st === 'ready' ? '已定稿' : tasks_query_js_1.stateName[st]}</option>`).join('')}</select></label></div>`).join('')}<p class="muted small">階段紀錄不額外刷 XP；整份提交的獎勵在 MOR 569 任務終端結算一次。來源：MOR569 syllabus p.4、9。</p><button class="outline" data-course="569">查看 MOR 569 提交任務</button>`;
    }
    return { title, html, kicker };
}

},
"src/ui/panels/kitchen.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildKitchenPanel = buildKitchenPanel;
/** ui/panels/kitchen — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const runtime_js_1 = require("src/core/runtime.js");
const dom_js_1 = require("src/ui/dom.js");
function buildKitchenPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '咖啡與烹飪';
        html = `<div class="note">這裡記錄現實中已完成的料理，不是要求現在再喝一杯。咖啡不加健康數值；同種類一天只計一次練習獎勵。</div><div class="cards">${[['虹吸咖啡', '萃取、觀察回流、收拾器具。', 'coffee'], ['拿鐵', '萃取與奶泡；拉花不完美也算練習。', 'coffee'], ['準備一餐', '簡單地餵飽自己，也是生活能力。', 'gift'], ['食材整理', '整理、分類、記錄已有食材。', 'bag']].map(([name, desc, ic]) => { const done = runtime_js_1.runtime.state.cooking.some(x => x.date === (0, clock_js_1.today)() && x.name === name); return `<article class="card">${(0, dom_js_1.icon)(ic)}<h3>${name}</h3><p>${desc}</p><button data-cook="${name}" ${done ? 'disabled' : ''}>${done ? '今天已記錄' : '確認現實已完成'}</button><small class="muted" style="display:block;margin-top:8px">＋10 XP / ＋5 生存幣 · 網站本機紀錄</small></article>`; }).join('')}</div><h3 class="section-label">最近的料理紀錄</h3>${runtime_js_1.runtime.state.cooking.length ? runtime_js_1.runtime.state.cooking.slice(0, 10).map(x => `<div class="activity"><small>${(0, dom_js_1.esc)(x.date)}</small><p>${(0, dom_js_1.esc)(x.name)}</p></div>`).join('') : '<div class="empty">其他對話的料理只當參考，不會自動重複入帳。</div>'}`;
    }
    return { title, html, kicker };
}

},
"src/ui/panels/newtask.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNewtaskPanel = buildNewtaskPanel;
/** ui/panels/newtask — extracted from verified 2.3.1; visual/gameplay parity first. */
const config_js_1 = require("src/core/config.js");
function buildNewtaskPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '登記一個真實任務';
        html = `<form id="newtaskForm" class="stack"><label class="field">任務名稱<input name="title" required maxlength="160" placeholder="例如：Brightspace 新增練習"></label><div class="form-grid"><label class="field">所屬主線<select name="course">${config_js_1.DATA.courses.map(c => `<option value="${c.id}">${c.code}</option>`).join('')}<option value="career">求職</option><option value="life">生活</option></select></label><label class="field">類型<select name="type"><option value="assignment">需要提交的作業</option><option value="practice">練習／生活紀錄</option></select></label><label class="field">日期（未公布可留白）<input type="date" name="due"></label><label class="field">截止時間（LA，可留白）<input type="time" name="time"></label><label class="field">週期<select name="repeat"><option value="once">單次主線／支線</option><option value="daily">每日 Routine</option><option value="weekly">每週 Routine</option></select></label><label class="field">优先級（單次任務）<select name="priority"><option value="auto">依期限自動</option><option value="p1">P1 先處理</option><option value="p2">P2 本週</option><option value="p3">P3 可排後</option></select></label><p class="new-kind-note">Routine 按洛杉磯日曆每期一次，不累積錯過的次數。例行新增後可暫停；不替老師猜作業。</p><label class="field">預估難度<select name="xp"><option value="5">很小的一步 · 5 XP</option><option value="15" selected>一般小任務 · 15 XP</option><option value="30">有交付成果 · 30 XP</option><option value="40">完整里程碑 · 40 XP</option></select></label></div><label class="field">完成標準<textarea name="detail" maxlength="1000" placeholder="寫明什麼才算完成；不要放敏感資料或保密題目。"></textarea></label><button class="primary" type="submit">加入任務，不立即領獎</button></form>`;
    }
    return { title, html, kicker };
}

},
"src/ui/panels/profile.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProfilePanel = buildProfilePanel;
exports.buildGoalForm = buildGoalForm;
exports.buildCareerForm = buildCareerForm;
exports.buildSkillForm = buildSkillForm;
exports.buildExercisePanel = buildExercisePanel;
const skill_tree_model_js_1 = require("src/features/skill-tree-model.js");
const runtime_js_1 = require("src/core/runtime.js");
const clock_js_1 = require("src/core/clock.js");
const growth_model_js_1 = require("src/features/growth-model.js");
const appearance_model_js_1 = require("src/features/appearance-model.js");
const dom_js_1 = require("src/ui/dom.js");
const targets = (g, k, v) => g.goal.targets[k] ? `${v} / ${g.goal.targets[k]}` : String(v);
function metric(label, value, detail) { return `<div class="growth-metric"><span>${label}</span><strong>${value}</strong><small>${detail}</small></div>`; }
const careerHistory = (g) => g.records.length ? g.records.slice().sort((a, b) => b.date.localeCompare(a.date)).map(r => `<article class="growth-record"><div><span class="eyebrow">${r.date} · ${growth_model_js_1.CAREER_TYPES[r.kind]}</span><h4>${(0, dom_js_1.esc)(r.title)}</h4><p>${(0, dom_js_1.esc)(r.note || '沒有另附簡記')}</p><small>${r.status === 'completed' ? '已完成 · 納入登記累計' : r.status === 'planned' ? '已安排 · 不計完成' : '已取消 · 不計完成'}</small></div><div><button class="link" data-growth-edit="career" data-record-id="${(0, dom_js_1.esc)(r.id)}">編輯</button><button class="link" data-growth-delete="career" data-record-id="${(0, dom_js_1.esc)(r.id)}">刪除</button></div></article>`).join('') : '<p class="empty">還沒有在這裡登記求職成果。這不代表妳過去沒有做過。</p>';
function buildProfilePanel() {
    const g = runtime_js_1.runtime.state.growth, c = (0, growth_model_js_1.careerSummary)(g, (0, clock_js_1.today)()), a = (0, appearance_model_js_1.appearanceFor)(runtime_js_1.runtime.state, (0, clock_js_1.today)()), w = (0, growth_model_js_1.wellbeingSummary)(runtime_js_1.runtime.state, (0, clock_js_1.today)()), tab = runtime_js_1.runtime.profileTab || 'goal';
    let body = '';
    if (tab === 'goal')
        body = `<div class="growth-goal"><span class="eyebrow">終極目標 / 可自行調整</span><h3>${(0, dom_js_1.esc)(g.goal.text)}</h3><p>${(0, dom_js_1.esc)(g.goal.roles)}<br>${(0, dom_js_1.esc)(g.goal.industries)}</p><div class="row"><span class="tag">${g.goal.deadline ? '目標日期 ' + g.goal.deadline : '日期未設定'}</span><button class="outline" data-growth-new="goal">調整目標與數量</button></div></div><div class="growth-metrics">${metric('Coffee Chat · 不重複人數', targets(g, 'coffee', c.coffee), `已登記 ${c.coffeeSessions} 次完成對談`)}${metric('作品集成果', targets(g, 'portfolio', c.portfolio), '只計已完成的成果登記')}${metric('正式投遞', targets(g, 'application', c.application), '草稿／準備中不列入')}${metric('面試', targets(g, 'interview', c.interview), '只計已完成面試')}${metric('Offer', targets(g, 'offer', c.offer), '回報收到；不代表已入職')}${metric('技能樹點數', (0, skill_tree_model_js_1.treeSummary)(runtime_js_1.runtime.state, (0, clock_js_1.today)()).reduce((v, t) => v + t.score, 0) + ' / 800', '依節點登記，不是能力百分比')}</div><div class="note">所有數字只涵蓋妳在本機登記的資料，不把以前的空白當成零經驗。Coffee Chat 同一對象再談一次，只增加次數、不增加人數；寄信、預約和練習不算已完成對談。</div><div class="row space"><button class="primary" data-growth-new="career">＋ 登記對談／求職成果</button><button class="outline" data-panel="tasks">回到真實任務 →</button></div><details class="growth-explainer"><summary>數值怎麼來？有哪些不會自動計算？</summary><p>角色 XP 是行動參與；新技能點依八項技能樹的具體節點累計，舊0–4階證據另行保留。兩者不互換。課程作業、建設和抽獎不會自動幫妳完成面試或提高 SQL 熟練度。歷史工作能力可補登既有成果，不用從第一階段刷起。</p><p>這裡的新增／修改／刪除只更新統計，不會再發 XP 或金幣。登記一場已完成對談，不會偷偷完成另一筆課程任務。可使用匿名代碼代替真名；沒有對外同步。</p></details><h3 class="section-label">求職行動紀錄</h3>${careerHistory(g)}`;
    if (tab === 'skills')
        body = `<div class="growth-goal"><span class="eyebrow">EVIDENCE POINTS / 與目標工作相關的能力</span><h3>${(0, growth_model_js_1.skillPoints)(g, (0, clock_js_1.today)())} / 32 技能證據點</h3><p>八項技能，每項 0–4 階；合計的是有證據的自評階段，不是可隨意加到另一項技能的點數。</p><button class="primary" data-growth-new="skill">＋ 補登一份技能證據</button></div><div class="skill-level-key">${growth_model_js_1.SKILL_STAGES.map((s, i) => `<span><b>${i}</b>${s}</span>`).join('')}</div><p class="muted small">沒登記＝尚未建立證據，不等於妳不會。這是保留的舊版證據。階段 2 起需要獨立完成的說明；階段 4 請写出可展示成果與收到的回饋。都是自評，系統沒有考核或查證。</p><div class="skill-grid">${(0, growth_model_js_1.skillSummary)(g, (0, clock_js_1.today)()).map(k => `<article class="skill-card"><div class="row"><h3>${k.name}</h3><span class="tag">${k.stage ? `${k.stage} / 4` : '待建立'}</span></div><p>${k.hint}</p><div class="skill-pips" aria-label="${k.name} ${k.stage}/4">${Array.from({ length: 4 }, (_, i) => `<i class="${i < k.stage ? 'filled' : ''}"></i>`).join('')}</div><strong>${growth_model_js_1.SKILL_STAGES[k.stage]}</strong><details><summary>依據 · ${k.evidence.length} 筆</summary>${k.evidence.map(e => `<div class="evidence-entry"><small>${e.date} · 階段 ${e.stage}</small><b>${(0, dom_js_1.esc)(e.title)}</b><p>${(0, dom_js_1.esc)(e.note)}</p><button class="link" data-growth-edit="skill" data-record-id="${(0, dom_js_1.esc)(e.id)}">編輯證據</button><button class="link" data-growth-delete="skill" data-record-id="${(0, dom_js_1.esc)(e.id)}">刪除</button></div>`).join('') || '<p>可補登過去的專案或練習，不會自動評妳的程度。</p>'}</details></article>`).join('')}</div><details class="growth-explainer"><summary>不讓技能點灌水的規則</summary><p>同一技能取最高的已登記階段，不按做題數相加。相同題目做十遍、同一證據重複輸入，不會多出十點。證據編輯或刪除後重算刻度，不扣已經完成任務的 XP。</p><p>把求職成功當作終極目標，不代表本系統知道錄取機率。作品品質、職務需求與面試結果仍需要真實驗證。</p></details>`;
    if (tab === 'wellbeing')
        body = `<div class="growth-goal"><span class="eyebrow">WELLBEING / 紀錄，不診斷</span><h3>照顧狀態，也看得見依據。</h3><p>睡眠、活動、膚況與身體感受分开看，不把任何一項換算成「健康百分比」。</p></div><div class="growth-metrics">${metric('本週運動', w.exercise.count + ' 次', `已登記 ${w.exercise.minutes} 分鐘${w.exercise.missingMinutes ? '；另有 ' + w.exercise.missingMinutes + ' 次時長未填' : ''}`)}${metric('本週皮拉提斯', w.exercise.pilates + ' / ' + g.pilatesWeeklyTarget, '週一更新目標；不清除歷史')}${metric('近 7 天平均自填睡眠', w.averageSleep === null ? '未登記' : w.averageSleep.toFixed(1) + ' 小時', `有時數紀錄 ${w.sleepCount}/7 天；缺值不當 0`)}${metric('今天的膚況', (0, dom_js_1.esc)(w.todayRecord?.skin || '未回報'), w.todayRecord?.skinRating ? `妳的自評 ${w.todayRecord.skinRating}/5` : '不是從運動次數推估')}${metric('身體舒適度', w.todayRecord?.comfortRating ? w.todayRecord.comfortRating + ' / 5' : '未回報', '本人感受；非身體檢查')}${metric('疲態演出', a.known ? a.fatigue + ' / 2' : '未回報', (0, dom_js_1.esc)(a.label))}</div><div class="row space"><button class="primary" data-panel="exercise">記錄運動／皮拉提斯</button><button class="outline" data-panel="health">更新精神與膚況</button></div><details class="growth-explainer"><summary>依據與關聯怎麼看？</summary><p>身體舒適度與膚況 1–5 都由妳自己填；未填就顯示未知。現有疲態 0–2 只沿用今天精神與自填睡眠的遊戲演出規則，詳細公式在人物狀態面板。運動紀錄不直接修改臉、狗狗或健康數值。</p><p>下表把同一天的活動、睡眠、膚況並列，方便回顧。七天紀錄不足以證明某項運動造成膚況變好或變差。補給包和遊戲用品不抵銷睡眠不足。</p></details><div class="growth-table-wrap"><table class="growth-table"><caption>近 7 天觀察 · 空白表示未回報，不補推測值</caption><thead><tr><th>日期</th><th>運動</th><th>睡眠</th><th>膚況</th><th>舒適度</th></tr></thead><tbody>${w.days.map(d => `<tr><th>${d.date.slice(5)}</th><td>${d.exercise} 次登記</td><td>${d.hours === null ? '—' : d.hours + 'h'}</td><td>${(0, dom_js_1.esc)(d.skin || '—')}${d.skinRating ? ' ' + d.skinRating + '/5' : ''}</td><td>${d.comfort ? d.comfort + '/5' : '—'}</td></tr>`).join('')}</tbody></table></div>`;
    return { title: 'Lydia · 個人數值與成長', kicker: 'PROGRESS / 有依據，不亂灌分', html: `<div class="growth-tabs" role="group" aria-label="個人面板分類">${[['goal', '目標成果'], ['skillTree', '技能點'], ['wellbeing', '活動紀錄']].map(([id, t]) => `<button data-growth-tab="${id}" aria-pressed="${tab === id}">${t}</button>`).join('')}</div>${body}` };
}
function input(name, label, v = '', opts = '') { return `<label class="field">${label}<input name="${name}" value="${(0, dom_js_1.esc)(v)}" ${opts}></label>`; }
function buildGoalForm() { const g = runtime_js_1.runtime.state.growth.goal; return { title: '終極目標與可量測里程碑', html: `<form id="growthGoalForm" class="stack">${input('text', '目標說明', g.text, 'required maxlength="1000"')}${input('deadline', '目標日期（選填）', g.deadline || '', 'type="date"')}${input('roles', '目標職務', g.roles, 'maxlength="1000"')}${input('industries', '目標產業', g.industries, 'maxlength="1000"')}<p class="muted">各項目標數量由妳決定，留白就只顯示已登記數。不自動訂出「做幾次一定有 Offer」。</p><div class="form-grid">${Object.keys(growth_model_js_1.CAREER_TYPES).map(k => input('target_' + k, growth_model_js_1.CAREER_TYPES[k] + (k === 'coffee' ? ' · 人數目標' : ' · 數量目標'), g.targets[k] ?? '', 'type="number" min="1" max="10000" step="1"')).join('')}</div><button class="primary" type="submit">儲存目標</button></form>` }; }
function buildCareerForm() { const r = runtime_js_1.runtime.state.growth.records.find(x => x.id === runtime_js_1.runtime.growthEditing) || {}, people = [...new Set(runtime_js_1.runtime.state.growth.records.filter(x => x.kind === 'coffee').map(x => x.title))]; return { title: r.id ? '編輯求職紀錄' : '登記一次真實行動', kicker: 'SELF REPORTED / 本機保存', html: `<form id="careerRecordForm" class="stack"><input type="hidden" name="recordId" value="${(0, dom_js_1.esc)(r.id || '')}"><div class="form-grid"><label class="field">類型<select name="kind">${Object.entries(growth_model_js_1.CAREER_TYPES).map(([id, t]) => `<option value="${id}" ${r.kind === id ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label class="field">狀態<select name="status">${[['completed', '已完成'], ['planned', '已安排／準備中'], ['cancelled', '已取消']].map(([id, t]) => `<option value="${id}" ${r.status === id ? 'selected' : ''}>${t}</option>`).join('')}</select></label>${input('date', '行動日期', r.date || (0, clock_js_1.today)(), 'type="date" required')}${input('title', '對象代稱／成果名稱', r.title || '', 'required maxlength="200" list="knownPeople"')}</div><datalist id="knownPeople">${people.map(p => `<option value="${(0, dom_js_1.esc)(p)}"></option>`).join('')}</datalist><p class="note">Coffee Chat 請對同一個人使用同一代稱（如「校友 A」）。人數不重複，會談次數可累計。其他類型填成果／公司與職務即可；不需要信箱或私密資訊。</p><label class="field">重點／成果簡記（選填）<textarea name="note" maxlength="1500" rows="3">${(0, dom_js_1.esc)(r.note || '')}</textarea></label><button class="primary" type="submit">保存紀錄 · 不重複領 XP</button></form>` }; }
function buildSkillForm() { const e = runtime_js_1.runtime.state.growth.evidence.find(x => x.id === runtime_js_1.runtime.growthEditing) || {}; return { title: e.id ? '編輯技能證據' : '讓技能點有一份依據', kicker: 'SELF ASSESSMENT / 非自動認證', html: `<form id="skillEvidenceForm" class="stack"><input type="hidden" name="recordId" value="${(0, dom_js_1.esc)(e.id || '')}"><div class="form-grid"><label class="field">技能<select name="skill">${growth_model_js_1.SKILLS.map(k => `<option value="${k.id}" ${k.id === e.skill ? 'selected' : ''}>${k.name}</option>`).join('')}</select></label><label class="field">證據支持的階段<select name="stage">${growth_model_js_1.SKILL_STAGES.slice(1).map((n, i) => `<option value="${i + 1}" ${e.stage === i + 1 ? 'selected' : ''}>${i + 1} · ${n}</option>`).join('')}</select></label>${input('date', '完成／檢核日期', e.date || (0, clock_js_1.today)(), `type="date" max="${(0, clock_js_1.today)()}" required`)}${input('title', '證據名稱', e.title || '', 'required maxlength="200" placeholder="例：庫存敏感度分析圖"')}</div><label class="field">完成了什麼？如何證明這個階段？<textarea name="note" required maxlength="1500" rows="4" placeholder="參考完成或獨立完成？如何驗證？可寫檔名與回饋摘要，不必上傳完整作業。">${(0, dom_js_1.esc)(e.note || '')}</textarea></label><div class="note">1：參考／提示下完成。2：能独立完成新題並驗證。3：能應用到案例、說明取捨。4：有可展示的成果與具體回饋。登記由妳自評，系統不會假装批改或認證。</div><button type="submit" class="primary">保存證據與自評階段</button></form>` }; }
function buildExercisePanel() { const g = runtime_js_1.runtime.state.growth, s = (0, growth_model_js_1.exerciseSummary)(g, (0, clock_js_1.today)()), r = g.exercise.find(x => x.id === runtime_js_1.runtime.growthEditing) || {}; return { title: '運動與每週皮拉提斯', kicker: 'MOVEMENT / 記錄真實活動', html: `<div class="growth-metrics">${metric('本週皮拉提斯', s.pilates + ' / ' + g.pilatesWeeklyTarget, '每週排程，可調整／暫停')}${metric('本週全部運動', s.count + ' 次', s.minutes + ' 分鐘已填寫')}</div><form id="pilatesGoalForm" class="growth-week-goal"><label>每週目標 <input name="target" type="number" min="1" max="7" step="1" value="${g.pilatesWeeklyTarget}" aria-label="皮拉提斯每週目標"> 次</label><button type="submit" class="outline">調整週目標</button><button type="button" class="link" data-panel="routine">暫停／恢復 Routine</button></form><p class="muted small">起始每週 1 次是遊戲排程，不是醫療或健身處方；時長不強制。沒完成不累積欠債，身體不舒服可以休息。</p><form id="exerciseForm" class="stack"><h3>${r.id ? '編輯活動' : '＋ 登記完成的活動'}</h3><input type="hidden" name="recordId" value="${(0, dom_js_1.esc)(r.id || '')}"><div class="form-grid"><label class="field">活動<select name="kind">${Object.entries(growth_model_js_1.EXERCISE_TYPES).map(([id, t]) => `<option value="${id}" ${r.kind === id ? 'selected' : ''}>${t}</option>`).join('')}</select></label>${input('date', '完成日期', r.date || (0, clock_js_1.today)(), `type="date" max="${(0, clock_js_1.today)()}" required`)}${input('session', '活動標記（選填；避免重複記錄）', r.session || '', 'maxlength="200" placeholder="例：晚間居家練習"')}${input('minutes', '實際分鐘（選填）', r.minutes ?? '', 'type="number" min="1" max="360" step="1"')}</div><label class="field">感受簡記（選填）<textarea name="note" maxlength="1000" rows="2">${(0, dom_js_1.esc)(r.note || '')}</textarea></label><button class="primary" type="submit">保存活動紀錄</button></form><div class="note space">這一筆同時更新個人數值與每週 Routine，不另記第二次、不重複發獎。遊戲模式下，活動會增加當日氣色 4 點（每日一次）；不是實際皮膚改善或健康分，不需另填膚況。</div><button class="outline space" data-growth-tab="wellbeing">查看健康觀察 →</button><h3 class="section-label">活動紀錄</h3>${g.exercise.length ? g.exercise.slice().sort((a, b) => b.date.localeCompare(a.date)).map(x => `<article class="growth-record"><div><small>${x.date}</small><h4>${growth_model_js_1.EXERCISE_TYPES[x.kind]} · ${(0, dom_js_1.esc)(x.session)}</h4><p>${x.minutes === null ? '分鐘未填' : x.minutes + ' 分鐘'} · ${(0, dom_js_1.esc)(x.note || '無簡記')}</p></div><div><button class="link" data-growth-edit="exercise" data-record-id="${(0, dom_js_1.esc)(x.id)}">編輯</button><button class="link" data-growth-delete="exercise" data-record-id="${(0, dom_js_1.esc)(x.id)}">刪除</button></div></article>`).join('') : '<p class="empty">尚未登記活動，不推定妳先前沒運動。</p>'}` }; }

},
"src/ui/panels/routine.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRoutinePanel = buildRoutinePanel;
/** ui/panels/routine — extracted from verified 2.3.1; visual/gameplay parity first. */
const routines_js_1 = require("src/features/routines.js");
function buildRoutinePanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = 'Routine · 每日／每週';
        html = (0, routines_js_1.routinePanel)();
    }
    return { title, html, kicker };
}

},
"src/ui/panels/saves.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSavesPanel = buildSavesPanel;
/** ui/panels/saves — extracted from verified 2.3.1; visual/gameplay parity first. */
const clock_js_1 = require("src/core/clock.js");
const config_js_1 = require("src/core/config.js");
const runtime_js_1 = require("src/core/runtime.js");
const dom_js_1 = require("src/ui/dom.js");
function buildSavesPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '存檔中心';
        html = `<div class="row space"><button class="outline" data-panel="updates">更新與存檔保護 · ${config_js_1.RELEASE.appVersion}</button></div><div class="note">網站紀錄和聊天確認主帳分開；不自動讀取或合併舊測試版本。手機／電腦目前使用匯出、匯入轉移，沒有雲端自動同步。</div><div class="ledger"><div class="card"><span class="eyebrow">CHAT / CONFIRMED</span><h3>正式主帳（鎖定）</h3><b>140 XP · 75 幣</b><p>不因本頁操作而變更。</p></div><div class="card"><span class="eyebrow">WEBSITE / LOCAL SAVE</span><h3>網站本機帳本</h3><b>${runtime_js_1.runtime.state.xp} XP · ${runtime_js_1.runtime.state.coins} 幣</b><p>包含妳在此版本的操作。</p></div></div><div class="row space"><button class="outline" id="exportSave">${(0, dom_js_1.icon)('save')}匯出 JSON</button><button class="outline" id="exportHistory">匯出上一次備份</button><label class="outline">匯入 JSON<input id="importSave" class="visuallyhidden" type="file" accept=".json,application/json"></label></div><div id="importPreview" class="space"></div><small class="muted" style="display:block;margin-top:12px">匯入前會顯示數值讓妳確認；不相加。沿用既有儲存位置（不建立新帳本）：${config_js_1.KEY}。檔案模式換資料夾可能有不同儲存空間，請保留 JSON。</small><h3 class="section-label">試玩活動紀錄</h3>${runtime_js_1.runtime.state.logs.length ? runtime_js_1.runtime.state.logs.slice(0, 18).map(x => `<div class="activity"><small>${(0, dom_js_1.esc)((0, clock_js_1.localTime)(x.date))}</small><p>${(0, dom_js_1.esc)(x.text)}</p></div>`).join('') : '<div class="empty">這個版本尚未新增獎勵或任務紀錄。</div>'}<button class="text-button" id="resetSave" style="color:var(--danger)">重置網站本機紀錄（需要兩次確認）</button>`;
    }
    return { title, html, kicker };
}

},
"src/ui/panels/settings.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSettingsPanel = buildSettingsPanel;
/** ui/panels/settings — extracted from verified 2.3.1; visual/gameplay parity first. */
const config_js_1 = require("src/core/config.js");
const runtime_js_1 = require("src/core/runtime.js");
function buildSettingsPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '基地設定';
        html = `<div class="card"><div class="statrow"><span>基地時區</span><b>America/Los_Angeles</b></div><div class="statrow"><span>網站版本</span><b>${config_js_1.RELEASE.appVersion} · 建設、補給與成長</b></div><div class="statrow"><span>圖層</span><b>房間 / Lydia / 德牧</b></div><div class="statrow"><span>夥伴顯示預覽</span><button class="link" data-panel="companion">德牧出現／離開</button></div></div><div class="row space"><button class="primary" data-panel="profile">個人數值與技能</button><button class="outline" data-panel="exercise">運動／皮拉提斯</button><button class="outline" id="toggleHotspotsSetting">${runtime_js_1.runtime.state.settings.hotspots ? '關閉' : '開啟'}家具提示</button><button class="outline" data-panel="updates">更新與存檔保護</button><button class="outline" data-panel="saves">存檔與備份</button><button class="outline" data-panel="wardrobe">角色外觀</button><button class="outline" data-panel="world">基地藍圖</button><button class="outline" data-panel="kitchen">烹飪</button><button class="outline" data-panel="health">人物狀態與休整</button></div><p class="muted small space">畫面沒有自動播放影片、外部字型或大型特效。四段場景使用同一房間分區調光：05–08 晨光、08–16 日間、16–19 黃昏、19–05 夜間。不是實際日出日落或即時天氣；預覽不改任務日期。離線亦可開啟，唯有瀏覽器時間與儲存權限仍須正常。</p>`;
    }
    return { title, html, kicker };
}

},
"src/ui/panels/signal.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSignalPanel = buildSignalPanel;
/** ui/panels/signal — extracted from verified 2.3.1; visual/gameplay parity first. */
const runtime_js_1 = require("src/core/runtime.js");
const build_js_1 = require("src/features/build.js");
function buildSignalPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '住戶終端 · 室內訊號';
        html = runtime_js_1.runtime.state.firstBuild.installedAt ? (0, build_js_1.signalPanel)() : '<p class="empty">本段訊號尚未開放。<button data-panel="build">回基地建設</button></p>';
    }
    return { title, html, kicker };
}

},
"src/ui/panels/skillTree.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSkillTree = buildSkillTree;
exports.buildSkillNode = buildSkillNode;
exports.buildCredential = buildCredential;
const runtime_js_1 = require("src/core/runtime.js");
const clock_js_1 = require("src/core/clock.js");
const skill_tree_data_js_1 = require("src/features/skill-tree-data.js");
const skill_tree_model_js_1 = require("src/features/skill-tree-model.js");
const dom_js_1 = require("src/ui/dom.js");
const link = (url, title) => `<a class="link" href="${(0, dom_js_1.esc)(url)}" target="_blank" rel="noopener noreferrer">${(0, dom_js_1.esc)(title)} ↗</a>`;
function buildSkillTree() { const trees = (0, skill_tree_model_js_1.treeSummary)(runtime_js_1.runtime.state, (0, clock_js_1.today)()), t = trees.find(x => x.id === runtime_js_1.runtime.skillTrack) || trees[0]; return { title: '技能樹 · 把成長變成點數', kicker: 'MASTERY / 規則自訂、依據公開', html: `<div class="growth-tabs">${trees.map(x => `<button data-skill-track="${x.id}" aria-pressed="${x.id === t.id}">${x.name} ${x.score}</button>`).join('')}</div><div class="skill-tree-hero"><div><span class="eyebrow">${t.name}</span><h3>${t.score}<small> / 100 技能點</small></h3><p>${(0, dom_js_1.esc)(t.basis)}</p></div><div><strong>${(0, skill_tree_model_js_1.achievementPoints)(runtime_js_1.runtime.state, (0, clock_js_1.today)())}</strong><span>成就點 · 與技能點分開</span></div></div><p class="muted">下列是遊戲成長量尺，並非官方能力百分比。每節點「練過」拿 40% 點數，「能獨立完成」拿滿額；重複登記不疊分。只看懂語法不等於已獨立掌握。</p><div class="skill-node-grid">${t.nodes.map(n => `<button class="skill-node ${n.record ? 'learned' : ''}" data-skill-node="${n.id}"><span class="eyebrow">${n.record ? n.record.level === 'independent' ? '◆ 已登記獨立完成' : '◇ 練習中' : '○ 待解鎖'}</span><h4>${(0, dom_js_1.esc)(n.name)}</h4><p>${(0, dom_js_1.esc)(n.criterion)}</p><strong>${n.record ? (n.record.level === 'independent' ? n.points : Math.round(n.points * .4)) : 0} / ${n.points} 點</strong><small>${n.record ? '點開修改' : '點開登記；不自動評分'}</small></button>`).join('')}</div><details class="growth-explainer"><summary>舊版技能證據與新點數怎麼銜接？</summary><p>妳原有的 0–4 階證據與說明都保留。因為「SQL 階段 3」無法判定到底會哪個函數，沒有自動把新節點全部勾完，也沒有扣原有 XP 或幣。</p><button class="link" data-growth-tab="skills">查看保留的舊版證據 →</button></details><h3 class="section-label">測驗／證書／競賽成就</h3><p class="muted small">以下費用與範圍核對於 ${skill_tree_data_js_1.RESEARCH_DATE}。遊戲成就點是自訂獎勵，不是課程學分；登記不會自動驗真。作品、平台證書、監考認證分開，不保證錄取。</p><div class="credential-grid">${skill_tree_data_js_1.CREDENTIALS.filter(c => c.skill === t.id).map(c => `<article class="card"><span class="tag">${(0, dom_js_1.esc)(c.cost)}</span><h4>${(0, dom_js_1.esc)(c.name)}</h4><p>${(0, dom_js_1.esc)(c.note)}</p><small>${(0, dom_js_1.esc)(c.type)} · 成就 +${c.points}（一次）</small><div class="row space">${link(c.url, '官方說明')}<button class="outline" data-credential="${c.id}">${runtime_js_1.runtime.state.mastery.credentials[c.id] ? '查看／修改登記' : '我已完成，登記成就'}</button></div>${runtime_js_1.runtime.state.mastery.credentials[c.id] ? '<p class="muted small">已自行登記，未經本遊戲向官方驗證。</p>' : ''}</article>`).join('') || '<p class="empty">這項先用自己的可展示成果驗證，不塞一張無關的付費證書。</p>'}</div><details class="growth-explainer"><summary>能力參考來源與配分</summary><p>語法／能力主題參考官方文件；每節點配分、40%／100% 及成就加點由本遊戲設計。證書不自動點亮所有節點；比賽參賽、排名與獲獎不能混稱。</p>${Object.values(skill_tree_data_js_1.SOURCES).map(s => link(s.url, s.name)).join('<br>')}</details>` }; }
function buildSkillNode() { const node = skill_tree_data_js_1.TREES.flatMap(t => t.nodes).find(n => n.id === runtime_js_1.runtime.skillNode); if (!node)
    return { title: '節點不存在', html: '' }; const r = runtime_js_1.runtime.state.mastery.checks[node.id] || {}; return { title: node.name, kicker: '單一節點 / 不重複刷點', html: `<p class="note">${(0, dom_js_1.esc)(node.criterion)}</p>${node.source ? link(skill_tree_data_js_1.SOURCES[node.source].url, skill_tree_data_js_1.SOURCES[node.source].name) : '<p class="muted">本節點依職涯目標設計，非官方認證規格。</p>'}<form id="skillNodeForm" class="stack"><input type="hidden" name="id" value="${node.id}"><label class="field">目前階段<select name="level"><option value="none" ${!r.level ? 'selected' : ''}>未掌握／取消登記 · 0 點</option><option value="practice" ${r.level === 'practice' ? 'selected' : ''}>已練過 · ${Math.round(node.points * .4)} 點</option><option value="independent" ${r.level === 'independent' ? 'selected' : ''}>能獨立完成與說明 · ${node.points} 點</option></select></label><label class="field">完成日期<input type="date" name="date" value="${r.date || (0, clock_js_1.today)()}" max="${(0, clock_js_1.today)()}" required></label><label class="field">檔名、題目或驗證方式（選填）<textarea name="note" rows="3" maxlength="1500" placeholder="只需短註，不必再次上傳作業。">${(0, dom_js_1.esc)(r.note || '')}</textarea></label><p class="muted small">本人登記，不是系統已考核。請遵守課程與測驗的 AI 規則。</p><button class="primary" type="submit">保存節點</button></form>` }; }
function buildCredential() { const c = skill_tree_data_js_1.CREDENTIALS.find(c => c.id === runtime_js_1.runtime.skillCredential); if (!c)
    return { title: '成就不存在', html: '' }; const r = runtime_js_1.runtime.state.mastery.credentials[c.id] || {}; return { title: c.name, kicker: '成就依據 / 不自動驗真', html: `<p class="note">${(0, dom_js_1.esc)(c.type)} · ${(0, dom_js_1.esc)(c.cost)}<br>${(0, dom_js_1.esc)(c.note)}</p>${link(c.url, '官方來源')}<form id="credentialForm" class="stack"><input type="hidden" name="id" value="${c.id}"><label class="field">取得／完成日期<input type="date" name="date" max="${(0, clock_js_1.today)()}" value="${r.date || (0, clock_js_1.today)()}" required></label><label class="field">依據：公開證書編號、檔名、作品與結果<textarea name="reference" rows="3" maxlength="1000" required>${(0, dom_js_1.esc)(r.reference || '')}</textarea></label><p class="muted">不輸入帳密或私人證書照片；文字留在本機。成就點 +${c.points}，同一項重登不疊加。</p><button class="primary" type="submit">登記成就</button></form>${r.date ? `<button class="link space" data-credential-delete="${c.id}">移除這筆登記</button>` : ''}` }; }

},
"src/ui/panels/studyTrack.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStudyTrackPanel = buildStudyTrackPanel;
/** ui/panels/studyTrack — extracted from verified 2.3.1; visual/gameplay parity first. */
const study516_js_1 = require("src/features/study516.js");
function buildStudyTrackPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = 'TopHat 章節任務';
        html = (0, study516_js_1.study516Panel)() + (0, study516_js_1.otherChaptersPanel)();
    }
    return { title, html, kicker };
}

},
"src/ui/panels/tasks.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTasksPanel = buildTasksPanel;
/** ui/panels/tasks — extracted from verified 2.3.1; visual/gameplay parity first. */
const tasks_js_1 = require("src/features/tasks.js");
function buildTasksPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '任務指揮台';
        html = (0, tasks_js_1.tasksPanel)();
    }
    return { title, html, kicker };
}

},
"src/ui/panels/tophat.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTophatPanel = buildTophatPanel;
/** ui/panels/tophat — extracted from verified 2.3.1; visual/gameplay parity first. */
const study516_js_1 = require("src/features/study516.js");
function buildTophatPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = 'GSBA 516 · 期中與 TopHat';
        kicker = 'EXAM FIRST / ACTUAL ASSIGNMENTS';
        html = (0, study516_js_1.study516Panel)() + (0, study516_js_1.otherChaptersPanel)();
    }
    return { title, html, kicker };
}

},
"src/ui/panels/updates.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUpdatesPanel = buildUpdatesPanel;
/** ui/panels/updates — extracted from verified 2.3.1; visual/gameplay parity first. */
const storage_js_1 = require("src/core/storage.js");
function buildUpdatesPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '更新與存檔保護';
        html = (0, storage_js_1.updatesPanel)();
    }
    return { title, html, kicker };
}

},
"src/ui/panels/wardrobe.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWardrobePanel = buildWardrobePanel;
/** Fixed-identity view. Status tint is shared with home; outfits remain collection-only. */
const runtime_js_1 = require("src/core/runtime.js");
const inventory_js_1 = require("src/features/inventory.js");
const appearance_model_js_1 = require("src/features/appearance-model.js");
const clock_js_1 = require("src/core/clock.js");
const appearance_view_js_1 = require("src/ui/appearance-view.js");
const dom_js_1 = require("src/ui/dom.js");
function buildWardrobePanel() {
    const a = (0, appearance_model_js_1.appearanceFor)(runtime_js_1.runtime.state, (0, clock_js_1.today)());
    return { title: 'Lydia · 角色與衣櫃', kicker: 'IDENTITY / LOCKED ART', html: `<div class="appearance-identity">${(0, appearance_view_js_1.portraitView)({ caption: '與首頁共用同一份核准原圖' })}<div><span class="eyebrow">FIXED IDENTITY / 同一個妳</span><h3>外貌不重捏，狀態可調整。</h3><p>163 cm、深咖瞳孔、窄內雙與左後方藍綠挑染為固定設定。原本的臉型、眼型、五官位置和髮飾素材沒有更換。</p><span class="appearance-pill" data-appearance-label>${(0, dom_js_1.esc)(a.label)}</span><p class="muted small space">人物疲態連動已接上，只改局部配色；不壓扁臉、不改瞳孔或身形。髮飾、髮型與服裝穿戴尚未接上，原圖上的配件仍屬原圖，不代表已從背包裝備。</p><button class="outline" data-panel="profile">個人數值與成長</button><button class="primary" data-panel="health">人物狀態與效果預覽 →</button></div></div><h3 class="section-label">外觀收藏</h3>${runtime_js_1.runtime.state.items.filter(x => ['外觀', '時裝'].includes(x.type)).map(x => `<div class="card space collection-tile">${(0, inventory_js_1.itemImage)(x.name)}<div><strong>${(0, dom_js_1.esc)(x.name)}</strong><small>${x.name === '初始生存服' ? '本場景使用的居家造型' : '收藏已入背包 · 尚未製作穿著立繪'}</small></div></div>`).join('')}` };
}

},
"src/ui/panels/world.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWorldPanel = buildWorldPanel;
/** ui/panels/world — extracted from verified 2.3.1; visual/gameplay parity first. */
const build_js_1 = require("src/features/build.js");
function buildWorldPanel() {
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    {
        title = '基地建設 · 第一段';
        html = (0, build_js_1.buildPanel)();
    }
    return { title, html, kicker };
}

},
"src/ui/router.js": function(module, exports, require) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = close;
exports.show = show;
/** ui/router — extracted from verified 2.3.1; visual/gameplay parity first. */
const appearance_js_1 = require("src/features/appearance.js");
const skillTree_js_1 = require("src/ui/panels/skillTree.js");
const runtime_js_1 = require("src/core/runtime.js");
const build_js_1 = require("src/features/build.js");
const companion_js_1 = require("src/features/companion.js");
const decor_js_1 = require("src/features/decor.js");
const dom_js_1 = require("src/ui/dom.js");
const companion_js_2 = require("src/ui/panels/companion.js");
const courses_js_1 = require("src/ui/panels/courses.js");
const decor_js_2 = require("src/ui/panels/decor.js");
const editTask_js_1 = require("src/ui/panels/editTask.js");
const focus_js_1 = require("src/ui/panels/focus.js");
const health_js_1 = require("src/ui/panels/health.js");
const inventory_js_1 = require("src/ui/panels/inventory.js");
const item_js_1 = require("src/ui/panels/item.js");
const journal_js_1 = require("src/ui/panels/journal.js");
const kitchen_js_1 = require("src/ui/panels/kitchen.js");
const newtask_js_1 = require("src/ui/panels/newtask.js");
const routine_js_1 = require("src/ui/panels/routine.js");
const saves_js_1 = require("src/ui/panels/saves.js");
const settings_js_1 = require("src/ui/panels/settings.js");
const signal_js_1 = require("src/ui/panels/signal.js");
const studyTrack_js_1 = require("src/ui/panels/studyTrack.js");
const tasks_js_1 = require("src/ui/panels/tasks.js");
const tophat_js_1 = require("src/ui/panels/tophat.js");
const updates_js_1 = require("src/ui/panels/updates.js");
const wardrobe_js_1 = require("src/ui/panels/wardrobe.js");
const world_js_1 = require("src/ui/panels/world.js");
function close() {
    if (!runtime_js_1.runtime.appearanceRoomPreview)
        (0, appearance_js_1.clearAppearancePreview)();
    if ((0, dom_js_1.$)('dialog').open)
        (0, dom_js_1.$)('dialog').close();
    runtime_js_1.runtime.activePanel = '';
}
const profile_js_1 = require("src/ui/panels/profile.js");
const supplies_js_1 = require("src/features/supplies.js");
const PANEL_BUILDERS = { skillTree: skillTree_js_1.buildSkillTree, skillNode: skillTree_js_1.buildSkillNode, credential: skillTree_js_1.buildCredential, "profile": profile_js_1.buildProfilePanel, "growthGoal": profile_js_1.buildGoalForm, "careerRecord": profile_js_1.buildCareerForm, "skillEvidence": profile_js_1.buildSkillForm, "exercise": profile_js_1.buildExercisePanel, "supply": supplies_js_1.supplyPanel, "courses": courses_js_1.buildCoursesPanel, "tasks": tasks_js_1.buildTasksPanel, "routine": routine_js_1.buildRoutinePanel, "item": item_js_1.buildItemPanel, "newtask": newtask_js_1.buildNewtaskPanel, "editTask": editTask_js_1.buildEditTaskPanel, "tophat": tophat_js_1.buildTophatPanel, "exam516": tophat_js_1.buildTophatPanel, "studyTrack": studyTrack_js_1.buildStudyTrackPanel, "journal": journal_js_1.buildJournalPanel, "kitchen": kitchen_js_1.buildKitchenPanel, "companion": companion_js_2.buildCompanionPanel, "wardrobe": wardrobe_js_1.buildWardrobePanel, "inventory": inventory_js_1.buildInventoryPanel, "world": world_js_1.buildWorldPanel, "build": world_js_1.buildWorldPanel, "signal": signal_js_1.buildSignalPanel, "health": health_js_1.buildHealthPanel, "focus": focus_js_1.buildFocusPanel, "saves": saves_js_1.buildSavesPanel, "updates": updates_js_1.buildUpdatesPanel, "decor": decor_js_2.buildDecorPanel, "settings": settings_js_1.buildSettingsPanel };
function show(panel, keepScroll = false) {
    if (runtime_js_1.runtime.appearancePreview && !['health', 'wardrobe'].includes(panel))
        (0, appearance_js_1.clearAppearancePreview)();
    runtime_js_1.runtime.appearanceRoomPreview = false;
    if (runtime_js_1.runtime.buildPreview) {
        runtime_js_1.runtime.buildPreview = false;
        (0, build_js_1.renderBuild)();
    }
    if (runtime_js_1.runtime.decorPreview || runtime_js_1.runtime.decorBefore) {
        runtime_js_1.runtime.decorPreview = null;
        runtime_js_1.runtime.decorBefore = false;
        (0, decor_js_1.renderDecor)();
    }
    const oldScroll = (0, dom_js_1.$)('dialogBody').scrollTop;
    const oldDialogScroll = (0, dom_js_1.$)('dialog').scrollTop;
    runtime_js_1.runtime.activePanel = panel;
    (0, dom_js_1.$)('dialog').dataset.view = panel;
    let title = '', html = '', kicker = 'LAST DORM / LOCAL SAVE';
    const spec = PANEL_BUILDERS[panel]?.();
    if (spec)
        ({ title, html, kicker } = spec);
    (0, dom_js_1.$)('dialogTitle').textContent = title;
    (0, dom_js_1.$)('dialogKicker').textContent = kicker;
    (0, dom_js_1.$)('dialogBody').innerHTML = html;
    (0, companion_js_1.bindCompanionArt)((0, dom_js_1.$)('dialogBody'));
    (0, dom_js_1.icons)((0, dom_js_1.$)('dialog'));
    (0, appearance_js_1.renderAppearance)();
    if (!(0, dom_js_1.$)('dialog').open)
        (0, dom_js_1.$)('dialog').showModal();
    (0, dom_js_1.$)('dialogBody').scrollTop = keepScroll ? oldScroll : 0;
    (0, dom_js_1.$)('dialog').scrollTop = keepScroll ? oldDialogScroll : 0;
    // The outer dialog is the scrolling container on small screens. Reset both.
    if (!keepScroll)
        requestAnimationFrame(() => { if (runtime_js_1.runtime.activePanel === panel) {
            (0, dom_js_1.$)('dialog').scrollTop = 0;
            (0, dom_js_1.$)('dialogBody').scrollTop = 0;
        } });
}

}
};
const cache=Object.create(null);
function load(id){if(cache[id])return cache[id].exports;const factory=factories[id];if(!factory)throw new Error('Unknown module '+id);const m={exports:{}};cache[id]=m;factory(m,m.exports,load);return m.exports;}
load('src/main.js');
})();