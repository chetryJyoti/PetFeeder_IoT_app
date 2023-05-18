import { Injectable } from '@angular/core';
import { Client, Storage } from 'appwrite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  private client: Client;
  private storage: Storage;

  constructor() {
    this.client = new Client();
    this.storage = new Storage(this.client);

    this.client
      .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
      .setProject(environment.PROJECT_ID) // Your project ID
  }

  getAllImages(bucketId: string): Promise<any> {
    return this.storage.listFiles(bucketId);
  }
}
