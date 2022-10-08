import { ClassifyRequestModel } from './../models/classify.request';
import { Injectable } from '@angular/core';
import { HttpClientService } from '../../general/services/http-client.service';
import { GeneralParamsService, ServicesType } from '../../general/services/general-params.service';
import { TransferStyleRequestModel } from '../models/transfer-style.request';


@Injectable({
    providedIn: 'root'
})
export class TransferStyleHttpService {

    constructor(private http: HttpClientService, private general: GeneralParamsService) { }

    public transferStyle(request: TransferStyleRequestModel, name: string): Promise<any> {
        return this.http.request('post', this.general.getUrl(`/transfer-style?name=${name}`, ServicesType.STYLE_TRANSFER), request)!.toPromise();
    }

    public transferStyleByName(from_name: string, name: string): Promise<any> {
        return this.http.request('get', this.general.getUrl(`/transfer-style-by-name?name=${name}&from_name=${from_name}`, ServicesType.STYLE_TRANSFER), null)!.toPromise();
    }

    public classify(request: ClassifyRequestModel): Promise<any> {
        return this.http.request('post', this.general.getUrl(`/classify`, ServicesType.STYLE_TRANSFER), request)!.toPromise();
    }

    public classifyByName(name: string): Promise<any> {
        return this.http.request('get', this.general.getUrl(`/classifyByName?name=${name}`, ServicesType.STYLE_TRANSFER), null)!.toPromise();
    }
}