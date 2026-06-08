// ========== modules/leisure.js · 2026-06-08 16:30:00 ==========
(function() {
    if (window.CatChat && window.CatChat.leisure) {
        console.log('leisure 模块已加载，跳过');
        return;
    }
    
    window.CatChat = window.CatChat || {};
    
    // 休闲数据
    let leisureData = {};
    let inviteCount = 0;
    let inviteTimer = null;
    let isLeisureInterrupted = false;
    
    // 休闲类型
    const leisureTypes = ['movie', 'book', 'food', 'music', 'game'];
    
    // 保存数据
    function saveLeisureData() {
        localStorage.setItem('leisure_data', JSON.stringify(leisureData));
    }
    
    // 加载数据
    function loadLeisureData() {
        const stored = localStorage.getItem('leisure_data');
        if (stored) {
            try {
                leisureData = JSON.parse(stored);
            } catch(e) {}
        }
        renderLeisurePage();
    }
    
    // 渲染休闲页
    function renderLeisurePage() {
        const container = document.getElementById('leisureContainer');
        if (!container) return;
        container.innerHTML = '<p>休闲功能开发中</p>';
        // 这里后续可以添加具体的休闲项目列表
    }
    
    // 触发邀请
    function triggerInvite(isActive) {
        console.log('triggerInvite:', isActive);
        // 邀请逻辑待实现
    }
    
    // 导出到命名空间
    window.CatChat.leisure = {
        leisureData: leisureData,
        saveLeisureData: saveLeisureData,
        loadLeisureData: loadLeisureData,
        renderLeisurePage: renderLeisurePage,
        triggerInvite: triggerInvite,
        getInviteCount: function() { return inviteCount; },
        setInviteCount: function(val) { inviteCount = val; }
    };
    
    // 兼容旧全局调用
    window.leisureData = leisureData;
    window.saveLeisureData = saveLeisureData;
    window.loadLeisureData = loadLeisureData;
    window.renderLeisurePage = renderLeisurePage;
    window.triggerInvite = triggerInvite;
    window.inviteCount = inviteCount;
    window.inviteTimer = inviteTimer;
    window.isLeisureInterrupted = isLeisureInterrupted;
    
    // 自动加载
    loadLeisureData();
    
    console.log('✅ leisure 模块已加载');
})();
