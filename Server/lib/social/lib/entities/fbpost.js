var util = require('util'),
    Post = require('./post'),
    Profile = require('./fbprofile');

var FacebookPost = function (data) {
    if (data) {
        Post.call(this, data);
        this.Type = 'fb';
        this.Created = new Date(data.created);
        this.Message = data.message;
        this.Profile = new Profile(data.profile);
        this.NumberOfLikes = data.numberOfLikes;
        this.NumberOfShares = data.numberOfShares;
        this.Picture = data.picture;
        this.Link = data.link;
        this.Name = data.name;
        this.ObjectId = data.objectId;
        this.TypeOfPost = data.type;
    }
};

util.inherits(FacebookPost, Post);
module.exports = FacebookPost;