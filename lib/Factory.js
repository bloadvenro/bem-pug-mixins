"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepFreeze = require("deep-freeze");
const _ = require("lodash");
const makeOwnPropsNonEnumerable_1 = require("./helpers/makeOwnPropsNonEnumerable");
const Block_1 = require("./Block");
const Element_1 = require("./Element");
/**
 * Represents BEM Factory.
 *
 * BEM factory is elaborated to create BEM entities such as blocks and modifiers
 * where it relies on their constructors. Each entity constructor finalizes state
 * of entity, exposing its HTML attributes which are consumable by PugJS mixins.
 */
class Factory {
    constructor(options = {}) {
        /**
         * Default options for Factory behavior definition.
         */
        this.options = {
            separators: {
                element: '__',
                modifier: '--',
            }
        };
        /*
         * Callstack context is a FIFO stack, which stores all BEM entities, created
         * by subsequent mixin calls inside pug templates. Entities are used to get
         * information about previously created entities primarily by BEM elements.
         * Context must be destroyed (stack drops the last entity) each time entity
         * finishes its work (read .dropEntity() method description).
         */
        this.callStack = [];
        // Used old Object.assign syntax to help TS in composing types.
        this.options = deepFreeze(Object.assign(this.options, options));
        makeOwnPropsNonEnumerable_1.default(this);
    }
    getOptions() {
        return _.cloneDeep(this.options);
    }
    pushEntity(entity) {
        Object.freeze(entity);
        this.callStack.push(entity);
        return entity;
    }
    /**
     * Get access to BEM entity at the nth position from the end of the
     * mixin callstack.
     */
    getEntity(positionFromStackTail = 1) {
        return this.callStack[this.callStack.length - positionFromStackTail];
    }
    /**
     * Get access to the nth BEM block among all created ones, beginning trom
     * the last one.
     */
    getBlock(positionFromTheLastOne = 1) {
        let blocksFound = 0;
        for (let positionFromStackTail = 1;; positionFromStackTail++) {
            const block = this.getEntity(positionFromStackTail);
            if (!block)
                return;
            // ++ triggers only if block has been found...
            if (block instanceof Block_1.default && ++blocksFound === positionFromTheLastOne)
                return block;
        }
    }
    /**
     * Create new BEM entity.
     */
    create(type, attributes) {
        const factory = this;
        switch (type) {
            case 'block':
                {
                    return this.pushEntity(new Block_1.default(factory, attributes));
                }
            case 'element':
                {
                    const block = this.getBlock();
                    if (!block)
                        throw new Error('No block context for element has been found.');
                    return this.pushEntity(new Element_1.default(block, factory, attributes));
                }
            default:
                {
                    throw new Error('Unknonw BEM entity type.');
                }
        }
    }
    /**
     * Drop current BEM entity data after exiting from mixin's `block` directive:
     *
     * mixin b
     *   - const b = bem.create('block', attributes)
     *   #{b.getTag()}&attributes(b.getAttributes())
     *     block <-- PugJS block directive is a function, calling nested items.
     *   - bem.dropEntity() <-- MANDATORY! All nested items have been rendered.
     *
     * mixin e
     *   - const e = bem.create('element', attributes)
     *   #{e.getTag()}&attributes(e.getAttributes())
     *     block
     *   - bem.dropEntity() <-- Now free the memory.
     */
    dropEntity() {
        this.callStack.pop();
    }
}
exports.default = Factory;
