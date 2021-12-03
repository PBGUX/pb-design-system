import { DOCUMENT } from '@angular/common';
import { Directive, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
export class PbdsMultipleValuesDirective {
    constructor(document, el) {
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
        this.onTouched = () => { };
        this.onChange = () => { };
        // fix for using document in a publishable library see https://stackoverflow.com/questions/65222602/how-to-export-angular-10-guard-using-document-for-public-api
        this.document = document;
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
        console.log('INITIAL VALUE: ', value);
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
            value = value.replace(regex, '');
        }
        console.log('CLEANED VALUE: ', value);
        return value;
    }
}
PbdsMultipleValuesDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PbdsMultipleValuesDirective, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
PbdsMultipleValuesDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.2", type: PbdsMultipleValuesDirective, selector: "[pbdsMultipleValues]", inputs: { delimiters: "delimiters", delimetersSwitches: "delimetersSwitches", replacements: "replacements", replacementsSwtiches: "replacementsSwtiches", placeholder: "placeholder", submitOnEnter: "submitOnEnter", maximumHeight: "maximumHeight" }, outputs: { submit: "submit" }, host: { listeners: { "input": "onInput()", "focus": "onFocus()", "blur": "onBlur()", "keydown": "onKeydown($event)", "keyup": "onKeyup($event)", "paste": "onPaste($event)" }, properties: { "class.pbds-multiple-values": "this.multipleValuesClass", "class.placeholder": "this.isPlaceholder", "attr.contenteditable": "this.contentEditable", "attr.role": "this.role" } }, providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PbdsMultipleValuesDirective),
            multi: true
        }
    ], exportAs: ["PbdsMultipleValues"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PbdsMultipleValuesDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pbdsMultipleValues]',
                    exportAs: 'PbdsMultipleValues',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PbdsMultipleValuesDirective),
                            multi: true
                        }
                    ]
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwbGUtdmFsdWVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vbXVsdGlwbGUtdmFsdWVzL211bHRpcGxlLXZhbHVlcy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUNaLFVBQVUsRUFDVixXQUFXLEVBQ1gsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBRUwsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBd0IsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFpQnpFLE1BQU0sT0FBTywyQkFBMkI7SUFnRHRDLFlBQThCLFFBQWEsRUFBVSxFQUE4QjtRQUE5QixPQUFFLEdBQUYsRUFBRSxDQUE0QjtRQS9DaEMsd0JBQW1CLEdBQUcsSUFBSSxDQUFDO1FBRXBDLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBRWxCLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBRWxDLFNBQUksR0FBRyxTQUFTLENBQUM7UUFHbkMsZUFBVSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUc5Qix1QkFBa0IsR0FBRyxJQUFJLENBQUM7UUFHMUIsaUJBQVksR0FBRztZQUM3QixtQkFBbUI7WUFDbkIsU0FBUztZQUNULFVBQVU7WUFDVixJQUFJO1lBQ0osUUFBUTtZQUNSLFlBQVk7WUFDWixLQUFLO1lBQ0wsS0FBSyxDQUFDLHlCQUF5QjtTQUNoQyxDQUFDO1FBR2MseUJBQW9CLEdBQUcsSUFBSSxDQUFDO1FBRzVCLGdCQUFXLEdBQWtCLElBQUksQ0FBQztRQUdsQyxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUd0QixrQkFBYSxHQUFHLEdBQUcsQ0FBQztRQUdwQixX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QUFvQjtzQkFEbkMsS0FBSztnQkFJVSxXQUFXO3NCQUQxQixLQUFLO2dCQUlVLGFBQWE7c0JBRDVCLEtBQUs7Z0JBSVUsYUFBYTtzQkFENUIsS0FBSztnQkFJVSxNQUFNO3NCQURyQixNQUFNO2dCQTBCd0IsT0FBTztzQkFBckMsWUFBWTt1QkFBQyxPQUFPO2dCQUlVLE9BQU87c0JBQXJDLFlBQVk7dUJBQUMsT0FBTztnQkFrQlMsTUFBTTtzQkFBbkMsWUFBWTt1QkFBQyxNQUFNO2dCQWdCeUIsU0FBUztzQkFBckQsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBTVEsT0FBTztzQkFBakQsWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBcUJVLE9BQU87c0JBQWpELFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uSW5pdCxcbiAgT3V0cHV0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBiZHNNdWx0aXBsZVZhbHVlc1N1Ym1pdCB7XG4gIGV2ZW50OiBFdmVudDtcbiAgdmFsdWU6IHN0cmluZ1tdO1xufVxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BiZHNNdWx0aXBsZVZhbHVlc10nLFxuICBleHBvcnRBczogJ1BiZHNNdWx0aXBsZVZhbHVlcycsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGJkc011bHRpcGxlVmFsdWVzRGlyZWN0aXZlKSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNNdWx0aXBsZVZhbHVlc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtbXVsdGlwbGUtdmFsdWVzJykgcHJpdmF0ZSBtdWx0aXBsZVZhbHVlc0NsYXNzID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBsYWNlaG9sZGVyJykgcHJpdmF0ZSBpc1BsYWNlaG9sZGVyID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2F0dHIuY29udGVudGVkaXRhYmxlJykgcHJpdmF0ZSBjb250ZW50RWRpdGFibGUgPSB0cnVlO1xuXG4gIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJykgcHJpdmF0ZSByb2xlID0gJ3RleHRib3gnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBkZWxpbWl0ZXJzID0gWycgJywgJywnLCAnXFxyJ107XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IGRlbGltZXRlcnNTd2l0Y2hlcyA9ICdnbSc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHJlcGxhY2VtZW50cyA9IFtcbiAgICAnKDxkaXY+PGJyPjwvZGl2PiknLFxuICAgICcoPGRpdj4pJyxcbiAgICAnKDwvZGl2PiknLFxuICAgICdcXHQnLFxuICAgICcmbmJzcDsnLFxuICAgICc8YnI+fDxici8+JyxcbiAgICAnXiArJyxcbiAgICAnXlxcbicgLy8gbmV3bGluZSBzaG91bGQgYmUgbGFzdFxuICBdO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSByZXBsYWNlbWVudHNTd3RpY2hlcyA9ICdnbSc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHBsYWNlaG9sZGVyOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgc3VibWl0T25FbnRlciA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBtYXhpbXVtSGVpZ2h0ID0gMTUwO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgc3VibWl0OiBFdmVudEVtaXR0ZXI8UGJkc011bHRpcGxlVmFsdWVzU3VibWl0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIHZhbHVlOiBzdHJpbmc7XG4gIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIHByaXZhdGUgb25Ub3VjaGVkID0gKCkgPT4ge307XG4gIHByaXZhdGUgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nW10pID0+IHZvaWQgPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudDogYW55LCBwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50Pikge1xuICAgIC8vIGZpeCBmb3IgdXNpbmcgZG9jdW1lbnQgaW4gYSBwdWJsaXNoYWJsZSBsaWJyYXJ5IHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NTIyMjYwMi9ob3ctdG8tZXhwb3J0LWFuZ3VsYXItMTAtZ3VhcmQtdXNpbmctZG9jdW1lbnQtZm9yLXB1YmxpYy1hcGlcbiAgICB0aGlzLmRvY3VtZW50ID0gPERvY3VtZW50PmRvY3VtZW50O1xuXG4gICAgLy8gaGFuZGxlIG5nTW9kZWwgYW5kIEZvcm1DbnRyb2xOYW1lXG4gICAgdGhpcy53cml0ZVZhbHVlKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gaGFuZGxlIGV2ZW50IG9ubHkgcGxhY2Vob2xkZXIgKGkuZS4gbm8gbmdNb2RlbCBvciBGb3JtQ29udHJvbE5hbWUpXG4gICAgaWYgKHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICAgIH1cblxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1wYmRzLW11bHRpcGxlLXZhbHVlcy1tYXgtaGVpZ2h0JywgYCR7K3RoaXMubWF4aW11bUhlaWdodH1weGApO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignaW5wdXQnKSBwcml2YXRlIG9uSW5wdXQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnKSBwcml2YXRlIG9uRm9jdXMoKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5kb2N1bWVudC5nZXRTZWxlY3Rpb24oKTtcbiAgICBjb25zdCByYW5nZSA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcblxuICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHNlbGVjdGlvbi5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICBzZWxlY3Rpb24uYWRkUmFuZ2UocmFuZ2UpO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgPT09IHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgIHRoaXMudmFsdWUgPSAnJztcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2JsdXInKSBwcml2YXRlIG9uQmx1cigpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmNsZWFuKHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwpO1xuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudG9WYWx1ZUFycmF5KHZhbHVlKTtcbiAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlcyk7XG5cbiAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSkgcHJpdmF0ZSBvbktleWRvd24oJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc3VibWl0T25FbnRlciAmJiAoJGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fCAkZXZlbnQuY29kZSA9PT0gJ0VudGVyJykgJiYgISRldmVudC5zaGlmdEtleSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSkgcHJpdmF0ZSBvbktleXVwKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jbGVhbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnRvVmFsdWVBcnJheSh2YWx1ZSk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlcyk7XG5cbiAgICBpZiAodGhpcy5zdWJtaXRPbkVudGVyKSB7XG4gICAgICBpZiAoKCRldmVudC5rZXkgPT09ICdFbnRlcicgfHwgJGV2ZW50LmNvZGUgPT09ICdFbnRlcicpICYmICEkZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICAgICAgdGhpcy5zdWJtaXQuZW1pdCh7XG4gICAgICAgICAgZXZlbnQ6ICRldmVudCxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVzXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigncGFzdGUnLCBbJyRldmVudCddKSBwcml2YXRlIG9uUGFzdGUoJGV2ZW50KSB7XG4gICAgbGV0IHBhc3RlID0gJGV2ZW50LmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuICAgIHBhc3RlID0gdGhpcy5jbGVhbihwYXN0ZSk7XG5cbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3LmdldFNlbGVjdGlvbigpO1xuXG4gICAgaWYgKCFzZWxlY3Rpb24ucmFuZ2VDb3VudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudmFsdWUgPSBwYXN0ZTsgLy8gZG8gbm90IHNldCB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MIGhlcmUsIHdpbGwgYnJlYWtcblxuICAgIHNlbGVjdGlvbi5kZWxldGVGcm9tRG9jdW1lbnQoKTtcbiAgICBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKS5pbnNlcnROb2RlKHRoaXMuZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocGFzdGUpKTtcbiAgICBzZWxlY3Rpb24uY29sbGFwc2VUb0VuZCgpO1xuXG4gICAgY29uc3QgcGFzdGVBcnIgPSB0aGlzLnRvVmFsdWVBcnJheShwYXN0ZSk7XG5cbiAgICB0aGlzLm9uQ2hhbmdlKHBhc3RlQXJyKTtcblxuICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gcHJvZ3JhbW1hdGljYWxseSB3cml0aW5nIHRoZSB2YWx1ZVxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS5qb2luKCdcXG4nKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFBsYWNlaG9sZGVyKCk7XG4gIH1cblxuICAvLyBtZXRob2QgdG8gYmUgdHJpZ2dlcmVkIG9uIFVJIGNoYW5nZVxuICByZWdpc3Rlck9uQ2hhbmdlKG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZ1tdKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICB9XG5cbiAgLy8gbWV0aG9kIHRvIGJlIHRyaWdnZXJlZCBvbiBjb21wb25lbnQgdG91Y2hcbiAgcmVnaXN0ZXJPblRvdWNoZWQob25Ub3VjaGVkOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBvblRvdWNoZWQ7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGRpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5jb250ZW50RWRpdGFibGUgPSBkaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX0gQXJyYXkgb2Ygc3RyaW5nc1xuICAgKi9cbiAgZ2V0VmFsdWVzKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2xlYW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCk7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy50b1ZhbHVlQXJyYXkodmFsdWUpO1xuXG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgdmFsdWUgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAqXG4gICAqIEByZXR1cm5zIHZvaWRcbiAgICovXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBgdmFsdWVgIGlzICBhbiBlbXB0eSBzdHJpbmcsIGA8YnI+YCBvciBlcXVhbCB0byB0aGUgcGxhY2Vob2xkZXIgdGV4dC4gSWYgbm90LCB0aGVuIHNldCB0aGUgdmFsdWUgdG8gdGhlIHBsYWNlaG9sZGVyIGFuZCBhcHBseSB0aGUgcGxhY2Vob2xkZXIgY2xhc3MuXG4gICAqXG4gICAqIEByZXR1cm5zIHZvaWRcbiAgICovXG4gIHByaXZhdGUgc2V0UGxhY2Vob2xkZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgIGlmICghdGhpcy52YWx1ZSB8fCB0aGlzLnZhbHVlID09PSAnJyB8fCB0aGlzLnZhbHVlID09PSAnPGJyPicgfHwgdGhpcy52YWx1ZSA9PT0gdGhpcy5wbGFjZWhvbGRlcikge1xuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IHRoaXMucGxhY2Vob2xkZXI7XG4gICAgICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNQbGFjZWhvbGRlciA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgaW5uZXJIVE1MIHN0cmluZyB0byBhbiBhcnJheSBvZiBzdHJpbmdzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIGlubmVySFRNTCBvZiB0aGUgY29udGVudCBlZGl0YWJsZSBkaXZcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ1tdfSBBcnJheSBvZiBzdHJpbmdzXG4gICAqL1xuICBwcml2YXRlIHRvVmFsdWVBcnJheSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlLnNwbGl0KC9cXG58XFxyLykuZmlsdGVyKCh2KSA9PiB2ICE9PSAnJyk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbiBjaGFyYWN0ZXJzIGZyb20gdGhlIGlubmVySFRNTFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgIC0gaW5uZXJIVE1MIG9mIHRoZSBjb250ZW50IGVkaXRhYmxlIGRpdlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBTdHJpbmcgd2l0aCB0aGUgZm9sbG93aW5nIHJlbW92ZWQ6IGRpdnMsIGNvbW1hcywgc3BhY2VzLCB0YWJzLCBlbXB0eSBsaW5lcywgbm9uLWJyZWFraW5nIHNwYWNlc1xuICAgKi9cbiAgcHJpdmF0ZSBjbGVhbih2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zb2xlLmxvZygnSU5JVElBTCBWQUxVRTogJywgdmFsdWUpO1xuXG4gICAgLy8gZGVsaW1ldGVyc1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmRlbGltaXRlcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAodGhpcy5kZWxpbWl0ZXJzW2luZGV4XSwgdGhpcy5kZWxpbWV0ZXJzU3dpdGNoZXMpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlZ2V4LCAnXFxuJyk7XG4gICAgfVxuXG4gICAgLy8gcmVwbGFjZSBvcGVuaW5nIGRpdnMgd2l0aCBkaXZpZGVyIGJlZm9yZSByZXBsYWNlbWVudHNcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLyg8ZGl2PikvZ20sICdcXG4nKTtcblxuICAgIC8vIHJlcGxhY2VtZW50c1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnJlcGxhY2VtZW50cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cCh0aGlzLnJlcGxhY2VtZW50c1tpbmRleF0sIHRoaXMucmVwbGFjZW1lbnRzU3d0aWNoZXMpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlZ2V4LCAnJyk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ0NMRUFORUQgVkFMVUU6ICcsIHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cbiJdfQ==