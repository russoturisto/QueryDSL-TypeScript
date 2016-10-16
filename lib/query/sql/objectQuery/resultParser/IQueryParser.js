/**
 * Created by Papa on 10/16/2016.
 */
"use strict";
var SQLStringQuery_1 = require("../../SQLStringQuery");
var RawQueryParser_1 = require("./RawQueryParser");
var PlainQueryParser_1 = require("./PlainQueryParser");
var HierarchicalQueryParser_1 = require("./HierarchicalQueryParser");
var BridgedQueryParser_1 = require("./BridgedQueryParser");
var BridgedQueryConfiguration = (function () {
    function BridgedQueryConfiguration() {
        // This is for conflicts on OneToMany references
        this.strict = true;
        this.mapped = true;
    }
    return BridgedQueryConfiguration;
}());
exports.BridgedQueryConfiguration = BridgedQueryConfiguration;
function getObjectQueryParser(queryResultType, config, qEntity, qEntityMap) {
    switch (queryResultType) {
        case SQLStringQuery_1.QueryResultType.BRIDGED:
            return new BridgedQueryParser_1.BridgedQueryParser(config, qEntity, qEntityMap);
        case SQLStringQuery_1.QueryResultType.HIERARCHICAL:
            return new HierarchicalQueryParser_1.HierarchicalQueryParser();
        case SQLStringQuery_1.QueryResultType.PLAIN:
            return new PlainQueryParser_1.PlainQueryParser();
        case SQLStringQuery_1.QueryResultType.RAW:
            return new RawQueryParser_1.RawQueryParser();
        default:
            throw "Unsupported QueryResultType: " + queryResultType;
    }
}
exports.getObjectQueryParser = getObjectQueryParser;
var AbstractObjectQueryParser = (function () {
    function AbstractObjectQueryParser() {
    }
    AbstractObjectQueryParser.prototype.addManyToOneStub = function (resultObject, propertyName, relationEntityMetadata, relatedEntityId) {
        var manyToOneStub = {};
        resultObject[propertyName] = manyToOneStub;
        manyToOneStub[relationEntityMetadata.idProperty] = relatedEntityId;
    };
    return AbstractObjectQueryParser;
}());
exports.AbstractObjectQueryParser = AbstractObjectQueryParser;
//# sourceMappingURL=IQueryParser.js.map