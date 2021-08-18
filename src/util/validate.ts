import { iCoordinates } from "../models/coordinates.interface";
import { Debug } from "./debug";

/**
 * Checks that the given object has proper x and y values
 */
export const ValidCoordinates = function(coordinates: iCoordinates) {
    var valid = (coordinates.hasOwnProperty('x') 
        && coordinates.hasOwnProperty('y')
        && Number.isInteger(coordinates.x)
        && Number.isInteger(coordinates.y)
    );

    if (!valid) {
        Debug.log(`Invalid coordinates - x: ${coordinates.x}, y: ${coordinates.y}`);
    }

    return valid;
};
