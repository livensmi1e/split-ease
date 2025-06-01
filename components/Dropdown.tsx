import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  SelectIcon,
} from './ui/select/index'; // Giả sử đường dẫn đến file index.tsx
import { ChevronDownIcon } from "@/components/ui/icon";// Component tùy chỉnh cho biểu tượng tiền tệ
import Ionicons from '@expo/vector-icons/build/Ionicons';


const CurrencyIcon = () => (
  <View className="w-12 h-12 bg-background-50 rounded-xl items-center justify-center">
        <Ionicons name="card" size={24} color="#0F4CC2" />
    </View>
);

interface CurrencyDropdownProps {
  items: { label: string; value: string }[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'outline' | 'underlined' | 'rounded';
  onValueChange?: (value: string) => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  items,
  placeholder = 'Currency',
  size = 'md',
  variant = 'outline',
  onValueChange,
}) => {
  const [selectedValue, setSelectedValue] = useState('VND'); // Giá trị mặc định là VND

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <View>
      <Select onValueChange={handleValueChange}>
        <SelectTrigger
          size={size}
          variant={variant}
          className="ml-2 bg-gray-100 border-gray-300 rounded-md"
        >
          <SelectInput
            placeholder={placeholder}
            value={selectedValue}
            className="text-black"
          />
          <SelectIcon as={ChevronDownIcon} className="ml-2 mr-2" />
        </SelectTrigger>
      </Select>

      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} label={item.label} value={item.value} />
          ))}
        </SelectContent>
      </SelectPortal>
    </View>
  );
};

export default CurrencyDropdown;