/***********************************************
	Function:	Standard Page Controllers
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/
// ENABLE BACK LINKS
// BUILD PRODUCT INFO
// EXPORT

function DocumentControls(website, user, type, productId, product)
{
	this.website = website;
	this.user = user;
	this.type = type;
	this.productId = productId;
	this.product = product;
	this.init();
};

DocumentControls.prototype.backLink = function()
{
	var _this, user;

	_this = this;

	console.log(this.website)
	
	$('.back').on('click', function()
	{
		if(_this.website == 'layoutBuilder')
		{
			user = window.location.href.slice(window.location.href.search('user='), window.location.href.search('%type')-1);
			$(this).attr('href', '../layoutManager/layouts.html' + '?' + user);
		}
		else
		{
			$(this).attr('href', '../' + 'folder' + 'products.html?' + _this.product.itemName);
		}
	});
};

DocumentControls.prototype.productInfo = function()
{
	var _this, wrap;
	_this = this;

	wrap = $('#productInformation');
	wrap.find('.description').html(_this.product.description);
	wrap.find('.itemName').html(_this.product.itemName);
	wrap.find('.price').html('$ ' + _this.product.unitPrice);
	wrap.find('.productImage').attr('src','assets/img/products/' + _this.product.id + '.jpg');
	$('.productLabel').html(_this.product.description);
};

DocumentControls.prototype.serverCall = function(path, type, data, callback)
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

DocumentControls.prototype.postToCart = function(jsonID, string)
{
	var cartValue, WebClientAssetId, productId, ImageUrl, ProductDescription, ProductName,	Price, Quantity, DiscountAmount, TotalAmount, WebDataItem, SICCode, WebClientID, PortalName;
	
	WebClientAssetId =  '4239';         // 301412 (prepay – but we will create a new one)
	productId        = this.productId;    						 // 23 (mug)
	ImageUrl         = '~/_testing/proto2/' + $('.productImage').attr('src');         // (a snip from the final design – or thumbnail from the webclientassetid or productId)
	ProductDescription = $('.description').html();       // Standard Mug – Right Handed
	ProductName      = $('.itemName').html();         // Standard Mug
	Price            = $('.price').html().replace('$','').replace(/\s/g,'');         // 19.95 (unit price) 
	Quantity         = $('#qty').val();        // 1
	DiscountAmount   = 0;         				//   0
	TotalAmount      = Price * $('#qty').val();			//  19.95
	WebDataItem      = 'OrderType=' + 'Photocreate' + '_ProductID=' + this.productId + '_JSONID=' + jsonID;         //  OrderType=Photocreate|ProductID=23|JSONID=1001 (|=line returns)
	SICCode          = 'L9TG6YFGD';			//  ‘Get the sic code’	Sample added
	WebClientID      = 'nbnhmHqqedB/EwFl1O+RUA==';         			// ‘Get Encrypted Code’
	PortalName       = '[advancedyou-school]';          //  ‘’
	OriginURL 		 = '~' +  window.location.href.replace('http://192.168.0.216','');
	
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
		'&PortalName=' + PortalName + 
		'&OriginURL=' + OriginURL;

	$.ajax(
	{
		url: 'http://192.168.0.216/AdvAPI/api/WJValues/' + jsonID,
		type: 'PUT',
		username: 'WebAPIPhotocreateUser',
		password: '@dvw3b@piu$3r',
		data: 
		{
			"json": string,				// json
		},
		success: function(data)
		{
			// console.log('JSON String Updated');
			// console.log(cartValue);
			// console.log(Price.toFixed(2) * $('#qty').val().toFixed(2));
			window.location = 'http://192.168.0.216/cartLink.aspx?' + cartValue;
		}
	});
};

DocumentControls.prototype.export = function()
{
	var _this, string, url, groupName, webSiteName, productId, tempString;
	_this = this;
	
	$('header, aside').on('click', '.export', function()
	{
		string = JSON.stringify(canvas);
		tempString = new Date() + Math.floor(Math.random() * 100000);

		//******************************************
		//	ADD RECORD TO THE TABLE WITH OUT JSON
		
		$.ajax(
		{
			url: 'http://192.168.0.216/AdvAPI/api/WJValues',
			type: 'POST',
			username: 'WebAPIPhotocreateUser',
			password: '@dvw3b@piu$3r',
			data: 
			{
				"fromWhere": 		_this.website,		// Portal Name
				"json": 			tempString,				// json
				"webOrderItemID": 	_this.productId,			// Product ID
				"user": 			_this.user				// user
			},
			success: function(data)
			{
				console.log('Success: item added to table');
				// console.log(data);
				// EXCUTE THE NEXT FUNCTION FOR ADDING JSON
				assignJSONID();
			}
		});

		//*****************************************
		// RETRIVE ID FROM THE 
		
		var assignJSONID = function()
		{
			$.ajax(
			{
				url: 'http://192.168.0.216/AdvAPI/api/WJValues',
				type: 'GET',
				username: 'WebAPIPhotocreateUser',
				password: '@dvw3b@piu$3r',
				success: function(data)
				{
					$.each(data, 
						function(index, value)
						{
							if(value.json == tempString)
							{
								console.log(value.jsonID);
								_this.postToCart(value.jsonID, string);
							}
						}
					);
				}
			});
		}
	});
};

DocumentControls.prototype.createNew = function()
{
	var _this = this;
	
	$('header, aside').on('click', '.export', function()
	{
		var jsonValue, layoutTablePush, jsonTablePush;

		jsonValue = JSON.stringify(canvas);
		layoutTablePush = {
						"lastEditedBy":  _this.user,		
						"productID":     _this.productId,			
						"deleted": 		'false',
					};

		//	ADD RECORD TO LAYOUTS TABLE
		_this.serverCall('http://192.168.0.216/AdvAPI/api/WLValues', 'POST', layoutTablePush, function(data)
		{
			console.log('this call back should return layout table data: ', data);

			jsonTablePush =  {
								"json": jsonValue,		
								"webLayoutID":  data.layoutID
							};

			console.log(jsonTablePush);

			_this.serverCall('http://192.168.0.216/AdvAPI/api/WJValues', 'POST', jsonTablePush, function(data)
				{
					console.log('Success, the layout and JSON table have successfully been updated: ', data);
				});

		});
	})
};

DocumentControls.prototype.save = function()
{
	var _this = this;
	
	$('header, aside').on('click', '.export', function()
	{
		var placeholder, jsonValue, layoutTablePush;

		placeholder = new Date() + Math.floor(Math.random() * 100000);
		jsonValue = JSON.stringify(canvas);
		layoutTablePush = {
						"lastEditedBy":  _this.user,		
						"productID":     _this.productId,			
						"deleted": 		'false',
						"filter": 'summer'
					};

		// console.log('last edited by: ', _this.user, ', product id: ', _this.productId, ', filter: ', placeholder)

		//	ADD RECORD TO LAYOUTS TABLE
		_this.serverCall('http://192.168.0.216/AdvAPI/api/WLValues', 'PUconT', layoutTablePush, function()
		{
			// GET ALL LAYOUTS FIND MATCH FOR PLACEHOLDER
			_this.serverCall('http://192.168.0.216/AdvAPI/api/WLValues', 'GET', '', function(data)
			{
				// console.log(data);

				$.each(data, function(index, value)
				{		
					// console.log('Filter Value: ', value.filter, ', LayoutId: ', value.layoutID);
					if(value.filter == placeholder)
					{
						//	CREATE JSON RECORD
						jsonTablePush =  {
											"json": jsonValue,		
											"webLayoutID":  value.layoutID
										};

						_this.serverCall('http://192.168.0.216/AdvAPI/api/WJValues', 'GET', jsonTablePush, function(data)
						{
							console.log('check');
						})									
					}
				});		
			});
		});
	})

};

DocumentControls.prototype.init = function()
{
	this.productInfo();
	this.backLink();
	/*
	$.ajax(
	{
		url: 'http://192.168.0.216/AdvAPI/api/WLValues',
		type: 'POST',
		username: 'WebAPIPhotocreateUser',
		password: '@dvw3b@piu$3r',
		data: {
			  "productID": 2,
			  "filter": "sample string 9",
			  "deleted": true,
			  "lastEditedBy": "sample string 13",
			  "rank": 14,
			  "numberOfPages": 15
		},
		success: function()
		{
			console.log('This should have pushed to the server: ');
		}
	});
	*/
	// SWITCH DEPENDING ON WEBPAGE TYPE
	switch (this.website)
	{
		case 'layoutBuilder':
			$('.export').html('SAVE <span class="icon-smiley m_m_left txt_fff"></span>');
			$('.productQty').css('display','none');
			if(this.type == 'copy')
			{
				this.createNew();
			}
			else
			{
				this.save();
			}
		break;

		case 'school-advancedyou, school-community, family, sports':
			this.export();
		break;
	}
};
