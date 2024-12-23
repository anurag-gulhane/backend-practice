// const { express } = require("express");
const express = require("express");
const { userRouter } = require("./routes/users");
const { courseRouter } = require("./routes/course");
const app = express();

app.use("/users", userRouter);
app.use("/courses", courseRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App Is Running On ${PORT}`);
});
