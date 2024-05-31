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

/**
 * A function that tests if a circle and a rectangle collied
 * @param {{r:number,rootX:number,rootY:number}} circle The circle to test the collision with
 * @param {{rootX:number,rootY:number,w:number,h:number}} rect The rectangle to test the collision with
 */
export function checkCircleRectCollision(circle, rect) {
  const deltaX = Math.abs(circle.rootX - rect.rootX);
  const deltaY = Math.abs(circle.rootY - rect.rootY);

  if (deltaX > rect.w * 0.5 + circle.r) {
    return false;
  }
  if (deltaY > rect.h * 0.5 + circle.r) {
    return false;
  }

  if (deltaX <= rect.w / 2) {
    return true;
  }
  if (deltaY <= rect.h / 2) {
    return true;
  }

  const cornerDistance_sq =
    (deltaX - rect.width / 2) ^ (2 + (deltaY - rect.height / 2)) ^ 2;
    return (cornerDistance_sq <= (circle.r**2))
}
