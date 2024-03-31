import { GetExampleReturn } from 'lib';
import { useEffect, useState } from 'react';
import config from './config';

export const App: React.FC = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetch(`${config.apiHost}/example?name=World`)
      .then<GetExampleReturn>((res) => res.json())
      .then((res) => {
        setGreeting(res);
      });
  }, []);

  return <p className="text-xl">{greeting}</p>;
};
