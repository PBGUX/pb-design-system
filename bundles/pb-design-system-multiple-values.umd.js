(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms')) :
    typeof define === 'function' && define.amd ? define('pb-design-system/multiple-values', ['exports', '@angular/core', '@angular/common', '@angular/forms'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['pb-design-system'] = global['pb-design-system'] || {}, global['pb-design-system']['multiple-values'] = {}), global.ng.core, global.ng.common, global.ng.forms));
}(this, (function (exports, core, common, forms) { 'use strict';

    var PbdsMultipleValuesDirective = /** @class */ (function () {
        function PbdsMultipleValuesDirective(document, el) {
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
            this.submit = new core.EventEmitter();
            this.onTouched = function () { };
            this.onChange = function () { };
            // fix for using document in a publishable library see https://stackoverflow.com/questions/65222602/how-to-export-angular-10-guard-using-document-for-public-api
            this.document = document;
            // handle ngModel and FormCntrolName
            this.writeValue(this.value);
        }
        PbdsMultipleValuesDirective.prototype.ngOnInit = function () {
            // handle event only placeholder (i.e. no ngModel or FormControlName)
            if (this.value === undefined) {
                this.setPlaceholder();
            }
            this.el.nativeElement.style.setProperty('--pbds-multiple-values-max-height', +this.maximumHeight + "px");
        };
        PbdsMultipleValuesDirective.prototype.onInput = function () {
            return false;
        };
        PbdsMultipleValuesDirective.prototype.onFocus = function () {
            var selection = this.document.getSelection();
            var range = this.document.createRange();
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
        };
        PbdsMultipleValuesDirective.prototype.onBlur = function () {
            this.onTouched();
            var value = this.clean(this.el.nativeElement.innerHTML);
            this.value = value;
            this.el.nativeElement.innerHTML = value;
            var values = this.toValueArray(value);
            this.onChange(values);
            this.setPlaceholder();
            return false;
        };
        PbdsMultipleValuesDirective.prototype.onKeydown = function ($event) {
            if (this.submitOnEnter && ($event.key === 'Enter' || $event.code === 'Enter') && !$event.shiftKey) {
                return false;
            }
        };
        PbdsMultipleValuesDirective.prototype.onKeyup = function ($event) {
            var value = this.clean(this.el.nativeElement.innerHTML);
            var values = this.toValueArray(value);
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
        };
        PbdsMultipleValuesDirective.prototype.onPaste = function ($event) {
            var paste = $event.clipboardData.getData('text/plain');
            paste = this.clean(paste);
            var selection = this.document.defaultView.getSelection();
            if (!selection.rangeCount) {
                return;
            }
            this.value = paste; // do not set this.el.nativeElement.innerHTML here, will break
            selection.deleteFromDocument();
            selection.getRangeAt(0).insertNode(this.document.createTextNode(paste));
            selection.collapseToEnd();
            var pasteArr = this.toValueArray(paste);
            this.onChange(pasteArr);
            this.isPlaceholder = false;
            return false;
        };
        // programmatically writing the value
        PbdsMultipleValuesDirective.prototype.writeValue = function (value) {
            if (value) {
                this.value = value.join('\n');
            }
            this.setPlaceholder();
        };
        // method to be triggered on UI change
        PbdsMultipleValuesDirective.prototype.registerOnChange = function (onChange) {
            this.onChange = onChange;
        };
        // method to be triggered on component touch
        PbdsMultipleValuesDirective.prototype.registerOnTouched = function (onTouched) {
            this.onTouched = onTouched;
        };
        PbdsMultipleValuesDirective.prototype.setDisabledState = function (disabled) {
            this.contentEditable = disabled;
        };
        /**
         * Get values
         *
         * @returns {string[]} Array of strings
         */
        PbdsMultipleValuesDirective.prototype.getValues = function () {
            var value = this.clean(this.el.nativeElement.innerHTML);
            var values = this.toValueArray(value);
            return values;
        };
        /**
         * Reset the value to an empty string
         *
         * @returns void
         */
        PbdsMultipleValuesDirective.prototype.reset = function () {
            this.value = '';
        };
        /**
         * Check if `value` is  an empty string, `<br>` or equal to the placeholder text. If not, then set the value to the placeholder and apply the placeholder class.
         *
         * @returns void
         */
        PbdsMultipleValuesDirective.prototype.setPlaceholder = function () {
            if (this.placeholder) {
                if (!this.value || this.value === '' || this.value === '<br>' || this.value === this.placeholder) {
                    this.value = this.placeholder;
                    this.el.nativeElement.innerHTML = this.placeholder;
                    this.isPlaceholder = true;
                    return;
                }
            }
            this.isPlaceholder = false;
        };
        /**
         * Convert innerHTML string to an array of strings
         *
         * @param {string} value - innerHTML of the content editable div
         *
         * @returns {string[]} Array of strings
         */
        PbdsMultipleValuesDirective.prototype.toValueArray = function (value) {
            var values = value.split(/\n|\r/).filter(function (v) { return v !== ''; });
            return values;
        };
        /**
         * Clean characters from the innerHTML
         *
         * @param {string} value  - innerHTML of the content editable div
         *
         * @returns {string} String with the following removed: divs, commas, spaces, tabs, empty lines, non-breaking spaces
         */
        PbdsMultipleValuesDirective.prototype.clean = function (value) {
            console.log('INITIAL VALUE: ', value);
            // delimeters
            for (var index = 0; index < this.delimiters.length; index++) {
                var regex = new RegExp(this.delimiters[index], this.delimetersSwitches);
                value = value.replace(regex, '\n');
            }
            // replace opening divs with divider before replacements
            value = value.replace(/(<div>)/gm, '\n');
            // replacements
            for (var index = 0; index < this.replacements.length; index++) {
                var regex = new RegExp(this.replacements[index], this.replacementsSwtiches);
                value = value.replace(regex, '');
            }
            console.log('CLEANED VALUE: ', value);
            return value;
        };
        return PbdsMultipleValuesDirective;
    }());
    PbdsMultipleValuesDirective.decorators = [
        { type: core.Directive, args: [{
                    selector: '[pbdsMultipleValues]',
                    exportAs: 'PbdsMultipleValues',
                    providers: [
                        {
                            provide: forms.NG_VALUE_ACCESSOR,
                            useExisting: core.forwardRef(function () { return PbdsMultipleValuesDirective; }),
                            multi: true
                        }
                    ]
                },] }
    ];
    PbdsMultipleValuesDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: core.Inject, args: [common.DOCUMENT,] }] },
        { type: core.ElementRef }
    ]; };
    PbdsMultipleValuesDirective.propDecorators = {
        multipleValuesClass: [{ type: core.HostBinding, args: ['class.pbds-multiple-values',] }],
        isPlaceholder: [{ type: core.HostBinding, args: ['class.placeholder',] }],
        contentEditable: [{ type: core.HostBinding, args: ['attr.contenteditable',] }],
        role: [{ type: core.HostBinding, args: ['attr.role',] }],
        delimiters: [{ type: core.Input }],
        delimetersSwitches: [{ type: core.Input }],
        replacements: [{ type: core.Input }],
        replacementsSwtiches: [{ type: core.Input }],
        placeholder: [{ type: core.Input }],
        submitOnEnter: [{ type: core.Input }],
        maximumHeight: [{ type: core.Input }],
        submit: [{ type: core.Output }],
        onInput: [{ type: core.HostListener, args: ['input',] }],
        onFocus: [{ type: core.HostListener, args: ['focus',] }],
        onBlur: [{ type: core.HostListener, args: ['blur',] }],
        onKeydown: [{ type: core.HostListener, args: ['keydown', ['$event'],] }],
        onKeyup: [{ type: core.HostListener, args: ['keyup', ['$event'],] }],
        onPaste: [{ type: core.HostListener, args: ['paste', ['$event'],] }]
    };

    var PbdsMultipleValuesModule = /** @class */ (function () {
        function PbdsMultipleValuesModule() {
        }
        return PbdsMultipleValuesModule;
    }());
    PbdsMultipleValuesModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [PbdsMultipleValuesDirective],
                    imports: [common.CommonModule],
                    exports: [PbdsMultipleValuesDirective]
                },] }
    ];

    var PbdsMultipleValuesValidators = /** @class */ (function () {
        function PbdsMultipleValuesValidators() {
        }
        PbdsMultipleValuesValidators.maxArrayLength = function (maxLength) {
            // use a varible to prevent compiler lambda error, see https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-387114613
            var result = function (c) {
                var _a;
                if (((_a = c.value) === null || _a === void 0 ? void 0 : _a.length) > maxLength) {
                    return { pbdsMultipleValuesMaxLength: true };
                }
                return null;
            };
            return result;
        };
        return PbdsMultipleValuesValidators;
    }());

    /**
     * Generated bundle index. Do not edit.
     */

    exports.PbdsMultipleValuesDirective = PbdsMultipleValuesDirective;
    exports.PbdsMultipleValuesModule = PbdsMultipleValuesModule;
    exports.PbdsMultipleValuesValidators = PbdsMultipleValuesValidators;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pb-design-system-multiple-values.umd.js.map
