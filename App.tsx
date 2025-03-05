import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Appearance} from 'react-native';
import {
  View,
  Text,
  StatusBar,
  useColorScheme,
  StyleSheet,
  FlatList,
  Platform,
  Keyboard,
  Alert,
  Animated,
  Modal,
  TouchableOpacity,
  Switch,
} from 'react-native';
import TodoItem from './src/components/TodoItem';
import TodoInput from './src/components/TodoInput';

const App = () => {
  const systemTheme = useColorScheme() === 'dark';
  const [themeOverride, setThemeOverride] = useState(null);
  const isDarkMode = themeOverride ?? systemTheme;
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  // Theme colors
  const theme = useMemo(
    () => ({
      background: isDarkMode
        ? 'rgba(25, 25, 35, 0.98)'
        : 'rgba(245, 245, 250, 0.98)',
      text: isDarkMode ? '#fff' : '#000',
      secondaryText: isDarkMode ? '#ccc' : '#666',
      tertiaryText: isDarkMode ? '#999' : '#999',
      modalBackground: isDarkMode
        ? 'rgba(45, 45, 55, 0.98)'
        : 'rgba(255, 255, 255, 0.98)',
      primary: '#007AFF',
      success: 'rgba(52, 199, 89, 0.8)',
      danger: 'rgba(255, 59, 48, 0.9)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
    }),
    [isDarkMode],
  );

  // Load sample todos when app first launches
  useEffect(() => {
    setTodos([
      {
        id: 1,
        text: 'Add new tasks to my todo list',
        completed: true,
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        text: 'Mark important tasks as complete',
        completed: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: 3,
        text: 'Delete finished tasks',
        completed: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: 4,
        text: 'Edit task description',
        completed: false,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  // Animation when completing todos
  const animateTodo = useCallback(
    (id, completed) => {
      Animated.timing(fadeAnim, {
        toValue: completed ? 0.5 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [fadeAnim],
  );

  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      const newItem = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        timestamp: new Date().toISOString(),
      };

      setTodos(prevTodos => [newItem, ...prevTodos]);
      setNewTodo('');
      Keyboard.dismiss();
    }
  }, [newTodo]);

  const showTodoDetails = useCallback(todo => {
    setSelectedTodo(todo);
    setIsModalVisible(true);
  }, []);

  const hideTodoDetails = useCallback(() => {
    setSelectedTodo(null);
    setIsModalVisible(false);
  }, []);

  const toggleTodo = useCallback(
    id => {
      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (todo.id === id) {
            const newState = !todo.completed;
            animateTodo(id, newState);
            return {...todo, completed: newState};
          }
          return todo;
        }),
      );
    },
    [animateTodo],
  );

  const deleteTodo = useCallback(id => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        },
        style: 'destructive',
      },
    ]);
  }, []);

  const startEditing = useCallback((id, text) => {
    setEditingId(id);
    setEditText(text);
  }, []);

  const saveEdit = useCallback(() => {
    if (editText.trim()) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === editingId ? {...todo, text: editText.trim()} : todo,
        ),
      );
      setEditingId(null);
      setEditText('');
    }
  }, [editingId, editText]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditText('');
  }, []);

  const renderTodoModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={hideTodoDetails}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={hideTodoDetails}>
        <View
          style={[
            styles.modalContent,
            {backgroundColor: theme.modalBackground},
          ]}>
          {selectedTodo && (
            <>
              <Text style={[styles.modalTitle, {color: theme.text}]}>
                {selectedTodo.text}
              </Text>
              <Text style={[styles.modalDate, {color: theme.secondaryText}]}>
                Created: {new Date(selectedTodo.timestamp).toLocaleString()}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.editButton]}
                  onPress={() => {
                    hideTodoDetails();
                    startEditing(selectedTodo.id, selectedTodo.text);
                  }}>
                  <Text style={styles.modalButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={() => {
                    hideTodoDetails();
                    deleteTodo(selectedTodo.id);
                  }}>
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderThemeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isThemeModalVisible}
      onRequestClose={() => setIsThemeModalVisible(false)}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsThemeModalVisible(false)}>
        <View
          style={[
            styles.modalContent,
            {backgroundColor: theme.modalBackground},
          ]}>
          <Text style={[styles.modalTitle, {color: theme.text}]}>
            Theme Settings
          </Text>
          <View style={styles.themeOption}>
            <Text style={[styles.themeText, {color: theme.text}]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={value => setThemeOverride(value)}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isDarkMode ? '#007AFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          <Text style={[styles.themeDescription, {color: theme.secondaryText}]}>
            Toggle to manually set the theme. Clear the toggle to follow system
            settings.
          </Text>
          <TouchableOpacity
            style={[styles.resetButton, {backgroundColor: theme.primary}]}
            onPress={() => setThemeOverride(null)}>
            <Text style={styles.resetButtonText}>Reset to System Theme</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderItem = useCallback(
    ({item}) => (
      <TodoItem
        item={item}
        isDarkMode={isDarkMode}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onStartEdit={startEditing}
        isEditing={editingId === item.id}
        editText={editText}
        onEditChange={setEditText}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
        onShowDetails={showTodoDetails}
      />
    ),
    [
      isDarkMode,
      toggleTodo,
      deleteTodo,
      startEditing,
      showTodoDetails,
      editingId,
      editText,
      saveEdit,
      cancelEdit,
    ],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const emptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, {color: theme.tertiaryText}]}>
          No todos yet. Add one above!
        </Text>
      </View>
    ),
    [theme.tertiaryText],
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.headerContainer}>
        <Text style={[styles.title, {color: theme.text}]}>Todo List</Text>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setIsThemeModalVisible(true)}>
          <Text style={[styles.optionsButtonText, {color: theme.text}]}>⋮</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={emptyComponent}
      />
      {renderTodoModal()}
      {renderThemeModal()}

      <TodoInput
        isDarkMode={isDarkMode}
        value={newTodo}
        onChangeText={setNewTodo}
        onSubmit={addTodo}
      />
    </View>
  );
};

// Extracted and improved shadow styles
const shadowStyles = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  android: {
    elevation: 3,
  },
});

const modalShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  android: {
    elevation: 5,
  },
});

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 12,
    position: 'relative',
  },
  optionsButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  optionsButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 17,
    opacity: 0.7,
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 24,
    borderRadius: 20,
    ...modalShadow,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  modalDate: {
    fontSize: 15,
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    margin: 8,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  themeText: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  themeDescription: {
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  resetButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
});

export default App;
