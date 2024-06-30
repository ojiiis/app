var tapAni = false;
const root = "https://doksocial.co/coin";
//const root = "http://localhost/coin";
if(document.getElementById("tap-box")){
document.getElementById("tap-box").addEventListener("click",function(){
if(tapAni)
return;
tapAni = true, tap = this;
var content = document.getElementById("tap-box-content"),dir = "up",moved = 270;
var aniTap = setInterval(function(){
    if(dir == "up")  {
    moved += 5;
    if(moved > 290){
        dir = "down";
        moved = 290;
    } 
    }else{
     moved -= 5;   
     if(moved < 270){
        clearInterval(aniTap);
        if(energy){
            var aA = document.createElement("div");
            aA.classList.add("add-coin");
            aA.innerText = `+${perClick}`;
            tap.appendChild(aA);
            animateAdd(aA);
            balance += perClick;
            document.getElementById("bal").innerText = new Intl.NumberFormat().format(balance);
            tapAni = false;
            moved = 270;
            energy -= 5;
            document.getElementById("energy-used").innerText = new Intl.NumberFormat().format(energy);
           //run adding balance logic//
            addAction();
        }
     
    } 
    }
    
    content.style.width = `${moved}px`;
    content.style.height = `${moved}px`;
},20);
 
});
}

var tapped = 0, lastTap;
function addAction(){
    tapped += 1;
    lastTap = new Date().getTime();
    setTimeout(function(){
        sendAction();
    },500);
}
var runAction;
function sendAction(){
    runAction = setInterval(function(){
        now = new Date().getTime();
    if((now - 1000 * 2) > lastTap && tapped > 0){
        tap = tapped;
        tapped = 0; 
        lastTap = new Date().getTime();
        fetch(root+"/tapped",{
        method:"POST",
        headers:{
            'Content-Type':'application/json',
            'Trust-Id':localStorage.getItem("trust-id")
        },
        body:JSON.stringify({
           "tap":tap
        })
    }).then(r=>r.json()).then(r=>{
        console.log(r)
    });
}
},500)
}
function animateAdd(x){
   var limit = Math.floor((Math.random() * 150) + 40), s = 0;
  var aA =  setInterval(function(){
        s += 2;
        if(s > limit){
        x.remove();
        clearInterval(aA);
        }
        x.style.top = `${-1*s}px`;
    },20);
}
 
var balance = 0;
var energy = 0;
var perClick = 0;
var parser = document.createElement("a"); 
parser.href = window.location.href;
//alert(parser.pathname);
//if(parser.pathname == "/app/" || parser.pathname == "/app/index.html"){
    if(parser.pathname == "/app/" || parser.pathname == "/app/index.html" || parser.pathname == "/" || parser.pathname == "/index.html"){
        document.getElementById("loading").style.display = "flex";
   fetch(root+"/app",{
    method:"GET",
    headers:{
        'Content-Type':'application/json',
        'Trust-Id':localStorage.getItem("trust-id")
    }
   }).then(r=>r.json()).then(r=>{
    console.log(r);
    if(r.status){
        
        balance = r.result.balance;
        energy = r.result.energy_used;
        perClick = r.result.per_click;
     document.getElementById("bal").innerText = new Intl.NumberFormat().format(balance);
     document.getElementById("energy").innerText = new Intl.NumberFormat().format(r.result.energy);
     document.getElementById("energy-used").innerText = new Intl.NumberFormat().format(r.result.energy_used);
     document.getElementById("rph").innerText = new Intl.NumberFormat().format(r.result.rph);
     document.getElementById("user-level").innerText = r.result.level;
     document.getElementById("username").innerText = r.result.username[0].toUpperCase()+r.result.username.slice(1);
     document.getElementById("loading").style.display = "none";
    }else{
        location = "signin.html";
    }
   });
}else if(parser.pathname == "/friends.html" || parser.pathname == "/app/friends.html"){
    document.getElementById("loading").style.display = "flex";
fetch(root+"/friends",{
    method:"GET",
    headers:{
        'Content-Type':'application/json',
        'Trust-Id':localStorage.getItem("trust-id")
    }
   }).then(r=>r.json()).then(r=>{
document.getElementById("totalFriends").innerText = r.total_friend;
document.getElementById("ref-url").value = "https://trust-coin.github.io/app/signup.html?ref="+r.id
document.getElementById("loading").style.display = "none";
});
}else if(parser.pathname == "/signup.html" || parser.pathname == "/app/signup.html"){
    query = {};

    if(parser.href.toString().split("?").length == 2){
        var queries = parser.href.toString().split("?")[1];
        var allQ  = queries.split("&");
        for(i = 0; i < allQ.length; i++){
            let entry = allQ[i].split("=");
           
            if(entry.length > 1){
           query[entry[0]] = entry[1]
           }
        }
    }
   if(query.ref){
    document.getElementById("ref").value =query.ref;
   }
}else if(parser.pathname == "/chat.html" || parser.pathname == "/app/chat.html"){
    document.getElementById("loading").style.display = "flex";
fetch(root+"/support",{
    method:"GET",
    headers:{
        'Content-Type':'application/json',
        'Trust-Id':localStorage.getItem("trust-id")
    }
   }).then(r=>r.json()).then(r=>{
    var messageList = "";
    for(let i = 0; i < r.length; i++){

        switch(r[i].user_id){
            case "trust-coin":
                messageList += `<div class="msg-holder">
 <div class="msg">${r[i].message}</div>
 <small class="time">${Date(r[i].date * 1000).toString().split("GMT")[0]}</small>
 </div> `;
            break;
            default:
  messageList += ` <div class="msg-holder user">
 <div class="msg">${r[i].message}</div>
 <div class="cf"></div>
 <small class="time">${Date(r[i].date * 1000).toString().split("GMT")[0]} . sent</small>
 
 </div> 
<div class="cf"></div> `;
        }
    }
    document.getElementById("app-body").innerHTML = messageList;
document.getElementById("loading").style.display = "none";
var mm = document.getElementsByClassName("msg-holder")[document.getElementsByClassName("msg-holder").length - 1];
mm.scrollIntoView();
});
}


if(document.getElementById("login-form")){
   
    document.getElementById("login-form").onsubmit = function(e){
e.preventDefault();
document.getElementById("loading").style.display = "flex";
var data = new FormData(this);
formData = Object.fromEntries(data.entries());
const option = {
method:"POST",
headers:{
    'Content-Type':'application/json'
},
body:JSON.stringify(formData)
}



fetch(root+"/login",option).then(r=>{
    return r.json();
}).then((b)=>{
    document.getElementById("loading").style.display = "none";

    if(b.status == 1){
       localStorage.setItem("trust-id",b.data.session);
       window.location.href = "./";
    }else{
      document.getElementById("form-error").innerHTML = '<div class="error">Invalid details</div>';
    }
})
    }
}


if(document.getElementById("signup-form")){
    document.getElementById("signup-form").addEventListener("submit",function(e){
e.preventDefault();
document.getElementById("form-error").innerHTML = "";
document.getElementById("loading").style.display = "flex";
var data = new FormData(this);
formData = Object.fromEntries(data.entries());
fetch(root+"/signup",{
       method:"POST",
       body:JSON.stringify(formData)
}).then(r=>r.json()).then((r)=>{
           if(r.status){
                localStorage.setItem("trust-id",r['data']['trust-id']);
                window.location.href = "./";
            }else{
                
                for(let i = 0; i < r.error.length; i++){
                    document.getElementById("form-error").innerHTML = document.getElementById("form-error").innerHTML + '<div class="error">'+r.error[i]+'</div>';
                }
                document.getElementById("loading").style.display = "none";
                
            }
    
})

    });
   
}
//document.getElementsByTagName("body")[0].scrollTo(0,"953px")
//console.log(document.getElementsByTagName("body")[0].scrollHeight);
//console.log(document.getElementById("app-body").scrollHeight);
if(document.getElementById("send-msg")){
    document.getElementById("send-msg").onclick = function(){
        var text = document.getElementById("message").value;
        document.getElementById("message").value = "";
        if(text){
       var  messageList = `<div class="msg-holder user">
        <div class="msg">${text}</div>
        <div class="cf"></div>
        <small class="time">${new Date().toString().split("GMT")[0]} . sent</small>
        
        </div> 
       <div class="cf"></div> `;
       document.getElementById("app-body").innerHTML =  document.getElementById("app-body").innerHTML + messageList;
       document.getElementById("message").disabled = true;
       var mm = document.getElementsByClassName("msg-holder")[document.getElementsByClassName("msg-holder").length - 1];
       mm.scrollIntoView();
       fetch(root+"/contact-support",{
            method:"POST",
            headers:{
           'Trust-Id':localStorage.getItem("trust-id")
            },
            body:JSON.stringify({
                text
            })
        })
        .then(r=>r.json())
        .then(r=>{
            setTimeout(function(){
                
                var messageListNw = `<div class="msg-holder">
                <div class="msg">Your messaged has been accepted and sent to our support team. you will get a response from use as soon as possible and if you need further help kindly respond with a message.</div>
                <small class="time">${new Date().toString().split("GMT")[0]}</small>
                </div> `;
                document.getElementById("app-body").innerHTML =  document.getElementById("app-body").innerHTML + messageListNw;
                document.getElementById("message").disabled = false;
                var mm = document.getElementsByClassName("msg-holder")[document.getElementsByClassName("msg-holder").length - 1];
                 mm.scrollIntoView();
            },2000)
        });
    }
    }
}

var h = false;
 if(h){
    var scroll = document.getElementsByTagName("body")[0];
     var msgs = document.getElementsByClassName("msg-holder");
     
     var inp = document.getElementById("app-footer");
     
     
     scroll.onscroll = function(){
     
     //msgs[3].getBoundingClientRect().top 
     for(let i = 0; i < msgs.length ; i++){
     var below = inp.getBoundingClientRect().bottom - msgs[i].clientHeight;
     
     var above = inp.getBoundingClientRect().bottom - (msgs[i].clientHeight *2);
    // console.log(msgs[i].offsetTop)
     if(below > msgs[i].getBoundingClientRect().top && above < msgs[i].getBoundingClientRect().top){
     msgs[i].style.color ="green";
     } 
     }
     
     }
 }
       
