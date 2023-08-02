import { PbdsDaterangeLocale } from './daterange-popover.interfaces';
import * as i0 from "@angular/core";
export declare class PbdsDaterangeService {
    private localeId;
    private locale;
    constructor(localeId: string);
    setLocale(locale: PbdsDaterangeLocale): void;
    getCurrentLocale(): string;
    openPopover(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PbdsDaterangeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PbdsDaterangeService>;
}
