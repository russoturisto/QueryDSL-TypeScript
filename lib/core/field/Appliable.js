"use strict";
var MetadataUtils_1 = require("../entity/metadata/MetadataUtils");
/**
 * Created by Papa on 10/19/2016.
 */
(function (JSONClauseObjectType) {
    JSONClauseObjectType[JSONClauseObjectType["FIELD"] = 0] = "FIELD";
    JSONClauseObjectType[JSONClauseObjectType["FUNCTION"] = 1] = "FUNCTION";
    JSONClauseObjectType[JSONClauseObjectType["MANY_TO_ONE_RELATION"] = 2] = "MANY_TO_ONE_RELATION";
})(exports.JSONClauseObjectType || (exports.JSONClauseObjectType = {}));
var JSONClauseObjectType = exports.JSONClauseObjectType;
var AbstractFunctionAdaptor = (function () {
    function AbstractFunctionAdaptor() {
    }
    AbstractFunctionAdaptor.prototype.getFunctionCalls = function (clause, qEntityMapByAlias) {
        var _this = this;
        var stringValue;
        switch (clause.type) {
            case JSONClauseObjectType.FUNCTION:
                break;
            case JSONClauseObjectType.FIELD:
            case JSONClauseObjectType.MANY_TO_ONE_RELATION:
                break;
        }
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
        clause.appliedFunctions.forEach(function (appliedFunction) {
            stringValue = _this.getFunctionCall(appliedFunction, stringValue, qEntityMapByAlias);
        });
        return stringValue;
    };
    return AbstractFunctionAdaptor;
}());
exports.AbstractFunctionAdaptor = AbstractFunctionAdaptor;
//# sourceMappingURL=Appliable.js.map