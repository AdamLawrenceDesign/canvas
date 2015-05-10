/***********************************************
	Function:	Element Builder
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com		
*************************************************/
// NEEDS HEAPS OF TIDYING UP
// MAKE THE CLONE CONTROL MORE GENERIC FOR RE-USE 

function ElementBuilder(type, obj, callback)
{
	this.type = type;
	this.obj = obj;
	this.callback = callback;
	this.init();
}

ElementBuilder.prototype.canvasWrap = function()
{
	var yPosition = 0;

    for(var i = 0; i < this.obj.length; i++)
    {
        var wrap, template, li, a, img;

        wrap = document.getElementById(this.wrap);
        template = $(document.getElementById(this.template)).clone();
        $(template).attr({'id': 'wrap-canvas-' + i ,'data-yPosition': yPosition }).css('top', yPosition + '%');
        $(template).find('canvas').attr({'id': 'canvas' + '-'+ i});
        $(wrap).append(template);
        yPosition = yPosition + 100;
    }

    // TEMPLATE HAS TO BE REMOVED FOR PAGNATION TO WORK
    $('#' + this.type.template).remove();

    if(this.callback)   this.callback();
};

ElementBuilder.prototype.buildList = function(id, html)
{
    var wrap, li, a, p;
    
    wrap = document.getElementById(this.wrap);
    li = document.createElement('li');
    a = document.createElement('a');
    p = document.createElement('p');

    $(a).attr('id', id);
    $(p).html(html);

    $(a).append(p);
    $(li).append(a);
    $(wrap).append(li);
};

ElementBuilder.prototype.pageNav = function()
{
    this.buildList('nav-page-up', '<span class="icon-arrow-up"></span>');

    for(var i = 0; i < this.obj.length; i++)
    {
        // console.log('placeholder: ', i, ', label: ');
        this.buildList(this.label + i, parseInt(i)+1)
    };
    
    this.buildList('nav-page-down', '<span class="icon-arrow-down2"></span>');
    this.callback();
}

ElementBuilder.prototype.init = function()
{
    switch(this.type.name)
    {
        case 'canvasWrap':
        	this.template = this.type.template;
        	this.wrap = this.type.wrap;
            this.canvasWrap();
            break;
        case 'canvasPagnation':
            this.wrap = this.type.wrap;
            this.label = this.type.label;
            this.pageNav();
           	break;
    }   
};
