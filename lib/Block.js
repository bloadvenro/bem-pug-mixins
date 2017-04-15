"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeOwnPropsNonEnumerable_1 = require("./helpers/makeOwnPropsNonEnumerable");
const BEMEntity_1 = require("./BEMEntity");
class Block extends BEMEntity_1.default {
    getType() {
        return 'block';
    }
    constructor(factory, attributes) {
        super(factory, attributes);
        makeOwnPropsNonEnumerable_1.default(this);
        this.composeAttributes();
    }
}
exports.default = Block;
