(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@ng-bootstrap/ng-bootstrap')) :
    typeof define === 'function' && define.amd ? define('pb-design-system/column-toggle', ['exports', '@angular/core', '@angular/common', '@ng-bootstrap/ng-bootstrap'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['pb-design-system'] = global['pb-design-system'] || {}, global['pb-design-system']['column-toggle'] = {}), global.ng.core, global.ng.common, global['^7']['0']['0']));
}(this, (function (exports, core, common, ngBootstrap) { 'use strict';

    var PbdsColumnToggleComponent = /** @class */ (function () {
        function PbdsColumnToggleComponent() {
            this.storagekey = false;
            this.minimum = 1;
            this.toggle = new core.EventEmitter();
        }
        PbdsColumnToggleComponent.prototype.ngOnInit = function () {
            var _this = this;
            if (this.storagekey) {
                this.columnStorage = localStorage.getItem(this.storagekey);
                if (this.columnStorage) {
                    this.columnStorage = JSON.parse(this.columnStorage);
                    this.columns.map(function (column) {
                        var savedColumn = _this.columnStorage.find(function (obj) { return obj.field === column.field; });
                        column.toggle.selected = savedColumn ? savedColumn.toggle.selected : true;
                    });
                }
                this.setLocalStorage();
            }
            this.updateTotalSelected();
        };
        PbdsColumnToggleComponent.prototype.toggleColumn = function (column) {
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
                column: column,
                columns: this.columns
            });
            this.updateTotalSelected();
        };
        PbdsColumnToggleComponent.prototype.showAllColumns = function (columnToggleDropdown) {
            this.columns.map(function (column) {
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
        };
        PbdsColumnToggleComponent.prototype.showSelectedIcon = function (column) {
            return column.toggle.selected ? '' : 'invisible';
        };
        PbdsColumnToggleComponent.prototype.setLocalStorage = function () {
            if (this.storagekey) {
                localStorage.setItem(this.storagekey, JSON.stringify(this.columns));
            }
        };
        PbdsColumnToggleComponent.prototype.updateTotalSelected = function () {
            this.totalSelected = this.columns.filter(function (value) { return value.toggle.selected && value.toggle.visible; }).length;
        };
        return PbdsColumnToggleComponent;
    }());
    PbdsColumnToggleComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'pbds-column-toggle',
                    template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\"></i>\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <ng-container *ngFor=\"let column of columns\">\n      <button *ngIf=\"column.toggle.visible\" class=\"dropdown-item\" (click)=\"toggleColumn(column)\">\n        <i class=\"pbi-icon-mini pbi-check small mr-1\" [ngClass]=\"showSelectedIcon(column)\"></i>\n        {{ column.header }}\n      </button>\n    </ng-container>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <button class=\"dropdown-item\" (click)=\"showAllColumns(columnToggleDropdown)\">Show All</button>\n  </div>\n</div>\n"
                },] }
    ];
    PbdsColumnToggleComponent.propDecorators = {
        columns: [{ type: core.Input }],
        storagekey: [{ type: core.Input }],
        minimum: [{ type: core.Input }],
        toggle: [{ type: core.Output }]
    };

    var PbdsColumnToggleModule = /** @class */ (function () {
        function PbdsColumnToggleModule() {
        }
        return PbdsColumnToggleModule;
    }());
    PbdsColumnToggleModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [PbdsColumnToggleComponent],
                    imports: [common.CommonModule, ngBootstrap.NgbDropdownModule],
                    exports: [PbdsColumnToggleComponent]
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.PbdsColumnToggleComponent = PbdsColumnToggleComponent;
    exports.PbdsColumnToggleModule = PbdsColumnToggleModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pb-design-system-column-toggle.umd.js.map
