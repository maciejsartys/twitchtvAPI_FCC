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
                var channelData = new Streamer(channelResponse.name, channelResponse.status,
                streamerStatus, channelResponse.logo, channelResponse.url);
                this.app.scope.channelsData.push(channelData);
                if (this.app.scope.channelsData.length === dataItemsCount) {
                    this.app.view.renderList();
                }
            }.bind(this));
        }.bind(this));
};