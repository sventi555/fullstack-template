'use client';

import { useGetGreetings } from '@/api.gen';

export default function Home() {
  const { data: greeting } = useGetGreetings({ name: 'World' });

  return <div>{greeting?.data ?? '...'}</div>;
}
