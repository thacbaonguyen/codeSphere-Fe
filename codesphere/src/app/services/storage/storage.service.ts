import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../../models/api-response";
import {Storage} from "../../models/storage";
import {saveAs} from "file-saver";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  upload(code: string, formData: FormData){
    return this.httpClient.post(this.url + `/exercise/solution-storage/upload/${code}`, formData)
  }

  getAll(code: string): Observable<ApiResponse<Storage>>{
    return this.httpClient.get<ApiResponse<Storage>>(this.url + `/exercise/solution-storage/all/${code}`)
  }

  deleteStorage(id: number){
    return this.httpClient.delete(this.url + `/exercise/solution-storage/delete/${id}`)
  }

  viewStorage(filename: string){
    let params = new HttpParams();
    if (filename){
      params = params.set("filename", filename)
    }
    return this.httpClient.get(this.url + "/exercise/solution-storage/view", {params})
  }

  downloadFile(filename: string): Observable<Blob>{
    return this.httpClient.get(this.url + `/exercise/solution-storage/files/download/${filename}`, {
      responseType: 'blob',
      observe: 'body'
    })
  }

  saveFile(blob: Blob, fileName: string){
    saveAs(blob, fileName)
  }

}
