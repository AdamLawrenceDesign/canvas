/***********************************************
	Function:	load Assets
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function RotateCanvas(type, callback)
{
	this.type = type;
	this.callback = callback;
	this.init();
}

RotateCanvas.prototype.makePortrait = function()
{
	console.log('Width: ', pages[currentPageRef].jsonObj[0].width, 'height: ', pages[currentPageRef].jsonObj[0].height);
	pages[currentPageRef].jsonObj[0].width = pages[currentPageRef].portrait.width;
	pages[currentPageRef].jsonObj[0].height = pages[currentPageRef].portrait.height;	
};

RotateCanvas.prototype.makeLandscape = function()
{
	console.log('Width: ', pages[currentPageRef].jsonObj[0].width, 'height: ', pages[currentPageRef].jsonObj[0].height);
	pages[currentPageRef].jsonObj[0].width = pages[currentPageRef].portrait.width;
	pages[currentPageRef].jsonObj[0].height = pages[currentPageRef].portrait.height;		
};

RotateCanvas.prototype.init = function()
{
	var ref, _this;
	_this = this;

	console.log('click')

	$('#orientationLinks').on('click', 'a', function()
	{
		ref = $(this).attr('id');

		console.log('click')

		if(ref != pages[currentPageRef].orientation)
		{
			if(pages[currentPageRef].orientation == 'landscape') 
			{
				// CHANGE PAGE TO PORTRAIT ORIENTATION
				pages[currentPageRef].orientation = 'portrait';
				_this.makePortrait();
			}
			else 
			{
				// CHANGE TO LANDSCAPE 
				pages[currentPageRef].orientation = 'landscape';
				_this.makeLandscape();
				console.log('Width: ', pages[currentPageRef].jsonObj[0].width, 'height: ', pages[currentPageRef].jsonObj[0].height)
			}
			_this.callback();
		} else {
			//_this.callback()
		}
	});
};
