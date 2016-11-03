"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Papa on 10/18/2016.
 */
function test(a) {
    return a;
}
var a = test({
    b: 1,
    c: 2
});
var ALIASES = ['a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'];
var lastRootEntityName = [-1, -1, -1];
function getNextRootEntityName() {
    var currentName = this.lastRootEntityName;
    for (var i = 2; i >= 0; i--) {
        var currentIndex = currentName[i];
        currentIndex = (currentIndex + 1) % 26;
        currentName[i] = currentIndex;
        if (currentIndex !== 0) {
            break;
        }
    }
    var nameString = '';
    for (var i = 0; i < 3; i++) {
        nameString += ALIASES[currentName[i]];
    }
    return nameString;
}
exports.getNextRootEntityName = getNextRootEntityName;
var SpecificColumnAliases = (function () {
    function SpecificColumnAliases(aliasKey) {
        this.aliasKey = aliasKey;
        this.aliasEntries = [];
        this.readIndex = 0;
    }
    SpecificColumnAliases.prototype.addAlias = function (columnAlias) {
        this.aliasEntries.push(columnAlias);
    };
    SpecificColumnAliases.prototype.resetReadIndex = function () {
        this.readIndex = 0;
    };
    SpecificColumnAliases.prototype.readNextAlias = function () {
        if (this.readIndex >= this.aliasEntries.length) {
            throw "Too many read references for column " + this.aliasKey;
        }
        return this.aliasEntries[this.readIndex++];
    };
    return SpecificColumnAliases;
}());
var ColumnAliases = (function () {
    function ColumnAliases() {
        this.lastAlias = [-1, -1, -1];
        this.aliasPrefix = '';
    }
    ColumnAliases.prototype.getFollowingAlias = function () {
        var currentAlias = this.lastAlias;
        for (var i = 2; i >= 0; i--) {
            var currentIndex = currentAlias[i];
            currentIndex = (currentIndex + 1) % 26;
            currentAlias[i] = currentIndex;
            if (currentIndex !== 0) {
                break;
            }
        }
        var aliasString = this.aliasPrefix;
        for (var i = 0; i < 3; i++) {
            aliasString += ALIASES[currentAlias[i]];
        }
        return aliasString;
    };
    return ColumnAliases;
}());
exports.ColumnAliases = ColumnAliases;
var EntityColumnAliases = (function (_super) {
    __extends(EntityColumnAliases, _super);
    function EntityColumnAliases() {
        _super.apply(this, arguments);
        this.columnAliasMap = {};
        this.numFields = 0;
    }
    EntityColumnAliases.prototype.addAlias = function (tableAlias, propertyName) {
        var aliasKey = this.getAliasKey(tableAlias, propertyName);
        var columnAlias = this.getFollowingAlias();
        var specificColumnAliases = this.columnAliasMap[aliasKey];
        if (!specificColumnAliases) {
            specificColumnAliases = new SpecificColumnAliases(aliasKey);
            this.columnAliasMap[aliasKey] = specificColumnAliases;
        }
        specificColumnAliases.addAlias(columnAlias);
        this.numFields++;
        return columnAlias;
    };
    EntityColumnAliases.prototype.resetReadIndexes = function () {
        for (var aliasKey in this.columnAliasMap) {
            this.columnAliasMap[aliasKey].resetReadIndex();
        }
    };
    EntityColumnAliases.prototype.getAlias = function (tableAlias, propertyName) {
        var aliasKey = this.getAliasKey(tableAlias, propertyName);
        var specificColumnAliases = this.columnAliasMap[aliasKey];
        if (!specificColumnAliases) {
            throw "No columns added for " + aliasKey;
        }
        return specificColumnAliases.readNextAlias();
    };
    EntityColumnAliases.prototype.getAliasKey = function (tableAlias, propertyName) {
        var aliasKey = tableAlias + "." + propertyName;
        return aliasKey;
    };
    return EntityColumnAliases;
}(ColumnAliases));
exports.EntityColumnAliases = EntityColumnAliases;
var FieldColumnAliases = (function (_super) {
    __extends(FieldColumnAliases, _super);
    function FieldColumnAliases() {
        _super.apply(this, arguments);
        this.aliasMap = new Map();
    }
    FieldColumnAliases.prototype.getNextAlias = function (field) {
        if (!this.hasField(field)) {
            return this.getExistingAlias(field);
        }
        var aliasString = this.getFollowingAlias();
        this.aliasMap.set(field, aliasString);
        return aliasString;
    };
    FieldColumnAliases.prototype.getExistingAlias = function (field) {
        return this.aliasMap.get(field);
    };
    FieldColumnAliases.prototype.hasField = function (field) {
        return this.aliasMap.has(field);
    };
    FieldColumnAliases.prototype.clearFields = function () {
        this.aliasMap.clear();
    };
    return FieldColumnAliases;
}(ColumnAliases));
exports.FieldColumnAliases = FieldColumnAliases;
//# sourceMappingURL=Aliases.js.map