// ========== Supabase 同步模块 ==========

initSync();

// ========== 主脚本入口 ==========

// 页面切换
const sideTabs = document.querySelectorAll('.side-tab');

// 你的 Supabase 配置（已填入）
const SUPABASE_URL = 'https://syskcocdlzaanehdpafo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5c2tjb2NkbHphYW5laGRwYWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjQwMjMsImV4cCI6MjA5NjI0MDAyM30.itR2CBcDrFHr61oridrmBJlzY2vRd2QouzFkOn3Nhh4';

let supabaseClient = null;
let currentDeviceId = null;

// 初始化 Supabase 客户端
async function initSupabase() {
    if (supabaseClient) return supabaseClient;
    
    // 动态加载 Supabase JS 库
    if (typeof createClient === 'undefined') {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
}

// 获取或生成本地设备ID
function getDeviceId() {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('device_id', deviceId);
    }
    currentDeviceId = deviceId;
    return deviceId;
}

// ========== 同步函数 ==========

// 同步用户配置
async function syncUserConfig() {
    const supabase = await initSupabase();
    const deviceId = getDeviceId();
    
    const { data: remote, error } = await supabase
        .from('user_configs')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle();
    
    if (error) {
        console.error('获取用户配置失败:', error);
        return;
    }
    
    if (remote) {
        window.myNickname = remote.my_nickname;
        window.myAvatar = remote.my_avatar;
        window.partnerNickname = remote.partner_nickname;
        window.partnerAvatar = remote.partner_avatar;
        localStorage.setItem('profile_settings', JSON.stringify({
            myNickname: window.myNickname,
            myAvatar: window.myAvatar,
            partnerNickname: window.partnerNickname,
            partnerAvatar: window.partnerAvatar
        }));
        if (typeof updateChatAvatars === 'function') updateChatAvatars();
        if (typeof renderChat === 'function') renderChat();
    } else {
        const localProfile = localStorage.getItem('profile_settings');
        let profile = { my_nickname: 'user', my_avatar: 'user', partner_nickname: '沈星回', partner_avatar: 'Star' };
        if (localProfile) {
            try {
                const p = JSON.parse(localProfile);
                profile = {
                    my_nickname: p.myNickname || 'user',
                    my_avatar: p.myAvatar || 'user',
                    partner_nickname: p.partnerNickname || '沈星回',
                    partner_avatar: p.partnerAvatar || 'Star'
                };
            } catch(e) {}
        }
        await supabase.from('user_configs').insert({
            device_id: deviceId,
            my_nickname: profile.my_nickname,
            my_avatar: profile.my_avatar,
            partner_nickname: profile.partner_nickname,
            partner_avatar: profile.partner_avatar
        });
    }
}

// 同步字卡
async function syncCardGroups() {
    const supabase = await initSupabase();
    const deviceId = getDeviceId();
    
    const { data: remoteGroups, error } = await supabase
        .from('card_groups')
        .select('*')
        .eq('device_id', deviceId);
    
    if (error) {
        console.error('获取字卡分组失败:', error);
        return;
    }
    
    if (remoteGroups && remoteGroups.length > 0) {
        window.userGroups = {};
        window.groupLocks = {};
        window.groupDedup = {};
        for (const g of remoteGroups) {
            window.userGroups[g.group_name] = [];
            window.groupLocks[g.group_name] = g.is_locked;
            window.groupDedup[g.group_name] = g.is_dedup;
        }
        
        const { data: remoteCards, error: cardsError } = await supabase
            .from('cards')
            .select('*')
            .eq('device_id', deviceId)
            .order('sort_order', { ascending: true });
        
        if (!cardsError && remoteCards) {
            for (const card of remoteCards) {
                if (window.userGroups[card.group_name]) {
                    window.userGroups[card.group_name].push(card.content);
                }
            }
        }
        if (typeof renderGroups === 'function') renderGroups();
        if (typeof updateReplyCountDisplay === 'function') updateReplyCountDisplay();
    } else {
        for (const groupName in window.userGroups) {
            await supabase.from('card_groups').insert({
                device_id: deviceId,
                group_name: groupName,
                is_locked: window.groupLocks[groupName] || false,
                is_dedup: window.groupDedup[groupName] || false
            });
            for (let i = 0; i < window.userGroups[groupName].length; i++) {
                await supabase.from('cards').insert({
                    device_id: deviceId,
                    group_name: groupName,
                    content: window.userGroups[groupName][i],
                    sort_order: i
                });
            }
        }
    }
}

// 同步聊天记录
async function syncChatMessages() {
    const supabase = await initSupabase();
    const deviceId = getDeviceId();
    
    let lastTimestamp = 0;
    if (window.chatMessages && window.chatMessages.length > 0) {
        lastTimestamp = Math.max(...window.chatMessages.map(m => m.timestamp || 0));
    }
    
    const { data: remoteMessages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('device_id', deviceId)
        .gt('timestamp', lastTimestamp)
        .order('timestamp', { ascending: true });
    
    if (error) {
        console.error('同步聊天记录失败:', error);
        return;
    }
    
    if (remoteMessages && remoteMessages.length > 0) {
        for (const msg of remoteMessages) {
            if (!window.chatMessages.some(m => m.timestamp === msg.timestamp)) {
                window.chatMessages.push({
                    text: msg.text,
                    time: msg.time_str,
                    timestamp: msg.timestamp,
                    isMe: msg.is_me,
                    imgSrc: msg.img_src,
                    isRecalled: msg.is_recalled
                });
            }
        }
        window.chatMessages.sort((a, b) => a.timestamp - b.timestamp);
        if (typeof renderChat === 'function') renderChat();
        if (typeof updateLastChatTime === 'function') updateLastChatTime();
    }
}

// 同步休闲数据
async function syncLeisureData() {
    const supabase = await initSupabase();
    const deviceId = getDeviceId();
    
    const { data: remote, error } = await supabase
        .from('leisure_data')
        .select('data')
        .eq('device_id', deviceId)
        .maybeSingle();
    
    if (error) {
        console.error('获取休闲数据失败:', error);
        return;
    }
    
    if (remote && remote.data) {
        // 云端有数据，加载到本地
        try {
            for (const type in window.leisureData) {
                if (remote.data[type]) {
                    window.leisureData[type].myItems = remote.data[type].myItems || [];
                    window.leisureData[type].hisItems = remote.data[type].hisItems || [];
                }
            }
            if (typeof renderLeisurePage === 'function') renderLeisurePage();
            if (typeof setRandomLeisure === 'function') setRandomLeisure();
        } catch(e) {
            console.error('解析休闲数据失败:', e);
        }
    } else {
        // 本地有数据，上传到云端
        const dataToUpload = {};
        for (const type in window.leisureData) {
            dataToUpload[type] = {
                myItems: window.leisureData[type].myItems || [],
                hisItems: window.leisureData[type].hisItems || []
            };
        }
        const { error: insertError } = await supabase
            .from('leisure_data')
            .insert({
                device_id: deviceId,
                data: dataToUpload
            });
        if (insertError) {
            console.error('上传休闲数据失败:', insertError);
        }
    }
}

// 同步贴纸
async function syncStickers() {
    const supabase = await initSupabase();
    const deviceId = getDeviceId();
    
    const { data: remote, error } = await supabase
        .from('stickers')
        .select('type, value')
        .eq('device_id', deviceId);
    
    if (error) {
        console.error('同步贴纸失败:', error);
        return;
    }
    
    if (remote && remote.length > 0) {
        window.stickers = remote.map(s => ({ type: s.type, value: s.value }));
        if (typeof renderEmojiStickers === 'function') renderEmojiStickers();
    } else if (window.stickers && window.stickers.length > 0) {
        for (const sticker of window.stickers) {
            await supabase.from('stickers').insert({
                device_id: deviceId,
                type: sticker.type,
                value: sticker.value
            });
        }
    }
}

// 同步拍一拍文案
async function syncPatMessage() {
    const supabase = await initSupabase();
    const deviceId = getDeviceId();
    
    const { data: remote, error } = await supabase
        .from('pat_messages')
        .select('message')
        .eq('device_id', deviceId)
        .maybeSingle();
    
    if (error) {
        console.error('同步拍一拍文案失败:', error);
        return;
    }
    
    if (remote && remote.message) {
        window.patMessage = remote.message;
        localStorage.setItem('pat_message', window.patMessage);
    } else if (window.patMessage) {
        await supabase.from('pat_messages').insert({
            device_id: deviceId,
            message: window.patMessage
        });
    }
}

// 上传消息
async function uploadMessage(msg) {
    const supabase = await initSupabase();
    const deviceId = getDeviceId();
    
    await supabase.from('chat_messages').insert({
        device_id: deviceId,
        text: msg.text,
        is_me: msg.isMe,
        img_src: msg.imgSrc || null,
        is_recalled: msg.isRecalled || false,
        timestamp: msg.timestamp,
        time_str: msg.time
    });
}

// 全局同步
async function syncAllData() {
    console.log('开始同步数据...');
    await syncUserConfig();
    await syncCardGroups();
    await syncChatMessages();
    await syncLeisureData();
    await syncStickers();
    await syncPatMessage();
    console.log('同步完成');
}

// 自动同步定时器
let syncInterval = null;
function startAutoSync() {
    if (syncInterval) clearInterval(syncInterval);
    syncInterval = setInterval(() => {
        syncAllData();
    }, 30000);
}

// 拦截消息添加
function setupAutoUpload() {
    const originalAddMessage = window.addMessage;
    if (originalAddMessage) {
        window.addMessage = function(text, isMe, imgSrc, isSystem) {
            originalAddMessage(text, isMe, imgSrc, isSystem);
            if (!isSystem && window.chatMessages && window.chatMessages.length > 0) {
                const lastMsg = window.chatMessages[window.chatMessages.length - 1];
                if (lastMsg && lastMsg.isMe === isMe) {
                    setTimeout(() => uploadMessage(lastMsg), 100);
                }
            }
        };
    }
}

// 初始化
async function initSync() {
    await initSupabase();
    await syncAllData();
    startAutoSync();
    setupAutoUpload();
}