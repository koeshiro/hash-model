function loaded(f)
{
	if("onload" in document)
	{
		var t=this;
		document.addEventListener('DOMContentLoaded',function(){t.execute();});
	}
	if(f){this.add(f);}
}
loaded.prototype.execute=function ()
{
	i=0;
	while(i<this.fun.length)
	{
		this.fun[i]();
		i++;
	}
}
loaded.prototype.fun=[];
loaded.prototype.add=function (f)
{
	var a=this.fun; a.push(f); this.fun=a;
}