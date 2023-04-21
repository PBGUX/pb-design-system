import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class PbdsAvatarComponent {
    constructor() {
        this.size = 'normal';
        this.shape = 'square';
    }
    containerClass() {
        return {
            'pb-avatar': true,
            'pb-avatar-image': this.image != null,
            'pb-avatar-circle': this.shape === 'circle',
            'pb-avatar-sm': this.size === 'small',
            'pb-avatar-lg': this.size === 'large',
            'pb-avatar-xl': this.size === 'xlarge'
        };
    }
}
PbdsAvatarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsAvatarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsAvatarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsAvatarComponent, selector: "pbds-avatar", inputs: { label: "label", icon: "icon", image: "image", size: "size", shape: "shape", style: "style", styleClass: "styleClass", value: "value", title: "title" }, ngImport: i0, template: "<div [ngClass]=\"containerClass()\"\n     [class]=\"styleClass\"\n     [ngStyle]=\"style\">\n      <span class=\"p-avatar-text\"\n            *ngIf=\"label; else iconTemplate\">{{ label }}</span>\n      <span class=\"pb-badge pb-badge-no-gutter\"\n            *ngIf=\"value\">{{ value }}</span>\n      <ng-template #iconTemplate><span [class]=\"icon\"\n                  [ngClass]=\"'p-avatar-icon'\"\n                  *ngIf=\"icon; else imageTemplate\"></span></ng-template>\n      <ng-template #imageTemplate><img [src]=\"image\"\n                 *ngIf=\"image\"\n                 [alt]=\"title\" /></ng-template>\n</div>", styles: [".pb-avatar{position:relative;background-color:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;border-radius:2px;font-size:1rem;width:2rem;height:2rem}.pb-avatar img{width:100%;height:100%;border-radius:inherit}.pb-avatar.pb-avatar-circle{border-radius:50%}.pb-avatar.pb-avatar-circle img{border-radius:inherit}.pb-avatar.pb-avatar-sm{width:1.5rem;height:1.5rem;font-size:.875rem}.pb-avatar.pb-avatar-sm .p-avatar-icon{font-size:.875rem}.pb-avatar.pb-avatar-lg{width:3rem;height:3rem;font-size:1.5rem}.pb-avatar.pb-avatar-lg .p-avatar-icon{font-size:1.5rem}.pb-avatar.pb-avatar-xl{width:4rem;height:4rem;font-size:2rem}.pb-avatar.pb-avatar-xl .pb-avatar-icon{font-size:2rem}.pb-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;border-radius:50%;margin:0;background:var(--secondary);text-align:center;color:#fff;font-size:12px;min-width:18px;height:18px;line-height:18px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsAvatarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-avatar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div [ngClass]=\"containerClass()\"\n     [class]=\"styleClass\"\n     [ngStyle]=\"style\">\n      <span class=\"p-avatar-text\"\n            *ngIf=\"label; else iconTemplate\">{{ label }}</span>\n      <span class=\"pb-badge pb-badge-no-gutter\"\n            *ngIf=\"value\">{{ value }}</span>\n      <ng-template #iconTemplate><span [class]=\"icon\"\n                  [ngClass]=\"'p-avatar-icon'\"\n                  *ngIf=\"icon; else imageTemplate\"></span></ng-template>\n      <ng-template #imageTemplate><img [src]=\"image\"\n                 *ngIf=\"image\"\n                 [alt]=\"title\" /></ng-template>\n</div>", styles: [".pb-avatar{position:relative;background-color:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;border-radius:2px;font-size:1rem;width:2rem;height:2rem}.pb-avatar img{width:100%;height:100%;border-radius:inherit}.pb-avatar.pb-avatar-circle{border-radius:50%}.pb-avatar.pb-avatar-circle img{border-radius:inherit}.pb-avatar.pb-avatar-sm{width:1.5rem;height:1.5rem;font-size:.875rem}.pb-avatar.pb-avatar-sm .p-avatar-icon{font-size:.875rem}.pb-avatar.pb-avatar-lg{width:3rem;height:3rem;font-size:1.5rem}.pb-avatar.pb-avatar-lg .p-avatar-icon{font-size:1.5rem}.pb-avatar.pb-avatar-xl{width:4rem;height:4rem;font-size:2rem}.pb-avatar.pb-avatar-xl .pb-avatar-icon{font-size:2rem}.pb-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;border-radius:50%;margin:0;background:var(--secondary);text-align:center;color:#fff;font-size:12px;min-width:18px;height:18px;line-height:18px}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], icon: [{
                type: Input
            }], image: [{
                type: Input
            }], size: [{
                type: Input
            }], shape: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], value: [{
                type: Input
            }], title: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vYXZhdGFyL2F2YXRhci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2F2YXRhci9hdmF0YXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVM3RixNQUFNLE9BQU8sbUJBQW1CO0lBUGhDO1FBY1csU0FBSSxHQUFHLFFBQVEsQ0FBQztRQUVoQixVQUFLLEdBQUcsUUFBUSxDQUFDO0tBb0IzQjtJQVZDLGNBQWM7UUFDWixPQUFPO1lBQ0wsV0FBVyxFQUFFLElBQUk7WUFDakIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJO1lBQ3JDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUTtZQUMzQyxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPO1lBQ3JDLGNBQWMsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU87WUFDckMsY0FBYyxFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtTQUN2QyxDQUFDO0lBQ0osQ0FBQzs7Z0hBNUJVLG1CQUFtQjtvR0FBbkIsbUJBQW1CLHFOQ1RoQyxtbkJBYU07MkZESk8sbUJBQW1CO2tCQVAvQixTQUFTOytCQUNFLGFBQWEsbUJBR04sdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSTs4QkFHNUIsS0FBSztzQkFBYixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtYXZhdGFyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2F2YXRhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2F2YXRhci5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzQXZhdGFyQ29tcG9uZW50IHtcbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcblxuICBASW5wdXQoKSBpY29uOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgaW1hZ2U6IHN0cmluZztcblxuICBASW5wdXQoKSBzaXplID0gJ25vcm1hbCc7XG5cbiAgQElucHV0KCkgc2hhcGUgPSAnc3F1YXJlJztcblxuICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKSB2YWx1ZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHRpdGxlOnN0cmluZztcblxuICBjb250YWluZXJDbGFzcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3BiLWF2YXRhcic6IHRydWUsXG4gICAgICAncGItYXZhdGFyLWltYWdlJzogdGhpcy5pbWFnZSAhPSBudWxsLFxuICAgICAgJ3BiLWF2YXRhci1jaXJjbGUnOiB0aGlzLnNoYXBlID09PSAnY2lyY2xlJyxcbiAgICAgICdwYi1hdmF0YXItc20nOiB0aGlzLnNpemUgPT09ICdzbWFsbCcsXG4gICAgICAncGItYXZhdGFyLWxnJzogdGhpcy5zaXplID09PSAnbGFyZ2UnLFxuICAgICAgJ3BiLWF2YXRhci14bCc6IHRoaXMuc2l6ZSA9PT0gJ3hsYXJnZSdcbiAgICB9O1xuICB9XG59XG4iLCI8ZGl2IFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzKClcIlxuICAgICBbY2xhc3NdPVwic3R5bGVDbGFzc1wiXG4gICAgIFtuZ1N0eWxlXT1cInN0eWxlXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cInAtYXZhdGFyLXRleHRcIlxuICAgICAgICAgICAgKm5nSWY9XCJsYWJlbDsgZWxzZSBpY29uVGVtcGxhdGVcIj57eyBsYWJlbCB9fTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwicGItYmFkZ2UgcGItYmFkZ2Utbm8tZ3V0dGVyXCJcbiAgICAgICAgICAgICpuZ0lmPVwidmFsdWVcIj57eyB2YWx1ZSB9fTwvc3Bhbj5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjaWNvblRlbXBsYXRlPjxzcGFuIFtjbGFzc109XCJpY29uXCJcbiAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIidwLWF2YXRhci1pY29uJ1wiXG4gICAgICAgICAgICAgICAgICAqbmdJZj1cImljb247IGVsc2UgaW1hZ2VUZW1wbGF0ZVwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgPG5nLXRlbXBsYXRlICNpbWFnZVRlbXBsYXRlPjxpbWcgW3NyY109XCJpbWFnZVwiXG4gICAgICAgICAgICAgICAgICpuZ0lmPVwiaW1hZ2VcIlxuICAgICAgICAgICAgICAgICBbYWx0XT1cInRpdGxlXCIgLz48L25nLXRlbXBsYXRlPlxuPC9kaXY+Il19