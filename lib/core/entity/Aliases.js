"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by Papa on 10/18/2016.
 */
var ALIASES = ['a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'];
var AliasCache = (function () {
    function AliasCache(aliasPrefix) {
        if (aliasPrefix === void 0) { aliasPrefix = ''; }
        this.aliasPrefix = aliasPrefix;
        this.reset();
    }
    AliasCache.prototype.getFollowingAlias = function () {
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
    AliasCache.prototype.reset = function () {
        this.lastAlias = [-1, -1, -1];
    };
    return AliasCache;
}());
exports.AliasCache = AliasCache;
var AliasMap = (function () {
    function AliasMap(aliasCache) {
        this.aliasCache = aliasCache;
        this.aliasMap = new Map();
    }
    AliasMap.prototype.getNextAlias = function (object) {
        if (!this.hasAliasFor(object)) {
            return this.getExistingAlias(object);
        }
        var aliasString = this.aliasCache.getFollowingAlias();
        this.aliasMap.set(object, aliasString);
        return aliasString;
    };
    AliasMap.prototype.hasAliasFor = function (object) {
        return this.aliasMap.has(object);
    };
    return AliasMap;
}());
exports.AliasMap = AliasMap;
var EntityAliases = (function (_super) {
    __extends(EntityAliases, _super);
    function EntityAliases(entityAliasCache, columnAliasCache) {
        if (entityAliasCache === void 0) { entityAliasCache = new AliasCache(); }
        if (columnAliasCache === void 0) { columnAliasCache = new AliasCache(); }
        _super.call(this, entityAliasCache);
        this.entityAliasCache = entityAliasCache;
        this.columnAliasCache = columnAliasCache;
    }
    EntityAliases.prototype.getNewFieldColumnAliases = function () {
        return new FieldColumnAliases(this, this.columnAliasCache);
    };
    EntityAliases.prototype.getExistingAlias = function (entity) {
        if (!this.hasAliasFor(entity)) {
            throw "No alias found for entity " + entity.__entityName__;
        }
        return this.aliasMap.get(entity);
    };
    return EntityAliases;
}(AliasMap));
exports.EntityAliases = EntityAliases;
var FieldColumnAliases = (function (_super) {
    __extends(FieldColumnAliases, _super);
    function FieldColumnAliases(_entityAliases, aliasCache) {
        _super.call(this, aliasCache);
        this._entityAliases = _entityAliases;
    }
    Object.defineProperty(FieldColumnAliases.prototype, "entityAliases", {
        get: function () {
            return this._entityAliases;
        },
        enumerable: true,
        configurable: true
    });
    FieldColumnAliases.prototype.getExistingAlias = function (field) {
        if (!this.hasAliasFor(field)) {
            throw "No alias found for field " + field.entityName + "." + field.fieldName;
        }
        return this.aliasMap.get(field);
    };
    return FieldColumnAliases;
}(AliasMap));
exports.FieldColumnAliases = FieldColumnAliases;
//# sourceMappingURL=Aliases.js.map