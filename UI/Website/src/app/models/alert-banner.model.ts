export class AlertBanner {
    type: AlertBannerType;
    typeName: string;
    message: string;
    cssClass: string;
    cssIconClass: string;
    keepAfterRouteChange: boolean;

    constructor(init?: Partial<AlertBanner>) {
        Object.assign(this, init);
    }
}

export enum AlertBannerType {
    Success,
    Error,
    Info,
    Warning,
    Miscellaneous
}
