/***********************************************
	Function:	Standard Page Controllers
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function ExportJson(type, website, userId, id1)
{
	this.type = type;
	this.website = website;
	this.userId = userId;
	this.id1 = id1;
	this.init();
};

ExportJson.prototype.linkToLayoutManager = function()
{	
	return '?userId=' + this.userId + '&userName=' + this.id1 + '&end'; 
};

ExportJson.prototype.backLink = function()
{
	var _this, user;
	_this = this;
	
	$('.back').on('click', function()
	{
		if(_this.website == 'layoutBuilder')
		{
			var addInfo = _this.linkToLayoutManager();
			$(this).attr('href', '../layoutManager/layouts.html' + addInfo);
		}
		if(_this.website == 'you')
		{
			$('#screenChange').removeClass('hidden');
			$(this).attr('href', '../subjectPortal/gift_items.aspx?SIC=' + _this.id1);
		}
	});
};

ExportJson.prototype.serverCall = function(path, type, data, callback)
{
	switch (type)
	{
		case 'GET':
		    $.ajax(
		    {
		        url: path, 
		        type: 'GET',
		        username: 'WebAPIPhotocreateUser',
		        password: '@dvw3b@piu$3r',
		        success: function(data)
		        {
		        	callback(data);
		        }
		    })
		        .fail(function(jqXHR, textStatus, err)
		        {
		            console.log('Failed to get record');
		        });
		break;

		case 'POST': 
			$.ajax(
			{
				url: path,
				type: 'POST',
				username: 'WebAPIPhotocreateUser',
				password: '@dvw3b@piu$3r',
				data: data,
				success: function(data)
				{
					callback(data);
				}
			})
		        .fail(function(jqXHR, textStatus, err)
		        {
		            console.log('Failed Update Record');
		        });
		break;

		case 'PUT': 
			$.ajax(
			{
				url: path,
				type: 'PUT',
				username: 'WebAPIPhotocreateUser',
				password: '@dvw3b@piu$3r',
				data: data,
				success: function()
				{
					callback('Your record should have been updated. ');
				}
			})
		        .fail(function(jqXHR, textStatus, err)
		        {
		            console.log('Failed Update Record');
		        });

		break;
	}
};

ExportJson.prototype.zeroFill = function(number, width)
{
	width -= number.toString().length;
	if ( width > 0 )
	{
	return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	}
	return number + ""; // always return a string
};

ExportJson.prototype.updateJson = function()
{
	$.each(pages, function()
	{
		this.json = JSON.stringify(this.fabric);
	});
};

ExportJson.prototype.newWebLayoutObj = function()
{
	return	newWebLayout = {
							"productID": productData.id,
							"deleted": false,
							"dateModified": todaysDate,
							"lastEditedBy": this.userName,
							"rank": 1,
							"numberOfPages": pages.length
						};	
};

ExportJson.prototype.newWebJsonObj = function(layoutId)
{
	var _this, pageNumber, newWebJSON;

	_this = this;
	newWebJSON = [];
	
	console.log('layout id should be pushed: ',layoutId);

	$.each(pages, function(index, value)
	{
		pageNumber = _this.zeroFill(index + 1, 5);

		newWebJSON.push({
						"webLayoutID": layoutId,
						// "isChanged": true,
						// "isDeleted": false,
						"jsonID": this.jsonId,
						"fromWhere": _this.website,
						'json': this.json, 
						"dateModified": todaysDate,
						'pageNumber': pageNumber
					});
	});	

	return newWebJSON;
};

ExportJson.prototype.pushWebJsons = function(obj, type, callback)
{
	var _this;
	_this = this;

	// CREATE NEW WEB JSONS 
	$.each(obj, function()
	{
		_this.serverCall('http://192.168.0.216/AdvAPI/api/WJValues', 'POST', this, function(data)
		{
			// WEB JSONS SHOULD HAVE BEEN PUSHED TO THE SERVER
			console.log('Success, the layout and JSON table have successfully been updated: ', data);
			callback();
		});			
	});		
};

ExportJson.prototype.updateWebJsonObj = function()
{
	var _this, pageNumber, webJsonUpdate;

	_this = this;
	webJsonUpdate = [];


	$.each(pages, function(index, value)
	{
		pageNumber = _this.zeroFill(index + 1, 5);

		webJsonUpdate.push({
						"webLayoutID": layoutData.id,
						// "isChanged": true,
						// "isDeleted": false,
						"jsonID": this.jsonId,
						"fromWhere": _this.website,
						'json': this.json, 
						"dateModified": todaysDate,
						'pageNumber': pageNumber
					});
	});	

	return webJsonUpdate;
};

ExportJson.prototype.updateWebJsons = function(obj, type, callback)
{
	var _this;
	_this = this;

	// UPDATE EACH WEB JSON
	$.each(obj, function()
	{
		_this.serverCall('http://192.168.0.216/AdvAPI/api/WJValues/' + this.jsonID, 'PUT', this, function(data)
		{
			// USE THE CALLBACK TO REDIRECT THE PAGE
			console.log('JSON Data should have been added to the JSON table: ', data);
			callback();
		});			
	});
};

ExportJson.prototype.createNew = function()
{
	var _this = this;

	$('header, aside').on('click', '.export', function()
	{
		var newWebLayoutObj, webJsons;

		// UPDATE THE CURRENT JSON VALUES ON EACH PAGE
		_this.updateJson();
		newWebLayoutObj = _this.newWebLayoutObj();

		// CREATE NEW WEB LAYOUT RETRIVE THE ID USING A CALLBACK
		_this.serverCall('http://192.168.0.216/AdvAPI/api/WLValues', 'POST', newWebLayoutObj, function(WLValues)
		{
			// console.log('webjson layout id for the record just created is: ', WLValues);
			// PUSH VALUES TO THE NEW WEB JSON TABLE 
			console.log('this is the layout id: ', WLValues.layoutID)
			webJsons = _this.newWebJsonObj(WLValues.layoutID);
			
			// UPDATE WEB JSONS 
			_this.pushWebJsons(webJsons, 'POST', function()
			{
				location = 'http://192.168.0.216/layoutManager/layouts.html' + _this.linkToLayoutManager();				
			});
		});		
	})
};

ExportJson.prototype.save = function()
{
	var _this = this;	

	$('header, aside').on('click', '.export', function()
	{
		var newWebJsonObj, layoutTablePush, newWebLayoutObj;

		// UPDATE THE CURRENT JSON VALUES ON EACH PAGE
		// console.log(layoutData);
		_this.updateJson();
		// newWebJsonObj = _this.newWebJsonObj(layoutData.id);
		// _this.pushWebJsons(newWebJsonObj);
		newWebLayoutObj = _this.newWebLayoutObj();
		// console.log(newWebLayoutObj);
		// UPDATE DATE MODIEFIED ON THE LAYOUTS TABLE
		_this.serverCall('http://192.168.0.216/AdvAPI/api/WLValues/' + layoutData.id, 'PUT', newWebLayoutObj, function(WLValues)
		{
			console.log('Server response updating layout: ', WLValues);
			webJsons = _this.updateWebJsonObj();

			_this.updateWebJsons(webJsons, 'PUT', function()
			{
				location = 'http://192.168.0.216/layoutManager/layouts.html' + _this.linkToLayoutManager();
			});

		});	
			
	})
};

ExportJson.prototype.postToCart = function(jsons)
{
	var cartValue, WebClientAssetId, productId, ImageUrl, ProductDescription, ProductName,	Price, Quantity, DiscountAmount, TotalAmount, WebDataItem, SICCode, WebClientID, PortalName;
	
	WebClientAssetId =  '4239';         											// 301412 (prepay – but we will create a new one)
	productId        = productData.id;    											// 23 (mug)
	// NEED TO UPDATE THIS FOR PRODUCTION SERVER
	ImageUrl         = '~/canvas/' + $('.productImage').attr('src');         		// (a snip from the final design – or thumbnail from the webclientassetid or productId)
	ProductDescription = $('.description').html();       							// Standard Mug – Right Handed
	ProductName      = $('.itemName').html();         								// Standard Mug
	Price            = $('.price').html().replace('$','').replace(/\s/g,'');        // 19.95 (unit price) 
	Quantity         = $('#qty').val();        									
	DiscountAmount   = 0;         													
	TotalAmount      = Price * $('#qty').val();		
	WebDataItem      = 'OrderType=' + 'Photocreate' + '_ProductID=' + productData.id + '_JSONID=' + jsons;         //  OrderType=Photocreate|ProductID=23|JSONID=1001 (|=line returns)
	SICCode          = this.id1;																					// LEAVE BLANK IF FROM COMMUNITY  ‘Get the sic code’	Sample added
	WebClientID      = '';      																					// LEAVE BLANK IF FROM YOU PORTAL ‘Get Encrypted Code’ WEBCLIENT ID
	// PortalName       = '[' + this.website + ']';          //  ‘’
	PortalName       = '[advancedyou-school]';          //  ‘’
	OriginURL 		 = '~' +  window.location.href.replace('http://192.168.0.216','');
	
	if(this.website == 'you')
	{
		SICCode          = this.id1;						// LEAVE BLANK IF FROM COMMUNITY  ‘Get the sic code’	Sample added
		WebClientID      = '';      						// LEAVE BLANK IF FROM YOU PORTAL ‘Get Encrypted Code’ WEBCLIENT ID
	};

	if(this.website == 'community')
	{
		SICCode          = '';						// LEAVE BLANK IF FROM COMMUNITY  ‘Get the sic code’	Sample added
		WebClientID      = this.id1;      // LEAVE BLANK IF FROM YOU PORTAL ‘Get Encrypted Code’ WEBCLIENT ID
	};

	cartValue = 
		'WebClientAssetId=' + WebClientAssetId + 
		'&ProductId=' + productId + 
		'&ImageUrl=' + ImageUrl +  
		'&ProductDescription=' + ProductDescription + 
		'&ProductName=' + ProductName + 
		'&Price=' + Price + 
		'&Quantity=' + Quantity + 
		'&DiscountAmount=' + DiscountAmount + 
		'&TotalAmount=' + TotalAmount +
		'&WebDataItem=' + WebDataItem +
		'&SICCode=' + SICCode +
		'&WebClientID=' + WebClientID +
		'&PortalName=' + PortalName ; 
		// '&OriginURL=' + OriginURL;

	window.location = 'http://192.168.0.216/cartLink.aspx?' + cartValue;
};

ExportJson.prototype.cartItem = function()
{
	var _this, jsons, items;
	_this = this;
	
	$('header, aside').on('click', '.export', function()
	{
		// STEP 1. UPDATE JSON GLOBAL VARIABLE
		// STEP 2. POST TO THE WEB JSONS TABLE 
		// STEP 3. POST DETAILS TO CART LINK

		$('#screenChange').removeClass('hidden');

		// UPDATE THE CURRENT JSON VALUES ON EACH PAGE
		_this.updateJson();

		// ADD COUNT FOR CALLBACK OTHERWISE WE WONT KNOW HOW IT WILL WORK 
		items = pages.length -1;
		jsons = '';

		$.each(pages, function(index, value)
		{
			var index = index;
			var data = {
						"fromWhere": 		_this.website,		
						"json": 			this.json,		
						"webOrderItemID": 	_this.productId,		
						"user": 			_this.userId				
					};
			
			_this.serverCall('http://192.168.0.216/AdvAPI/api/WJValues', 'POST', data, function(data)
			{
				if(jsons != '') 
				{
					jsons = jsons + '_' + data.jsonID;
				} else {
					jsons = data.jsonID;
				};

				if(index == items)
				{
					_this.postToCart(jsons);
				}; 
			});
		});
	});
};

ExportJson.prototype.editCartItem = function()
{
	var _this, jsons, items;
	_this = this;
	
	$('header, aside').on('click', '.export', function()
	{
		console.log('edit cart item.')
	});
};

ExportJson.prototype.init = function()
{
	// this.productInfo();
	this.backLink();
	
	console.log('Webpage: ', this.website, ', type: ', this.type )

	// SWITCH DEPENDING ON WEBPAGE TYPE
	switch (this.website)
	{
		case 'layoutBuilder':
			$('.productQty').css('display','none');

			if(this.type == 'copy')
			{	
				$('.export').html('ADD LAYOUT <span class="icon-smiley m_m_left txt-fff"></span>');
				this.createNew();
			}
			else
			{
				$('.export').html('SAVE LAYOUT <span class="icon-smiley m_m_left txt-fff"></span>');
				this.save();
			}
		break;

		case 'advancedyou-school':
			if(this.type = 'cartItem')
			{
				this.cartItem();
			} else {
				this.editCartItem();
			}
			
		break;

		case 'community':
			this.cartItem();
		break;			

		case 'client':
			this.cartItem();
		break;	
	}
};

