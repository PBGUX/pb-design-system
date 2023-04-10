import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@ng-bootstrap/ng-bootstrap";
let COUNT = 0;
export class PbdsColumnToggleComponent {
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
PbdsColumnToggleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsColumnToggleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PbdsColumnToggleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.4", type: PbdsColumnToggleComponent, selector: "pbds-column-toggle", inputs: { label: "label", showAllLabel: "showAllLabel", columns: "columns", storagekey: "storagekey", minimum: "minimum", placement: "placement" }, outputs: { toggle: "toggle" }, ngImport: i0, template: "<div\n  ngbDropdown\n  #columnToggleDropdown=\"ngbDropdown\"\n  [autoClose]=\"'outside'\"\n  class=\"d-inline-block\"\n  container=\"body\"\n  [placement]=\"placement\"\n>\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\" aria-hidden=\"true\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <label class=\"mb-0\" ngbDropdownItem for=\"pbds-show-all-{{ index }}\">\n      <input\n        id=\"pbds-show-all-{{ index }}\"\n        type=\"checkbox\"\n        [checked]=\"isShowAll\"\n        (change)=\"showAllColumns($event)\"\n        [attr.disabled]=\"isShowAll ? '' : null\"\n      />\n      {{ showAllLabel }}\n    </label>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <ng-container *ngFor=\"let column of columns\">\n      <ng-container *ngIf=\"column.toggle.visible\">\n        <label class=\"mb-0\" ngbDropdownItem for=\"{{ column.field }}-{{ index }}\">\n          <input\n            id=\"{{ column.field }}-{{ index }}\"\n            name=\"{{ column.field }}-{{ index }}\"\n            type=\"checkbox\"\n            [checked]=\"column.toggle.selected\"\n            (change)=\"toggleColumn($event, column)\"\n          />\n          {{ column.header }}</label\n        >\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n", styles: ["input[type=checkbox]{width:1rem;height:1rem;vertical-align:middle}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgbDropdown, selector: "[ngbDropdown]", inputs: ["autoClose", "dropdownClass", "open", "placement", "popperOptions", "container", "display"], outputs: ["openChange"], exportAs: ["ngbDropdown"] }, { kind: "directive", type: i2.NgbDropdownToggle, selector: "[ngbDropdownToggle]" }, { kind: "directive", type: i2.NgbDropdownMenu, selector: "[ngbDropdownMenu]" }, { kind: "directive", type: i2.NgbDropdownItem, selector: "[ngbDropdownItem]", inputs: ["disabled"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.4", ngImport: i0, type: PbdsColumnToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'pbds-column-toggle', template: "<div\n  ngbDropdown\n  #columnToggleDropdown=\"ngbDropdown\"\n  [autoClose]=\"'outside'\"\n  class=\"d-inline-block\"\n  container=\"body\"\n  [placement]=\"placement\"\n>\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\" aria-hidden=\"true\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <label class=\"mb-0\" ngbDropdownItem for=\"pbds-show-all-{{ index }}\">\n      <input\n        id=\"pbds-show-all-{{ index }}\"\n        type=\"checkbox\"\n        [checked]=\"isShowAll\"\n        (change)=\"showAllColumns($event)\"\n        [attr.disabled]=\"isShowAll ? '' : null\"\n      />\n      {{ showAllLabel }}\n    </label>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <ng-container *ngFor=\"let column of columns\">\n      <ng-container *ngIf=\"column.toggle.visible\">\n        <label class=\"mb-0\" ngbDropdownItem for=\"{{ column.field }}-{{ index }}\">\n          <input\n            id=\"{{ column.field }}-{{ index }}\"\n            name=\"{{ column.field }}-{{ index }}\"\n            type=\"checkbox\"\n            [checked]=\"column.toggle.selected\"\n            (change)=\"toggleColumn($event, column)\"\n          />\n          {{ column.header }}</label\n        >\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n", styles: ["input[type=checkbox]{width:1rem;height:1rem;vertical-align:middle}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2NvbHVtbi10b2dnbGUvY29sdW1uLXRvZ2dsZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2NvbHVtbi10b2dnbGUvY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBR3ZFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQWVkLE1BQU0sT0FBTyx5QkFBeUI7SUFidEM7UUFlUyxVQUFLLEdBQUcsU0FBUyxDQUFDO1FBR2xCLGlCQUFZLEdBQUcsVUFBVSxDQUFDO1FBTTFCLGVBQVUsR0FBbUIsS0FBSyxDQUFDO1FBR25DLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFHbkIsY0FBUyxHQUFHLDZDQUE2QyxDQUFDO1FBR25ELFdBQU0sR0FBbUMsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUU1RCxjQUFTLEdBQUcsS0FBSyxDQUFDO0tBK0YxQjtJQTFGUSxRQUFRO1FBQ2IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFM0QsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUVwRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUMxQixNQUFNLFdBQVcsR0FBRyxJQUFJLENB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LENBQUMsTUFBTSxDQUFDO0lBQzVHLENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDN0csTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRW5GLElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxLQUFLLGNBQWMsQ0FBQztJQUN0RCxDQUFDOztzSEFwSFUseUJBQXlCOzBHQUF6Qix5QkFBeUIsNk9DbEJ0QywwMkNBMkNBOzJGRHpCYSx5QkFBeUI7a0JBYnJDLFNBQVM7K0JBQ0Usb0JBQW9COzhCQWN2QixLQUFLO3NCQURYLEtBQUs7Z0JBSUMsWUFBWTtzQkFEbEIsS0FBSztnQkFJQyxPQUFPO3NCQURiLEtBQUs7Z0JBSUMsVUFBVTtzQkFEaEIsS0FBSztnQkFJQyxPQUFPO3NCQURiLEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlDLE1BQU07c0JBRFosTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQYmRzQ29sdW1uVG9nZ2xlIH0gZnJvbSAnLi9jb2x1bW4tdG9nZ2xlLmludGVyZmFjZXMnO1xuXG5sZXQgQ09VTlQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwYmRzLWNvbHVtbi10b2dnbGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIGlucHV0W3R5cGU9J2NoZWNrYm94J10ge1xuICAgICAgICB3aWR0aDogMXJlbTtcbiAgICAgICAgaGVpZ2h0OiAxcmVtO1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgfVxuICAgIGBcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzQ29sdW1uVG9nZ2xlQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgcHVibGljIGxhYmVsID0gJ0NvbHVtbnMnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzaG93QWxsTGFiZWwgPSAnU2hvdyBBbGwnO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBjb2x1bW5zOiBhbnlbXTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc3RvcmFnZWtleTogc3RyaW5nIHwgZmFsc2UgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgbWluaW11bSA9IDE7XG5cbiAgQElucHV0KClcbiAgcGxhY2VtZW50ID0gJ2JvdHRvbS1sZWZ0IGJvdHRvbS1yaWdodCB0b3AtbGVmdCB0b3AtcmlnaHQnO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgdG9nZ2xlOiBFdmVudEVtaXR0ZXI8UGJkc0NvbHVtblRvZ2dsZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIGlzU2hvd0FsbCA9IGZhbHNlO1xuICBwdWJsaWMgY29sdW1uU3RvcmFnZTogYW55O1xuICBwdWJsaWMgaW5kZXg6IG51bWJlcjtcbiAgcHJpdmF0ZSB0b3RhbFNlbGVjdGVkOiBudW1iZXI7XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLnN0b3JhZ2VrZXkpIHtcbiAgICAgIHRoaXMuY29sdW1uU3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc3RvcmFnZWtleSk7XG5cbiAgICAgIGlmICh0aGlzLmNvbHVtblN0b3JhZ2UpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5TdG9yYWdlID0gSlNPTi5wYXJzZSh0aGlzLmNvbHVtblN0b3JhZ2UpO1xuXG4gICAgICAgIHRoaXMuY29sdW1ucy5tYXAoKGNvbHVtbikgPT4ge1xuICAgICAgICAgIGNvbnN0IHNhdmVkQ29sdW1uID0gdGhpcy5jb2x1bW5TdG9yYWdlLmZpbmQoKG9iajogYW55KSA9PiBvYmouZmllbGQgPT09IGNvbHVtbi5maWVsZCk7XG4gICAgICAgICAgY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA9IHNhdmVkQ29sdW1uID8gc2F2ZWRDb2x1bW4udG9nZ2xlLnNlbGVjdGVkIDogdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTaG93QWxsQ2hlY2tlZCgpO1xuXG4gICAgdGhpcy51cGRhdGVUb3RhbFNlbGVjdGVkKCk7XG5cbiAgICB0aGlzLmluZGV4ID0gQ09VTlQrKztcbiAgfVxuXG4gIHB1YmxpYyB0b2dnbGVDb2x1bW4oJGV2ZW50LCBjb2x1bW4pIHtcbiAgICBjb25zdCB0YXJnZXQgPSAkZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA9IHRhcmdldC5jaGVja2VkO1xuXG4gICAgdGhpcy51cGRhdGVUb3RhbFNlbGVjdGVkKCk7XG5cbiAgICAvLyBwcmV2ZW50IHVuY2hlY2tpbmcgYWxsIGNvbHVtbnNcbiAgICBpZiAodGhpcy50b3RhbFNlbGVjdGVkIDwgdGhpcy5taW5pbXVtKSB7XG4gICAgICB0YXJnZXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMudXBkYXRlVG90YWxTZWxlY3RlZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG5cbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHNob3dBbGw6IGZhbHNlLFxuICAgICAgY29sdW1uOiBjb2x1bW4sXG4gICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnNcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlVG90YWxTZWxlY3RlZCgpO1xuICAgIHRoaXMuc2V0U2hvd0FsbENoZWNrZWQoKTtcbiAgfVxuXG4gIHB1YmxpYyBzaG93QWxsQ29sdW1ucygkZXZlbnQ6IEV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gJGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGNvbnN0IGNoZWNrZWQgPSB0YXJnZXQuY2hlY2tlZDtcblxuICAgIHRoaXMuaXNTaG93QWxsID0gY2hlY2tlZDtcblxuICAgIGlmIChjaGVja2VkKSB7XG4gICAgICB0aGlzLmNvbHVtbnMubWFwKChjb2x1bW4pID0+IHtcbiAgICAgICAgaWYgKGNvbHVtbi50b2dnbGUudmlzaWJsZSkge1xuICAgICAgICAgIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldExvY2FsU3RvcmFnZSgpO1xuXG4gICAgdGhpcy50b2dnbGUuZW1pdCh7XG4gICAgICBzaG93QWxsOiB0cnVlLFxuICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zXG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZVRvdGFsU2VsZWN0ZWQoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0TG9jYWxTdG9yYWdlKCkge1xuICAgIGlmICh0aGlzLnN0b3JhZ2VrZXkpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc3RvcmFnZWtleSwgSlNPTi5zdHJpbmdpZnkodGhpcy5jb2x1bW5zKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVUb3RhbFNlbGVjdGVkKCkge1xuICAgIHRoaXMudG90YWxTZWxlY3RlZCA9IHRoaXMuY29sdW1ucy5maWx0ZXIoKHZhbHVlKSA9PiB2YWx1ZS50b2dnbGUuc2VsZWN0ZWQgJiYgdmFsdWUudG9nZ2xlLnZpc2libGUpLmxlbmd0aDtcbiAgfVxuXG4gIHNldFNob3dBbGxDaGVja2VkKCkge1xuICAgIGNvbnN0IGNvbHVtbnNTZWxlY3RlZCA9IHRoaXMuY29sdW1ucy5maWx0ZXIoKHZhbHVlKSA9PiB2YWx1ZS50b2dnbGUuc2VsZWN0ZWQgJiYgdmFsdWUudG9nZ2xlLnZpc2libGUpLmxlbmd0aDtcbiAgICBjb25zdCBjb2x1bW5zVmlzaWJsZSA9IHRoaXMuY29sdW1ucy5maWx0ZXIoKHZhbHVlKSA9PiB2YWx1ZS50b2dnbGUudmlzaWJsZSkubGVuZ3RoO1xuXG4gICAgdGhpcy5pc1Nob3dBbGwgPSBjb2x1bW5zU2VsZWN0ZWQgPT09IGNvbHVtbnNWaXNpYmxlO1xuICB9XG59XG4iLCI8ZGl2XG4gIG5nYkRyb3Bkb3duXG4gICNjb2x1bW5Ub2dnbGVEcm9wZG93bj1cIm5nYkRyb3Bkb3duXCJcbiAgW2F1dG9DbG9zZV09XCInb3V0c2lkZSdcIlxuICBjbGFzcz1cImQtaW5saW5lLWJsb2NrXCJcbiAgY29udGFpbmVyPVwiYm9keVwiXG4gIFtwbGFjZW1lbnRdPVwicGxhY2VtZW50XCJcbj5cbiAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc2Vjb25kYXJ5XCIgaWQ9XCJ0b2dnbGUtY29sdW1uXCIgbmdiRHJvcGRvd25Ub2dnbGU+XG4gICAgPGkgY2xhc3M9XCJwYmktaWNvbi1taW5pIHBiaS1jb2x1bW4tdG9nZ2xlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgIHt7IGxhYmVsIH19XG4gIDwvYnV0dG9uPlxuXG4gIDxkaXYgbmdiRHJvcGRvd25NZW51IGFyaWEtbGFiZWxsZWRieT1cInRvZ2dsZS1jb2x1bW5cIj5cbiAgICA8bGFiZWwgY2xhc3M9XCJtYi0wXCIgbmdiRHJvcGRvd25JdGVtIGZvcj1cInBiZHMtc2hvdy1hbGwte3sgaW5kZXggfX1cIj5cbiAgICAgIDxpbnB1dFxuICAgICAgICBpZD1cInBiZHMtc2hvdy1hbGwte3sgaW5kZXggfX1cIlxuICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICBbY2hlY2tlZF09XCJpc1Nob3dBbGxcIlxuICAgICAgICAoY2hhbmdlKT1cInNob3dBbGxDb2x1bW5zKCRldmVudClcIlxuICAgICAgICBbYXR0ci5kaXNhYmxlZF09XCJpc1Nob3dBbGwgPyAnJyA6IG51bGxcIlxuICAgICAgLz5cbiAgICAgIHt7IHNob3dBbGxMYWJlbCB9fVxuICAgIDwvbGFiZWw+XG5cbiAgICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24tZGl2aWRlclwiPjwvZGl2PlxuXG4gICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgY29sdW1uIG9mIGNvbHVtbnNcIj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb2x1bW4udG9nZ2xlLnZpc2libGVcIj5cbiAgICAgICAgPGxhYmVsIGNsYXNzPVwibWItMFwiIG5nYkRyb3Bkb3duSXRlbSBmb3I9XCJ7eyBjb2x1bW4uZmllbGQgfX0te3sgaW5kZXggfX1cIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGlkPVwie3sgY29sdW1uLmZpZWxkIH19LXt7IGluZGV4IH19XCJcbiAgICAgICAgICAgIG5hbWU9XCJ7eyBjb2x1bW4uZmllbGQgfX0te3sgaW5kZXggfX1cIlxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIFtjaGVja2VkXT1cImNvbHVtbi50b2dnbGUuc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKGNoYW5nZSk9XCJ0b2dnbGVDb2x1bW4oJGV2ZW50LCBjb2x1bW4pXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIHt7IGNvbHVtbi5oZWFkZXIgfX08L2xhYmVsXG4gICAgICAgID5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19