/***********************************************
	Function:	Event Manager
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/
// Handels window resizing at the moment

function EventManager(type)
{
	this.type = type;
	this.init();
}

EventManager.prototype.getDimensions = function(type, callback)
{
    $('#wrapAssets').css('height', window.innerHeight - ($('header').height()+60) + 'px');  // removed $('#wrapSearch').height()*3)
    $('main').css('height', window.innerHeight - ($('header').height()+10) + 'px');
    callback('resize');
};

EventManager.prototype.windowResize = function()
{
	var rtime, timeout, delta, _this, canvasInit, cropMarksInit;
	
	_this = this;
	rtime = new Date(1, 1, 2000, 12, 0, 0);
	timeout = false;
	delta = 200;
	
	$(window).resize(function()
	{
		$('#canvas-loader').css('display','block');
		rtime = new Date();
		
		if (timeout === false)
		{
			timeout = true;
			setTimeout(resizeend, delta);
		}
	});
	
	function resizeend()
	{
		_this.getDimensions('getDimensions', function(data)
		{
			canvasInit = new CanvasSetup(data, function()
			{
				insertJSON = new InsertJSON('standard', function()
				{
					$('#canvas-loader').fadeOut(800);
					if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
				});
			});				
		});

		if (new Date() - rtime < delta)
		{
			setTimeout(resizeend, delta);
		} 
		else
		{
			timeout = false;		
		}               
	}		
};

EventManager.prototype.init = function()
{
	if(this.type == 'windowResize')
	{
		this.windowResize();
	}	
	// console.log('event manager started');
}
