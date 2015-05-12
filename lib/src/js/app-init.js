/***********************************************
	Function:	initialise app
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function AppInit(user, website, type, productId, layoutId)
{
	this.user = user;
	this.website = website;
	this.type = type;
	this.productId = productId;
	this.layoutId = layoutId;
	this.init();
}

AppInit.prototype.getImages = function()
{
	var stockImages;

	stockImages = 	[
			{'ID':'1', 'Name':'Sample1','Path':'assets/img/sampleImages/lowRes/1.jpg','HighRes':'assets/img/sampleImages/hiRes/1.jpg'},
			{'ID':'2', 'Name':'Sample2','Path':'assets/img/sampleImages/lowRes/2.jpg','HighRes':'assets/img/sampleImages/hiRes/2.jpg'},
			{'ID':'3', 'Name':'Sample3','Path':'assets/img/sampleImages/lowRes/3.jpg','HighRes':'assets/img/sampleImages/hiRes/3.jpg'},
			{'ID':'4', 'Name':'Sample4','Path':'assets/img/sampleImages/lowRes/4.jpg','HighRes':'assets/img/sampleImages/hiRes/4.jpg'},
			{'ID':'5', 'Name':'Sample5','Path':'assets/img/sampleImages/lowRes/5.jpg','HighRes':'assets/img/sampleImages/hiRes/5.jpg'},
			{'ID':'6', 'Name':'Sample6','Path':'assets/img/sampleImages/lowRes/6.jpg','HighRes':'assets/img/sampleImages/hiRes/6.jpg'},
			{'ID':'7', 'Name':'Sample7','Path':'assets/img/sampleImages/lowRes/7.jpg','HighRes':'assets/img/sampleImages/hiRes/7.jpg'},
			{'ID':'8', 'Name':'Sample8','Path':'assets/img/sampleImages/lowRes/8.jpg','HighRes':'assets/img/sampleImages/hiRes/8.jpg'},
			{'ID':'9', 'Name':'Sample9','Path':'assets/img/sampleImages/lowRes/9.jpg','HighRes':'assets/img/sampleImages/hiRes/9.jpg'},
			{'ID':'10', 'Name':'Sample10','Path':'assets/img/sampleImages/lowRes/10.jpg','HighRes':'assets/img/sampleImages/hiRes/10.jpg'},
			{'ID':'11', 'Name':'Sample11','Path':'assets/img/sampleImages/lowRes/11.jpg','HighRes':'assets/img/sampleImages/hiRes/11.jpg'},
			{'ID':'12', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/12.jpg','HighRes':'assets/img/sampleImages/hiRes/12.jpg'},
			{'ID':'13', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/13.jpg','HighRes':'assets/img/sampleImages/hiRes/13.jpg'},
			{'ID':'14', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/14.jpg','HighRes':'assets/img/sampleImages/hiRes/14.jpg'},
			{'ID':'15', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/15.jpg','HighRes':'assets/img/sampleImages/hiRes/15.jpg'},
			{'ID':'16', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/16.jpg','HighRes':'assets/img/sampleImages/hiRes/16.jpg'},
			{'ID':'17', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/17.jpg','HighRes':'assets/img/sampleImages/hiRes/17.jpg'},
			{'ID':'18', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/18.jpg','HighRes':'assets/img/sampleImages/hiRes/18.jpg'},
			{'ID':'19', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/19.jpg','HighRes':'assets/img/sampleImages/hiRes/19.jpg'},
		];	
	
	return stockImages;
};

AppInit.prototype.getTextThemes = function()
{
	var textThemes; 

	textThemes = [
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Verdana, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: '#292f33', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Georgia, serif', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: '#a3acb2'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Verdana, Geneva, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: '#292f33'},
					],
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: '#fff', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'Georgia, serif', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: '#fafafa'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill: '#fff'},
					],
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: '#292f33', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 300, fill: '#a3acb2'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: '#a3acb2'},
					],
				];

	return textThemes;
}

AppInit.prototype.getJsonObjs = function()
{
	var textObjects;

	textObjects = [
					{
						'ID':'TextObject1','Name':'TextObject1','Path':'assets/img/sampleText/1.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":228.81,"top":151.03,"width":120,"height":120,"fill":"rgb(31,73,125)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.63,"scaleY":1.12,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":225.39,"top":141.36,"width":274,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.97,"scaleY":0.97,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"SAMPLE TEXT","fontSize":40,"fontWeight":"normal","fontFamily":"Georgia, serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":226.36,"top":172.57,"width":339,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.48,"scaleY":0.48,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"New and Improved","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fafafa"}'
					},
					{
						'ID':'TextObject2','Name':'TextObject1','Path':'assets/img/sampleText/2.jpg','JSON':'{"objects":[{"type":"circle","originX":"center","originY":"center","left":111.92,"top":102.08,"width":60,"height":60,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.08,"scaleY":3.08,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","radius":30,"startAngle":0,"endAngle":6.283185307179586},{"type":"i-text","originX":"center","originY":"center","left":112.25,"top":98.02,"width":168,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Sample 2","fontSize":40,"fontWeight":"normal","fontFamily":"Arial, Helvetica, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":111.81,"top":127.41,"width":306,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.37,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"More Information","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fafafa"}'
					},
					{
						'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/3.jpg','JSON':'{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":600,"height":400,"fill":"#000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"rect","originX":"center","originY":"center","left":224.69,"top":79.4,"width":120,"height":120,"fill":"rgb(192,80,77)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.91,"scaleY":1.39,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":97.25,"top":105.02,"width":175,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Themes 3","fontSize":40,"fontWeight":"normal","fontFamily":"Arial, Helvetica, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":79.81,"top":135.19,"width":306,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.38,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"More Information","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":422.78,"top":111.89,"width":120,"height":120,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.45,"scaleY":0.12,"angle":270.46,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'
					},
					{
						'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/4.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":114.17,"top":149.08,"width":120,"height":120,"fill":"rgb(155,187,87)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.95,"scaleY":2.51,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":99.8,"top":247.74,"width":176,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.96,"scaleY":0.96,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Theme 4","fontSize":40,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":79.54,"top":276.92,"width":423,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.3,"scaleY":0.3,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"MORE INFORMATION","fontSize":40,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":19.24,"top":36.97,"width":120,"height":120,"fill":"rgbundefined","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.33,"scaleY":0.08,"angle":89.79,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'
					},
				];

	return textObjects;			
};

AppInit.prototype.asideInit = function()
{
	// TIME 
	var images, textThemes, jsonObjs, documentInit, loadAssetsInit;

	textThemes = this.getTextThemes();
	jsonObjs = this.getJsonObjs();
	images = this.getImages();

	// LOAD ASSETS INTO SIDE BAR STEP 12. 
	loadAssetsInit = new LoadAssets(this.website, this.user, productData, images, textThemes, jsonObjs, function()
	{
		// INITALISE SLIM SCROLL 	STEP 13.
		var addScroll = new ScrollManager('wrapAssets','div');
		// ADD EVENT LISTENERS SO IMAGES CAN BE ADDED TO CANVAS 	STEP 14.
		var addItemsInit = new AddItems(this.website, this.user, productData, images, textThemes, jsonObjs); 
		$('#aside-loader').fadeOut(800);
	}); 

	// START UP THE PALETTE CONTROLS  STEP 15. 
	var paletteInit = new Palette(false, "['(0,0,0)','(250,250,250)','(238,236,225)','(31,73,125)','(79,129,189)','(192,80,77)','(155,187,87)','(128,100,162)','(75,172,198)','(247,150,70)']");
	
	// ADD EXPORT LISTENERS  
	var exportInit = new ExportJson(this.type, this.website, this.user);

	// ADD LISTENER FOR ROTATION 	STEP 17.
	var rotateInit = new RotateCanvas('rotate', function()
					{	
						$('#canvas-loader').fadeIn(400, function()
						{
							canvasInit = new CanvasSetup('rotate', function()
							{
								// ADD JSON TO CANVAS TO JSON  	STEP 9. 
								insertJSON = new InsertJSON('standard', function()
								{
										
									// ADD CROP MARKS IF NEEDED STEP 10.
									if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
									// eventManagerInit = new EventManager('windowResize');
									// _this.asideInit();
									setTimeout(function()
									{
										$('#canvas-loader').fadeOut(800);
									},400);


								});
							});
						});
					});	
};

AppInit.prototype.pushProductData = function()
{
	var canvasInit, insertJSON, eventManagerInit, cropMarksInit, _this;

	_this = this;

	this.query('http://192.168.0.216/AdvAPI/api/WCAPValues/Photocreate/' + this.productId, 'GET', false, function(data)
	{
		// PARSE PRODUCT DATA TO CREATE SIDE CONTENT AND SET GRID AND CANVAS STEP 6.
		productData = {
						'costCode': data[0].costCode,
						'cropRatio': data[0].cropRatio,
						'description': data[0].description,
						'descriptionURL': data[0].descriptionURL,
						'fheightMM': data[0].fheightMM,
						'fwidthMM': data[0].fwidthMM,
						'groupName': data[0].groupName,
						'heightMM': data[0].heightMM,
						'id': data[0].id,
						'itemName': data[0].itemName,
						'maxQuantity': data[0].maxQuantity,
						'numberOfPages': data[0].numberOfPages,
						'pcCode': data[0].numberOfPages,
						'postage': data[0].postage,
						'price': data[0].price,
						'unitPrice': data[0].unitPrice,
						'widthMM': data[0].widthMM,
					};

		// PRODUCT DATA HAS BEEN UPDATED 
		// INITALIZE CROP MARKS	STEP 7.
		if(productData.widthMM != productData.fwidthMM && productData.heightMM != productData.fwidthMM)
		{
			var portraitXRatio, portraitYRatio, landscapeXRatio, landscapeYRatio;
			
			portraitXRatio = productData.fwidthMM / productData.widthMM;
			portraitYRatio = productData.fheightMM / productData.heightMM;
			landscapeXRatio = productData.fheightMM / productData.heightMM;
			landscapeYRatio = productData.fwidthMM / productData.widthMM;

			cropMarks.push({'portrait':{'xRatio': portraitXRatio, 'yRatio': portraitYRatio },
							'landscape': {'xRatio': landscapeXRatio, 'yRatio': landscapeYRatio }
							});

			console.log('Needs crop marks', cropMarks, 'Pages: ', pages);
		} else 
		{
			console.log('no crop marks');
			cropMarks = false;
		};		


		// START THE CANVAS WITH FABRIC 	STEP 8.
		canvasInit = new CanvasSetup('new', function()
		{
			// ADD JSON TO CANVAS TO JSON  	STEP 9. 
			insertJSON = new InsertJSON('standard', function()
			{
				$('#canvas-loader').fadeOut(800);
				// ADD CROP MARKS IF NEEDED STEP 10.
				if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
				eventManagerInit = new EventManager('windowResize');
				_this.asideInit();
			});
		});
	});
};

AppInit.prototype.init = function()
{
	var _this, type, buildCanvas, fabric;

	_this = this;
	layoutData = {'id': _this.layoutId};
	type = [];

	// SET THE CURRENT DATA VARIABLE STEP 0.
	this.query('http://192.168.0.216/AdvAPI/api/CurrentDate', 'GET', false, function(date)
	{
		todaysDate = date;
	});

	// QUERY THE LAYOUTS TABLE 	STEP 1.
	// We need to do this first to see how many pages we have to create 
	this.query('http://192.168.0.216/AdvAPI/api/WJValues/WL/' + this.layoutId, 'GET', false, function(data)
	{
		console.log('this is what is returned from the web layouts table: ', data);

		// 	QUERY FOR THE JSON TABLE WE NOW KNOW CAN UPDATE OUR GLOBAL VARIABLES 
		for(var i = 0; i < data.length; i++)
		{
			var obj, json, placeholder, landscape, portrait, orientation;
			
			placeholder = {'height': '', 'width': ''};
			
			obj = JSON.parse(data[0].json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';',''));
			placeholder.height = obj[0].height;
			placeholder.width = obj[0].width;

			// CHECK IF landscape   STEP 2
			if(placeholder.width > placeholder.height)				
			{
				landscape = {'width': placeholder.width, 'height': placeholder.height, 'ratio': placeholder.height/placeholder.width};
				portrait = {'width': placeholder.height, 'height': placeholder.width,  'ratio': placeholder.height/placeholder.width};
				orientation = 'landscape';
			} 

			// IN THAT CASE IT MUST BE PORTRAIT OR SQUARE
			else if (placeholder.width <= placeholder.height) 
			{
				landscape = {'height': placeholder.height, 'width': placeholder.width, 'ratio': placeholder.width/placeholder.height};
				portrait = {'height': placeholder.width, 'width': placeholder.height, 'ratio': placeholder.width/placeholder.height};
				orientation = 'portrait';
			};		
			// PUSH DATA TO THE PAGES VARIABLE 
			// NEED TO ADD WEB JSON ID
			pages.push({
						'id' : data[i].pageNumber,
						'json' : data[i].json,
						'jsonId' : data[i].jsonID,
						'jsonObj' : JSON.parse(data[i].json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';','')),
						'ref' : i,
						'portrait': portrait,
						'landscape':landscape,
						'orientation': orientation,
						'fabric': fabric,
						'canvas': {'width': '', 'height': ''}
						});			
		};

		// INFO FOR PAGES PUSHED 
		// BUILD CANVAS CONTAINER & PAGNATION IF NEEDED		STEP 4.
		type = {'template': 'template-wrap-canvas', 'wrap': 'main-wrap', 'label': 'wrap-canvas', 'name': 'canvasWrap'};

		buildCanvas = new ElementBuilder(type, pages, function()
		{
			// NOW THE CANVAS CONTAINERS HAVE BEEN BUILT WE NEED TO INITIALISE THE PAGNATION STEP 5.
			if(pages.length > 1)
			{
				var type = {'name': 'canvasPagnation', 'wrap': 'nav-pages', 'label' : 'nav-page-' };
				var buildPagnation = new ElementBuilder(type, pages, function()
				{
					// console.log('Pagnation should be built');
					var pagnationInit = new Pagnation('nav-pages');
				});
			} 

			// WE KNOW HOW MANY PAGES THERE ARE NOW WE NEED TO ADD THE JSON TO EACH PAGE AND START UP THE APP   STEP 6.
			// LETS PUSH DATA TO THE LAYOUT AND PRODUCT DATA VARIABLE FOR FUTURE USE WE ARE GOING TO NEED THIS TO EXPORT OR UPATE THE TABLE
			
			_this.pushProductData();
		});
	});
};

AppInit.prototype.query =function(path, type, data, callback)
{
	if(!data)		// GET DATA
	{
		$.ajax(
		{
			url: path,
			type: type,
			username: 'WebAPIPhotocreateUser',
			password: '@dvw3b@piu$3r',
			success: function(data)
			{
				callback(data);
			}
		});	
	}
	else	// POST DATA
	{
		$.ajax(
		{
			url: path,
			type: type,
			username: 'WebAPIPhotocreateUser',
			password: '@dvw3b@piu$3r',
			data : data,
			success: function(data)
			{
				console.log('Return matching json matches: ', data);
				callback(data);
			}
		});		}
};

// END POINTS OR WEBPAGES 
// [Community-school] = community portal - schools
// [Community-sports] = community portal – weekend sports
// [advancedyou-school] = advanced you  - schools
// [advancedyou-sports] = advanced you  - weekend sports
// [advancedyou-family] =  advanced you  - family weekends
