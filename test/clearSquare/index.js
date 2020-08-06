/* global describe, it */

const assert = require('assert');

const config = require('../../config');
const fn = require('../../clearSquare');

describe('clearSquare()', function () {
    var i,
        l,
        tests = [
            // basic

            ['e0[e1]', '(e0_1)'],
            ['e0[e1[e2]]', '(e0_1_2)'],
            ['e1[e2*e3]', '(e1_2*e1_3)'],
            ['e1[e2+e3]', '(e1_2+e1_3)'],

            // AND and OR Connections

            ['e0*e1[e2]', 'e0*(e1_2)'],
            ['e0[e1]*e2', '(e0_1)*e2'],
            ['e0[e1*e2*e3]', '(e0_1*e0_2*e0_3)'],
            ['e0[e1*e2[e3]]', '(e0_1*e0_2_3)'],
            ['e0[e1[e2]*e3]', '(e0_1_2*e0_3)'],
            ['e0[e1*e2[e3*e4]]', '(e0_1*e0_2_3*e0_2_4)'],
            ['e0[e1[e2*e3]*e4]', '(e0_1_2*e0_1_3*e0_4)'],
            ['e0[e1*e2[e3*e4]*e5]', '(e0_1*e0_2_3*e0_2_4*e0_5)'],
            ['e0[e1*e2[e3*e4]*e5]*e6', '(e0_1*e0_2_3*e0_2_4*e0_5)*e6'],
            ['e0*e1[e2*e3[e4*e5]*e6]', 'e0*(e1_2*e1_3_4*e1_3_5*e1_6)'],
            ['e0*e1[e2*e3[e4*e5]*e6]*e7', 'e0*(e1_2*e1_3_4*e1_3_5*e1_6)*e7'],

            ['e0+e1[e2]', 'e0+(e1_2)'],
            ['e0[e1]+e2', '(e0_1)+e2'],
            ['e0[e1+e2+e3]', '(e0_1+e0_2+e0_3)'],
            ['e0[e1+e2[e3]]', '(e0_1+e0_2_3)'],
            ['e0[e1[e2]+e3]', '(e0_1_2+e0_3)'],
            ['e0[e1+e2[e3+e4]]', '(e0_1+e0_2_3+e0_2_4)'],
            ['e0[e1[e2+e3]+e4]', '(e0_1_2+e0_1_3+e0_4)'],
            ['e0[e1+e2[e3+e4]+e5]', '(e0_1+e0_2_3+e0_2_4+e0_5)'],
            ['e0[e1+e2[e3+e4]+e5]+e6', '(e0_1+e0_2_3+e0_2_4+e0_5)+e6'],
            ['e0+e1[e2+e3[e4+e5]+e6]', 'e0+(e1_2+e1_3_4+e1_3_5+e1_6)'],
            ['e0+e1[e2+e3[e4+e5]+e6]+e7', 'e0+(e1_2+e1_3_4+e1_3_5+e1_6)+e7'],

            // support for wild, round brackets

            ['e0[(e1+e2)*e3]', '(e0_1*e0_3+' + 'e0_2*e0_3)'],
            ['e0[e1*(e2+e3)]', '(e0_1*e0_2+' + 'e0_1*e0_3)'],
            ['e0[(e1+e2)*(e3+e4)]', '(e0_1*e0_3+' + 'e0_1*e0_4+' + 'e0_2*e0_3+' + 'e0_2*e0_4)'],
            [
                'e0[(e1[e2*e3]+e4)*(e5+e6)]',
                '(e0_1_2*e0_1_3*e0_5+' + 'e0_1_2*e0_1_3*e0_6+' + 'e0_4*e0_5+' + 'e0_4*e0_6)'
            ],
            [
                'e0[(e1+e2[e3*e4])*(e5+e6)]',
                '(e0_1*e0_5+' + 'e0_1*e0_6+' + 'e0_2_3*e0_2_4*e0_5+' + 'e0_2_3*e0_2_4*e0_6)'
            ],
            [
                'e0[(e1+e2)*(e3[e4*e5]+e6)]',
                '(e0_1*e0_3_4*e0_3_5+' + 'e0_1*e0_6+' + 'e0_2*e0_3_4*e0_3_5+' + 'e0_2*e0_6)'
            ],
            [
                'e0[(e1+e2)*(e3+e4[e5*e6])]',
                '(e0_1*e0_3+' + 'e0_1*e0_4_5*e0_4_6+' + 'e0_2*e0_3+' + 'e0_2*e0_4_5*e0_4_6)'
            ],
            [
                'e0[(e1[e2*e3]+e4[e5*e6])*(e7[e8*e9]+e10[e11*e12])]',
                '(e0_1_2*e0_1_3*e0_7_8*e0_7_9+' +
                    'e0_1_2*e0_1_3*e0_10_11*e0_10_12+' +
                    'e0_4_5*e0_4_6*e0_7_8*e0_7_9+' +
                    'e0_4_5*e0_4_6*e0_10_11*e0_10_12)'
            ],
            [
                'e0[(e1+e2)*(e3+e4)*(e5+e6)]',
                '(e0_1*e0_3*e0_5+' +
                    'e0_1*e0_3*e0_6+' +
                    'e0_1*e0_4*e0_5+' +
                    'e0_1*e0_4*e0_6+' +
                    'e0_2*e0_3*e0_5+' +
                    'e0_2*e0_3*e0_6+' +
                    'e0_2*e0_4*e0_5+' +
                    'e0_2*e0_4*e0_6)'
            ],

            // square brackets between attributes

            ['e0[e1]e2', '(e0_1_2)'],
            ['e0[e1][e2]', '(e0_1_2)'],
            ['e0[e1][e2]e3', '(e0_1_2_3)'],
            ['e0[e1][e2][e3]e4', '(e0_1_2_3_4)'],
            ['e0[e1*e2]e3', '(e0_1_3*e0_2_3)'],
            ['e0[e1*e2][e3*e4]', '(e0_1_3*e0_1_4*e0_2_3*e0_2_4)'],
            ['e0[e1+e2][e3*e4]', '(e0_1_3*e0_1_4+e0_2_3*e0_2_4)'],
            ['e0[e1*e2][e3+e4]', '(e0_1_3*e0_2_3+e0_1_4*e0_2_4)'],
            ['e0[e1*e2+e3*e4][e5*e6]', '(e0_1_5*e0_1_6*e0_2_5*e0_2_6+' + 'e0_3_5*e0_3_6*e0_4_5*e0_4_6)'],
            [
                'e0[e1*e2][e3*e4+e5*e6]e7',
                '(e0_1_3_7*e0_1_4_7*e0_2_3_7*e0_2_4_7+' + 'e0_1_5_7*e0_1_6_7*e0_2_5_7*e0_2_6_7)'
            ],
            [
                'e0[e1*e2][e3*e4+e5*e6]e7*e8',
                '(e0_1_3_7*e0_1_4_7*e0_2_3_7*e0_2_4_7+' + 'e0_1_5_7*e0_1_6_7*e0_2_5_7*e0_2_6_7)*e8'
            ],
            [
                'e0[e1*e2][e3*e4+e5*e6]e7+e8',
                '(e0_1_3_7*e0_1_4_7*e0_2_3_7*e0_2_4_7+' + 'e0_1_5_7*e0_1_6_7*e0_2_5_7*e0_2_6_7)+e8'
            ]
        ],
        fails = [
            ['e0[e1', 2203],
            ['e0e1]', 2204],
            ['e0[(e1[e2*e3]+e4[e5*e6])*(e7[e8*e9+e10[e11*e12])]', 2203],
            ['e0[(e1[e2*e3]+e4[e5*e6])*(e7e8*e9]+e10[e11*e12])]', 2204]
        ];

    function factory(config, input, output) {
        return function () {
            assert.equal(fn(config)([input, {}])[0], output);
        };
    }

    for (i = 0, l = tests.length; i < l; i++) {
        it('should clear square brackets ' + tests[i][0], factory(config(), tests[i][0], tests[i][1]));
    }

    function failFactory(config, input, code) {
        return function () {
            try {
                fn(config)([input, {}]);
            } catch (e) {
                assert.equal(e.code, code);
                return;
            }

            throw new Error('Test failed, error not thrown');
        };
    }

    for (i = 0, l = fails.length; i < l; i++) {
        it('should throw error ' + fails[i][0], failFactory(config(), fails[i][0], fails[i][1]));
    }
});
