import { formatDate, FormatWidth, FormStyle, getLocaleDateFormat, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Injectable, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDate, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import * as i0 from "@angular/core";
import * as i1 from "./daterange-popover.service";
import * as i2 from "@ng-bootstrap/ng-bootstrap";
import * as i3 from "@angular/material/radio";
import * as i4 from "@angular/common";
import * as i5 from "@angular/cdk/a11y";
import * as i6 from "@angular/forms";
// Define custom service providing the months and weekdays translations
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    constructor(daterangeService) {
        super();
        this.daterangeService = daterangeService;
    }
    getWeekdayLabel(weekday) {
        // for ng-bootstrap, sunday number of 7 converted to 0
        weekday = weekday === 7 ? 0 : weekday;
        // console.log(
        //   'weekday: ',
        //   this.daterangeService.getCurrentLocale(),
        //   weekday,
        //   getLocaleDayNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Abbreviated)[weekday]
        // );
        return getLocaleDayNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Abbreviated)[weekday];
    }
    getMonthShortName(month) {
        return getLocaleMonthNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Wide)[month - 1];
    }
    getMonthFullName(month) {
        return getLocaleMonthNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Wide)[month - 1];
    }
    getDayAriaLabel(date) {
        return `${date.day}-${date.month}-${date.year}`;
    }
}
CustomDatepickerI18n.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: CustomDatepickerI18n, deps: [{ token: i1.PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Injectable });
CustomDatepickerI18n.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: CustomDatepickerI18n });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: CustomDatepickerI18n, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.PbdsDaterangeService }]; } });
export class PbdsDaterangePopoverComponent {
    constructor(calendar, daterangeService) {
        this.calendar = calendar;
        this.daterangeService = daterangeService;
        this.presets = [
            {
                label: 'All Dates',
                value: null
            },
            {
                label: 'Last 7 Days',
                value: 7
            },
            {
                label: 'Last 30 Days',
                value: 30
            },
            {
                label: 'Previous Month',
                value: 'PREVIOUS_MONTH'
            },
            {
                label: 'Year to Date',
                value: 'YEAR_TO_DATE'
            }
        ];
        this.presetSelected = null;
        this.filterSelected = 0;
        this.showCustomPreset = true;
        this.applyText = 'Apply';
        this.cancelText = 'Cancel';
        this.container = 'body';
        this.customRangeText = 'Custom Range';
        this.displayMonths = 2;
        this.displayInput = true;
        this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y');
        this.maxDate = this.calendar.getToday();
        this.placement = 'bottom-right auto';
        this.fromDate = null;
        this.toDate = null;
        this.inputFormat = '{fromDate} to {toDate}';
        this.ariaLabel = 'Open date picker';
        this.ariaLabelSelected = 'Open date picker, selected range is {selectedRange}';
        this.dateChange = new EventEmitter();
        this.cancel = new EventEmitter();
        this.firstDayOfWeek = getLocaleFirstDayOfWeek(this.daterangeService.getCurrentLocale());
        this.dateRange = '';
        this.isDatepickerVisible = false;
        this.onTouched = () => { };
        this.onChange = (obj) => { };
        this.presetSelect = ($event) => {
            if ($event.value === 'CUSTOM') {
                this.presetSelected = 'CUSTOM';
                return false;
            }
            this.setDateProperties($event.value);
            this.isDatepickerVisible = false;
        };
        this.isHovered = (date) => this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
        this.isInside = (date) => date.after(this.fromDate) && date.before(this.toDate);
        this.isRange = (date) => date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
        this.writeValue(this.emitValue);
    }
    ngOnInit() {
        // china should start on a Monday, Angular locale returns incorrect 0
        this.firstDayOfWeek =
            this.daterangeService.getCurrentLocale() === 'zh-cn' ? this.firstDayOfWeek + 1 : this.firstDayOfWeek;
        if (this.presetSelected === 'CUSTOM') {
            this.showDatepicker();
        }
        if (this.presets) {
            if (!this.filters && this.presetSelected) {
                this.presetClick(this.presets.find((p, index) => {
                    return index === this.presetSelected;
                }));
            }
            else if (this.presetSelected) {
                this.presetSelect({ value: this.presetSelected });
                this.onApply(false);
            }
        }
        this.onApply(false);
    }
    // programmatically writing the value
    writeValue(value) {
        if (value) {
            // console.log('WRITE VALUE: ', value);
            const filterIndex = this.filters.findIndex((filter) => {
                return filter.field === value.filter;
            });
            this.fromDate = value.fromDate;
            this.toDate = value.toDate;
            this.formattedDate = value.formattedDate;
            this.presetSelected = value.value;
            this.selectedFilter = this.filters[filterIndex];
            this.isDatepickerVisible = this.presetSelected === 'CUSTOM' ? true : false;
            this.onApply();
        }
    }
    // method to be triggered on UI change
    registerOnChange(onChange) {
        // console.log('ONCHANGE: ', this.emitValue);
        this.onChange = onChange;
    }
    // method to be triggered on component touch
    registerOnTouched(onTouched) {
        this.onTouched = onTouched;
    }
    ngOnChanges(changes) {
        if (changes.filters && this.filters) {
            this.selectedFilter = this.filters[this.filterSelected];
        }
        if (changes.presets) {
            if (!this.filters && this.presetSelected) {
                this.presetClick(this.presets.find((p, index) => {
                    return index === this.presetSelected;
                }));
            }
            else if (this.presetSelected) {
                this.presetSelect({ value: this.presetSelected });
                this.onApply();
            }
        }
        // if (changes.toText && changes.toText.firstChange === false) {
        //   this.setInputLabel();
        // }
        this.setInputLabel();
    }
    onApply(shouldEmit = true) {
        // if only a CUSTOM start date is selected, set the end date to the start date (i.e select a single day)
        if (!this.toDate) {
            this.toDate = this.fromDate;
        }
        this.setInputLabel();
        this.emitValue = {
            fromDate: this.fromDate,
            toDate: this.toDate,
            formattedDate: this.formattedDate,
            filter: this.filters && this.filters.length > 0 ? this.selectedFilter.field : null,
            value: this.presetSelected
        };
        this.startDate = this.fromDate;
        if (shouldEmit) {
            this.dateChange.emit(this.emitValue);
            this.datepickerPopup?.close();
            this.ariaLabel = this.ariaLabelFormat();
        }
        setTimeout(() => this.onChange(this.emitValue), 0);
    }
    onCancel() {
        this.datepickerPopup.close();
        this.cancel.emit();
    }
    onDateSelection(date) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        }
        else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        }
        else {
            this.toDate = null;
            this.fromDate = date;
        }
        // this.presetSelected = null;
    }
    presetClick(preset) {
        if (preset) {
            if (preset.value === 'CUSTOM') {
                return false;
            }
            this.setDateProperties(preset.value);
            this.isDatepickerVisible = false;
            this.onApply();
        }
    }
    getFormattedDate(date) {
        if (date) {
            const locale = this.daterangeService.getCurrentLocale();
            const dateFormat = getLocaleDateFormat(locale, FormatWidth.Short);
            const formattedDate = formatDate(`${date.month}/${date.day}/${date.year}`, dateFormat, locale);
            return formattedDate;
        }
    }
    showDatepicker() {
        this.isDatepickerVisible = true;
        this.presetSelect({ value: 'CUSTOM' });
    }
    onFilterChange(filter, index) {
        this.selectedFilter = this.filters[index];
    }
    setPreset(value) {
        this.presetSelected = value;
        this.presetSelect({ value: this.presetSelected });
        this.onApply();
    }
    setFilter(index) {
        if (this.filters !== undefined) {
            this.selectedFilter = this.filters[index];
        }
    }
    setDateRange(value) {
        this.fromDate = new NgbDate(value.fromDate.year, value.fromDate.month, value.fromDate.day);
        this.toDate = new NgbDate(value.toDate.year, value.toDate.month, value.toDate.day);
        this.isDatepickerVisible = value.value === 'CUSTOM';
        this.presetSelected = value.value;
        if (this.filters) {
            this.filterSelected = this.filters.findIndex((f) => f.field === value.filter);
            this.selectedFilter = this.filters[this.filterSelected];
        }
        this.onApply();
    }
    setInputLabel() {
        if (this.presets) {
            const selected = this.presets.find((p) => p.value === this.presetSelected);
            if (selected) {
                if (this.fromDate === null || this.toDate === null) {
                    this.dateRange = selected.label;
                }
                else if (this.presetSelected === null || (this.presetSelected !== null && this.presetSelected !== 'CUSTOM')) {
                    this.dateRange = selected.label;
                }
                else {
                    this.dateRange = this.dateFormat();
                }
            }
            else if (this.presetSelected === 'CUSTOM' && this.fromDate && this.toDate) {
                this.dateRange = this.dateFormat();
            }
            if (this.dateRange !== '') {
                this.formattedDate = this.isDatepickerVisible ? this.dateFormat() : this.dateRange;
                this.ariaLabel = this.ariaLabelFormat();
            }
        }
    }
    dateFormat() {
        return this.inputFormat
            .replace('{fromDate}', this.getFormattedDate(this.fromDate))
            .replace('{toDate}', this.getFormattedDate(this.toDate));
    }
    ariaLabelFormat() {
        return this.ariaLabelSelected.replace('{selectedRange}', this.formattedDate);
    }
    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    getFromAndToDates(value) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
        switch (value) {
            case 'PREVIOUS_MONTH':
                const year = currentMonth > 0 ? currentYear : currentYear - 1;
                const month = currentMonth > 0 ? currentMonth : 12;
                const day = 1;
                const lastDay = this.getDaysInMonth(year, month);
                return {
                    from: { year, month, day },
                    to: { year, month, day: lastDay }
                };
            case 'YEAR_TO_DATE':
                return {
                    from: { year: currentYear, month: 1, day: 1 },
                    to: { year: currentYear, month: currentMonth + 1, day: currentDay }
                };
            default:
                return { from: null, to: null };
        }
    }
    setDateProperties(value) {
        if (value === 'PREVIOUS_MONTH' || value === 'YEAR_TO_DATE') {
            const { from, to } = this.getFromAndToDates(value);
            this.fromDate = new NgbDate(from.year, from.month, from.day);
            this.toDate = new NgbDate(to.year, to.month, to.day);
            this.presetSelected = value;
            this.startDate = this.fromDate;
        }
        else if (value) {
            this.toDate = this.calendar.getToday();
            this.fromDate = this.calendar.getPrev(this.toDate, 'd', Number(value));
            this.presetSelected = value;
            this.startDate = this.fromDate;
        }
        else {
            this.fromDate = null;
            this.toDate = null;
            this.presetSelected = null;
            this.startDate = null;
        }
    }
}
PbdsDaterangePopoverComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: PbdsDaterangePopoverComponent, deps: [{ token: i2.NgbCalendar }, { token: i1.PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Component });
PbdsDaterangePopoverComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.2", type: PbdsDaterangePopoverComponent, selector: "pbds-daterange-popover", inputs: { presets: "presets", presetSelected: "presetSelected", filters: "filters", filterSelected: "filterSelected", showCustomPreset: "showCustomPreset", applyText: "applyText", cancelText: "cancelText", container: "container", customRangeText: "customRangeText", displayMonths: "displayMonths", displayInput: "displayInput", minDate: "minDate", maxDate: "maxDate", placement: "placement", fromDate: "fromDate", toDate: "toDate", inputFormat: "inputFormat", ariaLabel: "ariaLabel", ariaLabelSelected: "ariaLabelSelected" }, outputs: { dateChange: "dateChange", cancel: "cancel" }, providers: [
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
            multi: true
        }
    ], viewQueries: [{ propertyName: "datepickerPopup", first: true, predicate: ["datepickerPopup"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    *ngIf=\"displayInput\"\n    class=\"form-control\"\n    aria-label=\"Date\"\n    aria-readonly=\"true\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n  </div>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    type=\"button\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n    [container]=\"container\"\n    [placement]=\"placement\"\n    [attr.aria-label]=\"ariaLabel\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker=\"ngbDatepicker\"\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (dateSelect)=\"onDateSelection($event)\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            type=\"button\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange(filter, index)\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group\n          aria-label=\"Select an option\"\n          class=\"stacked-radio-group\"\n          name=\"presets\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n", components: [{ type: i2.NgbDatepicker, selector: "ngb-datepicker", inputs: ["dayTemplate", "dayTemplateData", "displayMonths", "firstDayOfWeek", "footerTemplate", "markDisabled", "maxDate", "minDate", "navigation", "outsideDays", "showWeekNumbers", "startDate", "weekdays"], outputs: ["navigate", "dateSelect"], exportAs: ["ngbDatepicker"] }, { type: i3.MatRadioButton, selector: "mat-radio-button", inputs: ["disableRipple", "tabIndex"], exportAs: ["matRadioButton"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i2.NgbPopover, selector: "[ngbPopover]", inputs: ["animation", "autoClose", "ngbPopover", "popoverTitle", "placement", "triggers", "container", "disablePopover", "popoverClass", "openDelay", "closeDelay"], outputs: ["shown", "hidden"], exportAs: ["ngbPopover"] }, { type: i5.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i2.NgbDropdown, selector: "[ngbDropdown]", inputs: ["autoClose", "dropdownClass", "open", "placement", "container", "display"], outputs: ["openChange"], exportAs: ["ngbDropdown"] }, { type: i2.NgbDropdownToggle, selector: "[ngbDropdownToggle]" }, { type: i2.NgbDropdownMenu, selector: "[ngbDropdownMenu]" }, { type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i3.MatRadioGroup, selector: "mat-radio-group", exportAs: ["matRadioGroup"] }, { type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i6.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.2", ngImport: i0, type: PbdsDaterangePopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-daterange-popover', providers: [
                        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
                            multi: true
                        }
                    ], styles: [], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    *ngIf=\"displayInput\"\n    class=\"form-control\"\n    aria-label=\"Date\"\n    aria-readonly=\"true\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n  </div>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    type=\"button\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n    [container]=\"container\"\n    [placement]=\"placement\"\n    [attr.aria-label]=\"ariaLabel\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker=\"ngbDatepicker\"\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (dateSelect)=\"onDateSelection($event)\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            type=\"button\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange(filter, index)\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group\n          aria-label=\"Select an option\"\n          class=\"stacked-radio-group\"\n          name=\"presets\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i2.NgbCalendar }, { type: i1.PbdsDaterangeService }]; }, propDecorators: { datepickerPopup: [{
                type: ViewChild,
                args: ['datepickerPopup', { static: false }]
            }], presets: [{
                type: Input
            }], presetSelected: [{
                type: Input
            }], filters: [{
                type: Input
            }], filterSelected: [{
                type: Input
            }], showCustomPreset: [{
                type: Input
            }], applyText: [{
                type: Input
            }], cancelText: [{
                type: Input
            }], container: [{
                type: Input
            }], customRangeText: [{
                type: Input
            }], displayMonths: [{
                type: Input
            }], displayInput: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], placement: [{
                type: Input
            }], fromDate: [{
                type: Input
            }], toDate: [{
                type: Input
            }], inputFormat: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaLabelSelected: [{
                type: Input
            }], dateChange: [{
                type: Output
            }], cancel: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRlcmFuZ2UtcG9wb3Zlci9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGVyYW5nZS1wb3BvdmVyL2RhdGVyYW5nZS1wb3BvdmVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFNBQVMsRUFDVCxtQkFBbUIsRUFDbkIsaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2QixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2pCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixVQUFVLEVBQ1YsS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBZSxPQUFPLEVBQUUsaUJBQWlCLEVBQTZCLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7O0FBVWhILHVFQUF1RTtBQUV2RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsaUJBQWlCO0lBQ3pELFlBQW1CLGdCQUFzQztRQUN2RCxLQUFLLEVBQUUsQ0FBQztRQURTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7SUFFekQsQ0FBQztJQUVELGVBQWUsQ0FBQyxPQUFlO1FBQzdCLHNEQUFzRDtRQUN0RCxPQUFPLEdBQUcsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFdEMsZUFBZTtRQUNmLGlCQUFpQjtRQUNqQiw4Q0FBOEM7UUFDOUMsYUFBYTtRQUNiLDZIQUE2SDtRQUM3SCxLQUFLO1FBRUwsT0FBTyxpQkFBaUIsQ0FDdEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLEVBQ3hDLFNBQVMsQ0FBQyxVQUFVLEVBQ3BCLGdCQUFnQixDQUFDLFdBQVcsQ0FDN0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxLQUFhO1FBQzdCLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FDL0csS0FBSyxHQUFHLENBQUMsQ0FDVixDQUFDO0lBQ0osQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQWE7UUFDNUIsT0FBTyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUMvRyxLQUFLLEdBQUcsQ0FBQyxDQUNWLENBQUM7SUFDSixDQUFDO0lBRUQsZUFBZSxDQUFDLElBQW1CO1FBQ2pDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2xELENBQUM7O2lIQXJDVSxvQkFBb0I7cUhBQXBCLG9CQUFvQjsyRkFBcEIsb0JBQW9CO2tCQURoQyxVQUFVOztBQXVEWCxNQUFNLE9BQU8sNkJBQTZCO0lBcUd4QyxZQUFvQixRQUFxQixFQUFVLGdCQUFzQztRQUFyRSxhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFzQjtRQWpHekYsWUFBTyxHQUErQjtZQUNwQztnQkFDRSxLQUFLLEVBQUUsV0FBVztnQkFDbEIsS0FBSyxFQUFFLElBQUk7YUFDWjtZQUNEO2dCQUNFLEtBQUssRUFBRSxhQUFhO2dCQUNwQixLQUFLLEVBQUUsQ0FBQzthQUNUO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRSxFQUFFO2FBQ1Y7WUFDRDtnQkFDRSxLQUFLLEVBQUUsZ0JBQWdCO2dCQUN2QixLQUFLLEVBQUUsZ0JBQWdCO2FBQ3hCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRSxjQUFjO2FBQ3RCO1NBQ0YsQ0FBQztRQUdGLG1CQUFjLEdBQTZCLElBQUksQ0FBQztRQU1oRCxtQkFBYyxHQUFHLENBQUMsQ0FBQztRQUduQixxQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFHeEIsY0FBUyxHQUFHLE9BQU8sQ0FBQztRQUdwQixlQUFVLEdBQUcsUUFBUSxDQUFDO1FBR3RCLGNBQVMsR0FBa0IsTUFBTSxDQUFDO1FBR2xDLG9CQUFlLEdBQUcsY0FBYyxDQUFDO1FBR2pDLGtCQUFhLEdBQUcsQ0FBQyxDQUFDO1FBR2xCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBR3BCLFlBQU8sR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBR3hFLFlBQU8sR0FBWSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRzVDLGNBQVMsR0FBMkIsbUJBQW1CLENBQUM7UUFHeEQsYUFBUSxHQUFtQixJQUFJLENBQUM7UUFHaEMsV0FBTSxHQUFtQixJQUFJLENBQUM7UUFHOUIsZ0JBQVcsR0FBRyx3QkFBd0IsQ0FBQztRQUd2QyxjQUFTLEdBQUcsa0JBQWtCLENBQUM7UUFHL0Isc0JBQWlCLEdBQUcscURBQXFELENBQUM7UUFHMUUsZUFBVSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBR3JELFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWpDLG1CQUFjLEdBQUcsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztRQUluRixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2Ysd0JBQW1CLEdBQUcsS0FBSyxDQUFDO1FBTXBCLGNBQVMsR0FBUSxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDMUIsYUFBUSxHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7UUF1SXBDLGlCQUFZLEdBQUcsQ0FBQyxNQUFvQyxFQUFFLEVBQUU7WUFDdEQsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7Z0JBQy9CLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBc0JGLGNBQVMsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFLENBQzVCLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbEgsYUFBUSxHQUFHLENBQUMsSUFBYSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVwRixZQUFPLEdBQUcsQ0FBQyxJQUFhLEVBQUUsRUFBRSxDQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUF2S3RHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxRQUFRO1FBQ04scUVBQXFFO1FBQ3JFLElBQUksQ0FBQyxjQUFjO1lBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFdkcsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFFBQVEsRUFBRTtZQUNwQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDdkI7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtvQkFDN0IsT0FBTyxLQUFLLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQztnQkFDdkMsQ0FBQyxDQUFDLENBQ0gsQ0FBQzthQUNIO2lCQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNyQjtTQUNGO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLFVBQVUsQ0FBQyxLQUFVO1FBQ25CLElBQUksS0FBSyxFQUFFO1lBQ1QsdUNBQXVDO1lBRXZDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ3BELE9BQU8sTUFBTSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUMzQixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7WUFDekMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGNBQWMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRTNFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsZ0JBQWdCLENBQUMsUUFBYTtRQUM1Qiw2Q0FBNkM7UUFDN0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxpQkFBaUIsQ0FBQyxTQUFxQjtRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ25DLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDekQ7UUFFRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtvQkFDN0IsT0FBTyxLQUFLLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQztnQkFDdkMsQ0FBQyxDQUFDLENBQ0gsQ0FBQzthQUNIO2lCQUFNLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2hCO1NBQ0Y7UUFFRCxnRUFBZ0U7UUFDaEUsMEJBQTBCO1FBQzFCLElBQUk7UUFFSixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSTtRQUN2Qix3R0FBd0c7UUFDeEcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQzdCO1FBRUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ2xGLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYztTQUMzQixDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRS9CLElBQUksVUFBVSxFQUFFO1lBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRXJDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDekM7UUFFRCxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFhO1FBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztTQUN0QjthQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDckUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO1FBRUQsOEJBQThCO0lBQ2hDLENBQUM7SUFXRCxXQUFXLENBQUMsTUFBMkI7UUFDckMsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO2dCQUM3QixPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxJQUFhO1FBQ3BDLElBQUksSUFBSSxFQUFFO1lBQ1IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEQsTUFBTSxVQUFVLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsRSxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvRixPQUFPLGFBQWEsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFVRCxjQUFjO1FBQ1osSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGNBQWMsQ0FBQyxNQUFNLEVBQUUsS0FBSztRQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUErQjtRQUN2QyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQWE7UUFDckIsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUM5QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQUs7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUM7UUFDcEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBRWxDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ3pEO1FBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFTyxhQUFhO1FBQ25CLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFM0UsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtvQkFDbEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO2lCQUNqQztxQkFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxRQUFRLENBQUMsRUFBRTtvQkFDN0csSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO2lCQUNqQztxQkFBTTtvQkFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFDcEM7YUFDRjtpQkFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDM0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDcEM7WUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssRUFBRSxFQUFFO2dCQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNuRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzthQUN6QztTQUNGO0lBQ0gsQ0FBQztJQUVPLFVBQVU7UUFDaEIsT0FBTyxJQUFJLENBQUMsV0FBVzthQUNwQixPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDM0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVPLGVBQWU7UUFDckIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRU8sY0FBYyxDQUFDLElBQVksRUFBRSxLQUFhO1FBQ2hELE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRU8saUJBQWlCLENBQUMsS0FBK0I7UUFDdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN2QixNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEMsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqQyxRQUFRLEtBQUssRUFBRTtZQUNiLEtBQUssZ0JBQWdCO2dCQUNuQixNQUFNLElBQUksR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7Z0JBQzlELE1BQU0sS0FBSyxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNuRCxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ2QsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2pELE9BQU87b0JBQ0wsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7b0JBQzFCLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRTtpQkFDbEMsQ0FBQztZQUNKLEtBQUssY0FBYztnQkFDakIsT0FBTztvQkFDTCxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtvQkFDN0MsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsWUFBWSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFO2lCQUNwRSxDQUFDO1lBQ0o7Z0JBQ0UsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVPLGlCQUFpQixDQUFDLEtBQStCO1FBQ3ZELElBQUksS0FBSyxLQUFLLGdCQUFnQixJQUFJLEtBQUssS0FBSyxjQUFjLEVBQUU7WUFDMUQsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDaEM7YUFBTSxJQUFJLEtBQUssRUFBRTtZQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDaEM7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQzs7MEhBbFlVLDZCQUE2Qjs4R0FBN0IsNkJBQTZCLHduQkFYN0I7UUFDVCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUU7UUFDOUQ7WUFDRSxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsNkJBQTZCLENBQUM7WUFDNUQsS0FBSyxFQUFFLElBQUk7U0FDWjtLQUNGLG1LQ3RGSCxrNElBc0lBOzJGRDVDYSw2QkFBNkI7a0JBZHpDLFNBQVM7K0JBQ0Usd0JBQXdCLGFBRXZCO3dCQUNULEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBRTt3QkFDOUQ7NEJBQ0UsT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsOEJBQThCLENBQUM7NEJBQzVELEtBQUssRUFBRSxJQUFJO3lCQUNaO3FCQUNGLFVBQ08sRUFBRSxtQkFDTyx1QkFBdUIsQ0FBQyxNQUFNO3FJQUdVLGVBQWU7c0JBQXZFLFNBQVM7dUJBQUMsaUJBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQUcvQyxPQUFPO3NCQUROLEtBQUs7Z0JBeUJOLGNBQWM7c0JBRGIsS0FBSztnQkFJTixPQUFPO3NCQUROLEtBQUs7Z0JBSU4sY0FBYztzQkFEYixLQUFLO2dCQUlOLGdCQUFnQjtzQkFEZixLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixVQUFVO3NCQURULEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLGVBQWU7c0JBRGQsS0FBSztnQkFJTixhQUFhO3NCQURaLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxLQUFLO2dCQUlOLE9BQU87c0JBRE4sS0FBSztnQkFJTixPQUFPO3NCQUROLEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLFFBQVE7c0JBRFAsS0FBSztnQkFJTixNQUFNO3NCQURMLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixpQkFBaUI7c0JBRGhCLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxNQUFNO2dCQUlQLE1BQU07c0JBREwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGZvcm1hdERhdGUsXG4gIEZvcm1hdFdpZHRoLFxuICBGb3JtU3R5bGUsXG4gIGdldExvY2FsZURhdGVGb3JtYXQsXG4gIGdldExvY2FsZURheU5hbWVzLFxuICBnZXRMb2NhbGVGaXJzdERheU9mV2VlayxcbiAgZ2V0TG9jYWxlTW9udGhOYW1lcyxcbiAgVHJhbnNsYXRpb25XaWR0aFxufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3RhYmxlLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTmdiQ2FsZW5kYXIsIE5nYkRhdGUsIE5nYkRhdGVwaWNrZXJJMThuLCBOZ2JEYXRlU3RydWN0LCBOZ2JQb3BvdmVyIH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtcbiAgUGJkc0RhdGVyYW5nZUNoYW5nZSxcbiAgUGJkc0RhdGVyYW5nZUZpbHRlcixcbiAgUGJkc0RhdGVyYW5nZVBsYWNlbWVudCxcbiAgUGJkc0RhdGVyYW5nZVByZXNldCxcbiAgUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlXG59IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQYmRzRGF0ZXJhbmdlU2VydmljZSB9IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZSc7XG5cbi8vIERlZmluZSBjdXN0b20gc2VydmljZSBwcm92aWRpbmcgdGhlIG1vbnRocyBhbmQgd2Vla2RheXMgdHJhbnNsYXRpb25zXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGF0ZXBpY2tlckkxOG4gZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXRXZWVrZGF5TGFiZWwod2Vla2RheTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAvLyBmb3IgbmctYm9vdHN0cmFwLCBzdW5kYXkgbnVtYmVyIG9mIDcgY29udmVydGVkIHRvIDBcbiAgICB3ZWVrZGF5ID0gd2Vla2RheSA9PT0gNyA/IDAgOiB3ZWVrZGF5O1xuXG4gICAgLy8gY29uc29sZS5sb2coXG4gICAgLy8gICAnd2Vla2RheTogJyxcbiAgICAvLyAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksXG4gICAgLy8gICB3ZWVrZGF5LFxuICAgIC8vICAgZ2V0TG9jYWxlRGF5TmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWQpW3dlZWtkYXldXG4gICAgLy8gKTtcblxuICAgIHJldHVybiBnZXRMb2NhbGVEYXlOYW1lcyhcbiAgICAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksXG4gICAgICBGb3JtU3R5bGUuU3RhbmRhbG9uZSxcbiAgICAgIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWRcbiAgICApW3dlZWtkYXldO1xuICB9XG5cbiAgZ2V0TW9udGhTaG9ydE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0TW9udGhGdWxsTmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0TG9jYWxlTW9udGhOYW1lcyh0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5XaWRlKVtcbiAgICAgIG1vbnRoIC0gMVxuICAgIF07XG4gIH1cblxuICBnZXREYXlBcmlhTGFiZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke2RhdGUuZGF5fS0ke2RhdGUubW9udGh9LSR7ZGF0ZS55ZWFyfWA7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRlcmFuZ2UtcG9wb3ZlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogTmdiRGF0ZXBpY2tlckkxOG4sIHVzZUNsYXNzOiBDdXN0b21EYXRlcGlja2VySTE4biB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGJkc0RhdGVyYW5nZVBvcG92ZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF0sXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgQFZpZXdDaGlsZCgnZGF0ZXBpY2tlclBvcHVwJywgeyBzdGF0aWM6IGZhbHNlIH0pIHByaXZhdGUgZGF0ZXBpY2tlclBvcHVwOiBOZ2JQb3BvdmVyO1xuXG4gIEBJbnB1dCgpXG4gIHByZXNldHM6IEFycmF5PFBiZHNEYXRlcmFuZ2VQcmVzZXQ+ID0gW1xuICAgIHtcbiAgICAgIGxhYmVsOiAnQWxsIERhdGVzJyxcbiAgICAgIHZhbHVlOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ0xhc3QgNyBEYXlzJyxcbiAgICAgIHZhbHVlOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ0xhc3QgMzAgRGF5cycsXG4gICAgICB2YWx1ZTogMzBcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnUHJldmlvdXMgTW9udGgnLFxuICAgICAgdmFsdWU6ICdQUkVWSU9VU19NT05USCdcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnWWVhciB0byBEYXRlJyxcbiAgICAgIHZhbHVlOiAnWUVBUl9UT19EQVRFJ1xuICAgIH1cbiAgXTtcblxuICBASW5wdXQoKVxuICBwcmVzZXRTZWxlY3RlZDogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBmaWx0ZXJzOiBBcnJheTxQYmRzRGF0ZXJhbmdlRmlsdGVyPjtcblxuICBASW5wdXQoKVxuICBmaWx0ZXJTZWxlY3RlZCA9IDA7XG5cbiAgQElucHV0KClcbiAgc2hvd0N1c3RvbVByZXNldCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgYXBwbHlUZXh0ID0gJ0FwcGx5JztcblxuICBASW5wdXQoKVxuICBjYW5jZWxUZXh0ID0gJ0NhbmNlbCc7XG5cbiAgQElucHV0KClcbiAgY29udGFpbmVyOiBudWxsIHwgJ2JvZHknID0gJ2JvZHknO1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVJhbmdlVGV4dCA9ICdDdXN0b20gUmFuZ2UnO1xuXG4gIEBJbnB1dCgpXG4gIGRpc3BsYXlNb250aHMgPSAyO1xuXG4gIEBJbnB1dCgpXG4gIGRpc3BsYXlJbnB1dCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgbWluRGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCksICd5Jyk7XG5cbiAgQElucHV0KClcbiAgbWF4RGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKTtcblxuICBASW5wdXQoKVxuICBwbGFjZW1lbnQ6IFBiZHNEYXRlcmFuZ2VQbGFjZW1lbnQgPSAnYm90dG9tLXJpZ2h0IGF1dG8nO1xuXG4gIEBJbnB1dCgpXG4gIGZyb21EYXRlOiBOZ2JEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9EYXRlOiBOZ2JEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgaW5wdXRGb3JtYXQgPSAne2Zyb21EYXRlfSB0byB7dG9EYXRlfSc7XG5cbiAgQElucHV0KClcbiAgYXJpYUxhYmVsID0gJ09wZW4gZGF0ZSBwaWNrZXInO1xuXG4gIEBJbnB1dCgpXG4gIGFyaWFMYWJlbFNlbGVjdGVkID0gJ09wZW4gZGF0ZSBwaWNrZXIsIHNlbGVjdGVkIHJhbmdlIGlzIHtzZWxlY3RlZFJhbmdlfSc7XG5cbiAgQE91dHB1dCgpXG4gIGRhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFBiZHNEYXRlcmFuZ2VDaGFuZ2U+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGZpcnN0RGF5T2ZXZWVrID0gZ2V0TG9jYWxlRmlyc3REYXlPZldlZWsodGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSk7XG5cbiAgaG92ZXJlZERhdGU6IE5nYkRhdGU7XG5cbiAgZGF0ZVJhbmdlID0gJyc7XG4gIGlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgc2VsZWN0ZWRGaWx0ZXI7XG4gIHN0YXJ0RGF0ZTogTmdiRGF0ZTtcbiAgZm9ybWF0dGVkRGF0ZTtcbiAgZW1pdFZhbHVlOiBQYmRzRGF0ZXJhbmdlQ2hhbmdlO1xuXG4gIHByaXZhdGUgb25Ub3VjaGVkOiBhbnkgPSAoKSA9PiB7fTtcbiAgcHJpdmF0ZSBvbkNoYW5nZSA9IChvYmo6IGFueSkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIHByaXZhdGUgZGF0ZXJhbmdlU2VydmljZTogUGJkc0RhdGVyYW5nZVNlcnZpY2UpIHtcbiAgICB0aGlzLndyaXRlVmFsdWUodGhpcy5lbWl0VmFsdWUpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gY2hpbmEgc2hvdWxkIHN0YXJ0IG9uIGEgTW9uZGF5LCBBbmd1bGFyIGxvY2FsZSByZXR1cm5zIGluY29ycmVjdCAwXG4gICAgdGhpcy5maXJzdERheU9mV2VlayA9XG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpID09PSAnemgtY24nID8gdGhpcy5maXJzdERheU9mV2VlayArIDEgOiB0aGlzLmZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdDVVNUT00nKSB7XG4gICAgICB0aGlzLnNob3dEYXRlcGlja2VyKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJlc2V0cykge1xuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldENsaWNrKFxuICAgICAgICAgIHRoaXMucHJlc2V0cy5maW5kKChwLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09PSB0aGlzLnByZXNldFNlbGVjdGVkO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICAgICAgdGhpcy5vbkFwcGx5KGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9uQXBwbHkoZmFsc2UpO1xuICB9XG5cbiAgLy8gcHJvZ3JhbW1hdGljYWxseSB3cml0aW5nIHRoZSB2YWx1ZVxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdXUklURSBWQUxVRTogJywgdmFsdWUpO1xuXG4gICAgICBjb25zdCBmaWx0ZXJJbmRleCA9IHRoaXMuZmlsdGVycy5maW5kSW5kZXgoKGZpbHRlcikgPT4ge1xuICAgICAgICByZXR1cm4gZmlsdGVyLmZpZWxkID09PSB2YWx1ZS5maWx0ZXI7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5mcm9tRGF0ZSA9IHZhbHVlLmZyb21EYXRlO1xuICAgICAgdGhpcy50b0RhdGUgPSB2YWx1ZS50b0RhdGU7XG4gICAgICB0aGlzLmZvcm1hdHRlZERhdGUgPSB2YWx1ZS5mb3JtYXR0ZWREYXRlO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlLnZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1tmaWx0ZXJJbmRleF07XG4gICAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB0aGlzLnByZXNldFNlbGVjdGVkID09PSAnQ1VTVE9NJyA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgdGhpcy5vbkFwcGx5KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gbWV0aG9kIHRvIGJlIHRyaWdnZXJlZCBvbiBVSSBjaGFuZ2VcbiAgcmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZTogYW55KSB7XG4gICAgLy8gY29uc29sZS5sb2coJ09OQ0hBTkdFOiAnLCB0aGlzLmVtaXRWYWx1ZSk7XG4gICAgdGhpcy5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICB9XG5cbiAgLy8gbWV0aG9kIHRvIGJlIHRyaWdnZXJlZCBvbiBjb21wb25lbnQgdG91Y2hcbiAgcmVnaXN0ZXJPblRvdWNoZWQob25Ub3VjaGVkOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBvblRvdWNoZWQ7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbdGhpcy5maWx0ZXJTZWxlY3RlZF07XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMucHJlc2V0cykge1xuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldENsaWNrKFxuICAgICAgICAgIHRoaXMucHJlc2V0cy5maW5kKChwLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09PSB0aGlzLnByZXNldFNlbGVjdGVkO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICAgICAgdGhpcy5vbkFwcGx5KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgKGNoYW5nZXMudG9UZXh0ICYmIGNoYW5nZXMudG9UZXh0LmZpcnN0Q2hhbmdlID09PSBmYWxzZSkge1xuICAgIC8vICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gIH1cblxuICBvbkFwcGx5KHNob3VsZEVtaXQgPSB0cnVlKSB7XG4gICAgLy8gaWYgb25seSBhIENVU1RPTSBzdGFydCBkYXRlIGlzIHNlbGVjdGVkLCBzZXQgdGhlIGVuZCBkYXRlIHRvIHRoZSBzdGFydCBkYXRlIChpLmUgc2VsZWN0IGEgc2luZ2xlIGRheSlcbiAgICBpZiAoIXRoaXMudG9EYXRlKSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IHRoaXMuZnJvbURhdGU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG5cbiAgICB0aGlzLmVtaXRWYWx1ZSA9IHtcbiAgICAgIGZyb21EYXRlOiB0aGlzLmZyb21EYXRlLFxuICAgICAgdG9EYXRlOiB0aGlzLnRvRGF0ZSxcbiAgICAgIGZvcm1hdHRlZERhdGU6IHRoaXMuZm9ybWF0dGVkRGF0ZSxcbiAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJzICYmIHRoaXMuZmlsdGVycy5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3RlZEZpbHRlci5maWVsZCA6IG51bGwsXG4gICAgICB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZFxuICAgIH07XG5cbiAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZnJvbURhdGU7XG5cbiAgICBpZiAoc2hvdWxkRW1pdCkge1xuICAgICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQodGhpcy5lbWl0VmFsdWUpO1xuXG4gICAgICB0aGlzLmRhdGVwaWNrZXJQb3B1cD8uY2xvc2UoKTtcblxuICAgICAgdGhpcy5hcmlhTGFiZWwgPSB0aGlzLmFyaWFMYWJlbEZvcm1hdCgpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5vbkNoYW5nZSh0aGlzLmVtaXRWYWx1ZSksIDApO1xuICB9XG5cbiAgb25DYW5jZWwoKSB7XG4gICAgdGhpcy5kYXRlcGlja2VyUG9wdXAuY2xvc2UoKTtcblxuICAgIHRoaXMuY2FuY2VsLmVtaXQoKTtcbiAgfVxuXG4gIG9uRGF0ZVNlbGVjdGlvbihkYXRlOiBOZ2JEYXRlKSB7XG4gICAgaWYgKCF0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSkge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IGRhdGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSAmJiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpKSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBkYXRlO1xuICAgIH1cblxuICAgIC8vIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgcHJlc2V0U2VsZWN0ID0gKCRldmVudDogUGFydGlhbDxQYmRzRGF0ZXJhbmdlUHJlc2V0PikgPT4ge1xuICAgIGlmICgkZXZlbnQudmFsdWUgPT09ICdDVVNUT00nKSB7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gJ0NVU1RPTSc7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuc2V0RGF0ZVByb3BlcnRpZXMoJGV2ZW50LnZhbHVlKTtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgfTtcblxuICBwcmVzZXRDbGljayhwcmVzZXQ6IFBiZHNEYXRlcmFuZ2VQcmVzZXQpIHtcbiAgICBpZiAocHJlc2V0KSB7XG4gICAgICBpZiAocHJlc2V0LnZhbHVlID09PSAnQ1VTVE9NJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLnNldERhdGVQcm9wZXJ0aWVzKHByZXNldC52YWx1ZSk7XG4gICAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgICAgIHRoaXMub25BcHBseSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Rm9ybWF0dGVkRGF0ZShkYXRlOiBOZ2JEYXRlKSB7XG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIGNvbnN0IGxvY2FsZSA9IHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCk7XG4gICAgICBjb25zdCBkYXRlRm9ybWF0ID0gZ2V0TG9jYWxlRGF0ZUZvcm1hdChsb2NhbGUsIEZvcm1hdFdpZHRoLlNob3J0KTtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGAke2RhdGUubW9udGh9LyR7ZGF0ZS5kYXl9LyR7ZGF0ZS55ZWFyfWAsIGRhdGVGb3JtYXQsIGxvY2FsZSk7XG4gICAgICByZXR1cm4gZm9ybWF0dGVkRGF0ZTtcbiAgICB9XG4gIH1cblxuICBpc0hvdmVyZWQgPSAoZGF0ZTogTmdiRGF0ZSkgPT5cbiAgICB0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSAmJiB0aGlzLmhvdmVyZWREYXRlICYmIGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkgJiYgZGF0ZS5iZWZvcmUodGhpcy5ob3ZlcmVkRGF0ZSk7XG5cbiAgaXNJbnNpZGUgPSAoZGF0ZTogTmdiRGF0ZSkgPT4gZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSAmJiBkYXRlLmJlZm9yZSh0aGlzLnRvRGF0ZSk7XG5cbiAgaXNSYW5nZSA9IChkYXRlOiBOZ2JEYXRlKSA9PlxuICAgIGRhdGUuZXF1YWxzKHRoaXMuZnJvbURhdGUpIHx8IGRhdGUuZXF1YWxzKHRoaXMudG9EYXRlKSB8fCB0aGlzLmlzSW5zaWRlKGRhdGUpIHx8IHRoaXMuaXNIb3ZlcmVkKGRhdGUpO1xuXG4gIHNob3dEYXRlcGlja2VyKCkge1xuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogJ0NVU1RPTScgfSk7XG4gIH1cblxuICBvbkZpbHRlckNoYW5nZShmaWx0ZXIsIGluZGV4KSB7XG4gICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1tpbmRleF07XG4gIH1cblxuICBzZXRQcmVzZXQodmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSkge1xuICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkIH0pO1xuICAgIHRoaXMub25BcHBseSgpO1xuICB9XG5cbiAgc2V0RmlsdGVyKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5maWx0ZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGVSYW5nZSh2YWx1ZSkge1xuICAgIHRoaXMuZnJvbURhdGUgPSBuZXcgTmdiRGF0ZSh2YWx1ZS5mcm9tRGF0ZS55ZWFyLCB2YWx1ZS5mcm9tRGF0ZS5tb250aCwgdmFsdWUuZnJvbURhdGUuZGF5KTtcbiAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHZhbHVlLnRvRGF0ZS55ZWFyLCB2YWx1ZS50b0RhdGUubW9udGgsIHZhbHVlLnRvRGF0ZS5kYXkpO1xuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IHZhbHVlLnZhbHVlID09PSAnQ1VTVE9NJztcbiAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWUudmFsdWU7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLmZpbHRlclNlbGVjdGVkID0gdGhpcy5maWx0ZXJzLmZpbmRJbmRleCgoZikgPT4gZi5maWVsZCA9PT0gdmFsdWUuZmlsdGVyKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbdGhpcy5maWx0ZXJTZWxlY3RlZF07XG4gICAgfVxuXG4gICAgdGhpcy5vbkFwcGx5KCk7XG4gIH1cblxuICBwcml2YXRlIHNldElucHV0TGFiZWwoKSB7XG4gICAgaWYgKHRoaXMucHJlc2V0cykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLnByZXNldHMuZmluZCgocCkgPT4gcC52YWx1ZSA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZCk7XG5cbiAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICBpZiAodGhpcy5mcm9tRGF0ZSA9PT0gbnVsbCB8fCB0aGlzLnRvRGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gc2VsZWN0ZWQubGFiZWw7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gbnVsbCB8fCAodGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gbnVsbCAmJiB0aGlzLnByZXNldFNlbGVjdGVkICE9PSAnQ1VTVE9NJykpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gdGhpcy5kYXRlRm9ybWF0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ0NVU1RPTScgJiYgdGhpcy5mcm9tRGF0ZSAmJiB0aGlzLnRvRGF0ZSkge1xuICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kYXRlUmFuZ2UgIT09ICcnKSB7XG4gICAgICAgIHRoaXMuZm9ybWF0dGVkRGF0ZSA9IHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA/IHRoaXMuZGF0ZUZvcm1hdCgpIDogdGhpcy5kYXRlUmFuZ2U7XG4gICAgICAgIHRoaXMuYXJpYUxhYmVsID0gdGhpcy5hcmlhTGFiZWxGb3JtYXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGVGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRGb3JtYXRcbiAgICAgIC5yZXBsYWNlKCd7ZnJvbURhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMuZnJvbURhdGUpKVxuICAgICAgLnJlcGxhY2UoJ3t0b0RhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMudG9EYXRlKSk7XG4gIH1cblxuICBwcml2YXRlIGFyaWFMYWJlbEZvcm1hdCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcmlhTGFiZWxTZWxlY3RlZC5yZXBsYWNlKCd7c2VsZWN0ZWRSYW5nZX0nLCB0aGlzLmZvcm1hdHRlZERhdGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXlzSW5Nb250aCh5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnJvbUFuZFRvRGF0ZXModmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSk6IHsgZnJvbTogTmdiRGF0ZVN0cnVjdDsgdG86IE5nYkRhdGVTdHJ1Y3QgfSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICAgIGNvbnN0IGN1cnJlbnREYXkgPSBub3cuZ2V0RGF0ZSgpO1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgJ1BSRVZJT1VTX01PTlRIJzpcbiAgICAgICAgY29uc3QgeWVhciA9IGN1cnJlbnRNb250aCA+IDAgPyBjdXJyZW50WWVhciA6IGN1cnJlbnRZZWFyIC0gMTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjdXJyZW50TW9udGggPiAwID8gY3VycmVudE1vbnRoIDogMTI7XG4gICAgICAgIGNvbnN0IGRheSA9IDE7XG4gICAgICAgIGNvbnN0IGxhc3REYXkgPSB0aGlzLmdldERheXNJbk1vbnRoKHllYXIsIG1vbnRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmcm9tOiB7IHllYXIsIG1vbnRoLCBkYXkgfSxcbiAgICAgICAgICB0bzogeyB5ZWFyLCBtb250aCwgZGF5OiBsYXN0RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGNhc2UgJ1lFQVJfVE9fREFURSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnJvbTogeyB5ZWFyOiBjdXJyZW50WWVhciwgbW9udGg6IDEsIGRheTogMSB9LFxuICAgICAgICAgIHRvOiB7IHllYXI6IGN1cnJlbnRZZWFyLCBtb250aDogY3VycmVudE1vbnRoICsgMSwgZGF5OiBjdXJyZW50RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB7IGZyb206IG51bGwsIHRvOiBudWxsIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXREYXRlUHJvcGVydGllcyh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAnUFJFVklPVVNfTU9OVEgnIHx8IHZhbHVlID09PSAnWUVBUl9UT19EQVRFJykge1xuICAgICAgY29uc3QgeyBmcm9tLCB0byB9ID0gdGhpcy5nZXRGcm9tQW5kVG9EYXRlcyh2YWx1ZSk7XG4gICAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUoZnJvbS55ZWFyLCBmcm9tLm1vbnRoLCBmcm9tLmRheSk7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHRvLnllYXIsIHRvLm1vbnRoLCB0by5kYXkpO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLnRvRGF0ZSwgJ2QnLCBOdW1iZXIodmFsdWUpKTtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5mcm9tRGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cCBwYmRzLWRhdGVyYW5nZS1wb3BvdmVyXCIgKm5nSWY9XCJkaXNwbGF5SW5wdXQ7IGVsc2UgZGF0ZXJhbmdlQnV0dG9uXCI+XG4gIDxpbnB1dFxuICAgICpuZ0lmPVwiZGlzcGxheUlucHV0XCJcbiAgICBjbGFzcz1cImZvcm0tY29udHJvbFwiXG4gICAgYXJpYS1sYWJlbD1cIkRhdGVcIlxuICAgIGFyaWEtcmVhZG9ubHk9XCJ0cnVlXCJcbiAgICBbdmFsdWVdPVwiZGF0ZVJhbmdlXCJcbiAgICByZWFkb25seT1cInJlYWRvbmx5XCJcbiAgICB0YWJpbmRleD1cIi0xXCJcbiAgLz5cblxuICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImRhdGVyYW5nZUJ1dHRvblwiPjwvbmctY29udGFpbmVyPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2RhdGVyYW5nZUJ1dHRvbj5cbiAgPGJ1dHRvblxuICAgIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIlxuICAgIHR5cGU9XCJidXR0b25cIlxuICAgIGlkPVwiZGF0ZXJhbmdlLWJ1dHRvblwiXG4gICAgI2RhdGVwaWNrZXJQb3B1cD1cIm5nYlBvcG92ZXJcIlxuICAgIFtuZ2JQb3BvdmVyXT1cImRhdGVyYW5nZUNvbnRlbnRcIlxuICAgIHBvcG92ZXJDbGFzcz1cImRhdGVyYW5nZS1wb3BvdmVyXCJcbiAgICBhdXRvQ2xvc2U9XCJvdXRzaWRlXCJcbiAgICBbY29udGFpbmVyXT1cImNvbnRhaW5lclwiXG4gICAgW3BsYWNlbWVudF09XCJwbGFjZW1lbnRcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCJcbiAgPlxuICAgIDxpIGNsYXNzPVwicGJpLWljb24tbWluaSBwYmktY2FsZW5kYXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gIDwvYnV0dG9uPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkYXRlcmFuZ2VDb250ZW50PlxuICA8ZGl2IGNsYXNzPVwiZC1ibG9jayBkLW1kLWZsZXhcIiBjZGtUcmFwRm9jdXMgY2RrVHJhcEZvY3VzQXV0b0NhcHR1cmU+XG4gICAgPGRpdiBbaGlkZGVuXT1cIiFpc0RhdGVwaWNrZXJWaXNpYmxlXCI+XG4gICAgICA8bmdiLWRhdGVwaWNrZXJcbiAgICAgICAgI2RhdGVwaWNrZXI9XCJuZ2JEYXRlcGlja2VyXCJcbiAgICAgICAgW2Rpc3BsYXlNb250aHNdPVwiZGlzcGxheU1vbnRoc1wiXG4gICAgICAgIFttaW5EYXRlXT1cIm1pbkRhdGVcIlxuICAgICAgICBbbWF4RGF0ZV09XCJtYXhEYXRlXCJcbiAgICAgICAgbmF2aWdhdGlvbj1cInNlbGVjdFwiXG4gICAgICAgIG91dHNpZGVEYXlzPVwiaGlkZGVuXCJcbiAgICAgICAgW2ZpcnN0RGF5T2ZXZWVrXT1cImZpcnN0RGF5T2ZXZWVrXCJcbiAgICAgICAgW3Nob3dXZWVrZGF5c109XCJ0cnVlXCJcbiAgICAgICAgW3N0YXJ0RGF0ZV09XCJzdGFydERhdGVcIlxuICAgICAgICBbZGF5VGVtcGxhdGVdPVwidFwiXG4gICAgICAgIChkYXRlU2VsZWN0KT1cIm9uRGF0ZVNlbGVjdGlvbigkZXZlbnQpXCJcbiAgICAgID5cbiAgICAgIDwvbmdiLWRhdGVwaWNrZXI+XG4gICAgICA8IS0tICAtLT5cblxuICAgICAgPG5nLXRlbXBsYXRlICN0IGxldC1kYXRlIGxldC1mb2N1c2VkPVwiZm9jdXNlZFwiPlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzPVwiY3VzdG9tLWRheVwiXG4gICAgICAgICAgW2NsYXNzLmZvY3VzZWRdPVwiZm9jdXNlZFwiXG4gICAgICAgICAgW2NsYXNzLnJhbmdlXT1cImlzUmFuZ2UoZGF0ZSlcIlxuICAgICAgICAgIFtjbGFzcy5mYWRlZF09XCJpc0hvdmVyZWQoZGF0ZSkgfHwgaXNJbnNpZGUoZGF0ZSlcIlxuICAgICAgICAgIChtb3VzZWVudGVyKT1cImhvdmVyZWREYXRlID0gZGF0ZVwiXG4gICAgICAgICAgKG1vdXNlbGVhdmUpPVwiaG92ZXJlZERhdGUgPSBudWxsXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt7IGRhdGUuZGF5IH19XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1sZy1iZXR3ZWVuIG10LW1kLTBcIiBbbmdDbGFzc109XCJ7ICdtbC1tZC00JzogaXNEYXRlcGlja2VyVmlzaWJsZSB9XCI+XG4gICAgICA8IS0tIGZpbHRlcnMgLS0+XG4gICAgICA8ZGl2ICpuZ0lmPVwiZmlsdGVycyAmJiBmaWx0ZXJzLmxlbmd0aCA+IDBcIiBjbGFzcz1cIm1iLTNcIiBuZ2JEcm9wZG93bj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeSBidG4tYmxvY2tcIiBpZD1cImRhdGVGaWx0ZXJcIiBuZ2JEcm9wZG93blRvZ2dsZT5cbiAgICAgICAgICB7eyBzZWxlY3RlZEZpbHRlci5sYWJlbCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBuZ2JEcm9wZG93bk1lbnUgYXJpYS1sYWJlbGxlZGJ5PVwiZGF0ZUZpbHRlclwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBmaWx0ZXIgb2YgZmlsdGVyczsgbGV0IGluZGV4ID0gaW5kZXhcIlxuICAgICAgICAgICAgKGNsaWNrKT1cIm9uRmlsdGVyQ2hhbmdlKGZpbHRlciwgaW5kZXgpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7eyBmaWx0ZXIubGFiZWwgfX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBwcmVzZXRzIHJhZGlvIGJ1dHRvbnMtLT5cbiAgICAgIDxkaXYgKm5nSWY9XCJwcmVzZXRzICYmIGZpbHRlcnNcIiBjbGFzcz1cImZsZXgtZ3Jvdy0xXCI+XG4gICAgICAgIDxtYXQtcmFkaW8tZ3JvdXBcbiAgICAgICAgICBhcmlhLWxhYmVsPVwiU2VsZWN0IGFuIG9wdGlvblwiXG4gICAgICAgICAgY2xhc3M9XCJzdGFja2VkLXJhZGlvLWdyb3VwXCJcbiAgICAgICAgICBuYW1lPVwicHJlc2V0c1wiXG4gICAgICAgICAgWyhuZ01vZGVsKV09XCJwcmVzZXRTZWxlY3RlZFwiXG4gICAgICAgICAgKGNoYW5nZSk9XCJwcmVzZXRTZWxlY3QoJGV2ZW50KVwiXG4gICAgICAgID5cbiAgICAgICAgICA8bWF0LXJhZGlvLWJ1dHRvbiAqbmdGb3I9XCJsZXQgcHJlc2V0IG9mIHByZXNldHNcIiBbdmFsdWVdPVwicHJlc2V0LnZhbHVlXCI+e3sgcHJlc2V0LmxhYmVsIH19PC9tYXQtcmFkaW8tYnV0dG9uPlxuXG4gICAgICAgICAgPG1hdC1yYWRpby1idXR0b24gKm5nSWY9XCJzaG93Q3VzdG9tUHJlc2V0XCIgW3ZhbHVlXT1cIidDVVNUT00nXCIgKGNoYW5nZSk9XCJzaG93RGF0ZXBpY2tlcigpXCI+e3tcbiAgICAgICAgICAgIGN1c3RvbVJhbmdlVGV4dFxuICAgICAgICAgIH19PC9tYXQtcmFkaW8tYnV0dG9uPlxuICAgICAgICA8L21hdC1yYWRpby1ncm91cD5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8IS0tIHByZXNldHMgYnV0dG9ucy0tPlxuICAgICAgPGRpdiAqbmdJZj1cInByZXNldHMgJiYgIWZpbHRlcnNcIiBjbGFzcz1cImZsZXgtZ3Jvdy0xXCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1ibG9jayBidG4tc20gdGV4dC1ub3dyYXBcIlxuICAgICAgICAgICpuZ0Zvcj1cImxldCBwcmVzZXQgb2YgcHJlc2V0c1wiXG4gICAgICAgICAgKGNsaWNrKT1cInByZXNldENsaWNrKHByZXNldClcIlxuICAgICAgICA+XG4gICAgICAgICAge3sgcHJlc2V0LmxhYmVsIH19XG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1ibG9jayBidG4tc20gdGV4dC1ub3dyYXBcIlxuICAgICAgICAgICpuZ0lmPVwic2hvd0N1c3RvbVByZXNldFwiXG4gICAgICAgICAgKGNsaWNrKT1cInNob3dEYXRlcGlja2VyKClcIlxuICAgICAgICA+XG4gICAgICAgICAge3sgY3VzdG9tUmFuZ2VUZXh0IH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDwhLS0gYnV0dG9ucyAtLT5cbiAgICAgIDxkaXYgKm5nSWY9XCJmaWx0ZXJzIHx8IGlzRGF0ZXBpY2tlclZpc2libGVcIiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBtdC0zXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXNtIG1yLTFcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cIm9uQXBwbHkoKVwiPlxuICAgICAgICAgIHt7IGFwcGx5VGV4dCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1zbSBtbC0xXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJvbkNhbmNlbCgpXCI+XG4gICAgICAgICAge3sgY2FuY2VsVGV4dCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=