import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { app } from './index';
import { Room, Teacher } from './types';

const data = `General\tkerecsenyig-y17@mgs.org\totter\torange\torange-otter`
    .split('\n')
    .map(e => e.split('\t'));

export async function initUsers() {
    console.log('starting');
    const auth = getAuth(app);
    const db = getFirestore(app);

    for (const user of data) {
        console.log('going');
        const userCredential = await createUserWithEmailAndPassword(auth, user[1], user[4]);
        const userData = userCredential.user;

        await setDoc(doc(db, 'teachers', userData.uid), {
            name: user[0],
            room: Room.Unknown,
            email: user[1],
            canRegister: false,
            id: userData.uid,
            hasArrived: false,
            color: user[3],
            animal: user[2],
        } as Teacher);
    }

}