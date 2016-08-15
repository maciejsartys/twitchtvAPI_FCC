/*global Streamer, View, ApiInterface */

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
                var channelData = new Streamer(channelResponse.name, channelResponse.status,
                streamerStatus, channelResponse.logo, channelResponse.url);
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