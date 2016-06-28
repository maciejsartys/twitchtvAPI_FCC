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
        this.apiErrorMessage = 'Twitch.tv API error occured';
    };

    ApiInterface.prototype.queryApi = function(uri, success) {
        // build and sent async get request to api
        // uri - API endpoint
        // success - callback functions for request

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status >= 200 || request.status < 400) {
                    success(JSON.parse(request.responseText));
                }
                else {
                    this.app.view.errorDiv.innerHTML = this.connectionErrorMessage;
                }
            }
        }.bind(this);

        request.open('GET', 'https://api.twitch.tv/kraken/' + uri, true);
        request.onerror = function(e) {
            this.app.view.errorDiv.innerHTML = this.apiErrorMessage;
        }.bind(this);

        request.setRequestHeader('Accept', 'application/vnd.twitchtv.v3+json');
        request.send();
    };

    ApiInterface.prototype.getChannelDetails = function(channel) {
        this.queryApi('channels/' + channel,
            
            function(response) {
                var channelResponse = response;
                
                this.queryApi('streams/' + channel, function(response) {
                    var isOnline = response.stream == null ? 'false' : 'true';
                    var channelData = new Streamer(channelResponse.name, channelResponse.status, isOnline, channelResponse.logo);
                    this.app.scope.channelsData.push(channelData);
                    this.app.view.renderList();
                }.bind(this));
        }.bind(this));
    };

    //-----------------------------------------------------------------------------
    // View Object

    var View = function(scope) {
        this.scope = scope;
        this.list = document.getElementById('streamers');
        this.errorDiv = document.getElementById('error');
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

        this.scope.channelsNames = ['ESL_SC2', 'freecodecamp', 'storbeck', 'OgamingSC2'];

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