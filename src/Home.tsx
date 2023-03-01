import { faHorse } from '@fortawesome/free-solid-svg-icons';
import { faDog } from '@fortawesome/free-solid-svg-icons/faDog';
import { faFish } from '@fortawesome/free-solid-svg-icons/faFish';
import { faFrog } from '@fortawesome/free-solid-svg-icons/faFrog';
import { faHippo } from '@fortawesome/free-solid-svg-icons/faHippo';
import { faOtter } from '@fortawesome/free-solid-svg-icons/faOtter';
import { faShrimp } from '@fortawesome/free-solid-svg-icons/faShrimp';
import { faTree } from '@fortawesome/free-solid-svg-icons/faTree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { initUsers } from './init';
import { Animal, Color, Teacher, useAuthUser } from './types';

const iconLookup = {
    hippo: faHippo,
    fish: faFish,
    frog: faFrog,
    dog: faDog,
    horse: faHorse,
    shrimp: faShrimp,
    otter: faOtter,
    tree: faTree,
};

export default function Home() {
    const [signIn, allTeachers, user, , , signOut] = useAuthUser();

    const [teacherName, setTeacherName] = useState('');
    const [teacher, setTeacher] = useState<string | null>(null);

    const options = useMemo((): [Color, Animal][] | null => {
        const targetTeacher = allTeachers?.find(t => t.id === teacher);
        if (targetTeacher) {
            const targetOption = Math.floor(Math.random() * 6);
            const options = Array(6)
                .fill(0)
                .map(() => 0)
                .reduce((a, q, i) => {
                    let choice: [Color, Animal];
                    do {
                        choice = (
                            i === targetOption ? [
                                targetTeacher.color,
                                targetTeacher.animal,
                            ] : [
                                [
                                    Color.Red,
                                    Color.Green,
                                    Color.Blue,
                                    Color.Orange,
                                    Color.Yellow,
                                    Color.White,
                                ][Math.floor(Math.random() * 6)],
                                [
                                    Animal.Tree,
                                    Animal.Fish,
                                    Animal.Frog,
                                    Animal.Dog,
                                    Animal.Horse,
                                    Animal.Hippo,
                                    Animal.Shrimp,
                                    Animal.Otter,
                                ][Math.floor(Math.random() * 8)],
                            ]
                        ) as [Color, Animal];
                    } while (a.some(e => choice && e[0] === choice[0] && e[1] === choice[1]));

                    return [
                        ...a,
                        choice,
                    ];
                }, [] as [Color, Animal][]);

            if (!options.some(t => t[0] === targetTeacher.color && t[1] === targetTeacher.animal)) {
                options[Math.floor(Math.random() * 6)] = [
                    targetTeacher.color,
                    targetTeacher.animal,
                ];
            }

            return options;
        }

        return null;
    }, [teacher]);

    const validateOption = useCallback(
        (option: [Color, Animal]) => {
            // initUsers();

            const targetTeacher = allTeachers?.find(t => t.id === teacher);
            if (targetTeacher) {
                if (targetTeacher.animal === option[1] && targetTeacher.color === option[0]) {
                    signIn(teacherName);
                } else {
                    resetForm();
                }
            } else {
                resetForm();
            }
        },
        [
            teacher,
            teacherName,
        ],
    );

    const resetForm = useCallback(() => {
        setTeacher(null);
        setTeacherName('');
    }, []);

    const overrideTeacher = useCallback((teacher: Teacher) => {
        setTeacher(teacher.id);
        setTeacherName(teacher.name);
    }, []);

    if (!user) {
        return (
            <div className='sign-in-prompt'>
                {
                    teacher ? (
                        <>
                            <button
                                className='link-button'
                                onClick={resetForm}
                            >
                                &lt; {teacherName}
                            </button>

                            <div className='pw-options'>
                                {
                                    options?.map(option => (
                                        <button
                                            key={`${option[0]} ${option[1]}`}
                                            className={`option-button ${option[0]} ${option[1]}`}
                                            onClick={() => validateOption(option)}
                                        >
                                            <FontAwesomeIcon icon={iconLookup[option[1]]} />
                                        </button>
                                    ))
                                }
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                type='text'
                                value={teacherName}
                                onChange={e => setTeacherName(e.target.value)}
                                placeholder='Start typing your name...'
                            />

                            <div className='options'>
                                {
                                    allTeachers
                                        ?.filter(teacher =>
                                            teacherName.trim().length &&
                                            teacher
                                                .name
                                                .toLowerCase()
                                                .includes(teacherName.toLowerCase().trim()),
                                        )
                                        .map(teacher => (
                                            <button
                                                key={teacher.id}
                                                className='teacher-option'
                                                onClick={() => overrideTeacher(teacher)}
                                            >
                                                {teacher.name}
                                            </button>
                                        ))
                                }
                            </div>
                        </>
                    )
                }
            </div>
        );
    }

    return (
        <div className='home'>
            <h2>Hi, {user.name}!</h2>

            <Link to='/drinks'>
                My drink selection
            </Link>

            <Link to='/students'>
                Students
            </Link>

            <button onClick={signOut} className='link-button'>
                Sign out
            </button>
        </div>
    );
}