import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/api/firebase/firebase.service';

@Injectable()
export class UsersService {
  constructor(private firebaseService: FirebaseService) {}

  async getUserDetail(id:string){
    const docRef = await this.firebaseService.getFireStoreInstance().collection('users').doc(id).get();
    return docRef.data()
  }

  async getAllUser(){
    const fireStore = this.firebaseService.getFireStoreInstance();
    const collection = await fireStore.collection('users').get();
    collection.forEach((doc)=>{
        console.log(doc.data())
    })
  }
}
