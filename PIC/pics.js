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
	var index=index_img;
	var pics=this;
	
	org_img.onload=function (){
		var ua=navigator.userAgent
		if(ua.match(/(IE|MSIE)/i)){
			if(org_img.readyState){
				fill_img.src=org_img.src;
				pics._workspace.style.background="url("+org_img.src+") no-repeat center center";
				document.getElementById(contaner).appendChild(pics._workspace);
			}
		}
		else{
			if(org_img.complete){
				fill_img.src=org_img.src;
				pics._workspace.style.background="url("+org_img.src+") no-repeat center center";
				document.getElementById(contaner).appendChild(pics._workspace);
				}
		}
	}
	
	org_img.title=this.pic_que[index].t;
	org_img.src=this.pic_que[index].s;
};

//button bar
PICS.prototype.btn_bar=function(){
	var objbar,i;
	objbar=document.createElement("div");
	for(i=0;i<this.pic_que.length;i++){
		objbar.addElement("<a id='nav"+i+"'>"+i+"</a>");
	}
	objbar.style.right="10px";
	objbar.style.bottom="5px";
	return objbar;
};
//effective
PICS.prototype._fadeout_=function(movobj){
	var opacity_offset,speed,fading;
	speed=6;
	function decrease(){
		if(movobj.style.opacity===""){
			opacity_offset=1;
		}
		else{
			opacity_offset=parseFloat(movobj.style.opacity,10);
		}
		fading=true;
		if(opacity_offset>0.02){
			movobj.style.opacity=opacity_offset-0.02;
			setTimeout(function(){return decrease();},speed);
		}
		else{
			movobj.style.opacity=0;
			fading=false;
		}
	}

	function end(){
		return fading;
	}
	
	decrease();
};

PICS.prototype._fadein_=function(movobj){
	var opacity_offset,speed,fading;
	speed=6;
	function increase(){
		if(movobj.style.opacity===""){
			return fading
		}
		else{
			opacity_offset=parseFloat(movobj.style.opacity,10);
		}
		fading=true;
		if(opacity_offset<1){
			movobj.style.opacity=opacity_offset+0.02;
			setTimeout(function(){return increase();},speed);
		}
		else{
			movobj.style.opacity=1;
			fading=false;
		}
	}

	function end(){
		return fading;
	}
	
	increase();
};
})(this)
