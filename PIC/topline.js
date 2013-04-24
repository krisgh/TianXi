//tl 对象是根据矩形排样最低水平线搜索算法， 改正最高水平线算法
//***多最高水平线提升算法***
//*****1.举行在区域内查找最高水平线
//*****2.矩形宽度小于水平线宽度放入矩形
//*****3.如果矩形宽度大于水平线宽度
//*******a.获取下一个举行，放入当前矩形到队列最后
//*******b.矩形队列无符合条件矩形，查找次高水平线
//*******c.水平线队列无符合条件项，查找最高水平线，合并与其相邻的
//*********较高水平线，回到第1步直到所有矩形放入
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
this.tl=function(ps,startLine){
	this.tS=[];
	this.pS=ps instanceof Array?ps.slice():[];
	this.p;
	this.t;
	this.result=[];
	this._const( startLine );
};
tl.prototype={
	//get this.p to put to this.t
	outP:function(){
		var pLoop=this.pS.length;
        var tLoop=this.tS.length;
		while(this.pS.length!=0){
            this.t=this.tS.shift(); tLoop--;
            this.p=this.pS.shift(); pLoop--; 
            if( this.p.x2-this.p.x1<=this.t.x2-this.t.x1 ){
                this._putP();
                tLoop=this.tS.length;
                pLoop=this.pS.length;
            }
            else {
                this.pS.push(this.p);
                if (!pLoop){
                    pLoop=this.pS.length;
                    this.tS.push(this.t);
                    if (!tLoop) {
                        if(!this._shiftLow()){
                            this.p=this.pS.shift();
                            console.debug("Removal:"+this.p.p+" dimentions out of range.");
                            continue;
                        };
                        this.outP();
                    }
                }
                else {
                    this.tS.splice(0,0,this.t);
                    tLoop++;
                }
            }
		}
		return this;
	},
	//position pi and update tS
	_putP:function(){
		var pi={ p: this.p.p,
			x1:this.p.x1+this.t.x1,
			y1:this.p.y1+this.t.y1,
			x2:this.p.x2+this.t.x1,
			y2:this.p.y2+this.t.y1};
		this.result.push( pi) ;
        //input new this.t line
		//connect two same level line
		var newLine={x1:pi.x1, y1:pi.y2, x2:pi.x2, y2:pi.y2};
		if ( newLine.x2!=this.t.x2) {
			this.tS.push({x1:newLine.x2, y1:this.t.y1, x2:this.t.x2, y2:this.t.y2});
		}
		for(var i in this.tS){
			if(newLine.x1==this.tS[i].x2 && newLine.y1==this.tS[i].y2){ //left
				newLine.x1=this.tS[i].x1;
				this.tS[i].splice(i,1);
			}
			if(newLine.x2==this.tS[i].x1 && newLine.y2==this.tS[i].y1){ //right
				newLine.x2=this.tS[i].x2;
				this.tS[i].splice(i,1);
			}
		}
		this.tS.push(newLine);
		this._intT(null);
	},
	//shift lower t
	_shiftLow:function(){
		var lowest, lower,lowerIndex;
        if( this.tS.length==1 ){ return false; }
		this.tS.sort( function( a,b ){ return a.y2<b.y2?-1:1; });
		lowest=this.tS.shift();
		for ( var i in this.tS) {
			if (lowest.x1==this.tS[i].x2 ) { //left
				lower=this.tS[i];
				lowerIndex=i;
				lower.x2=lowest.x2;
			}
			if (lowest.x2==this.tS[i].x1) { //right
				if (lower) {
					if (lower.x1>this.tS[i].x1) {
						lower=this.tS[i];
						lowerIndex=i;
						lower.x1=lowest.x1;
					}
				}
				else {
					lower=this.tS[i];
					lowerIndex=i;
					lower.x1=lowest.x1;
				}
			}
		}
        return true;
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
	_const: function(startLine){
		if(startLine.length!=4) { return 0;}
		var tmpt={x1: startLine[0], 
							y1: startLine[1],
							x2: startLine[2],
							y2: startLine[1]};
		this._intT( tmpt );
	},
	//inP from workspace
	inP:function(pic){
		if (!(pic instanceof Object && pic.tagName.toString()==="IMG") ){
			return 0;
		}
		else{
			var tp={ p: pic.cloneNode(true), 
							x1:0,
							y1:0,
							x2:pic.width,
							y2:pic.height};
			this.pS.push(tp);
		}
		return this;
	}	
};			
})(this);
