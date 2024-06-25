import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Ensure you are using react-router-dom for navigation

interface Label {
  id: number;
  text: string;
}

const UploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [aiLabels, setAiLabels] = useState<Label[]>([]);
  const [customLabels, setCustomLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [labelInput, setLabelInput] = useState('');
  const [showCustomLabel, setShowCustomLabel] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  const [imageId, setImageId] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png' || selectedFile.type === 'image/jpg')) {
      setFile(selectedFile);
    } else {
      alert('Please select a jpeg, jpg, or png file.');
    }
  };

  const handleGenerateLabels = async () => {
    if (!file) {
      alert('No file uploaded.');
      return;
    }

    setLoading(true);
    setShowGenerateButton(false); // Hide the button after clicking

    const formData = new FormData();
    formData.append('imagef', file);
    formData.append('filename', file.name);

    try {
      const response = await fetch('https://nre8g0zfrc.execute-api.us-east-1.amazonaws.com/dev/upload/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          "x-amazon-apigateway-binary-media-types": "multipart/form-data"
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Response from server:', result);

      // Process the labels from the response
      const labels = result.labels || [];
      setImageId(result.image_id);
      setAiLabels(labels.map((text: string, index: number) => ({ id: index, text })));
    } catch (error) {
      console.error('There was an error!', error);
    }

    setLoading(false);
    setShowCustomLabel(true);
  };

  const handleCustomLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelInput(event.target.value);
  };

  const addCustomLabel = () => {
    if (labelInput.trim() !== '') {
      setCustomLabels([...customLabels, { id: Date.now(), text: labelInput }]);
      setLabelInput('');
    }
  };

  const removeLabel = (id: number, type: 'ai' | 'custom') => {
    if (type === 'ai') {
      setAiLabels(aiLabels.filter(label => label.id !== id));
    } else {
      setCustomLabels(customLabels.filter(label => label.id !== id));
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload a file.');
      return;
    }

    const finalLabels = [...aiLabels, ...customLabels].map(label => label.text);
    const requestBody = {
      image_id: `${imageId}`, // Replace with the actual image_id if available
      final_labels: finalLabels
    };

    try {
      const response = await axios.post('https://nre8g0zfrc.execute-api.us-east-1.amazonaws.com/dev/upload2', requestBody);
      if (response.status === 200) {
        navigate('/search');
      } else {
        console.error('Error:', response);
        alert('An error occurred while submitting the data.');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('An error occurred while submitting the data.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium text-text">
            Upload Image
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg"
            className="mt-1 p-2 w-full bg-background border border-secondary rounded focus:outline-none focus:border-primary"
          />
        </div>
        {showGenerateButton && (
          <button
            onClick={handleGenerateLabels}
            className={`w-full py-2 px-4 mb-4 bg-primary text-text rounded focus:outline-none focus:bg-secondary ${
              !file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'
            }`}
            disabled={!file} // Disable the button if no file is uploaded
          >
            {loading ? 'Generating Labels...' : 'Get AI Generated Labels'}
          </button>
        )}
        {loading && <div className="text-center">Loading...</div>}
        {showCustomLabel && !loading && (
          <div className="mb-4">
            <label htmlFor="custom-label" className="block text-sm font-medium text-text">
              Custom Label
            </label>
            <input
              type="text"
              id="custom-label"
              value={labelInput}
              onChange={handleCustomLabelChange}
              className="mt-1 p-2 w-full bg-background border border-secondary rounded focus:outline-none focus:border-primary"
              placeholder="Enter custom label..."
            />
            <button
              onClick={addCustomLabel}
              className="mt-2 w-full py-2 px-4 bg-primary text-text rounded hover:bg-secondary focus:outline-none focus:bg-secondary"
            >
              Add Custom Label
            </button>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text">
            Labels
          </label>
          <div className="flex flex-wrap mt-2">
            {[...aiLabels, ...customLabels].map(label => (
              <div key={label.id} className="m-1 px-2 py-1 bg-secondary text-background rounded-full flex items-center">
                <span className="mr-2">{label.text}</span>
                <button
                  onClick={() => removeLabel(label.id, aiLabels.includes(label) ? 'ai' : 'custom')}
                  className="text-text bg-transparent hover:text-background hover:bg-text rounded-full w-4 h-4 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-primary text-text rounded hover:bg-secondary focus:outline-none focus:bg-secondary"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadComponent;
