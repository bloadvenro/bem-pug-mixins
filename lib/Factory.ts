import * as deepFreeze from 'deep-freeze'
import * as _ from 'lodash'
import makeOwnPropsNonEnumerable from './helpers/makeOwnPropsNonEnumerable'
import BEMEntity from './BEMEntity'
import Block from './Block'
import Element from './Element'

export interface Separators
{
  readonly element: string
  readonly modifier: string
}

export interface Options
{
  readonly separators: Separators
}

export type OptionsBag = {[P in keyof Options]?: Partial<Options[P]>}

export type HTMLAttributes = Readonly<{
  [attribute: string]: string
}>

export type EntityType = 'block' | 'element'

/**
 * Represents BEM Factory.
 *
 * BEM factory is elaborated to create BEM entities such as blocks and modifiers
 * where it relies on their constructors. Each entity constructor finalizes state
 * of entity, exposing its HTML attributes which are consumable by PugJS mixins.
 */
class Factory
{
  /**
   * Default options for Factory behavior definition.
   */
  protected readonly options: Options = {
    separators: {
      element: '__',
      modifier: '--',
    }
  }

  public getOptions()
  {
    return _.cloneDeep(this.options)
  }

  /*
   * Callstack context is a FIFO stack, which stores all BEM entities, created
   * by subsequent mixin calls inside pug templates. Entities are used to get
   * information about previously created entities primarily by BEM elements.
   * Context must be destroyed (stack drops the last entity) each time entity
   * finishes its work (read .dropEntity() method description).
   */
  private readonly callStack: BEMEntity[] = []

  constructor(options: OptionsBag = {})
  {
    // Used old Object.assign syntax to help TS in composing types.
    this.options = deepFreeze(Object.assign(this.options, options))

    makeOwnPropsNonEnumerable(this)
  }

  private pushEntity(entity: BEMEntity): BEMEntity
  {
    Object.freeze(entity)
    this.callStack.push(entity)
    return entity
  }

  /**
   * Get access to BEM entity at the nth position from the end of the
   * mixin callstack.
   */
  public getEntity(positionFromStackTail = 1): BEMEntity | undefined
  {
    return this.callStack[this.callStack.length - positionFromStackTail]
  }

  /**
   * Get access to the nth BEM block among all created ones, beginning trom
   * the last one.
   */
  public getBlock(positionFromTheLastOne = 1): Block | undefined
  {
    let blocksFound = 0

    for (let positionFromStackTail = 1;; positionFromStackTail++)
    {
      const block = this.getEntity(positionFromStackTail)

      if (!block) return

      // ++ triggers only if block has been found...
      if (block instanceof Block && ++blocksFound === positionFromTheLastOne) return block
    }
  }

  /**
   * Create new BEM entity.
   */
  public create(type: EntityType, attributes: HTMLAttributes): Block | Element | never
  {
    const factory = this

    switch (type)
    {
      case 'block':
      {
        return <Block>this.pushEntity(new Block(factory, attributes))
      }

      case 'element':
      {
        const block = this.getBlock()

        if (!block) throw new Error('No block context for element has been found.')

        return <Element>this.pushEntity(new Element(block, factory, attributes))
      }

      default:
      {
        throw new Error('Unknonw BEM entity type.')
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
  public dropEntity(): void
  {
    this.callStack.pop()
  }
}

export default Factory

