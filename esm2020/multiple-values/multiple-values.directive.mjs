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
    setDisabledState(disabled) {
        this.contentEditable = disabled;
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
PbdsMultipleValuesDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: PbdsMultipleValuesDirective, deps: [{ token: DOCUMENT }, { token: Window }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
PbdsMultipleValuesDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.2", type: PbdsMultipleValuesDirective, selector: "[pbdsMultipleValues]", inputs: { delimiters: "delimiters", delimetersSwitches: "delimetersSwitches", replacements: "replacements", replacementsSwtiches: "replacementsSwtiches", placeholder: "placeholder", submitOnEnter: "submitOnEnter", maximumHeight: "maximumHeight" }, outputs: { submit: "submit" }, host: { listeners: { "input": "onInput()", "focus": "onFocus()", "blur": "onBlur()", "keydown": "onKeydown($event)", "keyup": "onKeyup($event)", "paste": "onPaste($event)" }, properties: { "class.pbds-multiple-values": "this.multipleValuesClass", "class.placeholder": "this.isPlaceholder", "attr.contenteditable": "this.contentEditable", "attr.role": "this.role" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PbdsMultipleValuesDirective),
            multi: true
        },
        { provide: Window, useValue: window }
    ], exportAs: ["PbdsMultipleValues"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: PbdsMultipleValuesDirective, decorators: [{
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
                args: ['class.placeholder']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwbGUtdmFsdWVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vbXVsdGlwbGUtdmFsdWVzL211bHRpcGxlLXZhbHVlcy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFrQnpFLE1BQU0sT0FBTywyQkFBMkI7SUFrRHRDLFlBQThCLFFBQWEsRUFBa0IsTUFBYyxFQUFVLEVBQThCO1FBQTlCLE9BQUUsR0FBRixFQUFFLENBQTRCO1FBakRoRSx3QkFBbUIsR0FBRyxJQUFJLENBQUM7UUFFcEMsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFFbEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFFbEMsU0FBSSxHQUFHLFNBQVMsQ0FBQztRQUduQyxlQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRzlCLHVCQUFrQixHQUFHLElBQUksQ0FBQztRQUcxQixpQkFBWSxHQUFHO1lBQzdCLG1CQUFtQjtZQUNuQixTQUFTO1lBQ1QsVUFBVTtZQUNWLElBQUk7WUFDSixRQUFRO1lBQ1IsWUFBWTtZQUNaLEtBQUs7WUFDTCxLQUFLLENBQUMseUJBQXlCO1NBQ2hDLENBQUM7UUFHYyx5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFHNUIsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBR2xDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBR3RCLGtCQUFhLEdBQUcsR0FBRyxD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Q0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGludGVyZmFjZSBQYmRzTXVsdGlwbGVWYWx1ZXNTdWJtaXQge1xuICBldmVudDogRXZlbnQ7XG4gIHZhbHVlOiBzdHJpbmdbXTtcbn1cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twYmRzTXVsdGlwbGVWYWx1ZXNdJyxcbiAgZXhwb3J0QXM6ICdQYmRzTXVsdGlwbGVWYWx1ZXMnLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBiZHNNdWx0aXBsZVZhbHVlc0RpcmVjdGl2ZSksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH0sXG4gICAgeyBwcm92aWRlOiBXaW5kb3csIHVzZVZhbHVlOiB3aW5kb3cgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNNdWx0aXBsZVZhbHVlc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtbXVsdGlwbGUtdmFsdWVzJykgcHJpdmF0ZSBtdWx0aXBsZVZhbHVlc0NsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBsYWNlaG9sZGVyJykgcHJpdmF0ZSBpc1BsYWNlaG9sZGVyID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2F0dHIuY29udGVudGVkaXRhYmxlJykgcHJpdmF0ZSBjb250ZW50RWRpdGFibGUgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJykgcHJpdmF0ZSByb2xlID0gJ3RleHRib3gnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBkZWxpbWl0ZXJzID0gWycgJywgJywnLCAnXFxyJ107XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IGRlbGltZXRlcnNTd2l0Y2hlcyA9ICdnbSc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHJlcGxhY2VtZW50cyA9IFtcbiAgICAnKDxkaXY+PGJyPjwvZGl2PiknLFxuICAgICcoPGRpdj4pJyxcbiAgICAnKDwvZGl2PiknLFxuICAgICdcXHQnLFxuICAgICcmbmJzcDsnLFxuICAgICc8YnI+fDxici8+JyxcbiAgICAnXiArJyxcbiAgICAnXlxcbicgLy8gbmV3bGluZSBzaG91bGQgYmUgbGFzdFxuICBdO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSByZXBsYWNlbWVudHNTd3RpY2hlcyA9ICdnbSc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHBsYWNlaG9sZGVyOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgc3VibWl0T25FbnRlciA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBtYXhpbXVtSGVpZ2h0ID0gMTUwO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgc3VibWl0OiBFdmVudEVtaXR0ZXI8UGJkc011bHRpcGxlVmFsdWVzU3VibWl0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG4gIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50O1xuICBwcml2YXRlIHdpbmRvdzogV2luZG93O1xuICBwcml2YXRlIGlzRmlyZWZveCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgb25Ub3VjaGVkID0gKCkgPT4ge307XG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nW10pID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LCBASW5qZWN0KFdpbmRvdykgd2luZG93OiBXaW5kb3csIHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+KSB7XG4gICAgLy8gZml4IGZvciB1c2luZyBkb2N1bWVudCBpbiBhIHB1Ymxpc2hhYmxlIGxpYnJhcnkgc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY1MjIyNjAyL2hvdy10by1leHBvcnQtYW5ndWxhci0xMC1ndWFyZC11c2luZy1kb2N1bWVudC1mb3ItcHVibGljLWFwaVxuICAgIHRoaXMuZG9jdW1lbnQgPSA8RG9jdW1lbnQ+ZG9jdW1lbnQ7XG4gICAgdGhpcy53aW5kb3cgPSA8V2luZG93PndpbmRvdztcblxuICAgIC8vIGNoZWNrIGlmIGJyb3dzZXIgaXMgZmlyZWZveFxuICAgIGNvbnN0IGFnZW50ID0gdGhpcy53aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMuaXNGaXJlZm94ID0gYWdlbnQuaW5kZXhPZignZmlyZWZveCcpID4gLTE7XG5cbiAgICAvLyBoYW5kbGUgbmdNb2RlbCBhbmQgRm9ybUNudHJvbE5hbWVcbiAgICB0aGlzLndyaXRlVmFsdWUodGhpcy52YWx1ZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBoYW5kbGUgZXZlbnQgb25seSBwbGFjZWhvbGRlciAoaS5lLiBubyBuZ01vZGVsIG9yIEZvcm1Db250cm9sTmFtZSlcbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLXBiZHMtbXVsdGlwbGUtdmFsdWVzLW1heC1oZWlnaHQnLCBgJHsrdGhpcy5tYXhpbXVtSGVpZ2h0fXB4YCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdpbnB1dCcpIHByaXZhdGUgb25JbnB1dCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdmb2N1cycpIHByaXZhdGUgb25Gb2N1cygpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmRvY3VtZW50LmdldFNlbGVjdGlvbigpO1xuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuXG4gICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIHNlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XG5cbiAgICBpZiAodGhpcy52YWx1ZSA9PT0gdGhpcy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy52YWx1ZSA9ICcnO1xuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgdGhpcy5pc1BsYWNlaG9sZGVyID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignYmx1cicpIHByaXZhdGUgb25CbHVyKCkge1xuICAgIHRoaXMub25Ub3VjaGVkKCk7XG5cbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2xlYW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCk7XG5cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy50b1ZhbHVlQXJyYXkodmFsdWUpO1xuICAgIHRoaXMub25DaGFuZ2UodmFsdWVzKTtcblxuICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoKTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKSBwcml2YXRlIG9uS2V5ZG93bigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5zdWJtaXRPbkVudGVyICYmICgkZXZlbnQua2V5ID09PSAnRW50ZXInIHx8ICRldmVudC5jb2RlID09PSAnRW50ZXInKSAmJiAhJGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5dXAnLCBbJyRldmVudCddKSBwcml2YXRlIG9uS2V5dXAoJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmNsZWFuKHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwpO1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudG9WYWx1ZUFycmF5KHZhbHVlKTtcblxuICAgIHRoaXMub25DaGFuZ2UodmFsdWVzKTtcblxuICAgIGlmICh0aGlzLnN1Ym1pdE9uRW50ZXIpIHtcbiAgICAgIGlmICgoJGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fCAkZXZlbnQuY29kZSA9PT0gJ0VudGVyJykgJiYgISRldmVudC5zaGlmdEtleSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgICAgICB0aGlzLnN1Ym1pdC5lbWl0KHtcbiAgICAgICAgICBldmVudDogJGV2ZW50LFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZXNcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdwYXN0ZScsIFsnJGV2ZW50J10pIHByaXZhdGUgb25QYXN0ZSgkZXZlbnQpIHtcbiAgICBsZXQgcGFzdGUgPSAkZXZlbnQuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG4gICAgcGFzdGUgPSB0aGlzLmNsZWFuKHBhc3RlKTtcblxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0U2VsZWN0aW9uKCk7XG5cbiAgICBpZiAoIXNlbGVjdGlvbi5yYW5nZUNvdW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy52YWx1ZSA9IHBhc3RlOyAvLyBkbyBub3Qgc2V0IHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgaGVyZSwgd2lsbCBicmVha1xuXG4gICAgc2VsZWN0aW9uLmRlbGV0ZUZyb21Eb2N1bWVudCgpO1xuICAgIHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApLmluc2VydE5vZGUodGhpcy5kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShwYXN0ZSkpO1xuICAgIHNlbGVjdGlvbi5jb2xsYXBzZVRvRW5kKCk7XG5cbiAgICBjb25zdCBwYXN0ZUFyciA9IHRoaXMudG9WYWx1ZUFycmF5KHBhc3RlKTtcblxuICAgIHRoaXMub25DaGFuZ2UocGFzdGVBcnIpO1xuXG4gICAgdGhpcy5pc1BsYWNlaG9sZGVyID0gZmFsc2U7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBwcm9ncmFtbWF0aWNhbGx5IHdyaXRpbmcgdGhlIHZhbHVlXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlLmpvaW4oJ1xcbicpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoKTtcbiAgfVxuXG4gIC8vIG1ldGhvZCB0byBiZSB0cmlnZ2VyZWQgb24gVUkgY2hhbmdlXG4gIHJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nW10pID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gb25DaGFuZ2U7XG4gIH1cblxuICAvLyBtZXRob2QgdG8gYmUgdHJpZ2dlcmVkIG9uIGNvbXBvbmVudCB0b3VjaFxuICByZWdpc3Rlck9uVG91Y2hlZChvblRvdWNoZWQ6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IG9uVG91Y2hlZDtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoZGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmNvbnRlbnRFZGl0YWJsZSA9IGRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ1tdfSBBcnJheSBvZiBzdHJpbmdzXG4gICAqL1xuICBnZXRWYWx1ZXMoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jbGVhbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnRvVmFsdWVBcnJheSh2YWx1ZSk7XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSB2YWx1ZSB0byBhbiBlbXB0eSBzdHJpbmdcbiAgICpcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGB2YWx1ZWAgaXMgIGFuIGVtcHR5IHN0cmluZywgYDxicj5gIG9yIGVxdWFsIHRvIHRoZSBwbGFjZWhvbGRlciB0ZXh0LiBJZiBub3QsIHRoZW4gc2V0IHRoZSB2YWx1ZSB0byB0aGUgcGxhY2Vob2xkZXIgYW5kIGFwcGx5IHRoZSBwbGFjZWhvbGRlciBjbGFzcy5cbiAgICpcbiAgICogQHJldHVybnMgdm9pZFxuICAgKi9cbiAgcHJpdmF0ZSBzZXRQbGFjZWhvbGRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuICAgICAgaWYgKCF0aGlzLnZhbHVlIHx8IHRoaXMudmFsdWUgPT09ICcnIHx8IHRoaXMudmFsdWUgPT09ICc8YnI+JyB8fCB0aGlzLnZhbHVlID09PSB0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy5pc1BsYWNlaG9sZGVyID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pc1BsYWNlaG9sZGVyID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBpbm5lckhUTUwgc3RyaW5nIHRvIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gaW5uZXJIVE1MIG9mIHRoZSBjb250ZW50IGVkaXRhYmxlIGRpdlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119IEFycmF5IG9mIHN0cmluZ3NcbiAgICovXG4gIHByaXZhdGUgdG9WYWx1ZUFycmF5KHZhbHVlOiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgdmFsdWVzID0gdmFsdWUuc3BsaXQoL1xcbnxcXHIvKS5maWx0ZXIoKHYpID0+IHYgIT09ICcnKTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFuIGNoYXJhY3RlcnMgZnJvbSB0aGUgaW5uZXJIVE1MXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAgLSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnQgZWRpdGFibGUgZGl2XG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFN0cmluZyB3aXRoIHRoZSBmb2xsb3dpbmcgcmVtb3ZlZDogZGl2cywgY29tbWFzLCBzcGFjZXMsIHRhYnMsIGVtcHR5IGxpbmVzLCBub24tYnJlYWtpbmcgc3BhY2VzXG4gICAqL1xuICBwcml2YXRlIGNsZWFuKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIC8vIGNvbnNvbGUubG9nKCdJTklUSUFMIFZBTFVFOiAnLCB2YWx1ZSk7XG5cbiAgICAvLyBkZWxpbWV0ZXJzXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZGVsaW1pdGVycy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCh0aGlzLmRlbGltaXRlcnNbaW5kZXhdLCB0aGlzLmRlbGltZXRlcnNTd2l0Y2hlcyk7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVnZXgsICdcXG4nKTtcbiAgICB9XG5cbiAgICAvLyByZXBsYWNlIG9wZW5pbmcgZGl2cyB3aXRoIGRpdmlkZXIgYmVmb3JlIHJlcGxhY2VtZW50c1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvKDxkaXY+KS9nbSwgJ1xcbicpO1xuXG4gICAgLy8gcmVwbGFjZW1lbnRzXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucmVwbGFjZW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHRoaXMucmVwbGFjZW1lbnRzW2luZGV4XSwgdGhpcy5yZXBsYWNlbWVudHNTd3RpY2hlcyk7XG5cbiAgICAgIGlmICh0aGlzLmlzRmlyZWZveCkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVnZXgsICdcXG4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZWdleCwgJycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlcGxhY2UgZW1wdHkgbmV3bGluZXNcbiAgICBpZiAodGhpcy5pc0ZpcmVmb3gpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXlxcbi9nbSwgJycpO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdDTEVBTkVEIFZBTFVFOiAnLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG4iXX0=