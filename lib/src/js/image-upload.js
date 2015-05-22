/***********************************************
    Function:   Standard Page Controllers
    Author:     Adam Lawrence
    Contact:    adam@adamlawrencedesign.com 
*************************************************/

function ImageUploader(userId, defaults, folder, callback)
{
    this.userId = userId;
    this.folder = folder;
    this.defaults = defaults;
    this.callback = callback;
    this.defaults = defaults;
    this.loadDefaults();
}

ImageUploader.prototype.loadImages = function()
{
    var _this = this;

    $.ajax({
            url: "http://192.168.0.216/AdvAPI/api/UploadFile/" + _this.userId + "/List/",
            username: 'WebAPIPhotocreateUser',
            password: '@dvw3b@piu$3r',
            type: "GET",
            success: function(data)
            {
                console.log('Returned Images from uploads: ', data)

                var obj = [];

                $.each(data, function (index)
                {
                    obj.push(
                            {
                                'HighRes': 'http://192.168.0.216' + this.webServerPath,
                                'Path': 'http://192.168.0.216' + this.webServerPath,
                                'ID': _this.userId,
                                'Name': _this.userName
                            });

                });
                
                console.log('Get the image pathway: ', obj);
                var addImageList = new ListBuilder('uploadedImages', obj, true);

                _this.callback();
            }
    }).fail(function()
    {
        _this.callback();
    });    
};

ImageUploader.prototype.init = function()
{
    var _this, node;

    _this = this;
    node = this.defaults;

    // LOADS IMAGES FROM PREVIOUS SESSION THAT MATCHES USER ID
    this.loadImages();

    $(node.button).bind("click", function()
    {
        $(node.file).click();
    });

    $(node.file).change(function ()
    {
        $(node.display).val($(node.file).val().substring(12, $(node.file).val().length));
    });

    $(node.trigger).on('click', function()
    {
        var imgData = new FormData();
        var files = $(node.file).get(0).files;

        // Add the uploaded image content to the form data collection
        if (files.length > 0)
        {
            imgData.append("ImageUploaded", files[0]);
        }

        console.log('image data: ', imgData, ', files: ', files)
       
        // Make Ajax request with the contentType = false, and procesData = false
        $.ajax({
            type: "POST",
            url: "http://192.168.0.216/AdvAPI/api/UploadFile/" + "Guests" + "/" + _this.userId + "/",
            username: 'WebAPIPhotocreateUser',
            password: '@dvw3b@piu$3r',
            contentType: false,
            processData: false,
            data: imgData,
            //Giving message to user on successfull upload
            success: function ()
            {
                location.reload();                    
                // alert("Image successfully uploaded!!!");
            }          
        });
    });   
};

ImageUploader.prototype.loadDefaults = function()
{
    if(!this.defualts)
    {
        this.defaults = {
                            'wrap': '#wrap-upload',
                            'file': '#upload-file',   
                            'button': '#upload-button',
                            'display': '#upload-display',
                            'trigger': '#upload-init',
                            'imageList': '#uploadedImages'
                        };
    }

    this.init();
};

/*
WEB SERVER INFO

<div id="wrap-upload-ctl" class="relative">
    <input id="fileUpload" type="file" />
    <button id="upload-button" class="button round-sd txt_sm">Browse</button>
    <input id="upload-display" type="text" disabled="disabled"></input>
</div> 

<input type="text" id="fileSelected" disabled="disabled" class="hidden" /><br /><br />
<button id="btnUploadFile" type="button" class="button round txt_sm" data-toggle="tooltip">UPLOAD IMAGE</button>

<ul id="uploadedImages" class="clearfix relative halfs m_l_top">
</ul>


GET api/UploadFile/{userID}

{
  "isChanged": true,
  "isDeleted": false,
  "id": 1,
  "subFolder": "sample string 2",
  "userID": 3,
  "webServerPath": "sample string 4",
  "thumbnailPath": "sample string 5",
  "thumbnailMade": true,
  "dateUploaded": "2015-05-18T11:01:42.9076081+10:00",
  "status": "sample string 8"
}

GET api/UploadFile/{userID}/List

$.ajax({
        url: "../AdvAPI/api/UploadFile/" + vUserID + "/List/",
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        type: "GET",
        success: function (data)
        {
            $.each(data,
                function (index)
                {
                    var theCachedImage = new Image();
                    // Boolean that tells us whether or not the image has finished loading. 
                    var theBoolean;

                    $(theCachedImage).load(function ()
                    {
                        theBoolean = true;
                    });

                    theCachedImage.id = "rcorners";
                    theCachedImage.src = data[index].webServerPath;
                    $('#UploadImage').append(theCachedImage);

                });
            $("#loader").hide("slow");
        }
});

$('#btnBrowse').bind("click", function ()
{
    $('#fileUpload').click();
});

$('#fileUpload').change(function ()
{
    document.getElementById("fileSelected").value = $('#fileUpload').val().substring(12,$('#fileUpload').val().length);
});

$('#btnUploadFile').on('click', function()
{
    var imgData = new FormData();
    var files = $("#fileUpload").get(0).files;

    // Add the uploaded image content to the form data collection
    if (files.length > 0) {
        imgData.append("ImageUploaded", files[0]);
    }

    // Make Ajax request with the contentType = false, and procesData = false
    $.ajax({
        type: "POST",
        url: "../AdvAPI/api/UploadFile/" + vSubFolder + "/" + vUserID + "/",
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        contentType: false,
        processData: false,
        data: imgData,
        //Giving message to user on successfull upload
        success: function () {
            location.reload();                    
            alert("Image successfully uploaded!!!");
        }          
    });

    });
});    
*/
