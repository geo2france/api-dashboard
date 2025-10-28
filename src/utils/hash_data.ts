/**
 * Returns a hash code from a string
 * From https://stackoverflow.com/a/8831937/10995624
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(input:any): number | undefined {
    if (input === undefined) return undefined
    let hash = 0;
    const str = JSON.stringify(input)
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export default hashCode