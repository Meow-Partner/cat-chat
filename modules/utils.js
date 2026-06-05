// ========== 公共工具函数 ==========

// 转义HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// 关闭所有弹窗
let currentModal = null;
function closeModal() {
    if (currentModal) {
        currentModal.remove();
        currentModal = null;
    }
}

// 显示表情包弹窗
function showStickerModal(stickers, title, isEmoji) {
    closeModal();
    var modal = document.createElement('div');
    modal.className = 'sticker-modal';
    modal.innerHTML = '<div class="modal-header"><h4>' + (isEmoji ? '😊' : '🐱') + ' ' + title + '</h4><button class="modal-close">✕</button></div><div class="modal-content" id="modalContent"></div>';
    document.body.appendChild(modal);
    currentModal = modal;
    
    var contentDiv = modal.querySelector('#modalContent');
    for (var i = 0; i < stickers.length; i++) {
        var sticker = stickers[i];
        var item = document.createElement('div');
        item.className = 'sticker-item';
        item.innerText = sticker;
        item.onclick = (function(s) { 
            return function() { 
                if (typeof addMessage === 'function') addMessage(s, true); 
                closeModal(); 
            }; 
        })(sticker);
        contentDiv.appendChild(item);
    }
    
    modal.querySelector('.modal-close').onclick = function() { closeModal(); };
    modal.onclick = function(e) { if (e.target === modal) closeModal(); };
}