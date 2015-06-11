/***********************************************
	Function:	load Assets
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function LoadAssets(website, userInfo, productData, textThemes, jsonObjs, callback)	
{
	this.website = website;
	this.userInfo = userInfo;
	this.productData = productData;
	this.textThemes = textThemes;
	this.jsonObjs = jsonObjs;
	this.callback = callback;
	this.userImages = [];
	this.stockImages = [];
	this.init();
}

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
	var _this = this;
	
	var returnUserInfo = new ServerRequest('http://192.168.0.216/AdvAPI/api/WPIValues/' + this.userInfo.id1, 'GET', null, function(data)
		{
			var ref;

			$.each(data, function(index)
				{
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
							_this.userImages.push({
													ID: ref + index,
													Path: 'http://192.168.0.216' + this.groupImageServerPath 
							});

						});

					var addImages = new ListBuilder('listImages', _this.userImages, true, function()
						{
							// ASSETS NOW LOADED
							_this.callback();
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
		$('#' + el.wrapImages).empty();

		setTimeout(function()
		{
			console.log(__this)

			var getCategories = new ServerRequest('http://192.168.0.216/AdvAPI/api/WSIValues/' + $(__this).val(), 'GET', null, function(data)
				{
					console.log('test', data)

					$.each(data, function(index)
					{
						_this.stockImages.push({
													ID: this.id,
													Path: 'http://192.168.0.216/' + this.thumbnailPath,
													Category: this.category
												});
					});


					var addImages = new ListBuilder(el.wrapImages, _this.stockImages, true);	
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
				loader: '#aside-loader'
			};

	switch (this.website)
	{
		case 'advancedyou-school':
		case 'advancedyou-sports':
		case 'advancedyou-family':
			this.advancedYou();
		break;

		case 'layoutBuilder':
			this.layoutBuilder();
		break;

	};

	var showTextThemes = new ListBuilder('listTextThemes', this.jsonObjs, true);
}

/*
LoadAssets.prototype.getStockImages = function()
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
*/
