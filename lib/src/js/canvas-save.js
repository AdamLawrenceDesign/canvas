/***********************************************
	Function:	Canvas Save
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function SaveCanvas()
{
	this.init();
}

SaveCanvas.prototype.undo = function()
{
	var _this = this;
		el = this.el;

	$(el.buttonUndo).on('click', function()
	{
		$(el.loadingCanvas).css('display','block');

		var canvasInit = new CanvasSetup('revert', function()
		{
			insertJSON = new InsertJSON('standard', function()
			{
				$(el.loadingCanvas).fadeOut(800);
				if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
			});
		});		

	});

};

SaveCanvas.prototype.updateJson = function()
{
	// UPDATES THE CURRENT JSON VALUES ON THE PAGES VARIABLE
	$.each(pages, function()
	{
		this.json = JSON.stringify(this.fabric);
		this.jsonObj = JSON.parse(this.json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';',''))
	});

	// console.log('jsons updated');
};

SaveCanvas.prototype.init = function()
{
	this.el = {
				buttonUndo : '#revert',
				loadingCanvas : '#canvas-loader'
	};

	this.undo();

	setInterval(this.updateJson, 8000);

	
};
