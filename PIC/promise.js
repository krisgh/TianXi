///////ASYNCHRONOUS CLASS///////
(function(){
this.Promise = function () {
        this.thens = [];
};

Promise.prototype = {
    resolve: function () {
        var t = this.thens.shift(), n;
        if(t){
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
this._fadeout_=function(movobj){//,callback,callback_obj){
	var opacity_offset,speed,step;
	//var prms=new Promise();
    var prms=this;
	speed=6;
	step=0.03;
	function decrease(){
		if(movobj.style.opacity===""){
			opacity_offset=1;
		}
		else{
			opacity_offset=parseFloat(movobj.style.opacity,10);
		}

		if((opacity_offset-step)>0.00001){
			movobj.style.opacity=opacity_offset-step;
			movobj.style.filter="alpha(opacity="+(opacity_offset-step)*100+")";
			setTimeout(function(){return decrease();},speed);
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
this._fadein_=function(movobj){
	var opacity_offset,speed,step;
	//var prms=new Promise();
    var prms=this;
	speed=6;
	step=0.03;
	function increase(){
		if(movobj.style.opacity===""){
			return this.fading
		}
		else{
			opacity_offset=parseFloat(movobj.style.opacity,10);
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
})(this);
