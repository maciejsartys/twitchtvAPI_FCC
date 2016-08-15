// View Object

var View = function(scope) {
    this.scope = scope;
    this.mainChannel = {};
    this.mainChannel['name'] =  document.getElementsByClassName('main-channel-name').item(0);
    this.mainChannel['description'] = document.getElementsByClassName('main-channel-description').item(0);
    this.otherChannels = document.getElementsByClassName('channels').item(0);
    this.errorDiv = document.getElementById('error');
};

View.prototype.renderPage = function() {
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
    self.mainChannel.name.innerHTML = '<a href="' + channel.url + '">Free Code Camp</a>';
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
        return this.channelToDOM(element.name, element.activity, element.icon, element.url);
    }, this).reduce(function(prev, curr) {
        return prev + curr;
    });

    self.otherChannels.insertAdjacentHTML('beforeend', listHTML);
};

View.prototype.channelToDOM = function(name, description, image, link) {
    return '<div class="channel clearfix">' +
        '<a href="' + link + '">' +
            '<h3 class="channel-title">' + name + '</h3>' +
        '</a>' +
        '<p class="channel-description">' +
            description + '</p>' +
        '<div class="channel-img">' +
            '<img src="' + image + '"/></div>' +
        '</div>';
};