import { DOCUMENT } from '@angular/common';
import { Directive, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
export class PbdsMultipleValuesDirective {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsMultipleValuesDirective, deps: [{ token: DOCUMENT }, { token: Window }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: PbdsMultipleValuesDirective, selector: "[pbdsMultipleValues]", inputs: { delimiters: "delimiters", delimetersSwitches: "delimetersSwitches", replacements: "replacements", replacementsSwtiches: "replacementsSwtiches", placeholder: "placeholder", submitOnEnter: "submitOnEnter", maximumHeight: "maximumHeight" }, outputs: { submit: "submit" }, host: { listeners: { "input": "onInput()", "focus": "onFocus()", "blur": "onBlur()", "keydown": "onKeydown($event)", "keyup": "onKeyup($event)", "paste": "onPaste($event)" }, properties: { "class.pbds-multiple-values": "this.multipleValuesClass", "class.is-placeholder": "this.isPlaceholder", "attr.contenteditable": "this.contentEditable", "attr.role": "this.role" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PbdsMultipleValuesDirective),
                multi: true
            },
            { provide: Window, useValue: window }
        ], exportAs: ["PbdsMultipleValues"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsMultipleValuesDirective, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwbGUtdmFsdWVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vbXVsdGlwbGUtdmFsdWVzL211bHRpcGxlLXZhbHVlcy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFrQnpFLE1BQU0sT0FBTywyQkFBMkI7SUFrRHRDLFlBQThCLFFBQWEsRUFBa0IsTUFBYyxFQUFVLEVBQThCO1FBQTlCLE9BQUUsR0FBRixFQUFFLENBQTRCO1FBakRoRSx3QkFBbUIsR0FBRyxJQUFJLENBQUM7UUFFakMsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFFckIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFFbEMsU0FBSSxHQUFHLFNBQVMsQ0FBQztRQUduQyxlQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRzlCLHVCQUFrQixHQUFHLElBQUksQ0FBQztRQUcxQixpQkFBWSxHQUFHO1lBQzdCLG1CQUFtQjtZQUNuQixTQUFTO1lBQ1QsVUFBVTtZQUNWLElBQUk7WUFDSixRQUFRO1lBQ1IsWUFBWTtZQUNaLEtBQUs7WUFDTCxLQUFLLENBQUMseUJBQXlCO1NBQ2hDLENBQUM7UUFHYyx5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFHNUIsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBR2xDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBR3RCLGtCQUFhLEdBQUcsR0FBRyxD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LFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uSW5pdCxcbiAgT3V0cHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBiZHNNdWx0aXBsZVZhbHVlc1N1Ym1pdCB7XG4gIGV2ZW50OiBFdmVudDtcbiAgdmFsdWU6IHN0cmluZ1tdO1xufVxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BiZHNNdWx0aXBsZVZhbHVlc10nLFxuICBleHBvcnRBczogJ1BiZHNNdWx0aXBsZVZhbHVlcycsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGJkc011bHRpcGxlVmFsdWVzRGlyZWN0aXZlKSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfSxcbiAgICB7IHByb3ZpZGU6IFdpbmRvdywgdXNlVmFsdWU6IHdpbmRvdyB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgUGJkc011bHRpcGxlVmFsdWVzRGlyZWN0aXZlIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uSW5pdCB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1tdWx0aXBsZS12YWx1ZXMnKSBwcml2YXRlIG11bHRpcGxlVmFsdWVzQ2xhc3MgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MuaXMtcGxhY2Vob2xkZXInKSBwcml2YXRlIGlzUGxhY2Vob2xkZXIgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5jb250ZW50ZWRpdGFibGUnKSBwcml2YXRlIGNvbnRlbnRFZGl0YWJsZSA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKSBwcml2YXRlIHJvbGUgPSAndGV4dGJveCc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IGRlbGltaXRlcnMgPSBbJyAnLCAnLCcsICdcXHInXTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgZGVsaW1ldGVyc1N3aXRjaGVzID0gJ2dtJztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgcmVwbGFjZW1lbnRzID0gW1xuICAgICcoPGRpdj48YnI+PC9kaXY+KScsXG4gICAgJyg8ZGl2PiknLFxuICAgICcoPC9kaXY+KScsXG4gICAgJ1xcdCcsXG4gICAgJyZuYnNwOycsXG4gICAgJzxicj58PGJyLz4nLFxuICAgICdeICsnLFxuICAgICdeXFxuJyAvLyBuZXdsaW5lIHNob3VsZCBiZSBsYXN0XG4gIF07XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHJlcGxhY2VtZW50c1N3dGljaGVzID0gJ2dtJztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgcGxhY2Vob2xkZXI6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBzdWJtaXRPbkVudGVyID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IG1heGltdW1IZWlnaHQgPSAxNTA7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBzdWJtaXQ6IEV2ZW50RW1pdHRlcjxQYmRzTXVsdGlwbGVWYWx1ZXNTdWJtaXQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByaXZhdGUgdmFsdWU6IHN0cmluZztcbiAgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQ7XG4gIHByaXZhdGUgd2luZG93OiBXaW5kb3c7XG4gIHByaXZhdGUgaXNGaXJlZm94ID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBvblRvdWNoZWQgPSAoKSA9PiB7fTtcbiAgcHJpdmF0ZSBvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmdbXSkgPT4gdm9pZCA9ICgpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50OiBhbnksIEBJbmplY3QoV2luZG93KSB3aW5kb3c6IFdpbmRvdywgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD4pIHtcbiAgICAvLyBmaXggZm9yIHVzaW5nIGRvY3VtZW50IGluIGEgcHVibGlzaGFibGUgbGlicmFyeSBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjUyMjI2MDIvaG93LXRvLWV4cG9ydC1hbmd1bGFyLTEwLWd1YXJkLXVzaW5nLWRvY3VtZW50LWZvci1wdWJsaWMtYXBpXG4gICAgdGhpcy5kb2N1bWVudCA9IDxEb2N1bWVudD5kb2N1bWVudDtcbiAgICB0aGlzLndpbmRvdyA9IDxXaW5kb3c+d2luZG93O1xuXG4gICAgLy8gY2hlY2sgaWYgYnJvd3NlciBpcyBmaXJlZm94XG4gICAgY29uc3QgYWdlbnQgPSB0aGlzLndpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5pc0ZpcmVmb3ggPSBhZ2VudC5pbmRleE9mKCdmaXJlZm94JykgPiAtMTtcblxuICAgIC8vIGhhbmRsZSBuZ01vZGVsIGFuZCBGb3JtQ250cm9sTmFtZVxuICAgIHRoaXMud3JpdGVWYWx1ZSh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGhhbmRsZSBldmVudCBvbmx5IHBsYWNlaG9sZGVyIChpLmUuIG5vIG5nTW9kZWwgb3IgRm9ybUNvbnRyb2xOYW1lKVxuICAgIGlmICh0aGlzLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tcGJkcy1tdWx0aXBsZS12YWx1ZXMtbWF4LWhlaWdodCcsIGAkeyt0aGlzLm1heGltdW1IZWlnaHR9cHhgKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JykgcHJpdmF0ZSBvbklucHV0KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJykgcHJpdmF0ZSBvbkZvY3VzKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG5cbiAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHModGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgc2VsZWN0aW9uLmFkZFJhbmdlKHJhbmdlKTtcblxuICAgIGlmICh0aGlzLnZhbHVlID09PSB0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLnZhbHVlID0gJyc7XG4gICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdibHVyJykgcHJpdmF0ZSBvbkJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jbGVhbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnRvVmFsdWVBcnJheSh2YWx1ZSk7XG4gICAgdGhpcy5vbkNoYW5nZSh2YWx1ZXMpO1xuXG4gICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pIHByaXZhdGUgb25LZXlkb3duKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLnN1Ym1pdE9uRW50ZXIgJiYgKCRldmVudC5rZXkgPT09ICdFbnRlcicgfHwgJGV2ZW50LmNvZGUgPT09ICdFbnRlcicpICYmICEkZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pIHByaXZhdGUgb25LZXl1cCgkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2xlYW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCk7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy50b1ZhbHVlQXJyYXkodmFsdWUpO1xuXG4gICAgdGhpcy5vbkNoYW5nZSh2YWx1ZXMpO1xuXG4gICAgaWYgKHRoaXMuc3VibWl0T25FbnRlcikge1xuICAgICAgaWYgKCgkZXZlbnQua2V5ID09PSAnRW50ZXInIHx8ICRldmVudC5jb2RlID09PSAnRW50ZXInKSAmJiAhJGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgICAgIHRoaXMuc3VibWl0LmVtaXQoe1xuICAgICAgICAgIGV2ZW50OiAkZXZlbnQsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlc1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3Bhc3RlJywgWyckZXZlbnQnXSkgcHJpdmF0ZSBvblBhc3RlKCRldmVudCkge1xuICAgIGxldCBwYXN0ZSA9ICRldmVudC5jbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQvcGxhaW4nKTtcbiAgICBwYXN0ZSA9IHRoaXMuY2xlYW4ocGFzdGUpO1xuXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRTZWxlY3Rpb24oKTtcblxuICAgIGlmICghc2VsZWN0aW9uLnJhbmdlQ291bnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnZhbHVlID0gcGFzdGU7IC8vIGRvIG5vdCBzZXQgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCBoZXJlLCB3aWxsIGJyZWFrXG5cbiAgICBzZWxlY3Rpb24uZGVsZXRlRnJvbURvY3VtZW50KCk7XG4gICAgc2VsZWN0aW9uLmdldFJhbmdlQXQoMCkuaW5zZXJ0Tm9kZSh0aGlzLmRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHBhc3RlKSk7XG4gICAgc2VsZWN0aW9uLmNvbGxhcHNlVG9FbmQoKTtcblxuICAgIGNvbnN0IHBhc3RlQXJyID0gdGhpcy50b1ZhbHVlQXJyYXkocGFzdGUpO1xuXG4gICAgdGhpcy5vbkNoYW5nZShwYXN0ZUFycik7XG5cbiAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSBmYWxzZTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIHByb2dyYW1tYXRpY2FsbHkgd3JpdGluZyB0aGUgdmFsdWVcbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWUuam9pbignXFxuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICB9XG5cbiAgLy8gbWV0aG9kIHRvIGJlIHRyaWdnZXJlZCBvbiBVSSBjaGFuZ2VcbiAgcmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmdbXSkgPT4gdm9pZCkge1xuICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcbiAgfVxuXG4gIC8vIG1ldGhvZCB0byBiZSB0cmlnZ2VyZWQgb24gY29tcG9uZW50IHRvdWNoXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZDogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gb25Ub3VjaGVkO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5jb250ZW50RWRpdGFibGUgPSBpc0Rpc2FibGVkID8gZmFsc2UgOiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ1tdfSBBcnJheSBvZiBzdHJpbmdzXG4gICAqL1xuICBnZXRWYWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jbGVhbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnRvVmFsdWVBcnJheSh2YWx1ZSk7XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSB2YWx1ZSB0byBhbiBlbXB0eSBzdHJpbmdcbiAgICpcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGB2YWx1ZWAgaXMgIGFuIGVtcHR5IHN0cmluZywgYDxicj5gIG9yIGVxdWFsIHRvIHRoZSBwbGFjZWhvbGRlciB0ZXh0LiBJZiBub3QsIHRoZW4gc2V0IHRoZSB2YWx1ZSB0byB0aGUgcGxhY2Vob2xkZXIgYW5kIGFwcGx5IHRoZSBwbGFjZWhvbGRlciBjbGFzcy5cbiAgICpcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgcHJpdmF0ZSBzZXRQbGFjZWhvbGRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuICAgICAgaWYgKCF0aGlzLnZhbHVlIHx8IHRoaXMudmFsdWUgPT09ICcnIHx8IHRoaXMudmFsdWUgPT09ICc8YnI+JyB8fCB0aGlzLnZhbHVlID09PSB0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy5pc1BsYWNlaG9sZGVyID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pc1BsYWNlaG9sZGVyID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBpbm5lckhUTUwgc3RyaW5nIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gaW5uZXJIVE1MIG9mIHRoZSBjb250ZW50IGVkaXRhYmxlIGRpdlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119IEFycmF5IG9mIHN0cmluZ3NcbiAgICovXG4gIHByaXZhdGUgdG9WYWx1ZUFycmF5KHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgdmFsdWVzID0gdmFsdWUuc3BsaXQoL1xcbnxcXHIvKS5maWx0ZXIoKHYpID0+IHYgIT09ICcnKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFuIGNoYXJhY3RlcnMgZnJvbSB0aGUgaW5uZXJIVE1MXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAgLSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnQgZWRpdGFibGUgZGl2XG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFN0cmluZyB3aXRoIHRoZSBmb2xsb3dpbmcgcmVtb3ZlZDogZGl2cywgY29tbWFzLCBzcGFjZXMsIHRhYnMsIGVtcHR5IGxpbmVzLCBub24tYnJlYWtpbmcgc3BhY2VzXG4gICAqL1xuICBwcml2YXRlIGNsZWFuKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIC8vIGNvbnNvbGUubG9nKCdJTklUSUFMIFZBTFVFOiAnLCB2YWx1ZSk7XG5cbiAgICAvLyBkZWxpbWV0ZXJzXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZGVsaW1pdGVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCh0aGlzLmRlbGltaXRlcnNbaW5kZXhdLCB0aGlzLmRlbGltZXRlcnNTd2l0Y2hlcyk7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVnZXgsICdcXG4nKTtcbiAgICB9XG5cbiAgICAvLyByZXBsYWNlIG9wZW5pbmcgZGl2cyB3aXRoIGRpdmlkZXIgYmVmb3JlIHJlcGxhY2VtZW50c1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvKDxkaXY+KS9nbSwgJ1xcbicpO1xuXG4gICAgLy8gcmVwbGFjZW1lbnRzXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucmVwbGFjZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XSwgdGhpcy5yZXBsYWNlbWVudHNTd3RpY2hlcyk7XG5cbiAgICAgIGlmICh0aGlzLmlzRmlyZWZveCkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVnZXgsICdcXG4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZWdleCwgJycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlcGxhY2UgZW1wdHkgbmV3bGluZXNcbiAgICBpZiAodGhpcy5pc0ZpcmVmb3gpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXlxcbi9nbSwgJycpO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdDTEVBTkVEIFZBTFVFOiAnLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG4iXX0=