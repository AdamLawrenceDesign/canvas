/***********************************************
	Function:	Pagnation
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com		
*************************************************/

function Pagnation(wrap)
{
	this.wrap = wrap;
	this.pages = [];
	this.init();
}

Pagnation.prototype.setCurrentPage = function(obj)
{
	if($(obj).attr('data-yposition') == 0) 
	{
		currentPageRef = $(obj).attr('id').replace('wrap-canvas-','');
		console.log(currentPageRef)
	};
};

Pagnation.prototype.pageUp = function(element)
{
	var firstChild, _this;

	_this = this;
	firstChild = $('#nav-page-0').parent().attr('class');
	if(firstChild == 'selected') return;
	
	$('#' + this.wrap + ' .selected').removeClass('selected').prev('li').addClass('selected');

	$('.wrap-canvas').each(function()
	{
		var yPosition = $(this).attr('data-yposition');
		$(this).attr('data-yposition', parseInt(yPosition) + 100);
		$(this).css('top', parseInt(yPosition) + 100 + '%');
	});
};

Pagnation.prototype.pageDown = function(element)
{
	var lastChild, _this;

	_this = this;
	lastChild = $('#nav-page-' + (this.pages.length-1)).parent().attr('class');
	if(lastChild == 'selected' ) return;

	$('#' + this.wrap + ' .selected').removeClass('selected').next('li').addClass('selected');

	$('.wrap-canvas').each(function()
	{
		var yPosition = $(this).attr('data-yposition');
		$(this).attr('data-yposition', parseInt(yPosition) - 100);
		$(this).css('top', parseInt(yPosition) - 100 + '%');
		_this.setCurrentPage(this);
		/*
		if($(this).attr('data-yposition') == 0) 
		{
			currentPageRef = $(this).attr('id').replace('wrap-canvas-','');
			console.log(currentPageRef)
		};
		*/
	});
};

Pagnation.prototype.movePages = function(element)
{
	var lookUp, currentPos, difference, _this;

	_this = this;
	$('#'+ this.wrap + ' li').removeClass('selected');
	$(element).parent().addClass('selected');

	lookUp = $(element).attr('id').replace('nav-page-', '');
	currentPos = $('#' + 'wrap-canvas-' + lookUp).attr('data-yposition');
	difference = 0 - currentPos;

	$('.wrap-canvas').each(function()
	{		
		var yPosition = $(this).attr('data-yposition');
		$(this).attr('data-yposition', parseInt(yPosition) - currentPos);
		$(this).css('top', parseInt(yPosition) - currentPos + '%');
		_this.setCurrentPage(this);
	});
};

Pagnation.prototype.eventManager = function()
{
	var _this = this;
	$('#' + this.wrap).on('click', 'a', function()
	{
		var id = $(this).attr('id');

		if(id == 'nav-page-up')
		{
			_this.pageUp(this);
		}
		else if(id == 'nav-page-down')
		{
			_this.pageDown(this);
		}
		else 
		{
			_this.movePages(this);
		}	
	});
};

Pagnation.prototype.init = function()
{
	var _this;  

	_this = this;

	$('.wrap-canvas').each(function()
	{
		_this.pages.push({'id': $(this).attr('id'), 'yPosition': $(this).attr('data-yposition')})
	});
	
	$('#nav-pages').removeClass('hidden');
	$('#nav-page-0').parent().addClass('selected');

	this.eventManager();
};