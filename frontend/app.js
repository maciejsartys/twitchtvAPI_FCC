/*global Streamer, View, ApiInterface */

// Main App

var App = function() {

    this.scope = {};

    this.view = new View(this.scope);
    this.api = new ApiInterface(this);

    this.scope.channelsNames = ["ESL_SC2", "OgamingSC2", "comster404", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

    this.scope.channelsData = [];
};

App.prototype.getChannelsData = function(channelsNames, callback) {
    var self = this;

    var finishRequest = function(channelData, callback, arr) {
        self.scope.channelsData.push(channelData);
        if (self.scope.channelsData.length === arr.length) {
            callback();
        }
    };

    channelsNames.forEach(function(channel, index, arr) {
        self.api.queryApi('channels/' + channel, function(response) {
            var channelResponse = response;
            console.log(channelResponse);
            if (channelResponse.status === 422) {
                var channelData = new Streamer(channel, 'Channel closed', 'closed', null, null);
                console.log(channelData);
                finishRequest(channelData, callback, arr);
            }
            else {
                self.api.queryApi('streams/' + channel, function(response) {
                    var streamerStatus = response.stream == null ? 'offline' : 'online';
                    var channelData = new Streamer(channelResponse.name, channelResponse.status,
                        streamerStatus, channelResponse.logo, channelResponse.url);
                    finishRequest(channelData, callback, arr);
                });
            }
        });
    });
};

App.prototype.start = function() {
    var self = this;
    self.getChannelsData(self.scope.channelsNames, self.view.renderPage.bind(self.view));
};