chrome.runtime.onMessage.addListener((request, sender, SendResponse) => {

    function OpenMoodle(){
        chrome.tabs.create({ url: 'https://www.moodlerje.com.br/' })
    }

    //make a request
    const httpGet = (url, method, body, thenData, thenText, catchError) => {
        fetch(url, {
            method: method,
            credentials: 'include',
            headers: {
                'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        })
        .then(data => {
            thenData(data)
            return data.text();
        })
        .then(Htmltext => {
            thenText(Htmltext)
        })
        .catch(error => {
            catchError(error);
        })
    }

    function InMainWindow(htmlText){
        console.clear();
        var doc = new DOMParser().parseFromString(htmlText, "text/xml");

        ElementListCourse = doc.querySelector('.courses');

        console.clear()
        console.log(htmlText);
        console.log(ElementListCourse);
        console.log(doc);
    }

    function GetMainWindow(){
        console.clear();
        console.warn('GetMainWindow');
        httpGet(url = "https://www.moodlerje.com.br/", 
            method = 'GET', 
            body = null,
            thenData = function(data){
                console.log(data);
            },
            thenText = function(Htmltext){
                console.log(Htmltext);
                InMainWindow(Htmltext);
            },
            catchError = function(error){
                console.error(error);
            }
        )
    }

    httpGet(url = "https://www.moodlerje.com.br/login/index.php", 
        method = 'POST', 
        body = `username_temp=${request.username}&username=${"etesr" + request.username}&password=${request.password}`,
        thenData = function(data){
            console.log(data);
        },
        thenText = function(Htmltext){
            console.log(Htmltext);
            GetMainWindow();
        },
        catchError = function(error){
            console.error(error);
        }
    );

});

    // const httpGet = (url, successFn, errorFn) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('POST', url, true);
    //     //xhr.setRequestHeader('username_temp', 'gabriel.morais');
    //     //xhr.setRequestHeader('password', '06062005');
    //     //xhr.setRequestHeader('username', 'etesrgabriel.morais');
    //     xhr.withCredentials = true;
    //     xhr.setDisableHeaderCheck = true;
    //     xhr.setRequestHeader('Cookie', 'MoodleSession=ect5bql020cissnnb8399oj4h1');
    //     xhr.onload = () => {
    //         const status = xhr.status;
    //         if (status === 200) {
    //             successFn(xhr.responseText);
    //         } else {
    //             errorFn(status);
    //         }
    //     };
    //     xhr.onerror = () => {
    //         errorFn(xhr.error);
    //     };
    //     xhr.send();
    // };

    // httpGet(
    //     'https://www.moodlerje.com.br/',
    //     (res) => console.log('success:', res),
    //     (status) => console.log("status:", status)
    // );