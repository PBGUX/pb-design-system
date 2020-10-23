import { Component, EventEmitter, Input, Output } from '@angular/core';
export class PbdsColumnToggleComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3N0MDE2bG8vZ2l0aHViL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9jb2x1bW4tdG9nZ2xlLyIsInNvdXJjZXMiOlsiY29sdW1uLXRvZ2dsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVN2RSxNQUFNLE9BQU8seUJBQXlCO0lBTHRDO1FBVVMsZUFBVSxHQUFtQixLQUFLLENBQUM7UUFHbkMsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUdwQixXQUFNLEdBQW1DLElBQUksWUFBWSxFQUFFLENBQUM7SUErRXJFLENBQUM7SUExRVEsUUFBUTtRQUNiLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTNELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFFcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQkFDMUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN0RixNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzVFLENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sWUFBWSxDQUFDLE1BQVc7UUFDN0IsaUNBQWlDO1FBQ2pDLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ2pFLE9BQU87U0FDUjtRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFFakQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNO1lBQ04sT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTSxjQUFjLENBQUMsb0JBQWlDO1FBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDekIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2FBQy9CO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxJQUFJO1lBQ1osT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLG9CQUFvQixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxNQUFXO1FBQ2pDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQ25ELENBQUM7SUFFTyxlQUFlO1FBQ3JCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNyRTtJQUNILENBQUM7SUFFTyxtQkFBbUI7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDNUcsQ0FBQzs7O1lBOUZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5Qix3ekJBQTZDO2FBRTlDOzs7c0JBRUUsS0FBSzt5QkFHTCxLQUFLO3NCQUdMLEtBQUs7cUJBR0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ2JEcm9wZG93biB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcbmltcG9ydCB7IFBiZHNDb2x1bW5Ub2dnbGUgfSBmcm9tICcuL2NvbHVtbi10b2dnbGUuaW50ZXJmYWNlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BiZHMtY29sdW1uLXRvZ2dsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb2x1bW4tdG9nZ2xlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBQYmRzQ29sdW1uVG9nZ2xlQ29tcG9uZW50IHtcbiAgQElucHV0KClcbiAgcHVibGljIGNvbHVtbnM6IGFueVtdO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzdG9yYWdla2V5OiBzdHJpbmcgfCBmYWxzZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBtaW5pbXVtOiBudW1iZXIgPSAxO1xuXG4gIEBPdXRwdXQoKVxuICBwdWJsaWMgdG9nZ2xlOiBFdmVudEVtaXR0ZXI8UGJkc0NvbHVtblRvZ2dsZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIGNvbHVtblN0b3JhZ2U6IGFueTtcbiAgcHJpdmF0ZSB0b3RhbFNlbGVjdGVkOiBudW1iZXI7XG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLnN0b3JhZ2VrZXkpIHtcbiAgICAgIHRoaXMuY29sdW1uU3RvcmFnZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc3RvcmFnZWtleSk7XG5cbiAgICAgIGlmICh0aGlzLmNvbHVtblN0b3JhZ2UpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5TdG9yYWdlID0gSlNPTi5wYXJzZSh0aGlzLmNvbHVtblN0b3JhZ2UpO1xuXG4gICAgICAgIHRoaXMuY29sdW1ucy5tYXAoKGNvbHVtbikgPT4ge1xuICAgICAgICAgIGNvbnN0IHNhdmVkQ29sdW1uID0gdGhpcy5jb2x1bW5TdG9yYWdlLmZpbmQoKG9iajogYW55KSA9PiBvYmouZmllbGQgPT09IGNvbHVtbi5maWVsZCk7XG4gICAgICAgICAgY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA9IHNhdmVkQ29sdW1uID8gc2F2ZWRDb2x1bW4udG9nZ2xlLnNlbGVjdGVkIDogdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVUb3RhbFNlbGVjdGVkKCk7XG4gIH1cblxuICBwdWJsaWMgdG9nZ2xlQ29sdW1uKGNvbHVtbjogYW55KSB7XG4gICAgLy8gcHJldmVudCB1bmNoZWNraW5nIGFsbCBjb2x1bW5zXG4gICAgaWYgKHRoaXMudG90YWxTZWxlY3RlZCA9PT0gdGhpcy5taW5pbXVtICYmIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkID0gIWNvbHVtbi50b2dnbGUuc2VsZWN0ZWQ7XG5cbiAgICBpZiAodGhpcy5zdG9yYWdla2V5KSB7XG4gICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSgpO1xuICAgIH1cblxuICAgIHRoaXMudG9nZ2xlLmVtaXQoe1xuICAgICAgc2hvd0FsbDogZmFsc2UsXG4gICAgICBjb2x1bW4sXG4gICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnNcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlVG90YWxTZWxlY3RlZCgpO1xuICB9XG5cbiAgcHVibGljIHNob3dBbGxDb2x1bW5zKGNvbHVtblRvZ2dsZURyb3Bkb3duOiBOZ2JEcm9wZG93bikge1xuICAgIHRoaXMuY29sdW1ucy5tYXAoKGNvbHVtbikgPT4ge1xuICAgICAgaWYgKGNvbHVtbi50b2dnbGUudmlzaWJsZSkge1xuICAgICAgICBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLnN0b3JhZ2VrZXkpIHtcbiAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuXG4gICAgdGhpcy50b2dnbGUuZW1pdCh7XG4gICAgICBzaG93QWxsOiB0cnVlLFxuICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zXG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZVRvdGFsU2VsZWN0ZWQoKTtcbiAgICBjb2x1bW5Ub2dnbGVEcm9wZG93bi5jbG9zZSgpO1xuICB9XG5cbiAgcHVibGljIHNob3dTZWxlY3RlZEljb24oY29sdW1uOiBhbnkpIHtcbiAgICByZXR1cm4gY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA/ICcnIDogJ2ludmlzaWJsZSc7XG4gIH1cblxuICBwcml2YXRlIHNldExvY2FsU3RvcmFnZSgpIHtcbiAgICBpZiAodGhpcy5zdG9yYWdla2V5KSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnN0b3JhZ2VrZXksIEpTT04uc3RyaW5naWZ5KHRoaXMuY29sdW1ucykpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlVG90YWxTZWxlY3RlZCgpIHtcbiAgICB0aGlzLnRvdGFsU2VsZWN0ZWQgPSB0aGlzLmNvbHVtbnMuZmlsdGVyKCh2YWx1ZSkgPT4gdmFsdWUudG9nZ2xlLnNlbGVjdGVkICYmIHZhbHVlLnRvZ2dsZS52aXNpYmxlKS5sZW5ndGg7XG4gIH1cbn1cbiJdfQ==