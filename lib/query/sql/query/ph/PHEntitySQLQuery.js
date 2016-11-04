"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHMappedSQLQuery_1 = require("./PHMappedSQLQuery");
var Field_1 = require("../../../../core/field/Field");
var PHAbstractSQLQuery_1 = require("./PHAbstractSQLQuery");
var PHEntitySQLQuery = (function (_super) {
    __extends(PHEntitySQLQuery, _super);
    function PHEntitySQLQuery(phRawQuery) {
        _super.call(this);
        this.phRawQuery = phRawQuery;
        this.isEntityQuery = true;
        this.isHierarchicalEntityQuery = true;
    }
    PHEntitySQLQuery.prototype.toJSON = function () {
        return {
            select: this.selectClauseToJSON(this.phRawQuery.select),
            from: this.fromClauseToJSON(this.phRawQuery.from),
            where: PHAbstractSQLQuery_1.PHAbstractSQLQuery.whereClauseToJSON(this.phRawQuery.where),
            orderBy: this.orderByClauseToJSON(this.phRawQuery.orderBy)
        };
    };
    PHEntitySQLQuery.prototype.nonDistinctSelectClauseToJSON = function (rawSelect) {
        for (var field in rawSelect) {
            var value = rawSelect[field];
            if (value instanceof Field_1.QField) {
                throw "Field References cannot be used in Entity Queries";
            }
            else if (value instanceof Object && !(value instanceof Date)) {
                this.nonDistinctSelectClauseToJSON(value);
            }
        }
        return rawSelect;
    };
    PHEntitySQLQuery.prototype.orderByClauseToJSON = function (orderBy) {
        if (!orderBy || !orderBy.length) {
            return null;
        }
        return orderBy.map(function (field) {
            return field.toEntityJSON();
        });
    };
    return PHEntitySQLQuery;
}(PHMappedSQLQuery_1.PHMappableSQLQuery));
exports.PHEntitySQLQuery = PHEntitySQLQuery;
var PHLimitedEntitySQLQuery = (function (_super) {
    __extends(PHLimitedEntitySQLQuery, _super);
    function PHLimitedEntitySQLQuery(phRawQuery) {
        _super.call(this, phRawQuery);
        this.phRawQuery = phRawQuery;
        this.isHierarchicalEntityQuery = false;
    }
    PHLimitedEntitySQLQuery.prototype.toJSON = function () {
        var limitedJsonEntity = _super.prototype.toJSON.call(this);
        limitedJsonEntity.limit = this.phRawQuery.limit;
        limitedJsonEntity.offset = this.phRawQuery.offset;
        return limitedJsonEntity;
    };
    return PHLimitedEntitySQLQuery;
}(PHEntitySQLQuery));
exports.PHLimitedEntitySQLQuery = PHLimitedEntitySQLQuery;
//# sourceMappingURL=PHEntitySQLQuery.js.map