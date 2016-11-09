"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HierarchicalResultParser_1 = require("./HierarchicalResultParser");
/**
 * Created by Papa on 11/8/2016.
 */
var MappedQueryResultParser = (function (_super) {
    __extends(MappedQueryResultParser, _super);
    function MappedQueryResultParser() {
        _super.apply(this, arguments);
    }
    MappedQueryResultParser.prototype.addEntity = function (entityAlias) {
        var resultObject = {};
        this.currentRowObjectMap[entityAlias] = resultObject;
        return resultObject;
    };
    MappedQueryResultParser.prototype.bufferOneToManyCollection = function (entityAlias, resultObject, propertyName, childResultObject) {
        resultObject[propertyName] = [childResultObject];
        this.addOneToManyCollection(entityAlias, resultObject, propertyName);
    };
    MappedQueryResultParser.prototype.flushEntity = function (entityAlias, resultObject) {
        return this.mergeEntity(entityAlias, resultObject);
    };
    return MappedQueryResultParser;
}(HierarchicalResultParser_1.HierarchicalResultParser));
exports.MappedQueryResultParser = MappedQueryResultParser;
//# sourceMappingURL=MappedQueryResultParser.js.map