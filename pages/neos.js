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

import { List } from "react-virtualized";
import styles from "../styles/Neos.module.css";

const API_KEY = "BChFdP9eJ8HgXJ1wRaktCYG5EI1ns55KaW49bcj8";
const LUNAR_DISTANCE = 384400;
const url = "https://api.nasa.gov/neo/rest/v1/feed";

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
  console.log(objectDistance);
  console.log(LUNAR_DISTANCE);
  console.log(
    objectDistance < LUNAR_DISTANCE && objectDistance > LUNAR_DISTANCE / 2
  );

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
    <Link href={`/neo/${object.neo_reference_id}`} key={object.id}>
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

  const renderRow = ({ index, key, style, parent }) => {
    const asteroids = parent.props.asteroidList;
    return (
      <div>
        <div key={key} style={style}>
          <NearObject object={asteroids[index]} />
        </div>
      </div>
    );
  };

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
            const asteroidListPerDate = data.near_earth_objects[date];
            return (
              <div key={i}>
                <span>{date}</span>
                <List
                  width={200}
                  height={600}
                  rowRenderer={renderRow}
                  rowCount={asteroidListPerDate.length}
                  rowHeight={60}
                  asteroidList={asteroidListPerDate}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
