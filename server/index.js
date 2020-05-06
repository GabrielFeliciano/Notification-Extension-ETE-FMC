const puppeteer = require('puppeteer')

async function getMooldeLinks(browser){
    //const browser = await puppeteer.launch({headless: true})

    const page = await browser.newPage()

    //get to login moodle
    await page.goto(
        "https://www.moodlerje.com.br/bdp/colegios/login.php?var1=etesr",
        { waitUntil: "networkidle0" }
        // <-- Make sure the whole page is completely loaded
    )

    await page.waitForSelector("#id_username_temp")
    await page.waitForSelector("body > center > div > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > input[type=password]:nth-child(1)")
    
    inputUsername = await page.focus("#id_username_temp") 
    await page.keyboard.type("gabriel.morais")

    inputPasswd = await page.focus("body > center > div > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > input[type=password]:nth-child(1)")
    await page.keyboard.type("06062005")

    // take screenshot
    // console.log(await page.content())
    // await page.screenshot({path: 'example.png'})
  
    buttonSend = "body > center > div > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > input[type=button]:nth-child(2)"

    await page.click(buttonSend, {button: "left"})
        .catch(err => console.error(err))

    await page.waitForSelector("#frontpage-course-list > div")
    const links = await page.$$eval("h3.coursename", (modules) => {
        let links = {}
        for (module of modules){
            moduleLink = module.children[0].href
            moduleName = module.children[0].textContent
            // console.log("name:", moduleName)
            links[moduleName] = moduleLink
        }
        return links
    })

    // let moodleCookie
    // cookies = await page.cookies('https://www.moodlerje.com.br')
    // for (const cookie of cookies){
    //     if (cookie.name == "MoodleSession"){
    //         moodleCookie = cookie
    //         break
    //     }
    // }

    //console.log(listOfModules)
    // moodleInfo = {
    //     // cookie: moodleCookie,
    //     links: links,
    //     browser: browser
    // }

    // console.log(moodleInfo['browser'])
    // console.log(moodleInfo['links'])

    console.log(links)
    return links
}

//main program
async function Main(){
    const browser = await puppeteer.launch({headless: false})

    links = await getMooldeLinks(browser)
    // const links = moodleInfo.links
    // const browser = moodleInfo.browser

    const getHtmlFromLink = async(link) => {
        const page = await browser.newPage()
        await page.goto(
            link,
            { waitUntil: "networkidle0" }
            // <-- Make sure the whole page is completely loaded
        )

        await page.accessibility.snapshot({interestingOnly: false})

        //get the console
        //page.on("console", msg => console.log("PAGE LOG:", msg))

        await page.waitForSelector(".topics")
        //await page.screenshot({path: 'example.png'})
        
        const response = await page.$eval(".topics", async topics => {
            const sections = Array.from(topics
                .children
            )
 
            console.log(sections)
            console.log(sections[0])

            const sectionsContent = await Promise.all(
                sections.map((val, index) => {
                    console.log(val.querySelector('.content').innerHTML)
                    return val.querySelector('.content').innerHTML
                    //acessing the content of div
                })
            )

            console.log(sectionsContent)
            return sectionsContent
        })

        data = {
            elements: response,
            url: link,
            id: parseInt(link.match(/(?<=https:\/\/www\.moodlerje\.com\.br\/course\/view\.php\?id=)\d{4}/gm)[0])
        }

        // console.log('printing data');
        // console.log(data)
        // console.log(data.elements[0])
        return data
    }

    const htmlPagesToRequest = []
    for (const link of Object.values(links)){
        htmlPage = getHtmlFromLink(link)
        htmlPagesToRequest.push(htmlPage)
    }
    Promise.all(htmlPagesToRequest)
        .then(data => {
            console.log(data)
            const fs = require('fs')
            fs.writeFile(
                'data.json', 
                JSON.stringify(data, null, 2), 
                (err) => {
                    console.error(err)
                }
            )
            return data
        })
}

Main()


//test
async function test(){
    const browser = await puppeteer.launch({headless: false})

    const page = await browser.newPage()

    page.on('dialog', async dialog => {
        console.log(dialog.message())
        await dialog.dismiss()
    })

    await page.goto('https://teams.microsoft.com/dl/launcher/launcher.html?url=%2f_%23%2fl%2fmeetup-join%2f19%3ameeting_OThhMWQ5OTgtYjRmYi00OGYyLWFmYjctNjliMDE1ZGE2MTZk%40thread.v2%2f0%3fcontext%3d%257B%2522Tid%2522%253A%252201a86072-9369-423d-a1c9-a156076ed33a%2522%252C%2522Oid%2522%253A%2522b74e994e-e47a-4227-9e02-3223e38dfb54%2522%257D%26anon%3dtrue&type=meetup-join&deeplinkId=d44eacfc-8684-4fde-85fd-4906f58cee6e&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true', { waitUntil: "networkidle0" })
    // 1
    
    await page.waitForNavigation("load")
    await page.waitForSelector("#openTeamsClientInBrowser")
    await page.click("#openTeamsClientInBrowser", {button: 'left'})

    await page.waitForNavigation({ waitUntil: "networkidle0" })
        .then(async () => {
            await page.evaluate(() => console.log(":D"))
        })

    // await page.focus("#i0116")
    // await page.keyboard.type("gfp001@outlook.com")
    // await page.click("#idSIButton9", {button: "left"})
    //     .then(() => page.waitForNavigation({ waitUntil: "networkidle2" })) 
    
    // //2
    //  await page.waitForSelector('#i0118')
    // await page.focus("#i0118")
    // await page.keyboard.type("google00")
    // await page.click("#idSIButton9", {button: "left"})
    // await page.waitForNavigation({ waitUntil: "networkidle2" })
    
    // //console.log(await page.content());
    // await page.screenshot({path: 'screenshot.png'})
    
    // await browser.close()
}
//test()