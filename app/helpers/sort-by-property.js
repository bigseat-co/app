export function sortByProperty(array, property) {
  return array.sort((a, b) => {
    if (a === b) {
       return 0;
     }

     return a[property] < b[property] ? -1 : 1;
  });
};
