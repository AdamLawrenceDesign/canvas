/***********************************************
    Function:   Standard Page Controllers
    Author:     Adam Lawrence
    Contact:    adam@adamlawrencedesign.com 
*************************************************/
// ENABLE BACK LINKS
// BUILD PRODUCT INFO
// EXPORT

function ImageUploader(userId, folder)
{
    this.userId = userId;
    this.folder = folder;
    this.init();
}

ImageUploader.prototype.init = function()
{
    var _this = this;

    $('#upload').on('click', function(event)
    {
        $.ajax({
            url: "http://192.168.0.216/AdvAPI/api/UploadFile/" + _this.userId + "/List/", 
            username: 'WebAPIPhotocreateUser',
            password: '@dvw3b@piu$3r',
            type: "GET",
            success: function (data)
            {
                $.each(data, function (index)
                    {
                        var theCachedImage = new Image();
                        /* Boolean that tells us whether or not the image has finished loading. */
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
        event.preventDefault();
    });

    $('#btnBrowse').bind("click", function()
    {
        $('#fileUpload').click();
    });

    $('#fileUpload').change(function()
    {
        document.getElementById("fileSelected").value = $('#fileUpload').val().substring(12,$('#fileUpload').val().length);
    });


    $('#btnUploadFile').on('click', function ()
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
            url: "../AdvAPI/api/UploadFile/" + _this.folder + "/" + _this.userId + "/",
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