//Help function`s
function type(e)
{
	var t=Object.prototype.toString.call(e);
	if(/\[object HTML([a-zA-Z]+)Element\]/.test(t))return t.match(/\[object HTML([a-zA-Z]+)Element\]/)[1].toLowerCase();
	if(/\[object ([a-zA-Z]+)\]/.test(t)) return t.match(/\[object ([a-zA-Z]+)\]/)[1].toLowerCase();
}
function isHTML(e)
{
	var t=Object.prototype.toString.call(e);
	if(/\[object HTML([a-zA-Z]+)\]/.test(t)) return true;
	else return false;
}
length=function(t) {
    var size = 0, key;
    for (key in t) {
        if (t.hasOwnProperty(key)) size++;
    }
    return size;
};
String.prototype.replaceAll=function (obj)
{
	var i=0,n=length(obj),text=this,obj=obj;
    do 
	{
		var o=/\{([a-zA-Z0-9_]+)\}/;
		text=text.replace(o,function (s,p,b){if(typeof(p) == "string" ||typeof(p) == "number")return obj[p]});     
	 i++;
	}
	while(i<n)
	return text;
};
function displayTrigger(command)
{
  if(command=='show') this.style.display=='none'?this.style.display='block':this.style.display='';
  else if(command=='hidde') this.style.display=='none'?this.style.display='none':this.style.display='none';
  else if(command.length>1) this.style.display==command;
  else this.style.display=='none'?this.style.display='':this.style.display='none';
}
HTMLElement.prototype.displayTrigger=displayTrigger;
/* Hash model
 * Parameters:
 * var String hash - with note #. Need to run functions when switching on the appropriate link
 * var function start - must be. Constructor function is run first.
 * var function end - must be. Destruction function is run before running new function.
 * var function restart - can be. Is running if user active one hash multiple times.
 *
 * You can add all parametrs, functions what you need and use it in you script.
 * You can use templates and save it in your object, or use it from as html 
 *
 * <script type="text/template" id="some id for get temp"><htmlTag>{some info}</htmlTag></script>
 *
*/
function hashTrigger(h)
{
	if(h!=undefined)this.add(h);
	this.addEvent();
	this.loc();
	return this;
}
hashTrigger.prototype.add=function (h)
{
	if(h.hash!=undefined&&h.start!=undefined) {var a=this.item; a.push(h); this.item=a;}
	else console.error("HashModel: Error in add method. Check your object - ",h);
	return this;
}
hashTrigger.prototype.loc=function (hash)
{
	if(hash==undefined)
	{
		var h=window.location.hash;
		var i=0;
		while(i<this.item.length)
		{
			if(h==this.item[i].hash||h.indexOf(this.item[i].hash)!=-1) {this.trigger(i); return false;}
			i++;
		}
	} else {
		var h=hash;
		var i=0;
		while(i<this.item.length)
		{
			if(h==this.item[i].hash||h.indexOf(this.item[i].hash)!=-1) {return this.item[i];}
			i++;
		}
	}
	
}
hashTrigger.prototype.addEvent=function ()
{
	var t=this;
	if ("onhashchange" in window) window.onhashchange=function()
		{
			t.loc(); return false;
		}
	else 
	{
		var links=document.getElementsByTagName('a');
		var i=0;
		while(i<links.length)
		{
			if(links[i].href==this.item[i].hash||links[i].href.indexOf(this.item[i].hash)!=-1)
			{
				(function (i){links[i]['onclick']=function (i){t.trigger(i);};})(i);
			}
		i++;
		}
	}
	if("onpopstate" in window) window.onpopstate=function () 
	{
		t.loc(); return false;
	}
}
hashTrigger.prototype.trigger=function (i)
{
	undefined;
	var hash=window.location.hash,oldhash;
	
	//get command from link if the have not command use the null string;
	
	if(/(?:(#\S+)\(([\S\s]+|)\)|(#\S+))/i.test(hash)) {var row=hash.match(/(?:(#\S+)\(([\S\s]+|)\)|(#\S+))/i); hash=row[1]!=undefined?row[1]:row[3];var command=row[2]!=undefined?row[2]:'';}
	else {hash=this.item[i].hash; var command='';}
	hash=hash.replace('#','');
	//if user just use one hash secend time we use function restart (if we have)
	//else get last hash from history and run function end, add in hisroty new element and use funtion start of new element.
	if(this.history[this.history.length>0?this.history.length-1:0]==hash&&this.item[i].restart!=undefined)
	{
		this.item[i].restart(command); return false;
	} else {
		var history=this.history; history.push(hash); this.history=history;
		if(this.history.length>1){oldhash=this.loc(this.history[this.history.length-2]);if(oldhash.end!=undefined)oldhash.end();}
		this.item[i].start(command); 
		return false;
	}
}
hashTrigger.prototype.item=[];
hashTrigger.prototype.history=[];

//Panel Object. Not required model//
function panelCreater(settings)
{
	//Check settings and add in object;
	//Check parent element
	if("jquery" in settings.parent) this.parent=settings.parent[0];
	else if(isHTML(settings.parent)) this.parent=settings.parent;
	else if(document.getElementById(settings.parent)) this.parent=document.getElementById(settings.parent);
	else if(settings.parent==undefined) console.error("Can`t set panel parent. The parent is ", settings.parent);
	else console.error("Can`t set panel parent. The parent is ", settings.parent);
	//Check hash element
	if(settings.hash.length>1) this.hash=settings.hash;
	else console.error("Can`t set panel hash. The hash is ", settings.hash);
	//Check start function
	if(type(settings.start)=="function") this.start=settings.start;
	else console.error("Can`t set start function. The start not function.");
	//Check end function
	if(type(settings.end)=="function") this.end=settings.end;
	else console.error("Can`t set end function. The end not function.");
	//Check restart function can be null||underfined
	if(settings.restart!=undefined||type(settings.restart)=="function") this.end=settings.end;
	else console.error("Can`t set restart function. The restart not function.");
	//Check template element
	if("jquery" in settings.template) this.parent=settings.template.html().toString();
	else if(isHTML(settings.template)) this.parent=settings.template.innerHTML.toString();
	else if(document.getElementById(settings.template)) this.parent=document.getElementById(settings.template).innerHTML.toString();
	else if(type(settings.template)=='string') this.parent=document.getElementById(settings.template).innerHTML.toString();
	else if(settings.template==undefined) console.error("Can`t set panel template. The template is ", settings.template);
	else console.error("Can`t set panel template. The template is ", settings.template);
	this.state='not-used';
}
panelCreater.prototype.name='panel';
panelCreater.prototype.paint=function(info)
{
	this.parent.innerHTML=this.template.replaceAll(info);
	this.parent.displayTrigger('show');
	this.state='show';
	return this;
};
panelCreater.prototype.delete=function()
{
	this.parent.innerHTML=this.template.replaceAll(info);
	this.parent.displayTrigger('hidde');
	this.state='hidde';
	return this;
};
panelCreater.prototype.repaint=function(info)
{
	this.parent.innerHTML=this.template.replaceAll(info);
	this.parent.displayTrigger('show');
	this.state='show';
	return this;
};
//atribute
panelCreater.prototype.state;
panelCreater.prototype.hash;
panelCreater.prototype.start;
panelCreater.prototype.end;
panelCreater.prototype.template;
panelCreater.prototype.parent;