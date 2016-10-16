/**
 * Created by Papa on 10/16/2016.
 */
"use strict";
(function (QueryResultType) {
    // Ordered query result with bridging for all MtOs and OtM
    QueryResultType[QueryResultType["BRIDGED"] = 0] = "BRIDGED";
    // Ordered query result, with objects grouped hierarchically by entity
    QueryResultType[QueryResultType["HIERARCHICAL"] = 1] = "HIERARCHICAL";
    // Plain query result, with no forced ordering or grouping
    QueryResultType[QueryResultType["PLAIN"] = 2] = "PLAIN";
    // A flat array of values, returned by a regular join
    QueryResultType[QueryResultType["RAW"] = 3] = "RAW";
})(exports.QueryResultType || (exports.QueryResultType = {}));
var QueryResultType = exports.QueryResultType;
var BridgedQueryConfiguration = (function () {
    function BridgedQueryConfiguration() {
        // This is for conflicts on OneToMany references
        this.strict = true;
        this.mapped = true;
    }
    return BridgedQueryConfiguration;
}());
exports.BridgedQueryConfiguration = BridgedQueryConfiguration;
//# sourceMappingURL=IQueryBridge.js.map