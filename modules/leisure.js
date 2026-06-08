// ========== modules/leisure.js · 2026-06-08 23:00:00 ==========
(function() {
    if (window.CatChat && window.CatChat.leisure) {
        console.log('leisure 模块已加载，跳过');
        return;
    }
    
    window.CatChat = window.CatChat || {};
    
    let leisureData = {};
    let inviteCount = 0;
    let inviteTimer = null;
    let isLeisureInterrupted = false;
    
    const leisureTypes = ['movie', 'book', 'food', 'music', 'game', 'plant'];
    
    const defaultLeisureData = {
        movie: { myItems: [], hisItems: ['流浪地球', '星际穿越', '你的名字。'], progress: {} },
        book: { myItems: [], hisItems: ['不存在的骑士', '小王子'], progress: {} },
        food: { myItems: [], hisItems: ['火锅', '烤肉', '番茄炒蛋'], progress: {} },
        music: { myItems: [], hisItems: ['周杰伦', '告五人'], progress: {} },
        game: { myItems: [], hisItems: ['五子棋', '猜数字'], progress: {} },
        plant: { myItems: [], hisItems: ['多肉植物', '绿萝'], progress: {} }
    };
    
    function saveLeisureData() {
        localStorage.setItem('leisure_data', JSON.stringify(leisureData));
    }
    
    function loadLeisureData() {
        const stored = localStorage.getItem('leisure_data');
        if (stored) {
            try {
                leisureData = JSON.parse(stored);
            } catch(e) {}
        }
        for (let type of leisureTypes) {
            if (!leisureData[type]) {
                leisureData[type] = defaultLeisureData[type];
            }
        }
        renderLeisurePage();
    }
    
    function renderLeisurePage() {
        const container = document.getElementById('leisureContainer');
        if (!container) return;
        
        let html = '<div class="leisure-page">';
        for (let type of leisureTypes) {
            const typeName = getTypeName(type);
            const data = leisureData[type] || defaultLeisureData[type];
            html += `
                <div class="leisure-category" data-type="${type}">
                    <div class="category-header">
                        <span class="category-title">${typeName}</span>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="category-content" style="display: none;">
                        <div class="leisure-section">
                            <h4>⭐ 他的收藏</h4>
                            <div class="his-items">${data.hisItems.map(item => `<span class="leisure-tag">${item}</span>`).join('')}</div>
                        </div>
                        <div class="leisure-section">
                            <h4>🐱 我的收藏</h4>
                            <div class="my-items">${data.myItems.map(item => `<span class="leisure-tag">${item}</span>`).join('')}</div>
                            <input type="text" placeholder="添加我的收藏" class="add-item-input" data-type="${type}">
                            <button class="add-item-btn" data-type="${type}">添加</button>
                        </div>
                        <div class="leisure-section">
                            <h4>🎯 一起做</h4>
                            <button class="invite-btn" data-type="${type}">邀请他一起${typeName}</button>
                        </div>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
        
        bindCategoryEvents();
        bindAddItemEvents();
        bindInviteEvents();
    }
    
    function getTypeName(type) {
        const names = { movie: '🎬 电影', book: '📚 书籍', food: '🍜 美食', music: '🎵 音乐', game: '🎮 游戏', plant: '🌱 园艺' };
        return names[type] || type;
    }
    
    function bindCategoryEvents() {
        document.querySelectorAll('.leisure-category .category-header').forEach(header => {
            header.onclick = () => {
                const content = header.parentElement.querySelector('.category-content');
                const toggle = header.querySelector('.category-toggle');
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    toggle.textContent = '▲';
                } else {
                    content.style.display = 'none';
                    toggle.textContent = '▼';
                }
            };
        });
    }
    
    function bindAddItemEvents() {
        document.querySelectorAll('.add-item-btn').forEach(btn => {
            btn.onclick = () => {
                const type = btn.getAttribute('data-type');
                const input = btn.parentElement.querySelector('.add-item-input');
                const value = input.value.trim();
                if (value) {
                    if (!leisureData[type]) leisureData[type] = defaultLeisureData[type];
                    leisureData[type].myItems.push(value);
                    saveLeisureData();
                    renderLeisurePage();
                }
            };
        });
    }
    
    function bindInviteEvents() {
        document.querySelectorAll('.invite-btn').forEach(btn => {
            btn.onclick = () => {
                const type = btn.getAttribute('data-type');
                const typeName = getTypeName(type);
                if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                    window.CatChat.chat.addMessage(`邀请你一起${typeName}`, false);
                } else {
                    alert(`邀请他一起${typeName}`);
                }
            };
        });
    }
    
    function triggerInvite(isActive) {
        console.log('triggerInvite:', isActive);
    }
    
    window.CatChat.leisure = {
        leisureData: leisureData,
        saveLeisureData: saveLeisureData,
        loadLeisureData: loadLeisureData,
        renderLeisurePage: renderLeisurePage,
        triggerInvite: triggerInvite
    };
    
    window.leisureData = leisureData;
    window.saveLeisureData = saveLeisureData;
    window.loadLeisureData = loadLeisureData;
    window.renderLeisurePage = renderLeisurePage;
    window.triggerInvite = triggerInvite;
    
    loadLeisureData();
    
    console.log('✅ leisure 模块已加载');
})();
