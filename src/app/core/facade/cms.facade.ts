import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CmsFacade {
    private cmsUrl = 'assets/data/cms.json';

    constructor(private http: HttpClient) {}

    getProductsCms$() {
        return this.http.get(this.cmsUrl);
    }
}