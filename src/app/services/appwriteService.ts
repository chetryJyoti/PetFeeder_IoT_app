import { Injectable } from '@angular/core';
import { Client, Storage,Databases } from 'appwrite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  private client: Client;
  private storage: Storage;
  private databases: Databases;

  constructor() {
    this.client = new Client();
    this.storage = new Storage(this.client);
    this.databases = new Databases(this.client);

    this.client
      .setEndpoint(environment.ENDPOINT) // Your API Endpoint
      .setProject(environment.PROJECT_ID) // Your project ID
  }

  getAllImages(bucketId: string): Promise<any> {
    return this.storage.listFiles(bucketId);
  }
  updateDocument(databaseId: string, collectionId: string, documentId: string, updatedData:any): Promise<any> {
    return this.databases.updateDocument(databaseId, collectionId, documentId, updatedData);
  }

  listDocuments(databaseId: string, collectionId: string): Promise<any> {
    return this.databases.listDocuments(databaseId, collectionId);
  }
  deleteImage(bucketId: string, fileId: string): Promise<any> {
    return this.storage.deleteFile(bucketId, fileId);
  }

}
