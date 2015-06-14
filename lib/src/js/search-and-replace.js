/***********************************************
	Function:	Search and Replace
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function SearchAndReplace(website, userInfo, callback)
{
	this.website = website;
	this.userInfo = userInfo;
	this.callback = callback;
	this.init();
};

SearchAndReplace.prototype.imageReplace = function()
{
	var _this = this;

	// LOOP THROUGH ALL PAGES TO GET TO JSON OBJECTS
	$.each(pages, function(index, value)
	{
		$.each(this.jsonObj, function()
		{
			if(this.type == 'image')
			{
				var findPortrait  = this.src.search('(portraitimage)');

				if(findPortrait > 0)
				{
					console.log('test: ', firstPortraitImgPath)
					this.src = firstPortraitImgPath;
				};
				
				var findGroup  = this.src.search('(schoolgroup)');

				if(findGroup > 0)
				{
					this.src = firstGroupImgPath;
				};

				var findLogo  = this.src.search('(logo)');

				if(findLogo > 0)
				{
					this.src = logoPath;
				};
				// "http://192.168.0.216//CreateJS/StockImages/System/School/(logo)_thumb.png"
				// "http://192.168.0.216//CreateJS/StockImages/System/School/(schoolgroup)_thumb.jpg"
				// "http://192.168.0.216//CreateJS/StockImages/System/School/(landscape)_thumb.jpg"
				// "http://192.168.0.216//CreateJS/StockImages/System/School/(portraitimage)_thumb.jpg"

			};	
		});
	});


	this.callback();
};

SearchAndReplace.prototype.replaceText = function()
{
	var _this = this;

	// LOOP THROUGH ALL PAGES TO GET TO JSON OBJECTS
	$.each(pages, function(index, value)
	{
		$.each(this.jsonObj, function()
		{
			switch(this.text)
			{
				case '(fullname)':
					this.text = _this.userInfo.firstName + ' ' + _this.userInfo.lastName;
				break;

				case '(firstname)':
					this.text = _this.userInfo.firstName;
				break;				

				case '(lastname)':
					this.text = _this.userInfo.lastName;
				break;

				case '(year)':
					this.text = todaysDate.slice(0,4);
				break;
			}
		});
	});

	this.imageReplace();
};

SearchAndReplace.prototype.init = function()
{
	console.log('search and replace working', pages, ' USER INFO: ', this.userInfo, ' website', this.website);

	if(this.website == 'layoutBuilder')
	{
		this.callback();
		return;
	} else {
		this.replaceText();		
	}
	
};
