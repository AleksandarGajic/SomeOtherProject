var rewire = require("rewire"),
    should = require('should'),
    sinon = require('sinon'),
    fb = require('fb'),
    Facebook = rewire('../../../lib/services/facebook');

Facebook.__set__({
    fb: sinon.mock(fb).object
});

describe('Facebook', function () {
    it('Get profile', function () {
        var facebook = new Facebook({});
        facebook.GetProfile('test', function () {
        });
    });
});
