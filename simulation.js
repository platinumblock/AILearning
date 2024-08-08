var theMap=[
    ["X"," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," "," "],
    [" "," "," "," "," "," "," ","E"],
];
var startingPosition;
var moveOdds=[];
var totalCounter=0;
var yShift=(750-theMap.length*70)/2;
var xShift=(1450-theMap[0].length*70)/2;
var perfectSteps;
var maxSteps;
var nIterations=2000;
var maxFactor=1.5;
var anim=true;

function setupPreMap(){
    var old=document.getElementsByClassName("bx");
    var l=old.length;
    for(var i=0;i<l;i++){
        old[0].remove();
    }
    var old2=document.getElementsByClassName("box");
    var l2=old2.length;
    for(var i=0;i<l2;i++){
        old2[0].remove();
    }
    for(var i=0;i<theMap.length;i++){
        for(var k=0;k<theMap[i].length;k++){
            var box=document.createElement("button");
            box.classList.add("box");
            if(theMap[i][k]=="B") box.classList.add("blockedboxbutton");
            else if(theMap[i][k]=="E") box.classList.add("finishboxbutton");
            else box.classList.add("emptyboxbutton");
            box.setAttribute("onclick", "change("+i+","+k+")");
            box.style.left=(xShift+80*k)+"px";
            box.style.top=(yShift+80*i)+"px";
            document.body.appendChild(box);
        }
    }
    
    var ai=document.getElementById("ai");
    ai.style.left=(xShift+20)+"px";
    ai.style.top=(yShift+20)+"px";
}

function updateGrid(){
    var width=parseInt(document.getElementById("gridWidth").value);
    var height=parseInt(document.getElementById("gridHeight").value);
    theMap=[];
    for(var i=0;i<height;i++){
        var row=[];
        for(var k=0;k<width;k++){
            if(i==0 && k==0) row.push("X");
            else if(i==height-1 && k==width-1) row.push("E");
            else row.push(" ");
        }
        theMap.push(row);
    }
    yShift=(750-theMap.length*70)/2;
    xShift=(1450-theMap[0].length*70)/2;
    setupPreMap();
}

async function change(i, k){
    if(window.event.ctrlKey){
        for(var a=0;a<theMap.length;a++){
            for(var b=0;b<theMap[i].length;b++){
                if(theMap[a][b]=="X"){
                    theMap[a][b]=" ";
                    break;
                }
            }
        }
        theMap[i][k]="X";
        await updateAI([k,i]);
    }
    else if(window.event.altKey){
        var docIndex=k+i*theMap[0].length;
        var boxes=document.getElementsByClassName("box");
        boxes[docIndex].classList.remove("blockedboxbutton");
        boxes[docIndex].classList.add("finishboxbutton");
        for(var a=0;a<theMap.length;a++){
            for(var b=0;b<theMap[i].length;b++){
                if(theMap[a][b]=="E"){
                    theMap[a][b]=" ";
                    boxes[b+a*theMap[0].length].classList.remove("finishboxbutton");
                    boxes[b+a*theMap[0].length].classList.add("emptyboxbutton");
                    break;
                }
            }
        }
        theMap[i][k]="E";
    }
    else{
        var docIndex=k+i*theMap[0].length;
        var boxes=document.getElementsByClassName("box");
        var classes=boxes[docIndex].classList;
        if(classes[1]=="emptyboxbutton"){
            boxes[docIndex].classList.remove("emptyboxbutton");
            boxes[docIndex].classList.add("blockedboxbutton");
            theMap[i][k]="B";
        }
        else if(classes[1]=="blockedboxbutton"){
            boxes[docIndex].classList.remove("blockedboxbutton");
            boxes[docIndex].classList.add("emptyboxbutton");
            theMap[i][k]=" ";
        }
    }
   
}

function setupStartPosition(){
    for(var i=0;i<theMap.length;i++){
        for(var k=0;k<theMap[i].length;k++){
            if(theMap[i][k]=="X"){
                startingPosition=[k,i];
                break;
            }
        }
    }
}

function setSize(size){
    nIterations=size;
    if(size==500){
        document.getElementsByClassName("set")[0].style.backgroundColor="rgb(33, 109, 201)";
        document.getElementsByClassName("set")[1].style.backgroundColor="rgb(220,220,220)";
        document.getElementsByClassName("set")[2].style.backgroundColor="rgb(220,220,220)";
    }
    if(size==2000){
        document.getElementsByClassName("set")[1].style.backgroundColor="rgb(33, 109, 201)";
        document.getElementsByClassName("set")[0].style.backgroundColor="rgb(220,220,220)";
        document.getElementsByClassName("set")[2].style.backgroundColor="rgb(220,220,220)";
    }
    if(size==12000){
        document.getElementsByClassName("set")[2].style.backgroundColor="rgb(33, 109, 201)";
        document.getElementsByClassName("set")[1].style.backgroundColor="rgb(220,220,220)";
        document.getElementsByClassName("set")[0].style.backgroundColor="rgb(220,220,220)";
    }
}

function setupMoveOdds(){
    moveOdds=[];
    for(var i=0;i<100;i++){
        moveOdds.push([1,1,1,1]);
    }
}

function setupMap(){
    var old=document.getElementsByClassName("box");
    var l=old.length;
    for(var i=0;i<l;i++){
        old[0].remove();
    }
    
    for(var i=0;i<theMap.length;i++){
        for(var k=0;k<theMap[i].length;k++){
            var box=document.createElement("div");
            box.classList.add("bx");
            if(theMap[i][k]=="B") box.classList.add("blockedbox");
            else if(theMap[i][k]=="E") box.classList.add("finishbox");
            else box.classList.add("emptybox");
            box.style.left=(xShift+80*k)+"px";
            box.style.top=(yShift+80*i)+"px";
            document.body.appendChild(box);
        }
    }
    var ai=document.getElementById("ai");
    ai.style.left=(xShift+20+startingPosition[0]*80)+"px";
    ai.style.top=(yShift+20+startingPosition[1]*80)+"px";
    totalCounter=0;
}

function setupPerfectSteps(){
    for(var i=0;i<theMap.length;i++){
        for(var k=0;k<theMap[i].length;k++){
            if(theMap[i][k]=='E'){
                perfectSteps=Math.abs(startingPosition[0]-i)+Math.abs(startingPosition[1]-k)
            }
        }
    }
    maxSteps=parseInt(perfectSteps*maxFactor);
}

async function updateAI(position){
    var ai=document.getElementById("ai");
    ai.style.left=(xShift+20+position[0]*80)+"px";
    ai.style.top=(yShift+20+position[1]*80)+"px";
    await sleepNow(300);
}

async function run(first,last){
    var position=copy(startingPosition);
    var map=copy(theMap);
    var steps=0;
    var reachedEnd=false;
    var record=[];
    var previous="R";
    if(first){
        document.getElementById("attempt").innerHTML="Attempt 1";
        document.getElementById("attempt").style.display="flex";
        document.getElementById("start").innerHTML="Running";
        document.getElementById("start").style.opacity="0.4";
    }
    else if(last){
        document.getElementById("attempt").innerHTML="Attempt "+totalCounter;
        document.getElementById("attempt").style.display="flex";
    }else{
        document.getElementById("attempt").style.display="none";
    }
    while(steps<maxSteps){
        if(first || last){
            await updateAI(position);
        }
        map[position[1]][position[0]]=" ";

        var odds=copy(moveOdds[steps]);
        if(((previous=="L" || position[0]==map[0].length-1 || map[position[1]][position[0]+1]=="B"))){
            odds[0]=0;
        }
        if(((previous=="R" || position[0]==0 || map[position[1]][position[0]-1]=="B"))){
            odds[1]=0;
        }
        if(((previous=="D" || position[1]==0 || map[position[1]-1][position[0]]=="B"))){
            odds[2]=0;
        }
        if(((previous=="U" || position[1]==map.length-1 || map[position[1]+1][position[0]]=="B"))){
            odds[3]=0;
        }
        var choice=getRandom(0,odds[0]+odds[1]+odds[2]+odds[3]);
        if(choice<odds[0]){ //RIGHT
            position[0]++;
            record.push(0);
            previous="R";
        }else if(choice>=odds[0] && choice<odds[0]+odds[1]){ //LEFT
            position[0]--;
            record.push(1);
            previous="L";
        }else if(choice>=odds[0]+odds[1] && choice<odds[0]+odds[1]+odds[2]){ //UP
            position[1]--;
            record.push(2);
            previous="U";
        }else if(choice>=odds[0]+odds[1]+odds[2] && choice<odds[0]+odds[1]+odds[2]+odds[3]){ //DOWN
            position[1]++;
            record.push(3);
            previous="D";
        }else{
            if(previous=="R"){
                position[0]--;
                record.push(1);
                previous="L";
            }
            else if(previous=="L"){
                position[0]++;
                record.push(0);
                previous="R";
            }
            else if(previous=="U"){
                position[1]++;
                record.push(3);
                previous="D";
            }
            else if(previous=="D"){
                position[1]--;
                record.push(2);
                previous="U";
            }
        }
        steps++;
        if(map[position[1]][position[0]]=="E"){
            reachedEnd=true;
            if(first || last){
                await updateAI(position);
            }
            break;
        }else{
            map[position[1]][position[0]]="X";
        }
    }

    if(reachedEnd){
        for(var i=0;i<record.length;i++){
            moveOdds[i][record[i]]+=(perfectSteps/steps)*2;
        }
    }
    totalCounter++;
    if(totalCounter%(nIterations/100)==0){
        document.getElementById("loadingPercentage").innerHTML=parseInt(totalCounter/(nIterations/100))+"%";
        document.getElementById("loadingBar").style.width=((parseInt(totalCounter/(nIterations/100)))*0.5+0.2)+"%";
    }
    if(first){
        var panel=document.getElementById("panel");
        panel.style.display="block";
        setTimeout(() => {
            panel.style.opacity="1";
            var ai=document.getElementById("ai");
            ai.style.left=(xShift+20+startingPosition[0]*80)+"px";
            ai.style.top=(yShift+20+startingPosition[1]*80)+"px";
        }, 100);
    }
    if(totalCounter==nIterations){
        setTimeout(() => {
            var panel=document.getElementById("panel");
            panel.style.opacity="0";
            setTimeout(() => {
                panel.style.display="none";
                document.getElementById("loadingPercentage").innerHTML="0%";
                document.getElementById("loadingBar").style.width="0%";
            }, 500);
        }, 500);
        await sleepNow(1000);
        await run(false,true);
    }
    if(last){
        
        anim=true;
        Draw();
        setTimeout(() => {
            anim=false;
        },2000);
        setTimeout(() => {
            document.getElementById("attempt").style.display="none";
            document.getElementById("start").innerHTML="Start";
            document.getElementById("start").style.opacity="1";
            setupPreMap();
        },2000);
    }
    setTimeout(() => {
        if(totalCounter<nIterations){
            run(false,false);
        }
    }, 10);
    
}




function copy(array){
    return JSON.parse(JSON.stringify(array));
}

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function start(){
    setupStartPosition();
    setupMoveOdds();
    setupMap();
    setupPerfectSteps();
    run(true,false);
}

setupPreMap();











let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const maxConfettis = 150;
const particles = [];

const possibleColors = [
  "DodgerBlue",
  "OliveDrab",
  "Gold",
  "Pink",
  "SlateBlue",
  "LightBlue",
  "Gold",
  "Violet",
  "PaleGreen",
  "SteelBlue",
  "SandyBrown",
  "Chocolate",
  "Crimson"
];

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
  this.x = Math.random() * W; // x
  this.y = Math.random() * H - H; // y
  this.r = randomFromTo(11, 33); // radius
  this.d = Math.random() * maxConfettis + 11;
  this.color =
    possibleColors[Math.floor(Math.random() * possibleColors.length)];
  this.tilt = Math.floor(Math.random() * 33) - 11;
  this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
  this.tiltAngle = 0;

  this.draw = function() {
    context.beginPath();
    context.lineWidth = this.r / 2;
    context.strokeStyle = this.color;
    context.moveTo(this.x + this.tilt + this.r / 3, this.y);
    context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
    return context.stroke();
  };
}

function Draw() {
  const results = [];

  // Magical recursive functional love
  requestAnimationFrame(Draw);

  context.clearRect(0, 0, W, window.innerHeight);
    
  for (var i = 0; i < maxConfettis; i++) {
    if(anim){
        results.push(particles[i].draw());
    }
  }

  let particle = {};
  let remainingFlakes = 0;
  for (var i = 0; i < maxConfettis; i++) {
    particle = particles[i];

    particle.tiltAngle += particle.tiltAngleIncremental;
    particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 1;
    particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

    if (particle.y <= H) remainingFlakes++;

    // If a confetti has fluttered out of view,
    // bring it back to above the viewport and let if re-fall.
    if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
      particle.x = Math.random() * W;
      particle.y = -30;
      particle.tilt = Math.floor(Math.random() * 10) - 20;
    }
  }
  return results;
}

window.addEventListener(
  "resize",
  function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  },
  false
);

// Push new confetti objects to `particles[]`
for (var i = 0; i < maxConfettis; i++) {
  particles.push(new confettiParticle());
}

// Initialize
canvas.width = W;
canvas.height = H;