var assert = require('assert'),
    tokenize = require('../libs/tokenize');

describe('tokenize()', function() {
    var a, i, l;

    a = [
        ['quote:7000',
            'e1',
            '{"e1":"quote:7000"}'],

        ['quote:value',
            'e1',
            '{"e1":"quote:value"}'],

        ['quote.133962.4.last:~7000',
            'e1',
            '{"e1":"quote.133962.4.last:~7000"}'],

        ['quote.133962.4.last:~7000&&quote.133962.4.last:~6000',
            'e1&&e2',
            '{"e1":"quote.133962.4.last:~7000","e2":"quote.133962.4.last:~6000"}'],

        ['quote:7000||quote:6000||quote:5000',
            'e1||e2||e3',
            '{"e1":"quote:7000","e2":"quote:6000","e3":"quote:5000"}'],

        ['quote:7000&&(quote:6000||quote:5000)',
            'e1&&(e2||e3)',
            '{"e1":"quote:7000","e2":"quote:6000","e3":"quote:5000"}'],

        ['quote:7000&&(quote:6000||(quote:5000))',
            'e1&&(e2||(e3))',
            '{"e1":"quote:7000","e2":"quote:6000","e3":"quote:5000"}'],

        ['quote:7000&&(quote:6000||(quote:5000)&&())',
            'e1&&(e2||(e3)&&())',
            '{"e1":"quote:7000","e2":"quote:6000","e3":"quote:5000"}'],

        /*
         * Legacy
         */

        ['quote.133962.4.last:{~7000}',
            'e1',
            '{"e1":"quote.133962.4.last:{~7000}"}'],

        ['quote:{133962>7000}&(quote:{133964<6500}|(quote:{1337>9000}&{12345>6789})&(topflop:{1337>9000}&quote:{12345>6789}))',
            'e1&(e2|(e3&e4)&(e5&e6))',
            '{"e1":"quote:{133962>7000}","e2":"quote:{133964<6500}","e3":"quote:{1337>9000}","e4":"{12345>6789}","e5":"topflop:{1337>9000}","e6":"quote:{12345>6789}"}'],

        ['quote:{133962>7000}&&({133964<6500}||({1337>9000}&&{12345>6789})&&({1337>9000}&&{12345>6789}))',
            'e1&&(e2||(e3&&e4)&&(e5&&e6))',
            '{"e1":"quote:{133962>7000}","e2":"{133964<6500}","e3":"{1337>9000}","e4":"{12345>6789}","e5":"{1337>9000}","e6":"{12345>6789}"}'],

        ['quote:{133962>7000}&({133964<6500}|({1337>9000}&{12345>6789})&(portfolio:{1337>9000}&{12345>6789}))',
            'e1&(e2|(e3&e4)&(e5&e6))',
            '{"e1":"quote:{133962>7000}","e2":"{133964<6500}","e3":"{1337>9000}","e4":"{12345>6789}","e5":"portfolio:{1337>9000}","e6":"{12345>6789}"}'],

        ['quote:{133962>7000}&&(quote:{133964<6500}||(portfolio:{1337>9000}&&{12345>6789})&&(topflop:{1337>9000}&&quote:{12345>6789}))',
            'e1&&(e2||(e3&&e4)&&(e5&&e6))',
            '{"e1":"quote:{133962>7000}","e2":"quote:{133964<6500}","e3":"portfolio:{1337>9000}","e4":"{12345>6789}","e5":"topflop:{1337>9000}","e6":"quote:{12345>6789}"}'],

        ['quote:{133962>7000}&({133964<6500}|{1337>9000})',
            'e1&(e2|e3)',
            '{"e1":"quote:{133962>7000}","e2":"{133964<6500}","e3":"{1337>9000}"}'],

        ['quote:133962>7000&(quote:133964<6500|(quote:1337>9000&12345>6789)&(topflop:1337>9000&quote:12345>6789))',
            'e1&(e2|(e3&e4)&(e5&e6))',
            '{"e1":"quote:133962>7000","e2":"quote:133964<6500","e3":"quote:1337>9000","e4":"12345>6789","e5":"topflop:1337>9000","e6":"quote:12345>6789"}'],

        ['quote:133962>7000&&(133964<6500||(1337>9000&&12345>6789)&&(1337>9000&&12345>6789))',
            'e1&&(e2||(e3&&e4)&&(e5&&e6))',
            '{"e1":"quote:133962>7000","e2":"133964<6500","e3":"1337>9000","e4":"12345>6789","e5":"1337>9000","e6":"12345>6789"}'],

        ['quote:133962>7000&(133964<6500|(1337>9000&12345>6789)&(portfolio:1337>9000&12345>6789))',
            'e1&(e2|(e3&e4)&(e5&e6))',
            '{"e1":"quote:133962>7000","e2":"133964<6500","e3":"1337>9000","e4":"12345>6789","e5":"portfolio:1337>9000","e6":"12345>6789"}'],

        ['quote:133962>7000&&(quote:133964<6500||(portfolio:1337>9000&&12345>6789)&&(topflop:1337>9000&&quote:12345>6789))',
            'e1&&(e2||(e3&&e4)&&(e5&&e6))',
            '{"e1":"quote:133962>7000","e2":"quote:133964<6500","e3":"portfolio:1337>9000","e4":"12345>6789","e5":"topflop:1337>9000","e6":"quote:12345>6789"}'],

        ['quote:133962>7000&(133964<6500|1337>9000)',
            'e1&(e2|e3)',
            '{"e1":"quote:133962>7000","e2":"133964<6500","e3":"1337>9000"}']
    ];

    function factory(alert) {
        return function() {
            var res = tokenize(alert[0]);
            assert(res[0] === alert[1]);
            assert(JSON.stringify(res[1]) === alert[2]);
        }
    }

    for (i=0, l=a.length; i<l; i++) {
        it('should tokenize #'+(i+1), factory(a[i]));
    }
});