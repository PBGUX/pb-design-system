import { Component, EventEmitter, Input, Output } from '@angular/core';
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
PbdsColumnToggleComponent.decorators = [
    { type: Component, args: [{
                selector: 'pbds-column-toggle',
                template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\" container=\"body\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\" aria-hidden=\"true\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <label class=\"mb-0 dropdown-item\" for=\"pbds-show-all-{{ index }}\">\n      <input\n        id=\"pbds-show-all-{{ index }}\"\n        type=\"checkbox\"\n        [checked]=\"isShowAll\"\n        (change)=\"showAllColumns($event)\"\n        [attr.disabled]=\"isShowAll ? '' : null\"\n      />\n      {{ showAllLabel }}\n    </label>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <ng-container *ngFor=\"let column of columns\">\n      <ng-container *ngIf=\"column.toggle.visible\">\n        <label class=\"mb-0 dropdown-item\" for=\"{{ column.field }}-{{ index }}\">\n          <input\n            id=\"{{ column.field }}-{{ index }}\"\n            name=\"{{ column.field }}-{{ index }}\"\n            type=\"checkbox\"\n            [checked]=\"column.toggle.selected\"\n            (change)=\"toggleColumn($event, column)\"\n          />\n          {{ column.header }}</label\n        >\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n",
                styles: [`
      input[type='checkbox'] {
        width: 1rem;
        height: 1rem;
        vertical-align: middle;
      }
    `]
            },] }
];
PbdsColumnToggleComponent.propDecorators = {
    label: [{ type: Input }],
    showAllLabel: [{ type: Input }],
    columns: [{ type: Input }],
    storagekey: [{ type: Input }],
    minimum: [{ type: Input }],
    toggle: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9wYi1kZXNpZ24tc3lzdGVtL2NvbHVtbi10b2dnbGUvY29sdW1uLXRvZ2dsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd2RSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFlZCxNQUFNLE9BQU8seUJBQXlCO0lBYnRDO1FBZVMsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUdsQixpQkFBWSxHQUFHLFVBQVUsQ0FBQztRQU0xQixlQUFVLEdBQW1CLEtBQUssQ0FBQztRQUduQyxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBR1osV0FBTSxHQUFtQyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRTVELGNBQVMsR0FBRyxLQUFLLENBQUM7SUErRjNCLENBQUM7SUExRlEsUUFBUTtRQUNiLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTNELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDMUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN0RixNQUFNLENBQUMs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QUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzdHLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUVuRixJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsS0FBSyxjQUFjLENBQUM7SUFDdEQsQ0FBQzs7O1lBOUhGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixrMENBQTZDO3lCQUUzQzs7Ozs7O0tBTUM7YUFFSjs7O29CQUVFLEtBQUs7MkJBR0wsS0FBSztzQkFHTCxLQUFLO3lCQUdMLEtBQUs7c0JBR0wsS0FBSztxQkFHTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBiZHNDb2x1bW5Ub2dnbGUgfSBmcm9tICcuL2NvbHVtbi10b2dnbGUuaW50ZXJmYWNlcyc7XG5cbmxldCBDT1VOVCA9IDA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtY29sdW1uLXRvZ2dsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb2x1bW4tdG9nZ2xlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgaW5wdXRbdHlwZT0nY2hlY2tib3gnXSB7XG4gICAgICAgIHdpZHRoOiAxcmVtO1xuICAgICAgICBoZWlnaHQ6IDFyZW07XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICB9XG4gICAgYFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNDb2x1bW5Ub2dnbGVDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBwdWJsaWMgbGFiZWwgPSAnQ29sdW1ucyc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dBbGxMYWJlbCA9ICdTaG93IEFsbCc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGNvbHVtbnM6IGFueVtdO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzdG9yYWdla2V5OiBzdHJpbmcgfCBmYWxzZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBtaW5pbXVtID0gMTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHRvZ2dsZTogRXZlbnRFbWl0dGVyPFBiZHNDb2x1bW5Ub2dnbGU+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHB1YmxpYyBpc1Nob3dBbGwgPSBmYWxzZTtcbiAgcHVibGljIGNvbHVtblN0b3JhZ2U6IGFueTtcbiAgcHVibGljIGluZGV4OiBudW1iZXI7XG4gIHByaXZhdGUgdG90YWxTZWxlY3RlZDogbnVtYmVyO1xuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5zdG9yYWdla2V5KSB7XG4gICAgICB0aGlzLmNvbHVtblN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnN0b3JhZ2VrZXkpO1xuXG4gICAgICBpZiAodGhpcy5jb2x1bW5TdG9yYWdlKSB7XG4gICAgICAgIHRoaXMuY29sdW1uU3RvcmFnZSA9IEpTT04ucGFyc2UodGhpcy5jb2x1bW5TdG9yYWdlKTtcblxuICAgICAgICB0aGlzLmNvbHVtbnMubWFwKChjb2x1bW4pID0+IHtcbiAgICAgICAgICBjb25zdCBzYXZlZENvbHVtbiA9IHRoaXMuY29sdW1uU3RvcmFnZS5maW5kKChvYmo6IGFueSkgPT4gb2JqLmZpZWxkID09PSBjb2x1bW4uZmllbGQpO1xuICAgICAgICAgIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQgPSBzYXZlZENvbHVtbiA/IHNhdmVkQ29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA6IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSgpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U2hvd0FsbENoZWNrZWQoKTtcblxuICAgIHRoaXMudXBkYXRlVG90YWxTZWxlY3RlZCgpO1xuXG4gICAgdGhpcy5pbmRleCA9IENPVU5UKys7XG4gIH1cblxuICBwdWJsaWMgdG9nZ2xlQ29sdW1uKCRldmVudCwgY29sdW1uKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gJGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQgPSB0YXJnZXQuY2hlY2tlZDtcblxuICAgIHRoaXMudXBkYXRlVG90YWxTZWxlY3RlZCgpO1xuXG4gICAgLy8gcHJldmVudCB1bmNoZWNraW5nIGFsbCBjb2x1bW5zXG4gICAgaWYgKHRoaXMudG90YWxTZWxlY3RlZCA8IHRoaXMubWluaW11bSkge1xuICAgICAgdGFyZ2V0LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB0aGlzLnVwZGF0ZVRvdGFsU2VsZWN0ZWQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldExvY2FsU3RvcmFnZSgpO1xuXG4gICAgdGhpcy50b2dnbGUuZW1pdCh7XG4gICAgICBzaG93QWxsOiBmYWxzZSxcbiAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zXG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZVRvdGFsU2VsZWN0ZWQoKTtcbiAgICB0aGlzLnNldFNob3dBbGxDaGVja2VkKCk7XG4gIH1cblxuICBwdWJsaWMgc2hvd0FsbENvbHVtbnMoJGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9ICRldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICBjb25zdCBjaGVja2VkID0gdGFyZ2V0LmNoZWNrZWQ7XG5cbiAgICB0aGlzLmlzU2hvd0FsbCA9IGNoZWNrZWQ7XG5cbiAgICBpZiAoY2hlY2tlZCkge1xuICAgICAgdGhpcy5jb2x1bW5zLm1hcCgoY29sdW1uKSA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4udG9nZ2xlLnZpc2libGUpIHtcbiAgICAgICAgICBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoKTtcblxuICAgIHRoaXMudG9nZ2xlLmVtaXQoe1xuICAgICAgc2hvd0FsbDogdHJ1ZSxcbiAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1uc1xuICAgIH0pO1xuXG4gICAgdGhpcy51cGRhdGVUb3RhbFNlbGVjdGVkKCk7XG4gIH1cblxuICBwcml2YXRlIHNldExvY2FsU3RvcmFnZSgpIHtcbiAgICBpZiAodGhpcy5zdG9yYWdla2V5KSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnN0b3JhZ2VrZXksIEpTT04uc3RyaW5naWZ5KHRoaXMuY29sdW1ucykpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlVG90YWxTZWxlY3RlZCgpIHtcbiAgICB0aGlzLnRvdGFsU2VsZWN0ZWQgPSB0aGlzLmNvbHVtbnMuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUudG9nZ2xlLnNlbGVjdGVkICYmIHZhbHVlLnRvZ2dsZS52aXNpYmxlKS5sZW5ndGg7XG4gIH1cblxuICBzZXRTaG93QWxsQ2hlY2tlZCgpIHtcbiAgICBjb25zdCBjb2x1bW5zU2VsZWN0ZWQgPSB0aGlzLmNvbHVtbnMuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUudG9nZ2xlLnNlbGVjdGVkICYmIHZhbHVlLnRvZ2dsZS52aXNpYmxlKS5sZW5ndGg7XG4gICAgY29uc3QgY29sdW1uc1Zpc2libGUgPSB0aGlzLmNvbHVtbnMuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUudG9nZ2xlLnZpc2libGUpLmxlbmd0aDtcblxuICAgIHRoaXMuaXNTaG93QWxsID0gY29sdW1uc1NlbGVjdGVkID09PSBjb2x1bW5zVmlzaWJsZTtcbiAgfVxufVxuIl19