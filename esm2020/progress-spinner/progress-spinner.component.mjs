import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class PbdsProgressSpinnerComponent {
}
PbdsProgressSpinnerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsProgressSpinnerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsProgressSpinnerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: PbdsProgressSpinnerComponent, selector: "pbds-progress-spinner", inputs: { size: "size" }, ngImport: i0, template: `
    <span role="alert" aria-live="assertive">
      <span
        class="sbl-circ"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border-width.px]="size / 8"
        aria-hidden="true"
      ></span>
      <span class="sr-only">Loading</span>
    </span>
  `, isInline: true, styles: [".sbl-circ{height:48px;width:48px;color:var(--primary);position:relative;display:inline-block;border-width:6px;border-style:solid;border-radius:50%;border-top-color:transparent;animation:rotate 1.5s linear infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsProgressSpinnerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-progress-spinner', template: `
    <span role="alert" aria-live="assertive">
      <span
        class="sbl-circ"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border-width.px]="size / 8"
        aria-hidden="true"
      ></span>
      <span class="sr-only">Loading</span>
    </span>
  `, styles: [".sbl-circ{height:48px;width:48px;color:var(--primary);position:relative;display:inline-block;border-width:6px;border-style:solid;border-radius:50%;border-top-color:transparent;animation:rotate 1.5s linear infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { size: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL3Byb2dyZXNzLXNwaW5uZXIvcHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBa0JqRCxNQUFNLE9BQU8sNEJBQTRCOzswSEFBNUIsNEJBQTRCOzhHQUE1Qiw0QkFBNEIsdUZBZDdCOzs7Ozs7Ozs7OztHQVdUOzRGQUdVLDRCQUE0QjtrQkFoQnhDLFNBQVM7K0JBQ0UsdUJBQXVCLFlBQ3ZCOzs7Ozs7Ozs7OztHQVdUOzhCQUtELElBQUk7c0JBREgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1wcm9ncmVzcy1zcGlubmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiByb2xlPVwiYWxlcnRcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cbiAgICAgIDxzcGFuXG4gICAgICAgIGNsYXNzPVwic2JsLWNpcmNcIlxuICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwic2l6ZVwiXG4gICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwic2l6ZVwiXG4gICAgICAgIFtzdHlsZS5ib3JkZXItd2lkdGgucHhdPVwic2l6ZSAvIDhcIlxuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkxvYWRpbmc8L3NwYW4+XG4gICAgPC9zcGFuPlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9wcm9ncmVzcy1zcGlubmVyLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgUGJkc1Byb2dyZXNzU3Bpbm5lckNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHNpemU6IG51bWJlcjtcbn1cbiJdfQ==