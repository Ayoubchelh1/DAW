import { APICONFIG } from "./config/apiConfig";
import { app } from "./app";

app.listen(APICONFIG.port, () => {
    console.log(`Servidor escoltant a ${APICONFIG.host}:${APICONFIG.port}`);
});
