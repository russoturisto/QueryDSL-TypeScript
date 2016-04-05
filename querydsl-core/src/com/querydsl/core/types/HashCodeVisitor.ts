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
import {FinalClass, Final} from "../../../../java/Final";
import {Visitor} from "./Visitor";
import {Constant} from "./Constant";
import {Operation} from "./Operation";
import {Path} from "./Path";
import {ExpressionType, Expression} from "./Expression";
import {hashCode} from "../../../../java/lang/Object";
import {FactoryExpression} from "./FactoryExpression";
import {ParamExpression} from "./ParamExpression";
import {SubQueryExpression} from "./SubQueryExpression";
import {TemplateExpression} from "./TemplateExpression";

/**
 * {@code HashCodeVisitor} is used for hashCode generation in {@link Expression} implementations.
 *
 * @author tiwe
 */
@FinalClass
export class HashCodeVisitor implements Visitor<number,void> {

	@Final
	static DEFAULT:HashCodeVisitor = new HashCodeVisitor();

	private constructor() {
	}

	visit<C>(
		expr:Constant<any>
			| FactoryExpression<any>
			| Operation<any>
			| ParamExpression<any>
			| Path<any>
			| SubQueryExpression<any>
			| TemplateExpression<any>,
		context:C
	):number {
		let expression = <Expression>expr;
		switch (expression.getType()) {
			case ExpressionType.CONSTANT:
				return (<Constant>expr).getConstant().hashCode();
			case ExpressionType.FACTORY_EXPRESSION:
				let result:number = expression.getType();
				return 31 * result + hashCode((<FactoryExpression>expr).getArgs());
			case ExpressionType.OPERAION:
				let operation = <Operation>expr;
				let result:number = hashCode(operation.getOperator().name());
				return 31 * result + hashCode(operation.getArgs());
			case   ExpressionType.PARAM_EXPRESSION:
				let paramExpression = <ParamExpression>expr;
				return hashCode(paramExpression.getName());
			case  ExpressionType.PATH:
				let path = <Path>expr;
				return hashCode(path.getMetadata());
			case  ExpressionType.SUB_QUERY_EXPRESSION:
				let subQueryExpression = <SubQueryExpression>expr;
				return hashCode(subQueryExpression.getMetadata());
			case  ExpressionType.TEMPLATE_EXPRESSION:
				let templateExpression = <TemplateExpression>expr;
				let result = hashCode(templateExpression.getTemplate());
				return 31 * result + hashCode(templateExpression.getArgs());
			default:
				throw `Unknown expression type ${expression.getType()}`;
		}
	}

}
