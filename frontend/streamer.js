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
var Streamer = function(name, activity, status, icon, url) {
    this.name = name;
    this.activity = activity;
    this.icon = icon;
    this.status = status;
    this.url = url;
};