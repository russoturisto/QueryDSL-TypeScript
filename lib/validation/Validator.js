"use strict";
var QValidator = (function () {
    function QValidator() {
    }
    QValidator.prototype.validateReadFromEntity = function (relation) {
    };
    QValidator.prototype.validateReadProperty = function (propertyName, entityName) {
    };
    QValidator.prototype.validateUpdateProperty = function (propertyName, entityName) {
    };
    QValidator.prototype.validateReadQEntityProperty = function (propertyName, qEntity) {
    };
    QValidator.prototype.validateReadQEntityManyToOneRelation = function (propertyName, qEntity) {
    };
    QValidator.prototype.addFunctionAlias = function (functionAlias) {
    };
    QValidator.prototype.addSubQueryAlias = function (subQueryAlias) {
    };
    QValidator.prototype.validateAliasedFieldAccess = function (fieldAlias) {
    };
    return QValidator;
}());
exports.QValidator = QValidator;
var VALIDATOR = new QValidator();
function getValidator(qEntityMapByName) {
    return VALIDATOR;
}
exports.getValidator = getValidator;
//# sourceMappingURL=Validator.js.map