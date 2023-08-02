import { EventEmitter } from '@angular/core';
import { PbdsColumnToggle } from './column-toggle.interfaces';
import * as i0 from "@angular/core";
export declare class PbdsColumnToggleComponent {
    label: string;
    showAllLabel: string;
    columns: any[];
    storagekey: string | false;
    minimum: number;
    placement: string;
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
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsColumnToggleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsColumnToggleComponent, "pbds-column-toggle", never, { "label": "label"; "showAllLabel": "showAllLabel"; "columns": "columns"; "storagekey": "storagekey"; "minimum": "minimum"; "placement": "placement"; }, { "toggle": "toggle"; }, never, never, false>;
}
