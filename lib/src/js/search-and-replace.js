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

SearchAndReplace.prototype.replaceText = function()
{
	var _this = this;

	// LOOP THROUGH ALL PAGES TO GET TO JSON OBJECTS
	$.each(pages, function(index, value)
	{
		$.each(this.jsonObj, function()
		{
			if(this.text == '(fullname)')
				{
					this.text = _this.userInfo.firstName + ' ' + _this.userInfo.lastName;
				};	

			if(this.text == '(firstname)')
			{
				this.text = _this.userInfo.firstName;
			};			

			if(this.text == '(fastname)')
			{
				this.text = _this.userInfo.lastName;
			};
		});
	});

	this.callback();
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
