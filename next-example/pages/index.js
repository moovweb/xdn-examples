import Head from 'next/head';
import { useTranslation } from '../i18n';

const langs = ['en', 'hu'];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const other = langs[langs.indexOf(current) ^ 1];
  return (
    <button onClick={() => i18n.changeLanguage(other)}>
      Switch from <b>{current}</b> to <b>{other}</b>
    </button>
  );
}

const Home = ({ name }) => {
  const { t } = useTranslation();
  return (
    <div className="container">
      <Head>
        <title>International</title>
      </Head>
      <main>
        <h1 className="title">{t('title')}</h1>
        <p className="description">{t('welcome', { name })}</p>
        <code>
          <LanguageSwitcher />
        </code>
      </main>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

Home.getInitialProps = async ({ query }) => {
  const { name = 'anonymous' } = query;
  return {
    name,
    namespacesRequired: ['common'],
  };
};

export default Home;
