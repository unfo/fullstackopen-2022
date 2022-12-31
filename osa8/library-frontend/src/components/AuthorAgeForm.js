import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { ALL_AUTHORS, EDIT_BORN_YEAR } from "../queries";

const AuthorAgeForm = ({ authors, setErrorMessage, loggedIn }) => {
  const noAgeAuthors = authors.filter((a) => a.born === null);

  const [name, setName] = useState("");
  const [born, setBorn] = useState();
  const [editBornYear] = useMutation(EDIT_BORN_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.warn(error);
      setErrorMessage(
        `Adding author birth year failed due to the error: ${error.message}`
      );
    },
  });

  if (noAgeAuthors.length === 0) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (name === "" || !(born > 0)) {
      window.alert("Choose author and insert year");
      return;
    }
    editBornYear({ variables: { name, born } });
    setBorn("");
    setName("");
  };

  if (!loggedIn) {
    return (
      <>
        <h2>Set birth year</h2>
        <div>You need to login to add data</div>
      </>
    );
  }

  return (
    <>
      <h2>Set birth year</h2>
      <Form onSubmit={submit}>
        <InputGroup>
          <Form.Select onChange={(event) => setName(event.target.value)}>
            <option value="">-Select author-</option>

            {noAgeAuthors.map((a) => {
              const key = `option_${a.id}`;
              return (
                <option key={key} value={a.name}>
                  {a.name}
                </option>
              );
            })}
          </Form.Select>
          <Form.Control
            placeholder="Year of birth"
            value={born}
            onChange={(event) => setBorn(parseInt(event.target.value))}
          ></Form.Control>
          {/* 
            TODO: BORN IS NOT RESET because value is different than the parseInt value
            8.12 almost ready to be submitted
          */}
          <Button onClick={submit}>Set year</Button>
        </InputGroup>
      </Form>
    </>
  );
};

export default AuthorAgeForm;
