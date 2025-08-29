import React, { useState } from 'react';
import axios from 'axios';

const AddProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    time_limit: 1,
    memory_limit: 256,
    difficulty: 'Easy',
    tags: '',
    authors: '',
    description: '',
    testcases: [{ input: '', output: '' }]
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestcaseChange = (index, e) => {
    const newTestcases = [...formData.testcases];
    newTestcases[index][e.target.name] = e.target.value;
    setFormData({ ...formData, testcases: newTestcases });
  };

  const addTestcase = () => {
    setFormData({ ...formData, testcases: [...formData.testcases, { input: '', output: '' }] });
  };

  const removeTestcase = (index) => {
    const newTestcases = [...formData.testcases];
    newTestcases.splice(index, 1);
    setFormData({ ...formData, testcases: newTestcases });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      authors: formData.authors.split(',').map(author => author.trim())
    };
    axios.post('/api/problems/add', data)
      .then(response => {
        setMessage(`Problem added successfully! Problem ID: ${response.data.problem_id}`);
      })
      .catch(error => {
        setMessage(`Error adding problem: ${error.response.data.error}`);
      });
  };

  return (
    <div>
      <h2>Add Problem</h2>
      <form onSubmit={handleSubmit}>
        {/* Add fields for all problem data */}
        <button type="submit">Add Problem</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProblem;