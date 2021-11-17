import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
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
PbdsMultipleValuesDirective.decorators = [
    { type: Directive, args: [{
                selector: '[pbdsMultipleValues]',
                exportAs: 'PbdsMultipleValues',
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PbdsMultipleValuesDirective),
                        multi: true
                    }
                ]
            },] }
];
PbdsMultipleValuesDirective.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ElementRef }
];
PbdsMultipleValuesDirective.propDecorators = {
    multipleValuesClass: [{ type: HostBinding, args: ['class.pbds-multiple-values',] }],
    isPlaceholder: [{ type: HostBinding, args: ['class.placeholder',] }],
    contentEditable: [{ type: HostBinding, args: ['attr.contenteditable',] }],
    role: [{ type: HostBinding, args: ['attr.role',] }],
    delimiters: [{ type: Input }],
    delimetersSwitches: [{ type: Input }],
    replacements: [{ type: Input }],
    replacementsSwtiches: [{ type: Input }],
    placeholder: [{ type: Input }],
    submitOnEnter: [{ type: Input }],
    maximumHeight: [{ type: Input }],
    submit: [{ type: Output }],
    onInput: [{ type: HostListener, args: ['input',] }],
    onFocus: [{ type: HostListener, args: ['focus',] }],
    onBlur: [{ type: HostListener, args: ['blur',] }],
    onKeydown: [{ type: HostListener, args: ['keydown', ['$event'],] }],
    onKeyup: [{ type: HostListener, args: ['keyup', ['$event'],] }],
    onPaste: [{ type: HostListener, args: ['paste', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwbGUtdmFsdWVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vbXVsdGlwbGUtdmFsdWVzL211bHRpcGxlLXZhbHVlcy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUVMLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQXdCLE1BQU0sZ0JBQWdCLENBQUM7QUFpQnpFLE1BQU0sT0FBTywyQkFBMkI7SUFnRHRDLFlBQThCLFFBQWEsRUFBVSxFQUE4QjtRQUE5QixPQUFFLEdBQUYsRUFBRSxDQUE0QjtRQS9DaEMsd0JBQW1CLEdBQUcsSUFBSSxDQUFDO1FBRXBDLGtCQUFhLEdBQUcsSUFBSSxDQUFDO1FBRWxCLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBRWxDLFNBQUksR0FBRyxTQUFTLENBQUM7UUFHbkMsZUFBVSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUc5Qix1QkFBa0IsR0FBRyxJQUFJLENBQUM7UUFHMUIsaUJBQVksR0FBRztZQUM3QixtQkFBbUI7WUFDbkIsU0FBUztZQUNULFVBQVU7WUFDVixJQUFJO1lBQ0osUUFBUTtZQUNSLFlBQVk7WUFDWixLQUFLO1lBQ0wsS0FBSyxDQUFDLHlCQUF5QjtTQUNoQyxDQUFDO1FBR2MseUJBQW9CLEdBQUcsSUFBSSxDQUFDO1FBRzVCLGdCQUFXLEdBQWtCLElBQUksQ0FBQztRQUdsQyxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUd0QixrQkFBYSxHQUFHLEdBQUcsQ0FB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Q0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGludGVyZmFjZSBQYmRzTXVsdGlwbGVWYWx1ZXNTdWJtaXQge1xuICBldmVudDogRXZlbnQ7XG4gIHZhbHVlOiBzdHJpbmdbXTtcbn1cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twYmRzTXVsdGlwbGVWYWx1ZXNdJyxcbiAgZXhwb3J0QXM6ICdQYmRzTXVsdGlwbGVWYWx1ZXMnLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBiZHNNdWx0aXBsZVZhbHVlc0RpcmVjdGl2ZSksXG4gICAgICBtdWx0aTogdHJ1ZVxuICAgIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzTXVsdGlwbGVWYWx1ZXNEaXJlY3RpdmUgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0IHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wYmRzLW11bHRpcGxlLXZhbHVlcycpIHByaXZhdGUgbXVsdGlwbGVWYWx1ZXNDbGFzcyA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wbGFjZWhvbGRlcicpIHByaXZhdGUgaXNQbGFjZWhvbGRlciA9IHRydWU7XG5cbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmNvbnRlbnRlZGl0YWJsZScpIHByaXZhdGUgY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcblxuICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpIHByaXZhdGUgcm9sZSA9ICd0ZXh0Ym94JztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgZGVsaW1pdGVycyA9IFsnICcsICcsJywgJ1xcciddO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBkZWxpbWV0ZXJzU3dpdGNoZXMgPSAnZ20nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSByZXBsYWNlbWVudHMgPSBbXG4gICAgJyg8ZGl2Pjxicj48L2Rpdj4pJyxcbiAgICAnKDxkaXY+KScsXG4gICAgJyg8L2Rpdj4pJyxcbiAgICAnXFx0JyxcbiAgICAnJm5ic3A7JyxcbiAgICAnPGJyPnw8YnIvPicsXG4gICAgJ14gKycsXG4gICAgJ15cXG4nIC8vIG5ld2xpbmUgc2hvdWxkIGJlIGxhc3RcbiAgXTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgcmVwbGFjZW1lbnRzU3d0aWNoZXMgPSAnZ20nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyByZWFkb25seSBwbGFjZWhvbGRlcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdE9uRW50ZXIgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgcmVhZG9ubHkgbWF4aW11bUhlaWdodCA9IDE1MDtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdDogRXZlbnRFbWl0dGVyPFBiZHNNdWx0aXBsZVZhbHVlc1N1Ym1pdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSB2YWx1ZTogc3RyaW5nO1xuICBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudDtcblxuICBwcml2YXRlIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuICBwcml2YXRlIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZ1tdKSA9PiB2b2lkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IGFueSwgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD4pIHtcbiAgICAvLyBmaXggZm9yIHVzaW5nIGRvY3VtZW50IGluIGEgcHVibGlzaGFibGUgbGlicmFyeSBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjUyMjI2MDIvaG93LXRvLWV4cG9ydC1hbmd1bGFyLTEwLWd1YXJkLXVzaW5nLWRvY3VtZW50LWZvci1wdWJsaWMtYXBpXG4gICAgdGhpcy5kb2N1bWVudCA9IDxEb2N1bWVudD5kb2N1bWVudDtcblxuICAgIC8vIGhhbmRsZSBuZ01vZGVsIGFuZCBGb3JtQ250cm9sTmFtZVxuICAgIHRoaXMud3JpdGVWYWx1ZSh0aGlzLnZhbHVlKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGhhbmRsZSBldmVudCBvbmx5IHBsYWNlaG9sZGVyIChpLmUuIG5vIG5nTW9kZWwgb3IgRm9ybUNvbnRyb2xOYW1lKVxuICAgIGlmICh0aGlzLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0UGxhY2Vob2xkZXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tcGJkcy1tdWx0aXBsZS12YWx1ZXMtbWF4LWhlaWdodCcsIGAkeyt0aGlzLm1heGltdW1IZWlnaHR9cHhgKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2lucHV0JykgcHJpdmF0ZSBvbklucHV0KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJykgcHJpdmF0ZSBvbkZvY3VzKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCk7XG4gICAgY29uc3QgcmFuZ2UgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG5cbiAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHModGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICBzZWxlY3Rpb24ucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgc2VsZWN0aW9uLmFkZFJhbmdlKHJhbmdlKTtcblxuICAgIGlmICh0aGlzLnZhbHVlID09PSB0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLnZhbHVlID0gJyc7XG4gICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSBmYWxzZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdibHVyJykgcHJpdmF0ZSBvbkJsdXIoKSB7XG4gICAgdGhpcy5vblRvdWNoZWQoKTtcblxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5jbGVhbih0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MKTtcblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnRvVmFsdWVBcnJheSh2YWx1ZSk7XG4gICAgdGhpcy5vbkNoYW5nZSh2YWx1ZXMpO1xuXG4gICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pIHByaXZhdGUgb25LZXlkb3duKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLnN1Ym1pdE9uRW50ZXIgJiYgKCRldmVudC5rZXkgPT09ICdFbnRlcicgfHwgJGV2ZW50LmNvZGUgPT09ICdFbnRlcicpICYmICEkZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pIHByaXZhdGUgb25LZXl1cCgkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuY2xlYW4odGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCk7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy50b1ZhbHVlQXJyYXkodmFsdWUpO1xuXG4gICAgdGhpcy5vbkNoYW5nZSh2YWx1ZXMpO1xuXG4gICAgaWYgKHRoaXMuc3VibWl0T25FbnRlcikge1xuICAgICAgaWYgKCgkZXZlbnQua2V5ID09PSAnRW50ZXInIHx8ICRldmVudC5jb2RlID09PSAnRW50ZXInKSAmJiAhJGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgICAgIHRoaXMuc3VibWl0LmVtaXQoe1xuICAgICAgICAgIGV2ZW50OiAkZXZlbnQsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlc1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3Bhc3RlJywgWyckZXZlbnQnXSkgcHJpdmF0ZSBvblBhc3RlKCRldmVudCkge1xuICAgIGxldCBwYXN0ZSA9ICRldmVudC5jbGlwYm9hcmREYXRhLmdldERhdGEoJ3RleHQvcGxhaW4nKTtcbiAgICBwYXN0ZSA9IHRoaXMuY2xlYW4ocGFzdGUpO1xuXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRTZWxlY3Rpb24oKTtcblxuICAgIGlmICghc2VsZWN0aW9uLnJhbmdlQ291bnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnZhbHVlID0gcGFzdGU7IC8vIGRvIG5vdCBzZXQgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmlubmVySFRNTCBoZXJlLCB3aWxsIGJyZWFrXG5cbiAgICBzZWxlY3Rpb24uZGVsZXRlRnJvbURvY3VtZW50KCk7XG4gICAgc2VsZWN0aW9uLmdldFJhbmdlQXQoMCkuaW5zZXJ0Tm9kZSh0aGlzLmRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHBhc3RlKSk7XG4gICAgc2VsZWN0aW9uLmNvbGxhcHNlVG9FbmQoKTtcblxuICAgIGNvbnN0IHBhc3RlQXJyID0gdGhpcy50b1ZhbHVlQXJyYXkocGFzdGUpO1xuXG4gICAgdGhpcy5vbkNoYW5nZShwYXN0ZUFycik7XG5cbiAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSBmYWxzZTtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIHByb2dyYW1tYXRpY2FsbHkgd3JpdGluZyB0aGUgdmFsdWVcbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWUuam9pbignXFxuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRQbGFjZWhvbGRlcigpO1xuICB9XG5cbiAgLy8gbWV0aG9kIHRvIGJlIHRyaWdnZXJlZCBvbiBVSSBjaGFuZ2VcbiAgcmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZTogKHZhbHVlOiBzdHJpbmdbXSkgPT4gdm9pZCkge1xuICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcbiAgfVxuXG4gIC8vIG1ldGhvZCB0byBiZSB0cmlnZ2VyZWQgb24gY29tcG9uZW50IHRvdWNoXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZDogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gb25Ub3VjaGVkO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShkaXNhYmxlZDogYm9vbGVhbikge1xuICAgIHRoaXMuY29udGVudEVkaXRhYmxlID0gZGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHZhbHVlc1xuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119IEFycmF5IG9mIHN0cmluZ3NcbiAgICovXG4gIGdldFZhbHVlcygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmNsZWFuKHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwpO1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMudG9WYWx1ZUFycmF5KHZhbHVlKTtcblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIHZhbHVlIHRvIGFuIGVtcHR5IHN0cmluZ1xuICAgKlxuICAgKiBAcmV0dXJucyB2b2lkXG4gICAqL1xuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gJyc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYHZhbHVlYCBpcyAgYW4gZW1wdHkgc3RyaW5nLCBgPGJyPmAgb3IgZXF1YWwgdG8gdGhlIHBsYWNlaG9sZGVyIHRleHQuIElmIG5vdCwgdGhlbiBzZXQgdGhlIHZhbHVlIHRvIHRoZSBwbGFjZWhvbGRlciBhbmQgYXBwbHkgdGhlIHBsYWNlaG9sZGVyIGNsYXNzLlxuICAgKlxuICAgKiBAcmV0dXJucyB2b2lkXG4gICAqL1xuICBwcml2YXRlIHNldFBsYWNlaG9sZGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICBpZiAoIXRoaXMudmFsdWUgfHwgdGhpcy52YWx1ZSA9PT0gJycgfHwgdGhpcy52YWx1ZSA9PT0gJzxicj4nIHx8IHRoaXMudmFsdWUgPT09IHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMucGxhY2Vob2xkZXI7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLnBsYWNlaG9sZGVyO1xuICAgICAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGlubmVySFRNTCBzdHJpbmcgdG8gYW4gYXJyYXkgb2Ygc3RyaW5nc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnQgZWRpdGFibGUgZGl2XG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmdbXX0gQXJyYXkgb2Ygc3RyaW5nc1xuICAgKi9cbiAgcHJpdmF0ZSB0b1ZhbHVlQXJyYXkodmFsdWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB2YWx1ZS5zcGxpdCgvXFxufFxcci8pLmZpbHRlcigodikgPT4gdiAhPT0gJycpO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW4gY2hhcmFjdGVycyBmcm9tIHRoZSBpbm5lckhUTUxcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAtIGlubmVySFRNTCBvZiB0aGUgY29udGVudCBlZGl0YWJsZSBkaXZcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ30gU3RyaW5nIHdpdGggdGhlIGZvbGxvd2luZyByZW1vdmVkOiBkaXZzLCBjb21tYXMsIHNwYWNlcywgdGFicywgZW1wdHkgbGluZXMsIG5vbi1icmVha2luZyBzcGFjZXNcbiAgICovXG4gIHByaXZhdGUgY2xlYW4odmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc29sZS5sb2coJ0lOSVRJQUwgVkFMVUU6ICcsIHZhbHVlKTtcblxuICAgIC8vIGRlbGltZXRlcnNcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5kZWxpbWl0ZXJzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHRoaXMuZGVsaW1pdGVyc1tpbmRleF0sIHRoaXMuZGVsaW1ldGVyc1N3aXRjaGVzKTtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZWdleCwgJ1xcbicpO1xuICAgIH1cblxuICAgIC8vIHJlcGxhY2Ugb3BlbmluZyBkaXZzIHdpdGggZGl2aWRlciBiZWZvcmUgcmVwbGFjZW1lbnRzXG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8oPGRpdj4pL2dtLCAnXFxuJyk7XG5cbiAgICAvLyByZXBsYWNlbWVudHNcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5yZXBsYWNlbWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAodGhpcy5yZXBsYWNlbWVudHNbaW5kZXhdLCB0aGlzLnJlcGxhY2VtZW50c1N3dGljaGVzKTtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZWdleCwgJycpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdDTEVBTkVEIFZBTFVFOiAnLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59XG4iXX0=