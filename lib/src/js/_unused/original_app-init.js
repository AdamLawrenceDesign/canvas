$(function()
{
	var url, id, product, itemName, productId, website, user, layoutId, stockImages, textThemes, textObjects, associatedThemes, userId, uploadsFolder;
	
	if(typeof(Storage) !== "undefined")
	{
		// Code for localStorage/sessionStorage.
		console.log('Web Storage Available');
		
		// localStorage.setItem('JSON', "{'page-1':'data'},{'page-2':'data'}]");

	} 
	else
	{
		// Sorry! No Web Storage support..
		console.log('Sorry No Web Storage');
	}


	var testItems = [{'ID':'1', 'Name':'Sample1','Path':'assets/img/sampleImages/lowRes/1.jpg','HighRes':'assets/img/sampleImages/hiRes/1.jpg'},
					{'ID':'2', 'Name':'Sample2','Path':'assets/img/sampleImages/lowRes/2.jpg','HighRes':'assets/img/sampleImages/hiRes/2.jpg'},
					{'ID':'3', 'Name':'Sample3','Path':'assets/img/sampleImages/lowRes/3.jpg','HighRes':'assets/img/sampleImages/hiRes/3.jpg'},
					{'ID':'4', 'Name':'Sample4','Path':'assets/img/sampleImages/lowRes/4.jpg','HighRes':'assets/img/sampleImages/hiRes/4.jpg'}];
					
	localStorage.setItem('pages', JSON.stringify(testItems));

	var retriveItems = JSON.parse(localStorage.getItem('pages'));
	console.log('local storage retrived: ', retriveItems);

	/***************************************************/
	// 	 PARSE URL 
	
	website = window.location.href.slice(window.location.href.search('webpage=')+8, window.location.href.search('%user')-1);
	user = window.location.href.slice(window.location.href.search('user=')+5, window.location.href.search('%type')-1);
	type = window.location.href.slice(window.location.href.search('type=')+5, window.location.href.search('%productId')-1);
	productId = window.location.href.slice(window.location.href.search('productId=')+10, window.location.href.search('%layoutId')-1);
	layoutId = window.location.href.slice(window.location.href.search('layoutId=')+9, window.location.href.length).replace('#','').replace('?','');
	// console.log('website: ', website, ', user: ', user, ', type: ', type, ', productId: ', productId, ', layoutId: ', layoutId)

	// END POINTS OR WEBPAGES 
    // [Community-school] = community portal - schools
    // [Community-sports] = community portal – weekend sports
    // [advancedyou-school] = advanced you  - schools
    // [advancedyou-sports] = advanced you  - weekend sports
    // [advancedyou-family] =  advanced you  - family weekends

	/***************************************************/
	// 	STOCK ASSETS

	stockImages = 	[
				{'ID':'1', 'Name':'Sample1','Path':'assets/img/sampleImages/lowRes/1.jpg','HighRes':'assets/img/sampleImages/hiRes/1.jpg'},
				{'ID':'2', 'Name':'Sample2','Path':'assets/img/sampleImages/lowRes/2.jpg','HighRes':'assets/img/sampleImages/hiRes/2.jpg'},
				{'ID':'3', 'Name':'Sample3','Path':'assets/img/sampleImages/lowRes/3.jpg','HighRes':'assets/img/sampleImages/hiRes/3.jpg'},
				{'ID':'4', 'Name':'Sample4','Path':'assets/img/sampleImages/lowRes/4.jpg','HighRes':'assets/img/sampleImages/hiRes/4.jpg'},
				{'ID':'5', 'Name':'Sample5','Path':'assets/img/sampleImages/lowRes/5.jpg','HighRes':'assets/img/sampleImages/hiRes/5.jpg'},
				{'ID':'6', 'Name':'Sample6','Path':'assets/img/sampleImages/lowRes/6.jpg','HighRes':'assets/img/sampleImages/hiRes/6.jpg'},
				{'ID':'7', 'Name':'Sample7','Path':'assets/img/sampleImages/lowRes/7.jpg','HighRes':'assets/img/sampleImages/hiRes/7.jpg'},
				{'ID':'8', 'Name':'Sample8','Path':'assets/img/sampleImages/lowRes/8.jpg','HighRes':'assets/img/sampleImages/hiRes/8.jpg'},
				{'ID':'9', 'Name':'Sample9','Path':'assets/img/sampleImages/lowRes/9.jpg','HighRes':'assets/img/sampleImages/hiRes/9.jpg'},
				{'ID':'10', 'Name':'Sample10','Path':'assets/img/sampleImages/lowRes/10.jpg','HighRes':'assets/img/sampleImages/hiRes/10.jpg'},
				{'ID':'11', 'Name':'Sample11','Path':'assets/img/sampleImages/lowRes/11.jpg','HighRes':'assets/img/sampleImages/hiRes/11.jpg'},
				{'ID':'12', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/12.jpg','HighRes':'assets/img/sampleImages/hiRes/12.jpg'},
				{'ID':'13', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/13.jpg','HighRes':'assets/img/sampleImages/hiRes/13.jpg'},
				{'ID':'14', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/14.jpg','HighRes':'assets/img/sampleImages/hiRes/14.jpg'},
				{'ID':'15', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/15.jpg','HighRes':'assets/img/sampleImages/hiRes/15.jpg'},
				{'ID':'16', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/16.jpg','HighRes':'assets/img/sampleImages/hiRes/16.jpg'},
				{'ID':'17', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/17.jpg','HighRes':'assets/img/sampleImages/hiRes/17.jpg'},
				{'ID':'18', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/18.jpg','HighRes':'assets/img/sampleImages/hiRes/18.jpg'},
				{'ID':'19', 'Name':'Sample12','Path':'assets/img/sampleImages/lowRes/19.jpg','HighRes':'assets/img/sampleImages/hiRes/19.jpg'},
			];

	textThemes = [
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Verdana, Geneva, sans-serif', size : 35.2 , lineHeight : 1.4,  weight : 500, fill: '#292f33', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Georgia, serif', size : 26.88 , lineHeight : 1.7,  weight : 500, fill: '#a3acb2'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Verdana, Geneva, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill: '#292f33'},
					],
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 35.2 , lineHeight : 1.4,  weight : 500, fill: '#fff', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'Georgia, serif', size : 26.88 , lineHeight : 1.7,  weight : 500, fill: '#fafafa'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill: '#fff'},
					],
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 35.2 , lineHeight : 1.4,  weight : 500, fill: '#292f33', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 26.88 , lineHeight : 1.7,  weight : 300, fill: '#a3acb2'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill: '#a3acb2'},
					],
				];
	
	textObjects = [
					{
						'ID':'TextObject1','Name':'TextObject1','Path':'assets/img/sampleText/1.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":228.81,"top":151.03,"width":120,"height":120,"fill":"rgb(31,73,125)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.63,"scaleY":1.12,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":225.39,"top":141.36,"width":274,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.97,"scaleY":0.97,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"SAMPLE TEXT","fontSize":40,"fontWeight":"normal","fontFamily":"Georgia, serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":226.36,"top":172.57,"width":339,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.48,"scaleY":0.48,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"New and Improved","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fafafa"}'
					},
					{
						'ID':'TextObject2','Name':'TextObject1','Path':'assets/img/sampleText/2.jpg','JSON':'{"objects":[{"type":"circle","originX":"center","originY":"center","left":111.92,"top":102.08,"width":60,"height":60,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.08,"scaleY":3.08,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","radius":30,"startAngle":0,"endAngle":6.283185307179586},{"type":"i-text","originX":"center","originY":"center","left":112.25,"top":98.02,"width":168,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Sample 2","fontSize":40,"fontWeight":"normal","fontFamily":"Arial, Helvetica, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":111.81,"top":127.41,"width":306,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.37,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"More Information","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fafafa"}'
					},
					{
						'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/3.jpg','JSON':'{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":600,"height":400,"fill":"#000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"rect","originX":"center","originY":"center","left":224.69,"top":79.4,"width":120,"height":120,"fill":"rgb(192,80,77)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.91,"scaleY":1.39,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":97.25,"top":105.02,"width":175,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Themes 3","fontSize":40,"fontWeight":"normal","fontFamily":"Arial, Helvetica, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":79.81,"top":135.19,"width":306,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.38,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"More Information","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":422.78,"top":111.89,"width":120,"height":120,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.45,"scaleY":0.12,"angle":270.46,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'
					},
					{
						'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/4.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":114.17,"top":149.08,"width":120,"height":120,"fill":"rgb(155,187,87)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.95,"scaleY":2.51,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":99.8,"top":247.74,"width":176,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.96,"scaleY":0.96,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Theme 4","fontSize":40,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":79.54,"top":276.92,"width":423,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.3,"scaleY":0.3,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"MORE INFORMATION","fontSize":40,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":19.24,"top":36.97,"width":120,"height":120,"fill":"rgbundefined","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.33,"scaleY":0.08,"angle":89.79,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'
					},
				];

	/***************************************************/
	// 	 CANVAS INIT
	
	$('#wrapCanvas').css('opacity','0');
	
	canvas = new fabric.Canvas('myCanvas',
	{
		backgroundColor:'#fff',
		selection: false,
	});
	
	placeholder = new fabric.Rect(
	{
		left: 0,
		top: 0,
		fill:'#000',
		lockMovementX: true,
		lockMovementY: true,
		lockScalingX: true,
		lockScalingY: true,
		selectable: false,
		opacity:0,
	});
	
	canvas.setWidth(1);
	canvas.setHeight(1);
	placeholder.setWidth(1);
	placeholder.setHeight(1);
	
	/***************************************************/
	// 	SERVER POST TO SERVER

	$.ajax(
	{
		url: 'http://192.168.0.216/AdvAPI/api/WCAPValues/Photocreate/' + productId,
		type: 'GET',
		username: 'WebAPIPhotocreateUser',
		password: '@dvw3b@piu$3r',
		success: function(data)
		{
			// RETURN PRODUCT INFORMATION - USE THIS JQUERY TO AVIOD data[0] REQUEST
			$.each(data, function(index, value)	
			{
				console.log(value)
				associatedThemes = '';
				
				// SET UP CANVAS 
				var canvasInit = new CanvasSetup(value, associatedThemes);

				// PALETTE CONTROLS 
				var documentInit = new DocumentControls(website, user, type, productId, value);

				// LOAD ASSETS 
				// AssetManager(remove, subject, product, themes);
				var assetManagerInit = new AssetManager(website, {Images: stockImages }, {TextThemes : textThemes, TextObjects : textObjects }, associatedThemes );
			});
		}
	});


	/***************************************************/
	// 	SERVER POST TO SERVER

	$.ajax(
	{
		url: 'http://192.168.0.216/AdvAPI/api/WJValues/' + layoutId,
		type: 'GET',
		username: 'WebAPIPhotocreateUser',
		password: '@dvw3b@piu$3r',
		success: function(data)
		{
			console.log('Return matching json matches: ', data);

		}
	});

	$.ajax(
	{
		url: 'http://192.168.0.216/AdvAPI/api/CurrentDate/',
		type: 'GET',
		username: 'WebAPIPhotocreateUser',
		password: '@dvw3b@piu$3r',
		success: function(data)
		{
			console.log('Returned time stamp: ', data)
		}	
	});


	userId = 223;
	uploadsFolder = 'FaceBook';

	// var imageUploadInit = new ImageUploader(userId, uploadsFolder);
	var paletteInit = new Palette(false, "['(0,0,0)','(250,250,250)','(238,236,225)','(31,73,125)','(79,129,189)','(192,80,77)','(155,187,87)','(128,100,162)','(75,172,198)','(247,150,70)']");
	
	/* original

						associatedThemes = {Themes:
									[
										{'ID':'11189','Name':'Theme 1','ImageName':'theme1.jpg','Path':'img/themeIcons/themes/theme1.jpg','JSON':
											'{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":500.01,"height":662.35,"fill":"#000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"image","originX":"center","originY":"center","left":255.1,"top":293.69,"width":158,"height":236,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.24,"scaleY":3.24,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","src":"http://192.168.0.216/_testing/proto2/img/sampleImages/1.jpg","filters":[],"crossOrigin":""},{"type":"rect","originX":"center","originY":"center","left":243.96,"top":207.02,"width":120,"height":120,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.99,"scaleY":1.06,"angle":0,"flipX":false,"flipY":false,"opacity":0.77,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":239.91,"top":186.54,"width":342.71,"height":52,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.89,"scaleY":0.89,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Happy Anniversary","fontSize":40,"fontWeight":"normal","fontFamily":"Georgia, serif","fontStyle":"","lineHeight":1.3,"textDecoration":"","textAlign":"left","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":245.64,"top":230.54,"width":193.32,"height":52,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.46,"scaleY":0.48,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"2005 - 2015","fontSize":40,"fontWeight":"normal","fontFamily":"Times New Roman","fontStyle":"","lineHeight":1.3,"textDecoration":"","textAlign":"left","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fff"}'										},
										{'ID':'11159','Name':'Theme 2','ImageName':'theme2.jpg','Path':'img/themeIcons/themes/theme2.jpg','JSON':
											'{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":500.01,"height":662.35,"fill":"#000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"image","originX":"center","originY":"center","left":36.25,"top":347.68,"width":158,"height":105,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":6.8,"scaleY":6.8,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","src":"http://192.168.0.216/_testing/proto2/img/sampleImages/10.jpg","filters":[],"crossOrigin":""},{"type":"circle","originX":"center","originY":"center","left":106.94,"top":550.88,"width":60,"height":60,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.08,"scaleY":3.08,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","radius":30,"startAngle":0,"endAngle":6.283185307179586},{"type":"i-text","originX":"center","originY":"center","left":251.67,"top":533.55,"width":114.55,"height":49.28,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.41,"scaleY":3.41,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Venice","fontSize":35.2,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1.4,"textDecoration":"","textAlign":"left","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":404.25,"top":610.76,"width":80,"height":52,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"2015","fontSize":40,"fontWeight":"normal","fontFamily":"Times New Roman","fontStyle":"","lineHeight":1.3,"textDecoration":"","textAlign":"left","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fff"}'
										},
										{'ID':'11389','Name':'Theme 3','ImageName':'theme3.jpg','Path':'img/themeIcons/themes/theme3.jpg','JSON':
											'{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":500.01,"height":662.35,"fill":"#000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"image","originX":"center","originY":"center","left":261.67,"top":301.18,"width":158,"height":210,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":4.35,"scaleY":4.35,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","src":"http://192.168.0.216/_testing/proto2/img/sampleImages/3.jpg","filters":[{"type":"Grayscale"}],"crossOrigin":""},{"type":"rect","originX":"center","originY":"center","left":35.46,"top":373.6,"width":120,"height":120,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.75,"scaleY":6.55,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":200.02,"top":550.33,"width":80,"height":52,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.56,"scaleY":2.56,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"2015","fontSize":40,"fontWeight":"normal","fontFamily":"Times New Roman","fontStyle":"","lineHeight":1.3,"textDecoration":"","textAlign":"left","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":199.64,"top":625.74,"width":295.53,"height":52,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.68,"scaleY":0.68,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"PARIS | FRANCE","fontSize":40,"fontWeight":"normal","fontFamily":"Times New Roman","fontStyle":"","lineHeight":1.3,"textDecoration":"","textAlign":"left","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":14.46,"top":32.12,"width":120,"height":120,"fill":"rgbundefined","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.24,"scaleY":0.05,"angle":89.79,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fff"}'},
										],
						}
	*/
});

	/**********************************

	PRODUCT INFO
	costCode: "P"
	cropRatio: ""
	description: "Standard Mug - Left Handed"
	descriptionURL: ""
	displayOrder: "02"
	dpi: 300
	fheightMM: 79
	fwidthMM: 93
	groupName: "PhotoCreate-Mugs"
	heightMM: 79
	id: 24
	isChanged: false
	isDeleted: false
	itemMediaType: ""
	itemName: "Mugs"
	maxQuantity: 0
	numberOfPages: 1
	pcCode: "4685"
	pixH: 933
	pixW: 1098
	postage: 5.98
	price: "0"
	publisherTemplate: ""
	unitPrice: 19.95
	widthMM: 93
	xmpieCampaignID: ""
	xmpieDocumentID: ""

	LAYOUT INFO
	dateModified: "0001-01-01T00:00:00"
	fromWhere: "Prototype"
	isChanged: false
	isDeleted: false
	json: null
	jsonID: 1060
	pageNumber: "00001"
	userID: 1235
	webLayoutID: 0
	webOrderItemID: 41


	

	***************************************************/
