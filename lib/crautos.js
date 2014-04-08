var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var q = require('q');



function isFeatured($el) {
    return $el.parent().is('div')
}

function _cleanTransmision(text) {
    return text.trim().replace(/[()]/g, '').toLowerCase()
}

function _cleanPrice(text) {
    return parseInt(text.replace(/[^0-9]/g, ''), 10);
}

function _cleanYear(text) {
    return parseInt(text.trim(), 10);
}

function parseFeatured($el) {
    var $root = $el.parent().parent().parent();
    return {
        description: $root.find('table tr:nth-child(4) td').text().trim(),
        id: $el.attr('value'),
        price: _cleanPrice($root.find('table tr:nth-child(2) span').eq(1).text()),
        title: $root.find('table tr:nth-child(2) td a:nth-child(1)').eq(0).text(),
        transmition: _cleanTransmision($root.find('table tr:nth-child(2) td a:nth-child(2)').eq(0).text()),
        year: _cleanYear($root.find('table tr:nth-child(2) td:nth-child(2) div a').text())

    };
}

function parseNormal($el) {
    var $root = $el.parent().parent();
    var $price = $root
    return {
        id: $el.attr('value'),
        price: _cleanPrice($root.find('span.style13').text()),
        title: $root.find('td:nth-child(4) a').eq(0).text().split('\n')[0].trim(),
        transmition: _cleanTransmision($root.find('td:nth-child(4) a span').text()),
        year: _cleanYear($root.find('td:nth-child(5) a').text())
    };
}

module.exports = {
    search: function(params) {
        var self = this;
        var def = q.defer();
        params = _.defaults(params, {
            brand: 00,
            displaytype: 0,
            e: 1,
            financed: 00,
            fuel: 0,
            modelstr: 'jimny',
            orderby: 0,
            pricefrom: 1,
            priceto: 999999999,
            rmax: 30,
            style: 00,
            submit: 'Buscar',
            yearfrom: 1960,
            yearto: 2014,
        });

        var body = _(params).pairs().map(function(pair) {
            return pair.join('=')
        }).value().join('&');

        request.post({
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: 'http://crautos.com/usados/economicos-usearch2.cfm?p=1',
            body: body

        }, function(error, response, body){
            if (error) {
                def.reject(error)
            } else {
                def.resolve(self.parseResults(body));
            }
        });
        return def.promise;
    },
    parseResults: function(body) {
        // document is malformed, feature a doubly closing td
        body = body.toString().replace(/^(.*width="37".*<\/a>).*/mgi, "$1");
        var $ = cheerio.load(body);
        var results = [];
        $('input[name="c"]').each(function() {
            var $el = $(this)
            if (!$el.parent().is('form')) {
                results.push(isFeatured($el) ? parseFeatured($el) : parseNormal($el));
            }
        });

        return results;
    }
}
