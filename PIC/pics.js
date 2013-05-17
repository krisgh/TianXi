// Picture Class for display effection.
(function(){
this.PICS = function (){
	this.pic_que=[];
	this._workspace=document.createElement("div");
};

//Pic construction
PICS.prototype.initialize=function(xml_path,container,width,height){
	var xmlhttp,xmldoc;
	var root_node, root_node_len,pare_node;
	var pic_que_index=0;
	var pic_que_len;
	//Get queue from xml file
	if(xml_path){
		if(window.XMLHttpRequest){
			xmlhttp=new XMLHttpRequest();
		}else{
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET",xml_path,false);
		xmlhttp.send(null);
		xmldoc=xmlhttp.responseXML;
	
		root_node=xmldoc.getElementsByTagName("pictures")[0];
		root_node_len=root_node.childNodes.length;
		for(var i=0;i<root_node_len;i++){
			pare_node=root_node.childNodes[i];
			if(pare_node.nodeType!=3){
				this.pic_que[pic_que_index++]={t:(pare_node.getElementsByTagName("text")[0].firstChild||{}).nodeValue,
					s:pare_node.getElementsByTagName("file")[0].firstChild.nodeValue||""};
			}			
		}
	}
	
	//_workspace style
	this._workspace.id="bg";
	this._workspace.style.opacity=1;
	//this._workspace.style.width="100%";
	//this._workspace.style.height="100%";
	document.getElementById(container).appendChild(this._workspace);
	pic_que_len=this.pic_que.length;
	var rnd_pic=Math.floor(Math.random()*pic_que_len);
	if(rnd_pic!==pic_que_len){
		this.fill_image(rnd_pic,container);
	}
	else{
		this.fill_image(0,container);
	}
};

//Fill image object into div object
PICS.prototype.fill_image=function(index_img){
	var org_img=new Image();
	var index=parseInt(index_img);
	var pics=this;
	var img_t_cache,img_s_cache;
	var objcont=this._workspace;//document.getElementById(contaner);
	var promise=new Promise();
	img_t_cache=this.pic_que[index].t||"";
	img_s_cache=this.pic_que[index].s||"";
	//_fadeout_(objcont,effect_chain,this);

	org_img.onload=function (){
		var ua=navigator.userAgent
		var prms=new Promise();
		if(ua.match(/(IE|MSIE)/i)){
			if(org_img.readyState){
				pics._workspace.style.backgroundImage="url("+org_img.src+")";
				//objcont.appendChild(pics._workspace);
				_fadein_(objcont,200);
			}
		}
		else{
			if(org_img.complete){
				pics._workspace.style.backgroundImage="url("+org_img.src+")";
				//objcont.appendChild(pics._workspace);
				_fadein_(objcont,200);
			}
		}
	}

	function effect_chain(){//,callback_obj){
		org_img.title=img_t_cache;
		org_img.src=img_s_cache;
	}

	promise.then(function(){ 
        return _fadeout_.call(promise,objcont,200);
        }).then(effect_chain);
    promise.resolve();
};

//button bar
PICS.prototype.btn_bar=function(Pics){
	var objbar,i,objli,obja;
	objbar=document.createElement("div");
	objbar.id="bs";
	objbar.innerHTML="<ul>"+objbar.innerHTML+"</ul>"
	for(var i=0;i<this.pic_que.length;i++){
		objli=document.createElement("li");
		obja=document.createElement("a");
		obja.id="num"+i;
		obja.href="javascript:void(0)";
		obja.value=i;
		obja.onclick=function(event){
			if(this.className!=="selected"){
				var arryclass=getElementsByClassName(objbar,"a","selected")
				if(arryclass.length){
					arryclass[0].className="";
				}
				this.className="selected";
				Pics.fill_image(this.value,"show");
			}
		};
		objli.appendChild(obja);
		objbar.firstChild.appendChild(objli);
	}
	objbar.onmouseover=function(){
		objbar.style.opacity=1;
		objbar.style.filter="alpha(opacity=100)";
	};
	objbar.onmouseout=function(){
		objbar.style.opacity=0.5;
		objbar.style.filter="alpha(opacity=50)";
	};
	return objbar;
};

//getElementsByClassName
//Author:Robert Nyman
function getElementsByClassName(oElm, strTagName, strClassName){
	var arrElements = (strTagName == "*" && oElm.all)?oElm.all:oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    strClassName = strClassName.replace(/\-/g, "\\-");
    var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
    var oElement;
    for(var i=0; i < arrElements.length; i++){
        oElement = arrElements[i];
        if(oRegExp.test(oElement.className)){
            arrReturnElements.push(oElement);
        }
    }
    return (arrReturnElements)
};
})(this)
