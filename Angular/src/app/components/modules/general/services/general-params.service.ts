import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GeneralParamsService {
    public static STYLE_TRANSFER_API = '/api';

    public getUrl(url: string, type: ServicesType): string {
        return GeneralParamsService.apiAddress() + this.getServiceTypeUrl(type) + url;
    }

    getServiceTypeUrl(serviceType: ServicesType): string | undefined {
        switch (serviceType) {
            case ServicesType.STYLE_TRANSFER: { return GeneralParamsService.STYLE_TRANSFER_API; }
            default: { }
        }

        return;
    }

    public static apiAddress() {
        // if (location.origin.includes('localhost')) {
        //     return 'http://127.0.0.1:5000';
        // }
        return location.origin; // "https://datascience.voyager.pl"; // 
    }

}

export enum ServicesType {
    STYLE_TRANSFER
}
