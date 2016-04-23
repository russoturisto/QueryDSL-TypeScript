/**
 * Created by Papa on 4/21/2016.
 */
import {IComparisonOperation, ComparisonOperation} from "../operation/ComparisonOperation";
import {IQEntity} from "../entity/Entity";
import {IOperation} from "../operation/Operation";

export class StringField<Q extends IQEntity>
implements IComparisonOperation<string, Q>,
					 IOperation<Q> {

	comparisonOperation:IComparisonOperation<string, Q>;

	constructor(
		private fieldName:string,
		private qEntity:Q
	) {
	}

	getQ():Q {
		return this.qEntity;
	}

	setComparisonOperation( value:string ) {
	}

	equals( value:string ):IOperation<Q> {
		let eqOp = new ComparisonOperation(this.qEntity, this.fieldName);
		eqOp.equals(value);

		return <any>this;
	}

	objectEquals<OP extends IOperation<Q>>(
		otherOp:OP,
		checkValue?:boolean
	):boolean {
		throw `Not implemented`;
	}

}
