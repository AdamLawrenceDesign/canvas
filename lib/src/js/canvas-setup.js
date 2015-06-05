/***********************************************
	Function:	Canvas Setup
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function CanvasSetup(type, callback)
{
	this.type = type;
	this.callback = callback;
	this.init();
}

CanvasSetup.prototype.setWrapper = function()
{
    $('#wrapAssets').css('height', window.innerHeight - ($('header').height()+60) + 'px');
    $('main').css('height', window.innerHeight - ($('header').height()+10) + 'px');
    $('aside').css('height', window.innerHeight - ($('header').height()) + 'px');
};

CanvasSetup.prototype.setJsonDimensions = function(width)
{
	var ratio;

	ratio = width / pages[0].jsonObj[0].width;
	
	$.each(pages, function()
	{
		$.each(this.jsonObj, function(index, value)
		{
			if(index == 0) this.selectable = false;

			this.width = this.width*ratio;
			this.height = this.height*ratio;
			this.left = this.left*ratio;
			this.top = this.top*ratio;

			switch(this.type)
			{
				case 'i-text':
					this.fontSize = this.fontSize*ratio;
					break;
				case 'circle':
					this.radius = this.radius*ratio;
					break;
			}
			// console.log('Show the updated width: ', this.width)
		});
	});

	this.callback();
};

CanvasSetup.prototype.setDimensions = function()
{
	var width, height;
	// SET THE DIMENSIONS OF THE CANVAS
	$.each(pages, function(index, value)
	{
		// CHECK IF LANDSCAPE 
		if(this.orientation == 'landscape')
		{
			var lengthRatio;

			if($('main').innerHeight()/$('main').innerWidth() < 0.7)
			{
				lengthRatio = 0.56;
			} else 
			{
				lengthRatio = 0.72;
			} 

			width = $('main').innerWidth()*lengthRatio;									
			height = width * this.landscape.ratio;
			
			// console.log('Show the ration of this landscape frame: ', $('main').innerHeight()/$('main').innerWidth());
			
			this.fabric.setWidth(width);
			this.fabric.setHeight(height);
			this.canvas.width = width;
			this.canvas.height = height;
			$('#grid').css({'height': height + 'px', 'width': width + 'px'})
			
		} else {
			// PORTRAIT APPLY THESE RULES
			if($('main').innerWidth()/$('main').innerHeight() > 0.9)
			{
				lengthRatio = 0.85;
			} else 
			{
				lengthRatio = 0.55;
			} 		

			// console.log('The ratio is: ', $('main').innerWidth()/$('main').innerHeight());

			height = $('main').innerHeight()*lengthRatio;		// 0.85							
			width = height * this.portrait.ratio;
			this.fabric.setWidth(width);
			this.fabric.setHeight(height);
			this.canvas.width = width;
			this.canvas.height = height;
			$('#grid').css({'height': height + 'px', 'width': width + 'px'})
		};
	});

	this.setJsonDimensions(width);
};

CanvasSetup.prototype.init = function()
{
	if(this.type == 'new')
	{
		for(var i = 0; i < pages.length; i++)
		{
			var id = 'canvas-' + i;

			pages[i].fabric = new fabric.Canvas(id,
			{
				backgroundColor:'#fff',
				selection: false,
			});	
		};
		$('.canvas-container').css({'position':'absolute','bottom': '2em'});
		this.setDimensions();
	} else {
		
		// THIS SHOULD BE IMPLEMENTED IF WINDOW RESIZED
		$.each(pages, function(index, value)
		{
			this.canvas.width = 0;
			this.canvas.height = 0;
		});

		this.setDimensions();
	};
};
