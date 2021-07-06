(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms'), require('@ng-bootstrap/ng-bootstrap')) :
    typeof define === 'function' && define.amd ? define('pb-design-system/column-toggle', ['exports', '@angular/core', '@angular/common', '@angular/forms', '@ng-bootstrap/ng-bootstrap'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['pb-design-system'] = global['pb-design-system'] || {}, global['pb-design-system']['column-toggle'] = {}), global.ng.core, global.ng.common, global.ng.forms, global['^7']['0']['0 || ^8']['0']['0']));
}(this, (function (exports, core, common, forms, ngBootstrap) { 'use strict';

    var COUNT = 0;
    var PbdsColumnToggleComponent = /** @class */ (function () {
        function PbdsColumnToggleComponent() {
            this.label = 'Columns';
            this.showAllLabel = 'Show All';
            this.storagekey = false;
            this.minimum = 1;
            this.toggle = new core.EventEmitter();
            this.isShowAll = false;
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
            this.setShowAllChecked();
            this.updateTotalSelected();
            this.index = COUNT++;
        };
        PbdsColumnToggleComponent.prototype.toggleColumn = function ($event, column) {
            var target = $event.target;
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
        };
        PbdsColumnToggleComponent.prototype.showAllColumns = function ($event) {
            var target = $event.target;
            var checked = target.checked;
            this.isShowAll = checked;
            if (checked) {
                this.columns.map(function (column) {
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
        };
        PbdsColumnToggleComponent.prototype.setLocalStorage = function () {
            if (this.storagekey) {
                localStorage.setItem(this.storagekey, JSON.stringify(this.columns));
            }
        };
        PbdsColumnToggleComponent.prototype.updateTotalSelected = function () {
            this.totalSelected = this.columns.filter(function (value) { return value.toggle.selected && value.toggle.visible; }).length;
        };
        PbdsColumnToggleComponent.prototype.setShowAllChecked = function () {
            var columnsSelected = this.columns.filter(function (value) { return value.toggle.selected && value.toggle.visible; }).length;
            var columnsVisible = this.columns.filter(function (value) { return value.toggle.visible; }).length;
            this.isShowAll = columnsSelected === columnsVisible;
        };
        return PbdsColumnToggleComponent;
    }());
    PbdsColumnToggleComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'pbds-column-toggle',
                    template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\" container=\"body\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\" aria-hidden=\"true\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <label class=\"mb-0 dropdown-item\" for=\"pbds-show-all-{{ index }}\">\n      <input\n        id=\"pbds-show-all-{{ index }}\"\n        type=\"checkbox\"\n        [checked]=\"isShowAll\"\n        (change)=\"showAllColumns($event)\"\n        [attr.disabled]=\"isShowAll ? '' : null\"\n      />\n      {{ showAllLabel }}\n    </label>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <ng-container *ngFor=\"let column of columns\">\n      <ng-container *ngIf=\"column.toggle.visible\">\n        <label class=\"mb-0 dropdown-item\" for=\"{{ column.field }}-{{ index }}\">\n          <input\n            id=\"{{ column.field }}-{{ index }}\"\n            name=\"{{ column.field }}-{{ index }}\"\n            type=\"checkbox\"\n            [checked]=\"column.toggle.selected\"\n            (change)=\"toggleColumn($event, column)\"\n          />\n          {{ column.header }}</label\n        >\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n",
                    styles: ["\n      input[type='checkbox'] {\n        width: 1rem;\n        height: 1rem;\n        vertical-align: middle;\n      }\n    "]
                },] }
    ];
    PbdsColumnToggleComponent.propDecorators = {
        label: [{ type: core.Input }],
        showAllLabel: [{ type: core.Input }],
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
                    imports: [common.CommonModule, ngBootstrap.NgbDropdownModule, forms.FormsModule],
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
