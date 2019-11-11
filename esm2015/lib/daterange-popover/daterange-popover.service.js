/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import * as i0 from "@angular/core";
export class PbdsDaterangeService {
    /**
     * @param {?} localeId
     */
    constructor(localeId) {
        this.localeId = localeId;
        this.locale = this.localeId.toLowerCase();
    }
    /**
     * @param {?} locale
     * @return {?}
     */
    setLocale(locale) {
        this.locale = `${locale.language}-${locale.country}`.toLowerCase();
        // set the angular LOCALE_ID dynamically for ng-bootstrap datepicker
        registerLocaleData(locale.locale, this.locale);
    }
    /**
     * @return {?}
     */
    getCurrentLocale() {
        return this.locale;
    }
}
PbdsDaterangeService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
PbdsDaterangeService.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];
/** @nocollapse */ PbdsDaterangeService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function PbdsDaterangeService_Factory() { return new PbdsDaterangeService(i0.ɵɵinject(i0.LOCALE_ID)); }, token: PbdsDaterangeService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangeService.prototype.locale;
    /**
     * @type {?}
     * @private
     */
    PbdsDaterangeService.prototype.localeId;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0ZXJhbmdlLXBvcG92ZXIvZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQU9yRCxNQUFNLE9BQU8sb0JBQW9COzs7O0lBRy9CLFlBQXVDLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7UUFGL0MsV0FBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFYSxDQUFDOzs7OztJQUUzRCxTQUFTLENBQUMsTUFBMkI7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRW5FLG9FQUFvRTtRQUNwRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDOzs7O0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7OztZQWpCRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7Ozs7eUNBSWMsTUFBTSxTQUFDLFNBQVM7Ozs7Ozs7O0lBRjdCLHNDQUE2Qzs7Ozs7SUFFakMsd0NBQTJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBMT0NBTEVfSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHJlZ2lzdGVyTG9jYWxlRGF0YSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IFBiZHNEYXRlcmFuZ2VMb2NhbGUgfSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyLmludGVyZmFjZXMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0ZXJhbmdlU2VydmljZSB7XG4gIHByaXZhdGUgbG9jYWxlID0gdGhpcy5sb2NhbGVJZC50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIGxvY2FsZUlkOiBzdHJpbmcpIHt9XG5cbiAgc2V0TG9jYWxlKGxvY2FsZTogUGJkc0RhdGVyYW5nZUxvY2FsZSkge1xuICAgIHRoaXMubG9jYWxlID0gYCR7bG9jYWxlLmxhbmd1YWdlfS0ke2xvY2FsZS5jb3VudHJ5fWAudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIHNldCB0aGUgYW5ndWxhciBMT0NBTEVfSUQgZHluYW1pY2FsbHkgZm9yIG5nLWJvb3RzdHJhcCBkYXRlcGlja2VyXG4gICAgcmVnaXN0ZXJMb2NhbGVEYXRhKGxvY2FsZS5sb2NhbGUsIHRoaXMubG9jYWxlKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYWxlO1xuICB9XG59XG4iXX0=