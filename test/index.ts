import { assert } from 'chai'
import Factory from '../lib/Factory'

const testTree = require('./fixtures/tree.json')

const defaultSeparators = {
  element: '__',
  modifier: '--',
}

const customSeparators = {
  element: '-',
  modifier: '--',
}

describe(`Default prefixes: ${JSON.stringify(defaultSeparators)}`, () =>
{
  const factory = new Factory

  it('Testing with default bem tree', () =>
  {
    testTree.forEach(({ declare, expect }: { declare: any, expect: any }) =>
    {
      const entity = factory.create(declare.type, declare.attributes).toObject()

      replaceSeparators(defaultSeparators, expect)
 
      assert.strictEqual(entity.name, expect.name)
      assert.strictEqual(entity.type, expect.type)
      assert.strictEqual(entity.tag, expect.tag)
      assert.deepEqual(entity.attributes, expect.attributes)
    })
  })
})

describe(`Custom prefixes: ${JSON.stringify(customSeparators)}`, () =>
{
  const factory = new Factory

  it('Testing with default bem tree', () =>
  {
    testTree.forEach(({ declare, expect }: { declare: any, expect: any }) =>
    {
      const entity = factory.create(declare.type, declare.attributes).toObject()

      replaceSeparators(customSeparators, expect)
 
      assert.strictEqual(entity.name, expect.name)
      assert.strictEqual(entity.type, expect.type)
      assert.strictEqual(entity.tag, expect.tag)
      assert.deepEqual(entity.attributes, expect.attributes)
    })
  })
})

// It is necessary to test data globally with different prefixes.
function replaceSeparators(separators: any, declare: any)
{
  if (declare.attributes.id)
    declare.attributes.id = declare.attributes.id.replace(/\{es\}/g, separators.element)

  declare.name = declare.name.replace(/\{es\}/g, separators.element)
  declare.attributes.class = declare.attributes.class.replace(/\{es\}/g, separators.element)
  declare.attributes.class = declare.attributes.class.replace(/\{ms\}/g, separators.modifier)
}
