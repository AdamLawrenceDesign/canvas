/***********************************************
	Function:	Page Style 
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function PageStyle(website, style, type)
{
	this.website = website;
	this.style = style;
	this.type = type;
	this.colours = 	[
						{ name:'ubl', prm: '#00578a', sec : '#0099bc', lt : '#ff8736', op : '#6caddf' },	//  #ffbb00
						{ name:'ubk', prm : '#292f33', sec : '#ffa800', lt : '#ef7622', op : '#ffa800' }, 	
						{ name:'ucb', prm : '#4f2d82', sec : '#ffc425', lt : '#ef7622', op : '#ffc425' }, 		
						{ name:'ubm', prm : '#006bb1', sec : '#0099bc', lt : '#ef7622', op : '#f6b200' }, 		
						{ name:'udo', prm : '#017051', sec : '#017051', lt : '#ef7622', op : '#9c1b3a' },		
						{ name:'ugr', prm : '#005c2f', sec : '#00894b', lt : '#ef7622', op : '#00894b' },	
						{ name:'ugo', prm : '#fcb600', sec : '#ffa800', lt : '#ef7622', op : '#ffa800' },	
						{ name:'uma', prm : '#711a3f', sec : '#6caddf', lt : '#ef7622', op : '#6caddf' },	
						{ name:'umn', prm : '#6f2f40', sec : '#ffa800', lt : '#ef7622', op : '#d59693' },					
						{ name:'una', prm : '#002b5c', sec : '#6caddf', lt : '#ef7622', op : '#6caddf' },	
						{ name:'une', prm : '#292f33', sec : '#ffa800', lt : '#ef7622', op : '#ffa800' },		
						{ name:'upl', prm : '#b62e2e', sec : '#ffa800', lt : '#ef7622', op : '#6caddf' },			
						{ name:'upu', prm : '#753b92', sec : '#6caddf', lt : '#ef7622', op : '#6caddf' },	
						{ name:'ute', prm : '#3ca3ac', sec : '#6caddf', lt : '#ef7622', op : '#6caddf' },	
						{ name:'ure', prm : '#c41425', sec : '#07778b', lt : '#ef7622', op : '#6caddf' }, 
						{ name:'sports', prm : '#292f33', sec : '#ffa800', lt : 'rgba(0, 0, 0, 0.1)', op : '#ffa800' }
					];
	this.checkPage();
}

PageStyle.prototype.colourSetUp = function(colour)
{
	var _this = this,
		el = this.el;

	$(el.primaryColour).css('background-color', colour.prm);							
	$(el.secondaryColor).css('background-color',  colour.sec);   		
	$(el.primaryLight).css('background-color', colour.lt);			
	$(el.button).css('background-color',  colour.op);		
	$(el.buttonOrange).css('background-color',  colour.lt);		

};

PageStyle.prototype.setUpSchool = function()
{
	var _this = this,
		el = this.el;

	$(el.header).addClass('pattern');
	$(el.headerLogo).attr('src', 'assets/svg/logo-org.svg');

	// GET MATCH FOR COLOUR
	$.each(this.colours, function()
	{
		if(this.name == _this.style)
		{
			_this.colourSetUp(this);
		}
	});	
};

PageStyle.prototype.setUpSports = function()
{
	var el = this.el;

	$(el.header).removeClass('pattern').addClass('pattern_sports');
	$(el.body).css('background-image','url(assets/img/sports/bg_crowd.jpg)');

};

PageStyle.prototype.setUpFamilies = function()
{
	// FAMILIES STYLE TO BE ADDED 
};

PageStyle.prototype.checkPage = function()
{
	var _this = this;

	this.el = {
				header: 'header',
				headerLogo: '#header_logo',
				body: 'body',
				primaryColour: '.prm',
				secondaryColor: '.sec',
				primaryLight: '.prm_lt',
				button: '.button',
				buttonOrange: '.btn-orange',
				selectQty: '.productQty',
				changeOrientation: '#orientationLinks'
	}


	switch (this.website)
	{
		case 'advancedyou-school':
		case 'advancedyou-sports':
		case 'advancedyou-family':
			this.setUpSchool();
			$(this.el.changeOrientation).addClass('hidden')
		break;
	};

	console.log('pages type: ', this.type)
	if(this.type == 'editCartItem')
	{
		$(this.el.selectQty).addClass('hidden');
	}

};

// ORANGE COLOUR #ef7622
