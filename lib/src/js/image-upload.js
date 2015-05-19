/***********************************************
    Function:   Standard Page Controllers
    Author:     Adam Lawrence
    Contact:    adam@adamlawrencedesign.com 
*************************************************/
// ENABLE BACK LINKS
// BUILD PRODUCT INFO
// EXPORT

function ImageUploader(userId, folder, callback)
{
    this.userId = userId;
    this.folder = folder;
    this.callback = callback;
    this.init();
}

ImageUploader.prototype.loadImages = function()
{
    var _this = this;

    var vUserID = '224224';

    $.ajax({
            url: "http://192.168.0.216/AdvAPI/api/UploadFile/" + vUserID + "/List/",
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
                                'ID': this.id,
                                'Name': this.id
                            });

                });
                
                console.log('Get the image pathway: ', obj);
                var addImageList = new ListBuilder('uploadedImages', obj, true);

                _this.callback();
            }
    });    
};

ImageUploader.prototype.init = function()
{
    var _this = this;

    console.log('User Id: ', this.userId, ', Folder: ', this.folder);
    this.loadImages();

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
        if (files.length > 0){
            imgData.append("ImageUploaded", files[0]);
        }

        console.log('image data: ', imgData, ', files: ', files)
       
        // Make Ajax request with the contentType = false, and procesData = false
        $.ajax({
            type: "POST",
            url: "http://192.168.0.216/AdvAPI/api/UploadFile/" + "Guests" + "/" + "224224"+ "/",
            username: 'WebAPIPhotocreateUser',
            password: '@dvw3b@piu$3r',
            contentType: false,
            processData: false,
            data: imgData,
            //Giving message to user on successfull upload
            success: function ()
            {
                location.reload();                    
                alert("Image successfully uploaded!!!");
            }          
        });
    });   

};

/*
WEB SERVER INFO

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
