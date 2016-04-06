/*
 * Copyright 2015, The Querydsl Team (http://www.querydsl.com/team)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference path='../../../../../../node_modules/immutable/dist/immutable.d.ts'/>

import {Immutable} from "immutable/dist/immutable";
import {Operator} from "./Operator";
import {Integer} from "../../../../java/lang/Integer";
import {Character} from "../../../../java/lang/Character";
import {Final} from "../../../../java/Final";
import {Comparable} from "../../../../java/lang/Comparable";

class OpsBase implements Operator {

	@Final
	private type:any;

	constructor( type:any ) {
		this.type = type;
	}

	public getType():any {
		return this.type;
	}

	public name():string {
		return this.type.name;
	}
}

/**
 * {@code Ops} provides the operators for the fluent query grammar.
 *
 * @author tiwe
 */
export class Ops extends OpsBase {

	// general
	static EQ = new Ops(Boolean);
	static NE = new Ops(Boolean);
	static IS_NULL = new Ops(Boolean);
	static IS_NOT_NULL = new Ops(Boolean);
	static INSTANCE_OF = new Ops(Boolean);
	static NUMCAST = new Ops(Number);
	static STRING_CAST = new Ops(String);
	static ALIAS = new Ops(Object);
	static LIST = new Ops(Object);
	static SINGLETON = new Ops(Object);
	static ORDINAL = new Ops(Integer);
	static WRAPPED = new Ops(Object);
	static ORDER = new Ops(Object);

	// collection
	static IN = new Ops(Boolean); // cmp. contains
	static NOT_IN = new Ops(Boolean);
	static COL_IS_EMPTY = new Ops(Boolean);
	static COL_SIZE = new Ops(Integer);

	// array
	static ARRAY_SIZE = new Ops(Number);

	// map
	static CONTAINS_KEY = new Ops(Boolean);
	static CONTAINS_VALUE = new Ops(Boolean);
	static MAP_SIZE = new Ops(Integer);
	static MAP_IS_EMPTY = new Ops(Boolean);

	// Boolean
	static AND = new Ops(Boolean);
	static NOT = new Ops(Boolean);
	static OR = new Ops(Boolean);
	static XNOR = new Ops(Boolean);
	static XOR = new Ops(Boolean);

	// Comparable
	static BETWEEN = new Ops(Boolean);
	static GOE = new Ops(Boolean);
	static GT = new Ops(Boolean);
	static LOE = new Ops(Boolean);
	static LT = new Ops(Boolean);

	// Number
	static NEGATE = new Ops(Number);
	static ADD = new Ops(Number);
	static DIV = new Ops(Number);
	static MULT = new Ops(Number);
	static SUB = new Ops(Number);
	static MOD = new Ops(Number);

	// String
	static CHAR_AT = new Ops(Character);
	static CONCAT = new Ops(String);
	static LOWER = new Ops(String);
	static SUBSTR_1ARG = new Ops(String);
	static SUBSTR_2ARGS = new Ops(String);
	static TRIM = new Ops(String);
	static UPPER = new Ops(String);
	static MATCHES = new Ops(Boolean);
	static MATCHES_IC = new Ops(Boolean);
	static STRING_LENGTH = new Ops(Integer);
	static STRING_IS_EMPTY = new Ops(Boolean);
	static STARTS_WITH = new Ops(Boolean);
	static STARTS_WITH_IC = new Ops(Boolean);
	static INDEX_OF_2ARGS = new Ops(Integer);
	static INDEX_OF = new Ops(Integer);
	static EQ_IGNORE_CASE = new Ops(Boolean);
	static ENDS_WITH = new Ops(Boolean);
	static ENDS_WITH_IC = new Ops(Boolean);
	static STRING_CONTAINS = new Ops(Boolean);
	static STRING_CONTAINS_IC = new Ops(Boolean);
	static LIKE = new Ops(Boolean);
	static LIKE_IC = new Ops(Boolean);
	static LIKE_ESCAPE = new Ops(Boolean);
	static LIKE_ESCAPE_IC = new Ops(Boolean);

	// case
	static CASE = new Ops(Object);
	static CASE_WHEN = new Ops(Object);
	static CASE_ELSE = new Ops(Object);

	// case for eq
	static CASE_EQ = new Ops(Object);
	static CASE_EQ_WHEN = new Ops(Object);
	static CASE_EQ_ELSE = new Ops(Object);

	// coalesce
	static COALESCE = new Ops(Object);
	static NULLIF = new Ops(Object);

	// subquery operations
	static EXISTS = new Ops(Boolean);



	@Final
	public static equalsOps:Immutable.Set<Operator> = Immutable.Set<Operator>(Ops.EQ);
	
	@Final
	public static notEqualsOps:Immutable.Set<Operator> = Immutable.Set<Operator>(Ops.NE);

	@Final
	public static compareOps:Immutable.Set<Operator> = Immutable.Set<Operator>(Ops.EQ, Ops.NE, Ops.LT, Ops.GT, Ops.GOE, Ops.LOE);

	@Final
	public static notEqualsOps:Immutable.Set<Operator> = Immutable.Set<Operator>(
			AggOps.AVG_AGG,
			AggOps.COUNT_AGG,
			AggOps.COUNT_DISTINCT_AGG,
			AggOps.MAX_AGG,
			AggOps.MIN_AGG,
			AggOps.SUM_AGG);
}

/**
 * Aggregation operators
 */
export class AggOps extends OpsBase {
	static BOOLEAN_ALL = new AggOps(Boolean);
	static BOOLEAN_ANY = new AggOps(Boolean);
	static MAX_AGG = new AggOps(Comparable);
	static MIN_AGG = new AggOps(Comparable);
	static AVG_AGG = new AggOps(Number);
	static SUM_AGG = new AggOps(Number);
	static COUNT_AGG = new AggOps(Number);
	static COUNT_DISTINCT_AGG = new AggOps(Number);
	static COUNT_DISTINCT_ALL_AGG = new AggOps(Number);
	static COUNT_ALL_AGG = new AggOps(Number);
}

/**
 * Quantification operators
 */
export class QuantOps extends OpsBase {
	static AVG_IN_COL = new QuantOps(Number);
	static MAX_IN_COL = new QuantOps(Comparable);
	static MIN_IN_COL = new QuantOps(Comparable);
	static ANY = new QuantOps(Object);
	static ALL = new QuantOps(Object);
}

/**
 * Date and time operators
 */
export class DateTimeOps extends OpsBase {
	static DATE = new DateTimeOps(Comparable);
	static CURRENT_DATE = new DateTimeOps(Comparable);
	static CURRENT_TIME = new DateTimeOps(Comparable);
	static CURRENT_TIMESTAMP = new DateTimeOps(Comparable);
	static ADD_YEARS = new DateTimeOps(Comparable);
	static ADD_MONTHS = new DateTimeOps(Comparable);
	static ADD_WEEKS = new DateTimeOps(Comparable);
	static ADD_DAYS = new DateTimeOps(Comparable);
	static ADD_HOURS = new DateTimeOps(Comparable);
	static ADD_MINUTES = new DateTimeOps(Comparable);
	static ADD_SECONDS = new DateTimeOps(Comparable);
	static DIFF_YEARS = new DateTimeOps(Comparable);
	static DIFF_MONTHS = new DateTimeOps(Comparable);
	static DIFF_WEEKS = new DateTimeOps(Comparable);
	static DIFF_DAYS = new DateTimeOps(Comparable);
	static DIFF_HOURS = new DateTimeOps(Comparable);
	static DIFF_MINUTES = new DateTimeOps(Comparable);
	static DIFF_SECONDS = new DateTimeOps(Comparable);
	static TRUNC_YEAR = new DateTimeOps(Comparable);
	static TRUNC_MONTH = new DateTimeOps(Comparable);
	static TRUNC_WEEK = new DateTimeOps(Comparable);
	static TRUNC_DAY = new DateTimeOps(Comparable);
	static TRUNC_HOUR = new DateTimeOps(Comparable);
	static TRUNC_MINUTE = new DateTimeOps(Comparable);
	static TRUNC_SECOND = new DateTimeOps(Comparable);
	static HOUR = new DateTimeOps(Integer);
	static MINUTE = new DateTimeOps(Integer);
	static MONTH = new DateTimeOps(Integer);
	static SECOND = new DateTimeOps(Integer);
	static MILLISECOND = new DateTimeOps(Integer);
	static SYSDATE = new DateTimeOps(Comparable);
	static YEAR = new DateTimeOps(Integer);
	static WEEK = new DateTimeOps(Integer);
	static YEAR_MONTH = new DateTimeOps(Integer);
	static YEAR_WEEK = new DateTimeOps(Integer);
	static DAY_OF_WEEK = new DateTimeOps(Integer);
	static DAY_OF_MONTH = new DateTimeOps(Integer);
	static DAY_OF_YEAR = new DateTimeOps(Integer);
}

/**
 * Math operators
 *
 */
export class MathOps extends OpsBase {
	static ABS = new MathOps(Number);
	static ACOS = new MathOps(Number);
	static ASIN = new MathOps(Number);
	static ATAN = new MathOps(Number);
	static CEIL = new MathOps(Number);
	static COS = new MathOps(Number);
	static TAN = new MathOps(Number);
	static SQRT = new MathOps(Number);
	static SIN = new MathOps(Number);
	static ROUND = new MathOps(Number);
	static ROUND2 = new MathOps(Number);
	static RANDOM = new MathOps(Number);
	static RANDOM2 = new MathOps(Number);
	static POWER = new MathOps(Number);
	static MIN = new MathOps(Number);
	static MAX = new MathOps(Number);
	static LOG = new MathOps(Number);
	static FLOOR = new MathOps(Number);
	static EXP = new MathOps(Number);
	static COSH = new MathOps(Number);
	static COT = new MathOps(Number);
	static COTH = new MathOps(Number);
	static DEG = new MathOps(Number);
	static LN = new MathOps(Number);
	static RAD = new MathOps(Number);
	static SIGN = new MathOps(Number);
	static SINH = new MathOps(Number);
	static TANH = new MathOps(Number);
}

/**
 * String operators
 */
export class StringOps extends OpsBase {
	static LEFT = new StringOps(String);
	static RIGHT = new StringOps(String);
	static LTRIM = new StringOps(String);
	static RTRIM = new StringOps(String);
	static LPAD = new StringOps(String);
	static RPAD = new StringOps(String);
	static LPAD2 = new StringOps(String);
	static RPAD2 = new StringOps(String);
	static LOCATE = new StringOps(Number);
	static LOCATE2 = new StringOps(Number);
}