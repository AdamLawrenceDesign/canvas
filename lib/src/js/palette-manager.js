/***********************************************
	Function:	Palette Controls
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function Palette(activeObj, colours)
{
	this.activeObj = activeObj;
	this.colours = colours;
	this.init();
}

Palette.prototype.paletteCreateColours = function()
{
	var colours;
	colours = eval(this.colours);

	for(var i = 0; i < colours.length; i++)
	{
		var wrap, block;
		wrap = document.createElement('li');			
		block = document.createElement("span");
		$(wrap).attr('id', colours[i]);
		$(block).css('background' , 'rgb' + colours[i]);
		
		if(i==0)
		{
			$(wrap).addClass('selected')
		};
		
		$(wrap).append(block);
		$('#colourContainer').append(wrap);
	}
};

Palette.prototype.paletteControllers = function()
{
	var _this,
	_this = this;
	
	$('#trash').on('click', function()
	{
		pages[currentPageRef].fabric.remove(_this.activeObj);
		_this.hideSubMenus();
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#grow').on('click', function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.height = _this.activeObj.height * 1.06;
		_this.activeObj.width = _this.activeObj.width * 1.06;
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#shrink').on('click',function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.height = _this.activeObj.height * 0.94;
		_this.activeObj.width = _this.activeObj.width * 0.94;
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#back').on('click', function()			/*========== Check export ============*/
	{
		pages[currentPageRef].fabric.sendBackwards(_this.activeObj);
		if(_this.activeObj == pages[currentPageRef].fabric.item(0))
		{
			pages[currentPageRef].fabric.bringForward(_this.activeObj);
		}
	});
	
	$('#forward').on('click', function()
	{
		if(!_this.activeObj) return;
		pages[currentPageRef].fabric.bringForward(_this.activeObj);
	});
	
	$('#palette li a').on('click', function()
	{
		var target;
		target = $(this).next('ul');
		target.toggle();
	});	
	
	$('#opacity').on('change', function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.opacity = $(this).val()*.01;
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#greyscale').on('click', function()
	{
		var filter, check;
		
		filter = new fabric.Image.filters.Grayscale();
		check = true;

		_this.activeObj.filters.push(new fabric.Image.filters.Grayscale());
		_this.activeObj.applyFilters(pages[currentPageRef].fabric.renderAll.bind(pages[currentPageRef].fabric));
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#imageColour').on('click', function()
	{
		var filter, check;
		
		filter = new fabric.Image.filters.Grayscale();
		check = true;

		_this.activeObj.filters = [];
		_this.activeObj.applyFilters();
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#colourContainer').on('click','li', function()
	{
		var colour = 'rgb' + $(this).attr('id');
		_this.activeObj.fill = colour;
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#alignLeft').on('click', function()
	{
		_this.activeObj.textAlign = 'left';
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#alignCenter').on('click', function()
	{
		_this.activeObj.textAlign = 'center';
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#alignRight').on('click', function()
	{
		_this.activeObj.textAlign = 'right';
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#fontSize').on('change', function()
	{
		if(!_this.activeObj) return;
		var value = _this.activeObj.fontSize;
		_this.activeObj.fontSize = $(this).val();
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#lineHeight').on('change', function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.lineHeight = $(this).val();
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#fontFamily').on('change',function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.fontFamily = $(this).val();
		pages[currentPageRef].fabric.renderAll();
	});
};

Palette.prototype.isRealValue = function(activeObj)
{
	return activeObj && activeObj !== "null" && activeObj!== "undefined";
};		

Palette.prototype.initPalette = function(type)
{
	var _this;
	_this = this;
	
	switch(type)
	{
		case 'image':
			_this.paletteType('image');
			_this.show();
			break;
		case 'i-text':
			_this.paletteType('i-text');
			_this.show();
			break;
		case 'rect':
			_this.paletteType('solid');	
			_this.show();
			break;	
		case 'solid':
			_this.paletteType('solid');	
			_this.show();	
			break;
		case 'circle':
			_this.paletteType('solid');		
			_this.show();
			break;		
		case '':
			_this.hide();
			_this.activeObj = false;
			break;
	};
};

Palette.prototype.show = function()
{
	$('#palette').removeClass('hide-scale');
};

Palette.prototype.hide = function()
{
	$('#palette').addClass('hide-scale');
};

Palette.prototype.modified = function()
{
	var _this = this;

	pages[currentPageRef].fabric.on('object:added', function(event)
	{
		_this.activeObj = event.target;
		pages[currentPageRef].fabric.renderAll();
		_this.initPalette(_this.activeObj.get('type'));
	});
	
	pages[currentPageRef].fabric.on('object:modified', function(event)
	{
		_this.activeObj = event.target;
		_this.hideSubMenus();
	});
	
	pages[currentPageRef].fabric.on('object:moving', function(event)
	{
		_this.hideSubMenus();
	});
	
	pages[currentPageRef].fabric.on('object:selected', function(event)
	{
		_this.activeObj = event.target;
		pages[currentPageRef].fabric.renderAll();
		_this.hideSubMenus();
		console.log(event.target.get('type'));
		_this.initPalette(_this.activeObj.get('type'));
	});
	
	pages[currentPageRef].fabric.on('object:removed' , function(event)
	{
		_this.activeObj = false;
		_this.hide();
	});

	pages[currentPageRef].fabric.on('selection:cleared', function(event)
	{
		_this.activeObj = false;
		_this.hide();
	});
	
	pages[currentPageRef].fabric.on('selection:created', function(event)
	{
		_this.activeObj = event.target;
		_this.initPalette(_this.activeObj.get('type'));
		_this.show();
	});
};

Palette.prototype.hideSubMenus = function()
{
	$('#palette li ul').css('display','none');
};

Palette.prototype.paletteType = function(type)
{
	var wrap, children, textObjs, imageObjs, solidObjs;
	
	wrap = $('#palette');
	children = $('#palette li');
	childrenChildren = $('#palette li ul li');
	textObjs = ['textStyle','colourPalette', 'back', 'forward', 'trash'];
	imageObjs = ['filter','back', 'forward', 'grow', 'shrink', 'trash'];
	solidObjs = ['filter','colourPalette','back', 'forward', 'grow', 'shrink', 'trash'];

	switch(type)
	{
		case 'i-text':
			children.addClass('hidden');
			childrenChildren.removeClass('hidden');
			for(var i= 0; i < textObjs.length; i++)
			{
				var obj = document.getElementById(textObjs[i]);
				$(obj).removeClass('hidden');
			};
			break;	
		
		case 'image':
			children.addClass('hidden');
			childrenChildren.removeClass('hidden');
			for(var i= 0; i < imageObjs.length; i++)
			{
				var obj = document.getElementById(imageObjs[i]);
				$(obj).removeClass('hidden');
			};
			break;
			
		case 'solid':	
			children.addClass('hidden');
			childrenChildren.removeClass('hidden');
			for(var i= 0; i < solidObjs.length; i++)
			{
				var obj = document.getElementById(solidObjs[i]);
				$(obj).removeClass('hidden');
				console.log('catch solid')
			};
			break;	
	}
};

Palette.prototype.initKeyboard = function()
{
	var _this = this;
	
	var zoomBy = function(x, y, z) 
	{
		var activeObject = _this.activeObj;
		if (activeObject)
		{
			activeObject.zoomBy(x, y, z, function(){pages[currentPageRef].fabric.renderAll()});
		}
	};
	
	var objManip = function(prop, value) 
	{
		var obj = _this.activeObj;
		if (!obj) { return true; }
		
		switch(prop)
		{
			case 'zoomBy-x':
				obj.zoomBy(value, 0, 0, function(){pages[currentPageRef].fabric.renderAll()});
				break;
			case 'zoomBy-y':
				obj.zoomBy(0, value, 0, function(){pages[currentPageRef].fabric.renderAll()});
				break;
			case 'zoomBy-z':
				obj.zoomBy(0, 0, value, function(){pages[currentPageRef].fabric.renderAll()});
				break;
			default:
				obj.set(prop, obj.get(prop) + value);
				break;
		}

		if ('left' === prop || 'top' === prop) 
		{ 
			obj.setCoords(); 
		}
		
		pages[currentPageRef].fabric.renderAll();
		return false;
	};
	
	document.onkeydown = function(event)
	{
		var key = window.event ? window.event.keyCode : event.keyCode;
		switch(key) 
		{
			case 37: // left
				if (event.shiftKey) {
					return objManip('zoomBy-x',-1); return false;
				}
				if (event.ctrlKey || event.metaKey) {
					return objManip('angle', -1);
				}
				return objManip('left', -1);
			case 39: // right
				if (event.shiftKey) {
					return objManip('zoomBy-x',1); return false;
				}
				if (event.ctrlKey || event.metaKey) {
					return objManip('angle', 1);
				}
				return objManip('left', 1);
			case 38: // up
				if (event.shiftKey) {
					return objManip('zoomBy-y', -1);
				}
				if (!event.ctrlKey && !event.metaKey) {
					return objManip('top', -1);
				}
				return true;
			case 40: // down
				if (event.shiftKey) {
					return objManip('zoomBy-y', 1);
				}
				if (!event.ctrlKey && !event.metaKey) {
					return objManip('top', 1);
				}
				return true;
			case 46 :
				 var activeObject = pages[currentPageRef].fabric.getActiveObject();
				 pages[currentPageRef].fabric.remove(activeObject);
				 _this.hideSubMenus();
				 return true;
		}
	};
};

Palette.prototype.init = function()
{
	var _this = this;
	this.hide();
	this.paletteCreateColours();
	this.hideSubMenus();
	this.paletteControllers();
	this.initKeyboard();

	$(document).mousedown(function()
	{		
		_this.modified();		
	});
	
	pages[currentPageRef].fabric.on('object:added', function(event)
	{
		pages[currentPageRef].fabric.renderAll();
	});

	setTimeout(function()
	{
		$('#palette').removeClass('hidden');
	},400);
};