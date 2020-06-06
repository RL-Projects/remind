import React, { useState, useRef } from 'react'
import { AiOutlineMinusSquare } from 'react-icons/ai'
import TaskListItem from '../TaskListItem'
import './style.scss'

export default function Note(props) {
  const [posX, setPosX] = useState(window.innerWidth * props.positionX/1920)
  const [posY, setPosY] = useState(window.innerHeight * props.positionY/942)
  const contentRef = useRef(null)
  let offsetX, offsetY
  /* Usando como base uma tela de 1920 x 1080 que no navegador fica 1920x942 com barra de favoritos ativa */

  function movingNote(event) {
    setPosX(event.pageX - offsetX)
    
    if (event.pageY - offsetY <= 64)
      setPosY(64)
    else
      setPosY(event.pageY - offsetY)
  }

  function setNotePosition(event) {
    offsetY = event.clientY - contentRef.current.getBoundingClientRect().top
    offsetX = event.clientX - contentRef.current.getBoundingClientRect().left
    document.onmouseup = cancelNoteSelection
    document.onmousemove = movingNote
  }

  function cancelNoteSelection() {
    document.onmouseup = null
    document.onmousemove = null
  }

  return (
    <div style={{ top: posY, left: posX }} ref={contentRef} className="note">
      <div onMouseDown={setNotePosition} className="navbar-note" id="navbar">
        <div className="note-title">
          <h1>{props.title}</h1>
        </div>

        <div className="container-icons">
          <AiOutlineMinusSquare size={24} style={{ color: "#FFFFFF", borderRadius: 15 }} />
        </div>
        
      </div>
      <div className="container-description">
        {props.isTask && props.items.map(item => 
          <TaskListItem key={item.id} description={item.description} />
        )}
        {!props.isTask && <p>{props.description}</p>}
      </div>
    </div>
  )
}
