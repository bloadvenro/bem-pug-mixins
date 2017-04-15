import makeOwnPropsNonEnumerable from './helpers/makeOwnPropsNonEnumerable'
import BEMEntity from './BEMEntity'
import {
  default as Factory,
  HTMLAttributes,
  EntityType
} from './Factory'

class Block extends BEMEntity
{
  public getType(): EntityType
  {
    return 'block'
  }

  constructor(factory: Factory, attributes: HTMLAttributes)
  {
    super(factory, attributes)

    makeOwnPropsNonEnumerable(this)

    this.composeAttributes()
  }
}

export default Block

