export declare class PbdsDatavizService {
    private colors;
    constructor();
    getColors: (mono?: boolean, theme?: string) => any;
    createGradientDefs: (svg: any, mono?: boolean, theme?: string, vertical?: boolean) => any;
    createGlowFilter: (svg: any) => void;
}
