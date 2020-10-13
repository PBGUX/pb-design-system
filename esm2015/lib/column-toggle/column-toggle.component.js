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
                template: "<div ngbDropdown #columnToggleDropdown=\"ngbDropdown\" [autoClose]=\"'outside'\" class=\"d-inline-block\">\n  <button class=\"btn btn-secondary\" id=\"toggle-column\" ngbDropdownToggle>\n    <i class=\"pbi-icon-mini pbi-settings\"></i>\n  </button>\n\n  <div ngbDropdownMenu aria-labelledby=\"toggle-column\">\n    <ng-container *ngFor=\"let column of columns\">\n      <button *ngIf=\"column.toggle.visible\" class=\"dropdown-item\" (click)=\"toggleColumn(column)\">\n        <i class=\"pbi-icon-mini pbi-check small mr-1\" [ngClass]=\"showSelectedIcon(column)\"></i>\n        {{ column.header }}\n      </button>\n    </ng-container>\n\n    <div class=\"dropdown-divider\"></div>\n\n    <button class=\"dropdown-item\" (click)=\"showAllColumns(columnToggleDropdown)\">Show All</button>\n  </div>\n</div>\n"
            },] }
];
PbdsColumnToggleComponent.propDecorators = {
    columns: [{ type: Input }],
    storagekey: [{ type: Input }],
    minimum: [{ type: Input }],
    toggle: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXRvZ2dsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3N0MDE2bG8vZ2l0aHViL25nLWRlc2lnbnN5c3RlbS9jbGllbnQvcHJvamVjdHMvcGItZGVzaWduLXN5c3RlbS9zcmMvIiwic291cmNlcyI6WyJsaWIvY29sdW1uLXRvZ2dsZS9jb2x1bW4tdG9nZ2xlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBU3ZFLE1BQU0sT0FBTyx5QkFBeUI7SUFMdEM7UUFVUyxlQUFVLEdBQW1CLEtBQUssQ0FBQztRQUduQyxZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBR3BCLFdBQU0sR0FBbUMsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQStFckUsQ0FBQztJQTFFUSxRQUFRO1FBQ2IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFM0QsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUVwRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUMxQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3RGLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDNUUsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUVELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFTSxZQUFZLENBQUMsTUFBVztRQUM3QixpQ0FBaUM7UUFDakMsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDakUsT0FBTztTQUNSO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUVqRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixPQUFPLEVBQUUsS0FBSztZQUNkLE1BQU07WUFDTixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVNLGNBQWMsQ0FBQyxvQkFBaUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMxQixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO2dCQUN6QixNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDL0I7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLE9BQU8sRUFBRSxJQUFJO1lBQ2IsTUFBTSxFQUFFLElBQUk7WUFDWixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0Isb0JBQW9CLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVNLGdCQUFnQixDQUFDLE1BQVc7UUFDakMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFDbkQsQ0FBQztJQUVPLGVBQWU7UUFDckIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQztJQUVPLG1CQUFtQjtRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM1RyxDQUFDOzs7WUE5RkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLG16QkFBNkM7YUFFOUM7OztzQkFFRSxLQUFLO3lCQUdMLEtBQUs7c0JBR0wsS0FBSztxQkFHTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5nYkRyb3Bkb3duIH0gZnJvbSAnQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAnO1xuaW1wb3J0IHsgUGJkc0NvbHVtblRvZ2dsZSB9IGZyb20gJy4vY29sdW1uLXRvZ2dsZS5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAncGJkcy1jb2x1bW4tdG9nZ2xlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvbHVtbi10b2dnbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFtdXG59KVxuZXhwb3J0IGNsYXNzIFBiZHNDb2x1bW5Ub2dnbGVDb21wb25lbnQge1xuICBASW5wdXQoKVxuICBwdWJsaWMgY29sdW1uczogYW55W107XG5cbiAgQElucHV0KClcbiAgcHVibGljIHN0b3JhZ2VrZXk6IHN0cmluZyB8IGZhbHNlID0gZmFsc2U7XG5cbiAgQElucHV0KClcbiAgcHVibGljIG1pbmltdW06IG51bWJlciA9IDE7XG5cbiAgQE91dHB1dCgpXG4gIHB1YmxpYyB0b2dnbGU6IEV2ZW50RW1pdHRlcjxQYmRzQ29sdW1uVG9nZ2xlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwdWJsaWMgY29sdW1uU3RvcmFnZTogYW55O1xuICBwcml2YXRlIHRvdGFsU2VsZWN0ZWQ6IG51bWJlcjtcblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuc3RvcmFnZWtleSkge1xuICAgICAgdGhpcy5jb2x1bW5TdG9yYWdlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5zdG9yYWdla2V5KTtcblxuICAgICAgaWYgKHRoaXMuY29sdW1uU3RvcmFnZSkge1xuICAgICAgICB0aGlzLmNvbHVtblN0b3JhZ2UgPSBKU09OLnBhcnNlKHRoaXMuY29sdW1uU3RvcmFnZSk7XG5cbiAgICAgICAgdGhpcy5jb2x1bW5zLm1hcCgoY29sdW1uKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2F2ZWRDb2x1bW4gPSB0aGlzLmNvbHVtblN0b3JhZ2UuZmluZCgob2JqOiBhbnkpID0+IG9iai5maWVsZCA9PT0gY29sdW1uLmZpZWxkKTtcbiAgICAgICAgICBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkID0gc2F2ZWRDb2x1bW4gPyBzYXZlZENvbHVtbi50b2dnbGUuc2VsZWN0ZWQgOiB0cnVlO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVRvdGFsU2VsZWN0ZWQoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b2dnbGVDb2x1bW4oY29sdW1uOiBhbnkpIHtcbiAgICAvLyBwcmV2ZW50IHVuY2hlY2tpbmcgYWxsIGNvbHVtbnNcbiAgICBpZiAodGhpcy50b3RhbFNlbGVjdGVkID09PSB0aGlzLm1pbmltdW0gJiYgY29sdW1uLnRvZ2dsZS5zZWxlY3RlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQgPSAhY29sdW1uLnRvZ2dsZS5zZWxlY3RlZDtcblxuICAgIGlmICh0aGlzLnN0b3JhZ2VrZXkpIHtcbiAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuXG4gICAgdGhpcy50b2dnbGUuZW1pdCh7XG4gICAgICBzaG93QWxsOiBmYWxzZSxcbiAgICAgIGNvbHVtbixcbiAgICAgIGNvbHVtbnM6IHRoaXMuY29sdW1uc1xuICAgIH0pO1xuXG4gICAgdGhpcy51cGRhdGVUb3RhbFNlbGVjdGVkKCk7XG4gIH1cblxuICBwdWJsaWMgc2hvd0FsbENvbHVtbnMoY29sdW1uVG9nZ2xlRHJvcGRvd246IE5nYkRyb3Bkb3duKSB7XG4gICAgdGhpcy5jb2x1bW5zLm1hcCgoY29sdW1uKSA9PiB7XG4gICAgICBpZiAoY29sdW1uLnRvZ2dsZS52aXNpYmxlKSB7XG4gICAgICAgIGNvbHVtbi50b2dnbGUuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuc3RvcmFnZWtleSkge1xuICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvZ2dsZS5lbWl0KHtcbiAgICAgIHNob3dBbGw6IHRydWUsXG4gICAgICBjb2x1bW46IG51bGwsXG4gICAgICBjb2x1bW5zOiB0aGlzLmNvbHVtbnNcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlVG90YWxTZWxlY3RlZCgpO1xuICAgIGNvbHVtblRvZ2dsZURyb3Bkb3duLmNsb3NlKCk7XG4gIH1cblxuICBwdWJsaWMgc2hvd1NlbGVjdGVkSWNvbihjb2x1bW46IGFueSkge1xuICAgIHJldHVybiBjb2x1bW4udG9nZ2xlLnNlbGVjdGVkID8gJycgOiAnaW52aXNpYmxlJztcbiAgfVxuXG4gIHByaXZhdGUgc2V0TG9jYWxTdG9yYWdlKCkge1xuICAgIGlmICh0aGlzLnN0b3JhZ2VrZXkpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuc3RvcmFnZWtleSwgSlNPTi5zdHJpbmdpZnkodGhpcy5jb2x1bW5zKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVUb3RhbFNlbGVjdGVkKCkge1xuICAgIHRoaXMudG90YWxTZWxlY3RlZCA9IHRoaXMuY29sdW1ucy5maWx0ZXIoKHZhbHVlKSA9PiB2YWx1ZS50b2dnbGUuc2VsZWN0ZWQgJiYgdmFsdWUudG9nZ2xlLnZpc2libGUpLmxlbmd0aDtcbiAgfVxufVxuIl19