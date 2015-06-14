/***********************************************
	Function:	Add Images
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function AddImages(type)	
{
	this.type = type;
	this.init();
}

AddImages.prototype.deactivateAll = function(type, callback)
{
	$.each(pages, function()
	{
		this.fabric.deactivateAll().renderAll();
	});
	callback();
};

AddImages.prototype.addImage = function(path, width, height, left, top)
{
	this.deactivateAll('addImage', function()
	{
		fabric.Image.fromURL(path, function(img)
		{
			img.originX = 'center';
			img.originY = 'center';
			img.left = left;
			img.top = top;
			img.width = width;
			img.height = height;
			img.active = true;
			pages[currentPageRef].fabric.add(img);
		});
	});
};

AddImages.prototype.clickAdd = function()
{
	var _this = this;

	$('#listImages, #uploadedImages, #stockImages').on('click', 'a', function()
	{
		var width, height,lookUp;
		width = $(this).find('img').width();
		height = $(this).find('img').height();
		lookUp = $(this).attr('data-lookup');	
		
		// ADD IMAGE PATH THATS NEEDED
		_this.addImage(
					$(this).find('img').attr('src'),
					// _this.images[lookUp].Path, 
					width, 
					height, 
					$('canvas').width()/2, 
					$('canvas').height()/2
				);		
	});
};

AddImages.prototype.dropAndDragStart = function()
{
	var	mouseEndX, mouseEndY, width, height, elementOffset, helper, offsetY, offsetX, classes, pageX, pageY, _this;

	pageX = window.pageXOffset;
	pageY = window.pageYOffset;
	_this = this;

	$('#listImages a img, #uploadedImages li a img, #stockImages a img').draggable(
	{
		appendTo: 'body',
		obj : this,
		helper : function(event,ui)
		{
			width = $(this).width();
			height = $(this).height();
			helper = $(this).clone();
			helper.css({'width': width + 'px', 'height': height + 'px', 'z-index': '2000'});
			return helper; 
		},
		start : function(event, ui)
		{
			// $(this).hide();
			$(this).css('opacity','0');
			elementOffset = $(this).parents().eq(1).offset();
			relativeMouseStart = {
						left: event.pageX - elementOffset.left,	 
						top: event.pageY - elementOffset.top   
					};
		},
		stop : function(event, ui)
		{
			$(this).css('opacity','1');
			helper.remove();
			var lookUp = $(this).parent().attr('data-lookup');
			mouseEndX = event.pageX;
			mouseEndY = event.pageY;

			if(
				mouseEndX > $('#canvas-' + currentPageRef).offset().left && 
				mouseEndX < ($('#canvas-' + currentPageRef).offset().left + $('#canvas-' + currentPageRef).width()) &&
				mouseEndY > $('#canvas-' + currentPageRef).offset().top &&
				mouseEndY < ($('#canvas-'+ currentPageRef).offset().top + $('#canvas-' + currentPageRef).height())
			   )
			{
				_this.addImage(
							$(this).attr('src'), 
							width, 
							height, 
							((mouseEndX-$('#canvas-'+ currentPageRef).offset().left) - relativeMouseStart.left) + (width/2), 
							((mouseEndY-$('#canvas-'+ currentPageRef).offset().top) - relativeMouseStart.top) + (height/2)
						);
			}		
		},
		revert : true,
		revertDuration: 0,
		scroll: false,
	});

};

AddImages.prototype.init = function()
{
	if(this.type == 'update')
	{
		this.dropAndDragStart();
	} else {
		this.clickAdd();
		this.dropAndDragStart();
	}
};
