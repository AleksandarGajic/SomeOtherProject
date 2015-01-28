var should = require('should'),
    Post = require('../../../lib/entities/twpost');

describe('Facebook Post', function () {
   it('should should set post properties', function () {
       var data = {
           id: '10',
           created_at: '2013-03-27T08:20:37+0000',
           text: 'New post',
           user: {
               id: '20',
               screen_name: 'John Doe',
                   profile_image_url: 'https://twitter.com/t1/img/empty_avatar.png'
           },
           retweet_count: 100,
           favorite_count: 50
       };

       var post = new Post(data);

       should.exists(post);
       post.should.have.property('Id');
       post.Id.should.equal('10');
       post.should.have.property('Type');
       post.Type.should.equal('tw');
       post.should.have.property('Created');
       post.Created.getTime().should.equal(new Date('2013-03-27T08:20:37+0000').getTime());
       post.should.have.property('Message');
       post.Message.should.equal('New post');
       post.should.have.property('Profile');
       post.Profile.should.have.property('Id');
       post.Profile.Id.should.equal('20');
       post.Profile.should.have.property('ProfileUrl');
       post.Profile.ProfileUrl.should.equal('John Doe');
       post.Profile.should.have.property('Picture');
       post.Profile.Picture.should.equal('https://twitter.com/t1/img/empty_avatar.png');
       post.should.have.property('NumberOfRetweets');
       post.NumberOfRetweets.should.equal(100);
       post.should.have.property('NumberOfFavorites');
       post.NumberOfFavorites.should.equal(50);
   });
});
