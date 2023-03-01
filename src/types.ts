import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { collection, doc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { app } from './index';

export interface Student {
    name: string;
    arrivedAt?: Date;
    leftAt?: Date;
    id: string;
}

export enum Room {
    MemHall,
    Refectory,
    ArtDisplay,
    Gym,
    Other,
    Unknown,
}

export enum Color {
    Red = 'red',
    Blue = 'blue',
    Green = 'green',
    Orange = 'orange',
    Yellow = 'yellow',
    White = 'white',
}

export enum Animal {
    Hippo = 'hippo',
    Fish = 'fish',
    Frog = 'frog',
    Dog = 'dog',
    Horse = 'horse',
    Shrimp = 'shrimp',
    Tree = 'tree',
    Otter = 'otter',
}

export enum DrinkType {
    Coffee='coffee',
    Tea='tea',
    Water='water',
}

export interface Drink {
    type: DrinkType;
    hasMilk: number;
    hasSugar: number;
    comments: string;
}

export interface Teacher {
    name: string;
    room: Room;
    email: string;
    canRegister: boolean;
    id: string;
    hasArrived: boolean;
    color: Color;
    animal: Animal;
    drinkPreference?: Drink;
}

export interface Watching {
    teacher: string;
    student: string;
    id: string;
}

export function useAuthUser(): [(name: string) => boolean, Teacher[] | null, Teacher | null, User | null, Watching[] | null, () => void] {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [user, setUser] = useState<Teacher | null>(null);
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [watching, setWatching] = useState<Watching[] | null>(null);

    const allTeachers = useRef<Teacher[] | null>(null);

    const clearListener = useRef<(() => void) | null>(null);
    useEffect(() => {
        getDocs(collection(db, 'teachers'))
            .then(docs => docs.docs.map(doc => doc.data()))
            .then(docs => {
                allTeachers.current = docs as Teacher[];
            })
            .then(() => {
                onAuthStateChanged(auth, (user) => {
                    if (clearListener.current) {
                        clearListener.current();
                    }

                    if (user) {
                        setAuthUser(user);

                        const target = allTeachers.current?.filter(teacher => teacher.id === user.uid)[0];
                        let userListener: () => void;
                        if (target) {
                            setUser(target);
                            userListener = onSnapshot(
                                doc(db, 'teachers', target.id),
                                (q) => {
                                    setUser(q.data() as Teacher);
                                },
                            );
                        }

                        const watchingListener = onSnapshot(
                            query(collection(db, 'watching'), where('teacher', '==', user.uid)),
                            (q) => {
                                setWatching(q.docs.map(e => e.data() as Watching));
                            },
                        );

                        clearListener.current = () => {
                            watchingListener();
                            userListener && userListener();
                        };
                    } else {
                        setAuthUser(null);
                        setUser(null);
                        setWatching(null);
                    }
                });
            });

        return clearListener.current || (() => 0);
    }, []);

    const signIn = useCallback((name: string) => {
        const target = allTeachers.current?.filter(teacher => teacher.name === name)[0];

        if (target) {
            // signInWithEmailAndPassword(auth, target.email, `red-zebra`);
            signInWithEmailAndPassword(auth, target.email, `${target.color}-${target.animal}`);
            setUser(target);

            return true;
        }

        return false;
    }, [allTeachers]);

    const signOutFunc = useCallback(() => {
        signOut(auth);
    }, []);

    return [
        signIn,
        allTeachers.current,
        user,
        authUser,
        watching,
        signOutFunc,
    ];
}

export function useStudents(): Student[] {
    const [students, setStudents] = useState<Student[]>([]);
    const db = getFirestore(app);

    useEffect(() => {
        return onSnapshot(collection(db, 'students'), (q) => {
            setStudents(q.docs.map(e => e.data() as Student));
        });
    }, []);

    return students;
}