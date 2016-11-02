"use strict";
/**
 * Created by Papa on 10/18/2016.
 */
function test(a) {
    return a;
}
var a = test({
    b: 1,
    c: 2
});
var ALIASES = ['a', 'b', 'c', 'd', 'e',
    'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'];
var lastRootEntityName = [-1, -1, -1];
function getNextRootEntityName() {
    var currentName = this.lastRootEntityName;
    for (var i = 2; i >= 0; i--) {
        var currentIndex = currentName[i];
        currentIndex = (currentIndex + 1) % 26;
        currentName[i] = currentIndex;
        if (currentIndex !== 0) {
            break;
        }
    }
    var nameString = '';
    for (var i = 0; i < 3; i++) {
        nameString += ALIASES[currentName[i]];
    }
    return nameString;
}
exports.getNextRootEntityName = getNextRootEntityName;
/*
 class SpecificColumnAliases {

 private aliasEntries:string[] = [];
 private readIndex = 0;

 constructor(
 private aliasKey:string
 ) {
 }

 addAlias(
 columnAlias:string
 ):void {
 this.aliasEntries.push(columnAlias);
 }

 resetReadIndex():void {
 this.readIndex = 0;
 }

 readNextAlias():string {
 if (this.readIndex >= this.aliasEntries.length) {
 throw `Too many read references for column ${this.aliasKey}`;
 }
 return this.aliasEntries[this.readIndex++];
 }
 }
 */
var ColumnAliases = (function () {
    // private columnAliasMap:{[aliasPropertyCombo:string]:SpecificColumnAliases} = {};
    function ColumnAliases(aliasPrefix) {
        if (aliasPrefix === void 0) { aliasPrefix = ''; }
        this.aliasPrefix = aliasPrefix;
        // numFields:number = 0;
        this.lastAlias = [-1, -1, -1];
        this.fields = [];
    }
    /*
     addAlias(
     tableAlias:string,
     propertyName:string
     ):string {
     let aliasKey = this.getAliasKey(tableAlias, propertyName);
     let columnAlias = this.getNextAlias();
     let specificColumnAliases = this.columnAliasMap[aliasKey];
     if (!specificColumnAliases) {
     specificColumnAliases = new SpecificColumnAliases(aliasKey);
     this.columnAliasMap[aliasKey] = specificColumnAliases;
     }
     specificColumnAliases.addAlias(columnAlias);
     this.numFields++;

     return columnAlias;
     }

     resetReadIndexes() {
     for (let aliasKey in this.columnAliasMap) {
     this.columnAliasMap[aliasKey].resetReadIndex();
     }
     }

     getAlias(
     tableAlias:string,
     propertyName:string
     ):string {
     let aliasKey = this.getAliasKey(tableAlias, propertyName);
     let specificColumnAliases = this.columnAliasMap[aliasKey];
     if (!specificColumnAliases) {
     throw `No columns added for ${aliasKey}`;
     }
     return specificColumnAliases.readNextAlias();
     }

     private getAliasKey(
     tableAlias:string,
     propertyName:string
     ):string {
     let aliasKey = `${tableAlias}.${propertyName}`;
     return aliasKey;
     }
     */
    ColumnAliases.prototype.getNextAlias = function (field) {
        if (!this.hasField(field)) {
            this.fields.push(field);
        }
        var currentAlias = this.lastAlias;
        for (var i = 2; i >= 0; i--) {
            var currentIndex = currentAlias[i];
            currentIndex = (currentIndex + 1) % 26;
            currentAlias[i] = currentIndex;
            if (currentIndex !== 0) {
                break;
            }
        }
        var aliasString = this.aliasPrefix;
        for (var i = 0; i < 3; i++) {
            aliasString += ALIASES[currentAlias[i]];
        }
        return aliasString;
    };
    ColumnAliases.prototype.hasField = function (field) {
        return this.fields.some(function (memberField) {
            return memberField === field;
        });
    };
    ColumnAliases.prototype.clearFields = function () {
        this.fields = [];
    };
    return ColumnAliases;
}());
exports.ColumnAliases = ColumnAliases;
//# sourceMappingURL=Aliases.js.map