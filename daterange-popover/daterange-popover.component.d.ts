import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PbdsDaterangeChange, PbdsDaterangeFilter, PbdsDaterangeFilterChange, PbdsDaterangePlacement, PbdsDaterangePreset, PbdsDaterangePresetValue } from './daterange-popover.interfaces';
import { PbdsDaterangeService } from './daterange-popover.service';
import * as i0 from "@angular/core";
export declare class CustomDatepickerI18n extends NgbDatepickerI18n {
    daterangeService: PbdsDaterangeService;
    constructor(daterangeService: PbdsDaterangeService);
    getWeekdayLabel(weekday: number): string;
    getMonthShortName(month: number): string;
    getMonthFullName(month: number): string;
    getDayAriaLabel(date: NgbDateStruct): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CustomDatepickerI18n, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CustomDatepickerI18n>;
}
export declare class PbdsDaterangePopoverComponent implements OnInit, OnChanges, ControlValueAccessor {
    private calendar;
    private daterangeService;
    private datepickerPopup;
    presets: Array<PbdsDaterangePreset>;
    presetSelected: PbdsDaterangePresetValue;
    filters: Array<PbdsDaterangeFilter>;
    filterSelected: number;
    showCustomPreset: boolean;
    applyText: string;
    cancelText: string;
    container: null | 'body';
    customRangeText: string;
    displayMonths: number;
    displayInput: boolean;
    minDate: NgbDate;
    maxDate: NgbDate;
    placement: PbdsDaterangePlacement;
    fromDate: NgbDate | null;
    toDate: NgbDate | null;
    inputFormat: string;
    ariaLabel: string;
    ariaLabelSelected: string;
    dateChange: EventEmitter<PbdsDaterangeChange>;
    filterChange: EventEmitter<PbdsDaterangeFilterChange>;
    cancel: EventEmitter<any>;
    firstDayOfWeek: import("@angular/common").WeekDay;
    hoveredDate: NgbDate;
    dateRange: string;
    isDatepickerVisible: boolean;
    selectedFilter: any;
    startDate: NgbDate;
    formattedDate: any;
    emitValue: PbdsDaterangeChange;
    canEmit: boolean;
    private onTouched;
    private onChange;
    constructor(calendar: NgbCalendar, daterangeService: PbdsDaterangeService);
    ngOnInit(): void;
    openPbdsDateRangePopup(): void;
    writeValue(value: any): void;
    registerOnChange(onChange: any): void;
    registerOnTouched(onTouched: () => void): void;
    ngOnChanges(changes: SimpleChanges): void;
    onApply(shouldEmit?: boolean): void;
    onCancel(): void;
    onDateSelection(date: NgbDate): void;
    presetSelect: ($event: Partial<PbdsDaterangePreset>) => boolean;
    presetClick(preset: PbdsDaterangePreset): boolean;
    private getFormattedDate;
    isHovered: (date: NgbDate) => boolean;
    isInside: (date: NgbDate) => boolean;
    isRange: (date: NgbDate) => boolean;
    showDatepicker(): void;
    onFilterChange($event: Event, filter: PbdsDaterangeFilter, index: number): void;
    setPreset(value: PbdsDaterangePresetValue): void;
    setFilter(index: number): void;
    setDateRange(value: any): void;
    private setInputLabel;
    private dateFormat;
    private ariaLabelFormat;
    private getDaysInMonth;
    private getFromAndToDates;
    private setDateProperties;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDaterangePopoverComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsDaterangePopoverComponent, "pbds-daterange-popover", never, { "presets": "presets"; "presetSelected": "presetSelected"; "filters": "filters"; "filterSelected": "filterSelected"; "showCustomPreset": "showCustomPreset"; "applyText": "applyText"; "cancelText": "cancelText"; "container": "container"; "customRangeText": "customRangeText"; "displayMonths": "displayMonths"; "displayInput": "displayInput"; "minDate": "minDate"; "maxDate": "maxDate"; "placement": "placement"; "fromDate": "fromDate"; "toDate": "toDate"; "inputFormat": "inputFormat"; "ariaLabel": "ariaLabel"; "ariaLabelSelected": "ariaLabelSelected"; }, { "dateChange": "dateChange"; "filterChange": "filterChange"; "cancel": "cancel"; }, never, never, false, never>;
}
