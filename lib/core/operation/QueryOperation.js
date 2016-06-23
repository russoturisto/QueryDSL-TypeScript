"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Operation_1 = require("./Operation");
var OperationType_1 = require("./OperationType");
function equals(value) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.EQUALS, value);
}
exports.equals = equals;
function exists(exists) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.EXISTS, exists);
}
exports.exists = exists;
function greaterThan(greaterThan) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN, greaterThan);
}
exports.greaterThan = greaterThan;
function greaterThanOrEquals(greaterThanOrEquals) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.GREATER_THAN_OR_EQUALS, greaterThanOrEquals);
}
exports.greaterThanOrEquals = greaterThanOrEquals;
function isIn(values) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.IN, values);
}
exports.isIn = isIn;
function like(like) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.LIKE, like);
}
exports.like = like;
function lessThan(lessThan) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.LESS_THAN, lessThan);
}
exports.lessThan = lessThan;
function lessThanOrEquals(lessThanOrEquals) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.LESS_THAN_OR_EQUALS, lessThanOrEquals);
}
exports.lessThanOrEquals = lessThanOrEquals;
function notEquals(value) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.NOT_EQUALS, value);
}
exports.notEquals = notEquals;
function notIn(values) {
    return QueryOperation.getDefinedInstance(OperationType_1.OperationType.NOT_IN, values);
}
exports.notIn = notIn;
var QueryOperation = (function (_super) {
    __extends(QueryOperation, _super);
    function QueryOperation(type) {
        _super.call(this, type);
    }
    QueryOperation.getDefinedInstance = function (type, value) {
        var definedOperation = new QueryOperation(type);
        definedOperation.isDefined = true;
        definedOperation.value = value;
        return definedOperation;
    };
    QueryOperation.prototype.valueEquals = function (otherOp, checkValue) {
        if (this.type !== otherOp.type) {
            return false;
        }
        var otherCOp = otherOp;
        if (this.value !== otherCOp.value) {
            return false;
        }
        return true;
    };
    QueryOperation.prototype.toJSON = function () {
        var operator = {};
        var operation;
        switch (this.type) {
            case OperationType_1.OperationType.EQUALS:
                operation = "$eq";
                break;
            case OperationType_1.OperationType.EXISTS:
                operation = "$exists";
                break;
            case OperationType_1.OperationType.GREATER_THAN:
                operation = "$gt";
                break;
            case OperationType_1.OperationType.GREATER_THAN_OR_EQUALS:
                operation = "$gte";
                break;
            case OperationType_1.OperationType.IN:
                operation = "$in";
                break;
            case OperationType_1.OperationType.LESS_THAN:
                operation = "$lt";
                break;
            case OperationType_1.OperationType.LESS_THAN_OR_EQUALS:
                operation = "$lte";
                break;
            case OperationType_1.OperationType.LIKE:
                operation = "$like";
                break;
            case OperationType_1.OperationType.NOT_EQUALS:
                operation = "$ne";
                break;
            case OperationType_1.OperationType.NOT_IN:
                operation = "$nin";
                break;
            case OperationType_1.OperationType.AND:
                operation = "$and";
                break;
            case OperationType_1.OperationType.NOT:
                operation = "$not";
                break;
            case OperationType_1.OperationType.OR:
                operation = "$or";
                break;
        }
        var jsonValue = this.value;
        if (this.value instanceof Array) {
            jsonValue = this.value.map(function (aValue) {
                var aJsonValue = aValue;
                if (aValue instanceof QueryOperation) {
                    aJsonValue = aValue.toJSON();
                }
                return aJsonValue;
            });
        }
        else if (this.value instanceof QueryOperation) {
            jsonValue = this.value.toJSON();
        }
        operator[operation] = jsonValue;
        return operator;
    };
    return QueryOperation;
}(Operation_1.Operation));
exports.QueryOperation = QueryOperation;
//# sourceMappingURL=QueryOperation.js.map