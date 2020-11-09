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
                this.onApply();
            }
        }
        // if (changes.toText && changes.toText.firstChange === false) {
        //   this.setInputLabel();
        // }
        this.setInputLabel();
    }
    onApply() {
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
        // console.log('PRESET CLICK: ', preset);
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
                template: "<div class=\"input-group pbds-daterange-popover\" *ngIf=\"displayInput; else daterangeButton\">\n  <input\n    *ngIf=\"displayInput\"\n    class=\"form-control\"\n    aria-describedby=\"daterange-button\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <ng-container *ngTemplateOutlet=\"daterangeButton\"></ng-container>\n  </div>\n</div>\n\n<ng-template #daterangeButton>\n  <button\n    class=\"btn btn-secondary\"\n    type=\"button\"\n    id=\"daterange-button\"\n    #datepickerPopup=\"ngbPopover\"\n    [ngbPopover]=\"daterangeContent\"\n    popoverClass=\"daterange-popover\"\n    autoClose=\"outside\"\n    [container]=\"container\"\n    [placement]=\"placement\"\n    aria-label=\"Open Daterange Picker\"\n  >\n    <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n  </button>\n</ng-template>\n\n<ng-template #daterangeContent>\n  <div class=\"d-block d-md-flex\">\n    <div *ngIf=\"isDatepickerVisible\">\n      <ngb-datepicker\n        #datepicker\n        [displayMonths]=\"displayMonths\"\n        [minDate]=\"minDate\"\n        [maxDate]=\"maxDate\"\n        navigation=\"select\"\n        outsideDays=\"hidden\"\n        [firstDayOfWeek]=\"firstDayOfWeek\"\n        [showWeekdays]=\"true\"\n        [startDate]=\"startDate\"\n        [dayTemplate]=\"t\"\n        (dateSelect)=\"onDateSelection($event)\"\n      >\n      </ngb-datepicker>\n      <!--  -->\n\n      <ng-template #t let-date let-focused=\"focused\">\n        <span\n          class=\"custom-day\"\n          [class.focused]=\"focused\"\n          [class.range]=\"isRange(date)\"\n          [class.faded]=\"isHovered(date) || isInside(date)\"\n          (mouseenter)=\"hoveredDate = date\"\n          (mouseleave)=\"hoveredDate = null\"\n        >\n          {{ date.day }}\n        </span>\n      </ng-template>\n    </div>\n\n    <div class=\"d-flex flex-column justify-content-lg-between mt-md-0\" [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\">\n      <!-- filters -->\n      <div *ngIf=\"filters\" class=\"mb-3\" ngbDropdown>\n        <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n          {{ selectedFilter.label }}\n        </button>\n        <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n          <button\n            class=\"dropdown-item\"\n            type=\"button\"\n            *ngFor=\"let filter of filters; let index = index\"\n            (click)=\"onFilterChange(filter, index)\"\n          >\n            {{ filter.label }}\n          </button>\n        </div>\n      </div>\n\n      <!-- presets radio buttons-->\n      <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n        <mat-radio-group\n          aria-label=\"Select an option\"\n          class=\"stacked-radio-group\"\n          name=\"presets\"\n          [(ngModel)]=\"presetSelected\"\n          (change)=\"presetSelect($event)\"\n        >\n          <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{ preset.label }}</mat-radio-button>\n\n          <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'CUSTOM'\" (change)=\"showDatepicker()\">{{\n            customRangeText\n          }}</mat-radio-button>\n        </mat-radio-group>\n      </div>\n\n      <!-- presets buttons-->\n      <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngFor=\"let preset of presets\"\n          (click)=\"presetClick(preset)\"\n        >\n          {{ preset.label }}\n        </button>\n\n        <button\n          type=\"button\"\n          class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n          *ngIf=\"showCustomPreset\"\n          (click)=\"showDatepicker()\"\n        >\n          {{ customRangeText }}\n        </button>\n      </div>\n\n      <!-- buttons -->\n      <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n        <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"onApply()\">{{ applyText }}</button>\n        <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"onCancel()\">\n          {{ cancelText }}\n        </button>\n      </div>\n    </div>\n  </div>\n</ng-template>\n",
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
    dateChange: [{ type: Output }],
    cancel: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9kYTA1N2NvL0Rlc2t0b3AvQ29kZS9uZy1kZXNpZ25zeXN0ZW0vY2xpZW50L3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0ZXJhbmdlLXBvcG92ZXIvIiwic291cmNlcyI6WyJkYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUdaLHVCQUF1QixFQUN4QixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLG1CQUFtQixFQUNuQix1QkFBdUIsRUFDdkIsU0FBUyxFQUNULGdCQUFnQixFQUNoQixtQkFBbUIsRUFDbkIsV0FBVyxFQUNYLFVBQVUsRUFDWCxNQUFNLGlCQUFpQixDQUFDO0FBRXpCLE9BQU8sRUFBYyxPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFpQixNQUFNLDRCQUE0QixDQUFDO0FBU2hILE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRW5FLHVFQUF1RTtBQUV2RSxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsaUJBQWlCO0lBQ3pELFlBQW1CLGdCQUFzQztRQUN2RCxLQUFLLEVBQUUsQ0FBQztRQURTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBc0I7SUFFekQsQ0FBQztJQUVELG1CQUFtQixDQUFDLE9BQWU7UUFDakMsc0RBQXNEO1FBQ3RELE9BQU8sR0FBRyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUV0QyxlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLDhDQUE4QztRQUM5QyxhQUFhO1FBQ2IsNkhBQTZIO1FBQzdILEtBQUs7UUFFTCxPQUFPLGlCQUFp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QUM7Z0JBRTNFLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7WUEzRDZCLFdBQVc7WUFTaEMsb0JBQW9COzs7OEJBb0QxQixTQUFTLFNBQUMsaUJBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO3NCQUU5QyxLQUFLOzZCQXdCTCxLQUFLO3NCQUdMLEtBQUs7NkJBR0wsS0FBSzsrQkFHTCxLQUFLO3dCQUdMLEtBQUs7eUJBR0wsS0FBSzt3QkFHTCxLQUFLOzhCQUdMLEtBQUs7NEJBR0wsS0FBSzsyQkFHTCxLQUFLO3NCQUdMLEtBQUs7c0JBR0wsS0FBSzt3QkFHTCxLQUFLO3VCQUdMLEtBQUs7cUJBR0wsS0FBSzswQkFHTCxLQUFLO3lCQUdMLE1BQU07cUJBR04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5qZWN0YWJsZSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgZ2V0TG9jYWxlRGF5TmFtZXMsXG4gIGdldExvY2FsZU1vbnRoTmFtZXMsXG4gIGdldExvY2FsZUZpcnN0RGF5T2ZXZWVrLFxuICBGb3JtU3R5bGUsXG4gIFRyYW5zbGF0aW9uV2lkdGgsXG4gIGdldExvY2FsZURhdGVGb3JtYXQsXG4gIEZvcm1hdFdpZHRoLFxuICBmb3JtYXREYXRlXG59IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IE5nYlBvcG92ZXIsIE5nYkRhdGUsIE5nYkNhbGVuZGFyLCBOZ2JEYXRlcGlja2VySTE4biwgTmdiRGF0ZVN0cnVjdCB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcblxuaW1wb3J0IHtcbiAgUGJkc0RhdGVyYW5nZVByZXNldCxcbiAgUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlLFxuICBQYmRzRGF0ZXJhbmdlRmlsdGVyLFxuICBQYmRzRGF0ZXJhbmdlQ2hhbmdlLFxuICBQYmRzRGF0ZXJhbmdlUGxhY2VtZW50XG59IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBQYmRzRGF0ZXJhbmdlU2VydmljZSB9IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZSc7XG5cbi8vIERlZmluZSBjdXN0b20gc2VydmljZSBwcm92aWRpbmcgdGhlIG1vbnRocyBhbmQgd2Vla2RheXMgdHJhbnNsYXRpb25zXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGF0ZXBpY2tlckkxOG4gZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXRXZWVrZGF5U2hvcnROYW1lKHdlZWtkYXk6IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gZm9yIG5nLWJvb3RzdHJhcCwgc3VuZGF5IG51bWJlciBvZiA3IGNvbnZlcnRlZCB0byAwXG4gICAgd2Vla2RheSA9IHdlZWtkYXkgPT09IDcgPyAwIDogd2Vla2RheTtcblxuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3dlZWtkYXk6ICcsXG4gICAgLy8gICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgIC8vICAgd2Vla2RheSxcbiAgICAvLyAgIGdldExvY2FsZURheU5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkKVt3ZWVrZGF5XVxuICAgIC8vICk7XG5cbiAgICByZXR1cm4gZ2V0TG9jYWxlRGF5TmFtZXMoXG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLFxuICAgICAgRm9ybVN0eWxlLlN0YW5kYWxvbmUsXG4gICAgICBUcmFuc2xhdGlvbldpZHRoLkFiYnJldmlhdGVkXG4gICAgKVt3ZWVrZGF5XTtcbiAgfVxuXG4gIGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBnZXRMb2NhbGVNb250aE5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLldpZGUpW1xuICAgICAgbW9udGggLSAxXG4gICAgXTtcbiAgfVxuXG4gIGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtkYXRlLmRheX0tJHtkYXRlLm1vbnRofS0ke2RhdGUueWVhcn1gO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtZGF0ZXJhbmdlLXBvcG92ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE5nYkRhdGVwaWNrZXJJMThuLCB1c2VDbGFzczogQ3VzdG9tRGF0ZXBpY2tlckkxOG4gfV0sXG4gIHN0eWxlczogW10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBAVmlld0NoaWxkKCdkYXRlcGlja2VyUG9wdXAnLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJpdmF0ZSBkYXRlcGlja2VyUG9wdXA6IE5nYlBvcG92ZXI7XG5cbiAgQElucHV0KClcbiAgcHJlc2V0czogQXJyYXk8UGJkc0RhdGVyYW5nZVByZXNldD4gPSBbXG4gICAge1xuICAgICAgbGFiZWw6ICdBbGwgRGF0ZXMnLFxuICAgICAgdmFsdWU6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTGFzdCA3IERheXMnLFxuICAgICAgdmFsdWU6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTGFzdCAzMCBEYXlzJyxcbiAgICAgIHZhbHVlOiAzMFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdQcmV2aW91cyBNb250aCcsXG4gICAgICB2YWx1ZTogJ1BSRVZJT1VTX01PTlRIJ1xuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdZZWFyIHRvIERhdGUnLFxuICAgICAgdmFsdWU6ICdZRUFSX1RPX0RBVEUnXG4gICAgfVxuICBdO1xuXG4gIEBJbnB1dCgpXG4gIHByZXNldFNlbGVjdGVkOiBQYmRzRGF0ZXJhbmdlUHJlc2V0VmFsdWU7XG5cbiAgQElucHV0KClcbiAgZmlsdGVyczogQXJyYXk8UGJkc0RhdGVyYW5nZUZpbHRlcj47XG5cbiAgQElucHV0KClcbiAgZmlsdGVyU2VsZWN0ZWQgPSAwO1xuXG4gIEBJbnB1dCgpXG4gIHNob3dDdXN0b21QcmVzZXQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIGFwcGx5VGV4dCA9ICdBcHBseSc7XG5cbiAgQElucHV0KClcbiAgY2FuY2VsVGV4dCA9ICdDYW5jZWwnO1xuXG4gIEBJbnB1dCgpXG4gIGNvbnRhaW5lcjogbnVsbCB8ICdib2R5JyA9ICdib2R5JztcblxuICBASW5wdXQoKVxuICBjdXN0b21SYW5nZVRleHQgPSAnQ3VzdG9tIFJhbmdlJztcblxuICBASW5wdXQoKVxuICBkaXNwbGF5TW9udGhzID0gMjtcblxuICBASW5wdXQoKVxuICBkaXNwbGF5SW5wdXQgPSB0cnVlO1xuXG4gIEBJbnB1dCgpXG4gIG1pbkRhdGU6IE5nYkRhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFByZXYodGhpcy5jYWxlbmRhci5nZXRUb2RheSgpLCAneScpO1xuXG4gIEBJbnB1dCgpXG4gIG1heERhdGU6IE5nYkRhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCk7XG5cbiAgQElucHV0KClcbiAgcGxhY2VtZW50OiBQYmRzRGF0ZXJhbmdlUGxhY2VtZW50ID0gJ2JvdHRvbS1yaWdodCBhdXRvJztcblxuICBASW5wdXQoKVxuICBmcm9tRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGlucHV0Rm9ybWF0ID0gJ3tmcm9tRGF0ZX0gdG8ge3RvRGF0ZX0nO1xuXG4gIEBPdXRwdXQoKVxuICBkYXRlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxQYmRzRGF0ZXJhbmdlQ2hhbmdlPigpO1xuXG4gIEBPdXRwdXQoKVxuICBjYW5jZWwgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBmaXJzdERheU9mV2VlayA9IGdldExvY2FsZUZpcnN0RGF5T2ZXZWVrKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCkpO1xuXG4gIGhvdmVyZWREYXRlOiBOZ2JEYXRlO1xuXG4gIGRhdGVSYW5nZSA9ICcnO1xuICBpc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gIHNlbGVjdGVkRmlsdGVyO1xuICBzdGFydERhdGU6IE5nYkRhdGU7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIHByaXZhdGUgZGF0ZXJhbmdlU2VydmljZTogUGJkc0RhdGVyYW5nZVNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gY2hpbmEgc2hvdWxkIHN0YXJ0IG9uIGEgTW9uZGF5LCBBbmd1bGFyIGxvY2FsZSByZXR1cm5zIGluY29ycmVjdCAwXG4gICAgdGhpcy5maXJzdERheU9mV2VlayA9XG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpID09PSAnemgtY24nID8gdGhpcy5maXJzdERheU9mV2VlayArIDEgOiB0aGlzLmZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdDVVNUT00nKSB7XG4gICAgICB0aGlzLnNob3dEYXRlcGlja2VyKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW3RoaXMuZmlsdGVyU2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnByZXNldHMpIHtcbiAgICAgIGlmICghdGhpcy5maWx0ZXJzICYmIHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRDbGljayh0aGlzLnByZXNldHMuZmluZCgocCkgPT4gcC52YWx1ZSA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgICAgIHRoaXMub25BcHBseSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIChjaGFuZ2VzLnRvVGV4dCAmJiBjaGFuZ2VzLnRvVGV4dC5maXJzdENoYW5nZSA9PT0gZmFsc2UpIHtcbiAgICAvLyAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICAgIC8vIH1cblxuICAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICB9XG5cbiAgb25BcHBseSgpIHtcbiAgICB0aGlzLnNldElucHV0TGFiZWwoKTtcbiAgICB0aGlzLmRhdGVDaGFuZ2UuZW1pdCh7XG4gICAgICBmcm9tRGF0ZTogdGhpcy5mcm9tRGF0ZSxcbiAgICAgIHRvRGF0ZTogdGhpcy50b0RhdGUsXG4gICAgICBmb3JtYXR0ZWREYXRlOiB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPyB0aGlzLmRhdGVGb3JtYXQoKSA6IHRoaXMuZGF0ZVJhbmdlLFxuICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlcnMgPyB0aGlzLnNlbGVjdGVkRmlsdGVyLmZpZWxkIDogbnVsbCxcbiAgICAgIHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkXG4gICAgfSk7XG5cbiAgICB0aGlzLmRhdGVwaWNrZXJQb3B1cC5jbG9zZSgpO1xuICB9XG5cbiAgb25DYW5jZWwoKSB7XG4gICAgdGhpcy5kYXRlcGlja2VyUG9wdXAuY2xvc2UoKTtcblxuICAgIHRoaXMuY2FuY2VsLmVtaXQoKTtcbiAgfVxuXG4gIG9uRGF0ZVNlbGVjdGlvbihkYXRlOiBOZ2JEYXRlKSB7XG4gICAgaWYgKCF0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSkge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IGRhdGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSAmJiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpKSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBkYXRlO1xuICAgIH1cblxuICAgIC8vIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgcHJlc2V0U2VsZWN0ID0gKCRldmVudDogUGFydGlhbDxQYmRzRGF0ZXJhbmdlUHJlc2V0PikgPT4ge1xuICAgIGlmICgkZXZlbnQudmFsdWUgPT09ICdDVVNUT00nKSB7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gJ0NVU1RPTSc7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuc2V0RGF0ZVByb3BlcnRpZXMoJGV2ZW50LnZhbHVlKTtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgfTtcblxuICBwcmVzZXRDbGljayhwcmVzZXQ6IFBiZHNEYXRlcmFuZ2VQcmVzZXQpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnUFJFU0VUIENMSUNLOiAnLCBwcmVzZXQpO1xuICAgIGlmIChwcmVzZXQpIHtcbiAgICAgIGlmIChwcmVzZXQudmFsdWUgPT09ICdDVVNUT00nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RGF0ZVByb3BlcnRpZXMocHJlc2V0LnZhbHVlKTtcbiAgICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy5vbkFwcGx5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGb3JtYXR0ZWREYXRlKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBpZiAoZGF0ZSkge1xuICAgICAgY29uc3QgbG9jYWxlID0gdGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKTtcbiAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSBnZXRMb2NhbGVEYXRlRm9ybWF0KGxvY2FsZSwgRm9ybWF0V2lkdGguU2hvcnQpO1xuICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoYCR7ZGF0ZS5tb250aH0vJHtkYXRlLmRheX0vJHtkYXRlLnllYXJ9YCwgZGF0ZUZvcm1hdCwgbG9jYWxlKTtcbiAgICAgIHJldHVybiBmb3JtYXR0ZWREYXRlO1xuICAgIH1cbiAgfVxuXG4gIGlzSG92ZXJlZCA9IChkYXRlOiBOZ2JEYXRlKSA9PlxuICAgIHRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlICYmIHRoaXMuaG92ZXJlZERhdGUgJiYgZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSAmJiBkYXRlLmJlZm9yZSh0aGlzLmhvdmVyZWREYXRlKTtcblxuICBpc0luc2lkZSA9IChkYXRlOiBOZ2JEYXRlKSA9PiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpICYmIGRhdGUuYmVmb3JlKHRoaXMudG9EYXRlKTtcblxuICBpc1JhbmdlID0gKGRhdGU6IE5nYkRhdGUpID0+XG4gICAgZGF0ZS5lcXVhbHModGhpcy5mcm9tRGF0ZSkgfHwgZGF0ZS5lcXVhbHModGhpcy50b0RhdGUpIHx8IHRoaXMuaXNJbnNpZGUoZGF0ZSkgfHwgdGhpcy5pc0hvdmVyZWQoZGF0ZSk7XG5cbiAgc2hvd0RhdGVwaWNrZXIoKSB7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiAnQ1VTVE9NJyB9KTtcbiAgfVxuXG4gIG9uRmlsdGVyQ2hhbmdlKGZpbHRlciwgaW5kZXgpIHtcbiAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW2luZGV4XTtcbiAgfVxuXG4gIHNldFByZXNldCh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKSB7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgdGhpcy5vbkFwcGx5KCk7XG4gIH1cblxuICBzZXRGaWx0ZXIoaW5kZXg6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmZpbHRlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1tpbmRleF07XG4gICAgfVxuICB9XG5cbiAgc2V0RGF0ZVJhbmdlKHZhbHVlKSB7XG4gICAgdGhpcy5mcm9tRGF0ZSA9IG5ldyBOZ2JEYXRlKHZhbHVlLmZyb21EYXRlLnllYXIsIHZhbHVlLmZyb21EYXRlLm1vbnRoLCB2YWx1ZS5mcm9tRGF0ZS5kYXkpO1xuICAgIHRoaXMudG9EYXRlID0gbmV3IE5nYkRhdGUodmFsdWUudG9EYXRlLnllYXIsIHZhbHVlLnRvRGF0ZS5tb250aCwgdmFsdWUudG9EYXRlLmRheSk7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gdmFsdWUudmFsdWUgPT09ICdDVVNUT00nO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZS52YWx1ZTtcblxuICAgIGlmICh0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZmlsdGVyU2VsZWN0ZWQgPSB0aGlzLmZpbHRlcnMuZmluZEluZGV4KChmKSA9PiBmLmZpZWxkID09PSB2YWx1ZS5maWx0ZXIpO1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1t0aGlzLmZpbHRlclNlbGVjdGVkXTtcbiAgICB9XG5cbiAgICB0aGlzLm9uQXBwbHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0SW5wdXRMYWJlbCgpIHtcbiAgICBpZiAodGhpcy5wcmVzZXRzKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMucHJlc2V0cy5maW5kKChwKSA9PiBwLnZhbHVlID09PSB0aGlzLnByZXNldFNlbGVjdGVkKTtcblxuICAgICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICAgIGlmICh0aGlzLmZyb21EYXRlID09PSBudWxsIHx8IHRoaXMudG9EYXRlID09PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSBzZWxlY3RlZC5sYWJlbDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkID09PSBudWxsIHx8ICh0aGlzLnByZXNldFNlbGVjdGVkICE9PSBudWxsICYmIHRoaXMucHJlc2V0U2VsZWN0ZWQgIT09ICdDVVNUT00nKSkge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gc2VsZWN0ZWQubGFiZWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSB0aGlzLmRhdGVGb3JtYXQoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkID09PSAnQ1VTVE9NJyAmJiB0aGlzLmZyb21EYXRlICYmIHRoaXMudG9EYXRlKSB7XG4gICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gdGhpcy5kYXRlRm9ybWF0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkYXRlRm9ybWF0KCkge1xuICAgIHJldHVybiB0aGlzLmlucHV0Rm9ybWF0XG4gICAgICAucmVwbGFjZSgne2Zyb21EYXRlfScsIHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSh0aGlzLmZyb21EYXRlKSlcbiAgICAgIC5yZXBsYWNlKCd7dG9EYXRlfScsIHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSh0aGlzLnRvRGF0ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXlzSW5Nb250aCh5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGgsIDApLmdldERhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RnJvbUFuZFRvRGF0ZXModmFsdWU6IFBiZHNEYXRlcmFuZ2VQcmVzZXRWYWx1ZSk6IHsgZnJvbTogTmdiRGF0ZVN0cnVjdDsgdG86IE5nYkRhdGVTdHJ1Y3QgfSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IG5vdy5nZXRNb250aCgpO1xuICAgIGNvbnN0IGN1cnJlbnREYXkgPSBub3cuZ2V0RGF0ZSgpO1xuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgJ1BSRVZJT1VTX01PTlRIJzpcbiAgICAgICAgY29uc3QgeWVhciA9IGN1cnJlbnRNb250aCA+IDAgPyBjdXJyZW50WWVhciA6IGN1cnJlbnRZZWFyIC0gMTtcbiAgICAgICAgY29uc3QgbW9udGggPSBjdXJyZW50TW9udGggPiAwID8gY3VycmVudE1vbnRoIDogMTI7XG4gICAgICAgIGNvbnN0IGRheSA9IDE7XG4gICAgICAgIGNvbnN0IGxhc3REYXkgPSB0aGlzLmdldERheXNJbk1vbnRoKHllYXIsIG1vbnRoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmcm9tOiB7IHllYXIsIG1vbnRoLCBkYXkgfSxcbiAgICAgICAgICB0bzogeyB5ZWFyLCBtb250aCwgZGF5OiBsYXN0RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGNhc2UgJ1lFQVJfVE9fREFURSc6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnJvbTogeyB5ZWFyOiBjdXJyZW50WWVhciwgbW9udGg6IDEsIGRheTogMSB9LFxuICAgICAgICAgIHRvOiB7IHllYXI6IGN1cnJlbnRZZWFyLCBtb250aDogY3VycmVudE1vbnRoICsgMSwgZGF5OiBjdXJyZW50RGF5IH1cbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB7IGZyb206IG51bGwsIHRvOiBudWxsIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXREYXRlUHJvcGVydGllcyh2YWx1ZTogUGJkc0RhdGVyYW5nZVByZXNldFZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSAnUFJFVklPVVNfTU9OVEgnIHx8IHZhbHVlID09PSAnWUVBUl9UT19EQVRFJykge1xuICAgICAgY29uc3QgeyBmcm9tLCB0byB9ID0gdGhpcy5nZXRGcm9tQW5kVG9EYXRlcyh2YWx1ZSk7XG4gICAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUoZnJvbS55ZWFyLCBmcm9tLm1vbnRoLCBmcm9tLmRheSk7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHRvLnllYXIsIHRvLm1vbnRoLCB0by5kYXkpO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLmZyb21EYXRlO1xuICAgIH0gZWxzZSBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLnRvRGF0ZSwgJ2QnLCBOdW1iZXIodmFsdWUpKTtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5mcm9tRGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==