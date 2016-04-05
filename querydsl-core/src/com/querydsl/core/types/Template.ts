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
/**
 * {@code Template} provides serialization templates for {@link Operation},
 * {@link TemplateExpression} and {@link Path} serialization
 *
 * @author tiwe
 *
 */
import {Serializable} from "../../../../java/io/Serializable";
import {ImmutableClass} from "../../../../javax/annotation/concurrent/Immutable";
import {FinalClass, Final, FinalParameter} from "../../../../java/Final";
import {ExpressionType, Expression} from "./Expression";
import {ExpressionBase} from "./ExpressionBase";
import {Transient} from "../../../../java/Transient";
import {isInstanceOf} from "../../../../java/lang/Object";
import {ExpressionUtils} from "./ExpressionUtils";
import {Operator} from "./Operator";


export namespace Template {
/**
 * General template element
 */
@ImmutableClass
export abstract class Element implements Serializable {

    @Final
    private static serialVersionUID:number = 3396877288101929387;

    public abstract convert( args:Array<any>):any;

    public abstract isString():boolean;

}

/**
 * Expression as string
 */
@FinalClass
export class AsString extends Element {

    @Final
    private static serialVersionUID:number = -655362047873616197;

    @Final
    private index:number;

    @Final
    private toString:number;

    constructor(index:number) {
    this.index = index;
    this.toString = index + "s";
    }

public convert(@FinalParameter  args:Array<any>):any {
    let arg = args[this.index];
    if(arg.getType && typeof arg.getType === 'getType' && arg.getType() === ExpressionType.CONSTANT) {
        return (<ExpressionBase>arg).toString();
    }
    return arg;
}

public getIndex():number {
    return this.index;
}

public  isString():boolean {
    return true;
}

public toString():string {
    return this.toString;
}

}

/**
 * Static text element
 */
    @FinalClass
    export class StaticText extends Element {

    @Final
    private static serialVersionUID:number = -2791869625053368023;

    @Final
    private text:string;

    @Final
    private toString:string;

    constructor(text:string) {
        this.text = text;
        this.toString = "'" + text + "'";
    }

public getText():string {
    return this.text;
}

public  isString():boolean {
    return true;
}

public convert( args:Array<any>):any {
    return this.text;
}

public toString():string {
    return this.toString;
}

}

/**
 * Transformed expression
 */
@FinalClass
export class Transformed extends Element {

    @Final
    private static serialVersionUID:number = 702677732175745567;

    @Final
    private index:number;

    @Final
    @Transient
    private transformer:Function;

    @Final
    private toString:string;

    constructor(index:number, transformer:Function) {
        this.index = index;
        this.transformer = transformer;
        this.toString = index.toString();
    }

    public getIndex():number {
        return this.index;
    }

    // FIXME: test convert method
    public convert(@FinalParameter args:Array<any>):any {
        return this.transformer.call(null, args[this.index]);
    }

    public isString():boolean {
        return false;
    }

    public toString():string {
        return this.toString;
    }

}

/**
 * Argument by index
 */
@FinalClass
export class ByIndex extends Element {

    @Final
    private static serialVersionUID:number = 4711323946026029998;

    @Final
    private index:number;

    @Final
    private myToString:string;

    constructor(index:number) {
    this.index = index;
    this.myToString = index.toString();
}

public convert(@FinalParameter args:Array<any>):any {
    let arg = args[this.index];

    // Assume that getType only exists in Expression derivaties
    if(arg.getType && typeof arg.getType === 'getType') {
    if (isInstanceOf(arg, ExpressionBase)) {
        return ExpressionUtils.extract(<Expression<any>> arg);
    } else {
        return arg;
    }
    }
}

public getIndex():number {
    return this.index;
}

public  isString():boolean {
    return false;
}

public toString():string {
    return this.myToString;
}

}

/**
 * Math operation
 */
    @FinalClass
export class Operation extends Element {

    @Final
    private static serialVersionUID = 1400801176778801584;

    @Final
    private index1:number;
    @Final
    private index2:number;
    @Final
    private operator:Operator;
    @Final
    private asString:boolean;

    constructor(
      index1:number,
      index2:number,
      operator:Operator,
      asString:boolean
    ) {
    this.index1 = index1;
    this.index2 = index2;
    this.operator = operator;
    this.asString = asString;
}

public convert(args:Array<any>):any {
    let arg1 = args[index1];
    let arg2 = args[index2];
    if (isNumber(arg1) && isNumber(arg2)) {
        return MathUtils.result(asNumber(arg1), asNumber(arg2), operator);
    } else {
        Expression<?> expr1 = asExpression(arg1);
        Expression<?> expr2 = asExpression(arg2);

        if (arg2 instanceof Number) {
            if (CONVERTIBLES.contains(operator) && expr1 instanceof com.querydsl.core.types.Operation) {
                com.querydsl.core.types.Operation operation = (com.querydsl.core.types.Operation) expr1;
                if (CONVERTIBLES.contains(operation.getOperator()) && operation.getArg(1) instanceof Constant) {
                    Number num1 = ((Constant<Number>) operation.getArg(1)).getConstant();
                    Number num2;
                    if (operator == operation.getOperator()) {
                        num2 = MathUtils.result(num1, (Number) arg2, Ops.ADD);
                    } else if (operator == Ops.ADD) {
                        num2 = MathUtils.result((Number) arg2, num1, Ops.SUB);
                    } else {
                        num2 = MathUtils.result(num1, (Number) arg2, Ops.SUB);
                    }
                    return ExpressionUtils.operation(expr1.getType(), operator,
                      operation.getArg(0), Expressions.constant(num2));
                }
            }
        }

        return ExpressionUtils.operation(expr1.getType(), operator, expr1, expr2);
    }
}

@Override
public boolean isString() {
    return asString;
}

@Override
public String toString() {
    return index1 + " " + operator + " " + index2;
}
}

/**
 * Math operation with constant
 */
public static final class OperationConst extends Element {

    private static final long serialVersionUID = 1400801176778801584L;

    private final int index1;

    private final BigDecimal arg2;

    private final Expression<BigDecimal> expr2;

    private final Operator operator;

    private final boolean asString;

    public OperationConst(int index1, BigDecimal arg2, Operator operator, boolean asString) {
    this.index1 = index1;
    this.arg2 = arg2;
    this.expr2 = Expressions.constant(arg2);
    this.operator = operator;
    this.asString = asString;
}

@Override
public Object convert(List<?> args) {
    Object arg1 = args.get(index1);
    if (isNumber(arg1)) {
        return MathUtils.result(asNumber(arg1), arg2, operator);
    } else {
        Expression<?> expr1 = asExpression(arg1);

        if (CONVERTIBLES.contains(operator) && expr1 instanceof com.querydsl.core.types.Operation) {
            com.querydsl.core.types.Operation operation = (com.querydsl.core.types.Operation) expr1;
            if (CONVERTIBLES.contains(operation.getOperator()) && operation.getArg(1) instanceof Constant) {
                Number num1 = ((Constant<Number>) operation.getArg(1)).getConstant();
                Number num2;
                if (operator == operation.getOperator()) {
                    num2 = MathUtils.result(num1, arg2, Ops.ADD);
                } else if (operator == Ops.ADD) {
                    num2 = MathUtils.result(arg2, num1, Ops.SUB);
                } else {
                    num2 = MathUtils.result(num1, arg2, Ops.SUB);
                }
                return ExpressionUtils.operation(expr1.getType(), operator,
                  operation.getArg(0), Expressions.constant(num2));
            }
        }

        return ExpressionUtils.operation(expr1.getType(), operator, expr1, expr2);
    }
}

@Override
public boolean isString() {
    return asString;
}

@Override
public String toString() {
    return index1 + " " + operator + " " + arg2;
}
}

@ImmutableClass
@FinalClass
export class Template implements Serializable {

    private static final long serialVersionUID = -1697705745769542204L;

    private static final Set<? extends Operator> CONVERTIBLES = Sets.immutableEnumSet(Ops.ADD, Ops.SUB);

    private final ImmutableList<Element> elements;

    private final String template;

    Template(String template, ImmutableList<Element> elements) {
        this.template = template;
        this.elements = elements;
    }

    public List<Element> getElements() {
        return elements;
    }

    @Override
    public String toString() {
        return template;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (o instanceof Template) {
            return ((Template) o).template.equals(template);
        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return template.hashCode();
    }

}


function asNumber(arg:number):number {
    if (typeof arg === 'number') {
        return <number> arg;
    } else if (isInstanceOf(arg, ConstantImpl) arg instanceof Constant) {
        return (Number) ((Constant) arg).getConstant();
    } else {
        throw new IllegalArgumentException(arg.toString());
    }
}

private static boolean isNumber(Object o) {
    return o instanceof Number || o instanceof Constant
        && ((Constant<?>) o).getConstant() instanceof Number;
}

private static Expression<?> asExpression(Object arg) {
    if (arg instanceof Expression) {
        return ExpressionUtils.extract((Expression<?>) arg);
    } else {
        return Expressions.constant(arg);
    }
}

}