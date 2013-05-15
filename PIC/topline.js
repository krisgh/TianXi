//Tl 对象是根据矩形排样最低水平线搜索算法， 改正最高水平线算法
//***多最高水平线提升算法***
//*****1.举行在区域内查找最高水平线
//*****2.矩形宽度小于水平线宽度放入矩形
//*****3.如果矩形宽度大于水平线宽度
//*******a.获取下一个矩形，放入当前矩形到队列最后
//*******b.矩形队列无符合条件矩形，降低最高水平线，将最高水平线与其相邻的
//*********较高水平线合并，回到第1步
//*******c.如矩形在提升到唯一一条最高水平线仍无法放入，则丢弃矩形，并返
//*********回错误信息
//*****4.循环1-3步，直到队列中没有矩形
//目的：实现图片容器的有效空间利用
//需求：需固定的容器大小，传入图片坐标队列，或者图片对像生成坐标队列
//startLine 传递放入矩形区域对角坐标
//ps 图片队列，数组类型
//p 图片坐标对象 t 最高水平线对象
//p：{p x1 y1 x2 y2} t：{x1 y1 x2 y2} 
//p 坐标为左上角和右下角坐标集合， t为水平线两端点坐标集合, y1=y2
//outP 坐标计算主函数
//inP 获取外部图片加入pS数组
//_putP 内部函数，保存坐标到result数组
//_shiftLow 内部函数，重新生成最高水平线
//_intT 内部函数，初始化最高水平线
//_constructor 内部函数，读取外部获取的图片放置区域的坐标地址
//
(function(){
this.Tl=function(ps,startLine,borderSize){
	this.tS=[];
	this.pS=[];
	this.p;
	this.t;
	this.result=[];
    this.bSize;
	this._const( startLine,borderSize);
};
Tl.prototype={
	//get this.p to put to this.t
	outP:function(callback){
		var pLoop=this.pS.length;
		while(this.pS.length!=0){
            this.t=this.tS.shift();
            this.p=this.pS.shift(); pLoop--; 
            if( this.p.x2-this.p.x1<=this.t.x2-this.t.x1 ){
                this._putP(callback);
                pLoop=this.pS.length;
            }
            else {
                this.pS.push(this.p);
                if (!pLoop){
                    pLoop=this.pS.length;
                    this.tS.splice(0,0,this.t)
                    if(!this._shiftLow()){
                        this.p=this.pS.shift();
                        console.debug("Removal:"+this.p.p+" dimentions out of range.");
                        continue;
                    };
                    this.outP(callback);
                }
                else {
                    this.tS.splice(0,0,this.t);
                }
            }
		}
		return this.result;
	},
	//position pi and update tS
	_putP:function(callback){
		var pi={ p: this.p.p,
			x1:this.p.x1+this.t.x1,
			y1:this.p.y1+this.t.y1,
			x2:this.p.x2+this.t.x1,
			y2:this.p.y2+this.t.y1};
		this.result.push( pi) ;
        if(typeof callback!=="undefined" && typeof callback==="function"){
            callback.call(this,pi);
        }
        //input new this.t line
		//connect two same level line
		var newLine={x1:pi.x1, y1:pi.y2, x2:pi.x2, y2:pi.y2};
		if ( newLine.x2!=this.t.x2) {
			this.tS.push({x1:newLine.x2, y1:this.t.y1, x2:this.t.x2, y2:this.t.y2});
		}
		for(var i in this.tS){
			if(newLine.x1==this.tS[i].x2 && newLine.y1==this.tS[i].y2){ //left
				newLine.x1=this.tS[i].x1;
				this.tS.splice(i,1);
			}
			if(newLine.x2==this.tS[i].x1 && newLine.y2==this.tS[i].y1){ //right
				newLine.x2=this.tS[i].x2;
				this.tS.splice(i,1);
			}
		}
		this.tS.push(newLine);
		this._intT(null);
	},
	//shift hier t
	_shiftLow:function(){
		var hiest,lhier,rhier;
        if( this.tS.length==1 ){ return false; }
        console.debug(this.tS);
		this.tS.sort( function( a,b ){ return a.y2<b.y2?-1:1; });
		hiest=this.tS.shift();
		for ( var i in this.tS) {
			if (hiest.x1==this.tS[i].x2 ) { //left
				lhier=this.tS.splice(i,1)[0];
			}
            else if (hiest.x2==this.tS[i].x1) { //right
                rhier=this.tS.splice(i,1)[0];
			}
		}
        if(!lhier){
            rhier.x1=hiest.x1;
            this.tS.push(rhier);
            this._intT(null);
            return true;
        }
        if(!rhier){
            lhier.x2=hiest.x2;
            this.tS.push(lhier);
            this._intT(null);
            return true;
        }
        if( lhier.y2>rhier.y2){
            rhier.x1=hiest.x1;
            this.tS.push(rhier);
            this.tS.push(lhier);
            this._intT(null);
            return true;
        }
        if( lhier.y2<rhier.y2){
            lhier.x2=hiest.x2;
            this.tS.push(lhier);
            this.tS.push(rhier);
            this._intT(null);
            return true;
        }
        if( lhier.y2==rhier.y2){
            lhier.x2=rhier.x2;
            this.tS.push(lhier);
            this._intT(null);
            return true;
        }
	},
	//intT()
	_intT:function(startLine){
        if(this.tS.length==0){
            this.tS.push(startLine);
        }
        this.tS.sort( function(a,b){ return a.y2<b.y2?-1:1; } )
        return this.tS.length;
	},
	//constructor()
	_const: function(startLine, borderSize){
		if(startLine.length!=4) { return 0;}
		var tmpt={x1: startLine[0], 
							y1: startLine[1],
							x2: startLine[2],
							y2: startLine[1]};
		this._intT( tmpt );
        bSize=typeof(borderSize)==="number"?borderSize:0;

	},
	//inP from workspace
	inP:function(objOri){
		if (typeof(objOri)!="object"){
			return 0;
		}
		else{
            if(!objOri.width || !objOri.height || objOri.width==0 || objOri.height==0){
                return 0;
            }
			var tp={ p: this._clone(objOri),
							x1:0,
							y1:0,
							x2:objOri.width+bSize,
							y2:objOri.height+bSize};
			this.pS.push(tp);
		}
		return this;
	},
    //object clone
    _clone:function(objOri){
        var objClone;
        if (objOri.cloneNode){
            return objOri.cloneNode(true);
        }
        if (objOri.constructor == Object){
            objClone = new objOri.constructor(); 
        }else{
            objClone = new objOri.constructor(objOri.valueOf()); 
        }
        for(var key in objOri){
            if ( objClone[key] != objOri[key] ){ 
                if ( typeof(objOri[key]) == 'object' ){ 
                    objClone[key] = this._clone(objOri[key]);
                }else{
                    objClone[key] = objOri[key];
                }
            }
        }
        objClone.toString = objOri.toString;
        objClone.valueOf = objOri.valueOf;
        return objClone; 
    },
    //pS length
    len:function(){
        return this.pS.length;
    }
};			
})(this);
