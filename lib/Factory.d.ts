import BEMEntity from './BEMEntity';
import Block from './Block';
import Element from './Element';
export interface Separators {
    readonly element: string;
    readonly modifier: string;
}
export interface Options {
    readonly separators: Separators;
}
export declare type OptionsBag = {
    [P in keyof Options]?: Partial<Options[P]>;
};
export declare type HTMLAttributes = Readonly<{
    [attribute: string]: string;
}>;
export declare type EntityType = 'block' | 'element';
/**
 * Represents BEM Factory.
 *
 * BEM factory is elaborated to create BEM entities such as blocks and modifiers
 * where it relies on their constructors. Each entity constructor finalizes state
 * of entity, exposing its HTML attributes which are consumable by PugJS mixins.
 */
declare class Factory {
    /**
     * Default options for Factory behavior definition.
     */
    protected readonly options: Options;
    getOptions(): Options;
    private readonly callStack;
    constructor(options?: OptionsBag);
    private pushEntity(entity);
    /**
     * Get access to BEM entity at the nth position from the end of the
     * mixin callstack.
     */
    getEntity(positionFromStackTail?: number): BEMEntity | undefined;
    /**
     * Get access to the nth BEM block among all created ones, beginning trom
     * the last one.
     */
    getBlock(positionFromTheLastOne?: number): Block | undefined;
    /**
     * Create new BEM entity.
     */
    create(type: EntityType, attributes: HTMLAttributes): Block | Element | never;
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
    dropEntity(): void;
}
export default Factory;
