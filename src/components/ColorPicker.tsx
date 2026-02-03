import { View, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = [
  '#4A90D9', '#E74C3C', '#2ECC71', '#F39C12',
  '#9B59B6', '#1ABC9C', '#E67E22', '#3498DB',
  '#E91E63', '#00BCD4', '#8BC34A', '#FF5722',
];

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.swatch,
            { backgroundColor: color },
            selectedColor === color && styles.selected,
          ]}
          onPress={() => onSelect(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 8,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#333',
  },
});
