// ========== 个人设置模块 ==========

let myNickname = "user";
let myAvatar = "user";
let partnerNickname = "沈星回";
let partnerAvatar = "Star";

function loadProfile() {
    var stored = localStorage.getItem('profile_settings');
    if (stored) {
        try {
            var p = JSON.parse(stored);
            myNickname = p.myNickname || "user";
            myAvatar = p.myAvatar || "user";
            partnerNickname = p.partnerNickname || "沈星回";
            partnerAvatar = p.partnerAvatar || "Star";
        } catch(e) {}
    }
    var myNickInput = document.getElementById('myNickname');
    var myAvatarInput = document.getElementById('myAvatarText');
    var partnerNickInput = document.getElementById('partnerNickname');
    var partnerAvatarInput = document.getElementById('partnerAvatarText');
    if (myNickInput) myNickInput.value = myNickname;
    if (myAvatarInput) myAvatarInput.value = myAvatar;
    if (partnerNickInput) partnerNickInput.value = partnerNickname;
    if (partnerAvatarInput) partnerAvatarInput.value = partnerAvatar;
    document.getElementById('partnerName').innerText = partnerNickname;
    updateChatAvatars();
}

function saveProfile() {
    myNickname = document.getElementById('myNickname').value.trim() || "user";
    myAvatar = document.getElementById('myAvatarText').value.trim() || "user";
    partnerNickname = document.getElementById('partnerNickname').value.trim() || "沈星回";
    partnerAvatar = document.getElementById('partnerAvatarText').value.trim() || "Star";
    localStorage.setItem('profile_settings', JSON.stringify({
        myNickname: myNickname, myAvatar: myAvatar,
        partnerNickname: partnerNickname, partnerAvatar: partnerAvatar
    }));
    document.getElementById('partnerName').innerText = partnerNickname;
    updateChatAvatars();
    if (typeof renderChat === 'function') renderChat();
    alert('设置已保存');
}

function updateChatAvatars() {
    document.querySelectorAll('.msg-avatar').forEach(function(avatar) {
        var row = avatar.closest('.message-row');
        if (row) avatar.innerText = row.classList.contains('me') ? myAvatar : partnerAvatar;
    });
}

document.getElementById('saveProfileBtn').onclick = saveProfile;