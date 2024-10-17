import ContextProvider from '../context/index';
import SignIn from './SignIn';
export const metadata = {
  title: "AppKit Example App",
  description: "Powered by Reown"
};

export default function RootLayout({ children }) {
  //const cookies = headers().get('cookie');

  return (
    <html lang="en">
      <body >
        <ContextProvider>
            <SignIn/>
        </ContextProvider>
      </body>
    </html>
  );
}
