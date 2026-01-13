import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("jai shree jaganath server is ready");
});

app.get("/api/jokes", (req, res) => {
  const joke = [
    {
      id: 1,
      content: "joke1",
    },
    {
      id: 2,
      content: "joke2",
    },
    {
      id: 3,
      content: "joke3",
    },
    {
      id: 4,
      content: "joke4",
    },
    {
      id: 5,
      content: "joke5",
    },
  ];
  res.send(joke);
});

app.listen(port, () => {
  console.log(`server is listening at  port ${port}`);
});
