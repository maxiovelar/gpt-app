import axios from "axios";

export const revalidateDB = async () => {
  await axios.get("/api/revalidate");
};
