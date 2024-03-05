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
PbdsAvatarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.7", type: PbdsAvatarComponent, selector: "pbds-avatar", inputs: { label: "label", icon: "icon", image: "image", size: "size", shape: "shape", style: "style", styleClass: "styleClass", value: "value", title: "title" }, ngImport: i0, template: "<div [ngClass]=\"containerClass()\" [class]=\"styleClass\" [ngStyle]=\"style\">\n  <span class=\"p-avatar-text\" *ngIf=\"label; else iconTemplate\">{{ label }}</span>\n  <span class=\"pb-badge pb-badge-no-gutter\" *ngIf=\"value\">{{ value }}</span>\n  <ng-template #iconTemplate\n    ><span *ngIf=\"icon; else imageTemplate\" [class]=\"icon\" [ngClass]=\"'p-avatar-icon'\"></span\n  ></ng-template>\n  <ng-template #imageTemplate><img *ngIf=\"image\" [src]=\"image\" [alt]=\"title\" /></ng-template>\n</div>\n", styles: [".pb-avatar{position:relative;background-color:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;border-radius:2px;font-size:1rem;width:2rem;height:2rem}.pb-avatar img{width:100%;height:100%;border-radius:inherit}.pb-avatar.pb-avatar-circle{border-radius:50%}.pb-avatar.pb-avatar-circle img{border-radius:inherit}.pb-avatar.pb-avatar-sm{width:1.5rem;height:1.5rem;font-size:.875rem}.pb-avatar.pb-avatar-sm .p-avatar-icon{font-size:.875rem}.pb-avatar.pb-avatar-lg{width:3rem;height:3rem;font-size:1.5rem}.pb-avatar.pb-avatar-lg .p-avatar-icon{font-size:1.5rem}.pb-avatar.pb-avatar-xl{width:4rem;height:4rem;font-size:2rem}.pb-avatar.pb-avatar-xl .pb-avatar-icon{font-size:2rem}.pb-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;border-radius:50%;margin:0;background:var(--secondary);text-align:center;color:#fff;font-size:12px;min-width:18px;height:18px;line-height:18px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.7", ngImport: i0, type: PbdsAvatarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-avatar', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div [ngClass]=\"containerClass()\" [class]=\"styleClass\" [ngStyle]=\"style\">\n  <span class=\"p-avatar-text\" *ngIf=\"label; else iconTemplate\">{{ label }}</span>\n  <span class=\"pb-badge pb-badge-no-gutter\" *ngIf=\"value\">{{ value }}</span>\n  <ng-template #iconTemplate\n    ><span *ngIf=\"icon; else imageTemplate\" [class]=\"icon\" [ngClass]=\"'p-avatar-icon'\"></span\n  ></ng-template>\n  <ng-template #imageTemplate><img *ngIf=\"image\" [src]=\"image\" [alt]=\"title\" /></ng-template>\n</div>\n", styles: [".pb-avatar{position:relative;background-color:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;border-radius:2px;font-size:1rem;width:2rem;height:2rem}.pb-avatar img{width:100%;height:100%;border-radius:inherit}.pb-avatar.pb-avatar-circle{border-radius:50%}.pb-avatar.pb-avatar-circle img{border-radius:inherit}.pb-avatar.pb-avatar-sm{width:1.5rem;height:1.5rem;font-size:.875rem}.pb-avatar.pb-avatar-sm .p-avatar-icon{font-size:.875rem}.pb-avatar.pb-avatar-lg{width:3rem;height:3rem;font-size:1.5rem}.pb-avatar.pb-avatar-lg .p-avatar-icon{font-size:1.5rem}.pb-avatar.pb-avatar-xl{width:4rem;height:4rem;font-size:2rem}.pb-avatar.pb-avatar-xl .pb-avatar-icon{font-size:2rem}.pb-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;border-radius:50%;margin:0;background:var(--secondary);text-align:center;color:#fff;font-size:12px;min-width:18px;height:18px;line-height:18px}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BiLWRlc2lnbi1zeXN0ZW0vYXZhdGFyL2F2YXRhci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2F2YXRhci9hdmF0YXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQVM3RixNQUFNLE9BQU8sbUJBQW1CO0lBUGhDO1FBY1csU0FBSSxHQUFHLFFBQVEsQ0FBQztRQUVoQixVQUFLLEdBQUcsUUFBUSxDQUFDO0tBb0IzQjtJQVZDLGNBQWM7UUFDWixPQUFPO1lBQ0wsV0FBVyxFQUFFLElBQUk7WUFDakIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJO1lBQ3JDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUTtZQUMzQyxjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPO1lBQ3JDLGNBQWMsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU87WUFDckMsY0FBYyxFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtTQUN2QyxDQUFDO0lBQ0osQ0FBQzs7Z0hBNUJVLG1CQUFtQjtvR0FBbkIsbUJBQW1CLHFOQ1RoQywrZkFRQTsyRkRDYSxtQkFBbUI7a0JBUC9CLFNBQVM7K0JBQ0UsYUFBYSxtQkFHTix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJOzhCQUc1QixLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsSUFBSTtzQkFBWixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLEtBQUs7c0JBQWIsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1hdmF0YXInLFxuICB0ZW1wbGF0ZVVybDogJy4vYXZhdGFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vYXZhdGFyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNBdmF0YXJDb21wb25lbnQge1xuICBASW5wdXQoKSBsYWJlbDogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGljb246IHN0cmluZztcblxuICBASW5wdXQoKSBpbWFnZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHNpemUgPSAnbm9ybWFsJztcblxuICBASW5wdXQoKSBzaGFwZSA9ICdzcXVhcmUnO1xuXG4gIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHZhbHVlOiBzdHJpbmc7XG5cbiAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcblxuICBjb250YWluZXJDbGFzcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgJ3BiLWF2YXRhcic6IHRydWUsXG4gICAgICAncGItYXZhdGFyLWltYWdlJzogdGhpcy5pbWFnZSAhPSBudWxsLFxuICAgICAgJ3BiLWF2YXRhci1jaXJjbGUnOiB0aGlzLnNoYXBlID09PSAnY2lyY2xlJyxcbiAgICAgICdwYi1hdmF0YXItc20nOiB0aGlzLnNpemUgPT09ICdzbWFsbCcsXG4gICAgICAncGItYXZhdGFyLWxnJzogdGhpcy5zaXplID09PSAnbGFyZ2UnLFxuICAgICAgJ3BiLWF2YXRhci14bCc6IHRoaXMuc2l6ZSA9PT0gJ3hsYXJnZSdcbiAgICB9O1xuICB9XG59XG4iLCI8ZGl2IFtuZ0NsYXNzXT1cImNvbnRhaW5lckNsYXNzKClcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCI+XG4gIDxzcGFuIGNsYXNzPVwicC1hdmF0YXItdGV4dFwiICpuZ0lmPVwibGFiZWw7IGVsc2UgaWNvblRlbXBsYXRlXCI+e3sgbGFiZWwgfX08L3NwYW4+XG4gIDxzcGFuIGNsYXNzPVwicGItYmFkZ2UgcGItYmFkZ2Utbm8tZ3V0dGVyXCIgKm5nSWY9XCJ2YWx1ZVwiPnt7IHZhbHVlIH19PC9zcGFuPlxuICA8bmctdGVtcGxhdGUgI2ljb25UZW1wbGF0ZVxuICAgID48c3BhbiAqbmdJZj1cImljb247IGVsc2UgaW1hZ2VUZW1wbGF0ZVwiIFtjbGFzc109XCJpY29uXCIgW25nQ2xhc3NdPVwiJ3AtYXZhdGFyLWljb24nXCI+PC9zcGFuXG4gID48L25nLXRlbXBsYXRlPlxuICA8bmctdGVtcGxhdGUgI2ltYWdlVGVtcGxhdGU+PGltZyAqbmdJZj1cImltYWdlXCIgW3NyY109XCJpbWFnZVwiIFthbHRdPVwidGl0bGVcIiAvPjwvbmctdGVtcGxhdGU+XG48L2Rpdj5cbiJdfQ==