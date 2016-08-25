/*global Streamer */

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

    function onError(e) {
        alert("Podczas pobierania dokumentu wystąpił błąd " + e.target.status + ".");
    }

    request.onerror = onError;

    request.onreadystatechange = function() {
        var self = this;
        if (request.readyState === 4) {
            if (request.status >= 200) {
                success(JSON.parse(request.responseText));
            }
            else {
                self.app.view.errorDiv.innerHTML = self.connectionErrorMessage;
            }
        }
    };

    request.open('GET', 'https://api.twitch.tv/kraken/' + uri, true);
    request.onerror = function(e) {
        var self = this;
        self.app.view.errorDiv.innerHTML = self.apiErrorMessage;
    };

    request.setRequestHeader('Accept', 'application/vnd.twitchtv.v3+json');
    request.send();
};

/**
 * Query API for single channel data from data list. 
 * 
 * @param {Array<Object>} Streamers
 * @param {number}
 */

ApiInterface.prototype.getChannelDetails = function(channel, dataItemsCount) {
    console.log(typeof channel, typeof dataItemsCount);
    var self = this;
    self.queryApi('channels/' + channel,

        function(response) {
            var channelResponse = response;

            self.queryApi('streams/' + channel, function(response) {
                var streamerStatus = response.stream == null ? 'offline' : 'online';
                var channelData = new Streamer(channelResponse.name, channelResponse.status,
                    streamerStatus, channelResponse.logo, channelResponse.url);
                self.app.scope.channelsData.push(channelData);
                if (self.app.scope.channelsData.length === dataItemsCount) {
                    self.app.view.renderList();
                }
            });
        });
};