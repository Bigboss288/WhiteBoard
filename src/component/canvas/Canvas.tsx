"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from './useHistory';
import { Rectangle, Line, Text, Ellipse, Element, CanvasElement } from './Shape';
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
    const [cursorVisible, setCursorVisible] = useState<boolean>(true);
    const [dimensions, setDimensions] = useState<{ height: number, width: number }>({ height: 0, width: 0 });

    useEffect(() => {

        const interval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500); // Blinking effect every 500ms


        const updateDimensions = () => {
            if (typeof window !== "undefined") {
                setDimensions({
                    height: window.innerHeight,
                    width: window.innerWidth
                })
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions);

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', updateDimensions);
        }

    }, [])


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        context?.clearRect(0, 0, canvas!.width, canvas!.height);
        elements.forEach(({ elementType, canvasElement }) => drawElement(context!, elementType, canvasElement, cursorVisible));
    }, [elements, cursorVisible])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {

            if (elements.length === 0 || elements[elements.length - 1].elementType !== "text") return;

            const lastElement = elements[elements.length - 1].canvasElement;
            let updatedText = lastElement.letter;
            if (event.key === "Enter") updatedText += "\n";
            else if (event.key === "Backspace") {
                updatedText = updatedText.slice(0, -1);
            } else {
                if (/^[A-Za-z0-9+\-*/?<>,@!$%#=()\[\]{} ]$/.test(event.key)) {
                    updatedText += event.key
                }
            }

            const updatedElement = createElement(lastElement.x1, lastElement.y1, 0, 0, elementType, color, linearPath, updatedText);
            const elementCopy = [...elements];
            elementCopy[elements.length - 1] = updatedElement;
            setElement(elementCopy, true);
        };


        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [elements]);



    const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (elementType === "") return;

        // Extract x and y coordinates, handling both pointer and touch events
        const x = 'clientX' in event ? event.clientX : event.touches[0].clientX;
        const y = 'clientY' in event ? event.clientY : event.touches[0].clientY;

        if (elementType === "text") {
            if (elements.length > 0 && elements[elements.length - 1].elementType === "text" && elements[elements.length - 1].canvasElement.typing === true) {
                elements[elements.length - 1].canvasElement.typing = false
                // console.log( elements[elements.length - 1].canvasElement)
                setElementType("")
            }
            else {
                const letter = ""
                const textElement = createElement(x, y, x, y, elementType, color, linearPath, letter);
                setElement((prev) => [...prev, textElement]); // Add empty text element
            }
        }
        else {
            if (elements.length > 0 && elements[elements.length - 1].elementType === "text" && elements[elements.length - 1].canvasElement.typing === true){
                elements[elements.length - 1].canvasElement.typing = false
            }
            setDrawing(true);
            const element = createElement(x, y, x, y, elementType, color, linearPath);
            setElement((prevstate) => [...prevstate, element]);
        }

    };

    const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!drawing) return;

        const index = elements.length - 1;
        if (index < 0) return;

        const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
        const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;

        if (elementType === "pen") {
            setLinearpath((prev) => [...prev, { x: clientX, y: clientY }]);
        }

        const { x1, y1 } = elements[index];

        const updateElement: Element = createElement(x1, y1, clientX, clientY, elementType, color, linearPath);

        const elementCopy = [...elements];
        elementCopy[index] = updateElement;
        setElement(elementCopy, true);
    };

    const handlePointerUp = () => {
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
            link.download = 'screenshot' + Date.now() + '.png';
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
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
            ></canvas>
        </div>
    )
}


const createElement = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    elementType: string,
    color: string,
    path: { x: number; y: number }[],
    letter?: string) => {

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
            x: (x1 + x2) / 2, // Midpoint X (center of ellipse)
            y: (y1 + y2) / 2, // Midpoint Y (center of ellipse)
            radiusX: Math.abs(x2 - x1) / 2, // Half of the width
            radiusY: Math.abs(y2 - y1) / 2, // Half of the height
            fillColor: 'white',
            borderColor: color,
            borderWidth: 1,
        } as Ellipse;

    } else if (elementType === "rectangle") {

        canvasElement = {
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            fillColor: 'white',
            borderColor: color,
            borderWidth: 1,
        } as Rectangle

    } else if (elementType === "pen") {
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

    else if (elementType == "text") {
        canvasElement = {
            letter: letter,
            x1: x1,
            y1: y1,
            typing: true
        } as Text
    }



    return { x1, y1, x2, y2, elementType, canvasElement };
};


const drawElement = (
    context: CanvasRenderingContext2D,
    elementType: string,
    canvasElement: CanvasElement,
    cursor: boolean) => {

    if (elementType === "line") drawLine(context, canvasElement as Line)
    else if (elementType === "circle") drawCircle(context, canvasElement as Ellipse)
    else if (elementType === "rectangle") drawRectangle(context, canvasElement as Rectangle)
    else if (elementType === "pen") drawLine(context, canvasElement as Line)
    else if (elementType === "text") drawText(context, canvasElement as Text, cursor)


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

const drawCircle = (context: CanvasRenderingContext2D, ellipse: Ellipse) => {

    //     context.fillStyle = circle.fillColor;
    //     context.strokeStyle = circle.borderColor;
    //     context.lineWidth = circle.borderWidth;

    //     context.beginPath();
    //     context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2); 
    //     // context.fill(); // Fill the circle
    //     context.stroke(); /

    context.beginPath();
    context.ellipse(ellipse.x, ellipse.y, ellipse.radiusX, ellipse.radiusY, 0, 0, 2 * Math.PI);
    // context.fillStyle = ;
    // context.fill();
    context.strokeStyle = ellipse.borderColor;
    context.stroke();

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
        // context.moveTo(line.x1, line.y1);
        // context.lineTo(line.x2, line.y2);

        //this is for arrow
        const headlen = 10; // length of head in pixels
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const angle = Math.atan2(dy, dx);
        context.moveTo(line.x1, line.y1);
        context.lineTo(line.x2, line.y2);
        context.lineTo(line.x2 - headlen * Math.cos(angle - Math.PI / 6), line.y2 - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(line.x2, line.y2);
        context.lineTo(line.x2 - headlen * Math.cos(angle + Math.PI / 6), line.y2 - headlen * Math.sin(angle + Math.PI / 6));
        context.stroke();


    }
};

const drawText = (context: CanvasRenderingContext2D, text: Text, cursor: boolean) => {

    const lines = text.letter.split("\n"); // Split text into lines
    const lineHeight = 20; // Adjust line height
   
    context.font = "22px 'Caveat', sans-serif";
    context.fillStyle = "black";

    lines.forEach((line, index) => {
        context.fillText(line, text.x1, text.y1 + index * lineHeight);
    });
   

    if (cursor && text.typing) {
        const lastLine = lines[lines.length - 1];
        const textWidth = context.measureText(lastLine).width;
        context.beginPath();
        context.moveTo(text.x1 + textWidth + 4, text.y1 + (lines.length - 1) * lineHeight - lineHeight + 7);
        context.lineTo(text.x1 + textWidth + 4, text.y1 + (lines.length - 1) * lineHeight + 2);
        context.strokeStyle = "black"; // Cursor color
        context.lineWidth = 2; // Cursor thickness
        context.stroke();
    }

}



export default Canvas
