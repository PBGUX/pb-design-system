import * as i0 from '@angular/core';
import { LOCALE_ID, Injectable, Inject, EventEmitter, forwardRef, Component, ChangeDetectionStrategy, ViewChild, Input, Output, NgModule } from '@angular/core';
import * as i3 from '@angular/common';
import { registerLocaleData, getLocaleDayNames, FormStyle, TranslationWidth, getLocaleMonthNames, getLocaleFirstDayOfWeek, getLocaleDateFormat, FormatWidth, formatDate, CommonModule } from '@angular/common';
import * as i4 from '@angular/forms';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import * as i2 from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerI18n, NgbDate, NgbDatepickerModule, NgbPopoverModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import * as i6 from '@angular/material/radio';
import { MatRadioModule } from '@angular/material/radio';
import * as i5 from '@angular/cdk/a11y';
import { A11yModule } from '@angular/cdk/a11y';

class PbdsDaterangeService {
    constructor(localeId) {
        this.localeId = localeId;
        this.locale = this.localeId.toLowerCase();
    }
    setLocale(locale) {
        this.locale = `${locale.language}-${locale.country}`.toLowerCase();
        // set the angular LOCALE_ID dynamically for ng-bootstrap datepicker
        registerLocaleData(locale.locale, this.locale);
    }
    getCurrentLocale() {
        return this.locale;
    }
    openPopover() {
    }
}
PbdsDaterangeService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangeService, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable });
PbdsDaterangeService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangeService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangeService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });

// Define custom service providing the months and weekdays translations
class CustomDatepickerI18n extends NgbDatepickerI18n {
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
CustomDatepickerI18n.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: CustomDatepickerI18n, deps: [{ token: PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Injectable });
CustomDatepickerI18n.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: CustomDatepickerI18n });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: CustomDatepickerI18n, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: PbdsDaterangeService }]; } });
class PbdsDaterangePopoverComponent {
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
PbdsDaterangePopoverComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangePopoverComponent, deps: [{ token: i2.NgbCalendar }, { token: PbdsDaterangeService }], target: i0.ɵɵFactoryTarget.Component });
PbdsDaterangePopoverComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: PbdsDaterangePopoverComponent, selector: "pbds-daterange-popover", inputs: { presets: "presets", presetSelected: "presetSelected", filters: "filters", filterSelected: "filterSelected", showCustomPreset: "showCustomPreset", applyText: "applyText", cancelText: "cancelText", container: "container", customRangeText: "customRangeText", displayMonths: "displayMonths", displayInput: "displayInput", minDate: "minDate", maxDate: "maxDate", placement: "placement", fromDate: "fromDate", toDate: "toDate", inputFormat: "inputFormat", ariaLabel: "ariaLabel", ariaLabelSelected: "ariaLabelSelected" }, outputs: { dateChange: "dateChange", cancel: "cancel" }, providers: [
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
            multi: true
        }
    ], viewQueries: [{ propertyName: "datepickerPopup", first: true, predicate: ["datepickerPopup"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"input-group pbds-daterange-popover\"\n     *ngIf=\"displayInput; else daterangeButton\">\n  <input *ngIf=\"displayInput\"\n         class=\"form-control\"\n         aria-label=\"Date\"\n         aria-readonly=\"true\"\n         [value]=\"dateRange\"\n         readonly=\"readonly\"\n         tabindex=\"-1\" />\n\n  <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n</div>\n\n<ng-template #daterangeButton>\n  <button class=\"btn btn-secondary\"\n          type=\"button\"\n          id=\"daterange-button\"\n          #datepickerPopup=\"ngbPopover\"\n          [ngbPopover]=\"daterangeContent\"\n          popoverClass=\"daterange-popover\"\n          autoClose=\"outside\"\n          [container]=\"container\"\n          [placement]=\"placement\"\n          [attr.aria-label]=\"ariaLabel\">\n    <i class=\"pbi-icon-mini pbi-calendar\"\n       aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\"\n       cdkTrapFocus\n       cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker #datepicker=\"ngbDatepicker\"\n                      [displayMonths]=\"displayMonths\"\n                      [minDate]=\"minDate\"\n                      [maxDate]=\"maxDate\"\n                      navigation=\"select\"\n                      outsideDays=\"hidden\"\n                      [firstDayOfWeek]=\"firstDayOfWeek\"\n                      [showWeekdays]=\"true\"\n                      [startDate]=\"startDate\"\n                      [dayTemplate]=\"t\"\n                      (dateSelect)=\"onDateSelection($event)\">\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t\n                   let-date\n                   let-focused=\"focused\">\n        <span class=\"custom-day\"\n              [class.focused]=\"focused\"\n              [class.range]=\"isRange(date)\"\n              [class.faded]=\"isHovered(date) || isInside(date)\"\n              (mouseenter)=\"hoveredDate = date\"\n              (mouseleave)=\"hoveredDate = null\">\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\"\n         [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\"\n           class=\"mb-3\"\n           ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\"\n                id=\"dateFilter\"\n                ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu\n             aria-labelledby=\"dateFilter\">\n          <button class=\"dropdown-item\"\n                  type=\"button\"\n                  *ngFor=\"let filter of filters; let index = index\"\n                  (click)=\"onFilterChange(filter, index)\">\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\"\n           class=\"flex-grow-1\">\n        <mat-radio-group aria-label=\"Select an option\"\n                         class=\"stacked-radio-group\"\n                         style=\"gap:4px;\"\n                         name=\"presets\"\n                         [(ngModel)]=\"presetSelected\"\n                         (change)=\"presetSelect($event)\">\n          <mat-radio-button *ngFor=\"let preset of presets\"\n                            [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\"\n                            [value]=\"'CUSTOM'\"\n                            (change)=\"showDatepicker()\">{{\n            customRangeText\n            }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\"\n           class=\"d-flex flex-column\"\n           style=\"gap:4px;\">\n        <button type=\"button\"\n                class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n                *ngFor=\"let preset of presets\"\n                (click)=\"presetClick(preset)\">\n          {{ preset.label }}\n        </button>\n\n        <button type=\"button\"\n                class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n                *ngIf=\"showCustomPreset\"\n                (click)=\"showDatepicker()\">\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\"\n           class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\"\n                type=\"button\"\n                (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\"\n                type=\"button\"\n                (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>", dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i4.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i5.CdkTrapFocus, selector: "[cdkTrapFocus]", inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"], exportAs: ["cdkTrapFocus"] }, { kind: "directive", type: i6.MatRadioGroup, selector: "mat-radio-group", exportAs: ["matRadioGroup"] }, { kind: "component", type: i6.MatRadioButton, selector: "mat-radio-button", inputs: ["disableRipple", "tabIndex"], exportAs: ["matRadioButton"] }, { kind: "component", type: i2.NgbDatepicker, selector: "ngb-datepicker", inputs: ["dayTemplate", "dayTemplateData", "displayMonths", "firstDayOfWeek", "footerTemplate", "markDisabled", "maxDate", "minDate", "navigation", "outsideDays", "showWeekNumbers", "startDate", "weekdays"], outputs: ["navigate", "dateSelect"], exportAs: ["ngbDatepicker"] }, { kind: "directive", type: i2.NgbPopover, selector: "[ngbPopover]", inputs: ["animation", "autoClose", "ngbPopover", "popoverTitle", "placement", "popperOptions", "triggers", "positionTarget", "container", "disablePopover", "popoverClass", "openDelay", "closeDelay"], outputs: ["shown", "hidden"], exportAs: ["ngbPopover"] }, { kind: "directive", type: i2.NgbDropdown, selector: "[ngbDropdown]", inputs: ["autoClose", "dropdownClass", "open", "placement", "popperOptions", "container", "display"], outputs: ["openChange"], exportAs: ["ngbDropdown"] }, { kind: "directive", type: i2.NgbDropdownToggle, selector: "[ngbDropdownToggle]" }, { kind: "directive", type: i2.NgbDropdownMenu, selector: "[ngbDropdownMenu]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangePopoverComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-daterange-popover', providers: [
                        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
                            multi: true
                        }
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"input-group pbds-daterange-popover\"\n     *ngIf=\"displayInput; else daterangeButton\">\n  <input *ngIf=\"displayInput\"\n         class=\"form-control\"\n         aria-label=\"Date\"\n         aria-readonly=\"true\"\n         [value]=\"dateRange\"\n         readonly=\"readonly\"\n         tabindex=\"-1\" />\n\n  <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n</div>\n\n<ng-template #daterangeButton>\n  <button class=\"btn btn-secondary\"\n          type=\"button\"\n          id=\"daterange-button\"\n          #datepickerPopup=\"ngbPopover\"\n          [ngbPopover]=\"daterangeContent\"\n          popoverClass=\"daterange-popover\"\n          autoClose=\"outside\"\n          [container]=\"container\"\n          [placement]=\"placement\"\n          [attr.aria-label]=\"ariaLabel\">\n    <i class=\"pbi-icon-mini pbi-calendar\"\n       aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\"\n       cdkTrapFocus\n       cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker #datepicker=\"ngbDatepicker\"\n                      [displayMonths]=\"displayMonths\"\n                      [minDate]=\"minDate\"\n                      [maxDate]=\"maxDate\"\n                      navigation=\"select\"\n                      outsideDays=\"hidden\"\n                      [firstDayOfWeek]=\"firstDayOfWeek\"\n                      [showWeekdays]=\"true\"\n                      [startDate]=\"startDate\"\n                      [dayTemplate]=\"t\"\n                      (dateSelect)=\"onDateSelection($event)\">\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t\n                   let-date\n                   let-focused=\"focused\">\n        <span class=\"custom-day\"\n              [class.focused]=\"focused\"\n              [class.range]=\"isRange(date)\"\n              [class.faded]=\"isHovered(date) || isInside(date)\"\n              (mouseenter)=\"hoveredDate = date\"\n              (mouseleave)=\"hoveredDate = null\">\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\"\n         [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\"\n           class=\"mb-3\"\n           ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\"\n                id=\"dateFilter\"\n                ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu\n             aria-labelledby=\"dateFilter\">\n          <button class=\"dropdown-item\"\n                  type=\"button\"\n                  *ngFor=\"let filter of filters; let index = index\"\n                  (click)=\"onFilterChange(filter, index)\">\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\"\n           class=\"flex-grow-1\">\n        <mat-radio-group aria-label=\"Select an option\"\n                         class=\"stacked-radio-group\"\n                         style=\"gap:4px;\"\n                         name=\"presets\"\n                         [(ngModel)]=\"presetSelected\"\n                         (change)=\"presetSelect($event)\">\n          <mat-radio-button *ngFor=\"let preset of presets\"\n                            [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\"\n                            [value]=\"'CUSTOM'\"\n                            (change)=\"showDatepicker()\">{{\n            customRangeText\n            }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\"\n           class=\"d-flex flex-column\"\n           style=\"gap:4px;\">\n        <button type=\"button\"\n                class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n                *ngFor=\"let preset of presets\"\n                (click)=\"presetClick(preset)\">\n          {{ preset.label }}\n        </button>\n\n        <button type=\"button\"\n                class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n                *ngIf=\"showCustomPreset\"\n                (click)=\"showDatepicker()\">\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\"\n           class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\"\n                type=\"button\"\n                (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\"\n                type=\"button\"\n                (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>" }]
        }], ctorParameters: function () { return [{ type: i2.NgbCalendar }, { type: PbdsDaterangeService }]; }, propDecorators: { datepickerPopup: [{
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

class PbdsDaterangePopoverModule {
}
PbdsDaterangePopoverModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangePopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsDaterangePopoverModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangePopoverModule, declarations: [PbdsDaterangePopoverComponent], imports: [CommonModule,
        FormsModule,
        A11yModule,
        MatRadioModule,
        NgbDatepickerModule,
        NgbPopoverModule,
        NgbDropdownModule], exports: [PbdsDaterangePopoverComponent] });
PbdsDaterangePopoverModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangePopoverModule, imports: [CommonModule,
        FormsModule,
        A11yModule,
        MatRadioModule,
        NgbDatepickerModule,
        NgbPopoverModule,
        NgbDropdownModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: PbdsDaterangePopoverModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsDaterangePopoverComponent],
                    imports: [
                        CommonModule,
                        FormsModule,
                        A11yModule,
                        MatRadioModule,
                        NgbDatepickerModule,
                        NgbPopoverModule,
                        NgbDropdownModule
                    ],
                    exports: [PbdsDaterangePopoverComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { CustomDatepickerI18n, PbdsDaterangePopoverComponent, PbdsDaterangePopoverModule, PbdsDaterangeService };
//# sourceMappingURL=pb-design-system-daterange-popover.mjs.map
