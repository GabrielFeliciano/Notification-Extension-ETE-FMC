function ValidateCookie(username, password){
    console.log(`username_temp=${username}&username=${"etesr" + username}&password=${password}`);

    fetch("https://www.moodlerje.com.br/login/index.php", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'MoodleSession=takhbf1popvnvn0kn0hf2uv6d4'
        },
        body: `username_temp=${username}&username=${"etesr" + username}&password=${password}`
    })
    .then(data => {
        console.warn(data.headers)
        console.log(data);
        return data.text();
    })
    .then(text => {
        console.warn("Here:");
        console.log(text);
    })
    .catch(error => console.error(error));
}