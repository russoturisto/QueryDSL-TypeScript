/**
 * Created by Papa on 10/16/2016.
 */
"use strict";
var SQLStringQuery_1 = require("../../SQLStringQuery");
var HierarchicalResultParser_1 = require("./HierarchicalResultParser");
var BridgedResultParser_1 = require("./entity/BridgedResultParser");
var BridgedQueryConfiguration = (function () {
    function BridgedQueryConfiguration() {
        // This is for conflicts on OneToMany references
        this.strict = true;
        this.mapped = true;
    }
    return BridgedQueryConfiguration;
}());
exports.BridgedQueryConfiguration = BridgedQueryConfiguration;
function getObjectResultParser(queryResultType, config, rootQEntity, qEntityMapByName) {
    switch (queryResultType) {
        case SQLStringQuery_1.QueryResultType.ENTITY_BRIDGED:
            return new BridgedResultParser_1.BridgedResultParser(config, rootQEntity, qEntityMapByName);
        case SQLStringQuery_1.QueryResultType.ENTITY_HIERARCHICAL:
            return new HierarchicalResultParser_1.HierarchicalResultParser();
        default:
            throw "ObjectQueryParser not supported for QueryResultType: " + queryResultType;
    }
}
exports.getObjectResultParser = getObjectResultParser;
var AbstractObjectResultParser = (function () {
    function AbstractObjectResultParser() {
    }
    AbstractObjectResultParser.prototype.addManyToOneStub = function (resultObject, propertyName, relationEntityMetadata, relatedEntityId) {
        var manyToOneStub = {};
        resultObject[propertyName] = manyToOneStub;
        manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
    };
    return AbstractObjectResultParser;
}());
exports.AbstractObjectResultParser = AbstractObjectResultParser;
//# sourceMappingURL=IEntityResultParser.js.map