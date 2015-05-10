/***********************************************
	Function:	Product Controls
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function listGrid(obj)
{
	var container = document.querySelector(obj);
    var masonry = new Masonry(container, 
	{
        columnWidth: 3,
        itemSelector: '.grid'
    });
};

function buildTextTheme(wrap, theme)
{
	$(wrap).empty();
	if(theme[0].background == 'dark')
	{
		$(wrap).parent('div').css('background','#333');
	}
	else
	{
		$(wrap).parent('div').css('background','#fafafa')
	};
	
	for(var i = 0; i < theme.length; i++)
	{
		var el = document.createElement('li'),
			span = document.createElement('span');
		$(el).attr('data-lookup',i)	
		$(span).html(theme[i].displayText)
			.css({
					'font-size' : theme[i].size, 
					'font-family' : theme[i].style,
					'line-height' : theme[i].lineHeight,
					'font-weight' : theme[i].weight,
					'color' : theme[i].fill,
					'width':'auto',
					'text-shadow': 'none'
				});
		$(el).append(span);		
		$(wrap).append(el);
	};
};

function addIText(value, theme, lookUp)
{	
	canvas.deactivateAll();
	var text = new fabric.IText(value, {					
					fontFamily: theme[lookUp].style,
					originX:'center',									
					originY:'center',	
					left: $('canvas').width()/2,			
					top: $('canvas').height()/2,
					fill: theme[lookUp].fill,
					fontSize: theme[lookUp].size, 
					lineHeight: theme[lookUp].lineHeight,
					scaleX:1,
					scaleY:1,
					active: true
				});	
	canvas.add(text);
	$('#fontFamily').val(text.fontFamily);
	canvas.renderAll();
};

/***********************************************/

function AssetManager(website, user, productData, images, textThemes, jsonObjs)	
{
	this.website = website;
	this.user = user;
	this.productData = productData;
	this.images = images;
	this.textThemes = textThemes;
	this.jsonObjs = jsonObjs;
	this.init();
}

AssetManager.prototype.deactivateAll = function(type, callback)
{
	$.each(pages, function()
	{
		this.fabric.deactivateAll().renderAll();
	});
	callback();
};

AssetManager.prototype.addImage = function(path, width, height, left, top)
{
	// pages[currentPageRef].fabric.deactivateAll().renderAll();
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
		pages[currentPageRef].fabric.setActiveObject;
		// console.log(currentPageRef);
	});
};

AssetManager.prototype.productInfo = function()
{
	var _this, wrap;
	_this = this;

	wrap = $('#productInformation');
	wrap.find('.description').html(_this.productData.description);
	wrap.find('.itemName').html(_this.productData.itemName);
	wrap.find('.price').html('$ ' + _this.productData.unitPrice);
	wrap.find('.productImage').attr('src','assets/img/products/' + _this.productData.id + '.jpg');
	$('.productLabel').html(_this.productData.description);
};

AssetManager.prototype.assetsThemes = function()
{
	var _this, string;
	_this = this;
	
	if(this.themes == '')
	{
		$('.themesObj, #assetsThemes').css('display','none');
		return;
	}

	// var showThemes = new ListBuilder('listThemes', this.themes.Themes, true)
};

AssetManager.prototype.assetsImages = function()
{
	var	mouseEndX, mouseEndY, width, height, elementOffset, helper, offsetY, offsetX, classes, pageX, pageY;
	pageX = window.pageXOffset;
	pageY = window.pageYOffset;
	_this = this;
	
	var addImages = new ListBuilder('listImages', this.images, true);
	
	var drag = $('#listImages a img').draggable(
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
			$(this).hide();
			elementOffset = $(this).parents().eq(1).offset();
			relativeMouseStart = {
						left: event.pageX - elementOffset.left,	 
						top: event.pageY - elementOffset.top   
					};
		},
		stop : function(event, ui)
		{
			$(this).show();
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
				// _this.controls.initKeyboard();
			}		
		},
		revert : true,
		revertDuration: 0,
		scroll: false,
	});

	$('#listImages').on('click', 'a', function()
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

AssetManager.prototype.assetsText = function()
{
	var wrap, theme, sampleUI, themeLength, count;
	
	wrap = '#addText';
	theme = this.textThemes[0];
	sampleUI = this;
	themeLength = theme.length;
	count = 0;
		
	buildTextTheme(wrap,theme);
	
	var showTextThemes = new ListBuilder('listTextThemes', this.textThemes, true)

	$('#assetsText').on('click', '#changeTextTheme', function()
	{
		count = count+1;
		if(count == themeLength)	
		{ 
			count = 0;
		}
		theme = _this.product.TextThemes[count]; 
		buildTextTheme(wrap, theme);
	});
	
	$('#addText').on('click', 'li', function()
	{
		var lookUp, value;
		lookUp = $(this).attr('data-lookup');
		value = theme[lookUp].text;
		addIText(value, theme, lookUp);
	});
	
	$('#listTextThemes').on('click','a', function()
	{
		var lookUp = $(this).attr('data-lookUp');
		sampleUI.preBuiltText(lookUp);				
	});
};

AssetManager.prototype.preBuiltText = function(lookUp)
{
	var textObj, group;
	
	group = [];
	textObj = this.product.TextObjects[lookUp].JSON.replace('{"objects":[','').replace('],"background":"#fafafa"}','');
	textObj = eval('[' + textObj + ']');	
	
	for(var i = 0; i < textObj.length; i++)
	{
		var attr = {
					originX: textObj[i].originX,
					originY: textObj[i].originY,
					left:	textObj[i].left,
					top:	textObj[i].top,
					width:	textObj[i].width,
					height:	textObj[i].height,
					fill:	textObj[i].fill,
					stroke:	textObj[i].stroke,
					strokeWidth: textObj[i].strokeWidth,
					strokeDashArray: textObj[i].strokeDashArray,
					strokeLineCap: textObj[i].strokeLineCap,
					strokeLineJoin: textObj[i].strokeLineJoin,
					strokeMiterLimit: textObj[i].strokeMiterLimit,
					scaleX: textObj[i].scaleX,
					scaleY:	textObj[i].scaleY,
					angle: textObj[i].angle,
					flipX: textObj[i].flipX,
					flipY: textObj[i].flipY,
					opacity: textObj[i].opacity,
					shadow: textObj[i].shadow,
					visible: textObj[i].visible,
					clipTo: textObj[i].clipTo,
					backgroundColor: textObj[i].backgroundColor,
					fillRule: textObj[i].fillRule,
					globalCompositeOperation: textObj[i].globalCompositeOperation,
					rx: textObj[i].rx,
					ry: textObj[i].ry,
					radius: textObj[i].radius,
					radius: textObj[i].radius
				};
		
		switch(textObj[i].type)
		{
			case 'rect':
				var obj = new fabric.Rect(attr);
				break;
			case 'i-text':
				var obj = new fabric.IText(textObj[i].text, attr);
				break;
			case 'circle':
				var obj = new fabric.Circle(attr);
				break;
			case 'triangle':
				var obj = new fabric.Triangle(attr);
				break;
		}
		canvas.add(obj);
		canvas.renderAll();
	};	
};

AssetManager.prototype.init = function()
{
	console.log('Image object shipped to the image manager: ', this.images);
	this.productInfo();
	this.assetsThemes();
	this.assetsImages();
	this.assetsText();
	var addScroll = new ScrollManager('wrapAssets','div');
};
