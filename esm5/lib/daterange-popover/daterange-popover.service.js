/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import * as i0 from "@angular/core";
var PbdsDaterangeService = /** @class */ (function () {
    function PbdsDaterangeService(localeId) {
        this.localeId = localeId;
        this.locale = this.localeId.toLowerCase();
    }
    /**
     * @param {?} locale
     * @return {?}
     */
    PbdsDaterangeService.prototype.setLocale = /**
     * @param {?} locale
     * @return {?}
     */
    function (locale) {
        this.locale = (locale.language + "-" + locale.country).toLowerCase();
        // set the angular LOCALE_ID dynamically for ng-bootstrap datepicker
        registerLocaleData(locale.locale, this.locale);
    };
    /**
     * @return {?}
     */
    PbdsDaterangeService.prototype.getCurrentLocale = /**
     * @return {?}
     */
    function () {
        return this.locale;
    };
    PbdsDaterangeService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    PbdsDaterangeService.ctorParameters = function () { return [
        { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
    ]; };
    /** @nocollapse */ PbdsDaterangeService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function PbdsDaterangeService_Factory() { return new PbdsDaterangeService(i0.ɵɵinject(i0.LOCALE_ID)); }, token: PbdsDaterangeService, providedIn: "root" });
    return PbdsDaterangeService;
}());
export { PbdsDaterangeService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3BiLWRlc2lnbi1zeXN0ZW0vIiwic291cmNlcyI6WyJsaWIvZGF0ZXJhbmdlLXBvcG92ZXIvZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUlyRDtJQU1FLDhCQUF1QyxRQUFnQjtRQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBRi9DLFdBQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRWEsQ0FBQzs7Ozs7SUFFM0Qsd0NBQVM7Ozs7SUFBVCxVQUFVLE1BQTJCO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBRyxNQUFNLENBQUMsUUFBUSxTQUFJLE1BQU0sQ0FBQyxPQUFTLENBQUEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuRSxvRUFBb0U7UUFDcEUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQzs7OztJQUVELCtDQUFnQjs7O0lBQWhCO1FBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7O2dCQWpCRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7OzZDQUljLE1BQU0sU0FBQyxTQUFTOzs7K0JBWC9CO0NBdUJDLEFBbEJELElBa0JDO1NBZlksb0JBQW9COzs7Ozs7SUFDL0Isc0NBQTZDOzs7OztJQUVqQyx3Q0FBMkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QsIExPQ0FMRV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgcmVnaXN0ZXJMb2NhbGVEYXRhIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgUGJkc0RhdGVyYW5nZUxvY2FsZSB9IGZyb20gJy4vZGF0ZXJhbmdlLXBvcG92ZXIuaW50ZXJmYWNlcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNEYXRlcmFuZ2VTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBsb2NhbGUgPSB0aGlzLmxvY2FsZUlkLnRvTG93ZXJDYXNlKCk7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgbG9jYWxlSWQ6IHN0cmluZykge31cblxuICBzZXRMb2NhbGUobG9jYWxlOiBQYmRzRGF0ZXJhbmdlTG9jYWxlKSB7XG4gICAgdGhpcy5sb2NhbGUgPSBgJHtsb2NhbGUubGFuZ3VhZ2V9LSR7bG9jYWxlLmNvdW50cnl9YC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgLy8gc2V0IHRoZSBhbmd1bGFyIExPQ0FMRV9JRCBkeW5hbWljYWxseSBmb3IgbmctYm9vdHN0cmFwIGRhdGVwaWNrZXJcbiAgICByZWdpc3RlckxvY2FsZURhdGEobG9jYWxlLmxvY2FsZSwgdGhpcy5sb2NhbGUpO1xuICB9XG5cbiAgZ2V0Q3VycmVudExvY2FsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2NhbGU7XG4gIH1cbn1cbiJdfQ==