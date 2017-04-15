# BEM PugJS mixins.

__*Bemify your markup!*__

Inspired by (bemto)[https://github.com/kizu/bemto] <3

## Install

```
npm i -S bem-pug-mixins`
```

## Include

_Webpack_

```
include ~bem-pug-mixins/mixins
```

_Manually_

You have to provide `require` function manually. It's easy, I'll show you with simple nodeJS script:

```
'use strict'

const pug = require('pug')

const pugml = `

-
  const _ = require('lodash')

//- Lets print <p>1,2,3</p>!
p= _.uniq([1,1,2,3])

`

const html = pug.render(pugml, {
  require: require
})

console.log(html)
```

In the example above we provided `require` function inside PugJS's `locals` object. Look at the (official description)[https://pugjs.org/api/reference.html#pugrendersource-options-callback].


Now provide relative path to the installed library:

```
include relative/path/to/node_modules/bem-pug-mixins/mixins
```

__Important!__

From PugJS official docs ([common mistakes section](https://pugjs.org/language/inheritance.html#common-mistakes)):

> Note also that only named blocks and mixin definitions can appear at the top (unindented) level of an extending template. This is important because the parent templates define the overall page structure, and extending child templates only append, prepend, or replace specific blocks of markup and logic. If you created a child template and tried to add content outside of a block, Pug would have no way of knowing where to put it in the final page.

_So you MUST include this library in the beginning of your top-level layout to avoid compilation errors!_


## Configure

Bem factory instance is already preconfigured with standard BEM prefixes (`__` for elements and '--' for modifiers) and you may start your work right after the installation procedure!

If you prefer another element/modifier separators, you can re-create bem instance:

```
- bem = new BEM({ separators: { element: '-', modifier: '--' } })
```

Place this code right after library inclusion.


## Usage

```
// 1st uppercased class is always treated like a "tag class"!

+b.BODY.Page // -> <body class="Page">

  // Easily create prefixed BEM elements!

  +e.HEADER.header // -> <header class="Page-header">

    // "div" is the default html tag for each BEM entity.

    +b.TopNav // -> <div class="TopNav">
    
      // Each +b block creates new block context.

      +e.logo // -> <div class="TopNav-logo">

        a(href="/")

          // Define as many modifiers as necessary!

          // style A (straightforward syntax):

          +b.Logo_special_small // -> .Logo.Logo--special.Logo--small

          // style B (more flexible, awesome for nested mixins):

          +b.Logo._special._small // All underscored classes are modifier classes!

      // Provide as many additional classes as necessary!

      +e.menu.Menu.myClass // -> <div class="TopNav-menu Menu myClass">

        // Tag inference system automatically detects links!
        
        +e.item(href="/hey") // -> <a href="/hey" class="Menu-item">

  // Each element remembers its block context!

  +e.MAIN.content // <main class="Page-content">

    // Use bem block/element class as id attribute using `bemID` flag! 

    +b.Hero(bemID) // <div class="Hero" id="Hero">

      // nth-levels-up element (experimetnal). Creates an element for the nth
      // block above in call stack!

      +e.inner._2-container // -> <div class="Hero-inner Page-container">

  +e.FOOTER.footer // <footer class="Page-footer">

    // Tag inference system automatically detects list items!

    +b.UL.SecondaryNav   // -> <ul class="SecondaryNav">
      +e.item One        // -> <li class="SecondaryNav-item">
      +e.item Two        // -> <li class="SecondaryNav-item">
      +e.item_super Wow  // -> <li class="SecondaryNav-item SecondaryNav-item--super">

```

## Some complex scenarios.

_Nested mixins_

Most likely you will write mixins for your UI components.

```
//- Button can be represented with <a>, <input type="submit"> and <button> tag.

mixin Btn

  if 'type' in attributes && attributes.type == 'submit'
    +b.INPUT.Btn(type=type value=Helpers.blockToText(block))&attributes(attributes)
  else if 'href' in attributes
    +b.Btn(href=value)&attributes(attributes)
      block
  else
    +b.BUTTON.Btn&attributes(attributes)
      block
```

With `&attributes(attributes)` we just pass all necessary stuff as (mixin attributes) [https://pugjs.org/language/mixins.html#mixin-attributes] to our BEM mixins.

```
+b.Actions
  +Btn(type='submit')._primary Sign Up
```

Will produce

```
<input type="submit" class="Btn Btn--primary" value="Sign Up">
```
