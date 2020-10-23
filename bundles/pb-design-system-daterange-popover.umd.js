(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('@ng-bootstrap/ng-bootstrap'), require('@angular/material/radio')) :
    typeof define === 'function' && define.amd ? define('pb-design-system/daterange-popover', ['exports', '@angular/core', '@angular/common', '@angular/forms', '@ng-bootstrap/ng-bootstrap', '@angular/material/radio'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['pb-design-system'] = global['pb-design-system'] || {}, global['pb-design-system']['daterange-popover'] = {}), global.ng.core, global.ng.common, global.ng.forms, global['^7']['0']['0'], global.ng.material.radio));
}(this, (function (exports, i0, common, forms, ngBootstrap, radio) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var PbdsDaterangeService = /** @class */ (function () {
        function PbdsDaterangeService(localeId) {
            this.localeId = localeId;
            this.locale = this.localeId.toLowerCase();
        }
        PbdsDaterangeService.prototype.setLocale = function (locale) {
            this.locale = (locale.language + "-" + locale.country).toLowerCase();
            // set the angular LOCALE_ID dynamically for ng-bootstrap datepicker
            common.registerLocaleData(locale.locale, this.locale);
        };
        PbdsDaterangeService.prototype.getCurrentLocale = function () {
            return this.locale;
        };
        return PbdsDaterangeService;
    }());
    PbdsDaterangeService.ɵprov = i0.ɵɵdefineInjectable({ factory: function PbdsDaterangeService_Factory() { return new PbdsDaterangeService(i0.ɵɵinject(i0.LOCALE_ID)); }, token: PbdsDaterangeService, providedIn: "root" });
    PbdsDaterangeService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    PbdsDaterangeService.ctorParameters = function () { return [
        { type: String, decorators: [{ type: i0.Inject, args: [i0.LOCALE_ID,] }] }
    ]; };

    // Define custom service providing the months and weekdays translations
    var CustomDatepickerI18n = /** @class */ (function (_super) {
        __extends(CustomDatepickerI18n, _super);
        function CustomDatepickerI18n(daterangeService) {
            var _this = _super.call(this) || this;
            _this.daterangeService = daterangeService;
            return _this;
        }
        CustomDatepickerI18n.prototype.getWeekdayShortName = function (weekday) {
            // for ng-bootstrap, sunday number of 7 converted to 0
            weekday = weekday === 7 ? 0 : weekday;
            // console.log(
            //   'weekday: ',
            //   this.daterangeService.getCurrentLocale(),
            //   weekday,
            //   getLocaleDayNames(this.daterangeService.getCurrentLocale(), FormStyle.Standalone, TranslationWidth.Abbreviated)[weekday]
            // );
            return common.getLocaleDayNames(this.daterangeService.getCurrentLocale(), common.FormStyle.Standalone, common.TranslationWidth.Abbreviated)[weekday];
        };
        CustomDatepickerI18n.prototype.getMonthShortName = function (month) {
            return common.getLocaleMonthNames(this.daterangeService.getCurrentLocale(), common.FormStyle.Standalone, common.TranslationWidth.Wide)[month - 1];
        };
        CustomDatepickerI18n.prototype.getMonthFullName = function (month) {
            return common.getLocaleMonthNames(this.daterangeService.getCurrentLocale(), common.FormStyle.Standalone, common.TranslationWidth.Wide)[month - 1];
        };
        CustomDatepickerI18n.prototype.getDayAriaLabel = function (date) {
            return date.day + "-" + date.month + "-" + date.year;
        };
        return CustomDatepickerI18n;
    }(ngBootstrap.NgbDatepickerI18n));
    CustomDatepickerI18n.decorators = [
        { type: i0.Injectable }
    ];
    CustomDatepickerI18n.ctorParameters = function () { return [
        { type: PbdsDaterangeService }
    ]; };
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
            this.change = new i0.EventEmitter();
            this.firstDayOfWeek = common.getLocaleFirstDayOfWeek(this.daterangeService.getCurrentLocale());
            this.dateRange = '';
            this.isDatepickerVisible = false;
            this.presetSelect = function ($event) {
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
            };
            this.isHovered = function (date) { return _this.fromDate && !_this.toDate && _this.hoveredDate && date.after(_this.fromDate) && date.before(_this.hoveredDate); };
            this.isInside = function (date) { return date.after(_this.fromDate) && date.before(_this.toDate); };
            this.isRange = function (date) { return date.equals(_this.fromDate) || date.equals(_this.toDate) || _this.isInside(date) || _this.isHovered(date); };
        }
        PbdsDaterangePopoverComponent.prototype.ngOnInit = function () {
            // china should start on a Monday, Angular locale returns incorrect 0
            this.firstDayOfWeek =
                this.daterangeService.getCurrentLocale() === 'zh-cn' ? this.firstDayOfWeek + 1 : this.firstDayOfWeek;
            if (this.presetSelected === 'custom') {
                this.showDatepicker();
            }
        };
        PbdsDaterangePopoverComponent.prototype.ngOnChanges = function (changes) {
            var _this = this;
            if (changes.filters && this.filters) {
                this.selectedFilter = this.filters[this.filterSelected];
            }
            if (changes.presets) {
                if (!this.filters && this.presetSelected) {
                    this.presetClick(this.presets.find(function (p) { return p.value === _this.presetSelected; }));
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
        PbdsDaterangePopoverComponent.prototype.apply = function () {
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
        PbdsDaterangePopoverComponent.prototype.cancel = function () {
            this.datepickerPopup.close();
        };
        PbdsDaterangePopoverComponent.prototype.onDateSelection = function (date) {
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
        PbdsDaterangePopoverComponent.prototype.presetClick = function (preset) {
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
        PbdsDaterangePopoverComponent.prototype.getFormattedDate = function (date) {
            if (date) {
                var locale = this.daterangeService.getCurrentLocale();
                var dateFormat = common.getLocaleDateFormat(locale, common.FormatWidth.Short);
                var formattedDate = common.formatDate(date.month + "/" + date.day + "/" + date.year, dateFormat, locale);
                return formattedDate;
            }
        };
        PbdsDaterangePopoverComponent.prototype.showDatepicker = function () {
            this.isDatepickerVisible = true;
            this.presetSelect({ value: 'custom' });
        };
        PbdsDaterangePopoverComponent.prototype.onFilterChange = function (filter, index) {
            this.selectedFilter = this.filters[index];
        };
        PbdsDaterangePopoverComponent.prototype.setPreset = function (value) {
            this.presetSelected = value;
            this.presetSelect({ value: this.presetSelected });
            this.apply();
        };
        PbdsDaterangePopoverComponent.prototype.setFilter = function (index) {
            if (this.filters !== undefined) {
                this.selectedFilter = this.filters[index];
            }
        };
        PbdsDaterangePopoverComponent.prototype.setDateRange = function (value) {
            this.fromDate = new ngBootstrap.NgbDate(value.fromDate.year, value.fromDate.month, value.fromDate.day);
            this.toDate = new ngBootstrap.NgbDate(value.toDate.year, value.toDate.month, value.toDate.day);
            this.isDatepickerVisible = value.value === 'custom';
            this.presetSelected = value.value;
            if (this.filters) {
                this.filterSelected = this.filters.findIndex(function (f) { return f.field === value.filter; });
                this.selectedFilter = this.filters[this.filterSelected];
            }
            this.apply();
        };
        PbdsDaterangePopoverComponent.prototype.setInputLabel = function () {
            var _this = this;
            if (this.presets) {
                var selected = this.presets.find(function (p) { return p.value === _this.presetSelected; });
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
        PbdsDaterangePopoverComponent.prototype.dateFormat = function () {
            return this.inputFormat
                .replace('{fromDate}', this.getFormattedDate(this.fromDate))
                .replace('{toDate}', this.getFormattedDate(this.toDate));
        };
        return PbdsDaterangePopoverComponent;
    }());
    PbdsDaterangePopoverComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'pbds-daterange-popover',
                    template: "<div class=\"input-group pbds-daterange-popover\">\n  <input\n    type=\"text\"\n    class=\"form-control\"\n    aria-describedby=\"daterange-button\"\n    [value]=\"dateRange\"\n    readonly=\"readonly\"\n    tabindex=\"-1\"\n  />\n\n  <div class=\"input-group-append\">\n    <button\n      class=\"btn btn-secondary\"\n      type=\"button\"\n      id=\"daterange-button\"\n      #datepickerPopup=\"ngbPopover\"\n      [ngbPopover]=\"daterangeContent\"\n      popoverClass=\"daterange-popover\"\n      autoClose=\"outside\"\n      container=\"body\"\n      placement=\"bottom-right auto\"\n      aria-label=\"Open Daterange Picker\"\n    >\n      <i class=\"pbi-icon-mini pbi-calendar\" aria-hidden=\"true\"></i>\n    </button>\n  </div>\n\n  <ng-template #daterangeContent>\n    <div>\n      <div class=\"d-block d-md-flex\">\n        <div *ngIf=\"isDatepickerVisible\">\n          <ngb-datepicker\n            #datepicker\n            [displayMonths]=\"'2'\"\n            [minDate]=\"minDate\"\n            [maxDate]=\"maxDate\"\n            navigation=\"select\"\n            outsideDays=\"hidden\"\n            [firstDayOfWeek]=\"firstDayOfWeek\"\n            [showWeekdays]=\"true\"\n            [dayTemplate]=\"t\"\n            (select)=\"onDateSelection($event)\"\n          >\n          </ngb-datepicker>\n          <!--  -->\n\n          <ng-template #t let-date let-focused=\"focused\">\n            <span\n              class=\"custom-day\"\n              [class.focused]=\"focused\"\n              [class.range]=\"isRange(date)\"\n              [class.faded]=\"isHovered(date) || isInside(date)\"\n              (mouseenter)=\"hoveredDate = date\"\n              (mouseleave)=\"hoveredDate = null\"\n            >\n              {{ date.day }}\n            </span>\n          </ng-template>\n        </div>\n\n        <div\n          class=\"d-flex flex-column justify-content-lg-between mt-md-0\"\n          [ngClass]=\"{ 'ml-md-4': isDatepickerVisible }\"\n        >\n          <!-- filters -->\n          <div *ngIf=\"filters\" class=\"mb-3\" ngbDropdown>\n            <button class=\"btn btn-sm btn-secondary btn-block\" id=\"dateFilter\" ngbDropdownToggle>\n              {{ selectedFilter.label }}\n            </button>\n            <div ngbDropdownMenu aria-labelledby=\"dateFilter\">\n              <button\n                class=\"dropdown-item\"\n                type=\"button\"\n                *ngFor=\"let filter of filters; let index = index\"\n                (click)=\"onFilterChange(filter, index)\"\n              >\n                {{ filter.label }}\n              </button>\n            </div>\n          </div>\n\n          <!-- presets radio buttons-->\n          <div *ngIf=\"presets && filters\" class=\"flex-grow-1\">\n            <mat-radio-group\n              aria-label=\"Select an option\"\n              class=\"stacked-radio-group\"\n              name=\"presets\"\n              [(ngModel)]=\"presetSelected\"\n              (change)=\"presetSelect($event)\"\n            >\n              <mat-radio-button *ngFor=\"let preset of presets\" [value]=\"preset.value\">{{\n                preset.label\n              }}</mat-radio-button>\n\n              <mat-radio-button *ngIf=\"showCustomPreset\" [value]=\"'custom'\" (change)=\"showDatepicker()\">{{\n                customRangeText\n              }}</mat-radio-button>\n            </mat-radio-group>\n          </div>\n\n          <!-- presets buttons-->\n          <div *ngIf=\"presets && !filters\" class=\"flex-grow-1\">\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngFor=\"let preset of presets\"\n              (click)=\"presetClick(preset)\"\n            >\n              {{ preset.label }}\n            </button>\n\n            <button\n              type=\"button\"\n              class=\"btn btn-secondary btn-block btn-sm text-nowrap\"\n              *ngIf=\"showCustomPreset\"\n              (click)=\"showDatepicker()\"\n            >\n              {{ customRangeText }}\n            </button>\n          </div>\n\n          <!-- buttons -->\n          <div *ngIf=\"filters || isDatepickerVisible\" class=\"d-flex justify-content-between mt-3\">\n            <button class=\"btn btn-primary btn-sm mr-1\" type=\"button\" (click)=\"apply()\">{{ applyText }}</button>\n            <button class=\"btn btn-secondary btn-sm ml-1\" type=\"button\" (click)=\"cancel()\">\n              {{ cancelText }}\n            </button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </ng-template>\n</div>\n",
                    providers: [{ provide: ngBootstrap.NgbDatepickerI18n, useClass: CustomDatepickerI18n }]
                },] }
    ];
    PbdsDaterangePopoverComponent.ctorParameters = function () { return [
        { type: ngBootstrap.NgbCalendar },
        { type: PbdsDaterangeService }
    ]; };
    PbdsDaterangePopoverComponent.propDecorators = {
        datepickerPopup: [{ type: i0.ViewChild, args: ['datepickerPopup', { static: true },] }],
        presets: [{ type: i0.Input }],
        presetSelected: [{ type: i0.Input }],
        filters: [{ type: i0.Input }],
        filterSelected: [{ type: i0.Input }],
        showCustomPreset: [{ type: i0.Input }],
        applyText: [{ type: i0.Input }],
        cancelText: [{ type: i0.Input }],
        customRangeText: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        fromDate: [{ type: i0.Input }],
        toDate: [{ type: i0.Input }],
        inputFormat: [{ type: i0.Input }],
        change: [{ type: i0.Output }]
    };

    var PbdsDaterangePopoverModule = /** @class */ (function () {
        function PbdsDaterangePopoverModule() {
        }
        return PbdsDaterangePopoverModule;
    }());
    PbdsDaterangePopoverModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [PbdsDaterangePopoverComponent],
                    imports: [common.CommonModule, forms.FormsModule, radio.MatRadioModule, ngBootstrap.NgbDatepickerModule, ngBootstrap.NgbPopoverModule, ngBootstrap.NgbDropdownModule],
                    exports: [PbdsDaterangePopoverComponent]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.CustomDatepickerI18n = CustomDatepickerI18n;
    exports.PbdsDaterangePopoverComponent = PbdsDaterangePopoverComponent;
    exports.PbdsDaterangePopoverModule = PbdsDaterangePopoverModule;
    exports.PbdsDaterangeService = PbdsDaterangeService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pb-design-system-daterange-popover.umd.js.map
