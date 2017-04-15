"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeOwnPropsNonEnumerable(o) {
    const fn = (p) => Object.defineProperty(o, p, { enumerable: false });
    Object.getOwnPropertyNames(o).forEach(fn);
}
exports.default = makeOwnPropsNonEnumerable;
