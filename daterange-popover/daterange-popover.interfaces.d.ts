import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
export declare type PbdsDaterangePresetValue = number | 'CUSTOM' | 'PREVIOUS_MONTH' | 'YEAR_TO_DATE';
export interface PbdsDaterangePreset {
    label: string;
    value: null | PbdsDaterangePresetValue;
}
export interface PbdsDaterangeFilter {
    field: string;
    label: string;
}
export interface PbdsDaterangeChange {
    fromDate: NgbDate;
    toDate: NgbDate;
    formattedDate: string;
    filter: string;
    value: PbdsDaterangePresetValue;
}
export interface PbdsDaterangeLocale {
    language: string;
    country: string;
    locale: any;
}
