// ========== 字卡模块 ==========

let userGroups = {};
let groupLocks = {};
let groupDedup = {};

function saveGroups() {
    localStorage.setItem('user_groups', JSON.stringify(userGroups));
    localStorage.setItem('group_locks', JSON.stringify(groupLocks));
    localStorage.setItem('group_dedup', JSON.stringify(groupDedup));
    if (typeof updateReplyCountDisplay === 'function') updateReplyCountDisplay();
}

function loadGroups() {
    var stored = localStorage.getItem('user_groups');
    if (stored && stored !== '{}' && stored !== 'null') {
        try { userGroups = JSON.parse(stored); } catch(e) { userGroups = {}; }
    }
    var storedLocks = localStorage.getItem('group_locks');
    if (storedLocks && storedLocks !== '{}' && storedLocks !== 'null') {
        try { groupLocks = JSON.parse(storedLocks); } catch(e) { groupLocks = {}; }
    }
    var storedDedup = localStorage.getItem('group_dedup');
    if (storedDedup && storedDedup !== '{}' && storedDedup !== 'null') {
        try { groupDedup = JSON.parse(storedDedup); } catch(e) { groupDedup = {}; }
    }
    renderGroups();
}

function toggleLock(groupName) {
    groupLocks[groupName] = !groupLocks[groupName];
    saveGroups();
    renderGroups();
}

function toggleDedup(groupName) {
    groupDedup[groupName] = !groupDedup[groupName];
    saveGroups();
    renderGroups();
}

function deduplicateGroup(groupName) {
    if (!userGroups[groupName]) return;
    var seen = {};
    var uniqueList = [];
    for (var i = 0; i < userGroups[groupName].length; i++) {
        var text = userGroups[groupName][i];
        if (!seen[text]) {
            seen[text] = true;
            uniqueList.push(text);
        }
    }
    var removedCount = userGroups[groupName].length - uniqueList.length;
    if (removedCount > 0) {
        userGroups[groupName] = uniqueList;
        saveGroups();
        renderGroups();
        alert('已清理 ' + removedCount + ' 条重复内容，当前分组共 ' + uniqueList.length + ' 条');
    } else {
        alert('没有发现重复内容');
    }
}

function isDuplicateInGroup(groupName, text) {
    if (!userGroups[groupName]) return false;
    for (var i = 0; i < userGroups[groupName].length; i++) {
        if (userGroups[groupName][i] === text) return true;
    }
    return false;
}

function renderGroups() {
    var container = document.getElementById('groupsContainer');
    if (!container) return;
    container.innerHTML = '';
    for (var groupName in userGroups) {
        var isLocked = groupLocks[groupName] === true;
        var isDedup = groupDedup[groupName] === true;
        var lockIcon = isLocked ? '🔒' : '🔓';
        var dedupChecked = isDedup ? 'checked' : '';
        var groupDiv = document.createElement('div');
        groupDiv.className = 'card-group';
        groupDiv.innerHTML = '<div class="group-header" onclick="toggleGroup(this, \'' + escapeHtml(groupName) + '\')">' +
            '<div class="group-title"><span class="arrow">▶</span><span>📁 ' + escapeHtml(groupName) + ' (' + userGroups[groupName].length + '条)</span></div>' +
            '<div class="group-actions">' +
            '<label class="dedup-checkbox" onclick="event.stopPropagation()"><input type="checkbox" ' + dedupChecked + ' onchange="toggleDedup(\'' + escapeHtml(groupName) + '\')"> 🔄自动去重</label>' +
            '<button onclick="event.stopPropagation(); deduplicateGroup(\'' + escapeHtml(groupName) + '\')">🧹立即去重</button>' +
            '<button class="lock-btn" onclick="event.stopPropagation(); toggleLock(\'' + escapeHtml(groupName) + '\')">' + lockIcon + '</button>' +
            '<button onclick="event.stopPropagation(); addToGroup(\'' + escapeHtml(groupName) + '\')">➕添加</button>' +
            (isLocked ? '<button disabled style="opacity:0.5;">🗑️删除分组</button>' : '<button onclick="event.stopPropagation(); deleteGroup(\'' + escapeHtml(groupName) + '\')">🗑️删除分组</button>') +
            '</div></div>' +
            '<div class="group-content" id="groupContent_' + groupName.replace(/\s/g,'_') + '"></div>';
        container.appendChild(groupDiv);
        var contentDiv = document.getElementById('groupContent_' + groupName.replace(/\s/g,'_'));
        for (var idx = 0; idx < userGroups[groupName].length; idx++) {
            var replyContent = userGroups[groupName][idx];
            var cardDiv = document.createElement('div');
            cardDiv.className = 'word-card';
            cardDiv.innerHTML = '<div>💬 ' + escapeHtml(replyContent) + '</div>' +
                '<div class="flex-between">' +
                '<button onclick="editCard(\'' + escapeHtml(groupName) + '\', ' + idx + ')">编辑</button>' +
                '<button onclick="deleteCard(\'' + escapeHtml(groupName) + '\', ' + idx + ')">删除</button>' +
                '</div>';
            contentDiv.appendChild(cardDiv);
        }
    }
}

function toggleGroup(header, groupName) {
    var content = document.getElementById('groupContent_' + groupName.replace(/\s/g,'_'));
    var arrow = header.querySelector('.arrow');
    if (content) {
        content.classList.toggle('expanded');
        arrow.classList.toggle('expanded');
    }
}

function addToGroup(groupName) {
    var newText = prompt("请输入新回复内容");
    if (newText && newText.trim()) {
        if (!userGroups[groupName]) userGroups[groupName] = [];
        if (groupDedup[groupName] === true && isDuplicateInGroup(groupName, newText.trim())) {
            alert('该内容已存在，已跳过（自动去重已开启）');
            return;
        }
        userGroups[groupName].push(newText.trim());
        renderGroups();
        saveGroups();
    }
}

function deleteGroup(groupName) {
    if (groupLocks[groupName] === true) {
        alert('该分组已锁定，无法删除。请先解锁。');
        return;
    }
    if (confirm('确定删除分组「' + groupName + '」吗？')) {
        delete userGroups[groupName];
        delete groupLocks[groupName];
        delete groupDedup[groupName];
        renderGroups();
        saveGroups();
    }
}

function editCard(groupName, idx) {
    var old = userGroups[groupName][idx];
    var newText = prompt("编辑回复内容", old);
    if (newText && newText.trim()) {
        if (groupDedup[groupName] === true) {
            for (var i = 0; i < userGroups[groupName].length; i++) {
                if (i !== idx && userGroups[groupName][i] === newText.trim()) {
                    alert('该内容已在分组中存在，编辑被阻止（自动去重已开启）');
                    return;
                }
            }
        }
        userGroups[groupName][idx] = newText.trim();
        renderGroups();
        saveGroups();
    }
}

function deleteCard(groupName, idx) {
    if (confirm('确定删除这条回复吗？')) {
        userGroups[groupName].splice(idx, 1);
        if (userGroups[groupName].length === 0) delete userGroups[groupName];
        renderGroups();
        saveGroups();
    }
}

function showDedupModal(newLines, targetGroup) {
    var existingSet = new Set();
    for (var i = 0; i < userGroups[targetGroup].length; i++) existingSet.add(userGroups[targetGroup][i]);
    var duplicates = [], uniqueLines = [];
    for (var j = 0; j < newLines.length; j++) {
        var line = newLines[j].trim();
        if (!line) continue;
        if (existingSet.has(line)) duplicates.push(line);
        else uniqueLines.push(line);
    }
    if (duplicates.length === 0) {
        for (var k = 0; k < uniqueLines.length; k++) userGroups[targetGroup].push(uniqueLines[k]);
        renderGroups(); saveGroups();
        alert('成功添加 ' + uniqueLines.length + ' 条回复到「' + targetGroup + '」');
        return;
    }
    var modal = document.createElement('div');
    modal.className = 'dedup-modal';
    modal.innerHTML = '<div class="dedup-header">⚠️ 发现 ' + duplicates.length + ' 条重复内容</div>' +
        '<div class="dedup-content" id="dedupContent"></div>' +
        '<div class="dedup-footer">' +
        '<button id="dedupKeepAllBtn">✅ 全部保留</button>' +
        '<button id="dedupDiscardAllBtn" class="danger-btn">🗑️ 全部舍弃</button>' +
        '<button id="dedupCancelBtn">✕ 取消</button>' +
        '</div>';
    document.body.appendChild(modal);
    currentModal = modal;
    var contentDiv = modal.querySelector('#dedupContent');
    for (var d = 0; d < duplicates.length; d++) {
        var itemDiv = document.createElement('div');
        itemDiv.className = 'dedup-item';
        itemDiv.innerHTML = '<div class="dedup-text">💬 ' + escapeHtml(duplicates[d]) + '</div>' +
            '<div class="dedup-actions">' +
            '<button class="keep-one" data-text="' + escapeHtml(duplicates[d]) + '">保留</button>' +
            '<button class="discard-one" data-text="' + escapeHtml(duplicates[d]) + '">舍弃</button>' +
            '</div>';
        contentDiv.appendChild(itemDiv);
    }
    contentDiv.querySelectorAll('.keep-one').forEach(function(btn) {
        btn.onclick = function() {
            var text = this.getAttribute('data-text');
            var idx = duplicates.indexOf(text);
            if (idx !== -1) duplicates.splice(idx, 1);
            uniqueLines.push(text);
            this.parentElement.parentElement.remove();
            if (contentDiv.children.length === 0) finishAdd();
        };
    });
    contentDiv.querySelectorAll('.discard-one').forEach(function(btn) {
        btn.onclick = function() {
            var text = this.getAttribute('data-text');
            var idx = duplicates.indexOf(text);
            if (idx !== -1) duplicates.splice(idx, 1);
            this.parentElement.parentElement.remove();
            if (contentDiv.children.length === 0) finishAdd();
        };
    });
    function finishAdd() {
        for (var u = 0; u < uniqueLines.length; u++) userGroups[targetGroup].push(uniqueLines[u]);
        renderGroups(); saveGroups();
        alert('成功添加 ' + uniqueLines.length + ' 条回复到「' + targetGroup + '」（舍弃了 ' + duplicates.length + ' 条重复）');
        modal.remove(); currentModal = null;
    }
    document.getElementById('dedupKeepAllBtn').onclick = function() {
        for (var u = 0; u < uniqueLines.length; u++) userGroups[targetGroup].push(uniqueLines[u]);
        for (var d2 = 0; d2 < duplicates.length; d2++) userGroups[targetGroup].push(duplicates[d2]);
        renderGroups(); saveGroups();
        alert('成功添加 ' + (uniqueLines.length + duplicates.length) + ' 条回复到「' + targetGroup + '」');
        modal.remove(); currentModal = null;
    };
    document.getElementById('dedupDiscardAllBtn').onclick = function() {
        for (var u = 0; u < uniqueLines.length; u++) userGroups[targetGroup].push(uniqueLines[u]);
        renderGroups(); saveGroups();
        alert('成功添加 ' + uniqueLines.length + ' 条回复到「' + targetGroup + '」（舍弃了 ' + duplicates.length + ' 条重复）');
        modal.remove(); currentModal = null;
    };
    document.getElementById('dedupCancelBtn').onclick = function() { modal.remove(); currentModal = null; };
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
}

function showGroupSelectModal(textLines) {
    closeModal();
    var groups = [];
    for (var g in userGroups) groups.push(g);
    var modal = document.createElement('div');
    modal.className = 'group-select-modal';
    modal.innerHTML = '<div class="group-select-header">📁 选择添加到哪个分组</div>' +
        '<div class="group-select-list" id="groupSelectList"></div>';
    document.body.appendChild(modal);
    currentModal = modal;
    var listDiv = modal.querySelector('#groupSelectList');
    var newGroupItem = document.createElement('div');
    newGroupItem.className = 'group-select-item';
    newGroupItem.innerHTML = '➕ 新建分组';
    newGroupItem.style.background = '#f0d5e5';
    newGroupItem.style.fontWeight = 'bold';
    newGroupItem.onclick = function() {
        var newGroupName = prompt("请输入新分组名称");
        if (newGroupName && newGroupName.trim()) {
            if (!userGroups[newGroupName.trim()]) userGroups[newGroupName.trim()] = [];
            for (var i = 0; i < textLines.length; i++) {
                if (textLines[i].trim()) userGroups[newGroupName.trim()].push(textLines[i].trim());
            }
            renderGroups(); saveGroups();
            alert('成功添加 ' + textLines.length + ' 条回复到「' + newGroupName.trim() + '」');
        }
        modal.remove(); currentModal = null;
    };
    listDiv.appendChild(newGroupItem);
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var isDedup = groupDedup[group] === true;
        var item = document.createElement('div');
        item.className = 'group-select-item';
        item.innerHTML = '📁 ' + escapeHtml(group) + (isDedup ? ' 🔄自动去重' : '');
        item.onclick = (function(g, isDedup) {
            return function() {
                if (isDedup) showDedupModal(textLines, g);
                else {
                    if (!userGroups[g]) userGroups[g] = [];
                    for (var j = 0; j < textLines.length; j++) {
                        if (textLines[j].trim()) userGroups[g].push(textLines[j].trim());
                    }
                    renderGroups(); saveGroups();
                    alert('成功添加 ' + textLines.length + ' 条回复到「' + g + '」');
                }
                modal.remove(); currentModal = null;
            };
        })(group, isDedup);
        listDiv.appendChild(item);
    }
    if (groups.length === 0) {
        var emptyTip = document.createElement('div');
        emptyTip.className = 'group-select-item';
        emptyTip.innerHTML = '暂无分组，请先新建分组';
        emptyTip.style.color = '#999';
        listDiv.appendChild(emptyTip);
    }
    modal.onclick = function(e) { if (e.target === modal) { modal.remove(); currentModal = null; } };
}

// 添加字卡处理（供菜单调用）
function addToCardHandler(text) {
    var groupName = "我的字卡";
    if (!userGroups[groupName]) userGroups[groupName] = [];
    if (userGroups[groupName].some(c => c.replys && c.replys[0] === text)) {
        alert("已在字卡库中");
        return;
    }
    userGroups[groupName].push({ word: 'r_' + Date.now(), replys: [text] });
    renderGroups();
    saveGroups();
    alert('已添加「' + text + '」到字卡库');
}