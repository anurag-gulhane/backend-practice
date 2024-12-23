const express = require("express");

const { userRouter } = require("./routes/users");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();

app.use("/users", userRouter);
app.use("/courses", courseRouter);
app.use("/admin", adminRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App Is Running On ${PORT}`);
});
