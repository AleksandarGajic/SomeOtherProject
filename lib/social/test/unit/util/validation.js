var should = require('should'),
    Validation = require('../../../lib/util/validation');

describe('Validation', function () {
    it('should implement Configuration function', function () {
        should.exists(Validation.Configuration)
        Validation.Configuration.should.be.a('function');
    });

    it('should implement GetFacebookValidation function', function () {
        should.exists(Validation.GetFacebookValidation)
        Validation.GetFacebookValidation.should.be.a('function');
    });

    it('should implement GetPagesRequest function', function () {
        should.exists(Validation.GetPagesRequest)
        Validation.GetPagesRequest.should.be.a('function');
    });

    it('should implement GetPagePostsRequest function', function () {
        should.exists(Validation.GetPagePostsRequest)
        Validation.GetPagePostsRequest.should.be.a('function');
    });

    it('should implement GetTitlePostsRequest function', function () {
        should.exists(Validation.GetTitlePostsRequest)
        Validation.GetTitlePostsRequest.should.be.a('function');
    });

    describe('Configuration', function () {
        it('should throw error when the config is undefined', function () {
            (Validation.Configuration).should.throw('Social configuration is missing');
        });

        it('should throw error when the config facebook is undefined', function () {
            (function () {
                Validation.Configuration({});
            }).should.throw('Facebook configuration is missing');
        });

        it('should throw error when the fb client_id is undefined', function () {
            (function () {
                Validation.Configuration({
                    facebook: {}
                });
            }).should.throw('Facebook client_id configuration is missing');
        });

        it('should throw error when the fb client_secret is undefined', function () {
            (function () {
                Validation.Configuration({
                    facebook: {
                        client_id: 'ABC'
                    }
                });
            }).should.throw('Facebook client_secret configuration is missing');
        });

        it('should throw error when the fb grant_type is undefined', function () {
            (function () {
                Validation.Configuration({
                    facebook: {
                        client_id: 'ABC',
                        client_secret: 'EFG'
                    }
                });
            }).should.throw('Facebook grant_type configuration is missing');
        });

        it('should throw error when the tw is undefined', function () {
            (function () {
                Validation.Configuration({
                    facebook: {
                        client_id: 'ABC',
                        client_secret: 'EFG',
                        grant_type: 'friend_likes'
                    }
                });
            }).should.throw('Twitter configuration is missing');
        });

        it('should throw error when the tw consumer_key is undefined', function () {
            (function () {
                Validation.Configuration({
                    facebook: {
                        client_id: 'ABC',
                        client_secret: 'EFG',
                        grant_type: 'friend_likes'
                    },
                    twitter: {}
                });
            }).should.throw('Twitter consumer_key configuration is missing');
        });

        it('should throw error when the tw consumer_secret is undefined', function () {
            (function () {
                Validation.Configuration({
                    facebook: {
                        client_id: 'ABC',
                        client_secret: 'EFG',
                        grant_type: 'friend_likes'
                    },
                    twitter: {
                        consumer_key: 'HIJ'
                    }
                });
            }).should.throw('Twitter consumer_secret configuration is missing');
        });

        it('should not throw error when the valid config is passed', function () {
            (function () {
                Validation.Configuration({
                    facebook: {
                        client_id: 'ABC',
                        client_secret: 'EFG',
                        grant_type: 'friend_likes'
                    },
                    twitter: {
                        consumer_key: 'ABC',
                        consumer_secret: 'EFG'
                    }
                });
            }).should.not.throw();
        });
    });

    describe('GetFacebookValidation', function () {
        it('should return error with code 1 when the body is undefined', function () {
            var result = Validation.GetFacebookValidation();

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Request body is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(1);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 2 when the fb is undefined', function () {
            var result = Validation.GetFacebookValidation({});

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(2);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 3 when fb access_token_key is undefined', function () {
            var result = Validation.GetFacebookValidation({
                fb: {}
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook access token is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(3);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });
    });

    describe('GetTwitterShareValidation', function () {
        it('should return error with code 37 when the body is undefined', function () {
            var result = Validation.GetTwitterShareValidation();

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Request body is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(37);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 38 when the tw is undefined', function () {
            var result = Validation.GetTwitterShareValidation({});

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(38);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 39 when tw access_token_key is undefined', function () {
            var result = Validation.GetTwitterShareValidation({
                tw: {}
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter access token is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(39);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 40 when tw access_token_secret is undefined', function () {
            var result = Validation.GetTwitterShareValidation({
                tw: {
                    access_token_key: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter access token secret is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(40);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 41 when tw access_token_key is undefined', function () {
            var result = Validation.GetTwitterShareValidation({
                tw: {
                    access_token_key: 'ABC',
                    access_token_secret: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter message missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(41);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });
    });

    describe('GetTwitterRetweetValidation', function () {
        it('should return error with code 37 when the body is undefined', function () {
            var result = Validation.GetTwitterRetweetValidation();

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Request body is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(37);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 38 when the tw is undefined', function () {
            var result = Validation.GetTwitterRetweetValidation({});

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(38);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 39 when tw access_token_key is undefined', function () {
            var result = Validation.GetTwitterRetweetValidation({
                tw: {}
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter access token is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(39);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 40 when tw access_token_secret is undefined', function () {
            var result = Validation.GetTwitterRetweetValidation({
                tw: {
                    access_token_key: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter access token secret is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(40);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 41 when tw access_token_key is undefined', function () {
            var result = Validation.GetTwitterRetweetValidation({
                tw: {
                    access_token_key: 'ABC',
                    access_token_secret: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter tweet id missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(60);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });
    });

    describe('GetPagesRequest', function () {
        it('should return error with code 7 when fb paging is undefined', function () {
            var result = Validation.GetPagesRequest({
                fb: {
                    access_token_key: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook paging data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(7);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 8 when fb page is undefined', function () {
            var result = Validation.GetPagesRequest({
                fb: {
                    access_token_key: 'ABC',
                    paging: {}
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook paging page number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(8);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 8 when fb page is undefined', function () {
            var result = Validation.GetPagesRequest({
                fb: {
                    access_token_key: 'ABC',
                    paging: {}
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook paging page number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(8);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 8 when fb page is NaN', function () {
            var result = Validation.GetPagesRequest({
                fb: {
                    access_token_key: 'ABC',
                    paging: {
                        page: 'A'
                    }
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook paging page number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(8);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 9 when fb page is <= 0', function () {
            var result = Validation.GetPagesRequest({
                fb: {
                    access_token_key: 'ABC',
                    paging: {
                        page: '0'
                    }
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook paging page number must be greater than 0');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(9);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 10 when fb count is undefined', function () {
            var result = Validation.GetPagesRequest({
                fb: {
                    access_token_key: 'ABC',
                    paging: {
                        page: '1'
                    }
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook paging count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(10);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 10 when fb count is NaN', function () {
            var result = Validation.GetPagesRequest({
                fb: {
                    access_token_key: 'ABC',
                    paging: {
                        page: '1',
                        count: 'A'
                    }
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook paging count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(10);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 11 when fb count is <= 0', function () {
            var result = Validation.GetPagesRequest({
                fb: {
                    access_token_key: 'ABC',
                    paging: {
                        page: '1',
                        count: '0'
                    }
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook paging count number must be greater than 0');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(11);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });
    });

    describe('GetPagePostsRequest', function () {
        it('should return error with code 12 when fb pageId is undefined', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook pageId number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(12);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 10 when fb pageId is NaN', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: 'A'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook pageId number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(12);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 13 when fb count is undefined', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: '123'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(13);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 13 when fb count is NaN', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: '123',
                    count: 'A'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(13);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 14 when fb count <= 0', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: '123',
                    count: '0'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook count number must be greater than 0');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(14);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 21 when tw is undefined', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: '123',
                    count: '10'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(21);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 22 when tw hashtag is undefined', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: '123',
                    count: '10'
                },
                tw: {}
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter hashtag is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(22);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 23 when tw count is undefined', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: '123',
                    count: '10'
                },
                tw: {
                    hashtag: '#thegodfather'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(23);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 23 when tw count is NaN', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: '123',
                    count: '10'
                },
                tw: {
                    hashtag: '#thegodfather',
                    count: 'A'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(23);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 24 when tw count <= 0', function () {
            var result = Validation.GetPagePostsRequest({
                fb: {
                    access_token_key: 'ABC',
                    pageId: '123',
                    count: '10'
                },
                tw: {
                    hashtag: '#thegodfather',
                    count: '0'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter count number must be greater than 0');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(24);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });
    });

    describe('GetTitlePostsRequest', function () {
        it('should return error with code 36 when fb is undefined', function () {
            var result = Validation.GetTitlePostsRequest({});

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(36);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 15 when fb page_name is undefined', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {}
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook page name is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(15);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 16 when fb count is undefined', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(16);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 16 when fb count is NaN', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC',
                    count: 'A'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(16);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 33 when fb count <= 0', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC',
                    count: '0'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook count number must be greater than 0');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(33);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 17 when fb category is undefined', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC',
                    count: '10'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook category name is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(17);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 34 when tw is undefined', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC',
                    count: '10',
                    category: 'Movie'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(34);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 25 when tw hashtag is undefined', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC',
                    count: '10',
                    category: 'Movie'
                },
                tw: {}
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter hashtag is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(25);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 26 when tw count is undefined', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC',
                    count: '10',
                    category: 'Movie'
                },
                tw: {
                    hashtag: '#thegodfather'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(26);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 26 when tw count is NaN', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC',
                    count: '10',
                    category: 'Movie'
                },
                tw: {
                    hashtag: '#thegodfather',
                    count: 'A'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter count number is missing or not a number');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(26);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 27 when tw count <= 0', function () {
            var result = Validation.GetTitlePostsRequest({
                fb: {
                    page_name: 'ABC',
                    count: '10',
                    category: 'Movie'
                },
                tw: {
                    hashtag: '#thegodfather',
                    count: '0'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Twitter count number must be greater than 0');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(27);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });
    });

    describe('GetCredentials', function () {
        it('should return error with code 42 when body is undefined', function () {
            var result = Validation.GetCredentials();

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Request body is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(42);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 43 when user_key is undefined', function () {
            var result = Validation.GetCredentials({});

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('User key data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(43);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });
    });

    describe('GetFacebookShare', function () {
        it('should return error with code 44 when body is undefined', function () {
            var result = Validation.GetFacebookShare();

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Request body is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(1);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 45 when fb is undefined', function () {
            var result = Validation.GetFacebookShare({});

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(2);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 46 when access token is undefined', function () {
            var result = Validation.GetFacebookShare({
                fb: {

                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook access token is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(3);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });
    });

    describe('GetFacebookPostComments', function () {
        it('should return error with code 44 when body is undefined', function () {
            var result = Validation.GetFacebookShare();

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Request body is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(1);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 45 when fb is undefined', function () {
            var result = Validation.GetFacebookShare({});

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(2);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 46 when access token is undefined', function () {
            var result = Validation.GetFacebookShare({
                fb: {

                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook access token is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(3);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 47 when post id is undefined', function () {
            var result = Validation.GetFacebookPostComments({
                fb: {
                    access_token_key: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook post id is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(47);
            result.should.have.property('StatusCode');

            result.StatusCode.should.equal(400);
        });
    });

    describe('AddFacebookComment', function () {
        it('should return error with code 1 when body is undefined', function () {
            var result = Validation.AddFacebookComment();

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Request body is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(1);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 2 when fb is undefined', function () {
            var result = Validation.AddFacebookComment({});

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook data is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(2);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 3 when access token is undefined', function () {
            var result = Validation.AddFacebookComment({
                fb: {

                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook access token is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(3);
            result.should.have.property('StatusCode');
            result.StatusCode.should.equal(400);
        });

        it('should return error with code 48 when post id is undefined', function () {
            var result = Validation.AddFacebookComment({
                fb: {
                    access_token_key: 'ABC'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook post id is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(48);
            result.should.have.property('StatusCode');

            result.StatusCode.should.equal(400);
        });

        it('should return error with code 49 when message is undefined', function () {
            var result = Validation.AddFacebookComment({
                fb: {
                    access_token_key: 'ABC',
                    postId: '111'
                }
            });

            should.exist(result);
            result.should.have.property('Body');
            result.Body.should.have.property('Error');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Message.should.equal('Facebook message is missing');
            result.Body.Error.should.have.property('Message');
            result.Body.Error.Code.should.equal(49);
            result.should.have.property('StatusCode');

            result.StatusCode.should.equal(400);
        });
    });
});