import "./index.css" 

const baseurl = 'api/v2' //'20.2.129.187:8080'

function ajaxGet(url) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET',baseurl + url, false)
    xhr.setRequestHeader('If-Modified-Since','0');
    xhr.send(null)
    return  xhr.responseText
}
function fetchData(url) {
    return fetch(baseurl + url,{
        method: 'get',
        cache: "no-store"
    }).then(res=>{
       if(url.includes('/personal/get-user-id?number=')) {
         return res.text()
       }
       return res.json()
    })
}

async function getUserList(number) {
    const res = await fetchData("/personal/get-user-id?number=" + number)
    const userList = res.match(/\[(.*?)\]/)[1].split(',').map((item, index)=>{
        return `
        <li class="userid_item">
            <span class="userid_item__id">${item}</span>
            <span class="userid_item__btn" userId=${item}>detail</span>
        </li>
        `
    })
    return userList
}

getUserList(-1).then((userList)=>{
    document.getElementById('user_id_list_ul').innerHTML = userList.join('')
})


document.getElementById("user_id_list_ul").addEventListener("click", function(event) {
    if(event.target.className === "userid_item__btn")
    // 判断点击的元素是否为li元素
    showResult(event.target.getAttribute('userId')).then((userResult)=>{
        document.getElementById('user_result_list_ul').innerHTML = userResult.join('')
    })
});

async function showResult(userId) {
    const res = await fetchData("/personal?userId="+userId)
    const userResult = res.data.map((item, index)=>{
        return `
        <li class="userresult_item">
            <span class="userresult_item__rank">${index+1}</span>
            <span class="userresult_item__id">${item.name} ( ${item.steamAppid} )</span>
            <img class="userresult_item__img" src=${item.headerImage}/>
        </li>
        `
    })
    return userResult
}
//"/popular-games/page?limit="
async function getTopGames() {
    const res = await fetchData("/popular-games/page?limit=10&offset=0")
    const userResult = res.data.records.map((item,index)=>{
        return `
        <li class="userresult_item">
            <span class="userresult_item__rank">${index+1}</span>
            <span class="userresult_item__id">${item.name} ( ${item.steamAppid} )</span>
            <img class="userresult_item__img" src=${item.headerImage}/>
        </li>
        `
    })
    return userResult
}
document.getElementById('top_btn').addEventListener('click', function(event) {
    getTopGames().then(userResult=>{
        document.getElementById('user_result_list_ul').innerHTML = userResult.join('')
    })
})