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
        this.filterSelected = 0;
        this.showCustomPreset = true;
        this.applyText = 'Apply';
        this.cancelText = 'Cancel';
        this.customRangeText = 'Custom Range';
        this.displayMonths = 2;
        this.displayInput = true;
        this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y');
        this.maxDate = this.calendar.getToday();
        this.placement = 'bottom-right auto';
        this.fromDate = null;
        this.toDate = null;
        this.inputFormat = '{fromDate} to {toDate}';
        this.dateChange = new EventEmitter();
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
    }
    ngOnChanges(changes) {
        if (changes.filters && this.filters) {
            this.selectedFilter = this.filters[this.filterSelected];
        }
        if (changes.presets) {
            if (!this.filters && this.presetSelected) {
                this.presetClick(this.presets.find((p) => p.value === this.presetSelected));
            }
            else if (this.presetSelected) {
                this.presetSelect({ value: this.presetSelected });
                this.apply();
            }
        }
        // if (changes.toText && changes.toText.firstChange === false) {
        //   this.setInputLabel();
        // }
        this.setInputLabel();
    }
    apply() {
        this.setInputLabel();
        this.dateChange.emit({
            fromDate: this.fromDate,
            toDate: this.toDate,
            formattedDate: this.isDatepickerVisible ? this.dateFormat() : this.dateRange,
            filter: this.filters ? this.selectedFilter.field : null,
            value: this.presetSelected
        });
        this.datepickerPopup.close();
    }
    cancel() {
        this.datepickerPopup.close();
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
        // console.log('PRESET CLICK: ', preset);
        if (preset) {
            if (preset.value === 'CUSTOM') {
                return false;
            }
            this.setDateProperties(preset.value);
            this.isDatepickerVisible = false;
            this.apply();
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
        this.apply();
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
        this.apply();
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
        }
    }
    dateFormat() {
        return this.inputFormat
            .replace('{fromDate}', this.getFormattedDate(this.fromDate))
            .replace('{toDate}', this.getFormattedDate(this.toDate));
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
                template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    *ngIf=\"displayInput\"\n    class=\"form-control\"\n    aria-describedby=\"daterange-button\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n  </div>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    type=\"button\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n    container=\"body\"\n    [placement]=\"placement\"\n    aria-label=\"Open Daterange Picker\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\">\n    <div *ngIf=\"isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (select)=\"onDateSelection($event)\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            type=\"button\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange(filter, index)\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group\n          aria-label=\"Select an option\"\n          class=\"stacked-radio-group\"\n          name=\"presets\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"apply()\">{{ applyText }}</button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"cancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n",
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
    customRangeText: [{ type: Input }],
    displayMonths: [{ type: Input }],
    displayInput: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    placement: [{ type: Input }],
    fromDate: [{ type: Input }],
    toDate: [{ type: Input }],
    inputFormat: [{ type: Input }],
    dateChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9zdDAxNmxvL2dpdGh1Yi9uZy1kZXNpZ25zeXN0ZW0vY2xpZW50L3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0ZXJhbmdlLXBvcG92ZXIvIiwic291cmNlcyI6WyJkYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUdaLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLG1CQUFtQixFQUNuQix1QkFBdUIsRUFDdkIsU0FBUyxFQUNULGdCQUFnQixFQUNoQixtQkFBbUIsRUFDbkIsV0FBVyxFQUNYLFVBQVUsRUFDWCxNQUFNLGlCQUFpQixDQUFDO0FBRXpCLE9BQU8sRUFBYyxPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFpQixNQUFNLDRCQUE0QixDQUFDO0FBUWhILE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBR25FLHVFQUF1RTtBQUV2RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsaUJBQWlCO0lBQ3pELFlBQW1CLGdCQUFzQztRQUN2RCxLQUFLLEVBQUUsQ0FBQztRQURTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7SUFFekQsQ0FBQztJQUVELG1CQUFtQixDQUFDLE9BQWU7UUFDakMsc0RBQXNEO1FBQ3RELE9BQU8sR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUV0QyxlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLDhDQUE4QztRQUM5QyxhQUFhO1FBQ2IsNkhBQTZIO1FBQzdILEtBQUs7UUFFTCxPQUFPLGlCQUFpQixDQUN0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QUUsS0FBSyxFQUFFO3NCQUU5QyxLQUFLOzZCQXdCTCxLQUFLO3NCQUdMLEtBQUs7NkJBR0wsS0FBSzsrQkFHTCxLQUFLO3dCQUdMLEtBQUs7eUJBR0wsS0FBSzs4QkFHTCxLQUFLOzRCQUdMLEtBQUs7MkJBR0wsS0FBSztzQkFHTCxLQUFLO3NCQUdMLEtBQUs7d0JBR0wsS0FBSzt1QkFHTCxLQUFLO3FCQUdMLEtBQUs7MEJBR0wsS0FBSzt5QkFHTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbmplY3RhYmxlLFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBnZXRMb2NhbGVEYXlOYW1lcyxcbiAgZ2V0TG9jYWxlTW9udGhOYW1lcyxcbiAgZ2V0TG9jYWxlRmlyc3REYXlPZldlZWssXG4gIEZvcm1TdHlsZSxcbiAgVHJhbnNsYXRpb25XaWR0aCxcbiAgZ2V0TG9jYWxlRGF0ZUZvcm1hdCxcbiAgRm9ybWF0V2lkdGgsXG4gIGZvcm1hdERhdGVcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgTmdiUG9wb3ZlciwgTmdiRGF0ZSwgTmdiQ2FsZW5kYXIsIE5nYkRhdGVwaWNrZXJJMThuLCBOZ2JEYXRlU3RydWN0IH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuXG5pbXBvcnQge1xuICBQYmRzRGF0ZXJhbmdlUHJlc2V0LFxuICBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWUsXG4gIFBiZHNEYXRlcmFuZ2VGaWx0ZXIsXG4gIFBiZHNEYXRlcmFuZ2VDaGFuZ2Vcbn0gZnJvbSAnLi9kYXRlcmFuZ2UtcG9wb3Zlci5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFBiZHNEYXRlcmFuZ2VTZXJ2aWNlIH0gZnJvbSAnLi9kYXRlcmFuZ2UtcG9wb3Zlci5zZXJ2aWNlJztcbmltcG9ydCB7IFBsYWNlbWVudEFycmF5IH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9wb3NpdGlvbmluZyc7XG5cbi8vIERlZmluZSBjdXN0b20gc2VydmljZSBwcm92aWRpbmcgdGhlIG1vbnRocyBhbmQgd2Vla2RheXMgdHJhbnNsYXRpb25zXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGF0ZXBpY2tlckkxOG4gZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXRXZWVrZGF5U2hvcnROYW1lKHdlZWtkYXk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gZm9yIG5nLWJvb3RzdHJhcCwgc3VuZGF5IG51bWJlciBvZiA3IGNvbnZlcnRlZCB0byAwXG4gICAgd2Vla2RheSA9IHdlZWtkYXkgPT09IDcgPyAwIDogd2Vla2RheTtcblxuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3dlZWtkYXk6ICcsXG4gICAgLy8gICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgIC8vICAgd2Vla2RheSxcbiAgICAvLyAgIGdldExvY2FsZURheU5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkKVt3ZWVrZGF5XVxuICAgIC8vICk7XG5cbiAgICByZXR1cm4gZ2V0TG9jYWxlRGF5TmFtZXMoXG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgICAgRm9ybVN0eWxlLlN0YW5kYWxvbmUsXG4gICAgICBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkXG4gICAgKVt3ZWVrZGF5XTtcbiAgfVxuXG4gIGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBnZXRMb2NhbGVNb250aE5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLldpZGUpW1xuICAgICAgbW9udGggLSAxXG4gICAgXTtcbiAgfVxuXG4gIGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtkYXRlLmRheX0tJHtkYXRlLm1vbnRofS0ke2RhdGUueWVhcn1gO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0ZXJhbmdlLXBvcG92ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5nYkRhdGVwaWNrZXJJMThuLCB1c2VDbGFzczogQ3VzdG9tRGF0ZXBpY2tlckkxOG4gfV0sXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBAVmlld0NoaWxkKCdkYXRlcGlja2VyUG9wdXAnLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJpdmF0ZSBkYXRlcGlja2VyUG9wdXA6IE5nYlBvcG92ZXI7XG5cbiAgQElucHV0KClcbiAgcHJlc2V0czogQXJyYXk8UGJkc0RhdGVyYW5nZVByZXNldD4gPSBbXG4gICAge1xuICAgICAgbGFiZWw6ICdBbGwgRGF0ZXMnLFxuICAgICAgdmFsdWU6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTGFzdCA3IERheXMnLFxuICAgICAgdmFsdWU6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTGFzdCAzMCBEYXlzJyxcbiAgICAgIHZhbHVlOiAzMFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdQcmV2aW91cyBNb250aCcsXG4gICAgICB2YWx1ZTogJ1BSRVZJT1VTX01PTlRIJ1xuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdZZWFyIHRvIERhdGUnLFxuICAgICAgdmFsdWU6ICdZRUFSX1RPX0RBVEUnXG4gICAgfVxuICBdO1xuXG4gIEBJbnB1dCgpXG4gIHByZXNldFNlbGVjdGVkOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWU7XG5cbiAgQElucHV0KClcbiAgZmlsdGVyczogQXJyYXk8UGJkc0RhdGVyYW5nZUZpbHRlcj47XG5cbiAgQElucHV0KClcbiAgZmlsdGVyU2VsZWN0ZWQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHNob3dDdXN0b21QcmVzZXQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGFwcGx5VGV4dCA9ICdBcHBseSc7XG5cbiAgQElucHV0KClcbiAgY2FuY2VsVGV4dCA9ICdDYW5jZWwnO1xuXG4gIEBJbnB1dCgpXG4gIGN1c3RvbVJhbmdlVGV4dCA9ICdDdXN0b20gUmFuZ2UnO1xuXG4gIEBJbnB1dCgpXG4gIGRpc3BsYXlNb250aHMgPSAyO1xuXG4gIEBJbnB1dCgpXG4gIGRpc3BsYXlJbnB1dCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgbWluRGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCksICd5Jyk7XG5cbiAgQElucHV0KClcbiAgbWF4RGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKTtcblxuICBASW5wdXQoKVxuICBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2JvdHRvbS1yaWdodCBhdXRvJztcblxuICBASW5wdXQoKVxuICBmcm9tRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGlucHV0Rm9ybWF0ID0gJ3tmcm9tRGF0ZX0gdG8ge3RvRGF0ZX0nO1xuXG4gIEBPdXRwdXQoKVxuICBkYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYmRzRGF0ZXJhbmdlQ2hhbmdlPigpO1xuXG4gIGZpcnN0RGF5T2ZXZWVrID0gZ2V0TG9jYWxlRmlyc3REYXlPZldlZWsodGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSk7XG5cbiAgaG92ZXJlZERhdGU6IE5nYkRhdGU7XG5cbiAgZGF0ZVJhbmdlID0gJyc7XG4gIGlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgc2VsZWN0ZWRGaWx0ZXI7XG4gIHN0YXJ0RGF0ZTogTmdiRGF0ZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgcHJpdmF0ZSBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBjaGluYSBzaG91bGQgc3RhcnQgb24gYSBNb25kYXksIEFuZ3VsYXIgbG9jYWxlIHJldHVybnMgaW5jb3JyZWN0IDBcbiAgICB0aGlzLmZpcnN0RGF5T2ZXZWVrID1cbiAgICAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCkgPT09ICd6aC1jbicgPyB0aGlzLmZpcnN0RGF5T2ZXZWVrICsgMSA6IHRoaXMuZmlyc3REYXlPZldlZWs7XG5cbiAgICBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ0NVU1RPTScpIHtcbiAgICAgIHRoaXMuc2hvd0RhdGVwaWNrZXIoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbdGhpcy5maWx0ZXJTZWxlY3RlZF07XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMucHJlc2V0cykge1xuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldENsaWNrKHRoaXMucHJlc2V0cy5maW5kKChwKSA9PiBwLnZhbHVlID09PSB0aGlzLnByZXNldFNlbGVjdGVkKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3QoeyB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZCB9KTtcbiAgICAgICAgdGhpcy5hcHBseSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIChjaGFuZ2VzLnRvVGV4dCAmJiBjaGFuZ2VzLnRvVGV4dC5maXJzdENoYW5nZSA9PT0gZmFsc2UpIHtcbiAgICAvLyAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICAgIC8vIH1cblxuICAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICB9XG5cbiAgYXBwbHkoKSB7XG4gICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gICAgdGhpcy5kYXRlQ2hhbmdlLmVtaXQoe1xuICAgICAgZnJvbURhdGU6IHRoaXMuZnJvbURhdGUsXG4gICAgICB0b0RhdGU6IHRoaXMudG9EYXRlLFxuICAgICAgZm9ybWF0dGVkRGF0ZTogdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID8gdGhpcy5kYXRlRm9ybWF0KCkgOiB0aGlzLmRhdGVSYW5nZSxcbiAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJzID8gdGhpcy5zZWxlY3RlZEZpbHRlci5maWVsZCA6IG51bGwsXG4gICAgICB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZFxuICAgIH0pO1xuXG4gICAgdGhpcy5kYXRlcGlja2VyUG9wdXAuY2xvc2UoKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLmRhdGVwaWNrZXJQb3B1cC5jbG9zZSgpO1xuICB9XG5cbiAgb25EYXRlU2VsZWN0aW9uKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBpZiAoIXRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlKSB7XG4gICAgICB0aGlzLmZyb21EYXRlID0gZGF0ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlICYmIGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gZGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b0RhdGUgPSBudWxsO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IGRhdGU7XG4gICAgfVxuXG4gICAgLy8gdGhpcy5wcmVzZXRTZWxlY3RlZCA9IG51bGw7XG4gIH1cblxuICBwcmVzZXRTZWxlY3QgPSAoJGV2ZW50OiBQYXJ0aWFsPFBiZHNEYXRlcmFuZ2VQcmVzZXQ+KSA9PiB7XG4gICAgaWYgKCRldmVudC52YWx1ZSA9PT0gJ0NVU1RPTScpIHtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSAnQ1VTVE9NJztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5zZXREYXRlUHJvcGVydGllcygkZXZlbnQudmFsdWUpO1xuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IGZhbHNlO1xuICB9O1xuXG4gIHByZXNldENsaWNrKHByZXNldDogUGJkc0RhdGVyYW5nZVByZXNldCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdQUkVTRVQgQ0xJQ0s6ICcsIHByZXNldCk7XG4gICAgaWYgKHByZXNldCkge1xuICAgICAgaWYgKHByZXNldC52YWx1ZSA9PT0gJ0NVU1RPTScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXREYXRlUHJvcGVydGllcyhwcmVzZXQudmFsdWUpO1xuICAgICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLmFwcGx5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGb3JtYXR0ZWREYXRlKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBpZiAoZGF0ZSkge1xuICAgICAgY29uc3QgbG9jYWxlID0gdGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKTtcbiAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSBnZXRMb2NhbGVEYXRlRm9ybWF0KGxvY2FsZSwgRm9ybWF0V2lkdGguU2hvcnQpO1xuICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoYCR7ZGF0ZS5tb250aH0vJHtkYXRlLmRheX0vJHtkYXRlLnllYXJ9YCwgZGF0ZUZvcm1hdCwgbG9jYWxlKTtcbiAgICAgIHJldHVybiBmb3JtYXR0ZWREYXRlO1xuICAgIH1cbiAgfVxuXG4gIGlzSG92ZXJlZCA9IChkYXRlOiBOZ2JEYXRlKSA9PlxuICAgIHRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlICYmIHRoaXMuaG92ZXJlZERhdGUgJiYgZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSAmJiBkYXRlLmJlZm9yZSh0aGlzLmhvdmVyZWREYXRlKTtcblxuICBpc0luc2lkZSA9IChkYXRlOiBOZ2JEYXRlKSA9PiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpICYmIGRhdGUuYmVmb3JlKHRoaXMudG9EYXRlKTtcblxuICBpc1JhbmdlID0gKGRhdGU6IE5nYkRhdGUpID0+XG4gICAgZGF0ZS5lcXVhbHModGhpcy5mcm9tRGF0ZSkgfHwgZGF0ZS5lcXVhbHModGhpcy50b0RhdGUpIHx8IHRoaXMuaXNJbnNpZGUoZGF0ZSkgfHwgdGhpcy5pc0hvdmVyZWQoZGF0ZSk7XG5cbiAgc2hvd0RhdGVwaWNrZXIoKSB7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiAnQ1VTVE9NJyB9KTtcbiAgfVxuXG4gIG9uRmlsdGVyQ2hhbmdlKGZpbHRlciwgaW5kZXgpIHtcbiAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW2luZGV4XTtcbiAgfVxuXG4gIHNldFByZXNldCh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKSB7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgdGhpcy5hcHBseSgpO1xuICB9XG5cbiAgc2V0RmlsdGVyKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5maWx0ZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGVSYW5nZSh2YWx1ZSkge1xuICAgIHRoaXMuZnJvbURhdGUgPSBuZXcgTmdiRGF0ZSh2YWx1ZS5mcm9tRGF0ZS55ZWFyLCB2YWx1ZS5mcm9tRGF0ZS5tb250aCwgdmFsdWUuZnJvbURhdGUuZGF5KTtcbiAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHZhbHVlLnRvRGF0ZS55ZWFyLCB2YWx1ZS50b0RhdGUubW9udGgsIHZhbHVlLnRvRGF0ZS5kYXkpO1xuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IHZhbHVlLnZhbHVlID09PSAnQ1VTVE9NJztcbiAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWUudmFsdWU7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLmZpbHRlclNlbGVjdGVkID0gdGhpcy5maWx0ZXJzLmZpbmRJbmRleCgoZikgPT4gZi5maWVsZCA9PT0gdmFsdWUuZmlsdGVyKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbdGhpcy5maWx0ZXJTZWxlY3RlZF07XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRJbnB1dExhYmVsKCkge1xuICAgIGlmICh0aGlzLnByZXNldHMpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5wcmVzZXRzLmZpbmQoKHApID0+IHAudmFsdWUgPT09IHRoaXMucHJlc2V0U2VsZWN0ZWQpO1xuXG4gICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuZnJvbURhdGUgPT09IG51bGwgfHwgdGhpcy50b0RhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09IG51bGwgfHwgKHRoaXMucHJlc2V0U2VsZWN0ZWQgIT09IG51bGwgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gJ0NVU1RPTScpKSB7XG4gICAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSBzZWxlY3RlZC5sYWJlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdDVVNUT00nICYmIHRoaXMuZnJvbURhdGUgJiYgdGhpcy50b0RhdGUpIHtcbiAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSB0aGlzLmRhdGVGb3JtYXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGVGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRGb3JtYXRcbiAgICAgIC5yZXBsYWNlKCd7ZnJvbURhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMuZnJvbURhdGUpKVxuICAgICAgLnJlcGxhY2UoJ3t0b0RhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMudG9EYXRlKSk7XG4gIH1cblxuICBwcml2YXRlIGdldERheXNJbk1vbnRoKHllYXI6IG51bWJlciwgbW9udGg6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkuZ2V0RGF0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRGcm9tQW5kVG9EYXRlcyh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKTogeyBmcm9tOiBOZ2JEYXRlU3RydWN0OyB0bzogTmdiRGF0ZVN0cnVjdCB9IHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gbm93LmdldE1vbnRoKCk7XG4gICAgY29uc3QgY3VycmVudERheSA9IG5vdy5nZXREYXRlKCk7XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgY2FzZSAnUFJFVklPVVNfTU9OVEgnOlxuICAgICAgICBjb25zdCB5ZWFyID0gY3VycmVudE1vbnRoID4gMCA/IGN1cnJlbnRZZWFyIDogY3VycmVudFllYXIgLSAxO1xuICAgICAgICBjb25zdCBtb250aCA9IGN1cnJlbnRNb250aCA+IDAgPyBjdXJyZW50TW9udGggOiAxMjtcbiAgICAgICAgY29uc3QgZGF5ID0gMTtcbiAgICAgICAgY29uc3QgbGFzdERheSA9IHRoaXMuZ2V0RGF5c0luTW9udGgoeWVhciwgbW9udGgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZyb206IHsgeWVhciwgbW9udGgsIGRheSB9LFxuICAgICAgICAgIHRvOiB7IHllYXIsIG1vbnRoLCBkYXk6IGxhc3REYXkgfVxuICAgICAgICB9O1xuICAgICAgY2FzZSAnWUVBUl9UT19EQVRFJzpcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmcm9tOiB7IHllYXI6IGN1cnJlbnRZZWFyLCBtb250aDogMSwgZGF5OiAxIH0sXG4gICAgICAgICAgdG86IHsgeWVhcjogY3VycmVudFllYXIsIG1vbnRoOiBjdXJyZW50TW9udGggKyAxLCBkYXk6IGN1cnJlbnREYXkgfVxuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHsgZnJvbTogbnVsbCwgdG86IG51bGwgfTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldERhdGVQcm9wZXJ0aWVzKHZhbHVlOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICdQUkVWSU9VU19NT05USCcgfHwgdmFsdWUgPT09ICdZRUFSX1RPX0RBVEUnKSB7XG4gICAgICBjb25zdCB7IGZyb20sIHRvIH0gPSB0aGlzLmdldEZyb21BbmRUb0RhdGVzKHZhbHVlKTtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBuZXcgTmdiRGF0ZShmcm9tLnllYXIsIGZyb20ubW9udGgsIGZyb20uZGF5KTtcbiAgICAgIHRoaXMudG9EYXRlID0gbmV3IE5nYkRhdGUodG8ueWVhciwgdG8ubW9udGgsIHRvLmRheSk7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWU7XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuZnJvbURhdGU7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy50b0RhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCk7XG4gICAgICB0aGlzLmZyb21EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRQcmV2KHRoaXMudG9EYXRlLCAnZCcsIE51bWJlcih2YWx1ZSkpO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZyb21EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMudG9EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSBudWxsO1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuIl19