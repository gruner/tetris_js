/**
 * Merges the properties of obj2 into obj1
 */
export const DeepExtend = function(obj1: any, obj2: any) {

  // TODO: recurse for more than two arguments
  // if (arguments.length > 2) {
  //     for (var i = 0; i < arguments.length; i++) {
  //         //
  //     };
  // }

  for (let prop in obj2) {
    if (obj1.hasOwnProperty(prop) && obj1[prop] instanceof Object) {
      obj1[prop] = DeepExtend(obj1[prop], obj2[prop]);
    } else {
      obj1[prop] = obj2[prop];
    }
  }

  return obj1;
};
