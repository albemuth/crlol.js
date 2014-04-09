
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
                description: '1300cc Gasolina.',
                detailPage: 'http://crautos.com/usados/economicos-useddetail.cfm?c=41244829',
                image: 'http://crautos.com/clasificados/usados/41244829.jpg',
                price: 8050,
                title: 'Suzuki - JIMNY',
                transmition: 'manual',
                year: 2008
            });

            results[5].should.deep.equal({
                id: '11133578',
                detailPage: 'http://crautos.com/usados/economicos-useddetail.cfm?c=11133578',
                image: 'http://crautos.com/clasificados/usados/11133578.jpg',
                price: 7692,
                title: 'JIMNY',
                transmition: 'manual',
                year: 2004
            });

            done();
        });
    });
})
