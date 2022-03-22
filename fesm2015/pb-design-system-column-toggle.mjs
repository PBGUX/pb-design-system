import * as i0 from '@angular/core';
import { EventEmitter, Component, Input, Output, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as i1 from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

let COUNT = 0;
class PbdsColumnToggleComponent {
    constructor() {
        this.label = 'Columns';
        this.showAllLabel = 'Show All';
        this.storagekey = false;
        this.minimum = 1;
        this.placement = 'bottom-left bottom-right top-left top-right';
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
PbdsColumnToggleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsColumnToggleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsColumnToggleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.4", type: PbdsColumnToggleComponent, selector: "pbds-column-toggle", inputs: { label: "label", showAllLabel: "showAllLabel", columns: "columns", storagekey: "storagekey", minimum: "minimum", placement: "placement" }, outputs: { toggle: "toggle" }, ngImport: i0, template: "<div\n  ngbDropdown\n  #columnToggleDropdown=\"ngbDropdown\"\n  [autoClose]=\"'outside'\"\n  class=\"d-inline-block\"\n  container=\"body\"\n  [placement]=\"placement\"\n>\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\" aria-hidden=\"true\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <label class=\"mb-0\" ngbDropdownItem for=\"pbds-show-all-{{ index }}\">\n      <input\n        id=\"pbds-show-all-{{ index }}\"\n        type=\"checkbox\"\n        [checked]=\"isShowAll\"\n        (change)=\"showAllColumns($event)\"\n        [attr.disabled]=\"isShowAll ? '' : null\"\n      />\n      {{ showAllLabel }}\n    </label>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <ng-container *ngFor=\"let column of columns\">\n      <ng-container *ngIf=\"column.toggle.visible\">\n        <label class=\"mb-0\" ngbDropdownItem for=\"{{ column.field }}-{{ index }}\">\n          <input\n            id=\"{{ column.field }}-{{ index }}\"\n            name=\"{{ column.field }}-{{ index }}\"\n            type=\"checkbox\"\n            [checked]=\"column.toggle.selected\"\n            (change)=\"toggleColumn($event, column)\"\n          />\n          {{ column.header }}</label\n        >\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n", styles: ["input[type=checkbox]{width:1rem;height:1rem;vertical-align:middle}\n"], directives: [{ type: i1.NgbDropdown, selector: "[ngbDropdown]", inputs: ["autoClose", "dropdownClass", "open", "placement", "container", "display"], outputs: ["openChange"], exportAs: ["ngbDropdown"] }, { type: i1.NgbDropdownToggle, selector: "[ngbDropdownToggle]" }, { type: i1.NgbDropdownMenu, selector: "[ngbDropdownMenu]" }, { type: i1.NgbDropdownItem, selector: "[ngbDropdownItem]", inputs: ["disabled"] }, { type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsColumnToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-column-toggle', styles: [
                        `
      input[type='checkbox'] {
        width: 1rem;
        height: 1rem;
        vertical-align: middle;
      }
    `
                    ], template: "<div\n  ngbDropdown\n  #columnToggleDropdown=\"ngbDropdown\"\n  [autoClose]=\"'outside'\"\n  class=\"d-inline-block\"\n  container=\"body\"\n  [placement]=\"placement\"\n>\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\" aria-hidden=\"true\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <label class=\"mb-0\" ngbDropdownItem for=\"pbds-show-all-{{ index }}\">\n      <input\n        id=\"pbds-show-all-{{ index }}\"\n        type=\"checkbox\"\n        [checked]=\"isShowAll\"\n        (change)=\"showAllColumns($event)\"\n        [attr.disabled]=\"isShowAll ? '' : null\"\n      />\n      {{ showAllLabel }}\n    </label>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <ng-container *ngFor=\"let column of columns\">\n      <ng-container *ngIf=\"column.toggle.visible\">\n        <label class=\"mb-0\" ngbDropdownItem for=\"{{ column.field }}-{{ index }}\">\n          <input\n            id=\"{{ column.field }}-{{ index }}\"\n            name=\"{{ column.field }}-{{ index }}\"\n            type=\"checkbox\"\n            [checked]=\"column.toggle.selected\"\n            (change)=\"toggleColumn($event, column)\"\n          />\n          {{ column.header }}</label\n        >\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n" }]
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
            }], placement: [{
                type: Input
            }], toggle: [{
                type: Output
            }] } });

class PbdsColumnToggleModule {
}
PbdsColumnToggleModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsColumnToggleModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
PbdsColumnToggleModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsColumnToggleModule, declarations: [PbdsColumnToggleComponent], imports: [CommonModule, NgbDropdownModule, FormsModule], exports: [PbdsColumnToggleComponent] });
PbdsColumnToggleModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsColumnToggleModule, imports: [[CommonModule, NgbDropdownModule, FormsModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.4", ngImport: i0, type: PbdsColumnToggleModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PbdsColumnToggleComponent],
                    imports: [CommonModule, NgbDropdownModule, FormsModule],
                    exports: [PbdsColumnToggleComponent]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsColumnToggleComponent, PbdsColumnToggleModule };
//# sourceMappingURL=pb-design-system-column-toggle.mjs.map
