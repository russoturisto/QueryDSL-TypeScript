/**
 * Created by Papa on 4/22/2016.
 */
"use strict";
(function (OperationType) {
    OperationType[OperationType["AND"] = 0] = "AND";
    OperationType[OperationType["EQUALS"] = 1] = "EQUALS";
    OperationType[OperationType["EXISTS"] = 2] = "EXISTS";
    OperationType[OperationType["GREATER_THAN"] = 3] = "GREATER_THAN";
    OperationType[OperationType["GREATER_THAN_OR_EQUALS"] = 4] = "GREATER_THAN_OR_EQUALS";
    OperationType[OperationType["IN"] = 5] = "IN";
    OperationType[OperationType["LIKE"] = 6] = "LIKE";
    OperationType[OperationType["LESS_THAN"] = 7] = "LESS_THAN";
    OperationType[OperationType["LESS_THAN_OR_EQUALS"] = 8] = "LESS_THAN_OR_EQUALS";
    OperationType[OperationType["NOR"] = 9] = "NOR";
    OperationType[OperationType["NOT"] = 10] = "NOT";
    OperationType[OperationType["NOT_EQUALS"] = 11] = "NOT_EQUALS";
    OperationType[OperationType["NOT_IN"] = 12] = "NOT_IN";
    OperationType[OperationType["OR"] = 13] = "OR"; // $or
    /*
    $type, $all, $size, $mod, $regex, $elemMatch
     */
})(exports.OperationType || (exports.OperationType = {}));
var OperationType = exports.OperationType;
//# sourceMappingURL=OperationType.js.map