import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export interface PbdsMultipleValuesSubmit {
    event: Event;
    value: string[];
}
export declare class PbdsMultipleValuesDirective implements ControlValueAccessor, OnInit {
    private el;
    private multipleValuesClass;
    private isPlaceholder;
    private contentEditable;
    private role;
    readonly delimiters: string[];
    readonly delimetersSwitches = "gm";
    readonly replacements: string[];
    readonly replacementsSwtiches = "gm";
    readonly placeholder: string | null;
    readonly submitOnEnter = false;
    readonly maximumHeight = 150;
    readonly submit: EventEmitter<PbdsMultipleValuesSubmit>;
    private value;
    private document;
    private window;
    private isFirefox;
    private onTouched;
    private onChange;
    constructor(document: any, window: Window, el: ElementRef<HTMLDivElement>);
    ngOnInit(): void;
    private onInput;
    private onFocus;
    private onBlur;
    private onKeydown;
    private onKeyup;
    private onPaste;
    writeValue(value: any): void;
    registerOnChange(onChange: (value: string[]) => void): void;
    registerOnTouched(onTouched: () => void): void;
    setDisabledState(disabled: boolean): void;
    /**
     * Get values
     *
     * @returns {string[]} Array of strings
     */
    getValues(): string[];
    /**
     * Reset the value to an empty string
     *
     * @returns void
     */
    reset(): void;
    /**
     * Check if `value` is  an empty string, `<br>` or equal to the placeholder text. If not, then set the value to the placeholder and apply the placeholder class.
     *
     * @returns void
     */
    private setPlaceholder;
    /**
     * Convert innerHTML string to an array of strings
     *
     * @param {string} value - innerHTML of the content editable div
     *
     * @returns {string[]} Array of strings
     */
    private toValueArray;
    /**
     * Clean characters from the innerHTML
     *
     * @param {string} value  - innerHTML of the content editable div
     *
     * @returns {string} String with the following removed: divs, commas, spaces, tabs, empty lines, non-breaking spaces
     */
    private clean;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsMultipleValuesDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PbdsMultipleValuesDirective, "[pbdsMultipleValues]", ["PbdsMultipleValues"], { "delimiters": "delimiters"; "delimetersSwitches": "delimetersSwitches"; "replacements": "replacements"; "replacementsSwtiches": "replacementsSwtiches"; "placeholder": "placeholder"; "submitOnEnter": "submitOnEnter"; "maximumHeight": "maximumHeight"; }, { "submit": "submit"; }, never>;
}
