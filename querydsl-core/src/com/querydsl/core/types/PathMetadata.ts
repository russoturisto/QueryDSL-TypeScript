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
 * {@code PathMetadata} provides metadata for {@link Path} expressions.
 *
 * @author tiwe
 */
import {Serializable} from "../../../../java/io/Serializable";
import {Final, FinalClass} from "../../../../java/Final";
import {Nullable} from "../../../../javax/annotation/Nullable";
import {ImmutableClass} from "../../../../javax/annotation/concurrent/Immutable";
import {Path} from "./Path";
import {JObject} from "../../../../java/lang/Object";
import {Objects} from "../../../google/common/base/Objects";

@ImmutableClass
@FinalClass
export class PathMetadata extends JObject implements Serializable {

		@Final
    static serialVersionUID:number = -1055994185028970065;

    @Final
    private element:JObject | string;

    @Final
    private myHashCode:number;

    @Nullable
    @Final
    private  parent:Path<any>;

    @Nullable
    @Final
    private rootPath:Path<any>;

		@Final
    private pathType:PathType;

    constructor(
      @Nullable  parent:Path<any>,
     element:JObject,
     type:PathType
) {
        this.parent = parent;
        this.element = element;
        this.pathType = type;
        this.rootPath = parent != null ? parent.getRoot() : null;
        this.hashCode = 31 * JObject.getHashCode(element) + JObject.getHashCode(pathType.name());
    }

     equals(
			 obj:JObject
		 ):boolean {
        if (obj == this) {
            return true;
        } else if (obj instanceof PathMetadata) {
             let p:PathMetadata = <PathMetadata> obj;
            return Objects.equal(this.element, p.element) &&
                    this.pathType == p.pathType &&
                    Objects.equal(parent, p.parent);
        } else {
            return false;
        }
    }

    public getElement():any {
        return this.element;
    }

    public getName():String {
        if (this.pathType == PathType.VARIABLE || this.pathType == PathType.PROPERTY) {
            return <String>this.element;
        } else {
            throw new IllegalStateException("name property not available for path of type " + pathType +
                    ". Use getElement() to access the generic path element.");
        }
    }

    @Nullable
    public getParent():Path<any> {
        return this.parent;
    }

    public getPathType():PathType {
        return this.pathType;
    }

    @Nullable
    public getRootPath():Path<any> {
        return this.rootPath;
    }

    public hashCode():number {
        return this.myHashCode;
    }

    public boolean isRoot() {
        return parent == null || (pathType == PathType.DELEGATE && parent.getMetadata().isRoot());
    }

}
