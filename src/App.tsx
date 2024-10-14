import React, { useState } from 'react';
import { Plus, Folder, Briefcase, Book, Archive, Link, Type, File, Image, X, Calendar, CheckSquare, Trash2 } from 'lucide-react';
import { ParaItem, ParaState, Artifact, ArtifactType, ParaItemStatus, Task } from './types';

const initialState: ParaState = {
  projects: [],
  areas: [],
  resources: [],
  archives: [],
};

const App: React.FC = () => {
  const [paraState, setParaState] = useState<ParaState>(initialState);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ParaItem['category']>('projects');
  const [editingItem, setEditingItem] = useState<ParaItem | null>(null);
  const [newArtifact, setNewArtifact] = useState({ type: 'link' as ArtifactType, content: '' });
  const [activeTab, setActiveTab] = useState<ParaItem['category']>('projects');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addItem = () => {
    if (newItemTitle.trim() === '') return;

    const newItem: ParaItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      description: '',
      category: newItemCategory,
      artifacts: [],
      tasks: [],
      endDate: null,
      status: 'backlog',
    };

    setParaState((prevState) => ({
      ...prevState,
      [newItemCategory]: [...prevState[newItemCategory], newItem],
    }));

    setNewItemTitle('');
  };

  const startEditing = (item: ParaItem) => {
    setEditingItem({ ...item });
  };

  const saveEditingItem = () => {
    if (!editingItem) return;

    setParaState((prevState) => {
      const updatedState = { ...prevState };
      
      // Remove the item from its original category
      const originalCategory = prevState[editingItem.category].find(item => item.id === editingItem.id)?.category;
      if (originalCategory) {
        updatedState[originalCategory] = updatedState[originalCategory].filter(
          (item) => item.id !== editingItem.id
        );
      }

      // Add the item to its new category
      updatedState[editingItem.category].push(editingItem);

      return updatedState;
    });

    setEditingItem(null);
  };

  const deleteItem = () => {
    if (!editingItem) return;

    setParaState((prevState) => ({
      ...prevState,
      [editingItem.category]: prevState[editingItem.category].filter(
        (item) => item.id !== editingItem.id
      ),
    }));

    setEditingItem(null);
  };

  const addArtifact = () => {
    if (!editingItem || newArtifact.content.trim() === '') return;

    const artifact: Artifact = {
      id: Date.now().toString(),
      type: newArtifact.type,
      content: newArtifact.content,
      index: editingItem.artifacts.length,
    };

    setEditingItem({
      ...editingItem,
      artifacts: [...editingItem.artifacts, artifact],
    });

    setNewArtifact({ type: 'link', content: '' });
  };

  const addTask = () => {
    if (!editingItem || newTaskTitle.trim() === '') return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      endDate: null,
    };

    setEditingItem({
      ...editingItem,
      tasks: [...editingItem.tasks, newTask],
    });

    setNewTaskTitle('');
  };

  const toggleTaskCompletion = (taskId: string) => {
    if (!editingItem) return;

    setEditingItem({
      ...editingItem,
      tasks: editingItem.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              endDate: !task.completed ? new Date().toISOString().split('T')[0] : null,
            }
          : task
      ),
    });
  };

  const deleteTask = (taskId: string) => {
    if (!editingItem) return;

    setEditingItem({
      ...editingItem,
      tasks: editingItem.tasks.filter((task) => task.id !== taskId),
    });
  };

  const renderArtifact = (artifact: Artifact) => {
    switch (artifact.type) {
      case 'link':
        return (
          <a href={artifact.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            <Link size={16} className="inline mr-1" />{artifact.index + 1}. {artifact.content}
          </a>
        );
      case 'text':
        return <p><Type size={16} className="inline mr-1" />{artifact.index + 1}. {artifact.content}</p>;
      case 'file':
        return <p><File size={16} className="inline mr-1" />{artifact.index + 1}. {artifact.content}</p>;
      case 'image':
        return (
          <div>
            <Image size={16} className="inline mr-1" />{artifact.index + 1}.
            <img src={artifact.content} alt="Artifact" className="max-w-full h-auto" />
          </div>
        );
    }
  };

  const renderCategoryIcon = (category: ParaItem['category']) => {
    switch (category) {
      case 'projects':
        return <Briefcase size={24} />;
      case 'areas':
        return <Folder size={24} />;
      case 'resources':
        return <Book size={24} />;
      case 'archives':
        return <Archive size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">PARA Project Manager</h1>
      
      <div className="mb-8 flex justify-center space-x-4">
        {(['projects', 'areas', 'resources', 'archives'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === category ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {renderCategoryIcon(category)}
            <span className="ml-2 capitalize">{category}</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Enter item title"
            className="flex-grow px-4 py-2 border rounded-lg"
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as ParaItem['category'])}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="projects">Projects</option>
            <option value="areas">Areas</option>
            <option value="resources">Resources</option>
            <option value="archives">Archives</option>
          </select>
          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paraState[activeTab].map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <button
              onClick={() => startEditing(item)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-5/6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Edit Item</h2>
              <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <input
              type="text"
              value={editingItem.title}
              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <textarea
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg mb-4 h-32"
            />
            <div className="flex mb-4">
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as ParaItem['category'] })}
                className="px-4 py-2 border rounded-lg mr-4"
              >
                <option value="projects">Projects</option>
                <option value="areas">Areas</option>
                <option value="resources">Resources</option>
                <option value="archives">Archives</option>
              </select>
              <select
                value={editingItem.status}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as ParaItemStatus })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="backlog">Backlog</option>
                <option value="ready">Ready</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex">
              <div className="w-1/2 pr-4">
                <h3 className="font-semibold mb-2">Tasks:</h3>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="New task"
                    className="flex-grow px-4 py-2 border rounded-lg mr-2"
                  />
                  <button
                    onClick={addTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <ul>
                  {editingItem.tasks.map((task) => (
                    <li key={task.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="mr-2"
                      />
                      <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                      {task.endDate && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Completed: {task.endDate})
                        </span>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-1/2 pl-4">
                <h3 className="font-semibold mb-2">Artifacts:</h3>
                <div className="flex mb-2">
                  <select
                    value={newArtifact.type}
                    onChange={(e) => setNewArtifact({ ...newArtifact, type: e.target.value as ArtifactType })}
                    className="px-4 py-2 border rounded-lg mr-2"
                  >
                    <option value="link">Link</option>
                    <option value="text">Text</option>
                    <option value="file">File</option>
                    <option value="image">Image</option>
                  </select>
                  <input
                    type="text"
                    value={newArtifact.content}
                    onChange={(e) => setNewArtifact({ ...newArtifact, content: e.target.value })}
                    placeholder="Artifact content"
                    className="flex-grow px-4 py-2 border rounded-lg mr-2"
                  />
                  <button
                    onClick={addArtifact}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <ul>
                  {editingItem.artifacts.map((artifact) => (
                    <li key={artifact.id} className="mb-2">
                      {renderArtifact(artifact)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={deleteItem}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-4"
              >
                Delete
              </button>
              <button
                onClick={saveEditingItem}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;