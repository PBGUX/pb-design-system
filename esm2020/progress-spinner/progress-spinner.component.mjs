import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class PbdsProgressSpinnerComponent {
}
PbdsProgressSpinnerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsProgressSpinnerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsProgressSpinnerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: PbdsProgressSpinnerComponent, selector: "pbds-progress-spinner", inputs: { size: "size" }, ngImport: i0, template: `
    <span role="alert" aria-live="assertive">
      <span
        class="sbl-circ"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border-width.px]="size / 8"
        aria-hidden="true"
      ></span>
      <span class="visually-hidden">Loading</span>
    </span>
  `, isInline: true, styles: [".sbl-circ{height:48px;width:48px;color:var(--primary);position:relative;display:inline-block;border-width:6px;border-style:solid;border-radius:50%;border-top-color:transparent;animation:rotate 1.5s linear infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsProgressSpinnerComponent, decorators: [{
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
      <span class="visually-hidden">Loading</span>
    </span>
  `, styles: [".sbl-circ{height:48px;width:48px;color:var(--primary);position:relative;display:inline-block;border-width:6px;border-style:solid;border-radius:50%;border-top-color:transparent;animation:rotate 1.5s linear infinite}@keyframes rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n"] }]
        }], propDecorators: { size: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL3Byb2dyZXNzLXNwaW5uZXIvcHJvZ3Jlc3Mtc3Bpbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBa0JqRCxNQUFNLE9BQU8sNEJBQTRCOzt5SEFBNUIsNEJBQTRCOzZHQUE1Qiw0QkFBNEIsdUZBZDdCOzs7Ozs7Ozs7OztHQVdUOzJGQUdVLDRCQUE0QjtrQkFoQnhDLFNBQVM7K0JBQ0UsdUJBQXVCLFlBQ3ZCOzs7Ozs7Ozs7OztHQVdUOzhCQUtELElBQUk7c0JBREgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1wcm9ncmVzcy1zcGlubmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c3BhbiByb2xlPVwiYWxlcnRcIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIj5cbiAgICAgIDxzcGFuXG4gICAgICAgIGNsYXNzPVwic2JsLWNpcmNcIlxuICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwic2l6ZVwiXG4gICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwic2l6ZVwiXG4gICAgICAgIFtzdHlsZS5ib3JkZXItd2lkdGgucHhdPVwic2l6ZSAvIDhcIlxuICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+TG9hZGluZzwvc3Bhbj5cbiAgICA8L3NwYW4+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL3Byb2dyZXNzLXNwaW5uZXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzUHJvZ3Jlc3NTcGlubmVyQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgc2l6ZTogbnVtYmVyO1xufVxuIl19