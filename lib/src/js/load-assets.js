/***********************************************
	Function:	load Assets
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function LoadAssets(website, userInfo, productData, callback)	
{
	this.website = website;
	this.userInfo = userInfo;
	this.productData = productData;
	// DOUBLE UP VARIABLE NEED TO UPDATE AT A LATER DATE
	this.textThemes = [
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
	this.jsonObjs = [
					{'ID':'TextObject1','Name':'TextObject1','Path':'assets/img/sampleText/1.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":228.81,"top":151.03,"width":120,"height":120,"fill":"rgb(31,73,125)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.63,"scaleY":1.12,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":225.39,"top":141.36,"width":274,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.97,"scaleY":0.97,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"SAMPLE TEXT","fontSize":40,"fontWeight":"normal","fontFamily":"Georgia, serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":226.36,"top":172.57,"width":339,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.48,"scaleY":0.48,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"New and Improved","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fafafa"}'},
					{'ID':'TextObject2','Name':'TextObject1','Path':'assets/img/sampleText/2.jpg','JSON':'{"objects":[{"type":"circle","originX":"center","originY":"center","left":111.92,"top":102.08,"width":60,"height":60,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.08,"scaleY":3.08,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","radius":30,"startAngle":0,"endAngle":6.283185307179586},{"type":"i-text","originX":"center","originY":"center","left":112.25,"top":98.02,"width":168,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Sample 2","fontSize":40,"fontWeight":"normal","fontFamily":"Arial, Helvetica, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":111.81,"top":127.41,"width":306,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.37,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"More Information","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fafafa"}'},
					{'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/3.jpg','JSON':'{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":600,"height":400,"fill":"#000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"rect","originX":"center","originY":"center","left":224.69,"top":79.4,"width":120,"height":120,"fill":"rgb(192,80,77)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.91,"scaleY":1.39,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":97.25,"top":105.02,"width":175,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Themes 3","fontSize":40,"fontWeight":"normal","fontFamily":"Arial, Helvetica, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":79.81,"top":135.19,"width":306,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.38,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"More Information","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":422.78,"top":111.89,"width":120,"height":120,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.45,"scaleY":0.12,"angle":270.46,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'},
					{'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/4.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":114.17,"top":149.08,"width":120,"height":120,"fill":"rgb(155,187,87)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.95,"scaleY":2.51,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":99.8,"top":247.74,"width":176,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.96,"scaleY":0.96,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Theme 4","fontSize":40,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":79.54,"top":276.92,"width":423,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.3,"scaleY":0.3,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"MORE INFORMATION","fontSize":40,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":19.24,"top":36.97,"width":120,"height":120,"fill":"rgbundefined","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.33,"scaleY":0.08,"angle":89.79,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'}
					];
	this.callback = callback;
	this.userImages = [];
	this.stockImages = [];
	this.init();
}

LoadAssets.prototype.getLogo = function()
{
	logoPath = 'http://192.168.0.216/lifebuyimages/' + this.userInfo.id2 + '/Assets/PublicPortal/Logo.png';
	// console.log('logo pathway: ', logoPath);
};

LoadAssets.prototype.displayProductInfo = function()
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

LoadAssets.prototype.advancedYou = function()
{
	var _this = this,
		el = this.defaults;
	
	var returnUserInfo = new ServerRequest('http://192.168.0.216/AdvAPI/api/WPIValues/' + this.userInfo.id1, 'GET', null, function(data)
		{
			var ref;

			$.each(data, function(index)
				{
					if(index == 0)
					{
						firstPortraitImgPath = 'http://192.168.0.216' + this.portraitImageServerPath; 
					};	

					_this.userImages.push({
											ID: index,
											Path: 'http://192.168.0.216' + this.portraitImageServerPath 
					});

					if(typeof ref === 'undefined'){
						ref = index;
					} else {
						ref++;
					};
				});

			var returnGroupImages = new ServerRequest('http://192.168.0.216/AdvAPI/api/WGIValues/AdvancedYou/' + _this.userInfo.id1 , 'GET', null, function(data)
				{
					$.each(data, function(index)
						{
							if(index == 0)
							{
								firstGroupImgPath = 'http://192.168.0.216' + this.groupImageServerPath;
							};					

							_this.userImages.push({
													ID: ref + index,
													Path: 'http://192.168.0.216' + this.groupImageServerPath 
							});

						});

					// CREATE LOGO PATH
					_this.getLogo();
					
					// ADD LOGO TO USER IMAGES 
					_this.userImages.push({
											ID: _this.userImages.length,
											Path: logoPath
										});


					var addImages = new ListBuilder('listImages', _this.userImages, true, function()
						{
							// ASSETS NOW LOADED
							// _this.getLogo();

							//--------------------------------------------------------------------------------------
							// 
							var getCategories = new ServerRequest('http://192.168.0.216/AdvAPI/api/WSIValues/Popular', 'GET', null, function(data)
								{

									$.each(data, function(index)
									{
										_this.stockImages.push({
																	ID: this.id,
																	Path: 'http://192.168.0.216/' + this.thumbnailPath,
																	Category: this.category
																});
									});


									var addImages = new ListBuilder(el.wrapStockImages, _this.stockImages, true, function()
										{
											// var addItemsInit = new AddImages('update');

											_this.layoutBuilder();
										});	
								});

						});

				});
		});
};

LoadAssets.prototype.layoutAssetsListener = function()
{
	var _this = this,
		el = this.defaults;

	$(el.selectCategories).on('change', function()
	{
		var __this = this;

		$(this).css('z-index','101');
		$(el.loader).fadeIn();
		_this.stockImages = [];
		$('#' + el.wrapStockImages).empty();

		setTimeout(function()
		{
			var getCategories = new ServerRequest('http://192.168.0.216/AdvAPI/api/WSIValues/' + $(__this).val(), 'GET', null, function(data)
				{

					$.each(data, function(index)
					{
						_this.stockImages.push({
													ID: this.id,
													Path: 'http://192.168.0.216/' + this.thumbnailPath,
													Category: this.category
												});
					});


					var addImages = new ListBuilder(el.wrapStockImages, _this.stockImages, true, function()
						{
							var addItemsInit = new AddImages('update');
						});	
					


					$(this).css('z-index','auto');
					$(el.loader).fadeOut();	
				});
		},1000)
	});
};

LoadAssets.prototype.layoutBuilder = function()
{
	var _this = this,
		el = this.defaults;

	var getCategories = new ServerRequest('http://192.168.0.216/AdvAPI/api/WSIValues', 'GET', null, function(data)
		{
			$.each(data, function(index)
			{
				var option = document.createElement('option');
				$(option).html(this.category).val(this.category);
				$(el.selectCategories).append(option);
			});

			_this.layoutAssetsListener();
			_this.callback();	
		});
};

LoadAssets.prototype.init = function()
{
	this.displayProductInfo();

	this.defaults = {
				header: 'header',
				selectCategories: '#select-categories',
				wrapImages: 'listImages',
				wrapStockImages: 'stockImages',
				loader: '#aside-loader',
				yourPhotosTab: '#tab-yourPhotos',
				wrapYourImages : '#assetsImages'
			};

	switch (this.website)
	{
		case 'advancedyou-school':
		case 'advancedyou-sports':
		case 'advancedyou-family':
			this.advancedYou();
		break;

		case 'layoutBuilder':
			$(this.defaults.yourPhotosTab).parent().addClass('hidden');
			$(this.defaults.wrapYourImages).addClass('hidden');
			// $(this.defaults.selectCategories).parent().removeClass('hidden');
			this.layoutBuilder();
		break;

	};

	var showTextThemes = new ListBuilder('listTextThemes', this.jsonObjs, true);
}
