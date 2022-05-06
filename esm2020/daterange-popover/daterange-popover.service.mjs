import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import * as i0 from "@angular/core";
export class PbdsDaterangeService {
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
PbdsDaterangeService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsDaterangeService, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable });
PbdsDaterangeService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsDaterangeService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsDaterangeService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vZGF0ZXJhbmdlLXBvcG92ZXIvZGF0ZXJhbmdlLXBvcG92ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBT3JELE1BQU0sT0FBTyxvQkFBb0I7SUFHL0IsWUFBdUMsUUFBZ0I7UUFBaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUYvQyxXQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUVhLENBQUM7SUFFM0QsU0FBUyxDQUFDLE1BQTJCO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuRSxvRUFBb0U7UUFDcEUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELGdCQUFnQjtRQUNkLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBQ0QsV0FBVztJQUVYLENBQUM7O2lIQWpCVSxvQkFBb0Isa0JBR1gsU0FBUztxSEFIbEIsb0JBQW9CLGNBRm5CLE1BQU07MkZBRVAsb0JBQW9CO2tCQUhoQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBSWMsTUFBTTsyQkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBMT0NBTEVfSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHJlZ2lzdGVyTG9jYWxlRGF0YSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IFBiZHNEYXRlcmFuZ2VMb2NhbGUgfSBmcm9tICcuL2RhdGVyYW5nZS1wb3BvdmVyLmludGVyZmFjZXMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBQYmRzRGF0ZXJhbmdlU2VydmljZSB7XG4gIHByaXZhdGUgbG9jYWxlID0gdGhpcy5sb2NhbGVJZC50b0xvd2VyQ2FzZSgpO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIGxvY2FsZUlkOiBzdHJpbmcpIHt9XG5cbiAgc2V0TG9jYWxlKGxvY2FsZTogUGJkc0RhdGVyYW5nZUxvY2FsZSkge1xuICAgIHRoaXMubG9jYWxlID0gYCR7bG9jYWxlLmxhbmd1YWdlfS0ke2xvY2FsZS5jb3VudHJ5fWAudG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIHNldCB0aGUgYW5ndWxhciBMT0NBTEVfSUQgZHluYW1pY2FsbHkgZm9yIG5nLWJvb3RzdHJhcCBkYXRlcGlja2VyXG4gICAgcmVnaXN0ZXJMb2NhbGVEYXRhKGxvY2FsZS5sb2NhbGUsIHRoaXMubG9jYWxlKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRMb2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubG9jYWxlO1xuICB9XG4gIG9wZW5Qb3BvdmVyKCl7XG4gICAgXG4gIH1cbn1cbiJdfQ==