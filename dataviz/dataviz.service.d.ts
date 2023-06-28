import * as i0 from "@angular/core";
export declare class PbdsDatavizService {
    private colors;
    constructor();
    getColors: (mono?: boolean, theme?: string) => any;
    createGradientDefs: (svg: any, mono?: boolean, theme?: string, vertical?: boolean) => any;
    createGlowFilter: (svg: any) => void;
    d3Format(type: string, string: string): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDatavizService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PbdsDatavizService>;
}
