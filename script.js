// ========== script.js · 超干净测试版（无任何依赖）==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('脚本已加载，开始绑定按钮...');
    
    // 获取所有需要绑定的按钮
    const starBtn = document.getElementById('starMenuBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const leisureBtn = document.getElementById('leisureBubbleBtn');
    const backBtn = document.getElementById('backToChatBtn');
    const diceBtn = document.getElementById('diceBtn');
    const emojiBtn = document.getElementById('openEmojiBtn');
    const actionBtn = document.getElementById('actionBtn');
    const msgInput = document.getElementById('msgInput');
    
    // 页面元素
    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const managePage = document.getElementById('manage-page');
    
    // 页面切换函数
    function showChat() {
        if (chatPage) chatPage.classList.add('active');
        if (leisurePage) leisurePage.classList.remove('active');
        if (managePage) managePage.classList.remove('active');
        console.log('切换到聊天页');
    }
    
    function showLeisure() {
        if (chatPage) chatPage.classList.remove('active');
        if (leisurePage) leisurePage.classList.add('active');
        if (managePage) managePage.classList.remove('active');
        console.log('切换到休闲页');
    }
    
    function showManage() {
        if (chatPage) chatPage.classList.remove('active');
        if (leisurePage) leisurePage.classList.remove('active');
        if (managePage) managePage.classList.add('active');
        console.log('切换到设置页');
    }
    
    // 绑定顶部栏按钮
    if (starBtn) { starBtn.onclick = () => showManage(); console.log('字卡按钮已绑定'); }
    if (settingsBtn) { settingsBtn.onclick = () => showManage(); console.log('设置按钮已绑定'); }
    if (leisureBtn) { leisureBtn.onclick = () => showLeisure(); console.log('泡泡按钮已绑定'); }
    if (backBtn) { backBtn.onclick = () => showChat(); console.log('星星按钮已绑定'); }
    
    // 绑定底部按钮（暂时只弹 alert）
    if (diceBtn) { diceBtn.onclick = () => alert('骰子被点击'); console.log('骰子按钮已绑定'); }
    if (emojiBtn) { emojiBtn.onclick = () => alert('表情被点击'); console.log('表情按钮已绑定'); }
    if (actionBtn) { 
        actionBtn.onclick = () => {
            if (msgInput && msgInput.value.trim()) {
                alert('发送: ' + msgInput.value.trim());
                msgInput.value = '';
            } else {
                alert('加号被点击');
            }
        };
        console.log('加号/发送按钮已绑定');
    }
    
    // 确保聊天页默认显示
    showChat();
    
    console.log('✅ 所有按钮绑定完成，请测试');
});
