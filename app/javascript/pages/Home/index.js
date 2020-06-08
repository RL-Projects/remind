import React, { useState, useEffect, useRef } from "react"
import Navbar from '../../components/Navbar'
import Note from '../../components/Note'
import OptionMenu from '../../components/OptionMenu'
import api, { apiUrl } from '../../services/api'
import './style.scss'

export default function Home() {
  const [currentEnvironmentID, setCurrentEnvironmentID] = useState(0)
  const [environmentList, setEnvironmentList] = useState([])
  const [optionMenu, setOptionMenu] = useState([])
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [isMenuShowing, setIsMenuShowing] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
    async function loadEnvironments() {
      const response = await api.get(`${apiUrl}/environment`) 
      setEnvironmentList(response.data.environments)
    }
    loadEnvironments()
  }, [])

  useEffect(() => {
    setContentHeight(contentRef.current.clientHeight)
  }, [])

  useEffect(() => {
    if (isMenuShowing)
      setOptionMenu([
        {
          positionX: positionX,
          positionY: positionY
        }
      ])
    else
      setOptionMenu([])
  }, [isMenuShowing])

  async function fetchEnvironmentContent(id) {
    setCurrentEnvironmentID(id)
    const response = await api.get(`${apiUrl}/environment/${id}`)
    setNotes(response.data.notes)
    setTasks(response.data.task_lists)
  }

  function createNote() {
    setNotes([...notes, 
      {
        id: notes[notes.length - 1].id + 1,
        title: 'Nota',
        description: '',
        positionX: positionX,
        positionY: positionY
      }
    ])
    setOptionMenu(false)
    setIsMenuShowing(false)
  }

  function createList() {
    setTasks([...tasks, 
      {
        id: tasks[tasks.length - 1].id + 1,
        title: 'Lista',
        task_list_items: [],
        positionX: positionX,
        positionY: positionY
      }
    ])
    setOptionMenu(false)
    setIsMenuShowing(false)
  }
  
  function renderOptionMenu(event) {
    const posX = event.clientX
    const posY = event.clientY
    event.preventDefault()

    if (posX + 120 > screen.width)
      setPositionX(posX - 120)
    else
      setPositionX(posX)

    if (posY + 58 > contentHeight)
      setPositionY(posY - 58)
    else
      setPositionY(posY)
    
    setIsMenuShowing(true)
  }

  function hideOptionMenu(event) {
    const posX = event.clientX
    const posY = event.clientY
    event.preventDefault()
    
    if (event.button == 0 && (posX >= positionX && posX <= positionX + 120) && (posY >= positionY && posY <= positionY + 58))
      return

    if ((event.button == 2 || event.button == 0) && isMenuShowing)
      setIsMenuShowing(false)
  }

  return (
    <>
      <Navbar 
        environmentList={environmentList} 
        fetchEnvironmentContent={fetchEnvironmentContent} />
      <div className="content" onContextMenu={renderOptionMenu} onMouseDown={hideOptionMenu} ref={contentRef}>
        {notes.length > 0 && notes.map(note =>
          <Note
            key={note.id}
            id={note.id}
            title={note.title} 
            description={note.description} 
            isTask={false} 
            environment_id={currentEnvironmentID}
            positionX={note.positionX} 
            positionY={note.positionY} 
          />
        )}
        {tasks.length > 0 && tasks.map(task =>
          <Note 
            key={task.id}
            id={task.id}
            title={task.title} 
            items={task.task_list_items}
            isTask={true}
            environment_id={currentEnvironmentID}
            positionX={task.positionX} 
            positionY={task.positionY}
          />
        )}
        {optionMenu.length > 0 && optionMenu.map(menu =>
          <OptionMenu
            key={1}
            positionX={menu.positionX} 
            positionY={menu.positionY} 
            createNote={createNote} 
            createList={createList} 
          />
        )}
      </div>
    </>
  )
}
