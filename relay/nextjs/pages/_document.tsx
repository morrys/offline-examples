import Document, {Head, Main, NextScript} from 'next/document';
import styled, {createGlobalStyle, ServerStyleSheet} from 'styled-components';
import * as React from 'react';

const GlobalStyle = createGlobalStyle`

  body {
    font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  background: #f5f5f5;
  color: #4d4d4d;
  min-width: 230px;
  margin: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
    * {
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    }
  }

  #__next {
    display: flex;
  }


  &:focus {
    outline: 0;
  }

  button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    font-size: 100%;
    vertical-align: baseline;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

`;

const StyledMain = styled(Main)`
  height: 100%;
  width: 100%;
`;

type Props = {
  styleTags: string;
};

export default class MyDocument extends Document<Props> {
  static getInitialProps({renderPage}) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => {
      console.log('App', App);
      return sheet.collectStyles(<App {...props} />);
    });
    const styleTags = sheet.getStyleElement();
    console.log('page', page);
    return {...page, styleTags};
  }

  render() {
    return (
      <html lang="it">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script
            type="text/javascript"
            src="https://sdk.amazonaws.com/js/aws-sdk-2.418.0.min.js"
          />
          <script
            type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD6JcAKww8t3kOThajdd5zzqHV8Z5oza2s&libraries=places"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Pacifico"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          {this.props.styleTags}
        </Head>
        <body>
          <GlobalStyle />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
