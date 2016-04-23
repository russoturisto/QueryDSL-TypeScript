/**
 * Created by Papa on 4/22/2016.
 */

export enum OperationType {
	AND, // $and
	EQUALS, // $eq
	EXISTS, // $exists
	GREATER_THAN, // $gt
	GREATER_THAN_OR_EQUALS, // $gte
	IN, // $in
	LIKE, // $regex
	LESS_THAN, // $lt
	LESS_THAN_OR_EQUALS, // $lte
	NOR, // $nor
	NOT, // $not
	NOT_EQUALS, // $ne
	NOT_IN, // $nin
	OR // $or
	/*
	$type, $all, $size, $mod, $regex, $elemMatch
	 */
}