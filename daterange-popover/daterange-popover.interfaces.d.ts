import { NgbDate, Placement } from '@ng-bootstrap/ng-bootstrap';
export type PbdsDaterangePresetValue = number | 'CUSTOM' | 'PREVIOUS_MONTH' | 'YEAR_TO_DATE';
export type PbdsDaterangePlacement = string | Placement;
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
export interface PbdsDaterangeFilterChange {
    event: Event;
    filter: PbdsDaterangeFilter;
    index: number;
}
export interface PbdsDaterangeLocale {
    language: string;
    country: string;
    locale: any;
}
