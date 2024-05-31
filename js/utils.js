/**
 *
 * @type {GetRandomValueFromArray}
 */
export function getRandomValueFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 *
 * @type {GetObjectKeys}
 */
export function getObjectKeysASNumbers(obj) {
  return Object.keys(obj).map(Number);
}

/**@type  {(a:{rootX:number,rootY:number,r:number},b:{rootX:number,rootY:number,r:number})=>{colission:boolean, distance:number, sumOfRadius:number, deltaX:number, deltaY:number}}*/
export const checkRCollision = (a, b) => {
  const deltaX = a.rootX - b.rootX;
  const deltaY = a.rootY - b.rootY;
  const distance = Math.hypot(deltaY, deltaX);
  const sumOfRadius = a.r + b.r;

  return {
    colission: distance < sumOfRadius,
    distance,
    sumOfRadius,
    deltaX,
    deltaY,
  };
};
