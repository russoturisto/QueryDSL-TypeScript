import {JObject} from "../../../../java/lang/Object";
/**
 * Created by Papa on 4/1/2016.
 */
export class Objects {

	static equal(
		o1:any,
		o2:any
	):boolean {
		if (!o1 && !o2) {
			return false;
		}
		if (o1) {
			return JObject.equals(o1, o2);
		}
		return false;
	}
}