'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  COMPONENT: 'component',
};

interface DraggableComponentProps {
  id: string;
  children: ReactNode;
  onMove: (dragId: string, hoverId: string) => void;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ id, children, onMove }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemTypes.COMPONENT,
    hover(item: { id: string }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragId = item.id;
      const hoverId = id;

      if (dragId === hoverId) {
        return;
      }

      onMove(dragId, hoverId);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COMPONENT,
    item: () => ({ id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      {children}
    </div>
  );
};

interface DesignEditorProps {
  initialDesign: string;
  onEditComplete: (editedDesign: string) => void;
}

const DesignEditor: React.FC<DesignEditorProps> = ({ initialDesign, onEditComplete }) => {
  const [components, setComponents] = useState<Array<{ id: string; content: string }>>([]);

  useEffect(() => {
    if (initialDesign) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(initialDesign, 'text/html');
      const elements = Array.from(doc.body.children);
      setComponents(elements.map((el, index) => ({
        id: `component-${index}`,
        content: el.outerHTML,
      })));
    }
  }, [initialDesign]);

  const moveComponent = (dragId: string, hoverId: string) => {
    setComponents((prevComponents) => {
      const dragIndex = prevComponents.findIndex((c) => c.id === dragId);
      const hoverIndex = prevComponents.findIndex((c) => c.id === hoverId);
      const newComponents = [...prevComponents];
      const [removed] = newComponents.splice(dragIndex, 1);
      newComponents.splice(hoverIndex, 0, removed);
      return newComponents;
    });
  };

  const handleContentEdit = (id: string, newContent: string) => {
    setComponents((prevComponents) =>
      prevComponents.map((comp) =>
        comp.id === id ? { ...comp, content: newContent } : comp
      )
    );
  };

  const handleEditComplete = () => {
    const editedDesign = components.map((comp) => comp.content).join('');
    onEditComplete(editedDesign);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="design-editor">
        <div className="border rounded-lg shadow-lg p-4 min-h-[400px]">
          {components.map((component) => (
            <DraggableComponent key={component.id} id={component.id} onMove={moveComponent}>
              <div
                contentEditable
                dangerouslySetInnerHTML={{ __html: component.content }}
                onBlur={(e) => handleContentEdit(component.id, e.currentTarget.innerHTML)}
              />
            </DraggableComponent>
          ))}
        </div>
        <button
          onClick={handleEditComplete}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          編集完了
        </button>
      </div>
    </DndProvider>
  );
};

export default DesignEditor;