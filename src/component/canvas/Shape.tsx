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
    x: number;       
    y: number;       
    radius: number;  
    fillColor: string; 
    borderColor: string; 
    borderWidth: number; 
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

export type Ellipse = {
    x: number;       
    y: number;       
    radiusX: number;  
    radiusY: number;
    fillColor: string; 
    borderColor: string; 
    borderWidth: number; 
};

export type Text = {
    letter : string,
    x1: number;
    y1: number;
    typing: boolean;
};

export type CanvasElement = Line | Circle | Rectangle | Text | Ellipse
