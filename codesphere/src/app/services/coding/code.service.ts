import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  private apiUrl = 'https://judge0-ce.p.rapidapi.com'; // URL của Judge0 API
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': '7c3b9e1dd3msha739f59f588420cp19f79fjsn8e8f31ca21e9', // Thay thế bằng API key của bạn
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
  });

  constructor(private httpClient: HttpClient) { }

  submitCode(language_id: number, source_code: string, stdin: string = ''): Observable<any> {
    const body = {
      language_id: language_id,
      source_code: btoa(source_code), // encode b64
      stdin: btoa(stdin) // encode b64
    };

    // them params api docs
    const params = new HttpParams().set('base64_encoded', 'true');

    return this.httpClient.post(`${this.apiUrl}/submissions`, body, { 
      headers: this.headers,
      params: params
    });
  }

  getSubmission(token: string): Observable<any> {
    console.log("token:", token)
    const params = new HttpParams()
      .set('base64_encoded', 'true')
      .set('fields', '*');

    return this.httpClient.get(`${this.apiUrl}/submissions/${token}`, { 
      headers: this.headers,
      params: params
    });
  }

  getLanguageId(language: string): number {
    const languageMap = {
      'java': 62,
      'python': 71,
      'javascript': 63,
      'c': 50,
      'cpp': 54,
      'csharp': 51
    };
    
    return languageMap[language.toLowerCase() as keyof typeof languageMap] || 62;
  }
}
