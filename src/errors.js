import { FOLLOW_REQUEST_NOT_FOUND } from "./constants";
export const handleError = (error) => {
    console.log('error: ', error)

    if (error.type) {
        if (error.type == FOLLOW_REQUEST_NOT_FOUND) {
            alert(JSON.stringify(error.message))
        }
    } else {

        alert(error);
        alert(JSON.stringify(error));

    }
}