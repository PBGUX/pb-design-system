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
CustomDatepickerI18n.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: CustomDatepickerI18n, deps: [{ token: i1.PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Injectable });
CustomDatepickerI18n.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: CustomDatepickerI18n });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: CustomDatepickerI18n, decorators: [{
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
PbdsDaterangePopoverComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDaterangePopoverComponent, deps: [{ token: i2.NgbCalendar }, { token: i1.PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Component });
PbdsDaterangePopoverComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsDaterangePopoverComponent, selector: "pbds-daterange-popover", inputs: { presets: "presets", presetSelected: "presetSelected", filters: "filters", filterSelected: "filterSelected", showCustomPreset: "showCustomPreset", applyText: "applyText", cancelText: "cancelText", container: "container", customRangeText: "customRangeText", displayMonths: "displayMonths", displayInput: "displayInput", minDate: "minDate", maxDate: "maxDate", placement: "placement", fromDate: "fromDate", toDate: "toDate", inputFormat: "inputFormat", ariaLabel: "ariaLabel", ariaLabelSelected: "ariaLabelSelected" }, outputs: { dateChange: "dateChange", cancel: "cancel" }, providers: [
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
            multi: true
        }
    ], viewQueries: [{ propertyName: "datepickerPopup", first: true, predicate: ["datepickerPopup"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    *ngIf=\"displayInput\"\n    class=\"form-control\"\n    aria-label=\"Date\"\n    aria-readonly=\"true\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    type=\"button\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n    [container]=\"container\"\n    [placement]=\"placement\"\n    [attr.aria-label]=\"ariaLabel\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker=\"ngbDatepicker\"\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (dateSelect)=\"onDateSelection($event)\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            type=\"button\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange(filter, index)\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group\n          aria-label=\"Select an option\"\n          class=\"stacked-radio-group\"\n          style=\"gap: 4px\"\n          name=\"presets\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"d-flex flex-column\" style=\"gap: 4px\">\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i5.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "directive", type: i6.MatRadioGroup, selector: "mat-radio-group", exportAs: ["matRadioGroup"] }, { kind: "component", type: i6.MatRadioButton, selector: "mat-radio-button", inputs: ["disableRipple", "tabIndex"], exportAs: ["matRadioButton"] }, { kind: "component", type: i2.NgbDatepicker, selector: "ngb-datepicker", inputs: ["dayTemplate", "dayTemplateData", "displayMonths", "firstDayOfWeek", "footerTemplate", "markDisabled", "maxDate", "minDate", "navigation", "outsideDays", "showWeekNumbers", "startDate", "weekdays"], outputs: ["navigate", "dateSelect"], exportAs: ["ngbDatepicker"] }, { kind: "directive", type: i2.NgbPopover, selector: "[ngbPopover]", inputs: ["animation", "autoClose", "ngbPopover", "popoverTitle", "placement", "popperOptions", "triggers", "positionTarget", "container", "disablePopover", "popoverClass", "openDelay", "closeDelay"], outputs: ["shown", "hidden"], exportAs: ["ngbPopover"] }, { kind: "directive", type: i2.NgbDropdown, selector: "[ngbDropdown]", inputs: ["autoClose", "dropdownClass", "open", "placement", "popperOptions", "container", "display"], outputs: ["openChange"], exportAs: ["ngbDropdown"] }, { kind: "directive", type: i2.NgbDropdownToggle, selector: "[ngbDropdownToggle]" }, { kind: "directive", type: i2.NgbDropdownMenu, selector: "[ngbDropdownMenu]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsDaterangePopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-daterange-popover', providers: [
                        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
                            multi: true
                        }
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    *ngIf=\"displayInput\"\n    class=\"form-control\"\n    aria-label=\"Date\"\n    aria-readonly=\"true\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    type=\"button\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n    [container]=\"container\"\n    [placement]=\"placement\"\n    [attr.aria-label]=\"ariaLabel\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker=\"ngbDatepicker\"\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (dateSelect)=\"onDateSelection($event)\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            type=\"button\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange(filter, index)\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group\n          aria-label=\"Select an option\"\n          class=\"stacked-radio-group\"\n          style=\"gap: 4px\"\n          name=\"presets\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"d-flex flex-column\" style=\"gap: 4px\">\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n" }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRlcmFuZ2UtcG9wb3Zlci9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2RhdGVyYW5nZS1wb3BvdmVyL2RhdGVyYW5nZS1wb3BvdmVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsV0FBVyxFQUNYLFNBQVMsRUFDVCxtQkFBbUIsRUFDbkIsaUJBQWlCLEVBQ2pCLHVCQUF1QixFQUN2QixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2pCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixVQUFVLEVBQ1YsS0FBSyxFQUdMLE1BQU0sRUFFTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBZSxPQUFPLEVBQUUsaUJBQWlCLEVBQTZCLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7O0FBVWhILHVFQUF1RTtBQUV2RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsaUJBQWlCO0lBQ3pELFlBQW1CLGdCQUFzQztRQUN2RCxLQUFLLEVBQUUsQ0FBQztRQURTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7SUFFekQsQ0FBQztJQUVELGVBQWUsQ0FBQyxPQUFlO1FBQzdCLHNEQUFzRDtRQUN0RCxPQUFPLEdBQUcsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFdEMsZUFBZTtRQUNmLGlCQUFpQjtRQUNq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O3NCQURiLEtBQUs7Z0JBSU4sT0FBTztzQkFETixLQUFLO2dCQUlOLGNBQWM7c0JBRGIsS0FBSztnQkFJTixnQkFBZ0I7c0JBRGYsS0FBSztnQkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4sVUFBVTtzQkFEVCxLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixlQUFlO3NCQURkLEtBQUs7Z0JBSU4sYUFBYTtzQkFEWixLQUFLO2dCQUlOLFlBQVk7c0JBRFgsS0FBSztnQkFJTixPQUFPO3NCQUROLEtBQUs7Z0JBSU4sT0FBTztzQkFETixLQUFLO2dCQUlOLFNBQVM7c0JBRFIsS0FBSztnQkFJTixRQUFRO3NCQURQLEtBQUs7Z0JBSU4sTUFBTTtzQkFETCxLQUFLO2dCQUlOLFdBQVc7c0JBRFYsS0FBSztnQkFJTixTQUFTO3NCQURSLEtBQUs7Z0JBSU4saUJBQWlCO3NCQURoQixLQUFLO2dCQUlOLFVBQVU7c0JBRFQsTUFBTTtnQkFJUCxNQUFNO3NCQURMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBmb3JtYXREYXRlLFxuICBGb3JtYXRXaWR0aCxcbiAgRm9ybVN0eWxlLFxuICBnZXRMb2NhbGVEYXRlRm9ybWF0LFxuICBnZXRMb2NhbGVEYXlOYW1lcyxcbiAgZ2V0TG9jYWxlRmlyc3REYXlPZldlZWssXG4gIGdldExvY2FsZU1vbnRoTmFtZXMsXG4gIFRyYW5zbGF0aW9uV2lkdGhcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0YWJsZSxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE5nYkNhbGVuZGFyLCBOZ2JEYXRlLCBOZ2JEYXRlcGlja2VySTE4biwgTmdiRGF0ZVN0cnVjdCwgTmdiUG9wb3ZlciB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcbmltcG9ydCB7XG4gIFBiZHNEYXRlcmFuZ2VDaGFuZ2UsXG4gIFBiZHNEYXRlcmFuZ2VGaWx0ZXIsXG4gIFBiZHNEYXRlcmFuZ2VQbGFjZW1lbnQsXG4gIFBiZHNEYXRlcmFuZ2VQcmVzZXQsXG4gIFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZVxufSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgUGJkc0RhdGVyYW5nZVNlcnZpY2UgfSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyLnNlcnZpY2UnO1xuXG4vLyBEZWZpbmUgY3VzdG9tIHNlcnZpY2UgcHJvdmlkaW5nIHRoZSBtb250aHMgYW5kIHdlZWtkYXlzIHRyYW5zbGF0aW9uc1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEN1c3RvbURhdGVwaWNrZXJJMThuIGV4dGVuZHMgTmdiRGF0ZXBpY2tlckkxOG4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0ZXJhbmdlU2VydmljZTogUGJkc0RhdGVyYW5nZVNlcnZpY2UpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgZ2V0V2Vla2RheUxhYmVsKHdlZWtkYXk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gZm9yIG5nLWJvb3RzdHJhcCwgc3VuZGF5IG51bWJlciBvZiA3IGNvbnZlcnRlZCB0byAwXG4gICAgd2Vla2RheSA9IHdlZWtkYXkgPT09IDcgPyAwIDogd2Vla2RheTtcblxuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3dlZWtkYXk6ICcsXG4gICAgLy8gICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgIC8vICAgd2Vla2RheSxcbiAgICAvLyAgIGdldExvY2FsZURheU5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkKVt3ZWVrZGF5XVxuICAgIC8vICk7XG5cbiAgICByZXR1cm4gZ2V0TG9jYWxlRGF5TmFtZXMoXG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgICAgRm9ybVN0eWxlLlN0YW5kYWxvbmUsXG4gICAgICBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkXG4gICAgKVt3ZWVrZGF5XTtcbiAgfVxuXG4gIGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBnZXRMb2NhbGVNb250aE5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLldpZGUpW1xuICAgICAgbW9udGggLSAxXG4gICAgXTtcbiAgfVxuXG4gIGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtkYXRlLmRheX0tJHtkYXRlLm1vbnRofS0ke2RhdGUueWVhcn1gO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0ZXJhbmdlLXBvcG92ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE5nYkRhdGVwaWNrZXJJMThuLCB1c2VDbGFzczogQ3VzdG9tRGF0ZXBpY2tlckkxOG4gfSxcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdLFxuICBzdHlsZXM6IFtdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0ZXJhbmdlUG9wb3ZlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBWaWV3Q2hpbGQoJ2RhdGVwaWNrZXJQb3B1cCcsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIGRhdGVwaWNrZXJQb3B1cDogTmdiUG9wb3ZlcjtcblxuICBASW5wdXQoKVxuICBwcmVzZXRzOiBBcnJheTxQYmRzRGF0ZXJhbmdlUHJlc2V0PiA9IFtcbiAgICB7XG4gICAgICBsYWJlbDogJ0FsbCBEYXRlcycsXG4gICAgICB2YWx1ZTogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdMYXN0IDcgRGF5cycsXG4gICAgICB2YWx1ZTogN1xuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdMYXN0IDMwIERheXMnLFxuICAgICAgdmFsdWU6IDMwXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ1ByZXZpb3VzIE1vbnRoJyxcbiAgICAgIHZhbHVlOiAnUFJFVklPVVNfTU9OVEgnXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ1llYXIgdG8gRGF0ZScsXG4gICAgICB2YWx1ZTogJ1lFQVJfVE9fREFURSdcbiAgICB9XG4gIF07XG5cbiAgQElucHV0KClcbiAgcHJlc2V0U2VsZWN0ZWQ6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgZmlsdGVyczogQXJyYXk8UGJkc0RhdGVyYW5nZUZpbHRlcj47XG5cbiAgQElucHV0KClcbiAgZmlsdGVyU2VsZWN0ZWQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHNob3dDdXN0b21QcmVzZXQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGFwcGx5VGV4dCA9ICdBcHBseSc7XG5cbiAgQElucHV0KClcbiAgY2FuY2VsVGV4dCA9ICdDYW5jZWwnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbnRhaW5lcjogbnVsbCB8ICdib2R5JyA9ICdib2R5JztcblxuICBASW5wdXQoKVxuICBjdXN0b21SYW5nZVRleHQgPSAnQ3VzdG9tIFJhbmdlJztcblxuICBASW5wdXQoKVxuICBkaXNwbGF5TW9udGhzID0gMjtcblxuICBASW5wdXQoKVxuICBkaXNwbGF5SW5wdXQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIG1pbkRhdGU6IE5nYkRhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFByZXYodGhpcy5jYWxlbmRhci5nZXRUb2RheSgpLCAneScpO1xuXG4gIEBJbnB1dCgpXG4gIG1heERhdGU6IE5nYkRhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCk7XG5cbiAgQElucHV0KClcbiAgcGxhY2VtZW50OiBQYmRzRGF0ZXJhbmdlUGxhY2VtZW50ID0gJ2JvdHRvbS1yaWdodCBhdXRvJztcblxuICBASW5wdXQoKVxuICBmcm9tRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGlucHV0Rm9ybWF0ID0gJ3tmcm9tRGF0ZX0gdG8ge3RvRGF0ZX0nO1xuXG4gIEBJbnB1dCgpXG4gIGFyaWFMYWJlbCA9ICdPcGVuIGRhdGUgcGlja2VyJztcblxuICBASW5wdXQoKVxuICBhcmlhTGFiZWxTZWxlY3RlZCA9ICdPcGVuIGRhdGUgcGlja2VyLCBzZWxlY3RlZCByYW5nZSBpcyB7c2VsZWN0ZWRSYW5nZX0nO1xuXG4gIEBPdXRwdXQoKVxuICBkYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYmRzRGF0ZXJhbmdlQ2hhbmdlPigpO1xuXG4gIEBPdXRwdXQoKVxuICBjYW5jZWwgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBmaXJzdERheU9mV2VlayA9IGdldExvY2FsZUZpcnN0RGF5T2ZXZWVrKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCkpO1xuXG4gIGhvdmVyZWREYXRlOiBOZ2JEYXRlO1xuXG4gIGRhdGVSYW5nZSA9ICcnO1xuICBpc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gIHNlbGVjdGVkRmlsdGVyO1xuICBzdGFydERhdGU6IE5nYkRhdGU7XG4gIGZvcm1hdHRlZERhdGU7XG4gIGVtaXRWYWx1ZTogUGJkc0RhdGVyYW5nZUNoYW5nZTtcblxuICBwcml2YXRlIG9uVG91Y2hlZDogYW55ID0gKCkgPT4ge307XG4gIHByaXZhdGUgb25DaGFuZ2UgPSAob2JqOiBhbnkpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBwcml2YXRlIGRhdGVyYW5nZVNlcnZpY2U6IFBiZHNEYXRlcmFuZ2VTZXJ2aWNlKSB7XG4gICAgdGhpcy53cml0ZVZhbHVlKHRoaXMuZW1pdFZhbHVlKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGNoaW5hIHNob3VsZCBzdGFydCBvbiBhIE1vbmRheSwgQW5ndWxhciBsb2NhbGUgcmV0dXJucyBpbmNvcnJlY3QgMFxuICAgIHRoaXMuZmlyc3REYXlPZldlZWsgPVxuICAgICAgdGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSA9PT0gJ3poLWNuJyA/IHRoaXMuZmlyc3REYXlPZldlZWsgKyAxIDogdGhpcy5maXJzdERheU9mV2VlaztcblxuICAgIGlmICh0aGlzLnByZXNldFNlbGVjdGVkID09PSAnQ1VTVE9NJykge1xuICAgICAgdGhpcy5zaG93RGF0ZXBpY2tlcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXNldHMpIHtcbiAgICAgIGlmICghdGhpcy5maWx0ZXJzICYmIHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRDbGljayhcbiAgICAgICAgICB0aGlzLnByZXNldHMuZmluZCgocCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZDtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgICAgIHRoaXMub25BcHBseShmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5vbkFwcGx5KGZhbHNlKTtcbiAgfVxuICBvcGVuUGJkc0RhdGVSYW5nZVBvcHVwKCkge1xuICAgIHRoaXMuZGF0ZXBpY2tlclBvcHVwLm9wZW4oKTtcbiAgfVxuXG4gIC8vIHByb2dyYW1tYXRpY2FsbHkgd3JpdGluZyB0aGUgdmFsdWVcbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnV1JJVEUgVkFMVUU6ICcsIHZhbHVlKTtcblxuICAgICAgY29uc3QgZmlsdGVySW5kZXggPSB0aGlzLmZpbHRlcnMuZmluZEluZGV4KChmaWx0ZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIGZpbHRlci5maWVsZCA9PT0gdmFsdWUuZmlsdGVyO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZnJvbURhdGUgPSB2YWx1ZS5mcm9tRGF0ZTtcbiAgICAgIHRoaXMudG9EYXRlID0gdmFsdWUudG9EYXRlO1xuICAgICAgdGhpcy5mb3JtYXR0ZWREYXRlID0gdmFsdWUuZm9ybWF0dGVkRGF0ZTtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZS52YWx1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbZmlsdGVySW5kZXhdO1xuICAgICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gdGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ0NVU1RPTScgPyB0cnVlIDogZmFsc2U7XG5cbiAgICAgIHRoaXMub25BcHBseSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIG1ldGhvZCB0byBiZSB0cmlnZ2VyZWQgb24gVUkgY2hhbmdlXG4gIHJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2U6IGFueSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdPTkNIQU5HRTogJywgdGhpcy5lbWl0VmFsdWUpO1xuICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcbiAgfVxuXG4gIC8vIG1ldGhvZCB0byBiZSB0cmlnZ2VyZWQgb24gY29tcG9uZW50IHRvdWNoXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZDogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMub25Ub3VjaGVkID0gb25Ub3VjaGVkO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW3RoaXMuZmlsdGVyU2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnByZXNldHMpIHtcbiAgICAgIGlmICghdGhpcy5maWx0ZXJzICYmIHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRDbGljayhcbiAgICAgICAgICB0aGlzLnByZXNldHMuZmluZCgocCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZDtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgICAgIHRoaXMub25BcHBseSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIChjaGFuZ2VzLnRvVGV4dCAmJiBjaGFuZ2VzLnRvVGV4dC5maXJzdENoYW5nZSA9PT0gZmFsc2UpIHtcbiAgICAvLyAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICAgIC8vIH1cblxuICAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICB9XG5cbiAgb25BcHBseShzaG91bGRFbWl0ID0gdHJ1ZSkge1xuICAgIC8vIGlmIG9ubHkgYSBDVVNUT00gc3RhcnQgZGF0ZSBpcyBzZWxlY3RlZCwgc2V0IHRoZSBlbmQgZGF0ZSB0byB0aGUgc3RhcnQgZGF0ZSAoaS5lIHNlbGVjdCBhIHNpbmdsZSBkYXkpXG4gICAgaWYgKCF0aGlzLnRvRGF0ZSkge1xuICAgICAgdGhpcy50b0RhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgIH1cblxuICAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuXG4gICAgdGhpcy5lbWl0VmFsdWUgPSB7XG4gICAgICBmcm9tRGF0ZTogdGhpcy5mcm9tRGF0ZSxcbiAgICAgIHRvRGF0ZTogdGhpcy50b0RhdGUsXG4gICAgICBmb3JtYXR0ZWREYXRlOiB0aGlzLmZvcm1hdHRlZERhdGUsXG4gICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMubGVuZ3RoID4gMCA/IHRoaXMuc2VsZWN0ZWRGaWx0ZXIuZmllbGQgOiBudWxsLFxuICAgICAgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWRcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuXG4gICAgaWYgKHNob3VsZEVtaXQpIHtcbiAgICAgIHRoaXMuZGF0ZUNoYW5nZS5lbWl0KHRoaXMuZW1pdFZhbHVlKTtcblxuICAgICAgdGhpcy5kYXRlcGlja2VyUG9wdXA/LmNsb3NlKCk7XG5cbiAgICAgIHRoaXMuYXJpYUxhYmVsID0gdGhpcy5hcmlhTGFiZWxGb3JtYXQoKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMub25DaGFuZ2UodGhpcy5lbWl0VmFsdWUpLCAwKTtcbiAgfVxuXG4gIG9uQ2FuY2VsKCkge1xuICAgIHRoaXMuZGF0ZXBpY2tlclBvcHVwLmNsb3NlKCk7XG5cbiAgICB0aGlzLmNhbmNlbC5lbWl0KCk7XG4gIH1cblxuICBvbkRhdGVTZWxlY3Rpb24oZGF0ZTogTmdiRGF0ZSkge1xuICAgIGlmICghdGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUpIHtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBkYXRlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUgJiYgZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSkge1xuICAgICAgdGhpcy50b0RhdGUgPSBkYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLmZyb21EYXRlID0gZGF0ZTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIHByZXNldFNlbGVjdCA9ICgkZXZlbnQ6IFBhcnRpYWw8UGJkc0RhdGVyYW5nZVByZXNldD4pID0+IHtcbiAgICBpZiAoJGV2ZW50LnZhbHVlID09PSAnQ1VTVE9NJykge1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9ICdDVVNUT00nO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnNldERhdGVQcm9wZXJ0aWVzKCRldmVudC52YWx1ZSk7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gIH07XG5cbiAgcHJlc2V0Q2xpY2socHJlc2V0OiBQYmRzRGF0ZXJhbmdlUHJlc2V0KSB7XG4gICAgaWYgKHByZXNldCkge1xuICAgICAgaWYgKHByZXNldC52YWx1ZSA9PT0gJ0NVU1RPTScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXREYXRlUHJvcGVydGllcyhwcmVzZXQudmFsdWUpO1xuICAgICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLm9uQXBwbHkoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEZvcm1hdHRlZERhdGUoZGF0ZTogTmdiRGF0ZSkge1xuICAgIGlmIChkYXRlKSB7XG4gICAgICBjb25zdCBsb2NhbGUgPSB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpO1xuICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9IGdldExvY2FsZURhdGVGb3JtYXQobG9jYWxlLCBGb3JtYXRXaWR0aC5TaG9ydCk7XG4gICAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShgJHtkYXRlLm1vbnRofS8ke2RhdGUuZGF5fS8ke2RhdGUueWVhcn1gLCBkYXRlRm9ybWF0LCBsb2NhbGUpO1xuICAgICAgcmV0dXJuIGZvcm1hdHRlZERhdGU7XG4gICAgfVxuICB9XG5cbiAgaXNIb3ZlcmVkID0gKGRhdGU6IE5nYkRhdGUpID0+XG4gICAgdGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUgJiYgdGhpcy5ob3ZlcmVkRGF0ZSAmJiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpICYmIGRhdGUuYmVmb3JlKHRoaXMuaG92ZXJlZERhdGUpO1xuXG4gIGlzSW5zaWRlID0gKGRhdGU6IE5nYkRhdGUpID0+IGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkgJiYgZGF0ZS5iZWZvcmUodGhpcy50b0RhdGUpO1xuXG4gIGlzUmFuZ2UgPSAoZGF0ZTogTmdiRGF0ZSkgPT5cbiAgICBkYXRlLmVxdWFscyh0aGlzLmZyb21EYXRlKSB8fCBkYXRlLmVxdWFscyh0aGlzLnRvRGF0ZSkgfHwgdGhpcy5pc0luc2lkZShkYXRlKSB8fCB0aGlzLmlzSG92ZXJlZChkYXRlKTtcblxuICBzaG93RGF0ZXBpY2tlcigpIHtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6ICdDVVNUT00nIH0pO1xuICB9XG5cbiAgb25GaWx0ZXJDaGFuZ2UoZmlsdGVyLCBpbmRleCkge1xuICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuICB9XG5cbiAgc2V0UHJlc2V0KHZhbHVlOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWUpIHtcbiAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWU7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICB0aGlzLm9uQXBwbHkoKTtcbiAgfVxuXG4gIHNldEZpbHRlcihpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW2luZGV4XTtcbiAgICB9XG4gIH1cblxuICBzZXREYXRlUmFuZ2UodmFsdWUpIHtcbiAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUodmFsdWUuZnJvbURhdGUueWVhciwgdmFsdWUuZnJvbURhdGUubW9udGgsIHZhbHVlLmZyb21EYXRlLmRheSk7XG4gICAgdGhpcy50b0RhdGUgPSBuZXcgTmdiRGF0ZSh2YWx1ZS50b0RhdGUueWVhciwgdmFsdWUudG9EYXRlLm1vbnRoLCB2YWx1ZS50b0RhdGUuZGF5KTtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB2YWx1ZS52YWx1ZSA9PT0gJ0NVU1RPTSc7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlLnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgICAgdGhpcy5maWx0ZXJTZWxlY3RlZCA9IHRoaXMuZmlsdGVycy5maW5kSW5kZXgoKGYpID0+IGYuZmllbGQgPT09IHZhbHVlLmZpbHRlcik7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW3RoaXMuZmlsdGVyU2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIHRoaXMub25BcHBseSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRJbnB1dExhYmVsKCkge1xuICAgIGlmICh0aGlzLnByZXNldHMpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5wcmVzZXRzLmZpbmQoKHApID0+IHAudmFsdWUgPT09IHRoaXMucHJlc2V0U2VsZWN0ZWQpO1xuXG4gICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuZnJvbURhdGUgPT09IG51bGwgfHwgdGhpcy50b0RhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09IG51bGwgfHwgKHRoaXMucHJlc2V0U2VsZWN0ZWQgIT09IG51bGwgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gJ0NVU1RPTScpKSB7XG4gICAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSBzZWxlY3RlZC5sYWJlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdDVVNUT00nICYmIHRoaXMuZnJvbURhdGUgJiYgdGhpcy50b0RhdGUpIHtcbiAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSB0aGlzLmRhdGVGb3JtYXQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZGF0ZVJhbmdlICE9PSAnJykge1xuICAgICAgICB0aGlzLmZvcm1hdHRlZERhdGUgPSB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPyB0aGlzLmRhdGVGb3JtYXQoKSA6IHRoaXMuZGF0ZVJhbmdlO1xuICAgICAgICB0aGlzLmFyaWFMYWJlbCA9IHRoaXMuYXJpYUxhYmVsRm9ybWF0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRlRm9ybWF0KCkge1xuICAgIHJldHVybiB0aGlzLmlucHV0Rm9ybWF0XG4gICAgICAucmVwbGFjZSgne2Zyb21EYXRlfScsIHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSh0aGlzLmZyb21EYXRlKSlcbiAgICAgIC5yZXBsYWNlKCd7dG9EYXRlfScsIHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSh0aGlzLnRvRGF0ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBhcmlhTGFiZWxGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsU2VsZWN0ZWQucmVwbGFjZSgne3NlbGVjdGVkUmFuZ2V9JywgdGhpcy5mb3JtYXR0ZWREYXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGF5c0luTW9udGgoeWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKS5nZXREYXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGdldEZyb21BbmRUb0RhdGVzKHZhbHVlOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWUpOiB7IGZyb206IE5nYkRhdGVTdHJ1Y3Q7IHRvOiBOZ2JEYXRlU3RydWN0IH0ge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgY3VycmVudFllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBjdXJyZW50TW9udGggPSBub3cuZ2V0TW9udGgoKTtcbiAgICBjb25zdCBjdXJyZW50RGF5ID0gbm93LmdldERhdGUoKTtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlICdQUkVWSU9VU19NT05USCc6XG4gICAgICAgIGNvbnN0IHllYXIgPSBjdXJyZW50TW9udGggPiAwID8gY3VycmVudFllYXIgOiBjdXJyZW50WWVhciAtIDE7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gY3VycmVudE1vbnRoID4gMCA/IGN1cnJlbnRNb250aCA6IDEyO1xuICAgICAgICBjb25zdCBkYXkgPSAxO1xuICAgICAgICBjb25zdCBsYXN0RGF5ID0gdGhpcy5nZXREYXlzSW5Nb250aCh5ZWFyLCBtb250aCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnJvbTogeyB5ZWFyLCBtb250aCwgZGF5IH0sXG4gICAgICAgICAgdG86IHsgeWVhciwgbW9udGgsIGRheTogbGFzdERheSB9XG4gICAgICAgIH07XG4gICAgICBjYXNlICdZRUFSX1RPX0RBVEUnOlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZyb206IHsgeWVhcjogY3VycmVudFllYXIsIG1vbnRoOiAxLCBkYXk6IDEgfSxcbiAgICAgICAgICB0bzogeyB5ZWFyOiBjdXJyZW50WWVhciwgbW9udGg6IGN1cnJlbnRNb250aCArIDEsIGRheTogY3VycmVudERheSB9XG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geyBmcm9tOiBudWxsLCB0bzogbnVsbCB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0RGF0ZVByb3BlcnRpZXModmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gJ1BSRVZJT1VTX01PTlRIJyB8fCB2YWx1ZSA9PT0gJ1lFQVJfVE9fREFURScpIHtcbiAgICAgIGNvbnN0IHsgZnJvbSwgdG8gfSA9IHRoaXMuZ2V0RnJvbUFuZFRvRGF0ZXModmFsdWUpO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IG5ldyBOZ2JEYXRlKGZyb20ueWVhciwgZnJvbS5tb250aCwgZnJvbS5kYXkpO1xuICAgICAgdGhpcy50b0RhdGUgPSBuZXcgTmdiRGF0ZSh0by55ZWFyLCB0by5tb250aCwgdG8uZGF5KTtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5mcm9tRGF0ZTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKTtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFByZXYodGhpcy50b0RhdGUsICdkJywgTnVtYmVyKHZhbHVlKSk7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWU7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZnJvbURhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBudWxsO1xuICAgICAgdGhpcy50b0RhdGUgPSBudWxsO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IG51bGw7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAgcGJkcy1kYXRlcmFuZ2UtcG9wb3ZlclwiICpuZ0lmPVwiZGlzcGxheUlucHV0OyBlbHNlIGRhdGVyYW5nZUJ1dHRvblwiPlxuICA8aW5wdXRcbiAgICAqbmdJZj1cImRpc3BsYXlJbnB1dFwiXG4gICAgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIlxuICAgIGFyaWEtbGFiZWw9XCJEYXRlXCJcbiAgICBhcmlhLXJlYWRvbmx5PVwidHJ1ZVwiXG4gICAgW3ZhbHVlXT1cImRhdGVSYW5nZVwiXG4gICAgcmVhZG9ubHk9XCJyZWFkb25seVwiXG4gICAgdGFiaW5kZXg9XCItMVwiXG4gIC8+XG5cbiAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImRhdGVyYW5nZUJ1dHRvblwiPjwvbmctY29udGFpbmVyPlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZSAjZGF0ZXJhbmdlQnV0dG9uPlxuICA8YnV0dG9uXG4gICAgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiXG4gICAgdHlwZT1cImJ1dHRvblwiXG4gICAgaWQ9XCJkYXRlcmFuZ2UtYnV0dG9uXCJcbiAgICAjZGF0ZXBpY2tlclBvcHVwPVwibmdiUG9wb3ZlclwiXG4gICAgW25nYlBvcG92ZXJdPVwiZGF0ZXJhbmdlQ29udGVudFwiXG4gICAgcG9wb3ZlckNsYXNzPVwiZGF0ZXJhbmdlLXBvcG92ZXJcIlxuICAgIGF1dG9DbG9zZT1cIm91dHNpZGVcIlxuICAgIFtjb250YWluZXJdPVwiY29udGFpbmVyXCJcbiAgICBbcGxhY2VtZW50XT1cInBsYWNlbWVudFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICA+XG4gICAgPGkgY2xhc3M9XCJwYmktaWNvbi1taW5pIHBiaS1jYWxlbmRhclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgPC9idXR0b24+XG48L25nLXRlbXBsYXRlPlxuXG48bmctdGVtcGxhdGUgI2RhdGVyYW5nZUNvbnRlbnQ+XG4gIDxkaXYgY2xhc3M9XCJkLWJsb2NrIGQtbWQtZmxleFwiIGNka1RyYXBGb2N1cyBjZGtUcmFwRm9jdXNBdXRvQ2FwdHVyZT5cbiAgICA8ZGl2IFtoaWRkZW5dPVwiIWlzRGF0ZXBpY2tlclZpc2libGVcIj5cbiAgICAgIDxuZ2ItZGF0ZXBpY2tlclxuICAgICAgICAjZGF0ZXBpY2tlcj1cIm5nYkRhdGVwaWNrZXJcIlxuICAgICAgICBbZGlzcGxheU1vbnRoc109XCJkaXNwbGF5TW9udGhzXCJcbiAgICAgICAgW21pbkRhdGVdPVwibWluRGF0ZVwiXG4gICAgICAgIFttYXhEYXRlXT1cIm1heERhdGVcIlxuICAgICAgICBuYXZpZ2F0aW9uPVwic2VsZWN0XCJcbiAgICAgICAgb3V0c2lkZURheXM9XCJoaWRkZW5cIlxuICAgICAgICBbZmlyc3REYXlPZldlZWtdPVwiZmlyc3REYXlPZldlZWtcIlxuICAgICAgICBbc2hvd1dlZWtkYXlzXT1cInRydWVcIlxuICAgICAgICBbc3RhcnREYXRlXT1cInN0YXJ0RGF0ZVwiXG4gICAgICAgIFtkYXlUZW1wbGF0ZV09XCJ0XCJcbiAgICAgICAgKGRhdGVTZWxlY3QpPVwib25EYXRlU2VsZWN0aW9uKCRldmVudClcIlxuICAgICAgPlxuICAgICAgPC9uZ2ItZGF0ZXBpY2tlcj5cbiAgICAgIDwhLS0gIC0tPlxuXG4gICAgICA8bmctdGVtcGxhdGUgI3QgbGV0LWRhdGUgbGV0LWZvY3VzZWQ9XCJmb2N1c2VkXCI+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3M9XCJjdXN0b20tZGF5XCJcbiAgICAgICAgICBbY2xhc3MuZm9jdXNlZF09XCJmb2N1c2VkXCJcbiAgICAgICAgICBbY2xhc3MucmFuZ2VdPVwiaXNSYW5nZShkYXRlKVwiXG4gICAgICAgICAgW2NsYXNzLmZhZGVkXT1cImlzSG92ZXJlZChkYXRlKSB8fCBpc0luc2lkZShkYXRlKVwiXG4gICAgICAgICAgKG1vdXNlZW50ZXIpPVwiaG92ZXJlZERhdGUgPSBkYXRlXCJcbiAgICAgICAgICAobW91c2VsZWF2ZSk9XCJob3ZlcmVkRGF0ZSA9IG51bGxcIlxuICAgICAgICA+XG4gICAgICAgICAge3sgZGF0ZS5kYXkgfX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWxnLWJldHdlZW4gbXQtbWQtMFwiIFtuZ0NsYXNzXT1cInsgJ21sLW1kLTQnOiBpc0RhdGVwaWNrZXJWaXNpYmxlIH1cIj5cbiAgICAgIDwhLS0gZmlsdGVycyAtLT5cbiAgICAgIDxkaXYgKm5nSWY9XCJmaWx0ZXJzICYmIGZpbHRlcnMubGVuZ3RoID4gMFwiIGNsYXNzPVwibWItM1wiIG5nYkRyb3Bkb3duPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zbSBidG4tc2Vjb25kYXJ5IGJ0bi1ibG9ja1wiIGlkPVwiZGF0ZUZpbHRlclwiIG5nYkRyb3Bkb3duVG9nZ2xlPlxuICAgICAgICAgIHt7IHNlbGVjdGVkRmlsdGVyLmxhYmVsIH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8ZGl2IG5nYkRyb3Bkb3duTWVudSBhcmlhLWxhYmVsbGVkYnk9XCJkYXRlRmlsdGVyXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGZpbHRlciBvZiBmaWx0ZXJzOyBsZXQgaW5kZXggPSBpbmRleFwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25GaWx0ZXJDaGFuZ2UoZmlsdGVyLCBpbmRleClcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt7IGZpbHRlci5sYWJlbCB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8IS0tIHByZXNldHMgcmFkaW8gYnV0dG9ucy0tPlxuICAgICAgPGRpdiAqbmdJZj1cInByZXNldHMgJiYgZmlsdGVyc1wiIGNsYXNzPVwiZmxleC1ncm93LTFcIj5cbiAgICAgICAgPG1hdC1yYWRpby1ncm91cFxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJTZWxlY3QgYW4gb3B0aW9uXCJcbiAgICAgICAgICBjbGFzcz1cInN0YWNrZWQtcmFkaW8tZ3JvdXBcIlxuICAgICAgICAgIHN0eWxlPVwiZ2FwOiA0cHhcIlxuICAgICAgICAgIG5hbWU9XCJwcmVzZXRzXCJcbiAgICAgICAgICBbKG5nTW9kZWwpXT1cInByZXNldFNlbGVjdGVkXCJcbiAgICAgICAgICAoY2hhbmdlKT1cInByZXNldFNlbGVjdCgkZXZlbnQpXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxtYXQtcmFkaW8tYnV0dG9uICpuZ0Zvcj1cImxldCBwcmVzZXQgb2YgcHJlc2V0c1wiIFt2YWx1ZV09XCJwcmVzZXQudmFsdWVcIj57eyBwcmVzZXQubGFiZWwgfX08L21hdC1yYWRpby1idXR0b24+XG5cbiAgICAgICAgICA8bWF0LXJhZGlvLWJ1dHRvbiAqbmdJZj1cInNob3dDdXN0b21QcmVzZXRcIiBbdmFsdWVdPVwiJ0NVU1RPTSdcIiAoY2hhbmdlKT1cInNob3dEYXRlcGlja2VyKClcIj57e1xuICAgICAgICAgICAgY3VzdG9tUmFuZ2VUZXh0XG4gICAgICAgICAgfX08L21hdC1yYWRpby1idXR0b24+XG4gICAgICAgIDwvbWF0LXJhZGlvLWdyb3VwPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDwhLS0gcHJlc2V0cyBidXR0b25zLS0+XG4gICAgICA8ZGl2ICpuZ0lmPVwicHJlc2V0cyAmJiAhZmlsdGVyc1wiIGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uXCIgc3R5bGU9XCJnYXA6IDRweFwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBidG4tYmxvY2sgYnRuLXNtIHRleHQtbm93cmFwXCJcbiAgICAgICAgICAqbmdGb3I9XCJsZXQgcHJlc2V0IG9mIHByZXNldHNcIlxuICAgICAgICAgIChjbGljayk9XCJwcmVzZXRDbGljayhwcmVzZXQpXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt7IHByZXNldC5sYWJlbCB9fVxuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBidG4tYmxvY2sgYnRuLXNtIHRleHQtbm93cmFwXCJcbiAgICAgICAgICAqbmdJZj1cInNob3dDdXN0b21QcmVzZXRcIlxuICAgICAgICAgIChjbGljayk9XCJzaG93RGF0ZXBpY2tlcigpXCJcbiAgICAgICAgPlxuICAgICAgICAgIHt7IGN1c3RvbVJhbmdlVGV4dCB9fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8IS0tIGJ1dHRvbnMgLS0+XG4gICAgICA8ZGl2ICpuZ0lmPVwiZmlsdGVycyB8fCBpc0RhdGVwaWNrZXJWaXNpYmxlXCIgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW4gbXQtM1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbSBtci0xXCIgdHlwZT1cImJ1dHRvblwiIChjbGljayk9XCJvbkFwcGx5KClcIj5cbiAgICAgICAgICB7eyBhcHBseVRleHQgfX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeSBidG4tc20gbWwtMVwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwib25DYW5jZWwoKVwiPlxuICAgICAgICAgIHt7IGNhbmNlbFRleHQgfX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19