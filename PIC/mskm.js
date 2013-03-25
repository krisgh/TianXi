(function(winnav){
this.openmaskmenu=function(container){
	var mb=createNewMaskBg();
	var mn=createNewMenu();
	var pare=document.createElement("div");
	pare.id="maskmenu";
	container.appendChild(pare);

	var closeBtnId="moveout";
	var closeBtn=document.createElement("a");
	closeBtn.id=closeBtnId;
	closeBtn.innerHTML="走你";
	closeBtn.href="javascript:void(0)";
	closeBtn.onclick=function(){
		container.removeChild(pare);
	}

	pare.appendChild(closeBtn);
	pare.appendChild(mb);
	pare.appendChild(mn);
	downMenu(mn);
};

function createNewMaskBg(){
	var newMaskId="mskbg";
	var newMask=document.createElement("div");
	newMask.id=newMaskId;
	return newMask;
}

function createNewMenu(){
	var newMenuId="mskmu";
	var newMenu=document.createElement("div");
	newMenu.id=newMenuId;
	return newMenu;
}

function downMenu(menu){
	var top=menu.offsetTop;
	var speed=parseInt((0-top)/10);
	var interval=20;
	function downAction(){
		var top=menu.offsetTop;
		if(top<0){
			top=top+speed;
			menu.style.top=top;
			setTimeout(function(){ return downAction();},interval);
		}
		else{
			menu.style.top=0;
		}
	}
	downAction();
}
})(this)
