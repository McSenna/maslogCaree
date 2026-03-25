import { Text } from "@react-navigation/elements";  
import { View, Modal, KeyboardAvoidingView, Platform, } from "react-native";
import api from '@/services/api';
import { AppointmentProps } from "@/hooks/props";


const AppointmentModal = ({ visible, onClose, openAppointment }: AppointmentProps) => {
    if(!visible) return null;

    const appointment = ({
        name,
        age,
        gender,
        date,
        time,
        category,
        description
    }) => {
        return {
            name,
            age,
            gender,
            date,
            time,
            category,
            description
        };
    };


    const handleSubmit = async () => {
        const response = await api.get(`/apppointments`);
        console.log(response)
    }


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20 }>

        <View className="fixed-1">
           <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} className="">
                <Text></Text>
           </Modal>
        </View>

        </KeyboardAvoidingView>
    )

    

}

export default AppointmentModal;

