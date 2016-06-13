import {QueryEngine} from "../core/QueryEngine";
import {IQEntity, QEntity} from "../core/entity/Entity";
import {QField} from "../core/field/Field";
import {QRelation} from "../core/entity/Relation";
/**
 * Created by Papa on 6/12/2016.
 */

declare function require(moduleName:string):any;

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

export class PouchDbQueryEngine extends QueryEngine {

	createQuery<IQE extends IQEntity<IQE>>(
		db:pouchDB.IPouchDB,
		queryDefinition:IQE
	):any {

		let fields = [];

		for(let property in queryDefinition) {
			let value = queryDefinition[property];
			// An expression tied to a field
			if(value instanceof QField) {
				
			} else if (value instanceof QRelation) {
			} else if (value instanceof QEntity) {
			}
		}

		db.find({
			selector: {name: 'Mario'},
			fields: ['_id', 'name'],
			sort: ['name']
		})
	}
}