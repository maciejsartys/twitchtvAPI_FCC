'use strict';

(function() {

    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        }
        else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    //-----------------------------------------------------------------------------
    // Twitch.tv API interface

    var ApiInterface = function($app) {}

    ApiInterface.prototype.queryApi = function(uri, err, success) {
        // build and sent async get request to api
        // err, success - callback functions for request

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status >= 200 || request.status < 400) {
                    success(request);
                }
                else {
                    err(request);
                }
            }
        };

        request.open('GET', 'https://api.twitch.tv/kraken/' + uri, true);

        request.setRequestHeader('Accept', 'application/vnd.twitchtv.v3+json');
        request.send();
    };

    ApiInterface.prototype.getChannelDetails = function(channel) {
        this.queryApi('channels/' + channel,
            function(request) {
                console.log();
            });
    };

    //-----------------------------------------------------------------------------
    // View Object

    var View = function(scope) {
        var self = this;
        this.scope = scope;
        this.list = document.getElementById('streamers');
    };

    View.prototype.renderList = function() {

        this.scope.streamersData.forEach(function(element) {
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

        var streamer = function(name, activity, status, icon) {
            this.name = name;
            this.activity = activity;
            this.icon = icon;
            this.status = status;
        };

        this.scope = {}

        this.view = new View(this.scope);

        this.scope.channelsNames = ['ESL_SC2', 'freecodecamp', 'storbeck'];

        this.scope.streamersData = [
            new streamer("ESL_SC2", 'RERUN: StarCraft 2 - LiquidBunny vs. Petraeus (TvZ) - WCS Premier League Season 2 2015 - Ro32 Group A',
                'online', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ogamingsc2-profile_image-9021dccf9399929e-300x300.jpeg'),
            new streamer("freecodecamp", 'freecodecamp', 'online', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ogamingsc2-profile_image-9021dccf9399929e-300x300.jpeg'),
            new streamer("storbeck", 'storbeck', 'online', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ogamingsc2-profile_image-9021dccf9399929e-300x300.jpeg')
        ];
        
        this.view.renderList();
    };
    
    ready(App);
    
    
})();