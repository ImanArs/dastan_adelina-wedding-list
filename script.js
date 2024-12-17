function showLoginScreen() {
    fetch('https://isset.online/betting/xbet/login.php')
        .then(response => response.text())
        .then(result => {
            //console.log(result);
            document.getElementById('content').innerHTML = result;
            document.getElementById('error-msg').style.display = 'none';
            document.getElementById('login-btn').addEventListener('click', () => {
                let secret = document.getElementById('secret').value;
                login(secret);
            });
        });
}

async function login(secret) {
    let response = await fetch('https://isset.online/betting/xbet/secret.php?p=' + secret);
    if (response.status === 200) {
        response.text().then(result => {
            document.getElementById('content').innerHTML = result;
            document.getElementById('logout-btn').addEventListener('click', () => {
                logout(secret);
            });
            chrome.storage.local.set({ secret: secret });
        });
    } else {
        try {
        
	 response.text().then(result => {
	    const error_msg = document.getElementById('error-msg');
 	    chrome.storage.local.set({ secret: null });

	    if (error_msg) {

	      error_msg.innerHTML = result;
              error_msg.style.display = 'block';
              setTimeout(() => {
                 error_msg.style.display = 'none';
              }, 4000);
	    } else {
	     location.reload();
	   }
        });
        
        } catch (error) {
            logout(secret);
        }
    }
}

function logout(s) {
    fetch('https://isset.online/betting/xbet/cl.php?s=' + s);
    chrome.storage.local.set({ secret: null });
    showLoginScreen();
}

chrome.storage.local.get(['secret'], function (result) {
    if (result.secret) {
        login(result.secret);
    } else {
        logout();
    }
});
