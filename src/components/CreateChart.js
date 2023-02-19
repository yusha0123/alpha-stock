import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Stack } from "@mui/material";
Chart.register(...registerables);

function CreateChart(props) {
  const [array, setArray] = useState([]);
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Historical Representation of Stock Data",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "index",
        intersect: false,
      },
    },
  };
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Open",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Close",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "High",
        data: [],
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Low",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  });
  useEffect(() => {
    const fetchApi = async () => {
      let response = await fetch(
        `https://api.twelvedata.com/time_series?apikey=${process.env.REACT_APP_TWELVE_KEY_2}&interval=1day&symbol=${props.symbol}&outputsize=365`
      );
      let json = await response.json();
      setArray(json.values);
      let x = slice(5, json.values);
      updateChart(undefined, x);
    };

    fetchApi();
    // eslint-disable-next-line
  }, [props.symbol]);

  const slice = (number, arr) => {
    let newdata = arr.slice(0, number);
    return [...newdata].reverse();
  };

  const updateChart = (size, inputData) => {
    const label = [];
    const open = [];
    const close = [];
    const high = [];
    const low = [];
    let updatedData = [];
    if (size === 5) {
      updatedData = slice(5, inputData);
    } else if (size === 30) {
      updatedData = slice(30, inputData);
    } else if (size === 180) {
      updatedData = slice(180, inputData);
    } else if (size === 365) {
      updatedData = slice(365, inputData);
    } else {
      updatedData = inputData;
    }
    updatedData.forEach(function (item) {
      label.push(item.datetime);
      open.push(item.open);
      close.push(item.close);
      high.push(item.high);
      low.push(item.low);
    });
    setData({
      labels: label,
      datasets: [
        {
          label: "Open",
          data: open,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          pointRadius: 0,
        },
        {
          label: "Close",
          data: close,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          pointRadius: 0,
        },
        {
          label: "High",
          data: high,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
          pointRadius: 0,
        },
        {
          label: "Low",
          data: low,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          pointRadius: 0,
        },
      ],
    });
  };

  return (
    <Stack direction="column" alignItems="center" gap={2}>
      <Line data={data} options={options} />
      <ButtonGroup variant="outlined" sx={{ mx: "auto" }}>
        <Button onClick={() => updateChart(5, array)}>5D</Button>
        <Button onClick={() => updateChart(30, array)}>1M</Button>
        <Button onClick={() => updateChart(180, array)}>6M</Button>
        <Button onClick={() => updateChart(365, array)}>1Y</Button>
      </ButtonGroup>
    </Stack>
  );
}

export default CreateChart;
