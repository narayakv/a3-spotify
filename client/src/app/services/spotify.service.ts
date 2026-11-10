import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    // create the URL by concatinating the base URL and endpoint.
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    // constructs the endpoint
    var endpoint:string = '/search/' + category + '/' + encodeURIComponent(resource);

    // make the http request
    return this.sendRequestToExpress(endpoint).then((data) => {
      if (category == 'artist') {
        // loop through the array and create a new ArtistData object for each artist
        return data.artists.items.map((artist:any) => new ArtistData(artist));
      }
      else if (category == 'album') {
        // loop through the array and create a new AlbumData object for each album
        return data.albums.items.map((album:any) => new AlbumData(album));
      }
      else if (category == 'track') {
        // loop through the array and create a new TrackData object for each track
        return data.tracks.items.map((track:any) => new TrackData(track));
      }

      // if the category doesn't fit any of these above, return an emtpy array
      return [];
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    // create the endpoint for the artist URL
    var endpoint:string = '/artist/' + encodeURIComponent(artistId);

    // use the aboutMe format to send a request, and parse the data in the returned promise
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new ArtistData(data);
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    // create the endpoint for the tracks URL
    var endpoint:string = '/artist-top-tracks/' + encodeURIComponent(artistId);

    // requests the artist's top tracks and convert each track into a TrackData obkect
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.tracks.map((track:any) => new TrackData(track));
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    // create the endpoint for the atrist's albums URL
    var endpoint:string = '/artist-albums/' + encodeURIComponent(artistId);

    // requests the artist's albums and convert each album into a AlbumData obkect
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.items.map((album:any) => new AlbumData(album));
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    // create the endpoint for the album URL
    var endpoint:string = '/album/' + encodeURIComponent(albumId);

    // use the aboutMe format to send a request, and parse the data in the returned promise
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    // create the endpoint for the atrist's albums URL
    var endpoint:string = '/album-tracks/' + encodeURIComponent(albumId);

    // requests the album's tracks and convert each album into a TrackData obkect
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.items.map((track:any) => new TrackData(track));
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    // create the endpoint for the track URL
    var endpoint:string = '/track/' + encodeURIComponent(trackId);

    // use the aboutMe format to send a request, and parse the data in the returned promise
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new TrackData(data);
    });
  }
}