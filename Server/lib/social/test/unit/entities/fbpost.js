var should = require('should'),
    Post = require('../../../lib/entities/fbpost');

describe('Facebook Post', function () {
   it('should should set post properties', function () {
       var data = {
           id: '10',
           created: '2013-03-27T08:20:37+0000',
           message: 'New post',
           picture: 'http://profile.ak.fbcdn.net/29911_105095386201325_793336_n.jpg',
           link: 'http://profile.ak.fbcdn.net/hprofile-ak-prn1/',
           name: 'Very funny post',
           type: 'picture',
           profile: {
               id: '20',
               name: 'John Doe',
               picture: {
                    data: {
                        url: 'http://profile.ak.fbcdn.net/hprofile-ak-prn1/c45.0.610.610/s160x160/29911_105095386201325_793336_n.jpg'
                    }
               }
           },
           numberOfLikes: 100
       };

       var post = new Post(data);

       should.exists(post);
       post.should.have.property('Id');
       post.Id.should.equal('10');
       post.should.have.property('Type');
       post.Type.should.equal('fb');
       post.should.have.property('Created');
       post.Created.getTime().should.equal(new Date('2013-03-27T08:20:37+0000').getTime());
       post.should.have.property('Message');
       post.Message.should.equal('New post');
       post.should.have.property('Profile');
       post.Profile.should.have.property('Id');
       post.Profile.Id.should.equal('20');
       post.Profile.should.have.property('Name');
       post.Profile.Name.should.equal('John Doe');
       post.Profile.should.have.property('Picture');
       post.Profile.Picture.should.equal('http://profile.ak.fbcdn.net/hprofile-ak-prn1/c45.0.610.610/s160x160/29911_105095386201325_793336_n.jpg');
       post.should.have.property('NumberOfLikes');
       post.NumberOfLikes.should.equal(100);
       post.should.have.property('Picture');
       post.Picture.should.equal('http://profile.ak.fbcdn.net/29911_105095386201325_793336_n.jpg');
       post.should.have.property('Link');
       post.Link.should.equal('http://profile.ak.fbcdn.net/hprofile-ak-prn1/');
       post.should.have.property('Name');
       post.Name.should.equal('Very funny post');
       post.should.have.property('TypeOfPost');
       post.TypeOfPost.should.equal('picture');
   });
});
