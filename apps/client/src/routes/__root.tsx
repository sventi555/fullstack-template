import { createRootRoute } from '@tanstack/react-router';
import { name } from 'lib';
import { useGetGreetings } from '../api.gen';

const App: React.FC = () => {
  const { data: greeting } = useGetGreetings({ name });

  return <div className="text-xl">{greeting?.data ?? '...'}</div>;
};

export const Route = createRootRoute({
  component: App,
});
