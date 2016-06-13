"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueryEngine_1 = require("../core/QueryEngine");
var Entity_1 = require("../core/entity/Entity");
var Field_1 = require("../core/field/Field");
var Relation_1 = require("../core/entity/Relation");
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var PouchDbQueryEngine = (function (_super) {
    __extends(PouchDbQueryEngine, _super);
    function PouchDbQueryEngine() {
        _super.apply(this, arguments);
    }
    PouchDbQueryEngine.prototype.createQuery = function (db, queryDefinition) {
        var fields = [];
        for (var property in queryDefinition) {
            var value = queryDefinition[property];
            // An expression tied to a field
            if (value instanceof Field_1.QField) {
            }
            else if (value instanceof Relation_1.QRelation) {
            }
            else if (value instanceof Entity_1.QEntity) {
            }
        }
        db.find({
            selector: { name: 'Mario' },
            fields: ['_id', 'name'],
            sort: ['name']
        });
    };
    return PouchDbQueryEngine;
}(QueryEngine_1.QueryEngine));
exports.PouchDbQueryEngine = PouchDbQueryEngine;
//# sourceMappingURL=PouchDbQueryEngine.js.map