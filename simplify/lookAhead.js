module.exports = function factory(config) {

    /**
     * 
     * @param str
     * @param pos
     * @returns {*[]}
     */

    function lookAhead(str, pos) {
        var tmp = '', state = 'stmnt';
        for (var i=pos, l=str.length; i<l; i++) {
            if (state === 'brckt') {
                if (str[i] === '(') { tmp = '';      break; }
                if (str[i] === ')') { tmp += str[i]; break; }
            }
            if (state === 'stmnt') {
                if (str[i] === config.or) { break; }
                if (str[i] === ')') { break; }
                if (str[i] === '(') { state = 'brckt'; }
            }
            tmp += str[i];
        }
    
        if (tmp[0] === '(') {
            return [tmp, tmp.substr(1, tmp.length-2).split(config.or)];
        } else {
            return [tmp, [tmp]];
        }
    }
    
    return lookAhead;
}