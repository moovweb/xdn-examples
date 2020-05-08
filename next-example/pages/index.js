import Head from 'next/head';
import { withTranslation, i18n } from '../i18n';

const Home = ({ t, lang, name }) => {
  function Lang(props) {
    if (lang === props.lang) {
      return (
        <span
          style={{
            fontWeight: 'bold',
          }}
        >
          {props.lang}
        </span>
      );
    }
    return (
      <a
        onClick={() => i18n.changeLanguage(props.lang)}
        style={{
          textDecoration: 'none',
        }}
      >
        {props.lang}
      </a>
    );
  }
  return (
    <div className="container">
      <Head>
        <title>International</title>
      </Head>
      <main>
        <h1 className="title">{t('title')}</h1>
        <p className="description">{t('welcome', { name })}</p>
        <code>
          <Lang lang="en" />|<Lang lang="hu" />
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

Home.getInitialProps = async ({ req }) => {
  const lang = req ? req.language : i18n.language;
  return {
    lang,
    name: (req && req.query.name) || 'anonymous',
  };
};

export default withTranslation('common')(Home);
