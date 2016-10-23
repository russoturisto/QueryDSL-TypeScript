"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Entity_1 = require("./Entity");
var Aliases_1 = require("./Aliases");
var NumberField_1 = require("../field/NumberField");
var BooleanField_1 = require("../field/BooleanField");
var DateField_1 = require("../field/DateField");
var StringField_1 = require("../field/StringField");
var SubSelectEntity = (function () {
    function SubSelectEntity() {
    }
    return SubSelectEntity;
}());
exports.SubSelectEntity = SubSelectEntity;
exports.SUB_SELECT_ENTITY_NAME = "SubSelectEntity";
var SubSelectQEntity = (function (_super) {
    __extends(SubSelectQEntity, _super);
    function SubSelectQEntity(rootEntityPrefix, fromClausePosition, relationPropertyName, joinType) {
        if (rootEntityPrefix === void 0) { rootEntityPrefix = Aliases_1.getNextRootEntityName(); }
        if (fromClausePosition === void 0) { fromClausePosition = []; }
        if (relationPropertyName === void 0) { relationPropertyName = null; }
        if (joinType === void 0) { joinType = null; }
        _super.call(this, SubSelectQEntity, SubSelectEntity, exports.SUB_SELECT_ENTITY_NAME, rootEntityPrefix, fromClausePosition, relationPropertyName, joinType);
        this.rootEntityPrefix = rootEntityPrefix;
        this.fromClausePosition = fromClausePosition;
        this.relationPropertyName = relationPropertyName;
        this.joinType = joinType;
    }
    SubSelectQEntity.prototype.numberField = function (fieldName) {
        var field = this.__entityFieldMap__[fieldName];
        if (!field) {
            field = new NumberField_1.QNumberField(this, SubSelectQEntity, exports.SUB_SELECT_ENTITY_NAME, fieldName);
        }
        return field;
    };
    SubSelectQEntity.prototype.booleanField = function (fieldName) {
        var field = this.__entityFieldMap__[fieldName];
        if (!field) {
            field = new BooleanField_1.QBooleanField(this, SubSelectQEntity, exports.SUB_SELECT_ENTITY_NAME, fieldName);
        }
        return field;
    };
    SubSelectQEntity.prototype.dateField = function (fieldName) {
        var field = this.__entityFieldMap__[fieldName];
        if (!field) {
            field = new DateField_1.QDateField(this, SubSelectQEntity, exports.SUB_SELECT_ENTITY_NAME, fieldName);
        }
        return field;
    };
    SubSelectQEntity.prototype.stringField = function (fieldName) {
        var field = this.__entityFieldMap__[fieldName];
        if (!field) {
            field = new StringField_1.QStringField(this, SubSelectQEntity, exports.SUB_SELECT_ENTITY_NAME, fieldName);
        }
        return field;
    };
    SubSelectQEntity.prototype.toJSON = function () {
        throw 'Not Implemented';
    };
    return SubSelectQEntity;
}(Entity_1.QEntity));
exports.SubSelectQEntity = SubSelectQEntity;
//# sourceMappingURL=SubSelectEntity.js.map