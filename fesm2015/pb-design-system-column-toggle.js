import { EventEmitter, Component, Input, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

class PbdsColumnToggleComponent {
    constructor() {
        this.storagekey = false;
        this.minimum = 1;
        this.toggle = new EventEmitter();
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
        this.updateTotalSelected();
    }
    toggleColumn(column) {
        // prevent unchecking all columns
        if (this.totalSelected === this.minimum && column.toggle.selected) {
            return;
        }
        column.toggle.selected = !column.toggle.selected;
        if (this.storagekey) {
            this.setLocalStorage();
        }
        this.toggle.emit({
            showAll: false,
            column,
            columns: this.columns
        });
        this.updateTotalSelected();
    }
    showAllColumns(columnToggleDropdown) {
        this.columns.map((column) => {
            if (column.toggle.visible) {
                column.toggle.selected = true;
            }
        });
        if (this.storagekey) {
            this.setLocalStorage();
        }
        this.toggle.emit({
            showAll: true,
            column: null,
            columns: this.columns
        });
        this.updateTotalSelected();
        columnToggleDropdown.close();
    }
    showSelectedIcon(column) {
        return column.toggle.selected ? '' : 'invisible';
    }
    setLocalStorage() {
        if (this.storagekey) {
            localStorage.setItem(this.storagekey, JSON.stringify(this.columns));
        }
    }
    updateTotalSelected() {
        this.totalSelected = this.columns.filter((value) => value.toggle.selected && value.toggle.visible).length;
    }
}
PbdsColumnToggleComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-column-toggle',
                template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\"></i>\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <ng-container *ngFor=\"let column of columns\">\n      <button *ngIf=\"column.toggle.visible\" class=\"dropdown-item\" (click)=\"toggleColumn(column)\">\n        <i class=\"pbi-icon-mini pbi-check small mr-1\" [ngClass]=\"showSelectedIcon(column)\"></i>\n        {{ column.header }}\n      </button>\n    </ng-container>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <button class=\"dropdown-item\" (click)=\"showAllColumns(columnToggleDropdown)\">Show All</button>\n  </div>\n</div>\n"
            },] }
];
PbdsColumnToggleComponent.propDecorators = {
    columns: [{ type: Input }],
    storagekey: [{ type: Input }],
    minimum: [{ type: Input }],
    toggle: [{ type: Output }]
};

class PbdsColumnToggleModule {
}
PbdsColumnToggleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PbdsColumnToggleComponent],
                imports: [CommonModule, NgbDropdownModule],
                exports: [PbdsColumnToggleComponent]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { PbdsColumnToggleComponent, PbdsColumnToggleModule };
//# sourceMappingURL=pb-design-system-column-toggle.js.map
