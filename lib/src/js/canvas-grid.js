/***********************************************	
	Function:	Canvas Grid
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au	
*************************************************/

function CanvasGrid(type, callback)
{
	this.type = type;
	this.callback = callback;
	this.init();
}

CanvasGrid.prototype.build = function(id, cssClass, cssProp)
{
	var div;
	div = document.createElement('div');
	$(div).attr('id', id).addClass(cssClass).css(cssProp); 	
	$('#grid').append(div);
};

CanvasGrid.prototype.cropMarksInit = function()
{
	var svg = document.createElement('img');
	$(svg).attr('src', 'http://www.advancedimage.com.au/CreateJS/CanvasOverlay/' + productData.id + '-' + pages[currentPageRef].orientation + '.svg').css({'width':'100%', 'height': '100%', 'top': '0', 'left': '0' });
	$('#grid').append(svg);

	// NEED TO ADD A TRY VALIDATION ON THIS AS SOMETHING A PATH WONT EXIST IF A NEW PRODUCT IS ADDED WITHOUT AN OVERLAY

};

CanvasGrid.prototype.init = function()
{
	$('#grid').empty();
	
	switch(this.type)
	{
		case 'cropMarks':
			this.cropMarksInit();
		break;
	}
};

/************************************

// FOUR BLOCK ABANDONED BECAUSE OF PIXEL ROUNDING

var left, top, right, bottom, yHeight, xWidth, page;

page = pages[0];

if(page.orientation == 'landscape')
{
	yHeight = page.canvas.height * cropMarks[0].landscape.yRatio;
	xWidth = page.canvas.width * cropMarks[0].landscape.xRatio;
} else {
	yHeight = page.canvas.height * cropMarks[0].portrait.yRatio;
	xWidth = page.canvas.width * cropMarks[0].portrait.xRatio;
}

if(page.orientation == 'landscape')
{
	yHeight = (page.canvas.height - (page.canvas.height * cropMarks[0].landscape.yRatio))/2;
	xWidth = (page.canvas.width - (page.canvas.width * cropMarks[0].landscape.xRatio))/2;
} else {
	yHeight = (page.canvas.height - (page.canvas.height * cropMarks[0].portrait.yRatio))/2;
	xWidth = (page.canvas.width - (page.canvas.width * cropMarks[0].portrait.xRatio))/2;
}

this.build(top, 'cropArea', {'bottom':'auto','height': yHeight + 'px','width': page.canvas.width - (xWidth*2), 'left': (xWidth/2)-2 + 'px' });
this.build(right, 'cropArea', {'left':'auto','width': xWidth + 'px','height':'100%'});
this.build(bottom, 'cropArea', {'top':'auto','height': yHeight + 'px','width':'100%'});
this.build(left, 'cropArea', {'right':'auto','width': xWidth + 'px','height':'100%'});		

*/