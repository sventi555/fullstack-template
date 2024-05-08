import { useEffect, useState } from 'react';
import { getExample } from './api/example';

export const App: React.FC = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    getExample({ name: 'world' }).then((res) => {
      setGreeting(res);
    });
  }, []);

  return <p className="text-xl">{greeting}</p>;
};
