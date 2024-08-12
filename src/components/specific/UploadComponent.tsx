import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config.js';

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
  const [imageId, setImageId] = useState<string | null>(null);
  const [isLabelsGenerated, setIsLabelsGenerated] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/png' || selectedFile.type === 'image/jpg')) {
      setFile(selectedFile);
    } else {
      toast.error('Please select a jpeg, jpg, or png file.');
    }
  };

  const handleGenerateLabels = async () => {
    if (!file) {
      toast.error('No file uploaded.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('imagef', file);
    formData.append('filename', file.name);

    const token = localStorage.getItem('idToken');

    try {
      const response = await axios.post(`${config.API_BASE_URL}/upload`, formData, {
        headers: {
          'auth-token': token ? token : '',
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'x-amazon-apigateway-binary-media-types': 'multipart/form-data',
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!response) {
        throw new Error('Network response was not ok');
      }

      const result = await response.data;
      console.log('Response from server:', result);

      const labels = result.labels || [];
      setImageId(result.image_id);
      setAiLabels(labels.map((text: string, index: number) => ({ id: index, text })));
      setIsLabelsGenerated(true); // Toggle the button role
      toast.success('Labels generated successfully');
    } catch (error) {
      console.error('There was an error!', error);
      toast.error('An error occurred while generating labels.');
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
      toast.error('Please upload a file.');
      return;
    }

    const finalLabels = [...aiLabels, ...customLabels].map(label => label.text);
    const requestBody = {
      image_id: `${imageId}`,
      final_labels: finalLabels
    };

    const token = localStorage.getItem('idToken');

    try {
      const response = await axios.post(`${config.API_BASE_URL}/upload2`, requestBody, {
        headers: {
          'auth-token': token ? token : ''
        }
      });
      if (response.status === 200) {
        toast.success('Data submitted successfully');
        navigate('/search');
      } else {
        console.error('Error:', response);
        toast.error('An error occurred while submitting the data.');
      }
    } catch (error) {
      console.error('There was an error!', error);
      toast.error('An error occurred while submitting the data.');
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

          {isLabelsGenerated ? (  <label className="block text-sm font-medium text-text">
            Labels
          </label>) : null}
        
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
          <button
          onClick={isLabelsGenerated ? handleSubmit : handleGenerateLabels}
          className={`w-full py-2 px-4 mb-4 bg-primary text-text rounded focus:outline-none focus:bg-secondary ${
            !file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'
          }`}
          disabled={!file}
        >
          {loading ? 'Processing...' : isLabelsGenerated ? 'Upload' : 'Get AI Generated Labels'}
        </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadComponent;