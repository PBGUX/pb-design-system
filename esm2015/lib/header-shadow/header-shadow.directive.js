/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, HostListener, HostBinding } from '@angular/core';
import { ViewportScroller } from '@angular/common';
export class PbdsHeaderShadowDirective {
    /**
     * @param {?} _scroll
     */
    constructor(_scroll) {
        this._scroll = _scroll;
    }
    /**
     * @return {?}
     */
    onWindowScroll() {
        /** @type {?} */
        const offset = this._scroll.getScrollPosition();
        this.shadow = offset[1] > 20;
    }
}
PbdsHeaderShadowDirective.decorators = [
    { type: Directive, args: [{
                selector: 'header.bg-brand-header'
            },] }
];
/** @nocollapse */
PbdsHeaderShadowDirective.ctorParameters = () => [
    { type: ViewportScroller }
];
PbdsHeaderShadowDirective.propDecorators = {
    shadow: [{ type: HostBinding, args: ['class.pbds-header-shadow',] }],
    onWindowScroll: [{ type: HostListener, args: ['window:scroll', [],] }]
};
if (false) {
    /** @type {?} */
    PbdsHeaderShadowDirective.prototype.shadow;
    /**
     * @type {?}
     * @private
     */
    PbdsHeaderShadowDirective.prototype._scroll;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2hlYWRlci1zaGFkb3cvaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUtuRCxNQUFNLE9BQU8seUJBQXlCOzs7O0lBU3BDLFlBQW9CLE9BQXlCO1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO0lBQUcsQ0FBQzs7OztJQUxkLGNBQWM7O2NBQ3pDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1FBQy9DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMvQixDQUFDOzs7WUFWRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjthQUNuQzs7OztZQUpRLGdCQUFnQjs7O3FCQU10QixXQUFXLFNBQUMsMEJBQTBCOzZCQUd0QyxZQUFZLFNBQUMsZUFBZSxFQUFFLEVBQUU7Ozs7SUFIakMsMkNBQ2dCOzs7OztJQU9KLDRDQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSG9zdExpc3RlbmVyLCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmlld3BvcnRTY3JvbGxlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2hlYWRlci5iZy1icmFuZC1oZWFkZXInXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNIZWFkZXJTaGFkb3dEaXJlY3RpdmUge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnBiZHMtaGVhZGVyLXNoYWRvdycpXG4gIHNoYWRvdzogYm9vbGVhbjtcblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6c2Nyb2xsJywgW10pIG9uV2luZG93U2Nyb2xsKCkge1xuICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuX3Njcm9sbC5nZXRTY3JvbGxQb3NpdGlvbigpO1xuICAgIHRoaXMuc2hhZG93ID0gb2Zmc2V0WzFdID4gMjA7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zY3JvbGw6IFZpZXdwb3J0U2Nyb2xsZXIpIHt9XG59XG4iXX0=