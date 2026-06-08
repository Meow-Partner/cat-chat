// ========== modules/profile.js · 2026-06-08 16:50:00 ==========
(function() {
    if (window.CatChat && window.CatChat.profile) {
        console.log('profile 模块已加载，跳过');
        return;
    }
    
    window.CatChat = window.CatChat || {};
    
    // 个人设置数据
    let myNickname = '我';
    let myAvatar = '🐱';
    let partnerNickname = '沈星回';
    let partnerAvatar = '⭐';
    let myBirthday = '';
    let anniversary = '';
    let myCity = '';
    
    // 加载个人设置
    function loadProfile() {
        const stored = localStorage.getItem('profile_settings');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                myNickname = data.myNickname || '我';
                myAvatar = data.myAvatar || '🐱';
                partnerNickname = data.partnerNickname || '沈星回';
                partnerAvatar = data.partnerAvatar || '⭐';
                myBirthday = data.myBirthday || '';
                anniversary = data.anniversary || '';
                myCity = data.myCity || '';
            } catch(e) {}
        }
        updateProfileUI();
    }
    
    // 保存个人设置
    function saveProfile() {
        const data = {
            myNickname: myNickname,
            myAvatar: myAvatar,
            partnerNickname: partnerNickname,
            partnerAvatar: partnerAvatar,
            myBirthday: myBirthday,
            anniversary: anniversary,
            myCity: myCity
        };
        localStorage.setItem('profile_settings', JSON.stringify(data));
        updateProfileUI();
    }
    
    // 更新界面显示
    function updateProfileUI() {
        const myNameSpan = document.getElementById('myNickname');
        const partnerNameSpan = document.getElementById('partnerName');
        const myAvatarDiv = document.getElementById('myAvatar');
        const partnerAvatarDiv = document.getElementById('partnerAvatar');
        
        if (myNameSpan) myNameSpan.innerText = myNickname;
        if (partnerNameSpan) partnerNameSpan.innerText = partnerNickname;
        if (myAvatarDiv) myAvatarDiv.innerText = myAvatar;
        if (partnerAvatarDiv) partnerAvatarDiv.innerText = partnerAvatar;
    }
    
    // 修改昵称
    function setMyNickname(name) {
        myNickname = name;
        saveProfile();
    }
    
    function setPartnerNickname(name) {
        partnerNickname = name;
        saveProfile();
    }
    
    // 导出到命名空间
    window.CatChat.profile = {
        myNickname: myNickname,
        myAvatar: myAvatar,
        partnerNickname: partnerNickname,
        partnerAvatar: partnerAvatar,
        loadProfile: loadProfile,
        saveProfile: saveProfile,
        setMyNickname: setMyNickname,
        setPartnerNickname: setPartnerNickname,
        updateProfileUI: updateProfileUI
    };
    
    // 兼容旧全局调用
    window.myNickname = myNickname;
    window.myAvatar = myAvatar;
    window.partnerNickname = partnerNickname;
    window.partnerAvatar = partnerAvatar;
    window.loadProfile = loadProfile;
    window.saveProfile = saveProfile;
    window.updateProfileUI = updateProfileUI;
    
    // 自动加载
    loadProfile();
    
    console.log('✅ profile 模块已加载');
})();
