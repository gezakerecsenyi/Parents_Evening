import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { app } from './index';
import { DrinkType, Teacher, useAuthUser } from './types';

export default function Drinks() {
    const [, , user] = useAuthUser();

    const setDrink = useCallback((type: DrinkType, hasMilk: number, hasSugar: number, comments: string) => {
        if (!user) return;

        const db = getFirestore(app);
        updateDoc(doc(db, 'teachers', user.id), {
            drinkPreference: {
                type,
                hasMilk,
                hasSugar,
                comments,
            },
        } as Partial<Teacher>);
    }, [user]);

    const p = user?.drinkPreference;

    return (
        <div className='drinks'>
            <Link to='/'>&lt; Back</Link>

            <h1>Drink selection</h1>

            {
                p ? (
                    <div className='drink-preference'>
                        <label htmlFor='drink-type'>
                            Drink type

                            <select
                                id='drink-type'
                                value={p.type}
                                onChange={(e) => setDrink(
                                    e.target.value as DrinkType,
                                    p!.hasMilk,
                                    p!.hasSugar,
                                    p!.comments,
                                )}
                            >
                                <option value='coffee'>Coffee</option>
                                <option value='tea'>Tea</option>
                                <option value='water'>Water</option>
                            </select>
                        </label>

                        {
                            p.type !== DrinkType.Water && (
                                <>
                                    <label htmlFor='milk'>
                                        Milk?

                                        <input
                                            type='range'
                                            min={0}
                                            max={5}
                                            step={1}
                                            value={p.hasMilk}
                                            onChange={(e) => setDrink(
                                                p!.type,
                                                e.target.valueAsNumber,
                                                p!.hasSugar,
                                                p!.comments,
                                            )}
                                        />
                                    </label>

                                    <label htmlFor='sugar'>
                                        Sugar?

                                        <input
                                            type='range'
                                            min={0}
                                            max={5}
                                            step={1}
                                            value={p.hasSugar}
                                            onChange={(e) => setDrink(
                                                p!.type,
                                                p!.hasMilk,
                                                e.target.valueAsNumber,
                                                p!.comments,
                                            )}
                                        />
                                    </label>

                                    <label htmlFor='comments'>
                                        Enter any further comments/requirements here

                                        <textarea
                                            value={p.comments}
                                            onChange={(e) => setDrink(
                                                p!.type,
                                                p!.hasMilk,
                                                p!.hasSugar,
                                                e.target.value,
                                            )}
                                        />
                                    </label>
                                </>
                            )
                        }
                    </div>
                ) : (
                    <div className='none'>
                        <h3>No drink selected.</h3>

                        <button
                            onClick={() => setDrink(DrinkType.Coffee, 2, 1, '')}
                            className='link-button'
                        >
                            Start customising!
                        </button>
                    </div>
                )
            }
        </div>
    );
}