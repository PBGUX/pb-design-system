/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, HostListener, HostBinding } from '@angular/core';
import { ViewportScroller } from '@angular/common';
var PbdsHeaderShadowDirective = /** @class */ (function () {
    function PbdsHeaderShadowDirective(_scroll) {
        this._scroll = _scroll;
    }
    /**
     * @return {?}
     */
    PbdsHeaderShadowDirective.prototype.onWindowScroll = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var offset = this._scroll.getScrollPosition();
        this.shadow = offset[1] > 20;
    };
    PbdsHeaderShadowDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'header.bg-brand-header'
                },] }
    ];
    /** @nocollapse */
    PbdsHeaderShadowDirective.ctorParameters = function () { return [
        { type: ViewportScroller }
    ]; };
    PbdsHeaderShadowDirective.propDecorators = {
        shadow: [{ type: HostBinding, args: ['class.pbds-header-shadow',] }],
        onWindowScroll: [{ type: HostListener, args: ['window:scroll', [],] }]
    };
    return PbdsHeaderShadowDirective;
}());
export { PbdsHeaderShadowDirective };
if (false) {
    /** @type {?} */
    PbdsHeaderShadowDirective.prototype.shadow;
    /**
     * @type {?}
     * @private
     */
    PbdsHeaderShadowDirective.prototype._scroll;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wYi1kZXNpZ24tc3lzdGVtLyIsInNvdXJjZXMiOlsibGliL2hlYWRlci1zaGFkb3cvaGVhZGVyLXNoYWRvdy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVuRDtJQVlFLG1DQUFvQixPQUF5QjtRQUF6QixZQUFPLEdBQVAsT0FBTyxDQUFrQjtJQUFHLENBQUM7Ozs7SUFMZCxrREFBYzs7O0lBQWpEOztZQUNRLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1FBQy9DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMvQixDQUFDOztnQkFWRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtpQkFDbkM7Ozs7Z0JBSlEsZ0JBQWdCOzs7eUJBTXRCLFdBQVcsU0FBQywwQkFBMEI7aUNBR3RDLFlBQVksU0FBQyxlQUFlLEVBQUUsRUFBRTs7SUFNbkMsZ0NBQUM7Q0FBQSxBQWJELElBYUM7U0FWWSx5QkFBeUI7OztJQUNwQywyQ0FDZ0I7Ozs7O0lBT0osNENBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBIb3N0TGlzdGVuZXIsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWaWV3cG9ydFNjcm9sbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaGVhZGVyLmJnLWJyYW5kLWhlYWRlcidcbn0pXG5leHBvcnQgY2xhc3MgUGJkc0hlYWRlclNoYWRvd0RpcmVjdGl2ZSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MucGJkcy1oZWFkZXItc2hhZG93JylcbiAgc2hhZG93OiBib29sZWFuO1xuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpzY3JvbGwnLCBbXSkgb25XaW5kb3dTY3JvbGwoKSB7XG4gICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5fc2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgdGhpcy5zaGFkb3cgPSBvZmZzZXRbMV0gPiAyMDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3Njcm9sbDogVmlld3BvcnRTY3JvbGxlcikge31cbn1cbiJdfQ==