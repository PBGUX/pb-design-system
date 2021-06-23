import { Component, Injectable, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { getLocaleDayNames, getLocaleMonthNames, getLocaleFirstDayOfWeek, FormStyle, TranslationWidth, getLocaleDateFormat, FormatWidth, formatDate } from '@angular/common';
import { NgbDate, NgbCalendar, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { PbdsDaterangeService } from './daterange-popover.service';
// Define custom service providing the months and weekdays translations
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    constructor(daterangeService) {
        super();
        this.daterangeService = daterangeService;
    }
    getWeekdayShortName(weekday) {
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
        this.setInputLabel();
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
        if (shouldEmit) {
            this.dateChange.emit({
                fromDate: this.fromDate,
                toDate: this.toDate,
                formattedDate: this.formattedDate,
                filter: this.filters && this.filters.length > 0 ? this.selectedFilter.field : null,
                value: this.presetSelected
            });
            (_a = this.datepickerPopup) === null || _a === void 0 ? void 0 : _a.close();
            this.ariaLabel = this.ariaLabelFormat();
        }
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
                providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9kYXRlcmFuZ2UtcG9wb3Zlci9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUdaLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLG1CQUFtQixFQUNuQix1QkFBdUIsRUFDdkIsU0FBUyxFQUNULGdCQUFnQixFQUNoQixtQkFBbUIsRUFDbkIsV0FBVyxFQUNYLFVBQVUsRUFDWCxNQUFNLGlCQUFpQixDQUFDO0FBRXpCLE9BQU8sRUFFTCxPQUFPLEVBQ1AsV0FBVyxFQUNYLGlCQUFpQixFQUVsQixNQUFNLDRCQUE0QixDQUFDO0FBU3BDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRW5FLHVFQUF1RTtBQUV2RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsaUJBQWlCO0lBQ3pELFlBQW1CLGdCQUFzQztRQUN2RCxLQUFLLEVBQUUsQ0FBQztRQURTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7SUFFekQsQ0FBQztJQUVELG1CQUFtQixDQUFDLE9BQWU7UUFDakMsc0RBQXNEO1FBQ3RELE9BQU8sR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUV0QyxlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLDhDQUE4QztRQUM5QyxhQUFhO1FBQ2IsNkhBQTZIO1FBQzdILEtBQUs7UUFFTCxPQUFPLGlCQUFpQixDQUN0QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVB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NDRJQUFpRDtnQkFDakQsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFFLENBQUM7Z0JBRTNFLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7WUE5REMsV0FBVztZQVlKLG9CQUFvQjs7OzhCQW9EMUIsU0FBUyxTQUFDLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtzQkFFOUMsS0FBSzs2QkF3QkwsS0FBSztzQkFHTCxLQUFLOzZCQUdMLEtBQUs7K0JBR0wsS0FBSzt3QkFHTCxLQUFLO3lCQUdMLEtBQUs7d0JBR0wsS0FBSzs4QkFHTCxLQUFLOzRCQUdMLEtBQUs7MkJBR0wsS0FBSztzQkFHTCxLQUFLO3NCQUdMLEtBQUs7d0JBR0wsS0FBSzt1QkFHTCxLQUFLO3FCQUdMLEtBQUs7MEJBR0wsS0FBSzt3QkFHTCxLQUFLO2dDQUdMLEtBQUs7eUJBR0wsTUFBTTtxQkFHTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbmplY3RhYmxlLFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBnZXRMb2NhbGVEYXlOYW1lcyxcbiAgZ2V0TG9jYWxlTW9udGhOYW1lcyxcbiAgZ2V0TG9jYWxlRmlyc3REYXlPZldlZWssXG4gIEZvcm1TdHlsZSxcbiAgVHJhbnNsYXRpb25XaWR0aCxcbiAgZ2V0TG9jYWxlRGF0ZUZvcm1hdCxcbiAgRm9ybWF0V2lkdGgsXG4gIGZvcm1hdERhdGVcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtcbiAgTmdiUG9wb3ZlcixcbiAgTmdiRGF0ZSxcbiAgTmdiQ2FsZW5kYXIsXG4gIE5nYkRhdGVwaWNrZXJJMThuLFxuICBOZ2JEYXRlU3RydWN0XG59IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcblxuaW1wb3J0IHtcbiAgUGJkc0RhdGVyYW5nZVByZXNldCxcbiAgUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlLFxuICBQYmRzRGF0ZXJhbmdlRmlsdGVyLFxuICBQYmRzRGF0ZXJhbmdlQ2hhbmdlLFxuICBQYmRzRGF0ZXJhbmdlUGxhY2VtZW50XG59IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQYmRzRGF0ZXJhbmdlU2VydmljZSB9IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZSc7XG5cbi8vIERlZmluZSBjdXN0b20gc2VydmljZSBwcm92aWRpbmcgdGhlIG1vbnRocyBhbmQgd2Vla2RheXMgdHJhbnNsYXRpb25zXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGF0ZXBpY2tlckkxOG4gZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXRXZWVrZGF5U2hvcnROYW1lKHdlZWtkYXk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gZm9yIG5nLWJvb3RzdHJhcCwgc3VuZGF5IG51bWJlciBvZiA3IGNvbnZlcnRlZCB0byAwXG4gICAgd2Vla2RheSA9IHdlZWtkYXkgPT09IDcgPyAwIDogd2Vla2RheTtcblxuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3dlZWtkYXk6ICcsXG4gICAgLy8gICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgIC8vICAgd2Vla2RheSxcbiAgICAvLyAgIGdldExvY2FsZURheU5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkKVt3ZWVrZGF5XVxuICAgIC8vICk7XG5cbiAgICByZXR1cm4gZ2V0TG9jYWxlRGF5TmFtZXMoXG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgICAgRm9ybVN0eWxlLlN0YW5kYWxvbmUsXG4gICAgICBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkXG4gICAgKVt3ZWVrZGF5XTtcbiAgfVxuXG4gIGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBnZXRMb2NhbGVNb250aE5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLldpZGUpW1xuICAgICAgbW9udGggLSAxXG4gICAgXTtcbiAgfVxuXG4gIGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtkYXRlLmRheX0tJHtkYXRlLm1vbnRofS0ke2RhdGUueWVhcn1gO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0ZXJhbmdlLXBvcG92ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5nYkRhdGVwaWNrZXJJMThuLCB1c2VDbGFzczogQ3VzdG9tRGF0ZXBpY2tlckkxOG4gfV0sXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBAVmlld0NoaWxkKCdkYXRlcGlja2VyUG9wdXAnLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJpdmF0ZSBkYXRlcGlja2VyUG9wdXA6IE5nYlBvcG92ZXI7XG5cbiAgQElucHV0KClcbiAgcHJlc2V0czogQXJyYXk8UGJkc0RhdGVyYW5nZVByZXNldD4gPSBbXG4gICAge1xuICAgICAgbGFiZWw6ICdBbGwgRGF0ZXMnLFxuICAgICAgdmFsdWU6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTGFzdCA3IERheXMnLFxuICAgICAgdmFsdWU6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTGFzdCAzMCBEYXlzJyxcbiAgICAgIHZhbHVlOiAzMFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdQcmV2aW91cyBNb250aCcsXG4gICAgICB2YWx1ZTogJ1BSRVZJT1VTX01PTlRIJ1xuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdZZWFyIHRvIERhdGUnLFxuICAgICAgdmFsdWU6ICdZRUFSX1RPX0RBVEUnXG4gICAgfVxuICBdO1xuXG4gIEBJbnB1dCgpXG4gIHByZXNldFNlbGVjdGVkOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWUgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGZpbHRlcnM6IEFycmF5PFBiZHNEYXRlcmFuZ2VGaWx0ZXI+O1xuXG4gIEBJbnB1dCgpXG4gIGZpbHRlclNlbGVjdGVkID0gMDtcblxuICBASW5wdXQoKVxuICBzaG93Q3VzdG9tUHJlc2V0ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBhcHBseVRleHQgPSAnQXBwbHknO1xuXG4gIEBJbnB1dCgpXG4gIGNhbmNlbFRleHQgPSAnQ2FuY2VsJztcblxuICBASW5wdXQoKVxuICBjb250YWluZXI6IG51bGwgfCAnYm9keScgPSAnYm9keSc7XG5cbiAgQElucHV0KClcbiAgY3VzdG9tUmFuZ2VUZXh0ID0gJ0N1c3RvbSBSYW5nZSc7XG5cbiAgQElucHV0KClcbiAgZGlzcGxheU1vbnRocyA9IDI7XG5cbiAgQElucHV0KClcbiAgZGlzcGxheUlucHV0ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBtaW5EYXRlOiBOZ2JEYXRlID0gdGhpcy5jYWxlbmRhci5nZXRQcmV2KHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKSwgJ3knKTtcblxuICBASW5wdXQoKVxuICBtYXhEYXRlOiBOZ2JEYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuXG4gIEBJbnB1dCgpXG4gIHBsYWNlbWVudDogUGJkc0RhdGVyYW5nZVBsYWNlbWVudCA9ICdib3R0b20tcmlnaHQgYXV0byc7XG5cbiAgQElucHV0KClcbiAgZnJvbURhdGU6IE5nYkRhdGUgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICB0b0RhdGU6IE5nYkRhdGUgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBpbnB1dEZvcm1hdCA9ICd7ZnJvbURhdGV9IHRvIHt0b0RhdGV9JztcblxuICBASW5wdXQoKVxuICBhcmlhTGFiZWwgPSAnT3BlbiBkYXRlIHBpY2tlcic7XG5cbiAgQElucHV0KClcbiAgYXJpYUxhYmVsU2VsZWN0ZWQgPSAnT3BlbiBkYXRlIHBpY2tlciwgc2VsZWN0ZWQgcmFuZ2UgaXMge3NlbGVjdGVkUmFuZ2V9J1xuXG4gIEBPdXRwdXQoKVxuICBkYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYmRzRGF0ZXJhbmdlQ2hhbmdlPigpO1xuXG4gIEBPdXRwdXQoKVxuICBjYW5jZWwgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBmaXJzdERheU9mV2VlayA9IGdldExvY2FsZUZpcnN0RGF5T2ZXZWVrKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCkpO1xuXG4gIGhvdmVyZWREYXRlOiBOZ2JEYXRlO1xuXG4gIGRhdGVSYW5nZSA9ICcnO1xuICBpc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gIHNlbGVjdGVkRmlsdGVyO1xuICBzdGFydERhdGU6IE5nYkRhdGU7XG4gIGZvcm1hdHRlZERhdGU7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIHByaXZhdGUgZGF0ZXJhbmdlU2VydmljZTogUGJkc0RhdGVyYW5nZVNlcnZpY2UpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGNoaW5hIHNob3VsZCBzdGFydCBvbiBhIE1vbmRheSwgQW5ndWxhciBsb2NhbGUgcmV0dXJucyBpbmNvcnJlY3QgMFxuICAgIHRoaXMuZmlyc3REYXlPZldlZWsgPVxuICAgICAgdGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSA9PT0gJ3poLWNuJyA/IHRoaXMuZmlyc3REYXlPZldlZWsgKyAxIDogdGhpcy5maXJzdERheU9mV2VlaztcblxuICAgIGlmICh0aGlzLnByZXNldFNlbGVjdGVkID09PSAnQ1VTVE9NJykge1xuICAgICAgdGhpcy5zaG93RGF0ZXBpY2tlcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXNldHMpIHtcbiAgICAgIGlmICghdGhpcy5maWx0ZXJzICYmIHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRDbGljayhcbiAgICAgICAgICB0aGlzLnByZXNldHMuZmluZCgocCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZDtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgICAgIHRoaXMub25BcHBseShmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbdGhpcy5maWx0ZXJTZWxlY3RlZF07XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMucHJlc2V0cykge1xuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldENsaWNrKFxuICAgICAgICAgIHRoaXMucHJlc2V0cy5maW5kKChwLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09PSB0aGlzLnByZXNldFNlbGVjdGVkO1xuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICAgICAgdGhpcy5vbkFwcGx5KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgKGNoYW5nZXMudG9UZXh0ICYmIGNoYW5nZXMudG9UZXh0LmZpcnN0Q2hhbmdlID09PSBmYWxzZSkge1xuICAgIC8vICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gIH1cblxuICBvbkFwcGx5KHNob3VsZEVtaXQgPSB0cnVlKSB7XG5cbiAgICAvLyBpZiBvbmx5IGEgQ1VTVE9NIHN0YXJ0IGRhdGUgaXMgc2VsZWN0ZWQsIHNldCB0aGUgZW5kIGRhdGUgdG8gdGhlIHN0YXJ0IGRhdGUgKGkuZSBzZWxlY3QgYSBzaW5nbGUgZGF5KVxuICAgIGlmICghdGhpcy50b0RhdGUpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5mcm9tRGF0ZTtcbiAgICB9XG5cbiAgICB0aGlzLnNldElucHV0TGFiZWwoKTtcblxuICAgIGlmIChzaG91bGRFbWl0KSB7XG4gICAgICB0aGlzLmRhdGVDaGFuZ2UuZW1pdCh7XG4gICAgICAgIGZyb21EYXRlOiB0aGlzLmZyb21EYXRlLFxuICAgICAgICB0b0RhdGU6IHRoaXMudG9EYXRlLFxuICAgICAgICBmb3JtYXR0ZWREYXRlOiB0aGlzLmZvcm1hdHRlZERhdGUsXG4gICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJzICYmIHRoaXMuZmlsdGVycy5sZW5ndGggPiAwID8gdGhpcy5zZWxlY3RlZEZpbHRlci5maWVsZCA6IG51bGwsXG4gICAgICAgIHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kYXRlcGlja2VyUG9wdXA/LmNsb3NlKCk7XG5cbiAgICAgIHRoaXMuYXJpYUxhYmVsID0gdGhpcy5hcmlhTGFiZWxGb3JtYXQoKTtcblxuICAgIH1cbiAgfVxuXG4gIG9uQ2FuY2VsKCkge1xuICAgIHRoaXMuZGF0ZXBpY2tlclBvcHVwLmNsb3NlKCk7XG5cbiAgICB0aGlzLmNhbmNlbC5lbWl0KCk7XG4gIH1cblxuICBvbkRhdGVTZWxlY3Rpb24oZGF0ZTogTmdiRGF0ZSkge1xuICAgIGlmICghdGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUpIHtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBkYXRlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUgJiYgZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSkge1xuICAgICAgdGhpcy50b0RhdGUgPSBkYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLmZyb21EYXRlID0gZGF0ZTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIHByZXNldFNlbGVjdCA9ICgkZXZlbnQ6IFBhcnRpYWw8UGJkc0RhdGVyYW5nZVByZXNldD4pID0+IHtcbiAgICBpZiAoJGV2ZW50LnZhbHVlID09PSAnQ1VTVE9NJykge1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9ICdDVVNUT00nO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnNldERhdGVQcm9wZXJ0aWVzKCRldmVudC52YWx1ZSk7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gIH07XG5cbiAgcHJlc2V0Q2xpY2socHJlc2V0OiBQYmRzRGF0ZXJhbmdlUHJlc2V0KSB7XG4gICAgaWYgKHByZXNldCkge1xuICAgICAgaWYgKHByZXNldC52YWx1ZSA9PT0gJ0NVU1RPTScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXREYXRlUHJvcGVydGllcyhwcmVzZXQudmFsdWUpO1xuICAgICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLm9uQXBwbHkoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGdldEZvcm1hdHRlZERhdGUoZGF0ZTogTmdiRGF0ZSkge1xuICAgIGlmIChkYXRlKSB7XG4gICAgICBjb25zdCBsb2NhbGUgPSB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpO1xuICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9IGdldExvY2FsZURhdGVGb3JtYXQobG9jYWxlLCBGb3JtYXRXaWR0aC5TaG9ydCk7XG4gICAgICBjb25zdCBmb3JtYXR0ZWREYXRlID0gZm9ybWF0RGF0ZShgJHtkYXRlLm1vbnRofS8ke2RhdGUuZGF5fS8ke2RhdGUueWVhcn1gLCBkYXRlRm9ybWF0LCBsb2NhbGUpO1xuICAgICAgcmV0dXJuIGZvcm1hdHRlZERhdGU7XG4gICAgfVxuICB9XG5cbiAgaXNIb3ZlcmVkID0gKGRhdGU6IE5nYkRhdGUpID0+XG4gICAgdGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUgJiYgdGhpcy5ob3ZlcmVkRGF0ZSAmJiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpICYmIGRhdGUuYmVmb3JlKHRoaXMuaG92ZXJlZERhdGUpO1xuXG4gIGlzSW5zaWRlID0gKGRhdGU6IE5nYkRhdGUpID0+IGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkgJiYgZGF0ZS5iZWZvcmUodGhpcy50b0RhdGUpO1xuXG4gIGlzUmFuZ2UgPSAoZGF0ZTogTmdiRGF0ZSkgPT5cbiAgICBkYXRlLmVxdWFscyh0aGlzLmZyb21EYXRlKSB8fCBkYXRlLmVxdWFscyh0aGlzLnRvRGF0ZSkgfHwgdGhpcy5pc0luc2lkZShkYXRlKSB8fCB0aGlzLmlzSG92ZXJlZChkYXRlKTtcblxuICBzaG93RGF0ZXBpY2tlcigpIHtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6ICdDVVNUT00nIH0pO1xuICB9XG5cbiAgb25GaWx0ZXJDaGFuZ2UoZmlsdGVyLCBpbmRleCkge1xuICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuICB9XG5cbiAgc2V0UHJlc2V0KHZhbHVlOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWUpIHtcbiAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWU7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICB0aGlzLm9uQXBwbHkoKTtcbiAgfVxuXG4gIHNldEZpbHRlcihpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW2luZGV4XTtcbiAgICB9XG4gIH1cblxuICBzZXREYXRlUmFuZ2UodmFsdWUpIHtcbiAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUodmFsdWUuZnJvbURhdGUueWVhciwgdmFsdWUuZnJvbURhdGUubW9udGgsIHZhbHVlLmZyb21EYXRlLmRheSk7XG4gICAgdGhpcy50b0RhdGUgPSBuZXcgTmdiRGF0ZSh2YWx1ZS50b0RhdGUueWVhciwgdmFsdWUudG9EYXRlLm1vbnRoLCB2YWx1ZS50b0RhdGUuZGF5KTtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB2YWx1ZS52YWx1ZSA9PT0gJ0NVU1RPTSc7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlLnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgICAgdGhpcy5maWx0ZXJTZWxlY3RlZCA9IHRoaXMuZmlsdGVycy5maW5kSW5kZXgoKGYpID0+IGYuZmllbGQgPT09IHZhbHVlLmZpbHRlcik7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW3RoaXMuZmlsdGVyU2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIHRoaXMub25BcHBseSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRJbnB1dExhYmVsKCkge1xuICAgIGlmICh0aGlzLnByZXNldHMpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5wcmVzZXRzLmZpbmQoKHApID0+IHAudmFsdWUgPT09IHRoaXMucHJlc2V0U2VsZWN0ZWQpO1xuXG4gICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuZnJvbURhdGUgPT09IG51bGwgfHwgdGhpcy50b0RhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09IG51bGwgfHwgKHRoaXMucHJlc2V0U2VsZWN0ZWQgIT09IG51bGwgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gJ0NVU1RPTScpKSB7XG4gICAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSBzZWxlY3RlZC5sYWJlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdDVVNUT00nICYmIHRoaXMuZnJvbURhdGUgJiYgdGhpcy50b0RhdGUpIHtcbiAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSB0aGlzLmRhdGVGb3JtYXQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZGF0ZVJhbmdlICE9PSAnJykge1xuICAgICAgICB0aGlzLmZvcm1hdHRlZERhdGUgPSB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPyB0aGlzLmRhdGVGb3JtYXQoKSA6IHRoaXMuZGF0ZVJhbmdlO1xuICAgICAgICB0aGlzLmFyaWFMYWJlbCA9IHRoaXMuYXJpYUxhYmVsRm9ybWF0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRlRm9ybWF0KCkge1xuICAgIHJldHVybiB0aGlzLmlucHV0Rm9ybWF0XG4gICAgICAucmVwbGFjZSgne2Zyb21EYXRlfScsIHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSh0aGlzLmZyb21EYXRlKSlcbiAgICAgIC5yZXBsYWNlKCd7dG9EYXRlfScsIHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSh0aGlzLnRvRGF0ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBhcmlhTGFiZWxGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsU2VsZWN0ZWQucmVwbGFjZSgne3NlbGVjdGVkUmFuZ2V9JywgdGhpcy5mb3JtYXR0ZWREYXRlKVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXlzSW5Nb250aCh5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnJvbUFuZFRvRGF0ZXModmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSk6IHsgZnJvbTogTmdiRGF0ZVN0cnVjdDsgdG86IE5nYkRhdGVTdHJ1Y3QgfSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICAgIGNvbnN0IGN1cnJlbnREYXkgPSBub3cuZ2V0RGF0ZSgpO1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgJ1BSRVZJT1VTX01PTlRIJzpcbiAgICAgICAgY29uc3QgeWVhciA9IGN1cnJlbnRNb250aCA+IDAgPyBjdXJyZW50WWVhciA6IGN1cnJlbnRZZWFyIC0gMTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjdXJyZW50TW9udGggPiAwID8gY3VycmVudE1vbnRoIDogMTI7XG4gICAgICAgIGNvbnN0IGRheSA9IDE7XG4gICAgICAgIGNvbnN0IGxhc3REYXkgPSB0aGlzLmdldERheXNJbk1vbnRoKHllYXIsIG1vbnRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmcm9tOiB7IHllYXIsIG1vbnRoLCBkYXkgfSxcbiAgICAgICAgICB0bzogeyB5ZWFyLCBtb250aCwgZGF5OiBsYXN0RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGNhc2UgJ1lFQVJfVE9fREFURSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnJvbTogeyB5ZWFyOiBjdXJyZW50WWVhciwgbW9udGg6IDEsIGRheTogMSB9LFxuICAgICAgICAgIHRvOiB7IHllYXI6IGN1cnJlbnRZZWFyLCBtb250aDogY3VycmVudE1vbnRoICsgMSwgZGF5OiBjdXJyZW50RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB7IGZyb206IG51bGwsIHRvOiBudWxsIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXREYXRlUHJvcGVydGllcyh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAnUFJFVklPVVNfTU9OVEgnIHx8IHZhbHVlID09PSAnWUVBUl9UT19EQVRFJykge1xuICAgICAgY29uc3QgeyBmcm9tLCB0byB9ID0gdGhpcy5nZXRGcm9tQW5kVG9EYXRlcyh2YWx1ZSk7XG4gICAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUoZnJvbS55ZWFyLCBmcm9tLm1vbnRoLCBmcm9tLmRheSk7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHRvLnllYXIsIHRvLm1vbnRoLCB0by5kYXkpO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLnRvRGF0ZSwgJ2QnLCBOdW1iZXIodmFsdWUpKTtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5mcm9tRGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==