"use client"

export type Element = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    // path: { x: number; y: number }[],
    elementType: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvasElement: any
};

export type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;
    borderColor: string;
    borderWidth: number;
};

export type Circle = {
    x: number;       // Center x-coordinate
    y: number;       // Center y-coordinate
    radius: number;  // Radius of the circle
    fillColor: string; // Fill color of the circle
    borderColor: string; // Border color of the circle
    borderWidth: number; // Width of the circle's border
};

export type Line = {
    
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    strokeStyle: string;
    lineWidth: number;
    isPen: boolean;
    path: { x: number; y: number }[];
};

export type CanvasElement = Line | Circle | Rectangle
