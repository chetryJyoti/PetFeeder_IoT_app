import { Injectable } from '@angular/core';
import { Client, Storage, Databases, Account, ID } from 'appwrite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppwriteService {
  private account: Account;
  private client: Client;
  private storage: Storage;
  private databases: Databases;

  constructor() {
    this.client = new Client();
    this.storage = new Storage(this.client);
    this.databases = new Databases(this.client);
    this.account = new Account(this.client);
    this.client
      .setEndpoint(environment.ENDPOINT) // Your API Endpoint
      .setProject(environment.PROJECT_ID); // Your project ID
  }

  //for auth
  signup(email: string, password: string, name: string): Promise<any> {
    const promise = this.account.create(ID.unique(), email, password, name)
      .catch((error) => {
        // Handle the error here
        console.error('Signup failed:', error.message);
        // Throw the error again to propagate it to the caller
        throw error.message;
      });

    return promise;
  }

  // Login function
  login(email: string, password: string): Promise<any> {
    const promise = this.account.createEmailSession(email, password);
    console.log('login:', promise);
    return promise;
  }
  getCurrentLogInUser() {
    return this.account.get();
  }

  getAllImages(bucketId: string): Promise<any> {
    return this.storage.listFiles(bucketId);
  }
  updateDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    updatedData: any
  ): Promise<any> {
    return this.databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      updatedData
    );
  }

  listDocuments(databaseId: string, collectionId: string): Promise<any> {
    return this.databases.listDocuments(databaseId, collectionId);
  }
  deleteImage(bucketId: string, fileId: string): Promise<any> {
    return this.storage.deleteFile(bucketId, fileId);
  }
}
