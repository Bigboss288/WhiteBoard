"use client"

import React, { useEffect, useState } from 'react'
import './panel.css'
import { CompactPicker } from 'react-color';
import { ImageSrcType, imgSrc } from '@/data'

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
    const [shapeIcon, setShapeIcon] = useState<string>(imgSrc.shape)
    const [shape, setShape] = useState<string>("")
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        set_color(color)
    },[color, shapeIcon])

    const setElement = (elementType: ImageSrcType) => {
        set_element(elementType)
        setshapeToggle(!shapetoggle)
        setShapeIcon(imgSrc[elementType])
        setShape("shape")
        setcolorToggle(false)
    }

    const setPen = (elementType: string) => {
        set_element(elementType)
        setShapeIcon(imgSrc.shape)
        setShape(elementType)
        setshapeToggle(false)
        setcolorToggle(false)
    }

    const setText = (elementType: string) => {
        set_element(elementType)
        setShapeIcon(imgSrc.shape)
        setShape(elementType)
        setshapeToggle(false)
        setcolorToggle(false)
    }

    const selectColor = (color : string) => {
        setColor(color)
        setcolorToggle(!colortoggle)
    }

    return (
        <div className='panel'>
            <div className='panel-container'>
                <div>
                    <button className={`button ${shape === "shape" && "active"}`}  onClick={() => setshapeToggle(!shapetoggle)}> <img src={shapeIcon} alt="" /> </button>
                    <button className={`button ${shape === "pen" && "active"}`} onClick={() => setPen("pen")}> <img src={imgSrc.pen} alt="" /> </button>
                    <button className={`button ${shape === "text" && "active"}`} onClick={() => setText("text")}> <img src={imgSrc.pen} alt="" /> </button>
                    <button className="button" onClick={() => open_note()}> <img src={imgSrc.note} alt="" /></button>
                    <button className="button" style={{ backgroundColor: color, border: "none" }} onClick={() => setcolorToggle(!colortoggle)}></button>
                </div>
                <div>
                    <button className="button" onClick={() => undo()}><img src={imgSrc.undo} alt="" /></button>
                    <button className="button" onClick={() => clear_screen()}><img src={imgSrc.delete} alt="" /></button>
                    <button className="button" onClick={() => take_screenshot()}><img src={imgSrc.camera} alt="" /></button>
                </div>
                {
                    shapetoggle &&
                    <div className='shape-wrap'>
                        <button className="button" onClick={() => setElement("rectangle")}> <img src={imgSrc.rectangle} alt="" /> </button>
                        <button className="button" onClick={() => setElement("circle")}> <img src={imgSrc.circle} alt="" /> </button>
                        <button className="button" onClick={() => setElement("line")}> <img src={imgSrc.line} alt="" /> </button>
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
