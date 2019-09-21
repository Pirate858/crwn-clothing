import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyB4qy-4sL2AwY-brEBAKvl-B0jR98ZaQ_o",
    authDomain: "crwn-db-40b72.firebaseapp.com",
    databaseURL: "https://crwn-db-40b72.firebaseio.com",
    projectId: "crwn-db-40b72",
    storageBucket: "",
    messagingSenderId: "292105923159",
    appId: "1:292105923159:web:04dcda2b16dae7ab"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};

export const addCollectionAndDocuments=async (collectionKey,objectsToAdd)=>{
    const collectionRef=firestore.collection(collectionKey);

    const batch=firestore.batch();
    objectsToAdd.forEach(obj=>{
        const newDocRef=collectionRef.doc();
        batch.set(newDocRef,obj);
    });
    return await batch.commit();

};

export const convertCollectionSnapshotToMap=(collections)=>{
    const transfromedCollection=collections.docs.map(doc=>{
        const{title,items}=doc.data();

        return{
            routeName:encodeURI((title).toLowerCase()),
            id:doc.id,
            title,
            items
        }
    });
    return transfromedCollection.reduce((accumulator,collection)=>{
        accumulator[collection.title.toLowerCase()]=collection;
        return accumulator;
    },{}); 
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
