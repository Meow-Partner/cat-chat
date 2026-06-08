// ========== modules/sync.js · 2026-06-08 16:40:00 ==========
(function() {
    if (window.CatChat && window.CatChat.sync) {
        console.log('sync 模块已加载，跳过');
        return;
    }
    
    window.CatChat = window.CatChat || {};
    
    // Supabase 配置（如果需要联网同步，否则可以不配置）
    const SUPABASE_URL = '';
    const SUPABASE_KEY = '';
    
    let supabaseClient = null;
    
    // 初始化 Supabase（可选，不强制）
    function initSync() {
        console.log('同步模块已初始化（当前为离线模式）');
        // 如果没有配置，就不实际连接
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.log('未配置 Supabase，使用本地存储模式');
            return;
        }
        // 如果有配置，可以在这里初始化 supabase 客户端
    }
    
    // 同步数据（占位）
    function syncData() {
        console.log('同步数据（本地模式，无实际同步）');
        // 这里可以触发本地数据备份或恢复
    }
    
    // 导出到命名空间
    window.CatChat.sync = {
        initSync: initSync,
        syncData: syncData,
        getSupabaseUrl: function() { return SUPABASE_URL; }
    };
    
    // 兼容旧全局调用
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_KEY = SUPABASE_KEY;
    window.initSync = initSync;
    window.syncData = syncData;
    
    // 自动初始化
    initSync();
    
    console.log('✅ sync 模块已加载');
})();
