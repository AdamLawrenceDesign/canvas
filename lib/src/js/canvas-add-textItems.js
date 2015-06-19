/***********************************************
	Function:	Add Text Items
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function AddTextItems()	
{
	this.textThemes = [
					// white seaside
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'seasideresortnfregular', size : 39.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'playfair_displayregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'caviar_dreamsregular', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// dark seaside
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'seasideresortnfregular', size : 39.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(255,255,255)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'playfair_displayregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'caviar_dreamsregular', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(255,255,255)'},
					],	
					// white CHUNK FIVE
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'chunkfiveroman', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'alluraregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'playfair_displayregular', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// dark chunk
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'chunkfiveroman', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(255,255,255)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'alluraregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'playfair_displayregular', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(255,255,255)'},
					],
					// white COMIC
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'comic_zine_otregular', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'amatic_scregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'quicksandbold', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// dark COMIC
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'comic_zine_otregular', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(255,255,255)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'amatic_scregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'quicksandbold', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(255,255,255)'},
					],		
					// rgb(41,47,51)
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 300, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(163,172,178)'},
					],					
					// #333			
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(255,255,255)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'Arial, Helvetica, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill:  'rgb(255,255,255)'},
					],		
					// #333		
					/*	
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : '', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : '', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : '', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],	
					// rgb(41,47,51)				
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : '', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : '', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : '', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// #333
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 300, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(163,172,178)'},
					],					
					// rgb(41,47,51)				
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'Georgia, serif', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// #333
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 300, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(163,172,178)'},
					],
					*/
				];

	this.jsonObjs = [
					{'ID':'TextObject1','Name':'TextObject1','Path':'assets/img/sampleText/1.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":228.81,"top":151.03,"width":120,"height":120,"fill":"rgb(31,73,125)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2,"scaleY":2,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0}],"background":"#fafafa"}'},
					{'ID':'TextObject2','Name':'TextObject1','Path':'assets/img/sampleText/2.jpg','JSON':'{"objects":[{"type":"circle","originX":"center","originY":"center","left":111.92,"top":102.08,"width":60,"height":60,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.08,"scaleY":3.08,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","radius":30,"startAngle":0,"endAngle":6.283185307179586}],"background":"#fafafa"}'},
					{'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/3.jpg','JSON':'{"objects":[{"type":"triangle","originX":"center","originY":"center","left":200,"top":200,"width":120,"height":120,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2,"scaleY":2,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'},
					{'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/4.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":114.17,"top":149.08,"width":120,"height":120,"fill":"rgb(155,187,87)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.95,"scaleY":2.51,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0}],"background":"#fafafa"}'}
					];
	this.init();
}

AddTextItems.prototype.deactivateAll = function(type, callback)
{
	$.each(pages, function()
	{
		this.fabric.deactivateAll().renderAll();
	});
	callback();
};

AddTextItems.prototype.addIText = function(value, theme, lookUp)
{
	this.deactivateAll('addIText', function()
	{
		var text = new fabric.IText(value, {					
						fontFamily: theme[lookUp].style,
						originX:'center',									
						originY:'center',	
						left: $('#canvas-' + currentPageRef).width()/2,			
						top: $('#canvas-' + currentPageRef).height()/2,
						fill: theme[lookUp].fill,
						fontSize: (theme[lookUp].size)*1.2, 
						lineHeight: (theme[lookUp].lineHeight)*1.2,
						scaleX:1,
						scaleY:1,
						active: true
					});	

		pages[currentPageRef].fabric.add(text);
		$('#fontFamily').val(text.fontFamily);
		pages[currentPageRef].fabric.renderAll();
	});
};

AddTextItems.prototype.assetsThemes = function()
{
	var _this, string;
	_this = this;
	
	if(this.themes == '')
	{
		$('.themesObj, #assetsThemes').css('display','none');
		return;
	}
};

AddTextItems.prototype.buildTextHTML = function(wrap, theme, callback)
{
	$(wrap).css('height',$(wrap).outerHeight() + 'px')

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

	if(callback) callback();
};

AddTextItems.prototype.buildTextJSON = function(lookUp)
{
	var textObj, group;
	
	group = [];
	// WHY WOULD I MAKE THIS #FAFAFA ???? BUT IT IS
	textObj = JSON.parse(this.jsonObjs[lookUp].JSON.replace('{"objects":','').replace(',"background":"#fafafa"}',''));
	
	console.log(textObj)

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
		pages[currentPageRef].fabric.add(obj);
		pages[currentPageRef].fabric.renderAll();
	};	
};

AddTextItems.prototype.textControls = function()
{
	var wrap, theme, sampleUI, themeLength, count, _this;
	
	_this = this;
	wrap = '#addText';
	theme = this.textThemes[0];
	// theme = this.textThemes;
	sampleUI = this;
	themeLength = theme.length;
	count = 0;
		
	this.buildTextHTML(wrap,theme, false);

	$('#assetsText').on('click', '#changeTextTheme', function()
	{
		$('#assetsText').find('.loading').fadeIn(400, function()
		{
			count = count+1;
			if(count == _this.textThemes.length)	
			{ 
				count = 0;
			}
			theme = _this.textThemes[count]; 
			_this.buildTextHTML(wrap, theme, function()
				{
					$('#assetsText').find('.loading').fadeOut(400)
				});
		})

	});
	
	$('#addText').on('click', 'li', function()
	{
		var lookUp, value;
		lookUp = $(this).attr('data-lookup');
		value = theme[lookUp].text;
		_this.addIText(value, theme, lookUp);
	});
	
	$('#listTextThemes').on('click','a', function()
	{
		console.log(this)
		var lookUp = $(this).attr('data-lookUp');
		sampleUI.buildTextJSON(lookUp);				
	});
};

AddTextItems.prototype.init = function()
{
	// console.log('Image object shipped to the image manager: ', this.images);
	this.assetsThemes();
	this.textControls();
};
