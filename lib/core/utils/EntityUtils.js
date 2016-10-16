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
    EntityUtils.exists = function (object) {
        return object !== null && object !== undefined;
    };
    EntityUtils.isBlank = function (object) {
        for (var propertyName in object) {
            var property = object[propertyName];
            if (this.exists(property)) {
                if (property instanceof Array && property.length > 0) {
                    return false;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };
    return EntityUtils;
}());
exports.EntityUtils = EntityUtils;
//# sourceMappingURL=EntityUtils.js.map