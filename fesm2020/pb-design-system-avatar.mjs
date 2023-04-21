import * as i0 from '@angular/core';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class PbdsAvatarComponent {
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
PbdsAvatarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsAvatarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsAvatarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: PbdsAvatarComponent, selector: "pbds-avatar", inputs: { label: "label", icon: "icon", image: "image", size: "size", shape: "shape", style: "style", styleClass: "styleClass", value: "value", title: "title" }, ngImport: i0, template: "<div [ngClass]=\"containerClass()\"\n     [class]=\"styleClass\"\n     [ngStyle]=\"style\">\n      <span class=\"p-avatar-text\"\n            *ngIf=\"label; else iconTemplate\">{{ label }}</span>\n      <span class=\"pb-badge pb-badge-no-gutter\"\n            *ngIf=\"value\">{{ value }}</span>\n      <ng-template #iconTemplate><span [class]=\"icon\"\n                  [ngClass]=\"'p-avatar-icon'\"\n                  *ngIf=\"icon; else imageTemplate\"></span></ng-template>\n      <ng-template #imageTemplate><img [src]=\"image\"\n                 *ngIf=\"image\"\n                 [alt]=\"title\" /></ng-template>\n</div>", styles: [".pb-avatar{position:relative;background-color:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;border-radius:2px;font-size:1rem;width:2rem;height:2rem}.pb-avatar img{width:100%;height:100%;border-radius:inherit}.pb-avatar.pb-avatar-circle{border-radius:50%}.pb-avatar.pb-avatar-circle img{border-radius:inherit}.pb-avatar.pb-avatar-sm{width:1.5rem;height:1.5rem;font-size:.875rem}.pb-avatar.pb-avatar-sm .p-avatar-icon{font-size:.875rem}.pb-avatar.pb-avatar-lg{width:3rem;height:3rem;font-size:1.5rem}.pb-avatar.pb-avatar-lg .p-avatar-icon{font-size:1.5rem}.pb-avatar.pb-avatar-xl{width:4rem;height:4rem;font-size:2rem}.pb-avatar.pb-avatar-xl .pb-avatar-icon{font-size:2rem}.pb-badge{position:absolute;top:0;right:0;transform:translate(50%,-50%);transform-origin:100% 0;border-radius:50%;margin:0;background:var(--secondary);text-align:center;color:#fff;font-size:12px;min-width:18px;height:18px;line-height:18px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsAvatarComponent, decorators: [{
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

class PbdsAvatarModule {
}
PbdsAvatarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsAvatarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsAvatarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.12", ngImport: i0, type: PbdsAvatarModule, declarations: [PbdsAvatarComponent], imports: [CommonModule], exports: [PbdsAvatarComponent] });
PbdsAvatarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsAvatarModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: PbdsAvatarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsAvatarComponent],
                    imports: [CommonModule],
                    exports: [PbdsAvatarComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsAvatarComponent, PbdsAvatarModule };
//# sourceMappingURL=pb-design-system-avatar.mjs.map
//# sourceMappingURL=pb-design-system-avatar.mjs.map
