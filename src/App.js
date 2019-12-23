import React, { useState } from 'react';
import Dexie from 'dexie';
import Form from './Form';

const App = () => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ margin: '2rem auto', width: '200px' }}>
      <button onClick={() => setOpen(!open)}>
        {`${open ? 'close' : 'open'}`}
      </button>
      {open && <Form db={new Dexie('FormDatabase')} />}
    </div>
  );
};

export default App;
