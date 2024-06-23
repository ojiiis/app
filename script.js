var tapAni = false;
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
        document.getElementById("energy").innerText = new Intl.NumberFormat().format(energy);
       var body = new FormData();
       body.append("data",`${balance},${energy}`);
        fetch("https://doksocial.co/coin/tapped",{
            method:"POST",
            body:body
        }).then(r=>r.text()).then(r=>console.log(r));
    } 
    }
    
    content.style.width = `${moved}px`;
    content.style.height = `${moved}px`;
},20);
 
});
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

alert(parser.pathname);
if(parser.pathname == "/"){
   fetch("https://doksocial.co/coin/app").then(r=>r.json()).then(r=>{
    if(r.status){
        
        balance = r.result.balance;
        energy = r.result.energy;
        perClick = r.result.per_click;
     document.getElementById("bal").innerText = new Intl.NumberFormat().format(balance);
     document.getElementById("energy").innerText = new Intl.NumberFormat().format(energy);
     document.getElementById("energy-used").innerText = new Intl.NumberFormat().format(r.result.energy_used);
     document.getElementById("rph").innerText = new Intl.NumberFormat().format(r.result.rph);
     document.getElementById("user-level").innerText = r.result.level;
     document.getElementById("username").innerText = r.result.username;
     
    }else{
        location = "signin.html";
    }
   });
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
       
