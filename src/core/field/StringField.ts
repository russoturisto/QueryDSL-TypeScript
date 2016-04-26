/**
 * Created by Papa on 4/21/2016.
 */
import {IComparisonOperation, ComparisonOperation} from "../operation/ComparisonOperation";
import {IQEntity} from "../entity/Entity";
import {IOperation} from "../operation/Operation";

export abstract class StringField<Q extends IQEntity<Q>>
extends ComparisonOperation<string, Q> {

	comparisonOperation:IComparisonOperation<string, Q>;

	constructor(
		fieldName:string,
		qEntity:Q
	) {
		super(qEntity, fieldName, null);
	}

	setComparisonOperation( value:string ) {
	}

	objectEquals<OP extends IOperation<Q>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {
		throw `Not implemented`;
	}

}
