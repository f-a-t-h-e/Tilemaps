import { Game } from "./Game";
import { ObjectTree } from "./ObjectClass";
import { objectsRules, tileRules } from "./mapGenerator";

type TStepMap = ({
  tile: keyof typeof tileRules;
  object?: {
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    age: 0 | 1 | 2;
  } | null;
} | null)[][];
type TStepObjects = {
  layer1: {
    row: number;
    col: number;
    object: {
      type: 0 | 5 | 1 | 2 | 7 | 6 | 3 | 4 | 8;
      age: 0 | 1 | 2;
    };
  }[];
  layer2: {row:number,col:number,object:ObjectTree}[];
};
type ObjectClassConstractorOptions = {
  // The `x` position on the map (used for collision )
  rootX: number;
  // The `y` position on the map (used for collision )
  rootY: number;
  // The html image used to for rendering this object
  image: HTMLImageElement;
  // The `x` position on the image of this object
  sx: number;
  // The `y` position on the image of this object
  sy: number;
  // The `width` of the object on the image of this object
  sw: number;
  // The `height` of the object on the image of this object
  sh: number;
  // The `width` of the object on the map
  dw: number;
  // The `height` of the object on the map
  dh: number;
  // The `x` position on the map
  x: number;
  // The `y` position on the map
  y: number;
  // The radius of the object used for collision
  r: number;
};

type TNextWayNode<T> = {
  index: string | number;
  value: T;
  next: TNextWayNode | TTwoWayNode | null;
};
type TTwoWayNode<T> = TNextWayNode<T> & {
  before: TNextWayNode | TTwoWayNode | null;
};

type TLinkedList<T> = (
  | {
      head: null;
      tail: null;
    }
  | {
      head: TNextWayNode<T> | TTwoWayNode<T>;
      tail: TNextWayNode<T> | TTwoWayNode<T>;
    }
) & {
  // insertBefore(index: string | number, value: T): TTwoWayNode<T>;
  insertAfter(index: string | number, value: T): TTwoWayNode<T>;
  push(index: string | number, value: T): TNextWayNode<T>;
  remove(TtwoWayNode: TTwoWayNode): void;
  clear(): void;
};

type ObjectsRules = typeof objectsRules;

export type TNewObjectData = {
  row: number;
  col: number;
  object: {
    type: keyof ObjectsRules;
    age: ObjectsRules[keyof ObjectsRules][number];
  };
};

export type ObjectGenerator = (
  // game: Game,
  objectData: TNewObjectData
) => ObjectTree;


export type MapGroundType = {
  objects: ObjectTree[];
  tile: {
      sx: number;
      sy: number;
      dx: number;
      dy: number;
  };
}[][]