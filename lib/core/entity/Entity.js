"use strict";
var QEntity = (function () {
    // rootOperation:LogicalOperation<IQ> = new LogicalOperation<IQ>(<any>this, OperationType.AND, []);
    function QEntity(entityConstructor, name, isTemplate, nativeName) {
        if (isTemplate === void 0) { isTemplate = false; }
        this.entityConstructor = entityConstructor;
        this.name = name;
        this.isTemplate = isTemplate;
        this.nativeName = nativeName;
        this.entityFields = [];
        this.entityRelations = [];
        // TODO: convert class name to native name if it's not provided
    }
    QEntity.prototype.addEntityRelation = function (relation) {
        this.entityRelations.push(relation);
    };
    QEntity.prototype.addEntityField = function (field) {
        this.entityFields.push(field);
    };
    /*
        addOperation<O extends IOperation<IQ>>(
            op:O
        ):void {
            this.rootOperation.getChildOps().push(op);
        }
    */
    QEntity.prototype.getQ = function () {
        return this;
    };
    QEntity.prototype.fields = function (fields) {
        throw "Not implemented";
    };
    return QEntity;
}());
exports.QEntity = QEntity;
//# sourceMappingURL=Entity.js.map