import { OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class PbdsFeedbackRatingComponent implements OnInit, ControlValueAccessor {
    ariaLabels: string[];
    color: boolean;
    onChange: (value: any) => void;
    onTouched: () => void;
    touched: boolean;
    value: any;
    disabled: boolean;
    count: number;
    constructor();
    ngOnInit(): void;
    writeValue(value: number): void;
    registerOnChange(onChange: any): void;
    registerOnTouched(onTouched: any): void;
    setDisabledState(disabled: boolean): void;
    onNewText($event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsFeedbackRatingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsFeedbackRatingComponent, "pbds-feedback-rating", never, { "ariaLabels": "ariaLabels"; "color": "color"; }, {}, never, never, false>;
}
