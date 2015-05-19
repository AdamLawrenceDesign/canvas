/***********************************************
	Function:	load Assets
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function LoadAssets(website, userId, productData, images, textThemes, jsonObjs, callback)	
{
	this.website = website;
	this.userId = userId;
	this.productData = productData;
	this.images = images;
	this.textThemes = textThemes;
	this.jsonObjs = jsonObjs;
	this.callback = callback;
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

LoadAssets.prototype.init = function()
{
	this.displayProductInfo();
	var addImages = new ListBuilder('listImages', this.images, true);
	var showTextThemes = new ListBuilder('listTextThemes', this.jsonObjs, true);
	this.callback();
}
