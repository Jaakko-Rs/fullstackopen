import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)
const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ personsToShow, deletePerson }) => {
    const deleteButtonStyle = {
        marginLeft: 8,
        padding: '4px 10px',
        fontSize: 14,
        borderRadius: 6,
        border: '1px solid #999',
        cursor: 'pointer'
    }
    return (
        <div>
            {personsToShow.map(person => (
                <p key={person.name}>
                    {person.name} {person.number}
                    <button
                        style={deleteButtonStyle}
                        onClick={() => deletePerson(person.id, person.name)}
                    >
                        delete
                    </button>
                </p>
            ))}
        </div>
    )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

    const addPerson = (event) => {
        event.preventDefault()

        const existingPerson = persons.find(person => person.name === newName)
        if (existingPerson) {
            const ok = window.confirm(
                `${newName} is already added to the phonebook, do you want to replace the old number with a new one?`
            )

            if (!ok) {
                return
            }
            const changedPerson = {
                ...existingPerson,
                number: newNumber
            }
            personService
                .update(existingPerson.id, changedPerson)
                .then(returnedPerson => {
                    setPersons(
                        persons.map(person =>
                            person.id !== existingPerson.id ? person : returnedPerson
                        )
                    )
                    setMessage({ text: `Updated ${returnedPerson.name}`, type: 'notification' })
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
                    setNewName('')
                    setNewNumber('')
                })
                .catch(() => {
                    setMessage({
                        text: `Information of ${existingPerson.name} has already been removed from server`,
                        type: 'error'
                    })
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
                    setPersons(persons.filter(person => person.id !== existingPerson.id))
                })
            return
        }
        const personObject = {
            name: newName,
            number: newNumber
        }
        personService
            .create(personObject)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                setMessage({ text: `Added ${returnedPerson.name}`, type: 'notification' })
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
                setNewName('')
                setNewNumber('')
            })
    }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage({ text: `Deleted ${name}`, type: 'notification' })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App