/**
 * Created by Papa on 10/14/2016.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MappedEntityArray = (function (_super) {
    __extends(MappedEntityArray, _super);
    function MappedEntityArray(keyField) {
        _super.call(this);
        this.keyField = keyField;
        this.dataMap = {};
    }
    MappedEntityArray.prototype.clear = function () {
        this.dataMap = {};
        this.splice(0, this.length);
    };
    MappedEntityArray.prototype.putAll = function (values) {
        var _this = this;
        values.forEach(function (value) {
            _this.put(value);
        });
    };
    MappedEntityArray.prototype.put = function (value) {
        var keyValue = value[this.keyField];
        if (!keyValue && keyValue != 0) {
            throw "Key field " + this.keyField + " is not defined";
        }
        this.dataMap[value[this.keyField]] = value;
        this.push(value);
    };
    MappedEntityArray.prototype.get = function (key) {
        return this.dataMap[key];
    };
    MappedEntityArray.prototype.delete = function (key) {
        var value = this.dataMap[key];
        delete this.dataMap[key];
        for (var i = this.length - 1; i >= 0; i--) {
            var currentValue = this[i];
            if (currentValue === value) {
                this.splice(i, 1);
                break;
            }
        }
        return value;
    };
    return MappedEntityArray;
}(Array));
exports.MappedEntityArray = MappedEntityArray;
//# sourceMappingURL=MappedArray.js.map