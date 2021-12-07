import React from "react";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import DateRangePicker from "@mui/lab/DateRangePicker";
import Box from "@mui/material/Box";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Link from "next/link";

import styles from "../styles/Neos.module.css";

const API_KEY = "BChFdP9eJ8HgXJ1wRaktCYG5EI1ns55KaW49bcj8";
const url = "https://api.nasa.gov/neo/rest/v1/feed";
const LUNAR_DISTANCE = 384400;

const fetcher = (url, dateRange) => {
  return axios
    .get(url, {
      params: {
        start_date: dateRange[0],
        end_date: dateRange[1],
        api_key: API_KEY,
      },
    })
    .then((res) => res.data);
};

function NearObject({ object }) {
  let label;
  const objectDistance = object.close_approach_data[0].miss_distance.kilometers;

  if (objectDistance > LUNAR_DISTANCE) {
    label = "green";
  }
  if (objectDistance < LUNAR_DISTANCE && objectDistance > LUNAR_DISTANCE / 2) {
    label = "orange";
  }
  if (objectDistance < LUNAR_DISTANCE / 2) {
    label = "red";
  }

  return (
    <Link href={`/neos/${object.id}`} key={object.id}>
      <div key={object.id} className={styles[label]}>
        <div className={styles.image}>
          <div>{object.name}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Neo() {
  const [dateRange, setDateRange] = useState([null, null]);
  const { data, error } = useSWR([url, dateRange], (url, dateRange) =>
    fetcher(url, dateRange)
  );

  return (
    <div>
      <div className={styles.datePicker}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="Start-Date"
            endText="End-Date"
            value={dateRange}
            onChange={(newDateRange) => {
              setDateRange(newDateRange);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
      </div>

      {error && <div className={styles.container}>Error fetching NEOS...</div>}
      {!data && !error && (
        <div className={styles.container}>Loading NEOS...</div>
      )}
      {data && (
        <div className={styles.container}>
          {Object.keys(data.near_earth_objects).map((date, i) => {
            return (
              <div key={i}>
                <span>{date}</span>
                {data.near_earth_objects[date].map((object) => (
                  <NearObject object={object} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
