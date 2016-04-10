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
import {ImmutableClass} from "../../../../javax/annotation/concurrent/Immutable";
//import com.google.common.base.Preconditions;
//import com.google.common.collect.ImmutableList;
//import com.google.common.primitives.Primitives;
import {ExpressionBase} from "./ExpressionBase";
import {Operation} from "./Operation";
import {Final} from "../../../../java/Final";
import {Operator} from "./Operator";
import {ExpressionType, Expression} from "./Expression";
import {instanceOfOperation} from "./TSUtils";

/**
 * {@code OperationImpl} is the default implementation of the {@link Operation} interface
 *
 * @author tiwe
 *
 * @param <T> expression type
 */
@ImmutableClass
export class OperationImpl<T> extends ExpressionBase<T> implements Operation<T> {

    @Final
    private static serialVersionUID = 4796432056083507588;

    @Final
    private args:Immutable.List<Expression<any>>;

    @Final
    private operator:Operator;

    constructor(
      type:ExpressionType,
    	operator:Operator,
    	...args:Expression<any>[]
    ) {
        super(type);
        let argsList = Immutable.List.of(args);
        Class<?> wrapped = Primitives.wrap(type);
        Preconditions.checkArgument(this.operator.getType().isAssignableFrom(wrapped), operator.name());
        this.operator = operator;
        this.args = args;
    }

    @Override
    public final Expression<?> getArg(int i) {
        return args.get(i);
    }

    @Override
    public final List<Expression<?>> getArgs() {
        return args;
    }

    @Override
    public final Operator getOperator() {
        return operator;
    }

    @Override
    public final boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (o instanceof Operation<?>) {
            Operation<?> op = (Operation<?>) o;
            return op.getOperator() == operator
                && op.getArgs().equals(args)
                && op.getType().equals(getType());
        } else {
            return false;
        }
    }

    @Override
    public final <R, C> R accept(Visitor<R, C> v, C context) {
        return v.visit(this, context);
    }

}
