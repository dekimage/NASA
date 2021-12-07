import useSWR from "swr";
import axios from "axios";
import moment from "moment";
const API_KEY = "BChFdP9eJ8HgXJ1wRaktCYG5EI1ns55KaW49bcj8";

const getRandomDate = (start, end) => {
  console.log(start);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};
const randomDate = getRandomDate(new Date(2015, 0, 1), new Date());
const randomDateFormated = moment(randomDate).format("YYYY-MM-DD");
const fetcher = () =>
  axios
    .get("https://api.nasa.gov/planetary/apod", {
      params: {
        date: randomDateFormated,
        api_key: API_KEY,
      },
    })
    .then((res) => res.data);

export default function Home() {
  const { data, error } = useSWR("apod", fetcher, { refreshInterval: 60000 });
  if (error) return <div>Error fetching APOD...</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <div>
      APOD:
      <img width="500px" src={data.url} />
    </div>
  );
}
