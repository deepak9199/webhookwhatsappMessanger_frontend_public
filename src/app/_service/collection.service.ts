import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getData(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentById(collectionName: string, documentId: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(documentId).valueChanges();
  }

  // Function to add a document to a Firestore collection
  addDocumnet(collectionName: string, data: any): Observable<any> {
    return new Observable<any>(observer => {
      this.firestore.collection(collectionName).add(data)
        .then(docRef => {
          observer.next(docRef);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  deleteDocument(collectionName: string, docId: string): Observable<void> {
    return new Observable<void>(observer => {
      this.firestore.collection(collectionName).doc(docId).delete()
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  updateDocument(collectionName: string, docId: string, data: any): Observable<void> {
    return new Observable<void>(observer => {
      this.firestore.collection(collectionName).doc(docId).update(data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  uploadFile(file: File, path: string): Observable<number | null | undefined> {
    const filePath = path + '/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = this.storage.upload(filePath, file);

    // Return an observable to track upload progress
    return task.percentageChanges();
  }
  deleteFile(fileUrl: string): Observable<void> {
    const fileRef = this.storage.refFromURL(fileUrl); // Get reference from URL
    return fileRef.delete();
  }
  getDownloadUrl(filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

}
