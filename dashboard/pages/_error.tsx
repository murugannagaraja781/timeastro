import { NextPageContext } from 'next';

export default function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">
        {statusCode ? `Error ${statusCode}` : 'An unexpected error occurred'}
      </h1>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};
