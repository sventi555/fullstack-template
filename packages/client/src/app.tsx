import { useEffect, useState } from 'react';
import { getAPIClient } from './api/client';

export const App: React.FC = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    getAPIClient()
      .GET('/example', { params: { query: { name: 'World' } } })
      .then((res) => {
        if (res.data) {
          setGreeting(res.data);
        }
      });
  }, []);

  return <p className="text-xl">{greeting}</p>;
};
