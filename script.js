window.onload = function(){
var tapAni = false;
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
        aA.innerText = "+23";
        tap.appendChild(aA);
        animateAdd(aA);
        balance += 23;
        document.getElementById("bal").innerText = new Intl.NumberFormat().format(balance);
        tapAni = false;
        moved = 270;
    } 
    }
    
    content.style.width = `${moved}px`;
    content.style.height = `${moved}px`;
},20);
 
});
  

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
 

var balance = 56100
 
 document.getElementById("bal").innerText = new Intl.NumberFormat().format(balance);
    
