import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/make-call", async (req, res) => {
  try {
    const { caller_id, client_number } = req.body;

    // Basic validation — don't trust frontend
    if (!caller_id || !client_number) {
      return res
        .status(400)
        .json({ error: "caller_id and client_number are required" });
    }

    const response = await fetch(
      "https://control.msg91.com/api/v5/voice/call/",
      {
        method: "POST",
        headers: {
          Authkey: "478312AgHesvjV691c86b3P1",
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          template: "yourtemplate",
          caller_id,
          client_number,
          callback_url: "https://status.callback.com",
          variables: {
            var1: {
              type: "number",
              as_digits: true,
              value: "1234",
            },
            var2: {
              type: "currency",
              currency_code: "USD",
              value: "100",
            },
          },
        }),
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(9000, () => console.log("Server running on port 9000"));
