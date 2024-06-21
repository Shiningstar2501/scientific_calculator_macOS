import React from 'react'
import Key from '../key/Key'
import './keypad.css'

const Keypad = ({
  keys: rows,
  handleClick,
  currentOperation,
  trigUnit,
  memory
}) => {

  return (
    <section className="Keypad">
      {rows.map((keys, index) => (
        <div className="Keypad-row" key={`row${index}`}>
          {keys.map(keyProps => (
            <Key
              key={keyProps.id}
              handleClick={handleClick}
              active={
                currentOperation === keyProps.id ||
                ('memoryRecall' === keyProps.id && memory !== null)
              }
              trigUnit={trigUnit}
              {...keyProps}
            />

          ))}
        </div>
      ))}
    </section>
  )
}


export default Keypad
