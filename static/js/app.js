'use strict';

(
    function() {

        function ready(fn) {
            if (document.readyState != 'loading') {
                fn();
            }
            else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        }

        var queryApi = function(uri, err, success) {
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

        var renderList = function() {

            var streamer = function(name, activity, status, icon) {
                this.name = name;
                this.activity = activity;
                this.icon = icon;
                this.status = status;
            };


            var streamersList = [
                new streamer("ESL_SC2", 'RERUN: StarCraft 2 - LiquidBunny vs. Petraeus (TvZ) - WCS Premier League Season 2 2015 - Ro32 Group A',
                    'online', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ogamingsc2-profile_image-9021dccf9399929e-300x300.jpeg'),
                new streamer("freecodecamp", 'freecodecamp', 'online', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ogamingsc2-profile_image-9021dccf9399929e-300x300.jpeg'),
                new streamer("storbeck", 'storbeck', 'online', 'https://static-cdn.jtvnw.net/jtv_user_pictures/ogamingsc2-profile_image-9021dccf9399929e-300x300.jpeg')
            ];

            var listHtml = document.getElementById('streamers');

            streamersList.forEach(function(element) {
                var li = '<li class=\'' + element.status + '\'>';
                li += '<div><img src=\'' + element.icon + '\'></div>';
                li += '<div class=\'name\'>' + element.name + '</div>';
                li += '<div class=\'activity\'>' + element.activity + '</div>' + '</li>';
                listHtml.insertAdjacentHTML('beforeend', li);
            });

        };

        ready(renderList);

    })();