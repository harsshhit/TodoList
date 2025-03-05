import React, {memo, useCallback} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Keyboard,
  AccessibilityProps,
} from 'react-native';

interface TodoInputProps {
  isDarkMode: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

const TodoInput: React.FC<TodoInputProps> = memo(
  ({
    isDarkMode,
    value,
    onChangeText,
    onSubmit,
    placeholder = 'Add a new todo',
  }) => {
    // Handle text submission with keyboard
    const handleSubmitEditing = useCallback(() => {
      if (value.trim()) {
        onSubmit();
      }
    }, [value, onSubmit]);

    // Handle button press with validation
    const handleAddPress = useCallback(() => {
      if (value.trim()) {
        onSubmit();
      } else {
        // Refocus the input if empty
        Keyboard.dismiss();
        setTimeout(() => inputRef?.current?.focus(), 100);
      }
    }, [value, onSubmit]);

    // Input reference for focus management
    const inputRef = React.useRef<TextInput>(null);

    // Accessibility props
    const addButtonAccessibility: AccessibilityProps = {
      accessible: true,
      accessibilityLabel: 'Add todo',
      accessibilityHint: 'Adds the new todo to your list',
      accessibilityRole: 'button',
    };

    return (
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDarkMode
              ? 'rgba(45, 45, 50, 0.8)'
              : 'rgba(255, 255, 255, 0.95)',
            borderColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.08)',
          },
        ]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: isDarkMode ? '#fff' : '#333',
              backgroundColor: isDarkMode
                ? 'rgba(30, 30, 35, 0.6)'
                : 'rgba(245, 245, 250, 0.8)',
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={
            isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'
          }
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="done"
          blurOnSubmit={false}
          autoCapitalize="sentences"
          autoComplete="off"
          autoCorrect={true}
          selectionColor={isDarkMode ? '#64D2FF' : '#007AFF'}
          maxLength={100}
          accessible={true}
          accessibilityLabel="Todo input"
          accessibilityHint="Type your new todo item here"
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: value.trim()
                ? '#007AFF'
                : isDarkMode
                ? '#555'
                : '#ccc',
              transform: [{scale: value.trim() ? 1 : 0.95}],
            },
          ]}
          onPress={handleAddPress}
          activeOpacity={0.7}
          disabled={!value.trim()}
          {...addButtonAccessibility}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

// Shadow styles extracted for reuse
const containerShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  android: {
    elevation: 6,
  },
});

const buttonShadow = Platform.select({
  ios: {
    shadowColor: '#007AFF',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  android: {
    elevation: 4,
  },
});

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    ...containerShadow,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 0,
    borderRadius: 16,
    paddingHorizontal: 18,
    marginRight: 12,
    fontSize: 17,
    fontWeight: '400',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...buttonShadow,
    overflow: 'hidden',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 32,
    marginTop: -2,
  },
});

export default TodoInput;
