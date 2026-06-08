// ========== modules/utils.js · 2026-06-08 16:00:00 ==========
(function() {
    if (window.CatChat && window.CatChat.utils) {
        console.log('utils 模块已加载，跳过');
        return;
    }
    
    // 确保命名空间存在
    window.CatChat = window.CatChat || {};
    
    // 通用工具函数
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    function showToast(msg, duration) {
        duration = duration || 2000;
        var toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:white;padding:8px 16px;border-radius:20px;z-index:10000;font-size:14px;';
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.remove();
        }, duration);
    }
    
    // 全局模态框管理
    let currentModal = null;
    
    function closeModal() {
        if (currentModal) {
            currentModal.remove();
            currentModal = null;
        }
    }
    
    function setCurrentModal(modal) {
        closeModal();
        currentModal = modal;
    }
    
    // 暴露到命名空间
    window.CatChat.utils = {
        escapeHtml: escapeHtml,
        showToast: showToast,
        closeModal: closeModal,
        setCurrentModal: setCurrentModal,
        getCurrentModal: function() { return currentModal; }
    };
    
    // 同时保留全局函数（兼容旧代码）
    window.escapeHtml = escapeHtml;
    window.showToast = showToast;
    window.closeModal = closeModal;
    window.setCurrentModal = setCurrentModal;
    
    console.log('✅ utils 模块已加载');
})();
