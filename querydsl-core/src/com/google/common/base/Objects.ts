import {equals} from "../../../../java/lang/Object";
/**
 * Created by Papa on 4/1/2016.
 */
export class Objects {

	static equal(
		o1:any,
		o2:any
	):boolean {
		return equals(o1, o2);
	}
}