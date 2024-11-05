"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from './useHistory';
import { Rectangle, Line, Circle, Element, CanvasElement } from './Shape';
import Panel from '../panel/Panel';
import Notes from '../note/Note';
import html2canvas from 'html2canvas';




const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [elements, setElement, undo] = useHistory<Element[]>([]);
    const [drawing, setDrawing] = useState(false);
    const [linearPath, setLinearpath] = useState<{ x: number; y: number }[]>([]);
    const [elementType, setElementType] = useState<string>("");
    const [color, setColor] = useState<string>("black");
    const [isNoteVisible, setNoteVisible] = useState<boolean>(false)
    const [dimensions, setDimensions] = useState<{height: number, width: number}>({ height: 0, width: 0 });

    useEffect(() => {
        const height = window.innerHeight
        const width = window.innerWidth

        setDimensions({
            height: height,
            width: width
        })
    
    },[])

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        context?.clearRect(0, 0, canvas!.width, canvas!.height);
        elements.forEach(({ elementType, canvasElement }) => drawElement(context!, elementType, canvasElement));
    }, [elements])


    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (elementType === "") return;
        setDrawing(true);

        const x = event.clientX;
        const y = event.clientY;

        const element = createElement(x, y, x, y, linearPath, elementType, color);
        setElement((prevstate) => [...prevstate, element]);
    };

    const handleMouseMove = (
        event: React.MouseEvent<HTMLCanvasElement>,
    ) => {

        if (!drawing) return;

        // Check if there are any elements to work with
        const index = elements.length - 1;
        if (index < 0) return; // Exit if no elements exist

        const { clientX, clientY } = event;
        if (elementType === "pen") setLinearpath((prev) => [...prev, { x: clientX, y: clientY }]);

        const { x1, y1 } = elements[index];

        const updateElement: Element = createElement(x1, y1, clientX, clientY, linearPath, elementType, color);

        const elementCopy = [...elements];
        elementCopy[index] = updateElement;
        setElement(elementCopy, true); // Only pass the new state here
    };

    const handleMouseUp = () => {
        if (!drawing) return;

        setLinearpath([]);
        setDrawing(false);
    };

    const clearScreen = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        context?.clearRect(0, 0, canvas!.width, canvas!.height);
        setElement([])
    };

    const takeScreenshot = () => {
        html2canvas(canvasRef.current!).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'screenshot' + Date.now() + '.png'; // Specify the file name
            link.click();
        });
    };

    return (
        <div>
            <Panel
                set_color={(color) => setColor(color)}
                set_element={(element) => setElementType(element)}
                open_note={() => setNoteVisible(true)}
                undo={undo}
                clear_screen={() => clearScreen()}
                take_screenshot={() => takeScreenshot()}
            />
            {isNoteVisible && <Notes deleteNote={() => setNoteVisible(false)} />}
            <canvas id="canvas"
                ref={canvasRef}
                height={dimensions.height}
                width={dimensions.width}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}></canvas>
        </div>
    )
}


const createElement = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    path: { x: number; y: number }[],
    elementType: string,
    color: string) => {

    let canvasElement = null
    if (elementType === "line") {
        canvasElement = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            strokeStyle: color,
            lineWidth: 1,
            isPen: false,
            path
        } as Line

    } else if (elementType === "circle") {
        canvasElement = {
            x: x1 ,
            y: y1 ,
            radius: Math.abs(x2 - x1) * 2,
            fillColor: 'white',
            borderColor: color,
            borderWidth: 1,
        } as Circle

    } else if (elementType === "rectangle") {

        canvasElement = {
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            fillColor: 'white',
            borderColor: color,
            borderWidth: 2,
        } as Rectangle

    } else {

        canvasElement = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            strokeStyle: color,
            lineWidth: 1,
            isPen: true,
            path
        } as Line
    }


    return { x1, y1, x2, y2, elementType, canvasElement };
};


const drawElement = (
    context: CanvasRenderingContext2D,
    elementType: string,
    canvasElement: CanvasElement) => {

    if (elementType === "line") drawLine(context, canvasElement as Line)
    else if (elementType === "circle") drawCircle(context, canvasElement as Circle)
    else if (elementType === "rectangle") drawRectangle(context, canvasElement as Rectangle)
    else drawLine(context, canvasElement as Line)

}

const drawRectangle = (context: CanvasRenderingContext2D, rectangle: Rectangle) => {
    context.fillStyle = rectangle.fillColor;
    context.strokeStyle = rectangle.borderColor;
    context.lineWidth = rectangle.borderWidth;

    // Draw the filled rectangle
    // context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);

    // Draw the rectangle border
    context.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
};

const drawCircle = (context: CanvasRenderingContext2D, circle: Circle) => {
    context.fillStyle = circle.fillColor;
    context.strokeStyle = circle.borderColor;
    context.lineWidth = circle.borderWidth;

    // Draw the circle
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2); // Full circle
    // context.fill(); // Fill the circle
    context.stroke(); // Draw the circle border
};

const drawLine = (context: CanvasRenderingContext2D, line: Line) => {
    context.strokeStyle = line.strokeStyle;
    context.lineWidth = line.lineWidth;

    if (line.isPen) {
        context.beginPath();
        context.moveTo(line.x1, line.y1); // Move to starting point
        line.path.forEach(({ x, y }) => context.lineTo(x, y))
        context.stroke();
    }
    else {
        context.beginPath();
        context.moveTo(line.x1, line.y1);
        context.lineTo(line.x2, line.y2);
        context.stroke();
    }
};


export default Canvas
