import { OnInit } from '@angular/core';
export declare class PbdsDatavizMetricIndicatorComponent implements OnInit {
    value: number;
    class: string;
    indicator: 'flat' | 'increase' | 'decrease';
    inverse: boolean;
    readonly hostClasses: string;
    constructor();
    ngOnInit(): void;
}
