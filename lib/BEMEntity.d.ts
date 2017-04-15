import { default as Factory, HTMLAttributes, EntityType } from './Factory';
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
declare abstract class BEMEntity {
    /**
     * Modifier delimiter inside block/modifier sentence.
     *
     * For example `Block_modifier_isModifier_hasModifier` class attribute has three modifiers,
     * separated by modifier delimiter and will be parsed in that manner as
     * `Block Block--modifier Block--isModifier Block--hasModifier`.
     */
    protected modifierDelimiter: string;
    /**
     * Check if modifier class is a standalone modifier class. It is very useful if we
     * want to pass modifier into non-BEM mixin, for example +Logo.{modifierDelimiter}_modifier.
     */
    protected isModifierClass(_class: string): boolean;
    /**
     * Tells that "_\\d-class" inside `class` attribute is an element name that belongs
     * to the nth block above current entity.
     *
     * So `Block-element _1-item` will produce `Block-element <OneLevelAboveBlock>-item`
     * class.
     */
    protected nthBlockElementClassPrefix: string;
    protected isNthBlockElementClass(_class: string): boolean;
    /**
     * Entity type. Each derived entity class must provide its entity type.
     */
    abstract getType(): EntityType;
    /**
     * Name of entity (e.g. block or element).
     */
    protected name: string;
    getName(): string;
    /**
     * HTML tag.
     */
    protected tag: string;
    getTag(): string;
    /**
     * If true, command to use entity name as HTML id attribute value also
     */
    private bemID;
    protected parsedClassModifiers: string[];
    getParsedClassModifiers(): string[];
    protected parsedNthBlockElements: string[];
    getParsedNthBlockElements(): string[];
    /**
     * Some classes we should provide as is. Nothing special here, if it is not a tag-class,
     * or entity_name_with_modifiers class, or not a nthBlockElement class, then such class
     * goes to restClasses.
     */
    protected restClasses: string[];
    getRestClasses(): string[];
    protected attributes: HTMLAttributes;
    getAttributes(): Readonly<{
        [attribute: string]: string;
    }>;
    /**
     * BEM factory instance. We need this to provide some options during entity creation.
     */
    private factory;
    getFactory(): Factory;
    constructor(factory: Factory, attributes: HTMLAttributes);
    protected resolveNthBlockElementClass(position: number, elementName: string): string | never;
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
    protected composeAttributes(): void;
    private normalizeClassAttribute(classAttribute?);
    /**
     * Classificate all class names by their signatures.
     */
    protected parseClassAttribute(classAttribute: string[]): {
        name: string;
        tag: string;
        parsedClassModifiers: string[];
        parsedNthBlockElements: string[];
        restClasses: string[];
    };
    /**
     * Return tag by attributes signature.
     */
    protected inferTag(attributes: HTMLAttributes): string;
    /**
     * If we want to provide tag explicitly, we have to write tag name as uppercased
     * first class in class names.
     */
    private isTagClass(_class);
    protected applyModifier(name: string, modifier: string): string;
    /**
     * Convert entity into raw data. Useful for testing.
     */
    toObject(): {
        type: EntityType;
        name: string;
        tag: string;
        parsedClassModifiers: string[];
        parsedNthBlockElements: string[];
        restClasses: string[];
        attributes: Readonly<{
            [attribute: string]: string;
        }>;
    };
}
export default BEMEntity;
