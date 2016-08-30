/**
 * Created by Papa on 8/20/2016.
 */
"use strict";
(function (CascadeType) {
    CascadeType[CascadeType["ALL"] = 0] = "ALL";
    CascadeType[CascadeType["DETACH"] = 1] = "DETACH";
    CascadeType[CascadeType["MERGE"] = 2] = "MERGE";
    CascadeType[CascadeType["PERSIST"] = 3] = "PERSIST";
    CascadeType[CascadeType["REFRESH"] = 4] = "REFRESH";
    CascadeType[CascadeType["REMOVE"] = 5] = "REMOVE"; // Cascade remove operation
})(exports.CascadeType || (exports.CascadeType = {}));
var CascadeType = exports.CascadeType;
(function (FetchType) {
    FetchType[FetchType["EAGER"] = 0] = "EAGER";
    FetchType[FetchType["LAZY"] = 1] = "LAZY"; // Defines that data can be lazily fetched.
})(exports.FetchType || (exports.FetchType = {}));
var FetchType = exports.FetchType;
(function (GenerationType) {
    GenerationType[GenerationType["TABLE"] = 0] = "TABLE";
    GenerationType[GenerationType["SEQUENCE"] = 1] = "SEQUENCE";
    GenerationType[GenerationType["IDENTITY"] = 2] = "IDENTITY";
    GenerationType[GenerationType["AUTO"] = 3] = "AUTO";
})(exports.GenerationType || (exports.GenerationType = {}));
var GenerationType = exports.GenerationType;
(function (AccessType) {
    AccessType[AccessType["FIELD"] = 0] = "FIELD";
    AccessType[AccessType["PROPERTY"] = 1] = "PROPERTY";
})(exports.AccessType || (exports.AccessType = {}));
var AccessType = exports.AccessType;
//# sourceMappingURL=Types.js.map