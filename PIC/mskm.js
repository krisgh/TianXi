(function(winnav){
this.openmaskmenu=function(container){
	var mb=createNewMaskBg();
	//var mn=createNewMenu();
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
	var newMenuId="mskmu";
	var newMenu=document.createElement("div");
	newMenu.id=newMenuId;
	pare.appendChild(newMenu);
	downMenu(newMenu);
	createNewMenu(newMenu);
};

function createNewMaskBg(){
	var newMaskId="mskbg";
	var newMask=document.createElement("div");
	newMask.id=newMaskId;
	return newMask;
}

function createNewMenu(newMenu){
	//var newMenuId="mskmu";
	//var newMenu=document.createElement("div");
	var menu=[];
	var newAId="menua";
	var newA;
	var newimg=document.createElement("img");
	var newAs=[];
	var dim;
	//newMenu.id=newMenuId;
	xmlHandle("menulist.xml",menu);
	var objprms=new Promise();
	//topline test;
	var startline=[0,0,800,0];
	var tp=new tl(null,startline); 
	
	for(var i=0; i<menu.length;i++){
		newA="";
		newA=document.createElement("a");
		newA.appendChild(newimg.cloneNode(true));
		newAs.push(newA.cloneNode(true));
		var a=0;
		newAs[i].firstChild.onload=function(event){
			var event=event || windows.event;
			tp.inP(event.srcElement); //topline test;
			objprms.then(menuApd(event,newMenu));
			objprms.resolve();
		};
		newAs[i].firstChild.src=menu[i].pic;
		newAs[i].id=newAId;
		newAs[i].href=menu[i].src;
		newAs[i].title=menu[i].title;
		newAs[i].target="_blank";
	}
	tp.outP();
	//return newMenu;
}

function menuApd (event,newMenu){
	var oi=event.target||event.srcElement;
		if(navigator.userAgent.match(/(IE|MSIE)/i)){
			if(event.srcElement.readystate){
				newMenu.appendChild(oi.parentElement);
			}
		}
		else{
			if(oi.complete){	
				newMenu.appendChild(oi.parentElement);
			}
		}
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

function xmlHandle(xmlfile, result){
	var xmlhttp,xmldoc;
	var root_node,pare_node,root_node_len;
	var pic_que_index=0;

	if(xmlfile){
		if(window.XMLHttpRequest){
			xmlhttp=new XMLHttpRequest();
		}
		else{
			xmlhttp=new ActiveObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET",xmlfile,false);
		xmlhttp.send(null);
		xmldoc=xmlhttp.responseXML;

		root_node=xmldoc.getElementsByTagName("Menus")[0];
		root_node_len=root_node.childNodes.length;
		for(var i=0;i<root_node_len;i++){
			pare_node=root_node.childNodes[i];
			if(pare_node.nodeType!=3){
				result[pic_que_index++]={
					title:pare_node.getElementsByTagName("Title")[0].firstChild.nodeValue||"",
					pic:pare_node.getElementsByTagName("Picture")[0].firstChild.nodeValue||"",
					src:pare_node.getElementsByTagName("Source")[0].firstChild.nodeValue||""
				}
			}			
		}
	}
}
})(this)
