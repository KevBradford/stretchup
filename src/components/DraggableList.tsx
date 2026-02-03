import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface DraggableListProps<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (info: { item: T; index: number; isDragging: boolean }) => React.ReactElement;
  onReorder: (data: T[]) => void;
}

export function DraggableList<T>({
  data,
  keyExtractor,
  renderItem,
  onReorder,
}: DraggableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<number | null>(null);
  const overIndexRef = useRef<number | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const handleDragStart = useCallback((index: number) => {
    dragNodeRef.current = index;
    setDragIndex(index);
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    if (dragNodeRef.current === null) return;
    if (dragNodeRef.current !== index) {
      overIndexRef.current = index;
      setOverIndex(index);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    const from = dragNodeRef.current;
    const to = overIndexRef.current;
    if (from !== null && to !== null && from !== to) {
      const reordered = [...dataRef.current];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      onReorder(reordered);
    }
    dragNodeRef.current = null;
    overIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }, [onReorder]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <View>
        {data.map((item, index) => (
          <View key={keyExtractor(item)}>
            {renderItem({ item, index, isDragging: false })}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View>
      {data.map((item, index) => {
        const isDragging = dragIndex === index;
        const isOver = overIndex === index;

        return (
          <div
            key={keyExtractor(item)}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver as unknown as React.DragEventHandler<HTMLDivElement>}
            style={{
              opacity: isDragging ? 0.5 : 1,
              borderTop: isOver && dragIndex !== null && dragIndex > index ? '2px solid #4A90D9' : 'none',
              borderBottom: isOver && dragIndex !== null && dragIndex < index ? '2px solid #4A90D9' : 'none',
              cursor: 'grab',
              transition: 'border 0.1s ease',
            }}
          >
            {renderItem({ item, index, isDragging })}
          </div>
        );
      })}
    </View>
  );
}
