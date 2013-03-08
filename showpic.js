	var pics=new Array();
	var showpic=new Image();
	var objImg=new Image();
	var objClon=new Image();
	var ci=0; //current picture index in show pannel
	var emLink=document.getElementById("link");
	var emShow=document.getElementById("show");
	var emSlt=0;
	var menu=new MENU;
	menu.initxml();
	pics=menu.picsrc();
	
	//picture button and link
	for(var i=0;i<=pics.length-1;i++)
	{
		objImg.src=pics[i].s;
		objClon=objImg.cloneNode(true);
		emLink.innerHTML=emLink.innerHTML+"<li><img id="+i+" src='"+pics[i].s+"' name=''></li>"
	}
	emLink.style.left="4px"; //((565-44*i-2)/2).toString()+"px";

	//button onmousedown events initialize
	for(var b=0;b<emLink.childElementCount;b++)
	{
		emLink.children[b].onmousedown=function(event){ //event参数兼容ff
			if(navigator.appName=="Microsoft Internet Explorer") {var tmpEvent=event.srcElement;}else{ var tmpEvent=event.target;}
			if(tmpEvent.name!='selected'){
				clearInterval(intr);
				ci=Number(tmpEvent.id)-1;
				chagepic();
				ci++;
				intr=setInterval(chagepic,4000);
				linkstyle(Number(tmpEvent.id));
			}
			return;
		}
	}
	//navigator onmousedown events initilize
	var offset=12*48
	var curleft=emLink.offsetLeft;
	var totalon=pics.length*48;
	var navbtn=document.getElementById("prev");
	navbtn.onmousedown=function(event){
		curleft=emLink.offsetLeft-2;
		var newleft=(emLink.offsetLeft-(curleft>>31)*offset);
		shiftini(emLink,newleft);
	}

  	navbtn=document.getElementById("next");
  	navbtn.onmousedown=function(event){
		curleft=emLink.offsetLeft-2;
		var newleft=(emLink.offsetLeft-((parseInt(totalon+curleft-offset)>>31)+1)*offset);
		shiftini(emLink,newleft);
	}
	//
	emShow.appendChild(showpic);
	chagepic();
	
	//menu link onmousedown events.
	var about=document.getElementById("about");
	about.onmousedown=function(event){
		$("#main").fadeOut('fast');
		setTimeout("menu.aboutshow(document.getElementById('main'))",200);
		$("#main").fadeIn('slow');	
	}
	var contact=document.getElementById("contact");
	contact.onmousedown=function(event){
		$("#main").fadeOut('fast');
		setTimeout("menu.contactshow(document.getElementById('main'))",200);
		$("#main").fadeIn('slow');
	}
	var design=document.getElementById("design");
	design.onmousedown=function(event){
		$("#main").fadeOut('fast');
		setTimeout("menu.designshow(document.getElementById('main'))",200);
		$("#main").fadeIn('slow');
	}
	//navgitor shift action, direct(left -1)/(right 1)
	var start,pot,step,end,lr,ele;
	function shiftini(emo,dest){
		start=emo.offsetLeft;
		pot=start;
		step=(dest-start)/10;
		end=dest;
		if(start>dest) lr=1; else lr=-1;
		ele=emo;
		shiftact();
	}
	function shiftact(){
		if((end-pot)*lr<0){
			pot+=step;
			ele.style.left=pot+"px";
			setTimeout("shiftact()",40);
		}
	}
	//button events
	function linkevent(lc){
		if(navigator.appName=="Microsoft Internet Explorer") var tmpEvent=event.srcElement; else var tmpEvent=event.target;
		linkstyle(Number(tmpEvent.id));
		clearInterval(intr);
		ci=Number(tmpEvent.id)-1;
		chagepic();
		ci++;
		intr=setInterval(chagepic,4000);
	}

	function linkstyle(lindex){
		var tmpEs=emLink.children[lindex].children[0];
		//autoshift emLink
		if(lindex%12==0){
			var position=-lindex*48+4;
			shiftini(emLink,position);
		}
		//
		if(lindex!=emSlt){
			var sltEs=emLink.children[emSlt].children[0];
			sltEs.style.borderWidth="2px";
			sltEs.style.borderColor="";
			sltEs.style.opacity="0.5";
			tmpEs.style.borderWidth="3px";
			tmpEs.style.borderColor="#FFFFFF"; 
			tmpEs.style.opacity="1";
			emSlt=lindex;
		}
		return;
	}
	
	function initial(index){
		var orgimg=new Image();
		orgimg.src=pics[index].s;

		function formulaPic(){
			showpic.style.paddingTop="0px";
			showpic.src=orgimg.src;
		//if(orgimg.src!=showpic.src) orgimg.src=showpic.src;
			if(parseInt(orgimg.width)*49>parseInt(orgimg.height)*60){
				showpic.style.width="600px"; 
				showpic.style.height="auto";
			}else{
				showpic.style.height="490px";
				showpic.style.width="auto";
			}
		}
		if(orgimg.complete){
			formulaPic();
		}
		else {
			orgimg.onload=formulaPic;
		}
	}
	function chagepic()
	{
		ci=ci<pics.length?ci:0;
		$("#show").fadeOut('fast');
		setTimeout('{linkstyle(ci);initial(ci);ci++;}',200);
		$("#show").fadeIn('slow');
	}

	var intr=setInterval(chagepic,4000);
