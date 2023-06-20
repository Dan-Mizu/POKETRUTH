import { FirebaseError } from 'firebase/app';
import { child, DataSnapshot, get, getDatabase, ref } from 'firebase/database';

// get config
import firebase_app from './config';

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(firebase_app);

// get last 7 streams from database
export async function getLastStreamsData(
  path: string
): Promise<object | Array<unknown> | string | number | boolean | null> {
  // init value
  let key: object | Array<unknown> | string | number | boolean | null = null;

  // get reference
  const dbRef = ref(database);

  // get data
  await get(child(dbRef, path))
    .then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        key = snapshot.val();
      } else {
        key = null;
      }
    })
    .catch((_error: FirebaseError) => {
      key = null;
    });

  return key;
}
