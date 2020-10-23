import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
export interface PbdsDaterangePreset {
    label: string;
    value: null | number;
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
    value: 'custom' | number;
}
export interface PbdsDaterangeLocale {
    language: string;
    country: string;
    locale: any;
}
