"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeOwnPropsNonEnumerable_1 = require("./helpers/makeOwnPropsNonEnumerable");
const BEMEntity_1 = require("./BEMEntity");
class Element extends BEMEntity_1.default {
    getType() {
        return 'element';
    }
    getBlock() {
        return this.block;
    }
    constructor(block, factory, attributes) {
        super(factory, attributes);
        this.block = block;
        this.name = this.assignToBlock(block.getName(), this.name);
        this.parsedClassModifiers =
            this.getParsedClassModifiers().map(m => this.assignToBlock(block.getName(), m));
        makeOwnPropsNonEnumerable_1.default(this);
        this.composeAttributes();
    }
    /**
     * Append block name to an element.
     */
    assignToBlock(blockName, elemName) {
        const elementSeparator = this.getFactory().getOptions().separators.element;
        return `${blockName}${elementSeparator}${elemName}`;
    }
}
exports.default = Element;
