import { OnChanges, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PbdsProgressButtonComponent implements OnChanges {
    classPbdsProgressButton: boolean;
    initLabel: string;
    btnClasses: string;
    loadingLabel: string;
    isLoading: boolean;
    isCompleted: boolean;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsProgressButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PbdsProgressButtonComponent, "pbds-progress-button", never, { "initLabel": "initLabel"; "btnClasses": "btnClasses"; "loadingLabel": "loadingLabel"; "isLoading": "isLoading"; }, {}, never, never, false, never>;
}
