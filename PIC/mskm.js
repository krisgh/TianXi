(function(winnav){
//imgMenu object
this.imgMenu=function(){
        this.pic=document.createElement("img");
        this.href;
        this.title;
        this.width;
        this.height;
};

imgMenu.prototype={
    imga:function(id){
        if(this.pic instanceof HTMLImageElement){ 
            var imgblock=document.createElement("a");
            imgblock.id=id;
            imgblock.href=this.href;
            imgblock.title=this.title;
            imgblock.target="_blank";
            imgblock.appendChild(this.pic.cloneNode(true));
            return imgblock;
        }
        else{
            return false;
        }
    },
    src:function(path){
        this.pic.src=path;
    },
    onload:function(func){
        var parent=this;
        this.pic.onload=function(){
            parent.width=this.width;
            parent.height=this.height;
            return func.call(null,parent);
        }
    }
};


this.openMaskImgMenu=function(container){
	//mask layer
	var pare=document.createElement("div");
	pare.id="maskmenu";
	container.appendChild(pare);
    //close button
	var closeBtnId="moveout";
	var closeBtn=document.createElement("a");
	closeBtn.id=closeBtnId;
	closeBtn.innerHTML="走你";
	closeBtn.href="javascript:void(0)";
	closeBtn.onclick=function(){
		container.removeChild(pare);
	}
	pare.appendChild(closeBtn);
    //mask layer background
    var mb=createNewMaskBg();
	pare.appendChild(mb);
    //images menu
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
	var menu=[];
    var newAId="menua",newA=document.createElement("a"),newAs=[];

    xmlHandle("menulist.xml",menu);
    
	var objprms=new Promise();
    
	//topline 
	var startline=[5,5,800,600];
	var tp=new tl(null,startline,5); 
    
	/*for(var i=0; i<menu.length;i++){
        newimgs.push(newimg.cloneNode(true));
		newimgs[i].onload=function(event,i){
			var event=event || window.event;
            var img=event.srcElement||event.target;
			return imgLoad(img);
		};
        newimgs[i].src=menu[i].pic;
	}*/
    //fill images with coordinate
	//var coodnit=tp.outP();
    
    //new imgMenu obj test
    var objims=[];
    for(var i=0; i<menu.length;i++){
        var objim=new imgMenu();
        objims.push(objim);
		objims[i].onload(imgLoad);
        objims[i].src(menu[i].pic);
        objims[i].title=menu[i].title;
        objims[i].href=menu[i].src;
    }
    
    function imgLoad(im){
        console.debug(this);
        console.debug(im);
        tp.inP(im); //topline
        if(tp.len()==menu.length){
            var coodnit=tp.outP();
            for (var i in coodnit){
                var co=coodnit[i].p.imga("menua");
                co.style.left=coodnit[i].x1;
                co.style.top=coodnit[i].y1;
                newMenu.appendChild(co);
            }
        }
    }
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
