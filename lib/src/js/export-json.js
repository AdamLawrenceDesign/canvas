/***********************************************
	Function:	Standard Page Controllers
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function ExportJson(type, website, user)
{
	this.type = type;
	this.website = website;
	this.user = user;
	this.init();
};

ExportJson.prototype.backLink = function()
{
	var _this, user;

	_this = this;
	
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

ExportJson.prototype.postToCart = function(jsonID, string)
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

ExportJson.prototype.export = function()
{
	var _this;
	_this = this;
	
	$('header, aside').on('click', '.export', function()
	{
		string = JSON.stringify(canvas);
		tempString = new Date() + Math.floor(Math.random() * 100000);

		// STEP 1. CREATE WEB JSON FOR EACH
		// RUN LOOP
		// STEP 2. POST TO THE WEB JSON TABLE 
		// ADD MULTIPLE JSON ID'S TO THE CART

		// WHEN POSTING MUILTPILE JSON IDS SEPETARATE WITH UNDERSCORE

		//******************************************
		//	ADD RECORD TO THE TABLE WITH OUT JSON
		


		/*
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
		*/
	});
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
							"lastEditedBy": _this.user,
							"rank": 1,
							"numberOfPages": pages.length
						};	
};

ExportJson.prototype.newWebJsonObj = function(layoutId)
{
	var _this, pageNumber, newWebJSON;

	_this = this;
	newWebJSON = [];

	$.each(pages, function(index, value)
	{
		pageNumber = _this.zeroFill(index + 1, 5);

		newWebJSON.push({
						"webLayoutID": layoutId,
						"isChanged": true,
						"isDeleted": false,
						"jsonID": this.jsonId,
						"fromWhere": _this.website,
						'json': this.json, 
						"dateModified": todaysDate,
						'pageNumber': pageNumber
					});
	});	

	return newWebJSON;
};

ExportJson.prototype.pushWebJsons = function(obj, type)
{
	var _this;
	_this = this;

	if(type == 'POST')
	{
		$.each(obj, function()
		{
			_this.serverCall('http://192.168.0.216/AdvAPI/api/WJValues', 'POST', this, function(data)
			{
				console.log('Success, the layout and JSON table have successfully been updated: ', data);
			});			
		});		
	};

	if(type = 'PUT')
	{
		$.each(obj, function()
		{
			_this.serverCall('http://192.168.0.216/AdvAPI/api/WJValues/' + this.jsonID, 'PUT', this, function(data)
			{
				console.log('JSON Data should have been added to the JSON table: ', data);
			});			
		});		
	}; 			
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
			webJsons = _this.newWebJsonObj(WLValues.layoutID);
			_this.pushWebJsons(webJsons);
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
		console.log(layoutData);
		_this.updateJson();
		newWebJsonObj = _this.newWebJsonObj(layoutData.id);
		_this.pushWebJsons(newWebJsonObj);
		newWebLayoutObj = _this.newWebLayoutObj();
		console.log(newWebLayoutObj)
		// UPDATE DATE MODIEFIED ON THE LAYOUTS TABLE
		_this.serverCall('http://192.168.0.216/AdvAPI/api/WLValues/' + layoutData.id, 'PUT', newWebLayoutObj, function(WLValues)
		{
			webJsons = _this.newWebJsonObj(WLValues.layoutID);
			_this.pushWebJsons(webJsons);
		});	
			
	})
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
				$('.export').html('ADD LAYOUT <span class="icon-smiley m_m_left txt_fff"></span>');
				this.createNew();
			}
			else
			{
				$('.export').html('SAVE LAYOUT <span class="icon-smiley m_m_left txt_fff"></span>');
				this.save();
			}
		break;

		case 'school-advancedyou, school-community, family, sports':
			this.export();
		break;
	}
};

/*
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
*/