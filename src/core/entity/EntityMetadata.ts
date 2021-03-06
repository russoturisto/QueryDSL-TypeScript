import {
	ColumnConfiguration, ManyToOneElements, OneToManyElements,
	JoinColumnConfiguration
} from "./metadata/ColumnDecorators";
import {TableConfiguration, EntityConfiguration} from "./metadata/EntityDecorators";
/**
 * Created by Papa on 8/20/2016.
 */

export interface EntityMetadata {
	name:string;
	entity:EntityConfiguration;
	idProperty:string;
	table:TableConfiguration;
	columnMap:{[propertyName:string]:ColumnConfiguration};
	manyToOneMap:{[propertyName:string]:ManyToOneElements};
	oneToManyMap:{[propertyName:string]:OneToManyElements};
	joinColumnMap:{[propertyName:string]:JoinColumnConfiguration};
	transient:{[propertyName:string]:boolean};

}