// Picture Class for display effection.
(function(winnav){
this.PICS = function (){
	this.pic_que=[];
	this._workspace=document.createElement("div");
	this.initialize('imglist.xml',1196,342);
};

//Pic queue rotate
PICS.prototype.rotate_queue=function(){
};

//Pic queue offset
PICS.prototype.offset_queue=function(){
};

//Pic queue effective
PICS.prototype.effect_queue=function(){
};

//Pic construction
PICS.prototype.initialize=function(xml_path,width,height){
	var xmlhttp,xmldoc;
	var root_node, root_node_len,pare_node;
	var pic_que_index=0;
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
	this._workspace.style.display="block";
	this._workspace.style.width=width+"px";
	this._workspace.style.height=height+"px";
};

//Fill image object into div object
PICS.prototype.fill_image=function(index_img,contaner){
	var org_img=new Image();
	var fill_img=new Image();
	var index=parseInt(index_img);
	var pics=this;
	var img_t_cache,img_s_cache;
	var objcont=document.getElementById(contaner);
	objcont.style.zoom=1;
	org_img.onload=function (){
		var ua=navigator.userAgent
		if(ua.match(/(IE|MSIE)/i)){
			if(org_img.readyState){
				fill_img.src=org_img.src;
				pics._workspace.style.background="url("+org_img.src+") no-repeat center center";
				objcont.appendChild(pics._workspace);
			}
		}
		else{
			if(org_img.complete){
				fill_img.src=org_img.src;
				pics._workspace.style.background="url("+org_img.src+") no-repeat center center";
				objcont.appendChild(pics._workspace);
				}
		}
	}

	img_t_cache=this.pic_que[index].t||"";
	img_s_cache=this.pic_que[index].s||"";
	_fadeout_(objcont,effect_chain,this);
	function effect_chain(fade_obj,callback_obj){
		org_img.title=img_t_cache;
		org_img.src=img_s_cache;
		_fadein_(fade_obj);
	}
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
		obja.innerHTML=i;
		obja.onclick=function(event){
			if(this.className!=="selected"){
				var arryclass=getElementsByClassName(objbar,"a","selected")
				if(arryclass.length){
					arryclass[0].className="";
				}
				this.className="selected";
				Pics.fill_image(this.innerText,"show");
			}
		};
		objli.appendChild(obja);
		objbar.firstChild.appendChild(objli);
	}
	objbar.style.right="10px";
	objbar.style.bottom="5px";
	objbar.style.backgroundColor="yellow";
	objbar.style.opacity=0.5;
	objbar.onmouseover=function(){
		objbar.style.opacity=1;
	};
	objbar.onmouseout=function(){
		objbar.style.opacity=0.5;
	};
	return objbar;
};

//effective
function _fadeout_(movobj,callback,callback_obj){
	var opacity_offset,speed;
	speed=6;
	function decrease(){
		if(movobj.style.opacity===""){
			opacity_offset=1;
		}
		else{
			opacity_offset=parseFloat(movobj.style.opacity,10);
		}

		if(opacity_offset>0.02){
			movobj.style.opacity=opacity_offset-0.02;
			movobj.style.filter="alpha(opacity="+(opacity_offset-0.02)*100+")";
			setTimeout(function(){return decrease();},speed);
		}
		else{
			movobj.style.opacity=0;
			movobj.style.filter="alpha(opacity=0)";
			if(typeof(callback)==="function"){
				callback(movobj,callback_obj);
			}
		}
	}

	decrease();
};

function _fadein_(movobj,callback,callback_obj){
	var opacity_offset,speed;
	speed=6;
	function increase(){
		if(movobj.style.opacity===""){
			return this.fading
		}
		else{
			opacity_offset=parseFloat(movobj.style.opacity,10);
		}

		if(opacity_offset<1){
			movobj.style.opacity=opacity_offset+0.02;
			movobj.style.filter="alpha(opacity="+(opacity_offset+0.02)*100+")";
			setTimeout(function(){return increase();},speed);
		}
		else{
			movobj.style.opacity=1;
			movobj.style.filter="alpha(opacity=100)";
			if(typeof(callback)==="function"){
				callback(movobj,callback_obj);
			}
		}
	}

	increase();
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
