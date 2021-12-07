import "../styles/globals.css";
// import moment from "moment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

function MyApp({ Component, pageProps }) {
  return (
    // <LocalizationProvider dateAdapter={moment}>
    <Component {...pageProps} />
    // </LocalizationProvider>
  );
}

export default MyApp;
