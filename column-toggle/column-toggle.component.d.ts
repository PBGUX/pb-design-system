import { EventEmitter } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { PbdsColumnToggle } from './column-toggle.interfaces';
export declare class PbdsColumnToggleComponent {
    columns: any[];
    storagekey: string | false;
    minimum: number;
    toggle: EventEmitter<PbdsColumnToggle>;
    columnStorage: any;
    private totalSelected;
    ngOnInit(): void;
    toggleColumn(column: any): void;
    showAllColumns(columnToggleDropdown: NgbDropdown): void;
    showSelectedIcon(column: any): "" | "invisible";
    private setLocalStorage;
    private updateTotalSelected;
}
