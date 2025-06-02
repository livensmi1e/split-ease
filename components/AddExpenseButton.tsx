import { FontAwesome5 } from "@expo/vector-icons";
import { Button, ButtonText } from "./ui/button";
interface AddExpenseButtonProps {
    onPress: () => void;
}

const AddExpenseButton = ( { onPress}: AddExpenseButtonProps ) => {
  return (
    <Button action="primary" size="md" className="rounded-full opacity-80" onPress={onPress}>
        <FontAwesome5 name="receipt" size={16} color="white" />
        {/* <EditIcon></EditIcon> */}
      <ButtonText>Add Expense</ButtonText>
    </Button>
  );
};

export default AddExpenseButton;
