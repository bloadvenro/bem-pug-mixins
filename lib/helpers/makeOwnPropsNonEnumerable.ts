function makeOwnPropsNonEnumerable(o: object)
{
  const fn = (p: any) => Object.defineProperty(o, p, { enumerable: false }) 
  Object.getOwnPropertyNames(o).forEach(fn)
}

export default makeOwnPropsNonEnumerable
