import React, { useEffect, useState } from 'react';
import { Offline, Online } from 'react-detect-offline';

const formStyle = { padding: '2rem 0rem' };
const inputStyle = { margin: '1rem 0rem' };

// a simple form with a first name, last name and submit button
const Form = ({ db }) => {
  const [names, setNames] = useState({ firstName: '', lastName: '' });
  useEffect(
    () => {
      // create store
      db.version(1).stores({ formData: 'id, value' });

      // perform a read/write transaction on the new store
      db.transaction('rw', db.formData, async () => {
        // get the first and last name from the data
        const dbFirstName = await db.formData.get('firstName');
        const dbLastName = await db.formData.get('lastName');

        // if the first or last name fields have not ben added, add them
        if (!dbFirstName) await db.formData({ id: 'firstName', value: '' });
        if (!dbLastName) await db.formData({ id: 'lastName', value: '' });
        // set initial values
        setNames({
          firstName: dbFirstName ? dbFirstName.value : '',
          lastName: dbLastName ? dbLastName.value : '',
        });
      }).catch(e => {
        // log errors
        console.log('errrrorrrr', e.stack || e);
      });

      // close the database connection if form is unmounted or the database connection changes

      return () => db.close();
    },
    // run effect whenever the database connection changes
    [db]
  );
  // sets the name in the store and in the state hook
  const setName = id => value => {
    console.log(db);
    // update the store
    db.formData.put({ id, value });

    // update the state hook

    setNames(prevNames => ({ ...prevNames, [id]: value }));
  };

  // partial application to make on change handler easier to deal with
  const handleSetName = id => e => setName(id)(e.target.value);

  // when the form is submitted, prevent the default action
  // which reloads the page and reset the first and last name
  // in both the store and in the state hook
  const handleSubmit = e => {
    e.preventDefault();
    setName('firstName')('');
    setName('lastName')('');
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <span>First name:</span>
      <br />
      <input
        style={inputStyle}
        type="text"
        name="firstName"
        value={names.firstName}
        onChange={handleSetName('firstName')}
      />
      <br />
      <span>Last name:</span>
      <br />
      <input
        style={inputStyle}
        type="text"
        name="lastName"
        value={names.lastName}
        onChange={handleSetName('lastName')}
      />
      <br />
      {/* handle whether or not the user is offline*/}
      <Online>
        <input type="submit" value="Submit" />
      </Online>
      <Offline>You are currently offline !</Offline>
    </form>
  );
};

export default Form;
