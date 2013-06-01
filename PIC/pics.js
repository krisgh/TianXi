// Picture Class for display effection.
(function(){
this.PICS = function (){
	this.pic_que=[];
	this._workspace=document.createElement("div");
};

//Pic construction
PICS.prototype.initialize=function(xml_path,container){
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
				this.pic_que[pic_que_index++]={
                    t:(pare_node.getElementsByTagName("text")[0].firstChild||{}).nodeValue,
					s:pare_node.getElementsByTagName("file")[0].firstChild.nodeValue||""};
			}
		}
	}
	
	//_workspace style
	this._workspace.id="bg";
	this._workspace.style.opacity=1;
    //fill random image into bg
	document.getElementById(container).appendChild(this._workspace);
	pic_que_len=this.pic_que.length;
	var rnd_pic=Math.floor(Math.random()*pic_que_len);
	if(rnd_pic!==pic_que_len){
		this.fill_image(rnd_pic);
	}
	else{
		this.fill_image(0);
	}
};

//Fill image object into div object
PICS.prototype.fill_image=function(index_img,prmsPare){
	var org_img=new Image();
	var index=parseInt(index_img);
	var pics=this;
	var img_t_cache,img_s_cache;
	var objcont=this._workspace;
	var promise=new Promise();
	img_t_cache=this.pic_que[index].t||"";
	img_s_cache=this.pic_que[index].s||"";

	org_img.onload=function (){
		var ua=navigator.userAgent
		var prms=new Promise();
		if(ua.match(/(IE|MSIE)/i)){
			if(org_img.readyState){
				pics._workspace.style.backgroundImage="url("+org_img.src+")";
                if(prmsPare instanceof Promise){
                    prmsPare.then(function(){
                        return _fadein_.call(prmsPare,objcont,200);
                    });
                    if(prmsPare.status=='resolved'){
                        prmsPare.resolve();
                    }
                }
                else{
                    _fadein_(objcont,200);
                }
			}
		}
		else{
			if(org_img.complete){
				pics._workspace.style.backgroundImage="url("+org_img.src+")";
				if(prmsPare instanceof Promise){
                    prmsPare.then(function(){
                        return _fadein_.call(prmsPare,objcont,200);
                    });
                    if(prmsPare.status=='resolved'){
                        prmsPare.resolve();
                    }
                }
                else{
                    _fadein_(objcont,200);
                }
			}
		}
	}

	function effect_chain(){
		org_img.title=img_t_cache;
		org_img.src=img_s_cache;
        promise.resolve();
	}
    
    if(prmsPare instanceof Promise){
        promise=prmsPare;
    }
    promise.then(function(){
        return _fadeout_.call(promise,objcont,200);
        }).then(effect_chain);
    if(promise.status=='resolved'){
        promise.resolve();
    }
};

//button bar
PICS.prototype.btn_bar=function(){
	var objbar,i,objli,obja;
    var promise=new Promise();
    var Pics=this;
    
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
                    for(var sclass in arryclass){
                        arryclass[sclass].className="";
                    }
				}
				this.className="selected";
				Pics.fill_image(this.value,promise);
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
})(this)
