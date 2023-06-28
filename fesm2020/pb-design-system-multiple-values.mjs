import * as i0 from '@angular/core';
import { EventEmitter, forwardRef, Directive, Inject, HostBinding, Input, Output, HostListener, NgModule } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

class PbdsMultipleValuesDirective {
    constructor(document, window, el) {
        this.el = el;
        this.multipleValuesClass = true;
        this.isPlaceholder = true;
        this.contentEditable = true;
        this.role = 'textbox';
        this.delimiters = [' ', ',', '\r'];
        this.delimetersSwitches = 'gm';
        this.replacements = [
            '(<div><br></div>)',
            '(<div>)',
            '(</div>)',
            '\t',
            '&nbsp;',
            '<br>|<br/>',
            '^ +',
            '^\n' // newline should be last
        ];
        this.replacementsSwtiches = 'gm';
        this.placeholder = null;
        this.submitOnEnter = false;
        this.maximumHeight = 150;
        this.submit = new EventEmitter();
        this.isFirefox = false;
        this.onTouched = () => { };
        this.onChange = () => { };
        // fix for using document in a publishable library see https://stackoverflow.com/questions/65222602/how-to-export-angular-10-guard-using-document-for-public-api
        this.document = document;
        this.window = window;
        // check if browser is firefox
        const agent = this.window.navigator.userAgent.toLowerCase();
        this.isFirefox = agent.indexOf('firefox') > -1;
        // handle ngModel and FormCntrolName
        this.writeValue(this.value);
    }
    ngOnInit() {
        // handle event only placeholder (i.e. no ngModel or FormControlName)
        if (this.value === undefined) {
            this.setPlaceholder();
        }
        this.el.nativeElement.style.setProperty('--pbds-multiple-values-max-height', `${+this.maximumHeight}px`);
    }
    onInput() {
        return false;
    }
    onFocus() {
        const selection = this.document.getSelection();
        const range = this.document.createRange();
        range.selectNodeContents(this.el.nativeElement);
        selection.removeAllRanges();
        selection.addRange(range);
        if (this.value === this.placeholder) {
            this.value = '';
            this.el.nativeElement.innerHTML = '';
            this.isPlaceholder = false;
            return;
        }
        return false;
    }
    onBlur() {
        this.onTouched();
        const value = this.clean(this.el.nativeElement.innerHTML);
        this.value = value;
        this.el.nativeElement.innerHTML = value;
        const values = this.toValueArray(value);
        this.onChange(values);
        this.setPlaceholder();
        return false;
    }
    onKeydown($event) {
        if (this.submitOnEnter && ($event.key === 'Enter' || $event.code === 'Enter') && !$event.shiftKey) {
            return false;
        }
    }
    onKeyup($event) {
        const value = this.clean(this.el.nativeElement.innerHTML);
        const values = this.toValueArray(value);
        this.onChange(values);
        if (this.submitOnEnter) {
            if (($event.key === 'Enter' || $event.code === 'Enter') && !$event.shiftKey) {
                this.value = value;
                this.el.nativeElement.innerHTML = value;
                this.submit.emit({
                    event: $event,
                    value: values
                });
            }
            return false;
        }
    }
    onPaste($event) {
        let paste = $event.clipboardData.getData('text/plain');
        paste = this.clean(paste);
        const selection = this.document.defaultView.getSelection();
        if (!selection.rangeCount) {
            return;
        }
        this.value = paste; // do not set this.el.nativeElement.innerHTML here, will break
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(this.document.createTextNode(paste));
        selection.collapseToEnd();
        const pasteArr = this.toValueArray(paste);
        this.onChange(pasteArr);
        this.isPlaceholder = false;
        return false;
    }
    // programmatically writing the value
    writeValue(value) {
        if (value) {
            this.value = value.join('\n');
        }
        this.setPlaceholder();
    }
    // method to be triggered on UI change
    registerOnChange(onChange) {
        this.onChange = onChange;
    }
    // method to be triggered on component touch
    registerOnTouched(onTouched) {
        this.onTouched = onTouched;
    }
    setDisabledState(isDisabled) {
        this.contentEditable = isDisabled ? false : true;
    }
    /**
     * Get values
     *
     * @returns {string[]} Array of strings
     */
    getValues() {
        const value = this.clean(this.el.nativeElement.innerHTML);
        const values = this.toValueArray(value);
        return values;
    }
    /**
     * Reset the value to an empty string
     *
     * @returns void
     */
    reset() {
        this.value = '';
    }
    /**
     * Check if `value` is  an empty string, `<br>` or equal to the placeholder text. If not, then set the value to the placeholder and apply the placeholder class.
     *
     * @returns void
     */
    setPlaceholder() {
        if (this.placeholder) {
            if (!this.value || this.value === '' || this.value === '<br>' || this.value === this.placeholder) {
                this.value = this.placeholder;
                this.el.nativeElement.innerHTML = this.placeholder;
                this.isPlaceholder = true;
                return;
            }
        }
        this.isPlaceholder = false;
    }
    /**
     * Convert innerHTML string to an array of strings
     *
     * @param {string} value - innerHTML of the content editable div
     *
     * @returns {string[]} Array of strings
     */
    toValueArray(value) {
        const values = value.split(/\n|\r/).filter((v) => v !== '');
        return values;
    }
    /**
     * Clean characters from the innerHTML
     *
     * @param {string} value  - innerHTML of the content editable div
     *
     * @returns {string} String with the following removed: divs, commas, spaces, tabs, empty lines, non-breaking spaces
     */
    clean(value) {
        // console.log('INITIAL VALUE: ', value);
        // delimeters
        for (let index = 0; index < this.delimiters.length; index++) {
            const regex = new RegExp(this.delimiters[index], this.delimetersSwitches);
            value = value.replace(regex, '\n');
        }
        // replace opening divs with divider before replacements
        value = value.replace(/(<div>)/gm, '\n');
        // replacements
        for (let index = 0; index < this.replacements.length; index++) {
            const regex = new RegExp(this.replacements[index], this.replacementsSwtiches);
            if (this.isFirefox) {
                value = value.replace(regex, '\n');
            }
            else {
                value = value.replace(regex, '');
            }
        }
        // replace empty newlines
        if (this.isFirefox) {
            value = value.replace(/^\n/gm, '');
        }
        // console.log('CLEANED VALUE: ', value);
        return value;
    }
}
PbdsMultipleValuesDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsMultipleValuesDirective, deps: [{ token: DOCUMENT }, { token: Window }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
PbdsMultipleValuesDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.7", type: PbdsMultipleValuesDirective, selector: "[pbdsMultipleValues]", inputs: { delimiters: "delimiters", delimetersSwitches: "delimetersSwitches", replacements: "replacements", replacementsSwtiches: "replacementsSwtiches", placeholder: "placeholder", submitOnEnter: "submitOnEnter", maximumHeight: "maximumHeight" }, outputs: { submit: "submit" }, host: { listeners: { "input": "onInput()", "focus": "onFocus()", "blur": "onBlur()", "keydown": "onKeydown($event)", "keyup": "onKeyup($event)", "paste": "onPaste($event)" }, properties: { "class.pbds-multiple-values": "this.multipleValuesClass", "class.is-placeholder": "this.isPlaceholder", "attr.contenteditable": "this.contentEditable", "attr.role": "this.role" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PbdsMultipleValuesDirective),
            multi: true
        },
        { provide: Window, useValue: window }
    ], exportAs: ["PbdsMultipleValues"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsMultipleValuesDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pbdsMultipleValues]',
                    exportAs: 'PbdsMultipleValues',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PbdsMultipleValuesDirective),
                            multi: true
                        },
                        { provide: Window, useValue: window }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: Window, decorators: [{
                    type: Inject,
                    args: [Window]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { multipleValuesClass: [{
                type: HostBinding,
                args: ['class.pbds-multiple-values']
            }], isPlaceholder: [{
                type: HostBinding,
                args: ['class.is-placeholder']
            }], contentEditable: [{
                type: HostBinding,
                args: ['attr.contenteditable']
            }], role: [{
                type: HostBinding,
                args: ['attr.role']
            }], delimiters: [{
                type: Input
            }], delimetersSwitches: [{
                type: Input
            }], replacements: [{
                type: Input
            }], replacementsSwtiches: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], submitOnEnter: [{
                type: Input
            }], maximumHeight: [{
                type: Input
            }], submit: [{
                type: Output
            }], onInput: [{
                type: HostListener,
                args: ['input']
            }], onFocus: [{
                type: HostListener,
                args: ['focus']
            }], onBlur: [{
                type: HostListener,
                args: ['blur']
            }], onKeydown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }], onKeyup: [{
                type: HostListener,
                args: ['keyup', ['$event']]
            }], onPaste: [{
                type: HostListener,
                args: ['paste', ['$event']]
            }] } });

class PbdsMultipleValuesModule {
}
PbdsMultipleValuesModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsMultipleValuesModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsMultipleValuesModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.7", ngImport: i0, type: PbdsMultipleValuesModule, declarations: [PbdsMultipleValuesDirective], imports: [CommonModule], exports: [PbdsMultipleValuesDirective] });
PbdsMultipleValuesModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsMultipleValuesModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsMultipleValuesModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsMultipleValuesDirective],
                    imports: [CommonModule],
                    exports: [PbdsMultipleValuesDirective]
                }]
        }] });

class PbdsMultipleValuesValidators {
    static maxArrayLength(maxLength) {
        // use a varible to prevent compiler lambda error, see https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-387114613
        const result = (c) => {
            if (c.value?.length > maxLength) {
                return { pbdsMultipleValuesMaxLength: true };
            }
            return null;
        };
        return result;
    }
}

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsMultipleValuesDirective, PbdsMultipleValuesModule, PbdsMultipleValuesValidators };
//# sourceMappingURL=pb-design-system-multiple-values.mjs.map
