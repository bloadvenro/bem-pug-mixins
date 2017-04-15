import makeOwnPropsNonEnumerable from './helpers/makeOwnPropsNonEnumerable'
import BEMEntity from './BEMEntity'
import Block from './Block'
import {
  default as Factory,
  HTMLAttributes,
  EntityType
} from './Factory'

class Element extends BEMEntity
{
  public getType(): EntityType
  {
    return 'element'
  }

  private readonly block: Block

  public getBlock(): Block
  {
    return this.block
  }

  constructor(block: Block, factory: Factory, attributes: HTMLAttributes)
  {
    super(factory, attributes)

    this.block = block
    this.name = this.assignToBlock(block.getName(), this.name)
    this.parsedClassModifiers =
      this.getParsedClassModifiers().map(m => this.assignToBlock(block.getName(), m))

    makeOwnPropsNonEnumerable(this)

    this.composeAttributes()
  }

  /**
   * Append block name to an element.
   */
  private assignToBlock(blockName: string, elemName: string): string
  {
    const elementSeparator = this.getFactory().getOptions().separators.element
    return `${blockName}${elementSeparator}${elemName}`
  }
}

export default Element

