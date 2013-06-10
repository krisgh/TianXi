///////ASYNCHRONOUS CLASS///////
(function(){
this.navAgentIE=!-[1,]; //IE9 below is true, others is false
this.Promise = function () {
        this.thens = [];
        this.status='resolved'; //two status:progress,resolved
};

Promise.prototype = {
    resolve: function () {
        var t = this.thens.shift(), n;
        this.status='resolved';
        if(t){
            this.status='progress';
			n = t.apply(this, arguments);
			if(n instanceof Promise){
				n.thens = this.thens;
			}
		}
    },
    then: function (n) {
        if(n instanceof Function){
            this.thens.push(n);
        }
		return this;
    }
}

///////EFFECTIVE FUNCTION///////

//Fadeout
this._fadeout_=function(movobj,time){//,callback,callback_obj){
	var opacity_offset,speed,step;
    clearTimeout(this.varSetTime);
	//Promise option
    var prms=this;
	step=0.03;
    if(time){
        speed=parseInt(time/(1/step)+0.55);
    }
    else{
        speed=20;
    }
	function decrease(){
		if(movobj.style.opacity===""){
			opacity_offset=1;
		}
		else{
			opacity_offset=parseFloat(movobj.style.opacity,10);
            if(opacity_offset=='undefined'){
                opacity_offset=parseFloat(movobj.style.filter.match(/\d+/))/100;
            }
		}

		if((opacity_offset-step)>0.00001){
			movobj.style.opacity=opacity_offset-step;
			movobj.style.filter="alpha(opacity="+(opacity_offset-step)*100+")";
			setTimeout(decrease,speed);
		}
		else{
			movobj.style.opacity=0;
			movobj.style.filter="alpha(opacity=0)";
			if( prms instanceof Promise) {
                prms.resolve();
                return prms;
            }
		}
	
	}
	decrease();
}

//Fadein
this._fadein_=function(movobj,time){
	var opacity_offset,speed,step;
    clearTimeout(this.varSetTime);
	//Promise option
    var prms=this;
	step=0.03;
    if(time){
        speed=parseInt(time/(1/step)+0.55);
    }
    else{
        speed=20;
    }
	function increase(){
		if(movobj.style.opacity===""){
			return this.fading
		}
		else{
			opacity_offset=parseFloat(movobj.style.opacity);
            if(opacity_offset=='undefined'){
                opacity_offset=parseFloat(movobj.style.filter.match(/\d+/))/100;
            }
		}

		if(opacity_offset<1){
			movobj.style.opacity=opacity_offset+step;
			movobj.style.filter="alpha(opacity="+(opacity_offset+step)*100+")";
			setTimeout(increase,speed);
		}
		else{
			movobj.style.opacity=1;
			movobj.style.filter="alpha(opacity=100)";
            if( prms instanceof Promise) {
                prms.resolve();
                return prms;
            }
		}
	}
	increase();
}

//Down container
this.downMenu=function(menu){
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

//getElementsByClassName
//Author:Robert Nyman
this.getElementsByClassName=function(oElm, strTagName, strClassName){
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
})(this);
