"use strict";
var Field_1 = require("./Field");
var Relation_1 = require("../entity/Relation");
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
    AbstractFunctionAdaptor.prototype.getFunctionCalls = function (appliable, qEntityMapByAlias) {
        var _this = this;
        var stringValue;
        if (appliable instanceof Field_1.QField || appliable instanceof Relation_1.QManyToOneRelation) {
            var alias = Relation_1.QRelation.getPositionAlias(appliable.q.fromClausePosition);
            var entityMetadata = appliable.q.__entityConstructor__;
            var columnName = void 0;
            if (appliable instanceof Field_1.QField) {
                columnName = MetadataUtils_1.MetadataUtils.getPropertyColumnName(appliable.fieldName, entityMetadata, alias);
            }
            else {
                columnName = MetadataUtils_1.MetadataUtils.getJoinColumnName(appliable.fieldName, entityMetadata, alias);
            }
            stringValue = alias + "." + columnName;
        }
        appliable.appliedFunctions.forEach(function (appliedFunction) {
            stringValue = _this.getFunctionCall(appliedFunction, stringValue, qEntityMapByAlias);
        });
        return stringValue;
    };
    return AbstractFunctionAdaptor;
}());
exports.AbstractFunctionAdaptor = AbstractFunctionAdaptor;
//# sourceMappingURL=Applicable.js.map