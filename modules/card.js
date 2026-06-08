// ========== modules/card.js · 2026-06-08 16:20:00 ==========
(function() {
    if (window.CatChat && window.CatChat.card) {
        console.log('card 模块已加载，跳过');
        return;
    }
    
    window.CatChat = window.CatChat || {};
    
    // 字卡数据
    let userGroups = {};
    let groupLocks = {};
    let groupDedup = {};
    
    // 保存字卡数据
    function saveCardData() {
        localStorage.setItem('userGroups', JSON.stringify(userGroups));
        localStorage.setItem('groupLocks', JSON.stringify(groupLocks));
        localStorage.setItem('groupDedup', JSON.stringify(groupDedup));
    }
    
    // 加载字卡数据
    function loadCardData() {
        const storedGroups = localStorage.getItem('userGroups');
        if (storedGroups) {
            try {
                userGroups = JSON.parse(storedGroups);
            } catch(e) {}
        }
        const storedLocks = localStorage.getItem('groupLocks');
        if (storedLocks) {
            try {
                groupLocks = JSON.parse(storedLocks);
            } catch(e) {}
        }
        const storedDedup = localStorage.getItem('groupDedup');
        if (storedDedup) {
            try {
                groupDedup = JSON.parse(storedDedup);
            } catch(e) {}
        }
        renderGroups();
    }
    
    // 渲染分组（占位，后续可完善）
    function renderGroups() {
        const container = document.getElementById('groupsContainer');
        if (!container) return;
        container.innerHTML = '<p>字卡管理功能开发中</p>';
    }
    
    // 获取所有回复（用于随机回复）
    function getAllReplies() {
        let all = [];
        for (let g in userGroups) {
            if (userGroups[g] && Array.isArray(userGroups[g])) {
                all = all.concat(userGroups[g]);
            }
        }
        return all;
    }
    
    // 导出到命名空间
    window.CatChat.card = {
        userGroups: userGroups,
        saveCardData: saveCardData,
        loadCardData: loadCardData,
        renderGroups: renderGroups,
        getAllReplies: getAllReplies
    };
    
    // 兼容旧全局调用
    window.userGroups = userGroups;
    window.saveGroups = saveCardData;
    window.loadGroups = loadCardData;
    window.renderGroups = renderGroups;
    window.getAllReplies = getAllReplies;
    
    // 自动加载
    loadCardData();
    
    console.log('✅ card 模块已加载');
})();
