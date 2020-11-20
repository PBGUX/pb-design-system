import { Component, EventEmitter, Input, Output } from '@angular/core';
export class PbdsColumnToggleComponent {
    constructor() {
        this.label = 'Columns';
        this.showAllLabel = 'Show All';
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
                template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-column-toggle\"></i>\n    {{ label }}\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <ng-container *ngFor=\"let column of columns\">\n      <button *ngIf=\"column.toggle.visible\" class=\"dropdown-item\" (click)=\"toggleColumn(column)\">\n        <i class=\"pbi-icon-mini pbi-check small mr-1\" [ngClass]=\"showSelectedIcon(column)\"></i>\n        {{ column.header }}\n      </button>\n    </ng-container>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <button class=\"dropdown-item\" (click)=\"showAllColumns(columnToggleDropdown)\">{{ showAllLabel }}</button>\n  </div>\n</div>\n"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3N0MDE2bG8vZ2l0aHViL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9jb2x1bW4tdG9nZ2xlLyIsInNvdXJjZXMiOlsiY29sdW1uLXRvZ2dsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQVN2RSxNQUFNLE9BQU8seUJBQXlCO0lBTHRDO1FBT1MsVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUdsQixpQkFBWSxHQUFHLFVBQVUsQ0FBQztRQU0xQixlQUFVLEdBQW1CLEtBQUssQ0FBQztRQUduQyxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBR1osV0FBTSxHQUFtQyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBK0VyRSxDQUFDO0lBMUVRLFFBQVE7UUFDYixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUUzRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBRXBELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQzFCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdEYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUM1RSxDQUFDLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVNLFlBQVksQ0FBQyxNQUFXO1FBQzdCLGlDQUFpQztRQUNqQyxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssSUFBSSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNqRSxPQUFPO1NBQ1I7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBRWpELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLE9BQU8sRUFBRSxLQUFLO1lBQ2QsTUFBTTtZQUNOLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sY0FBYyxDQUFDLG9CQUFpQztRQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQzFCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQ3pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzthQUMvQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsT0FBTyxFQUFFLElBQUk7WUFDYixNQUFNLEVBQUUsSUFBSTtZQUNaLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztTQUN0QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsTUFBVztRQUNqQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUNuRCxDQUFDO0lBRU8sZUFBZTtRQUNyQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDckU7SUFDSCxDQUFDO0lBRU8sbUJBQW1CO1FBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQzVHLENBQUM7OztZQXBHRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsbTFCQUE2QzthQUU5Qzs7O29CQUVFLEtBQUs7MkJBR0wsS0FBSztzQkFHTCxLQUFLO3lCQUdMLEtBQUs7c0JBR0wsS0FBSztxQkFHTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nYkRyb3Bkb3duIH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHsgUGJkc0NvbHVtblRvZ2dsZSB9IGZyb20gJy4vY29sdW1uLXRvZ2dsZS5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1jb2x1bW4tdG9nZ2xlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbHVtbi10b2dnbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNDb2x1bW5Ub2dnbGVDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBwdWJsaWMgbGFiZWwgPSAnQ29sdW1ucyc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIHNob3dBbGxMYWJlbCA9ICdTaG93IEFsbCc7XG5cbiAgQElucHV0KClcbiAgcHVibGljIGNvbHVtbnM6IGFueVtdO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzdG9yYWdla2V5OiBzdHJpbmcgfCBmYWxzZSA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBtaW5pbXVtID0gMTtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIHRvZ2dsZTogRXZlbnRFbWl0dGVyPFBiZHNDb2x1bW5Ub2dnbGU+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHB1YmxpYyBjb2x1bW5TdG9yYWdlOiBhbnk7XG4gIHByaXZhdGUgdG90YWxTZWxlY3RlZDogbnVtYmVyO1xuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5zdG9yYWdla2V5KSB7XG4gICAgICB0aGlzLmNvbHVtblN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLnN0b3JhZ2VrZXkpO1xuXG4gICAgICBpZiAodGhpcy5jb2x1bW5TdG9yYWdlKSB7XG4gICAgICAgIHRoaXMuY29sdW1uU3RvcmFnZSA9IEpTT04ucGFyc2UodGhpcy5jb2x1bW5TdG9yYWdlKTtcblxuICAgICAgICB0aGlzLmNvbHVtbnMubWFwKChjb2x1bW4pID0+IHtcbiAgICAgICAgICBjb25zdCBzYXZlZENvbHVtbiA9IHRoaXMuY29sdW1uU3RvcmFnZS5maW5kKChvYmo6IGFueSkgPT4gb2JqLmZpZWxkID09PSBjb2x1bW4uZmllbGQpO1xuICAgICAgICAgIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQgPSBzYXZlZENvbHVtbiA/IHNhdmVkQ29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA6IHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSgpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVG90YWxTZWxlY3RlZCgpO1xuICB9XG5cbiAgcHVibGljIHRvZ2dsZUNvbHVtbihjb2x1bW46IGFueSkge1xuICAgIC8vIHByZXZlbnQgdW5jaGVja2luZyBhbGwgY29sdW1uc1xuICAgIGlmICh0aGlzLnRvdGFsU2VsZWN0ZWQgPT09IHRoaXMubWluaW11bSAmJiBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA9ICFjb2x1bW4udG9nZ2xlLnNlbGVjdGVkO1xuXG4gICAgaWYgKHRoaXMuc3RvcmFnZWtleSkge1xuICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHNob3dBbGw6IGZhbHNlLFxuICAgICAgY29sdW1uLFxuICAgICAgY29sdW1uczogdGhpcy5jb2x1bW5zXG4gICAgfSk7XG5cbiAgICB0aGlzLnVwZGF0ZVRvdGFsU2VsZWN0ZWQoKTtcbiAgfVxuXG4gIHB1YmxpYyBzaG93QWxsQ29sdW1ucyhjb2x1bW5Ub2dnbGVEcm9wZG93bjogTmdiRHJvcGRvd24pIHtcbiAgICB0aGlzLmNvbHVtbnMubWFwKChjb2x1bW4pID0+IHtcbiAgICAgIGlmIChjb2x1bW4udG9nZ2xlLnZpc2libGUpIHtcbiAgICAgICAgY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5zdG9yYWdla2V5KSB7XG4gICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSgpO1xuICAgIH1cblxuICAgIHRoaXMudG9nZ2xlLmVtaXQoe1xuICAgICAgc2hvd0FsbDogdHJ1ZSxcbiAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1uc1xuICAgIH0pO1xuXG4gICAgdGhpcy51cGRhdGVUb3RhbFNlbGVjdGVkKCk7XG4gICAgY29sdW1uVG9nZ2xlRHJvcGRvd24uY2xvc2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBzaG93U2VsZWN0ZWRJY29uKGNvbHVtbjogYW55KSB7XG4gICAgcmV0dXJuIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQgPyAnJyA6ICdpbnZpc2libGUnO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRMb2NhbFN0b3JhZ2UoKSB7XG4gICAgaWYgKHRoaXMuc3RvcmFnZWtleSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5zdG9yYWdla2V5LCBKU09OLnN0cmluZ2lmeSh0aGlzLmNvbHVtbnMpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVRvdGFsU2VsZWN0ZWQoKSB7XG4gICAgdGhpcy50b3RhbFNlbGVjdGVkID0gdGhpcy5jb2x1bW5zLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnRvZ2dsZS5zZWxlY3RlZCAmJiB2YWx1ZS50b2dnbGUudmlzaWJsZSkubGVuZ3RoO1xuICB9XG59XG4iXX0=