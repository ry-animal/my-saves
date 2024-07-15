/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextPage, NextPageContext } from 'next';

interface ErrorPageProps {
  statusCode?: number;
}

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        {statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}
      </h1>
      <p>We apologize for the inconvenience. Please try again later.</p>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
