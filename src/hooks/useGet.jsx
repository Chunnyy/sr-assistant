import { useState, useEffect } from 'react';
import { getToken } from '../globalToken';

function useGet(url) {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    // globally-shared token
    const token = getToken();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    throw Error('could not fetch the data for the resource');
                }
                const data = await res.json();
                setData(data);
                setIsPending(false);
                setError(null);
            } catch (err) {
                setIsPending(false);
                setError(err.message);
            }
        };
        fetchData();
    }, [url]);

    return { data, isPending, error };
}

export default useGet;