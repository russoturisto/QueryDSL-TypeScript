"use strict";
var MetadataUtils_1 = require("../entity/metadata/MetadataUtils");
/**
 * Created by Papa on 10/19/2016.
 */
(function (JSONClauseObjectType) {
    JSONClauseObjectType[JSONClauseObjectType["DISTINCT_FUNCTION"] = 0] = "DISTINCT_FUNCTION";
    JSONClauseObjectType[JSONClauseObjectType["EXISTS_FUNCTION"] = 1] = "EXISTS_FUNCTION";
    JSONClauseObjectType[JSONClauseObjectType["FIELD"] = 2] = "FIELD";
    JSONClauseObjectType[JSONClauseObjectType["FIELD_FUNCTION"] = 3] = "FIELD_FUNCTION";
    JSONClauseObjectType[JSONClauseObjectType["MANY_TO_ONE_RELATION"] = 4] = "MANY_TO_ONE_RELATION";
})(exports.JSONClauseObjectType || (exports.JSONClauseObjectType = {}));
var JSONClauseObjectType = exports.JSONClauseObjectType;
var AbstractFunctionAdaptor = (function () {
    function AbstractFunctionAdaptor() {
    }
    AbstractFunctionAdaptor.prototype.getFunctionCalls = function (clause, qEntityMapByAlias) {
        var _this = this;
        var stringValue;
        if (clause.type === JSONClauseObjectType.FIELD || clause.type === JSONClauseObjectType.MANY_TO_ONE_RELATION) {
            var fieldClause = clause;
            var alias = fieldClause.tableAlias;
            var qEntity = qEntityMapByAlias[alias];
            var entityMetadata = qEntity.__entityConstructor__;
            var columnName = void 0;
            if (clause.type === JSONClauseObjectType.FIELD) {
                columnName = MetadataUtils_1.MetadataUtils.getPropertyColumnName(fieldClause.propertyName, entityMetadata, alias);
            }
            else {
                columnName = MetadataUtils_1.MetadataUtils.getJoinColumnName(fieldClause.propertyName, entityMetadata, alias);
            }
            stringValue = alias + "." + columnName;
        }
        clause.__appliedFunctions__.forEach(function (appliedFunction) {
            stringValue = _this.getFunctionCall(appliedFunction, stringValue, qEntityMapByAlias);
        });
        return stringValue;
    };
    return AbstractFunctionAdaptor;
}());
exports.AbstractFunctionAdaptor = AbstractFunctionAdaptor;
//# sourceMappingURL=Appliable.js.map