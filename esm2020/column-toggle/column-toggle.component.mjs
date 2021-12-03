import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@ng-bootstrap/ng-bootstrap";
import * as i2 from "@angular/common";
let COUNT = 0;
export class PbdsColumnToggleComponent {
    constructor() {
        this.label = 'Columns';
        this.showAllLabel = 'Show All';
        this.storagekey = false;
        this.minimum = 1;
        this.toggle = new EventEmitter();
        this.isShowAll = false;
    }
    ngOnInit() {
        if (this.storagekey) {
            this.columnStorage = localStorage.getItem(this.storagekey);
            if (this.columnStorage) {
                this.columnStorage = JSON.parse(this.columnStorage);
                this.columns.map((column) => {
                    const savedColumn = this.columnStorage.find((obj) => obj.field === column.field);
                    column.toggle.selected = savedColumn ? savedColumn.toggle.selected : true;
                });
            }
            this.setLocalStorage();
        }
        this.setShowAllChecked();
        this.updateTotalSelected();
        this.index = COUNT++;
    }
    toggleColumn($event, column) {
        const target = $event.target;
        column.toggle.selected = target.checked;
        this.updateTotalSelected();
        // prevent unchecking all columns
        if (this.totalSelected < this.minimum) {
            target.checked = true;
            column.toggle.selected = true;
            this.updateTotalSelected();
            return;
        }
        this.setLocalStorage();
        this.toggle.emit({
            showAll: false,
            column: column,
            columns: this.columns
        });
        this.updateTotalSelected();
        this.setShowAllChecked();
    }
    showAllColumns($event) {
        const target = $event.target;
        const checked = target.checked;
        this.isShowAll = checked;
        if (checked) {
            this.columns.map((column) => {
                if (column.toggle.visible) {
                    column.toggle.selected = true;
                }
            });
        }
        this.setLocalStorage();
        this.toggle.emit({
            showAll: true,
            column: null,
            columns: this.columns
        });
        this.updateTotalSelected();
    }
    setLocalStorage() {
        if (this.storagekey) {
            localStorage.setItem(this.storagekey, JSON.stringify(this.columns));
        }
    }
    updateTotalSelected() {
        this.totalSelected = this.columns.filter((value) => value.toggle.selected && value.toggle.visible).length;
    }
    setShowAllChecked() {
        const columnsSelected = this.columns.filter((value) => value.toggle.selected && value.toggle.visible).length;
        const columnsVisible = this.columns.filter((value) => value.toggle.visible).length;
        this.isShowAll = columnsSelected === columnsVisible;
    }
}
PbdsColumnToggleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PbdsColumnToggleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsColumnToggleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.2", type: PbdsColumnToggleComponent, selector: "pbds-column-toggle", inputs: { label: "label", showAllLabel: "showAllLabel", columns: "columns", storagekey: "storagekey", minimum: "minimum" }, outputs: { toggle: "toggle" }, ngImport: i0, template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\" container=\"body\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\" aria-hidden=\"true\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <label class=\"mb-0 dropdown-item\" for=\"pbds-show-all-{{ index }}\">\n      <input\n        id=\"pbds-show-all-{{ index }}\"\n        type=\"checkbox\"\n        [checked]=\"isShowAll\"\n        (change)=\"showAllColumns($event)\"\n        [attr.disabled]=\"isShowAll ? '' : null\"\n      />\n      {{ showAllLabel }}\n    </label>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <ng-container *ngFor=\"let column of columns\">\n      <ng-container *ngIf=\"column.toggle.visible\">\n        <label class=\"mb-0 dropdown-item\" for=\"{{ column.field }}-{{ index }}\">\n          <input\n            id=\"{{ column.field }}-{{ index }}\"\n            name=\"{{ column.field }}-{{ index }}\"\n            type=\"checkbox\"\n            [checked]=\"column.toggle.selected\"\n            (change)=\"toggleColumn($event, column)\"\n          />\n          {{ column.header }}</label\n        >\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n", styles: ["input[type=checkbox]{width:1rem;height:1rem;vertical-align:middle}\n"], directives: [{ type: i1.NgbDropdown, selector: "[ngbDropdown]", inputs: ["open", "placement", "container", "autoClose", "display", "dropdownClass"], outputs: ["openChange"], exportAs: ["ngbDropdown"] }, { type: i1.NgbDropdownToggle, selector: "[ngbDropdownToggle]" }, { type: i1.NgbDropdownMenu, selector: "[ngbDropdownMenu]" }, { type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.2", ngImport: i0, type: PbdsColumnToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-column-toggle', styles: [
                        `
      input[type='checkbox'] {
        width: 1rem;
        height: 1rem;
        vertical-align: middle;
      }
    `
                    ], template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\" container=\"body\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\" aria-hidden=\"true\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <label class=\"mb-0 dropdown-item\" for=\"pbds-show-all-{{ index }}\">\n      <input\n        id=\"pbds-show-all-{{ index }}\"\n        type=\"checkbox\"\n        [checked]=\"isShowAll\"\n        (change)=\"showAllColumns($event)\"\n        [attr.disabled]=\"isShowAll ? '' : null\"\n      />\n      {{ showAllLabel }}\n    </label>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <ng-container *ngFor=\"let column of columns\">\n      <ng-container *ngIf=\"column.toggle.visible\">\n        <label class=\"mb-0 dropdown-item\" for=\"{{ column.field }}-{{ index }}\">\n          <input\n            id=\"{{ column.field }}-{{ index }}\"\n            name=\"{{ column.field }}-{{ index }}\"\n            type=\"checkbox\"\n            [checked]=\"column.toggle.selected\"\n            (change)=\"toggleColumn($event, column)\"\n          />\n          {{ column.header }}</label\n        >\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n" }]
        }], propDecorators: { label: [{
                type: Input
            }], showAllLabel: [{
                type: Input
            }], columns: [{
                type: Input
            }], storagekey: [{
                type: Input
            }], minimum: [{
                type: Input
            }], toggle: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2NvbHVtbi10b2dnbGUvY29sdW1uLXRvZ2dsZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2NvbHVtbi10b2dnbGUvY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBR3ZFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQWVkLE1BQU0sT0FBTyx5QkFBeUI7SUFidEM7UUFlUyxVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGlCQUFZLEdBQUcsVUFBVSxDQUFDO1FBTTFCLGVBQVUsR0FBbUIsS0FBSyxDQUFDO1FBR25DLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFHWixXQUFNLEdBQW1DLElBQUksWUFBWSxFQUFFLENBQUM7UUFFNUQsY0FBUyxHQUFHLEtBQUssQ0FBQztLQStGMUI7SUExRlEsUUFBUTtRQUNiLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTNELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDMUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxH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RUQsaUJBQWlCO1FBQ2YsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzdHLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUVuRixJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsS0FBSyxjQUFjLENBQUM7SUFDdEQsQ0FBQzs7c0hBakhVLHlCQUF5QjswR0FBekIseUJBQXlCLHFOQ2xCdEMsd3pDQW9DQTsyRkRsQmEseUJBQXlCO2tCQWJyQyxTQUFTOytCQUNFLG9CQUFvQixVQUV0Qjt3QkFDTjs7Ozs7O0tBTUM7cUJBQ0Y7OEJBSU0sS0FBSztzQkFEWCxLQUFLO2dCQUlDLFlBQVk7c0JBRGxCLEtBQUs7Z0JBSUMsT0FBTztzQkFEYixLQUFLO2dCQUlDLFVBQVU7c0JBRGhCLEtBQUs7Z0JBSUMsT0FBTztzQkFEYixLQUFLO2dCQUlDLE1BQU07c0JBRFosTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQYmRzQ29sdW1uVG9nZ2xlIH0gZnJvbSAnLi9jb2x1bW4tdG9nZ2xlLmludGVyZmFjZXMnO1xuXG5sZXQgQ09VTlQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWNvbHVtbi10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIGlucHV0W3R5cGU9J2NoZWNrYm94J10ge1xuICAgICAgICB3aWR0aDogMXJlbTtcbiAgICAgICAgaGVpZ2h0OiAxcmVtO1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgfVxuICAgIGBcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzQ29sdW1uVG9nZ2xlQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgcHVibGljIGxhYmVsID0gJ0NvbHVtbnMnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93QWxsTGFiZWwgPSAnU2hvdyBBbGwnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjb2x1bW5zOiBhbnlbXTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc3RvcmFnZWtleTogc3RyaW5nIHwgZmFsc2UgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgbWluaW11bSA9IDE7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyB0b2dnbGU6IEV2ZW50RW1pdHRlcjxQYmRzQ29sdW1uVG9nZ2xlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwdWJsaWMgaXNTaG93QWxsID0gZmFsc2U7XG4gIHB1YmxpYyBjb2x1bW5TdG9yYWdlOiBhbnk7XG4gIHB1YmxpYyBpbmRleDogbnVtYmVyO1xuICBwcml2YXRlIHRvdGFsU2VsZWN0ZWQ6IG51bWJlcjtcblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuc3RvcmFnZWtleSkge1xuICAgICAgdGhpcy5jb2x1bW5TdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5zdG9yYWdla2V5KTtcblxuICAgICAgaWYgKHRoaXMuY29sdW1uU3RvcmFnZSkge1xuICAgICAgICB0aGlzLmNvbHVtblN0b3JhZ2UgPSBKU09OLnBhcnNlKHRoaXMuY29sdW1uU3RvcmFnZSk7XG5cbiAgICAgICAgdGhpcy5jb2x1bW5zLm1hcCgoY29sdW1uKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2F2ZWRDb2x1bW4gPSB0aGlzLmNvbHVtblN0b3JhZ2UuZmluZCgob2JqOiBhbnkpID0+IG9iai5maWVsZCA9PT0gY29sdW1uLmZpZWxkKTtcbiAgICAgICAgICBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkID0gc2F2ZWRDb2x1bW4gPyBzYXZlZENvbHVtbi50b2dnbGUuc2VsZWN0ZWQgOiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFNob3dBbGxDaGVja2VkKCk7XG5cbiAgICB0aGlzLnVwZGF0ZVRvdGFsU2VsZWN0ZWQoKTtcblxuICAgIHRoaXMuaW5kZXggPSBDT1VOVCsrO1xuICB9XG5cbiAgcHVibGljIHRvZ2dsZUNvbHVtbigkZXZlbnQsIGNvbHVtbikge1xuICAgIGNvbnN0IHRhcmdldCA9ICRldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkID0gdGFyZ2V0LmNoZWNrZWQ7XG5cbiAgICB0aGlzLnVwZGF0ZVRvdGFsU2VsZWN0ZWQoKTtcblxuICAgIC8vIHByZXZlbnQgdW5jaGVja2luZyBhbGwgY29sdW1uc1xuICAgIGlmICh0aGlzLnRvdGFsU2VsZWN0ZWQgPCB0aGlzLm1pbmltdW0pIHtcbiAgICAgIHRhcmdldC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy51cGRhdGVUb3RhbFNlbGVjdGVkKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoKTtcblxuICAgIHRoaXMudG9nZ2xlLmVtaXQoe1xuICAgICAgc2hvd0FsbDogZmFsc2UsXG4gICAgICBjb2x1bW46IGNvbHVtbixcbiAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1uc1xuICAgIH0pO1xuXG4gICAgdGhpcy51cGRhdGVUb3RhbFNlbGVjdGVkKCk7XG4gICAgdGhpcy5zZXRTaG93QWxsQ2hlY2tlZCgpO1xuICB9XG5cbiAgcHVibGljIHNob3dBbGxDb2x1bW5zKCRldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSAkZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgY29uc3QgY2hlY2tlZCA9IHRhcmdldC5jaGVja2VkO1xuXG4gICAgdGhpcy5pc1Nob3dBbGwgPSBjaGVja2VkO1xuXG4gICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgIHRoaXMuY29sdW1ucy5tYXAoKGNvbHVtbikgPT4ge1xuICAgICAgICBpZiAoY29sdW1uLnRvZ2dsZS52aXNpYmxlKSB7XG4gICAgICAgICAgY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG5cbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHNob3dBbGw6IHRydWUsXG4gICAgICBjb2x1bW46IG51bGwsXG4gICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnNcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlVG90YWxTZWxlY3RlZCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgaWYgKHRoaXMuc3RvcmFnZWtleSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5zdG9yYWdla2V5LCBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbHVtbnMpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVRvdGFsU2VsZWN0ZWQoKSB7XG4gICAgdGhpcy50b3RhbFNlbGVjdGVkID0gdGhpcy5jb2x1bW5zLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnRvZ2dsZS5zZWxlY3RlZCAmJiB2YWx1ZS50b2dnbGUudmlzaWJsZSkubGVuZ3RoO1xuICB9XG5cbiAgc2V0U2hvd0FsbENoZWNrZWQoKSB7XG4gICAgY29uc3QgY29sdW1uc1NlbGVjdGVkID0gdGhpcy5jb2x1bW5zLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnRvZ2dsZS5zZWxlY3RlZCAmJiB2YWx1ZS50b2dnbGUudmlzaWJsZSkubGVuZ3RoO1xuICAgIGNvbnN0IGNvbHVtbnNWaXNpYmxlID0gdGhpcy5jb2x1bW5zLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnRvZ2dsZS52aXNpYmxlKS5sZW5ndGg7XG5cbiAgICB0aGlzLmlzU2hvd0FsbCA9IGNvbHVtbnNTZWxlY3RlZCA9PT0gY29sdW1uc1Zpc2libGU7XG4gIH1cbn1cbiIsIjxkaXYgbmdiRHJvcGRvd24gI2NvbHVtblRvZ2dsZURyb3Bkb3duPVwibmdiRHJvcGRvd25cIiBbYXV0b0Nsb3NlXT1cIidvdXRzaWRlJ1wiIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2tcIiBjb250YWluZXI9XCJib2R5XCI+XG4gIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXNlY29uZGFyeVwiIGlkPVwidG9nZ2xlLWNvbHVtblwiIG5nYkRyb3Bkb3duVG9nZ2xlPlxuICAgIDxpIGNsYXNzPVwicGJpLWljb24tbWluaSBwYmktY29sdW1uLXRvZ2dsZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cbiAgICB7eyBsYWJlbCB9fVxuICA8L2J1dHRvbj5cblxuICA8ZGl2IG5nYkRyb3Bkb3duTWVudSBhcmlhLWxhYmVsbGVkYnk9XCJ0b2dnbGUtY29sdW1uXCI+XG4gICAgPGxhYmVsIGNsYXNzPVwibWItMCBkcm9wZG93bi1pdGVtXCIgZm9yPVwicGJkcy1zaG93LWFsbC17eyBpbmRleCB9fVwiPlxuICAgICAgPGlucHV0XG4gICAgICAgIGlkPVwicGJkcy1zaG93LWFsbC17eyBpbmRleCB9fVwiXG4gICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgIFtjaGVja2VkXT1cImlzU2hvd0FsbFwiXG4gICAgICAgIChjaGFuZ2UpPVwic2hvd0FsbENvbHVtbnMoJGV2ZW50KVwiXG4gICAgICAgIFthdHRyLmRpc2FibGVkXT1cImlzU2hvd0FsbCA/ICcnIDogbnVsbFwiXG4gICAgICAvPlxuICAgICAge3sgc2hvd0FsbExhYmVsIH19XG4gICAgPC9sYWJlbD5cblxuICAgIDxkaXYgY2xhc3M9XCJkcm9wZG93bi1kaXZpZGVyXCI+PC9kaXY+XG5cbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBjb2x1bW4gb2YgY29sdW1uc1wiPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbHVtbi50b2dnbGUudmlzaWJsZVwiPlxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJtYi0wIGRyb3Bkb3duLWl0ZW1cIiBmb3I9XCJ7eyBjb2x1bW4uZmllbGQgfX0te3sgaW5kZXggfX1cIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGlkPVwie3sgY29sdW1uLmZpZWxkIH19LXt7IGluZGV4IH19XCJcbiAgICAgICAgICAgIG5hbWU9XCJ7eyBjb2x1bW4uZmllbGQgfX0te3sgaW5kZXggfX1cIlxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIFtjaGVja2VkXT1cImNvbHVtbi50b2dnbGUuc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKGNoYW5nZSk9XCJ0b2dnbGVDb2x1bW4oJGV2ZW50LCBjb2x1bW4pXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIHt7IGNvbHVtbi5oZWFkZXIgfX08L2xhYmVsXG4gICAgICAgID5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19