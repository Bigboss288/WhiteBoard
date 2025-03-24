"use client"

import React, { useEffect, useState } from 'react'
import './panel.css'
import { CompactPicker } from 'react-color';
import CategoryIcon from '@mui/icons-material/Category';
import CreateIcon from '@mui/icons-material/Create';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import EditNoteIcon from '@mui/icons-material/EditNote';
import UndoIcon from '@mui/icons-material/Undo';
import SquareIcon from '@mui/icons-material/Square';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import ScreenshotIcon from '@mui/icons-material/Screenshot';
import { SvgIconComponent } from '@mui/icons-material';

interface PanelProps {
    set_color : (element: string) => void
    set_element: (element: string) => void
    open_note: (element: void) => void
    undo: (element: void) => void
    clear_screen: (element: void) => void
    take_screenshot: (element: void) => void
}

const Panel: React.FC<PanelProps> = ({set_color, set_element, open_note, undo, clear_screen, take_screenshot}) => {

    const [colortoggle, setcolorToggle] = useState<boolean>(false)
    const [shapetoggle, setshapeToggle] = useState<boolean>(false)
    const [ShapeIcon, setShapeIcon] = useState<SvgIconComponent>(CategoryIcon);
    const [shape, setShape] = useState<string>("")
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        set_color(color)
    },[color, ShapeIcon])

    const setElement = (elementType: string) => {
        set_element(elementType)
        setshapeToggle(!shapetoggle)
        setShape("shape")
        setcolorToggle(false)
        if(elementType === "rectangle"){
            setShapeIcon(SquareIcon)
        }
        else if(elementType === "circle"){
            setShapeIcon(CircleIcon)
        }
        else if(elementType === "line"){
            setShapeIcon(ArrowRightAltIcon)
        }
    }

    const setPen = (elementType: string) => {
        set_element(elementType)
        setShape(elementType)
        setshapeToggle(false)
        setcolorToggle(false)
    }

    const setText = (elementType: string) => {
        set_element(elementType)
        setShape(elementType)
        setshapeToggle(false)
        setcolorToggle(false)
    }

    const selectColor = (color : string) => {
        setColor(color)
        setcolorToggle(!colortoggle)
    }

    const shapeButtonDown = () => {
        setcolorToggle(false)
        setshapeToggle(!shapetoggle)
    }

    const colorButtonDown = () => {
        setshapeToggle(false)
        setcolorToggle(!colortoggle)
    }

    return (
        <div className='panel'>
            <div className='panel-container'>
                <div>
                    {/* <button className={`button ${shape === "shape" && "active"}`}  onClick={() => setshapeToggle(!shapetoggle)}> <img src={shapeIcon} alt="" /> </button> */}
                    <button className={`button ${shape === "shape" && "active"}`} onClick={() => shapeButtonDown()}>{<ShapeIcon fontSize="small" />}</button>
                    <button className={`button ${shape === "pen" && "active"}`} onClick={() => setPen("pen")}><CreateIcon fontSize="small"/></button>
                    <button className={`button ${shape === "text" && "active"}`} onClick={() => setText("text")}><FormatColorTextIcon fontSize="small"/> </button>
                    <button className="button" onClick={() => open_note()}> <EditNoteIcon fontSize="small"/></button>
                    <button className="button" style={{ backgroundColor: color, border: "none" }} onClick={() => colorButtonDown()}></button>
                </div>
                <div>
                    <button className="button" onClick={() => undo()}><UndoIcon fontSize="small"/></button>
                    <button className="button" onClick={() => clear_screen()}><DeleteIcon fontSize="small"/></button>
                    <button className="button" onClick={() => take_screenshot()}><ScreenshotIcon fontSize="small"/></button>
                </div>
                {
                    shapetoggle &&
                    <div className='shape-wrap'>
                        <button className="button" onClick={() => setElement("rectangle")}> <SquareIcon fontSize="small"/> </button>
                        <button className="button" onClick={() => setElement("circle")}> <CircleIcon fontSize="small"/> </button>
                        <button className="button" onClick={() => setElement("line")}> <ArrowRightAltIcon fontSize="small"/> </button>
                        {/* <button className="button" onClick={() => setElement("line")}> <img src={imgSrc.line} alt="" /> </button> */}
                    </div>
                }
                {
                    colortoggle &&
                    <div className='color-wrap'>
                        <CompactPicker color={color} onChange={color => selectColor(color.hex)}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default Panel
