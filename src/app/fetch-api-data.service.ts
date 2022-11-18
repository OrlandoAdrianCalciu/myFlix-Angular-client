import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://top-movies-api.herokuapp.com/';

const token = localStorage.getItem('token');


@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
  // Making the api call for the user registration endpoint
  /**
   * @service POST to an API endpoint to register new users
   * @param {any} userData 
   * @returns a new user
   * @function userRegistration
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @service POST to an API endpoint to login a user
   * @param {any} userData
   * @returns a user object
   * @function userLogin
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @service GET to an API endpoint to get all movies
   * @returns an array of all movies
   * @function getAllMovies
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @service GET to an API endpoint to get a movie by title
   * @param {string} Title
   * @returns an array of movie objects
   * @function getMovie
   */
  public getMovie(Title: any): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.get(apiUrl + `movies/${Title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http
      .get(`${apiUrl}users/${user}/movies`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @service GET to an API endpoint to get director info
   * @param {string} director
   * @returns a an array of movie objects
   * @function getDirector
   */
  public getDirector(directorName: any): Observable<any> {
    return this.http.get(apiUrl + `movies/director/${directorName}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @service GET to an API endpoint to get genre info
   * @param {string} genre
   * @returns a an array of movie objects 
   * @function getGenre
   */
  public getGenre(genreName: any): Observable<any> {
    return this.http.get(apiUrl + `movies/genre/${genreName}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

   /**
   * @service GET to an API endpoint to get a specific user
   * @returns a user object in json format
   * @function getUser
   */
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    console.log(localStorage.getItem('user'));

    return this.http.get(`${apiUrl}users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @service POST to an API endpoint to add a movie to a user's favorites list
   * @returns a user object in json format
   * @function addFavorite
   */
  public addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    return this.http.post(apiUrl + `users/${username}/movies/${movieID}`, null, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @service PUT to an API endpoint to update a user's details
   * @returns a user object in json format
   * @function editUser
   */
  public editUser(updateDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http.put(apiUrl + `users/${username}`, updateDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    })
  }

   /**
   * @service DELETE to an API endpoint to remove a movie from a user's favorites list
   * @returns a user object in json format
   * @function addFavorite
   */
  public removeFavoriteMovie(movieID: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http.delete(apiUrl + `users/${username}/movies/${movieID}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * @service DELETE to an API endpoint to delete a user
   * @returns success message
   * @function deleteUser
   */
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    return this.http.delete(apiUrl + `users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}

