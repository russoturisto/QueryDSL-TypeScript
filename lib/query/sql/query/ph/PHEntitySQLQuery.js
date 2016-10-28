"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PHMappedSQLQuery_1 = require("./PHMappedSQLQuery");
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
            where: this.whereClauseToJSON(this.phRawQuery.where),
            orderBy: this.orderByClauseToJSON(this.phRawQuery.orderBy)
        };
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