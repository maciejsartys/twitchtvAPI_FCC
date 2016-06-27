'use strict';

(function() {

    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        }
        else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    
     var Streamer = function(name, activity, status, icon) {
            this.name = name;
            this.activity = activity;
            this.icon = icon;
            this.status = status;
        };

    //-----------------------------------------------------------------------------
    // Twitch.tv API interface

    var ApiInterface = function(app) {
        this.app = app;
        this.connectionErrorMessage = "Can't connect to Twitch.tv, please try again later.";
    };

    ApiInterface.prototype.queryApi = function(uri, success) {
        // build and sent async get request to api
        // err, success - callback functions for request

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status >= 200 || request.status < 400) {
                    success(request);
                }
                else {
                    this.app.view.errorDiv = this.connectionErrorMessage.bind;
                }
            }
        }.bind(this);

        request.open('GET', 'https://api.twitch.tv/kraken/' + uri, true);

        request.setRequestHeader('Accept', 'application/vnd.twitchtv.v3+json');
        request.send();
    };

    ApiInterface.prototype.getChannelDetails = function(channel) {
        this.queryApi('channels/' + channel,
            
            function(request) {
                var response = JSON.parse(request.responseText);
                var channelData = new Streamer(response.name, response.status, null, response.logo);
                this.app.scope.channelsData.push(channelData);
                this.app.view.renderList();
        }.bind(this));
    };

    //-----------------------------------------------------------------------------
    // View Object

    var View = function(scope) {
        this.scope = scope;
        this.list = document.getElementById('streamers');
    };

    View.prototype.renderList = function() {
        this.list.innerHTML = '';

        this.scope.channelsData.forEach(function(element) {
            var li = '<li class=\'' + element.status + '\'>';
            li += '<div><img src=\'' + element.icon + '\'></div>';
            li += '<div class=\'name\'>' + element.name + '</div>';
            li += '<div class=\'activity\'>' + element.activity + '</div>' + '</li>';
            this.list.insertAdjacentHTML('beforeend', li);
        }.bind(this));
    };

    //-----------------------------------------------------------------------------
    // Main App

    var App = function() {

        this.scope = {};

        this.view = new View(this.scope);
        this.api = new ApiInterface(this);

        this.scope.channelsNames = ['ESL_SC2', 'freecodecamp', 'storbeck'];

        this.scope.channelsData = [];
    };
    
    App.prototype.getChannelsData = function(channelsNames) {
        channelsNames.forEach(function(channel) {
            this.api.getChannelDetails(channel);
        }.bind(this));
    };
    
    App.prototype.start = function() {
        this.getChannelsData(this.scope.channelsNames);
    };
    
    var app = new App;
    ready(app.start.bind(app));

})();