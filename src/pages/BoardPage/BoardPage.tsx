import s from './BoardPage.module.css'
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth.ts';

function BoardPage() {

    const [boards, setBoards] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)



    useEffect(() => {
        const getData = async () => {

            const { user } = useAuth();
            const {data, error} = await supabase
                                        .from('boards')
                                        .select('*')
                                        .eq('user_id', user?.id);

            if(error){
                console.log('Error fetching', error)
            }
            else {
                setBoards(data);
                setLoading(false);
            }
        }

        setLoading(true)

        getData();
    }, [])

    return (
        <>
            {loading && <p>Loading...</p>}

            <main>
                {boards.map( (b: any) => (
                    <div key={b.id} className={s.card}>
                        <h1> {b.title} </h1>
                        <p> {b.createAt} </p>
                    </div>
                ))}
            </main>
        </>
    )
}

export default BoardPage;