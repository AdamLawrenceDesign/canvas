/***********************************************
	Function:	load Assets
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function LoadAssets(website, userInfo, productData, images, textThemes, jsonObjs, callback)	
{
	this.website = website;
	this.userInfo = userInfo;
	this.productData = productData;
	this.images = images;
	this.textThemes = textThemes;
	this.jsonObjs = jsonObjs;
	this.callback = callback;
	this.userImages = [];
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
							_this.callback();
						});

				});
		});
	
};

LoadAssets.prototype.init = function()
{
	this.displayProductInfo();

	switch (this.website)
	{
		case 'advancedyou-school':
		case 'advancedyou-sports':
		case 'advancedyou-family':
			this.advancedYou();
		break;

		case 'layoutBuilder':
			var addImages = new ListBuilder('listImages', this.images, true);
			this.callback();
		break;

	};

	var showTextThemes = new ListBuilder('listTextThemes', this.jsonObjs, true);
	
}
