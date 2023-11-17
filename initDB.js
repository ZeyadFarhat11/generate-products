import axios from "axios";

const EMAIL = "admin@admin.com";
const PASSWORD = "000000";

const getAccessToken = async () => {
  const {
    data: { access },
  } = await axios.post("http://127.0.0.1:8000/api/token/", {
    email: EMAIL,
    password: PASSWORD,
  });
  return access;
};

const createItem = async (item, type, token, field = "name") => {
  await axios.post(
    `http://127.0.0.1:8000/api/store/${type}/`,
    { [field]: item },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const main = async () => {
  const token = await getAccessToken();

  // colors
  await createItem("red", "colors", token);
  await createItem("blue", "colors", token);
  await createItem("green", "colors", token);
  await createItem("black", "colors", token);
  await createItem("white", "colors", token);
  await createItem("violet", "colors", token);
  await createItem("yellow", "colors", token);

  // brands
  await createItem("Adidas", "brands", token);
  await createItem("Puma", "brands", token);
  await createItem("Converse", "brands", token);
  await createItem("Nike", "brands", token);
  await createItem("Vans", "brands", token);

  // categories
  await createItem("Shoes", "categories", token);
  await createItem("Belts", "categories", token);
  await createItem("Bags", "categories", token);

  // sizes
  await createItem("SM", "sizes", token, "size");
  await createItem("MD", "sizes", token, "size");
  await createItem("LG", "sizes", token, "size");
  await createItem("XL", "sizes", token, "size");
  await createItem("2XL", "sizes", token, "size");
};
main();
