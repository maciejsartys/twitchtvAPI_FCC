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

    //-----------------------------------------------------------------------------

    /**
     * Streamer Object
     * 
     * Container for a streamer data to be dislayed 
     * 
     * @param {string} Username [GET /channels/:channel/] => display_name
     * @param {string} Current user activity on channel - [GET /channels/:channel/] => status
     * @param {string} Online/offline flag based on [GET /streams/:channel/] => stream
     * @param {string} Channel logo url - [GET /channels/:channel/] => logo
     */
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

    ApiInterface.prototype.getChannelDetails = function(channel, dataItemsCount) {
        this.queryApi('channels/' + channel,

            function(response) {
                var channelResponse = response;

                this.queryApi('streams/' + channel, function(response) {
                    var streamerStatus = response.stream == null ? 'offline' : 'online';
                    var channelData = new Streamer(channelResponse.name, channelResponse.status, streamerStatus, channelResponse.logo);
                    this.app.scope.channelsData.push(channelData);
                    if (this.app.scope.channelsData.length === dataItemsCount) {
                        this.app.view.renderList();
                    }
                }.bind(this));
            }.bind(this));
    };

    //-----------------------------------------------------------------------------
    // View Object

    var View = function(scope) {
        this.scope = scope;
        this.mainChannel = {};
        this.mainChannel['description'] = document.getElementsByClassName('main-channel-description').item(0);
        this.otherChannels = document.getElementsByClassName('channels').item(0);
        this.errorDiv = document.getElementById('error');
    };
    
    View.prototype.renderPage = function () {
        var self = this;
        
        var mainChannel = self.scope.channelsData.filter(function(channel) {
            return channel.name === 'freecodecamp';
        }, self);
        
        var otherChannels = self.scope.channelsData.filter(function(channel) {
            return channel.name !== 'freecodecamp';
        }, self);
        
        self.updateMainChannel(mainChannel.pop());
        self.renderList(otherChannels);
    };
    
    /**
     * @param {Streamer Object} Freecodecamp channel data
     */
    View.prototype.updateMainChannel = function(channel) {
        var self = this;
        
        self.mainChannel.description.innerHTML = channel.activity;
    };
    
    /**
     * Render list of Streamers with online channels on top
     * 
     * @param {Array<Object>} Streamers
     */

    View.prototype.renderList = function(channels) {

        
        var self = this;
        
        self.otherChannels.innerHTML = '';
        
        //online channels first
        var listHTML = channels.filter(function(element) {
            return element.status === 'online';
        }).concat(channels.filter(function(element) {
            return element.status === 'offline';
        })).map(function(element) {
            return this.channelToDOM(element.name, element.activity, element.icon);
        },this).reduce(function(prev, curr) {
            return prev + curr;
        });
        
        self.otherChannels.insertAdjacentHTML('beforeend', listHTML);
    };

    View.prototype.channelToDOM = function(name, description, image){
            return '<div class="channel clearfix">'
                + '<h3 class="channel-title">'+name+'</h3>'
                + '<p class="channel-description">'
                + description + '</p>'
                + '<div class="channel-img">'
                + '<img src="'+image+'"/></div>'
                + '</div>';
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

    App.prototype.getChannelsData = function(channelsNames, callback) {
        var self = this;

        channelsNames.forEach(function(channel, index, arr) {
            self.api.queryApi('channels/' + channel, function(response) {
                var channelResponse = response;
                self.api.queryApi('streams/' + channel, function(response) {
                    var streamerStatus = response.stream == null ? 'offline' : 'online';
                    var channelData = new Streamer(channelResponse.name, channelResponse.status, streamerStatus, channelResponse.logo);
                    self.scope.channelsData.push(channelData);
                    if (self.scope.channelsData.length === arr.length) {
                        callback();
                    }
                });
            });
        });
    };

    App.prototype.start = function() {
        var self = this;
        self.getChannelsData(self.scope.channelsNames, self.view.renderPage.bind(self.view));
    };

    var app = new App;
    ready(app.start.bind(app));

})();