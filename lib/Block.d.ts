import BEMEntity from './BEMEntity';
import { default as Factory, HTMLAttributes, EntityType } from './Factory';
declare class Block extends BEMEntity {
    getType(): EntityType;
    constructor(factory: Factory, attributes: HTMLAttributes);
}
export default Block;
