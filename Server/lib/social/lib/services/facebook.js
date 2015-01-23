var util = require('util'),
    fb = require('fb'),
    Ext = require('./../util/ext'),
    Page = require('./../entities/page'),
    Profile = require('./../entities/fbprofile'),
    Comment = require('./../entities/comment'),
    Cache = require('node-cache'),
    Path = require('path'),
    Async = require('async'),
    Post = require('./../entities/fbpost');

var Facebook = function (data) {
    data.cache = data.cache || {};
    if (!data.cache.stdTTL) data.stdTTL = 1800;
    if (!data.cache.stdTTL) data.checkperiod = 120;

    var meFields = 'name,picture,link,movies.fields(picture.width(200).height(200),category,name,description,description_html),television.fields(picture.width(200).height(200),category,name,description,description_html)',
        friendFields = 'friends.fields(name,picture,link,movies.fields(picture.width(200).height(200),category,name,description,description_html),television.fields(picture.width(200).height(200),category,name,description,description_html))',
        fbData = data,
        cache = new Cache({ stdTTL: data.cache.stdTTL, checkperiod: data.cache.checkperiod }),

        _sortByNumberOfLikes = function (pageA, pageB) {
            if (pageA.Likes.length === pageB.Likes.length) return 0;
            if (pageA.Likes.length < pageB.Likes.length) return 1;
            return -1;
        },

        _appendPages = function (allPages, pages, profile) {
            for (var i = 0; i < pages.length; i++) {
                var exists = false;

                var categoryName = pages[i].category.trim().toLowerCase();
                if (categoryName == 'movie' || categoryName == 'tv show') {
                    for (var j = 0; j < allPages.length; j++) {
                        var allPage = allPages[j];
                        if (allPage.Id == pages[i].id) {
                            exists = true;
                            allPage.Likes.push(profile);
                            break;
                        }
                    }

                    if (!exists) {
                        var page = new Page(pages[i]);
                        page.Likes.push(profile);
                        allPages.push(page);
                    }
                }
            }
        };

    this.GetUserLikes = function (access_token, callback) {
        fb.setAccessToken(access_token);
        fb.api(
            {
                method: 'fql.query',
                query: 'SELECT object_id FROM like WHERE user_id = me()'
            },
            function(data) {
                if (data.error || data.error_msg) {
                    callback({ error: data.error + data.error_msg });
                } else {
                    callback(data);
                }
            }
        );
    };

    this.CheckLike = function (access_token, objectId, callback) {
        fb.setAccessToken(access_token);
        fb.api(
            {
                method: 'fql.query',
                query: 'SELECT object_id FROM like WHERE user_id = me() and object_id = "' + objectId + '"'
            },
            function(data) {
                if (data.error) {
                    callback({ error: data.error });
                } else {
                    callback(data);
                }
            }
        );
    };

    this.GetProfile = function (access_token, callback) {
        fb.setAccessToken(access_token);
        fb.api('/me', { fields : 'picture.width(310).height(420),name' } , function(response) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                callback(new Profile(response))
            }
        });
    };

    this.GetPeopleWhoLikePage = function (pageId, access_token, callback) {
        fb.api(
            {
                method: 'fql.query',
                query: 'SELECT id,name,pic_square,url FROM profile WHERE id in (SELECT uid FROM page_fan WHERE page_id = ' + pageId + ' AND (uid = me() OR uid IN (SELECT uid2 FROM friend WHERE uid1=me())))'
            },
            function(data) {
                if (data.error || data.error_msg) {
                    callback({ error: data.error + data.error_msg });
                } else {
                    callback(data);
                }
            }
        );
    };

    this.Signout = function (req, access_token, callback) {
        fb.setAccessToken(access_token);
        fb.api("/me/permissions", "delete", function(response){
            if (response.error) {
                callback({ error: response.error });
            } else {
                callback(response);
            }
        });
    };

    this.Signin = function (req, res) {
        var user_key = '';
        if (req.query && req.query['user_key']) {
            user_key = req.query['user_key'];
        }

        var premmisions = 'publish_stream,user_likes,friends_likes,read_stream,publish_actions,video_upload,status_update,create_note,photo_upload,share_item';
        var uri =  'https://graph.facebook.com/oauth/authorize?client_id=' + fbData.client_id + '&redirect_uri=http://' + req.headers.host + '/social/facebook/signin_callback?user_key=' + user_key +'&scope=' + premmisions;
        res.redirect(uri);
        res.end();
    };

    this.SigninCallback = function (req, res) {
        var code, user_key;
        if (req.query) {
            if (req.query['user_key']) {
                user_key = req.query['user_key'];
            }

            if (req.query['code']) {
                code = req.query['code'];
            }
        }

        if (code && user_key) {
            fb.api('oauth/access_token', {
                client_id: fbData.client_id,
                client_secret: fbData.client_secret,
                redirect_uri: 'http://' + req.headers.host + '/social/facebook/signin_callback?user_key=' + user_key,
                code: code
            },
            function(result) {
                if (result.access_token) {
                    cache.set(user_key, result.access_token, function (err, success) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }

                var path = Path.resolve(__dirname + './../../public/twitter_failure.html');
                res.sendfile(path);
            });
        }  else {
            var path = Path.resolve(__dirname + './../../public/twitter_failure.html');
            res.sendfile(path);
        }

    };

    this.GetCredentials = function (req, userKey, callback) {
        var self = this;
        cache.get(userKey, function (err, value) {
            var retVal = {};
            if (err) {
                retVal.error = err;
            } else {
                if (value && value[userKey]) {
                    retVal = value[userKey];
                }

                cache.del(userKey, function (err) {});
            }
            callback(retVal);
        });
    };

    this.ShareMessage = function(req, access_token_key, message, picture, name, description, link, caption, callback) {
        fb.setAccessToken(access_token_key);
        fb.api('/me/feed', 'post', {
            message: message,
            picture: picture,
            name: name,
            description: description,
            link: link,
            caption: caption
        }, function(response) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                callback({});
            }
        })
    }

    this.GetPages = function (access_token, callback) {
        fb.setAccessToken(access_token);
        fb.api('/me', { fields : util.format('%s,%s', meFields, friendFields) } , function(response) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                var allPages = [],
                    me = new Profile(response);

                if (response.television && response.television.data && response.television.data.length) {
                    _appendPages(allPages, response.television.data, me);
                }

                if (response.movies && response.movies.data && response.movies.data.length) {
                    _appendPages(allPages, response.movies.data, me);
                }

                if (response.friends && response.friends.data && response.friends.data.length) {
                    for (var i = 0; i < response.friends.data.length; i++) {
                        var friend = response.friends.data[i],
                            friendProfile = new Profile(response.friends.data[i]);

                        if (friend.movies && friend.movies.data) {
                            _appendPages(allPages, friend.movies.data, friendProfile);
                        }

                        if (friend.television && friend.television.data) {
                            _appendPages(allPages, friend.television.data, friendProfile);
                        }
                    }
                }

                allPages.sort(_sortByNumberOfLikes);

                callback(allPages);
            }
        });
    };

    this.GetUser = function (callback, access_token, comment) {
        fb.setAccessToken(access_token);
        fb.api('/' + comment.Profile.Id, { fields : 'picture.width(310).height(420),name,link,name' },
            function(response) {
                if (response.error) {
                    callback({ error: response.error });
                } else {
                    comment.Profile = new Profile(response);
                    callback(null, comment);
                }
            }
        );
    }

    this.GetPostComments = function (req, access_token, postId, commentId, untilDate, sinceDate, count, callback) {
        var self = this;
        fb.setAccessToken(access_token);
        var untilString = '',
            sinceString = '',
            order = '';

        if (untilDate) {
            untilString = ' and time < "' + untilDate + '"';
        }

        if (sinceDate) {
            sinceString = ' and time > "' + sinceDate + '"';
        }

        if (!commentId) {
            commentId = 0;
            order = 'DESC ';
        }

        var statement = 'SELECT id, can_comment, comment_count, user_likes, text, likes, time, fromid FROM comment WHERE post_id ="' + postId + '" and parent_id ="' + commentId + '"' + untilString + sinceString +  ' ORDER BY time ' + order + 'LIMIT ' + count + ' OFFSET 0';
        Async.waterfall([
            function (callback) {
                fb.api({
                        method: 'fql.query',
                        query: statement
                    },
                    function(response) {
                        if (response.error_code || response.error) {
                            callback({ error: response.error + ' code: ' + response.error_code + ' ' + response.error_msg });
                        } else {
                            var allComments = [],
                                totalReceiveComments = 0;

                            if (response && response.length) {
                                var comments = response;
                                totalReceiveComments = comments.length;
                                for (var i = 0; i < comments.length; i++) {
                                    var comment = comments[i];

                                    allComments.push(new Comment({
                                        id: comment.id,
                                        canComment: comment.can_comment,
                                        commentCount: comment.comment_count,
                                        created: comment.time,
                                        message: comment.text,
                                        profile: new Profile({id: comment.fromid}),
                                        userLike: comment.user_likes,
                                        numberOfLikes: comment.likes
                                    })
                                    );
                                }
                            }

                            callback(null, allComments, totalReceiveComments);
                        }
                    }
                );
           },
           function (comments, itemsCount, callback) {
               var flow = [];
               for (var i = 0; i < itemsCount; i++) {
                    flow.push(Ext.Bind(self.GetUser, self, [access_token, comments[i]], true));
               }
               Async.parallel(flow, function(err, response) {
                   if (err) {
                       callback(err);
                   } else {
                       callback(response)
                   }
               });
           }
        ], function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(result)
            }
        });
    }

    this.LikePost = function (access_token, postId, callback) {
        fb.setAccessToken(access_token);
        fb.api('/' + postId + '/likes', 'post', function(response) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                callback(response);
            }
        });
    };

    this.UnlikePost = function (access_token, postId, callback) {
        fb.setAccessToken(access_token);
        fb.api('/' + postId + '/likes', 'delete', function(response) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                callback(response);
            }
        });
    };

    this.AddComment = function (access_token, postId, message, callback) {
        fb.setAccessToken(access_token);
        var params = { message: message };

        fb.api('/' + postId + '/comments', 'post', params, function(response) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                callback(response);
            }
        });
    };

    this.GetAlbumPhotos = function (access_token, pageId, callback) {
        fb.setAccessToken(access_token);
        var parameters = { fields: 'photos.fields(source).limit(10)' };
        fb.api('/' + pageId + '/albums', parameters, function(response) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                callback(response);
            }
        });
    };

    this.GetPagePosts = function (access_token, pageId, count, untilDate, sinceDate, strongWordsList, callback) {
        fb.setAccessToken(access_token);
		var parameters = { fields: 'type,message,likes,from.fields(picture,name,link),picture,source,name,link,shares,object_id', limit: count};

        if (untilDate) {
            parameters.until = untilDate;
        }

        if (sinceDate) {
            parameters.since = sinceDate;
        }

        fb.api('/' + pageId + '/posts', parameters, Ext.Bind(function(response, strongWordsList) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                var allPosts = [],
                    totalReceivePosts = 0;

                if (response.data && response.data.length) {
                    var posts = response.data;
                    totalReceivePosts = posts.length;
                    for (var i = 0; i < posts.length; i++) {
                        var post = posts[i],
                            allPost = { id: post.id };
                        if ((post.type == 'link' || post.type == 'status' || post.type == 'video' || post.type == 'photo') && post.message) {
                            var objectId = post.object_id;
                            if (!objectId) {
                                var splitId = post.id.split('_');
                                if (splitId.length > 1) {
                                    objectId = splitId[1];
                                }
                            }

                            var wordsList = post.message.split(' ');
                            post.message = '';
                            for (var w = 0; w < wordsList.length; w++) {
                                var temp = wordsList[w];
                                if (strongWordsList.indexOf(wordsList[w].replace(/\\.|,|;|\"|\'/ig,'')) > 0) {
                                    temp = '';
                                    for (var wL = 0; wL < wordsList[w].length; wL++) {
                                        if (['.', ',', ';', '\"', '\''].indexOf(wordsList[w][wL]) > 0) {
                                            temp += wordsList[w][wL];
                                        } else {
                                            temp += '*';
                                        }
                                    }
                                }

                                post.message += temp + ' ';
                            }

                            allPosts.push(new Post({
                                id: post.id,
                                message: post.message,
                                created: post.created_time,
                                numberOfLikes: post.likes ? post.likes.count : 0,
                                numberOfShares: post.shares ? post.shares.count : 0,
								profile: post.from,
                                picture: (post.picture && post.picture.replace) ? post.picture.replace('_s.jpg', '_n.jpg') : post.picture,
                                type: post.type,
                                objectId: objectId,
                                link: post.type == 'video' ? post.source : post.link,
                                name: post.name
                            }));
                        }
                    }
                }

                callback(allPosts, totalReceivePosts);
            }
        }, this, [strongWordsList], true));
    };

    this.GetTitlePosts = function (access_token, pageName, category, count, untilDate, sinceDate, strongWordsList, callback) {
        var self = this;
        fb.setAccessToken(access_token);
        fb.api('/search', { q: pageName, type: 'page' }, function(response) {
            if (response.error) {
                callback({ error: response.error });
            } else {
                var pageIds = [];

                if (response.data && response.data.length) {
                    var pages = response.data;
                    for (var i = 0; i < pages.length; i++) {
                        var page = pages[i];
                        if (page.category.toLowerCase() == category.toLowerCase()) {
                            pageIds.push(page.id);
                        }
                    }
                }

                callback({PageIds: pageIds});
            }
        });
    };
};

module.exports = Facebook;