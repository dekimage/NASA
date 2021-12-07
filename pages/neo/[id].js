import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";
import { CChart } from "@coreui/react-chartjs";

import styles from "../../styles/Neo.module.css";

const API_KEY = "BChFdP9eJ8HgXJ1wRaktCYG5EI1ns55KaW49bcj8";
const url = "https://api.nasa.gov/neo/rest/v1/neo";
const LUNAR_DISTANCE = 384400;

const fetcher = (url, id) => {
  return axios
    .get(`${url}/${id}`, {
      params: {
        api_key: API_KEY,
      },
    })
    .then((res) => res.data);
};

export default function Neo() {
  const router = useRouter();
  const routeId = router.query.id;
  const { data, error } = useSWR([url, routeId], (url, routeId) =>
    fetcher(url, routeId)
  );

  return (
    <div>
      {error && (
        <div className={styles.container}>Error fetching Single NEO...</div>
      )}
      {!data && !error && (
        <div className={styles.container}>Loading Single NEO...</div>
      )}
      {data && (
        <div>
          <CChart
            type="bar"
            data={{
              labels: data.close_approach_data.map(
                (object) => object.close_approach_date
              ),
              datasets: [
                {
                  label: "Distance (Km)",
                  backgroundColor: "#f87979",
                  data: data.close_approach_data.map(
                    (object) => object.miss_distance.kilometers
                  ),
                },
              ],
            }}
            labels="dates"
          />
        </div>
      )}
    </div>
  );
}
