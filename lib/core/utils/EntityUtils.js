/**
 * Created by Papa on 6/14/2016.
 */
"use strict";
var EntityUtils = (function () {
    function EntityUtils() {
    }
    EntityUtils.getObjectClassName = function (object) {
        if (typeof object != "object" || object === null) {
            throw "Not an object instance";
        }
        return this.getClassName(object.constructor);
    };
    EntityUtils.getClassName = function (clazz) {
        if (typeof clazz != "function") {
            throw "Not a constructor function";
        }
        var className = clazz['name'];
        // let className = /(\w+)\(/.exec(clazz.toString())[1];
        return className;
    };
    return EntityUtils;
}());
exports.EntityUtils = EntityUtils;
//# sourceMappingURL=EntityUtils.js.map