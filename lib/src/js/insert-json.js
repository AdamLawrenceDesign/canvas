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

InsertJSON.prototype.insert = function()
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

InsertJSON.prototype.removeItems = function()
{
	// CONTROL FOR REMOVING ITEMS

	$.each(pages, function(index)
	{
		var pageRef = index;
		var indexForDelete = [];

		$.each(this.jsonObj, function(index)
		{
			// console.log('page reference', pageRef, 'Also this:', this);
			// console.log(' property of height: ', pages[pageRef].jsonObj[0].height);
			
			if((this.left - (this.width/2)) > pages[pageRef].jsonObj[index].width)
			{
				indexForDelete.push(index);
				console.log('Index: ', index, 'item remove', this.left, 'placeholder width: ', pages[pageRef].jsonObj[0].width);
				// return false;
			} else if ((this.top - (this.height/2)) > pages[pageRef].jsonObj[0].height){
				console.log('Index: ', index, 'item remove', this.top, 'placeholder width: ', pages[pageRef].jsonObj[0].height);
				indexForDelete.push(index);
				// return false;		
			} else if((this.left+(this.width/2)) < -1) {
				indexForDelete.push(index);
				console.log('Index: ', index, 'item left', this.left, ' width: ', this.width);
				// return false;	
			} else if((this.top + (this.height/2)) < -1) {
				indexForDelete.push(index);
				console.log('Index: ', index, 'item top', this.top, ' width: ', this.height);
				// return false;			
			};					
			
		});

		// console.log('items marked for delete: ', indexForDelete)
		// pages[pageRef].jsonObj.splice(index, 1);

		/*
	    If MyX(k) > DstW Then flag = False
	    If MyY(k) > DstH Then flag = False
	    If MyX(k) + MyWdth(k) < 0 Then flag = False
	    If MyY(k) + MyHght(k) < 0 Then flag = False

		If the canvas-object-left is greater than the canvas width then remove item
		If the canvas-object-top is greater than the canvas height then remove item
		If the canvas-object-left+ canvas-object-width is less than zero then remove item
		If the canvas-object-top+canvas-object-height is less than zero then remove item
		*/
		// console.log('All items should have been removed');
	})
	// console.log('Insert Json onto canvas');
	this.insert();
}

InsertJSON.prototype.init = function()
{
	this.removeItems();
};
