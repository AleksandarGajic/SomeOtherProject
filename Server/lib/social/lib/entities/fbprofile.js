var util = require('util'),
    Profile = require('./profile');

var FacebookProfile = function (data) {
    if (data) {
        Profile.call(this, data);
        this.Link = data.link;
        if (data.picture) {
            this.Picture = data.picture.data.url;
        }
    }
};

util.inherits(FacebookProfile, Profile);
module.exports = FacebookProfile;
