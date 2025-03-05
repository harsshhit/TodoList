import React, {memo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  timestamp: string;
}

interface TodoItemProps {
  item: Todo;
  isDarkMode: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onStartEdit: (id: number, text: string) => void;
  isEditing: boolean;
  editText: string;
  onEditChange: (text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onShowDetails: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  item,
  isDarkMode,
  onToggle,
  onDelete,
  onStartEdit,
  isEditing,
  editText,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onShowDetails,
}) => {
  const themeStyles = {
    backgroundColor: isDarkMode
      ? 'rgba(50, 50, 50, 0.9)'
      : 'rgba(255, 255, 255, 0.9)',
    textColor: isDarkMode ? '#fff' : '#333',
  };

  const renderEditMode = () => (
    <View style={styles.editContainer}>
      <TextInput
        style={[styles.editInput, {color: themeStyles.textColor}]}
        value={editText}
        onChangeText={onEditChange}
        autoFocus
        selectionColor="#007AFF"
      />
      <View style={styles.editButtons}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSaveEdit}
          activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>✓</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancelEdit}
          activeOpacity={0.7}>
          <Text style={styles.cancelButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderViewMode = () => (
    <>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(item.id)}
        activeOpacity={0.7}>
        {item.completed ? (
          <View style={styles.checkedBox}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        ) : (
          <View style={styles.uncheckedBox} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.todoTextContainer}
        onPress={() => onShowDetails(item)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.todoText,
            {color: themeStyles.textColor},
            item.completed && styles.completedTodo,
          ]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onStartEdit(item.id, item.text)}
          activeOpacity={0.7}>
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
          activeOpacity={0.7}>
          <Text style={styles.deleteButtonText}>✖</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Animated.View
      style={[
        styles.todoItem,
        {
          backgroundColor: themeStyles.backgroundColor,
          opacity: item.completed ? 0.7 : 1,
        },
      ]}>
      {isEditing ? renderEditMode() : renderViewMode()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  checkbox: {
    marginRight: 14,
  },
  uncheckedBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  checkedBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{scale: 1.05}],
  },
  checkmark: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  todoTextContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  todoText: {
    fontSize: 17,
    letterSpacing: 0.3,
    fontWeight: '500',
    lineHeight: 22,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(90, 200, 250, 0.15)',
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editInput: {
    flex: 1,
    height: 44,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default memo(TodoItem);
