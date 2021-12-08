import useSWR from "swr";
import axios from "axios";
import moment from "moment";
import styles from "../styles/Apod.module.css";
import "animate.css";

const API_KEY = "BChFdP9eJ8HgXJ1wRaktCYG5EI1ns55KaW49bcj8";
const url = "https://api.nasa.gov/planetary/apod";

const getRandomDate = () => {
  const start = new Date(2015, 0, 1);
  const end = new Date();
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return moment(date).format("YYYY-MM-DD");
};

const fetcher = () =>
  axios
    .get(url, {
      params: {
        date: getRandomDate(),
        api_key: API_KEY,
      },
    })
    .then((res) => res.data);

export default function Home() {
  const { data, error } = useSWR("apod", fetcher, {
    refreshInterval: 60 * 1000,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  if (error) return <div>Error fetching APOD...</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div>
      {data.media_type === "image" ? (
        <div className={styles.image}>
          <img
            className="animate__animated animate__zoomIn"
            width="500px"
            key={data.url}
            src={data.url}
          />
        </div>
      ) : (
        <div>
          <iframe
            className="animate__animated animate__zoomIn"
            width="853"
            height="480"
            src={data.url}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}
    </div>
  );
}
