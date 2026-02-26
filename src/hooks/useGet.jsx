import { useState, useEffect } from 'react';

function useGet(url) {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const token = 'eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJjYXNJRCI6IjIwMjUwMDU1MDI4NyIsIm5hbWUiOiLnjovmgJ3nm4giLCJleHAiOjE3NzIxMDE4MjB9.lj9sQ0IHKq6v8WuA0u-bIMVJvQXW-OSgmWQQpdcP3I0'

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