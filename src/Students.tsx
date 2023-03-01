import { faCircleMinus } from '@fortawesome/free-solid-svg-icons/faCircleMinus';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faPersonWalking } from '@fortawesome/free-solid-svg-icons/faPersonWalking';
import { faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons/faPersonWalkingArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 } from 'uuid';
import { app } from './index';
import { Student, useAuthUser, useStudents, Watching } from './types';

interface Props {
    students: Student[];
    remove?: boolean;
    action: (student: Student) => void;
}

function StudentList({
    students,
    remove,
    action,
}: Props) {
    const [term, setTerm] = useState('');

    return (
        <div className='student-list'>
            <input
                type='text'
                value={term}
                onChange={e => setTerm(e.target.value)}
                placeholder='Search...'
            />

            <table className='students'>
                {
                    students
                        .filter(e => e.name.toLowerCase().includes(term.toLowerCase()))
                        .map(student => (
                            <tr
                                className='student'
                                key={student.id}
                            >
                                <td className='name'>
                                    {student.name}
                                </td>

                                <td className='status'>
                                    <FontAwesomeIcon
                                        className={
                                            student.arrivedAt ?
                                                student.leftAt ?
                                                    'left' :
                                                    'arrived' :
                                                'waiting'
                                        }
                                        icon={
                                            student.arrivedAt ?
                                                student.leftAt ?
                                                    faPersonWalkingArrowRight :
                                                    faPersonWalking :
                                                faClock
                                        }
                                    />
                                </td>

                                <td className='action'>
                                    <button onClick={() => action(student)}>
                                        <FontAwesomeIcon icon={remove ? faCircleMinus : faCirclePlus} />
                                    </button>
                                </td>
                            </tr>
                        ))
                }
            </table>
        </div>
    );
}

export default function Students() {
    const [
        signIn,
        allTeachers,
        user,
        authUser,
        watching,
    ] = useAuthUser();
    const students = useStudents();

    const watched = students.filter(e => watching?.some(q => q.student === e.id));
    const unwatched = students.filter(e => !watching?.some(q => q.student === e.id));
    const unwatchStudent = useCallback((student: Student) => {
            const db = getFirestore(app);
            deleteDoc(doc(db, 'watching', watching!.find(e => e.student === student.id)!.id));
        },
        [
            user,
            watching,
        ],
    );

    const watchStudent = useCallback((student: Student) => {
            const db = getFirestore(app);
            const id = v4();
            setDoc(doc(db, 'watching', id), {
                id,
                teacher: user?.id,
                student: student.id,
            } as Watching);
        },
        [
            user,
            watching,
        ],
    );

    return (
        <div className='students'>
            <Link to='/'>&lt; Back</Link>

            <h1>Students</h1>

            <h2>My students</h2>
            <StudentList
                students={watched}
                action={unwatchStudent}
                remove
            />

            <hr />

            <h2>All students</h2>
            <StudentList
                students={unwatched}
                action={watchStudent}
            />
        </div>
    );
}