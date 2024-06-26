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
//if(parser.pathname == "/app/"){
    if(parser.pathname == "/" || parser.pathname == "/index.html"){
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
}else if(parser.pathname == "/friends.html"){
    document.getElementById("loading").style.display = "flex";
fetch(root+"/friends",{
    method:"GET",
    headers:{
        'Content-Type':'application/json',
        'Trust-Id':localStorage.getItem("trust-id")
    }
   }).then(r=>r.json()).then(r=>{
document.getElementById("ref-url").value = "https://trust-coin.github.io/app?ref="+r.id
document.getElementById("loading").style.display = "none";
});
}else if(parser.pathname == "/signup.html"){
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
}else if(parser.pathname == "/chat.html"){
    document.getElementById("loading").style.display = "flex";
fetch(root+"/support",{
    method:"GET",
    headers:{
        'Content-Type':'application/json',
        'Trust-Id':localStorage.getItem("trust-id")
    }
   }).then(r=>r.json()).then(r=>{
    console.log(r);
document.getElementById("loading").style.display = "none";
});
}


if(document.getElementById("login-form")){
   
    document.getElementById("login-form").onsubmit = function(e){
e.preventDefault();
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
    console.log(b.data.session)
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
   
    document.getElementById("signup-form").onsubmit = function(e){
        
e.preventDefault();
var data = new FormData(this);
formData = Object.fromEntries(data.entries());
const option = {
method:"POST",
headers:{
    'Content-Type':'application/json'
},
body:JSON.stringify(formData)
}

fetch(root+"/signup",option).then(r=>r.json()).then(r=>{
if(r.status){
    localStorage.setItem("trust-id",r['data']['trust-id']);
    window.location.href = "./";
}else{
    document.getElementById("form-error").innerHTML = '<div class="error">'+r.error[0]+'</div>';
}

});






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
       
