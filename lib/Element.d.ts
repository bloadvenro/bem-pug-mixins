import BEMEntity from './BEMEntity';
import Block from './Block';
import { default as Factory, HTMLAttributes, EntityType } from './Factory';
declare class Element extends BEMEntity {
    getType(): EntityType;
    private readonly block;
    getBlock(): Block;
    constructor(block: Block, factory: Factory, attributes: HTMLAttributes);
    /**
     * Append block name to an element.
     */
    private assignToBlock(blockName, elemName);
}
export default Element;
