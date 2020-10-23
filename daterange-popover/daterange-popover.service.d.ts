import { PbdsDaterangeLocale } from './daterange-popover.interfaces';
export declare class PbdsDaterangeService {
    private localeId;
    private locale;
    constructor(localeId: string);
    setLocale(locale: PbdsDaterangeLocale): void;
    getCurrentLocale(): string;
}
