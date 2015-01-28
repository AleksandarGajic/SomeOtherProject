var Cache = require('node-cache'),
    Facebook = require('./services/facebook'),
    Profile = require('./entities/fbprofile'),
    Async = require('async'),
    Validation = require('./util/validation'),
    Http = require('http');

var Social = function (config) {
    Validation.Configuration(config);

    config.cache = config.cache || {};
    if (!config.cache.stdTTL) config.stdTTL = 1800;
    if (!config.cache.stdTTL) config.checkperiod = 120;

    var self = this;

    self.strongWordsList = [];
    self.cache = new Cache({ stdTTL: config.cache.stdTTL, checkperiod: config.cache.checkperiod });
    self.facebook = new Facebook(config.facebook);
};

module.exports = Social;

Social.prototype.SortByCreated = function (postA, postB) {
    if (postA.Created === postB.Created) return 0;
    if (postA.Created < postB.Created) return 1;
    return -1;
};

Social.prototype.FacebookSignin = function (req, res) {
    this.facebook.Signin(req, res);
};

Social.prototype.FacebookSigninCallback = function (req, res) {
    this.facebook.SigninCallback(req, res);
};

Social.prototype.FacebookGetLikes = function (req, res) {
    var body = '',
        self = this;
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);
        var validation = Validation.GetFacebookValidation(body);

        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key;
            self.facebook.GetUserLikes(access_token_key, function (data) {
                res.statusCode = 200;
                if (data.error) {
                    res.json({
                        Error: {
                            Message: 'Facebook error get user likes',
                            Inner: data.error
                        },
                        Code: 66
                    });
                } else {
                    res.json({ Likes: data });
                }

                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookCheckLike = function (req, res) {
    var body = '',
        self = this;
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);
        var validation = Validation.GetFacebookValidation(body);

        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key,
                objectId = body.fb.objectId;

            self.facebook.CheckLike(access_token_key, objectId, function (data) {
                res.statusCode = 200;
                res.json({ Like: data });
                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookLikePost = function (req, res) {
    var body = '',
        self = this;
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);
        var validation = Validation.GetFacebookPostComments(body);
        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key,
                postId = body.fb.postId;

            self.facebook.LikePost(access_token_key, postId, function (data) {
                res.statusCode = 200;
                res.json({ Data: data });
                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookUnlikePost = function (req, res) {
    var body = '',
        self = this;
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);
        var validation = Validation.GetFacebookPostComments(body);
        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key,
                postId = body.fb.postId;

            self.facebook.UnlikePost(access_token_key, postId, function (data) {
                res.statusCode = 200;
                res.json({ Data: data });
                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.GetFacebookProfile = function (req, res) {
    var body = '',
        self = this;

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);
        var validation = Validation.GetFacebookValidation(body);

        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key;
            self.facebook.GetProfile(access_token_key, function (data) {
                res.statusCode = 200;
                res.json({ Profile: data });
                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookAddComment = function (req, res) {
    var body = '',
        self = this;
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);
        var validation = Validation.AddFacebookComment(body);
        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key,
                postId = body.fb.postId,
                message = body.fb.message;

            self.facebook.AddComment(access_token_key, postId, message, function (data) {
                res.statusCode = 200;
                res.json({ Data: data });
                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookShare = function (req, res) {
    var body = '',
        self = this;

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);

        var validation = Validation.GetFacebookShare(body);
        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key,
                message = body.fb.message,
                picture = body.fb.picture,
                name = body.fb.name,
                description = body.fb.description,
                link = body.fb.link,
                caption = body.fb.caption;
            self.facebook.ShareMessage(req, access_token_key, message, picture, name, description, link, caption, function (results) {
                res.statusCode = 200;
                if (results && results.error) {
                    res.json({
                        Error: {
                            Message: 'Facebook share is unssuccess',
                            Inner: results.error
                        },
                        Code: 55
                    });
                } else {
                    res.json(results);
                }

                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookGetPostComments = function (req, res) {
    var body = '',
        self = this;

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);

        var validation = Validation.GetFacebookPostComments(body);
        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key,
                postId = body.fb.postId,
                commentId = body.fb.commentId,
                untilDate = body.fb.untilDate,
                sinceDate = body.fb.sinceDate,
                count = parseInt(body.fb.count);

            self.facebook.GetPostComments(req, access_token_key, postId, commentId, untilDate, sinceDate, count, function (results) {
                res.statusCode = 200;
                if (results && results.error) {
                    res.json({
                        Error: {
                            Message: 'Facebook get comments is unssuccess',
                            Inner: results.error
                        },
                        Code: 55
                    });
                } else {
                    res.json(results);
                }

                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookGetAlbumPhotos = function (req, res) {
    var body = '',
        self = this;

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);

        var validation = Validation.GetFacebookValidation(body);
        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key,
                pageId  = body.fb.pageId;

            self.facebook.GetAlbumPhotos(access_token_key, pageId, function (results) {
                res.statusCode = 200;
                if (results && results.error) {
                    res.json({
                        Error: {
                            Message: 'Facebook get photos is unssuccess',
                            Inner: results.error
                        },
                        Code: 57
                    });
                } else {
                    res.json(results);
                }

                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookGetCredentials = function (req, res) {
    var body = '',
        self = this;
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);

        var validation = Validation.GetCredentials(body);
        if (validation.StatusCode == 200) {
            var userKey = body.user_key;
            self.facebook.GetCredentials(req, userKey, function (results) {
                res.statusCode = 200;
                if (results.error) {
                    res.json({
                        Error: {
                            Message: 'Facebook credentials are missing',
                            Inner: results.error
                        },
                        Code: 32
                    });
                } else {
                    res.json(results);
                }

                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.FacebookSignout = function (req, res) {
    var body = '',
        self = this;
    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
        body = self.ParseBody(body);

        var validation = Validation.GetFacebookValidation(body);
        if (validation.StatusCode == 200) {
            var access_token_key = body.fb.access_token_key;
            self.facebook.Signout(req, access_token_key, function (results) {
                res.statusCode = 200;
                if (results.error) {
                    res.json({
                        Error: {
                            Message: 'Facebook credentials are missing',
                            Inner: results.error
                        },
                        Code: 32
                    });
                } else {
                    res.json(results);
                }

                res.end();
            });
        } else {
            res.statusCode = validation.StatusCode;
            res.json(validation.Body);
            res.end();
        }
    });
};

Social.prototype.GetConfiguration = function () {
    var self = this;
    self.cache.get('configuration', function (err, value) {
        if (err) {
            console.log(err);
        }

        if (value && value['configuration'] && value['configuration'].StrongWords) {
            self.strongWordsList = value['configuration'].StrongWords;
        } else {
            var options = {
                host: 'native.config.touch.nitro.vegaitsourcing.rs',
                path: '/config/nsa/Default.js'
            };

            callback = function(response) {
                var str = '';
                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    self.strongWordsList = self.ParseBody(str);
                    self.cache.set('configuration', self.strongWordsList, function (err, success) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            }

            Http.request(options, callback).end();
        }
    });
}

Social.prototype.ParseBody = function (body) {
    try {
        body = JSON.parse(body);
    } catch (e) {
        body = {};
    }

    return body;
}
