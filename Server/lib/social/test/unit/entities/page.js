var should = require('should'),
    Page = require('../../../lib/entities/page');

describe('Facebook Post', function () {
   it('should should set post properties', function () {
       var data = {
           id: '10',
           name: 'The Godfather',
           picture: {
               data: {
                   url: 'http://profile.ak.fbcdn.net/hprofile-ak-ash4/c7.74.160.160/262420_10150325210819343_6182878_a.jpg'
               }
           },
           description: "An offer you can't refuse.",
           category: 'Movie'
       };

       var page = new Page(data);

       should.exists(page);
       page.should.have.property('Id');
       page.Id.should.equal('10');
       page.should.have.property('Name');
       page.Name.should.equal('The Godfather');
       page.should.have.property('Picture');
       page.Picture.should.equal('http://profile.ak.fbcdn.net/hprofile-ak-ash4/c7.74.160.160/262420_10150325210819343_6182878_a.jpg');
       page.should.have.property('Description');
       page.Description.should.equal("An offer you can't refuse.");
       page.should.have.property('Category');
       page.Category.should.equal('Movie');
       page.should.have.property('Likes');
       page.Likes.should.have.property('length');
       page.Likes.length.should.equal(0);
   });
});
