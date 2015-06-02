/***********************************************
    Function:   Server Query
    Author:     Adam Lawrence
    Contact:    adam@adamlawrencedesign.com 
*************************************************/

function ServerRequest(url, type, data, callback)
{
    this.url = url;
    this.type = type;
    this.data = data;
    this.callback = callback;
    this.init();
}

ServerRequest.prototype.getRequest = function(url)
{
    var _this = this;

    $.ajax(
    {
        url: url, 
        type: 'GET',
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        success: function(data)
        {
            _this.callback(data);
        }
    })
};

ServerRequest.prototype.postRequest = function(url, data)
{
    var _this = this;

    $.ajax(
    {
        url: url, 
        type: 'POST',
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        data: data,
        success: function(data)
        {
            _this.callback(data);
        }
    });   
}

ServerRequest.prototype.putRequest = function(url, data)
{
    var _this = this;

    $.ajax(
    {
        url: url, 
        type: 'PUT',
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        data: data,
        success: function(data)
        {
            _this.callback(data);
        }
    });   
}

ServerRequest.prototype.init = function()
{
    switch(this.type)
    {
        case 'GET':
            this.getRequest(this.url)
        break;

        case 'POST':
            this.postRequest(this.url, this.data)
        break;

        case 'PUT':
            this.putRequest(this.url, this.data)
        break;
    }
};
