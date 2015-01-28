var util = require('util'),
    Profile = require('./fbprofile');

var Comment = function (data) {
    if (data) {
        this.Id = data.id;
        this.Created = data.created;
        this.Message = data.message;
        this.Profile = data.profile;
        this.NumberOfLikes = data.numberOfLikes;
        this.UserLike = data.userLike;
        this.CanComment = data.canComment;
        this.CommentCount = data.commentCount;
    }
};

module.exports = Comment;