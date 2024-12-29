import { Injectable } from '@nestjs/common';

import * as path from 'path';
import * as admin from 'firebase-admin';
@Injectable()
export class FirebaseService {
  private db: FirebaseFirestore.Firestore;
  constructor() {
    const serviceAccount = path.resolve(__dirname, '../../../firebase.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.db = admin.firestore();
  }

  getFireStoreInstance(){
    return this.db;
  }
}
