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

import {Constant} from "./Constant";
import {Operation} from "./Operation";
import {Path} from "./Path";
import {FactoryExpression} from "./FactoryExpression";
import {ParamExpression} from "./ParamExpression";

/**
 * {@code Visitor} defines a visitor signature for {@link Expression} instances.
 *
 * @author tiwe
 *
 * @param <R> Return type
 * @param <C> Context type
 */
export interface Visitor<R, C> {

	/**
	 * Visit a Constant instance with the given context
	 *
	 * @param expr expression to visit
	 * @param context context of the visit or null, if not used
	 * @return visit result
	 */
	visit(
		expr:Constant<any>
			| FactoryExpression<any>
			| Operation<any>
			| ParamExpression<any>
			| Path<any>
			| SubQueryExpression<any>
			| TemplateExpression<any>,
		context:C
	):R;

}
