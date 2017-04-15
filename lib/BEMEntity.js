"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const makeOwnPropsNonEnumerable_1 = require("./helpers/makeOwnPropsNonEnumerable");
const _ = require("lodash");
/**
 * Represents BEM entity (block, element or something else BEM spec will provide in future.).
 * Modifier is not a self-sufficient entity, and treated as the part of block/element.
 *
 * In some provided examples I will use `-` element separator and `--` modifier separator, as
 * it's my preferable style of BEMing, thought default library separators are `__` and `--`
 * respectively (BEM spec stantard). Also I prefer pascalcase naming for blocks and camelcase
 * for elements and modifiers.
 *
 * If it seems attractive for you, visit SUITCSS project that is BEM fork.
 */
class BEMEntity {
    constructor(factory, attributes) {
        /**
         * Modifier delimiter inside block/modifier sentence.
         *
         * For example `Block_modifier_isModifier_hasModifier` class attribute has three modifiers,
         * separated by modifier delimiter and will be parsed in that manner as
         * `Block Block--modifier Block--isModifier Block--hasModifier`.
         */
        this.modifierDelimiter = '_';
        /**
         * Tells that "_\\d-class" inside `class` attribute is an element name that belongs
         * to the nth block above current entity.
         *
         * So `Block-element _1-item` will produce `Block-element <OneLevelAboveBlock>-item`
         * class.
         */
        this.nthBlockElementClassPrefix = '_\\d-';
        /**
         * If true, command to use entity name as HTML id attribute value also
         */
        this.bemID = false;
        this.factory = factory;
        /**
         * Descruct attributes: extracting provided classes and some not valid library-
         * specific attributes.
         *
         * Genetal HTML attributes will be preserved as is and used by pugjs directly.
         */
        const { bemID, class: classAttribute } = attributes, _attributes = __rest(attributes
        /**
         * Class attribute is so-called query which may contain a lot of information
         * about how finally class attribute should look like.
         */
        , ["bemID", "class"]);
        /**
         * Class attribute is so-called query which may contain a lot of information
         * about how finally class attribute should look like.
         */
        const { name, tag, parsedClassModifiers, parsedNthBlockElements, restClasses, } = this.parseClassAttribute(this.normalizeClassAttribute(classAttribute));
        this.name = name;
        this.bemID = !!bemID;
        this.tag = tag || this.inferTag(_attributes);
        this.parsedClassModifiers = parsedClassModifiers;
        this.parsedNthBlockElements = parsedNthBlockElements;
        this.restClasses = restClasses;
        this.attributes = _attributes;
        Object.freeze(this.attributes);
        Object.freeze(this.parsedClassModifiers);
        Object.freeze(this.parsedNthBlockElements);
        Object.freeze(this.restClasses);
        makeOwnPropsNonEnumerable_1.default(this);
    }
    /**
     * Check if modifier class is a standalone modifier class. It is very useful if we
     * want to pass modifier into non-BEM mixin, for example +Logo.{modifierDelimiter}_modifier.
     */
    isModifierClass(_class) {
        // Will find '_m1' or '_myModifier' for example.
        return (new RegExp(`^${this.modifierDelimiter}[a-zA-Z]{1}[a-zA-Z0-9]*`)).test(_class);
    }
    isNthBlockElementClass(_class) {
        return (new RegExp(`^${this.nthBlockElementClassPrefix}`)).test(_class);
    }
    getName() {
        return this.name;
    }
    getTag() {
        return this.tag;
    }
    getParsedClassModifiers() {
        return this.parsedClassModifiers;
    }
    getParsedNthBlockElements() {
        return this.parsedNthBlockElements;
    }
    getRestClasses() {
        return this.restClasses;
    }
    getAttributes() {
        return _.cloneDeep(this.attributes);
    }
    getFactory() {
        return this.factory;
    }
    resolveNthBlockElementClass(position, elementName) {
        const block = this.factory.getBlock(position);
        if (!block)
            throw new Error('No block found for nthBlockElement in the call stack.');
        const elementSeparator = this.factory.getOptions().separators.element;
        return `${block.getName()}${elementSeparator}${elementName}`;
    }
    /**
     * Should desctibe how to compose class names and other staff to get final HTML
     * attributes.
     *
     * This internal method MUST be invoked in constructors of descendants after all
     * descendant-specific constructor computations are done. For example, BEM element
     * name if calculated inside ones constructor, by getting its block name and prepending
     * one with BEM element separator.
     *
     * This methos also should be extended/overrided if necessary. At this moment
     * implementation below represents common stuff which is necessary to create each
     * entity's attributes state.
     */
    composeAttributes() {
        this.attributes = Object.assign({}, this.getAttributes(), { class: [
                this.getName(),
                ...this.getParsedClassModifiers(),
                ...this.getParsedNthBlockElements(),
                ...this.getRestClasses(),
            ].join(' ') });
        if (this.bemID)
            this.attributes.id = this.getName();
    }
    normalizeClassAttribute(classAttribute = []) {
        if (Array.isArray(classAttribute)) {
            /**
             * When you're trying to pass down attributes from some parent mixin
             * to some bem child mixin, and one of these additional attributes is
             * a class value, pugjs will form a class array instead of class string.
             *
             * For example,
             *
             * +Btn._primary mixin
             *
             * contains
             *
             * +b.BUTTON.Btn&attributes(attributes)
             *
             * It will produce { class: [ 'BUTTON Btn', '_primary' ] } class attribute,
             * so we should mormalize it.
             */
            return classAttribute.reduce((newClassAttribute, _class) => {
                return newClassAttribute.concat(_class.split(' '));
            }, Array());
        }
        // String otherwise.
        return classAttribute.split(' ');
    }
    /**
     * Classificate all class names by their signatures.
     */
    parseClassAttribute(classAttribute) {
        return classAttribute.reduce((result, _class, i) => {
            // Check if the 1st class is explicitly provided tag.
            if (i === 0 && this.isTagClass(_class)) {
                result.tag = _class.toLowerCase();
                return result;
            }
            const { name, tag, parsedClassModifiers, parsedNthBlockElements, restClasses, } = result;
            /**
             * If no tag class has been provided, then the 1st class is an entity name.
             * Also we may pass N modifiers with it, splitting them by this.modifierDelimiter.
             * Example: Block_modifier_isModifier_hasModifier, where we passed three modifiers,
             * separated by underscore as this.modifierDelimiter.
             */
            if ((i === 0 && !tag) || (i === 1 && tag)) {
                const [name, ...modifiers] = _class.split(this.modifierDelimiter);
                result.name = name;
                result.parsedClassModifiers = parsedClassModifiers.concat(modifiers.map(m => this.applyModifier(name, m)));
                return result;
            }
            if (this.isModifierClass(_class)) {
                const parsedModifier = _class.replace(new RegExp(`^${this.modifierDelimiter}`), '');
                result.parsedClassModifiers.push(this.applyModifier(result.name, parsedModifier));
            }
            else if (this.isNthBlockElementClass(_class)) {
                const parentLevel = parseInt(_class.substr(1), 10);
                const [elementName, ...modifiers] = _class.replace(new RegExp(`^${this.nthBlockElementClassPrefix}`), '')
                    .split(this.modifierDelimiter);
                const resolvedNthBlockElementClass = this.resolveNthBlockElementClass(parentLevel, elementName);
                result.parsedNthBlockElements = parsedNthBlockElements.concat(resolvedNthBlockElementClass, modifiers.map(m => this.applyModifier(resolvedNthBlockElementClass, m)));
            }
            else {
                result.restClasses.push(_class);
            }
            return result;
        }, {
            name: '',
            tag: '',
            parsedClassModifiers: Array(),
            parsedNthBlockElements: Array(),
            restClasses: Array(),
        });
    }
    /**
     * Return tag by attributes signature.
     */
    inferTag(attributes) {
        if (attributes.href)
            return 'a';
        const block = this.factory.getBlock();
        if (block) {
            if (/^(ul|ol)$/g.test(block.getTag()))
                return 'li';
        }
        return 'div';
    }
    /**
     * If we want to provide tag explicitly, we have to write tag name as uppercased
     * first class in class names.
     */
    isTagClass(_class) {
        return /^[A-Z1-6]+$/.test(_class);
    }
    applyModifier(name, modifier) {
        return `${name}${this.factory.getOptions().separators.modifier}${modifier}`;
    }
    /**
     * Convert entity into raw data. Useful for testing.
     */
    toObject() {
        return {
            type: this.getType(),
            name: this.getName(),
            tag: this.getTag(),
            parsedClassModifiers: this.getParsedClassModifiers(),
            parsedNthBlockElements: this.getParsedNthBlockElements(),
            restClasses: this.getRestClasses(),
            attributes: this.getAttributes(),
        };
    }
}
exports.default = BEMEntity;
