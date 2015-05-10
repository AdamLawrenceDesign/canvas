/***********************************************
	Function:	Insert JSON
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function InsertJSON(type, callback)
{
	this.type = type;
	this.callback = callback;
	this.init();
}

InsertJSON.prototype.init = function()
{
	var _this = this;

	$.each(pages, function(index, value)
	{
		this.fabric.loadFromJSON('{"objects":' + JSON.stringify(this.jsonObj) + ',"background":"#fff"}');
		this.fabric.json = '{"objects":' + JSON.stringify(this.jsonObj) + ',"background":"#fff"}';
		this.fabric.renderAll();
	});

	this.callback();
};
