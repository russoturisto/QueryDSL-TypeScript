"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Operation_1 = require("./Operation");
var OperationType_1 = require("./OperationType");
function equals(value) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.EQUALS);
    instance.isEqComparison = instance.isAnyComparison = value instanceof ComparisonOperation;
    instance.eqValue = instance.anyValue = value;
    return instance;
}
exports.equals = equals;
function exists(exists) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.EXISTS);
    instance.existsValue = instance.anyValue = exists;
    return instance;
}
exports.exists = exists;
function greaterThan(greaterThan) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN);
    instance.gtValue = instance.anyValue = greaterThan;
    return instance;
}
exports.greaterThan = greaterThan;
function greaterThanOrEquals(greaterThanOrEquals) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN_OR_EQUALS);
    instance.gteValue = instance.anyValue = greaterThanOrEquals;
    return instance;
}
exports.greaterThanOrEquals = greaterThanOrEquals;
function isIn(values) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.IN);
    instance.isInComparison = instance.isAnyComparison = values[0] instanceof ComparisonOperation;
    instance.inValues = instance.anyValue = values;
    return instance;
}
exports.isIn = isIn;
function like(like) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.LIKE);
    instance.isRegExp = instance.isAnyComparison = like instanceof RegExp;
    instance.likeValue = instance.anyValue = like;
    return instance;
}
exports.like = like;
function lessThan(lessThan) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.LESS_THAN);
    instance.ltValue = instance.anyValue = lessThan;
    return instance;
}
exports.lessThan = lessThan;
function lessThanOrEquals(greaterThanOrEquals) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.LESS_THAN_OR_EQUALS);
    instance.lteValue = instance.anyValue = greaterThanOrEquals;
    return instance;
}
exports.lessThanOrEquals = lessThanOrEquals;
function notEquals(value) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.NOT_EQUALS);
    instance.isNeComparison = instance.isAnyComparison = value instanceof ComparisonOperation;
    instance.neValue = instance.anyValue = value;
    return instance;
}
exports.notEquals = notEquals;
function notIn(values) {
    var instance = ComparisonOperation.getDefinedInstance(OperationType_1.OperationType.NOT_IN);
    instance.isNinComparison = instance.isAnyComparison = values[0] instanceof ComparisonOperation;
    instance.ninValues = instance.anyValue = values;
    return instance;
}
exports.notIn = notIn;
var ComparisonOperation = (function (_super) {
    __extends(ComparisonOperation, _super);
    function ComparisonOperation(type, owningEntity, fieldType, fieldName, nativeFieldName) {
        if (nativeFieldName === void 0) { nativeFieldName = fieldName; }
        _super.call(this, owningEntity, fieldType, fieldName, nativeFieldName, type);
    }
    ComparisonOperation.getDefinedInstance = function (type, q, fieldType, fieldName, nativeFieldName) {
        var definedOperation = new ComparisonOperation(type, q, fieldType, fieldName, nativeFieldName);
        definedOperation.isDefined = true;
        return definedOperation;
    };
    ComparisonOperation.prototype.valueEquals = function (otherOp, checkValue) {
        if (this.type !== otherOp.type) {
            return false;
        }
        var otherCOp = otherOp;
        if (this.isAnyComparison !== otherCOp.isAnyComparison) {
            return false;
        }
        if (this.anyValue !== otherCOp.anyValue) {
            return false;
        }
        return true;
    };
    ComparisonOperation.prototype.getDefinedInstance = function (type) {
        if (this.isDefined) {
            throw "This operation is already defined, cannot create another one from it";
        }
        var definedOperation = ComparisonOperation.getDefinedInstance(type, this.q, this.fieldType, this.fieldName, this.nativeFieldName);
        definedOperation.isDefined = true;
        return definedOperation;
    };
    ComparisonOperation.prototype.equals = function (value) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.EQUALS);
        instance.isEqComparison = instance.isAnyComparison = value instanceof ComparisonOperation;
        instance.eqValue = instance.anyValue = value;
        return instance;
    };
    ComparisonOperation.prototype.exists = function (exists) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.EXISTS);
        instance.existsValue = instance.anyValue = exists;
        return instance;
    };
    ComparisonOperation.prototype.greaterThan = function (greaterThan) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN);
        instance.gtValue = instance.anyValue = greaterThan;
        return instance;
    };
    ComparisonOperation.prototype.greaterThanOrEquals = function (greaterThanOrEquals) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN_OR_EQUALS);
        instance.gteValue = instance.anyValue = greaterThanOrEquals;
        return instance;
    };
    ComparisonOperation.prototype.isIn = function (values) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.IN);
        instance.isInComparison = instance.isAnyComparison = values[0] instanceof ComparisonOperation;
        instance.inValues = instance.anyValue = values;
        return instance;
    };
    ComparisonOperation.prototype.like = function (like) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.LIKE);
        instance.isRegExp = instance.isAnyComparison = like instanceof RegExp;
        instance.likeValue = instance.anyValue = like;
        return instance;
    };
    ComparisonOperation.prototype.lessThan = function (lessThan) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.LESS_THAN);
        instance.ltValue = instance.anyValue = lessThan;
        return instance;
    };
    ComparisonOperation.prototype.lessThanOrEquals = function (greaterThanOrEquals) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.LESS_THAN_OR_EQUALS);
        instance.lteValue = instance.anyValue = greaterThanOrEquals;
        return instance;
    };
    ComparisonOperation.prototype.notEquals = function (value) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.NOT_EQUALS);
        instance.isNeComparison = instance.isAnyComparison = value instanceof ComparisonOperation;
        instance.neValue = instance.anyValue = value;
        return instance;
    };
    ComparisonOperation.prototype.notIn = function (values) {
        var instance = this.getDefinedInstance(OperationType_1.OperationType.NOT_IN);
        instance.isNinComparison = instance.isAnyComparison = values[0] instanceof ComparisonOperation;
        instance.ninValues = instance.anyValue = values;
        return instance;
    };
    return ComparisonOperation;
}(Operation_1.Operation));
exports.ComparisonOperation = ComparisonOperation;
//# sourceMappingURL=ComparisonOperation.js.map