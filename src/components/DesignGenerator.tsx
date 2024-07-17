'use client';

import React, { useState } from 'react';
import DesignEditor from './DesignEditor';

const DesignGenerator = () => {
  const [inputs, setInputs] = useState({ purpose: '', audience: '', style: '' });
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const generateDesign = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'デザインの生成に失敗しました');
      }
      setGeneratedDesign(data.design);
    } catch (error) {
      console.error('Error generating design:', error);
      alert(error instanceof Error ? error.message : 'エラーが発生しました。デザインの生成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="space-y-2">
        <input
          name="purpose"
          placeholder="Webサイトの目的"
          value={inputs.purpose}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="audience"
          placeholder="ターゲットオーディエンス"
          value={inputs.audience}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="style"
          placeholder="好みのスタイル"
          value={inputs.style}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={generateDesign}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'デザイン生成中...' : 'デザイン生成'}
      </button>
      
      {generatedDesign && !isEditMode && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">生成されたデザイン</h2>
          <div className="border rounded-lg shadow-lg overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: generatedDesign }} />
          </div>
          <button
            onClick={() => setIsEditMode(true)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            編集
          </button>
        </div>
      )}
      
      {isEditMode && (
        <DesignEditor 
          initialDesign={generatedDesign!} 
          onEditComplete={(editedDesign) => {
            setGeneratedDesign(editedDesign);
            setIsEditMode(false);
          }} 
        />
      )}
    </div>
  );
};

export default DesignGenerator;