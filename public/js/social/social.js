/// <reference path="../common/common.js" />
window.Snake = window.Snake || {};
(function ($) {
    Snake.Social = function (model) {
        model.login = function (callback) {
            FB.login(callback);
        }

        model.onStatusChange = function (response) {
            if (response.status != 'connected') {
                model.login(model.loginCallback);
            } else {
                model.getMe(model.loadingFinnished)

            }
        }

        model.loadingFinnished = function (response) {
            console.log(response);

            model.playersInfo = {
                Id: response.id,
                Name: response.name
            };

            if (response.picture && response.picture.data && response.picture.data.url) {
                model.playersInfo.Image = response.picture.data.url;
            }

            $('.start-game').show();
        }

        model.getMe = function(callback) {
            FB.api('/me', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function(response){
                if( !response.error ) {
                    callback(response);
                } else {
                }
            });
        }

            model.loginCallback = function (response) {
                if (response.status != 'connected') {
                    top.location.href = 'https://www.facebook.com/appcenter/snake_wars';
                } else {
                }

            }

        model.onAuthResponseChange = function (response) {
        }

        return model;
    }
}($));