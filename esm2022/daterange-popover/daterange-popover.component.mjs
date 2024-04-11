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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CustomDatepickerI18n, deps: [{ token: i1.PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CustomDatepickerI18n }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CustomDatepickerI18n, decorators: [{
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
        this.canEmit = true;
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
                    return p.value === this.presetSelected;
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
                    return p.value === this.presetSelected;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDaterangePopoverComponent, deps: [{ token: i2.NgbCalendar }, { token: i1.PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: PbdsDaterangePopoverComponent, selector: "pbds-daterange-popover", inputs: { presets: "presets", presetSelected: "presetSelected", filters: "filters", filterSelected: "filterSelected", showCustomPreset: "showCustomPreset", applyText: "applyText", cancelText: "cancelText", container: "container", customRangeText: "customRangeText", displayMonths: "displayMonths", displayInput: "displayInput", minDate: "minDate", maxDate: "maxDate", placement: "placement", fromDate: "fromDate", toDate: "toDate", inputFormat: "inputFormat", ariaLabel: "ariaLabel", ariaLabelSelected: "ariaLabelSelected" }, outputs: { dateChange: "dateChange", filterChange: "filterChange", cancel: "cancel" }, providers: [
            { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "datepickerPopup", first: true, predicate: ["datepickerPopup"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    class=\"form-control\"\n    *ngIf=\"displayInput\"\n    [value]=\"dateRange\"\n    aria-label=\"Date\"\n    aria-readonly=\"true\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    [placement]=\"placement\"\n    [attr.aria-label]=\"ariaLabel\"\n    type=\"button\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker=\"ngbDatepicker\"\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (dateSelect)=\"onDateSelection($event)\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ms-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div class=\"mb-3\" *ngIf=\"filters && filters.length > 0\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange($event, filter, index)\"\n            type=\"button\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div class=\"flex-grow-1\" *ngIf=\"presets && filters\">\n        <mat-radio-group\n          class=\"stacked-radio-group\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n          aria-label=\"Select an option\"\n          style=\"gap: 4px\"\n          name=\"presets\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div class=\"d-flex flex-column\" *ngIf=\"presets && !filters\" style=\"gap: 4px\">\n        <button\n          class=\"btn btn-secondary btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n          type=\"button\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          class=\"btn btn-secondary btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n          type=\"button\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div class=\"d-flex justify-content-between mt-3\" *ngIf=\"filters || isDatepickerVisible\">\n        <button class=\"btn btn-primary btn-sm me-1\" (click)=\"onApply()\" type=\"button\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ms-1\" (click)=\"onCancel()\" type=\"button\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i5.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "directive", type: i6.MatRadioGroup, selector: "mat-radio-group", exportAs: ["matRadioGroup"] }, { kind: "component", type: i6.MatRadioButton, selector: "mat-radio-button", inputs: ["disableRipple", "tabIndex"], exportAs: ["matRadioButton"] }, { kind: "component", type: i2.NgbDatepicker, selector: "ngb-datepicker", inputs: ["contentTemplate", "dayTemplate", "dayTemplateData", "displayMonths", "firstDayOfWeek", "footerTemplate", "markDisabled", "maxDate", "minDate", "navigation", "outsideDays", "showWeekNumbers", "startDate", "weekdays"], outputs: ["navigate", "dateSelect"], exportAs: ["ngbDatepicker"] }, { kind: "directive", type: i2.NgbPopover, selector: "[ngbPopover]", inputs: ["animation", "autoClose", "ngbPopover", "popoverTitle", "placement", "popperOptions", "triggers", "positionTarget", "container", "disablePopover", "popoverClass", "popoverContext", "openDelay", "closeDelay"], outputs: ["shown", "hidden"], exportAs: ["ngbPopover"] }, { kind: "directive", type: i2.NgbDropdown, selector: "[ngbDropdown]", inputs: ["autoClose", "dropdownClass", "open", "placement", "popperOptions", "container", "display"], outputs: ["openChange"], exportAs: ["ngbDropdown"] }, { kind: "directive", type: i2.NgbDropdownToggle, selector: "[ngbDropdownToggle]" }, { kind: "directive", type: i2.NgbDropdownMenu, selector: "[ngbDropdownMenu]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: PbdsDaterangePopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-daterange-popover', providers: [
                        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
                            multi: true
                        }
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    class=\"form-control\"\n    *ngIf=\"displayInput\"\n    [value]=\"dateRange\"\n    aria-label=\"Date\"\n    aria-readonly=\"true\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    [placement]=\"placement\"\n    [attr.aria-label]=\"ariaLabel\"\n    type=\"button\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker=\"ngbDatepicker\"\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (dateSelect)=\"onDateSelection($event)\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ms-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div class=\"mb-3\" *ngIf=\"filters && filters.length > 0\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange($event, filter, index)\"\n            type=\"button\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div class=\"flex-grow-1\" *ngIf=\"presets && filters\">\n        <mat-radio-group\n          class=\"stacked-radio-group\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n          aria-label=\"Select an option\"\n          style=\"gap: 4px\"\n          name=\"presets\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div class=\"d-flex flex-column\" *ngIf=\"presets && !filters\" style=\"gap: 4px\">\n        <button\n          class=\"btn btn-secondary btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n          type=\"button\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          class=\"btn btn-secondary btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n          type=\"button\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div class=\"d-flex justify-content-between mt-3\" *ngIf=\"filters || isDatepickerVisible\">\n        <button class=\"btn btn-primary btn-sm me-1\" (click)=\"onApply()\" type=\"button\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ms-1\" (click)=\"onCancel()\" type=\"button\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRlcmFuZ2UtcG9wb3Zlci9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGVyYW5nZS1wb3BvdmVyL2RhdGVyYW5nZS1wb3BvdmVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFNBQVMsRUFDVCxtQkFBbUIsRUFDbkIsaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2QixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2pCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixVQUFVLEVBQ1YsS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBZSxPQUFPLEVBQUUsaUJBQWlCLEVBQTZCLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7O0FBV2hILHVFQUF1RTtBQUV2RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsaUJBQWlCO0lBQ3pELFlBQW1CLGdCQUFzQztRQUN2RCxLQUFLLEVBQUUsQ0FBQztRQURTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7SUFFekQsQ0FBQztJQUVELGVBQWUsQ0FBQyxPQUFlO1FBQzdCLHNEQUFzRDtRQUN0RCxPQUFPLEdBQUcsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFdEMsZUFBZTtRQUNmLGlCQUFpQjtRQUNq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QUFhO3NCQURaLEtBQUs7Z0JBSU4sWUFBWTtzQkFEWCxLQUFLO2dCQUlOLE9BQU87c0JBRE4sS0FBSztnQkFJTixPQUFPO3NCQUROLEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLFFBQVE7c0JBRFAsS0FBSztnQkFJTixNQUFNO3NCQURMLEtBQUs7Z0JBSU4sV0FBVztzQkFEVixLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixpQkFBaUI7c0JBRGhCLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxNQUFNO2dCQUlQLFlBQVk7c0JBRFgsTUFBTTtnQkFJUCxNQUFNO3NCQURMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBmb3JtYXREYXRlLFxuICBGb3JtYXRXaWR0aCxcbiAgRm9ybVN0eWxlLFxuICBnZXRMb2NhbGVEYXRlRm9ybWF0LFxuICBnZXRMb2NhbGVEYXlOYW1lcyxcbiAgZ2V0TG9jYWxlRmlyc3REYXlPZldlZWssXG4gIGdldExvY2FsZU1vbnRoTmFtZXMsXG4gIFRyYW5zbGF0aW9uV2lkdGhcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE5nYkNhbGVuZGFyLCBOZ2JEYXRlLCBOZ2JEYXRlcGlja2VySTE4biwgTmdiRGF0ZVN0cnVjdCwgTmdiUG9wb3ZlciB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcbmltcG9ydCB7XG4gIFBiZHNEYXRlcmFuZ2VDaGFuZ2UsXG4gIFBiZHNEYXRlcmFuZ2VGaWx0ZXIsXG4gIFBiZHNEYXRlcmFuZ2VGaWx0ZXJDaGFuZ2UsXG4gIFBiZHNEYXRlcmFuZ2VQbGFjZW1lbnQsXG4gIFBiZHNEYXRlcmFuZ2VQcmVzZXQsXG4gIFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZVxufSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgUGJkc0RhdGVyYW5nZVNlcnZpY2UgfSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyLnNlcnZpY2UnO1xuXG4vLyBEZWZpbmUgY3VzdG9tIHNlcnZpY2UgcHJvdmlkaW5nIHRoZSBtb250aHMgYW5kIHdlZWtkYXlzIHRyYW5zbGF0aW9uc1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEN1c3RvbURhdGVwaWNrZXJJMThuIGV4dGVuZHMgTmdiRGF0ZXBpY2tlckkxOG4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0ZXJhbmdlU2VydmljZTogUGJkc0RhdGVyYW5nZVNlcnZpY2UpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgZ2V0V2Vla2RheUxhYmVsKHdlZWtkYXk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gZm9yIG5nLWJvb3RzdHJhcCwgc3VuZGF5IG51bWJlciBvZiA3IGNvbnZlcnRlZCB0byAwXG4gICAgd2Vla2RheSA9IHdlZWtkYXkgPT09IDcgPyAwIDogd2Vla2RheTtcblxuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3dlZWtkYXk6ICcsXG4gICAgLy8gICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgIC8vICAgd2Vla2RheSxcbiAgICAvLyAgIGdldExvY2FsZURheU5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkKVt3ZWVrZGF5XVxuICAgIC8vICk7XG5cbiAgICByZXR1cm4gZ2V0TG9jYWxlRGF5TmFtZXMoXG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgICAgRm9ybVN0eWxlLlN0YW5kYWxvbmUsXG4gICAgICBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkXG4gICAgKVt3ZWVrZGF5XTtcbiAgfVxuXG4gIGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBnZXRMb2NhbGVNb250aE5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLldpZGUpW1xuICAgICAgbW9udGggLSAxXG4gICAgXTtcbiAgfVxuXG4gIGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtkYXRlLmRheX0tJHtkYXRlLm1vbnRofS0ke2RhdGUueWVhcn1gO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0ZXJhbmdlLXBvcG92ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE5nYkRhdGVwaWNrZXJJMThuLCB1c2VDbGFzczogQ3VzdG9tRGF0ZXBpY2tlckkxOG4gfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0ZXJhbmdlUG9wb3ZlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBWaWV3Q2hpbGQoJ2RhdGVwaWNrZXJQb3B1cCcsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIGRhdGVwaWNrZXJQb3B1cDogTmdiUG9wb3ZlcjtcblxuICBASW5wdXQoKVxuICBwcmVzZXRzOiBBcnJheTxQYmRzRGF0ZXJhbmdlUHJlc2V0PiA9IFtcbiAgICB7XG4gICAgICBsYWJlbDogJ0FsbCBEYXRlcycsXG4gICAgICB2YWx1ZTogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdMYXN0IDcgRGF5cycsXG4gICAgICB2YWx1ZTogN1xuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdMYXN0IDMwIERheXMnLFxuICAgICAgdmFsdWU6IDMwXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ1ByZXZpb3VzIE1vbnRoJyxcbiAgICAgIHZhbHVlOiAnUFJFVklPVVNfTU9OVEgnXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ1llYXIgdG8gRGF0ZScsXG4gICAgICB2YWx1ZTogJ1lFQVJfVE9fREFURSdcbiAgICB9XG4gIF07XG5cbiAgQElucHV0KClcbiAgcHJlc2V0U2VsZWN0ZWQ6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgZmlsdGVyczogQXJyYXk8UGJkc0RhdGVyYW5nZUZpbHRlcj47XG5cbiAgQElucHV0KClcbiAgZmlsdGVyU2VsZWN0ZWQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHNob3dDdXN0b21QcmVzZXQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGFwcGx5VGV4dCA9ICdBcHBseSc7XG5cbiAgQElucHV0KClcbiAgY2FuY2VsVGV4dCA9ICdDYW5jZWwnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbnRhaW5lcjogbnVsbCB8ICdib2R5JyA9ICdib2R5JztcblxuICBASW5wdXQoKVxuICBjdXN0b21SYW5nZVRleHQgPSAnQ3VzdG9tIFJhbmdlJztcblxuICBASW5wdXQoKVxuICBkaXNwbGF5TW9udGhzID0gMjtcblxuICBASW5wdXQoKVxuICBkaXNwbGF5SW5wdXQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIG1pbkRhdGU6IE5nYkRhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFByZXYodGhpcy5jYWxlbmRhci5nZXRUb2RheSgpLCAneScpO1xuXG4gIEBJbnB1dCgpXG4gIG1heERhdGU6IE5nYkRhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCk7XG5cbiAgQElucHV0KClcbiAgcGxhY2VtZW50OiBQYmRzRGF0ZXJhbmdlUGxhY2VtZW50ID0gJ2JvdHRvbS1yaWdodCBhdXRvJztcblxuICBASW5wdXQoKVxuICBmcm9tRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGlucHV0Rm9ybWF0ID0gJ3tmcm9tRGF0ZX0gdG8ge3RvRGF0ZX0nO1xuXG4gIEBJbnB1dCgpXG4gIGFyaWFMYWJlbCA9ICdPcGVuIGRhdGUgcGlja2VyJztcblxuICBASW5wdXQoKVxuICBhcmlhTGFiZWxTZWxlY3RlZCA9ICdPcGVuIGRhdGUgcGlja2VyLCBzZWxlY3RlZCByYW5nZSBpcyB7c2VsZWN0ZWRSYW5nZX0nO1xuXG4gIEBPdXRwdXQoKVxuICBkYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYmRzRGF0ZXJhbmdlQ2hhbmdlPigpO1xuXG4gIEBPdXRwdXQoKVxuICBmaWx0ZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFBiZHNEYXRlcmFuZ2VGaWx0ZXJDaGFuZ2U+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGZpcnN0RGF5T2ZXZWVrID0gZ2V0TG9jYWxlRmlyc3REYXlPZldlZWsodGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSk7XG5cbiAgaG92ZXJlZERhdGU6IE5nYkRhdGU7XG5cbiAgZGF0ZVJhbmdlID0gJyc7XG4gIGlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgc2VsZWN0ZWRGaWx0ZXI7XG4gIHN0YXJ0RGF0ZTogTmdiRGF0ZTtcbiAgZm9ybWF0dGVkRGF0ZTtcbiAgZW1pdFZhbHVlOiBQYmRzRGF0ZXJhbmdlQ2hhbmdlO1xuICBjYW5FbWl0OiBib29sZWFuID0gdHJ1ZTtcbiAgcHJpdmF0ZSBvblRvdWNoZWQ6IGFueSA9ICgpID0+IHt9O1xuICBwcml2YXRlIG9uQ2hhbmdlID0gKG9iajogYW55KSA9PiB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgcHJpdmF0ZSBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge1xuICAgIHRoaXMud3JpdGVWYWx1ZSh0aGlzLmVtaXRWYWx1ZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBjaGluYSBzaG91bGQgc3RhcnQgb24gYSBNb25kYXksIEFuZ3VsYXIgbG9jYWxlIHJldHVybnMgaW5jb3JyZWN0IDBcbiAgICB0aGlzLmZpcnN0RGF5T2ZXZWVrID1cbiAgICAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCkgPT09ICd6aC1jbicgPyB0aGlzLmZpcnN0RGF5T2ZXZWVrICsgMSA6IHRoaXMuZmlyc3REYXlPZldlZWs7XG5cbiAgICBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ0NVU1RPTScpIHtcbiAgICAgIHRoaXMuc2hvd0RhdGVwaWNrZXIoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmVzZXRzKSB7XG4gICAgICBpZiAoIXRoaXMuZmlsdGVycyAmJiB0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0Q2xpY2soXG4gICAgICAgICAgdGhpcy5wcmVzZXRzLmZpbmQoKHAsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcC52YWx1ZSA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZDtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG5cbiAgICAgICAgdGhpcy5vbkFwcGx5KGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5vbkFwcGx5KGZhbHNlKTtcbiAgfVxuICBvcGVuUGJkc0RhdGVSYW5nZVBvcHVwKCkge1xuICAgIHRoaXMuZGF0ZXBpY2tlclBvcHVwLm9wZW4oKTtcbiAgfVxuXG4gIC8vIHByb2dyYW1tYXRpY2FsbHkgd3JpdGluZyB0aGUgdmFsdWVcbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnV1JJVEUgVkFMVUU6ICcsIHZhbHVlKTtcblxuICAgICAgY29uc3QgZmlsdGVySW5kZXggPSB0aGlzLmZpbHRlcnMuZmluZEluZGV4KChmaWx0ZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIGZpbHRlci5maWVsZCA9PT0gdmFsdWUuZmlsdGVyO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZnJvbURhdGUgPSB2YWx1ZS5mcm9tRGF0ZTtcbiAgICAgIHRoaXMudG9EYXRlID0gdmFsdWUudG9EYXRlO1xuICAgICAgdGhpcy5mb3JtYXR0ZWREYXRlID0gdmFsdWUuZm9ybWF0dGVkRGF0ZTtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZS52YWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbZmlsdGVySW5kZXhdO1xuICAgICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gdGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ0NVU1RPTScgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgIHRoaXMub25BcHBseSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1ldGhvZCB0byBiZSB0cmlnZ2VyZWQgb24gVUkgY2hhbmdlXG4gIHJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2U6IGFueSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdPTkNIQU5HRTogJywgdGhpcy5lbWl0VmFsdWUpO1xuICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcbiAgfVxuXG4gIC8vIG1ldGhvZCB0byBiZSB0cmlnZ2VyZWQgb24gY29tcG9uZW50IHRvdWNoXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZDogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gb25Ub3VjaGVkO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIGNvbnNvbGUubG9nKCdDSEFOR0VTOiAnLCBjaGFuZ2VzKTtcblxuICAgIGlmIChjaGFuZ2VzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW3RoaXMuZmlsdGVyU2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnByZXNldHMgJiYgY2hhbmdlcy5wcmVzZXRzLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldENsaWNrKFxuICAgICAgICAgIHRoaXMucHJlc2V0cy5maW5kKChwLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHAudmFsdWUgPT09IHRoaXMucHJlc2V0U2VsZWN0ZWQ7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkIH0pO1xuICAgICAgICB0aGlzLm9uQXBwbHkoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiAoY2hhbmdlcy50b1RleHQgJiYgY2hhbmdlcy50b1RleHQuZmlyc3RDaGFuZ2UgPT09IGZhbHNlKSB7XG4gICAgLy8gICB0aGlzLnNldElucHV0TGFiZWwoKTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnNldElucHV0TGFiZWwoKTtcbiAgfVxuXG4gIG9uQXBwbHkoc2hvdWxkRW1pdCA9IHRydWUpIHtcbiAgICAvLyBpZiBvbmx5IGEgQ1VTVE9NIHN0YXJ0IGRhdGUgaXMgc2VsZWN0ZWQsIHNldCB0aGUgZW5kIGRhdGUgdG8gdGhlIHN0YXJ0IGRhdGUgKGkuZSBzZWxlY3QgYSBzaW5nbGUgZGF5KVxuICAgIGlmICghdGhpcy50b0RhdGUpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5mcm9tRGF0ZTtcbiAgICB9XG5cbiAgICB0aGlzLnNldElucHV0TGFiZWwoKTtcblxuICAgIHRoaXMuZW1pdFZhbHVlID0ge1xuICAgICAgZnJvbURhdGU6IHRoaXMuZnJvbURhdGUsXG4gICAgICB0b0RhdGU6IHRoaXMudG9EYXRlLFxuICAgICAgZm9ybWF0dGVkRGF0ZTogdGhpcy5mb3JtYXR0ZWREYXRlLFxuICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzLmxlbmd0aCA+IDAgPyB0aGlzLnNlbGVjdGVkRmlsdGVyLmZpZWxkIDogbnVsbCxcbiAgICAgIHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkXG4gICAgfTtcblxuICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5mcm9tRGF0ZTtcblxuICAgIGlmIChzaG91bGRFbWl0KSB7XG4gICAgICB0aGlzLmRhdGVDaGFuZ2UuZW1pdCh0aGlzLmVtaXRWYWx1ZSk7XG5cbiAgICAgIHRoaXMuZGF0ZXBpY2tlclBvcHVwPy5jbG9zZSgpO1xuXG4gICAgICB0aGlzLmFyaWFMYWJlbCA9IHRoaXMuYXJpYUxhYmVsRm9ybWF0KCk7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm9uQ2hhbmdlKHRoaXMuZW1pdFZhbHVlKSwgMCk7XG4gIH1cblxuICBvbkNhbmNlbCgpIHtcbiAgICB0aGlzLmRhdGVwaWNrZXJQb3B1cC5jbG9zZSgpO1xuXG4gICAgdGhpcy5jYW5jZWwuZW1pdCgpO1xuICB9XG5cbiAgb25EYXRlU2VsZWN0aW9uKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBpZiAoIXRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlKSB7XG4gICAgICB0aGlzLmZyb21EYXRlID0gZGF0ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlICYmIGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gZGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b0RhdGUgPSBudWxsO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IGRhdGU7XG4gICAgfVxuXG4gICAgLy8gdGhpcy5wcmVzZXRTZWxlY3RlZCA9IG51bGw7XG4gIH1cblxuICBwcmVzZXRTZWxlY3QgPSAoJGV2ZW50OiBQYXJ0aWFsPFBiZHNEYXRlcmFuZ2VQcmVzZXQ+KSA9PiB7XG4gICAgaWYgKCRldmVudC52YWx1ZSA9PT0gJ0NVU1RPTScpIHtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSAnQ1VTVE9NJztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zZXREYXRlUHJvcGVydGllcygkZXZlbnQudmFsdWUpO1xuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IGZhbHNlO1xuICB9O1xuXG4gIHByZXNldENsaWNrKHByZXNldDogUGJkc0RhdGVyYW5nZVByZXNldCkge1xuICAgIGlmIChwcmVzZXQpIHtcbiAgICAgIGlmIChwcmVzZXQudmFsdWUgPT09ICdDVVNUT00nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RGF0ZVByb3BlcnRpZXMocHJlc2V0LnZhbHVlKTtcbiAgICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy5vbkFwcGx5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGb3JtYXR0ZWREYXRlKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBpZiAoZGF0ZSkge1xuICAgICAgY29uc3QgbG9jYWxlID0gdGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKTtcbiAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSBnZXRMb2NhbGVEYXRlRm9ybWF0KGxvY2FsZSwgRm9ybWF0V2lkdGguU2hvcnQpO1xuICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoYCR7ZGF0ZS5tb250aH0vJHtkYXRlLmRheX0vJHtkYXRlLnllYXJ9YCwgZGF0ZUZvcm1hdCwgbG9jYWxlKTtcbiAgICAgIHJldHVybiBmb3JtYXR0ZWREYXRlO1xuICAgIH1cbiAgfVxuXG4gIGlzSG92ZXJlZCA9IChkYXRlOiBOZ2JEYXRlKSA9PlxuICAgIHRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlICYmIHRoaXMuaG92ZXJlZERhdGUgJiYgZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSAmJiBkYXRlLmJlZm9yZSh0aGlzLmhvdmVyZWREYXRlKTtcblxuICBpc0luc2lkZSA9IChkYXRlOiBOZ2JEYXRlKSA9PiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpICYmIGRhdGUuYmVmb3JlKHRoaXMudG9EYXRlKTtcblxuICBpc1JhbmdlID0gKGRhdGU6IE5nYkRhdGUpID0+XG4gICAgZGF0ZS5lcXVhbHModGhpcy5mcm9tRGF0ZSkgfHwgZGF0ZS5lcXVhbHModGhpcy50b0RhdGUpIHx8IHRoaXMuaXNJbnNpZGUoZGF0ZSkgfHwgdGhpcy5pc0hvdmVyZWQoZGF0ZSk7XG5cbiAgc2hvd0RhdGVwaWNrZXIoKSB7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiAnQ1VTVE9NJyB9KTtcbiAgfVxuXG4gIG9uRmlsdGVyQ2hhbmdlKCRldmVudDogRXZlbnQsIGZpbHRlcjogUGJkc0RhdGVyYW5nZUZpbHRlciwgaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuXG4gICAgdGhpcy5maWx0ZXJDaGFuZ2UuZW1pdCh7XG4gICAgICBldmVudDogJGV2ZW50LFxuICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICBpbmRleDogaW5kZXhcbiAgICB9KTtcbiAgfVxuXG4gIHNldFByZXNldCh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKSB7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgdGhpcy5vbkFwcGx5KCk7XG4gIH1cblxuICBzZXRGaWx0ZXIoaW5kZXg6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmZpbHRlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1tpbmRleF07XG4gICAgfVxuICB9XG5cbiAgc2V0RGF0ZVJhbmdlKHZhbHVlKSB7XG4gICAgdGhpcy5mcm9tRGF0ZSA9IG5ldyBOZ2JEYXRlKHZhbHVlLmZyb21EYXRlLnllYXIsIHZhbHVlLmZyb21EYXRlLm1vbnRoLCB2YWx1ZS5mcm9tRGF0ZS5kYXkpO1xuICAgIHRoaXMudG9EYXRlID0gbmV3IE5nYkRhdGUodmFsdWUudG9EYXRlLnllYXIsIHZhbHVlLnRvRGF0ZS5tb250aCwgdmFsdWUudG9EYXRlLmRheSk7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gdmFsdWUudmFsdWUgPT09ICdDVVNUT00nO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZS52YWx1ZTtcblxuICAgIGlmICh0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZmlsdGVyU2VsZWN0ZWQgPSB0aGlzLmZpbHRlcnMuZmluZEluZGV4KChmKSA9PiBmLmZpZWxkID09PSB2YWx1ZS5maWx0ZXIpO1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1t0aGlzLmZpbHRlclNlbGVjdGVkXTtcbiAgICB9XG4gICAgdGhpcy5vbkFwcGx5KCk7XG4gIH1cblxuICBwcml2YXRlIHNldElucHV0TGFiZWwoKSB7XG4gICAgaWYgKHRoaXMucHJlc2V0cykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLnByZXNldHMuZmluZCgocCkgPT4gcC52YWx1ZSA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZCk7XG5cbiAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICBpZiAodGhpcy5mcm9tRGF0ZSA9PT0gbnVsbCB8fCB0aGlzLnRvRGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gc2VsZWN0ZWQubGFiZWw7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gbnVsbCB8fCAodGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gbnVsbCAmJiB0aGlzLnByZXNldFNlbGVjdGVkICE9PSAnQ1VTVE9NJykpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gdGhpcy5kYXRlRm9ybWF0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ0NVU1RPTScgJiYgdGhpcy5mcm9tRGF0ZSAmJiB0aGlzLnRvRGF0ZSkge1xuICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kYXRlUmFuZ2UgIT09ICcnKSB7XG4gICAgICAgIHRoaXMuZm9ybWF0dGVkRGF0ZSA9IHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA/IHRoaXMuZGF0ZUZvcm1hdCgpIDogdGhpcy5kYXRlUmFuZ2U7XG4gICAgICAgIHRoaXMuYXJpYUxhYmVsID0gdGhpcy5hcmlhTGFiZWxGb3JtYXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGVGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRGb3JtYXRcbiAgICAgIC5yZXBsYWNlKCd7ZnJvbURhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMuZnJvbURhdGUpKVxuICAgICAgLnJlcGxhY2UoJ3t0b0RhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMudG9EYXRlKSk7XG4gIH1cblxuICBwcml2YXRlIGFyaWFMYWJlbEZvcm1hdCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcmlhTGFiZWxTZWxlY3RlZC5yZXBsYWNlKCd7c2VsZWN0ZWRSYW5nZX0nLCB0aGlzLmZvcm1hdHRlZERhdGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXlzSW5Nb250aCh5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnJvbUFuZFRvRGF0ZXModmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSk6IHsgZnJvbTogTmdiRGF0ZVN0cnVjdDsgdG86IE5nYkRhdGVTdHJ1Y3QgfSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICAgIGNvbnN0IGN1cnJlbnREYXkgPSBub3cuZ2V0RGF0ZSgpO1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgJ1BSRVZJT1VTX01PTlRIJzpcbiAgICAgICAgY29uc3QgeWVhciA9IGN1cnJlbnRNb250aCA+IDAgPyBjdXJyZW50WWVhciA6IGN1cnJlbnRZZWFyIC0gMTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjdXJyZW50TW9udGggPiAwID8gY3VycmVudE1vbnRoIDogMTI7XG4gICAgICAgIGNvbnN0IGRheSA9IDE7XG4gICAgICAgIGNvbnN0IGxhc3REYXkgPSB0aGlzLmdldERheXNJbk1vbnRoKHllYXIsIG1vbnRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmcm9tOiB7IHllYXIsIG1vbnRoLCBkYXkgfSxcbiAgICAgICAgICB0bzogeyB5ZWFyLCBtb250aCwgZGF5OiBsYXN0RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGNhc2UgJ1lFQVJfVE9fREFURSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnJvbTogeyB5ZWFyOiBjdXJyZW50WWVhciwgbW9udGg6IDEsIGRheTogMSB9LFxuICAgICAgICAgIHRvOiB7IHllYXI6IGN1cnJlbnRZZWFyLCBtb250aDogY3VycmVudE1vbnRoICsgMSwgZGF5OiBjdXJyZW50RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB7IGZyb206IG51bGwsIHRvOiBudWxsIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXREYXRlUHJvcGVydGllcyh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAnUFJFVklPVVNfTU9OVEgnIHx8IHZhbHVlID09PSAnWUVBUl9UT19EQVRFJykge1xuICAgICAgY29uc3QgeyBmcm9tLCB0byB9ID0gdGhpcy5nZXRGcm9tQW5kVG9EYXRlcyh2YWx1ZSk7XG4gICAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUoZnJvbS55ZWFyLCBmcm9tLm1vbnRoLCBmcm9tLmRheSk7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHRvLnllYXIsIHRvLm1vbnRoLCB0by5kYXkpO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgY29uc3QgaXNGdXR1cmUgPSBNYXRoLnNpZ24odmFsdWUpID09PSAtMSA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgaWYgKGlzRnV0dXJlKSB7XG4gICAgICAgIHRoaXMuZnJvbURhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCk7XG4gICAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5jYWxlbmRhci5nZXROZXh0KHRoaXMuZnJvbURhdGUsICdkJywgTnVtYmVyKE1hdGguYWJzKHZhbHVlKSkpO1xuICAgICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWU7XG4gICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy50b0RhdGU7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdGVVRVUkU6ICcsIHRoaXMuZnJvbURhdGUsIHRoaXMudG9EYXRlLCB0aGlzLnByZXNldFNlbGVjdGVkLCB0aGlzLnN0YXJ0RGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRvRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKTtcbiAgICAgICAgdGhpcy5mcm9tRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLnRvRGF0ZSwgJ2QnLCBOdW1iZXIodmFsdWUpKTtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZnJvbURhdGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBudWxsO1xuICAgICAgdGhpcy50b0RhdGUgPSBudWxsO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IG51bGw7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAgcGJkcy1kYXRlcmFuZ2UtcG9wb3ZlclwiICpuZ0lmPVwiZGlzcGxheUlucHV0OyBlbHNlIGRhdGVyYW5nZUJ1dHRvblwiPlxuICA8aW5wdXRcbiAgICBjbGFzcz1cImZvcm0tY29udHJvbFwiXG4gICAgKm5nSWY9XCJkaXNwbGF5SW5wdXRcIlxuICAgIFt2YWx1ZV09XCJkYXRlUmFuZ2VcIlxuICAgIGFyaWEtbGFiZWw9XCJEYXRlXCJcbiAgICBhcmlhLXJlYWRvbmx5PVwidHJ1ZVwiXG4gICAgcmVhZG9ubHk9XCJyZWFkb25seVwiXG4gICAgdGFiaW5kZXg9XCItMVwiXG4gIC8+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImRhdGVyYW5nZUJ1dHRvblwiPjwvbmctY29udGFpbmVyPlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZSAjZGF0ZXJhbmdlQnV0dG9uPlxuICA8YnV0dG9uXG4gICAgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiXG4gICAgaWQ9XCJkYXRlcmFuZ2UtYnV0dG9uXCJcbiAgICAjZGF0ZXBpY2tlclBvcHVwPVwibmdiUG9wb3ZlclwiXG4gICAgW25nYlBvcG92ZXJdPVwiZGF0ZXJhbmdlQ29udGVudFwiXG4gICAgW3BsYWNlbWVudF09XCJwbGFjZW1lbnRcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsXCJcbiAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICBwb3BvdmVyQ2xhc3M9XCJkYXRlcmFuZ2UtcG9wb3ZlclwiXG4gICAgYXV0b0Nsb3NlPVwib3V0c2lkZVwiXG4gID5cbiAgICA8aSBjbGFzcz1cInBiaS1pY29uLW1pbmkgcGJpLWNhbGVuZGFyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICA8L2J1dHRvbj5cbjwvbmctdGVtcGxhdGU+XG5cbjxuZy10ZW1wbGF0ZSAjZGF0ZXJhbmdlQ29udGVudD5cbiAgPGRpdiBjbGFzcz1cImQtYmxvY2sgZC1tZC1mbGV4XCIgY2RrVHJhcEZvY3VzIGNka1RyYXBGb2N1c0F1dG9DYXB0dXJlPlxuICAgIDxkaXYgW2hpZGRlbl09XCIhaXNEYXRlcGlja2VyVmlzaWJsZVwiPlxuICAgICAgPG5nYi1kYXRlcGlja2VyXG4gICAgICAgICNkYXRlcGlja2VyPVwibmdiRGF0ZXBpY2tlclwiXG4gICAgICAgIFtkaXNwbGF5TW9udGhzXT1cImRpc3BsYXlNb250aHNcIlxuICAgICAgICBbbWluRGF0ZV09XCJtaW5EYXRlXCJcbiAgICAgICAgW21heERhdGVdPVwibWF4RGF0ZVwiXG4gICAgICAgIFtmaXJzdERheU9mV2Vla109XCJmaXJzdERheU9mV2Vla1wiXG4gICAgICAgIFtzaG93V2Vla2RheXNdPVwidHJ1ZVwiXG4gICAgICAgIFtzdGFydERhdGVdPVwic3RhcnREYXRlXCJcbiAgICAgICAgW2RheVRlbXBsYXRlXT1cInRcIlxuICAgICAgICAoZGF0ZVNlbGVjdCk9XCJvbkRhdGVTZWxlY3Rpb24oJGV2ZW50KVwiXG4gICAgICAgIG5hdmlnYXRpb249XCJzZWxlY3RcIlxuICAgICAgICBvdXRzaWRlRGF5cz1cImhpZGRlblwiXG4gICAgICA+XG4gICAgICA8L25nYi1kYXRlcGlja2VyPlxuICAgICAgPCEtLSAgLS0+XG5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjdCBsZXQtZGF0ZSBsZXQtZm9jdXNlZD1cImZvY3VzZWRcIj5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzcz1cImN1c3RvbS1kYXlcIlxuICAgICAgICAgIFtjbGFzcy5mb2N1c2VkXT1cImZvY3VzZWRcIlxuICAgICAgICAgIFtjbGFzcy5yYW5nZV09XCJpc1JhbmdlKGRhdGUpXCJcbiAgICAgICAgICBbY2xhc3MuZmFkZWRdPVwiaXNIb3ZlcmVkKGRhdGUpIHx8IGlzSW5zaWRlKGRhdGUpXCJcbiAgICAgICAgICAobW91c2VlbnRlcik9XCJob3ZlcmVkRGF0ZSA9IGRhdGVcIlxuICAgICAgICAgIChtb3VzZWxlYXZlKT1cImhvdmVyZWREYXRlID0gbnVsbFwiXG4gICAgICAgID5cbiAgICAgICAgICB7eyBkYXRlLmRheSB9fVxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBqdXN0aWZ5LWNvbnRlbnQtbGctYmV0d2VlbiBtdC1tZC0wXCIgW25nQ2xhc3NdPVwieyAnbXMtbWQtNCc6IGlzRGF0ZXBpY2tlclZpc2libGUgfVwiPlxuICAgICAgPCEtLSBmaWx0ZXJzIC0tPlxuICAgICAgPGRpdiBjbGFzcz1cIm1iLTNcIiAqbmdJZj1cImZpbHRlcnMgJiYgZmlsdGVycy5sZW5ndGggPiAwXCIgbmdiRHJvcGRvd24+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNtIGJ0bi1zZWNvbmRhcnlcIiBpZD1cImRhdGVGaWx0ZXJcIiBuZ2JEcm9wZG93blRvZ2dsZT5cbiAgICAgICAgICB7eyBzZWxlY3RlZEZpbHRlci5sYWJlbCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBuZ2JEcm9wZG93bk1lbnUgYXJpYS1sYWJlbGxlZGJ5PVwiZGF0ZUZpbHRlclwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgZmlsdGVyIG9mIGZpbHRlcnM7IGxldCBpbmRleCA9IGluZGV4XCJcbiAgICAgICAgICAgIChjbGljayk9XCJvbkZpbHRlckNoYW5nZSgkZXZlbnQsIGZpbHRlciwgaW5kZXgpXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt7IGZpbHRlci5sYWJlbCB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8IS0tIHByZXNldHMgcmFkaW8gYnV0dG9ucy0tPlxuICAgICAgPGRpdiBjbGFzcz1cImZsZXgtZ3Jvdy0xXCIgKm5nSWY9XCJwcmVzZXRzICYmIGZpbHRlcnNcIj5cbiAgICAgICAgPG1hdC1yYWRpby1ncm91cFxuICAgICAgICAgIGNsYXNzPVwic3RhY2tlZC1yYWRpby1ncm91cFwiXG4gICAgICAgICAgWyhuZ01vZGVsKV09XCJwcmVzZXRTZWxlY3RlZFwiXG4gICAgICAgICAgKGNoYW5nZSk9XCJwcmVzZXRTZWxlY3QoJGV2ZW50KVwiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIlNlbGVjdCBhbiBvcHRpb25cIlxuICAgICAgICAgIHN0eWxlPVwiZ2FwOiA0cHhcIlxuICAgICAgICAgIG5hbWU9XCJwcmVzZXRzXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxtYXQtcmFkaW8tYnV0dG9uICpuZ0Zvcj1cImxldCBwcmVzZXQgb2YgcHJlc2V0c1wiIFt2YWx1ZV09XCJwcmVzZXQudmFsdWVcIj57eyBwcmVzZXQubGFiZWwgfX08L21hdC1yYWRpby1idXR0b24+XG5cbiAgICAgICAgICA8bWF0LXJhZGlvLWJ1dHRvbiAqbmdJZj1cInNob3dDdXN0b21QcmVzZXRcIiBbdmFsdWVdPVwiJ0NVU1RPTSdcIiAoY2hhbmdlKT1cInNob3dEYXRlcGlja2VyKClcIj57e1xuICAgICAgICAgICAgY3VzdG9tUmFuZ2VUZXh0XG4gICAgICAgICAgfX08L21hdC1yYWRpby1idXR0b24+XG4gICAgICAgIDwvbWF0LXJhZGlvLWdyb3VwPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDwhLS0gcHJlc2V0cyBidXR0b25zLS0+XG4gICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uXCIgKm5nSWY9XCJwcmVzZXRzICYmICFmaWx0ZXJzXCIgc3R5bGU9XCJnYXA6IDRweFwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBidG4tc20gdGV4dC1ub3dyYXBcIlxuICAgICAgICAgICpuZ0Zvcj1cImxldCBwcmVzZXQgb2YgcHJlc2V0c1wiXG4gICAgICAgICAgKGNsaWNrKT1cInByZXNldENsaWNrKHByZXNldClcIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICA+XG4gICAgICAgICAge3sgcHJlc2V0LmxhYmVsIH19XG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5IGJ0bi1zbSB0ZXh0LW5vd3JhcFwiXG4gICAgICAgICAgKm5nSWY9XCJzaG93Q3VzdG9tUHJlc2V0XCJcbiAgICAgICAgICAoY2xpY2spPVwic2hvd0RhdGVwaWNrZXIoKVwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgID5cbiAgICAgICAgICB7eyBjdXN0b21SYW5nZVRleHQgfX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBidXR0b25zIC0tPlxuICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlbiBtdC0zXCIgKm5nSWY9XCJmaWx0ZXJzIHx8IGlzRGF0ZXBpY2tlclZpc2libGVcIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tc20gbWUtMVwiIChjbGljayk9XCJvbkFwcGx5KClcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAge3sgYXBwbHlUZXh0IH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnkgYnRuLXNtIG1zLTFcIiAoY2xpY2spPVwib25DYW5jZWwoKVwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgICB7eyBjYW5jZWxUZXh0IH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==