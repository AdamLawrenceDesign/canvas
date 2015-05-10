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

RotateCanvas.prototype.init = function()
{
	var ref, _this;

	_this = this;

	$('#orientationLinks').on('click', 'a', function()
	{
		ref = $(this).attr('id');

		if(ref != pages[currentPageRef].orientation)
		{
			if(pages[currentPageRef].orientation == 'landscape') 
			{
				pages[currentPageRef].orientation = 'portrait';
			}
			else 
			{
				pages[currentPageRef].orientation = 'landscape';
			}
			_this.callback();
		} else {
			_this.callback()
		}
	});
}
