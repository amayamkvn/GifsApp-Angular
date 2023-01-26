import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'fJ7EKQnpUDMt08VLTdsoil2PjqCGUHuJ';
  private url: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor( private _http: HttpClient ){
      this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
      this.resultados = JSON.parse(localStorage.getItem('images')!) || [];
  }

  //Busqueda de Gifs e insertarlos en un array
  buscarGifs( query: string ){
    if( query.trim().length === 0){
      console.log('Esta ingresando un valor vacio');
      
    }else{
      query = query.trim().toLowerCase();

      if( !this._historial.includes( query )){
        this._historial.unshift( query );
      }

      this._historial = this._historial.splice(0,10);
      console.log( this._historial );

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('limit', '7')
      .set('q', query)

    console.log(params.toString());
    

    // Peticion HTTP
    this._http.get<SearchGifsResponse>(`${this.url}/search`, { params })
      .subscribe( ( response ) => {
        this.resultados = response.data;
        console.log( this.resultados );
        localStorage.setItem('images', JSON.stringify(this.resultados));
      });
  }

}
