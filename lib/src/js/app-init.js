/***********************************************
	Function:	initialise app
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function AppInit(userInfo, website, type, productId, layoutId, jsonId)
{
	this.userInfo = userInfo;
	this.userId = this.userInfo.userId;
	this.id1 = this.userInfo.id1;
	this.id2 = this.userInfo.id2;
	this.userName = this.userInfo.firstName;
	this.website = website;
	this.type = type;
	this.productId = productId;
	this.layoutId = layoutId;
	this.jsonId = jsonId;
	// console.log('Show the user information object: ', userInfo);
	this.init();
}

AppInit.prototype.controllers = function()
{
	var _this = this;
	// START UP THE PALETTE CONTROLS  STEP 15. 
	var paletteInit = new Palette(false, "['(0,0,0)','(250,250,250)','(238,236,225)','(31,73,125)','(79,129,189)','(192,80,77)','(155,187,87)','(128,100,162)','(75,172,198)','(247,150,70)']");
	
	// ADD EXPORT LISTENERS  
	var exportInit = new ExportJson(this.type, this.website, this.userId, this.userName, this.id1);

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

AppInit.prototype.buildCanvas = function()
{
	var _this = this,
		cropMarksInit;

	// START THE CANVAS WITH FABRIC 	STEP 8.
	var canvasInit = new CanvasSetup('new', function()
	{
		// SEARCH AND REPLACE STEP 8.5
		var startSearchAndReplace = new SearchAndReplace(_this.website, _this.userInfo, function()
			{
				// ADD JSON TO CANVAS TO JSON  	STEP 9. 
				var insertJSON = new InsertJSON('standard', function()
				{
					$('#canvas-loader').fadeOut(800);
					// ADD CROP MARKS IF NEEDED STEP 10.
					if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
					eventManagerInit = new EventManager('windowResize');
					
					_this.controllers();

				});
			});
	});	


};

AppInit.prototype.asideInit = function()
{
	var _this = this;

	// TIME 
	var images, textThemes, jsonObjs;

	// UPDATE THIS LATER
	// textThemes = this.getTextThemes();
	// jsonObjs = this.getJsonObjs();

	// LOAD ASSETS INTO SIDE BAR STEP 12. 
	var loadAssetsInit = new LoadAssets(this.website, this.userInfo, productData, function()
	{
		// START IMAGE UPLOADER 	STEP 14. 
		var imageUploader = new ImageUploader(_this.userId, null, 'Guests', function()
			{
				// INITALISE SLIM SCROLL 	STEP 15.
				var addScroll = new ScrollManager('wrapAssets','div');
				// ADD EVENT LISTENERS SO IMAGES CAN BE ADDED TO CANVAS 	STEP 14.
				// var addItemsInit = new AddItems(textThemes, jsonObjs); 

				var addTextControllers = new AddTextItems(); 
				var addImageControllers = new AddImages('pageLoad'); 
				
				$('#aside-loader').fadeOut(800);	

				_this.buildCanvas();

			});
	}); 
};

AppInit.prototype.pushProductData = function()
{
	var cropMarksInit, _this, startSearchAndReplace;

	_this = this;

	// GET PRODUCT INFORMATION AND PUSH DETAILS TO GLOBAL VARIABLE 
	var getProductInfo = new ServerRequest('http://192.168.0.216/AdvAPI/api/WCAPValues/Photocreate/' + this.productId, 'GET', false, function(data)
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

			// console.log('Needs crop marks', cropMarks, 'Pages: ', pages);
		} else 
		{
			// NO CROP MARKS NEEDED
			cropMarks = false;
		};		

		console.log('Pages variable: ', pages)

		_this.asideInit();

	});
};

//------------------------------------------------------
// INITAL SET UP, PUSHES JSON INFO INTO GLOBAL VARIABLES, SETS UP MULTIPAGE AND LOADS HTML ELEMENTS

AppInit.prototype.init = function()
{
	var _this, type, buildCanvas, fabric;

	_this = this;
	layoutData = {'id': _this.layoutId};
	type = [];

	var setPageStyle = new PageStyle( this.website, this.userInfo.id3 )

	// SET THE CURRENT DATA VARIABLE STEP 0.
	var getServerTimeStamp = new ServerRequest('http://192.168.0.216/AdvAPI/api/CurrentDate', 'GET', false, function(date)
	{
		todaysDate = date;
	});

	// CHECK HOW MANY JSON IDS THERE ARE 	STEP 1.
	// CREATE AN ARRAY 
	var array = this.jsonId.split('_');

	$.each(array, function(index)
	{
		var getJsonInfo = new ServerRequest('http://192.168.0.216/AdvAPI/api/WJValues/' + this, 'GET', null, function(data)
			{

				var obj, json, placeholder, landscape, portrait, orientation;
				
				placeholder = {'height': '', 'width': ''};

				obj = JSON.parse(data.json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';',''));
				placeholder.height = obj[0].height;
				placeholder.width = obj[0].width;

				// CHECK IF LANDSCAPE  STEP 2
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
							'id' : data.pageNumber,
							'json' : data.json,
							'jsonId' : data.jsonID,
							'jsonObj' : JSON.parse(data.json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';','')),
							'ref' : index,
							'portrait': portrait,
							'landscape':landscape,
							'orientation': orientation,
							'fabric': fabric,
							'canvas': {'width': '', 'height': ''}
							});	

				// CHECK FOR FINAL CYCLE OF THE EACH STATEMENT
				if((index+1) == array.length)
				{
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

				};

			});
	});
};

// END POINTS OR WEBPAGES 
// [Community-school] = community portal - schools
// [Community-sports] = community portal – weekend sports
// [advancedyou-school] = advanced you  - schools
// [advancedyou-sports] = advanced you  - weekend sports
// [advancedyou-family] =  advanced you  - family weekends
