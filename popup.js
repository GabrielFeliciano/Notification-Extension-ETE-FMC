document.addEventListener('DOMContentLoaded', function(){

    //inputs 
    inputUsername = document.querySelector(`#username`)
    inputPassword = document.querySelector(`#passwd`)

    //get password and username from local storage
    function getStorage(){
        chrome.storage.sync.get(
            ['username', 'password'], 
            function(value) {
                console.log('got result: ' + value)
                inputUsername.value = value && value.username || ""
                inputPassword.value = value && value.password || ""
            }
        )


    }
    getStorage()

    //Buttons

    const buttonRequest = document.querySelector("button#requestMoodle")

    buttonRequest.onclick = function(){
        const infoUser = {
            username: inputUsername.value,
            password: inputPassword.value
        };

        // ValidateCookie(
        //     username = infoUser.username, 
        //     password = infoUser.password
        // );
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                infoUser, 
            );
        });
    };

    const buttonOpenMoodle = document.querySelector("button#openMoodle")

    buttonOpenMoodle.onclick = function(){
        chrome.tabs.create({ url: 'https://www.moodlerje.com.br/' })
    }

    const buttonSaveCredentials = document.querySelector("button#saveCredentials")

    buttonSaveCredentials.onclick = function(){
        username = document.querySelector(`#username`).value
        password = document.querySelector(`#passwd`).value
        console.log({
            password: inputPassword.value,
            username: inputUsername.value
        })
        chrome.storage.sync.set(
            {
                username: inputUsername.value
            }, 
            function(result) {
                console.log('Storaged: ')
                console.log(result)
            }
        )
        chrome.storage.sync.set(
            {
                password: inputPassword.value
            }, 
            function(result) {
                console.log('Storaged: ')
                console.log(result)
            }
        )
    }

}, false)