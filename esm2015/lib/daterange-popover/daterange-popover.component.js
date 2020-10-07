import { Component, Injectable, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { getLocaleDayNames, getLocaleMonthNames, getLocaleFirstDayOfWeek, FormStyle, TranslationWidth, getLocaleDateFormat, FormatWidth, formatDate } from '@angular/common';
import { NgbPopover, NgbDate, NgbCalendar, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
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
                label: 'Year to Date',
                value: 365
            }
        ];
        this.presetSelected = null;
        this.filterSelected = 0;
        this.showCustomPreset = true;
        this.applyText = 'Apply';
        this.cancelText = 'Cancel';
        this.customRangeText = 'Custom Range';
        this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y');
        this.maxDate = this.calendar.getToday();
        this.fromDate = null;
        this.toDate = null;
        this.inputFormat = '{fromDate} to {toDate}';
        this.change = new EventEmitter();
        this.firstDayOfWeek = getLocaleFirstDayOfWeek(this.daterangeService.getCurrentLocale());
        this.dateRange = '';
        this.isDatepickerVisible = false;
        this.presetSelect = $event => {
            if ($event.value === 'custom') {
                this.presetSelected = 'custom';
                return false;
            }
            if ($event.value) {
                this.toDate = this.calendar.getToday();
                this.fromDate = this.calendar.getPrev(this.toDate, 'd', $event.value);
                this.presetSelected = $event.value;
            }
            else {
                this.fromDate = null;
                this.toDate = null;
                this.presetSelected = null;
            }
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
        if (this.presetSelected === 'custom') {
            this.showDatepicker();
        }
    }
    ngOnChanges(changes) {
        if (changes.filters && this.filters) {
            this.selectedFilter = this.filters[this.filterSelected];
        }
        if (changes.presets) {
            if (!this.filters && this.presetSelected) {
                this.presetClick(this.presets.find(p => p.value === this.presetSelected));
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
        this.change.emit({
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
            if (preset.value === 'custom') {
                return false;
            }
            if (preset.value) {
                this.toDate = this.calendar.getToday();
                this.fromDate = this.calendar.getPrev(this.toDate, 'd', preset.value);
                this.presetSelected = preset.value;
            }
            else {
                this.fromDate = null;
                this.toDate = null;
                this.presetSelected = null;
            }
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
        this.presetSelect({ value: 'custom' });
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
        this.isDatepickerVisible = value.value === 'custom';
        this.presetSelected = value.value;
        if (this.filters) {
            this.filterSelected = this.filters.findIndex(f => f.field === value.filter);
            this.selectedFilter = this.filters[this.filterSelected];
        }
        this.apply();
    }
    setInputLabel() {
        if (this.presets) {
            const selected = this.presets.find(p => p.value === this.presetSelected);
            if (selected) {
                if (this.fromDate === null || this.toDate === null) {
                    this.dateRange = selected.label;
                }
                else if (this.presetSelected === null || (this.presetSelected !== null && this.presetSelected !== 'custom')) {
                    this.dateRange = selected.label;
                }
                else {
                    this.dateRange = this.dateFormat();
                }
            }
            else if (this.presetSelected === 'custom' && this.fromDate && this.toDate) {
                this.dateRange = this.dateFormat();
            }
        }
    }
    dateFormat() {
        return this.inputFormat
            .replace('{fromDate}', this.getFormattedDate(this.fromDate))
            .replace('{toDate}', this.getFormattedDate(this.toDate));
    }
}
PbdsDaterangePopoverComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-daterange-popover',
                template: "<div class=\"input-group pbds-daterange-popover\">\n  <input\n    type=\"text\"\n    class=\"form-control\"\n    aria-describedby=\"daterange-button\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <button\n      class=\"btn btn-secondary\"\n      type=\"button\"\n      id=\"daterange-button\"\n      #datepickerPopup=\"ngbPopover\"\n      [ngbPopover]=\"daterangeContent\"\n      popoverClass=\"daterange-popover\"\n      autoClose=\"outside\"\n      container=\"body\"\n      placement=\"bottom-right auto\"\n      aria-label=\"Open Daterange Picker\"\n    >\n      <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n\n  <ng-template #daterangeContent>\n    <div>\n      <div class=\"d-block d-md-flex\">\n        <div *ngIf=\"isDatepickerVisible\">\n          <ngb-datepicker\n            #datepicker\n            [displayMonths]=\"'2'\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            navigation=\"select\"\n            outsideDays=\"hidden\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [showWeekdays]=\"true\"\n            [dayTemplate]=\"t\"\n            (select)=\"onDateSelection($event)\"\n          >\n          </ngb-datepicker>\n          <!--  -->\n\n          <ng-template #t let-date let-focused=\"focused\">\n            <span\n              class=\"custom-day\"\n              [class.focused]=\"focused\"\n              [class.range]=\"isRange(date)\"\n              [class.faded]=\"isHovered(date) || isInside(date)\"\n              (mouseenter)=\"hoveredDate = date\"\n              (mouseleave)=\"hoveredDate = null\"\n            >\n              {{ date.day }}\n            </span>\n          </ng-template>\n        </div>\n\n        <div\n          class=\"d-flex flex-column justify-content-lg-between mt-md-0\"\n          [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\"\n        >\n          <!-- filters -->\n          <div *ngIf=\"filters\" class=\"mb-3\" ngbDropdown>\n            <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n              {{ selectedFilter.label }}\n            </button>\n            <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n              <button\n                class=\"dropdown-item\"\n                type=\"button\"\n                *ngFor=\"let filter of filters; let index = index\"\n                (click)=\"onFilterChange(filter, index)\"\n              >\n                {{ filter.label }}\n              </button>\n            </div>\n          </div>\n\n          <!-- presets radio buttons-->\n          <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n            <mat-radio-group\n              aria-label=\"Select an option\"\n              class=\"stacked-radio-group\"\n              name=\"presets\"\n              [(ngModel)]=\"presetSelected\"\n              (change)=\"presetSelect($event)\"\n            >\n              <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{\n                preset.label\n              }}</mat-radio-button>\n\n              <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'custom'\" (change)=\"showDatepicker()\">{{\n                customRangeText\n              }}</mat-radio-button>\n            </mat-radio-group>\n          </div>\n\n          <!-- presets buttons-->\n          <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngFor=\"let preset of presets\"\n              (click)=\"presetClick(preset)\"\n            >\n              {{ preset.label }}\n            </button>\n\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngIf=\"showCustomPreset\"\n              (click)=\"showDatepicker()\"\n            >\n              {{ customRangeText }}\n            </button>\n          </div>\n\n          <!-- buttons -->\n          <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n            <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"apply()\">{{ applyText }}</button>\n            <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"cancel()\">\n              {{ cancelText }}\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </ng-template>\n</div>\n",
                providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
            },] }
];
PbdsDaterangePopoverComponent.ctorParameters = () => [
    { type: NgbCalendar },
    { type: PbdsDaterangeService }
];
PbdsDaterangePopoverComponent.propDecorators = {
    datepickerPopup: [{ type: ViewChild, args: ['datepickerPopup', { static: true },] }],
    presets: [{ type: Input }],
    presetSelected: [{ type: Input }],
    filters: [{ type: Input }],
    filterSelected: [{ type: Input }],
    showCustomPreset: [{ type: Input }],
    applyText: [{ type: Input }],
    cancelText: [{ type: Input }],
    customRangeText: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    fromDate: [{ type: Input }],
    toDate: [{ type: Input }],
    inputFormat: [{ type: Input }],
    change: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9zdDAxNmxvL2dpdGh1Yi9uZy1kZXNpZ25zeXN0ZW0vY2xpZW50L3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vc3JjLyIsInNvdXJjZXMiOlsibGliL2RhdGVyYW5nZS1wb3BvdmVyL2RhdGVyYW5nZS1wb3BvdmVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFFVixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBR2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixtQkFBbUIsRUFDbkIsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsbUJBQW1CLEVBQ25CLFdBQVcsRUFDWCxVQUFVLEVBQ1gsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QixPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQWlCLE1BQU0sNEJBQTRCLENBQUM7QUFHaEgsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFbkUsdUVBQXVFO0FBRXZFLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxpQkFBaUI7SUFDekQsWUFBbUIsZ0JBQXNDO1FBQ3ZELEtBQUssRUFBRSxDQUFDO1FBRFMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFzQjtJQUV6RCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsT0FBZTtRQUNqQyxzREFBc0Q7UUFDdEQsT0FBTyxHQUFHLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRXRDLGVBQWU7UUFDZixpQkFBaUI7UUFDakIsOENBQThDO1FBQzlDLGFBQWE7UUFDYiw2SEFBNkg7UUFDN0gsS0FBSztRQUVMLE9BQU8saUJBQWlC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QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDM0QsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQzs7O1lBL1BGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsd0JBQXdCO2dCQUNsQyxvaEpBQWlEO2dCQUNqRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQzthQUU1RTs7O1lBcEQ2QixXQUFXO1lBR2hDLG9CQUFvQjs7OzhCQW1EMUIsU0FBUyxTQUFDLGlCQUFpQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtzQkFFN0MsS0FBSzs2QkFvQkwsS0FBSztzQkFHTCxLQUFLOzZCQUdMLEtBQUs7K0JBR0wsS0FBSzt3QkFHTCxLQUFLO3lCQUdMLEtBQUs7OEJBR0wsS0FBSztzQkFHTCxLQUFLO3NCQUdMLEtBQUs7dUJBR0wsS0FBSztxQkFHTCxLQUFLOzBCQUdMLEtBQUs7cUJBR0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5qZWN0YWJsZSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBnZXRMb2NhbGVEYXlOYW1lcyxcbiAgZ2V0TG9jYWxlTW9udGhOYW1lcyxcbiAgZ2V0TG9jYWxlRmlyc3REYXlPZldlZWssXG4gIEZvcm1TdHlsZSxcbiAgVHJhbnNsYXRpb25XaWR0aCxcbiAgZ2V0TG9jYWxlRGF0ZUZvcm1hdCxcbiAgRm9ybWF0V2lkdGgsXG4gIGZvcm1hdERhdGVcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgTmdiUG9wb3ZlciwgTmdiRGF0ZSwgTmdiQ2FsZW5kYXIsIE5nYkRhdGVwaWNrZXJJMThuLCBOZ2JEYXRlU3RydWN0IH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuXG5pbXBvcnQgeyBQYmRzRGF0ZXJhbmdlUHJlc2V0LCBQYmRzRGF0ZXJhbmdlRmlsdGVyLCBQYmRzRGF0ZXJhbmdlQ2hhbmdlIH0gZnJvbSAnLi9kYXRlcmFuZ2UtcG9wb3Zlci5pbnRlcmZhY2VzJztcbmltcG9ydCB7IFBiZHNEYXRlcmFuZ2VTZXJ2aWNlIH0gZnJvbSAnLi9kYXRlcmFuZ2UtcG9wb3Zlci5zZXJ2aWNlJztcblxuLy8gRGVmaW5lIGN1c3RvbSBzZXJ2aWNlIHByb3ZpZGluZyB0aGUgbW9udGhzIGFuZCB3ZWVrZGF5cyB0cmFuc2xhdGlvbnNcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDdXN0b21EYXRlcGlja2VySTE4biBleHRlbmRzIE5nYkRhdGVwaWNrZXJJMThuIHtcbiAgY29uc3RydWN0b3IocHVibGljIGRhdGVyYW5nZVNlcnZpY2U6IFBiZHNEYXRlcmFuZ2VTZXJ2aWNlKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGdldFdlZWtkYXlTaG9ydE5hbWUod2Vla2RheTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAvLyBmb3IgbmctYm9vdHN0cmFwLCBzdW5kYXkgbnVtYmVyIG9mIDcgY29udmVydGVkIHRvIDBcbiAgICB3ZWVrZGF5ID0gd2Vla2RheSA9PT0gNyA/IDAgOiB3ZWVrZGF5O1xuXG4gICAgLy8gY29uc29sZS5sb2coXG4gICAgLy8gICAnd2Vla2RheTogJyxcbiAgICAvLyAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksXG4gICAgLy8gICB3ZWVrZGF5LFxuICAgIC8vICAgZ2V0TG9jYWxlRGF5TmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWQpW3dlZWtkYXldXG4gICAgLy8gKTtcblxuICAgIHJldHVybiBnZXRMb2NhbGVEYXlOYW1lcyhcbiAgICAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksXG4gICAgICBGb3JtU3R5bGUuU3RhbmRhbG9uZSxcbiAgICAgIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWRcbiAgICApW3dlZWtkYXldO1xuICB9XG5cbiAgZ2V0TW9udGhTaG9ydE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGdldExvY2FsZU1vbnRoTmFtZXModGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSlbXG4gICAgICBtb250aCAtIDFcbiAgICBdO1xuICB9XG5cbiAgZ2V0TW9udGhGdWxsTmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0TG9jYWxlTW9udGhOYW1lcyh0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5XaWRlKVtcbiAgICAgIG1vbnRoIC0gMVxuICAgIF07XG4gIH1cblxuICBnZXREYXlBcmlhTGFiZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke2RhdGUuZGF5fS0ke2RhdGUubW9udGh9LSR7ZGF0ZS55ZWFyfWA7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1kYXRlcmFuZ2UtcG9wb3ZlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQuaHRtbCcsXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTmdiRGF0ZXBpY2tlckkxOG4sIHVzZUNsYXNzOiBDdXN0b21EYXRlcGlja2VySTE4biB9XSxcbiAgc3R5bGVzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0ZXJhbmdlUG9wb3ZlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQFZpZXdDaGlsZCgnZGF0ZXBpY2tlclBvcHVwJywgeyBzdGF0aWM6IHRydWUgfSkgcHJpdmF0ZSBkYXRlcGlja2VyUG9wdXA6IE5nYlBvcG92ZXI7XG5cbiAgQElucHV0KClcbiAgcHJlc2V0czogQXJyYXk8UGJkc0RhdGVyYW5nZVByZXNldD4gPSBbXG4gICAge1xuICAgICAgbGFiZWw6ICdBbGwgRGF0ZXMnLFxuICAgICAgdmFsdWU6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTGFzdCA3IERheXMnLFxuICAgICAgdmFsdWU6IDdcbiAgICB9LFxuICAgIHtcbiAgICAgIGxhYmVsOiAnTGFzdCAzMCBEYXlzJyxcbiAgICAgIHZhbHVlOiAzMFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdZZWFyIHRvIERhdGUnLFxuICAgICAgdmFsdWU6IDM2NVxuICAgIH1cbiAgXTtcblxuICBASW5wdXQoKVxuICBwcmVzZXRTZWxlY3RlZDogbnVtYmVyIHwgbnVsbCB8ICdjdXN0b20nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBmaWx0ZXJzOiBBcnJheTxQYmRzRGF0ZXJhbmdlRmlsdGVyPjtcblxuICBASW5wdXQoKVxuICBmaWx0ZXJTZWxlY3RlZCA9IDA7XG5cbiAgQElucHV0KClcbiAgc2hvd0N1c3RvbVByZXNldCA9IHRydWU7XG5cbiAgQElucHV0KClcbiAgYXBwbHlUZXh0ID0gJ0FwcGx5JztcblxuICBASW5wdXQoKVxuICBjYW5jZWxUZXh0ID0gJ0NhbmNlbCc7XG5cbiAgQElucHV0KClcbiAgY3VzdG9tUmFuZ2VUZXh0ID0gJ0N1c3RvbSBSYW5nZSc7XG5cbiAgQElucHV0KClcbiAgbWluRGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCksICd5Jyk7XG5cbiAgQElucHV0KClcbiAgbWF4RGF0ZTogTmdiRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKTtcblxuICBASW5wdXQoKVxuICBmcm9tRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIHRvRGF0ZTogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGlucHV0Rm9ybWF0ID0gJ3tmcm9tRGF0ZX0gdG8ge3RvRGF0ZX0nO1xuXG4gIEBPdXRwdXQoKVxuICBwcml2YXRlIGNoYW5nZTogRXZlbnRFbWl0dGVyPFBiZHNEYXRlcmFuZ2VDaGFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcjxQYmRzRGF0ZXJhbmdlQ2hhbmdlPigpO1xuXG4gIGZpcnN0RGF5T2ZXZWVrID0gZ2V0TG9jYWxlRmlyc3REYXlPZldlZWsodGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSk7XG5cbiAgaG92ZXJlZERhdGU6IE5nYkRhdGU7XG5cbiAgZGF0ZVJhbmdlID0gJyc7XG4gIGlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgc2VsZWN0ZWRGaWx0ZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIHByaXZhdGUgZGF0ZXJhbmdlU2VydmljZTogUGJkc0RhdGVyYW5nZVNlcnZpY2UpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gY2hpbmEgc2hvdWxkIHN0YXJ0IG9uIGEgTW9uZGF5LCBBbmd1bGFyIGxvY2FsZSByZXR1cm5zIGluY29ycmVjdCAwXG4gICAgdGhpcy5maXJzdERheU9mV2VlayA9XG4gICAgICB0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpID09PSAnemgtY24nID8gdGhpcy5maXJzdERheU9mV2VlayArIDEgOiB0aGlzLmZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdjdXN0b20nKSB7XG4gICAgICB0aGlzLnNob3dEYXRlcGlja2VyKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW3RoaXMuZmlsdGVyU2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnByZXNldHMpIHtcbiAgICAgIGlmICghdGhpcy5maWx0ZXJzICYmIHRoaXMucHJlc2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5wcmVzZXRDbGljayh0aGlzLnByZXNldHMuZmluZChwID0+IHAudmFsdWUgPT09IHRoaXMucHJlc2V0U2VsZWN0ZWQpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkIH0pO1xuICAgICAgICB0aGlzLmFwcGx5KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgKGNoYW5nZXMudG9UZXh0ICYmIGNoYW5nZXMudG9UZXh0LmZpcnN0Q2hhbmdlID09PSBmYWxzZSkge1xuICAgIC8vICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy5zZXRJbnB1dExhYmVsKCk7XG4gIH1cblxuICBhcHBseSgpIHtcbiAgICB0aGlzLnNldElucHV0TGFiZWwoKTtcbiAgICB0aGlzLmNoYW5nZS5lbWl0KHtcbiAgICAgIGZyb21EYXRlOiB0aGlzLmZyb21EYXRlLFxuICAgICAgdG9EYXRlOiB0aGlzLnRvRGF0ZSxcbiAgICAgIGZvcm1hdHRlZERhdGU6IHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA/IHRoaXMuZGF0ZUZvcm1hdCgpIDogdGhpcy5kYXRlUmFuZ2UsXG4gICAgICBmaWx0ZXI6IHRoaXMuZmlsdGVycyA/IHRoaXMuc2VsZWN0ZWRGaWx0ZXIuZmllbGQgOiBudWxsLFxuICAgICAgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWRcbiAgICB9KTtcblxuICAgIHRoaXMuZGF0ZXBpY2tlclBvcHVwLmNsb3NlKCk7XG4gIH1cblxuICBjYW5jZWwoKSB7XG4gICAgdGhpcy5kYXRlcGlja2VyUG9wdXAuY2xvc2UoKTtcbiAgfVxuXG4gIG9uRGF0ZVNlbGVjdGlvbihkYXRlOiBOZ2JEYXRlKSB7XG4gICAgaWYgKCF0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSkge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IGRhdGU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZyb21EYXRlICYmICF0aGlzLnRvRGF0ZSAmJiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpKSB7XG4gICAgICB0aGlzLnRvRGF0ZSA9IGRhdGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudG9EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMuZnJvbURhdGUgPSBkYXRlO1xuICAgIH1cblxuICAgIC8vIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgcHJlc2V0U2VsZWN0ID0gJGV2ZW50ID0+IHtcbiAgICBpZiAoJGV2ZW50LnZhbHVlID09PSAnY3VzdG9tJykge1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9ICdjdXN0b20nO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgkZXZlbnQudmFsdWUpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLnRvRGF0ZSwgJ2QnLCAkZXZlbnQudmFsdWUpO1xuICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9ICRldmVudC52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnRvRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSBmYWxzZTtcbiAgfTtcblxuICBwcmVzZXRDbGljayhwcmVzZXQpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnUFJFU0VUIENMSUNLOiAnLCBwcmVzZXQpO1xuICAgIGlmIChwcmVzZXQpIHtcbiAgICAgIGlmIChwcmVzZXQudmFsdWUgPT09ICdjdXN0b20nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXNldC52YWx1ZSkge1xuICAgICAgICB0aGlzLnRvRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKTtcbiAgICAgICAgdGhpcy5mcm9tRGF0ZSA9IHRoaXMuY2FsZW5kYXIuZ2V0UHJldih0aGlzLnRvRGF0ZSwgJ2QnLCBwcmVzZXQudmFsdWUpO1xuICAgICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gcHJlc2V0LnZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5mcm9tRGF0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMudG9EYXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy5hcHBseSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Rm9ybWF0dGVkRGF0ZShkYXRlOiBOZ2JEYXRlKSB7XG4gICAgaWYgKGRhdGUpIHtcbiAgICAgIGNvbnN0IGxvY2FsZSA9IHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCk7XG4gICAgICBjb25zdCBkYXRlRm9ybWF0ID0gZ2V0TG9jYWxlRGF0ZUZvcm1hdChsb2NhbGUsIEZvcm1hdFdpZHRoLlNob3J0KTtcbiAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGUgPSBmb3JtYXREYXRlKGAke2RhdGUubW9udGh9LyR7ZGF0ZS5kYXl9LyR7ZGF0ZS55ZWFyfWAsIGRhdGVGb3JtYXQsIGxvY2FsZSk7XG5cbiAgICAgIHJldHVybiBmb3JtYXR0ZWREYXRlO1xuICAgIH1cbiAgfVxuXG4gIGlzSG92ZXJlZCA9IChkYXRlOiBOZ2JEYXRlKSA9PlxuICAgIHRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlICYmIHRoaXMuaG92ZXJlZERhdGUgJiYgZGF0ZS5hZnRlcih0aGlzLmZyb21EYXRlKSAmJiBkYXRlLmJlZm9yZSh0aGlzLmhvdmVyZWREYXRlKTtcblxuICBpc0luc2lkZSA9IChkYXRlOiBOZ2JEYXRlKSA9PiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpICYmIGRhdGUuYmVmb3JlKHRoaXMudG9EYXRlKTtcblxuICBpc1JhbmdlID0gKGRhdGU6IE5nYkRhdGUpID0+XG4gICAgZGF0ZS5lcXVhbHModGhpcy5mcm9tRGF0ZSkgfHwgZGF0ZS5lcXVhbHModGhpcy50b0RhdGUpIHx8IHRoaXMuaXNJbnNpZGUoZGF0ZSkgfHwgdGhpcy5pc0hvdmVyZWQoZGF0ZSk7XG5cbiAgc2hvd0RhdGVwaWNrZXIoKSB7XG4gICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiAnY3VzdG9tJyB9KTtcbiAgfVxuXG4gIG9uRmlsdGVyQ2hhbmdlKGZpbHRlciwgaW5kZXgpIHtcbiAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW2luZGV4XTtcbiAgfVxuXG4gIHNldFByZXNldCh2YWx1ZTogbnVtYmVyIHwgbnVsbCkge1xuICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSB2YWx1ZTtcbiAgICB0aGlzLnByZXNldFNlbGVjdCh7IHZhbHVlOiB0aGlzLnByZXNldFNlbGVjdGVkIH0pO1xuICAgIHRoaXMuYXBwbHkoKTtcbiAgfVxuXG4gIHNldEZpbHRlcihpbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW2luZGV4XTtcbiAgICB9XG4gIH1cblxuICBzZXREYXRlUmFuZ2UodmFsdWUpIHtcbiAgICB0aGlzLmZyb21EYXRlID0gbmV3IE5nYkRhdGUodmFsdWUuZnJvbURhdGUueWVhciwgdmFsdWUuZnJvbURhdGUubW9udGgsIHZhbHVlLmZyb21EYXRlLmRheSk7XG4gICAgdGhpcy50b0RhdGUgPSBuZXcgTmdiRGF0ZSh2YWx1ZS50b0RhdGUueWVhciwgdmFsdWUudG9EYXRlLm1vbnRoLCB2YWx1ZS50b0RhdGUuZGF5KTtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB2YWx1ZS52YWx1ZSA9PT0gJ2N1c3RvbSc7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlLnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgICAgdGhpcy5maWx0ZXJTZWxlY3RlZCA9IHRoaXMuZmlsdGVycy5maW5kSW5kZXgoZiA9PiBmLmZpZWxkID09PSB2YWx1ZS5maWx0ZXIpO1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IHRoaXMuZmlsdGVyc1t0aGlzLmZpbHRlclNlbGVjdGVkXTtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGx5KCk7XG4gIH1cblxuICBwcml2YXRlIHNldElucHV0TGFiZWwoKSB7XG4gICAgaWYgKHRoaXMucHJlc2V0cykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLnByZXNldHMuZmluZChwID0+IHAudmFsdWUgPT09IHRoaXMucHJlc2V0U2VsZWN0ZWQpO1xuXG4gICAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuZnJvbURhdGUgPT09IG51bGwgfHwgdGhpcy50b0RhdGUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09IG51bGwgfHwgKHRoaXMucHJlc2V0U2VsZWN0ZWQgIT09IG51bGwgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gJ2N1c3RvbScpKSB7XG4gICAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSBzZWxlY3RlZC5sYWJlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJlc2V0U2VsZWN0ZWQgPT09ICdjdXN0b20nICYmIHRoaXMuZnJvbURhdGUgJiYgdGhpcy50b0RhdGUpIHtcbiAgICAgICAgdGhpcy5kYXRlUmFuZ2UgPSB0aGlzLmRhdGVGb3JtYXQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRhdGVGb3JtYXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRGb3JtYXRcbiAgICAgIC5yZXBsYWNlKCd7ZnJvbURhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMuZnJvbURhdGUpKVxuICAgICAgLnJlcGxhY2UoJ3t0b0RhdGV9JywgdGhpcy5nZXRGb3JtYXR0ZWREYXRlKHRoaXMudG9EYXRlKSk7XG4gIH1cbn1cbiJdfQ==