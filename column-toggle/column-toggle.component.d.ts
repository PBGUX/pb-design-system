import { EventEmitter } from '@angular/core';
import { PbdsColumnToggle } from './column-toggle.interfaces';
export declare class PbdsColumnToggleComponent {
    label: string;
    showAllLabel: string;
    columns: any[];
    storagekey: string | false;
    minimum: number;
    toggle: EventEmitter<PbdsColumnToggle>;
    isShowAll: boolean;
    columnStorage: any;
    index: number;
    private totalSelected;
    ngOnInit(): void;
    toggleColumn($event: any, column: any): void;
    showAllColumns($event: Event): void;
    private setLocalStorage;
    private updateTotalSelected;
    setShowAllChecked(): void;
}
