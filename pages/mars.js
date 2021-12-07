import React from "react";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import moment from "moment";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Modal from "@mui/material/Modal";
import useModal from "../hooks/Modal";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import styles from "../styles/Mars.module.css";

const API_KEY = "BChFdP9eJ8HgXJ1wRaktCYG5EI1ns55KaW49bcj8";
const url = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";

const getRandomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};
const randomDate = getRandomDate(new Date(2015, 0, 1), new Date());
const randomDateFormated = moment(randomDate).format("YYYY-MM-DD");
const fetcher = (url, date, page) => {
  return axios
    .get(url, {
      params: {
        earth_date: date,
        api_key: API_KEY,
        page,
      },
    })
    .then((res) => res.data);
};

function Image({ item }) {
  const { isShowing, openModal, closeModal } = useModal();
  return (
    <>
      <div onClick={openModal} key={item.id} className={styles.image}>
        <img width="100px" src={item.img_src} />
      </div>
      <Modal
        open={isShowing}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modal}>
          <img width="100px" src={item.img_src} />
          <span>ID: {item.id}</span>
          <span>Camera: {item.camera.full_name}</span>
          <span>Earth Date: {item.earth_date}</span>
          <span>Sol: {item.sol}</span>
          <span>Rover: {item.rover.name}</span>
        </div>
      </Modal>
    </>
  );
}

function Page({ page, date }) {
  const { data, error } = useSWR(
    [url, date, page],
    (url, date, page) => fetcher(url, date, page),
    {
      refreshInterval: 600000,
    }
  );

  if (error) return <div>Error fetching Mars Images...</div>;
  if (!data) return <div>Loading Mars Images...</div>;

  return (
    <div className={styles.container}>
      {data.photos.map((item) => (
        <Image item={item} />
      ))}
    </div>
  );
}

export default function Mars() {
  const [date, setDate] = useState(randomDateFormated);
  const [page, setPage] = useState(1);

  return (
    <div>
      <div className={styles.datePicker}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={date}
            onChange={(newDate) => {
              if (newDate === date) {
                return;
              }
              const formattedDate = moment(newDate).format("YYYY-MM-DD");
              setDate(formattedDate);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

      <Page page={page} date={date} />
      <button onClick={() => setPage(page - 1)}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
