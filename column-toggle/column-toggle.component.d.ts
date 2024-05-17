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
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsColumnToggleComponent, "pbds-column-toggle", never, { "label": { "alias": "label"; "required": false; }; "showAllLabel": { "alias": "showAllLabel"; "required": false; }; "columns": { "alias": "columns"; "required": false; }; "storagekey": { "alias": "storagekey"; "required": false; }; "minimum": { "alias": "minimum"; "required": false; }; "placement": { "alias": "placement"; "required": false; }; }, { "toggle": "toggle"; }, never, never, false, never>;
}
