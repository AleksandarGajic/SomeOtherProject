var Validation = function () {};

module.exports = new Validation();

Validation.prototype.Configuration = function (config) {
    if (!config) throw new Error('Social configuration is missing');
    if (!config.facebook) throw new Error('Facebook configuration is missing');
    if (!config.facebook.client_id) throw new Error('Facebook client_id configuration is missing');
    if (!config.facebook.client_secret) throw new Error('Facebook client_secret configuration is missing');
    if (!config.facebook.grant_type) throw new Error('Facebook grant_type configuration is missing');
};

Validation.prototype.GetFacebookValidation = function(body) {
    var result = {
        StatusCode: 200,
        Body: null
    }

    if (!body) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Request body is missing', Code: 1 }, StatusCode: result.StatusCode };
    } else if (!body.fb) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Facebook data is missing', Code: 2 }, StatusCode: result.StatusCode };
    } else if (body.fb.access_token_key !== false && !body.fb.access_token_key) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Facebook access token is missing', Code: 3 }, StatusCode: result.StatusCode };
    }

    return result;
};

Validation.prototype.GetTwitterRetweetValidation  = function (body) {
    var result = {
        StatusCode: 200,
        Body: null
    }

    if (!body) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Request body is missing', Code: 37 }, StatusCode: result.StatusCode };
    } else if (!body.tw) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter data is missing', Code: 38 }, StatusCode: result.StatusCode };
    } else if (!body.tw.access_token_key) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter access token is missing', Code: 39 }, StatusCode: result.StatusCode };
    } else if (!body.tw.access_token_secret) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter access token secret is missing', Code: 40 }, StatusCode: result.StatusCode };
    } else if (!body.tw.tweetId) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter tweet id missing', Code: 60 }, StatusCode: result.StatusCode };
    }

    return result;
};

Validation.prototype.GetTwitterShareValidation = function (body) {
    var result = {
        StatusCode: 200,
        Body: null
    }

    if (!body) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Request body is missing', Code: 37 }, StatusCode: result.StatusCode };
    } else if (!body.tw) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter data is missing', Code: 38 }, StatusCode: result.StatusCode };
    } else if (!body.tw.access_token_key) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter access token is missing', Code: 39 }, StatusCode: result.StatusCode };
    } else if (!body.tw.access_token_secret) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter access token secret is missing', Code: 40 }, StatusCode: result.StatusCode };
    } else if (!body.tw.message) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter message missing', Code: 41 }, StatusCode: result.StatusCode };
    }

    return result;
};

Validation.prototype.GetPagesRequest = function (body) {
    var result = this.GetFacebookValidation(body);

    if (result.StatusCode == 200) {
        if (!body.fb.paging) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook paging data is missing', Code: 7 }, StatusCode: result.StatusCode };
        } else if (!body.fb.paging.page || isNaN(body.fb.paging.page)) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook paging page number is missing or not a number', Code: 8 }, StatusCode: result.StatusCode };
        } else if (parseInt(body.fb.paging.page) <= 0) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook paging page number must be greater than 0', Code: 9 }, StatusCode: result.StatusCode };
        } else if (!body.fb.paging.count || isNaN(body.fb.paging.count)) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook paging count number is missing or not a number', Code: 10 }, StatusCode: result.StatusCode };
        } else if (parseInt(body.fb.paging.count) <= 0) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook paging count number must be greater than 0', Code: 11 }, StatusCode: result.StatusCode };
        }
    }

    return result;
};

Validation.prototype.GetPagePostsRequest = function (body) {
    var result = this.GetFacebookValidation(body);

    if (result.StatusCode == 200) {
        if (!body.fb.pageId) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook pageId number is missing or not a number', Code: 12 }, StatusCode: result.StatusCode };
        } else if (!body.fb.count || isNaN(body.fb.count)) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook count number is missing or not a number', Code: 13 }, StatusCode: result.StatusCode };
        } else if (parseInt(body.fb.count) <= 0) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook count number must be greater than 0', Code: 14 }, StatusCode: result.StatusCode };
        } else if (!body.tw) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Twitter data is missing', Code: 21 }, StatusCode: result.StatusCode };
        } else if (!body.tw.hashtag) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Twitter hashtag is missing', Code: 22 }, StatusCode: result.StatusCode };
        } else if (!body.tw.count || isNaN(body.tw.count)) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Twitter count number is missing or not a number', Code: 23 }, StatusCode: result.StatusCode };
        } else if (parseInt(body.tw.count) <= 0) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Twitter count number must be greater than 0', Code: 24 }, StatusCode: result.StatusCode };
        }
    }

    return result;
};

Validation.prototype.GetTitlePostsRequest = function (body) {
    var result = {
        StatusCode: 200,
        Body: null
    };

    if (!body) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Request body is missing', Code: 35 }, StatusCode: result.StatusCode };
    } else if (!body.fb) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Facebook data is missing', Code: 36 }, StatusCode: result.StatusCode };
    } else if (!body.fb.page_name) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Facebook page name is missing', Code: 15 }, StatusCode: result.StatusCode };
    } else if (!body.fb.count || isNaN(body.fb.count)) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Facebook count number is missing or not a number', Code: 16 }, StatusCode: result.StatusCode };
    } else if (body.fb.count <= 0) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Facebook count number must be greater than 0', Code: 33 }, StatusCode: result.StatusCode };
    } else if (!body.fb.category) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Facebook category name is missing', Code: 17 }, StatusCode: result.StatusCode };
    } else if (!body.tw) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter data is missing', Code: 34 }, StatusCode: result.StatusCode };
    } else if (!body.tw.hashtag) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter hashtag is missing', Code: 25 }, StatusCode: result.StatusCode };
    } else if (!body.tw.count || isNaN(body.tw.count)) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter count number is missing or not a number', Code: 26 }, StatusCode: result.StatusCode };
    } else if (parseInt(body.tw.count) <= 0) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Twitter count number must be greater than 0', Code: 27 }, StatusCode: result.StatusCode };
    }

    return result;
};

Validation.prototype.GetCredentials = function (body) {
    var result = {
        StatusCode: 200,
        Body: null
    };

    if (!body) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'Request body is missing', Code: 42 }, StatusCode: result.StatusCode };
    } else if (!body.user_key) {
        result.StatusCode = 400;
        result.Body = { Error: { Message: 'User key data is missing', Code: 43 }, StatusCode: result.StatusCode };
    }

    return result;
}

Validation.prototype.GetFacebookPostComments = function (body) {
    var result = this.GetFacebookValidation(body);

    if (result.StatusCode == 200) {
        if (!body.fb.postId) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook post id is missing', Code: 47 }, StatusCode: result.StatusCode };
        }
    }

    return result;
}

Validation.prototype.AddFacebookComment = function (body) {
    var result = this.GetFacebookValidation(body);

    if (result.StatusCode == 200) {
        if (!body.fb.postId) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook post id is missing', Code: 48 }, StatusCode: result.StatusCode };
        } else if (!body.fb.message) {
            result.StatusCode = 400;
            result.Body = { Error: { Message: 'Facebook message is missing', Code: 49 }, StatusCode: result.StatusCode };
        }
    }

    return result;
}

Validation.prototype.GetFacebookShare = function (body) {
    var result = this.GetFacebookValidation(body);

    return result;
}