export const DeepExtend = function(parent: any, child: any) {

  // TODO: recurse for more than two arguments
  // if (arguments.length > 2) {
  //     for (var i = 0; i < arguments.length; i++) {
  //         //
  //     };
  // }

  for (let prop in child) {
    if (parent.hasOwnProperty(prop) && parent[prop] instanceof Object) {
      parent[prop] = DeepExtend(parent[prop], child[prop]);
    } else {
      parent[prop] = child[prop];
    }
  }

  return parent;
};
