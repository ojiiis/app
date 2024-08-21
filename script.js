var tapAni = false;
const root = "http://localhost:8080";
//const root = "http://localhost/coin";
function k(n){
    if(n > 1000){
        var t = n/1000;
        var t = (t % 1 === 0)?t:t.toString().split(".")[0]+"."+t.toString().split(".")[1][0]
        return t+"k";
    }else if(n > 1000000){
        return n.toString()[0]+"m";
    }
}
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
    console.log(b)
    document.getElementById("loading").style.display = "none";

    if(b.status == 1){
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
       
