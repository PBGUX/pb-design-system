import { formatDate, FormatWidth, FormStyle, getLocaleDateFormat, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Injectable, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDate, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import * as i0 from "@angular/core";
import * as i1 from "./daterange-popover.service";
import * as i2 from "@ng-bootstrap/ng-bootstrap";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "@angular/cdk/a11y";
import * as i6 from "@angular/material/radio";
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
CustomDatepickerI18n.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CustomDatepickerI18n, deps: [{ token: i1.PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Injectable });
CustomDatepickerI18n.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CustomDatepickerI18n });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: CustomDatepickerI18n, decorators: [{
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
        this.filterChange = new EventEmitter();
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
    openPbdsDateRangePopup() {
        this.datepickerPopup.open();
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
        // console.log('CHANGES: ', changes);
        if (changes.filters && this.filters) {
            this.selectedFilter = this.filters[this.filterSelected];
        }
        if (changes.presets && changes.presets.isFirstChange()) {
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
    onFilterChange($event, filter, index) {
        this.selectedFilter = this.filters[index];
        this.filterChange.emit({
            event: $event,
            filter: filter,
            index: index
        });
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
        else if (typeof value === 'number') {
            const isFuture = Math.sign(value) === -1 ? true : false;
            if (isFuture) {
                this.fromDate = this.calendar.getToday();
                this.toDate = this.calendar.getNext(this.fromDate, 'd', Number(Math.abs(value)));
                this.presetSelected = value;
                this.startDate = this.toDate;
                // console.log('FUTURE: ', this.fromDate, this.toDate, this.presetSelected, this.startDate);
            }
            else {
                this.toDate = this.calendar.getToday();
                this.fromDate = this.calendar.getPrev(this.toDate, 'd', Number(value));
                this.presetSelected = value;
                this.startDate = this.fromDate;
            }
        }
        else {
            this.fromDate = null;
            this.toDate = null;
            this.presetSelected = null;
            this.startDate = null;
        }
    }
}
PbdsDaterangePopoverComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsDaterangePopoverComponent, deps: [{ token: i2.NgbCalendar }, { token: i1.PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Component });
PbdsDaterangePopoverComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: PbdsDaterangePopoverComponent, selector: "pbds-daterange-popover", inputs: { presets: "presets", presetSelected: "presetSelected", filters: "filters", filterSelected: "filterSelected", showCustomPreset: "showCustomPreset", applyText: "applyText", cancelText: "cancelText", container: "container", customRangeText: "customRangeText", displayMonths: "displayMonths", displayInput: "displayInput", minDate: "minDate", maxDate: "maxDate", placement: "placement", fromDate: "fromDate", toDate: "toDate", inputFormat: "inputFormat", ariaLabel: "ariaLabel", ariaLabelSelected: "ariaLabelSelected" }, outputs: { dateChange: "dateChange", filterChange: "filterChange", cancel: "cancel" }, providers: [
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
            multi: true
        }
    ], viewQueries: [{ propertyName: "datepickerPopup", first: true, predicate: ["datepickerPopup"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input *ngIf=\"displayInput\" class=\"form-control\" aria-label=\"Date\" aria-readonly=\"true\" [value]=\"dateRange\" readonly=\"readonly\" tabindex=\"-1\" />\n\n  <div class=\"input-group-append\">\n    <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n  </div>\n</div>\n\n<ng-template #daterangeButton>\n  <button class=\"btn btn-secondary\" type=\"button\" id=\"daterange-button\" #datepickerPopup=\"ngbPopover\" [ngbPopover]=\"daterangeContent\" popoverClass=\"daterange-popover\" autoClose=\"outside\" [container]=\"container\" [placement]=\"placement\" [attr.aria-label]=\"ariaLabel\">\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker #datepicker=\"ngbDatepicker\" [displayMonths]=\"displayMonths\" [minDate]=\"minDate\" [maxDate]=\"maxDate\" navigation=\"select\" outsideDays=\"hidden\" [firstDayOfWeek]=\"firstDayOfWeek\" [showWeekdays]=\"true\" [startDate]=\"startDate\" [dayTemplate]=\"t\" (dateSelect)=\"onDateSelection($event)\">\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span class=\"custom-day\" [class.focused]=\"focused\" [class.range]=\"isRange(date)\" [class.faded]=\"isHovered(date) || isInside(date)\" (mouseenter)=\"hoveredDate = date\" (mouseleave)=\"hoveredDate = null\">\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button class=\"dropdown-item\" type=\"button\" *ngFor=\"let filter of filters; let index = index\" (click)=\"onFilterChange(filter, index)\" (click)=\"onFilterChange($event, filter, index)\" type=\"button\">\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group aria-label=\"Select an option\" class=\"stacked-radio-group\" name=\"presets\" [(ngModel)]=\"presetSelected\" (change)=\"presetSelect($event)\">\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n            }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n        <button type=\"button\" class=\"btn btn-secondary btn-block btn-sm text-nowrap\" *ngFor=\"let preset of presets\" (click)=\"presetClick(preset)\">\n          {{ preset.label }}\n        </button>\n\n        <button type=\"button\" class=\"btn btn-secondary btn-block btn-sm text-nowrap\" *ngIf=\"showCustomPreset\" (click)=\"showDatepicker()\">\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>", dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i5.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "directive", type: i6.MatRadioGroup, selector: "mat-radio-group", exportAs: ["matRadioGroup"] }, { kind: "component", type: i6.MatRadioButton, selector: "mat-radio-button", inputs: ["disableRipple", "tabIndex"], exportAs: ["matRadioButton"] }, { kind: "component", type: i2.NgbDatepicker, selector: "ngb-datepicker", inputs: ["dayTemplate", "dayTemplateData", "displayMonths", "firstDayOfWeek", "footerTemplate", "markDisabled", "maxDate", "minDate", "navigation", "outsideDays", "showWeekNumbers", "startDate", "weekdays"], outputs: ["navigate", "dateSelect"], exportAs: ["ngbDatepicker"] }, { kind: "directive", type: i2.NgbPopover, selector: "[ngbPopover]", inputs: ["animation", "autoClose", "ngbPopover", "popoverTitle", "placement", "triggers", "container", "disablePopover", "popoverClass", "openDelay", "closeDelay"], outputs: ["shown", "hidden"], exportAs: ["ngbPopover"] }, { kind: "directive", type: i2.NgbDropdown, selector: "[ngbDropdown]", inputs: ["autoClose", "dropdownClass", "open", "placement", "container", "display"], outputs: ["openChange"], exportAs: ["ngbDropdown"] }, { kind: "directive", type: i2.NgbDropdownToggle, selector: "[ngbDropdownToggle]" }, { kind: "directive", type: i2.NgbDropdownMenu, selector: "[ngbDropdownMenu]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsDaterangePopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-daterange-popover', providers: [
                        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
                            multi: true
                        }
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input *ngIf=\"displayInput\" class=\"form-control\" aria-label=\"Date\" aria-readonly=\"true\" [value]=\"dateRange\" readonly=\"readonly\" tabindex=\"-1\" />\n\n  <div class=\"input-group-append\">\n    <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n  </div>\n</div>\n\n<ng-template #daterangeButton>\n  <button class=\"btn btn-secondary\" type=\"button\" id=\"daterange-button\" #datepickerPopup=\"ngbPopover\" [ngbPopover]=\"daterangeContent\" popoverClass=\"daterange-popover\" autoClose=\"outside\" [container]=\"container\" [placement]=\"placement\" [attr.aria-label]=\"ariaLabel\">\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker #datepicker=\"ngbDatepicker\" [displayMonths]=\"displayMonths\" [minDate]=\"minDate\" [maxDate]=\"maxDate\" navigation=\"select\" outsideDays=\"hidden\" [firstDayOfWeek]=\"firstDayOfWeek\" [showWeekdays]=\"true\" [startDate]=\"startDate\" [dayTemplate]=\"t\" (dateSelect)=\"onDateSelection($event)\">\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span class=\"custom-day\" [class.focused]=\"focused\" [class.range]=\"isRange(date)\" [class.faded]=\"isHovered(date) || isInside(date)\" (mouseenter)=\"hoveredDate = date\" (mouseleave)=\"hoveredDate = null\">\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button class=\"dropdown-item\" type=\"button\" *ngFor=\"let filter of filters; let index = index\" (click)=\"onFilterChange(filter, index)\" (click)=\"onFilterChange($event, filter, index)\" type=\"button\">\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group aria-label=\"Select an option\" class=\"stacked-radio-group\" name=\"presets\" [(ngModel)]=\"presetSelected\" (change)=\"presetSelect($event)\">\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n            }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n        <button type=\"button\" class=\"btn btn-secondary btn-block btn-sm text-nowrap\" *ngFor=\"let preset of presets\" (click)=\"presetClick(preset)\">\n          {{ preset.label }}\n        </button>\n\n        <button type=\"button\" class=\"btn btn-secondary btn-block btn-sm text-nowrap\" *ngIf=\"showCustomPreset\" (click)=\"showDatepicker()\">\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>" }]
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
            }], filterChange: [{
                type: Output
            }], cancel: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRlcmFuZ2UtcG9wb3Zlci9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGVyYW5nZS1wb3BvdmVyL2RhdGVyYW5nZS1wb3BvdmVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFNBQVMsRUFDVCxtQkFBbUIsRUFDbkIsaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2QixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2pCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixVQUFVLEVBQ1YsS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBZSxPQUFPLEVBQUUsaUJBQWlCLEVBQTZCLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7O0FBV2hILHVFQUF1RTtBQUV2RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsaUJBQWlCO0lBQ3pELFlBQW1CLGdCQUFzQztRQUN2RCxLQUFLLEVBQUUsQ0FBQztRQURTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7SUFFekQsQ0FBQztJQUVELGVBQWUsQ0FBQyxPQUFlO1FBQzdCLHNEQUFzRDtRQUN0RCxPQUFPLEdBQUcsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFdEMsZUFBZTtRQUNmLGlCQUFpQjtRQUNq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QkFETixLQUFLO2dCQUlOLE9BQU87c0JBRE4sS0FBSztnQkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4sUUFBUTtzQkFEUCxLQUFLO2dCQUlOLE1BQU07c0JBREwsS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLGlCQUFpQjtzQkFEaEIsS0FBSztnQkFJTixVQUFVO3NCQURULE1BQU07Z0JBSVAsWUFBWTtzQkFEWCxNQUFNO2dCQUlQLE1BQU07c0JBREwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGZvcm1hdERhdGUsXG4gIEZvcm1hdFdpZHRoLFxuICBGb3JtU3R5bGUsXG4gIGdldExvY2FsZURhdGVGb3JtYXQsXG4gIGdldExvY2FsZURheU5hbWVzLFxuICBnZXRMb2NhbGVGaXJzdERheU9mV2VlayxcbiAgZ2V0TG9jYWxlTW9udGhOYW1lcyxcbiAgVHJhbnNsYXRpb25XaWR0aFxufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3RhYmxlLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTmdiQ2FsZW5kYXIsIE5nYkRhdGUsIE5nYkRhdGVwaWNrZXJJMThuLCBOZ2JEYXRlU3RydWN0LCBOZ2JQb3BvdmVyIH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtcbiAgUGJkc0RhdGVyYW5nZUNoYW5nZSxcbiAgUGJkc0RhdGVyYW5nZUZpbHRlcixcbiAgUGJkc0RhdGVyYW5nZUZpbHRlckNoYW5nZSxcbiAgUGJkc0RhdGVyYW5nZVBsYWNlbWVudCxcbiAgUGJkc0RhdGVyYW5nZVByZXNldCxcbiAgUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlXG59IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQYmRzRGF0ZXJhbmdlU2VydmljZSB9IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZSc7XG5cbi8vIERlZmluZSBjdXN0b20gc2VydmljZSBwcm92aWRpbmcgdGhlIG1vbnRocyBhbmQgd2Vla2RheXMgdHJhbnNsYXRpb25zXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGF0ZXBpY2tlckkxOG4gZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXRXZWVrZGF5TGFiZWwod2Vla2RheTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAvLyBmb3IgbmctYm9vdHN0cmFwLCBzdW5kYXkgbnVtYmVyIG9mIDcgY29udmVydGVkIHRvIDBcbiAgICB3ZWVrZGF5ID0gd2Vla2RheSA9PT0gNyA/IDAgOiB3ZWVrZGF5O1xuXG4gICAgLy8gY29uc29sZS5sb2coXG4gICAgLy8gICAnd2Vla2RheTogJyxcbiAgICAvLyAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksXG4gICAgLy8gICB3ZWVrZGF5LFxuICAgIC8vICAgZ2V0TG9jYWxlRGF5TmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWQpW3dlZWtkYXldXG4gICAgLy8gKTtcblxuICAgIHJldHVybiBnZXRMb2NhbGVEYXlOYW1lcyhcbiAgICAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksXG4gICAgICBGb3JtU3R5bGUuU3RhbmRhbG9uZSxcbiAgICAgIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWRcbiAgICApW3dlZWtkYXldO1xuICB9XG5cbiAgZ2V0TW9udGhTaG9ydE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0TW9udGhGdWxsTmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0TG9jYWxlTW9udGhOYW1lcyh0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5XaWRlKVtcbiAgICAgIG1vbnRoIC0gMVxuICAgIF07XG4gIH1cblxuICBnZXREYXlBcmlhTGFiZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke2RhdGUuZGF5fS0ke2RhdGUubW9udGh9LSR7ZGF0ZS55ZWFyfWA7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRlcmFuZ2UtcG9wb3ZlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogTmdiRGF0ZXBpY2tlckkxOG4sIHVzZUNsYXNzOiBDdXN0b21EYXRlcGlja2VySTE4biB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGJkc0RhdGVyYW5nZVBvcG92ZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF0sXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgQFZpZXdDaGlsZCgnZGF0ZXBpY2tlclBvcHVwJywgeyBzdGF0aWM6IGZhbHNlIH0pIHByaXZhdGUgZGF0ZXBpY2tlclBvcHVwOiBOZ2JQb3BvdmVyO1xuXG4gIEBJbnB1dCgpXG4gIHByZXNldHM6IEFycmF5PFBiZHNEYXRlcmFuZ2VQcmVzZXQ+ID0gW1xuICAgIHtcbiAgICAgIGxhYmVsOiAnQWxsIERhdGVzJyxcbiAgICAgIHZhbHVlOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ0xhc3QgNyBEYXlzJyxcbiAgICAgIHZhbHVlOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ0xhc3QgMzAgRGF5cycsXG4gICAgICB2YWx1ZTogMzBcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnUHJldmlvdXMgTW9udGgnLFxuICAgICAgdmFsdWU6ICdQUkVWSU9VU19NT05USCdcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnWWVhciB0byBEYXRlJyxcbiAgICAgIHZhbHVlOiAnWUVBUl9UT19EQVRFJ1xuICAgIH1cbiAgXTtcblxuICBASW5wdXQoKVxuICBwcmVzZXRTZWxlY3RlZDogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBmaWx0ZXJzOiBBcnJheTxQYmRzRGF0ZXJhbmdlRmlsdGVyPjtcblxuICBASW5wdXQoKVxuICBmaWx0ZXJTZWxlY3RlZCA9IDA7XG5cbiAgQElucHV0KClcbiAgc2hvd0N1c3RvbVByZXNldCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgYXBwbHlUZXh0ID0gJ0FwcGx5JztcblxuICBASW5wdXQoKVxuICBjYW5jZWxUZXh0ID0gJ0NhbmNlbCc7XG5cbiAgQElucHV0KClcbiAgY29udGFpbmVyOiBudWxsIHwgJ2JvZHknID0gJ2JvZHknO1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVJhbmdlVGV4dCA9ICdDdXN0b20gUmFuZ2UnO1xuXG4gIEBJbnB1dCgpXG4gIGRpc3BsYXlNb250aHMgPSAyO1xuXG4gIEBJbnB1dCgpXG4gIGRpc3BsYXlJbnB1dCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgbWluRGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCksICd5Jyk7XG5cbiAgQElucHV0KClcbiAgbWF4RGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKTtcblxuICBASW5wdXQoKVxuICBwbGFjZW1lbnQ6IFBiZHNEYXRlcmFuZ2VQbGFjZW1lbnQgPSAnYm90dG9tLXJpZ2h0IGF1dG8nO1xuXG4gIEBJbnB1dCgpXG4gIGZyb21EYXRlOiBOZ2JEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9EYXRlOiBOZ2JEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgaW5wdXRGb3JtYXQgPSAne2Zyb21EYXRlfSB0byB7dG9EYXRlfSc7XG5cbiAgQElucHV0KClcbiAgYXJpYUxhYmVsID0gJ09wZW4gZGF0ZSBwaWNrZXInO1xuXG4gIEBJbnB1dCgpXG4gIGFyaWFMYWJlbFNlbGVjdGVkID0gJ09wZW4gZGF0ZSBwaWNrZXIsIHNlbGVjdGVkIHJhbmdlIGlzIHtzZWxlY3RlZFJhbmdlfSc7XG5cbiAgQE91dHB1dCgpXG4gIGRhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFBiZHNEYXRlcmFuZ2VDaGFuZ2U+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGZpbHRlckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8UGJkc0RhdGVyYW5nZUZpbHRlckNoYW5nZT4oKTtcblxuICBAT3V0cHV0KClcbiAgY2FuY2VsID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgZmlyc3REYXlPZldlZWsgPSBnZXRMb2NhbGVGaXJzdERheU9mV2Vlayh0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpKTtcblxuICBob3ZlcmVkRGF0ZTogTmdiRGF0ZTtcblxuICBkYXRlUmFuZ2UgPSAnJztcbiAgaXNEYXRlcGlja2VyVmlzaWJsZSA9IGZhbHNlO1xuICBzZWxlY3RlZEZpbHRlcjtcbiAgc3RhcnREYXRlOiBOZ2JEYXRlO1xuICBmb3JtYXR0ZWREYXRlO1xuICBlbWl0VmFsdWU6IFBiZHNEYXRlcmFuZ2VDaGFuZ2U7XG5cbiAgcHJpdmF0ZSBvblRvdWNoZWQ6IGFueSA9ICgpID0+IHt9O1xuICBwcml2YXRlIG9uQ2hhbmdlID0gKG9iajogYW55KSA9PiB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgcHJpdmF0ZSBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge1xuICAgIHRoaXMud3JpdGVWYWx1ZSh0aGlzLmVtaXRWYWx1ZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBjaGluYSBzaG91bGQgc3RhcnQgb24gYSBNb25kYXksIEFuZ3VsYXIgbG9jYWxlIHJldHVybnMgaW5jb3JyZWN0IDBcbiAgICB0aGlzLmZpcnN0RGF5T2ZXZWVrID1cbiAgICAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCkgPT09ICd6aC1jbicgPyB0aGlzLmZpcnN0RGF5T2ZXZWVrICsgMSA6IHRoaXMuZmlyc3REYXlPZldlZWs7XG5cbiAgICBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ0NVU1RPTScpIHtcbiAgICAgIHRoaXMuc2hvd0RhdGVwaWNrZXIoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmVzZXRzKSB7XG4gICAgICBpZiAoIXRoaXMuZmlsdGVycyAmJiB0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0Q2xpY2soXG4gICAgICAgICAgdGhpcy5wcmVzZXRzLmZpbmQoKHAsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPT09IHRoaXMucHJlc2V0U2VsZWN0ZWQ7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkIH0pO1xuICAgICAgICB0aGlzLm9uQXBwbHkoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMub25BcHBseShmYWxzZSk7XG4gIH1cbiAgb3BlblBiZHNEYXRlUmFuZ2VQb3B1cCgpIHtcbiAgICB0aGlzLmRhdGVwaWNrZXJQb3B1cC5vcGVuKCk7XG4gIH1cblxuICAvLyBwcm9ncmFtbWF0aWNhbGx5IHdyaXRpbmcgdGhlIHZhbHVlXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1dSSVRFIFZBTFVFOiAnLCB2YWx1ZSk7XG5cbiAgICAgIGNvbnN0IGZpbHRlckluZGV4ID0gdGhpcy5maWx0ZXJzLmZpbmRJbmRleCgoZmlsdGVyKSA9PiB7XG4gICAgICAgIHJldHVybiBmaWx0ZXIuZmllbGQgPT09IHZhbHVlLmZpbHRlcjtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmZyb21EYXRlID0gdmFsdWUuZnJvbURhdGU7XG4gICAgICB0aGlzLnRvRGF0ZSA9IHZhbHVlLnRvRGF0ZTtcbiAgICAgIHRoaXMuZm9ybWF0dGVkRGF0ZSA9IHZhbHVlLmZvcm1hdHRlZERhdGU7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWUudmFsdWU7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW2ZpbHRlckluZGV4XTtcbiAgICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdDVVNUT00nID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgICB0aGlzLm9uQXBwbHkoKTtcbiAgICB9XG4gIH1cblxuICAvLyBtZXRob2QgdG8gYmUgdHJpZ2dlcmVkIG9uIFVJIGNoYW5nZVxuICByZWdpc3Rlck9uQ2hhbmdlKG9uQ2hhbmdlOiBhbnkpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnT05DSEFOR0U6ICcsIHRoaXMuZW1pdFZhbHVlKTtcbiAgICB0aGlzLm9uQ2hhbmdlID0gb25DaGFuZ2U7XG4gIH1cblxuICAvLyBtZXRob2QgdG8gYmUgdHJpZ2dlcmVkIG9uIGNvbXBvbmVudCB0b3VjaFxuICByZWdpc3Rlck9uVG91Y2hlZChvblRvdWNoZWQ6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IG9uVG91Y2hlZDtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnQ0hBTkdFUzogJywgY2hhbmdlcyk7XG5cbiAgICBpZiAoY2hhbmdlcy5maWx0ZXJzICYmIHRoaXMuZmlsdGVycykge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1t0aGlzLmZpbHRlclNlbGVjdGVkXTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5wcmVzZXRzICYmIGNoYW5nZXMucHJlc2V0cy5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGlmICghdGhpcy5maWx0ZXJzICYmIHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRDbGljayhcbiAgICAgICAgICB0aGlzLnByZXNldHMuZmluZCgocCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZDtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgICAgIHRoaXMub25BcHBseSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIChjaGFuZ2VzLnRvVGV4dCAmJiBjaGFuZ2VzLnRvVGV4dC5maXJzdENoYW5nZSA9PT0gZmFsc2UpIHtcbiAgICAvLyAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICAgIC8vIH1cblxuICAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICB9XG5cbiAgb25BcHBseShzaG91bGRFbWl0ID0gdHJ1ZSkge1xuICAgIC8vIGlmIG9ubHkgYSBDVVNUT00gc3RhcnQgZGF0ZSBpcyBzZWxlY3RlZCwgc2V0IHRoZSBlbmQgZGF0ZSB0byB0aGUgc3RhcnQgZGF0ZSAoaS5lIHNlbGVjdCBhIHNpbmdsZSBkYXkpXG4gICAgaWYgKCF0aGlzLnRvRGF0ZSkge1xuICAgICAgdGhpcy50b0RhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgIH1cblxuICAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuXG4gICAgdGhpcy5lbWl0VmFsdWUgPSB7XG4gICAgICBmcm9tRGF0ZTogdGhpcy5mcm9tRGF0ZSxcbiAgICAgIHRvRGF0ZTogdGhpcy50b0RhdGUsXG4gICAgICBmb3JtYXR0ZWREYXRlOiB0aGlzLmZvcm1hdHRlZERhdGUsXG4gICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0ZWRGaWx0ZXIuZmllbGQgOiBudWxsLFxuICAgICAgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWRcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuXG4gICAgaWYgKHNob3VsZEVtaXQpIHtcbiAgICAgIHRoaXMuZGF0ZUNoYW5nZS5lbWl0KHRoaXMuZW1pdFZhbHVlKTtcblxuICAgICAgdGhpcy5kYXRlcGlja2VyUG9wdXA/LmNsb3NlKCk7XG5cbiAgICAgIHRoaXMuYXJpYUxhYmVsID0gdGhpcy5hcmlhTGFiZWxGb3JtYXQoKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMub25DaGFuZ2UodGhpcy5lbWl0VmFsdWUpLCAwKTtcbiAgfVxuXG4gIG9uQ2FuY2VsKCkge1xuICAgIHRoaXMuZGF0ZXBpY2tlclBvcHVwLmNsb3NlKCk7XG5cbiAgICB0aGlzLmNhbmNlbC5lbWl0KCk7XG4gIH1cblxuICBvbkRhdGVTZWxlY3Rpb24oZGF0ZTogTmdiRGF0ZSkge1xuICAgIGlmICghdGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUpIHtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBkYXRlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUgJiYgZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSkge1xuICAgICAgdGhpcy50b0RhdGUgPSBkYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLmZyb21EYXRlID0gZGF0ZTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIHByZXNldFNlbGVjdCA9ICgkZXZlbnQ6IFBhcnRpYWw8UGJkc0RhdGVyYW5nZVByZXNldD4pID0+IHtcbiAgICBpZiAoJGV2ZW50LnZhbHVlID09PSAnQ1VTVE9NJykge1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9ICdDVVNUT00nO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnNldERhdGVQcm9wZXJ0aWVzKCRldmVudC52YWx1ZSk7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gIH07XG5cbiAgcHJlc2V0Q2xpY2socHJlc2V0OiBQYmRzRGF0ZXJhbmdlUHJlc2V0KSB7XG4gICAgaWYgKHByZXNldCkge1xuICAgICAgaWYgKHByZXNldC52YWx1ZSA9PT0gJ0NVU1RPTScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXREYXRlUHJvcGVydGllcyhwcmVzZXQudmFsdWUpO1xuICAgICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLm9uQXBwbHkoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEZvcm1hdHRlZERhdGUoZGF0ZTogTmdiRGF0ZSkge1xuICAgIGlmIChkYXRlKSB7XG4gICAgICBjb25zdCBsb2NhbGUgPSB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpO1xuICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9IGdldExvY2FsZURhdGVGb3JtYXQobG9jYWxlLCBGb3JtYXRXaWR0aC5TaG9ydCk7XG4gICAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShgJHtkYXRlLm1vbnRofS8ke2RhdGUuZGF5fS8ke2RhdGUueWVhcn1gLCBkYXRlRm9ybWF0LCBsb2NhbGUpO1xuICAgICAgcmV0dXJuIGZvcm1hdHRlZERhdGU7XG4gICAgfVxuICB9XG5cbiAgaXNIb3ZlcmVkID0gKGRhdGU6IE5nYkRhdGUpID0+XG4gICAgdGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUgJiYgdGhpcy5ob3ZlcmVkRGF0ZSAmJiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpICYmIGRhdGUuYmVmb3JlKHRoaXMuaG92ZXJlZERhdGUpO1xuXG4gIGlzSW5zaWRlID0gKGRhdGU6IE5nYkRhdGUpID0+IGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkgJiYgZGF0ZS5iZWZvcmUodGhpcy50b0RhdGUpO1xuXG4gIGlzUmFuZ2UgPSAoZGF0ZTogTmdiRGF0ZSkgPT5cbiAgICBkYXRlLmVxdWFscyh0aGlzLmZyb21EYXRlKSB8fCBkYXRlLmVxdWFscyh0aGlzLnRvRGF0ZSkgfHwgdGhpcy5pc0luc2lkZShkYXRlKSB8fCB0aGlzLmlzSG92ZXJlZChkYXRlKTtcblxuICBzaG93RGF0ZXBpY2tlcigpIHtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6ICdDVVNUT00nIH0pO1xuICB9XG5cbiAgb25GaWx0ZXJDaGFuZ2UoJGV2ZW50OiBFdmVudCwgZmlsdGVyOiBQYmRzRGF0ZXJhbmdlRmlsdGVyLCBpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1tpbmRleF07XG5cbiAgICB0aGlzLmZpbHRlckNoYW5nZS5lbWl0KHtcbiAgICAgIGV2ZW50OiAkZXZlbnQsXG4gICAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICAgIGluZGV4OiBpbmRleFxuICAgIH0pO1xuICB9XG5cbiAgc2V0UHJlc2V0KHZhbHVlOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWUpIHtcbiAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWU7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICB0aGlzLm9uQXBwbHkoKTtcbiAgfVxuXG4gIHNldEZpbHRlcihpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW2luZGV4XTtcbiAgICB9XG4gIH1cblxuICBzZXREYXRlUmFuZ2UodmFsdWUpIHtcbiAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUodmFsdWUuZnJvbURhdGUueWVhciwgdmFsdWUuZnJvbURhdGUubW9udGgsIHZhbHVlLmZyb21EYXRlLmRheSk7XG4gICAgdGhpcy50b0RhdGUgPSBuZXcgTmdiRGF0ZSh2YWx1ZS50b0RhdGUueWVhciwgdmFsdWUudG9EYXRlLm1vbnRoLCB2YWx1ZS50b0RhdGUuZGF5KTtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB2YWx1ZS52YWx1ZSA9PT0gJ0NVU1RPTSc7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlLnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgICAgdGhpcy5maWx0ZXJTZWxlY3RlZCA9IHRoaXMuZmlsdGVycy5maW5kSW5kZXgoKGYpID0+IGYuZmllbGQgPT09IHZhbHVlLmZpbHRlcik7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW3RoaXMuZmlsdGVyU2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIHRoaXMub25BcHBseSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRJbnB1dExhYmVsKCkge1xuICAgIGlmICh0aGlzLnByZXNldHMpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5wcmVzZXRzLmZpbmQoKHApID0+IHAudmFsdWUgPT09IHRoaXMucHJlc2V0U2VsZWN0ZWQpO1xuXG4gICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuZnJvbURhdGUgPT09IG51bGwgfHwgdGhpcy50b0RhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09IG51bGwgfHwgKHRoaXMucHJlc2V0U2VsZWN0ZWQgIT09IG51bGwgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gJ0NVU1RPTScpKSB7XG4gICAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSBzZWxlY3RlZC5sYWJlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdDVVNUT00nICYmIHRoaXMuZnJvbURhdGUgJiYgdGhpcy50b0RhdGUpIHtcbiAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSB0aGlzLmRhdGVGb3JtYXQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZGF0ZVJhbmdlICE9PSAnJykge1xuICAgICAgICB0aGlzLmZvcm1hdHRlZERhdGUgPSB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPyB0aGlzLmRhdGVGb3JtYXQoKSA6IHRoaXMuZGF0ZVJhbmdlO1xuICAgICAgICB0aGlzLmFyaWFMYWJlbCA9IHRoaXMuYXJpYUxhYmVsRm9ybWF0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRlRm9ybWF0KCkge1xuICAgIHJldHVybiB0aGlzLmlucHV0Rm9ybWF0XG4gICAgICAucmVwbGFjZSgne2Zyb21EYXRlfScsIHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSh0aGlzLmZyb21EYXRlKSlcbiAgICAgIC5yZXBsYWNlKCd7dG9EYXRlfScsIHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSh0aGlzLnRvRGF0ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBhcmlhTGFiZWxGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsU2VsZWN0ZWQucmVwbGFjZSgne3NlbGVjdGVkUmFuZ2V9JywgdGhpcy5mb3JtYXR0ZWREYXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGF5c0luTW9udGgoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGdldEZyb21BbmRUb0RhdGVzKHZhbHVlOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWUpOiB7IGZyb206IE5nYkRhdGVTdHJ1Y3Q7IHRvOiBOZ2JEYXRlU3RydWN0IH0ge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgICBjb25zdCBjdXJyZW50RGF5ID0gbm93LmdldERhdGUoKTtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlICdQUkVWSU9VU19NT05USCc6XG4gICAgICAgIGNvbnN0IHllYXIgPSBjdXJyZW50TW9udGggPiAwID8gY3VycmVudFllYXIgOiBjdXJyZW50WWVhciAtIDE7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gY3VycmVudE1vbnRoID4gMCA/IGN1cnJlbnRNb250aCA6IDEyO1xuICAgICAgICBjb25zdCBkYXkgPSAxO1xuICAgICAgICBjb25zdCBsYXN0RGF5ID0gdGhpcy5nZXREYXlzSW5Nb250aCh5ZWFyLCBtb250aCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnJvbTogeyB5ZWFyLCBtb250aCwgZGF5IH0sXG4gICAgICAgICAgdG86IHsgeWVhciwgbW9udGgsIGRheTogbGFzdERheSB9XG4gICAgICAgIH07XG4gICAgICBjYXNlICdZRUFSX1RPX0RBVEUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZyb206IHsgeWVhcjogY3VycmVudFllYXIsIG1vbnRoOiAxLCBkYXk6IDEgfSxcbiAgICAgICAgICB0bzogeyB5ZWFyOiBjdXJyZW50WWVhciwgbW9udGg6IGN1cnJlbnRNb250aCArIDEsIGRheTogY3VycmVudERheSB9XG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geyBmcm9tOiBudWxsLCB0bzogbnVsbCB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0RGF0ZVByb3BlcnRpZXModmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJ1BSRVZJT1VTX01PTlRIJyB8fCB2YWx1ZSA9PT0gJ1lFQVJfVE9fREFURScpIHtcbiAgICAgIGNvbnN0IHsgZnJvbSwgdG8gfSA9IHRoaXMuZ2V0RnJvbUFuZFRvRGF0ZXModmFsdWUpO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IG5ldyBOZ2JEYXRlKGZyb20ueWVhciwgZnJvbS5tb250aCwgZnJvbS5kYXkpO1xuICAgICAgdGhpcy50b0RhdGUgPSBuZXcgTmdiRGF0ZSh0by55ZWFyLCB0by5tb250aCwgdG8uZGF5KTtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5mcm9tRGF0ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbnN0IGlzRnV0dXJlID0gTWF0aC5zaWduKHZhbHVlKSA9PT0gLTEgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgIGlmIChpc0Z1dHVyZSkge1xuICAgICAgICB0aGlzLmZyb21EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgICAgICB0aGlzLnRvRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0TmV4dCh0aGlzLmZyb21EYXRlLCAnZCcsIE51bWJlcihNYXRoLmFicyh2YWx1ZSkpKTtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMudG9EYXRlO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnRlVUVVJFOiAnLCB0aGlzLmZyb21EYXRlLCB0aGlzLnRvRGF0ZSwgdGhpcy5wcmVzZXRTZWxlY3RlZCwgdGhpcy5zdGFydERhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50b0RhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCk7XG4gICAgICAgIHRoaXMuZnJvbURhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFByZXYodGhpcy50b0RhdGUsICdkJywgTnVtYmVyKHZhbHVlKSk7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZyb21EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMudG9EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSBudWxsO1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwIHBiZHMtZGF0ZXJhbmdlLXBvcG92ZXJcIiAqbmdJZj1cImRpc3BsYXlJbnB1dDsgZWxzZSBkYXRlcmFuZ2VCdXR0b25cIj5cbiAgPGlucHV0ICpuZ0lmPVwiZGlzcGxheUlucHV0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBhcmlhLWxhYmVsPVwiRGF0ZVwiIGFyaWEtcmVhZG9ubHk9XCJ0cnVlXCIgW3ZhbHVlXT1cImRhdGVSYW5nZVwiIHJlYWRvbmx5PVwicmVhZG9ubHlcIiB0YWJpbmRleD1cIi0xXCIgLz5cblxuICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImRhdGVyYW5nZUJ1dHRvblwiPjwvbmctY29udGFpbmVyPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG48bmctdGVtcGxhdGUgI2RhdGVyYW5nZUJ1dHRvbj5cbiAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgdHlwZT1cImJ1dHRvblwiIGlkPVwiZGF0ZXJhbmdlLWJ1dHRvblwiICNkYXRlcGlja2VyUG9wdXA9XCJuZ2JQb3BvdmVyXCIgW25nYlBvcG92ZXJdPVwiZGF0ZXJhbmdlQ29udGVudFwiIHBvcG92ZXJDbGFzcz1cImRhdGVyYW5nZS1wb3BvdmVyXCIgYXV0b0Nsb3NlPVwib3V0c2lkZVwiIFtjb250YWluZXJdPVwiY29udGFpbmVyXCIgW3BsYWNlbWVudF09XCJwbGFjZW1lbnRcIiBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbFwiPlxuICAgIDxpIGNsYXNzPVwicGJpLWljb24tbWluaSBwYmktY2FsZW5kYXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XG4gIDwvYnV0dG9uPlxuPC9uZy10ZW1wbGF0ZT5cblxuPG5nLXRlbXBsYXRlICNkYXRlcmFuZ2VDb250ZW50PlxuICA8ZGl2IGNsYXNzPVwiZC1ibG9jayBkLW1kLWZsZXhcIiBjZGtUcmFwRm9jdXMgY2RrVHJhcEZvY3VzQXV0b0NhcHR1cmU+XG4gICAgPGRpdiBbaGlkZGVuXT1cIiFpc0RhdGVwaWNrZXJWaXNpYmxlXCI+XG4gICAgICA8bmdiLWRhdGVwaWNrZXIgI2RhdGVwaWNrZXI9XCJuZ2JEYXRlcGlja2VyXCIgW2Rpc3BsYXlNb250aHNdPVwiZGlzcGxheU1vbnRoc1wiIFttaW5EYXRlXT1cIm1pbkRhdGVcIiBbbWF4RGF0ZV09XCJtYXhEYXRlXCIgbmF2aWdhdGlvbj1cInNlbGVjdFwiIG91dHNpZGVEYXlzPVwiaGlkZGVuXCIgW2ZpcnN0RGF5T2ZXZWVrXT1cImZpcnN0RGF5T2ZXZWVrXCIgW3Nob3dXZWVrZGF5c109XCJ0cnVlXCIgW3N0YXJ0RGF0ZV09XCJzdGFydERhdGVcIiBbZGF5VGVtcGxhdGVdPVwidFwiIChkYXRlU2VsZWN0KT1cIm9uRGF0ZVNlbGVjdGlvbigkZXZlbnQpXCI+XG4gICAgICA8L25nYi1kYXRlcGlja2VyPlxuICAgICAgPCEtLSAgLS0+XG5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjdCBsZXQtZGF0ZSBsZXQtZm9jdXNlZD1cImZvY3VzZWRcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXN0b20tZGF5XCIgW2NsYXNzLmZvY3VzZWRdPVwiZm9jdXNlZFwiIFtjbGFzcy5yYW5nZV09XCJpc1JhbmdlKGRhdGUpXCIgW2NsYXNzLmZhZGVkXT1cImlzSG92ZXJlZChkYXRlKSB8fCBpc0luc2lkZShkYXRlKVwiIChtb3VzZWVudGVyKT1cImhvdmVyZWREYXRlID0gZGF0ZVwiIChtb3VzZWxlYXZlKT1cImhvdmVyZWREYXRlID0gbnVsbFwiPlxuICAgICAgICAgIHt7IGRhdGUuZGF5IH19XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1sZy1iZXR3ZWVuIG10LW1kLTBcIiBbbmdDbGFzc109XCJ7ICdtbC1tZC00JzogaXNEYXRlcGlja2VyVmlzaWJsZSB9XCI+XG4gICAgICA8IS0tIGZpbHRlcnMgLS0+XG4gICAgICA8ZGl2ICpuZ0lmPVwiZmlsdGVycyAmJiBmaWx0ZXJzLmxlbmd0aCA+IDBcIiBjbGFzcz1cIm1iLTNcIiBuZ2JEcm9wZG93bj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc20gYnRuLXNlY29uZGFyeSBidG4tYmxvY2tcIiBpZD1cImRhdGVGaWx0ZXJcIiBuZ2JEcm9wZG93blRvZ2dsZT5cbiAgICAgICAgICB7eyBzZWxlY3RlZEZpbHRlci5sYWJlbCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBuZ2JEcm9wZG93bk1lbnUgYXJpYS1sYWJlbGxlZGJ5PVwiZGF0ZUZpbHRlclwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgdHlwZT1cImJ1dHRvblwiICpuZ0Zvcj1cImxldCBmaWx0ZXIgb2YgZmlsdGVyczsgbGV0IGluZGV4ID0gaW5kZXhcIiAoY2xpY2spPVwib25GaWx0ZXJDaGFuZ2UoZmlsdGVyLCBpbmRleClcIiAoY2xpY2spPVwib25GaWx0ZXJDaGFuZ2UoJGV2ZW50LCBmaWx0ZXIsIGluZGV4KVwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgICAgIHt7IGZpbHRlci5sYWJlbCB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8IS0tIHByZXNldHMgcmFkaW8gYnV0dG9ucy0tPlxuICAgICAgPGRpdiAqbmdJZj1cInByZXNldHMgJiYgZmlsdGVyc1wiIGNsYXNzPVwiZmxleC1ncm93LTFcIj5cbiAgICAgICAgPG1hdC1yYWRpby1ncm91cCBhcmlhLWxhYmVsPVwiU2VsZWN0IGFuIG9wdGlvblwiIGNsYXNzPVwic3RhY2tlZC1yYWRpby1ncm91cFwiIG5hbWU9XCJwcmVzZXRzXCIgWyhuZ01vZGVsKV09XCJwcmVzZXRTZWxlY3RlZFwiIChjaGFuZ2UpPVwicHJlc2V0U2VsZWN0KCRldmVudClcIj5cbiAgICAgICAgICA8bWF0LXJhZGlvLWJ1dHRvbiAqbmdGb3I9XCJsZXQgcHJlc2V0IG9mIHByZXNldHNcIiBbdmFsdWVdPVwicHJlc2V0LnZhbHVlXCI+e3sgcHJlc2V0LmxhYmVsIH19PC9tYXQtcmFkaW8tYnV0dG9uPlxuXG4gICAgICAgICAgPG1hdC1yYWRpby1idXR0b24gKm5nSWY9XCJzaG93Q3VzdG9tUHJlc2V0XCIgW3ZhbHVlXT1cIidDVVNUT00nXCIgKGNoYW5nZSk9XCJzaG93RGF0ZXBpY2tlcigpXCI+e3tcbiAgICAgICAgICAgIGN1c3RvbVJhbmdlVGV4dFxuICAgICAgICAgICAgfX08L21hdC1yYWRpby1idXR0b24+XG4gICAgICAgIDwvbWF0LXJhZGlvLWdyb3VwPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDwhLS0gcHJlc2V0cyBidXR0b25zLS0+XG4gICAgICA8ZGl2ICpuZ0lmPVwicHJlc2V0cyAmJiAhZmlsdGVyc1wiIGNsYXNzPVwiZmxleC1ncm93LTFcIj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBidG4tYmxvY2sgYnRuLXNtIHRleHQtbm93cmFwXCIgKm5nRm9yPVwibGV0IHByZXNldCBvZiBwcmVzZXRzXCIgKGNsaWNrKT1cInByZXNldENsaWNrKHByZXNldClcIj5cbiAgICAgICAgICB7eyBwcmVzZXQubGFiZWwgfX1cbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBidG4tYmxvY2sgYnRuLXNtIHRleHQtbm93cmFwXCIgKm5nSWY9XCJzaG93Q3VzdG9tUHJlc2V0XCIgKGNsaWNrKT1cInNob3dEYXRlcGlja2VyKClcIj5cbiAgICAgICAgICB7eyBjdXN0b21SYW5nZVRleHQgfX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBidXR0b25zIC0tPlxuICAgICAgPGRpdiAqbmdJZj1cImZpbHRlcnMgfHwgaXNEYXRlcGlja2VyVmlzaWJsZVwiIGNsYXNzPVwiZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIG10LTNcIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gbXItMVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwib25BcHBseSgpXCI+XG4gICAgICAgICAge3sgYXBwbHlUZXh0IH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnkgYnRuLXNtIG1sLTFcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cIm9uQ2FuY2VsKClcIj5cbiAgICAgICAgICB7eyBjYW5jZWxUZXh0IH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT4iXX0=