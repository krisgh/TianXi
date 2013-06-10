(function(){
//imgMenu object
this.ImgMenu=function(){
        this.pic=document.createElement("img");
        this.href;
        this.title;
        this.width;
        this.height;
};

ImgMenu.prototype={
    pack:function(className){
        if(Object.prototype.toString.call(this.pic)==='[object HTMLImageElement]' ||
            Object.prototype.toString.call(this.pic)==='[object Object]'){ 
            var imgblock=document.createElement("div");
            var imga=document.createElement("a");
            imgblock.setAttribute('class',className);
            imgblock.style.position='absolute';
            imga.setAttribute('class',className+'-i');
            imga.href=this.href;
            imga.target="_blank";
            imga.appendChild(this.pic.cloneNode(true));
            
            var imgt=document.createElement('div');
            imgt.setAttribute('class',className+'-t');
            imgt.style.display='none';
            imgt.style.width='100%';
            var imgf=document.createElement('div');
            imgf.setAttribute('class',className+'-f');
            imgf.innerHTML="<span class='"+className+"-tt'>"+this.title+"</span>";
            imgt.appendChild(imgf.cloneNode(true));
            imga.appendChild(imgt);
            imgblock.appendChild(imga.cloneNode(true));
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


this.openMaskImgMenu=function(container,msL,msT,msW,msH){
    //menu size
    if(!msW) msW=document.body.offsetWidth*0.7;
    if(!msH) msH=document.body.offsetHeight*0.7;
    menu_size={msW:msW,msH:msH}; //private to public
	//mask layer
	var pare=document.createElement("div");
	pare.id="maskmenu";
	container.appendChild(pare);
    
    //close button
	var closeBtnId="moveout";
	var closeBtn=document.createElement("div");
	closeBtn.id=closeBtnId;
	closeBtn.innerHTML="<a class='close'></a>"
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
    newMenu.style.width=msW+'px';
    newMenu.style.height=msH+'px';
    newMenu.style.left=msL+'px';
    newMenu.style.top=msT+'px';
    var waitImg=document.createElement("img");
    newMenu.appendChild(waitImg);
    waitImg.onload=function(){
        pare.appendChild(newMenu);
        //downMenu(newMenu);
        createNewMenu(newMenu);
    }
    waitImg.src="images/loading.png";
};

function createNewMaskBg(){
	var newMaskId="mskbg";
	var newMask=document.createElement("div");
	newMask.id=newMaskId;
	return newMask;
}

function createNewMenu(newMenu){
	var menu=[];

    xmlHandle("menulist.xml",menu);
    
    //promise for fadein
	var objPrms=new Promise();
    var countPrmsEmbed=0;
	//topline 
	var startline=[5,5,menu_size.msW-10,menu_size.msH];
	var tp=new Tl(null,startline,14); 
    //new ImgMenu obj test
    var objIms=[];
    for(var i=0; i<menu.length;i++){
        var objIm=new ImgMenu();
        objIms.push(objIm);
        if(menu[i].pic){
            objIms[i].onload(imgLoad);
            objIms[i].src(menu[i].pic);
            objIms[i].title=menu[i].title;
            objIms[i].href=menu[i].src;
        }
    }
    
    function imgLoad(im){
        tp.inP(im); //topline
        if(tp.len()===menu.length){
            newMenu.innerHTML='';
            var tpRzl=tp.outP(function(result){
                var menudiv=result.p.pack("icon").cloneNode(true);
                menudiv.style.opacity=0;
                menudiv.style.filter="Alpha(opacity=0)";
                menudiv.style.left=result.x1;
                menudiv.style.top=result.y1;
                newMenu.appendChild(menudiv);
                objPrms.then(function(){
                    return _fadein_.call(objPrms,menudiv,100);
                });
                countPrmsEmbed++;
            });
        }
        if(countPrmsEmbed===tpRzl.length){
            objPrms.resolve();
            addIconsEvent('icon-i');
        }
    }
}

function addIconsEvent(className){
    var iconHrefs=document.getElementsByClassName(className);
    for(var iconHref in iconHrefs){
        iconHrefs[iconHref].onmouseover=function(){
            console.log('onmouseover '+this);
            this.getElementsByClassName('icon-t')[0].style.display='';
        }
        iconHrefs[iconHref].onmouseout=function(){
            console.log('onmouseover '+this);
            this.getElementsByClassName('icon-t')[0].style.display='none';
        }
    }
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
                var tmppic=pare_node.getElementsByTagName("Picture")[0].firstChild;
                if( !tmppic ) continue;
                var tmptitle=pare_node.getElementsByTagName("Title")[0].firstChild||'';
                var tmpsrc=pare_node.getElementsByTagName("Source")[0].firstChild||'';
				result[pic_que_index++]={
					title:tmptitle.nodeValue,
					pic:tmppic.nodeValue,
					src:tmpsrc.nodeValue
				}
			}			
		}
	}
}
})(this)
