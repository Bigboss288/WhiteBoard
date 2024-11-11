"use client"

import React, { useRef, useState, useEffect } from "react";
// import io from "socket.io-client"
import "./note.css";


// const socket = io('http://localhost:4000')           //socket logic

interface NoteProps {
  deleteNote: (element: void) => void
}



const Notes: React.FC<NoteProps> = ({ deleteNote }) => {
  const noteRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [text, setText] = useState(""); // State for textarea content



  //   useEffect(() => {                                  //socket logic
  //     socket.on('textUpdate', (data: string) => {
  //       setText(data);
  //     });

  //     return () => {
  //       socket.off('textUpdate');
  //     };
  // }, []);

  useEffect(() => {

    if (typeof window !== "undefined") {
      const updatePosition = () => {
        setPosition({
          x: window.innerWidth - 330,
          y: window.innerHeight - 351
        })
      }

      updatePosition()

      window.addEventListener('resize', updatePosition);

      return () => window.removeEventListener('resize', updatePosition);
    }
  },[])

  useEffect(() => {
    const mouseUp = () => setIsDragging(false);

    const mouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const noteElement = noteRef.current;
      const noteRect = noteElement?.getBoundingClientRect();

      const newX = event.clientX - mouseOffset.x;
      const newY = event.clientY - mouseOffset.y;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust position to keep the note within viewport bounds
      const adjustedX = Math.max(0, Math.min(newX, viewportWidth - noteRect!.width));
      const adjustedY = Math.max(0, Math.min(newY, viewportHeight - noteRect!.height));

      setPosition({ x: adjustedX, y: adjustedY });
    };

    headRef.current?.addEventListener("mousemove", mouseMove);
    headRef.current?.addEventListener("mouseup", mouseUp);

    return () => {
      headRef.current?.removeEventListener("mousemove", mouseMove);
      headRef.current?.removeEventListener("mouseup", mouseUp);
    };
  }, [isDragging, mouseOffset]);

  if (position === null) {
    return null; // Don't render until position is set
  }

  const mouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);

    const rect = noteRef.current!.getBoundingClientRect();
    setMouseOffset({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value
    setText(newText); // Update the text state
    console.log(text)
    // socket.emit('textChange', newText);                       //socket logic
  };

  return (
    <div
      className="notes-container"
      ref={noteRef}
      style={{ left: position?.x, top: position?.y }}
    >
      <div ref={headRef} onMouseDown={mouseDown}>
        <button onClick={() => deleteNote()}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABJUlEQVR4nO3YT0sCQRyH8YeuUu0KG/RHUG8efAceetFBJ6noEKUI6iG1wHolxcIYg6wi67Qzs3w/IHga92F09zeCiIiIiMg/6QEPwKXDNRvAHXBLhYbADzAHLhysdwo8W2ueUJEMmJoPfj9yZ/KdeDRrfQNdKpYCY3MBC+DKQUQHT46JsSO+fEYUxSwPjMkjnkKKsGNGVsw1u50BLyFGFMWsdsQEH7GR7Ik534poE7hkK+YmxoiNJjAxF/4BvJr3n0CLyCTAmwnIX+uYdqJ2Ic06fLWSgjtXdD/2dM/tN5pnSHrA0z3Y0aTMvBVsTFpiAg5mfHc9xnuNyaxT4qLkKbFhzv7eTocZMHN41PUWM6zLnw99E+Miwo65BwYO1xQRERER4c8v6Th7MMbV15kAAAAASUVORK5CYII="
            alt="delete"
          />
        </button>
      </div>
      <div>
        <textarea
          className="editor"
          ref={textRef}
          value={text}
          onChange={handleTextChange} // Set the text change handler
          placeholder="Write your note here..."
        ></textarea>
      </div>
    </div>
  );
};

export default Notes;
