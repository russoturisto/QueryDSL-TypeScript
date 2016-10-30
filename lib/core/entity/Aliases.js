/**
 * Created by Papa on 10/18/2016.
 */
"use strict";
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
        this.numFields = 0;
        this.lastAlias = [-1, -1, -1];
        this.columnAliasMap = {};
    }
    ColumnAliases.prototype.addAlias = function (tableAlias, propertyName) {
        var aliasKey = this.getAliasKey(tableAlias, propertyName);
        var columnAlias = this.getNextAlias();
        var specificColumnAliases = this.columnAliasMap[aliasKey];
        if (!specificColumnAliases) {
            specificColumnAliases = new SpecificColumnAliases(aliasKey);
            this.columnAliasMap[aliasKey] = specificColumnAliases;
        }
        specificColumnAliases.addAlias(columnAlias);
        this.numFields++;
        return columnAlias;
    };
    ColumnAliases.prototype.resetReadIndexes = function () {
        for (var aliasKey in this.columnAliasMap) {
            this.columnAliasMap[aliasKey].resetReadIndex();
        }
    };
    ColumnAliases.prototype.getAlias = function (tableAlias, propertyName) {
        var aliasKey = this.getAliasKey(tableAlias, propertyName);
        var specificColumnAliases = this.columnAliasMap[aliasKey];
        if (!specificColumnAliases) {
            throw "No columns added for " + aliasKey;
        }
        return specificColumnAliases.readNextAlias();
    };
    ColumnAliases.prototype.getAliasKey = function (tableAlias, propertyName) {
        var aliasKey = tableAlias + "." + propertyName;
        return aliasKey;
    };
    ColumnAliases.prototype.getNextAlias = function () {
        var currentAlias = this.lastAlias;
        for (var i = 2; i >= 0; i--) {
            var currentIndex = currentAlias[i];
            currentIndex = (currentIndex + 1) % 26;
            currentAlias[i] = currentIndex;
            if (currentIndex !== 0) {
                break;
            }
        }
        var aliasString = '';
        for (var i = 0; i < 3; i++) {
            aliasString += ALIASES[currentAlias[i]];
        }
        return aliasString;
    };
    return ColumnAliases;
}());
exports.ColumnAliases = ColumnAliases;
//# sourceMappingURL=Aliases.js.map