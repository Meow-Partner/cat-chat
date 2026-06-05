// ========== 休闲板块模块 ==========

// 休闲类型配置
const leisureTypes = [
    { id: 'movie', icon: '🎬', name: '电影', action: '看电影', color: 'color-movie' },
    { id: 'book', icon: '📚', name: '书籍', action: '看书', color: 'color-book' },
    { id: 'game', icon: '🎮', name: '游戏', action: '打游戏', color: 'color-game' },
    { id: 'art', icon: '🎨', name: '绘画', action: '画画', color: 'color-art' },
    { id: 'music', icon: '🎵', name: '音乐', action: '听歌', color: 'color-music' },
    { id: 'dance', icon: '💃', name: '舞蹈', action: '欣赏舞蹈', color: 'color-dance' },
    { id: 'shopping', icon: '🛍️', name: '购物', action: '购物', color: 'color-shopping' },
    { id: 'pet', icon: '🐾', name: '萌宠', action: '撸猫', color: 'color-pet' },
    { id: 'gardening', icon: '🌱', name: '园艺', action: '园艺', color: 'color-gardening' },
    { id: 'other', icon: '✨', name: '其他', action: '休闲', color: 'color-other' }
];

// 沈星回推荐的电影详细信息
const hisMovieDetails = {
    '小孩与鹰': {
        director: '肯·洛奇',
        actors: '大卫·布拉德利、Freddie Fletcher',
        year: '1969',
        country: '英国',
        duration: '110分钟',
        rating: '8.5',
        summary: '讲述一个生活在英格兰工业城市的男孩比利，他生活在一个破碎的家庭，在学校也备受欺凌。唯一能让他感到自由和快乐的是他驯养的一只名叫凯斯的老鹰。',
        watchLink: 'https://movie.douban.com/subject/1292349/'
    },
    '沙之城市': {
        director: '马赫德·哈桑',
        actors: '待补充',
        year: '2025',
        country: '孟加拉国',
        duration: '99分钟',
        rating: '7.8',
        summary: '在一个被沙漠逐渐吞噬的城市，居民们每天都在与黄沙抗争。',
        watchLink: 'https://movie.douban.com/'
    },
    '三声再见': {
        director: '伊莎贝尔·科赛特',
        actors: '阿尔芭·罗尔瓦赫尔',
        year: '2025',
        country: '意大利/西班牙',
        duration: '待补充',
        rating: '7.5',
        summary: '因小事吵闹令多年恋情告终，她又要面对身体突如其来的噩耗。',
        watchLink: 'https://movie.douban.com/'
    },
    '起程之日': {
        director: '艾米莉·博宁',
        actors: 'Juliette Armanet',
        year: '2021',
        country: '法国',
        duration: '待补充',
        rating: '7.2',
        summary: '高中毕业后，朱利安离开家乡去巴黎创造更好的生活。',
        watchLink: 'https://movie.douban.com/'
    },
    '发纸水谣': {
        director: '张明归',
        actors: '尼古拉斯·格劳',
        year: '2025',
        country: '越南/法国/比利时',
        duration: '71分钟',
        rating: '7.3',
        summary: '影片融合剧情与纪录片元素，讲述了关于纸、水和记忆的故事。',
        watchLink: 'https://movie.douban.com/'
    }
};

// 默认数据
let leisureData = {
    movie: { myItems: [], hisItems: ['小孩与鹰', '沙之城市', '三声再见', '起程之日', '发纸水谣'] },
    book: { myItems: [], hisItems: ['百年孤独', '挪威的森林', '追风筝的人'] },
    game: { myItems: [], hisItems: ['塞尔达传说', '动物森友会', '星露谷物语'] },
    art: { myItems: [], hisItems: ['向日葵', '星月夜', '戴珍珠耳环的少女'] },
    music: { myItems: [], hisItems: ['月光奏鸣曲', '欢乐颂', '蓝色多瑙河'] },
    dance: { myItems: [], hisItems: ['天鹅湖', '胡桃夹子', '大河之舞'] },
    shopping: { myItems: [], hisItems: ['复古相机', '黑胶唱片', '手冲咖啡壶'] },
    pet: { myItems: [], hisItems: ['布偶猫', '金毛犬', '龙猫'] },
    gardening: { myItems: [], hisItems: ['多肉植物', '玫瑰', '绿萝'] },
    other: { myItems: [], hisItems: ['书法', '围棋', '品茶'] }
};

// 全局变量
let currentLeisure = { type: null, activityName: null, action: null };
let inviteTimer = null;
let inviteCount = 0;
let isLeisureInterrupted = false;

// 辅助函数
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// 保存数据
function saveLeisureData() {
    localStorage.setItem('leisure_data_v3', JSON.stringify(leisureData));
}

// 加载数据
function loadLeisureData() {
    var stored = localStorage.getItem('leisure_data_v3');
    if (stored) {
        try {
            var data = JSON.parse(stored);
            for (var type in leisureData) {
                if (data[type]) {
                    if (data[type].myItems) leisureData[type].myItems = data[type].myItems;
                    if (data[type].hisItems) leisureData[type].hisItems = data[type].hisItems;
                }
            }
        } catch(e) {}
    }
    renderLeisurePage();
}

// 随机获取活动名称
function getRandomActivityName(type, isHis) {
    var items = isHis ? leisureData[type].hisItems : leisureData[type].myItems;
    if (items && items.length > 0) {
        return items[Math.floor(Math.random() * items.length)];
    }
    var defaultNames = {
        movie: '未知电影', book: '未知书籍', game: '未知游戏', art: '未知画作',
        music: '未知歌曲', dance: '未知舞蹈', shopping: '未知商品', pet: '未知宠物',
        gardening: '未知植物', other: '未知活动'
    };
    return defaultNames[type] || '未知活动';
}

// 随机设置休闲状态
function setRandomLeisure() {
    if (isLeisureInterrupted) return;
    
    var availableTypes = [];
    for (var i = 0; i < leisureTypes.length; i++) {
        var type = leisureTypes[i];
        if (leisureData[type.id].hisItems.length > 0 || leisureData[type.id].myItems.length > 0) {
            availableTypes.push(type);
        }
    }
    
    if (availableTypes.length === 0) return;
    
    var randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    var isHis = Math.random() > 0.5;
    var activityName = getRandomActivityName(randomType.id, isHis);
    
    currentLeisure = {
        type: randomType.id,
        activityName: activityName,
        action: randomType.action,
        isHis: isHis,
        color: randomType.color
    };
    updateLeisureStatus();
}

// 更新状态栏显示
function updateLeisureStatus() {
    var leisureSpan = document.getElementById('leisureStatus');
    var onlineSpan = document.getElementById('onlineStatus');
    if (!leisureSpan) return;
    
    if (currentLeisure.type && !isLeisureInterrupted) {
        var colorClass = '';
        for (var i = 0; i < leisureTypes.length; i++) {
            if (leisureTypes[i].id === currentLeisure.type) {
                colorClass = leisureTypes[i].color;
                break;
            }
        }
        onlineSpan.innerText = '在线';
        leisureSpan.innerHTML = '，正在' + currentLeisure.action + ' <span class="' + colorClass + '">「' + currentLeisure.activityName + '」</span> ▼';
        leisureSpan.style.cursor = 'pointer';
        leisureSpan.onclick = showLeisureActionMenu;
    } else if (isLeisureInterrupted) {
        onlineSpan.innerText = '不在线';
        leisureSpan.innerHTML = '';
    } else {
        onlineSpan.innerText = '在线';
        leisureSpan.innerHTML = '';
    }
}

// 显示操作菜单
function showLeisureActionMenu() {
    if (typeof closeModal === 'function') closeModal();
    var modal = document.createElement('div');
    modal.className = 'group-select-modal';
    modal.innerHTML = '<div class="group-select-header">🎯 选择操作</div>' +
        '<div class="group-select-list">' +
        '<div class="group-select-item" id="joinAction">🤝 想和他一起</div>' +
        '<div class="group-select-item" id="ignoreAction">😴 暂不打扰</div>' +
        '<div class="group-select-item" id="interruptAction">💢 打断他</div>' +
        '</div>';
    document.body.appendChild(modal);
    window.currentModal = modal;
    
    document.getElementById('joinAction').onclick = function() {
        respondToLeisure('join');
        modal.remove();
        window.currentModal = null;
    };
    document.getElementById('ignoreAction').onclick = function() {
        respondToLeisure('ignore');
        modal.remove();
        window.currentModal = null;
    };
    document.getElementById('interruptAction').onclick = function() {
        respondToLeisure('interrupt');
        modal.remove();
        window.currentModal = null;
    };
    modal.onclick = function(e) { if (e.target === modal) { modal.remove(); window.currentModal = null; } };
}

// 响应操作
function respondToLeisure(response) {
    if (response === 'join') {
        if (typeof addSystemMessage === 'function') {
            addSystemMessage('你加入了沈星回的活动，一起' + currentLeisure.action + '「' + currentLeisure.activityName + '」');
        }
        if (typeof switchPage === 'function') {
            switchPage('leisure-page');
        }
        setTimeout(function() {
            var category = document.getElementById('leisureContent_' + currentLeisure.type);
            if (category) {
                category.classList.add('expanded');
                var header = category.previousElementSibling;
                if (header) {
                    var arrow = header.querySelector('.arrow');
                    if (arrow) arrow.innerHTML = '▼';
                }
                category.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (currentLeisure.type === 'movie' && currentLeisure.isHis && hisMovieDetails[currentLeisure.activityName]) {
                    setTimeout(function() { showMovieDetail(currentLeisure.activityName); }, 300);
                }
            }
        }, 100);
    } else if (response === 'ignore') {
        if (typeof addSystemMessage === 'function') {
            addSystemMessage('你选择不打扰沈星回，他继续' + currentLeisure.action + '「' + currentLeisure.activityName + '」');
        }
    } else if (response === 'interrupt') {
        if (typeof addSystemMessage === 'function') {
            addSystemMessage('你打断了沈星回的活动');
        }
        isLeisureInterrupted = true;
        currentLeisure = { type: null, activityName: null, action: null };
        updateLeisureStatus();
        if (inviteTimer) clearTimeout(inviteTimer);
        inviteCount = 0;
    }
}

// 显示电影详情弹窗（修复关闭按钮问题）
function showMovieDetail(movieName) {
    var detail = hisMovieDetails[movieName];
    if (!detail) return;
    
    if (typeof closeModal === 'function') closeModal();
    var modal = document.createElement('div');
    modal.className = 'sticker-modal';
    modal.style.width = '340px';
    modal.style.maxHeight = '80vh';
    modal.innerHTML = '<div class="modal-header"><h4>🎬 ' + escapeHtml(movieName) + '</h4><button class="modal-close">✕</button></div>' +
        '<div class="modal-content" style="display:block; text-align:left; line-height:1.6;">' +
        '<div style="margin-bottom:8px;"><strong>导演：</strong>' + escapeHtml(detail.director) + '</div>' +
        '<div style="margin-bottom:8px;"><strong>主演：</strong>' + escapeHtml(detail.actors) + '</div>' +
        '<div style="margin-bottom:8px;"><strong>年份：</strong>' + escapeHtml(detail.year) + '</div>' +
        '<div style="margin-bottom:8px;"><strong>国家：</strong>' + escapeHtml(detail.country) + '</div>' +
        '<div style="margin-bottom:8px;"><strong>片长：</strong>' + escapeHtml(detail.duration) + '</div>' +
        '<div style="margin-bottom:8px;"><strong>评分：</strong>⭐ ' + escapeHtml(detail.rating) + '</div>' +
        '<div style="margin-bottom:12px;"><strong>简介：</strong><br>' + escapeHtml(detail.summary) + '</div>' +
        '<div style="margin-top:12px; text-align:center;">' +
        '<a href="' + detail.watchLink + '" target="_blank" style="background:#e29bc2; color:white; padding:8px 16px; border-radius:30px; text-decoration:none; display:inline-block;">🎬 在线观看</a>' +
        '</div>' +
        '</div>';
    document.body.appendChild(modal);
    
    // 设置当前模态框
    window.currentModal = modal;
    
    // 关闭按钮事件
    modal.querySelector('.modal-close').onclick = function() { 
        modal.remove();
        window.currentModal = null;
    };
    
    // 点击背景关闭
    modal.onclick = function(e) { 
        if (e.target === modal) {
            modal.remove();
            window.currentModal = null;
        }
    };
}

// 渲染休闲页面
function renderLeisurePage() {
    var container = document.getElementById('leisureContainer');
    if (!container) {
        console.log('leisureContainer 不存在');
        return;
    }
    container.innerHTML = '';
    
    for (var i = 0; i < leisureTypes.length; i++) {
        var type = leisureTypes[i];
        var categoryData = leisureData[type.id];
        var isExpanded = localStorage.getItem('leisure_expand_' + type.id) === 'true';
        
        var catDiv = document.createElement('div');
        catDiv.className = 'leisure-category';
        catDiv.innerHTML = '<div class="category-header" data-category="' + type.id + '">' +
            '<div class="category-title"><span class="arrow">' + (isExpanded ? '▼' : '▶') + '</span><span>' + type.icon + ' ' + type.name + '</span></div>' +
            '<div class="category-actions"></div>' +
            '</div>' +
            '<div class="category-content" id="leisureContent_' + type.id + '"></div>';
        container.appendChild(catDiv);
        
        var contentDiv = document.getElementById('leisureContent_' + type.id);
        if (isExpanded) contentDiv.classList.add('expanded');
        
        // 他的收藏
        var hisSection = document.createElement('div');
        hisSection.style.marginBottom = '16px';
        hisSection.innerHTML = '<div style="font-weight:600; color:#b15d88; margin-bottom:8px;">⭐ 沈星回的收藏</div>';
        
        for (var j = 0; j < categoryData.hisItems.length; j++) {
            var item = categoryData.hisItems[j];
            var itemDiv = document.createElement('div');
            itemDiv.className = 'leisure-item-card';
            if (type.id === 'movie') {
                itemDiv.style.cursor = 'pointer';
                itemDiv.onclick = (function(movieName) {
                    return function() { showMovieDetail(movieName); };
                })(item);
            }
            itemDiv.innerHTML = '<div class="item-name">📝 ' + escapeHtml(item) + '</div>' +
                '<div class="item-actions">' +
                '<button class="delete-his-item" data-category="' + type.id + '" data-idx="' + j + '" style="background:#ffe0e7;">🗑️ 删除</button>' +
                '</div>';
            hisSection.appendChild(itemDiv);
        }
        
        var addHisArea = document.createElement('div');
        addHisArea.className = 'add-item-area';
        addHisArea.innerHTML = '<input type="text" id="newHisItem_' + type.id + '" placeholder="添加' + type.name + '名称" style="flex:1">' +
            '<button class="add-his-item" data-category="' + type.id + '">➕ 添加</button>';
        hisSection.appendChild(addHisArea);
        contentDiv.appendChild(hisSection);
        
        // 我的收藏
        var mySection = document.createElement('div');
        mySection.innerHTML = '<div style="font-weight:600; color:#b15d88; margin-bottom:8px;">❤️ 我的收藏</div>';
        
        for (var k = 0; k < categoryData.myItems.length; k++) {
            var myItem = categoryData.myItems[k];
            var myItemDiv = document.createElement('div');
            myItemDiv.className = 'leisure-item-card';
            myItemDiv.innerHTML = '<div class="item-name">📝 ' + escapeHtml(myItem) + '</div>' +
                '<div class="item-actions">' +
                '<button class="delete-my-item" data-category="' + type.id + '" data-idx="' + k + '" style="background:#ffe0e7;">🗑️ 删除</button>' +
                '</div>';
            mySection.appendChild(myItemDiv);
        }
        
        var addMyArea = document.createElement('div');
        addMyArea.className = 'add-item-area';
        addMyArea.innerHTML = '<input type="text" id="newMyItem_' + type.id + '" placeholder="添加' + type.name + '名称" style="flex:1">' +
            '<button class="add-my-item" data-category="' + type.id + '">➕ 添加</button>';
        mySection.appendChild(addMyArea);
        contentDiv.appendChild(mySection);
    }
    
    // 绑定事件
    document.querySelectorAll('.category-header').forEach(function(header) {
        header.onclick = function(e) {
            if (e.target.tagName === 'BUTTON') return;
            var categoryId = this.getAttribute('data-category');
            var content = document.getElementById('leisureContent_' + categoryId);
            var arrow = this.querySelector('.arrow');
            content.classList.toggle('expanded');
            var isExpandedNow = content.classList.contains('expanded');
            arrow.innerHTML = isExpandedNow ? '▼' : '▶';
            localStorage.setItem('leisure_expand_' + categoryId, isExpandedNow);
        };
    });
    
    // 添加他的收藏
    document.querySelectorAll('.add-his-item').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            var categoryId = this.getAttribute('data-category');
            var input = document.getElementById('newHisItem_' + categoryId);
            var name = input.value.trim();
            if (!name) { alert("请输入名称"); return; }
            leisureData[categoryId].hisItems.push(name);
            saveLeisureData();
            renderLeisurePage();
            setRandomLeisure();
        };
    });
    
    // 添加我的收藏
    document.querySelectorAll('.add-my-item').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            var categoryId = this.getAttribute('data-category');
            var input = document.getElementById('newMyItem_' + categoryId);
            var name = input.value.trim();
            if (!name) { alert("请输入名称"); return; }
            leisureData[categoryId].myItems.push(name);
            saveLeisureData();
            renderLeisurePage();
            setRandomLeisure();
        };
    });
    
    // 删除他的收藏
    document.querySelectorAll('.delete-his-item').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            var categoryId = this.getAttribute('data-category');
            var idx = parseInt(this.getAttribute('data-idx'));
            if (confirm('确定删除吗？')) {
                leisureData[categoryId].hisItems.splice(idx, 1);
                saveLeisureData();
                renderLeisurePage();
                setRandomLeisure();
            }
        };
    });
    
    // 删除我的收藏
    document.querySelectorAll('.delete-my-item').forEach(function(btn) {
        btn.onclick = function(e) {
            e.stopPropagation();
            var categoryId = this.getAttribute('data-category');
            var idx = parseInt(this.getAttribute('data-idx'));
            if (confirm('确定删除吗？')) {
                leisureData[categoryId].myItems.splice(idx, 1);
                saveLeisureData();
                renderLeisurePage();
                setRandomLeisure();
            }
        };
    });
}

// 触发邀请
function triggerInvite(isFromLeisurePage) {
    if (inviteTimer) return;
    if (inviteCount >= 2) return;
    
    var availableTypes = [];
    for (var i = 0; i < leisureTypes.length; i++) {
        var type = leisureTypes[i];
        if (leisureData[type.id].hisItems.length > 0 || leisureData[type.id].myItems.length > 0) {
            availableTypes.push(type);
        }
    }
    if (availableTypes.length === 0) return;
    
    var randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    var isHis = Math.random() > 0.5;
    var activityName = getRandomActivityName(randomType.id, isHis);
    var fromText = isHis ? '沈星回的收藏' : '你的收藏';
    var colorClass = randomType.color;
    
    var inviteBanner = document.createElement('div');
    inviteBanner.className = 'invite-banner';
    inviteBanner.id = 'inviteBanner';
    inviteBanner.innerHTML = '<div class="invite-text">✨ 沈星回邀请您一起' + randomType.action + ' <span class="' + colorClass + '">「' + activityName + '」</span>（来自' + fromText + '）</div>' +
        '<div class="invite-actions">' +
        (isFromLeisurePage ? '<button id="inviteAccept">✅ 同意</button><button id="inviteReject">❌ 拒绝</button>' :
        '<button id="inviteAccept">✅ 同意</button><button id="inviteLater">⏰ 稍等</button><button id="inviteReject">❌ 不想</button>') +
        '</div>';
    
    var chatArea = document.getElementById('chatArea');
    if (chatArea) {
        var existing = document.getElementById('inviteBanner');
        if (existing) existing.remove();
        chatArea.insertBefore(inviteBanner, chatArea.firstChild);
    }
    
    document.getElementById('inviteAccept').onclick = function() {
        if (typeof addSystemMessage === 'function') {
            addSystemMessage('你同意了沈星回的邀请，一起' + randomType.action + '「' + activityName + '」');
        }
        inviteBanner.remove();
        if (inviteTimer) clearTimeout(inviteTimer);
        inviteCount = 0;
        if (typeof switchPage === 'function') switchPage('leisure-page');
        setTimeout(function() {
            var category = document.getElementById('leisureContent_' + randomType.id);
            if (category) {
                category.classList.add('expanded');
                var header = category.previousElementSibling;
                if (header) {
                    var arrow = header.querySelector('.arrow');
                    if (arrow) arrow.innerHTML = '▼';
                }
                category.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (randomType.id === 'movie' && isHis && hisMovieDetails[activityName]) {
                    setTimeout(function() { showMovieDetail(activityName); }, 300);
                }
            }
        }, 100);
    };
    
    if (!isFromLeisurePage) {
        document.getElementById('inviteLater').onclick = function() {
            if (typeof addSystemMessage === 'function') {
                addSystemMessage('你让沈星回稍等一下');
            }
            inviteBanner.remove();
            inviteTimer = setTimeout(function() {
                inviteTimer = null;
                inviteCount++;
                if (inviteCount < 2) {
                    triggerInvite(false);
                } else {
                    if (typeof addSystemMessage === 'function') {
                        addSystemMessage('沈星回见你没有回应，去忙别的事情了');
                    }
                }
            }, 60000);
        };
    }
    
    document.getElementById('inviteReject').onclick = function() {
        if (typeof addSystemMessage === 'function') {
            addSystemMessage('你拒绝了沈星回的邀请');
        }
        inviteBanner.remove();
        if (inviteTimer) clearTimeout(inviteTimer);
        inviteCount++;
        if (inviteCount >= 2) {
            if (typeof addSystemMessage === 'function') {
                addSystemMessage('沈星回决定不再打扰你了');
            }
        }
    };
}

// 初始化
loadLeisureData();
setRandomLeisure();
setInterval(function() {
    if (!isLeisureInterrupted && !inviteTimer && currentLeisure.type) {
        setRandomLeisure();
    }
}, 300000);