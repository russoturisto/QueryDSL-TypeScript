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
import {FinalClass, Final} from "../../../../java/Final";
import {ExpressionBase} from "./ExpressionBase";
import {Constant} from "./Constant";
import {Byte} from "../../../../java/lang/Byte";
import {Short} from "../../../../java/lang/Short";

class Constants {

    @Final
    static  Constant<Character>[] CHARACTERS = new Constant[CACHE_SIZE];

    @Final
    static  Constant<Byte>[] BYTES = new Constant[CACHE_SIZE];

    @Final
    static  Constant<Integer>[] INTEGERS = new Constant[CACHE_SIZE];

    @Final
    static  Constant<Long>[] LONGS = new Constant[CACHE_SIZE];

    @Final
    static  Constant<Short>[] SHORTS = new Constant[CACHE_SIZE];

    @Final
     static final Constant<Boolean> FALSE = new ConstantImpl<Boolean>(Boolean.FALSE);

    @Final
     static final Constant<Boolean> TRUE = new ConstantImpl<Boolean>(Boolean.TRUE);

    static {
    for (int i = 0; i < CACHE_SIZE; i++) {
    INTEGERS[i] = new ConstantImpl<Integer>(Integer.class, i);
    SHORTS[i] = new ConstantImpl<Short>(Short.class, (short) i);
    BYTES[i] = new ConstantImpl<Byte>(Byte.class, (byte) i);
    CHARACTERS[i] = new ConstantImpl<Character>(Character.class, (char) i);
    LONGS[i] = new ConstantImpl<Long>(Long.class, (long) i);
}
}
}

/**
 * {@code ConstantImpl} is the default implementation of the {@link Constant} interface
 *
 * @author tiwe
 * @param <T> expression type
 */
@ImmutableClass
@FinalClass
export class ConstantImpl<T> extends ExpressionBase<T> implements Constant<T> {

    @Final
    private static final long serialVersionUID = -3898138057967814118L;

    @Final
    private static final int CACHE_SIZE = 256;
    
    static create<A>(
        arg: A
    ): A {
        switch(typeof arg) {
            case 'boolean':
        return arg ? Constants.TRUE : Constants.FALSE;
            case 'string':
                if(arg.length === 1) {
        if (i < CACHE_SIZE) {
            return Constants.CHARACTERS[i];
        } else {
            return new ConstantImpl<Character>(Character.class, i);
        }
                }
        }
        case 'number':
        if (arg >= 0 && arg < CACHE_SIZE) {
            return Constants.INTEGERS[arg];
        } else {
            return new ConstantImpl<number>(Integer.class, i);
        }

    }


    public static Constant<Byte> create(byte i) {
        if (i >= 0) {
            return Constants.BYTES[i];
        } else {
            return new ConstantImpl<Byte>(Byte.class, i);
        }
    }

    public static Constant<Long> create(long i) {
        if (i >= 0 && i < CACHE_SIZE) {
            return Constants.LONGS[(int) i];
        } else {
            return new ConstantImpl<Long>(Long.class, i);
        }
    }

    public static Constant<Short> create(short i) {
        if (i >= 0 && i < CACHE_SIZE) {
            return Constants.SHORTS[i];
        } else {
            return new ConstantImpl<Short>(Short.class, i);
        }
    }

    public static <T> Constant<T> create(T obj) {
        return new ConstantImpl<T>(obj);
    }

    public static <T> Constant<T> create(Class<T> type, T constant) {
        return new ConstantImpl<T>(type, constant);
    }

    private final T constant;

    /**
     * Create a new Constant for the given object
     *
     * @param constant constant
     */
    @SuppressWarnings("unchecked") //The class of the constant will mandate the type
    private ConstantImpl(T constant) {
        this((Class) constant.getClass(), constant);
    }

    /**
     * Create a new Constant of the given type for the given object
     *
     * @param type type of the expression
     * @param constant constant
     */
    private ConstantImpl(Class<T> type, T constant) {
        super(type);
        this.constant = constant;
    }

    @Override
    public <R, C> R accept(Visitor<R, C> v, C context) {
        return v.visit(this, context);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (o instanceof Constant<?>) {
            return ((Constant<?>) o).getConstant().equals(constant);
        } else {
            return false;
        }
    }

    @Override
    public T getConstant() {
        return constant;
    }

}
