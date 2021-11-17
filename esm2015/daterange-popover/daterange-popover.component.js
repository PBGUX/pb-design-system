import { formatDate, FormatWidth, FormStyle, getLocaleDateFormat, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Injectable, Input, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { PbdsDaterangeService } from './daterange-popover.service';
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
CustomDatepickerI18n.decorators = [
    { type: Injectable }
];
CustomDatepickerI18n.ctorParameters = () => [
    { type: PbdsDaterangeService }
];
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
        var _a;
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
            (_a = this.datepickerPopup) === null || _a === void 0 ? void 0 : _a.close();
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
PbdsDaterangePopoverComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-daterange-popover',
                template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    *ngIf=\"displayInput\"\n    class=\"form-control\"\n    aria-label=\"Date\"\n    aria-readonly=\"true\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n  </div>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    type=\"button\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n    [container]=\"container\"\n    [placement]=\"placement\"\n    [attr.aria-label]=\"ariaLabel\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\" cdkTrapFocus cdkTrapFocusAutoCapture>\n    <div [hidden]=\"!isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker=\"ngbDatepicker\"\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (dateSelect)=\"onDateSelection($event)\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters && filters.length > 0\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            type=\"button\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange(filter, index)\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group\n          aria-label=\"Select an option\"\n          class=\"stacked-radio-group\"\n          name=\"presets\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"onApply()\">\n          {{ applyText }}\n        </button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n",
                providers: [
                    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PbdsDaterangePopoverComponent),
                        multi: true
                    }
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
PbdsDaterangePopoverComponent.ctorParameters = () => [
    { type: NgbCalendar },
    { type: PbdsDaterangeService }
];
PbdsDaterangePopoverComponent.propDecorators = {
    datepickerPopup: [{ type: ViewChild, args: ['datepickerPopup', { static: false },] }],
    presets: [{ type: Input }],
    presetSelected: [{ type: Input }],
    filters: [{ type: Input }],
    filterSelected: [{ type: Input }],
    showCustomPreset: [{ type: Input }],
    applyText: [{ type: Input }],
    cancelText: [{ type: Input }],
    container: [{ type: Input }],
    customRangeText: [{ type: Input }],
    displayMonths: [{ type: Input }],
    displayInput: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    placement: [{ type: Input }],
    fromDate: [{ type: Input }],
    toDate: [{ type: Input }],
    inputFormat: [{ type: Input }],
    ariaLabel: [{ type: Input }],
    ariaLabelSelected: [{ type: Input }],
    dateChange: [{ type: Output }],
    cancel: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRlcmFuZ2UtcG9wb3Zlci9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFVBQVUsRUFDVixXQUFXLEVBQ1gsU0FBUyxFQUNULG1CQUFtQixFQUNuQixpQkFBaUIsRUFDakIsdUJBQXVCLEVBQ3ZCLG1CQUFtQixFQUNuQixnQkFBZ0IsRUFDakIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFVBQVUsRUFDVixLQUFLLEVBR0wsTUFBTSxFQUVOLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQTZCLE1BQU0sNEJBQTRCLENBQUM7QUFRaEgsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFbkUsdUVBQXVFO0FBRXZFLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxpQkFBaUI7SUFDekQsWUFBbUIsZ0JBQXNDO1FBQ3ZELEtBQUssRUFBRSxDQUFDO1FBRFMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFzQjtJQUV6RCxDQUFDO0lBRUQsZUFBZSxDQUFDLE9BQWU7UUFDN0Isc0RBQXNEO1FBQ3RELE9BQU8sR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUV0QyxlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLDhDQUE4QztRQUM5QyxhQUFhO1FBQ2IsNkhBQTZIO1FBQzdILEtBQUs7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QztZQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDaEM7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQzs7O1lBaFpGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyw0NElBQWlEO2dCQUNqRCxTQUFTLEVBQUU7b0JBQ1QsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFFO29CQUM5RDt3QkFDRSxPQUFPLEVBQUUsaUJBQWlCO3dCQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDZCQUE2QixDQUFDO3dCQUM1RCxLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFDRjtnQkFFRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O1lBakVRLFdBQVc7WUFRWCxvQkFBb0I7Ozs4QkEyRDFCLFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7c0JBRTlDLEtBQUs7NkJBd0JMLEtBQUs7c0JBR0wsS0FBSzs2QkFHTCxLQUFLOytCQUdMLEtBQUs7d0JBR0wsS0FBSzt5QkFHTCxLQUFLO3dCQUdMLEtBQUs7OEJBR0wsS0FBSzs0QkFHTCxLQUFLOzJCQUdMLEtBQUs7c0JBR0wsS0FBSztzQkFHTCxLQUFLO3dCQUdMLEtBQUs7dUJBR0wsS0FBSztxQkFHTCxLQUFLOzBCQUdMLEtBQUs7d0JBR0wsS0FBSztnQ0FHTCxLQUFLO3lCQUdMLE1BQU07cUJBR04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGZvcm1hdERhdGUsXG4gIEZvcm1hdFdpZHRoLFxuICBGb3JtU3R5bGUsXG4gIGdldExvY2FsZURhdGVGb3JtYXQsXG4gIGdldExvY2FsZURheU5hbWVzLFxuICBnZXRMb2NhbGVGaXJzdERheU9mV2VlayxcbiAgZ2V0TG9jYWxlTW9udGhOYW1lcyxcbiAgVHJhbnNsYXRpb25XaWR0aFxufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3RhYmxlLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTmdiQ2FsZW5kYXIsIE5nYkRhdGUsIE5nYkRhdGVwaWNrZXJJMThuLCBOZ2JEYXRlU3RydWN0LCBOZ2JQb3BvdmVyIH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHtcbiAgUGJkc0RhdGVyYW5nZUNoYW5nZSxcbiAgUGJkc0RhdGVyYW5nZUZpbHRlcixcbiAgUGJkc0RhdGVyYW5nZVBsYWNlbWVudCxcbiAgUGJkc0RhdGVyYW5nZVByZXNldCxcbiAgUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlXG59IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQYmRzRGF0ZXJhbmdlU2VydmljZSB9IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZSc7XG5cbi8vIERlZmluZSBjdXN0b20gc2VydmljZSBwcm92aWRpbmcgdGhlIG1vbnRocyBhbmQgd2Vla2RheXMgdHJhbnNsYXRpb25zXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGF0ZXBpY2tlckkxOG4gZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXRXZWVrZGF5TGFiZWwod2Vla2RheTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAvLyBmb3IgbmctYm9vdHN0cmFwLCBzdW5kYXkgbnVtYmVyIG9mIDcgY29udmVydGVkIHRvIDBcbiAgICB3ZWVrZGF5ID0gd2Vla2RheSA9PT0gNyA/IDAgOiB3ZWVrZGF5O1xuXG4gICAgLy8gY29uc29sZS5sb2coXG4gICAgLy8gICAnd2Vla2RheTogJyxcbiAgICAvLyAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksXG4gICAgLy8gICB3ZWVrZGF5LFxuICAgIC8vICAgZ2V0TG9jYWxlRGF5TmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWQpW3dlZWtkYXldXG4gICAgLy8gKTtcblxuICAgIHJldHVybiBnZXRMb2NhbGVEYXlOYW1lcyhcbiAgICAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksXG4gICAgICBGb3JtU3R5bGUuU3RhbmRhbG9uZSxcbiAgICAgIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWRcbiAgICApW3dlZWtkYXldO1xuICB9XG5cbiAgZ2V0TW9udGhTaG9ydE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0TW9udGhGdWxsTmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0TG9jYWxlTW9udGhOYW1lcyh0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5XaWRlKVtcbiAgICAgIG1vbnRoIC0gMVxuICAgIF07XG4gIH1cblxuICBnZXREYXlBcmlhTGFiZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke2RhdGUuZGF5fS0ke2RhdGUubW9udGh9LSR7ZGF0ZS55ZWFyfWA7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRlcmFuZ2UtcG9wb3ZlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQuaHRtbCcsXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogTmdiRGF0ZXBpY2tlckkxOG4sIHVzZUNsYXNzOiBDdXN0b21EYXRlcGlja2VySTE4biB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGJkc0RhdGVyYW5nZVBvcG92ZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9XG4gIF0sXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgQFZpZXdDaGlsZCgnZGF0ZXBpY2tlclBvcHVwJywgeyBzdGF0aWM6IGZhbHNlIH0pIHByaXZhdGUgZGF0ZXBpY2tlclBvcHVwOiBOZ2JQb3BvdmVyO1xuXG4gIEBJbnB1dCgpXG4gIHByZXNldHM6IEFycmF5PFBiZHNEYXRlcmFuZ2VQcmVzZXQ+ID0gW1xuICAgIHtcbiAgICAgIGxhYmVsOiAnQWxsIERhdGVzJyxcbiAgICAgIHZhbHVlOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ0xhc3QgNyBEYXlzJyxcbiAgICAgIHZhbHVlOiA3XG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ0xhc3QgMzAgRGF5cycsXG4gICAgICB2YWx1ZTogMzBcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnUHJldmlvdXMgTW9udGgnLFxuICAgICAgdmFsdWU6ICdQUkVWSU9VU19NT05USCdcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnWWVhciB0byBEYXRlJyxcbiAgICAgIHZhbHVlOiAnWUVBUl9UT19EQVRFJ1xuICAgIH1cbiAgXTtcblxuICBASW5wdXQoKVxuICBwcmVzZXRTZWxlY3RlZDogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBmaWx0ZXJzOiBBcnJheTxQYmRzRGF0ZXJhbmdlRmlsdGVyPjtcblxuICBASW5wdXQoKVxuICBmaWx0ZXJTZWxlY3RlZCA9IDA7XG5cbiAgQElucHV0KClcbiAgc2hvd0N1c3RvbVByZXNldCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgYXBwbHlUZXh0ID0gJ0FwcGx5JztcblxuICBASW5wdXQoKVxuICBjYW5jZWxUZXh0ID0gJ0NhbmNlbCc7XG5cbiAgQElucHV0KClcbiAgY29udGFpbmVyOiBudWxsIHwgJ2JvZHknID0gJ2JvZHknO1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVJhbmdlVGV4dCA9ICdDdXN0b20gUmFuZ2UnO1xuXG4gIEBJbnB1dCgpXG4gIGRpc3BsYXlNb250aHMgPSAyO1xuXG4gIEBJbnB1dCgpXG4gIGRpc3BsYXlJbnB1dCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgbWluRGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCksICd5Jyk7XG5cbiAgQElucHV0KClcbiAgbWF4RGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKTtcblxuICBASW5wdXQoKVxuICBwbGFjZW1lbnQ6IFBiZHNEYXRlcmFuZ2VQbGFjZW1lbnQgPSAnYm90dG9tLXJpZ2h0IGF1dG8nO1xuXG4gIEBJbnB1dCgpXG4gIGZyb21EYXRlOiBOZ2JEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9EYXRlOiBOZ2JEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgaW5wdXRGb3JtYXQgPSAne2Zyb21EYXRlfSB0byB7dG9EYXRlfSc7XG5cbiAgQElucHV0KClcbiAgYXJpYUxhYmVsID0gJ09wZW4gZGF0ZSBwaWNrZXInO1xuXG4gIEBJbnB1dCgpXG4gIGFyaWFMYWJlbFNlbGVjdGVkID0gJ09wZW4gZGF0ZSBwaWNrZXIsIHNlbGVjdGVkIHJhbmdlIGlzIHtzZWxlY3RlZFJhbmdlfSc7XG5cbiAgQE91dHB1dCgpXG4gIGRhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPFBiZHNEYXRlcmFuZ2VDaGFuZ2U+KCk7XG5cbiAgQE91dHB1dCgpXG4gIGNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGZpcnN0RGF5T2ZXZWVrID0gZ2V0TG9jYWxlRmlyc3REYXlPZldlZWsodGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSk7XG5cbiAgaG92ZXJlZERhdGU6IE5nYkRhdGU7XG5cbiAgZGF0ZVJhbmdlID0gJyc7XG4gIGlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgc2VsZWN0ZWRGaWx0ZXI7XG4gIHN0YXJ0RGF0ZTogTmdiRGF0ZTtcbiAgZm9ybWF0dGVkRGF0ZTtcbiAgZW1pdFZhbHVlOiBQYmRzRGF0ZXJhbmdlQ2hhbmdlO1xuXG4gIHByaXZhdGUgb25Ub3VjaGVkOiBhbnkgPSAoKSA9PiB7fTtcbiAgcHJpdmF0ZSBvbkNoYW5nZSA9IChvYmo6IGFueSkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIHByaXZhdGUgZGF0ZXJhbmdlU2VydmljZTogUGJkc0RhdGVyYW5nZVNlcnZpY2UpIHtcbiAgICB0aGlzLndyaXRlVmFsdWUodGhpcy5lbWl0VmFsdWUpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gY2hpbmEgc2hvdWxkIHN0YXJ0IG9uIGEgTW9uZGF5LCBBbmd1bGFyIGxvY2FsZSByZXR1cm5zIGluY29ycmVjdCAwXG4gICAgdGhpcy5maXJzdERheU9mV2VlayA9XG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpID09PSAnemgtY24nID8gdGhpcy5maXJzdERheU9mV2VlayArIDEgOiB0aGlzLmZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdDVVNUT00nKSB7XG4gICAgICB0aGlzLnNob3dEYXRlcGlja2VyKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJlc2V0cykge1xuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldENsaWNrKFxuICAgICAgICAgIHRoaXMucHJlc2V0cy5maW5kKChwLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09PSB0aGlzLnByZXNldFNlbGVjdGVkO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICAgICAgdGhpcy5vbkFwcGx5KGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm9uQXBwbHkoZmFsc2UpO1xuICB9XG5cbiAgLy8gcHJvZ3JhbW1hdGljYWxseSB3cml0aW5nIHRoZSB2YWx1ZVxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdXUklURSBWQUxVRTogJywgdmFsdWUpO1xuXG4gICAgICBjb25zdCBmaWx0ZXJJbmRleCA9IHRoaXMuZmlsdGVycy5maW5kSW5kZXgoKGZpbHRlcikgPT4ge1xuICAgICAgICByZXR1cm4gZmlsdGVyLmZpZWxkID09PSB2YWx1ZS5maWx0ZXI7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5mcm9tRGF0ZSA9IHZhbHVlLmZyb21EYXRlO1xuICAgICAgdGhpcy50b0RhdGUgPSB2YWx1ZS50b0RhdGU7XG4gICAgICB0aGlzLmZvcm1hdHRlZERhdGUgPSB2YWx1ZS5mb3JtYXR0ZWREYXRlO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlLnZhbHVlO1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1tmaWx0ZXJJbmRleF07XG4gICAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB0aGlzLnByZXNldFNlbGVjdGVkID09PSAnQ1VTVE9NJyA/IHRydWUgOiBmYWxzZTtcblxuICAgICAgdGhpcy5vbkFwcGx5KCk7XG4gICAgfVxuICB9XG5cbiAgLy8gbWV0aG9kIHRvIGJlIHRyaWdnZXJlZCBvbiBVSSBjaGFuZ2VcbiAgcmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZTogYW55KSB7XG4gICAgLy8gY29uc29sZS5sb2coJ09OQ0hBTkdFOiAnLCB0aGlzLmVtaXRWYWx1ZSk7XG4gICAgdGhpcy5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xuICB9XG5cbiAgLy8gbWV0aG9kIHRvIGJlIHRyaWdnZXJlZCBvbiBjb21wb25lbnQgdG91Y2hcbiAgcmVnaXN0ZXJPblRvdWNoZWQob25Ub3VjaGVkOiAoKSA9PiB2b2lkKSB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBvblRvdWNoZWQ7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbdGhpcy5maWx0ZXJTZWxlY3RlZF07XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMucHJlc2V0cykge1xuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldENsaWNrKFxuICAgICAgICAgIHRoaXMucHJlc2V0cy5maW5kKChwLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09PSB0aGlzLnByZXNldFNlbGVjdGVkO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICAgICAgdGhpcy5vbkFwcGx5KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgKGNoYW5nZXMudG9UZXh0ICYmIGNoYW5nZXMudG9UZXh0LmZpcnN0Q2hhbmdlID09PSBmYWxzZSkge1xuICAgIC8vICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gIH1cblxuICBvbkFwcGx5KHNob3VsZEVtaXQgPSB0cnVlKSB7XG4gICAgLy8gaWYgb25seSBhIENVU1RPTSBzdGFydCBkYXRlIGlzIHNlbGVjdGVkLCBzZXQgdGhlIGVuZCBkYXRlIHRvIHRoZSBzdGFydCBkYXRlIChpLmUgc2VsZWN0IGEgc2luZ2xlIGRheSlcbiAgICBpZiAoIXRoaXMudG9EYXRlKSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IHRoaXMuZnJvbURhdGU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG5cbiAgICB0aGlzLmVtaXRWYWx1ZSA9IHtcbiAgICAgIGZyb21EYXRlOiB0aGlzLmZyb21EYXRlLFxuICAgICAgdG9EYXRlOiB0aGlzLnRvRGF0ZSxcbiAgICAgIGZvcm1hdHRlZERhdGU6IHRoaXMuZm9ybWF0dGVkRGF0ZSxcbiAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJzICYmIHRoaXMuZmlsdGVycy5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3RlZEZpbHRlci5maWVsZCA6IG51bGwsXG4gICAgICB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZFxuICAgIH07XG5cbiAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZnJvbURhdGU7XG5cbiAgICBpZiAoc2hvdWxkRW1pdCkge1xuICAgICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQodGhpcy5lbWl0VmFsdWUpO1xuXG4gICAgICB0aGlzLmRhdGVwaWNrZXJQb3B1cD8uY2xvc2UoKTtcblxuICAgICAgdGhpcy5hcmlhTGFiZWwgPSB0aGlzLmFyaWFMYWJlbEZvcm1hdCgpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5vbkNoYW5nZSh0aGlzLmVtaXRWYWx1ZSksIDApO1xuICB9XG5cbiAgb25DYW5jZWwoKSB7XG4gICAgdGhpcy5kYXRlcGlja2VyUG9wdXAuY2xvc2UoKTtcblxuICAgIHRoaXMuY2FuY2VsLmVtaXQoKTtcbiAgfVxuXG4gIG9uRGF0ZVNlbGVjdGlvbihkYXRlOiBOZ2JEYXRlKSB7XG4gICAgaWYgKCF0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSkge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IGRhdGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSAmJiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpKSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBkYXRlO1xuICAgIH1cblxuICAgIC8vIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgcHJlc2V0U2VsZWN0ID0gKCRldmVudDogUGFydGlhbDxQYmRzRGF0ZXJhbmdlUHJlc2V0PikgPT4ge1xuICAgIGlmICgkZXZlbnQudmFsdWUgPT09ICdDVVNUT00nKSB7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gJ0NVU1RPTSc7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuc2V0RGF0ZVByb3BlcnRpZXMoJGV2ZW50LnZhbHVlKTtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgfTtcblxuICBwcmVzZXRDbGljayhwcmVzZXQ6IFBiZHNEYXRlcmFuZ2VQcmVzZXQpIHtcbiAgICBpZiAocHJlc2V0KSB7XG4gICAgICBpZiAocHJlc2V0LnZhbHVlID09PSAnQ1VTVE9NJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLnNldERhdGVQcm9wZXJ0aWVzKHByZXNldC52YWx1ZSk7XG4gICAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgICAgIHRoaXMub25BcHBseSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Rm9ybWF0dGVkRGF0ZShkYXRlOiBOZ2JEYXRlKSB7XG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIGNvbnN0IGxvY2FsZSA9IHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCk7XG4gICAgICBjb25zdCBkYXRlRm9ybWF0ID0gZ2V0TG9jYWxlRGF0ZUZvcm1hdChsb2NhbGUsIEZvcm1hdFdpZHRoLlNob3J0KTtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGAke2RhdGUubW9udGh9LyR7ZGF0ZS5kYXl9LyR7ZGF0ZS55ZWFyfWAsIGRhdGVGb3JtYXQsIGxvY2FsZSk7XG4gICAgICByZXR1cm4gZm9ybWF0dGVkRGF0ZTtcbiAgICB9XG4gIH1cblxuICBpc0hvdmVyZWQgPSAoZGF0ZTogTmdiRGF0ZSkgPT5cbiAgICB0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSAmJiB0aGlzLmhvdmVyZWREYXRlICYmIGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkgJiYgZGF0ZS5iZWZvcmUodGhpcy5ob3ZlcmVkRGF0ZSk7XG5cbiAgaXNJbnNpZGUgPSAoZGF0ZTogTmdiRGF0ZSkgPT4gZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSAmJiBkYXRlLmJlZm9yZSh0aGlzLnRvRGF0ZSk7XG5cbiAgaXNSYW5nZSA9IChkYXRlOiBOZ2JEYXRlKSA9PlxuICAgIGRhdGUuZXF1YWxzKHRoaXMuZnJvbURhdGUpIHx8IGRhdGUuZXF1YWxzKHRoaXMudG9EYXRlKSB8fCB0aGlzLmlzSW5zaWRlKGRhdGUpIHx8IHRoaXMuaXNIb3ZlcmVkKGRhdGUpO1xuXG4gIHNob3dEYXRlcGlja2VyKCkge1xuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogJ0NVU1RPTScgfSk7XG4gIH1cblxuICBvbkZpbHRlckNoYW5nZShmaWx0ZXIsIGluZGV4KSB7XG4gICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1tpbmRleF07XG4gIH1cblxuICBzZXRQcmVzZXQodmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSkge1xuICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkIH0pO1xuICAgIHRoaXMub25BcHBseSgpO1xuICB9XG5cbiAgc2V0RmlsdGVyKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5maWx0ZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGVSYW5nZSh2YWx1ZSkge1xuICAgIHRoaXMuZnJvbURhdGUgPSBuZXcgTmdiRGF0ZSh2YWx1ZS5mcm9tRGF0ZS55ZWFyLCB2YWx1ZS5mcm9tRGF0ZS5tb250aCwgdmFsdWUuZnJvbURhdGUuZGF5KTtcbiAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHZhbHVlLnRvRGF0ZS55ZWFyLCB2YWx1ZS50b0RhdGUubW9udGgsIHZhbHVlLnRvRGF0ZS5kYXkpO1xuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IHZhbHVlLnZhbHVlID09PSAnQ1VTVE9NJztcbiAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWUudmFsdWU7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLmZpbHRlclNlbGVjdGVkID0gdGhpcy5maWx0ZXJzLmZpbmRJbmRleCgoZikgPT4gZi5maWVsZCA9PT0gdmFsdWUuZmlsdGVyKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbdGhpcy5maWx0ZXJTZWxlY3RlZF07XG4gICAgfVxuXG4gICAgdGhpcy5vbkFwcGx5KCk7XG4gIH1cblxuICBwcml2YXRlIHNldElucHV0TGFiZWwoKSB7XG4gICAgaWYgKHRoaXMucHJlc2V0cykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLnByZXNldHMuZmluZCgocCkgPT4gcC52YWx1ZSA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZCk7XG5cbiAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICBpZiAodGhpcy5mcm9tRGF0ZSA9PT0gbnVsbCB8fCB0aGlzLnRvRGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gc2VsZWN0ZWQubGFiZWw7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gbnVsbCB8fCAodGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gbnVsbCAmJiB0aGlzLnByZXNldFNlbGVjdGVkICE9PSAnQ1VTVE9NJykpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gdGhpcy5kYXRlRm9ybWF0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ0NVU1RPTScgJiYgdGhpcy5mcm9tRGF0ZSAmJiB0aGlzLnRvRGF0ZSkge1xuICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5kYXRlUmFuZ2UgIT09ICcnKSB7XG4gICAgICAgIHRoaXMuZm9ybWF0dGVkRGF0ZSA9IHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA/IHRoaXMuZGF0ZUZvcm1hdCgpIDogdGhpcy5kYXRlUmFuZ2U7XG4gICAgICAgIHRoaXMuYXJpYUxhYmVsID0gdGhpcy5hcmlhTGFiZWxGb3JtYXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGVGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRGb3JtYXRcbiAgICAgIC5yZXBsYWNlKCd7ZnJvbURhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMuZnJvbURhdGUpKVxuICAgICAgLnJlcGxhY2UoJ3t0b0RhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMudG9EYXRlKSk7XG4gIH1cblxuICBwcml2YXRlIGFyaWFMYWJlbEZvcm1hdCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcmlhTGFiZWxTZWxlY3RlZC5yZXBsYWNlKCd7c2VsZWN0ZWRSYW5nZX0nLCB0aGlzLmZvcm1hdHRlZERhdGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXlzSW5Nb250aCh5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnJvbUFuZFRvRGF0ZXModmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSk6IHsgZnJvbTogTmdiRGF0ZVN0cnVjdDsgdG86IE5nYkRhdGVTdHJ1Y3QgfSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICAgIGNvbnN0IGN1cnJlbnREYXkgPSBub3cuZ2V0RGF0ZSgpO1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgJ1BSRVZJT1VTX01PTlRIJzpcbiAgICAgICAgY29uc3QgeWVhciA9IGN1cnJlbnRNb250aCA+IDAgPyBjdXJyZW50WWVhciA6IGN1cnJlbnRZZWFyIC0gMTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjdXJyZW50TW9udGggPiAwID8gY3VycmVudE1vbnRoIDogMTI7XG4gICAgICAgIGNvbnN0IGRheSA9IDE7XG4gICAgICAgIGNvbnN0IGxhc3REYXkgPSB0aGlzLmdldERheXNJbk1vbnRoKHllYXIsIG1vbnRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmcm9tOiB7IHllYXIsIG1vbnRoLCBkYXkgfSxcbiAgICAgICAgICB0bzogeyB5ZWFyLCBtb250aCwgZGF5OiBsYXN0RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGNhc2UgJ1lFQVJfVE9fREFURSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnJvbTogeyB5ZWFyOiBjdXJyZW50WWVhciwgbW9udGg6IDEsIGRheTogMSB9LFxuICAgICAgICAgIHRvOiB7IHllYXI6IGN1cnJlbnRZZWFyLCBtb250aDogY3VycmVudE1vbnRoICsgMSwgZGF5OiBjdXJyZW50RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB7IGZyb206IG51bGwsIHRvOiBudWxsIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXREYXRlUHJvcGVydGllcyh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAnUFJFVklPVVNfTU9OVEgnIHx8IHZhbHVlID09PSAnWUVBUl9UT19EQVRFJykge1xuICAgICAgY29uc3QgeyBmcm9tLCB0byB9ID0gdGhpcy5nZXRGcm9tQW5kVG9EYXRlcyh2YWx1ZSk7XG4gICAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUoZnJvbS55ZWFyLCBmcm9tLm1vbnRoLCBmcm9tLmRheSk7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHRvLnllYXIsIHRvLm1vbnRoLCB0by5kYXkpO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLnRvRGF0ZSwgJ2QnLCBOdW1iZXIodmFsdWUpKTtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5mcm9tRGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==