import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Reddiit is a network of communities where people can dive into their interests, hobbies and passions. There's a community for whatever you're interested in on Reddiit."
          />
          <meta property="og:title" content="reddiit" />
          <meta property="twitter:title" content="reddiit" />
          <meta property="og:site_name" content="reddiit" />
          <meta property="og:type" content="website" />
          <link
            rel="shortcut icon"
            href="/images/reddit-logo.svg"
            type="image/x-icon"
          />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
            integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>
        <body className="bg-reddit-100 font-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
