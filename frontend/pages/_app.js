import '../styles/globals.css';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      {({ userId, users }) => (
        <Component {...pageProps} userId={userId} users={users} />
      )}
    </Layout>
  );
}
