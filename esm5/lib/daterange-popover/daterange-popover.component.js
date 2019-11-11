/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Injectable, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { getLocaleDayNames, getLocaleMonthNames, getLocaleFirstDayOfWeek, FormStyle, TranslationWidth, getLocaleDateFormat, FormatWidth, formatDate } from '@angular/common';
import { NgbPopover, NgbDate, NgbCalendar, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { PbdsDaterangeService } from './daterange-popover.service';
// Define custom service providing the months and weekdays translations
var CustomDatepickerI18n = /** @class */ (function (_super) {
    tslib_1.__extends(CustomDatepickerI18n, _super);
    function CustomDatepickerI18n(daterangeService) {
        var _this = _super.call(this) || this;
        _this.daterangeService = daterangeService;
        return _this;
    }
    /**
     * @param {?} weekday
     * @return {?}
     */
    CustomDatepickerI18n.prototype.getWeekdayShortName = /**
     * @param {?} weekday
     * @return {?}
     */
    function (weekday) {
        // for ng-bootstrap, sunday number of 7 converted to 0
        weekday = weekday === 7 ? 0 : weekday;
        // console.log(
        //   'weekday: ',
        //   this.daterangeService.getCurrentLocale(),
        //   weekday,
        //   getLocaleDayNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Abbreviated)[weekday]
        // );
        return getLocaleDayNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Abbreviated)[weekday];
    };
    /**
     * @param {?} month
     * @return {?}
     */
    CustomDatepickerI18n.prototype.getMonthShortName = /**
     * @param {?} month
     * @return {?}
     */
    function (month) {
        return getLocaleMonthNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Wide)[month - 1];
    };
    /**
     * @param {?} month
     * @return {?}
     */
    CustomDatepickerI18n.prototype.getMonthFullName = /**
     * @param {?} month
     * @return {?}
     */
    function (month) {
        return getLocaleMonthNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Wide)[month - 1];
    };
    /**
     * @param {?} date
     * @return {?}
     */
    CustomDatepickerI18n.prototype.getDayAriaLabel = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return date.day + "-" + date.month + "-" + date.year;
    };
    CustomDatepickerI18n.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    CustomDatepickerI18n.ctorParameters = function () { return [
        { type: PbdsDaterangeService }
    ]; };
    return CustomDatepickerI18n;
}(NgbDatepickerI18n));
export { CustomDatepickerI18n };
if (false) {
    /** @type {?} */
    CustomDatepickerI18n.prototype.daterangeService;
}
var PbdsDaterangePopoverComponent = /** @class */ (function () {
    function PbdsDaterangePopoverComponent(calendar, daterangeService) {
        var _this = this;
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
        this.presetSelect = (/**
         * @param {?} $event
         * @return {?}
         */
        function ($event) {
            if ($event.value === 'custom') {
                _this.presetSelected = 'custom';
                return false;
            }
            if ($event.value) {
                _this.toDate = _this.calendar.getToday();
                _this.fromDate = _this.calendar.getPrev(_this.toDate, 'd', $event.value);
                _this.presetSelected = $event.value;
            }
            else {
                _this.fromDate = null;
                _this.toDate = null;
                _this.presetSelected = null;
            }
            _this.isDatepickerVisible = false;
        });
        this.isHovered = (/**
         * @param {?} date
         * @return {?}
         */
        function (date) {
            return _this.fromDate && !_this.toDate && _this.hoveredDate && date.after(_this.fromDate) && date.before(_this.hoveredDate);
        });
        this.isInside = (/**
         * @param {?} date
         * @return {?}
         */
        function (date) { return date.after(_this.fromDate) && date.before(_this.toDate); });
        this.isRange = (/**
         * @param {?} date
         * @return {?}
         */
        function (date) {
            return date.equals(_this.fromDate) || date.equals(_this.toDate) || _this.isInside(date) || _this.isHovered(date);
        });
    }
    /**
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        // china should start on a Monday, Angular locale returns incorrect 0
        this.firstDayOfWeek =
            this.daterangeService.getCurrentLocale() === 'zh-cn' ? this.firstDayOfWeek + 1 : this.firstDayOfWeek;
        if (this.presetSelected === 'custom') {
            this.showDatepicker();
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        if (changes.filters && this.filters) {
            this.selectedFilter = this.filters[this.filterSelected];
        }
        if (changes.presets) {
            if (!this.filters && this.presetSelected) {
                this.presetClick(this.presets.find((/**
                 * @param {?} p
                 * @return {?}
                 */
                function (p) { return p.value === _this.presetSelected; })));
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
    };
    /**
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.apply = /**
     * @return {?}
     */
    function () {
        this.setInputLabel();
        this.change.emit({
            fromDate: this.fromDate,
            toDate: this.toDate,
            formattedDate: this.isDatepickerVisible ? this.dateFormat() : this.dateRange,
            filter: this.filters ? this.selectedFilter.field : null,
            value: this.presetSelected
        });
        this.datepickerPopup.close();
    };
    /**
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.cancel = /**
     * @return {?}
     */
    function () {
        this.datepickerPopup.close();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.onDateSelection = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
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
    };
    /**
     * @param {?} preset
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.presetClick = /**
     * @param {?} preset
     * @return {?}
     */
    function (preset) {
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
    };
    /**
     * @private
     * @param {?} date
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.getFormattedDate = /**
     * @private
     * @param {?} date
     * @return {?}
     */
    function (date) {
        if (date) {
            /** @type {?} */
            var locale = this.daterangeService.getCurrentLocale();
            /** @type {?} */
            var dateFormat = getLocaleDateFormat(locale, FormatWidth.Short);
            /** @type {?} */
            var formattedDate = formatDate(date.month + "/" + date.day + "/" + date.year, dateFormat, locale);
            return formattedDate;
        }
    };
    /**
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.showDatepicker = /**
     * @return {?}
     */
    function () {
        this.isDatepickerVisible = true;
        this.presetSelect({ value: 'custom' });
    };
    /**
     * @param {?} filter
     * @param {?} index
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.onFilterChange = /**
     * @param {?} filter
     * @param {?} index
     * @return {?}
     */
    function (filter, index) {
        this.selectedFilter = this.filters[index];
    };
    /**
     * @param {?} value
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.setPreset = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.presetSelected = value;
        this.presetSelect({ value: this.presetSelected });
        this.apply();
    };
    /**
     * @param {?} index
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.setFilter = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (this.filters !== undefined) {
            this.selectedFilter = this.filters[index];
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.setDateRange = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.fromDate = new NgbDate(value.fromDate.year, value.fromDate.month, value.fromDate.day);
        this.toDate = new NgbDate(value.toDate.year, value.toDate.month, value.toDate.day);
        this.isDatepickerVisible = value.value === 'custom';
        this.presetSelected = value.value;
        if (this.filters) {
            this.filterSelected = this.filters.findIndex((/**
             * @param {?} f
             * @return {?}
             */
            function (f) { return f.field === value.filter; }));
            this.selectedFilter = this.filters[this.filterSelected];
        }
        this.apply();
    };
    /**
     * @private
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.setInputLabel = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.presets) {
            /** @type {?} */
            var selected = this.presets.find((/**
             * @param {?} p
             * @return {?}
             */
            function (p) { return p.value === _this.presetSelected; }));
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
    };
    /**
     * @private
     * @return {?}
     */
    PbdsDaterangePopoverComponent.prototype.dateFormat = /**
     * @private
     * @return {?}
     */
    function () {
        return this.inputFormat
            .replace('{fromDate}', this.getFormattedDate(this.fromDate))
            .replace('{toDate}', this.getFormattedDate(this.toDate));
    };
    PbdsDaterangePopoverComponent.decorators = [
        { type: Component, args: [{
                    selector: 'pbds-daterange-popover',
                    template: "<div class=\"input-group pbds-daterange-popover\">\n  <input\n    type=\"text\"\n    class=\"form-control\"\n    aria-describedby=\"daterange-button\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <button\n      class=\"btn btn-secondary\"\n      type=\"button\"\n      id=\"daterange-button\"\n      #datepickerPopup=\"ngbPopover\"\n      [ngbPopover]=\"daterangeContent\"\n      popoverClass=\"daterange-popover\"\n      autoClose=\"outside\"\n      container=\"body\"\n      placement=\"bottom-right auto\"\n      aria-label=\"Open Daterange Picker\"\n    >\n      <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n\n  <ng-template #daterangeContent>\n    <div>\n      <div class=\"d-block d-md-flex\">\n        <div *ngIf=\"isDatepickerVisible\">\n          <ngb-datepicker\n            #datepicker\n            [displayMonths]=\"'2'\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            navigation=\"select\"\n            outsideDays=\"hidden\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [showWeekdays]=\"true\"\n            [dayTemplate]=\"t\"\n            (select)=\"onDateSelection($event)\"\n          >\n          </ngb-datepicker>\n          <!--  -->\n\n          <ng-template #t let-date let-focused=\"focused\">\n            <span\n              class=\"custom-day\"\n              [class.focused]=\"focused\"\n              [class.range]=\"isRange(date)\"\n              [class.faded]=\"isHovered(date) || isInside(date)\"\n              (mouseenter)=\"hoveredDate = date\"\n              (mouseleave)=\"hoveredDate = null\"\n            >\n              {{ date.day }}\n            </span>\n          </ng-template>\n        </div>\n\n        <div\n          class=\"d-flex flex-column justify-content-lg-between mt-md-0\"\n          [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\"\n        >\n          <!-- filters -->\n          <div *ngIf=\"filters\" class=\"mb-3\" ngbDropdown>\n            <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n              {{ selectedFilter.label }}\n            </button>\n            <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n              <button\n                class=\"dropdown-item\"\n                type=\"button\"\n                *ngFor=\"let filter of filters; let index = index\"\n                (click)=\"onFilterChange(filter, index)\"\n              >\n                {{ filter.label }}\n              </button>\n            </div>\n          </div>\n\n          <!-- presets radio buttons-->\n          <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n            <mat-radio-group\n              aria-label=\"Select an option\"\n              class=\"stacked-radio-group\"\n              name=\"presets\"\n              [(ngModel)]=\"presetSelected\"\n              (change)=\"presetSelect($event)\"\n            >\n              <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{\n                preset.label\n              }}</mat-radio-button>\n\n              <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'custom'\" (change)=\"showDatepicker()\">{{\n                customRangeText\n              }}</mat-radio-button>\n            </mat-radio-group>\n          </div>\n\n          <!-- presets buttons-->\n          <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngFor=\"let preset of presets\"\n              (click)=\"presetClick(preset)\"\n            >\n              {{ preset.label }}\n            </button>\n\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngIf=\"showCustomPreset\"\n              (click)=\"showDatepicker()\"\n            >\n              {{ customRangeText }}\n            </button>\n          </div>\n\n          <!-- buttons -->\n          <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n            <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"apply()\">{{ applyText }}</button>\n            <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"cancel()\">\n              {{ cancelText }}\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </ng-template>\n</div>\n",
                    providers: [{ provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
                }] }
    ];
    /** @nocollapse */
    PbdsDaterangePopoverComponent.ctorParameters = function () { return [
        { type: NgbCalendar },
        { type: PbdsDaterangeService }
    ]; };
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
    return PbdsDaterangePopoverComponent;
}());
export { PbdsDaterangePopoverComponent };
if (false) {
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangePopoverComponent.prototype.datepickerPopup;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.presets;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.presetSelected;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.filters;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.filterSelected;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.showCustomPreset;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.applyText;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.cancelText;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.customRangeText;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.minDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.maxDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.fromDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.toDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.inputFormat;
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangePopoverComponent.prototype.change;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.firstDayOfWeek;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.hoveredDate;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.dateRange;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.isDatepickerVisible;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.selectedFilter;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.presetSelect;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.isHovered;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.isInside;
    /** @type {?} */
    PbdsDaterangePopoverComponent.prototype.isRange;
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangePopoverComponent.prototype.calendar;
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangePopoverComponent.prototype.daterangeService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vcGItZGVzaWduLXN5c3RlbS8iLCJzb3VyY2VzIjpbImxpYi9kYXRlcmFuZ2UtcG9wb3Zlci9kYXRlcmFuZ2UtcG9wb3Zlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFFVixTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBR2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixtQkFBbUIsRUFDbkIsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsbUJBQW1CLEVBQ25CLFdBQVcsRUFDWCxVQUFVLEVBQ1gsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QixPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQWlCLE1BQU0sNEJBQTRCLENBQUM7QUFHaEgsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBR25FO0lBQzBDLGdEQUFpQjtJQUN6RCw4QkFBbUIsZ0JBQXNDO1FBQXpELFlBQ0UsaUJBQU8sU0FDUjtRQUZrQixzQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQXNCOztJQUV6RCxDQUFDOzs7OztJQUVELGtEQUFtQjs7OztJQUFuQixVQUFvQixPQUFlO1FBQ2pDLHNEQUFzRDtRQUN0RCxPQUFPLEdBQUcsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFdEMsZUFBZTtRQUNmLGlCQUFpQjtRQUNqQiw4Q0FBOEM7UUFDOUMsYUFBYTtRQUNiLDZIQUE2SDtRQUM3SCxLQUFLO1FBRUwsT0FBTyxpQkFBaUIsQ0FDdEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLEVBQ3hDLFNBQVMsQ0FBQyxV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Qix5REFDd0I7O0lBRXhCLGtEQUNvQjs7SUFFcEIsbURBQ3NCOztJQUV0Qix3REFDaUM7O0lBRWpDLGdEQUN3RTs7SUFFeEUsZ0RBQzRDOztJQUU1QyxpREFDZ0M7O0lBRWhDLCtDQUM4Qjs7SUFFOUIsb0RBQ3VDOzs7OztJQUV2QywrQ0FDNEY7O0lBRTVGLHVEQUFtRjs7SUFFbkYsb0RBQXFCOztJQUVyQixrREFBZTs7SUFDZiw0REFBNEI7O0lBQzVCLHVEQUFlOztJQWlFZixxREFpQkU7O0lBa0NGLGtEQUNrSDs7SUFFbEgsaURBQW9GOztJQUVwRixnREFDd0c7Ozs7O0lBeEg1RixpREFBNkI7Ozs7O0lBQUUseURBQThDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbmplY3RhYmxlLFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIGdldExvY2FsZURheU5hbWVzLFxuICBnZXRMb2NhbGVNb250aE5hbWVzLFxuICBnZXRMb2NhbGVGaXJzdERheU9mV2VlayxcbiAgRm9ybVN0eWxlLFxuICBUcmFuc2xhdGlvbldpZHRoLFxuICBnZXRMb2NhbGVEYXRlRm9ybWF0LFxuICBGb3JtYXRXaWR0aCxcbiAgZm9ybWF0RGF0ZVxufSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBOZ2JQb3BvdmVyLCBOZ2JEYXRlLCBOZ2JDYWxlbmRhciwgTmdiRGF0ZXBpY2tlckkxOG4sIE5nYkRhdGVTdHJ1Y3QgfSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCc7XG5cbmltcG9ydCB7IFBiZHNEYXRlcmFuZ2VQcmVzZXQsIFBiZHNEYXRlcmFuZ2VGaWx0ZXIsIFBiZHNEYXRlcmFuZ2VDaGFuZ2UgfSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgUGJkc0RhdGVyYW5nZVNlcnZpY2UgfSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyLnNlcnZpY2UnO1xuXG4vLyBEZWZpbmUgY3VzdG9tIHNlcnZpY2UgcHJvdmlkaW5nIHRoZSBtb250aHMgYW5kIHdlZWtkYXlzIHRyYW5zbGF0aW9uc1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEN1c3RvbURhdGVwaWNrZXJJMThuIGV4dGVuZHMgTmdiRGF0ZXBpY2tlckkxOG4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0ZXJhbmdlU2VydmljZTogUGJkc0RhdGVyYW5nZVNlcnZpY2UpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgZ2V0V2Vla2RheVNob3J0TmFtZSh3ZWVrZGF5OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIC8vIGZvciBuZy1ib290c3RyYXAsIHN1bmRheSBudW1iZXIgb2YgNyBjb252ZXJ0ZWQgdG8gMFxuICAgIHdlZWtkYXkgPSB3ZWVrZGF5ID09PSA3ID8gMCA6IHdlZWtkYXk7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhcbiAgICAvLyAgICd3ZWVrZGF5OiAnLFxuICAgIC8vICAgdGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSxcbiAgICAvLyAgIHdlZWtkYXksXG4gICAgLy8gICBnZXRMb2NhbGVEYXlOYW1lcyh0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5BYmJyZXZpYXRlZClbd2Vla2RheV1cbiAgICAvLyApO1xuXG4gICAgcmV0dXJuIGdldExvY2FsZURheU5hbWVzKFxuICAgICAgdGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKSxcbiAgICAgIEZvcm1TdHlsZS5TdGFuZGFsb25lLFxuICAgICAgVHJhbnNsYXRpb25XaWR0aC5BYmJyZXZpYXRlZFxuICAgIClbd2Vla2RheV07XG4gIH1cblxuICBnZXRNb250aFNob3J0TmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZ2V0TG9jYWxlTW9udGhOYW1lcyh0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5XaWRlKVtcbiAgICAgIG1vbnRoIC0gMVxuICAgIF07XG4gIH1cblxuICBnZXRNb250aEZ1bGxOYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBnZXRMb2NhbGVNb250aE5hbWVzKHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCksIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLldpZGUpW1xuICAgICAgbW9udGggLSAxXG4gICAgXTtcbiAgfVxuXG4gIGdldERheUFyaWFMYWJlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7ZGF0ZS5kYXl9LSR7ZGF0ZS5tb250aH0tJHtkYXRlLnllYXJ9YDtcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWRhdGVyYW5nZS1wb3BvdmVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2RhdGVyYW5nZS1wb3BvdmVyLmNvbXBvbmVudC5odG1sJyxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOZ2JEYXRlcGlja2VySTE4biwgdXNlQ2xhc3M6IEN1c3RvbURhdGVwaWNrZXJJMThuIH1dLFxuICBzdHlsZXM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRlcmFuZ2VQb3BvdmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBAVmlld0NoaWxkKCdkYXRlcGlja2VyUG9wdXAnLCB7IHN0YXRpYzogdHJ1ZSB9KSBwcml2YXRlIGRhdGVwaWNrZXJQb3B1cDogTmdiUG9wb3ZlcjtcblxuICBASW5wdXQoKVxuICBwcmVzZXRzOiBBcnJheTxQYmRzRGF0ZXJhbmdlUHJlc2V0PiA9IFtcbiAgICB7XG4gICAgICBsYWJlbDogJ0FsbCBEYXRlcycsXG4gICAgICB2YWx1ZTogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdMYXN0IDcgRGF5cycsXG4gICAgICB2YWx1ZTogN1xuICAgIH0sXG4gICAge1xuICAgICAgbGFiZWw6ICdMYXN0IDMwIERheXMnLFxuICAgICAgdmFsdWU6IDMwXG4gICAgfSxcbiAgICB7XG4gICAgICBsYWJlbDogJ1llYXIgdG8gRGF0ZScsXG4gICAgICB2YWx1ZTogMzY1XG4gICAgfVxuICBdO1xuXG4gIEBJbnB1dCgpXG4gIHByZXNldFNlbGVjdGVkOiBudW1iZXIgfCBudWxsIHwgJ2N1c3RvbScgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGZpbHRlcnM6IEFycmF5PFBiZHNEYXRlcmFuZ2VGaWx0ZXI+O1xuXG4gIEBJbnB1dCgpXG4gIGZpbHRlclNlbGVjdGVkID0gMDtcblxuICBASW5wdXQoKVxuICBzaG93Q3VzdG9tUHJlc2V0ID0gdHJ1ZTtcblxuICBASW5wdXQoKVxuICBhcHBseVRleHQgPSAnQXBwbHknO1xuXG4gIEBJbnB1dCgpXG4gIGNhbmNlbFRleHQgPSAnQ2FuY2VsJztcblxuICBASW5wdXQoKVxuICBjdXN0b21SYW5nZVRleHQgPSAnQ3VzdG9tIFJhbmdlJztcblxuICBASW5wdXQoKVxuICBtaW5EYXRlOiBOZ2JEYXRlID0gdGhpcy5jYWxlbmRhci5nZXRQcmV2KHRoaXMuY2FsZW5kYXIuZ2V0VG9kYXkoKSwgJ3knKTtcblxuICBASW5wdXQoKVxuICBtYXhEYXRlOiBOZ2JEYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuXG4gIEBJbnB1dCgpXG4gIGZyb21EYXRlOiBOZ2JEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgdG9EYXRlOiBOZ2JEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgaW5wdXRGb3JtYXQgPSAne2Zyb21EYXRlfSB0byB7dG9EYXRlfSc7XG5cbiAgQE91dHB1dCgpXG4gIHByaXZhdGUgY2hhbmdlOiBFdmVudEVtaXR0ZXI8UGJkc0RhdGVyYW5nZUNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyPFBiZHNEYXRlcmFuZ2VDaGFuZ2U+KCk7XG5cbiAgZmlyc3REYXlPZldlZWsgPSBnZXRMb2NhbGVGaXJzdERheU9mV2Vlayh0aGlzLmRhdGVyYW5nZVNlcnZpY2UuZ2V0Q3VycmVudExvY2FsZSgpKTtcblxuICBob3ZlcmVkRGF0ZTogTmdiRGF0ZTtcblxuICBkYXRlUmFuZ2UgPSAnJztcbiAgaXNEYXRlcGlja2VyVmlzaWJsZSA9IGZhbHNlO1xuICBzZWxlY3RlZEZpbHRlcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgcHJpdmF0ZSBkYXRlcmFuZ2VTZXJ2aWNlOiBQYmRzRGF0ZXJhbmdlU2VydmljZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBjaGluYSBzaG91bGQgc3RhcnQgb24gYSBNb25kYXksIEFuZ3VsYXIgbG9jYWxlIHJldHVybnMgaW5jb3JyZWN0IDBcbiAgICB0aGlzLmZpcnN0RGF5T2ZXZWVrID1cbiAgICAgIHRoaXMuZGF0ZXJhbmdlU2VydmljZS5nZXRDdXJyZW50TG9jYWxlKCkgPT09ICd6aC1jbicgPyB0aGlzLmZpcnN0RGF5T2ZXZWVrICsgMSA6IHRoaXMuZmlyc3REYXlPZldlZWs7XG5cbiAgICBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ2N1c3RvbScpIHtcbiAgICAgIHRoaXMuc2hvd0RhdGVwaWNrZXIoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZmlsdGVycyAmJiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbdGhpcy5maWx0ZXJTZWxlY3RlZF07XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMucHJlc2V0cykge1xuICAgICAgaWYgKCF0aGlzLmZpbHRlcnMgJiYgdGhpcy5wcmVzZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLnByZXNldENsaWNrKHRoaXMucHJlc2V0cy5maW5kKHAgPT4gcC52YWx1ZSA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXNldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgICAgIHRoaXMuYXBwbHkoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiAoY2hhbmdlcy50b1RleHQgJiYgY2hhbmdlcy50b1RleHQuZmlyc3RDaGFuZ2UgPT09IGZhbHNlKSB7XG4gICAgLy8gICB0aGlzLnNldElucHV0TGFiZWwoKTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnNldElucHV0TGFiZWwoKTtcbiAgfVxuXG4gIGFwcGx5KCkge1xuICAgIHRoaXMuc2V0SW5wdXRMYWJlbCgpO1xuICAgIHRoaXMuY2hhbmdlLmVtaXQoe1xuICAgICAgZnJvbURhdGU6IHRoaXMuZnJvbURhdGUsXG4gICAgICB0b0RhdGU6IHRoaXMudG9EYXRlLFxuICAgICAgZm9ybWF0dGVkRGF0ZTogdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID8gdGhpcy5kYXRlRm9ybWF0KCkgOiB0aGlzLmRhdGVSYW5nZSxcbiAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXJzID8gdGhpcy5zZWxlY3RlZEZpbHRlci5maWVsZCA6IG51bGwsXG4gICAgICB2YWx1ZTogdGhpcy5wcmVzZXRTZWxlY3RlZFxuICAgIH0pO1xuXG4gICAgdGhpcy5kYXRlcGlja2VyUG9wdXAuY2xvc2UoKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLmRhdGVwaWNrZXJQb3B1cC5jbG9zZSgpO1xuICB9XG5cbiAgb25EYXRlU2VsZWN0aW9uKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBpZiAoIXRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlKSB7XG4gICAgICB0aGlzLmZyb21EYXRlID0gZGF0ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZnJvbURhdGUgJiYgIXRoaXMudG9EYXRlICYmIGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkpIHtcbiAgICAgIHRoaXMudG9EYXRlID0gZGF0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50b0RhdGUgPSBudWxsO1xuICAgICAgdGhpcy5mcm9tRGF0ZSA9IGRhdGU7XG4gICAgfVxuXG4gICAgLy8gdGhpcy5wcmVzZXRTZWxlY3RlZCA9IG51bGw7XG4gIH1cblxuICBwcmVzZXRTZWxlY3QgPSAkZXZlbnQgPT4ge1xuICAgIGlmICgkZXZlbnQudmFsdWUgPT09ICdjdXN0b20nKSB7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gJ2N1c3RvbSc7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCRldmVudC52YWx1ZSkge1xuICAgICAgdGhpcy50b0RhdGUgPSB0aGlzLmNhbGVuZGFyLmdldFRvZGF5KCk7XG4gICAgICB0aGlzLmZyb21EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRQcmV2KHRoaXMudG9EYXRlLCAnZCcsICRldmVudC52YWx1ZSk7XG4gICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gJGV2ZW50LnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZyb21EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMudG9EYXRlID0gbnVsbDtcbiAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IGZhbHNlO1xuICB9O1xuXG4gIHByZXNldENsaWNrKHByZXNldCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdQUkVTRVQgQ0xJQ0s6ICcsIHByZXNldCk7XG4gICAgaWYgKHByZXNldCkge1xuICAgICAgaWYgKHByZXNldC52YWx1ZSA9PT0gJ2N1c3RvbScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJlc2V0LnZhbHVlKSB7XG4gICAgICAgIHRoaXMudG9EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgICAgICB0aGlzLmZyb21EYXRlID0gdGhpcy5jYWxlbmRhci5nZXRQcmV2KHRoaXMudG9EYXRlLCAnZCcsIHByZXNldC52YWx1ZSk7XG4gICAgICAgIHRoaXMucHJlc2V0U2VsZWN0ZWQgPSBwcmVzZXQudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZyb21EYXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy50b0RhdGUgPSBudWxsO1xuICAgICAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc0RhdGVwaWNrZXJWaXNpYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLmFwcGx5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGb3JtYXR0ZWREYXRlKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBpZiAoZGF0ZSkge1xuICAgICAgY29uc3QgbG9jYWxlID0gdGhpcy5kYXRlcmFuZ2VTZXJ2aWNlLmdldEN1cnJlbnRMb2NhbGUoKTtcbiAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSBnZXRMb2NhbGVEYXRlRm9ybWF0KGxvY2FsZSwgRm9ybWF0V2lkdGguU2hvcnQpO1xuICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IGZvcm1hdERhdGUoYCR7ZGF0ZS5tb250aH0vJHtkYXRlLmRheX0vJHtkYXRlLnllYXJ9YCwgZGF0ZUZvcm1hdCwgbG9jYWxlKTtcblxuICAgICAgcmV0dXJuIGZvcm1hdHRlZERhdGU7XG4gICAgfVxuICB9XG5cbiAgaXNIb3ZlcmVkID0gKGRhdGU6IE5nYkRhdGUpID0+XG4gICAgdGhpcy5mcm9tRGF0ZSAmJiAhdGhpcy50b0RhdGUgJiYgdGhpcy5ob3ZlcmVkRGF0ZSAmJiBkYXRlLmFmdGVyKHRoaXMuZnJvbURhdGUpICYmIGRhdGUuYmVmb3JlKHRoaXMuaG92ZXJlZERhdGUpO1xuXG4gIGlzSW5zaWRlID0gKGRhdGU6IE5nYkRhdGUpID0+IGRhdGUuYWZ0ZXIodGhpcy5mcm9tRGF0ZSkgJiYgZGF0ZS5iZWZvcmUodGhpcy50b0RhdGUpO1xuXG4gIGlzUmFuZ2UgPSAoZGF0ZTogTmdiRGF0ZSkgPT5cbiAgICBkYXRlLmVxdWFscyh0aGlzLmZyb21EYXRlKSB8fCBkYXRlLmVxdWFscyh0aGlzLnRvRGF0ZSkgfHwgdGhpcy5pc0luc2lkZShkYXRlKSB8fCB0aGlzLmlzSG92ZXJlZChkYXRlKTtcblxuICBzaG93RGF0ZXBpY2tlcigpIHtcbiAgICB0aGlzLmlzRGF0ZXBpY2tlclZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6ICdjdXN0b20nIH0pO1xuICB9XG5cbiAgb25GaWx0ZXJDaGFuZ2UoZmlsdGVyLCBpbmRleCkge1xuICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuICB9XG5cbiAgc2V0UHJlc2V0KHZhbHVlOiBudW1iZXIgfCBudWxsKSB7XG4gICAgdGhpcy5wcmVzZXRTZWxlY3RlZCA9IHZhbHVlO1xuICAgIHRoaXMucHJlc2V0U2VsZWN0KHsgdmFsdWU6IHRoaXMucHJlc2V0U2VsZWN0ZWQgfSk7XG4gICAgdGhpcy5hcHBseSgpO1xuICB9XG5cbiAgc2V0RmlsdGVyKGluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5maWx0ZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnNbaW5kZXhdO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGVSYW5nZSh2YWx1ZSkge1xuICAgIHRoaXMuZnJvbURhdGUgPSBuZXcgTmdiRGF0ZSh2YWx1ZS5mcm9tRGF0ZS55ZWFyLCB2YWx1ZS5mcm9tRGF0ZS5tb250aCwgdmFsdWUuZnJvbURhdGUuZGF5KTtcbiAgICB0aGlzLnRvRGF0ZSA9IG5ldyBOZ2JEYXRlKHZhbHVlLnRvRGF0ZS55ZWFyLCB2YWx1ZS50b0RhdGUubW9udGgsIHZhbHVlLnRvRGF0ZS5kYXkpO1xuICAgIHRoaXMuaXNEYXRlcGlja2VyVmlzaWJsZSA9IHZhbHVlLnZhbHVlID09PSAnY3VzdG9tJztcbiAgICB0aGlzLnByZXNldFNlbGVjdGVkID0gdmFsdWUudmFsdWU7XG5cbiAgICBpZiAodGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLmZpbHRlclNlbGVjdGVkID0gdGhpcy5maWx0ZXJzLmZpbmRJbmRleChmID0+IGYuZmllbGQgPT09IHZhbHVlLmZpbHRlcik7XG4gICAgICB0aGlzLnNlbGVjdGVkRmlsdGVyID0gdGhpcy5maWx0ZXJzW3RoaXMuZmlsdGVyU2VsZWN0ZWRdO1xuICAgIH1cblxuICAgIHRoaXMuYXBwbHkoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0SW5wdXRMYWJlbCgpIHtcbiAgICBpZiAodGhpcy5wcmVzZXRzKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMucHJlc2V0cy5maW5kKHAgPT4gcC52YWx1ZSA9PT0gdGhpcy5wcmVzZXRTZWxlY3RlZCk7XG5cbiAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICBpZiAodGhpcy5mcm9tRGF0ZSA9PT0gbnVsbCB8fCB0aGlzLnRvRGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gc2VsZWN0ZWQubGFiZWw7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gbnVsbCB8fCAodGhpcy5wcmVzZXRTZWxlY3RlZCAhPT0gbnVsbCAmJiB0aGlzLnByZXNldFNlbGVjdGVkICE9PSAnY3VzdG9tJykpIHtcbiAgICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHNlbGVjdGVkLmxhYmVsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGF0ZVJhbmdlID0gdGhpcy5kYXRlRm9ybWF0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVzZXRTZWxlY3RlZCA9PT0gJ2N1c3RvbScgJiYgdGhpcy5mcm9tRGF0ZSAmJiB0aGlzLnRvRGF0ZSkge1xuICAgICAgICB0aGlzLmRhdGVSYW5nZSA9IHRoaXMuZGF0ZUZvcm1hdCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGF0ZUZvcm1hdCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dEZvcm1hdFxuICAgICAgLnJlcGxhY2UoJ3tmcm9tRGF0ZX0nLCB0aGlzLmdldEZvcm1hdHRlZERhdGUodGhpcy5mcm9tRGF0ZSkpXG4gICAgICAucmVwbGFjZSgne3RvRGF0ZX0nLCB0aGlzLmdldEZvcm1hdHRlZERhdGUodGhpcy50b0RhdGUpKTtcbiAgfVxufVxuIl19