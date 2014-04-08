
var fs = require('fs');
var target = require('../../lib/crautos');

describe('Search results', function() {
    it('should parse search results', function(done) {

        fs.readFile('test/fixtures/search.html', function (err, data) {
            if (err) throw err;

            var results = target.parseResults(data);
            var first = results[0];

            results.should.be.a('array')

            first.should.deep.equal({
                id: '41244829',
                title: 'Suzuki - JIMNY',
                year: 2008,
                price: 8050,
                description: '1300cc Gasolina.',
                transmition: 'manual',
                image: 'http://crautos.com/clasificados/usados/41244829.jpg'
            });

            results[5].should.deep.equal({
                id: '11133578',
                title: 'JIMNY',
                year: 2004,
                price: 7692,
                transmition: 'manual',
                image: 'http://crautos.com/clasificados/usados/11133578.jpg'
            });


            done();
        });
    });
})
