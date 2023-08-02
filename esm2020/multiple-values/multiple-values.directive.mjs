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
PbdsMultipleValuesDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsMultipleValuesDirective, deps: [{ token: DOCUMENT }, { token: Window }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
PbdsMultipleValuesDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.12", type: PbdsMultipleValuesDirective, selector: "[pbdsMultipleValues]", inputs: { delimiters: "delimiters", delimetersSwitches: "delimetersSwitches", replacements: "replacements", replacementsSwtiches: "replacementsSwtiches", placeholder: "placeholder", submitOnEnter: "submitOnEnter", maximumHeight: "maximumHeight" }, outputs: { submit: "submit" }, host: { listeners: { "input": "onInput()", "focus": "onFocus()", "blur": "onBlur()", "keydown": "onKeydown($event)", "keyup": "onKeyup($event)", "paste": "onPaste($event)" }, properties: { "class.pbds-multiple-values": "this.multipleValuesClass", "class.placeholder": "this.isPlaceholder", "attr.contenteditable": "this.contentEditable", "attr.role": "this.role" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PbdsMultipleValuesDirective),
            multi: true
        },
        { provide: Window, useValue: window }
    ], exportAs: ["PbdsMultipleValues"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsMultipleValuesDirective, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwbGUtdmFsdWVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vbXVsdGlwbGUtdmFsdWVzL211bHRpcGxlLXZhbHVlcy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFrQnpFLE1BQU0sT0FBTywyQkFBMkI7SUFrRHRDLFlBQThCLFFBQWEsRUFBa0IsTUFBYyxFQUFVLEVBQThCO1FBQTlCLE9BQUUsR0FBRixFQUFFLENBQTRCO1FBakRoRSx3QkFBbUIsR0FBRyxJQUFJLENBQUM7UUFFcEMsa0JBQWEsR0FBRyxJQUFJLENBQUM7UUFFbEIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFFbEMsU0FBSSxHQUFHLFNBQVMsQ0FBQztRQUduQyxlQUFVLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRzlCLHVCQUFrQixHQUFHLElBQUksQ0FBQztRQUcxQixpQkFBWSxHQUFHO1lBQzdCLG1CQUFtQjtZQUNuQixTQUFTO1lBQ1QsVUFBVTtZQUNWLElBQUk7WUFDSixRQUFRO1lBQ1IsWUFBWTtZQUNaLEtBQUs7WUFDTCxLQUFLLENBQUMseUJBQXlCO1NBQ2hDLENBQUM7UUFHYyx5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFHNUIsZ0JBQVcsR0FBa0IsSUFBSSxDQUFDO1FBR2xDLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBR3RCLGtCQUFhLEdBQUcsR0FBRyxD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Y2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPdXRwdXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGJkc011bHRpcGxlVmFsdWVzU3VibWl0IHtcbiAgZXZlbnQ6IEV2ZW50O1xuICB2YWx1ZTogc3RyaW5nW107XG59XG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcGJkc011bHRpcGxlVmFsdWVzXScsXG4gIGV4cG9ydEFzOiAnUGJkc011bHRpcGxlVmFsdWVzJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBQYmRzTXVsdGlwbGVWYWx1ZXNEaXJlY3RpdmUpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9LFxuICAgIHsgcHJvdmlkZTogV2luZG93LCB1c2VWYWx1ZTogd2luZG93IH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzTXVsdGlwbGVWYWx1ZXNEaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLW11bHRpcGxlLXZhbHVlcycpIHByaXZhdGUgbXVsdGlwbGVWYWx1ZXNDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wbGFjZWhvbGRlcicpIHByaXZhdGUgaXNQbGFjZWhvbGRlciA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmNvbnRlbnRlZGl0YWJsZScpIHByaXZhdGUgY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpIHByaXZhdGUgcm9sZSA9ICd0ZXh0Ym94JztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgZGVsaW1pdGVycyA9IFsnICcsICcsJywgJ1xcciddO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBkZWxpbWV0ZXJzU3dpdGNoZXMgPSAnZ20nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSByZXBsYWNlbWVudHMgPSBbXG4gICAgJyg8ZGl2Pjxicj48L2Rpdj4pJyxcbiAgICAnKDxkaXY+KScsXG4gICAgJyg8L2Rpdj4pJyxcbiAgICAnXFx0JyxcbiAgICAnJm5ic3A7JyxcbiAgICAnPGJyPnw8YnIvPicsXG4gICAgJ14gKycsXG4gICAgJ15cXG4nIC8vIG5ld2xpbmUgc2hvdWxkIGJlIGxhc3RcbiAgXTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgcmVwbGFjZW1lbnRzU3d0aWNoZXMgPSAnZ20nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBwbGFjZWhvbGRlcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdE9uRW50ZXIgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgbWF4aW11bUhlaWdodCA9IDE1MDtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdDogRXZlbnRFbWl0dGVyPFBiZHNNdWx0aXBsZVZhbHVlc1N1Ym1pdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudDtcbiAgcHJpdmF0ZSB3aW5kb3c6IFdpbmRvdztcbiAgcHJpdmF0ZSBpc0ZpcmVmb3ggPSBmYWxzZTtcblxuICBwcml2YXRlIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZ1tdKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSwgQEluamVjdChXaW5kb3cpIHdpbmRvdzogV2luZG93LCBwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50Pikge1xuICAgIC8vIGZpeCBmb3IgdXNpbmcgZG9jdW1lbnQgaW4gYSBwdWJsaXNoYWJsZSBsaWJyYXJ5IHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NTIyMjYwMi9ob3ctdG8tZXhwb3J0LWFuZ3VsYXItMTAtZ3VhcmQtdXNpbmctZG9jdW1lbnQtZm9yLXB1YmxpYy1hcGlcbiAgICB0aGlzLmRvY3VtZW50ID0gPERvY3VtZW50PmRvY3VtZW50O1xuICAgIHRoaXMud2luZG93ID0gPFdpbmRvdz53aW5kb3c7XG5cbiAgICAvLyBjaGVjayBpZiBicm93c2VyIGlzIGZpcmVmb3hcbiAgICBjb25zdCBhZ2VudCA9IHRoaXMud2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLmlzRmlyZWZveCA9IGFnZW50LmluZGV4T2YoJ2ZpcmVmb3gnKSA+IC0xO1xuXG4gICAgLy8gaGFuZGxlIG5nTW9kZWwgYW5kIEZvcm1DbnRyb2xOYW1lXG4gICAgdGhpcy53cml0ZVZhbHVlKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gaGFuZGxlIGV2ZW50IG9ubHkgcGxhY2Vob2xkZXIgKGkuZS4gbm8gbmdNb2RlbCBvciBGb3JtQ29udHJvbE5hbWUpXG4gICAgaWYgKHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICAgIH1cblxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1wYmRzLW11bHRpcGxlLXZhbHVlcy1tYXgtaGVpZ2h0JywgYCR7K3RoaXMubWF4aW11bUhlaWdodH1weGApO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignaW5wdXQnKSBwcml2YXRlIG9uSW5wdXQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKSBwcml2YXRlIG9uRm9jdXMoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5kb2N1bWVudC5nZXRTZWxlY3Rpb24oKTtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcblxuICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHNlbGVjdGlvbi5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICBzZWxlY3Rpb24uYWRkUmFuZ2UocmFuZ2UpO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgPT09IHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgIHRoaXMudmFsdWUgPSAnJztcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKSBwcml2YXRlIG9uQmx1cigpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmNsZWFuKHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwpO1xuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudG9WYWx1ZUFycmF5KHZhbHVlKTtcbiAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlcyk7XG5cbiAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSkgcHJpdmF0ZSBvbktleWRvd24oJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc3VibWl0T25FbnRlciAmJiAoJGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fCAkZXZlbnQuY29kZSA9PT0gJ0VudGVyJykgJiYgISRldmVudC5zaGlmdEtleSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSkgcHJpdmF0ZSBvbktleXVwKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jbGVhbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnRvVmFsdWVBcnJheSh2YWx1ZSk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlcyk7XG5cbiAgICBpZiAodGhpcy5zdWJtaXRPbkVudGVyKSB7XG4gICAgICBpZiAoKCRldmVudC5rZXkgPT09ICdFbnRlcicgfHwgJGV2ZW50LmNvZGUgPT09ICdFbnRlcicpICYmICEkZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICAgICAgdGhpcy5zdWJtaXQuZW1pdCh7XG4gICAgICAgICAgZXZlbnQ6ICRldmVudCxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVzXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigncGFzdGUnLCBbJyRldmVudCddKSBwcml2YXRlIG9uUGFzdGUoJGV2ZW50KSB7XG4gICAgbGV0IHBhc3RlID0gJGV2ZW50LmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgIHBhc3RlID0gdGhpcy5jbGVhbihwYXN0ZSk7XG5cbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LmdldFNlbGVjdGlvbigpO1xuXG4gICAgaWYgKCFzZWxlY3Rpb24ucmFuZ2VDb3VudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudmFsdWUgPSBwYXN0ZTsgLy8gZG8gbm90IHNldCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MIGhlcmUsIHdpbGwgYnJlYWtcblxuICAgIHNlbGVjdGlvbi5kZWxldGVGcm9tRG9jdW1lbnQoKTtcbiAgICBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKS5pbnNlcnROb2RlKHRoaXMuZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocGFzdGUpKTtcbiAgICBzZWxlY3Rpb24uY29sbGFwc2VUb0VuZCgpO1xuXG4gICAgY29uc3QgcGFzdGVBcnIgPSB0aGlzLnRvVmFsdWVBcnJheShwYXN0ZSk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlKHBhc3RlQXJyKTtcblxuICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gcHJvZ3JhbW1hdGljYWxseSB3cml0aW5nIHRoZSB2YWx1ZVxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCk7XG4gIH1cblxuICAvLyBtZXRob2QgdG8gYmUgdHJpZ2dlcmVkIG9uIFVJIGNoYW5nZVxuICByZWdpc3Rlck9uQ2hhbmdlKG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZ1tdKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICB9XG5cbiAgLy8gbWV0aG9kIHRvIGJlIHRyaWdnZXJlZCBvbiBjb21wb25lbnQgdG91Y2hcbiAgcmVnaXN0ZXJPblRvdWNoZWQob25Ub3VjaGVkOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBvblRvdWNoZWQ7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGRpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5jb250ZW50RWRpdGFibGUgPSBkaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX0gQXJyYXkgb2Ygc3RyaW5nc1xuICAgKi9cbiAgZ2V0VmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2xlYW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCk7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy50b1ZhbHVlQXJyYXkodmFsdWUpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgdmFsdWUgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm5zIHZvaWRcbiAgICovXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBgdmFsdWVgIGlzICBhbiBlbXB0eSBzdHJpbmcsIGA8YnI+YCBvciBlcXVhbCB0byB0aGUgcGxhY2Vob2xkZXIgdGV4dC4gSWYgbm90LCB0aGVuIHNldCB0aGUgdmFsdWUgdG8gdGhlIHBsYWNlaG9sZGVyIGFuZCBhcHBseSB0aGUgcGxhY2Vob2xkZXIgY2xhc3MuXG4gICAqXG4gICAqIEByZXR1cm5zIHZvaWRcbiAgICovXG4gIHByaXZhdGUgc2V0UGxhY2Vob2xkZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgIGlmICghdGhpcy52YWx1ZSB8fCB0aGlzLnZhbHVlID09PSAnJyB8fCB0aGlzLnZhbHVlID09PSAnPGJyPicgfHwgdGhpcy52YWx1ZSA9PT0gdGhpcy5wbGFjZWhvbGRlcikge1xuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IHRoaXMucGxhY2Vob2xkZXI7XG4gICAgICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgaW5uZXJIVE1MIHN0cmluZyB0byBhbiBhcnJheSBvZiBzdHJpbmdzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGlubmVySFRNTCBvZiB0aGUgY29udGVudCBlZGl0YWJsZSBkaXZcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ1tdfSBBcnJheSBvZiBzdHJpbmdzXG4gICAqL1xuICBwcml2YXRlIHRvVmFsdWVBcnJheSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlLnNwbGl0KC9cXG58XFxyLykuZmlsdGVyKCh2KSA9PiB2ICE9PSAnJyk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbiBjaGFyYWN0ZXJzIGZyb20gdGhlIGlubmVySFRNTFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgIC0gaW5uZXJIVE1MIG9mIHRoZSBjb250ZW50IGVkaXRhYmxlIGRpdlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBTdHJpbmcgd2l0aCB0aGUgZm9sbG93aW5nIHJlbW92ZWQ6IGRpdnMsIGNvbW1hcywgc3BhY2VzLCB0YWJzLCBlbXB0eSBsaW5lcywgbm9uLWJyZWFraW5nIHNwYWNlc1xuICAgKi9cbiAgcHJpdmF0ZSBjbGVhbih2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBjb25zb2xlLmxvZygnSU5JVElBTCBWQUxVRTogJywgdmFsdWUpO1xuXG4gICAgLy8gZGVsaW1ldGVyc1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmRlbGltaXRlcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAodGhpcy5kZWxpbWl0ZXJzW2luZGV4XSwgdGhpcy5kZWxpbWV0ZXJzU3dpdGNoZXMpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlZ2V4LCAnXFxuJyk7XG4gICAgfVxuXG4gICAgLy8gcmVwbGFjZSBvcGVuaW5nIGRpdnMgd2l0aCBkaXZpZGVyIGJlZm9yZSByZXBsYWNlbWVudHNcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLyg8ZGl2PikvZ20sICdcXG4nKTtcblxuICAgIC8vIHJlcGxhY2VtZW50c1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnJlcGxhY2VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0sIHRoaXMucmVwbGFjZW1lbnRzU3d0aWNoZXMpO1xuXG4gICAgICBpZiAodGhpcy5pc0ZpcmVmb3gpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlZ2V4LCAnXFxuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVnZXgsICcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXBsYWNlIGVtcHR5IG5ld2xpbmVzXG4gICAgaWYgKHRoaXMuaXNGaXJlZm94KSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL15cXG4vZ20sICcnKTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygnQ0xFQU5FRCBWQUxVRTogJywgdmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuIl19