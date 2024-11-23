import { isAlive, get, set } from "./utils/redis";

(async () => {
  console.log(isAlive());
  console.log(await get("myKey"));
  await set("myKey", 12, 5);
  console.log(await get("myKey"));

  setTimeout(async () => {
    console.log(await get("myKey"));
  }, 1000 * 10);
})();
